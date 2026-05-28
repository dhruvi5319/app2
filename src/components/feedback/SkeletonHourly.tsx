export function SkeletonHourly() {
  return (
    <section aria-label="Loading 24-hour forecast" className="w-full">
      <div className="flex flex-row gap-2 overflow-x-hidden pb-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-between min-w-[80px] px-3 py-3 rounded-xl bg-white/10 animate-pulse motion-reduce:animate-none"
            aria-hidden="true"
          >
            <div className="h-3 w-10 bg-white/20 rounded mb-2" />
            <div className="h-8 w-8 bg-white/20 rounded-full mb-2" />
            <div className="h-4 w-8 bg-white/20 rounded mb-1" />
            <div className="h-3 w-8 bg-white/20 rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}
