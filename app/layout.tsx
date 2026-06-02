import type { Metadata } from "next";
import { Inter, Racing_Sans_One } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers";
import { ToastContainer } from "@/components/Toast";
import { ClientNav } from "@/components/ClientNav";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileNav } from "@/components/MobileNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const racing = Racing_Sans_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-racing",
});

export const metadata: Metadata = {
  title: "TranspaChain — Transparent Charity Platform",
  description:
    "Blockchain-powered charity with milestone-based fund release and DAO governance",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${racing.variable} font-sans`} suppressHydrationWarning>
        <Providers>
          <nav className="relative bg-white/90 dark:bg-ink-900/95 border-b border-gold-200/20 dark:border-zinc-800 px-4 md:px-6 py-3 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md">
            <Logo />
            <div className="hidden md:flex items-center gap-4">
              <ClientNav />
              <ThemeToggle />
            </div>
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <MobileNav />
            </div>
          </nav>
          {children}
          <footer className="border-t border-gray-200 dark:border-zinc-800 py-8 px-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2">Sepolia testnet demo — not financial advice.</p>
            <Link href="/legal" className="text-emerald-600 hover:underline">
              Legal &amp; Disclaimer
            </Link>
          </footer>
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
