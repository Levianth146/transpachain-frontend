"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CampaignCard } from "./CampaignCard";

export function CampaignList() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [mounted, setMounted]     = useState(false);

  useEffect(() => {
    setMounted(true);
    api.getCampaigns().then((data) => {
      setCampaigns(data.campaigns ?? []);
      setLoading(false);
    });
  }, []);

  if (!mounted) return null;

  if (loading) return (
    <div className="text-center py-20 text-gray-400">Loading campaigns...</div>
  );

  if (campaigns.length === 0) return (
    <div className="text-center py-20 text-gray-400">No campaigns yet.</div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.campaignId} campaign={campaign} />
      ))}
    </div>
  );
}
