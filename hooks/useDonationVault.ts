"use client";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import { ADDRESSES, DONATION_VAULT_ABI } from "@/lib/contracts";
import { gasWithBuffer } from "@/lib/contractWrite";

// ─── Read hooks ────────────────────────────────────────────────

export function useDonorInfo(campaignId: bigint, donor: `0x${string}` | undefined) {
  return useReadContract({
    address: ADDRESSES.donationVault,
    abi:     DONATION_VAULT_ABI,
    functionName: "getDonorInfo",
    args:    donor ? [campaignId, donor] : undefined,
    query:   { enabled: !!donor },
  });
}

export function useDonorAmount(campaignId: bigint, donor: `0x${string}` | undefined) {
  return useReadContract({
    address: ADDRESSES.donationVault,
    abi:     DONATION_VAULT_ABI,
    functionName: "getDonorAmount",
    args:    donor ? [campaignId, donor] : undefined,
    query:   { enabled: !!donor },
  });
}

export function useCharityDonors(campaignId: bigint) {
  return useReadContract({
    address: ADDRESSES.donationVault,
    abi:     DONATION_VAULT_ABI,
    functionName: "getCharityDonors",
    args:    [campaignId],
  });
}

export function useCampaignEscrow(campaignId: bigint) {
  return useReadContract({
    address: ADDRESSES.donationVault,
    abi:     DONATION_VAULT_ABI,
    functionName: "getCampaignEscrowBalance",
    args:    [campaignId],
  });
}

export function useMilestone(campaignId: bigint, milestoneIndex: number) {
  return useReadContract({
    address: ADDRESSES.donationVault,
    abi:     DONATION_VAULT_ABI,
    functionName: "getMilestone",
    args:    [campaignId, milestoneIndex],
  });
}

export function useCanRefund(campaignId: bigint, donor: `0x${string}` | undefined) {
  return useReadContract({
    address: ADDRESSES.donationVault,
    abi:     DONATION_VAULT_ABI,
    functionName: "canRefund",
    args:    donor ? [campaignId, donor] : undefined,
    query:   { enabled: !!donor },
  });
}

export function useRefundableAmount(campaignId: bigint, donor: `0x${string}` | undefined) {
  return useReadContract({
    address: ADDRESSES.donationVault,
    abi:     DONATION_VAULT_ABI,
    functionName: "getRefundableAmount",
    args:    donor ? [campaignId, donor] : undefined,
    query:   { enabled: !!donor },
  });
}

export function useHasActiveOrQueuedProposal(campaignId: bigint) {
  return useReadContract({
    address: ADDRESSES.donationVault,
    abi:     DONATION_VAULT_ABI,
    functionName: "hasActiveOrQueuedProposal",
    args:    [campaignId],
  });
}

// ─── Write hooks ───────────────────────────────────────────────

export function useDonate() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const donate = async (campaignId: bigint, amountEth: string) => {
    const value = parseEther(amountEth);
    const gas = await gasWithBuffer(
      publicClient,
      {
        address: ADDRESSES.donationVault,
        abi: DONATION_VAULT_ABI,
        functionName: "donate",
        args: [campaignId],
        value,
        account: address,
      },
      350000n
    );
    writeContract({
      address:      ADDRESSES.donationVault,
      abi:          DONATION_VAULT_ABI,
      functionName: "donate",
      args:         [campaignId],
      value,
      gas,
    });
  };

  return { donate, hash, isPending, isConfirming, isSuccess, error };
}

export function useDonateUSDC() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const donateUSDC = async (campaignId: bigint, amountUSDC: bigint) => {
    const gas = await gasWithBuffer(
      publicClient,
      {
        address: ADDRESSES.donationVault,
        abi: DONATION_VAULT_ABI,
        functionName: "donateUSDC",
        args: [campaignId, amountUSDC],
        account: address,
      },
      350000n
    );
    writeContract({
      address:      ADDRESSES.donationVault,
      abi:          DONATION_VAULT_ABI,
      functionName: "donateUSDC",
      args:         [campaignId, amountUSDC],
      gas,
    });
  };

  return { donateUSDC, hash, isPending, isConfirming, isSuccess, error };
}

export function useClaimRefund() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const claimRefund = async (campaignId: bigint) => {
    const gas = await gasWithBuffer(
      publicClient,
      {
        address: ADDRESSES.donationVault,
        abi: DONATION_VAULT_ABI,
        functionName: "claimRefund",
        args: [campaignId],
        account: address,
      },
      250000n
    );
    writeContract({
      address:      ADDRESSES.donationVault,
      abi:          DONATION_VAULT_ABI,
      functionName: "claimRefund",
      args:         [campaignId],
      gas,
    });
  };

  return { claimRefund, hash, isPending, isConfirming, isSuccess, error };
}

export function useSubmitMilestoneProof() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const submitMilestoneProof = async (campaignId: bigint, milestoneIndex: number, proofCID: string) => {
    const gas = await gasWithBuffer(
      publicClient,
      {
        address: ADDRESSES.donationVault,
        abi: DONATION_VAULT_ABI,
        functionName: "submitMilestoneProof",
        args: [campaignId, milestoneIndex, proofCID],
        account: address,
      },
      350000n
    );
    writeContract({
      address:      ADDRESSES.donationVault,
      abi:          DONATION_VAULT_ABI,
      functionName: "submitMilestoneProof",
      args:         [campaignId, milestoneIndex, proofCID],
      gas,
    });
  };
  
  return { submitMilestoneProof, hash, isPending, isConfirming, isSuccess, error };
}
