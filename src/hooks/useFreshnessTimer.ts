import { useState, useEffect } from "react";
import { formatFreshness } from "../utils/time";

/**
 * Returns a ticking "Updated X minutes ago" string.
 * Updates every 60 seconds. Returns empty string when fetchedAt is 0 (no data).
 */
export function useFreshnessTimer(fetchedAt: number): string {
  const [label, setLabel] = useState(() =>
    fetchedAt > 0 ? formatFreshness(fetchedAt) : "",
  );

  useEffect(() => {
    if (fetchedAt === 0) {
      setLabel("");
      return;
    }

    setLabel(formatFreshness(fetchedAt));

    const interval = setInterval(() => {
      setLabel(formatFreshness(fetchedAt));
    }, 60_000);

    return () => clearInterval(interval);
  }, [fetchedAt]);

  return label;
}
