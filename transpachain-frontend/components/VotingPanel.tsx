"use client";
// TODO Phase 4: query backend for active proposal for this campaign, then render
// For now, stub showing the voting UI structure

import { useState } from "react";
import { useCastVote, useQueueProposal, useExecuteProposal } from "@/hooks/useGovernance";
import { VoteChoice, ProposalState } from "@/types";

export function VotingPanel({ campaignId }: { campaignId: bigint }) {
  // TODO: get active proposalId from backend indexer
  const activeProposalId = BigInt(0); // placeholder

  return (
    <div className="bg-white border rounded-xl p-5">
      <h3 className="font-semibold mb-3">Governance Voting</h3>
      <p className="text-sm text-gray-400">
        No active proposals for this campaign.
        {/* TODO: render VoteButtons when proposalId exists */}
      </p>
    </div>
  );
}
