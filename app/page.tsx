import { Web3HeroAnimated } from "@/components/Web3HeroAnimated";
import { LandingFeatures } from "@/components/LandingFeatures";
import { LandingHowItWorks } from "@/components/LandingHowItWorks";
import { LandingTrustSection } from "@/components/LandingTrustSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#040506]">
      <Web3HeroAnimated />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingTrustSection />
    </main>
  );
}
