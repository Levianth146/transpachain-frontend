"use client";
import { useAccount } from "wagmi";
import { useReadContract } from "wagmi";
import { motion } from "framer-motion";
import { ADDRESSES, IMPACT_NFT_ABI } from "@/lib/contracts";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Medal } from "@phosphor-icons/react";

const TIER_STYLE: Record<number, {
  label: string;
  emoji: string;
  gradient: string;
  glow: string;
  border: string;
  text: string;
}> = {
  0: {
    label: "Bronze",
    emoji: "🥉",
    gradient: "from-amber-700/20 via-amber-600/10 to-orange-800/20",
    glow: "shadow-amber-500/20",
    border: "border-amber-400/50",
    text: "text-amber-700 dark:text-amber-400",
  },
  1: {
    label: "Silver",
    emoji: "🥈",
    gradient: "from-gray-300/30 via-slate-200/20 to-gray-400/30",
    glow: "shadow-gray-400/25",
    border: "border-gray-300/60",
    text: "text-gray-600 dark:text-gray-300",
  },
  2: {
    label: "Gold",
    emoji: "🥇",
    gradient: "from-yellow-400/30 via-amber-300/20 to-yellow-500/30",
    glow: "shadow-yellow-500/30",
    border: "border-yellow-400/60",
    text: "text-yellow-600 dark:text-yellow-400",
  },
};

function NFTCard({ tokenId, index }: { tokenId: bigint; index: number }) {
  const { data: meta } = useReadContract({
    address:      ADDRESSES.impactNFT,
    abi:          IMPACT_NFT_ABI,
    functionName: "getNFTMetadata",
    args:         [tokenId],
  });

  if (!meta) return (
    <div className="h-36 rounded-xl bg-gray-100 dark:bg-zinc-800 animate-pulse" />
  );

  const m = meta as any;
  const tierIdx = Number(m?.tier ?? m?.[2] ?? 0);
  const tier = TIER_STYLE[tierIdx] ?? TIER_STYLE[0];
  const campaignId = Number(m?.campaignId ?? m?.[0] ?? 0);
  const score = Number(m?.impactScore ?? m?.[4] ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ scale: 1.04, rotate: tierIdx === 2 ? 1 : 0 }}
      className={`relative overflow-hidden rounded-xl border-2 ${tier.border} bg-gradient-to-br ${tier.gradient} p-4 text-center shadow-lg ${tier.glow}`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="text-4xl mb-2"
      >
        {tier.emoji}
      </motion.div>
      <p className={`font-bold text-sm ${tier.text}`}>{tier.label} Donor</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Campaign #{campaignId}</p>
      <p className="text-[10px] text-gray-400 mt-1 font-mono">Token #{tokenId.toString()}</p>
      {score > 0 && (
        <div className="mt-2 inline-flex items-center gap-1 text-xs bg-white/40 dark:bg-black/20 rounded-full px-2 py-0.5">
          <Medal size={12} weight="duotone" className={tier.text} />
          Impact: {score}
        </div>
      )}
    </motion.div>
  );
}

export function NFTGallery({ address }: { address: string }) {
  const { address: connectedAddress } = useAccount();
  const walletAddress = (address ?? connectedAddress) as `0x${string}` | undefined;

  const { data: tokenIdsRaw } = useReadContract({
    address:      ADDRESSES.impactNFT,
    abi:          IMPACT_NFT_ABI,
    functionName: "getDonorNFTs",
    args:         walletAddress ? [walletAddress] : undefined,
    query:        { enabled: !!walletAddress },
  });
  const tokenIds = tokenIdsRaw as bigint[] | undefined;

  const emptyState = (msg: string) => (
    <GlassPanel className="p-5 h-full">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Medal size={18} className="text-gold-500" weight="duotone" />
        My Impact NFTs
      </h3>
      <p className="text-sm text-gray-400">{msg}</p>
    </GlassPanel>
  );

  if (!walletAddress) return emptyState("Connect wallet to view your NFTs.");

  if (!tokenIds || tokenIds.length === 0) {
    return emptyState("No NFTs yet. Donate to a campaign to earn Bronze, Silver, or Gold tiers!");
  }

  return (
    <GlassPanel className="p-5 h-full">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Medal size={18} className="text-gold-500" weight="duotone" />
        My Impact NFTs
        <span className="ml-auto text-xs font-normal bg-gold-500/10 text-gold-600 px-2 py-0.5 rounded-full">
          {tokenIds.length}
        </span>
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {tokenIds.map((tokenId, i) => (
          <NFTCard key={tokenId.toString()} tokenId={tokenId} index={i} />
        ))}
      </div>
    </GlassPanel>
  );
}
