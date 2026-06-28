import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers";
import { ToastContainer } from "@/components/Toast";
import { ConditionalNav } from "@/components/ConditionalNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TranspaChain — Transparent Giving Platform",
  description:
    "Transparent charity on Ethereum — milestone-based escrow, donor governance, and on-chain accountability at transpachain.site",
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
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`} suppressHydrationWarning>
        <Providers>
          <ConditionalNav />
          {children}
          <footer className="border-t border-slate-200 bg-white px-6 py-8 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-black dark:text-white/50">
            <p className="mb-1 font-display font-medium text-holo">
              TranspaChain
            </p>
            <p className="mb-2">Sepolia testnet demo — transpachain.site — not financial advice.</p>
            <Link href="/legal" className="text-holo-mint transition-colors hover:text-slate-900 dark:hover:text-white">
              Legal &amp; Disclaimer
            </Link>
          </footer>
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
