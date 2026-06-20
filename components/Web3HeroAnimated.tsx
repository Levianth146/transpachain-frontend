"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Target, Coins, Users } from "lucide-react";
import { api } from "@/lib/api";
import { useSocketEvents } from "@/hooks/useSocket";
import { useOnChainPlatformStats } from "@/hooks/useOnChainPlatformStats";
import { SiteHeader } from "@/components/SiteHeader";
import { ShinyText } from "@/components/ui/ShinyText";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4";

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

export function Web3HeroAnimated() {
  const [isMounted, setIsMounted] = useState(false);
  const [donorCount, setDonorCount] = useState(0);

  const loadDonorCount = () => {
    api
      .getStats()
      .then((s) => setDonorCount(s.countUniqueDonors ?? 0))
      .catch(() => {});
  };

  const onChain = useOnChainPlatformStats();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
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

  const statCards = [
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
      value: donorCount,
      label: "Donors",
      icon: Users,
      color: "text-holo-mint",
      decimals: 0,
      suffix: "",
    },
  ];

  return (
    <section className="relative isolate h-screen min-h-[640px] overflow-hidden bg-black text-white">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/85"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(94,234,212,0.15),transparent_70%)]"
      />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <SiteHeader variant="hero" />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 12 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-1 gap-6 pt-6 sm:pt-8 lg:grid-cols-2 lg:gap-10"
        >
          <div className="max-w-md text-left text-sm leading-relaxed text-white/70 sm:text-base">
            <p>
              TranspaChain is transparent giving on Ethereum Sepolia — donations lock in on-chain escrow,
              milestone proof is verified, and donors govern releases through quadratic voting.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left sm:grid-cols-4 lg:justify-self-end lg:max-w-2xl">
            {statCards.map(({ value, label, icon: Icon, color, decimals, suffix }) => (
              <div
                key={label}
                className="card-holo rounded-xl px-3 py-3 sm:px-4 sm:py-4"
              >
                <div className={`text-lg font-display font-semibold sm:text-xl ${color}`}>
                  <AnimatedCounter value={value} suffix={suffix} decimals={decimals} />
                </div>
                <div className="mt-1 flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/50 sm:text-xs">
                  <Icon size={12} /> {label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex flex-1 flex-col items-center justify-center pb-10 pt-6 text-center sm:pb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 16 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mb-4 text-[10px] font-display font-medium uppercase tracking-[0.2em] text-holo-mint/80 sm:text-xs"
          >
            Transparent giving. On-chain accountability.
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-4xl font-display font-bold uppercase tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            <span className="block text-white">Give with</span>
            <span className="block">
              <ShinyText>TranspaChain.</ShinyText>
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
          >
            <Link
              href="/campaigns"
              className="group inline-flex items-center gap-2 rounded-full bg-holo-gradient px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-holo-mint/20 transition-all hover:scale-[1.02] hover:shadow-holo-mint/30"
            >
              Browse Campaigns
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/80 backdrop-blur-sm transition-colors hover:border-holo-mint/40 hover:text-white"
            >
              How it works
            </Link>
            <Link
              href="/campaigns/create"
              className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/80 backdrop-blur-sm transition-colors hover:border-holo-lavender/40 hover:text-white"
            >
              Create Campaign
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
