import { useQuery } from "@tanstack/react-query";
import { fetchWeatherData } from "../services/weatherApi";
import { queryKeys } from "../constants/queryKeys";
import type { LocationResult } from "../types/weather";

/**
 * Fetches WeatherData for a given LocationResult using TanStack Query.
 * Query key: ["weather", latitude, longitude]
 * Enabled only when location is not null.
 */
export function useWeatherData(location: LocationResult | null) {
  return useQuery({
    queryKey: location
      ? queryKeys.weather(location.latitude, location.longitude)
      : (["weather", null] as const),
    queryFn: () => {
      if (!location) throw new Error("No location provided");
      return fetchWeatherData(location);
    },
    enabled: location !== null,
  });
}
