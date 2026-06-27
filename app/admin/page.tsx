"use client";
import React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { ADDRESSES, CHARITY_CORE_ABI } from "@/lib/contracts";
import { keccak256, toBytes } from "viem";
import {
  Shield, UserCheck, UserX, AlertCircle,
  Users, ShieldCheck, RefreshCw, Copy,
  CheckCircle, ChevronDown, ChevronUp, BadgeCheck,
} from "lucide-react";
import { addToast } from "@/components/Toast";
import { AdminOrgProfiles } from "@/components/AdminOrgProfiles";
import { AdminPendingPanel } from "@/components/AdminPendingPanel";
import { api } from "@/lib/api";
import { useSocketEvents } from "@/hooks/useSocket";
import { motion, AnimatePresence } from "framer-motion";
import { PageShell } from "@/components/PageShell";
import { AnimatedGradientBackground } from "@/components/ui/AnimatedGradientBackground";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MotionCard } from "@/components/ui/MotionCard";

const ORG_ROLE      = keccak256(toBytes("ORG_ROLE"));
const ADMIN_ROLE    = keccak256(toBytes("ADMIN_ROLE"));
const VERIFIER_ROLE = keccak256(toBytes("VERIFIER_ROLE"));
const DEFAULT_ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as const;

function truncate(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return { copied, copy };
}

function OrgRow({
  address,
  onRevoke,
  isRevoking,
}: {
  address: string;
  onRevoke: (addr: string) => void;
  isRevoking: boolean;
}) {
  const { copied, copy } = useCopy();

  const { data: campaigns } = useReadContract({
    address:      ADDRESSES.charityCore,
    abi:          CHARITY_CORE_ABI,
    functionName: "getCampaignsByOrg",
    args:         [address as `0x${string}`],
  });
  const campaignCount = (campaigns as bigint[] | undefined)?.length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between py-3 px-4 rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-sm hover:border-teal-400/40 transition-colors group dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-holo-mint/30"
    >
      <div className="flex items-center gap-3 min-w-0">
        <BadgeCheck size={16} className="text-holo-mint shrink-0" />
        <div className="min-w-0">
          <p className="font-mono text-sm text-slate-800 dark:text-white/90 truncate">{address}</p>
          <p className="text-xs text-slate-500 dark:text-white/50 mt-0.5">{campaignCount} campaign{campaignCount !== 1 ? "s" : ""}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        <button
          onClick={() => copy(address)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-white/10 text-white/50"
          title="Copy address"
        >
          {copied ? <CheckCircle size={13} className="text-holo-mint" /> : <Copy size={13} />}
        </button>
        <button
          onClick={() => onRevoke(address)}
          disabled={isRevoking}
          className="text-xs px-2.5 py-1 rounded-md bg-red-500/15 text-red-300 border border-red-500/30
                     hover:bg-red-500/25 disabled:opacity-40 transition-colors font-medium"
        >
          Revoke
        </button>
      </div>
    </motion.div>
  );
}

function Section({
  icon: Icon,
  title,
  iconClass = "text-emerald-600",
  children,
  collapsible = false,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  iconClass?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  delay?: number;
}) {
  const [open, setOpen] = useState(true);
  return (
    <GlassPanel delay={delay} hover={false} className="overflow-hidden">
      <button
        type="button"
        className={`w-full flex items-center justify-between px-6 py-4 ${collapsible ? "cursor-pointer hover:bg-white/30 dark:hover:bg-white/5" : "cursor-default"}`}
        onClick={() => collapsible && setOpen((o) => !o)}
      >
        <h2 className="font-semibold text-base flex items-center gap-2">
          <Icon size={18} className={iconClass} />
          {title}
        </h2>
        {collapsible && (
          open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassPanel>
  );
}

const STAT_GRADIENTS = [
  "from-holo-silver/15 to-holo-lavender/10",
  "from-holo-mint/20 to-holo-lavender/10",
  "from-holo-lavender/20 to-holo-pink/10",
];

export default function AdminPage() {
  const { address, isConnected } = useAccount();

  const [mounted, setMounted]           = useState(false);
  const [orgAddress, setOrgAddress]     = useState("");
  const [verifierAddr, setVerifierAddr] = useState("");
  const [verifiedOrgs, setVerifiedOrgs] = useState<string[]>([]);
  const [orgsLoading, setOrgsLoading]   = useState(false);
  const [indexedCampaigns, setIndexedCampaigns] = useState<number | null>(null);
  const [lastRevokedAddress, setLastRevokedAddress] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  const { data: isAdminRole } = useReadContract({
    address:      ADDRESSES.charityCore,
    abi:          CHARITY_CORE_ABI,
    functionName: "hasRole",
    args:         address ? [ADMIN_ROLE, address] : undefined,
    query:        { enabled: !!address },
  });

  const { data: isDefaultAdminRole } = useReadContract({
    address:      ADDRESSES.charityCore,
    abi:          CHARITY_CORE_ABI,
    functionName: "hasRole",
    args:         address ? [DEFAULT_ADMIN_ROLE, address] : undefined,
    query:        { enabled: !!address },
  });

  const { data: isVerifier } = useReadContract({
    address:      ADDRESSES.charityCore,
    abi:          CHARITY_CORE_ABI,
    functionName: "hasRole",
    args:         address ? [VERIFIER_ROLE, address] : undefined,
    query:        { enabled: !!address },
  });

  const isAdmin = Boolean(isAdminRole || isDefaultAdminRole);

  const validOrg = orgAddress.startsWith("0x") && orgAddress.length === 42;
  const { data: isOrgVerified, refetch: refetchOrgStatus } = useReadContract({
    address:      ADDRESSES.charityCore,
    abi:          CHARITY_CORE_ABI,
    functionName: "isOrgVerified",
    args:         validOrg ? [orgAddress as `0x${string}`] : undefined,
    query:        { enabled: validOrg },
  });

  const validVerifier = verifierAddr.startsWith("0x") && verifierAddr.length === 42;
  const { data: isVerifierRole, refetch: refetchVerifierStatus } = useReadContract({
    address:      ADDRESSES.charityCore,
    abi:          CHARITY_CORE_ABI,
    functionName: "hasRole",
    args:         validVerifier ? [VERIFIER_ROLE, verifierAddr as `0x${string}`] : undefined,
    query:        { enabled: validVerifier },
  });

  const { data: totalCampaigns } = useReadContract({
    address:      ADDRESSES.charityCore,
    abi:          CHARITY_CORE_ABI,
    functionName: "totalCampaigns",
  });

  const { writeContract: writeVerify,         data: verifyHash,         isPending: isVerifyPending }         = useWriteContract();
  const { isSuccess: verifySuccess,           isLoading: isVerifyConfirming }                                = useWaitForTransactionReceipt({ hash: verifyHash });

  const { writeContract: writeRevoke,         data: revokeHash,         isPending: isRevokePending }         = useWriteContract();
  const { isSuccess: revokeSuccess,           isLoading: isRevokeConfirming }                                = useWaitForTransactionReceipt({ hash: revokeHash });

  const { writeContract: writeGrantVerifier,  data: grantVerifierHash,  isPending: isGrantVerifierPending }  = useWriteContract();
  const { isSuccess: grantVerifierSuccess,    isLoading: isGrantVerifierConfirming }                         = useWaitForTransactionReceipt({ hash: grantVerifierHash });

  const { writeContract: writeRevokeVerifier, data: revokeVerifierHash, isPending: isRevokeVerifierPending } = useWriteContract();
  const { isSuccess: revokeVerifierSuccess,   isLoading: isRevokeVerifierConfirming }                        = useWaitForTransactionReceipt({ hash: revokeVerifierHash });

  const fetchVerifiedOrgs = useCallback(async () => {
    setOrgsLoading(true);
    try {
      const data = await api.getVerifiedOrgs();
      setVerifiedOrgs(data.orgs.map((o) => o.address));
    } catch (e) {
      console.error("fetchVerifiedOrgs:", e);
      addToast({ type: "error", title: "Failed to load orgs", message: "Backend unavailable" });
    } finally {
      setOrgsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mounted && (isAdmin || isVerifier)) fetchVerifiedOrgs();
  }, [mounted, isAdmin, isVerifier, fetchVerifiedOrgs]);

  useSocketEvents({
    orgVerified: () => fetchVerifiedOrgs(),
  });

  useEffect(() => {
    if (!mounted || (!isAdmin && !isVerifier)) return;
    api.getStats()
      .then((s) => setIndexedCampaigns(typeof s.totalCampaigns === "number" ? s.totalCampaigns : null))
      .catch(() => setIndexedCampaigns(null));
  }, [mounted, isAdmin, isVerifier]);

  useEffect(() => {
    if (verifySuccess) {
      addToast({ type: "success", title: "Org verified!", message: truncate(orgAddress) });
      refetchOrgStatus();
      setTimeout(fetchVerifiedOrgs, 3000);
    }
  }, [verifySuccess]);

  useEffect(() => {
    if (revokeSuccess) {
      addToast({
        type: "info",
        title: "Org revoked",
        message: truncate(lastRevokedAddress ?? orgAddress),
      });
      refetchOrgStatus();
      setTimeout(fetchVerifiedOrgs, 1500);
    }
  }, [revokeSuccess, lastRevokedAddress, orgAddress, fetchVerifiedOrgs, refetchOrgStatus]);

  useEffect(() => {
    if (grantVerifierSuccess) {
      addToast({ type: "success", title: "Verifier role granted!", message: truncate(verifierAddr) });
      refetchVerifierStatus();
    }
  }, [grantVerifierSuccess]);

  useEffect(() => {
    if (revokeVerifierSuccess) {
      addToast({ type: "info", title: "Verifier role revoked", message: truncate(verifierAddr) });
      refetchVerifierStatus();
    }
  }, [revokeVerifierSuccess]);

  const handleQuickRevoke = (addr: string) => {
    setLastRevokedAddress(addr);
    writeRevoke({
      address:      ADDRESSES.charityCore,
      abi:          CHARITY_CORE_ABI,
      functionName: "revokeOrg",
      args:         [addr as `0x${string}`],
      gas:          200000n,
    });
  };

  if (!mounted) return null;

  if (!isConnected) return (
    <AnimatedGradientBackground className="min-h-screen flex flex-col items-center justify-center">
      <Shield size={48} className="text-slate-400 dark:text-gray-300 mb-4" />
      <h1 className="text-3xl font-display mb-2 text-slate-900 dark:text-white">Admin Panel</h1>
      <p className="text-slate-600 dark:text-gray-500">Connect wallet to access admin panel.</p>
    </AnimatedGradientBackground>
  );

  if (!isAdmin && !isVerifier) return (
    <AnimatedGradientBackground className="min-h-screen flex flex-col items-center justify-center">
      <AlertCircle size={48} className="text-red-400 dark:text-red-300 mb-4" />
      <h1 className="text-3xl font-display mb-2 text-slate-900 dark:text-white">Access Denied</h1>
      <p className="text-slate-600 dark:text-gray-500">You don&apos;t have admin or verifier role.</p>
      <p className="text-xs text-slate-400 dark:text-gray-400 mt-2 font-mono">{address}</p>
    </AnimatedGradientBackground>
  );

  const isOrgWriting      = isVerifyPending || isVerifyConfirming || isRevokePending || isRevokeConfirming;
  const isVerifierWriting = isGrantVerifierPending || isGrantVerifierConfirming || isRevokeVerifierPending || isRevokeVerifierConfirming;

  const onChainCampaigns = totalCampaigns != null ? Number(totalCampaigns) : null;
  const campaignsMismatch =
    onChainCampaigns != null &&
    indexedCampaigns != null &&
    onChainCampaigns !== indexedCampaigns;
  const campaignStatValue =
    onChainCampaigns == null
      ? "—"
      : campaignsMismatch
        ? `${onChainCampaigns} on-chain · ${indexedCampaigns} indexed`
        : String(onChainCampaigns);

  const stats = [
    { label: "Total Campaigns", value: campaignStatValue, color: campaignsMismatch ? "text-amber-600 dark:text-amber-300" : "text-slate-900 dark:text-white", warn: campaignsMismatch },
    { label: "Verified Orgs", value: verifiedOrgs.length.toString(), color: "text-holo-mint", warn: false },
    { label: "Your Role", value: isAdmin ? "Admin" : "Verifier", color: "text-holo-lavender", warn: false },
  ];

  return (
    <PageShell
      eyebrow="Administration"
      title="Admin Panel"
      description={
        <span className="font-mono text-sm text-slate-500 dark:text-white/50">{address ? truncate(address) : ""}</span>
      }
      maxWidth="3xl"
      actions={
        <div className="flex gap-2">
          {isAdmin    && <span className="rounded-full border border-holo-lavender/30 bg-holo-lavender/10 px-2.5 py-1 text-xs font-medium text-holo-lavender">ADMIN</span>}
          {isVerifier && <span className="rounded-full border border-holo-mint/30 bg-holo-mint/10 px-2.5 py-1 text-xs font-medium text-holo-mint">VERIFIER</span>}
        </div>
      }
    >
    <div className="space-y-6">

      <AdminPendingPanel />

      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, color, warn }, i) => (
          <MotionCard key={label} index={i}>
            <GlassPanel hover={false} holoBorder className={`bg-gradient-to-br ${STAT_GRADIENTS[i]} p-4 text-center`}>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-white/50 flex items-center justify-center gap-1">
                {warn && <AlertCircle size={12} className="text-amber-400 shrink-0" />}
                {label}
              </p>
              {warn && (
                <p className="mt-1 text-[10px] text-amber-400/90">Indexer behind — restart backend or wait for backfill</p>
              )}
            </GlassPanel>
          </MotionCard>
        ))}
      </div>

      <Section icon={UserCheck} title="Verifier workflow — verify organization" delay={0.1}>
        <ol className="text-xs text-slate-500 dark:text-white/50 mb-4 space-y-1 list-decimal list-inside">
          <li>Review off-chain application below</li>
          <li>Paste org wallet address and check verification status</li>
          <li>Click Verify Org to grant ORG_ROLE on-chain</li>
        </ol>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-white/80 mb-1">Organization wallet address</label>
            <input
              type="text"
              value={orgAddress}
              onChange={e => setOrgAddress(e.target.value)}
              placeholder="0x..."
              className="input-glass font-mono"
            />
          </div>
          {orgAddress.length === 42 && (
            <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border ${
              isOrgVerified
                ? "bg-holo-mint/10 text-holo-mint border-holo-mint/30"
                : "bg-white/[0.03] text-white/60 border-white/10"
            }`}>
              {isOrgVerified ? <><UserCheck size={14} /> Verified organization</> : <><UserX size={14} /> Not verified</>}
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => writeVerify({ address: ADDRESSES.charityCore, abi: CHARITY_CORE_ABI, functionName: "verifyOrg", args: [orgAddress as `0x${string}`], gas: 200000n })}
              disabled={!orgAddress || isOrgWriting || Boolean(isOrgVerified)}
              className="flex-1 py-2 bg-holo-gradient text-black rounded-lg text-sm font-semibold disabled:opacity-50 hover:opacity-90 flex items-center justify-center gap-1.5 transition-opacity"
            >
              <UserCheck size={14} />
              {isVerifyPending || isVerifyConfirming ? "Verifying…" : "Verify org"}
            </button>
            <button
              onClick={() => {
                setLastRevokedAddress(orgAddress);
                writeRevoke({ address: ADDRESSES.charityCore, abi: CHARITY_CORE_ABI, functionName: "revokeOrg", args: [orgAddress as `0x${string}`], gas: 200000n });
              }}
              disabled={!orgAddress || isOrgWriting || !isOrgVerified}
              className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-red-600 flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserX size={14} />
              {isRevokePending || isRevokeConfirming ? "Revoking…" : "Revoke org"}
            </button>
          </div>
        </div>
      </Section>

      <Section icon={Users} title="Organization applications (off-chain)" collapsible delay={0.15}>
        <AdminOrgProfiles />
        <p className="text-xs text-gray-400 mt-3">
          Approve profile here, then use Verify Org above to grant ORG_ROLE on-chain.
        </p>
      </Section>

      <Section icon={Users} title={`Verified organizations (${verifiedOrgs.length})`} collapsible delay={0.2}>
        <div className="space-y-2">
          {orgsLoading ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <RefreshCw size={20} className="animate-spin mb-2" />
              <p className="text-sm">Loading from backend…</p>
            </div>
          ) : verifiedOrgs.length === 0 ? (
            <div className="text-center py-10">
              <Users size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">No verified organizations yet.</p>
              <p className="text-xs text-gray-400 mt-1">Verify your first org using the workflow above.</p>
            </div>
          ) : (
            verifiedOrgs.map((org) => (
              <OrgRow key={org} address={org} onRevoke={handleQuickRevoke} isRevoking={isRevokePending || isRevokeConfirming} />
            ))
          )}
          {!orgsLoading && (
            <button
              type="button"
              onClick={fetchVerifiedOrgs}
              className="w-full mt-2 py-2 text-xs text-white/50 hover:text-holo-mint flex items-center justify-center gap-1.5 hover:bg-white/[0.04] rounded-lg transition-colors"
            >
              <RefreshCw size={12} /> Refresh list
            </button>
          )}
        </div>
      </Section>

      {isAdmin && (
        <Section icon={ShieldCheck} title="Manage verifier role" iconClass="text-purple-600" delay={0.25}>
          <p className="text-xs text-gray-500 mb-4">
            Grant or revoke <code className="bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded font-mono">VERIFIER_ROLE</code> — verifiers can verify/revoke organizations.
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Wallet address</label>
              <input
                type="text"
                value={verifierAddr}
                onChange={e => setVerifierAddr(e.target.value)}
                placeholder="0x..."
                className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-ink-900 dark:border-zinc-700"
              />
            </div>
            {verifierAddr.length === 42 && (
              <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
                isVerifierRole ? "bg-purple-50 text-purple-700 border border-purple-100" : "bg-gray-50 text-gray-600 border border-gray-100"
              }`}>
                {isVerifierRole ? <><ShieldCheck size={14} /> Has VERIFIER_ROLE</> : <><AlertCircle size={14} /> No verifier role</>}
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => writeGrantVerifier({ address: ADDRESSES.charityCore, abi: CHARITY_CORE_ABI, functionName: "grantRole", args: [VERIFIER_ROLE, verifierAddr as `0x${string}`] })}
                disabled={!verifierAddr || isVerifierWriting || Boolean(isVerifierRole)}
                className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-purple-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck size={14} />
                {isGrantVerifierPending || isGrantVerifierConfirming ? "Granting…" : "Grant verifier"}
              </button>
              <button
                onClick={() => writeRevokeVerifier({ address: ADDRESSES.charityCore, abi: CHARITY_CORE_ABI, functionName: "revokeRole", args: [VERIFIER_ROLE, verifierAddr as `0x${string}`] })}
                disabled={!verifierAddr || isVerifierWriting || !isVerifierRole}
                className="flex-1 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-800 flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserX size={14} />
                {isRevokeVerifierPending || isRevokeVerifierConfirming ? "Revoking…" : "Revoke verifier"}
              </button>
            </div>
          </div>
        </Section>
      )}

    </div>
    </PageShell>
  );
}
