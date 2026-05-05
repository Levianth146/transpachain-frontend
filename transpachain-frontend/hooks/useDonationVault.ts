"use client";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { ADDRESSES, DONATION_VAULT_ABI } from "@/lib/contracts";

export function useDonorAmount(campaignId: bigint, donor: `0x${string}` | undefined) {
  return useReadContract({
    address: ADDRESSES.donationVault,
    abi:     DONATION_VAULT_ABI,
    functionName: "getDonorAmount",
    args:    donor ? [campaignId, donor] : undefined,
    query:   { enabled: !!donor },
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
