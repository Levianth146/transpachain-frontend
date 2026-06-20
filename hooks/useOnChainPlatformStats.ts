"use client";

import { useMemo } from "react";
import {
  useCampaignPaymentTokens,
  useCampaignProgressBatch,
  useTotalCampaigns,
} from "@/hooks/useCharityCore";

/**
 * Aggregate on-chain raised totals across ALL campaigns (ids 1..totalCampaigns).
 * Amounts always from getCharityProgress; paymentToken from getCampaign for ETH/USDC split.
 */
export function useOnChainPlatformStats() {
  const { data: totalOnChain, isSuccess: totalReady } = useTotalCampaigns();
  const total = totalOnChain !== undefined ? Number(totalOnChain) : 0;

  const ids = useMemo(
    () => (total > 0 ? Array.from({ length: total }, (_, i) => i + 1) : []),
    [total]
  );

  const { data: progressResults, isSuccess: progressReady } = useCampaignProgressBatch(ids);
  const { data: campaignResults, isSuccess: tokensReady } = useCampaignPaymentTokens(ids);

  return useMemo(() => {
    let totalEth = 0n;
    let totalUsdc = 0n;
    const raisedById = new Map<number, bigint>();

    if (progressReady && progressResults) {
      progressResults.forEach((result, index) => {
        if (result.status !== "success" || !result.result) return;
        const raised = result.result[0] as bigint;
        const campaignId = ids[index];
        raisedById.set(campaignId, raised);

        let paymentToken = 0;
        const campResult = campaignResults?.[index];
        if (campResult?.status === "success" && campResult.result) {
          paymentToken = Number((campResult.result as { paymentToken?: number }).paymentToken ?? 0);
        }

        if (paymentToken === 1) totalUsdc += raised;
        else totalEth += raised;
      });
    }

    const ready = totalReady && (total === 0 || (progressReady && tokensReady));

    return {
      ready,
      totalCampaigns: totalOnChain !== undefined ? Number(totalOnChain) : null,
      totalEthWei: totalEth,
      totalUsdcWei: totalUsdc,
      raisedById,
    };
  }, [campaignResults, ids, progressReady, progressResults, tokensReady, total, totalOnChain, totalReady]);
}
