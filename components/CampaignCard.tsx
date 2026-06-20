"use client";
import Link from "next/link";
import {
  formatCampaignAmount,
  formatCampaignAmountLabel,
  getCampaignFractionDigits,
  getPaymentTokenLabel,
} from "@/lib/format";
import { motion } from "framer-motion";
import type { Campaign } from "@/types";
import { CampaignStatus } from "@/types";
import { BookOpen, Heart, AlertTriangle, Leaf, Users, Lightbulb, Clock, TrendingUp } from "lucide-react";
import { CampaignImage } from "@/components/CampaignImage";

const STATUS_BADGE: Record<CampaignStatus, { label: string; color: string }> = {
  [CampaignStatus.Active]:     { label: "Active",    color: "bg-holo-mint/20 text-holo-mint ring-1 ring-holo-mint/30" },
  [CampaignStatus.Successful]: { label: "Completed", color: "bg-holo-lavender/20 text-holo-lavender ring-1 ring-holo-lavender/30" },
  [CampaignStatus.Failed]:     { label: "Failed",    color: "bg-red-500/20 text-red-300 ring-1 ring-red-500/30" },
  [CampaignStatus.Cancelled]:  { label: "Cancelled", color: "bg-white/10 text-white/50 ring-1 ring-white/20" },
};

const CATEGORY_COLORS: Record<string, string> = {
  education:   "bg-holo-lavender/15 text-holo-lavender",
  healthcare:  "bg-holo-pink/15 text-holo-pink",
  disaster:    "bg-orange-500/15 text-orange-300",
  environment: "bg-holo-mint/15 text-holo-mint",
  community:   "bg-holo-lavender/15 text-holo-lavender",
  general:     "bg-white/10 text-white/60",
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

function isUrgentDeadline(timeLeft: string | null): boolean {
  if (!timeLeft || timeLeft === "Ended") return false;
  const match = timeLeft.match(/^(\d+)d left$/);
  return match ? Number(match[1]) <= 3 : false;
}

/**
 * Campaign card: metadata from Mongo/API; raised amount always on-chain (never Mongo raisedAmount).
 */
export function CampaignCard({
  campaign,
  onChainRaisedWei,
}: {
  campaign: any;
  onChainRaisedWei?: bigint;
}) {
  const paymentToken = campaign.paymentToken ?? 0;
  const tokenLabel   = getPaymentTokenLabel(paymentToken);
  const fractionDigits = getCampaignFractionDigits(paymentToken);
  const raised =
    onChainRaisedWei !== undefined
      ? Number(formatCampaignAmount(onChainRaisedWei, paymentToken))
      : null;
  const raisedLabel =
    onChainRaisedWei !== undefined
      ? formatCampaignAmountLabel(onChainRaisedWei, paymentToken, fractionDigits)
      : "…";
  const goal = Number(formatCampaignAmount(campaign.goalAmount ?? "0", paymentToken));
  const progress = raised !== null && goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
  const badge       = STATUS_BADGE[campaign.status as CampaignStatus];
  const CategoryIcon = CATEGORY_ICONS[campaign.category] || Lightbulb;
  const categoryColor = CATEGORY_COLORS[campaign.category] || CATEGORY_COLORS.general;
  const timeLeft    = campaign.deadline ? getTimeLeft(campaign.deadline) : null;
  const isUrgent    = isUrgentDeadline(timeLeft);

  return (
    <Link href={`/campaigns/${campaign.campaignId}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.02, y: -4 }}
        className="browser-window group flex h-full cursor-pointer flex-col overflow-hidden transition-all duration-300 hover:border-brand-purple/25 hover:shadow-2xl hover:shadow-brand-purple/10"
      >
        <div className="browser-chrome py-2">
          <div className="browser-dots" aria-hidden>
            <span className="browser-dot browser-dot-red" />
            <span className="browser-dot browser-dot-yellow" />
            <span className="browser-dot browser-dot-green" />
          </div>
          <span className="browser-title">
            {campaign.title ?? `Campaign #${campaign.campaignId}`}
          </span>
          <div className="browser-dots browser-dots-ghost" aria-hidden>
            <span className="browser-dot browser-dot-ghost" />
            <span className="browser-dot browser-dot-ghost" />
            <span className="browser-dot browser-dot-ghost" />
          </div>
        </div>
        <CampaignImage
          imageUrl={campaign.imageUrl}
          title={campaign.title}
          category={campaign.category}
          className="relative overflow-hidden h-48"
          imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          overlay={
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-holo-mint/5 pointer-events-none" />
              <span className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-semibold backdrop-blur-sm ${badge?.color}`}>
                {badge?.label}
              </span>
              {isUrgent && (
                <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-medium bg-holo-pink/90 text-black flex items-center gap-1">
                  <Clock size={10} /> {timeLeft}
                </span>
              )}
            </>
          }
        />

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor}`}>
              <CategoryIcon size={10} />
              {campaign.category || "general"}
            </span>
            {timeLeft && !isUrgent && (
              <span className="flex items-center gap-1 text-xs text-white/40">
                <Clock size={10} /> {timeLeft}
              </span>
            )}
          </div>

          <h3 className="mb-1 line-clamp-2 font-display text-base font-bold leading-snug text-white">
            {campaign.title ?? `Campaign #${campaign.campaignId}`}
            {campaign.title && campaign.campaignId != null && (
              <span className="ml-1.5 text-xs font-normal text-white/40">#{campaign.campaignId}</span>
            )}
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

          <div className="mt-auto">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1 font-bold text-holo-mint">
                <TrendingUp size={11} />
                {raisedLabel}
              </span>
              <span className="font-semibold text-holo-lavender">
                {raised !== null ? `${progress.toFixed(0)}%` : "—"}
              </span>
            </div>

            <div className="mb-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-2 rounded-full bg-holo-gradient transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

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
