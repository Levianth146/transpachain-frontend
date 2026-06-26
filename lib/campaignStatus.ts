import { CampaignStatus } from "@/types";

export type CampaignDisplayPhase =
  | "active"
  | "funded"
  | "milestone-voting"
  | "completed"
  | "failed"
  | "cancelled";

export interface CampaignDisplayStatus {
  label: string;
  phase: CampaignDisplayPhase;
  color: string;
}

const COLORS = {
  active: "bg-holo-mint/20 text-holo-mint ring-1 ring-holo-mint/30",
  funded: "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30",
  voting: "bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30",
  completed: "bg-holo-lavender/20 text-holo-lavender ring-1 ring-holo-lavender/30",
  failed: "bg-red-500/20 text-red-300 ring-1 ring-red-500/30",
  cancelled: "bg-gray-500/20 text-gray-300 ring-1 ring-gray-500/30",
} as const;

export function deriveCampaignDisplayStatus(input: {
  status: number;
  raisedAmount?: bigint;
  goalAmount?: bigint;
  completedMilestones?: number;
  totalMilestones?: number;
  hasActiveOrQueuedProposal?: boolean;
  proposalState?: number;
}): CampaignDisplayStatus {
  const status = input.status ?? CampaignStatus.Active;
  const raised = input.raisedAmount ?? 0n;
  const goal = input.goalAmount ?? 0n;
  const completed = input.completedMilestones ?? 0;
  const total = input.totalMilestones ?? 0;
  const allMilestonesDone = total > 0 && completed >= total;

  if (status === CampaignStatus.Cancelled) {
    return { label: "Cancelled", phase: "cancelled", color: COLORS.cancelled };
  }
  if (status === CampaignStatus.Failed) {
    return { label: "Failed", phase: "failed", color: COLORS.failed };
  }
  if (status === CampaignStatus.Successful) {
    return {
      label: allMilestonesDone ? "Completed" : "In progress",
      phase: allMilestonesDone ? "completed" : "milestone-voting",
      color: allMilestonesDone ? COLORS.completed : COLORS.voting,
    };
  }

  if (input.hasActiveOrQueuedProposal) {
    const ps = input.proposalState;
    if (ps === 3) {
      return { label: "Ready to execute", phase: "milestone-voting", color: COLORS.voting };
    }
    if (ps === 1) {
      return { label: "Pending vote", phase: "milestone-voting", color: COLORS.voting };
    }
    return { label: "Queued", phase: "milestone-voting", color: COLORS.voting };
  }

  if (goal > 0n && raised >= goal) {
    return { label: "Funded", phase: "funded", color: COLORS.funded };
  }

  return { label: "Active", phase: "active", color: COLORS.active };
}

export function canShowFinalizeButton(
  eligible: boolean,
  goalReached: boolean,
  expired: boolean,
  allMilestonesDone: boolean
): { show: boolean; label: string } {
  if (!eligible) return { show: false, label: "" };
  if (allMilestonesDone) {
    return { show: true, label: "Close completed campaign" };
  }
  if (expired && !goalReached) {
    return { show: true, label: "Finalize failed campaign" };
  }
  return { show: false, label: "" };
}

export function getMilestoneDisplayStatus(input: {
  released?: boolean;
  proposalId?: bigint;
  proposalState?: number;
  isNextToSubmit?: boolean;
}): string {
  if (input.released) return "Released";
  if (!input.proposalId || input.proposalId === 0n) {
    return input.isNextToSubmit ? "Not submitted" : "Waiting";
  }
  const ps = input.proposalState;
  if (ps === 1) return "Pending vote";
  if (ps === 3) return "Ready to execute";
  if (ps === 4) return "Released";
  if (ps === 2 || ps === 5) return "Not submitted";
  return "Queued";
}
