"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { Target, Gem, Users } from "lucide-react";
import { api } from "@/lib/api";

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
    springValue.on("change", (v) => setDisplay(Math.floor(v)));
  }, [springValue]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}{suffix}
    </span>
  );
}

export function HeroSection() {
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalDonated: "0",
    countUniqueDonors: 0,
  });

  useEffect(() => {
    api.getStats().then(setStats).catch(() => {});
  }, []);

  const ethDonated = parseFloat(
    (Number(BigInt(stats.totalDonated || "0")) / 1e18).toFixed(2)
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 min-h-[560px] flex items-center">
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10" suppressHydrationWarning
        style={{
          backgroundImage: `linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glowing orbs */}
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-emerald-500 rounded-full opacity-5 blur-3xl" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-400 rounded-full opacity-5 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 py-16 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6"
          >
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Live on Ethereum Sepolia
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
          >
            Charity you can{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              verify
            </span>
            , on-chain.
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-300 text-lg mb-10 leading-relaxed max-w-xl"
          >
            Milestone-based fund release governed by donors. Every transaction
            is transparent, every decision is on-chain.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-3 mb-14"
          >
            <Link
              href="#campaigns"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5"
            >
              Browse Campaigns
            </Link>
            <Link
              href="/campaigns/create"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              Create Campaign
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-6 max-w-lg"
          >
            <div>
              <div className="text-3xl font-bold text-white">
                <AnimatedCounter value={stats.totalCampaigns} />
              </div>
              <div className="text-slate-400 text-sm mt-1">Campaigns</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400">
                <AnimatedCounter value={ethDonated} suffix=" ETH" />
              </div>
              <div className="text-slate-400 text-sm mt-1">Total Donated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">
                <AnimatedCounter value={stats.countUniqueDonors} />
              </div>
              <div className="text-slate-400 text-sm mt-1">Donors</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}