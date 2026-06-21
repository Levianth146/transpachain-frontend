"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const STEPS = [
  {
    num: "01",
    title: "Donate to Escrow",
    description:
      "Send ETH or USDC to the campaign vault. Funds are locked — never directly to the org.",
  },
  {
    num: "02",
    title: "Verify Evidence",
    description:
      "Orgs submit milestone proof; admin reviews before proposals reach donors.",
  },
  {
    num: "03",
    title: "Donors Vote",
    description:
      "Quadratic voting with √donation weight, quorum, and 24h timelock.",
  },
  {
    num: "04",
    title: "Earn Impact NFT",
    description:
      "Receive Bronze, Silver, or Gold badges minted to your wallet per campaign.",
  },
];

function StepCard({ num, title, description, index }: (typeof STEPS)[0] & { index: number }) {
  return (
    <ScrollReveal index={index} className="glass-card-dark overflow-hidden transition-colors hover:border-indigo-500/30">
      <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.04] px-3.5 py-2">
        <div className="flex gap-1">
          <span className="browser-dot-indigo" />
          <span className="browser-dot-purple" />
          <span className="browser-dot-cyan" />
        </div>
      </div>
      <div className="p-[22px] pt-[26px]">
        <div className="mb-3.5 font-display text-[50px] font-bold leading-none text-gradient-hero">
          {num}
        </div>
        <h4 className="mb-2.5 font-display text-[17px] font-bold text-text-primary">{title}</h4>
        <p className="text-[13px] leading-[1.68] text-text-primary/44">{description}</p>
      </div>
    </ScrollReveal>
  );
}

export function LandingHowItWorks() {
  return (
    <section id="how" className="relative z-10 border-t border-white/[0.06]">
      <div className="mx-auto max-w-[1380px] px-4 py-24 sm:px-10">
        <SectionHeader
          number="03"
          label="Process"
          title={
            <>
              Four steps.
              <br />
              Infinite trust.
            </>
          }
          className="mb-[52px]"
        />
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <StepCard key={step.num} {...step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
