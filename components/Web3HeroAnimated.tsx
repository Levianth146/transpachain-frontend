"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Target, Coins, Users } from "lucide-react";
import { api } from "@/lib/api";
import { useSocketEvents } from "@/hooks/useSocket";
import { SiteHeader } from "@/components/SiteHeader";
import { ShinyText } from "@/components/ui/ShinyText";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4";

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000, bounce: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (v) => setDisplay(Math.floor(v)));
  }, [springValue]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function Web3HeroAnimated() {
  const [isMounted, setIsMounted] = useState(false);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalDonated: "0",
    countUniqueDonors: 0,
  });

  const loadStats = () => {
    api.getStats().then(setStats).catch(() => {});
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    loadStats();
    return () => clearTimeout(timer);
  }, []);

  useSocketEvents({
    donationReceived: () => loadStats(),
    campaignCreated: () => loadStats(),
  });

  const ethDonated = parseFloat(
    (Number(BigInt(stats.totalDonated || "0")) / 1e18).toFixed(2)
  );

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
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(94,234,212,0.12),transparent_70%)]"
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

          <div className="grid grid-cols-3 gap-4 text-left lg:justify-self-end lg:max-w-md">
            <div>
              <div className="text-xl font-semibold text-white sm:text-2xl">
                <AnimatedCounter value={stats.totalCampaigns} />
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-white/50">
                <Target size={12} /> Campaigns
              </div>
            </div>
            <div>
              <div className="text-xl font-semibold text-accent-shine sm:text-2xl">
                <AnimatedCounter value={ethDonated} suffix=" ETH" />
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-white/50">
                <Coins size={12} /> Raised
              </div>
            </div>
            <div>
              <div className="text-xl font-semibold text-white sm:text-2xl">
                <AnimatedCounter value={stats.countUniqueDonors} />
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-white/50">
                <Users size={12} /> Donors
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-1 flex-col items-center justify-center pb-10 pt-6 text-center sm:pb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 16 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mb-4 text-[10px] font-display font-medium uppercase tracking-[0.2em] text-white/60 sm:text-xs"
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
              className="group inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/20 transition-all hover:bg-white hover:text-black hover:ring-white"
            >
              Browse Campaigns
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              How it works
            </Link>
            <Link
              href="/campaigns/create"
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              Create Campaign
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
