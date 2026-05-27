import type { OpenMeteoGeocodingResponse } from "../types/api";
import type { GeocodingResult } from "../types/weather";

const BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";

/**
 * Searches for cities by name using the Open-Meteo Geocoding API.
 * Request: GET /v1/search?name={query}&count=5&language=en&format=json
 *
 * No-results case: API returns {} (no results key) — NOT an error.
 * Returns empty array when response.results === undefined.
 */
export async function searchCity(query: string): Promise<GeocodingResult[]> {
  const params = new URLSearchParams({
    name: query.trim(),
    count: "5",
    language: "en",
    format: "json",
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as OpenMeteoGeocodingResponse;

  // response.results === undefined is a valid "no results" state — not an error
  if (!data.results) return [];

  return data.results.map((r) => ({
    id: r.id,
    name: r.name,
    country: r.country,
    countryCode: r.country_code,
    admin1: r.admin1 ?? "",
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
    population: r.population ?? null,
  }));
}
