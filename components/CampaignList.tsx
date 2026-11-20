"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { api } from "@/lib/api";
import { CampaignCard } from "./CampaignCard";
import { CampaignListSkeleton } from "./CampaignCardSkeleton";
import { CampaignFilter, FilterState } from "./CampaignFilter";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useSocketEvents } from "@/hooks/useSocket";
import { useCampaignProgressBatch } from "@/hooks/useCharityCore";
import { ADDRESSES, CHARITY_CORE_ABI } from "@/lib/contracts";
import { motion } from "framer-motion";
import { ArrowRight, WarningCircle } from "@phosphor-icons/react";

/** Metadata from API; raised amounts from on-chain batch reads (see CampaignCard). */
function dedupeByCampaignId<T extends { campaignId: number }>(rows: T[]): T[] {
  const seen = new Set<number>();
  return rows.filter((row) => {
    const id = Number(row.campaignId);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

async function fetchAllCampaigns() {
  let page = 1;
  let pages = 1;
  const all: Awaited<ReturnType<typeof api.getCampaigns>>["campaigns"] = [];

  while (page <= pages) {
    const data = await api.getCampaigns(page, 100);
    if (!data || data.error) throw new Error(String(data?.error ?? "campaigns fetch failed"));
    all.push(...(data.campaigns ?? []));
    pages = data.pages ?? 1;
    page += 1;
  }

  return dedupeByCampaignId(all);
}

type ChainCampaign = {
  campaignId: number;
  orgAddress: string;
  goalAmount: string;
  raisedAmount: string;
  deadline: number;
  status: number;
  totalMilestones: number;
  completedMilestones: number;
  paymentToken: number;
  category: string;
  title?: string;
  description?: string;
  metadataCID?: string;
  _source: "chain";
};

export function CampaignList() {
  const [allCampaigns, setAllCampaigns] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const [usingChainFallback, setUsingChainFallback] = useState(false);
  const [governanceByCampaign, setGovernanceByCampaign] = useState<Map<number, "vote" | "timelock">>(new Map());

  const { data: totalOnChain } = useReadContract({
    address: ADDRESSES.charityCore,
    abi: CHARITY_CORE_ABI,
    functionName: "totalCampaigns",
  });
  const total = totalOnChain != null ? Number(totalOnChain) : 0;
  const ids = useMemo(
    () => (total > 0 ? Array.from({ length: total }, (_, i) => i + 1) : []),
    [total]
  );

  const { data: chainBatch, isFetched: chainFetched } = useReadContracts({
    contracts: ids.map((id) => ({
      address: ADDRESSES.charityCore,
      abi: CHARITY_CORE_ABI,
      functionName: "getCampaign" as const,
      args: [BigInt(id)] as const,
    })),
    query: { enabled: ids.length > 0 },
  });

  const chainCampaigns: ChainCampaign[] = useMemo(() => {
    if (!chainBatch || ids.length === 0) return [];
    return ids
      .map((id, i) => {
        const row = chainBatch[i];
        if (row?.status !== "success" || !row.result) return null;
        const c = row.result as {
          orgAddress: string;
          metadataCID: string;
          goalAmount: bigint;
          raisedAmount: bigint;
          deadline: bigint;
          status: number;
          totalMilestones: number;
          completedMilestones: number;
          paymentToken: number;
          category: string;
        };
        return {
          campaignId: id,
          orgAddress: c.orgAddress,
          goalAmount: c.goalAmount.toString(),
          raisedAmount: c.raisedAmount.toString(),
          deadline: Number(c.deadline),
          status: Number(c.status),
          totalMilestones: Number(c.totalMilestones),
          completedMilestones: Number(c.completedMilestones),
          paymentToken: Number(c.paymentToken),
          category: c.category || "general",
          title: `Campaign #${id}`,
          description: c.metadataCID ? `On-chain metadata: ${c.metadataCID.slice(0, 18)}…` : undefined,
          metadataCID: c.metadataCID,
          _source: "chain" as const,
        };
      })
      .filter(Boolean) as ChainCampaign[];
  }, [chainBatch, ids]);

  const loadGovernance = () => {
    Promise.all([api.getProposals(1), api.getProposals(3)])
      .then(([active, queued]) => {
        const map = new Map<number, "vote" | "timelock">();
        for (const p of active.proposals ?? []) {
          map.set(Number(p.campaignId), "vote");
        }
        for (const p of queued.proposals ?? []) {
          const id = Number(p.campaignId);
          if (!map.has(id)) map.set(id, "timelock");
        }
        setGovernanceByCampaign(map);
      })
      .catch(() => setGovernanceByCampaign(new Map()));
  };

  const applyList = (campaigns: any[], fromChain: boolean) => {
    setAllCampaigns(campaigns);
    setFiltered(campaigns);
    setUsingChainFallback(fromChain);
    setLoading(false);
  };

  const load = () => {
    setLoading(true);
    fetchAllCampaigns()
      .then((campaigns) => {
        setApiFailed(false);
        if (campaigns.length > 0) {
          applyList(campaigns, false);
        } else if (chainCampaigns.length > 0) {
          applyList(chainCampaigns, true);
        } else {
          applyList([], false);
        }
      })
      .catch(() => {
        setApiFailed(true);
        if (chainCampaigns.length > 0) {
          applyList(chainCampaigns, true);
        } else if (chainFetched || total === 0) {
          applyList([], false);
        }
        // else keep loading until chain batch arrives
      });
    loadGovernance();
  };

  useEffect(() => {
    setMounted(true);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When API empty/failed but chain batch arrives later, fill the list
  useEffect(() => {
    if (!mounted) return;
    if (allCampaigns.length > 0 && !usingChainFallback) return;
    if (chainCampaigns.length === 0) {
      if (apiFailed && chainFetched) setLoading(false);
      return;
    }
    if (apiFailed || allCampaigns.length === 0) {
      applyList(chainCampaigns, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainCampaigns, chainFetched, apiFailed, mounted]);

  useSocketEvents({
    donationReceived: () => load(),
    campaignCreated: () => load(),
    proposalCreated: () => loadGovernance(),
    proposalQueued: () => loadGovernance(),
    proposalExecuted: () => loadGovernance(),
    proposalDefeated: () => loadGovernance(),
  });

  const campaignIds = useMemo(
    () => filtered.map((c) => Number(c.campaignId)),
    [filtered]
  );
  const { data: progressResults } = useCampaignProgressBatch(campaignIds);
  const onChainRaisedById = useMemo(() => {
    const map = new Map<number, bigint>();
    if (!progressResults) return map;
    progressResults.forEach((result, index) => {
      if (result.status !== "success" || !result.result) return;
      map.set(campaignIds[index], result.result[0] as bigint);
    });
    return map;
  }, [campaignIds, progressResults]);

  const handleFilter = (filters: FilterState) => {
    let result = [...allCampaigns];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.orgName?.toLowerCase().includes(q) ||
          String(c.campaignId).includes(q)
      );
    }
    if (filters.category) {
      result = result.filter((c) => c.category?.toLowerCase() === filters.category);
    }
    if (filters.status !== "") {
      result = result.filter((c) => c.status === Number(filters.status));
    }

    setFiltered(dedupeByCampaignId(result));
  };

  if (!mounted) return null;

  if (loading) return <CampaignListSkeleton />;

  if (allCampaigns.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <WarningCircle size={40} className="mx-auto mb-3 text-teal-600 dark:text-holo-mint" weight="duotone" />
        <h3 className="mb-2 font-display text-xl font-semibold text-slate-900 dark:text-white">
          No campaigns yet
        </h3>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-white/60">
          {apiFailed
            ? "Indexer/API is temporarily unavailable and no on-chain campaigns were found for this network."
            : "Campaigns appear here after a verified organization creates one on Avalanche Fuji. Funds lock in escrow until donors approve milestone releases."}
        </p>
        <p className="mt-4 text-sm text-slate-500 dark:text-white/50">
          Verified org?{" "}
          <Link
            href="/campaigns/create"
            className="inline-flex cursor-pointer items-center gap-1 text-teal-600 transition-colors hover:text-slate-900 dark:text-holo-mint dark:hover:text-white"
          >
            Go to create
            <ArrowRight size={14} weight="bold" aria-hidden />
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <GlassPanel hover={false} className="mb-6 p-4">
        <CampaignFilter onFilter={handleFilter} total={filtered.length} />
      </GlassPanel>
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-slate-500 dark:text-white/50">
          No campaigns match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((campaign, i) => (
            <motion.div
              key={campaign.campaignId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <CampaignCard
                campaign={campaign}
                onChainRaisedWei={onChainRaisedById.get(Number(campaign.campaignId))}
                governanceStatus={governanceByCampaign.get(Number(campaign.campaignId)) ?? null}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
