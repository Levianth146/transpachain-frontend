/** Prefer explicit env (Vercel → Render). Avoid same-origin `/api` unless a Next rewrite exists. */
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

/** Absolute or same-origin backend base (for CSV download links). */
export function getBackendBase(): string {
  return BACKEND_URL;
}

/**
 * Module B routes are mounted under `/api/...` on the Express app.
 * Legacy routes stay at `/campaigns`, `/ipfs`, etc.
 * When the browser already uses BACKEND_URL=`/api` (non-localhost proxy), do not double-prefix.
 */
function moduleB(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (BACKEND_URL === "/api" || BACKEND_URL.endsWith("/api")) {
    return `${BACKEND_URL}${p}`;
  }
  return `${BACKEND_URL}/api${p}`;
}

async function parseJsonResponse(res: Response): Promise<Record<string, unknown>> {
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function assertOk(res: Response, fallback: string): Promise<Record<string, unknown>> {
  const data = await parseJsonResponse(res);
  if (!res.ok) {
    const message = typeof data.error === "string" ? data.error : `${fallback} (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  // Campaigns
  getCampaigns: async (page = 1, limit = 50, filters?: { category?: string; status?: number }) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters?.category) params.set("category", filters.category);
    if (filters?.status !== undefined) params.set("status", String(filters.status));
    const res = await fetch(`${BACKEND_URL}/campaigns?${params}`);
    return res.json();
  },

  getCampaign: async (id: number) => {
    const res = await fetch(`${BACKEND_URL}/campaigns/${id}`);
    return res.json();
  },

  getCampaignProposals: async (id: number) => {
    const res = await fetch(`${BACKEND_URL}/campaigns/${id}/proposals`);
    return res.json();
  },

  getCampaignDonations: async (id: number) => {
    const res = await fetch(`${BACKEND_URL}/campaigns/${id}/donations`);
    return res.json();
  },

  getStats: async () => {
    const res = await fetch(`${BACKEND_URL}/campaigns/stats`);
    return res.json();
  },

  // Donations
  getDonorSummary: async (address: string) => {
    const res = await fetch(`${BACKEND_URL}/donations/summary/${address}`);
    return res.json();
  },

  getDonorDonations: async (address: string) => {
    const res = await fetch(`${BACKEND_URL}/donations/${address}`);
    return res.json();
  },

  // IPFS
  uploadMetadata: async (metadata: object) => {
    const res = await fetch(`${BACKEND_URL}/ipfs/metadata`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(metadata),
    });
    const data = await res.json().catch(() => ({}));
    // Never let an empty CID reach createCampaign (contract reverts "CharityCore: empty CID").
    if (!res.ok || !data?.cid) {
      throw new Error(data?.error || `IPFS metadata upload failed (HTTP ${res.status}) — check PINATA keys in backend/.env`);
    }
    return data as { cid: string };
  },

  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BACKEND_URL}/ipfs/upload`, {
      method: "POST",
      body:   formData,
    });
    const data = await assertOk(res, "Image upload failed");
    const cid = (data.cid ?? data.IpfsHash) as string | undefined;
    if (!cid) throw new Error("Upload succeeded but no IPFS CID was returned");
    return { ...data, cid, url: data.url as string | undefined };
  },

  getIPFSMetadata: async (cid: string) => {
    const res = await fetch(`${BACKEND_URL}/ipfs/${cid}`);
    return res.json();
  },

  getProposals: async (state?: number) => {
    const params = state !== undefined ? `?state=${state}` : "";
    const res = await fetch(`${BACKEND_URL}/proposals${params}`);
    return res.json();
  },

  getOrgProfile: async (address: string) => {
    const res = await fetch(`${BACKEND_URL}/orgs/${address}`);
    return res.json();
  },

  submitOrgProfile: async (body: Record<string, string>) => {
    const res = await fetch(`${BACKEND_URL}/orgs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  getPendingOrgProfiles: async () => {
    const res = await fetch(`${BACKEND_URL}/admin/org-profiles?status=pending`);
    if (!res.ok) throw new Error("Failed to fetch org profiles");
    return res.json();
  },

  reviewOrgProfile: async (address: string, status: string, reviewerNote?: string) => {
    const res = await fetch(`${BACKEND_URL}/admin/org-profiles/${address}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reviewerNote }),
    });
    return res.json();
  },

  getEvidence: async (campaignId?: number, status = "approved") => {
    const params = new URLSearchParams({ status });
    if (campaignId !== undefined) params.set("campaignId", String(campaignId));
    const res = await fetch(`${BACKEND_URL}/evidence?${params}`);
    return res.json();
  },

  submitEvidence: async (body: Record<string, unknown>) => {
    const res = await fetch(`${BACKEND_URL}/evidence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return assertOk(res, "Evidence submission failed");
  },

  getPendingProposals: async () => {
    const res = await fetch(`${BACKEND_URL}/admin/proposals?approval=pending`);
    if (!res.ok) throw new Error("Failed to fetch proposals");
    return res.json();
  },

  reviewProposal: async (proposalId: number, approvalStatus: string) => {
    const res = await fetch(`${BACKEND_URL}/admin/proposals/${proposalId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approvalStatus }),
    });
    return res.json();
  },

  closeProposal: async (proposalId: number, closedReason: string) => {
    const res = await fetch(`${BACKEND_URL}/admin/proposals/${proposalId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ closedByAdmin: true, closedReason }),
    });
    return res.json();
  },

  getPendingEvidence: async () => {
    const res = await fetch(`${BACKEND_URL}/admin/evidence?approval=pending`);
    if (!res.ok) throw new Error("Failed to fetch evidence");
    return res.json();
  },

  reviewEvidence: async (id: string, approvalStatus: string, reviewerNote?: string) => {
    const res = await fetch(`${BACKEND_URL}/admin/evidence/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approvalStatus, reviewerNote }),
    });
    return res.json();
  },

  getVerifiedOrgs: async (): Promise<{
    orgs: Array<{ address: string; updatedAt: string; blockNumber?: number; txHash?: string }>;
    total: number;
  }> => {
    const res = await fetch(`${BACKEND_URL}/admin/verified-orgs`);
    if (!res.ok) throw new Error("Failed to fetch verified orgs");
    return res.json();
  },

  // ── Module B: transparency / finance / expenses / Safe sigs ─────────────

  getTransparencySummary: async () => {
    const res = await fetch(moduleB("/transparency/summary"));
    return assertOk(res, "Failed to load transparency summary");
  },

  getCampaignFinancialSummary: async (id: number) => {
    const res = await fetch(moduleB(`/campaigns/${id}/financial-summary`));
    return assertOk(res, "Failed to load financial summary");
  },

  getCampaignLedger: async (id: number, cursor?: string, limit = 50) => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (cursor) params.set("cursor", cursor);
    const res = await fetch(moduleB(`/campaigns/${id}/ledger?${params}`));
    return assertOk(res, "Failed to load ledger");
  },

  getCampaignExpenses: async (id: number) => {
    const res = await fetch(moduleB(`/campaigns/${id}/expenses`));
    return assertOk(res, "Failed to load expenses");
  },

  getCampaignReconciliation: async (id: number) => {
    const res = await fetch(moduleB(`/campaigns/${id}/reconciliation`));
    return assertOk(res, "Failed to load reconciliation");
  },

  /** URL for CSV download (browser navigates / creates blob). */
  campaignStatementCsvUrl: (id: number) => moduleB(`/campaigns/${id}/statement.csv`),

  getExpense: async (requestId: number) => {
    const res = await fetch(moduleB(`/expenses/${requestId}`));
    return assertOk(res, "Failed to load expense");
  },

  getSafeSignatures: async (requestId: number) => {
    const res = await fetch(moduleB(`/safe/${requestId}/signatures`));
    return assertOk(res, "Failed to load Safe signatures");
  },

  postSafeSignature: async (
    requestId: number,
    body: { signer: string; signature: string; safeTxHash: string }
  ) => {
    const res = await fetch(moduleB(`/safe/${requestId}/signatures`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return assertOk(res, "Failed to store Safe signature");
  },
};