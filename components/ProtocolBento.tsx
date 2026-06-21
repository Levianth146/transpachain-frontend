"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

function BrowserDots() {
  return (
    <div className="mb-5 flex gap-1.5">
      <span className="browser-dot-indigo" />
      <span className="browser-dot-purple" />
      <span className="browser-dot-cyan" />
    </div>
  );
}

export function ProtocolBento() {
  return (
    <section id="protocol" className="relative z-10 mx-auto max-w-[1380px] px-4 pb-24 sm:px-10">
      <SectionHeader
        number="02"
        label="Protocol"
        title={
          <>
            The infrastructure
            <br />
            of trust.
          </>
        }
        className="mb-12"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
        {/* Escrow — tall left */}
        <ScrollReveal className="glass-panel glass-panel-hover flex flex-col rounded-[20px] p-[30px] md:row-span-2">
          <BrowserDots />
          <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] border border-indigo-500/30 bg-gradient-to-br from-indigo-950 to-indigo-900 text-2xl">
            🔒
          </div>
          <h3 className="mb-3 font-display text-[22px] font-bold text-text-primary">
            Escrow-first giving
          </h3>
          <p className="mb-7 text-sm leading-[1.72] text-text-primary/44">
            Your donation never goes directly to the org. It&apos;s locked in a
            smart-contract vault until milestones are proven and you vote to release.
          </p>
          <div className="flex flex-1 flex-col gap-0">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3.5">
              <span className="text-xl">💳</span>
              <div>
                <p className="text-xs font-bold text-text-primary">Donor Wallet</p>
                <p className="text-[11px] text-text-primary/36">ETH or USDC</p>
              </div>
            </div>
            <div className="flex h-[26px] items-center justify-center">
              <div className="h-full w-px bg-gradient-to-b from-indigo-500/50 to-indigo-500/15" />
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-indigo-500/25 bg-gradient-to-br from-indigo-500/10 to-purple-500/[0.07] p-3.5">
              <span className="text-xl">🔒</span>
              <div>
                <p className="text-xs font-bold text-text-primary">Escrow Vault</p>
                <p className="text-[11px] font-semibold text-indigo-400">
                  Locked until vote passes
                </p>
              </div>
            </div>
            <div className="flex h-[26px] items-center justify-center">
              <div className="h-full w-px bg-gradient-to-b from-emerald-500/20 to-emerald-500/60" />
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.06] p-3.5">
              <span className="text-xl">🏢</span>
              <div>
                <p className="text-xs font-bold text-text-primary">Organization Wallet</p>
                <p className="text-[11px] font-semibold text-emerald-500">After donor approval</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-[18px]">
            <span className="text-xs font-semibold text-indigo-400">ETH &amp; USDC</span>
            <span className="text-[11px] text-text-primary/28">ERC-20 compatible</span>
          </div>
        </ScrollReveal>

        {/* Governance — wide top right */}
        <ScrollReveal
          index={1}
          className="glass-panel glass-panel-hover rounded-[20px] p-[30px] md:col-span-2"
        >
          <BrowserDots />
          <div className="grid items-start gap-7 md:grid-cols-2">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[13px] border border-purple-500/28 bg-gradient-to-br from-purple-950 to-purple-900 text-[22px]">
                🗳️
              </div>
              <h3 className="mb-2.5 font-display text-[21px] font-bold text-text-primary">
                Donor-controlled releases
              </h3>
              <p className="mb-4 text-sm leading-[1.7] text-text-primary/44">
                Donors vote on every milestone release. Quadratic weighting ensures
                small donors have equal say.
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/[0.08] px-3 py-1 text-[13px] font-bold text-purple-400">
                Weight = √donation
              </span>
            </div>
            <div className="rounded-[14px] border border-white/[0.08] bg-white/[0.04] p-[18px]">
              <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-primary/32">
                Proposal #5
              </p>
              <p className="mb-4 text-[13px] font-semibold text-text-primary">
                Release Milestone 2 — 0.6 ETH
              </p>
              <div className="mb-2.5">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-semibold text-emerald-500">Approve</span>
                  <span className="font-display font-bold text-emerald-500">72%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500" />
                </div>
              </div>
              <div className="mb-3.5">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-semibold text-slate-500">Reject</span>
                  <span className="font-display font-bold text-slate-500">28%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                  <div className="h-full w-[28%] rounded-full bg-slate-500/45" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-text-primary/30">24 donors · 3 days left</span>
                <span className="text-[11px] font-bold text-emerald-500">Passing ✓</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Verified orgs */}
        <ScrollReveal index={2} className="glass-panel glass-panel-hover rounded-[20px] p-[26px]">
          <BrowserDots />
          <div className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/22 bg-gradient-to-br from-emerald-950 to-emerald-800 text-xl">
            ✅
          </div>
          <h3 className="mb-2 font-display text-[19px] font-bold text-text-primary">
            Verified organizations
          </h3>
          <p className="mb-4 text-[13px] leading-[1.65] text-text-primary/40">
            KYC&apos;d wallet addresses only. Admin-verified before any campaign goes live.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {["GreenViet ✓", "MedReach ✓", "EduBuild ✓", "+9 more"].map((tag) => (
              <span
                key={tag}
                className={
                  tag.startsWith("+")
                    ? "rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-text-primary/32"
                    : "rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-2.5 py-1 text-[11px] font-semibold text-emerald-500"
                }
              >
                {tag}
              </span>
            ))}
          </div>
        </ScrollReveal>

        {/* Impact NFT */}
        <ScrollReveal index={3} className="glass-panel glass-panel-hover rounded-[20px] p-[26px]">
          <BrowserDots />
          <div className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/22 bg-gradient-to-br from-amber-950 to-amber-900 text-xl">
            🏅
          </div>
          <h3 className="mb-2 font-display text-[19px] font-bold text-text-primary">
            Impact NFT badges
          </h3>
          <p className="mb-4 text-[13px] leading-[1.65] text-text-primary/40">
            Every verified milestone auto-mints a permanent on-chain proof of generosity.
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { emoji: "🥉", tier: "Bronze", threshold: "≥0.01 ETH", color: "text-amber-500", bg: "from-amber-900/35 to-amber-600/18", border: "border-amber-500/22" },
              { emoji: "🥈", tier: "Silver", threshold: "≥0.1 ETH", color: "text-slate-400", bg: "from-slate-800/50 to-slate-600/25", border: "border-slate-400/18" },
              { emoji: "🥇", tier: "Gold", threshold: "≥0.5 ETH", color: "text-yellow-500", bg: "from-amber-900/35 to-yellow-500/18", border: "border-yellow-500/22" },
            ].map(({ emoji, tier, threshold, color, bg, border }) => (
              <div
                key={tier}
                className={`rounded-[10px] border ${border} bg-gradient-to-br ${bg} px-1.5 py-2.5 text-center`}
              >
                <span className="mb-0.5 block text-[22px]">{emoji}</span>
                <span className={`block text-[10px] font-bold ${color}`}>{tier}</span>
                <span className="mt-px block text-[9px] text-text-primary/28">{threshold}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
