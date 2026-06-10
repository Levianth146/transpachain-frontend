"use client";
import { useReadContract } from "wagmi";
import { ADDRESSES, CHARITY_CORE_ABI, DONATION_VAULT_ABI } from "@/lib/contracts";
import { formatEther } from "viem";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ShieldCheck } from "@phosphor-icons/react";

export function OnChainChecking({ campaignId }: { campaignId: bigint }) {
  const { data: campaign } = useReadContract({
    address: ADDRESSES.charityCore,
    abi: CHARITY_CORE_ABI,
    functionName: "getCampaign",
    args: [campaignId],
  });

  const { data: progress } = useReadContract({
    address: ADDRESSES.charityCore,
    abi: CHARITY_CORE_ABI,
    functionName: "getCharityProgress",
    args: [campaignId],
  });

  const { data: escrow } = useReadContract({
    address: ADDRESSES.donationVault,
    abi: DONATION_VAULT_ABI,
    functionName: "getCampaignEscrowBalance",
    args: [campaignId],
  });

  const { data: donors } = useReadContract({
    address: ADDRESSES.donationVault,
    abi: DONATION_VAULT_ABI,
    functionName: "getCharityDonors",
    args: [campaignId],
  });

  if (!campaign) return null;

  const c = campaign as {
    status: number;
    raisedAmount: bigint;
    goalAmount: bigint;
    completedMilestones: number;
    totalMilestones: number;
    deadline: bigint;
  };

  const statusLabels = ["Active", "Completed", "Failed", "Cancelled"];
  const status = statusLabels[c.status] ?? "Unknown";
  const raised = formatEther(c.raisedAmount);
  const goal = formatEther(c.goalAmount);
  const escrowEth = escrow !== undefined ? formatEther(escrow as bigint) : "—";
  const donorCount = Array.isArray(donors) ? donors.length : 0;
  const progressBps = progress ? Number((progress as readonly bigint[])[2]) / 100 : 0;

  const rows = [
    { label: "Campaign status", value: status },
    { label: "Raised (on-chain)", value: `${raised} ETH` },
    { label: "Goal", value: `${goal} ETH` },
    { label: "Progress", value: `${progressBps.toFixed(1)}%` },
    { label: "Escrow balance", value: `${escrowEth} ETH` },
    { label: "Donors (vault)", value: String(donorCount) },
    { label: "Milestones", value: `${c.completedMilestones} / ${c.totalMilestones} released` },
    { label: "Deadline", value: new Date(Number(c.deadline) * 1000).toLocaleDateString() },
  ];

  return (
    <GlassPanel className="p-5">
      <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
        <ShieldCheck size={22} weight="duotone" className="text-emerald-600" />
        On-chain verification
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Live reads from CharityCore & DonationVault — not cached mock data.
      </p>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between gap-2 border-b border-gray-100 dark:border-zinc-800 pb-2">
            <dt className="text-gray-500">{r.label}</dt>
            <dd className="font-medium text-right">{r.value}</dd>
          </div>
        ))}
      </dl>
    </GlassPanel>
  );
}
