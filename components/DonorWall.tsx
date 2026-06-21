"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const FALLBACK_DONORS = [
  { addr: "0x7f3a...42b1", amount: "0.5 ETH", campaign: "Clean Water for Vietnam", badge: "🥈 Silver", gradient: "from-indigo-800 to-indigo-500" },
  { addr: "0x2c91...8f3e", amount: "1,200 USDC", campaign: "Medical Aid for Gaza", badge: "🥇 Gold", gradient: "from-purple-800 to-purple-500" },
  { addr: "0x9d4b...1a7c", amount: "0.15 ETH", campaign: "Flood School Rebuild", badge: "🥈 Silver", gradient: "from-cyan-800 to-cyan-500" },
  { addr: "0x5e8f...3d2a", amount: "0.08 ETH", campaign: "Reforestation Project", badge: "🥉 Bronze", gradient: "from-emerald-800 to-emerald-500" },
  { addr: "0x1a6c...9e4f", amount: "800 USDC", campaign: "Rural Healthcare Clinic", badge: "🥉 Bronze", gradient: "from-violet-800 to-violet-500" },
  { addr: "0x8b3d...7c1e", amount: "0.3 ETH", campaign: "Community Food Bank", badge: "🥇 Gold", gradient: "from-indigo-900 to-indigo-600" },
];

export function DonorWall() {
  return (
    <section id="donors" className="relative z-10 mx-auto max-w-[1380px] px-4 pb-24 sm:px-10">
      <SectionHeader
        number="04"
        label="Recent Activity"
        title={
          <>
            Real donors.
            <br />
            Real impact.
          </>
        }
        className="mb-11"
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FALLBACK_DONORS.map((donor, i) => (
          <ScrollReveal
            key={donor.addr}
            index={i}
            className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-[18px] transition-colors hover:border-indigo-500/30"
          >
            <div
              className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] bg-gradient-to-br ${donor.gradient} font-mono text-xs font-bold text-white`}
            >
              {donor.addr.slice(2, 4)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-0.5 truncate font-mono text-[11px] text-text-primary/32">
                {donor.addr}
              </p>
              <p className="mb-1 text-[13px] font-semibold text-text-primary">
                Donated <span className="text-indigo-400">{donor.amount}</span>
              </p>
              <p className="mb-1.5 text-xs text-text-primary/36">{donor.campaign}</p>
              <span className="inline-block rounded-full border border-slate-400/18 bg-slate-400/10 px-2 py-0.5 text-[10px] font-bold text-slate-400">
                {donor.badge}
              </span>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
