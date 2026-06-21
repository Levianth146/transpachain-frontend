"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { CampaignCard } from "@/components/CampaignCard";
import { CampaignListSkeleton } from "@/components/CampaignCardSkeleton";
import { useCampaignProgressBatch } from "@/hooks/useCharityCore";
import { useSocketEvents } from "@/hooks/useSocket";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CampaignStatus } from "@/types";

const CATEGORIES = ["All", "Education", "Healthcare", "Environment", "Disaster", "Community"];

export function LiveCampaignsSection() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const load = () => {
    api
      .getCampaigns(1, 12)
      .then((d) => {
        setCampaigns(d.campaigns ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  useSocketEvents({
    donationReceived: () => load(),
    campaignCreated: () => load(),
  });

  const filtered = useMemo(() => {
    let list = campaigns.filter((c) => c.status === CampaignStatus.Active);
    if (activeCategory !== "All") {
      list = list.filter(
        (c) => (c.category ?? "general").toLowerCase() === activeCategory.toLowerCase()
      );
    }
    return list.slice(0, 6);
  }, [campaigns, activeCategory]);

  const ids = useMemo(() => filtered.map((c) => Number(c.campaignId)), [filtered]);
  const { data: progressResults } = useCampaignProgressBatch(ids);

  const onChainRaisedById = useMemo(() => {
    const map = new Map<number, bigint>();
    progressResults?.forEach((result, index) => {
      if (result.status === "success" && result.result) {
        map.set(ids[index], result.result[0] as bigint);
      }
    });
    return map;
  }, [ids, progressResults]);

  const activeCount = campaigns.filter((c) => c.status === CampaignStatus.Active).length;

  return (
    <section id="campaigns" className="relative z-10 mx-auto max-w-[1380px] px-4 py-24 sm:px-10">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <SectionHeader
          number="01"
          label="Live Now"
          title="Give to what matters."
        />
        <Link href="/campaigns" className="btn-ghost-dark shrink-0 whitespace-nowrap">
          View all {activeCount || "→"}
        </Link>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={
              activeCategory === cat
                ? "rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 px-[18px] py-2 text-[13px] font-semibold text-white"
                : "rounded-full border border-white/[0.08] bg-white/[0.05] px-[18px] py-2 text-[13px] font-medium text-text-primary/48 transition-colors hover:bg-white/[0.09] hover:text-text-primary"
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <CampaignListSkeleton count={6} />
      ) : filtered.length === 0 ? (
        <p className="text-center text-text-primary/40">No active campaigns in this category.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((campaign) => (
            <CampaignCard
              key={campaign.campaignId}
              campaign={campaign}
              onChainRaisedWei={onChainRaisedById.get(Number(campaign.campaignId))}
              variant="dark"
            />
          ))}
        </div>
      )}
    </section>
  );
}
