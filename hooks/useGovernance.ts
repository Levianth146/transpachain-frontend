"use client";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ADDRESSES, GOVERNANCE_DAO_ABI } from "@/lib/contracts";
import { VoteChoice } from "@/types";

// ─── Read hooks ────────────────────────────────────────────────

export function useProposal(proposalId: bigint, options?: { enabled?: boolean }) {
  return useReadContract({
    address: ADDRESSES.governanceDAO,
    abi:     GOVERNANCE_DAO_ABI,
    functionName: "getProposal",
    args:    [proposalId],
    query:   { enabled: options?.enabled !== false },
  });
}

export function useProposalState(proposalId: bigint) {
  return useReadContract({
    address: ADDRESSES.governanceDAO,
    abi:     GOVERNANCE_DAO_ABI,
    functionName: "getProposalState",
    args:    [proposalId],
  });
}

export function useCampaignProposals(campaignId: bigint) {
  return useReadContract({
    address: ADDRESSES.governanceDAO,
    abi:     GOVERNANCE_DAO_ABI,
    functionName: "getCampaignProposals",
    args:    [campaignId],
  });
}

export function useActiveProposal(campaignId: bigint) {
  return useReadContract({
    address: ADDRESSES.governanceDAO,
    abi:     GOVERNANCE_DAO_ABI,
    functionName: "getActiveProposal",
    args:    [campaignId],
  });
}

export function useHasVoted(proposalId: bigint, voter: `0x${string}` | undefined) {
  return useReadContract({
    address: ADDRESSES.governanceDAO,
    abi:     GOVERNANCE_DAO_ABI,
    functionName: "hasVoted",
    args:    voter ? [proposalId, voter] : undefined,
    query:   { enabled: !!voter },
  });
}

export function useVotingPower(campaignId: bigint, voter: `0x${string}` | undefined) {
  return useReadContract({
    address: ADDRESSES.governanceDAO,
    abi:     GOVERNANCE_DAO_ABI,
    functionName: "getVotingPower",
    args:    voter ? [campaignId, voter] : undefined,
    query:   { enabled: !!voter },
  });
}

// ─── Write hooks ───────────────────────────────────────────────

export function useCastVote() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const castVote = (proposalId: bigint, choice: VoteChoice) => {
    writeContract({
      address:      ADDRESSES.governanceDAO,
      abi:          GOVERNANCE_DAO_ABI,
      functionName: "castVote",
      args:         [proposalId, choice],
    });
  };

  return { castVote, hash, isPending, isConfirming, isSuccess, error };
}

export function useQueueProposal() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });
  const queue = (proposalId: bigint) =>
    writeContract({ address: ADDRESSES.governanceDAO, abi: GOVERNANCE_DAO_ABI, functionName: "queueProposal", args: [proposalId] });
  return { queue, hash, isPending, isSuccess, error };
}

export function useExecuteProposal() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });
  const execute = (proposalId: bigint) =>
    writeContract({ address: ADDRESSES.governanceDAO, abi: GOVERNANCE_DAO_ABI, functionName: "executeProposal", args: [proposalId] });
  return { execute, hash, isPending, isSuccess, error };
}

export function useResubmitProposal() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });
  const resubmit = (proposalId: bigint) =>
    writeContract({ address: ADDRESSES.governanceDAO, abi: GOVERNANCE_DAO_ABI, functionName: "resubmitProposal", args: [proposalId] });
  return { resubmit, hash, isPending, isSuccess, error };
}

export function useCloseProposal() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const closeProposal = (proposalId: bigint, reason: string) =>
    writeContract({
      address: ADDRESSES.governanceDAO,
      abi: GOVERNANCE_DAO_ABI,
      functionName: "closeProposal",
      args: [proposalId, reason],
    });
  return { closeProposal, hash, isPending, isConfirming, isSuccess, error };
}
