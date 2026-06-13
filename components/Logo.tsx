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
      aria-label="OpenHeart home"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-white/20">
        <img
          src="/logo.svg"
          alt=""
          width={34}
          height={34}
          className="h-8 w-8 shrink-0"
        />
      </span>
      <span className="flex flex-col justify-center leading-none">
        <span className="text-[1.125rem] font-semibold tracking-tight sm:text-[1.25rem]">
          {isLight ? (
            <span className="text-white transition-colors duration-200 group-hover:text-white/90">
              OpenHeart
            </span>
          ) : (
            <>
              <span className="text-white transition-colors duration-200">Open</span>
              <span className="bg-gradient-to-r from-accent-shine via-white to-accent-shine bg-clip-text text-transparent">
                Heart
              </span>
            </>
          )}
        </span>
      </span>
    </Link>
  );
}
