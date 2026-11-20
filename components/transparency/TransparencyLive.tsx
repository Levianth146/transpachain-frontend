"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useReadContract, useReadContracts } from "wagmi";
import { formatEther, formatUnits } from "viem";
import {
  ADDRESSES,
  CHARITY_CORE_ABI,
  DONATION_VAULT_ABI,
  GOVERNANCE_DAO_ABI,
  IMPACT_NFT_ABI,
  DISBURSEMENT_CONTROLLER_ABI,
  YIELD_MANAGER_ABI,
  MOCK_ERC4626_ABI,
  SAFE_ABI,
  isContractConfigured,
} from "@/lib/contracts";
import { NETWORK, NETWORK_NAME, EXPLORER_NAME, NATIVE_SYMBOL } from "@/lib/chain";
import { formatCampaignAmountLabel, getPaymentTokenLabel } from "@/lib/format";
import { useOnChainPlatformStats } from "@/hooks/useOnChainPlatformStats";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MockYieldBadge } from "@/components/MockYieldBadge";
import {
  AddressLink,
  ContractLink,
  addressExplorerUrl,
  contractReadUrl,
  contractCodeUrl,
} from "@/components/TxLink";

const DEPLOY_FROM_BLOCK = 61364951;
const STATUS_LABELS = ["Active", "Completed", "Failed", "Cancelled"];

type ViewFn = { name: string; note?: string };

const VIEW_CATALOG: {
  key: keyof typeof ADDRESSES;
  label: string;
  views: ViewFn[];
}[] = [
  {
    key: "charityCore",
    label: "CharityCore",
    views: [
      { name: "totalCampaigns" },
      { name: "getCampaign(campaignId)" },
      { name: "getCharityProgress(campaignId)" },
      { name: "canFinalize(campaignId)" },
      { name: "MAX_EXTENSION" },
      { name: "isOrgVerified(org)" },
      { name: "getCampaignsByOrg(org)" },
      { name: "hasRole(role, account)" },
    ],
  },
  {
    key: "donationVault",
    label: "DonationVault",
    views: [
      { name: "getCampaignEscrowBalance(campaignId)" },
      { name: "getTotalDeposited(campaignId)" },
      { name: "getCharityDonors(campaignId)" },
      { name: "getDonorInfo / getDonorAmount" },
      { name: "getMilestone(campaignId, idx)" },
      { name: "canRefund / getRefundableAmount / getRefundRatioBps" },
      { name: "getInvestedBalance(campaignId)" },
      { name: "yieldManager / disbursementController" },
      { name: "hasActiveOrQueuedProposal(campaignId)" },
    ],
  },
  {
    key: "governanceDAO",
    label: "GovernanceDAO",
    views: [
      { name: "getProposal / getProposalState" },
      { name: "getCampaignProposals / getActiveProposal" },
      { name: "QUORUM_BPS / votingPeriod / timelockDelay" },
      { name: "getVotingPower / getDonorLinearAmount / hasVoted" },
      { name: "quadraticWeight(amountWei)", note: "pure" },
      { name: "hasActiveOrQueuedProposal(campaignId)" },
    ],
  },
  {
    key: "impactNFT",
    label: "ImpactNFT",
    views: [
      { name: "getCampaignNFTs(campaignId)" },
      { name: "getDonorNFTs(donor)" },
      { name: "getNFTMetadata(tokenId)" },
      { name: "getTierMetadataCID(tier)" },
      { name: "hasMintedForCampaign(donor, campaignId)" },
    ],
  },
  {
    key: "disbursementController",
    label: "DisbursementController",
    views: [
      { name: "getRequest(requestId)" },
      { name: "requestHash(requestId)" },
      { name: "safe()" },
    ],
  },
  {
    key: "yieldManager",
    label: "YieldManager",
    views: [
      { name: "previewInvestable(cid)" },
      { name: "positionValue / getPosition(cid)" },
      { name: "policy()" },
      { name: "owner / operators" },
    ],
  },
  {
    key: "mockErc4626Vault",
    label: "MockERC4626Vault",
    views: [
      { name: "asset()" },
      { name: "owner()" },
      { name: "simulateYield / simulateLoss", note: "write · mock only" },
    ],
  },
  {
    key: "disbursementSafe",
    label: "Disbursement Safe",
    views: [
      { name: "getOwners / getThreshold" },
      { name: "isOwner / nonce / domainSeparator" },
      { name: "getTransactionHash(...)" },
    ],
  },
];

function StatCard({
  label,
  value,
  hint,
  badge,
}: {
  label: string;
  value: string;
  hint?: string;
  badge?: boolean;
}) {
  return (
    <GlassPanel className="p-4">
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <p className="text-xs text-slate-500 dark:text-white/50">{label}</p>
        {badge && <MockYieldBadge />}
      </div>
      <p className="break-all font-mono text-sm font-semibold text-slate-900 dark:text-white">{value}</p>
      {hint && <p className="mt-1 text-[10px] text-slate-500 dark:text-white/40">{hint}</p>}
    </GlassPanel>
  );
}

function ReadRow({
  label,
  value,
  loading,
}: {
  label: string;
  value: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <div className="grid gap-1 border-b border-slate-200 py-2.5 text-sm last:border-0 dark:border-white/10 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:gap-3">
      <dt className="font-mono text-[11px] text-slate-500 dark:text-white/45">{label}</dt>
      <dd className="break-all font-mono text-xs text-slate-900 dark:text-white">
        {loading ? <span className="text-slate-400 dark:text-white/30">reading…</span> : value}
      </dd>
    </div>
  );
}

export function TransparencyLive() {
  const stats = useOnChainPlatformStats();
  const ids = useMemo(
    () =>
      stats.totalCampaigns && stats.totalCampaigns > 0
        ? Array.from({ length: stats.totalCampaigns }, (_, i) => i + 1)
        : [],
    [stats.totalCampaigns]
  );

  const { data: maxExtension, isLoading: maxExtLoading } = useReadContract({
    address: ADDRESSES.charityCore,
    abi: CHARITY_CORE_ABI,
    functionName: "MAX_EXTENSION",
  });

  const { data: quorumBps, isLoading: quorumLoading } = useReadContract({
    address: ADDRESSES.governanceDAO,
    abi: GOVERNANCE_DAO_ABI,
    functionName: "QUORUM_BPS",
  });

  const { data: votingPeriod, isLoading: vpLoading } = useReadContract({
    address: ADDRESSES.governanceDAO,
    abi: GOVERNANCE_DAO_ABI,
    functionName: "votingPeriod",
  });

  const { data: timelockDelay, isLoading: tlLoading } = useReadContract({
    address: ADDRESSES.governanceDAO,
    abi: GOVERNANCE_DAO_ABI,
    functionName: "timelockDelay",
  });

  const { data: vaultYieldMgr } = useReadContract({
    address: ADDRESSES.donationVault,
    abi: DONATION_VAULT_ABI,
    functionName: "yieldManager",
  });

  const { data: vaultDisbCtrl } = useReadContract({
    address: ADDRESSES.donationVault,
    abi: DONATION_VAULT_ABI,
    functionName: "disbursementController",
  });

  const { data: ctrlSafe } = useReadContract({
    address: ADDRESSES.disbursementController,
    abi: DISBURSEMENT_CONTROLLER_ABI,
    functionName: "safe",
    query: { enabled: isContractConfigured(ADDRESSES.disbursementController) },
  });

  const { data: yieldPolicy } = useReadContract({
    address: ADDRESSES.yieldManager,
    abi: YIELD_MANAGER_ABI,
    functionName: "policy",
    query: { enabled: isContractConfigured(ADDRESSES.yieldManager) },
  });

  const { data: yieldOwner } = useReadContract({
    address: ADDRESSES.yieldManager,
    abi: YIELD_MANAGER_ABI,
    functionName: "owner",
    query: { enabled: isContractConfigured(ADDRESSES.yieldManager) },
  });

  const { data: mockAsset } = useReadContract({
    address: ADDRESSES.mockErc4626Vault,
    abi: MOCK_ERC4626_ABI,
    functionName: "asset",
    query: { enabled: isContractConfigured(ADDRESSES.mockErc4626Vault) },
  });

  const { data: mockOwner } = useReadContract({
    address: ADDRESSES.mockErc4626Vault,
    abi: MOCK_ERC4626_ABI,
    functionName: "owner",
    query: { enabled: isContractConfigured(ADDRESSES.mockErc4626Vault) },
  });

  const { data: safeOwners } = useReadContract({
    address: ADDRESSES.disbursementSafe,
    abi: SAFE_ABI,
    functionName: "getOwners",
    query: { enabled: isContractConfigured(ADDRESSES.disbursementSafe) },
  });

  const { data: safeThreshold } = useReadContract({
    address: ADDRESSES.disbursementSafe,
    abi: SAFE_ABI,
    functionName: "getThreshold",
    query: { enabled: isContractConfigured(ADDRESSES.disbursementSafe) },
  });

  const { data: safeNonce } = useReadContract({
    address: ADDRESSES.disbursementSafe,
    abi: SAFE_ABI,
    functionName: "nonce",
    query: { enabled: isContractConfigured(ADDRESSES.disbursementSafe) },
  });

  const campaignContracts = useMemo(
    () =>
      ids.flatMap((id) => {
        const cid = BigInt(id);
        return [
          {
            address: ADDRESSES.charityCore,
            abi: CHARITY_CORE_ABI,
            functionName: "getCampaign" as const,
            args: [cid] as const,
          },
          {
            address: ADDRESSES.charityCore,
            abi: CHARITY_CORE_ABI,
            functionName: "getCharityProgress" as const,
            args: [cid] as const,
          },
          {
            address: ADDRESSES.donationVault,
            abi: DONATION_VAULT_ABI,
            functionName: "getCampaignEscrowBalance" as const,
            args: [cid] as const,
          },
          {
            address: ADDRESSES.donationVault,
            abi: DONATION_VAULT_ABI,
            functionName: "getCharityDonors" as const,
            args: [cid] as const,
          },
          {
            address: ADDRESSES.donationVault,
            abi: DONATION_VAULT_ABI,
            functionName: "getTotalDeposited" as const,
            args: [cid] as const,
          },
          {
            address: ADDRESSES.donationVault,
            abi: DONATION_VAULT_ABI,
            functionName: "getInvestedBalance" as const,
            args: [cid] as const,
          },
          {
            address: ADDRESSES.governanceDAO,
            abi: GOVERNANCE_DAO_ABI,
            functionName: "getCampaignProposals" as const,
            args: [cid] as const,
          },
          {
            address: ADDRESSES.impactNFT,
            abi: IMPACT_NFT_ABI,
            functionName: "getCampaignNFTs" as const,
            args: [cid] as const,
          },
          {
            address: ADDRESSES.yieldManager,
            abi: YIELD_MANAGER_ABI,
            functionName: "getPosition" as const,
            args: [cid] as const,
          },
        ];
      }),
    [ids]
  );

  const { data: campaignBatch, isLoading: campaignsLoading } = useReadContracts({
    contracts: campaignContracts,
    query: { enabled: ids.length > 0 },
  });

  const campaignRows = useMemo(() => {
    if (!campaignBatch || ids.length === 0) return [];
    const stride = 9;
    return ids.map((id, i) => {
      const base = i * stride;
      const camp = campaignBatch[base];
      const prog = campaignBatch[base + 1];
      const escrow = campaignBatch[base + 2];
      const donors = campaignBatch[base + 3];
      const deposited = campaignBatch[base + 4];
      const invested = campaignBatch[base + 5];
      const proposals = campaignBatch[base + 6];
      const nfts = campaignBatch[base + 7];
      const position = campaignBatch[base + 8];

      const c =
        camp?.status === "success"
          ? (camp.result as {
              status: number;
              orgAddress: string;
              goalAmount: bigint;
              raisedAmount: bigint;
              paymentToken: number;
              totalMilestones: number;
              completedMilestones: number;
              deadline: bigint;
              category: string;
              metadataCID: string;
            })
          : null;
      const progress =
        prog?.status === "success"
          ? (prog.result as readonly [bigint, bigint, bigint, bigint, boolean, bigint])
          : null;
      const paymentToken = c ? Number(c.paymentToken) : 0;
      const pos =
        position?.status === "success"
          ? (position.result as {
              shares: bigint;
              principal: bigint;
              realizedPnl: bigint;
              enabled: boolean;
            })
          : null;

      return {
        id,
        c,
        progress,
        paymentToken,
        escrow: escrow?.status === "success" ? (escrow.result as bigint) : undefined,
        donors: donors?.status === "success" ? (donors.result as string[]) : undefined,
        deposited: deposited?.status === "success" ? (deposited.result as bigint) : undefined,
        invested: invested?.status === "success" ? (invested.result as bigint) : undefined,
        proposals:
          proposals?.status === "success" ? (proposals.result as readonly bigint[]) : undefined,
        nfts: nfts?.status === "success" ? (nfts.result as readonly bigint[]) : undefined,
        position: pos,
      };
    });
  }, [campaignBatch, ids]);

  const policy = yieldPolicy as
    | {
        minLiquidReserveBps: number;
        maxAllocationBps: number;
        maxAssetsPerTx: bigint;
        paused: boolean;
      }
    | undefined;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="totalCampaigns() on-chain"
          value={stats.totalCampaigns != null ? String(stats.totalCampaigns) : "—"}
          hint="CharityCore · source of truth"
        />
        <StatCard
          label={`Raised ${NATIVE_SYMBOL} (sum getCharityProgress)`}
          value={
            stats.ready
              ? `${Number(formatEther(stats.totalEthWei)).toFixed(4)} ${NATIVE_SYMBOL}`
              : "…"
          }
          hint="Net after 1% fee · AVAX campaigns only"
        />
        <StatCard
          label="Raised USDC (sum getCharityProgress)"
          value={
            stats.ready
              ? `${Number(formatUnits(stats.totalUsdcWei, 6)).toFixed(2)} USDC`
              : "…"
          }
          hint="Net after 1% fee · USDC campaigns only"
        />
        <StatCard
          label="Network"
          value={`${NETWORK_NAME} (${NETWORK.chain.id})`}
          hint={`Deploy from block ${DEPLOY_FROM_BLOCK}`}
        />
      </div>

      <GlassPanel className="p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Live platform reads
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-white/50">
              Direct `eth_call` via wagmi — verify the same functions on {EXPLORER_NAME} Read
              Contract.
            </p>
          </div>
          <a
            href={contractReadUrl(ADDRESSES.charityCore)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-teal-700 hover:underline dark:text-holo-mint"
          >
            Open CharityCore on {EXPLORER_NAME} ↗
          </a>
        </div>
        <dl>
          <ReadRow
            label="CharityCore.totalCampaigns"
            value={stats.totalCampaigns != null ? String(stats.totalCampaigns) : "—"}
            loading={stats.totalCampaigns == null}
          />
          <ReadRow
            label="CharityCore.MAX_EXTENSION"
            value={
              maxExtension != null
                ? `${Number(maxExtension)}s (${(Number(maxExtension) / 86400).toFixed(1)} days)`
                : "—"
            }
            loading={maxExtLoading}
          />
          <ReadRow
            label="GovernanceDAO.QUORUM_BPS"
            value={quorumBps != null ? `${Number(quorumBps)} (${Number(quorumBps) / 100}%)` : "—"}
            loading={quorumLoading}
          />
          <ReadRow
            label="GovernanceDAO.votingPeriod"
            value={
              votingPeriod != null
                ? `${Number(votingPeriod)}s (${(Number(votingPeriod) / 60).toFixed(1)} min)`
                : "—"
            }
            loading={vpLoading}
          />
          <ReadRow
            label="GovernanceDAO.timelockDelay"
            value={
              timelockDelay != null
                ? `${Number(timelockDelay)}s (${(Number(timelockDelay) / 60).toFixed(1)} min)`
                : "—"
            }
            loading={tlLoading}
          />
          <ReadRow
            label="DonationVault.yieldManager()"
            value={
              vaultYieldMgr ? (
                <AddressLink address={String(vaultYieldMgr)} />
              ) : (
                "—"
              )
            }
          />
          <ReadRow
            label="DonationVault.disbursementController()"
            value={
              vaultDisbCtrl ? (
                <AddressLink address={String(vaultDisbCtrl)} />
              ) : (
                "—"
              )
            }
          />
          <ReadRow
            label="DisbursementController.safe()"
            value={ctrlSafe ? <AddressLink address={String(ctrlSafe)} /> : "—"}
          />
          <ReadRow
            label="Safe.getThreshold / getOwners"
            value={
              safeThreshold != null && safeOwners
                ? `${Number(safeThreshold)} / ${(safeOwners as string[]).length} owners`
                : "—"
            }
          />
          <ReadRow
            label="Safe.owners[]"
            value={
              Array.isArray(safeOwners) && safeOwners.length > 0 ? (
                <span className="flex flex-col gap-1">
                  {(safeOwners as string[]).map((o) => (
                    <AddressLink key={o} address={o} />
                  ))}
                </span>
              ) : (
                "—"
              )
            }
          />
          <ReadRow label="Safe.nonce" value={safeNonce != null ? String(safeNonce) : "—"} />
          <ReadRow
            label="YieldManager.policy()"
            value={
              policy ? (
                <span>
                  reserve {policy.minLiquidReserveBps} bps · maxAlloc {policy.maxAllocationBps} bps
                  · max/tx{" "}
                  {policy.maxAssetsPerTx > 10n ** 18n
                    ? "∞"
                    : formatUnits(policy.maxAssetsPerTx, 6)}{" "}
                  · paused=
                  {String(policy.paused)}
                </span>
              ) : (
                "—"
              )
            }
          />
          <ReadRow
            label="YieldManager.owner()"
            value={yieldOwner ? <AddressLink address={String(yieldOwner)} /> : "—"}
          />
          <ReadRow
            label="MockERC4626.asset() / owner()"
            value={
              <span className="inline-flex flex-wrap items-center gap-2">
                {mockAsset ? <AddressLink address={String(mockAsset)} /> : "—"}
                <span className="text-slate-400">/</span>
                {mockOwner ? <AddressLink address={String(mockOwner)} /> : "—"}
                <MockYieldBadge />
              </span>
            }
          />
          <ReadRow
            label="Circle USDC (Fuji)"
            value={<AddressLink address={NETWORK.defaultUsdc} />}
          />
        </dl>
      </GlassPanel>

      <GlassPanel className="p-5">
        <h2 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
          Per-campaign on-chain table
        </h2>
        <p className="mb-4 text-xs text-slate-600 dark:text-white/50">
          Batch reads: getCampaign, getCharityProgress, escrow, donors, deposited, invested,
          proposals, NFTs, yield position.
        </p>
        {campaignsLoading && (
          <p className="text-sm text-slate-500 dark:text-white/40">Loading campaign reads…</p>
        )}
        {!campaignsLoading && campaignRows.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-white/40">No campaigns on-chain yet.</p>
        )}
        {campaignRows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-xs text-slate-700 dark:text-white/75">
              <thead className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-white/40">
                <tr>
                  <th className="pb-2 pr-3">ID</th>
                  <th className="pb-2 pr-3">Status</th>
                  <th className="pb-2 pr-3">Token</th>
                  <th className="pb-2 pr-3">Raised / Goal</th>
                  <th className="pb-2 pr-3">Progress</th>
                  <th className="pb-2 pr-3">Escrow</th>
                  <th className="pb-2 pr-3">Donors</th>
                  <th className="pb-2 pr-3">Deposited</th>
                  <th className="pb-2 pr-3">Invested</th>
                  <th className="pb-2 pr-3">Yield</th>
                  <th className="pb-2 pr-3">Proposals</th>
                  <th className="pb-2 pr-3">NFTs</th>
                  <th className="pb-2">Org</th>
                </tr>
              </thead>
              <tbody>
                {campaignRows.map((row) => {
                  const token = row.paymentToken;
                  const raised = row.progress?.[0] ?? row.c?.raisedAmount;
                  const goal = row.progress?.[1] ?? row.c?.goalAmount;
                  const bps = row.progress ? Number(row.progress[2]) / 100 : null;
                  return (
                    <tr key={row.id} className="border-t border-slate-200 dark:border-white/5">
                      <td className="py-2.5 pr-3">
                        <Link
                          href={`/campaigns/${row.id}`}
                          className="font-semibold text-teal-700 hover:underline dark:text-holo-mint"
                        >
                          #{row.id}
                        </Link>
                      </td>
                      <td className="py-2.5 pr-3">
                        {row.c ? STATUS_LABELS[row.c.status] ?? row.c.status : "—"}
                      </td>
                      <td className="py-2.5 pr-3">{getPaymentTokenLabel(token)}</td>
                      <td className="py-2.5 pr-3 font-mono">
                        {raised != null && goal != null
                          ? `${formatCampaignAmountLabel(raised, token)} / ${formatCampaignAmountLabel(goal, token)}`
                          : "—"}
                      </td>
                      <td className="py-2.5 pr-3 font-mono">
                        {bps != null ? `${bps.toFixed(1)}%` : "—"}
                      </td>
                      <td className="py-2.5 pr-3 font-mono">
                        {row.escrow != null
                          ? formatCampaignAmountLabel(row.escrow, token)
                          : "—"}
                      </td>
                      <td className="py-2.5 pr-3">{row.donors?.length ?? "—"}</td>
                      <td className="py-2.5 pr-3 font-mono">
                        {row.deposited != null
                          ? formatCampaignAmountLabel(row.deposited, token)
                          : "—"}
                      </td>
                      <td className="py-2.5 pr-3 font-mono">
                        {row.invested != null
                          ? formatCampaignAmountLabel(row.invested, token)
                          : "—"}
                      </td>
                      <td className="py-2.5 pr-3 font-mono">
                        {row.position ? (
                          <span title={`shares=${row.position.shares}`}>
                            {row.position.enabled ? "on" : "off"} · prin{" "}
                            {formatUnits(row.position.principal, token === 1 ? 6 : 18)}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-2.5 pr-3 font-mono">
                        {row.proposals?.map(String).join(", ") || "—"}
                      </td>
                      <td className="py-2.5 pr-3 font-mono">
                        {row.nfts?.map(String).join(", ") || "—"}
                      </td>
                      <td className="py-2.5">
                        {row.c?.orgAddress ? (
                          <AddressLink address={row.c.orgAddress} />
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassPanel>

      <GlassPanel className="p-5">
        <h2 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
          Contract directory · {EXPLORER_NAME}
        </h2>
        <p className="mb-4 text-xs text-slate-600 dark:text-white/50">
          Every deployed address with Code + Read Contract links. Open Read Contract to call the
          same view functions listed below.
        </p>
        <div className="space-y-5">
          {VIEW_CATALOG.map((entry) => {
            const addr = ADDRESSES[entry.key];
            if (!isContractConfigured(addr)) return null;
            return (
              <div
                key={entry.key}
                className="rounded-xl border border-slate-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.03]"
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{entry.label}</p>
                    <p className="mt-0.5 break-all font-mono text-[11px] text-slate-500 dark:text-white/45">
                      {addr}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <a
                      href={addressExplorerUrl(addr)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-700 hover:underline dark:text-holo-mint"
                    >
                      Address ↗
                    </a>
                    <a
                      href={contractCodeUrl(addr)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-700 hover:underline dark:text-holo-mint"
                    >
                      Code ↗
                    </a>
                    <a
                      href={contractReadUrl(addr)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-teal-700 hover:underline dark:text-holo-mint"
                    >
                      Read Contract ↗
                    </a>
                  </div>
                </div>
                <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                  {entry.views.map((v) => (
                    <li
                      key={v.name}
                      className="font-mono text-[11px] text-slate-600 dark:text-white/60"
                    >
                      · {v.name}
                      {v.note && (
                        <span className="ml-1 text-amber-700 dark:text-amber-300/80">
                          ({v.note})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <div className="rounded-xl border border-slate-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Circle USDC</p>
                <p className="mt-0.5 break-all font-mono text-[11px] text-slate-500 dark:text-white/45">
                  {NETWORK.defaultUsdc}
                </p>
              </div>
              <ContractLink address={NETWORK.defaultUsdc} name={`USDC on ${EXPLORER_NAME}`} />
            </div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
