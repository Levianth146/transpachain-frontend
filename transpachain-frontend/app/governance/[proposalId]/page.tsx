"use client";

import { useProposal } from "@/hooks/useGovernance";
import { VotingPanel } from "@/components/VotingPanel";

/**
 * Governance proposal detail page.
 * Shows proposal info, proof CID viewer, vote tally, cast vote UI.
 */
export default function ProposalPage({
  params,
}: {
  params: { proposalId: string };
}) {
  const proposalId = BigInt(params.proposalId);
  const { data: proposal, isLoading } = useProposal(proposalId);

  if (isLoading) return <div>Loading proposal...</div>;
  if (!proposal)  return <div>Proposal not found.</div>;

  return (
    <main>
      <h1>Governance Proposal #{params.proposalId}</h1>
      {/* TODO: <ProposalHeader proposal={proposal} /> */}
      {/* TODO: <IPFSProofViewer cid={proposal.proofCID} /> */}
      {/* TODO: <VoteTally forVotes={proposal.forVotes} ... /> */}
      <VotingPanel proposalId={proposalId} />
    </main>
  );
}
