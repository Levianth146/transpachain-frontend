"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { FileImage, X, ArrowSquareOut } from "@phosphor-icons/react";
import { normalizeImageUrl } from "@/lib/images";
import { getProofIpfsUrl } from "@/lib/ipfs";
import { motion, AnimatePresence } from "framer-motion";

type EvidenceItem = {
  _id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  ipfsCID?: string;
  milestoneIndex: number;
};

export function EvidencePanel({ campaignId }: { campaignId: number }) {
  const [items, setItems] = useState<EvidenceItem[]>([]);
  const [selected, setSelected] = useState<EvidenceItem | null>(null);

  useEffect(() => {
    api.getEvidence(campaignId, "approved").then((d) => setItems(d.evidence ?? []));
  }, [campaignId]);

  if (items.length === 0) return null;

  const getImageUrl = (e: EvidenceItem) =>
    normalizeImageUrl(e.imageUrl) ?? getProofIpfsUrl(e.ipfsCID) ?? null;

  return (
    <>
      <GlassPanel className="p-5">
        <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
          <FileImage size={22} weight="duotone" className="text-blue-600" />
          Evidence
        </h3>
        <div className="grid gap-4">
          {items.map((e) => {
            const imageUrl = getImageUrl(e);
            return (
              <div
                key={e._id}
                className="flex gap-4 border border-gray-100 dark:border-zinc-800 rounded-lg p-3"
              >
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={e.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div>
                    <p className="font-medium">{e.title || `Milestone ${e.milestoneIndex + 1}`}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{e.description}</p>
                    <p className="text-xs text-gray-400 mt-2">Milestone #{e.milestoneIndex + 1}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelected(e)}
                    className="mt-2 self-start inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/20"
                  >
                    View full evidence
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </GlassPanel>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl border border-white/10 bg-ink-950 p-5 shadow-2xl"
              onClick={(ev) => ev.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <h4 className="font-display text-lg font-semibold text-white pr-8">
                {selected.title || `Milestone ${selected.milestoneIndex + 1}`}
              </h4>
              <p className="mt-1 text-xs text-white/50">Milestone #{selected.milestoneIndex + 1}</p>
              {getImageUrl(selected) && (
                <img
                  src={getImageUrl(selected)!}
                  alt={selected.title}
                  className="mt-4 w-full max-h-[60vh] object-contain rounded-xl border border-white/10"
                />
              )}
              {selected.description && (
                <p className="mt-4 text-sm leading-relaxed text-white/70">{selected.description}</p>
              )}
              {getImageUrl(selected) && (
                <a
                  href={getImageUrl(selected)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs text-holo-mint hover:underline"
                >
                  <ArrowSquareOut size={14} />
                  Open on IPFS
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
