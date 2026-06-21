import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ToastContainer } from "@/components/Toast";
import { ConditionalNav } from "@/components/ConditionalNav";
import { SiteFooter } from "@/components/SiteFooter";
import { BottomDock } from "@/components/BottomDock";
import { AmbientBackground } from "@/components/AmbientBackground";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TranspaChain — Transparent Giving Platform",
  description:
    "Transparent charity on Ethereum — milestone-based escrow, donor governance, and on-chain accountability at transpachain.site",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans`}
        suppressHydrationWarning
      >
        <Providers>
          <AmbientBackground />
          <ConditionalNav />
          <div className="relative z-[1]">{children}</div>
          <SiteFooter />
          <BottomDock />
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
