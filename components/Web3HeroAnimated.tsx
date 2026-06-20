"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Shield, Lock, Users, Target, Coins } from "lucide-react";
import { api } from "@/lib/api";
import { useSocketEvents } from "@/hooks/useSocket";
import { useOnChainPlatformStats } from "@/hooks/useOnChainPlatformStats";
import { SiteHeader } from "@/components/SiteHeader";
import { ConnectWallet } from "@/components/ConnectWallet";

function AnimatedCounter({
  value,
  suffix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000, bounce: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (v) => setDisplay(v));
  }, [springValue]);

  const formatted =
    decimals > 0
      ? display.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : Math.round(display).toLocaleString();

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}

function formatDonorLabel(count: number): string {
  return count === 1 ? "Donor" : "Donors";
}

export function Web3HeroAnimated() {
  const [isMounted, setIsMounted] = useState(false);
  const [donorCount, setDonorCount] = useState<number | null>(null);

  const loadDonorCount = () => {
    api
      .getStats()
      .then((s) => setDonorCount(s.countUniqueDonors ?? 0))
      .catch(() => setDonorCount(null));
  };

  const onChain = useOnChainPlatformStats();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 80);
    loadDonorCount();
    return () => clearTimeout(timer);
  }, []);

  useSocketEvents({
    donationReceived: () => loadDonorCount(),
    campaignCreated: () => loadDonorCount(),
  });

  const ethDonated = Number(onChain.totalEthWei) / 1e18;
  const usdcDonated = Number(onChain.totalUsdcWei) / 1e6;
  const totalCampaigns =
    onChain.ready && onChain.totalCampaigns != null ? onChain.totalCampaigns : 0;
  const donors =
    onChain.ready && totalCampaigns === 0 ? 0 : (donorCount ?? 0);

  const statPills = [
    {
      value: totalCampaigns,
      label: "Campaigns",
      icon: Target,
      color: "text-white",
      decimals: 0,
      suffix: "",
    },
    {
      value: onChain.ready ? ethDonated : 0,
      label: "Raised (net)",
      icon: Coins,
      color: "text-brand-purple-light",
      decimals: 2,
      suffix: " ETH",
    },
    {
      value: onChain.ready ? usdcDonated : 0,
      label: "USDC (net)",
      icon: Coins,
      color: "text-accent-shine",
      decimals: 0,
      suffix: " USDC",
    },
    {
      value: donors,
      label: formatDonorLabel(donors),
      icon: Users,
      color: "text-holo-mint",
      decimals: 0,
      suffix: "",
    },
  ];

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-black text-white">
      <div aria-hidden className="absolute inset-0 mesh-bg-hero" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_90%_80%_at_50%_20%,black,transparent)]"
      />
      <motion.div
        aria-hidden
        className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-brand-purple/20 blur-[140px]"
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -right-32 top-1/3 h-[400px] w-[400px] rounded-full bg-accent-purple/15 blur-[120px]"
        animate={{ opacity: [0.3, 0.6, 0.3], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 h-72 w-full max-w-5xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(94,234,212,0.1),transparent_70%)]"
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <SiteHeader variant="hero" />

        <div className="flex flex-1 flex-col items-center justify-center pb-20 pt-28 text-center sm:pt-32 lg:pb-28 lg:pt-36">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 12 }}
            transition={{ duration: 0.5 }}
            className="section-eyebrow mb-8"
          >
            Transparent giving · On-chain accountability
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 32 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="max-w-5xl font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6rem]"
          >
            <span className="block text-white">Give with</span>
            <span className="block text-display-gradient">confidence.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-8 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg md:text-xl"
          >
            TranspaChain locks every donation in on-chain escrow. Milestone proof is verified,
            releases are governed by donors, and your impact earns retro NFT badges.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="/campaigns" className="btn-primary group">
              Explore Campaigns
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <ConnectWallet variant="hero" />
            <Link href="/about" className="btn-secondary">
              How it works
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isMounted ? 1 : 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-white/45"
          >
            <span className="flex items-center gap-2">
              <Lock size={14} className="text-holo-mint" /> Escrow-protected
            </span>
            <span className="flex items-center gap-2">
              <Shield size={14} className="text-brand-purple-light" /> Donor governance
            </span>
            <span className="flex items-center gap-2">
              <Users size={14} className="text-accent-shine" /> Verified orgs
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 32 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-20 grid w-full max-w-4xl grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4"
          >
            {statPills.map(({ value, label, icon: Icon, color, decimals, suffix }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="stat-pill-glow group text-left transition-all hover:border-brand-purple/30"
              >
                <div className={`relative font-display text-2xl font-bold sm:text-3xl ${color}`}>
                  <AnimatedCounter value={value} suffix={suffix} decimals={decimals} />
                </div>
                <div className="relative mt-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white/40">
                  <Icon size={13} className="text-white/30" />
                  {label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
