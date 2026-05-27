import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { searchCity } from "../services/geocodingApi";
import { queryKeys } from "../constants/queryKeys";

/**
 * Returns geocoding suggestions for a search query.
 * - Debounces 300ms before triggering the API call
 * - Only enabled when debounced query has 2+ characters
 * - Returns empty array (not error) when no results found
 */
export function useGeocodingSearch(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return useQuery({
    queryKey: queryKeys.geocoding(debouncedQuery),
    queryFn: () => searchCity(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 2,
    placeholderData: [],
  });
}
