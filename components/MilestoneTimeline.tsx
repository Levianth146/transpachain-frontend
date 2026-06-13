"use client";
import { useMilestone } from "@/hooks/useDonationVault";
import { formatEther } from "viem";
import type { Campaign } from "@/types";

function MilestoneItem({ campaignId, index }: { campaignId: bigint; index: number }) {
  const { data: m } = useMilestone(campaignId, index);
  const milestone = m as any;

  return (
    <div className={`flex items-start gap-3 rounded-lg p-3 ${milestone?.released ? "bg-emerald-500/10" : "bg-white/[0.03]"}`}>
      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold
        ${milestone?.released ? "bg-emerald-500 text-white" : "bg-white/10 text-white/60"}`}>
        {index + 1}
      </div>
      <div>
        <p className="text-sm font-medium text-white">{milestone?.released ? "Released" : "Pending"}</p>
        {milestone?.proofCID && milestone.proofCID.length > 30 && milestone.proofCID.startsWith("Qm") && (
          <a
            href={`https://gateway.pinata.cloud/ipfs/${milestone?.proofCID}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-accent-shine hover:text-white hover:underline"
          >
            View Proof on IPFS ↗
          </a>
        )}
        {milestone?.releaseAmount != null && (
          <p className="text-xs text-white/50">
            {(() => {
              try {
                return `${formatEther(BigInt(milestone.releaseAmount))} ETH`;
              } catch {
                return "— ETH";
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
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <h3 className="mb-4 font-semibold text-white">Milestone Timeline</h3>
      <div className="space-y-3">
        {count === 0 ? (
          <p className="text-sm text-white/50">No milestones configured.</p>
        ) : (
          Array.from({ length: count }, (_, i) => (
            <MilestoneItem key={i} campaignId={campaignId} index={i} />
          ))
        )}
      </div>
    </div>
  );
}
