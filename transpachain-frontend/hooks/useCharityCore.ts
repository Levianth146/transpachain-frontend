"use client";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { ADDRESSES, CHARITY_CORE_ABI } from "@/lib/contracts";
import type { Campaign } from "@/types";

// ─── Read hooks ────────────────────────────────────────────────

export function useCampaign(campaignId: bigint) {
  return useReadContract({
    address: ADDRESSES.charityCore,
    abi:     CHARITY_CORE_ABI,
    functionName: "getCampaign",
    args:    [campaignId],
  });
}

export function useTotalCampaigns() {
  return useReadContract({
    address: ADDRESSES.charityCore,
    abi:     CHARITY_CORE_ABI,
    functionName: "totalCampaigns",
  });
}

export function useOrgCampaigns(orgAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: ADDRESSES.charityCore,
    abi:     CHARITY_CORE_ABI,
    functionName: "getCampaignsByOrg",
    args:    orgAddress ? [orgAddress] : undefined,
    query:   { enabled: !!orgAddress },
  });
}

export function useIsOrgVerified(address: `0x${string}` | undefined) {
  return useReadContract({
    address: ADDRESSES.charityCore,
    abi:     CHARITY_CORE_ABI,
    functionName: "isOrgVerified",
    args:    address ? [address] : undefined,
    query:   { enabled: !!address },
  });
}

// ─── Write hooks ───────────────────────────────────────────────

export function useCreateCampaign() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createCampaign = (
    metadataCID: string,
    goalEth: string,
    deadlineTimestamp: bigint,
    totalMilestones: number
  ) => {
    writeContract({
      address:      ADDRESSES.charityCore,
      abi:          CHARITY_CORE_ABI,
      functionName: "createCampaign",
      args:         [metadataCID, parseEther(goalEth), deadlineTimestamp, totalMilestones],
      value:        parseEther("0.001"), // creation deposit
    });
  };

  return { createCampaign, hash, isPending, isConfirming, isSuccess, error };
}
