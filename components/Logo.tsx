import Link from "next/link";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`group flex select-none items-center gap-2.5 transition-transform duration-200 hover:scale-105 ${className}`}
      aria-label="TranspaChain home"
    >
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full p-[2px] bg-holo-gradient shadow-[0_0_12px_rgba(20,184,166,0.2)]">
        <span className="flex h-full w-full items-center justify-center rounded-full bg-white">
          <img
            src="/logo.svg"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 shrink-0"
          />
        </span>
      </span>
      <span className="font-display text-[1.125rem] font-semibold tracking-tight text-brand-navy sm:text-[1.25rem]">
        Transpa<span className="text-holo">Chain</span>
      </span>
    </Link>
  );
}
