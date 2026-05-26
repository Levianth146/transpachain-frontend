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
  const raised   = Number(formatEther(BigInt(campaign.raisedAmount ?? "0")));
  const goal     = Number(formatEther(BigInt(campaign.goalAmount ?? "0")));
  const progress = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
  const badge    = STATUS_BADGE[campaign.status as CampaignStatus];

  return (
    <Link href={`/campaigns/${campaign.campaignId}`}>
      <div className="bg-white rounded-xl border hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
        {/* Image */}
        {campaign.imageUrl && (
          <img src={campaign.imageUrl} alt={campaign.title}
            className="w-full h-48 object-cover" />
        )}
        <div className="p-5">
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2">
              {campaign.title ?? `Campaign #${campaign.campaignId}`}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ml-2 shrink-0 ${badge?.color}`}>
              {badge?.label}
            </span>
          </div>

          {/* Org name */}
          {campaign.orgName && (
            <p className="text-xs text-gray-500 mb-2">by {campaign.orgName}</p>
          )}

          {/* Description */}
          {campaign.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {campaign.description}
            </p>
          )}

          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
            <div className="bg-emerald-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span className="font-medium text-gray-900">{raised.toFixed(3)} ETH raised</span>
            <span>{progress.toFixed(0)}%</span>
          </div>

          {/* Footer */}
          <div className="flex justify-between text-xs text-gray-400">
            <span>Goal: {goal.toFixed(3)} ETH</span>
            <span>Milestones: {campaign.completedMilestones}/{campaign.totalMilestones}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
