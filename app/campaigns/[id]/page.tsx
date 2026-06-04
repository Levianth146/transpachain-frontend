"use client";
import React from "react";
import { useEffect, useState } from "react";
import { formatEther } from "viem";
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
    api.getCampaign(Number(resolvedParams.id)).then((data) => {
      setCampaign(data);
      setLoading(false);
    });
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

  const raised    = Number(formatEther(BigInt(campaign.raisedAmount ?? "0")));
  const goal      = Number(formatEther(BigInt(campaign.goalAmount ?? "0")));
  const progress  = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
  const badge     = STATUS_BADGE[campaign.status] ?? STATUS_BADGE[0];
  const campaignId = BigInt(campaign.campaignId);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">

      {/* Hero image */}
      {campaign.imageUrl && (
        <img src={campaign.imageUrl} alt={campaign.title}
          className="w-full h-64 object-cover rounded-xl mb-6" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{campaign.title}</h1>
          <p className="text-gray-500">by {campaign.orgName}</p>
        </div>
        <span className={`text-sm px-3 py-1 rounded-full font-medium ${badge.color}`}>
          {badge.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-6">{campaign.description}</p>

      {/* Progress */}
      <div className="bg-white rounded-xl border p-5 mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span className="text-lg font-bold text-gray-900">{raised.toFixed(3)} ETH raised</span>
          <span>Goal: {goal.toFixed(3)} ETH</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
          <div className="bg-emerald-500 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-sm text-gray-500 mb-3">
          <span>{progress.toFixed(0)}% funded</span>
          <span>{campaign.donorCount} donors</span>
        </div>
        <DonorAvatars campaignId={Number(campaign.campaignId)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-4">
          <CampaignStatusTimeline
            status={campaign.status}
            completedMilestones={campaign.completedMilestones ?? 0}
            totalMilestones={campaign.totalMilestones}
            deadline={campaign.deadline}
          />
          <MilestoneTimeline campaignId={campaignId} campaign={campaign} />
          <OrgCampaignActions
            campaignId={campaignId}
            orgAddress={campaign.orgAddress}
            status={campaign.status}
            deadline={campaign.deadline}
            totalMilestones={campaign.totalMilestones}
            completedMilestones={campaign.completedMilestones ?? 0}
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
  );
}
