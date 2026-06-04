"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { api } from "@/lib/api";
import { useCastVote, useQueueProposal, useExecuteProposal, useProposal } from "@/hooks/useGovernance";
import Link from "next/link";
import { VoteChoice, ProposalState } from "@/types";

const STATE_LABEL: Record<number, string> = {
  0: "Pending", 1: "Active", 2: "Defeated",
  3: "Queued",  4: "Executed", 5: "Cancelled"
};

export function VotingPanel({ campaignId }: { campaignId: bigint }) {
  const { address } = useAccount();
  const [proposal, setProposal] = useState<any>(null);
  const { castVote, isPending: isVoting, isSuccess: voted } = useCastVote();
  const { queue, isPending: isQueuing } = useQueueProposal();
  const { execute, isPending: isExecuting } = useExecuteProposal();

  const proposalId =
    proposal?.proposalId != null ? BigInt(proposal.proposalId) : 0n;
  const { data: onChainProposal } = useProposal(proposalId, {
    enabled: proposal != null,
  });

  useEffect(() => {
    api.getCampaignProposals(Number(campaignId))
      .then((proposals: any[]) => {
        const active = proposals.find((p: any) => p.state === 1);
        setProposal(active ?? null);
      })
      .catch(() => setProposal(null));
  }, [campaignId, voted]);

  if (!proposal) return (
    <div className="bg-white border rounded-xl p-5">
      <h3 className="font-semibold mb-3">Governance Voting</h3>
      <p className="text-sm text-gray-400">
        No active proposals for this campaign.
      </p>
    </div>
  );
  const chain = onChainProposal as {
    forVotes?: bigint;
    againstVotes?: bigint;
    abstainVotes?: bigint;
    totalVotingPower?: bigint;
  } | undefined;

  const forVotes = Number(chain?.forVotes ?? proposal.forVotes ?? 0);
  const againstVotes = Number(chain?.againstVotes ?? proposal.againstVotes ?? 0);
  const abstainVotes = Number(chain?.abstainVotes ?? proposal.abstainVotes ?? 0);
  const totalPower = Number(chain?.totalVotingPower ?? 0);
  const totalVotes = forVotes + againstVotes + abstainVotes;
  const forPct = totalVotes > 0 ? ((forVotes / totalVotes) * 100).toFixed(0) : "0";
  const quorumPct =
    totalPower > 0 ? ((forVotes / totalPower) * 100).toFixed(0) : "0";
  const quorumMet = totalPower > 0 && forVotes * 100 >= totalPower * 51;

  return (
    <div className="bg-white border rounded-xl p-5">
      <h3 className="font-semibold mb-1">Governance Voting</h3>
      <p className="text-xs text-gray-400 mb-4">
        Proposal #{proposal.proposalId} — Milestone {proposal.milestoneIndex + 1}
        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
          {STATE_LABEL[proposal.state]}
        </span>
      </p>

      {/* Vote results */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>For: {proposal.forVotes}</span>
          <span>Against: {proposal.againstVotes}</span>
        </div>
        <div className="w-full bg-red-100 rounded-full h-2">
          <div className="bg-emerald-500 h-2 rounded-full"
            style={{ width: `${forPct}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {forPct}% of cast votes · Quorum: {quorumPct}% of donor power (need 51% For)
          {quorumMet ? " ✓" : ""}
        </p>
      </div>
      <Link href="/governance" className="text-xs text-blue-600 hover:underline block mb-2">
        View all DAO proposals →
      </Link>

      {/* Vote buttons — only if Active */}
      {proposal.state === 1 && (
        <div className="flex gap-2">
          <button onClick={() => castVote(proposalId, VoteChoice.For)}
            disabled={!address || isVoting}
            className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium
                       disabled:opacity-50 hover:bg-emerald-700">
            {isVoting ? "Voting..." : "✓ Vote For"}
          </button>
          <button onClick={() => castVote(proposalId, VoteChoice.Against)}
            disabled={!address || isVoting}
            className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium
                       disabled:opacity-50 hover:bg-red-600">
            ✗ Vote Against
          </button>
        </div>
      )}

      {/* Queue button — after voting ends */}
      {proposal.state === 1 && (
        <button onClick={() => queue(proposalId)}
          disabled={isQueuing}
          className="w-full mt-2 py-2 border border-gray-300 rounded-lg text-sm
                     disabled:opacity-50 hover:bg-gray-50">
          {isQueuing ? "Queuing..." : "Queue Proposal"}
        </button>
      )}

      {/* Execute button — after timelock */}
      {proposal.state === 3 && (
        <button onClick={() => execute(proposalId)}
          disabled={isExecuting}
          className="w-full mt-2 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium
                     disabled:opacity-50 hover:bg-blue-700">
          {isExecuting ? "Executing..." : "Execute & Release Funds"}
        </button>
      )}

      {!address && (
        <p className="text-xs text-amber-600 mt-2">Connect wallet to vote</p>
      )}
    </div>
  );
}
