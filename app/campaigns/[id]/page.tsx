"use client";
import React from "react";
import { useEffect, useState } from "react";
import { formatCampaignAmount, getPaymentTokenLabel } from "@/lib/format";
import { api } from "@/lib/api";
import { MilestoneTimeline } from "@/components/MilestoneTimeline";
import { DonateModal } from "@/components/DonateModal";
import { RefundPanel } from "@/components/RefundPanel";
import { VotingPanel } from "@/components/VotingPanel";
import { CampaignDetailSkeleton } from "@/components/CampaignDetailSkeleton";
import { DonorAvatars } from "@/components/DonorAvatars";
import { EscrowTransparencyCard } from "@/components/EscrowTransparencyCard";
import { OrgCampaignActions } from "@/components/OrgCampaignActions";
import { CampaignStatusTimeline } from "@/components/CampaignStatusTimeline";
import { CampaignImage } from "@/components/CampaignImage";
import { AnimatedGradientBackground } from "@/components/ui/AnimatedGradientBackground";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { LearnMoreLink } from "@/components/LearnMoreLink";
import { OnChainChecking } from "@/components/OnChainChecking";
import { ContractExplorer } from "@/components/ContractExplorer";
import { EvidencePanel } from "@/components/EvidencePanel";
import { useSocketEvents } from "@/hooks/useSocket";
import { CampaignStatus } from "@/types";

const STATUS_BADGE: Record<number, { label: string; color: string }> = {
  0: { label: "Active",     color: "bg-emerald-100 text-emerald-800" },
  1: { label: "Completed",  color: "bg-blue-100 text-blue-800"       },
  2: { label: "Failed",     color: "bg-red-100 text-red-800"         },
  3: { label: "Cancelled",  color: "bg-gray-100 text-gray-800"       },
};

interface Props { params: Promise<{ id: string }> }

export default function CampaignDetailPage({ params }: Props) {
  const resolvedParams = React.use(params);

  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading]   = useState(true);

  const load = () => {
    setLoading(true);
    api
      .getCampaign(Number(resolvedParams.id))
      .then((data) => {
        setCampaign(data);
      })
      .catch(() => setCampaign({ error: true }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [resolvedParams.id]);

  useSocketEvents({
    donationReceived: (d: { campaignId?: number }) => {
      if (d?.campaignId === Number(resolvedParams.id)) load();
    },
    campaignUpdated: (d: { campaignId?: number }) => {
      if (d?.campaignId === Number(resolvedParams.id)) load();
    },
    deadlineExtended: (d: { campaignId?: number }) => {
      if (d?.campaignId === Number(resolvedParams.id)) load();
    },
  });

  if (loading) return <CampaignDetailSkeleton />;
  if (!campaign || campaign.error)  return <div className="p-8 text-center">Campaign not found</div>;

  const toWei = (v: unknown) => {
    try {
      if (v == null || v === "") return 0n;
      return BigInt(String(v));
    } catch {
      return 0n;
    }
  };

  const paymentToken = campaign.paymentToken ?? 0;
  const tokenLabel = getPaymentTokenLabel(paymentToken);
  const fractionDigits = paymentToken === 1 ? 2 : 3;
  const raised    = Number(formatCampaignAmount(toWei(campaign.raisedAmount), paymentToken));
  const goal      = Number(formatCampaignAmount(toWei(campaign.goalAmount), paymentToken));
  const progress  = goal > 0 && Number.isFinite(raised) ? Math.min((raised / goal) * 100, 100) : 0;
  const badge     = STATUS_BADGE[campaign.status] ?? STATUS_BADGE[0];
  let campaignId: bigint;
  try {
    campaignId = BigInt(campaign.campaignId ?? resolvedParams.id);
  } catch {
    return <div className="p-8 text-center">Campaign data is invalid</div>;
  }
  const totalMilestones = Math.max(0, Number(campaign.totalMilestones) || 0);
  const completedMilestones = Math.max(0, Number(campaign.completedMilestones) || 0);

  return (
    <AnimatedGradientBackground variant="dark" className="min-h-screen">
    <main className="max-w-5xl mx-auto px-4 py-10">

      <CampaignImage
        imageUrl={campaign.imageUrl}
        title={campaign.title}
        category={campaign.category}
        className="w-full h-64 rounded-xl mb-6 overflow-hidden"
        imgClassName="w-full h-full object-cover"
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-3xl font-display text-gray-900 dark:text-cream-100 mb-1">{campaign.title}</h1>
          <p className="text-gray-500">by {campaign.orgName}</p>
        </div>
        <span className={`text-sm px-3 py-1 rounded-full font-medium ${badge.color}`}>
          {badge.label}
        </span>
      </div>

      <LearnMoreLink className="mb-4" />

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 mb-6">{campaign.description}</p>

      {/* Progress */}
      <GlassPanel className="p-5 mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span className="text-lg font-bold text-gray-900 dark:text-cream-100">{raised.toFixed(fractionDigits)} {tokenLabel} raised</span>
          <span>Goal: {goal.toFixed(fractionDigits)} {tokenLabel}</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-3 mb-2">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-sm text-gray-500 mb-3">
          <span>{progress.toFixed(0)}% funded</span>
          <span>{campaign.donorCount} donors</span>
        </div>
        <DonorAvatars campaignId={Number(campaign.campaignId)} />
      </GlassPanel>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-4">
          <CampaignStatusTimeline
            status={campaign.status ?? 0}
            completedMilestones={completedMilestones}
            totalMilestones={totalMilestones}
            deadline={Number(campaign.deadline) || 0}
          />
          <OnChainChecking campaignId={campaignId} />
          <ContractExplorer campaignId={campaignId} />
          <EvidencePanel campaignId={Number(campaign.campaignId)} />
          <MilestoneTimeline campaignId={campaignId} campaign={campaign} />
          <OrgCampaignActions
            campaignId={campaignId}
            orgAddress={campaign.orgAddress ?? ""}
            status={campaign.status ?? 0}
            deadline={Number(campaign.deadline) || 0}
            totalMilestones={totalMilestones}
            completedMilestones={completedMilestones}
          />
        </div>
        <div className="space-y-4">
          <EscrowTransparencyCard
            campaignId={campaignId}
            paymentToken={campaign.paymentToken ?? 0}
          />
          <DonateModal campaignId={campaignId} paymentToken={campaign.paymentToken ?? 0} />
          <RefundPanel campaignId={campaignId} paymentToken={campaign.paymentToken ?? 0} />
          <VotingPanel campaignId={campaignId} />
        </div>
      </div>

    </main>
    </AnimatedGradientBackground>
  );
}
