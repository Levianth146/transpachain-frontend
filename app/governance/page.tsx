"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Scales } from "@phosphor-icons/react";
import { api } from "@/lib/api";
import { PageShell } from "@/components/PageShell";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { LearnMoreLink } from "@/components/LearnMoreLink";
import { ProposalListItem } from "@/components/ProposalListItem";
import { ConnectWallet } from "@/components/ConnectWallet";
import { useAccount } from "wagmi";

export default function GovernanceHubPage() {
  const { isConnected } = useAccount();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProposals().then((data) => {
      setProposals(data.proposals ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <PageShell
      eyebrow="DAO"
      title={
        <span className="inline-flex items-center gap-3">
          <Scales size={32} className="text-holo-lavender" weight="duotone" />
          Governance
        </span>
      }
      description="Milestone releases are decided by donor votes using quadratic weighting (√donation). Admin approves proposals off-chain before they appear here. 51% quorum and a 24-hour timelock protect escrowed funds."
      maxWidth="4xl"
      backgroundImage="/backgrounds/governance.png"
    >
      <LearnMoreLink className="mb-6" />

      <GlassPanel holoBorder className="mb-8 p-4 text-sm text-slate-600 dark:text-white/70">
        <p className="mb-1 font-medium text-slate-900 dark:text-white">Quadratic voting & identity</p>
        <p className="text-xs leading-relaxed">
          Vote weight = √(ETH donated) — splitting donations across wallets does not increase total influence.
          Only wallets with an on-chain donation to the campaign can vote (Sybil resistance via escrowed stake).
          Connect your donor wallet to cast votes on active proposals.
        </p>
        {!isConnected && (
          <div className="mt-3 flex items-center gap-3">
            <ConnectWallet />
            <span className="text-xs text-slate-500 dark:text-white/50">Wallet required to vote</span>
          </div>
        )}
      </GlassPanel>

      {loading ? (
        <p className="text-slate-500 dark:text-white/50">Loading proposals…</p>
      ) : proposals.length === 0 ? (
        <p className="text-slate-600 dark:text-white/60">No proposals indexed yet. Submit a milestone proof on an active campaign.</p>
      ) : (
        <ul className="space-y-4">
          {proposals.map((p, i) => (
            <ProposalListItem key={p.proposalId} proposal={p} index={i} />
          ))}
        </ul>
      )}
    </PageShell>
  );
}
