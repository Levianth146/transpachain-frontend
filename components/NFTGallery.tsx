"use client";
import { useAccount } from "wagmi";
import { useReadContract } from "wagmi";
import { motion } from "framer-motion";
import { ADDRESSES, IMPACT_NFT_ABI } from "@/lib/contracts";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Medal, GameController, ArrowSquareOut } from "@phosphor-icons/react";
import Image from "next/image";
import { tierImagePath, tierLabel } from "@/lib/nft";
import { tokenExplorerUrl } from "@/components/TxLink";

const TIER_STYLE: Record<number, {
  label: string;
  gradient: string;
  glow: string;
  border: string;
  scanline: string;
}> = {
  0: {
    label: "Bronze",
    gradient: "from-amber-900/50 via-orange-950/40 to-[#0a0618]",
    glow: "shadow-[0_0_32px_rgba(255,153,0,0.3)]",
    border: "border-amber-500/50",
    scanline: "rgba(255,180,0,0.07)",
  },
  1: {
    label: "Silver",
    gradient: "from-slate-500/30 via-zinc-900/50 to-[#050d18]",
    glow: "shadow-[0_0_32px_rgba(103,232,249,0.25)]",
    border: "border-cyan-300/40",
    scanline: "rgba(0,255,255,0.05)",
  },
  2: {
    label: "Gold",
    gradient: "from-yellow-600/35 via-amber-900/30 to-[#120828]",
    glow: "shadow-[0_0_36px_rgba(255,215,0,0.35)]",
    border: "border-yellow-400/55",
    scanline: "rgba(255,255,0,0.06)",
  },
};

const OPENSEA_BASE = "https://testnets.opensea.io/assets/sepolia";

function NFTCard({ tokenId, index }: { tokenId: bigint; index: number }) {
  const { data: meta } = useReadContract({
    address:      ADDRESSES.impactNFT,
    abi:          IMPACT_NFT_ABI,
    functionName: "getNFTMetadata",
    args:         [tokenId],
  });

  if (!meta) return (
    <div className="aspect-[3/4] rounded-2xl bg-black/40 border border-white/10 animate-pulse" />
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
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ scale: 1.02, y: -6 }}
      className={`relative flex aspect-[3/4] flex-col overflow-hidden rounded-2xl border ${tier.border} bg-gradient-to-b ${tier.gradient} ${tier.glow}`}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${tier.scanline} 2px, ${tier.scanline} 4px)`,
        }}
      />
      <div className="relative flex flex-1 items-center justify-center p-4 pt-6">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={tierImagePath(tierIdx)}
            alt={tier.label}
            width={140}
            height={140}
            className="rounded-xl border border-white/20 shadow-2xl image-rendering-pixelated"
            style={{ imageRendering: "pixelated" }}
          />
        </motion.div>
      </div>
      <div className="relative border-t border-white/10 bg-black/40 px-4 py-3 text-center backdrop-blur-sm">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-white">
          {tierLabel(tierIdx)}
        </p>
        <p className="mt-0.5 text-[10px] font-mono text-white/45">Campaign #{campaignId}</p>
        <p className="text-[10px] font-mono text-holo-mint/80">#{tokenId.toString()}</p>
        {score > 0 && (
          <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/50 px-2 py-0.5 text-[10px]">
            <Medal size={10} weight="duotone" className="text-holo-mint" />
            Impact {score}
          </div>
        )}
      </div>
    </motion.a>
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
    <GlassPanel holoBorder className="p-6 h-full">
      <h3 className="font-display font-semibold mb-3 flex items-center gap-2 text-white">
        <GameController size={20} className="text-holo-pink" weight="duotone" />
        My Impact NFTs
      </h3>
      <p className="text-sm text-white/50">{msg}</p>
    </GlassPanel>
  );

  if (!walletAddress) return emptyState("Connect wallet to view your retro synthwave donor badges.");

  if (!tokenIds || tokenIds.length === 0) {
    return emptyState("No badges yet. Donate to earn Bronze, Silver, or Gold impact tiers!");
  }

  return (
    <GlassPanel holoBorder className="p-6 h-full">
      <div className="mb-4 flex items-center gap-2">
        <GameController size={20} className="text-holo-pink" weight="duotone" />
        <h3 className="font-display font-semibold text-white">My Impact NFTs</h3>
        <span className="ml-auto rounded-full border border-holo-pink/30 bg-holo-pink/10 px-2.5 py-0.5 text-xs font-normal text-holo-pink">
          {tokenIds.length} badge{tokenIds.length === 1 ? "" : "s"}
        </span>
      </div>

      <p className="mb-4 text-xs leading-relaxed text-white/45">
        One badge per campaign. View in MetaMask or on OpenSea — if art doesn&apos;t appear, open the
        NFT menu and tap <strong className="text-white/60">Refresh metadata</strong>.
      </p>

      <a
        href={`${OPENSEA_BASE}/${ADDRESSES.impactNFT}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-5 inline-flex items-center gap-1.5 text-xs text-holo-mint hover:underline"
      >
        <ArrowSquareOut size={13} />
        View collection on OpenSea
      </a>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {tokenIds.map((tokenId, i) => (
          <NFTCard key={tokenId.toString()} tokenId={tokenId} index={i} />
        ))}
      </div>
    </GlassPanel>
  );
}
