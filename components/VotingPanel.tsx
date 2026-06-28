"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { api } from "@/lib/api";
import { useCastVote, useQueueProposal, useExecuteProposal, useProposal } from "@/hooks/useGovernance";
import Link from "next/link";
import { VoteChoice } from "@/types";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { formatQuadraticVoteWeight } from "@/lib/format";

const STATE_LABEL: Record<number, string> = {
  0: "Pending", 1: "Active", 2: "Defeated",
  3: "Queued",  4: "Executed", 5: "Cancelled"
};

export function VotingPanel({ campaignId, onRefresh }: { campaignId: bigint; onRefresh?: () => void }) {
  const { address } = useAccount();
  const [proposal, setProposal] = useState<any>(null);
  const { castVote, isPending: isVoting, isSuccess: voted } = useCastVote();
  const { queue, isPending: isQueuing } = useQueueProposal();
  const { execute, isPending: isExecuting, isSuccess: executed } = useExecuteProposal();

  const proposalId =
    proposal?.proposalId != null ? BigInt(proposal.proposalId) : 0n;
  const { data: onChainProposal } = useProposal(proposalId, {
    enabled: proposal != null,
  });

  useEffect(() => {
    api.getCampaignProposals(Number(campaignId))
      .then((proposals: any[]) => {
        const active = proposals.find((p: any) => p.state === 1 && !p.closedByAdmin);
        setProposal(active ?? null);
      })
      .catch(() => setProposal(null));
  }, [campaignId, voted]);

  useEffect(() => {
    if (executed) {
      api.getCampaignProposals(Number(campaignId))
        .then((proposals: any[]) => {
          const active = proposals.find((p: any) => p.state === 1 && !p.closedByAdmin);
          setProposal(active ?? null);
        })
        .catch(() => setProposal(null));
      onRefresh?.();
    }
  }, [executed, campaignId, onRefresh]);

  if (!proposal) return (
    <GlassPanel className="p-5">
      <h3 className="font-display font-semibold mb-3">Governance Voting</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        No active proposals for this campaign.
      </p>
    </GlassPanel>
  );

  const chain = onChainProposal as {
    forVotes?: bigint;
    againstVotes?: bigint;
    abstainVotes?: bigint;
    totalVotingPower?: bigint;
    state?: number;
  } | undefined;

  const forVotes = chain?.forVotes ?? 0n;
  const againstVotes = chain?.againstVotes ?? 0n;
  const abstainVotes = chain?.abstainVotes ?? 0n;
  const totalPower = chain?.totalVotingPower ?? 0n;
  const totalCast = forVotes + againstVotes + abstainVotes;
  const forPct = totalCast > 0n ? Number((forVotes * 100n) / totalCast) : 0;
  const quorumPct =
    totalPower > 0n ? Number((totalCast * 10000n) / totalPower) / 100 : 0;
  const quorumMet = totalPower > 0n && totalCast * 10000n >= totalPower * 5100n;
  const majorityFor = forVotes > againstVotes;
  const stateNum = chain?.state ?? proposal.state;

  return (
    <GlassPanel className="p-5">
      <h3 className="font-display font-semibold mb-1">Governance Voting</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        Proposal #{proposal.proposalId} — Milestone {proposal.milestoneIndex + 1}
        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
          {STATE_LABEL[stateNum] ?? "Active"}
        </span>
      </p>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 mb-1">
          <span>For: {formatQuadraticVoteWeight(forVotes)} QV</span>
          <span>Against: {formatQuadraticVoteWeight(againstVotes)} QV</span>
        </div>
        <div className="w-full bg-red-100 rounded-full h-2">
          <div className="bg-emerald-500 h-2 rounded-full"
            style={{ width: `${forPct}%` }} />
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Quadratic votes · Quorum: {quorumPct.toFixed(1)}% participation of total power (need 51%)
          {quorumMet && majorityFor ? " ✓" : ""}
        </p>
      </div>
      <Link href="/governance" className="text-xs text-blue-600 hover:underline block mb-2">
        View all DAO proposals →
      </Link>

      {stateNum === 1 && (
        <div className="flex gap-2">
          <button onClick={() => castVote(proposalId, VoteChoice.For)}
            disabled={!address || isVoting}
            className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium
                       disabled:opacity-50 hover:bg-emerald-700">
            {isVoting ? "Voting..." : "Vote For"}
          </button>
          <button onClick={() => castVote(proposalId, VoteChoice.Against)}
            disabled={!address || isVoting}
            className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium
                       disabled:opacity-50 hover:bg-red-600">
            Vote Against
          </button>
        </div>
      )}

      {stateNum === 1 && (
        <button onClick={() => queue(proposalId)}
          disabled={isQueuing}
          className="w-full mt-2 py-2 border border-slate-200 rounded-lg text-sm text-slate-700
                     disabled:opacity-50 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5">
          {isQueuing ? "Queuing..." : "Queue for timelock"}
        </button>
      )}

      {stateNum === 3 && (
        <button onClick={() => execute(proposalId)}
          disabled={isExecuting}
          className="w-full mt-2 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium
                     disabled:opacity-50 hover:bg-blue-700">
          {isExecuting ? "Executing..." : "Execute release"}
        </button>
      )}

      {!address && (
        <p className="text-xs text-amber-600 mt-2">Connect wallet with a campaign donation to vote</p>
      )}
    </GlassPanel>
  );
}
