import { formatEther } from "viem";

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
