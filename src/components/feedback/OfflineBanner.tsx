import { useFreshnessTimer } from "../../hooks/useFreshnessTimer";

interface OfflineBannerProps {
  isOnline: boolean;
  fetchedAt: number; // 0 = no data, > 0 = cached data available
}

/**
 * Fixed banner shown when offline and cached data is available.
 * If online or no cached data: renders nothing.
 * Uses useFreshnessTimer for ticking "X minutes ago" display.
 */
export function OfflineBanner({ isOnline, fetchedAt }: OfflineBannerProps) {
  const freshnessLabel = useFreshnessTimer(fetchedAt);

  if (isOnline || fetchedAt === 0) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="w-full bg-amber-600 text-white text-sm px-4 py-2 text-center"
    >
      You're offline — showing cached data
      {freshnessLabel
        ? ` from ${freshnessLabel.replace("Updated ", "").toLowerCase()}`
        : ""}
    </div>
  );
}
