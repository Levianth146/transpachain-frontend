"use client";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-emerald-200/40 dark:border-emerald-800/40 overflow-hidden bg-gradient-to-br from-white to-emerald-50/50 dark:from-ink-900 dark:to-emerald-950/20"
    >
      <div className="px-4 py-3 border-b border-emerald-100 dark:border-emerald-900/50 bg-emerald-600/5">
        <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm">
          Traditional Charity vs TranspaChain
        </h3>
        {!compact && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Key differences donors and orgs should know for demo Q&amp;A
          </p>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-800">
              <th className="px-4 py-2 font-medium">Aspect</th>
              <th className="px-4 py-2 font-medium">
                <span className="inline-flex items-center gap-1 text-red-600/80">
                  <X size={12} weight="bold" /> Traditional
                </span>
              </th>
              <th className="px-4 py-2 font-medium">
                <span className="inline-flex items-center gap-1 text-emerald-600">
                  <Check size={12} weight="bold" /> TranspaChain
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr
                key={row.label}
                className={i % 2 === 0 ? "bg-white/50 dark:bg-white/[0.02]" : ""}
              >
                <td className="px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {row.label}
                </td>
                <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">{row.traditional}</td>
                <td className="px-4 py-2.5 text-emerald-700 dark:text-emerald-400 font-medium">
                  {row.transpachain}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
