"use client";

import { Lock, ShieldCheck, Medal } from "@phosphor-icons/react";
import { BrowserWindowCard } from "@/components/ui/BrowserWindowCard";
import { GradientText } from "@/components/ui/GradientText";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const FEATURES = [
  {
    icon: Lock,
    title: "Escrow-first giving",
    description:
      "Donations stay locked on-chain until milestones pass donor governance — no silent fund releases.",
    accent: "text-brand-teal",
    glow: "group-hover:shadow-[0_0_30px_rgba(20,184,166,0.08)]",
    showFlow: true,
  },
  {
    icon: ShieldCheck,
    title: "Verified organizations",
    description:
      "Charities are verified on-chain before launching campaigns. Admin review plus transparent records.",
    accent: "text-accent-purple",
    glow: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]",
  },
  {
    icon: Medal,
    title: "Impact NFT badges",
    description:
      "Earn retro synthwave donor badges — Bronze, Silver, and Gold tiers minted to your wallet per campaign.",
    accent: "text-accent-pink",
    glow: "group-hover:shadow-[0_0_30px_rgba(236,72,153,0.08)]",
  },
];

function EscrowFlow() {
  return (
    <div className="mt-6 flex flex-1 flex-col gap-0">
      {[
        { emoji: "💳", title: "Donor Wallet", sub: "ETH or USDC" },
        { emoji: "🔒", title: "Escrow Vault", sub: "Locked until vote passes", highlight: true },
        { emoji: "🏢", title: "Organization", sub: "After donor approval" },
      ].map((step, i, arr) => (
        <div key={step.title}>
          <div
            className={`flex items-center gap-3 rounded-xl border p-3.5 ${
              step.highlight
                ? "border-brand-teal/25 bg-teal-50/80"
                : "border-slate-200/80 bg-white/70"
            }`}
          >
            <span className="text-xl">{step.emoji}</span>
            <div>
              <p className="text-xs font-bold text-brand-navy">{step.title}</p>
              <p className="text-[11px] text-slate-500">{step.sub}</p>
            </div>
          </div>
          {i < arr.length - 1 && (
            <div className="flex h-5 items-center justify-center">
              <div className="h-full w-px bg-gradient-to-b from-brand-teal/40 to-brand-teal/10" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function LandingFeatures() {
  return (
    <section id="protocol" className="relative bg-white/40 py-28 backdrop-blur-sm">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-teal/25 to-transparent"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-16 max-w-3xl">
          <p className="section-eyebrow mb-4">Why TranspaChain</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            Charity infrastructure
            <GradientText className="ml-2">built for trust.</GradientText>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-500 sm:text-lg">
            A premium giving experience — milestone escrow, quadratic voting, and collectible impact
            badges — all verifiable on Ethereum Sepolia.
          </p>
        </ScrollReveal>

        <div className="grid gap-5 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description, accent, glow, showFlow }, i) => (
            <BrowserWindowCard
              key={title}
              title={title}
              delay={i * 0.08}
              bodyClassName={`p-7 ${showFlow ? "flex flex-col" : ""}`}
              className={`premium-card group ${glow}`}
            >
              <div
                className={`mb-5 inline-flex rounded-xl border border-slate-200/80 bg-white/80 p-3.5 ${accent} transition-transform group-hover:scale-110`}
              >
                <Icon size={26} weight="duotone" />
              </div>
              <h3 className="font-display text-lg font-semibold text-brand-navy">{title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-500">{description}</p>
              {showFlow && <EscrowFlow />}
            </BrowserWindowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
