// ─── On-chain types (mirror Solidity structs) ───────────────────

export enum CampaignStatus { Active, Successful, Failed, Cancelled }
export enum DonorTier      { Bronze, Silver, Gold }
export enum ProposalState  { Pending, Active, Defeated, Queued, Executed, Cancelled }
export enum VoteChoice     { Against, For, Abstain }

export interface Campaign {
  id:                  bigint
  orgAddress:          `0x${string}`
  metadataCID:         string
  goalAmount:          bigint
  raisedAmount:        bigint
  deadline:            bigint
  status:              CampaignStatus
  totalMilestones:     number
  completedMilestones: number
}

export interface Milestone {
  proofCID:      string
  releaseAmount: bigint
  released:      boolean
  proposalId:    bigint
}

export interface Proposal {
  id:               bigint
  campaignId:       bigint
  milestoneIndex:   number
  proofCID:         string
  proposer:         `0x${string}`
  startBlock:       bigint
  endBlock:         bigint
  forVotes:         bigint
  againstVotes:     bigint
  abstainVotes:     bigint
  totalVotingPower: bigint
  state:            ProposalState
  executeAfter:     bigint
}

export interface NFTMetadata {
  campaignId:        bigint
  donor:             `0x${string}`
  tier:              DonorTier
  donatedAmount:     bigint
  impactScore:       bigint
  campaignCompleted: boolean
  metadataCID:       string
}

// ─── Off-chain types (from backend API) ─────────────────────────

export interface CampaignMeta {
  campaignId:   number
  title:        string
  description:  string
  category:     string
  imageUrl:     string
  orgName:      string
  donorCount:   number
  createdAt:    string
}

export interface DonationRecord {
  campaignId: number
  donor:      string
  amount:     string
  txHash:     string
  timestamp:  string
}
