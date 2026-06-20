"use client";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi";
import { useAccount } from "wagmi";
import { ADDRESSES, GOVERNANCE_DAO_ABI } from "@/lib/contracts";
import { VoteChoice } from "@/types";
import { gasWithBuffer } from "@/lib/contractWrite";

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
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const castVote = async (proposalId: bigint, choice: VoteChoice) => {
    const gas = await gasWithBuffer(
      publicClient,
      {
        address: ADDRESSES.governanceDAO,
        abi: GOVERNANCE_DAO_ABI,
        functionName: "castVote",
        args: [proposalId, choice],
        account: address,
      },
      300000n
    );
    writeContract({
      address:      ADDRESSES.governanceDAO,
      abi:          GOVERNANCE_DAO_ABI,
      functionName: "castVote",
      args:         [proposalId, choice],
      gas,
    });
  };

  return { castVote, hash, isPending, isConfirming, isSuccess, error };
}

export function useQueueProposal() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const queue = async (proposalId: bigint) => {
    const gas = await gasWithBuffer(
      publicClient,
      {
        address: ADDRESSES.governanceDAO,
        abi: GOVERNANCE_DAO_ABI,
        functionName: "queueProposal",
        args: [proposalId],
        account: address,
      },
      250000n
    );
    writeContract({
      address: ADDRESSES.governanceDAO,
      abi: GOVERNANCE_DAO_ABI,
      functionName: "queueProposal",
      args: [proposalId],
      gas,
    });
  };
  return { queue, hash, isPending, isSuccess, error };
}

export function useExecuteProposal() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const execute = async (proposalId: bigint) => {
    const gas = await gasWithBuffer(
      publicClient,
      {
        address: ADDRESSES.governanceDAO,
        abi: GOVERNANCE_DAO_ABI,
        functionName: "executeProposal",
        args: [proposalId],
        account: address,
      },
      450000n
    );
    writeContract({
      address: ADDRESSES.governanceDAO,
      abi: GOVERNANCE_DAO_ABI,
      functionName: "executeProposal",
      args: [proposalId],
      gas,
    });
  };
  return { execute, hash, isPending, isSuccess, error };
}

export function useResubmitProposal() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const resubmit = async (proposalId: bigint) => {
    const gas = await gasWithBuffer(
      publicClient,
      {
        address: ADDRESSES.governanceDAO,
        abi: GOVERNANCE_DAO_ABI,
        functionName: "resubmitProposal",
        args: [proposalId],
        account: address,
      },
      400000n
    );
    writeContract({
      address: ADDRESSES.governanceDAO,
      abi: GOVERNANCE_DAO_ABI,
      functionName: "resubmitProposal",
      args: [proposalId],
      gas,
    });
  };
  return { resubmit, hash, isPending, isSuccess, error };
}

export function useCloseProposal() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const closeProposal = async (proposalId: bigint, reason: string) => {
    const gas = await gasWithBuffer(
      publicClient,
      {
        address: ADDRESSES.governanceDAO,
        abi: GOVERNANCE_DAO_ABI,
        functionName: "closeProposal",
        args: [proposalId, reason],
        account: address,
      },
      300000n
    );
    writeContract({
      address: ADDRESSES.governanceDAO,
      abi: GOVERNANCE_DAO_ABI,
      functionName: "closeProposal",
      args: [proposalId, reason],
      gas,
    });
  };
  return { closeProposal, hash, isPending, isConfirming, isSuccess, error };
}
