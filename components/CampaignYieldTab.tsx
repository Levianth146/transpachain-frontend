"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits } from "viem";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MockYieldBadge } from "@/components/MockYieldBadge";
import { TxLink } from "@/components/TxLink";
import {
  ADDRESSES,
  YIELD_MANAGER_ABI,
  DONATION_VAULT_ABI,
  MOCK_ERC4626_ABI,
  isContractConfigured,
} from "@/lib/contracts";
import { ERC20_ABI, USDC_ADDRESS } from "@/lib/erc20";
import { gasWithBuffer } from "@/lib/contractWrite";
import { formatCampaignAmountLabel } from "@/lib/format";

export function CampaignYieldTab({
  campaignId,
  paymentToken,
  orgAddress,
}: {
  campaignId: bigint;
  paymentToken: number;
  orgAddress?: string;
}) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const ymReady = isContractConfigured(ADDRESSES.yieldManager);
  const mockReady = isContractConfigured(ADDRESSES.mockErc4626Vault);
  const usdcOnly = paymentToken === 1;

  const [allocateInput, setAllocateInput] = useState("");
  const [simulateInput, setSimulateInput] = useState("1");
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingLabel, setPendingLabel] = useState<string | null>(null);

  const { writeContractAsync, data: txHash, reset: resetWrite } = useWriteContract();
  const { isLoading: txPending, isSuccess: txSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const { data: position, refetch: refetchPosition } = useReadContract({
    address: ADDRESSES.yieldManager,
    abi: YIELD_MANAGER_ABI,
    functionName: "getPosition",
    args: [campaignId],
    query: { enabled: ymReady && usdcOnly },
  });

  const { data: positionValue, refetch: refetchValue } = useReadContract({
    address: ADDRESSES.yieldManager,
    abi: YIELD_MANAGER_ABI,
    functionName: "positionValue",
    args: [campaignId],
    query: { enabled: ymReady && usdcOnly },
  });

  const { data: investable, refetch: refetchInvestable } = useReadContract({
    address: ADDRESSES.yieldManager,
    abi: YIELD_MANAGER_ABI,
    functionName: "previewInvestable",
    args: [campaignId],
    query: { enabled: ymReady && usdcOnly },
  });

  const { data: invested, refetch: refetchInvested } = useReadContract({
    address: ADDRESSES.donationVault,
    abi: DONATION_VAULT_ABI,
    functionName: "getInvestedBalance",
    args: [campaignId],
    query: { enabled: ymReady && usdcOnly },
  });

  const { data: ymOwner } = useReadContract({
    address: ADDRESSES.yieldManager,
    abi: YIELD_MANAGER_ABI,
    functionName: "owner",
    query: { enabled: ymReady },
  });

  const { data: isOperator } = useReadContract({
    address: ADDRESSES.yieldManager,
    abi: YIELD_MANAGER_ABI,
    functionName: "operators",
    args: address ? [address] : undefined,
    query: { enabled: ymReady && !!address },
  });

  const { data: mockOwner } = useReadContract({
    address: ADDRESSES.mockErc4626Vault,
    abi: MOCK_ERC4626_ABI,
    functionName: "owner",
    query: { enabled: mockReady },
  });

  const pos = position as
    | { shares?: bigint; principal?: bigint; realizedPnl?: bigint; enabled?: boolean }
    | undefined;

  const isOrg =
    !!address &&
    !!orgAddress &&
    address.toLowerCase() === orgAddress.toLowerCase();
  const isYmOwner =
    !!address &&
    !!ymOwner &&
    address.toLowerCase() === (ymOwner as string).toLowerCase();
  const canEnable = isOrg || isYmOwner;
  const canAllocate = isYmOwner || !!isOperator;
  const canSimulate =
    !!address &&
    !!mockOwner &&
    address.toLowerCase() === (mockOwner as string).toLowerCase();

  const investableBi = (investable as bigint | undefined) ?? 0n;

  useEffect(() => {
    if (!txSuccess) return;
    setPendingLabel(null);
    setActionError(null);
    void refetchPosition();
    void refetchValue();
    void refetchInvestable();
    void refetchInvested();
    resetWrite();
  }, [
    txSuccess,
    refetchPosition,
    refetchValue,
    refetchInvestable,
    refetchInvested,
    resetWrite,
  ]);

  const fmt = (v: bigint | undefined) => {
    if (v === undefined) return "—";
    return formatCampaignAmountLabel(v, paymentToken);
  };

  async function runTx(label: string, fn: () => Promise<`0x${string}`>) {
    setActionError(null);
    setPendingLabel(label);
    try {
      await fn();
    } catch (err) {
      setPendingLabel(null);
      setActionError(err instanceof Error ? err.message : String(err));
    }
  }

  const onEnable = (on: boolean) =>
    runTx(on ? "Enable yield" : "Disable yield", async () => {
      const gas = await gasWithBuffer(
        publicClient,
        {
          address: ADDRESSES.yieldManager,
          abi: YIELD_MANAGER_ABI,
          functionName: "setYieldEnabled",
          args: [campaignId, on],
          account: address,
        },
        200_000n
      );
      return writeContractAsync({
        address: ADDRESSES.yieldManager,
        abi: YIELD_MANAGER_ABI,
        functionName: "setYieldEnabled",
        args: [campaignId, on],
        gas,
      });
    });

  const onAllocate = () =>
    runTx("Allocate", async () => {
      let assets: bigint;
      if (allocateInput.trim()) {
        assets = parseUnits(allocateInput.trim(), 6);
      } else {
        assets = investableBi;
      }
      if (assets <= 0n) throw new Error("Nothing investable — enable yield and fund the campaign first");
      if (assets > investableBi) throw new Error("Amount exceeds previewInvestable");
      const gas = await gasWithBuffer(
        publicClient,
        {
          address: ADDRESSES.yieldManager,
          abi: YIELD_MANAGER_ABI,
          functionName: "allocate",
          args: [campaignId, assets, 0n],
          account: address,
        },
        500_000n
      );
      return writeContractAsync({
        address: ADDRESSES.yieldManager,
        abi: YIELD_MANAGER_ABI,
        functionName: "allocate",
        args: [campaignId, assets, 0n],
        gas,
      });
    });

  const onSimulate = () =>
    runTx("Simulate yield", async () => {
      const assets = parseUnits(simulateInput.trim() || "0", 6);
      if (assets <= 0n) throw new Error("Enter USDC amount to transfer into the mock vault");
      if (!publicClient || !address) throw new Error("Wallet / RPC not ready");

      const allowanceGas = await gasWithBuffer(
        publicClient,
        {
          address: USDC_ADDRESS,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [ADDRESSES.mockErc4626Vault, assets],
          account: address,
        },
        80_000n
      );
      const approveHash = await writeContractAsync({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [ADDRESSES.mockErc4626Vault, assets],
        gas: allowanceGas,
      });
      await publicClient.waitForTransactionReceipt({ hash: approveHash });

      const gas = await gasWithBuffer(
        publicClient,
        {
          address: ADDRESSES.mockErc4626Vault,
          abi: MOCK_ERC4626_ABI,
          functionName: "simulateYield",
          args: [assets],
          account: address,
        },
        200_000n
      );
      return writeContractAsync({
        address: ADDRESSES.mockErc4626Vault,
        abi: MOCK_ERC4626_ABI,
        functionName: "simulateYield",
        args: [assets],
        gas,
      });
    });

  const onSettle = () =>
    runTx("Settle yield for refund", async () => {
      const gas = await gasWithBuffer(
        publicClient,
        {
          address: ADDRESSES.donationVault,
          abi: DONATION_VAULT_ABI,
          functionName: "settleYieldForRefund",
          args: [campaignId],
          account: address,
        },
        600_000n
      );
      return writeContractAsync({
        address: ADDRESSES.donationVault,
        abi: DONATION_VAULT_ABI,
        functionName: "settleYieldForRefund",
        args: [campaignId],
        gas,
      });
    });

  const busy = txPending || !!pendingLabel;

  const roleHint = useMemo(() => {
    const parts: string[] = [];
    if (canEnable) parts.push("can Enable");
    if (canAllocate) parts.push("can Allocate");
    if (canSimulate) parts.push("can Simulate");
    parts.push("anyone can Settle");
    return parts.join(" · ");
  }, [canEnable, canAllocate, canSimulate]);

  if (!usdcOnly) {
    return (
      <GlassPanel className="p-5">
        <div className="mb-2 flex items-center gap-2">
          <h3 className="font-semibold text-white">Yield</h3>
          <MockYieldBadge />
        </div>
        <p className="text-sm text-white/60">
          Yield is USDC-only and disabled for AVAX campaigns.
        </p>
      </GlassPanel>
    );
  }

  if (!ymReady) {
    return (
      <GlassPanel className="p-5">
        <div className="mb-2 flex items-center gap-2">
          <h3 className="font-semibold text-white">Yield</h3>
          <MockYieldBadge />
        </div>
        <p className="text-sm text-white/60">
          YieldManager not configured. Set{" "}
          <code className="text-xs text-holo-mint">NEXT_PUBLIC_YIELD_MANAGER_ADDRESS</code> after V2
          deploy. No mock APY figures are shown.
        </p>
      </GlassPanel>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-semibold text-white">Yield position</h3>
        <MockYieldBadge />
      </div>
      <p className="text-xs text-white/50">
        Mock ERC-4626 on Fuji — figures are on-chain reads only, not marketed APY. Connected wallet:{" "}
        {roleHint}.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Metric label="Enabled" value={pos?.enabled ? "Yes" : "No"} />
        <Metric label="Principal (cost basis)" value={fmt(pos?.principal)} badge />
        <Metric label="Shares" value={pos?.shares != null ? String(pos.shares) : "—"} badge />
        <Metric label="Position value" value={fmt(positionValue as bigint | undefined)} badge />
        <Metric label="Vault invested bucket" value={fmt(invested as bigint | undefined)} badge />
        <Metric label="Preview investable" value={fmt(investable as bigint | undefined)} badge />
        <Metric
          label="Realized P&L"
          value={
            pos?.realizedPnl != null
              ? formatCampaignAmountLabel(
                  pos.realizedPnl < 0n ? -pos.realizedPnl : pos.realizedPnl,
                  paymentToken
                ) + (pos.realizedPnl < 0n ? " (loss)" : "")
              : "—"
          }
          badge
        />
      </div>

      <GlassPanel className="space-y-4 p-5">
        <h4 className="font-medium text-white">Actions</h4>

        <div className="flex flex-wrap gap-2">
          <ActionButton
            disabled={busy || !canEnable || !!pos?.enabled}
            onClick={() => onEnable(true)}
            label="Enable"
          />
          <ActionButton
            disabled={busy || !canEnable || !pos?.enabled}
            onClick={() => onEnable(false)}
            label="Disable"
            tone="muted"
          />
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1 text-xs text-white/50">
            Allocate amount (USDC)
            <input
              type="text"
              inputMode="decimal"
              placeholder={investableBi > 0n ? fmt(investableBi) : "0"}
              value={allocateInput}
              onChange={(e) => setAllocateInput(e.target.value)}
              className="w-40 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
            />
          </label>
          <ActionButton
            disabled={busy || !canAllocate || !pos?.enabled || investableBi === 0n}
            onClick={onAllocate}
            label={allocateInput.trim() ? "Allocate" : "Allocate max"}
          />
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1 text-xs text-white/50">
            Simulate yield (USDC from your wallet)
            <input
              type="text"
              inputMode="decimal"
              value={simulateInput}
              onChange={(e) => setSimulateInput(e.target.value)}
              className="w-40 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
            />
          </label>
          <ActionButton
            disabled={busy || !canSimulate || !mockReady}
            onClick={onSimulate}
            label="Simulate yield"
          />
        </div>

        <div>
          <ActionButton
            disabled={busy || !address}
            onClick={onSettle}
            label="Settle (for refund)"
            tone="warn"
          />
          <p className="mt-2 text-xs text-white/40">
            Permissionless. Required before refunds when the campaign has yield shares
            (Failed/Cancelled).
          </p>
        </div>

        {pendingLabel && (
          <p className="text-sm text-holo-mint">
            {txPending ? `Confirming: ${pendingLabel}…` : `Submitted: ${pendingLabel}…`}
          </p>
        )}
        {txHash && (
          <p className="text-sm text-white/60">
            Tx: <TxLink hash={txHash} />
          </p>
        )}
        {actionError && <p className="text-sm text-rose-400 break-all">{actionError}</p>}
      </GlassPanel>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled,
  tone = "primary",
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "primary" | "muted" | "warn";
}) {
  const cls =
    tone === "warn"
      ? "border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20"
      : tone === "muted"
        ? "border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
        : "border-holo-mint/40 bg-holo-mint/10 text-holo-mint hover:bg-holo-mint/20";
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 ${cls}`}
    >
      {label}
    </button>
  );
}

function Metric({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: boolean;
}) {
  return (
    <GlassPanel className="p-4">
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <p className="text-xs text-white/50">{label}</p>
        {badge && <MockYieldBadge />}
      </div>
      <p className="text-lg font-semibold text-white">{value}</p>
    </GlassPanel>
  );
}
