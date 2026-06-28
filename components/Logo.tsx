import Image from "next/image";
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
      <Image
        src="/logo.png"
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 shrink-0 rounded-lg object-contain"
        priority
      />
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
