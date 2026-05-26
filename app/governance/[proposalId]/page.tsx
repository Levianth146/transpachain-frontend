"use client";
import React from "react";

import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { useProposalState } from "@/hooks/useGovernance";
import { useCastVote, useQueueProposal, useExecuteProposal } from "@/hooks/useGovernance";
import { useAccount } from "wagmi";
import { VoteChoice, ProposalState } from "@/types";

const STATE_LABEL: Record<number, { label: string; color: string }> = {
  0: { label: "Pending",   color: "bg-gray-100 text-gray-700"     },
  1: { label: "Active",    color: "bg-blue-100 text-blue-700"     },
  2: { label: "Defeated",  color: "bg-red-100 text-red-700"       },
  3: { label: "Queued",    color: "bg-yellow-100 text-yellow-700" },
  4: { label: "Executed",  color: "bg-emerald-100 text-emerald-700" },
  5: { label: "Cancelled", color: "bg-gray-100 text-gray-500"     },
};

export default function ProposalPage({ params }: { params: Promise<{ proposalId: string }> }) {
  const resolvedParams = React.use(params);
  const { address } = useAccount();
  const proposalId  = BigInt(resolvedParams.proposalId);

  const { data: state } = useProposalState(proposalId);
  const { castVote, isPending: isVoting, isSuccess: voted } = useCastVote();
  const { queue, isPending: isQueuing } = useQueueProposal();
  const { execute, isPending: isExecuting } = useExecuteProposal();

  const stateNum = Number(state ?? 0);
  const badge    = STATE_LABEL[stateNum] ?? STATE_LABEL[0];

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">Proposal #{resolvedParams.proposalId}</h1>
        <span className={`text-sm px-3 py-1 rounded-full font-medium ${badge.color}`}>
          {badge.label}
        </span>
      </div>

      {/* Vote buttons */}
      {stateNum === 1 && (
        <div className="bg-white border rounded-xl p-5 mb-4">
          <h3 className="font-semibold mb-3">Cast Your Vote</h3>
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
            <button onClick={() => castVote(proposalId, VoteChoice.Abstain)}
              disabled={!address || isVoting}
              className="flex-1 py-2 border rounded-lg text-sm disabled:opacity-50">
              Abstain
            </button>
          </div>
          <button onClick={() => queue(proposalId)}
            disabled={isQueuing}
            className="w-full mt-2 py-2 border rounded-lg text-sm disabled:opacity-50">
            {isQueuing ? "Queuing..." : "Queue Proposal"}
          </button>
          {!address && <p className="text-xs text-amber-600 mt-2">Connect wallet to vote</p>}
        </div>
      )}

      {/* Execute button */}
      {stateNum === 3 && (
        <div className="bg-white border rounded-xl p-5">
          <h3 className="font-semibold mb-3">Execute Proposal</h3>
          <p className="text-sm text-gray-500 mb-3">Timelock period has passed. Execute to release funds.</p>
          <button onClick={() => execute(proposalId)}
            disabled={isExecuting}
            className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium
                       disabled:opacity-50 hover:bg-blue-700">
            {isExecuting ? "Executing..." : "Execute & Release Funds"}
          </button>
        </div>
      )}

      {voted && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center mt-4">
          <p className="text-emerald-700 font-medium">✓ Vote recorded on-chain!</p>
        </div>
      )}
    </main>
  );
}
