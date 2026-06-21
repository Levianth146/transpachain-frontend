"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { CampaignCard } from "./CampaignCard";
import { CampaignListSkeleton } from "./CampaignCardSkeleton";
import { CampaignFilter, FilterState } from "./CampaignFilter";
import { useSocketEvents } from "@/hooks/useSocket";
import { useCampaignProgressBatch } from "@/hooks/useCharityCore";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";

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
    all.push(...(data.campaigns ?? []));
    pages = data.pages ?? 1;
    page += 1;
  }

  return dedupeByCampaignId(all);
}

export function CampaignList() {
  const [allCampaigns, setAllCampaigns] = useState<any[]>([]);
  const [filtered, setFiltered]         = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [mounted, setMounted]     = useState(false);

  const load = () => {
    fetchAllCampaigns()
      .then((campaigns) => {
        setAllCampaigns(campaigns);
        setFiltered(campaigns);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    setMounted(true);
    load();
  }, []);

  useSocketEvents({
    donationReceived: () => load(),
    campaignCreated: () => load(),
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
      result = result.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.orgName?.toLowerCase().includes(q)
      );
    }
    if (filters.category) {
      result = result.filter(c => c.category?.toLowerCase() === filters.category);
    }
    if (filters.status !== "") {
      result = result.filter(c => c.status === Number(filters.status));
    }

    setFiltered(dedupeByCampaignId(result));
  };

  if (!mounted) return null;

  if (loading) return <CampaignListSkeleton />;

  if (allCampaigns.length === 0) return (
    <div className="text-center py-20 px-4 max-w-md mx-auto">
      <p className="text-5xl mb-4">📋</p>
      <h3 className="mb-2 text-xl font-display font-semibold text-white">No campaigns yet</h3>
      <p className="text-sm leading-relaxed text-white/60">
        Campaigns appear here after a verified organization creates one on-chain via Sepolia.
        Each campaign locks donations in escrow until donors approve milestone releases.
      </p>
      <p className="mt-4 text-sm text-white/50">
        Verified org?{" "}
        <Link
          href="/campaigns/create"
          className="inline-flex items-center gap-1 text-holo-mint transition-colors hover:text-white"
        >
          Go to create
          <ArrowRight size={14} weight="bold" aria-hidden />
        </Link>
      </p>
    </div>
  );

  return (
    <div>
      <CampaignFilter onFilter={handleFilter} total={filtered.length} />
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-white/50">No campaigns match your filters.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
