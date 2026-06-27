"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Shield, Lock, Users, Target, Coins } from "lucide-react";
import { api } from "@/lib/api";
import { useSocketEvents } from "@/hooks/useSocket";
import { useOnChainPlatformStats } from "@/hooks/useOnChainPlatformStats";
import { SiteHeader } from "@/components/SiteHeader";
import { PageBackground } from "@/components/ui/PageBackground";

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
  const donors = donorCount ?? 0;

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
      color: "text-accent-shine",
      decimals: 2,
      suffix: " ETH",
    },
    {
      value: onChain.ready ? usdcDonated : 0,
      label: "USDC (net)",
      icon: Coins,
      color: "text-holo-lavender",
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
    <section className="relative isolate min-h-screen overflow-hidden text-white">
      <PageBackground image="/backgrounds/landing.png" overlay="hero" />
      {/* Unified mesh + vault accent overlays (CSS only, no second image layer) */}
      <div aria-hidden className="absolute inset-0 z-[1] mesh-bg opacity-35" />
      <div
        aria-hidden
        className="absolute inset-0 z-[1] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_30%,black,transparent)]"
      />
      <div
        aria-hidden
        className="absolute -left-32 top-1/4 z-[1] h-96 w-96 rounded-full bg-holo-mint/12 blur-[120px]"
      />
      <div
        aria-hidden
        className="absolute -right-24 top-1/3 z-[1] h-80 w-80 rounded-full bg-accent-purple/18 blur-[100px]"
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 z-[1] h-64 w-[800px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(100,206,251,0.14),transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_70%_50%_at_75%_45%,rgba(168,85,247,0.12),transparent_60%)]"
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <SiteHeader variant="hero" />

        <div className="flex flex-1 flex-col justify-center pb-16 pt-8 lg:pb-24 lg:pt-12">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            {/* Left: headline + CTAs */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 12 }}
                transition={{ duration: 0.5 }}
                className="section-eyebrow mb-6"
              >
                Transparent giving · On-chain accountability
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 24 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.25rem]"
              >
                <span className="block text-white">Give with</span>
                <span className="block text-display-gradient">confidence.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 16 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg"
              >
                TranspaChain locks every donation in on-chain escrow. Milestone proof is verified,
                releases are governed by donors, and your impact earns retro NFT badges.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 16 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-10 flex flex-wrap items-center gap-3"
              >
                <Link href="/campaigns" className="btn-primary group">
                  Browse Campaigns
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <Link href="/campaigns/create" className="btn-secondary">
                  Create Campaign
                </Link>
                <Link href="/about" className="btn-secondary border-transparent bg-transparent px-4">
                  How it works →
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isMounted ? 1 : 0 }}
                transition={{ delay: 0.45 }}
                className="mt-10 flex flex-wrap gap-6 text-sm text-white/50"
              >
                <span className="flex items-center gap-2">
                  <Lock size={14} className="text-holo-mint" /> Escrow-protected
                </span>
                <span className="flex items-center gap-2">
                  <Shield size={14} className="text-holo-lavender" /> Donor governance
                </span>
                <span className="flex items-center gap-2">
                  <Users size={14} className="text-accent-shine" /> Verified orgs
                </span>
              </motion.div>
            </div>

            {/* Right: stat pills grid */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: isMounted ? 1 : 0, x: isMounted ? 0 : 24 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="grid grid-cols-2 gap-4"
            >
              {statPills.map(({ value, label, icon: Icon, color, decimals, suffix }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.08 }}
                  className="stat-pill group transition-colors hover:border-holo-mint/30 hover:bg-white/[0.08]"
                >
                  <div className={`font-display text-2xl font-bold sm:text-3xl ${color}`}>
                    <AnimatedCounter value={value} suffix={suffix} decimals={decimals} />
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/45">
                    <Icon size={13} className="text-white/35" />
                    {label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
