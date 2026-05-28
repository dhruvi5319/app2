export function SkeletonDaily() {
  return (
    <section aria-label="Loading 7-day forecast" className="w-full rounded-xl bg-white/10 overflow-hidden">
      <div className="divide-y divide-white/10">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-row items-center justify-between gap-2 py-2 px-3 min-h-[44px] animate-pulse motion-reduce:animate-none"
            aria-hidden="true"
          >
            <div className="h-3 w-12 bg-white/20 rounded" />
            <div className="h-8 w-8 bg-white/20 rounded-full" />
            <div className="h-3 w-8 bg-white/20 rounded" />
            <div className="flex gap-2 ml-auto">
              <div className="h-3 w-8 bg-white/20 rounded" />
              <div className="h-3 w-8 bg-white/15 rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
