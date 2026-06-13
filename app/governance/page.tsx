"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Scales } from "@phosphor-icons/react";
import { api } from "@/lib/api";
import { AnimatedGradientBackground } from "@/components/ui/AnimatedGradientBackground";
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
    <AnimatedGradientBackground variant="dark" className="min-h-screen">
    <main className="max-w-4xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Scales size={32} className="text-gold-500" weight="duotone" />
          <h1 className="text-3xl font-display text-gold-500">DAO Governance</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Milestone releases are decided by donor votes using quadratic weighting (√donation).
          Admin approves proposals off-chain before they appear here. 51% quorum and a 24-hour timelock protect escrowed funds.
        </p>
        <LearnMoreLink className="mb-4" />

        <GlassPanel className="p-4 mb-8 text-sm text-gray-600 dark:text-gray-300">
          <p className="font-medium text-gray-900 dark:text-cream-100 mb-1">Quadratic voting & identity</p>
          <p className="text-xs leading-relaxed">
            Vote weight = √(ETH donated) — splitting donations across wallets does not increase total influence.
            Only wallets with an on-chain donation to the campaign can vote (Sybil resistance via escrowed stake).
            Connect your donor wallet to cast votes on active proposals.
          </p>
          {!isConnected && (
            <div className="mt-3 flex items-center gap-3">
              <ConnectWallet />
              <span className="text-xs text-gray-500">Wallet required to vote</span>
            </div>
          )}
        </GlassPanel>
      </motion.div>

      {loading ? (
        <p className="text-gray-400">Loading proposals…</p>
      ) : proposals.length === 0 ? (
        <p className="text-gray-500">No proposals indexed yet. Submit a milestone proof on an active campaign.</p>
      ) : (
        <ul className="space-y-4">
          {proposals.map((p, i) => (
            <ProposalListItem key={p.proposalId} proposal={p} index={i} />
          ))}
        </ul>
      )}
    </main>
    </AnimatedGradientBackground>
  );
}
