"use client";

import Link from "next/link";
import { Lock, ShieldCheck, Medal, ChartLineUp } from "@phosphor-icons/react";
import { ArrowRight } from "lucide-react";
import { BrowserWindowCard } from "@/components/ui/BrowserWindowCard";
import { GradientText } from "@/components/ui/GradientText";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const FEATURES = [
  {
    icon: Lock,
    title: "Escrow-first giving",
    description:
      "Donations stay locked on-chain until milestones pass donor governance — no silent fund releases.",
    accent: "text-holo-mint",
    glow: "group-hover:shadow-[0_0_30px_rgba(94,234,212,0.08)]",
  },
  {
    icon: ShieldCheck,
    title: "Verified organizations",
    description:
      "Charities are verified on-chain before launching campaigns. Admin review plus transparent records.",
    accent: "text-brand-purple-light",
    glow: "group-hover:shadow-[0_0_30px_rgba(140,103,255,0.1)]",
  },
  {
    icon: Medal,
    title: "Impact NFT badges",
    description:
      "Earn retro synthwave donor badges — Bronze, Silver, and Gold tiers minted to your wallet per campaign.",
    accent: "text-holo-pink",
    glow: "group-hover:shadow-[0_0_30px_rgba(249,168,212,0.08)]",
  },
  {
    icon: ChartLineUp,
    title: "Live on-chain stats",
    description:
      "Raised amounts read directly from Sepolia contracts. Indexed metadata keeps the experience fast.",
    accent: "text-accent-shine",
    glow: "group-hover:shadow-[0_0_30px_rgba(100,206,251,0.08)]",
  },
];

export function LandingFeatures() {
  return (
    <section className="relative bg-black py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-purple/30 to-transparent"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-16 max-w-3xl">
          <p className="section-eyebrow mb-4">Why TranspaChain</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            Charity infrastructure
            <GradientText className="ml-2">built for trust.</GradientText>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/55 sm:text-lg">
            A premium giving experience — milestone escrow, quadratic voting, and collectible impact
            badges — all verifiable on Ethereum Sepolia.
          </p>
        </ScrollReveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description, accent, glow }, i) => (
            <BrowserWindowCard
              key={title}
              title={title}
              delay={i * 0.08}
              bodyClassName="p-7"
              className={`premium-card group ${glow}`}
            >
              <div
                className={`mb-5 inline-flex rounded-xl border border-white/10 bg-white/[0.04] p-3.5 ${accent} transition-transform group-hover:scale-110`}
              >
                <Icon size={26} weight="duotone" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-white/50">{description}</p>
            </BrowserWindowCard>
          ))}
        </div>

        <BrowserWindowCard
          title="Ready to make an impact?"
          delay={0.2}
          bodyClassName="p-8 sm:p-12"
          className="cta-banner mt-20 border-0 bg-transparent shadow-none"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-purple/20 blur-[80px]"
          />
          <div className="relative flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
            <div>
              <p className="font-display text-2xl font-bold text-white sm:text-3xl">
                Ready to make an impact?
              </p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/55 sm:text-base">
                Browse active campaigns or launch your own in minutes — every donation is escrowed
                and every release is voted on.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link href="/campaigns" className="btn-primary group hover:scale-110">
                Explore campaigns
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="/campaigns/create" className="btn-secondary hover:scale-110">
                Create campaign
              </Link>
            </div>
          </div>
        </BrowserWindowCard>
      </div>
    </section>
  );
}
