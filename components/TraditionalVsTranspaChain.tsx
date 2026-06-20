"use client";

import { Check, X } from "@phosphor-icons/react";

const ROWS = [
  { label: "Fund custody", traditional: "Org holds funds directly", transpachain: "Locked in on-chain escrow vault" },
  { label: "Release trigger", traditional: "Internal approval", transpachain: "DAO vote after milestone proof" },
  { label: "Transparency", traditional: "Periodic reports", transpachain: "Every tx & vote on Sepolia explorer" },
  { label: "Failed campaign", traditional: "Refund policy varies", transpachain: "Automatic refund eligibility on-chain" },
  { label: "Donor proof", traditional: "Receipt email", transpachain: "Impact NFT + tx hash" },
];

export function TraditionalVsTranspaChain({ compact = false }: { compact?: boolean }) {
  return (
    <div className="overflow-hidden">
      <div className="border-b border-white/10 bg-white/[0.02] px-4 py-3">
        <h3 className="text-sm font-semibold text-accent-shine">
          Traditional Charity vs TranspaChain
        </h3>
        {!compact && (
          <p className="mt-0.5 text-xs text-white/50">
            Key differences donors and orgs should know for demo Q&amp;A
          </p>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-white/50">
              <th className="px-4 py-2 font-medium">Aspect</th>
              <th className="px-4 py-2 font-medium">
                <span className="inline-flex items-center gap-1 text-red-400/80">
                  <X size={12} weight="bold" /> Traditional
                </span>
              </th>
              <th className="px-4 py-2 font-medium">
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <Check size={12} weight="bold" /> TranspaChain
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr
                key={row.label}
                className={i % 2 === 0 ? "bg-white/[0.02]" : ""}
              >
                <td className="whitespace-nowrap px-4 py-2.5 font-medium text-white/80">
                  {row.label}
                </td>
                <td className="px-4 py-2.5 text-white/50">{row.traditional}</td>
                <td className="px-4 py-2.5 font-medium text-emerald-400">
                  {row.transpachain}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
