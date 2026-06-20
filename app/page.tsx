import { Web3HeroAnimated } from "@/components/Web3HeroAnimated";
import { FoundingTeam } from "@/components/FoundingTeam";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black">
      <Web3HeroAnimated />
      <section className="mx-auto max-w-5xl px-4 py-16">
        <FoundingTeam compact />
      </section>
    </main>
  );
}
