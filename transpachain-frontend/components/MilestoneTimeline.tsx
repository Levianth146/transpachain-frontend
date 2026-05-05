"use client";
import { useMilestone } from "@/hooks/useDonationVault";
import { formatEther } from "viem";
import type { Campaign } from "@/types";

function MilestoneItem({ campaignId, index }: { campaignId: bigint; index: number }) {
  const { data: m } = useMilestone(campaignId, index);

  return (
    <div className={`flex gap-3 items-start p-3 rounded-lg ${m?.released ? "bg-emerald-50" : "bg-gray-50"}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
        ${m?.released ? "bg-emerald-500 text-white" : "bg-gray-300 text-gray-600"}`}>
        {index + 1}
      </div>
      <div>
        <p className="text-sm font-medium">{m?.released ? "Released" : "Pending"}</p>
        {m?.proofCID && (
          <a
            href={`https://ipfs.io/ipfs/${m.proofCID}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            View Proof on IPFS ↗
          </a>
        )}
        {m?.releaseAmount != null && (
          <p className="text-xs text-gray-500">{formatEther(m.releaseAmount)} ETH</p>
        )}
      </div>
    </div>
  );
}

export function MilestoneTimeline({ campaignId, campaign }: { campaignId: bigint; campaign: Campaign }) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <h3 className="font-semibold mb-4">Milestone Timeline</h3>
      <div className="space-y-3">
        {Array.from({ length: campaign.totalMilestones }, (_, i) => (
          <MilestoneItem key={i} campaignId={campaignId} index={i} />
        ))}
      </div>
    </div>
  );
}
