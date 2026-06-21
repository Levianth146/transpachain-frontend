"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function CtaCloser() {
  return (
    <section className="relative z-10 overflow-hidden border-t border-white/[0.06] px-4 py-[120px] text-center sm:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.1),transparent_65%)]"
      />
      <ScrollReveal className="relative mx-auto max-w-[1000px]">
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.16em] text-text-primary/25">
          Ready to give with confidence?
        </p>
        <h2 className="font-display text-[clamp(3.5rem,9vw,7rem)] font-bold leading-[0.93] tracking-[-0.045em] text-text-primary text-balance">
          TRANSPA
        </h2>
        <h2 className="mb-11 font-display text-[clamp(3.5rem,9vw,7rem)] font-bold leading-[0.93] tracking-[-0.045em] text-gradient-cta text-balance">
          CHAIN ◈
        </h2>
        <p className="mx-auto mb-12 max-w-[520px] text-lg leading-[1.72] text-text-primary/40">
          Explore active campaigns or create your own. Escrow-locked. Community-governed.
          Nothing hidden, everything provable.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/campaigns" className="btn-primary-dark px-12 py-4 text-base shadow-glow">
            Explore Campaigns
          </Link>
          <Link href="/campaigns/create" className="btn-secondary-dark px-12 py-4 text-base">
            Create Campaign
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
