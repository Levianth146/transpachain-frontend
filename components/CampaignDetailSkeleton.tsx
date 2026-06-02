export function CampaignDetailSkeleton() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10 animate-pulse">
      <div className="w-full h-64 bg-gray-200 dark:bg-zinc-800 rounded-xl mb-6" />
      <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded w-2/3 mb-4" />
      <div className="h-4 bg-gray-100 dark:bg-zinc-700 rounded w-full mb-6" />
      <div className="h-24 bg-gray-100 dark:bg-zinc-800 rounded-xl mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-48 bg-gray-100 dark:bg-zinc-800 rounded-xl" />
        <div className="h-48 bg-gray-100 dark:bg-zinc-800 rounded-xl" />
      </div>
    </main>
  );
}
