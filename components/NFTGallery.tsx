"use client";
import { useAccount } from "wagmi";
import { useReadContract } from "wagmi";
import { ADDRESSES, IMPACT_NFT_ABI } from "@/lib/contracts";
import { DonorTier } from "@/types";

const TIER_STYLE: Record<number, { label: string; color: string; border: string }> = {
  0: { label: "Bronze", color: "text-amber-700",  border: "border-amber-300"  },
  1: { label: "Silver", color: "text-gray-500",   border: "border-gray-300"   },
  2: { label: "Gold",   color: "text-yellow-600", border: "border-yellow-400" },
};

function NFTCard({ tokenId }: { tokenId: bigint }) {
  const { data: meta } = useReadContract({
    address:      ADDRESSES.impactNFT,
    abi:          IMPACT_NFT_ABI,
    functionName: "getNFTMetadata",
    args:         [tokenId],
  });

  if (!meta) return null;

  const tier  = TIER_STYLE[meta[2]] ?? TIER_STYLE[0];
  const score = Number(meta[4]);

  return (
    <div className={`border-2 ${tier.border} rounded-xl p-4 text-center`}>
      <div className="text-3xl mb-2">
        {meta[2] === 2 ? "🥇" : meta[2] === 1 ? "🥈" : "🥉"}
      </div>
      <p className={`font-bold text-sm ${tier.color}`}>{tier.label} Donor</p>
      <p className="text-xs text-gray-500 mt-1">Campaign #{Number(meta[0])}</p>
      {score > 0 && (
        <p className="text-xs text-gray-400 mt-1">Impact Score: {score}</p>
      )}
    </div>
  );
}

export function NFTGallery({ address }: { address: string }) {
  const { address: connectedAddress } = useAccount();
  const walletAddress = (address ?? connectedAddress) as `0x${string}` | undefined;

  const { data: tokenIds } = useReadContract({
    address:      ADDRESSES.impactNFT,
    abi:          IMPACT_NFT_ABI,
    functionName: "getDonorNFTs",
    args:         walletAddress ? [walletAddress] : undefined,
    query:        { enabled: !!walletAddress },
  });

  if (!walletAddress) return (
    <div className="bg-white border rounded-xl p-5">
      <h3 className="font-semibold mb-3">My Impact NFTs</h3>
      <p className="text-sm text-gray-400">
      Connect wallet to view your NFTs.
      </p>
    </div>
  );

  if (!tokenIds || tokenIds.length === 0) return (
    <div className="bg-white border rounded-xl p-5">
      <h3 className="font-semibold mb-3">My Impact NFTs</h3>
      <p className="text-sm text-gray-400">No NFTs yet. Donate to a campaign to earn one!</p>
    </div>
  );

  return (
    <div className="bg-white border rounded-xl p-5">
      <h3 className="font-semibold mb-4">My Impact NFTs ({tokenIds.length})</h3>
      <div className="grid grid-cols-2 gap-3">
        {tokenIds.map((tokenId) => (
          <NFTCard key={tokenId.toString()} tokenId={tokenId} />
        ))}
      </div>
    </div>
  );
}
