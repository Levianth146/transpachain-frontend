"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "@phosphor-icons/react";
import { getInitials, type TeamMember } from "@/lib/teamMembers";

type ContributorProfileProps = {
  member: TeamMember;
  index: number;
  isActive?: boolean;
};

export function ContributorProfile({ member, index, isActive }: ContributorProfileProps) {
  return (
    <section
      id={`member-${member.slug}`}
      className="scroll-mt-24 border-t border-white/10 pt-10 first:border-t-0 first:pt-0"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45, delay: index * 0.04 }}
        className={`overflow-hidden rounded-2xl border transition-colors ${
          isActive ? "border-holo-mint/30" : "border-white/10"
        }`}
      >
        {/* Hero: name left, portrait right */}
        <div className="grid min-h-[280px] grid-cols-1 md:grid-cols-2">
          <div className="relative flex flex-col justify-between bg-ink-950 p-8 sm:p-10 md:p-12">
            <div>
              <p className="section-eyebrow mb-4">{member.role}</p>
              <h3 className="font-display text-4xl font-bold leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {member.name.split(" ").map((part, i) => (
                  <span key={i} className="block">
                    {part}
                  </span>
                ))}
              </h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
                {member.roleSummary}
              </p>
            </div>
            <ArrowDown
              size={28}
              className="mt-8 hidden text-white/30 md:block"
              aria-hidden
            />
          </div>

          <div
            className={`relative min-h-[240px] bg-gradient-to-br ${member.gradient} md:min-h-[280px]`}
          >
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  "repeating-conic-gradient(rgba(255,255,255,0.08) 0% 25%, transparent 0% 50%)",
                backgroundSize: "10px 10px",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/10 to-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-7xl font-bold tracking-tight text-white/85 sm:text-8xl lg:text-9xl">
                {getInitials(member.name)}
              </span>
            </div>
          </div>
        </div>

        {/* Bio panel: stats left, metadata + paragraphs right */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(240px,320px)_1fr]">
          <div className="rounded-br-[3rem] bg-ink-900 p-8 sm:p-10 lg:rounded-br-[4rem]">
            <div className="space-y-8">
              {member.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-5xl font-bold leading-none text-white sm:text-6xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.94] p-8 text-ink-900 sm:p-10 lg:p-12">
            <dl className="space-y-3 text-sm sm:text-base">
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold">Nationality:</dt>
                <dd>{member.nationality}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold">Lives:</dt>
                <dd>{member.lives}</dd>
              </div>
            </dl>

            <div className="mt-8 space-y-4 text-sm leading-relaxed text-ink-900/85 sm:text-[15px] sm:leading-7">
              {member.bio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
