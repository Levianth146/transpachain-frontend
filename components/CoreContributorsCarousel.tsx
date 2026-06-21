"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { TEAM_MEMBERS, type TeamMember } from "@/lib/teamMembers";

type CoreContributorsCarouselProps = {
  activeSlug?: string;
  onSelect: (member: TeamMember) => void;
};

const CARD_GAP = 16;

function scrollToMember(slug: string) {
  const el = document.getElementById(`member-${slug}`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${slug}`);
  }
}

export function CoreContributorsCarousel({
  activeSlug,
  onSelect,
}: CoreContributorsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanScrollLeft(track.scrollLeft > 4);
    setCanScrollRight(track.scrollLeft < maxScroll - 4);

    const cards = Array.from(track.children) as HTMLElement[];
    if (!cards.length) return;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(trackCenter - cardCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = index;
      }
    });

    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateScrollState();
    track.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      track.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  useEffect(() => {
    if (!activeSlug) return;
    const index = TEAM_MEMBERS.findIndex((member) => member.slug === activeSlug);
    if (index >= 0) setActiveIndex(index);
  }, [activeSlug]);

  const scrollByCard = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.children[0] as HTMLElement | undefined;
    const step = (card?.offsetWidth ?? 280) + CARD_GAP;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const handleSelect = (member: TeamMember) => {
    onSelect(member);
    scrollToMember(member.slug);
  };

  const pageCount = Math.max(1, TEAM_MEMBERS.length - 2);

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {TEAM_MEMBERS.map((member) => {
          const isActive = activeSlug === member.slug;
          return (
            <button
              key={member.slug}
              type="button"
              onClick={() => handleSelect(member)}
              className={`group snap-start shrink-0 w-[72vw] max-w-[280px] sm:w-[240px] md:w-[260px] text-left transition-opacity ${
                isActive ? "opacity-100" : "opacity-90 hover:opacity-100"
              }`}
            >
              <div
                className={`relative mb-4 aspect-[3/4] overflow-hidden rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-[3.5rem] border bg-gradient-to-br ${member.gradient} ${
                  isActive ? "border-holo-mint/50" : "border-white/10 group-hover:border-holo-mint/30"
                }`}
              >
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 72vw, 260px"
                />
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage:
                      "repeating-conic-gradient(rgba(255,255,255,0.06) 0% 25%, transparent 0% 50%)",
                    backgroundSize: "8px 8px",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>

              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold text-white sm:text-2xl">
                  {member.name}
                </span>
                <ArrowRight
                  size={20}
                  weight="bold"
                  className="text-holo-mint transition-transform group-hover:translate-x-1"
                />
              </div>
              <p className="mt-1 text-sm text-white/60">{member.role}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          aria-label="Previous team member"
          onClick={() => scrollByCard(-1)}
          disabled={!canScrollLeft}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-holo-mint text-black transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowLeft size={22} weight="bold" />
        </button>

        <div className="flex flex-1 items-center justify-center gap-2">
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to team member group ${index + 1}`}
              onClick={() => {
                const track = trackRef.current;
                if (!track) return;
                const card = track.children[0] as HTMLElement | undefined;
                const step = (card?.offsetWidth ?? 280) + CARD_GAP;
                track.scrollTo({ left: step * index, behavior: "smooth" });
              }}
              className={`h-2.5 rounded-full transition-all ${
                index === Math.min(activeIndex, pageCount - 1)
                  ? "w-8 bg-holo-mint"
                  : "w-2.5 bg-white/20 hover:bg-white/35"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next team member"
          onClick={() => scrollByCard(1)}
          disabled={!canScrollRight}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-holo-mint text-black transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowRight size={22} weight="bold" />
        </button>
      </div>
    </div>
  );
}

export { scrollToMember };
