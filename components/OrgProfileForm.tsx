"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { api } from "@/lib/api";
import { addToast } from "@/components/Toast";
import { motion } from "framer-motion";
import { Buildings } from "@phosphor-icons/react";

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
      <p className="text-sm text-gray-500">Connect wallet to register your organization profile.</p>
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
      className="bg-white dark:bg-ink-900 border rounded-xl p-6 space-y-4"
    >
      <div className="flex items-center gap-2">
        <Buildings size={24} className="text-gold-500" weight="duotone" />
        <h2 className="text-lg font-semibold">Organization profile</h2>
        {status && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 capitalize">
            {status}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500">
        Off-chain details help verifiers assess legitimacy before granting ORG_ROLE on-chain.
      </p>
      <input
        placeholder="Legal name"
        value={legalName}
        onChange={(e) => setLegalName(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />
      <textarea
        placeholder="Mission & activities"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          placeholder="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />
        <input
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <input
        placeholder="Registration doc IPFS CID (optional)"
        value={registrationDocCID}
        onChange={(e) => setRegistrationDocCID(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm font-mono"
      />
      <input
        placeholder="Contact email"
        value={contactEmail}
        onChange={(e) => setContactEmail(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm"
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
