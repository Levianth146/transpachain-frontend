"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";

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
    <footer className="relative z-10 border-t border-white/[0.07] px-4 pb-28 pt-14 sm:px-10 md:pb-16">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-11 grid gap-12 lg:grid-cols-[2.5fr_1fr_1fr_1fr]">
          <div>
            <Logo dark />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-primary/40">
              Transparent charity on Ethereum Sepolia — milestone escrow, donor governance,
              and verifiable impact badges.
            </p>
            <div className="mt-6 inline-flex rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3">
              <p className="text-xs text-text-primary/30">
                Demo on Sepolia testnet ·{" "}
                <span className="font-medium text-indigo-400">transpachain.site</span>
              </p>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-primary/25">
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
                        className="text-sm text-text-primary/40 transition-colors hover:text-text-primary"
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        href={href}
                        className="text-sm text-text-primary/40 transition-colors hover:text-text-primary"
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
            <p className="text-xs font-semibold uppercase tracking-wider text-text-primary/25">
              Network
            </p>
            <ul className="mt-4 space-y-3 text-sm text-text-primary/40">
              <li>Sepolia testnet</li>
              <li>ETH &amp; USDC escrow</li>
              <li>On-chain governance</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.07] pt-8 sm:flex-row">
          <p className="text-xs text-text-primary/25">
            © {new Date().getFullYear()} TranspaChain. Built for transparent giving.
          </p>
          <Link
            href="/legal"
            className="text-xs text-indigo-400/70 transition-colors hover:text-indigo-400"
          >
            Legal &amp; Disclaimer
          </Link>
        </div>
      </div>
    </footer>
  );
}
