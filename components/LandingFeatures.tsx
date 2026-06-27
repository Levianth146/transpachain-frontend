"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, Medal, ChartLineUp } from "@phosphor-icons/react";

const FEATURES = [
  {
    icon: Lock,
    title: "Escrow-first giving",
    description:
      "Donations stay locked on-chain until milestones pass donor governance — no silent fund releases.",
    accent: "text-holo-mint",
  },
  {
    icon: ShieldCheck,
    title: "Verified organizations",
    description:
      "Charities are verified on-chain before launching campaigns. Admin review plus transparent records.",
    accent: "text-accent-shine",
  },
  {
    icon: Medal,
    title: "Impact NFT badges",
    description:
      "Earn retro synthwave donor badges — Bronze, Silver, and Gold tiers minted to your wallet per campaign.",
    accent: "text-holo-pink",
  },
  {
    icon: ChartLineUp,
    title: "Live on-chain stats",
    description:
      "Raised amounts read directly from Sepolia contracts. Indexed metadata keeps the experience fast.",
    accent: "text-holo-lavender",
  },
];

export function LandingFeatures() {
  return (
    <section className="relative border-t border-slate-200/80 bg-slate-50 py-24 dark:border-white/10 dark:bg-black">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent dark:via-holo-mint/40"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="section-eyebrow mb-3">Why TranspaChain</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl dark:text-white">
            Charity infrastructure
            <span className="text-display-gradient"> built for trust.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg dark:text-white/60">
            A premium giving experience — milestone escrow, quadratic voting, and collectible impact
            badges — all verifiable on Ethereum Sepolia.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description, accent }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:border-white/15"
            >
              <div
                className={`mb-4 inline-flex rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04] ${accent}`}
              >
                <Icon size={24} weight="duotone" />
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-800 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-white/55">{description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:flex-row sm:p-10 dark:border-white/10 dark:bg-gradient-to-br dark:from-white/[0.06] dark:to-transparent dark:shadow-none"
        >
          <div>
            <p className="font-display text-xl font-semibold text-slate-900 sm:text-2xl dark:text-white">
              Ready to make an impact?
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-white/55">
              Browse active campaigns or launch your own in minutes.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/campaigns" className="btn-primary">
              Explore campaigns
            </Link>
            <Link href="/dashboard" className="btn-secondary">
              My dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
