import { useFreshnessTimer } from "../../hooks/useFreshnessTimer";

interface Props {
  fetchedAt: number;  // Unix timestamp ms from WeatherData.fetchedAt
}

/**
 * Displays "Updated X minutes ago" — ticks every 60s via useFreshnessTimer.
 * Shows nothing when fetchedAt is 0 (no data loaded).
 */
export function FreshnessIndicator({ fetchedAt }: Props) {
  const label = useFreshnessTimer(fetchedAt);

  if (!label) return null;

  return (
    <p className="text-xs text-white/50 mt-2" aria-live="polite">
      {label}
    </p>
  );
}
