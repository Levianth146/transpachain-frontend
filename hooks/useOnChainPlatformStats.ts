"use client";

import { useMemo } from "react";
import { useCampaignProgressBatch, useTotalCampaigns } from "@/hooks/useCharityCore";

type CampaignLike = {
  campaignId: number;
  paymentToken?: number;
};

/** Aggregate on-chain raised totals and campaign count for hero stats. */
export function useOnChainPlatformStats(campaigns: CampaignLike[]) {
  const ids = campaigns.map((c) => c.campaignId);
  const { data: progressResults, isSuccess: progressReady } = useCampaignProgressBatch(ids);
  const { data: totalOnChain, isSuccess: totalReady } = useTotalCampaigns();

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
        const paymentToken = campaigns[index]?.paymentToken ?? 0;
        if (paymentToken === 1) totalUsdc += raised;
        else totalEth += raised;
      });
    }

    return {
      ready: progressReady && totalReady,
      totalCampaigns: totalOnChain !== undefined ? Number(totalOnChain) : null,
      totalEthWei: totalEth,
      totalUsdcWei: totalUsdc,
      raisedById,
    };
  }, [campaigns, ids, progressReady, progressResults, totalOnChain, totalReady]);
}
