const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export const api = {
  // Campaigns
  getCampaigns: async (page = 1, limit = 12, filters?: { category?: string; status?: number }) => {
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
};