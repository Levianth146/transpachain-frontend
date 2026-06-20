import { AnimatedGradientBackground } from "@/components/ui/AnimatedGradientBackground";

export function CampaignDetailSkeleton() {
  return (
    <AnimatedGradientBackground variant="light" className="min-h-screen">
      <main className="mx-auto max-w-5xl animate-pulse px-4 py-10">
        <div className="mb-6 h-64 w-full rounded-xl bg-white/10" />
        <div className="mb-4 h-8 w-2/3 rounded bg-white/10" />
        <div className="mb-6 h-4 w-full rounded bg-white/5" />
        <div className="mb-6 h-24 rounded-xl bg-white/5" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="h-48 rounded-xl bg-white/5" />
          <div className="h-48 rounded-xl bg-white/5" />
        </div>
      </main>
    </AnimatedGradientBackground>
  );
}
