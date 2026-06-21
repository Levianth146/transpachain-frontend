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
import { BrowserWindowCard } from "@/components/ui/BrowserWindowCard";
import { GradientText } from "@/components/ui/GradientText";
import { StatGradientCard } from "@/components/ui/StatGradientCard";

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
      decimals: 0,
      suffix: "",
    },
    {
      value: onChain.ready ? ethDonated : 0,
      label: "Raised (net)",
      icon: Coins,
      decimals: 2,
      suffix: " ETH",
    },
    {
      value: onChain.ready ? usdcDonated : 0,
      label: "USDC (net)",
      icon: Coins,
      decimals: 0,
      suffix: " USDC",
    },
    {
      value: donors,
      label: formatDonorLabel(donors),
      icon: Users,
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

        <div className="flex flex-1 flex-col items-center justify-center pb-20 pt-28 sm:pt-32 lg:pb-28 lg:pt-36">
          <BrowserWindowCard
            title="TranspaChain — Transparent Giving"
            className="w-full max-w-5xl"
            bodyClassName="px-6 py-10 sm:px-10 sm:py-14 text-center"
            animate={false}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: isMounted ? 1 : 0, scale: isMounted ? 1 : 0.95 }}
              transition={{ duration: 0.6 }}
            >
              <div className="section-eyebrow mb-8">
                Transparent giving · On-chain accountability
              </div>

              <h1 className="max-w-4xl mx-auto font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block text-white">Give with</span>
                <GradientText className="block">confidence.</GradientText>
              </h1>

              <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
                TranspaChain locks every donation in on-chain escrow. Milestone proof is verified,
                releases are governed by donors, and your impact earns retro NFT badges.
              </p>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                <Link href="/campaigns" className="btn-primary group hover:scale-110">
                  Explore Campaigns
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <ConnectWallet variant="hero" />
                <Link href="/about" className="btn-secondary hover:scale-110">
                  How it works
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-white/45">
                <span className="flex items-center gap-2">
                  <Lock size={14} className="text-holo-mint" /> Escrow-protected
                </span>
                <span className="flex items-center gap-2">
                  <Shield size={14} className="text-brand-purple-light" /> Donor governance
                </span>
                <span className="flex items-center gap-2">
                  <Users size={14} className="text-accent-shine" /> Verified orgs
                </span>
              </div>
            </motion.div>
          </BrowserWindowCard>

          <div className="mt-12 grid w-full max-w-4xl grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {statPills.map(({ value, label, icon: Icon, decimals, suffix }, i) => (
              <StatGradientCard
                key={label}
                label={label}
                icon={Icon}
                delay={0.15 + i * 0.08}
                value={
                  <AnimatedCounter value={value} suffix={suffix} decimals={decimals} />
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
