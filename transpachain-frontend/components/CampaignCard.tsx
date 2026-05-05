"use client";
import Link from "next/link";
import { formatEther } from "viem";
import type { Campaign } from "@/types";
import { CampaignStatus } from "@/types";

const STATUS_BADGE: Record<CampaignStatus, { label: string; color: string }> = {
  [CampaignStatus.Active]:     { label: "Active",     color: "bg-emerald-100 text-emerald-800" },
  [CampaignStatus.Successful]: { label: "Completed",  color: "bg-blue-100 text-blue-800"       },
  [CampaignStatus.Failed]:     { label: "Failed",     color: "bg-red-100 text-red-800"         },
  [CampaignStatus.Cancelled]:  { label: "Cancelled",  color: "bg-gray-100 text-gray-800"       },
};

interface Props { campaign: Campaign; title?: string }

export function CampaignCard({ campaign, title }: Props) {
  const raised   = Number(formatEther(campaign.raisedAmount));
  const goal     = Number(formatEther(campaign.goalAmount));
  const progress = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
  const badge    = STATUS_BADGE[campaign.status];

  return (
    <Link href={`/campaigns/${campaign.id}`}>
      <div className="bg-white rounded-xl border hover:shadow-md transition-shadow p-5 cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {title ?? `Campaign #${campaign.id}`}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ml-2 shrink-0 ${badge.color}`}>
            {badge.label}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-sm text-gray-500 mb-3">
          <span className="font-medium text-gray-900">{raised.toFixed(3)} ETH raised</span>
          <span>Goal: {goal.toFixed(3)} ETH</span>
        </div>

        <div className="text-xs text-gray-400">
          Milestones: {campaign.completedMilestones}/{campaign.totalMilestones}
        </div>
      </div>
    </Link>
  );
}
