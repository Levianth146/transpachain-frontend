"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { api } from "@/lib/api";
import { NFTGallery } from "@/components/NFTGallery";
import { ConnectWallet } from "@/components/ConnectWallet";

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
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-lg">Connect your wallet to view dashboard</p>
      <ConnectWallet />
    </div>
  );

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">My Impact Dashboard</h1>
      <p className="text-sm text-gray-400 mb-6 font-mono">{address}</p>

      {/* Stats */}
      {summary && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {Number(formatEther(BigInt(summary.totalDonated ?? "0"))).toFixed(3)}
            </p>
            <p className="text-sm text-gray-500">ETH Donated</p>
          </div>
          <div className="bg-white border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{summary.campaignCount}</p>
            <p className="text-sm text-gray-500">Campaigns Supported</p>
          </div>
          <div className="bg-white border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{summary.byStatus?.released ?? 0}</p>
            <p className="text-sm text-gray-500">Milestones Released</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NFT Gallery */}
        <NFTGallery address={address as string} />

        {/* Donation History */}
        <div className="bg-white border rounded-xl p-5">
          <h3 className="font-semibold mb-4">Donation History</h3>
          {donations.length === 0 ? (
            <p className="text-sm text-gray-400">No donations yet.</p>
          ) : (
            <div className="space-y-3">
              {donations.map((d: any) => (
                <div key={d.txHash} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">Campaign #{d.campaignId}</p>
                    <p className="text-xs text-gray-400 font-mono">{d.txHash.slice(0, 10)}...</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-emerald-600">
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
