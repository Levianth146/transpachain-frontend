"use client";

import Link from "next/link";
import { Lock, FileMagnifyingGlass, Scales, Medal } from "@phosphor-icons/react";
import { BrowserWindowCard } from "@/components/ui/BrowserWindowCard";
import { GradientText } from "@/components/ui/GradientText";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const STEPS = [
  {
    step: "01",
    icon: Lock,
    title: "Donate to escrow",
    description: "Funds lock in DonationVault — ETH or USDC — until milestones are approved.",
    accent: "from-brand-purple/20 to-transparent",
    iconColor: "text-holo-mint",
  },
  {
    step: "02",
    icon: FileMagnifyingGlass,
    title: "Verify evidence",
    description: "Orgs submit milestone proof; admin reviews before proposals reach donors.",
    accent: "from-accent-shine/15 to-transparent",
    iconColor: "text-accent-shine",
  },
  {
    step: "03",
    icon: Scales,
    title: "Donors vote",
    description: "Quadratic voting with √donation weight, quorum, and 24h timelock.",
    accent: "from-holo-pink/15 to-transparent",
    iconColor: "text-holo-pink",
  },
  {
    step: "04",
    icon: Medal,
    title: "Earn impact NFT",
    description: "Receive Bronze, Silver, or Gold badges minted to your wallet per campaign.",
    accent: "from-gold-400/15 to-transparent",
    iconColor: "text-gold-400",
  },
];

export function LandingHowItWorks() {
  return (
    <section className="relative bg-black py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="section-eyebrow mb-4">How it works</p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              From donation to
              <GradientText className="ml-2">verified impact.</GradientText>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/55 sm:text-lg">
              Every step is on-chain and auditable — escrow, evidence, governance, and collectible
              proof of giving.
            </p>
          </div>
          <Link href="/about" className="btn-secondary shrink-0 self-start hover:scale-110 lg:self-auto">
            Full workflow →
          </Link>
        </ScrollReveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ step, icon: Icon, title, description, accent, iconColor }, i) => (
            <BrowserWindowCard
              key={step}
              title={`Step ${step}`}
              delay={i * 0.1}
              bodyClassName="group relative overflow-hidden p-6"
              className="premium-card"
            >
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />
              <span className="relative text-[11px] font-semibold tracking-[0.2em] text-white/30">
                {step}
              </span>
              <div
                className={`relative mt-4 inline-flex rounded-xl border border-white/10 bg-white/[0.04] p-3 ${iconColor} transition-transform group-hover:scale-110`}
              >
                <Icon size={22} weight="duotone" />
              </div>
              <h3 className="relative mt-4 font-display text-lg font-semibold text-white">
                {title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-white/50">{description}</p>
            </BrowserWindowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
