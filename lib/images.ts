const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

/** Returns a loadable http(s) URL or null for invalid/garbage values like "hjhj". */
export function normalizeImageUrl(raw?: string | null): string | null {
  if (!raw || typeof raw !== "string") return null;

  const trimmed = raw.trim();
  if (trimmed.length < 6) return null;

  if (trimmed.startsWith("ipfs://")) {
    const cid = trimmed.slice(7).replace(/^ipfs\//, "");
    return cid ? `${IPFS_GATEWAY}${cid}` : null;
  }

  if (/^(Qm[1-9A-HJ-NP-Za-km-z]{44}|ba[a-z2-7]{56,}|baf[a-z2-7]+)$/i.test(trimmed)) {
    return `${IPFS_GATEWAY}${trimmed}`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      if (!url.hostname || url.hostname.length < 3) return null;
      if (!url.hostname.includes(".") && url.hostname !== "localhost") return null;
      return trimmed;
    } catch {
      return null;
    }
  }

  return null;
}

export function getDicebearAvatar(seed: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
    seed.toLowerCase()
  )}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

export function getCategoryFallbackGradient(category?: string): string {
  const map: Record<string, string> = {
    education:   "from-blue-400 via-indigo-500 to-blue-600",
    healthcare:  "from-rose-400 via-red-500 to-rose-600",
    disaster:    "from-orange-400 via-amber-500 to-orange-600",
    environment: "from-emerald-400 via-green-500 to-teal-600",
    community:   "from-purple-400 via-violet-500 to-purple-600",
  };
  return map[category ?? ""] ?? "from-emerald-400 via-teal-500 to-emerald-600";
}
