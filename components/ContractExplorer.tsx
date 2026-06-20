"use client";
import { useAccount, useReadContract } from "wagmi";
import {
  ADDRESSES,
  CHARITY_CORE_ABI,
  DONATION_VAULT_ABI,
  GOVERNANCE_DAO_ABI,
  IMPACT_NFT_ABI,
} from "@/lib/contracts";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Code } from "@phosphor-icons/react";
import { formatCampaignAmountLabel, formatQuadraticVoteWeight, getPaymentTokenLabel } from "@/lib/format";
import { ContractLink } from "@/components/TxLink";

function Row({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-white/10 pb-2 text-sm">
      <dt className="text-white/50 text-xs shrink-0">{label}</dt>
      <dd className="font-mono text-xs text-white break-all">{value}</dd>
      {hint && <dd className="text-[10px] text-white/40">{hint}</dd>}
    </div>
  );
}

export function ContractExplorer({
  campaignId,
  proposalId,
  paymentToken = 0,
}: {
  campaignId: bigint;
  proposalId?: bigint;
  paymentToken?: number;
}) {
  const { address } = useAccount();
  const tokenLabel = getPaymentTokenLabel(paymentToken);

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
    <GlassPanel holoBorder className="p-5">
      <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2 text-white">
        <Code size={22} weight="duotone" className="text-holo-lavender" />
        Contract explorer
      </h3>
      <p className="text-xs text-white/50 mb-4">
        Live view reads across CharityCore, DonationVault, GovernanceDAO, and ImpactNFT ({tokenLabel}).
      </p>
      <dl className="space-y-2">
        {c && (
          <>
            <Row label="CharityCore.status" value={String(c.status)} />
            <Row
              label="CharityCore.raised (net)"
              value={formatCampaignAmountLabel(c.raisedAmount as bigint, paymentToken)}
              hint="Matches escrow when no releases"
            />
            <Row label="CharityCore.goal" value={formatCampaignAmountLabel(c.goalAmount as bigint, paymentToken)} />
            <Row label="CharityCore.milestones" value={`${c.completedMilestones}/${c.totalMilestones}`} />
          </>
        )}
        {prog && (
          <Row label="CharityCore.progressBps" value={`${Number(prog[2]) / 100}%`} />
        )}
        {escrow !== undefined && (
          <Row label="Vault.escrowBalance" value={formatCampaignAmountLabel(escrow as bigint, paymentToken)} />
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
          <Row label="Your donation (linear)" value={formatCampaignAmountLabel(linearDonation as bigint, paymentToken)} />
        )}
        {address && votingPower !== undefined && (
          <Row label="Your vote power (QV)" value={formatQuadraticVoteWeight(votingPower as bigint)} />
        )}
        {donorNfts && (
          <Row label="ImpactNFT.tokenIds" value={(donorNfts as bigint[]).map(String).join(", ") || "—"} />
        )}
      </dl>
      <p className="mt-3 text-[10px] text-white/40 flex flex-wrap gap-x-2 gap-y-1">
        <ContractLink address={ADDRESSES.charityCore} name="CharityCore" />
        <ContractLink address={ADDRESSES.donationVault} name="DonationVault" />
        <ContractLink address={ADDRESSES.governanceDAO} name="GovernanceDAO" />
        <ContractLink address={ADDRESSES.impactNFT} name="ImpactNFT" />
      </p>
    </GlassPanel>
  );
}
