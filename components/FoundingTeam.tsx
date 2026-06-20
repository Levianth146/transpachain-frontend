"use client";

import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GithubLogo, LinkedinLogo, TwitterLogo } from "@phosphor-icons/react";

const TEAM = [
  {
    name: "Alex Chen",
    role: "Protocol & Smart Contracts",
    bio: "Solidity architect behind escrow, DAO quorum, and Impact NFT tiers.",
    gradient: "from-holo-mint/30 to-holo-lavender/20",
  },
  {
    name: "Maya Okonkwo",
    role: "Product & Donor Experience",
    bio: "Web3 UX lead — holo design system, campaign flows, and transparency surfaces.",
    gradient: "from-holo-lavender/30 to-holo-pink/20",
  },
  {
    name: "Jordan Reyes",
    role: "Infrastructure & Indexer",
    bio: "Backend, event indexing, IPFS metadata pipeline, and Sepolia ops.",
    gradient: "from-holo-pink/30 to-holo-silver/20",
  },
];

export function FoundingTeam({ compact = false }: { compact?: boolean }) {
  return (
    <GlassPanel holoBorder className="p-6">
      <div className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-holo-mint/80 mb-2">Core contributors</p>
        <h2 className="font-display text-2xl font-bold text-white">Founding Team</h2>
        {!compact && (
          <p className="mt-2 text-sm text-white/60 max-w-xl mx-auto">
            Built on Ethereum Sepolia — combining escrow mechanics, quadratic governance, and retro Impact NFTs.
          </p>
        )}
      </div>
      <div className={`grid gap-4 ${compact ? "sm:grid-cols-3" : "md:grid-cols-3"}`}>
        {TEAM.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${member.gradient} p-5`}
          >
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `repeating-conic-gradient(rgba(255,255,255,0.06) 0% 25%, transparent 0% 50%)`,
                backgroundSize: "8px 8px",
              }}
            />
            <div className="relative">
              <div className="mb-3 h-14 w-14 rounded-xl bg-black/40 border border-white/20 flex items-center justify-center font-display text-xl font-bold text-holo-mint">
                {member.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <p className="font-display font-semibold text-white">{member.name}</p>
              <p className="text-xs text-holo-lavender mt-0.5">{member.role}</p>
              {!compact && (
                <p className="mt-2 text-xs leading-relaxed text-white/60">{member.bio}</p>
              )}
              <div className="mt-3 flex gap-2 text-white/40">
                <TwitterLogo size={16} className="hover:text-holo-mint cursor-pointer" />
                <LinkedinLogo size={16} className="hover:text-holo-mint cursor-pointer" />
                <GithubLogo size={16} className="hover:text-holo-mint cursor-pointer" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassPanel>
  );
}
