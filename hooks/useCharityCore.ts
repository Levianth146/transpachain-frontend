"use client";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { parseCampaignGoalAmount } from "@/lib/format";
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

export function useCharityProgress(campaignId: bigint) {
  return useReadContract({
    address:      ADDRESSES.charityCore,
    abi:          CHARITY_CORE_ABI,
    functionName: "getCharityProgress",
    args:         [campaignId],
  });
}

// ─── Write hooks ───────────────────────────────────────────────

export function useCreateCampaign() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createCampaign = (
    metadataCID: string,
    goalAmount: string,
    deadlineTimestamp: bigint,
    totalMilestones: number,
    paymentToken: number, // 0 = ETH, 1 = USDC
    category: string
  ) => {
    writeContract({
      address:      ADDRESSES.charityCore,
      abi:          CHARITY_CORE_ABI,
      functionName: "createCampaign",
      args:         [metadataCID, parseCampaignGoalAmount(goalAmount, paymentToken), deadlineTimestamp, totalMilestones, paymentToken, category],
      value:        parseEther("0.001"), // creation deposit
    });
  };

  return { createCampaign, hash, isPending, isConfirming, isSuccess, error };
}

export function useCancelCampaign() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const cancelCampaign = (campaignId: bigint) => {
    writeContract({
      address:      ADDRESSES.charityCore,
      abi:          CHARITY_CORE_ABI,
      functionName: "cancelCampaign",
      args:         [campaignId],
    });
  };

  return { cancelCampaign, hash, isPending, isSuccess, error };
}

export function useFinalizeCampaign() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const finalizeCampaign = (campaignId: bigint) => {
    writeContract({
      address:      ADDRESSES.charityCore,
      abi:          CHARITY_CORE_ABI,
      functionName: "finalizeCampaign",
      args:         [campaignId],
    });
  };

  return { finalizeCampaign, hash, isPending, isSuccess, error };
}

export function useExtendDeadline() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const extendDeadline = (campaignId: bigint, newDeadline: bigint) => {
    writeContract({
      address:      ADDRESSES.charityCore,
      abi:          CHARITY_CORE_ABI,
      functionName: "extendDeadline",
      args:         [campaignId, newDeadline],
    });
  };

  return { extendDeadline, hash, isPending, isSuccess, error };
}