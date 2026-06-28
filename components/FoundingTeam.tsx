"use client";

import { useCallback, useEffect, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { CoreContributorsCarousel } from "@/components/CoreContributorsCarousel";
import { ContributorProfile } from "@/components/ContributorProfile";
import { TEAM_MEMBERS, getTeamMember, type TeamMember } from "@/lib/teamMembers";

function slugFromHash(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const hash = window.location.hash.replace(/^#/, "");
  return hash && getTeamMember(hash) ? hash : undefined;
}

export function FoundingTeam({ compact = false }: { compact?: boolean }) {
  const [activeSlug, setActiveSlug] = useState<string | undefined>(() => slugFromHash());

  const handleSelect = useCallback((member: TeamMember) => {
    setActiveSlug(member.slug);
  }, []);

  useEffect(() => {
    const syncHash = () => {
      const slug = slugFromHash();
      if (slug) setActiveSlug(slug);
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  if (compact) {
    return (
      <GlassPanel holoBorder className="p-6">
        <div className="mb-6 text-center">
          <p className="section-eyebrow mb-2">Core contributors</p>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Founding Team</h2>
        </div>
        <CoreContributorsCarousel activeSlug={activeSlug} onSelect={handleSelect} />
      </GlassPanel>
    );
  }

  return (
    <div className="space-y-8">
      <GlassPanel holoBorder hover={false} className="overflow-hidden p-6 sm:p-8">
        <div className="mb-8">
          <p className="section-eyebrow mb-2">Core contributors</p>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Founding Team
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-white/60 sm:text-base">
            Built on Ethereum Sepolia — combining escrow mechanics, quadratic governance, and
            retro Impact NFTs. Select a team member to explore their role.
          </p>
        </div>

        <CoreContributorsCarousel activeSlug={activeSlug} onSelect={handleSelect} />
      </GlassPanel>

      <div className="space-y-12">
        {TEAM_MEMBERS.map((member, index) => (
          <ContributorProfile
            key={member.slug}
            member={member}
            index={index}
            isActive={activeSlug === member.slug}
          />
        ))}
      </div>
    </div>
  );
}
