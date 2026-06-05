"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { motion } from "framer-motion";
import { Coins, Heart, CheckCircle, TrendUp } from "@phosphor-icons/react";
import { api } from "@/lib/api";
import { NFTGallery } from "@/components/NFTGallery";
import { ConnectWallet } from "@/components/ConnectWallet";
import { OrgProfileForm } from "@/components/OrgProfileForm";
import { AnimatedGradientBackground } from "@/components/ui/AnimatedGradientBackground";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { HowItWorksBlock } from "@/components/HowItWorksBlock";

const STAT_ICONS = [Coins, Heart, CheckCircle];

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted]     = useState(false);
  const [summary, setSummary]   = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!address) return;
    api.getDonorSummary(address).then((data) => {
      setSummary(data);
      setDonations(data.donations ?? []);
    });
  }, [address]);

  if (!mounted) return null;

  if (!isConnected) return (
    <AnimatedGradientBackground className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-lg font-medium">Connect your wallet to view dashboard</p>
      <ConnectWallet />
    </AnimatedGradientBackground>
  );

  const stats = summary ? [
    {
      label: "ETH Donated",
      value: Number(formatEther(BigInt(summary.totalDonated ?? "0"))).toFixed(3),
      color: "text-emerald-600",
      gradient: "from-emerald-500/20 to-teal-500/10",
    },
    {
      label: "Campaigns Supported",
      value: String(summary.campaignCount ?? 0),
      color: "text-blue-600",
      gradient: "from-blue-500/20 to-indigo-500/10",
    },
    {
      label: "Milestones Released",
      value: String(summary.byStatus?.released ?? 0),
      color: "text-purple-600",
      gradient: "from-purple-500/20 to-violet-500/10",
    },
  ] : [];

  return (
    <AnimatedGradientBackground className="min-h-screen">
      <main className="max-w-5xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendUp size={28} className="text-emerald-500" weight="duotone" />
            <h1 className="text-3xl font-display text-gray-900 dark:text-cream-100">My Impact Dashboard</h1>
          </div>
          <p className="text-sm text-gray-400 font-mono truncate">{address}</p>
        </motion.div>

        {stats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, i) => {
              const Icon = STAT_ICONS[i];
              return (
                <GlassPanel key={stat.label} delay={i * 0.08} className={`p-5 text-center bg-gradient-to-br ${stat.gradient}`}>
                  <Icon size={24} className={`mx-auto mb-2 ${stat.color}`} weight="duotone" />
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                </GlassPanel>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <NFTGallery address={address as string} />

          <GlassPanel className="p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Coins size={18} className="text-emerald-500" weight="duotone" />
              Donation History
            </h3>
            {donations.length === 0 ? (
              <p className="text-sm text-gray-400">No donations yet. Browse campaigns to make your first impact!</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {donations.map((d: any, i: number) => (
                  <motion.div
                    key={d.txHash}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex justify-between items-center py-2.5 px-3 rounded-lg bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-zinc-800"
                  >
                    <div>
                      <p className="text-sm font-medium">Campaign #{d.campaignId}</p>
                      <p className="text-xs text-gray-400 font-mono">{d.txHash.slice(0, 10)}…</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-600">
                        {Number(formatEther(BigInt(d.amount))).toFixed(3)} ETH
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        d.status === "released" ? "bg-blue-100 text-blue-700" :
                        d.status === "refunded" ? "bg-gray-100 text-gray-600" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {d.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </GlassPanel>
        </div>

        <GlassPanel className="p-5 mb-8">
          <h3 className="font-semibold mb-4 text-sm text-gray-700 dark:text-gray-300">How TranspaChain protects your donations</h3>
          <HowItWorksBlock columns={5} />
        </GlassPanel>

        <GlassPanel className="p-5">
          <OrgProfileForm />
        </GlassPanel>
      </main>
    </AnimatedGradientBackground>
  );
}
