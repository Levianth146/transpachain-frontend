import { HeroSection } from "@/components/HeroSection";
import { TickerMarquee } from "@/components/TickerMarquee";
import { LiveCampaignsSection } from "@/components/LiveCampaignsSection";
import { ProtocolBento } from "@/components/ProtocolBento";
import { LandingHowItWorks } from "@/components/LandingHowItWorks";
import { DonorWall } from "@/components/DonorWall";
import { CtaCloser } from "@/components/CtaCloser";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <TickerMarquee />
      <LiveCampaignsSection />
      <ProtocolBento />
      <LandingHowItWorks />
      <DonorWall />
      <CtaCloser />
    </main>
  );
}
