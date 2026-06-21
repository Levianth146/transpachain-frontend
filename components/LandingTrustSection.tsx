"use client";

import {
  ShieldCheck,
  Lock,
  Scales,
  ArrowCounterClockwise,
  FileMagnifyingGlass,
  Prohibit,
} from "@phosphor-icons/react";
import { GradientText } from "@/components/ui/GradientText";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const TRUST_ITEMS = [
  {
    icon: Lock,
    label: "Escrow vault",
    detail: "ETH or USDC locked until milestone approval",
  },
  {
    icon: Scales,
    label: "Quadratic voting",
    detail: "Vote weight = √donation; admin gates proposals first",
  },
  {
    icon: FileMagnifyingGlass,
    label: "Evidence review",
    detail: "Admin approves milestone proof before public vote",
  },
  {
    icon: Prohibit,
    label: "Admin safeguards",
    detail: "Suspicious proposals can be closed on-chain",
  },
  {
    icon: ArrowCounterClockwise,
    label: "On-chain refunds",
    detail: "Automatic if campaign fails or is cancelled",
  },
  {
    icon: ShieldCheck,
    label: "Verified orgs",
    detail: "Admin-verified wallet required to create campaigns",
  },
];

export function LandingTrustSection() {
  return (
    <section className="relative border-t border-slate-200/60 bg-white/50 py-20 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-10 text-center">
          <p className="section-eyebrow mb-4">Trust &amp; security</p>
          <h2 className="font-display text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl md:text-4xl">
            Accountability
            <GradientText className="ml-2">built into the protocol.</GradientText>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500">
            Verifiable on-chain safeguards — designed for donors who want proof, not promises.
          </p>
        </ScrollReveal>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST_ITEMS.map(({ icon: Icon, label, detail }, i) => (
            <ScrollReveal key={label} delay={i * 0.04}>
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/70 p-4 backdrop-blur-xl transition-colors hover:border-brand-teal/25 hover:shadow-glass">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                  <Icon size={18} className="text-brand-teal" weight="duotone" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-navy">{label}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{detail}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
