"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { api } from "@/lib/api";
import { addToast } from "@/components/Toast";
import { motion } from "framer-motion";
import { Buildings } from "@phosphor-icons/react";

function statusBadgeClass(status: string) {
  switch (status.toLowerCase()) {
    case "approved":
      return "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30";
    case "pending":
      return "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30";
    case "rejected":
      return "bg-red-100 text-red-700 border-red-300 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30";
    default:
      return "bg-slate-100 text-slate-800 border-slate-300 dark:bg-white/10 dark:text-slate-300 dark:border-white/20";
  }
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 dark:border-gray-700 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:ring-accent-shine/50";

export function OrgProfileForm() {
  const { address } = useAccount();
  const [legalName, setLegalName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [country, setCountry] = useState("");
  const [registrationDocCID, setRegistrationDocCID] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [status, setStatus] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!address) return;
    api.getOrgProfile(address).then((p) => {
      if (p?.orgAddress) {
        setLegalName(p.legalName ?? "");
        setDescription(p.description ?? "");
        setWebsite(p.website ?? "");
        setCountry(p.country ?? "");
        setRegistrationDocCID(p.registrationDocCID ?? "");
        setContactEmail(p.contactEmail ?? "");
        setStatus(p.status ?? "");
      }
    }).catch(() => {});
  }, [address]);

  if (!address) {
    return (
      <p className="text-sm text-slate-600 dark:text-white/50">Connect wallet to register your organization profile.</p>
    );
  }

  const submit = async () => {
    setSaving(true);
    try {
      await api.submitOrgProfile({
        orgAddress: address,
        legalName,
        description,
        website,
        country,
        registrationDocCID,
        contactEmail,
      });
      setStatus("pending");
      addToast({ type: "success", title: "Profile submitted", message: "Awaiting verifier review" });
    } catch {
      addToast({ type: "error", title: "Failed to submit profile" });
    }
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 rounded-xl border border-slate-300 bg-slate-50 p-6 dark:border-white/10 dark:bg-white/[0.03]"
    >
      <div className="flex items-center gap-2">
        <Buildings size={24} className="text-teal-700 dark:text-accent-shine" weight="duotone" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Organization profile</h2>
        {status && (
          <span className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${statusBadgeClass(status)}`}>
            {status}
          </span>
        )}
      </div>
      <p className="text-sm text-slate-600 dark:text-white/50">
        Off-chain details help verifiers assess legitimacy before granting ORG_ROLE on-chain.
      </p>
      <input
        placeholder="Legal name"
        value={legalName}
        onChange={(e) => setLegalName(e.target.value)}
        className={inputClass}
      />
      <textarea
        placeholder="Mission & activities"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        className={inputClass}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          placeholder="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className={inputClass}
        />
        <input
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className={inputClass}
        />
      </div>
      <input
        placeholder="Registration doc IPFS CID (optional)"
        value={registrationDocCID}
        onChange={(e) => setRegistrationDocCID(e.target.value)}
        className={`${inputClass} font-mono`}
      />
      <input
        placeholder="Contact email"
        value={contactEmail}
        onChange={(e) => setContactEmail(e.target.value)}
        className={inputClass}
      />
      <button
        type="button"
        disabled={saving || !legalName.trim()}
        onClick={submit}
        className="w-full py-2.5 bg-emerald-600 text-white rounded-lg font-medium disabled:opacity-50"
      >
        {saving ? "Submitting…" : "Submit for verification"}
      </button>
    </motion.div>
  );
}
