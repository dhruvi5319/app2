/**
 * Layout-preserving skeleton for the hero section.
 * Pulse animation respects prefers-reduced-motion (motion-safe: variant).
 * Matches the exact dimensions and structure of the live hero content.
 * Per TechArch §9 example pattern.
 */
export function SkeletonHero() {
  return (
    <div className="animate-pulse motion-reduce:animate-none p-6">
      {/* Temperature block */}
      <div className="h-20 w-36 bg-white/20 rounded-lg mb-2" />
      {/* Feels like */}
      <div className="h-5 w-32 bg-white/15 rounded mb-4" />
      {/* Icon + condition label */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 bg-white/20 rounded-full" />
        <div className="h-6 w-28 bg-white/15 rounded" />
      </div>
      {/* High/Low */}
      <div className="h-5 w-24 bg-white/15 rounded mb-3" />
      {/* Stats row: precip, humidity, wind */}
      <div className="flex gap-4">
        <div className="h-5 w-16 bg-white/15 rounded" />
        <div className="h-5 w-20 bg-white/15 rounded" />
        <div className="h-5 w-18 bg-white/15 rounded" />
      </div>
    </div>
  );
}
