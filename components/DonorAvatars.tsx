"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getDicebearAvatar } from "@/lib/images";

function addressInitials(address: string): string {
  return address.slice(2, 4).toUpperCase();
}

function MiniAvatar({ address }: { address: string }) {
  const [failed, setFailed] = useState(false);
  const src = getDicebearAvatar(address);

  if (failed) {
    const hue = parseInt(address.slice(2, 8), 16) % 360;
    return (
      <div
        className="h-7 w-7 rounded-full ring-2 ring-white dark:ring-zinc-900 shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
        style={{ backgroundColor: `hsl(${hue}, 55%, 45%)` }}
        title={address}
      >
        {addressInitials(address)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      width={28}
      height={28}
      className="h-7 w-7 rounded-full ring-2 ring-white dark:ring-zinc-900 shrink-0 bg-gray-100 object-cover"
      title={address}
      loading="lazy"
      onError={() => setFailed(true)}
    />
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
    <div className="flex items-center gap-2 pt-1">
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
