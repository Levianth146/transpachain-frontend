import type { Metadata } from "next";
import { Lexend, Source_Sans_3 } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers";
import { ToastContainer } from "@/components/Toast";
import { ConditionalNav } from "@/components/ConditionalNav";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TranspaChain — Transparent Giving Platform",
  description:
    "Transparent charity on Avalanche — milestone-based escrow, donor governance, and on-chain accountability at transpachain.site",
  metadataBase: new URL("https://transpachain.site"),
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sourceSans.variable} ${lexend.variable} font-sans`} suppressHydrationWarning>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Providers>
          <ConditionalNav />
          <div id="main">{children}</div>
          <footer className="border-t px-6 py-8 text-center text-sm" style={{ borderColor: "var(--border-glass)", color: "var(--page-fg-muted)" }}>
            <p className="mb-1 font-display text-base font-semibold">
              <span className="text-holo">TranspaChain</span>
            </p>
            <p className="mb-3">Avalanche Fuji testnet demo — transpachain.site — not financial advice.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs">
              <Link href="/legal" className="cursor-pointer text-[var(--color-primary)] hover:underline">
                Legal &amp; Disclaimer
              </Link>
              <Link href="/transparency" className="cursor-pointer text-[var(--color-primary)] hover:underline">
                Transparency
              </Link>
              <a
                href="https://github.com/Levianth146/transpachain/tree/main/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-[var(--color-primary)] hover:underline"
              >
                Documentation
              </a>
            </div>
          </footer>
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
