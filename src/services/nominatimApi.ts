import type { NominatimReverseResponse } from "../types/api";

const BASE_URL = "https://nominatim.openstreetmap.org/reverse";

/**
 * Converts GPS coordinates to a city name string using Nominatim.
 * Required by Nominatim usage policy: User-Agent header must be sent.
 *
 * Request: GET /reverse?lat={lat}&lon={lon}&format=json&zoom=10
 * Header: User-Agent: SimpleWeatherApp/1.0 (https://your-vercel-url.vercel.app)
 *
 * City name extraction (from FRD §3.3):
 * address.city ?? address.town ?? address.village ?? display_name.split(",")[0]
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<string> {
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    format: "json",
    zoom: "10",
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`, {
    headers: {
      "User-Agent": "SimpleWeatherApp/1.0 (https://your-vercel-url.vercel.app)",
    },
  });

  if (!response.ok) {
    throw new Error(`Nominatim error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as NominatimReverseResponse;

  // City name extraction per FRD §3.3
  const cityName =
    data.address.city ??
    data.address.town ??
    data.address.village ??
    data.display_name.split(",")[0];

  return cityName;
}
