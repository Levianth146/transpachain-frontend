import { formatEther, formatUnits, parseEther, parseUnits } from "viem";

/** Decimals for campaign payment token (0 = ETH, 1 = USDC) */
export function getPaymentTokenDecimals(paymentToken: number): 6 | 18 {
  return paymentToken === 1 ? 6 : 18;
}

export function getPaymentTokenLabel(paymentToken: number): "ETH" | "USDC" {
  return paymentToken === 1 ? "USDC" : "ETH";
}

/** Format on-chain campaign amount for the given payment token */
export function formatCampaignAmount(amount: bigint | string, paymentToken: number): string {
  const value = typeof amount === "bigint" ? amount : BigInt(amount || "0");
  return paymentToken === 1 ? formatUnits(value, 6) : formatEther(value);
}

/** Parse user-entered goal amount into on-chain units */
export function parseCampaignGoalAmount(value: string, paymentToken: number): bigint {
  return paymentToken === 1 ? parseUnits(value, 6) : parseEther(value);
}

/** Format quadratic vote weight (√wei units) for display */
export function formatQuadraticVoteWeight(value: string | number | bigint | undefined | null): string {
  if (value === undefined || value === null) return "0";
  try {
    const sqrtWei = typeof value === "bigint" ? value : BigInt(String(value));
    const units = Number(sqrtWei) / 1e9;
    if (units === 0) return "0";
    if (units < 0.01) return units.toExponential(2);
    return units.toFixed(units < 1 ? 4 : 2);
  } catch {
    return String(value);
  }
}

/** Format vote weight stored as wei (string or number) to human-readable ETH */
export function formatVoteWeight(value: string | number | bigint | undefined | null): string {
  if (value === undefined || value === null) return "0";
  try {
    const wei = typeof value === "bigint" ? value : BigInt(String(value));
    const eth = Number(formatEther(wei));
    if (eth === 0) return "0";
    if (eth < 0.001) return eth.toExponential(2);
    return eth.toFixed(eth < 1 ? 4 : 2);
  } catch {
    return String(value);
  }
}
