"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { FileImage } from "@phosphor-icons/react";
import { normalizeImageUrl } from "@/lib/images";

export function EvidencePanel({ campaignId }: { campaignId: number }) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.getEvidence(campaignId, "approved").then((d) => setItems(d.evidence ?? []));
  }, [campaignId]);

  if (items.length === 0) return null;

  return (
    <GlassPanel className="p-5">
      <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
        <FileImage size={22} weight="duotone" className="text-blue-600" />
        Evidence
      </h3>
      <div className="grid gap-4">
        {items.map((e) => (
          <div key={e._id} className="flex gap-4 border border-gray-100 dark:border-zinc-800 rounded-lg p-3">
            {e.imageUrl && (
              <img
                src={normalizeImageUrl(e.imageUrl) ?? ""}
                alt={e.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
            <div>
              <p className="font-medium">{e.title || `Milestone ${e.milestoneIndex + 1}`}</p>
              <p className="text-sm text-gray-500 mt-1">{e.description}</p>
              <p className="text-xs text-gray-400 mt-2">Milestone #{e.milestoneIndex + 1}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
