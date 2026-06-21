"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { Coins, Heart, CheckCircle, TrendUp } from "@phosphor-icons/react";
import { api } from "@/lib/api";
import { formatCampaignAmountLabel, sumDonationsByToken } from "@/lib/format";
import { NFTGallery } from "@/components/NFTGallery";
import { ConnectWallet } from "@/components/ConnectWallet";
import { OrgProfileForm } from "@/components/OrgProfileForm";
import { PageShell } from "@/components/PageShell";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { LearnMoreLink } from "@/components/LearnMoreLink";
import { DonorNotifications } from "@/components/DonorNotifications";
import { AnimatedGradientBackground } from "@/components/ui/AnimatedGradientBackground";
import { TxLink } from "@/components/TxLink";

const STAT_ICONS = [Coins, Heart, CheckCircle];

const STAT_GRADIENTS = [
  "from-holo-mint/20 to-holo-lavender/10",
  "from-holo-lavender/20 to-holo-pink/10",
  "from-holo-pink/20 to-holo-silver/10",
];

const STAT_COLORS = ["text-holo-mint", "text-holo-lavender", "text-holo-pink"];

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
    <AnimatedGradientBackground variant="dark" className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-lg font-medium text-white">Connect your wallet to view dashboard</p>
      <ConnectWallet />
    </AnimatedGradientBackground>
  );

  const totals = sumDonationsByToken(donations);
  const ethDonated = formatCampaignAmountLabel(totals.ethNet, 0, 4);
  const usdcDonated = formatCampaignAmountLabel(totals.usdcNet, 1, 2);

  const stats = summary ? [
    {
      label: "ETH Donated (net)",
      value: ethDonated,
      sub: totals.ethGross > totals.ethNet ? "Gross incl. 1% fee tracked separately" : undefined,
    },
    {
      label: "USDC Donated (net)",
      value: usdcDonated,
      sub: totals.usdcNet > 0n ? "Sepolia test USDC" : "No USDC donations yet",
    },
    {
      label: "Campaigns Supported",
      value: String(summary.campaignCount ?? 0),
    },
    {
      label: "Milestones Released",
      value: String(summary.byStatus?.released ?? 0),
    },
  ] : [];

  return (
    <PageShell
      eyebrow="Your impact"
      title={
        <span className="inline-flex items-center gap-2">
          <TrendUp size={28} className="text-holo-mint" weight="duotone" />
          Dashboard
        </span>
      }
      description={
        <span className="truncate font-mono text-sm text-white/50">{address}</span>
      }
      maxWidth="5xl"
    >
      <LearnMoreLink className="mb-6" />
      <DonorNotifications />

      {stats.length > 0 && (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = STAT_ICONS[i % STAT_ICONS.length];
            return (
              <GlassPanel key={stat.label} delay={i * 0.08} holoBorder className={`bg-gradient-to-br ${STAT_GRADIENTS[i % STAT_GRADIENTS.length]} p-5 text-center`}>
                <Icon size={24} className={`mx-auto mb-2 ${STAT_COLORS[i % STAT_COLORS.length]}`} weight="duotone" />
                <p className={`text-2xl font-bold ${STAT_COLORS[i % STAT_COLORS.length]}`}>{stat.value}</p>
                <p className="mt-1 text-sm text-white/60">{stat.label}</p>
                {"sub" in stat && stat.sub && (
                  <p className="mt-1 text-[10px] text-white/40">{stat.sub}</p>
                )}
              </GlassPanel>
            );
          })}
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <NFTGallery address={address as string} />

        <GlassPanel holoBorder className="p-5">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
            <Coins size={18} className="text-holo-mint" weight="duotone" />
            Donation History
            <span className="ml-auto text-[10px] font-normal text-white/40 uppercase">Indexed</span>
          </h3>
          {donations.length === 0 ? (
            <p className="text-sm text-white/50">No donations yet. Browse campaigns to make your first impact!</p>
          ) : (
            <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {donations.map((d: any, i: number) => {
                const token = d.tokenType ?? 0;
                const net = d.netAmount ?? d.amount;
                return (
                <motion.div
                  key={d.txHash}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium text-white">Campaign #{d.campaignId}</p>
                    <TxLink hash={d.txHash} className="mt-0.5" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-holo-mint">
                      {formatCampaignAmountLabel(net, token, token === 1 ? 2 : 4)}
                    </p>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${
                      d.status === "released" ? "bg-holo-lavender/20 text-holo-lavender" :
                      d.status === "refunded" ? "bg-gray-500/20 text-gray-300" :
                      "bg-holo-pink/20 text-holo-pink"
                    }`}>
                      {d.status}
                    </span>
                  </div>
                </motion.div>
              );})}
            </div>
          )}
        </GlassPanel>
      </div>

      <GlassPanel holoBorder className="p-5">
        <OrgProfileForm />
      </GlassPanel>
    </PageShell>
  );
}
