"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CampaignCard } from "./CampaignCard";
import { CampaignListSkeleton } from "./CampaignCardSkeleton";
import { CampaignFilter, FilterState } from "./CampaignFilter";

export function CampaignList() {
  const [allCampaigns, setAllCampaigns] = useState<any[]>([]);
  const [filtered, setFiltered]         = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [mounted, setMounted]     = useState(false);

  useEffect(() => {
    setMounted(true);
    api.getCampaigns().then((data) => {
      const valid = (data.campaigns ?? []).filter((c: any) => c.title && c.title.length > 0);
      setAllCampaigns(valid);
      setFiltered(valid);
      setLoading(false);
    });
  }, []);

  const handleFilter = (filters: FilterState) => {
    let result = [...allCampaigns];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.orgName?.toLowerCase().includes(q)
      );
    }
    if (filters.category) {
      result = result.filter(c => c.category?.toLowerCase() === filters.category);
    }
    if (filters.status !== "") {
      result = result.filter(c => c.status === Number(filters.status));
    }

    setFiltered(result);
  };

  if (!mounted) return null;

  if (loading) return <CampaignListSkeleton />;

  if (allCampaigns.length === 0) return (
    <div className="text-center py-20 text-gray-400">No campaigns yet.</div>
  );

  return (
    <div>
      <CampaignFilter onFilter={handleFilter} total={filtered.length} />
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No campaigns found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((campaign) => (
            <CampaignCard key={campaign.campaignId} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
}
