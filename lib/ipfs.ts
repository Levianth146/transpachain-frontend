const IPFS_GATEWAYS = [
  "https://gateway.pinata.cloud/ipfs/",
  "https://ipfs.io/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
] as const;

/** CIDv0 (Qm…) or CIDv1 (bafy… / ba…) — excludes obvious demo strings. */
const CID_PATTERN = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|ba[a-z2-7]{56,}|baf[a-z2-7]+)$/i;

const PLACEHOLDER_PATTERN = /proofcid|placeholder|demo|example|test_cid|fake/i;

export function extractIpfsCid(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("ipfs://")) {
    const cid = trimmed.slice(7).replace(/^ipfs\//, "").split("/")[0];
    return cid || null;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    const match = trimmed.match(/\/ipfs\/([^/?#]+)/i);
    return match?.[1] ?? null;
  }

  return trimmed.split("/")[0] || null;
}

export function isPlaceholderProofCid(raw?: string | null): boolean {
  if (!raw?.trim()) return false;
  const cid = extractIpfsCid(raw) ?? raw.trim();
  return PLACEHOLDER_PATTERN.test(cid);
}

export function isValidIpfsCid(raw?: string | null): boolean {
  if (!raw?.trim()) return false;
  const cid = extractIpfsCid(raw);
  if (!cid || isPlaceholderProofCid(cid)) return false;
  return CID_PATTERN.test(cid);
}

/** Primary gateway URL for a valid CID, or null for invalid/placeholder values. */
export function getProofIpfsUrl(raw?: string | null): string | null {
  if (!raw?.trim()) return null;

  if (/^https?:\/\//i.test(raw.trim()) && !raw.trim().includes("/ipfs/")) {
    try {
      const url = new URL(raw.trim());
      if (url.hostname && (url.hostname.includes(".") || url.hostname === "localhost")) {
        return raw.trim();
      }
    } catch {
      return null;
    }
  }

  const cid = extractIpfsCid(raw);
  if (!cid || !isValidIpfsCid(cid)) return null;
  return `${IPFS_GATEWAYS[0]}${cid}`;
}

export function getIpfsGatewayUrls(cid: string): string[] {
  if (!isValidIpfsCid(cid)) return [];
  return IPFS_GATEWAYS.map((gw) => `${gw}${extractIpfsCid(cid)!}`);
}
