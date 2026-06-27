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

function truncateAddress(addr: string): string {
  return addr.length > 10 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
}

type TickerItem = {
  id: string;
  message: string;
};

function ActivityTicker({ items }: { items: TickerItem[] }) {
  if (items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <div className="relative mt-8 overflow-hidden rounded-full border border-slate-200/80 bg-white/80 py-2 dark:border-white/10 dark:bg-white/[0.06]">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white/90 to-transparent dark:from-black/40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white/90 to-transparent dark:from-black/40" />
      <motion.div
        className="flex w-max gap-8 px-4 text-xs text-slate-600 dark:text-white/60"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: Math.max(items.length * 6, 18), repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span key={`${item.id}-${i}`} className="whitespace-nowrap">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-teal-500 dark:bg-holo-mint" />
            {item.message}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function Web3HeroAnimated() {
  const [isMounted, setIsMounted] = useState(false);
  const [donorCount, setDonorCount] = useState<number | null>(null);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);

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
    donationReceived: (data) => {
      loadDonorCount();
      if (data?.campaignId != null && data?.donor) {
        const token = data.tokenType === 1 ? "USDC" : "ETH";
        const amount =
          data.tokenType === 1
            ? (Number(data.netAmount ?? data.amount ?? 0) / 1e6).toFixed(0)
            : (Number(data.netAmount ?? data.amount ?? 0) / 1e18).toFixed(3);
        const item: TickerItem = {
          id: `${data.campaignId}-${data.donor}-${Date.now()}`,
          message: `${truncateAddress(String(data.donor))} donated ${amount} ${token} to Campaign #${data.campaignId}`,
        };
        setTickerItems((prev) => [item, ...prev].slice(0, 8));
      }
    },
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
      color: "text-slate-900 dark:text-white",
      decimals: 0,
      suffix: "",
    },
    {
      value: onChain.ready ? ethDonated : 0,
      label: "Raised (net)",
      icon: Coins,
      color: "text-teal-700 dark:text-accent-shine",
      decimals: 2,
      suffix: " ETH",
    },
    {
      value: onChain.ready ? usdcDonated : 0,
      label: "USDC (net)",
      icon: Coins,
      color: "text-violet-700 dark:text-holo-lavender",
      decimals: 0,
      suffix: " USDC",
    },
    {
      value: donors,
      label: formatDonorLabel(donors),
      icon: Users,
      color: "text-emerald-700 dark:text-holo-mint",
      decimals: 0,
      suffix: "",
    },
  ];

  return (
    <section className="relative isolate min-h-screen overflow-hidden text-slate-900 dark:text-white">
      <PageBackground image="/backgrounds/landing.png" overlay="hero" />
      {/* Unified mesh + vault accent overlays (CSS only, no second image layer) */}
      <div aria-hidden className="absolute inset-0 z-[1] mesh-bg opacity-35" />
      <div
        aria-hidden
        className="absolute inset-0 z-[1] bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_30%,black,transparent)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]"
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
                <span className="block text-slate-900 dark:text-white">Give with</span>
                <span className="block text-display-gradient">confidence.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 16 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 dark:text-white/65 sm:text-lg"
              >
                When donations vanish into opaque wallets, trust breaks. TranspaChain locks every gift
                in on-chain escrow — milestone proof is verified, releases are governed by donors, and
                your impact earns retro NFT badges.
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
                className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500 dark:text-white/50"
              >
                <span className="flex items-center gap-2">
                  <Lock size={14} className="text-teal-600 dark:text-holo-mint" /> Escrow-protected
                </span>
                <span className="flex items-center gap-2">
                  <Shield size={14} className="text-violet-600 dark:text-holo-lavender" /> Donor governance
                </span>
                <span className="flex items-center gap-2">
                  <Users size={14} className="text-teal-700 dark:text-accent-shine" /> Verified orgs
                </span>
              </motion.div>

              <ActivityTicker items={tickerItems} />
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
                  className="stat-pill group transition-colors hover:border-teal-300/50 hover:bg-slate-100/80 dark:hover:border-holo-mint/30 dark:hover:bg-white/[0.08]"
                >
                  <div className={`font-display text-2xl font-bold sm:text-3xl ${color}`}>
                    <AnimatedCounter value={value} suffix={suffix} decimals={decimals} />
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-500 dark:text-white/45">
                    <Icon size={13} className="text-slate-400 dark:text-white/35" />
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
