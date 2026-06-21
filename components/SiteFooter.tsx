"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { GradientText } from "@/components/ui/GradientText";

const FOOTER_LINKS: Record<
  string,
  { href: string; label: string; external?: boolean }[]
> = {
  Platform: [
    { href: "/campaigns", label: "Campaigns" },
    { href: "/campaigns/create", label: "Create Campaign" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/governance", label: "Governance" },
  ],
  Learn: [
    { href: "/about", label: "About" },
    { href: "/about#how-it-works", label: "How it works" },
    { href: "/legal", label: "Legal & Disclaimer" },
  ],
  Resources: [
    { href: "/admin", label: "Admin Panel" },
    { href: "https://sepolia.etherscan.io", label: "Sepolia Explorer", external: true },
  ],
};

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/[0.08] bg-black pb-28 md:pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-purple/40 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(111,56,218,0.12),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2.5fr]">
          <div>
            <Logo variant="light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
              Transparent charity on Ethereum Sepolia — milestone escrow, donor governance, and
              verifiable impact badges.
            </p>
            <div className="mt-6 inline-flex rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
              <p className="text-xs text-white/40">
                Demo on Sepolia testnet ·{" "}
                <GradientText className="text-xs font-medium">transpachain.site</GradientText>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
              <div key={group}>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  {group}
                </p>
                <ul className="mt-4 space-y-3">
                  {links.map(({ href, label, external }) => (
                    <li key={href}>
                      {external ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-white/60 transition-colors hover:text-white hover:scale-105 inline-block"
                        >
                          {label}
                        </a>
                      ) : (
                        <Link
                          href={href}
                          className="text-sm text-white/60 transition-all hover:text-white hover:scale-105 inline-block"
                        >
                          {label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Network
              </p>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
                <li>Sepolia testnet</li>
                <li>ETH &amp; USDC escrow</li>
                <li>On-chain governance</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} TranspaChain. Built for transparent giving.
          </p>
          <Link
            href="/legal"
            className="text-xs text-accent-purple transition-all hover:text-white hover:scale-105"
          >
            Legal &amp; Disclaimer
          </Link>
        </div>
      </div>
    </footer>
  );
}
