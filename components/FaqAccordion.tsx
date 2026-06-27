"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown } from "@phosphor-icons/react";

const FAQ_ITEMS = [
  {
    q: "How are donations protected?",
    a: "Every donation locks in the DonationVault smart contract on Sepolia. Funds release only after milestone proof is admin-approved and donors vote with 51% quorum plus a 24-hour timelock.",
  },
  {
    q: "What happens if a campaign fails?",
    a: "If the goal is not met by the deadline, the campaign can be finalized as Failed. Donors reclaim their proportional share from escrow via claimRefund() — no admin approval needed.",
  },
  {
    q: "What are Impact NFTs?",
    a: "ERC-721 donor badges minted per campaign — Bronze, Silver, or Gold tiers based on donation amount. They are proof-of-impact souvenirs on testnet, viewable in MetaMask.",
  },
  {
    q: "Why quadratic voting?",
    a: "Vote weight equals the square root of your donation, reducing whale dominance while still rewarding larger contributors. Splitting across wallets does not increase total influence.",
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative border-t border-white/10 bg-black py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="section-eyebrow mb-3">FAQ</p>
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
          Common questions
        </h2>
        <div className="mt-8 space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="glass-card overflow-hidden transition-all hover:-translate-y-0.5"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-medium text-white">{item.q}</span>
                  <CaretDown
                    size={18}
                    className={`shrink-0 text-holo-mint transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm leading-relaxed text-white/60">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
