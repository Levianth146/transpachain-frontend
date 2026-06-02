"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

function seedFromAddress(address: string): number {
  const hex = address.slice(2, 10);
  return parseInt(hex, 16) || 1;
}

function MiniAvatar({ address }: { address: string }) {
  const seed = seedFromAddress(address);
  const hue = seed % 360;
  return (
    <span
      className="inline-flex h-7 w-7 rounded-full ring-2 ring-white dark:ring-zinc-900 items-center justify-center text-[10px] font-mono text-white shrink-0"
      style={{ backgroundColor: `hsl(${hue}, 55%, 45%)` }}
      title={address}
    >
      {address.slice(2, 4).toUpperCase()}
    </span>
  );
}

export function DonorAvatars({ campaignId }: { campaignId: number }) {
  const [donors, setDonors] = useState<string[]>([]);

  useEffect(() => {
    api.getCampaignDonations(campaignId).then((rows) => {
      const unique = [...new Set((rows as { donor: string }[]).map((d) => d.donor))].slice(0, 5);
      setDonors(unique);
    }).catch(() => {});
  }, [campaignId]);

  if (donors.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {donors.map((d) => (
          <MiniAvatar key={d} address={d} />
        ))}
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {donors.length} recent donor{donors.length !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
