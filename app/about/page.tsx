"use client";
import { motion } from "framer-motion";
import { Heart, ShieldCheck, Scales } from "@phosphor-icons/react";
import { AnimatedGradientBackground } from "@/components/ui/AnimatedGradientBackground";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { HowItWorksBlock } from "@/components/HowItWorksBlock";
import { TrustSecurityStrip } from "@/components/TrustSecurityStrip";
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
    <AnimatedGradientBackground variant="dark" className="min-h-screen">
      <main className="mx-auto max-w-4xl px-4 py-10 space-y-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <Heart size={32} className="text-emerald-500" weight="duotone" />
            <h1 className="text-4xl font-bold text-white">About OpenHeart</h1>
          </div>
          <p className="text-lg leading-relaxed text-white/70">
            OpenHeart is a transparent giving platform on Ethereum where every donation is escrowed in ETH or USDC,
            every release is voted on by donors using quadratic weighting, and every transaction is verifiable on-chain.
          </p>
        </motion.div>

        <GlassPanel className="p-6">
          <h2 className="mb-3 text-xl font-semibold text-emerald-400">Our mission</h2>
          <p className="leading-relaxed text-white/70">
            We bridge the trust gap between donors and charitable organizations. Instead of sending funds
            directly to an org wallet, donations lock in a smart-contract escrow vault — in ETH or USDC.
            Organizations earn trust by submitting milestone proof reviewed by admin; donors retain control
            through decentralized governance with √donation vote weight. Failed campaigns trigger refund
            eligibility — accountability built into the protocol.
          </p>
        </GlassPanel>

        <GlassPanel className="p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">How it works</h2>
          <HowItWorksBlock columns={6} />
        </GlassPanel>

        <GlassPanel className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
            <ShieldCheck size={22} className="text-emerald-500" weight="duotone" />
            Security &amp; trust
          </h2>
          <TrustSecurityStrip />
        </GlassPanel>

        <GlassPanel className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
            <Scales size={22} className="text-purple-500" weight="duotone" />
            Anti-abuse safeguards
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {ANTI_ABUSE.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/60">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </GlassPanel>
      </main>
    </AnimatedGradientBackground>
  );
}
