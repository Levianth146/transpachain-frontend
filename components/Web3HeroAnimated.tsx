"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Target, Coins, Users } from "@phosphor-icons/react";
import { api } from "@/lib/api";
import { useSocketEvents } from "@/hooks/useSocket";

const pillars = [92, 84, 78, 70, 62, 54, 46, 34, 18, 34, 46, 54, 62, 70, 78, 84, 92];

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
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes subtlePulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.03); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
      `}</style>

      <section className="relative isolate min-h-[85vh] overflow-hidden bg-black text-white">
        <div
          aria-hidden
          className="absolute inset-0 -z-30"
          style={{
            backgroundImage: [
              "radial-gradient(80% 55% at 50% 52%, rgba(252,166,154,0.45) 0%, rgba(214,76,82,0.46) 27%, rgba(61,36,47,0.38) 47%, rgba(39,38,67,0.45) 60%, rgba(8,8,12,0.92) 78%, rgba(0,0,0,1) 88%)",
              "radial-gradient(85% 60% at 14% 0%, rgba(255,193,171,0.65) 0%, rgba(233,109,99,0.58) 30%, rgba(48,24,28,0.0) 64%)",
              "radial-gradient(70% 50% at 86% 22%, rgba(88,112,255,0.40) 0%, rgba(16,18,28,0.0) 55%)",
              "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0) 40%)",
            ].join(","),
            backgroundColor: "#000",
          }}
        />
        <div aria-hidden className="absolute inset-0 -z-20 bg-[radial-gradient(140%_120%_at_50%_0%,transparent_60%,rgba(0,0,0,0.85))]" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 mix-blend-screen opacity-30"
          style={{
            backgroundImage: [
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.09) 0 1px, transparent 1px 96px)",
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 24px)",
            ].join(","),
          }}
        />

        <div className="relative z-10 mx-auto grid w-full max-w-5xl place-items-center px-6 py-20 md:py-28">
          <div className={`mx-auto text-center ${isMounted ? "animate-fadeInUp" : "opacity-0"}`}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wider text-white/70 ring-1 ring-white/10 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Ethereum Sepolia
            </span>
            <h1
              style={{ animationDelay: "200ms" }}
              className={`font-display mt-6 text-4xl font-bold tracking-tight md:text-6xl ${isMounted ? "animate-fadeInUp" : "opacity-0"}`}
            >
              Transparent charity on web3
            </h1>
            <p
              style={{ animationDelay: "300ms" }}
              className={`mx-auto mt-5 max-w-2xl text-balance text-white/80 md:text-lg ${isMounted ? "animate-fadeInUp" : "opacity-0"}`}
            >
              Donate into escrow, verify milestone proof, vote on-chain — funds release only when donors approve.
            </p>
            <div
              style={{ animationDelay: "400ms" }}
              className={`mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row ${isMounted ? "animate-fadeInUp" : "opacity-0"}`}
            >
              <Link href="#campaigns" className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow hover:bg-white/90">
                Browse Campaigns
              </Link>
              <Link href="/about" className="inline-flex rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur hover:border-white/40">
                How it works
              </Link>
              <Link href="/campaigns/create" className="inline-flex rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white/70 backdrop-blur hover:border-white/30 hover:text-white">
                Create Campaign
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto text-left"
            >
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">
                  <AnimatedCounter value={stats.totalCampaigns} />
                </div>
                <div className="text-white/60 text-xs md:text-sm mt-1 flex items-center justify-center gap-1">
                  <Target size={14} weight="duotone" /> Campaigns
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-emerald-400">
                  <AnimatedCounter value={ethDonated} suffix=" ETH" />
                </div>
                <div className="text-white/60 text-xs md:text-sm mt-1 flex items-center justify-center gap-1">
                  <Coins size={14} weight="duotone" /> Donated
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">
                  <AnimatedCounter value={stats.countUniqueDonors} />
                </div>
                <div className="text-white/60 text-xs md:text-sm mt-1 flex items-center justify-center gap-1">
                  <Users size={14} weight="duotone" /> Donors
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute bottom-[128px] left-1/2 z-0 h-36 w-28 -translate-x-1/2 rounded-md bg-gradient-to-b from-white/75 via-rose-100/60 to-transparent"
          style={{ animation: "subtlePulse 6s ease-in-out infinite" }}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[54vh]">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex h-full items-end gap-px px-[2px]">
            {pillars.map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-black transition-[height] duration-1000 ease-in-out"
                style={{
                  height: isMounted ? `${h}%` : "0%",
                  transitionDelay: `${Math.abs(i - Math.floor(pillars.length / 2)) * 60}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
