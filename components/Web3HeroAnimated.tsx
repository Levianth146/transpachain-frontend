"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Shield, Lock, Users, Target, Coins } from "lucide-react";
import { api } from "@/lib/api";
import { useSocketEvents } from "@/hooks/useSocket";
import { useOnChainPlatformStats } from "@/hooks/useOnChainPlatformStats";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroIsometricScene } from "@/components/HeroIsometricScene";
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
    <>
      <section className="relative isolate min-h-screen overflow-hidden text-brand-navy">
        <div aria-hidden className="absolute inset-0 mesh-bg-hero" />
        <div aria-hidden className="absolute inset-0 hero-grid-pattern opacity-60" />
        <motion.div
          aria-hidden
          className="absolute -left-32 top-1/4 h-[400px] w-[400px] rounded-full bg-teal-200/30 blur-[120px]"
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -right-24 top-1/3 h-[350px] w-[350px] rounded-full bg-violet-200/25 blur-[100px]"
          animate={{ opacity: [0.2, 0.4, 0.2], x: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute bottom-1/4 left-1/3 h-[250px] w-[250px] rounded-full bg-pink-200/20 blur-[80px]"
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
          <SiteHeader variant="hero" />

          <div className="flex flex-1 flex-col items-center gap-12 pb-16 pt-24 lg:flex-row lg:items-center lg:gap-8 lg:pb-20 lg:pt-28">
            {/* Left column — content */}
            <motion.div
              className="flex-1 text-left"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 24 }}
              transition={{ duration: 0.6 }}
            >
              <div className="section-eyebrow mb-6">
                Transparent giving · On-chain accountability
              </div>

              <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-brand-navy sm:text-5xl md:text-6xl lg:text-[3.5rem]">
                Give with{" "}
                <span className="gradient-text">confidence.</span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-500 sm:text-lg">
                TranspaChain locks every donation in on-chain escrow. Milestone proof is verified,
                releases are governed by donors, and your impact earns retro NFT badges.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
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
                <Link href="/about" className="btn-ghost group">
                  How it works
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <Lock size={15} className="text-brand-teal" /> Escrow-protected
                </span>
                <span className="flex items-center gap-2">
                  <Shield size={15} className="text-accent-purple" /> Donor governance
                </span>
                <span className="flex items-center gap-2">
                  <Users size={15} className="text-accent-shine" /> Verified orgs
                </span>
              </div>
            </motion.div>

            {/* Right column — isometric illustration */}
            <motion.div
              className="relative flex-1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: isMounted ? 1 : 0, scale: isMounted ? 1 : 0.95 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <HeroIsometricScene />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats section below hero */}
      <section className="relative border-t border-slate-200/60 bg-white/50 py-12 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {statPills.map(({ value, label, icon: Icon, decimals, suffix }, i) => (
              <StatGradientCard
                key={label}
                label={label}
                icon={Icon}
                delay={0.15 + i * 0.08}
                iconClassName="text-brand-teal"
                valueClassName="text-brand-navy"
                value={
                  <AnimatedCounter value={value} suffix={suffix} decimals={decimals} />
                }
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
