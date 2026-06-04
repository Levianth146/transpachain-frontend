"use client";
import { useMilestone } from "@/hooks/useDonationVault";
import { formatEther } from "viem";
import type { Campaign } from "@/types";

function MilestoneItem({ campaignId, index }: { campaignId: bigint; index: number }) {
  const { data: m } = useMilestone(campaignId, index);
  const milestone = m as any;

  return (
    <div className={`flex gap-3 items-start p-3 rounded-lg ${milestone?.released ? "bg-emerald-50" : "bg-gray-50"}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
        ${milestone?.released ? "bg-emerald-500 text-white" : "bg-gray-300 text-gray-600"}`}>
        {index + 1}
      </div>
      <div>
        <p className="text-sm font-medium">{milestone?.released ? "Released" : "Pending"}</p>
        {milestone?.proofCID && milestone.proofCID.length > 30 && milestone.proofCID.startsWith("Qm") && (
          <a
            href={`https://gateway.pinata.cloud/ipfs/${milestone?.proofCID}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            View Proof on IPFS ↗
          </a>
        )}
        {milestone?.releaseAmount != null && (
          <p className="text-xs text-gray-500">
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
    <div className="bg-white border rounded-xl p-5">
      <h3 className="font-semibold mb-4">Milestone Timeline</h3>
      <div className="space-y-3">
        {count === 0 ? (
          <p className="text-sm text-gray-400">No milestones configured.</p>
        ) : (
          Array.from({ length: count }, (_, i) => (
            <MilestoneItem key={i} campaignId={campaignId} index={i} />
          ))
        )}
      </div>
    </div>
  );
}
