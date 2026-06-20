"use client";
import React from "react";
import { useEffect, useState } from "react";
import {
  formatCampaignAmount,
  formatCampaignAmountLabel,
  getPaymentTokenLabel,
} from "@/lib/format";
import { api } from "@/lib/api";
import { useCharityProgress } from "@/hooks/useCharityCore";
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
import { PageShell } from "@/components/PageShell";
import { AnimatedGradientBackground } from "@/components/ui/AnimatedGradientBackground";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { LearnMoreLink } from "@/components/LearnMoreLink";
import { OnChainChecking } from "@/components/OnChainChecking";
import { ContractExplorer } from "@/components/ContractExplorer";
import { EvidencePanel } from "@/components/EvidencePanel";
import { useSocketEvents } from "@/hooks/useSocket";
import { CampaignStatus } from "@/types";

const STATUS_BADGE: Record<number, { label: string; color: string }> = {
  0: { label: "Active",     color: "bg-holo-mint/20 text-holo-mint ring-1 ring-holo-mint/30" },
  1: { label: "Completed",  color: "bg-holo-lavender/20 text-holo-lavender ring-1 ring-holo-lavender/30" },
  2: { label: "Failed",     color: "bg-red-500/20 text-red-300 ring-1 ring-red-500/30" },
  3: { label: "Cancelled",  color: "bg-gray-500/20 text-gray-300 ring-1 ring-gray-500/30" },
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

  let campaignId: bigint;
  try {
    campaignId = BigInt(campaign?.campaignId ?? resolvedParams.id);
  } catch {
    campaignId = 0n;
  }

  const paymentToken = campaign?.paymentToken ?? 0;
  const { data: onChainProgress } = useCharityProgress(campaignId);

  if (loading) return <CampaignDetailSkeleton />;
  if (!campaign || campaign.error) return (
    <AnimatedGradientBackground variant="dark" className="min-h-screen">
      <div className="p-8 text-center text-white/70">Campaign not found</div>
    </AnimatedGradientBackground>
  );

  const tokenLabel = getPaymentTokenLabel(paymentToken);
  const fractionDigits = paymentToken === 1 ? 2 : 4;

  const toWei = (v: unknown) => {
    try {
      if (v == null || v === "") return 0n;
      return BigInt(String(v));
    } catch {
      return 0n;
    }
  };

  const indexedRaised = Number(formatCampaignAmount(toWei(campaign.raisedAmount), paymentToken));
  const goalFromIndexed = Number(formatCampaignAmount(toWei(campaign.goalAmount), paymentToken));

  const prog = onChainProgress as readonly [bigint, bigint, bigint, bigint, boolean, bigint] | undefined;
  const onChainRaisedWei = prog?.[0];
  const onChainGoalWei = prog?.[1];
  const onChainRaised =
    onChainRaisedWei !== undefined
      ? Number(formatCampaignAmount(onChainRaisedWei, paymentToken))
      : indexedRaised;
  const goal =
    onChainGoalWei !== undefined
      ? Number(formatCampaignAmount(onChainGoalWei, paymentToken))
      : goalFromIndexed;

  const raised = onChainRaisedWei !== undefined ? onChainRaised : indexedRaised;
  const progress  = goal > 0 && Number.isFinite(raised) ? Math.min((raised / goal) * 100, 100) : 0;
  const indexedLag =
    onChainRaisedWei !== undefined &&
    Math.abs(onChainRaised - indexedRaised) > 0.0001;

  const badge     = STATUS_BADGE[campaign.status] ?? STATUS_BADGE[0];

  if (campaignId === 0n) {
    return <div className="p-8 text-center">Campaign data is invalid</div>;
  }

  const totalMilestones = Math.max(0, Number(campaign.totalMilestones) || 0);
  const completedMilestones = Math.max(0, Number(campaign.completedMilestones) || 0);

  return (
    <PageShell
      eyebrow="Campaign"
      title={campaign.title}
      description={`by ${campaign.orgName}`}
      maxWidth="5xl"
      actions={
        <span className={`text-sm px-3 py-1 rounded-full font-medium ${badge.color}`}>
          {badge.label}
        </span>
      }
    >
      <CampaignImage
        imageUrl={campaign.imageUrl}
        title={campaign.title}
        category={campaign.category}
        className="w-full h-64 rounded-xl mb-6 overflow-hidden"
        imgClassName="w-full h-full object-cover"
      />

      <LearnMoreLink className="mb-4" />

      <p className="mb-6 text-white/70">{campaign.description}</p>

      <GlassPanel holoBorder className="p-5 mb-6">
        <div className="mb-2 flex justify-between text-sm text-white/60">
          <div>
            <span className="text-lg font-bold text-white">
              {raised.toFixed(fractionDigits)} {tokenLabel} raised
            </span>
            <span className="ml-2 text-[10px] uppercase tracking-wide text-holo-mint/80">
              {onChainRaisedWei !== undefined ? "on-chain · net after fee" : "indexed · may lag"}
            </span>
          </div>
          <span>Goal: {goal.toFixed(fractionDigits)} {tokenLabel}</span>
        </div>
        {indexedLag && (
          <p className="mb-2 text-[11px] text-amber-300/90">
            Indexed total {indexedRaised.toFixed(fractionDigits)} {tokenLabel} — backend catching up.
            Escrow &amp; on-chain verification show live values.
          </p>
        )}
        <div className="mb-2 h-3 w-full rounded-full bg-white/10">
          <div className="h-3 rounded-full bg-holo-gradient transition-all"
            style={{ width: `${progress}%` }} />
        </div>
        <div className="mb-3 flex justify-between text-sm text-white/60">
          <span>{progress.toFixed(0)}% funded</span>
          <span>{campaign.donorCount} donors · 1% platform fee on donations</span>
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
          <OnChainChecking campaignId={campaignId} paymentToken={paymentToken} />
          <ContractExplorer campaignId={campaignId} paymentToken={paymentToken} />
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
            paymentToken={paymentToken}
            indexedRaised={indexedRaised}
          />
          <DonateModal campaignId={campaignId} paymentToken={paymentToken} />
          <RefundPanel campaignId={campaignId} paymentToken={paymentToken} />
          <VotingPanel campaignId={campaignId} />
        </div>
      </div>

    </PageShell>
  );
}
