import Link from "next/link";

interface LogoProps {
  className?: string;
  variant?: "light" | "default";
}

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="logo-holo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="45%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <linearGradient id="logo-shine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="logo-glow" cx="50%" cy="42%" r="50%">
          <stop offset="0%" stopColor="#5eead4" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#5eead4" stopOpacity="0" />
        </radialGradient>
        <filter id="logo-soft-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="32" cy="32" r="28" fill="url(#logo-glow)" />

      <path
        d="M32 8 L50 18.5 V39.5 L32 50 L14 39.5 V18.5 Z"
        stroke="url(#logo-holo)"
        strokeWidth="1.2"
        fill="none"
        opacity="0.85"
      />
      <path
        d="M32 13 L45.5 21 V35 L32 43 L18.5 35 V21 Z"
        stroke="url(#logo-holo)"
        strokeWidth="0.6"
        fill="none"
        opacity="0.35"
      />

      <g fill="url(#logo-holo)" opacity="0.9">
        <rect x="29" y="5" width="6" height="6" rx="1" />
        <rect x="47" y="16" width="5" height="5" rx="0.8" />
        <rect x="47" y="37" width="5" height="5" rx="0.8" />
        <rect x="29" y="47" width="6" height="6" rx="1" />
        <rect x="12" y="37" width="5" height="5" rx="0.8" />
        <rect x="12" y="16" width="5" height="5" rx="0.8" />
      </g>

      <circle cx="32" cy="8" r="1.5" fill="#5eead4" />
      <circle cx="50" cy="18.5" r="1.2" fill="#7dd3fc" />
      <circle cx="50" cy="39.5" r="1.2" fill="#a78bfa" />
      <circle cx="32" cy="50" r="1.5" fill="#c084fc" />
      <circle cx="14" cy="39.5" r="1.2" fill="#a78bfa" />
      <circle cx="14" cy="18.5" r="1.2" fill="#5eead4" />

      <rect
        x="17"
        y="19"
        width="30"
        height="22"
        rx="6"
        className="fill-ink-950 dark:fill-ink-950"
        stroke="url(#logo-holo)"
        strokeWidth="0.8"
        opacity="0.95"
      />
      <rect x="17" y="19" width="30" height="10" rx="6" fill="url(#logo-shine)" opacity="0.5" />

      <path
        d="M27 28 C27 24.5 24.5 22 21.5 22 C18.5 22 16 24.5 16 28 C16 31.5 18.5 34 21.5 34 C24.5 34 27 31.5 27 28"
        stroke="url(#logo-holo)"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        transform="translate(2 0)"
        filter="url(#logo-soft-glow)"
      />
      <path
        d="M30 22 H42 M36 22 V34"
        stroke="url(#logo-holo)"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        filter="url(#logo-soft-glow)"
      />

      <path
        d="M32 36.5 L29.5 34.2 C28.2 33 28.2 31 29.5 29.8 C30.5 28.9 32 29.5 32 30.5 C32 29.5 33.5 28.9 34.5 29.8 C35.8 31 35.8 33 34.5 34.2 Z"
        fill="url(#logo-holo)"
        opacity="0.75"
      />
      <path d="M32 30.8 L33.2 32.4 L32 34 L30.8 32.4 Z" fill="#ffffff" opacity="0.35" />
    </svg>
  );
}

export function Logo({ className = "", variant = "default" }: LogoProps) {
  const isLight = variant === "light";

  return (
    <Link
      href="/"
      className={`group flex select-none items-center gap-2.5 ${className}`}
      aria-label="TranspaChain home"
    >
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-holo-gradient p-[2px] shadow-[0_0_12px_rgba(94,234,212,0.25)]">
        <span className="flex h-full w-full items-center justify-center rounded-full bg-ink-950 dark:bg-ink-950">
          <LogoMark className="h-7 w-7 shrink-0" />
        </span>
      </span>
      <span className="flex flex-col justify-center leading-none">
        <span className="font-display text-[1.125rem] font-semibold tracking-tight sm:text-[1.25rem]">
          {isLight ? (
            <span className="text-slate-900 transition-colors duration-200 group-hover:text-slate-700 dark:text-white dark:group-hover:text-white/90">
              Transpa<span className="text-holo">Chain</span>
            </span>
          ) : (
            <>
              <span className="text-slate-900 transition-colors duration-200 dark:text-white">
                Transpa
              </span>
              <span className="bg-holo-gradient bg-clip-text text-transparent">Chain</span>
            </>
          )}
        </span>
      </span>
    </Link>
  );
}
