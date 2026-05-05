"use client";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ADDRESSES, GOVERNANCE_DAO_ABI } from "@/lib/contracts";
import { VoteChoice } from "@/types";

export function useProposal(proposalId: bigint) {
  return useReadContract({
    address: ADDRESSES.governanceDAO,
    abi:     GOVERNANCE_DAO_ABI,
    functionName: "getProposal",
    args:    [proposalId],
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
