"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useCreateCampaign, useIsOrgVerified } from "@/hooks/useCharityCore";
import { api } from "@/lib/api";
import { ConnectWallet } from "@/components/ConnectWallet";
import { PageShell } from "@/components/PageShell";
import { AnimatedGradientBackground } from "@/components/ui/AnimatedGradientBackground";
import { LearnMoreLink } from "@/components/LearnMoreLink";
import { normalizeImageUrl } from "@/lib/images";
import { getPaymentTokenLabel } from "@/lib/format";
import { FileUploadButton } from "@/components/FileUploadButton";

const INPUT_CLASS = "input-glass";

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
    paymentToken: "0",
    daysUntilDeadline: "30",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageUpload = async (file: File | null) => {
    setImageFile(file);
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const { url, cid } = await api.uploadFile(file);
      setForm((prev) => ({ ...prev, imageUrl: url || `ipfs://${cid}` }));
    } catch {
      setImageFile(null);
      setUploadError("Upload failed — check Pinata keys on backend or paste a URL manually.");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;

    const normalizedImage = normalizeImageUrl(form.imageUrl) ?? "";
    const { cid } = await api.uploadMetadata({
      title:       form.title,
      description: form.description,
      category:    form.category,
      imageUrl:    normalizedImage,
      orgName:     form.orgName,
      goalAmount:  form.goalAmount,
    });

    const deadline = BigInt(
      Math.floor(Date.now() / 1000) + Number(form.daysUntilDeadline) * 24 * 3600
    );

    void createCampaign(
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
    <PageShell
      eyebrow="Success"
      title="Campaign Created!"
      description="Your campaign has been deployed on Sepolia."
      maxWidth="2xl"
    >
      <div className="text-center">
        <div className="mb-4 text-5xl">🎉</div>
        <button onClick={() => router.push("/campaigns")}
          className="rounded-full bg-holo-gradient px-6 py-2 font-medium text-ink-950 transition-opacity hover:opacity-90">
          View Campaigns
        </button>
      </div>
    </PageShell>
  );

  if (!isConnected) return (
    <AnimatedGradientBackground className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <h1 className="font-display text-3xl font-bold text-brand-navy">Create Campaign</h1>
        <p className="text-slate-500">Connect your verified org wallet to launch an on-chain escrow campaign.</p>
        <ConnectWallet />
      </div>
    </AnimatedGradientBackground>
  );

  return (
    <PageShell
      eyebrow="Launch"
      title="Create Campaign"
      description="Funds are escrowed on-chain — released only after donor DAO votes approve milestones."
      maxWidth="2xl"
    >
      <LearnMoreLink className="mb-6" />
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="mb-1 block text-sm font-medium text-white/80">Campaign Title *</label>
          <input name="title" value={form.title} onChange={handleChange} required
            className={INPUT_CLASS}
            placeholder="Build Schools in Rural Kenya" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-white/80">Organisation Name *</label>
          <input name="orgName" value={form.orgName} onChange={handleChange} required
            className={INPUT_CLASS}
            placeholder="Education For All Foundation" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-white/80">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required
            rows={3} className={INPUT_CLASS}
            placeholder="Describe your campaign..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-white/80">Category</label>
            <select name="category" value={form.category} onChange={handleChange}
              className={INPUT_CLASS}>
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
              className={INPUT_CLASS}>
              <option value="0">ETH</option>
              <option value="1">USDC</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-white/80">Campaign Image</label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <FileUploadButton
              variant="holo"
              file={imageFile}
              onFileChange={handleImageUpload}
              uploading={uploading}
              buttonLabel="Upload to IPFS"
            />
            <span className="text-xs text-white/40">or paste URL below</span>
          </div>
          {uploadError && <p className="mt-1 text-xs text-red-400">{uploadError}</p>}
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange}
            className={`${INPUT_CLASS} mt-2`}
            placeholder="https://gateway.pinata.cloud/ipfs/... or ipfs://Qm..." />
          {form.imageUrl && !normalizeImageUrl(form.imageUrl) && (
            <p className="mt-1 text-xs text-amber-400">Invalid URL — use https:// or ipfs://. A category fallback will be shown instead.</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-white/80">Goal ({tokenLabel}) *</label>
            <input name="goalAmount" value={form.goalAmount} onChange={handleChange} required
              type="number" step={goalStep} min={goalMin}
              className={INPUT_CLASS}
              placeholder={goalPlaceholder} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-white/80">Milestones</label>
            <select name="milestones" value={form.milestones} onChange={handleChange}
              className={INPUT_CLASS}>
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
              className={INPUT_CLASS} />
          </div>
        </div>

        {!isVerified && address && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
            <span>⚠️</span>
            <div>
              <p className="font-medium">Your wallet is not verified as an organization.</p>
              <p className="mt-0.5 text-xs text-amber-300/80">Contact admin to get verified before creating campaigns.</p>
            </div>
          </div>
        )}
        {error && <p className="text-sm text-red-400">{error.message}</p>}

        <button type="submit" disabled={isPending || isConfirming}
          className="w-full rounded-lg bg-holo-gradient py-3 font-medium text-ink-950 transition-opacity hover:opacity-90 disabled:opacity-50">
          {isPending ? "Confirm in wallet..." : isConfirming ? "Creating..." : "Create Campaign"}
        </button>
      </form>
    </PageShell>
  );
}
