"use client";
import { ShieldCheck, Lock, Scales, ArrowCounterClockwise, FileMagnifyingGlass, Prohibit } from "@phosphor-icons/react";

const CALLOUTS = [
  { icon: Lock, label: "Escrow vault", detail: "ETH or USDC locked until milestone approval" },
  { icon: Scales, label: "Quadratic voting", detail: "Vote weight = √donation; admin gates proposals first" },
  { icon: FileMagnifyingGlass, label: "Evidence review", detail: "Admin approves milestone proof before public vote" },
  { icon: Prohibit, label: "Admin safeguards", detail: "Suspicious proposals can be closed on-chain (closeProposal)" },
  { icon: ArrowCounterClockwise, label: "On-chain refunds", detail: "Automatic if campaign fails or is cancelled" },
  { icon: ShieldCheck, label: "Verified orgs", detail: "Admin-verified wallet required to create campaigns" },
];

export function TrustSecurityStrip() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
      {CALLOUTS.map(({ icon: Icon, label, detail }) => (
        <div
          key={label}
          className="flex items-start gap-2 rounded-xl border border-emerald-200/30 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-950/20 px-3 py-2.5"
        >
          <Icon size={18} className="text-emerald-600 shrink-0 mt-0.5" weight="duotone" />
          <div>
            <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">{label}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-snug">{detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
