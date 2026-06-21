"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { useSocketEvents } from "@/hooks/useSocket";
import { useOnChainPlatformStats } from "@/hooks/useOnChainPlatformStats";
import { HeroVideoBackground } from "@/components/HeroVideoBackground";
import { AppPreviewWindow } from "@/components/AppPreviewWindow";

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

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [donorCount, setDonorCount] = useState(0);

  const onChain = useOnChainPlatformStats();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const loadDonors = () => {
    api
      .getStats()
      .then((s) => setDonorCount(s.countUniqueDonors ?? 0))
      .catch(() => {});
  };

  useEffect(() => {
    loadDonors();
  }, []);

  useSocketEvents({
    donationReceived: () => loadDonors(),
    campaignCreated: () => loadDonors(),
  });

  const ethLocked = Number(onChain.totalEthWei) / 1e18;
  const totalCampaigns =
    onChain.ready && onChain.totalCampaigns != null ? onChain.totalCampaigns : 0;

  return (
    <section className="relative z-10 flex min-h-screen items-center px-4 pb-16 pt-[72px] sm:px-6 lg:px-10">
      <HeroVideoBackground />

      <div className="relative mx-auto grid w-full max-w-[1380px] grid-cols-1 items-center gap-12 lg:grid-cols-[55fr_45fr] lg:gap-[72px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 24 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] py-1.5 pl-2.5 pr-3.5">
            <span className="live-blink h-[7px] w-[7px] shrink-0 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
              Live on Ethereum Sepolia
            </span>
          </div>

          <h1 className="font-display text-[clamp(3.25rem,6.2vw,5.5rem)] font-bold leading-[1.03] tracking-[-0.04em] text-text-primary">
            Give with
            <br />
            <span className="text-gradient-hero">proof.</span>
          </h1>

          <p className="mt-6 max-w-[490px] text-lg leading-[1.76] text-text-primary/48">
            The first charity platform where every donation locks in on-chain escrow,
            every milestone is community-verified, and every fund release is voted on
            by donors.
          </p>

          <div className="mt-9 flex flex-wrap gap-3.5">
            <Link href="/campaigns" className="btn-primary-dark group">
              Browse Campaigns
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link href="/about#how-it-works" className="btn-secondary-dark">
              How it works
            </Link>
          </div>

          <div className="mt-14 flex border-t border-white/[0.08] pt-8">
            <div className="flex-1 pr-7">
              <b className="block font-display text-[30px] font-bold leading-none tracking-[-0.03em] text-text-primary">
                <AnimatedCounter value={totalCampaigns} suffix="+" />
              </b>
              <span className="mt-1.5 block text-[13px] text-text-primary/35">
                Active Campaigns
              </span>
            </div>
            <div className="w-px shrink-0 bg-white/[0.08]" />
            <div className="flex-1 px-7">
              <b className="block font-display text-[30px] font-bold leading-none tracking-[-0.03em] text-text-primary">
                <AnimatedCounter value={ethLocked} suffix=" ETH" decimals={1} />
              </b>
              <span className="mt-1.5 block text-[13px] text-text-primary/35">
                Locked in Escrow
              </span>
            </div>
            <div className="w-px shrink-0 bg-white/[0.08]" />
            <div className="flex-1 pl-7">
              <b className="block font-display text-[30px] font-bold leading-none tracking-[-0.03em] text-text-primary">
                <AnimatedCounter value={donorCount} />
              </b>
              <span className="mt-1.5 block text-[13px] text-text-primary/35">
                Verified Donors
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.95 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[-60px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.14),transparent_68%)]"
          />
          <AppPreviewWindow />
        </motion.div>
      </div>
    </section>
  );
}
