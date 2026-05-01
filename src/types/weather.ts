// ─── Geocoding ────────────────────────────────────────────────────────────────

/**
 * A single result returned by the Open-Meteo Geocoding API or
 * synthesised from a Nominatim reverse-geocoding response.
 */
export interface GeocodingResult {
  id: number;           // Open-Meteo internal ID; use as React key
  name: string;         // City or locality name, e.g. "London"
  country: string;      // Full country name, e.g. "United Kingdom"
  countryCode: string;  // ISO 3166-1 alpha-2, e.g. "GB"
  admin1: string;       // First-level administrative region, e.g. "England"
  latitude: number;     // WGS84 decimal degrees
  longitude: number;    // WGS84 decimal degrees
  timezone: string;     // IANA timezone string, e.g. "Europe/London"
  population: number | null; // May be absent for small localities
}

/**
 * A resolved location selected by the user; active context for all API calls.
 * The timezone must be forwarded to every Open-Meteo request.
 */
export interface LocationResult {
  name: string;         // Display name, e.g. "London, England, GB"
  latitude: number;
  longitude: number;
  timezone: string;     // IANA timezone — forwarded to every API call
}

// ─── Root Weather Payload ─────────────────────────────────────────────────────

/**
 * The fully transformed weather payload for a given location.
 * Sourced from a single Open-Meteo Forecast API call.
 * This is the root data object passed into all weather UI components.
 */
export interface WeatherData {
  location: LocationResult;
  current: CurrentConditions;
  hourly: HourlyForecast[];   // Exactly 24 entries — next 24 hours from now
  daily: DailyForecast[];     // Exactly 7 entries — today + 6 following days
  fetchedAt: number;          // Unix timestamp (ms) when data was received
}

// ─── Current Conditions ───────────────────────────────────────────────────────

/**
 * Snapshot of current weather conditions.
 * All numeric temperature fields are integers (Math.round applied in transform).
 */
export interface CurrentConditions {
  temperature: number;              // °C, integer
  feelsLike: number;                // °C, integer (apparent_temperature)
  weatherCode: number;              // WMO weather interpretation code (0–99)
  isDay: boolean;                   // true = daytime at the location right now
  windSpeed: number;                // km/h, integer
  windDirection: number;            // degrees 0–360
  humidity: number;                 // relative humidity %, integer (0–100)
  precipitationProbability: number; // % for the current day, integer (0–100)
  high: number;                     // today's maximum temperature °C, integer
  low: number;                      // today's minimum temperature °C, integer
}

// ─── Hourly Forecast ──────────────────────────────────────────────────────────

/**
 * One hour's forecast entry.
 * The array in WeatherData.hourly always covers exactly 24 hours
 * starting from the current hour (inclusive), in the location's local time.
 */
export interface HourlyForecast {
  time: string;                     // ISO 8601 local time, e.g. "2026-05-01T14:00"
  hour: number;                     // 0–23, derived from time (for display)
  temperature: number;              // °C, integer
  weatherCode: number;              // WMO weather interpretation code
  isDay: boolean;                   // true = daytime hour at the location
  precipitationProbability: number; // %, integer (0–100); null → 0 in transform
}

// ─── Daily Forecast ───────────────────────────────────────────────────────────

/**
 * One day's forecast entry.
 * The array in WeatherData.daily always covers exactly 7 days starting today.
 */
export interface DailyForecast {
  date: string;                     // ISO 8601 date, e.g. "2026-05-01"
  weatherCode: number;              // WMO code for the day's dominant condition
  high: number;                     // Maximum temperature °C, integer
  low: number;                      // Minimum temperature °C, integer
  precipitationProbability: number; // Max precip probability %, integer; null → 0
  sunrise: string;                  // ISO 8601 local datetime, e.g. "2026-05-01T05:42"
  sunset: string;                   // ISO 8601 local datetime, e.g. "2026-05-01T20:18"
  uvIndexMax: number;               // Maximum UV index (float, rounded to 1dp); null → 0
  windSpeedMax: number;             // Maximum wind speed km/h, integer
  windDirectionDominant: number;    // Dominant wind direction degrees 0–360
}
