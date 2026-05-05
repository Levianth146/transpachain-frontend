"use client";
import { useAccount } from "wagmi";
import { NFTGallery } from "@/components/NFTGallery";
import { ConnectWallet } from "@/components/ConnectWallet";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();

  if (!isConnected) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-lg">Connect your wallet to view dashboard</p>
      <ConnectWallet />
    </div>
  );

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Impact Dashboard</h1>
      <p className="text-sm text-gray-400 mb-6 font-mono">{address}</p>
      {/* TODO: donation history table, voting history */}
      <NFTGallery address={address!} />
    </main>
  );
}
