"use client";
import { useAccount, useReadContract } from "wagmi";
import { formatEther } from "viem";
import {
  ADDRESSES,
  CHARITY_CORE_ABI,
  DONATION_VAULT_ABI,
  GOVERNANCE_DAO_ABI,
  IMPACT_NFT_ABI,
} from "@/lib/contracts";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Code } from "@phosphor-icons/react";
import { formatQuadraticVoteWeight } from "@/lib/format";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 border-b border-gray-100 dark:border-zinc-800 pb-2 text-sm">
      <dt className="text-gray-500 shrink-0">{label}</dt>
      <dd className="font-mono text-xs text-right break-all">{value}</dd>
    </div>
  );
}

export function ContractExplorer({
  campaignId,
  proposalId,
}: {
  campaignId: bigint;
  proposalId?: bigint;
}) {
  const { address } = useAccount();

  const { data: campaign } = useReadContract({
    address: ADDRESSES.charityCore,
    abi: CHARITY_CORE_ABI,
    functionName: "getCampaign",
    args: [campaignId],
  });

  const { data: progress } = useReadContract({
    address: ADDRESSES.charityCore,
    abi: CHARITY_CORE_ABI,
    functionName: "getCharityProgress",
    args: [campaignId],
  });

  const { data: escrow } = useReadContract({
    address: ADDRESSES.donationVault,
    abi: DONATION_VAULT_ABI,
    functionName: "getCampaignEscrowBalance",
    args: [campaignId],
  });

  const { data: donors } = useReadContract({
    address: ADDRESSES.donationVault,
    abi: DONATION_VAULT_ABI,
    functionName: "getCharityDonors",
    args: [campaignId],
  });

  const { data: activeProposal } = useReadContract({
    address: ADDRESSES.governanceDAO,
    abi: GOVERNANCE_DAO_ABI,
    functionName: "getActiveProposal",
    args: [campaignId],
  });

  const { data: campaignProposals } = useReadContract({
    address: ADDRESSES.governanceDAO,
    abi: GOVERNANCE_DAO_ABI,
    functionName: "getCampaignProposals",
    args: [campaignId],
  });

  const pid = proposalId ?? (activeProposal as bigint | undefined) ?? 0n;

  const { data: proposal } = useReadContract({
    address: ADDRESSES.governanceDAO,
    abi: GOVERNANCE_DAO_ABI,
    functionName: "getProposal",
    args: [pid],
    query: { enabled: pid > 0n },
  });

  const { data: votingPower } = useReadContract({
    address: ADDRESSES.governanceDAO,
    abi: GOVERNANCE_DAO_ABI,
    functionName: "getVotingPower",
    args: address ? [campaignId, address] : undefined,
    query: { enabled: !!address },
  });

  const { data: linearDonation } = useReadContract({
    address: ADDRESSES.governanceDAO,
    abi: GOVERNANCE_DAO_ABI,
    functionName: "getDonorLinearAmount",
    args: address ? [campaignId, address] : undefined,
    query: { enabled: !!address },
  });

  const { data: donorNfts } = useReadContract({
    address: ADDRESSES.impactNFT,
    abi: IMPACT_NFT_ABI,
    functionName: "getCampaignNFTs",
    args: [campaignId],
  });

  const c = campaign as Record<string, unknown> | undefined;
  const p = proposal as Record<string, unknown> | undefined;
  const prog = progress as readonly [bigint, bigint, bigint, bigint, boolean, bigint] | undefined;

  return (
    <GlassPanel className="p-5">
      <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
        <Code size={22} weight="duotone" className="text-violet-600" />
        Contract explorer
      </h3>
      <p className="text-xs text-gray-500 mb-4">
        Live view reads across CharityCore, DonationVault, GovernanceDAO, and ImpactNFT.
      </p>
      <dl className="space-y-2">
        {c && (
          <>
            <Row label="CharityCore.status" value={String(c.status)} />
            <Row label="CharityCore.raised" value={`${formatEther(c.raisedAmount as bigint)} ETH`} />
            <Row label="CharityCore.goal" value={`${formatEther(c.goalAmount as bigint)} ETH`} />
            <Row label="CharityCore.milestones" value={`${c.completedMilestones}/${c.totalMilestones}`} />
          </>
        )}
        {prog && (
          <Row label="CharityCore.progressBps" value={`${Number(prog[2]) / 100}%`} />
        )}
        {escrow !== undefined && (
          <Row label="Vault.escrowBalance" value={`${formatEther(escrow as bigint)} ETH`} />
        )}
        {donors && (
          <Row label="Vault.donorCount" value={String((donors as string[]).length)} />
        )}
        {campaignProposals && (
          <Row label="DAO.proposalIds" value={(campaignProposals as bigint[]).map(String).join(", ") || "—"} />
        )}
        {pid > 0n && p && (
          <>
            <Row label="DAO.proposal.state" value={String(p.state)} />
            <Row label="DAO.forVotes (QV)" value={formatQuadraticVoteWeight(p.forVotes as bigint)} />
            <Row label="DAO.againstVotes (QV)" value={formatQuadraticVoteWeight(p.againstVotes as bigint)} />
            <Row label="DAO.totalVotingPower (QV)" value={formatQuadraticVoteWeight(p.totalVotingPower as bigint)} />
          </>
        )}
        {address && linearDonation !== undefined && (
          <Row label="Your donation (linear)" value={`${formatEther(linearDonation as bigint)} ETH`} />
        )}
        {address && votingPower !== undefined && (
          <Row label="Your vote power (QV)" value={formatQuadraticVoteWeight(votingPower as bigint)} />
        )}
        {donorNfts && (
          <Row label="ImpactNFT.tokenIds" value={(donorNfts as bigint[]).map(String).join(", ") || "—"} />
        )}
      </dl>
    </GlassPanel>
  );
}
