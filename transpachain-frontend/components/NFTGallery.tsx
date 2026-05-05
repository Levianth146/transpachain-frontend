"use client";
// TODO Phase 4: fetch tokenIds from ImpactNFT contract, render gallery

export function NFTGallery({ address }: { address: string }) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <h3 className="font-semibold mb-4">My Impact NFTs</h3>
      <p className="text-sm text-gray-400">
        Your donated campaign badges will appear here.
        {/* TODO: map over getDonorNFTs(address) and render NFT cards */}
      </p>
    </div>
  );
}
