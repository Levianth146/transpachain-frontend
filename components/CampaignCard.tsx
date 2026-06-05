"use client";
import Link from "next/link";
import { formatEther } from "viem";
import { motion } from "framer-motion";
import type { Campaign } from "@/types";
import { CampaignStatus } from "@/types";
import { BookOpen, Heart, AlertTriangle, Leaf, Users, Lightbulb, Clock, TrendingUp } from "lucide-react";
import { CampaignImage } from "@/components/CampaignImage";

const STATUS_BADGE: Record<CampaignStatus, { label: string; color: string }> = {
  [CampaignStatus.Active]:     { label: "Active",    color: "bg-emerald-100 text-emerald-800" },
  [CampaignStatus.Successful]: { label: "Completed", color: "bg-blue-100 text-blue-800"      },
  [CampaignStatus.Failed]:     { label: "Failed",    color: "bg-red-100 text-red-800"        },
  [CampaignStatus.Cancelled]:  { label: "Cancelled", color: "bg-gray-100 text-gray-800"      },
};

const CATEGORY_COLORS: Record<string, string> = {
  education:   "bg-blue-100 text-blue-700",
  healthcare:  "bg-red-100 text-red-700",
  disaster:    "bg-orange-100 text-orange-700",
  environment: "bg-green-100 text-green-700",
  community:   "bg-purple-100 text-purple-700",
  general:     "bg-gray-100 text-gray-700",
};

const CATEGORY_ICONS: Record<string, any> = {
  education:   BookOpen,
  healthcare:  Heart,
  disaster:    AlertTriangle,
  environment: Leaf,
  community:   Users,
  general:     Lightbulb,
};

function getTimeLeft(deadline: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = deadline - now;
  if (diff <= 0) return "Ended";
  const days = Math.floor(diff / 86400);
  if (days > 0) return `${days}d left`;
  const hours = Math.floor(diff / 3600);
  return `${hours}h left`;
}

export function CampaignCard({ campaign }: { campaign: any }) {
  const raised      = Number(formatEther(BigInt(campaign.raisedAmount ?? "0")));
  const goal        = Number(formatEther(BigInt(campaign.goalAmount ?? "0")));
  const progress    = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
  const badge       = STATUS_BADGE[campaign.status as CampaignStatus];
  const CategoryIcon = CATEGORY_ICONS[campaign.category] || Lightbulb;
  const categoryColor = CATEGORY_COLORS[campaign.category] || CATEGORY_COLORS.general;
  const timeLeft    = campaign.deadline ? getTimeLeft(campaign.deadline) : null;
  const isUrgent    = timeLeft && timeLeft !== "Ended" && parseInt(timeLeft) <= 3;

  return (
    <Link href={`/campaigns/${campaign.campaignId}`}>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25 }}
        className="bg-white/90 dark:bg-ink-900/80 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:shadow-2xl hover:shadow-emerald-900/10 transition-shadow duration-300 cursor-pointer overflow-hidden group h-full flex flex-col backdrop-blur-sm"
      >
        <CampaignImage
          imageUrl={campaign.imageUrl}
          title={campaign.title}
          category={campaign.category}
          className="relative overflow-hidden h-48"
          imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          overlay={
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              <span className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-semibold backdrop-blur-sm ${badge?.color}`}>
                {badge?.label}
              </span>
              {isUrgent && (
                <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-medium bg-red-500 text-white flex items-center gap-1">
                  <Clock size={10} /> {timeLeft}
                </span>
              )}
            </>
          }
        />

        <div className="p-5 flex flex-col flex-1">
          {/* Category + time */}
          <div className="flex items-center justify-between mb-2">
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor}`}>
              <CategoryIcon size={10} />
              {campaign.category || "general"}
            </span>
            {timeLeft && !isUrgent && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={10} /> {timeLeft}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 line-clamp-2 mb-1 text-base leading-snug">
            {campaign.title ?? `Campaign #${campaign.campaignId}`}
          </h3>

          {/* Org name */}
          {campaign.orgName && (
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Users size={10} /> {campaign.orgName}
            </p>
          )}

          {/* Description */}
          {campaign.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
              {campaign.description}
            </p>
          )}

          {/* Progress */}
          <div className="mt-auto">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-bold text-gray-900 flex items-center gap-1">
                <TrendingUp size={11} className="text-emerald-500" />
                {raised.toFixed(3)} ETH
              </span>
              <span className="text-emerald-600 font-semibold">{progress.toFixed(0)}%</span>
            </div>

            {/* Gradient progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: progress >= 100
                    ? "linear-gradient(90deg, #059669, #10b981)"
                    : "linear-gradient(90deg, #10b981, #34d399)",
                }}
              />
            </div>

            {/* Footer stats */}
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>Goal: <span className="font-medium text-gray-600">{goal.toFixed(3)} ETH</span></span>
              <span className="flex items-center gap-1">
                <Users size={10} />
                {campaign.donorCount ?? 0} donors
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
