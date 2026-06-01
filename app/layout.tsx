import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ToastContainer } from "@/components/Toast";
import { ClientNav } from "@/components/ClientNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:       "TranspaChain — Transparent Charity Platform",
  description: "Blockchain-powered charity with milestone-based fund release and DAO governance",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <h1 className="text-xl font-bold text-emerald-700">🌿 TranspaChain</h1>
            <ClientNav />
          </nav>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
