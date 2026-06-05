"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useCreateCampaign, useIsOrgVerified } from "@/hooks/useCharityCore";
import { api } from "@/lib/api";
import { ConnectWallet } from "@/components/ConnectWallet";
import { AnimatedGradientBackground } from "@/components/ui/AnimatedGradientBackground";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { HowItWorksBlock } from "@/components/HowItWorksBlock";
import { TraditionalVsTranspaChain } from "@/components/TraditionalVsTranspaChain";
import { TrustSecurityStrip } from "@/components/TrustSecurityStrip";
import { normalizeImageUrl } from "@/lib/images";

export default function CreateCampaignPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { createCampaign, isPending, isConfirming, isSuccess, error } = useCreateCampaign();
  const { address } = useAccount();
  const { data: isVerified } = useIsOrgVerified(address);

  const [form, setForm] = useState({
    title:       "",
    description: "",
    category:    "education",
    imageUrl:    "",
    orgName:     "",
    goalEth:     "",
    milestones:  "3",
    paymentToken: "0",  // 0 = ETH, 1 = USDC
    daysUntilDeadline: "30",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;

    // 1. Upload metadata to IPFS via backend
    const normalizedImage = normalizeImageUrl(form.imageUrl) ?? "";
    const { cid } = await api.uploadMetadata({
      title:       form.title,
      description: form.description,
      category:    form.category,
      imageUrl:    normalizedImage,
      orgName:     form.orgName,
      goalAmount:  form.goalEth,
    });

    // 2. Calculate deadline timestamp
    const deadline = BigInt(
      Math.floor(Date.now() / 1000) + Number(form.daysUntilDeadline) * 24 * 3600
    );

    // 3. Call contract
    createCampaign(
      cid,
      form.goalEth,
      deadline,
      Number(form.milestones),
      Number(form.paymentToken),
      form.category
    );
  };

  if (isSuccess) return (
    <main className="max-w-2xl mx-auto px-4 py-10 text-center">
      <div className="text-5xl mb-4">🎉</div>
      <h1 className="text-2xl font-bold mb-2">Campaign Created!</h1>
      <p className="text-gray-500 mb-6">Your campaign has been deployed on Sepolia.</p>
      <button onClick={() => router.push("/")}
        className="px-6 py-2 bg-emerald-600 text-white rounded-lg">
        View Campaigns
      </button>
    </main>
  );

  if (!isConnected) return (
    <main className="max-w-2xl mx-auto px-4 py-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Create Campaign</h1>
      <p className="text-gray-500 mb-4">Connect your wallet to create a campaign.</p>
      <ConnectWallet />
    </main>
  );

  return (
    <AnimatedGradientBackground className="min-h-screen">
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display text-gray-900 dark:text-cream-100 mb-2">Create Campaign</h1>
      <p className="text-sm text-gray-500 mb-4">Funds are escrowed on-chain — released only after donor DAO votes approve milestones.</p>
      <TrustSecurityStrip />
      <form onSubmit={handleSubmit} className="space-y-4 mt-6">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title *</label>
          <input name="title" value={form.title} onChange={handleChange} required
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Build Schools in Rural Kenya" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Organisation Name *</label>
          <input name="orgName" value={form.orgName} onChange={handleChange} required
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Education For All Foundation" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required
            rows={3} className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Describe your campaign..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
              <option value="disaster">Disaster Relief</option>
              <option value="environment">Environment</option>
              <option value="community">Community</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Token</label>
            <select name="paymentToken" value={form.paymentToken} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="0">ETH</option>
              <option value="1">USDC</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-ink-900 dark:border-zinc-700"
            placeholder="https://images.unsplash.com/... or ipfs://Qm..." />
          {form.imageUrl && !normalizeImageUrl(form.imageUrl) && (
            <p className="text-xs text-amber-600 mt-1">Invalid URL — use https:// or ipfs://. A category fallback will be shown instead.</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Goal (ETH) *</label>
            <input name="goalEth" value={form.goalEth} onChange={handleChange} required
              type="number" step="0.001" min="0.001"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="2.0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Milestones</label>
            <select name="milestones" value={form.milestones} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
            <input name="daysUntilDeadline" value={form.daysUntilDeadline} onChange={handleChange}
              type="number" min="1" max="90"
              className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>

        {!isVerified && address && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            <span>⚠️</span>
            <div>
              <p className="font-medium">Your wallet is not verified as an organization.</p>
              <p className="text-xs mt-0.5 text-amber-600">Contact admin to get verified before creating campaigns.</p>
            </div>
          </div>
        )}
        {error && <p className="text-sm text-red-500">{error.message}</p>}

        <button type="submit" disabled={isPending || isConfirming}
          className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium
                     disabled:opacity-50 hover:bg-emerald-700">
          {isPending ? "Confirm in wallet..." : isConfirming ? "Creating..." : "Create Campaign"}
        </button>
      </form>

      <div className="mt-10 space-y-6">
        <GlassPanel className="p-5">
          <h3 className="font-semibold mb-4 text-sm">Security flow for new campaigns</h3>
          <HowItWorksBlock columns={5} />
        </GlassPanel>
        <TraditionalVsTranspaChain />
      </div>
    </main>
    </AnimatedGradientBackground>
  );
}
