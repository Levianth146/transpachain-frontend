"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CampaignCard } from "./CampaignCard";
import { CampaignListSkeleton } from "./CampaignCardSkeleton";
import { CampaignFilter, FilterState } from "./CampaignFilter";
import { useSocketEvents } from "@/hooks/useSocket";
import { motion } from "framer-motion";

export function CampaignList() {
  const [allCampaigns, setAllCampaigns] = useState<any[]>([]);
  const [filtered, setFiltered]         = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [mounted, setMounted]     = useState(false);

  const load = () => {
    api.getCampaigns(1, 50).then((data) => {
      const campaigns = data.campaigns ?? [];
      setAllCampaigns(campaigns);
      setFiltered(campaigns);
      setLoading(false);
    });
  };

  useEffect(() => {
    setMounted(true);
    load();
  }, []);

  useSocketEvents({
    donationReceived: () => load(),
    campaignCreated: () => load(),
  });

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
          {filtered.map((campaign, i) => (
            <motion.div
              key={campaign.campaignId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <CampaignCard campaign={campaign} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
