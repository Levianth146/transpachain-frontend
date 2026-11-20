"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useReadContract, useReadContracts } from "wagmi";
import { ChartLineUp } from "@phosphor-icons/react";
import { PageShell } from "@/components/PageShell";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MockYieldBadge } from "@/components/MockYieldBadge";
import { CampaignYieldTab } from "@/components/CampaignYieldTab";
import { LearnMoreLink } from "@/components/LearnMoreLink";
import { ContractLink, contractReadUrl } from "@/components/TxLink";
import {
  ADDRESSES,
  CHARITY_CORE_ABI,
  YIELD_MANAGER_ABI,
  isContractConfigured,
} from "@/lib/contracts";
import { EXPLORER_NAME, NETWORK } from "@/lib/chain";
import { formatCampaignAmountLabel, getPaymentTokenLabel } from "@/lib/format";
import { formatUnits } from "viem";

export default function YieldPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

  const { data: campaignBatch } = useReadContracts({
    contracts: ids.map((id) => ({
      address: ADDRESSES.charityCore,
      abi: CHARITY_CORE_ABI,
      functionName: "getCampaign" as const,
      args: [BigInt(id)] as const,
    })),
    query: { enabled: ids.length > 0 },
  });

  const { data: policy } = useReadContract({
    address: ADDRESSES.yieldManager,
    abi: YIELD_MANAGER_ABI,
    functionName: "policy",
    query: { enabled: isContractConfigured(ADDRESSES.yieldManager) },
  });

  const usdcCampaigns = useMemo(() => {
    if (!campaignBatch) return [];
    return ids
      .map((id, i) => {
        const row = campaignBatch[i];
        if (row?.status !== "success" || !row.result) return null;
        const c = row.result as {
          paymentToken: number;
          orgAddress: string;
          raisedAmount: bigint;
          goalAmount: bigint;
          status: number;
          category: string;
        };
        if (Number(c.paymentToken) !== 1) return null;
        return { id, ...c };
      })
      .filter(Boolean) as Array<{
      id: number;
      paymentToken: number;
      orgAddress: string;
      raisedAmount: bigint;
      goalAmount: bigint;
      status: number;
      category: string;
    }>;
  }, [campaignBatch, ids]);

  const selected =
    selectedId != null
      ? usdcCampaigns.find((c) => c.id === selectedId) ?? null
      : usdcCampaigns[0] ?? null;

  const activeId = selected?.id ?? null;

  const pol = policy as
    | {
        minLiquidReserveBps: number;
        maxAllocationBps: number;
        maxAssetsPerTx: bigint;
        paused: boolean;
      }
    | undefined;

  return (
    <PageShell
      eyebrow="Module C"
      title={
        <span className="inline-flex flex-wrap items-center gap-3">
          <ChartLineUp size={32} className="text-teal-600 dark:text-holo-mint" weight="duotone" />
          Yield
          <MockYieldBadge />
        </span>
      }
      description="USDC idle capital can be allocated into a Mock ERC-4626 vault on Fuji. Figures are live on-chain reads — not marketed APY. AVAX campaigns have no yield path."
      maxWidth="5xl"
      backgroundImage="/backgrounds/panels.png"
    >
      <LearnMoreLink className="mb-6" />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <GlassPanel className="p-4">
          <p className="text-xs text-slate-500 dark:text-white/50">YieldManager</p>
          <p className="mt-1">
            <ContractLink address={ADDRESSES.yieldManager} name="Open on Snowtrace" />
          </p>
          <a
            href={contractReadUrl(ADDRESSES.yieldManager)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-[11px] text-teal-700 hover:underline dark:text-holo-mint"
          >
            Read Contract ↗
          </a>
        </GlassPanel>
        <GlassPanel className="p-4">
          <p className="text-xs text-slate-500 dark:text-white/50">MockERC4626Vault</p>
          <p className="mt-1">
            <ContractLink address={ADDRESSES.mockErc4626Vault} name="Open on Snowtrace" />
          </p>
          <a
            href={contractReadUrl(ADDRESSES.mockErc4626Vault)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-[11px] text-teal-700 hover:underline dark:text-holo-mint"
          >
            Read Contract ↗
          </a>
        </GlassPanel>
        <GlassPanel className="p-4">
          <p className="text-xs text-slate-500 dark:text-white/50">policy()</p>
          <p className="mt-1 font-mono text-xs text-slate-900 dark:text-white">
            {pol
              ? `reserve ${pol.minLiquidReserveBps}bps · max ${pol.maxAllocationBps}bps · paused=${String(pol.paused)}`
              : "—"}
          </p>
          {pol && (
            <p className="mt-1 font-mono text-[10px] text-slate-500 dark:text-white/40">
              max/tx{" "}
              {pol.maxAssetsPerTx > 10n ** 18n
                ? "unlimited (uint max)"
                : `${formatUnits(pol.maxAssetsPerTx, 6)} USDC`}
            </p>
          )}
        </GlassPanel>
        <GlassPanel className="p-4">
          <p className="text-xs text-slate-500 dark:text-white/50">USDC · {EXPLORER_NAME}</p>
          <p className="mt-1">
            <ContractLink address={NETWORK.defaultUsdc} />
          </p>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-white/45">
            {usdcCampaigns.length} USDC campaign{usdcCampaigns.length === 1 ? "" : "s"} on-chain
          </p>
        </GlassPanel>
      </div>

      <GlassPanel holoBorder className="mb-6 p-5">
        <h2 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
          Select a USDC campaign
        </h2>
        <p className="mb-4 text-xs text-slate-600 dark:text-white/50">
          Enable → Allocate → Simulate (mock) → Settle when refunds need liquidity. Same controls as
          the campaign detail Yield tab.
        </p>
        {usdcCampaigns.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-white/60">
            No USDC campaigns indexed on-chain yet.{" "}
            <Link href="/campaigns/create" className="text-teal-700 hover:underline dark:text-holo-mint">
              Create one
            </Link>{" "}
            with payment token USDC and yield opt-in.
          </p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {usdcCampaigns.map((c) => {
              const active = activeId === c.id;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                      active
                        ? "border-teal-500/50 bg-teal-500/10 ring-1 ring-teal-500/30 dark:border-holo-mint/40 dark:bg-holo-mint/10"
                        : "border-slate-200 bg-white/80 hover:border-teal-400/40 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        Campaign #{c.id}
                      </span>
                      <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-white/45">
                        {getPaymentTokenLabel(c.paymentToken)}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-xs text-slate-600 dark:text-white/60">
                      {formatCampaignAmountLabel(c.raisedAmount, 1)} /{" "}
                      {formatCampaignAmountLabel(c.goalAmount, 1)}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-white/40">
                      {c.category || "—"} ·{" "}
                      <Link
                        href={`/campaigns/${c.id}`}
                        className="text-teal-700 hover:underline dark:text-holo-mint"
                        onClick={(e) => e.stopPropagation()}
                      >
                        open detail
                      </Link>
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </GlassPanel>

      {selected && (
        <GlassPanel holoBorder className="p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Position · Campaign #{selected.id}
            </h2>
            <Link
              href={`/campaigns/${selected.id}?tab=yield`}
              className="text-xs text-teal-700 hover:underline dark:text-holo-mint"
            >
              Also on campaign page →
            </Link>
          </div>
          <CampaignYieldTab
            campaignId={BigInt(selected.id)}
            paymentToken={1}
            orgAddress={selected.orgAddress}
          />
        </GlassPanel>
      )}
    </PageShell>
  );
}
