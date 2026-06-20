"use client";
import Link from "next/link";
import { formatCampaignAmount, getPaymentTokenLabel } from "@/lib/format";
import { motion } from "framer-motion";
import type { Campaign } from "@/types";
import { CampaignStatus } from "@/types";
import { BookOpen, Heart, AlertTriangle, Leaf, Users, Lightbulb, Clock, TrendingUp } from "lucide-react";
import { CampaignImage } from "@/components/CampaignImage";

const STATUS_BADGE: Record<CampaignStatus, { label: string; color: string }> = {
  [CampaignStatus.Active]:     { label: "Active",    color: "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30" },
  [CampaignStatus.Successful]: { label: "Completed", color: "bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30"      },
  [CampaignStatus.Failed]:     { label: "Failed",    color: "bg-red-500/20 text-red-300 ring-1 ring-red-500/30"        },
  [CampaignStatus.Cancelled]:  { label: "Cancelled", color: "bg-gray-500/20 text-gray-300 ring-1 ring-gray-500/30"      },
};

const CATEGORY_COLORS: Record<string, string> = {
  education:   "bg-blue-500/15 text-blue-300",
  healthcare:  "bg-red-500/15 text-red-300",
  disaster:    "bg-orange-500/15 text-orange-300",
  environment: "bg-green-500/15 text-green-300",
  community:   "bg-purple-500/15 text-purple-300",
  general:     "bg-gray-500/15 text-gray-300",
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
  const paymentToken = campaign.paymentToken ?? 0;
  const tokenLabel   = getPaymentTokenLabel(paymentToken);
  const fractionDigits = paymentToken === 1 ? 2 : 3;
  const raised      = Number(formatCampaignAmount(campaign.raisedAmount ?? "0", paymentToken));
  const goal        = Number(formatCampaignAmount(campaign.goalAmount ?? "0", paymentToken));
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
        className="flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm transition-shadow duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-accent-shine/5 group"
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
          <h3 className="mb-1 line-clamp-2 text-base font-bold leading-snug text-white">
            {campaign.title ?? `Campaign #${campaign.campaignId}`}
          </h3>

          {campaign.orgName && (
            <p className="mb-2 flex items-center gap-1 text-xs text-white/50">
              <Users size={10} /> {campaign.orgName}
            </p>
          )}

          {campaign.description && (
            <p className="mb-4 line-clamp-2 flex-1 text-sm text-white/60">
              {campaign.description}
            </p>
          )}

          {/* Progress */}
          <div className="mt-auto">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1 font-bold text-holo-mint">
                <TrendingUp size={11} />
                {raised.toFixed(fractionDigits)} {tokenLabel}
              </span>
              <span className="font-semibold text-holo-lavender">{progress.toFixed(0)}%</span>
            </div>

            <div className="mb-3 h-2 w-full rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-holo-gradient transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Footer stats */}
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>Goal: <span className="font-medium text-white/70">{goal.toFixed(fractionDigits)} {tokenLabel}</span></span>
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
