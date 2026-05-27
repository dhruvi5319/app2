import { useState, useCallback } from "react";
import { readRecentSearches, writeRecentSearch } from "../utils/localStorage";
import type { RecentSearch } from "../types/storage";
import type { LocationResult } from "../types/weather";

/**
 * Manages recent searches in localStorage.
 * Max 5 entries, move-to-front deduplication.
 */
export function useRecentSearches() {
  const [searches, setSearches] = useState<RecentSearch[]>(readRecentSearches);

  const addSearch = useCallback((location: LocationResult) => {
    const entry: RecentSearch = {
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: location.timezone,
      savedAt: Date.now(),
    };
    writeRecentSearch(entry);
    // Re-read from localStorage to get fresh deduped/sorted list
    setSearches(readRecentSearches());
  }, []);

  return { searches, addSearch };
}
