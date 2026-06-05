"use client";
import { motion } from "framer-motion";
import { Lock, FileMagnifyingGlass, Scales, ArrowCounterClockwise, Medal } from "@phosphor-icons/react";

const STEPS = [
  {
    icon: Lock,
    title: "Donate → Escrow",
    desc: "Funds lock in DonationVault smart contract — not sent to org wallet upfront.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: FileMagnifyingGlass,
    title: "Org submits proof",
    desc: "Milestone evidence uploaded to IPFS; donors can inspect before voting.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Scales,
    title: "DAO vote",
    desc: "Donors vote on-chain; 51% quorum + 24h timelock before release.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: ArrowCounterClockwise,
    title: "Refund path",
    desc: "Failed or cancelled campaigns trigger automatic refund eligibility.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Medal,
    title: "Impact NFT",
    desc: "Donors receive tiered NFTs (Bronze/Silver/Gold) as on-chain proof of impact.",
    color: "text-gold-500",
    bg: "bg-gold-500/10",
  },
];

export function HowItWorksBlock({ columns = 5 }: { columns?: 3 | 5 }) {
  const gridCols = columns === 3 ? "md:grid-cols-3" : "md:grid-cols-3 lg:grid-cols-5";

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-3`}>
      {STEPS.slice(0, columns).map((step, i) => (
        <motion.div
          key={step.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="rounded-xl border border-gray-100 dark:border-zinc-800 p-4 bg-white/80 dark:bg-ink-900/50"
        >
          <div className={`inline-flex p-2 rounded-lg ${step.bg} mb-2`}>
            <step.icon size={20} className={step.color} weight="duotone" />
          </div>
          <p className="font-semibold text-sm text-gray-900 dark:text-cream-100">{step.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{step.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}
