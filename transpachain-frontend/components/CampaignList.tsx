"use client";
import { useTotalCampaigns } from "@/hooks/useCharityCore";
import { CampaignCard } from "./CampaignCard";
import { useCampaign } from "@/hooks/useCharityCore";

function CampaignItem({ id }: { id: bigint }) {
  const { data: campaign } = useCampaign(id);
  if (!campaign) return null;
  return <CampaignCard campaign={campaign as any} />;
}

export function CampaignList() {
  const { data: total } = useTotalCampaigns();
  const count = Number(total ?? 0);

  if (count === 0) return (
    <div className="text-center py-20 text-gray-400">No campaigns yet.</div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }, (_, i) => (
        <CampaignItem key={i + 1} id={BigInt(i + 1)} />
      ))}
    </div>
  );
}
