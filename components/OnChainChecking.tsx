"use client";
import { useReadContract } from "wagmi";
import { ADDRESSES, CHARITY_CORE_ABI, DONATION_VAULT_ABI } from "@/lib/contracts";
import { formatCampaignAmountLabel, getPaymentTokenLabel } from "@/lib/format";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ShieldCheck } from "@phosphor-icons/react";
import { ContractLink } from "@/components/TxLink";

export function OnChainChecking({
  campaignId,
  paymentToken = 0,
}: {
  campaignId: bigint;
  paymentToken?: number;
}) {
  const tokenLabel = getPaymentTokenLabel(paymentToken);

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
    orgAddress: string;
  };

  const statusLabels = ["Active", "Completed", "Failed", "Cancelled"];
  const status = statusLabels[c.status] ?? "Unknown";
  const raised = formatCampaignAmountLabel(c.raisedAmount, paymentToken);
  const goal = formatCampaignAmountLabel(c.goalAmount, paymentToken);
  const escrowBal =
    escrow !== undefined ? formatCampaignAmountLabel(escrow as bigint, paymentToken) : "—";
  const donorCount = Array.isArray(donors) ? donors.length : 0;
  const progressBps = progress ? Number((progress as readonly bigint[])[2]) / 100 : 0;

  const rows = [
    { label: "Campaign status", value: status },
    { label: "Raised (net, on-chain)", value: raised, hint: "After 1% platform fee" },
    { label: "Goal", value: goal },
    { label: "Progress", value: `${progressBps.toFixed(1)}%` },
    { label: "Escrow balance", value: escrowBal, hint: "Locked in vault until release/refund" },
    { label: "Donors (vault)", value: String(donorCount) },
    { label: "Milestones", value: `${c.completedMilestones} / ${c.totalMilestones} released` },
    { label: "Deadline", value: new Date(Number(c.deadline) * 1000).toLocaleDateString() },
    { label: "Org wallet", value: c.orgAddress, isAddress: true },
  ];

  return (
    <GlassPanel holoBorder className="p-5">
      <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2 text-white">
        <ShieldCheck size={22} weight="duotone" className="text-holo-mint" />
        On-chain verification
      </h3>
      <p className="text-xs text-white/50 mb-4">
        Live RPC reads from CharityCore & DonationVault ({tokenLabel}) — source of truth for amounts.
      </p>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-col gap-0.5 border-b border-white/10 pb-2">
            <dt className="text-white/50 text-xs">{r.label}</dt>
            <dd className="font-medium text-white text-right sm:text-left">
              {"isAddress" in r && r.isAddress ? (
                <ContractLink address={String(r.value)} />
              ) : (
                r.value
              )}
            </dd>
            {"hint" in r && r.hint && (
              <dd className="text-[10px] text-white/40">{r.hint}</dd>
            )}
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[10px] text-white/40">
        Contracts:{" "}
        <ContractLink address={ADDRESSES.charityCore} name="CharityCore" /> ·{" "}
        <ContractLink address={ADDRESSES.donationVault} name="DonationVault" />
      </p>
    </GlassPanel>
  );
}
