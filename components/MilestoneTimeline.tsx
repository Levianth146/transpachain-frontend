"use client";
import { useMilestone } from "@/hooks/useDonationVault";
import { useProposal } from "@/hooks/useGovernance";
import { getMilestoneDisplayStatus } from "@/lib/campaignStatus";
import { formatCampaignAmountLabel } from "@/lib/format";
import type { Campaign } from "@/types";

function MilestoneItem({
  campaignId,
  index,
  paymentToken,
  completedMilestones,
}: {
  campaignId: bigint;
  index: number;
  paymentToken: number;
  completedMilestones: number;
}) {
  const { data: m } = useMilestone(campaignId, index);
  const milestone = m as {
    proofCID?: string;
    releaseAmount?: bigint;
    released?: boolean;
    proposalId?: bigint;
  } | undefined;

  const proposalId = milestone?.proposalId ?? 0n;
  const { data: proposal } = useProposal(proposalId, { enabled: proposalId > 0n });
  const proposalState = (proposal as { state?: number } | undefined)?.state;

  const statusLabel = getMilestoneDisplayStatus({
    released: milestone?.released,
    proposalId,
    proposalState,
    isNextToSubmit: index === completedMilestones,
  });

  return (
    <div className={`flex items-start gap-3 rounded-lg p-3 ${milestone?.released ? "bg-emerald-500/10" : "bg-white/[0.03]"}`}>
      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold
        ${milestone?.released ? "bg-emerald-500 text-white" : "bg-white/10 text-white/60"}`}>
        {index + 1}
      </div>
      <div>
        <p className="text-sm font-medium text-white">{statusLabel}</p>
        {milestone?.proofCID && milestone.proofCID.length > 30 && milestone.proofCID.startsWith("Qm") && (
          <a
            href={`https://gateway.pinata.cloud/ipfs/${milestone.proofCID}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-accent-shine hover:text-white hover:underline"
          >
            View proof on IPFS ↗
          </a>
        )}
        {milestone?.releaseAmount != null && (
          <p className="text-xs text-white/50">
            {(() => {
              try {
                return formatCampaignAmountLabel(BigInt(milestone.releaseAmount), paymentToken);
              } catch {
                return "—";
              }
            })()}
          </p>
        )}
      </div>
    </div>
  );
}

export function MilestoneTimeline({ campaignId, campaign }: { campaignId: bigint; campaign: Campaign }) {
  const count = Math.max(0, Number(campaign.totalMilestones) || 0);
  const completedMilestones = Math.max(0, Number(campaign.completedMilestones) || 0);
  const paymentToken = (campaign as { paymentToken?: number }).paymentToken ?? 0;
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <h3 className="mb-4 font-semibold text-white">Milestone disbursement</h3>
      <p className="text-xs text-white/50 mb-3">
        Submit proof → Vote → Queue → Execute release
      </p>
      <div className="space-y-3">
        {count === 0 ? (
          <p className="text-sm text-white/50">No milestones configured.</p>
        ) : (
          Array.from({ length: count }, (_, i) => (
            <MilestoneItem
              key={i}
              campaignId={campaignId}
              index={i}
              paymentToken={paymentToken}
              completedMilestones={completedMilestones}
            />
          ))
        )}
      </div>
    </div>
  );
}
