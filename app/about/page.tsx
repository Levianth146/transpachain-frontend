"use client";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Scales,
  Sparkle,
} from "@phosphor-icons/react";
import { PageShell } from "@/components/PageShell";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { HowItWorksBlock } from "@/components/HowItWorksBlock";
import { RoleFlows } from "@/components/RoleFlows";
import { TrustSecurityStrip } from "@/components/TrustSecurityStrip";
import { ModuleTabs } from "@/components/ModuleTabs";

const ANTI_ABUSE = [
  {
    title: "Verified organizations only",
    desc: "Campaigns can only be created by wallets granted ORG_ROLE after admin or verifier review.",
  },
  {
    title: "Escrow until proof + vote + Safe",
    desc: "Funds stay in DonationVault (AVAX or USDC) until milestone evidence is in, donors pass a DAO vote, and the Safe executes the payout.",
  },
  {
    title: "Quadratic voting",
    desc: "Vote weight scales as √donation — softens whale dominance while still rewarding larger gifts.",
  },
  {
    title: "Evidence + receipt commitment",
    desc: "Orgs upload milestone evidence and a receipt file (SHA-256 + IPFS CID). Hash proves file integrity, not physical delivery.",
  },
  {
    title: "Quorum + timelock",
    desc: "Releases need majority donor participation and a waiting period before Safe execution (demo: shortened periods on Fuji).",
  },
  {
    title: "Safe 3-of-5 multi-sign",
    desc: "Outward milestone payouts require threshold signatures from the disbursement Safe — no single key can drain escrow to a third party.",
  },
  {
    title: "Deadline extension limits",
    desc: "On-chain: each extension may add at most 30 days beyond the current deadline.",
  },
  {
    title: "Automatic refund path",
    desc: "Failed or cancelled campaigns make donors eligible to reclaim contributions on-chain (pull refunds).",
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
      description="TranspaChain is a transparent giving platform on Avalanche Fuji: donations escrow in AVAX or USDC, donors vote with quadratic weight, and outward payouts require a Gnosis Safe 3-of-5 multi-signature — every step verifiable on Snowtrace."
      maxWidth="4xl"
      backgroundImage="/backgrounds/about.png"
    >
      <div className="space-y-8">
        <GlassPanel holoBorder className="p-6">
          <h2 className="mb-3 text-xl font-semibold text-teal-800 dark:text-holo-mint">Our mission</h2>
          <p className="leading-relaxed text-slate-600 dark:text-slate-300">
            We bridge the trust gap between donors and charitable organizations. Instead of sending funds
            directly to an org wallet, donations lock in a smart-contract escrow. Organizations earn trust by
            submitting milestone evidence; donors keep control through quadratic governance; and a{" "}
            <strong>Safe multi-sig</strong> must sign before money leaves escrow. Failed campaigns unlock
            on-chain refunds — accountability built into the protocol.
          </p>
        </GlassPanel>

        <ModuleTabs />

        <GlassPanel holoBorder className="p-6">
          <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">How it works</h2>
          <HowItWorksBlock columns={7} />
        </GlassPanel>

        <GlassPanel holoBorder className="p-6">
          <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">Get started by role</h2>
          <p className="mb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            New to TranspaChain? Pick your path below — each step links to the page where you take action.
          </p>
          <RoleFlows />
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
            <Scales size={22} className="text-teal-600 dark:text-holo-mint" weight="duotone" />
            Anti-abuse safeguards
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {ANTI_ABUSE.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-teal-300/50 dark:border-white/10 dark:bg-slate-900/90 dark:hover:border-holo-mint/20"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </GlassPanel>

      </div>
    </PageShell>
  );
}
