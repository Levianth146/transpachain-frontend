"use client";
import { useCampaign } from "@/hooks/useCharityCore";
import { MilestoneTimeline } from "@/components/MilestoneTimeline";
import { DonateModal } from "@/components/DonateModal";
import { VotingPanel } from "@/components/VotingPanel";

interface Props { params: { id: string } }

export default function CampaignDetailPage({ params }: Props) {
  const campaignId = BigInt(params.id);
  const { data: campaign, isLoading } = useCampaign(campaignId);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!campaign)  return <div className="p-8">Campaign not found</div>;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Campaign #{params.id}</h1>
      {/* Campaign metadata from IPFS / backend goes here */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <MilestoneTimeline campaignId={campaignId} campaign={campaign as any} />
        </div>
        <div className="space-y-4">
          <DonateModal campaignId={campaignId} />
          <VotingPanel campaignId={campaignId} />
        </div>
      </div>
    </main>
  );
}
