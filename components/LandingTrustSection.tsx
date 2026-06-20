"use client";

import {
  ShieldCheck,
  Lock,
  Scales,
  ArrowCounterClockwise,
  FileMagnifyingGlass,
  Prohibit,
} from "@phosphor-icons/react";
import { TraditionalVsTranspaChain } from "@/components/TraditionalVsTranspaChain";
import { BrowserWindowCard } from "@/components/ui/BrowserWindowCard";
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
    <section className="relative bg-black py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <div>
            <ScrollReveal>
              <p className="section-eyebrow mb-4">Trust &amp; security</p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Accountability
                <GradientText className="ml-2">built into the protocol.</GradientText>
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/55">
                TranspaChain replaces blind trust with verifiable on-chain safeguards — designed for
                donors who want proof, not promises.
              </p>
            </ScrollReveal>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {TRUST_ITEMS.map(({ icon: Icon, label, detail }, i) => (
                <BrowserWindowCard
                  key={label}
                  title={label}
                  delay={i * 0.06}
                  bodyClassName="flex items-start gap-3 p-4 transition-colors hover:border-brand-purple/25"
                  className="border-white/[0.08] bg-white/[0.02]"
                >
                  <Icon size={20} className="mt-0.5 shrink-0 text-holo-mint" weight="duotone" />
                  <div>
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/45">{detail}</p>
                  </div>
                </BrowserWindowCard>
              ))}
            </div>
          </div>

          <BrowserWindowCard
            title="Traditional vs TranspaChain"
            delay={0.15}
            bodyClassName="p-0"
          >
            <TraditionalVsTranspaChain />
          </BrowserWindowCard>
        </div>
      </div>
    </section>
  );
}
