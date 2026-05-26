// ─── On-chain types (mirror Solidity structs) ───────────────────

export enum CampaignStatus { Active, Successful, Failed, Cancelled }
export enum DonorTier      { Bronze, Silver, Gold }
export enum ProposalState  { Pending, Active, Defeated, Queued, Executed, Cancelled }
export enum VoteChoice     { Against, For, Abstain }

export interface Campaign {
  // Blockchain fields (bigint)
  id?:                  bigint
  // MongoDB fields (number/string)
  campaignId?:         number
  orgAddress:          `0x${string}`
  metadataCID:         string
  title?:              string
  description?:        string
  category?:           string
  imageUrl?:           string
  orgName?:            string
  goalAmount:          string | bigint
  raisedAmount:        string | bigint
  deadline:            number | bigint
  status:              CampaignStatus | number
  totalMilestones:     number
  completedMilestones: number
  donorCount?:         number
  paymentToken?:       number
  cancelledAt?:        number
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
  paymentToken:      number
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
