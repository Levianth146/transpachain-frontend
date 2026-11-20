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

// High-contrast badges for light campaign images AND dark UI (PR-07).
const COLORS = {
  active:
    "bg-teal-950/85 text-teal-100 ring-1 ring-teal-300/50 shadow-sm backdrop-blur-sm",
  funded:
    "bg-emerald-950/85 text-emerald-100 ring-1 ring-emerald-300/50 shadow-sm backdrop-blur-sm",
  voting:
    "bg-blue-950/85 text-blue-100 ring-1 ring-blue-300/50 shadow-sm backdrop-blur-sm",
  completed:
    "bg-violet-950/85 text-violet-100 ring-1 ring-violet-300/50 shadow-sm backdrop-blur-sm",
  failed:
    "bg-red-950/85 text-red-100 ring-1 ring-red-300/50 shadow-sm backdrop-blur-sm",
  cancelled:
    "bg-slate-950/85 text-slate-100 ring-1 ring-slate-300/50 shadow-sm backdrop-blur-sm",
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
