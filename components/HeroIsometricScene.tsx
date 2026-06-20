"use client";

import { motion } from "framer-motion";
import { Lock, Shield, Users } from "lucide-react";

const FLOAT_CARDS = [
  {
    title: "Escrow Protected",
    description: "Funds locked on-chain until milestones met.",
    icon: Lock,
    iconClass: "text-brand-teal",
    iconBg: "bg-teal-50",
    delay: 0.3,
    y: [0, -6, 0],
    x: "72%",
    top: "8%",
  },
  {
    title: "Milestone Verified",
    description: "Proof verified by oracles and donors.",
    icon: Shield,
    iconClass: "text-accent-purple",
    iconBg: "bg-violet-50",
    delay: 0.5,
    y: [0, -8, 0],
    x: "78%",
    top: "38%",
  },
  {
    title: "Impact On-Chain",
    description: "Your impact is recorded and rewarded.",
    icon: Users,
    iconClass: "text-brand-teal",
    iconBg: "bg-teal-50",
    delay: 0.7,
    y: [0, -5, 0],
    x: "68%",
    top: "68%",
  },
];

export function HeroIsometricScene() {
  return (
    <div className="relative mx-auto h-[420px] w-full max-w-lg sm:h-[480px] lg:h-[520px]">
      {/* Isometric grid floor */}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#8b5cf6" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#ec4899" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="platformGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="isoGrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M12 0 L24 6 L24 18 L12 24 L0 18 L0 6 Z" fill="none" stroke="rgba(20,184,166,0.08)" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Grid background */}
        <rect width="400" height="400" fill="url(#isoGrid)" opacity="0.6" />

        {/* Dotted connection lines */}
        <motion.path
          d="M 80 280 Q 140 220 200 200"
          fill="none"
          stroke="#14b8a6"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          opacity="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
        />
        <motion.path
          d="M 320 300 Q 260 230 200 200"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          opacity="0.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
        />
        <motion.path
          d="M 200 340 Q 200 270 200 200"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          opacity="0.45"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
        />

        {/* Hexagonal platform - bottom tier */}
        <polygon
          points="200,260 260,295 200,330 140,295"
          fill="url(#platformGrad)"
          stroke="rgba(226,232,240,0.9)"
          strokeWidth="1.5"
        />
        {/* Hexagonal platform - top tier */}
        <polygon
          points="200,220 240,243 200,266 160,243"
          fill="#ffffff"
          stroke="rgba(226,232,240,0.9)"
          strokeWidth="1"
        />
        {/* Platform shadow */}
        <ellipse cx="200" cy="335" rx="70" ry="12" fill="rgba(15,23,42,0.06)" />

        {/* Isometric cubes */}
        {/* Left cube */}
        <g transform="translate(70, 250)">
          <polygon points="0,20 20,10 40,20 20,30" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
          <polygon points="0,20 0,40 20,50 20,30" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          <polygon points="20,30 40,20 40,40 20,50" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
          <circle cx="20" cy="22" r="6" fill="none" stroke="#14b8a6" strokeWidth="1.5" />
          <rect x="17" y="24" width="6" height="4" rx="1" fill="#14b8a6" opacity="0.6" />
        </g>
        {/* Right cube */}
        <g transform="translate(290, 265)">
          <polygon points="0,20 20,10 40,20 20,30" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
          <polygon points="0,20 0,40 20,50 20,30" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          <polygon points="20,30 40,20 40,40 20,50" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
          <path d="M 14 18 L 20 14 L 26 18 L 26 24 L 20 28 L 14 24 Z" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
        </g>
        {/* Back cube */}
        <g transform="translate(160, 290)">
          <polygon points="0,15 15,7 30,15 15,23" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
          <polygon points="0,15 0,30 15,38 15,23" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          <polygon points="15,23 30,15 30,30 15,38" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
        </g>

        {/* Glowing heart */}
        <motion.g
          filter="url(#glow)"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M 200 195 C 200 175 170 165 170 185 C 170 205 200 225 200 225 C 200 225 230 205 230 185 C 230 165 200 175 200 195 Z"
            fill="url(#heartGrad)"
            opacity="0.85"
          />
          <path
            d="M 200 195 C 200 175 170 165 170 185 C 170 205 200 225 200 225 C 200 225 230 205 230 185 C 230 165 200 175 200 195 Z"
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1"
          />
        </motion.g>

        {/* Ambient glow behind heart */}
        <motion.ellipse
          cx="200"
          cy="200"
          rx="50"
          ry="30"
          fill="rgba(20,184,166,0.12)"
          animate={{ opacity: [0.4, 0.7, 0.4], rx: [45, 55, 45] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Floating glass cards */}
      {FLOAT_CARDS.map(
        ({ title, description, icon: Icon, iconClass, iconBg, delay, y, x, top }) => (
          <motion.div
            key={title}
            className="floating-card absolute z-10 w-[180px] sm:w-[200px]"
            style={{ left: x, top }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, y }}
            transition={{
              opacity: { duration: 0.6, delay },
              x: { duration: 0.6, delay },
              y: { duration: 3 + delay, repeat: Infinity, ease: "easeInOut", delay },
            }}
          >
            <div className="flex items-start gap-2.5">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
                <Icon size={15} className={iconClass} />
              </div>
              <div>
                <p className="text-xs font-semibold text-brand-navy">{title}</p>
                <p className="mt-0.5 text-[10px] leading-snug text-slate-500">{description}</p>
              </div>
            </div>
          </motion.div>
        )
      )}
    </div>
  );
}
