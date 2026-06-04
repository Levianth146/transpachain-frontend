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
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

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
      className="flex items-center justify-between py-3 px-4 rounded-lg bg-emerald-50/60 border border-emerald-100 hover:bg-emerald-50 transition-colors group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <BadgeCheck size={16} className="text-emerald-500 shrink-0" />
        <div className="min-w-0">
          <p className="font-mono text-sm text-gray-800 truncate">{address}</p>
          <p className="text-xs text-gray-400 mt-0.5">{campaignCount} campaign{campaignCount !== 1 ? "s" : ""}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        <button
          onClick={() => copy(address)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-emerald-100 text-gray-400"
          title="Copy address"
        >
          {copied ? <CheckCircle size={13} className="text-emerald-500" /> : <Copy size={13} />}
        </button>
        <button
          onClick={() => onRevoke(address)}
          disabled={isRevoking}
          className="text-xs px-2.5 py-1 rounded-md bg-red-50 text-red-600 border border-red-100
                     hover:bg-red-100 disabled:opacity-40 transition-colors font-medium"
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
}: {
  icon: React.ElementType;
  title: string;
  iconClass?: string;
  children: React.ReactNode;
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <button
        className={`w-full flex items-center justify-between px-6 py-4 ${collapsible ? "cursor-pointer hover:bg-gray-50" : "cursor-default"}`}
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
    </div>
  );
}

export default function AdminPage() {
  const { address, isConnected } = useAccount();

  const [mounted, setMounted]           = useState(false);
  const [orgAddress, setOrgAddress]     = useState("");
  const [verifierAddr, setVerifierAddr] = useState("");
  const [verifiedOrgs, setVerifiedOrgs] = useState<string[]>([]);
  const [orgsLoading, setOrgsLoading]   = useState(false);

  useEffect(() => setMounted(true), []);

  // ── Role checks ──────────────────────────────────────────────
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

  // ── Target org status ────────────────────────────────────────
  const validOrg = orgAddress.startsWith("0x") && orgAddress.length === 42;
  const { data: isOrgVerified, refetch: refetchOrgStatus } = useReadContract({
    address:      ADDRESSES.charityCore,
    abi:          CHARITY_CORE_ABI,
    functionName: "isOrgVerified",
    args:         validOrg ? [orgAddress as `0x${string}`] : undefined,
    query:        { enabled: validOrg },
  });

  // ── Target verifier status ───────────────────────────────────
  const validVerifier = verifierAddr.startsWith("0x") && verifierAddr.length === 42;
  const { data: isVerifierRole, refetch: refetchVerifierStatus } = useReadContract({
    address:      ADDRESSES.charityCore,
    abi:          CHARITY_CORE_ABI,
    functionName: "hasRole",
    args:         validVerifier ? [VERIFIER_ROLE, verifierAddr as `0x${string}`] : undefined,
    query:        { enabled: validVerifier },
  });

  // ── Stats ────────────────────────────────────────────────────
  const { data: totalCampaigns } = useReadContract({
    address:      ADDRESSES.charityCore,
    abi:          CHARITY_CORE_ABI,
    functionName: "totalCampaigns",
  });

  // ── Write contracts ──────────────────────────────────────────
  const { writeContract: writeVerify,         data: verifyHash,         isPending: isVerifyPending }         = useWriteContract();
  const { isSuccess: verifySuccess,           isLoading: isVerifyConfirming }                                = useWaitForTransactionReceipt({ hash: verifyHash });

  const { writeContract: writeRevoke,         data: revokeHash,         isPending: isRevokePending }         = useWriteContract();
  const { isSuccess: revokeSuccess,           isLoading: isRevokeConfirming }                                = useWaitForTransactionReceipt({ hash: revokeHash });

  const { writeContract: writeGrantVerifier,  data: grantVerifierHash,  isPending: isGrantVerifierPending }  = useWriteContract();
  const { isSuccess: grantVerifierSuccess,    isLoading: isGrantVerifierConfirming }                         = useWaitForTransactionReceipt({ hash: grantVerifierHash });

  const { writeContract: writeRevokeVerifier, data: revokeVerifierHash, isPending: isRevokeVerifierPending } = useWriteContract();
  const { isSuccess: revokeVerifierSuccess,   isLoading: isRevokeVerifierConfirming }                        = useWaitForTransactionReceipt({ hash: revokeVerifierHash });

  // ── Fetch verified orgs from BACKEND (not getLogs) ───────────
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

  // ── Toast effects ────────────────────────────────────────────
  useEffect(() => {
    if (verifySuccess) {
      addToast({ type: "success", title: "Org verified!", message: truncate(orgAddress) });
      refetchOrgStatus();
      // Give indexer 3s to process then refresh list
      setTimeout(fetchVerifiedOrgs, 3000);
    }
  }, [verifySuccess]);

  useEffect(() => {
    if (revokeSuccess) {
      addToast({ type: "info", title: "Org revoked", message: truncate(orgAddress) });
      refetchOrgStatus();
      setTimeout(fetchVerifiedOrgs, 3000);
    }
  }, [revokeSuccess]);

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
    writeRevoke({
      address:      ADDRESSES.charityCore,
      abi:          CHARITY_CORE_ABI,
      functionName: "revokeOrg",
      args:         [addr as `0x${string}`],
    });
  };

  // ── Guards ───────────────────────────────────────────────────
  if (!mounted) return null;

  if (!isConnected) return (
    <main className="max-w-3xl mx-auto px-4 py-20 text-center">
      <Shield size={48} className="mx-auto text-gray-300 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Admin Panel</h1>
      <p className="text-gray-500">Connect wallet to access admin panel.</p>
    </main>
  );

  if (!isAdmin && !isVerifier) return (
    <main className="max-w-3xl mx-auto px-4 py-20 text-center">
      <AlertCircle size={48} className="mx-auto text-red-300 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
      <p className="text-gray-500">You don't have admin or verifier role.</p>
      <p className="text-xs text-gray-400 mt-2 font-mono">{address}</p>
    </main>
  );

  const isOrgWriting      = isVerifyPending || isVerifyConfirming || isRevokePending || isRevokeConfirming;
  const isVerifierWriting = isGrantVerifierPending || isGrantVerifierConfirming || isRevokeVerifierPending || isRevokeVerifierConfirming;

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-xl">
            <Shield size={24} className="text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-gray-500">
              {isAdmin ? "Admin" : "Verifier"} ·{" "}
              <span className="font-mono">{address ? truncate(address) : ""}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isAdmin    && <span className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-full font-medium">ADMIN</span>}
          {isVerifier && <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full font-medium">VERIFIER</span>}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Campaigns", value: totalCampaigns?.toString() ?? "—", color: "text-gray-900" },
          { label: "Verified Orgs",   value: verifiedOrgs.length.toString(),    color: "text-emerald-600" },
          { label: "Your Role",       value: isAdmin ? "Admin" : "Verifier",    color: "text-purple-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Verify / Revoke Org ── */}
      <Section icon={UserCheck} title="Manage Organization Verification">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Wallet Address</label>
            <input
              type="text"
              value={orgAddress}
              onChange={e => setOrgAddress(e.target.value)}
              placeholder="0x..."
              className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          {orgAddress.length === 42 && (
            <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
              isOrgVerified ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-gray-50 text-gray-600 border border-gray-100"
            }`}>
              {isOrgVerified ? <><UserCheck size={14} /> Verified organization</> : <><UserX size={14} /> Not verified</>}
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => writeVerify({ address: ADDRESSES.charityCore, abi: CHARITY_CORE_ABI, functionName: "verifyOrg", args: [orgAddress as `0x${string}`] })}
              disabled={!orgAddress || isOrgWriting || Boolean(isOrgVerified)}
              className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-emerald-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserCheck size={14} />
              {isVerifyPending || isVerifyConfirming ? "Verifying..." : "Verify Org"}
            </button>
            <button
              onClick={() => writeRevoke({ address: ADDRESSES.charityCore, abi: CHARITY_CORE_ABI, functionName: "revokeOrg", args: [orgAddress as `0x${string}`] })}
              disabled={!orgAddress || isOrgWriting || !isOrgVerified}
              className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-red-600 flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserX size={14} />
              {isRevokePending || isRevokeConfirming ? "Revoking..." : "Revoke Org"}
            </button>
          </div>
        </div>
      </Section>

      {/* ── Off-chain org applications ── */}
      <Section icon={Users} title="Organization applications (off-chain)" collapsible>
        <AdminOrgProfiles />
        <p className="text-xs text-gray-400 mt-3">
          Approve profile here, then use Verify Org above to grant ORG_ROLE on-chain.
        </p>
      </Section>

      {/* ── Verified Orgs List ── */}
      <Section icon={Users} title={`Verified Organizations (${verifiedOrgs.length})`} collapsible>
        <div className="space-y-2">
          {orgsLoading ? (
            <div className="flex items-center justify-center py-8 text-gray-400">
              <RefreshCw size={16} className="animate-spin mr-2" /> Loading from backend...
            </div>
          ) : verifiedOrgs.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No verified organizations yet.</div>
          ) : (
            verifiedOrgs.map((org) => (
              <OrgRow key={org} address={org} onRevoke={handleQuickRevoke} isRevoking={isRevokePending || isRevokeConfirming} />
            ))
          )}
          {!orgsLoading && (
            <button
              onClick={fetchVerifiedOrgs}
              className="w-full mt-2 py-2 text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1.5 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <RefreshCw size={12} /> Refresh list
            </button>
          )}
        </div>
      </Section>

      {/* ── Manage Verifier Role — Admin only ── */}
      {isAdmin && (
        <Section icon={ShieldCheck} title="Manage Verifier Role" iconClass="text-purple-600">
          <p className="text-xs text-gray-500 mb-4">
            Grant or revoke <code className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-mono">VERIFIER_ROLE</code> — verifiers can verify/revoke organizations.
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Address</label>
              <input
                type="text"
                value={verifierAddr}
                onChange={e => setVerifierAddr(e.target.value)}
                placeholder="0x..."
                className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                {isGrantVerifierPending || isGrantVerifierConfirming ? "Granting..." : "Grant Verifier"}
              </button>
              <button
                onClick={() => writeRevokeVerifier({ address: ADDRESSES.charityCore, abi: CHARITY_CORE_ABI, functionName: "revokeRole", args: [VERIFIER_ROLE, verifierAddr as `0x${string}`] })}
                disabled={!verifierAddr || isVerifierWriting || !isVerifierRole}
                className="flex-1 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-800 flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserX size={14} />
                {isRevokeVerifierPending || isRevokeVerifierConfirming ? "Revoking..." : "Revoke Verifier"}
              </button>
            </div>
          </div>
        </Section>
      )}

    </main>
  );
}