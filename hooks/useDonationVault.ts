"use client";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { ADDRESSES, DONATION_VAULT_ABI } from "@/lib/contracts";

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

// ─── Write hooks ───────────────────────────────────────────────

export function useDonate() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const donate = (campaignId: bigint, amountEth: string) => {
    writeContract({
      address:      ADDRESSES.donationVault,
      abi:          DONATION_VAULT_ABI,
      functionName: "donate",
      args:         [campaignId],
      value:        parseEther(amountEth),
    });
  };

  return { donate, hash, isPending, isConfirming, isSuccess, error };
}

export function useDonateUSDC() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const donateUSDC = (campaignId: bigint, amountUSDC: bigint) => {
    writeContract({
      address:      ADDRESSES.donationVault,
      abi:          DONATION_VAULT_ABI,
      functionName: "donateUSDC",
      args:         [campaignId, amountUSDC],
    });
  };

  return { donateUSDC, hash, isPending, isConfirming, isSuccess, error };
}

export function useClaimRefund() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const claimRefund = (campaignId: bigint) => {
    writeContract({
      address:      ADDRESSES.donationVault,
      abi:          DONATION_VAULT_ABI,
      functionName: "claimRefund",
      args:         [campaignId],
    });
  };

  return { claimRefund, hash, isPending, isConfirming, isSuccess, error };
}

export function useSubmitMilestoneProof() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const submitMilestoneProof = (campaignId: bigint, milestoneIndex: number, proofCID: string) => {
    writeContract({
      address:      ADDRESSES.donationVault,
      abi:          DONATION_VAULT_ABI,
      functionName: "submitMilestoneProof",
      args:         [campaignId, milestoneIndex, proofCID],
    });
  };
  
  return { submitMilestoneProof, hash, isPending, isConfirming, isSuccess, error };
}