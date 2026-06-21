"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const FALLBACK_ITEMS = [
  { title: "🎗️ Clean Water for Rural Vietnam", amount: "0.8 ETH · 62%" },
  { title: "💊 Medical Aid for Gaza", amount: "4,800 USDC · 96%" },
  { title: "📚 Flood School Rebuild", amount: "0.4 ETH · 40%" },
  { title: "🌿 Reforestation Project", amount: "0.2 ETH · 20%" },
  { title: "🏥 Rural Healthcare Clinic", amount: "2,100 USDC · 42%" },
];

function TickerContent({ items }: { items: { title: string; amount: string }[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="flex animate-ticker items-center whitespace-nowrap">
      {doubled.map((item, i) => (
        <span key={`${item.title}-${i}`} className="flex items-center">
          <span className="px-5 text-[13px] font-medium text-text-primary/48">
            {item.title}
          </span>
          <span className="font-display text-xs font-bold text-emerald-500">
            {item.amount}
          </span>
          <span className="px-[18px] text-sm text-text-primary/18">◆</span>
        </span>
      ))}
    </div>
  );
}

export function TickerMarquee() {
  const [items, setItems] = useState(FALLBACK_ITEMS);

  useEffect(() => {
    api
      .getCampaigns(1, 5)
      .then((d) => {
        const campaigns = d.campaigns ?? [];
        if (campaigns.length === 0) return;
        setItems(
          campaigns.map((c: any, i: number) => {
            const emoji =
              {
                education: "📚",
                healthcare: "💊",
                environment: "🌿",
                disaster: "🆘",
                community: "🏘️",
              }[c.category as string] ?? "🎗️";
            return {
              title: `${emoji} ${c.title ?? `Campaign #${c.campaignId}`}`,
              amount: FALLBACK_ITEMS[i % FALLBACK_ITEMS.length]?.amount ?? "—",
            };
          })
        );
      })
      .catch(() => {});
  }, []);

  return (
    <div className="relative z-10 flex h-[46px] items-center overflow-hidden border-y border-white/[0.06] bg-white/[0.018]">
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-[2] w-20 bg-gradient-to-r from-bg-base to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-[2] w-20 bg-gradient-to-l from-bg-base to-transparent" />
      <TickerContent items={items} />
    </div>
  );
}
