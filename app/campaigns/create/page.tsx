"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useCreateCampaign, useIsOrgVerified } from "@/hooks/useCharityCore";
import { api } from "@/lib/api";
import { ConnectWallet } from "@/components/ConnectWallet";
import { AnimatedGradientBackground } from "@/components/ui/AnimatedGradientBackground";
import { LearnMoreLink } from "@/components/LearnMoreLink";
import { normalizeImageUrl } from "@/lib/images";
import { getPaymentTokenLabel } from "@/lib/format";

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
    goalAmount:  "",
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
      goalAmount:  form.goalAmount,
    });

    // 2. Calculate deadline timestamp
    const deadline = BigInt(
      Math.floor(Date.now() / 1000) + Number(form.daysUntilDeadline) * 24 * 3600
    );

    // 3. Call contract
    createCampaign(
      cid,
      form.goalAmount,
      deadline,
      Number(form.milestones),
      Number(form.paymentToken),
      form.category
    );
  };

  const paymentTokenNum = Number(form.paymentToken);
  const tokenLabel = getPaymentTokenLabel(paymentTokenNum);
  const goalStep = paymentTokenNum === 1 ? "0.01" : "0.001";
  const goalMin = paymentTokenNum === 1 ? "1" : "0.001";
  const goalPlaceholder = paymentTokenNum === 1 ? "1000" : "2.0";

  if (isSuccess) return (
    <AnimatedGradientBackground variant="dark" className="min-h-screen">
    <main className="mx-auto max-w-2xl px-4 py-10 text-center">
      <div className="mb-4 text-5xl">🎉</div>
      <h1 className="mb-2 text-2xl font-bold text-white">Campaign Created!</h1>
      <p className="mb-6 text-white/60">Your campaign has been deployed on Sepolia.</p>
      <button onClick={() => router.push("/campaigns")}
        className="rounded-full bg-emerald-600 px-6 py-2 text-white transition-colors hover:bg-emerald-500">
        View Campaigns
      </button>
    </main>
    </AnimatedGradientBackground>
  );

  if (!isConnected) return (
    <AnimatedGradientBackground variant="dark" className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Create Campaign</h1>
        <p className="text-white/60">Connect your verified org wallet to launch an on-chain escrow campaign.</p>
        <ConnectWallet />
      </div>
    </AnimatedGradientBackground>
  );

  return (
    <AnimatedGradientBackground variant="dark" className="min-h-screen">
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-2 text-4xl font-bold text-white">Create Campaign</h1>
      <p className="mb-2 text-sm text-white/60">Funds are escrowed on-chain — released only after donor DAO votes approve milestones.</p>
      <LearnMoreLink className="mb-6" />
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="mb-1 block text-sm font-medium text-white/80">Campaign Title *</label>
          <input name="title" value={form.title} onChange={handleChange} required
            className="w-full rounded-lg border border-gray-700 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-shine/50"
            placeholder="Build Schools in Rural Kenya" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-white/80">Organisation Name *</label>
          <input name="orgName" value={form.orgName} onChange={handleChange} required
            className="w-full rounded-lg border border-gray-700 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-shine/50"
            placeholder="Education For All Foundation" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-white/80">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required
            rows={3} className="w-full rounded-lg border border-gray-700 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-shine/50"
            placeholder="Describe your campaign..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-white/80">Category</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-shine/50">
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
              <option value="disaster">Disaster Relief</option>
              <option value="environment">Environment</option>
              <option value="community">Community</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-white/80">Payment Token</label>
            <select name="paymentToken" value={form.paymentToken} onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-shine/50">
              <option value="0">ETH</option>
              <option value="1">USDC</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-white/80">Image URL</label>
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange}
            className="w-full rounded-lg border border-gray-700 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-shine/50"
            placeholder="https://images.unsplash.com/... or ipfs://Qm..." />
          {form.imageUrl && !normalizeImageUrl(form.imageUrl) && (
            <p className="text-xs text-amber-600 mt-1">Invalid URL — use https:// or ipfs://. A category fallback will be shown instead.</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-white/80">Goal ({tokenLabel}) *</label>
            <input name="goalAmount" value={form.goalAmount} onChange={handleChange} required
              type="number" step={goalStep} min={goalMin}
              className="w-full rounded-lg border border-gray-700 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-shine/50"
              placeholder={goalPlaceholder} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-white/80">Milestones</label>
            <select name="milestones" value={form.milestones} onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-shine/50">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-white/80">Duration (days)</label>
            <input name="daysUntilDeadline" value={form.daysUntilDeadline} onChange={handleChange}
              type="number" min="1" max="90"
              className="w-full rounded-lg border border-gray-700 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-shine/50" />
          </div>
        </div>

        {!isVerified && address && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-800 dark:text-amber-200">
            <span>⚠️</span>
            <div>
              <p className="font-medium">Your wallet is not verified as an organization.</p>
              <p className="text-xs mt-0.5 text-amber-600">Contact admin to get verified before creating campaigns.</p>
            </div>
          </div>
        )}
        {error && <p className="text-sm text-red-500">{error.message}</p>}

        <button type="submit" disabled={isPending || isConfirming}
          className="w-full rounded-lg bg-emerald-600 py-3 font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50">
          {isPending ? "Confirm in wallet..." : isConfirming ? "Creating..." : "Create Campaign"}
        </button>
      </form>

    </main>
    </AnimatedGradientBackground>
  );
}
