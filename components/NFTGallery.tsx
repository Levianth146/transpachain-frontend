"use client";
import { useAccount } from "wagmi";
import { useReadContract } from "wagmi";
import { motion } from "framer-motion";
import { ADDRESSES, IMPACT_NFT_ABI } from "@/lib/contracts";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Medal, Info, Copy, GameController } from "@phosphor-icons/react";
import { useState } from "react";
import Image from "next/image";
import { tierImagePath, tierLabel } from "@/lib/nft";
import { ContractLink, tokenExplorerUrl } from "@/components/TxLink";

const TIER_STYLE: Record<number, {
  label: string;
  gradient: string;
  glow: string;
  border: string;
  scanline: string;
}> = {
  0: {
    label: "Bronze",
    gradient: "from-amber-900/40 via-orange-950/30 to-black",
    glow: "shadow-[0_0_24px_rgba(255,153,0,0.25)]",
    border: "border-amber-500/60",
    scanline: "rgba(255,180,0,0.08)",
  },
  1: {
    label: "Silver",
    gradient: "from-slate-400/25 via-zinc-800/40 to-black",
    glow: "shadow-[0_0_24px_rgba(192,192,192,0.2)]",
    border: "border-cyan-300/50",
    scanline: "rgba(0,255,255,0.06)",
  },
  2: {
    label: "Gold",
    gradient: "from-yellow-500/30 via-amber-600/20 to-black",
    glow: "shadow-[0_0_28px_rgba(255,215,0,0.35)]",
    border: "border-yellow-400/70",
    scanline: "rgba(255,255,0,0.08)",
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
    <div className="h-44 rounded-xl bg-black/40 border border-white/10 animate-pulse" />
  );

  const m = meta as Record<string, unknown>;
  const tierIdx = Number(m?.tier ?? 0);
  const tier = TIER_STYLE[tierIdx] ?? TIER_STYLE[0];
  const campaignId = Number(m?.campaignId ?? 0);
  const score = Number(m?.impactScore ?? 0);

  return (
    <motion.a
      href={tokenExplorerUrl(ADDRESSES.impactNFT, tokenId.toString())}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ scale: 1.03, y: -4 }}
      className={`relative overflow-hidden rounded-xl border-2 ${tier.border} bg-gradient-to-br ${tier.gradient} p-4 text-center ${tier.glow} block`}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${tier.scanline} 2px, ${tier.scanline} 4px)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `repeating-conic-gradient(rgba(255,255,255,0.04) 0% 25%, transparent 0% 50%)`,
          backgroundSize: "6px 6px",
        }}
      />
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative mb-2 flex justify-center"
      >
        <Image
          src={tierImagePath(tierIdx)}
          alt={tier.label}
          width={80}
          height={80}
          className="rounded-lg border border-white/20 image-rendering-pixelated"
          style={{ imageRendering: "pixelated" }}
        />
      </motion.div>
      <p className="relative font-display text-sm font-bold uppercase tracking-wider text-white">
        {tierLabel(tierIdx)}
      </p>
      <p className="relative text-[10px] text-white/50 mt-1 font-mono">Campaign #{campaignId}</p>
      <p className="relative text-[10px] text-holo-mint mt-1 font-mono">#{tokenId.toString()}</p>
      {score > 0 && (
        <div className="relative mt-2 inline-flex items-center gap-1 text-[10px] bg-black/40 rounded-full px-2 py-0.5 border border-white/10">
          <Medal size={10} weight="duotone" className="text-holo-mint" />
          Impact {score}
        </div>
      )}
    </motion.a>
  );
}

export function NFTGallery({ address }: { address: string }) {
  const { address: connectedAddress } = useAccount();
  const walletAddress = (address ?? connectedAddress) as `0x${string}` | undefined;
  const [copied, setCopied] = useState(false);

  const { data: tokenIdsRaw } = useReadContract({
    address:      ADDRESSES.impactNFT,
    abi:          IMPACT_NFT_ABI,
    functionName: "getDonorNFTs",
    args:         walletAddress ? [walletAddress] : undefined,
    query:        { enabled: !!walletAddress },
  });
  const tokenIds = tokenIdsRaw as bigint[] | undefined;

  const copyContract = () => {
    navigator.clipboard.writeText(ADDRESSES.impactNFT);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const emptyState = (msg: string) => (
    <GlassPanel holoBorder className="p-5 h-full">
      <h3 className="font-display font-semibold mb-3 flex items-center gap-2 text-white">
        <GameController size={18} className="text-holo-pink" weight="duotone" />
        My Impact NFTs
      </h3>
      <p className="text-sm text-white/50">{msg}</p>
    </GlassPanel>
  );

  if (!walletAddress) return emptyState("Connect wallet to view your retro donor badges.");

  if (!tokenIds || tokenIds.length === 0) {
    return emptyState("No badges yet. Donate to earn Bronze, Silver, or Gold pixel tiers!");
  }

  return (
    <GlassPanel holoBorder className="p-5 h-full">
      <h3 className="font-display font-semibold mb-2 flex items-center gap-2 text-white">
        <GameController size={18} className="text-holo-pink" weight="duotone" />
        My Impact NFTs
        <span className="ml-auto text-xs font-normal bg-holo-pink/10 text-holo-pink px-2 py-0.5 rounded-full border border-holo-pink/30">
          {tokenIds.length} retro
        </span>
      </h3>

      <div className="flex items-start gap-2 text-[11px] text-white/50 bg-black/30 rounded-lg px-2.5 py-2 mb-4 border border-white/10">
        <Info size={14} className="shrink-0 mt-0.5 text-holo-mint" />
        <div>
          <p>
            One badge per campaign. MetaMask needs valid IPFS metadata — run{" "}
            <code className="text-holo-lavender">setTierMetadataCID</code> on ImpactNFT if you see a checkerboard.
          </p>
          <button
            type="button"
            onClick={copyContract}
            className="mt-1 inline-flex items-center gap-1 text-holo-mint hover:underline"
          >
            <Copy size={11} />
            {copied ? "Copied!" : "Copy NFT contract · "}
            <ContractLink address={ADDRESSES.impactNFT} name="Etherscan" className="inline" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tokenIds.map((tokenId, i) => (
          <NFTCard key={tokenId.toString()} tokenId={tokenId} index={i} />
        ))}
      </div>
    </GlassPanel>
  );
}
