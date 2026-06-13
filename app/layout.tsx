import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers";
import { ToastContainer } from "@/components/Toast";
import { ConditionalNav } from "@/components/ConditionalNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TranspaChain — Transparent Charity Platform",
  description:
    "Blockchain-powered charity with milestone-based fund release and DAO governance",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`} suppressHydrationWarning>
        <Providers>
          <ConditionalNav />
          {children}
          <footer className="border-t border-gray-800 bg-black px-6 py-8 text-center text-sm text-white/50">
            <p className="mb-2">Sepolia testnet demo — not financial advice.</p>
            <Link href="/legal" className="text-accent-shine transition-colors hover:text-white">
              Legal &amp; Disclaimer
            </Link>
          </footer>
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
