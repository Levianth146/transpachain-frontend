import Link from "next/link";

interface LogoProps {
  className?: string;
  variant?: "light" | "default";
}

export function Logo({ className = "", variant = "default" }: LogoProps) {
  const isLight = variant === "light";

  return (
    <Link
      href="/"
      className={`group flex select-none items-center gap-2.5 ${className}`}
      aria-label="TranspaChain home"
    >
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full p-[2px] bg-holo-gradient shadow-[0_0_12px_rgba(94,234,212,0.25)]">
        <span className="flex h-full w-full items-center justify-center rounded-full bg-ink-950">
          <img
            src="/logo.svg"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 shrink-0"
          />
        </span>
      </span>
      <span className="flex flex-col justify-center leading-none">
        <span className="font-display text-[1.125rem] font-semibold tracking-tight sm:text-[1.25rem]">
          {isLight ? (
            <span className="text-white transition-colors duration-200 group-hover:text-white/90">
              Transpa<span className="text-holo">Chain</span>
            </span>
          ) : (
            <>
              <span className="text-white transition-colors duration-200">Transpa</span>
              <span className="bg-holo-gradient bg-clip-text text-transparent">
                Chain
              </span>
            </>
          )}
        </span>
      </span>
    </Link>
  );
}
