/** Format an ISO local datetime string as "2 PM" or "14:00" (locale-aware). */
export function formatHour(isoString: string, timezone: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    hour12: true,
    timeZone: timezone,
  }).format(date);
}

/** Format an ISO date string as abbreviated day name: "Mon", "Tue", etc. */
export function formatDayLabel(isoDate: string, timezone: string): string {
  const date = new Date(isoDate + "T12:00:00"); // noon avoids DST edge cases
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    timeZone: timezone,
  }).format(date);
}

/** Format an ISO local datetime string as "5:42 AM" in the location's timezone. */
export function formatTime(isoString: string, timezone: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  }).format(date);
}

/**
 * Returns "Updated X minutes ago" string from a fetchedAt Unix timestamp (ms).
 * Returns "Just now" for < 60 seconds. Uses minutes (not hours) for Phase 1.
 */
export function formatFreshness(fetchedAt: number): string {
  const diffMs = Date.now() - fetchedAt;
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "Just now";
  if (diffMin === 1) return "Updated 1 minute ago";
  return `Updated ${diffMin} minutes ago`;
}
