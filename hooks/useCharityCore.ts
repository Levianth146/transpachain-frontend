"use client";
import { useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import { parseCampaignGoalAmount } from "@/lib/format";
import { ADDRESSES, CHARITY_CORE_ABI } from "@/lib/contracts";
import { gasWithBuffer } from "@/lib/contractWrite";

// ─── Read hooks ────────────────────────────────────────────────
// UI data architecture: metadata from Mongo/API; amounts from getCharityProgress on-chain.

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

export function useCanFinalize(campaignId: bigint) {
  return useReadContract({
    address: ADDRESSES.charityCore,
    abi: CHARITY_CORE_ABI,
    functionName: "canFinalize",
    args: [campaignId],
  });
}

/** Batch-read paymentToken from getCampaign for platform stats aggregation. */
export function useCampaignPaymentTokens(campaignIds: number[]) {
  const contracts = campaignIds.map((id) => ({
    address: ADDRESSES.charityCore,
    abi: CHARITY_CORE_ABI,
    functionName: "getCampaign" as const,
    args: [BigInt(id)] as const,
  }));

  return useReadContracts({
    contracts,
    query: { enabled: campaignIds.length > 0 },
  });
}

/** Batch-read on-chain raised/goal for list views (net after platform fee). */
export function useCampaignProgressBatch(campaignIds: number[]) {
  const contracts = campaignIds.map((id) => ({
    address: ADDRESSES.charityCore,
    abi: CHARITY_CORE_ABI,
    functionName: "getCharityProgress" as const,
    args: [BigInt(id)] as const,
  }));

  return useReadContracts({
    contracts,
    query: { enabled: campaignIds.length > 0 },
  });
}

// ─── Write hooks ───────────────────────────────────────────────

export function useCreateCampaign() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createCampaign = async (
    metadataCID: string,
    goalAmount: string,
    deadlineTimestamp: bigint,
    totalMilestones: number,
    paymentToken: number,
    category: string
  ) => {
    const value = parseEther("0.001");
    const args = [
      metadataCID,
      parseCampaignGoalAmount(goalAmount, paymentToken),
      deadlineTimestamp,
      totalMilestones,
      paymentToken,
      category,
    ] as const;
    const gas = await gasWithBuffer(
      publicClient,
      {
        address: ADDRESSES.charityCore,
        abi: CHARITY_CORE_ABI,
        functionName: "createCampaign",
        args,
        value,
        account: address,
      },
      550000n
    );
    writeContract({
      address:      ADDRESSES.charityCore,
      abi:          CHARITY_CORE_ABI,
      functionName: "createCampaign",
      args,
      value,
      gas,
    });
  };

  return { createCampaign, hash, isPending, isConfirming, isSuccess, error };
}

export function useCancelCampaign() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const cancelCampaign = async (campaignId: bigint) => {
    const gas = await gasWithBuffer(
      publicClient,
      {
        address: ADDRESSES.charityCore,
        abi: CHARITY_CORE_ABI,
        functionName: "cancelCampaign",
        args: [campaignId],
        account: address,
      },
      250000n
    );
    writeContract({
      address:      ADDRESSES.charityCore,
      abi:          CHARITY_CORE_ABI,
      functionName: "cancelCampaign",
      args:         [campaignId],
      gas,
    });
  };

  return { cancelCampaign, hash, isPending, isSuccess, error };
}

export function useFinalizeCampaign() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const finalizeCampaign = async (campaignId: bigint) => {
    const gas = await gasWithBuffer(
      publicClient,
      {
        address: ADDRESSES.charityCore,
        abi: CHARITY_CORE_ABI,
        functionName: "finalizeCampaign",
        args: [campaignId],
        account: address,
      },
      300000n
    );
    writeContract({
      address:      ADDRESSES.charityCore,
      abi:          CHARITY_CORE_ABI,
      functionName: "finalizeCampaign",
      args:         [campaignId],
      gas,
    });
  };

  return { finalizeCampaign, hash, isPending, isSuccess, error };
}

export function useExtendDeadline() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const extendDeadline = async (campaignId: bigint, newDeadline: bigint) => {
    const gas = await gasWithBuffer(
      publicClient,
      {
        address: ADDRESSES.charityCore,
        abi: CHARITY_CORE_ABI,
        functionName: "extendDeadline",
        args: [campaignId, newDeadline],
        account: address,
      },
      250000n
    );
    writeContract({
      address:      ADDRESSES.charityCore,
      abi:          CHARITY_CORE_ABI,
      functionName: "extendDeadline",
      args:         [campaignId, newDeadline],
      gas,
    });
  };

  return { extendDeadline, hash, isPending, isSuccess, error };
}
