"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Scales, Sparkle } from "@phosphor-icons/react";
import { PageShell } from "@/components/PageShell";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { HowItWorksBlock } from "@/components/HowItWorksBlock";
import { TrustSecurityStrip } from "@/components/TrustSecurityStrip";
import { FoundingTeam } from "@/components/FoundingTeam";

const ANTI_ABUSE = [
  {
    title: "Verified organizations only",
    desc: "Campaigns can only be created by wallets granted ORG_ROLE after admin or verifier review.",
  },
  {
    title: "Escrow until proof + vote",
    desc: "Funds stay in DonationVault (ETH or USDC) until milestone proof is submitted, admin-approved, and donors vote via DAO.",
  },
  {
    title: "Quadratic voting + admin gate",
    desc: "Vote weight scales as √donation. Proposals require off-chain admin approval before appearing for public vote.",
  },
  {
    title: "Evidence review workflow",
    desc: "Orgs upload milestone evidence; admin verifies authenticity before donors can inspect and vote.",
  },
  {
    title: "51% quorum + 24h timelock",
    desc: "Releases require majority donor participation and a mandatory waiting period before execution.",
  },
  {
    title: "Admin can close proposals",
    desc: "Suspicious or abusive governance proposals can be shut down on-chain via closeProposal.",
  },
  {
    title: "Deadline extension limits",
    desc: "On-chain: each extension may add at most 30 days beyond the current deadline. Platform policy recommends no more than 2 extensions per campaign.",
  },
  {
    title: "Automatic refund path",
    desc: "Failed or cancelled campaigns make donors eligible to reclaim their contributions on-chain.",
  },
  {
    title: "Impact NFT tiers",
    desc: "Donors receive a single tiered badge per campaign — Bronze, Silver, or Gold — upgraded on further donations.",
  },
];

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="Platform"
      title={
        <span className="inline-flex items-center gap-3">
          <Sparkle size={32} className="text-holo-mint" weight="duotone" />
          About TranspaChain
        </span>
      }
      description="TranspaChain is a transparent giving platform on Ethereum where every donation is escrowed in ETH or USDC, every release is voted on by donors using quadratic weighting, and every transaction is verifiable on-chain."
      maxWidth="4xl"
      backgroundImage="/backgrounds/about.png"
    >
      <div className="space-y-8">
        <GlassPanel holoBorder className="p-6">
          <h2 className="mb-3 text-xl font-semibold text-teal-700 dark:text-holo-mint">Our mission</h2>
          <p className="leading-relaxed text-slate-600 dark:text-white/70">
            We bridge the trust gap between donors and charitable organizations. Instead of sending funds
            directly to an org wallet, donations lock in a smart-contract escrow vault — in ETH or USDC.
            Organizations earn trust by submitting milestone proof reviewed by admin; donors retain control
            through decentralized governance with √donation vote weight. Failed campaigns trigger refund
            eligibility — accountability built into the protocol.
          </p>
        </GlassPanel>

        <GlassPanel holoBorder className="p-6">
          <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">How it works</h2>
          <HowItWorksBlock columns={6} />
        </GlassPanel>

        <GlassPanel holoBorder className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-white">
            <ShieldCheck size={22} className="text-teal-600 dark:text-holo-mint" weight="duotone" />
            Security &amp; trust
          </h2>
          <TrustSecurityStrip />
        </GlassPanel>

        <GlassPanel holoBorder className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-white">
            <Scales size={22} className="text-violet-600 dark:text-holo-lavender" weight="duotone" />
            Anti-abuse safeguards
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {ANTI_ABUSE.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-slate-200/80 bg-white/60 p-4 transition-colors hover:border-violet-300/50 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-holo-lavender/20"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-white/60">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </GlassPanel>

        <FoundingTeam />
      </div>
    </PageShell>
  );
}
