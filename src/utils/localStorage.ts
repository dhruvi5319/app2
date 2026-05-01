import type { UnitPreference } from "../types/storage";
import type { RecentSearch } from "../types/storage";

// ─── Unit Preference ──────────────────────────────────────────────────────────

export function readUnitPreference(): UnitPreference {
  try {
    const raw = localStorage.getItem("weather_unit_preference");
    if (raw === "celsius" || raw === "fahrenheit") return raw;
  } catch {
    // SecurityError in private browsing — fall through to default
  }
  return "celsius";
}

export function writeUnitPreference(unit: UnitPreference): void {
  try {
    localStorage.setItem("weather_unit_preference", unit);
  } catch {
    // Quota exceeded or SecurityError — silently ignore
  }
}

// ─── Recent Searches ──────────────────────────────────────────────────────────

const RECENT_SEARCHES_KEY = "weather_recent_searches";
const MAX_RECENT_SEARCHES = 5;

function isValidRecentSearch(item: unknown): item is RecentSearch {
  if (typeof item !== "object" || item === null) return false;
  const r = item as Record<string, unknown>;
  return (
    typeof r.name === "string" &&
    typeof r.latitude === "number" &&
    typeof r.longitude === "number" &&
    typeof r.timezone === "string" &&
    typeof r.savedAt === "number"
  );
}

export function readRecentSearches(): RecentSearch[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidRecentSearch);
  } catch {
    return [];
  }
}

export function writeRecentSearch(entry: RecentSearch): void {
  try {
    const existing = readRecentSearches();
    // Deduplication: move-to-front if ±0.001 degrees match (from FRD §4.2)
    const deduped = existing.filter(
      (r) =>
        Math.abs(r.latitude - entry.latitude) > 0.001 ||
        Math.abs(r.longitude - entry.longitude) > 0.001,
    );
    const updated = [entry, ...deduped].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // Quota exceeded or SecurityError — silently ignore
  }
}
