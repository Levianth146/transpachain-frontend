const BACKEND_URL = typeof window !== "undefined" && window.location.hostname !== "localhost" ? "/api" : (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001");

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
    return res.json();
  },

  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BACKEND_URL}/ipfs/upload`, {
      method: "POST",
      body:   formData,
    });
    return res.json();
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
    return res.json();
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
};