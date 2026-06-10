/** Tier thresholds match ImpactNFT.sol */
export const TIER_LABELS = ["Bronze", "Silver", "Gold"] as const;

export function tierFromEthAmount(amountEth: number): 0 | 1 | 2 {
  if (amountEth >= 0.1) return 2;
  if (amountEth >= 0.01) return 1;
  return 0;
}

export function tierImagePath(tier: number): string {
  const map = ["/nft/bronze.svg", "/nft/silver.svg", "/nft/gold.svg"];
  return map[Math.min(2, Math.max(0, tier))] ?? map[0];
}

export function tierLabel(tier: number): string {
  return TIER_LABELS[Math.min(2, Math.max(0, tier))] ?? "Bronze";
}
