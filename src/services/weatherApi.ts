import type {
  OpenMeteoForecastResponse,
} from "../types/api";
import type { WeatherData, LocationResult } from "../types/weather";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Transforms a raw Open-Meteo Forecast API response into the canonical WeatherData shape.
 * ALL Math.round() for temperatures happens HERE — never in components.
 * CRITICAL: timezone=auto is always sent — hardcoded, never overridable.
 * CRITICAL: precipitationProbability sourced from daily[0], NOT from current block.
 */
export function transformForecastResponse(
  raw: OpenMeteoForecastResponse,
  location: LocationResult,
): WeatherData {
  // Find the index of the current hour in the hourly array
  const currentHourStr = raw.current.time.substring(0, 13); // "2026-05-01T14"
  const currentHourIdx = raw.hourly.time.findIndex((t) =>
    t.startsWith(currentHourStr),
  );
  const sliceFrom = currentHourIdx >= 0 ? currentHourIdx : 0;

  // Slice 24 hourly entries starting from current hour
  const hourlySlice = raw.hourly.time.slice(sliceFrom, sliceFrom + 24);

  return {
    location,
    fetchedAt: Date.now(),
    current: {
      temperature: Math.round(raw.current.temperature_2m),
      feelsLike: Math.round(raw.current.apparent_temperature),
      weatherCode: raw.current.weather_code,
      isDay: raw.current.is_day === 1,
      windSpeed: Math.round(raw.current.wind_speed_10m),
      windDirection: raw.current.wind_direction_10m,
      humidity: Math.round(raw.current.relative_humidity_2m),
      // ⚠️ precipitation_probability does NOT exist in the current block.
      // Always source from daily.precipitation_probability_max[0] (today's value).
      precipitationProbability: Math.round(
        raw.daily.precipitation_probability_max[0] ?? 0,
      ),
      high: Math.round(raw.daily.temperature_2m_max[0]),
      low: Math.round(raw.daily.temperature_2m_min[0]),
    },
    hourly: hourlySlice.map((time, i) => {
      const idx = sliceFrom + i;
      return {
        time,
        hour: new Date(time).getHours(),
        temperature: Math.round(raw.hourly.temperature_2m[idx]),
        weatherCode: raw.hourly.weather_code[idx],
        isDay: raw.hourly.is_day[idx] === 1,
        precipitationProbability: raw.hourly.precipitation_probability[idx] ?? 0,
      };
    }),
    daily: raw.daily.time.slice(0, 7).map((date, i) => ({
      date,
      weatherCode: raw.daily.weather_code[i],
      high: Math.round(raw.daily.temperature_2m_max[i]),
      low: Math.round(raw.daily.temperature_2m_min[i]),
      precipitationProbability: raw.daily.precipitation_probability_max[i] ?? 0,
      sunrise: raw.daily.sunrise[i],
      sunset: raw.daily.sunset[i],
      uvIndexMax: raw.daily.uv_index_max[i] ?? 0,
      windSpeedMax: Math.round(raw.daily.wind_speed_10m_max[i]),
      windDirectionDominant: raw.daily.wind_direction_10m_dominant[i],
    })),
  };
}

/**
 * Fetches weather data for a location from Open-Meteo Forecast API.
 * timezone=auto is HARDCODED — never omitted, never overridable.
 *
 * Request spec from TechArch §6.1:
 * GET https://api.open-meteo.com/v1/forecast
 *   ?latitude={lat}
 *   &longitude={lon}
 *   &timezone=auto                    ← non-negotiable
 *   &current=temperature_2m,apparent_temperature,weather_code,is_day,wind_speed_10m,wind_direction_10m,relative_humidity_2m
 *   &hourly=temperature_2m,weather_code,is_day,precipitation_probability
 *   &daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max,wind_speed_10m_max,wind_direction_10m_dominant
 *   &forecast_days=7
 *   &wind_speed_unit=kmh
 */
export async function fetchWeatherData(location: LocationResult): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    timezone: "auto",  // NON-NEGOTIABLE: always "auto"
    current: [
      "temperature_2m",
      "apparent_temperature",
      "weather_code",
      "is_day",
      "wind_speed_10m",
      "wind_direction_10m",
      "relative_humidity_2m",
    ].join(","),
    hourly: [
      "temperature_2m",
      "weather_code",
      "is_day",
      "precipitation_probability",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "sunrise",
      "sunset",
      "uv_index_max",
      "wind_speed_10m_max",
      "wind_direction_10m_dominant",
    ].join(","),
    forecast_days: "7",
    wind_speed_unit: "kmh",
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
  }

  const raw = (await response.json()) as OpenMeteoForecastResponse;
  return transformForecastResponse(raw, location);
}
