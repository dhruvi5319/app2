import { useQuery } from "@tanstack/react-query";
import { reverseGeocode } from "../services/nominatimApi";
import { searchCity } from "../services/geocodingApi";
import type { LocationResult } from "../types/weather";

interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Given GPS coordinates, returns a LocationResult by:
 * 1. Calling Nominatim to get the city name
 * 2. Calling Open-Meteo Geocoding to get the canonical LocationResult with timezone
 *
 * Enabled only when coords is not null.
 */
export function useReverseGeocode(coords: Coordinates | null) {
  return useQuery({
    queryKey: ["reverseGeocode", coords?.latitude, coords?.longitude],
    queryFn: async (): Promise<LocationResult | null> => {
      if (!coords) return null;
      // Step 1: Get city name from Nominatim
      const cityName = await reverseGeocode(coords.latitude, coords.longitude);
      // Step 2: Get canonical LocationResult (with timezone) from Open-Meteo Geocoding
      const results = await searchCity(cityName);
      if (results.length === 0) return null;
      const best = results[0];
      return {
        name: [best.name, best.admin1, best.countryCode]
          .filter(Boolean)
          .join(", "),
        latitude: best.latitude,
        longitude: best.longitude,
        timezone: best.timezone,
      };
    },
    enabled: coords !== null,
    retry: false, // Don't retry GPS-triggered calls
  });
}
