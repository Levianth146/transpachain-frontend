"use client";

import { useCreateCampaign } from "@/hooks/useCharityCore";

/**
 * Create Campaign page — for verified charity organisations.
 * Form uploads metadata to IPFS via backend, then calls CharityCore.createCampaign.
 */
export default function CreateCampaignPage() {
  const { createCampaign, isPending, isSuccess, error } = useCreateCampaign();

  // TODO: implement form state
  // TODO: upload metadata JSON + images to Pinata via backend /api/ipfs/upload
  // TODO: call createCampaign(metadataCID, goal, deadline, milestones)

  return (
    <main>
      <h1>Create Campaign</h1>
      {/* TODO: <CampaignForm onSubmit={...} /> */}
    </main>
  );
}
