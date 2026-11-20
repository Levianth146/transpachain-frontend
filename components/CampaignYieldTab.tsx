"use client";

import { useReadContract } from "wagmi";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MockYieldBadge } from "@/components/MockYieldBadge";
import {
  ADDRESSES,
  YIELD_MANAGER_ABI,
  DONATION_VAULT_ABI,
  isContractConfigured,
} from "@/lib/contracts";
import { formatCampaignAmountLabel } from "@/lib/format";

export function CampaignYieldTab({
  campaignId,
  paymentToken,
}: {
  campaignId: bigint;
  paymentToken: number;
}) {
  const ymReady = isContractConfigured(ADDRESSES.yieldManager);
  const usdcOnly = paymentToken === 1;

  const { data: position } = useReadContract({
    address: ADDRESSES.yieldManager,
    abi: YIELD_MANAGER_ABI,
    functionName: "getPosition",
    args: [campaignId],
    query: { enabled: ymReady && usdcOnly },
  });

  const { data: positionValue } = useReadContract({
    address: ADDRESSES.yieldManager,
    abi: YIELD_MANAGER_ABI,
    functionName: "positionValue",
    args: [campaignId],
    query: { enabled: ymReady && usdcOnly },
  });

  const { data: investable } = useReadContract({
    address: ADDRESSES.yieldManager,
    abi: YIELD_MANAGER_ABI,
    functionName: "previewInvestable",
    args: [campaignId],
    query: { enabled: ymReady && usdcOnly },
  });

  const { data: invested } = useReadContract({
    address: ADDRESSES.donationVault,
    abi: DONATION_VAULT_ABI,
    functionName: "getInvestedBalance",
    args: [campaignId],
    query: { enabled: ymReady && usdcOnly },
  });

  const pos = position as
    | { shares?: bigint; principal?: bigint; realizedPnl?: bigint; enabled?: boolean }
    | undefined;

  const fmt = (v: bigint | undefined) => {
    if (v === undefined) return "—";
    return formatCampaignAmountLabel(v, paymentToken);
  };

  if (!usdcOnly) {
    return (
      <GlassPanel className="p-5">
        <div className="mb-2 flex items-center gap-2">
          <h3 className="font-semibold text-white">Yield</h3>
          <MockYieldBadge />
        </div>
        <p className="text-sm text-white/60">
          Yield is USDC-only and disabled for AVAX campaigns.
        </p>
      </GlassPanel>
    );
  }

  if (!ymReady) {
    return (
      <GlassPanel className="p-5">
        <div className="mb-2 flex items-center gap-2">
          <h3 className="font-semibold text-white">Yield</h3>
          <MockYieldBadge />
        </div>
        <p className="text-sm text-white/60">
          YieldManager not configured. Set{" "}
          <code className="text-xs text-holo-mint">NEXT_PUBLIC_YIELD_MANAGER_ADDRESS</code> after V2
          deploy. No mock APY figures are shown.
        </p>
      </GlassPanel>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-white">Yield position</h3>
        <MockYieldBadge />
      </div>
      <p className="text-xs text-white/50">
        Mock ERC-4626 on Fuji — figures are on-chain reads only, not marketed APY.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Metric label="Enabled" value={pos?.enabled ? "Yes" : "No"} />
        <Metric label="Principal (cost basis)" value={fmt(pos?.principal)} badge />
        <Metric label="Shares" value={pos?.shares != null ? String(pos.shares) : "—"} badge />
        <Metric label="Position value" value={fmt(positionValue as bigint | undefined)} badge />
        <Metric label="Vault invested bucket" value={fmt(invested as bigint | undefined)} badge />
        <Metric label="Preview investable" value={fmt(investable as bigint | undefined)} badge />
        <Metric
          label="Realized P&L"
          value={
            pos?.realizedPnl != null
              ? formatCampaignAmountLabel(
                  pos.realizedPnl < 0n ? -pos.realizedPnl : pos.realizedPnl,
                  paymentToken
                ) + (pos.realizedPnl < 0n ? " (loss)" : "")
              : "—"
          }
          badge
        />
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: boolean;
}) {
  return (
    <GlassPanel className="p-4">
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <p className="text-xs text-white/50">{label}</p>
        {badge && <MockYieldBadge />}
      </div>
      <p className="text-lg font-semibold text-white">{value}</p>
    </GlassPanel>
  );
}
