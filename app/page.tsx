import { Web3HeroAnimated } from "@/components/Web3HeroAnimated";
import { LandingFeatures } from "@/components/LandingFeatures";
import { FaqAccordion } from "@/components/FaqAccordion";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black">
      <Web3HeroAnimated />
      <LandingFeatures />
      <FaqAccordion />
    </main>
  );
}
