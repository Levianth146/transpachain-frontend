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
    <section className="relative border-t border-white/10 bg-black py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-holo-mint/40 to-transparent"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="section-eyebrow mb-3">Why TranspaChain</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Charity infrastructure
            <span className="text-display-gradient"> built for trust.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
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
              className="glass-card group p-6 transition-all hover:-translate-y-1"
            >
              <div
                className={`mb-4 inline-flex rounded-xl border border-white/10 bg-white/[0.04] p-3 ${accent}`}
              >
                <Icon size={24} weight="duotone" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col items-center justify-between gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-8 sm:flex-row sm:p-10"
        >
          <div>
            <p className="font-display text-xl font-semibold text-white sm:text-2xl">
              Ready to make an impact?
            </p>
            <p className="mt-1 text-sm text-white/55">
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
