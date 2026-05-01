# Functional Requirements Document
## Simple Weather App — WeatherApp

**Version:** 1.0
**Date:** 2026-05-01
**Status:** Active
**Source PRD:** PRD-WeatherApp.md v1.0 (2026-04-29)
**Scope:** Frontend-only SPA — no backend, no database, no server-side APIs

---

## Table of Contents

1. [Overview](#1-overview)
2. [TypeScript Data Models](#2-typescript-data-models)
3. [External API Specifications](#3-external-api-specifications)
4. [localStorage Schema](#4-localstorage-schema)
5. [F0 — Location Search & Detection](#5-f0--location-search--detection)
6. [F1 — Current Conditions Display](#6-f1--current-conditions-display)
7. [F2 — Hourly Forecast](#7-f2--hourly-forecast)
8. [F3 — 7-Day Daily Forecast](#8-f3--7-day-daily-forecast)
9. [F4 — Weather Icons & Visual Indicators](#9-f4--weather-icons--visual-indicators)
10. [F5 — Responsive Layout](#10-f5--responsive-layout)
11. [F6 — Secondary Weather Details Panel](#11-f6--secondary-weather-details-panel)
12. [F7 — Data Freshness & Stale State Handling](#12-f7--data-freshness--stale-state-handling)
13. [F8 — Accessibility (WCAG AA)](#13-f8--accessibility-wcag-aa)
14. [F9 — Attribution & Deployment](#14-f9--attribution--deployment)
15. [Non-Functional Requirements](#15-non-functional-requirements)
16. [Error Handling Reference](#16-error-handling-reference)
17. [Acceptance Criteria Index](#17-acceptance-criteria-index)

---

## 1. Overview

The Simple Weather App is a React 19 + TypeScript single-page application. It has no backend — all state is held in component-local state, TanStack Query's in-memory cache, and `localStorage`. The app consumes three public APIs that require no authentication:

- **Open-Meteo Forecast API** — weather data by latitude/longitude
- **Open-Meteo Geocoding API** — city name → latitude/longitude + autocomplete
- **Nominatim Reverse Geocoding API** — GPS latitude/longitude → human-readable place name

All 10 features (F0–F9) described in the PRD are fully specified in this document. Each feature section contains: description, terminology, sub-features, process steps, inputs, outputs, validation rules, error states, and acceptance criteria.

**Core invariants that apply to every feature:**
- Never render a blank screen — every loading and error path renders visible UI
- All temperatures are displayed as integers (Math.round, never toFixed)
- `timezone=auto` is sent on every Open-Meteo request — non-negotiable
- No API keys appear anywhere in source code or build output
- TypeScript strict mode; zero `any` casts permitted

---

## 2. TypeScript Data Models

These interfaces define the canonical shape of all in-memory data in the application. API response payloads are transformed into these shapes at the boundary and must never leak raw API types into UI components.

```typescript
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
 * A resolved location that has been selected by the user and is being
 * used as the active context for all weather data fetches.
 */
export interface LocationResult {
  name: string;         // Display name, e.g. "London, England, GB"
  latitude: number;
  longitude: number;
  timezone: string;     // IANA timezone — must be forwarded to every API call
}

// ─── Current Conditions ────────────────────────────────────────────────────────

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

/**
 * Snapshot of current weather conditions.
 * All numeric fields are already rounded (integers) where documented.
 */
export interface CurrentConditions {
  temperature: number;           // °C, integer
  feelsLike: number;             // °C, integer (apparent_temperature)
  weatherCode: number;           // WMO weather interpretation code (0–99)
  isDay: boolean;                // true = daytime at the location right now
  windSpeed: number;             // km/h, integer
  windDirection: number;         // degrees 0–360
  humidity: number;              // relative humidity %, integer (0–100)
  precipitationProbability: number; // % for the current day, integer (0–100)
  high: number;                  // today's maximum temperature °C, integer
  low: number;                   // today's minimum temperature °C, integer
}

// ─── Hourly Forecast ──────────────────────────────────────────────────────────

/**
 * One hour's forecast entry.
 * The array in WeatherData.hourly always covers exactly the next 24 hours
 * starting from the current hour (inclusive), using the location's local time.
 */
export interface HourlyForecast {
  time: string;                  // ISO 8601 local time, e.g. "2026-05-01T14:00"
  hour: number;                  // 0–23, derived from time (for display)
  temperature: number;           // °C, integer
  weatherCode: number;           // WMO weather interpretation code
  isDay: boolean;                // true = this hour is a daytime hour at location
  precipitationProbability: number; // %, integer (0–100)
}

// ─── Daily Forecast ───────────────────────────────────────────────────────────

/**
 * One day's forecast entry.
 * The array in WeatherData.daily always covers exactly 7 days starting today.
 */
export interface DailyForecast {
  date: string;                  // ISO 8601 date string, e.g. "2026-05-01"
  weatherCode: number;           // WMO code representing the day's dominant condition
  high: number;                  // Maximum temperature °C, integer
  low: number;                   // Minimum temperature °C, integer
  precipitationProbability: number; // Max precipitation probability for the day, %, integer
  sunrise: string;               // ISO 8601 local datetime, e.g. "2026-05-01T05:42"
  sunset: string;                // ISO 8601 local datetime, e.g. "2026-05-01T20:18"
  uvIndexMax: number;            // Maximum UV index for the day, float rounded to 1dp
  windSpeedMax: number;          // Maximum wind speed km/h, integer
  windDirectionDominant: number; // Dominant wind direction degrees 0–360
}
```

**Unit conversion notes:**
- All temperatures stored internally in °C. Fahrenheit is a display-layer concern only, computed as `Math.round((celsius * 9/5) + 32)` at render time.
- Wind speed stored in km/h. Metric / imperial conversion is a display concern only.
- Visibility stored in km. Conversion to miles is a display concern only.

---

## 3. External API Specifications

### 3.1 Open-Meteo Geocoding API

**Purpose:** Converts a city name string into geographic coordinates (lat/lon) with autocomplete suggestions.

**Base URL:** `https://geocoding-api.open-meteo.com/v1/search`

**Authentication:** None required.

**Rate limits:** None documented for non-commercial use; TanStack Query debounce + `staleTime` prevents abuse.

#### Request

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Partial or full city name typed by the user |
| `count` | number | No | Max results to return; use `5` for autocomplete dropdown |
| `language` | string | No | Result language; use `"en"` |
| `format` | string | No | Always `"json"` |

**Example request:**
```
GET https://geocoding-api.open-meteo.com/v1/search?name=London&count=5&language=en&format=json
```

#### Response

```typescript
interface OpenMeteoGeocodingResponse {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    feature_code: string;
    country_code: string;
    admin1_id: number;
    admin2_id?: number;
    admin3_id?: number;
    admin4_id?: number;
    timezone: string;
    population?: number;
    country_id: number;
    country: string;
    admin1?: string;
    admin2?: string;
    admin3?: string;
    admin4?: string;
  }>;
  generationtime_ms: number;
}
```

**No-results case:** The API returns `{}` (empty object, no `results` key) when no city matches the query. The app must handle `response.results === undefined` as a valid "no results" state — not an error.

**Transformation to `GeocodingResult[]`:** Map each element of `results` to `GeocodingResult`, populating `admin1` from `result.admin1 ?? ""`, `population` from `result.population ?? null`.

---

### 3.2 Open-Meteo Forecast API

**Purpose:** Fetches current conditions, hourly forecast, and daily forecast for a given lat/lon.

**Base URL:** `https://api.open-meteo.com/v1/forecast`

**Authentication:** None required.

**Rate limits:** None documented for non-commercial use.

#### Request Parameters

| Parameter | Type | Required | Value / Notes |
|-----------|------|----------|---------------|
| `latitude` | float | Yes | From resolved `LocationResult.latitude` |
| `longitude` | float | Yes | From resolved `LocationResult.longitude` |
| `timezone` | string | **Yes — always** | `"auto"` — non-negotiable; must never be omitted |
| `current` | string | Yes | Comma-separated list of current variables (see below) |
| `hourly` | string | Yes | Comma-separated list of hourly variables (see below) |
| `daily` | string | Yes | Comma-separated list of daily variables (see below) |
| `forecast_days` | number | Yes | `7` |
| `wind_speed_unit` | string | No | `"kmh"` (default) |

**`current` variables requested:**
```
temperature_2m,apparent_temperature,weather_code,is_day,
wind_speed_10m,wind_direction_10m,relative_humidity_2m
```

**`hourly` variables requested:**
```
temperature_2m,weather_code,is_day,precipitation_probability
```

**`daily` variables requested:**
```
weather_code,temperature_2m_max,temperature_2m_min,
precipitation_probability_max,sunrise,sunset,
uv_index_max,wind_speed_10m_max,wind_direction_10m_dominant
```

**Example request:**
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude=51.5085
  &longitude=-0.1257
  &timezone=auto
  &current=temperature_2m,apparent_temperature,weather_code,is_day,wind_speed_10m,wind_direction_10m,relative_humidity_2m
  &hourly=temperature_2m,weather_code,is_day,precipitation_probability
  &daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max,wind_speed_10m_max,wind_direction_10m_dominant
  &forecast_days=7
```

#### Response Shape

```typescript
interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;             // IANA timezone resolved by Open-Meteo
  timezone_abbreviation: string;
  elevation: number;

  current_units: Record<string, string>;
  current: {
    time: string;               // ISO 8601 local datetime
    interval: number;           // seconds (typically 900)
    temperature_2m: number;
    apparent_temperature: number;
    weather_code: number;
    is_day: number;             // 1 = day, 0 = night
    wind_speed_10m: number;
    wind_direction_10m: number;
    relative_humidity_2m: number;
  };

  hourly_units: Record<string, string>;
  hourly: {
    time: string[];             // Array of ISO 8601 local datetimes, 168 entries (7 days × 24h)
    temperature_2m: number[];
    weather_code: number[];
    is_day: number[];           // 1 or 0 per hour
    precipitation_probability: (number | null)[]; // null possible for distant hours
  };

  daily_units: Record<string, string>;
  daily: {
    time: string[];             // Array of ISO 8601 date strings, 7 entries
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: (number | null)[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: (number | null)[];
    wind_speed_10m_max: number[];
    wind_direction_10m_dominant: number[];
  };
}
```

#### Transformation to `WeatherData`

The raw API response must be transformed at the data-fetching layer (not in components):

1. **Current conditions:** Map `current.*` fields directly; `is_day` cast `1 → true`, `0 → false`; all temperatures rounded via `Math.round()`; `precipitationProbability` sourced from `daily.precipitation_probability_max[0]` (today's value). ⚠️ **Important:** `precipitation_probability` is NOT a variable in the Open-Meteo `current` block — it does not exist there and querying it will return `undefined`. Always source today's precipitation probability exclusively from `daily.precipitation_probability_max[0]`.
2. **Today high/low:** `daily.temperature_2m_max[0]` and `daily.temperature_2m_min[0]`.
3. **Hourly array:** Slice `hourly.*` arrays to find the index of the current hour, then take 24 entries forward. `null` precipitation values default to `0`. All temperatures rounded.
4. **Daily array:** Take indices 0–6. `null` values for `precipitation_probability_max` and `uv_index_max` default to `0`. All temperatures rounded.
5. **`fetchedAt`:** Set to `Date.now()` immediately after the fetch resolves successfully.

---

### 3.3 Nominatim Reverse Geocoding API

**Purpose:** Converts GPS coordinates (latitude/longitude) into a human-readable place name when the user activates geolocation.

**Base URL:** `https://nominatim.openstreetmap.org/reverse`

**Authentication:** None required.

**Usage policy:** Nominatim requires a descriptive `User-Agent` header identifying the application. The app must send:
```
User-Agent: SimpleWeatherApp/1.0 (https://github.com/your-org/weather-app)
```
(Replace with the actual deployed URL before production.)

**Rate limit:** Maximum 1 request per second per the Nominatim Usage Policy. Geolocation is triggered at most once per user interaction — this limit will never be approached in normal use.

#### Request

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lat` | float | Yes | GPS latitude from `GeolocationPosition.coords.latitude` |
| `lon` | float | Yes | GPS longitude from `GeolocationPosition.coords.longitude` |
| `format` | string | Yes | Always `"json"` |
| `zoom` | number | No | `10` — returns city-level precision |

**Example request:**
```
GET https://nominatim.openstreetmap.org/reverse?lat=51.5085&lon=-0.1257&format=json&zoom=10
```

#### Response Shape

```typescript
interface NominatimReverseResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;             // String representation of latitude
  lon: string;             // String representation of longitude
  display_name: string;    // Full human-readable address
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country: string;
    country_code: string;
    postcode?: string;
  };
  boundingbox: string[];
}
```

**Transformation to `LocationResult`:** After receiving the Nominatim response, the app must immediately call the Open-Meteo Geocoding API with the resolved city name to obtain the canonical `timezone` string. The Nominatim response does not include timezone information. The city display name is constructed as:
```
(address.city ?? address.town ?? address.village ?? display_name.split(",")[0])
```

---

## 4. localStorage Schema

The app persists exactly two keys in `localStorage`. All reads include a `try/catch` to handle `SecurityError` (private browsing mode) and `JSON.parse` failures silently — falling back to defaults.

### 4.1 Unit Preference

**Key:** `weather_unit_preference`

**Type:** `"celsius"` | `"fahrenheit"`

**Default (missing key):** `"celsius"`

**Written:** Every time the user toggles the °C/°F control.

**Read:** On application mount; the toggle control initialises from this value.

```typescript
type UnitPreference = "celsius" | "fahrenheit";

function readUnitPreference(): UnitPreference {
  try {
    const raw = localStorage.getItem("weather_unit_preference");
    if (raw === "celsius" || raw === "fahrenheit") return raw;
  } catch {
    // SecurityError in private browsing — fall through to default
  }
  return "celsius";
}

function writeUnitPreference(unit: UnitPreference): void {
  try {
    localStorage.setItem("weather_unit_preference", unit);
  } catch {
    // Quota exceeded or SecurityError — silently ignore
  }
}
```

---

### 4.2 Recent Searches

**Key:** `weather_recent_searches`

**Type:** JSON-serialised array of `RecentSearch` objects.

**Maximum entries:** 5. When a new location is added and the array already has 5 entries, the oldest entry (index 4) is removed before prepending the new one.

**Deduplication:** Before prepending, check if an entry with the same `latitude` and `longitude` (within ±0.001 degrees) already exists. If it does, remove the existing entry first, then prepend the new one (move-to-front behaviour).

**Default (missing key):** `[]`

```typescript
interface RecentSearch {
  name: string;         // Display name, e.g. "London, England, GB"
  latitude: number;
  longitude: number;
  timezone: string;
  savedAt: number;      // Unix timestamp ms — for display as "searched X ago" (future v2 use)
}

const RECENT_SEARCHES_KEY = "weather_recent_searches";
const MAX_RECENT_SEARCHES = 5;

function readRecentSearches(): RecentSearch[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidRecentSearch); // type guard validates shape
  } catch {
    return [];
  }
}

function writeRecentSearch(entry: RecentSearch): void {
  try {
    const existing = readRecentSearches();
    const deduped = existing.filter(
      (r) => Math.abs(r.latitude - entry.latitude) > 0.001 ||
             Math.abs(r.longitude - entry.longitude) > 0.001
    );
    const updated = [entry, ...deduped].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // Quota exceeded or SecurityError — silently ignore
  }
}
```

---

## 5. F0 — Location Search & Detection

### Description

F0 is the entry point of the application. It provides two paths for a user to specify a location: a city name text search with autocomplete suggestions (primary path, always available), and an optional GPS geolocation button (secondary, opt-in only). The selected location becomes the active context for all weather data displayed in F1–F7. Recent searches are persisted in `localStorage` and offered as quick-select chips.

### Terminology

- **Search input:** The always-visible text field where the user types a city name.
- **Autocomplete suggestions:** A dropdown of up to 5 `GeocodingResult` entries returned by the Open-Meteo Geocoding API.
- **Active location:** The `LocationResult` currently selected; all weather data fetches use its lat/lon and timezone.
- **Geolocation:** The Browser Geolocation API (`navigator.geolocation`); opt-in only, never gated.
- **Reverse geocoding:** Converting GPS coordinates to a display name via Nominatim.
- **Recent searches:** Up to 5 past `RecentSearch` entries persisted in `localStorage`.
- **Quick-select chips:** Small interactive buttons below the search input listing recent searches.

### Sub-features

- Text input with live autocomplete (debounced, 2+ characters required)
- GPS geolocation button with opt-in permission request
- Reverse geocoding of GPS coordinates via Nominatim
- Recent searches persisted in `localStorage`, rendered as chips
- Clear/reset control to return to search state

### Process

1. On app mount, the search input is focused automatically (desktop) or visible above the fold (mobile).
2. User types in the search input. No API call is made until 2 characters have been entered.
3. After 2+ characters are present, the app debounces 300ms, then calls the Open-Meteo Geocoding API.
4. While the geocoding call is in flight, a loading spinner appears inside the input (not replacing the input).
5. Up to 5 suggestion items are rendered in a dropdown below the input. Each item shows city name, region, and country.
6. User selects a suggestion by click, keyboard `Enter`, or keyboard navigation (`↑`/`↓` arrows).
7. The dropdown closes. The selected `GeocodingResult` is transformed into a `LocationResult`. The search input displays the selected location name.
8. The `LocationResult` is written to application state. TanStack Query fetches `WeatherData` for the location. The selected location is written to `localStorage` recent searches via `writeRecentSearch()`.
9. **Alternate path — GPS button:** User clicks the GPS icon button. The app calls `navigator.geolocation.getCurrentPosition()`.
10. The browser displays its native permission prompt. If the user grants permission, the GPS coordinates are passed to Nominatim for reverse geocoding, then the resolved city name is used to query the Open-Meteo Geocoding API to obtain the canonical `LocationResult` (with timezone).
11. If the user denies geolocation permission (or the API throws `PERMISSION_DENIED`), the search input remains fully functional. No error is shown. No blank screen. The GPS button resets to its idle state.
12. While GPS acquisition is pending, the GPS button shows a loading spinner and is disabled.
13. Recent search chips are rendered below the input at all times when `readRecentSearches()` returns a non-empty array. Clicking a chip immediately loads weather for that location (no autocomplete step needed).

### Inputs

- `query` (string): City name typed by the user; minimum 2 characters before triggering geocoding
- `gpsCoordinates` (object, optional): `{ latitude: number; longitude: number }` from `GeolocationPosition.coords`
- `recentSelectionIndex` (number, optional): Index 0–4 of the chosen chip from recent searches

### Outputs

- `LocationResult` written to application state, triggering F1–F7 data fetch
- `RecentSearch` entry written to `localStorage`
- Autocomplete dropdown rendered with `GeocodingResult[]`

### Validation Rules

- Search query must be at least 2 characters before the geocoding API is called
- Search query is trimmed of leading/trailing whitespace before API call
- If the Open-Meteo Geocoding API returns no results (`results` key absent), a "City not found — try a different spelling" inline message is shown below the input
- Latitude must be in range −90 to +90; longitude in range −180 to +180 (validated on GPS coordinates before use)
- GPS coordinates with accuracy > 5000m are accepted but logged to console (no user-facing warning in v1)

### Error States

| Scenario | Trigger | UI Response |
|----------|---------|-------------|
| No geocoding results | API returns `{}` (no `results`) | Inline message: "City not found — try a different spelling" below input |
| Geocoding API network error | `fetch()` rejects | Inline message: "Search unavailable — check your connection" below input |
| Geolocation permission denied | `PERMISSION_DENIED` error code | GPS button resets to idle; no error shown; search input remains usable |
| Geolocation position unavailable | `POSITION_UNAVAILABLE` error code | GPS button resets to idle; inline message below search input: "Location unavailable — try searching manually" |
| Geolocation timeout | `TIMEOUT` error code (after 10s) | GPS button resets to idle; inline message below search input: "Location timed out — try searching manually" |
| Nominatim reverse geocoding fails | `fetch()` rejects | GPS button resets to idle; inline message: "Couldn't detect location name — try searching manually" |
| `localStorage` read fails | `SecurityError` or `JSON.parse` error | Recent search chips are not rendered; no error shown; app functions normally |

### Acceptance Criteria (F0)

- **AC-F0-01:** Typing fewer than 2 characters produces no API call (verified via network tab).
- **AC-F0-02:** Typing 2+ characters triggers the geocoding API after a 300ms debounce (no call on every keystroke).
- **AC-F0-03:** Up to 5 autocomplete suggestions appear; each shows city name, region, and country.
- **AC-F0-04:** Selecting a suggestion closes the dropdown, populates the input with the location name, and triggers a weather data fetch.
- **AC-F0-05:** Denying geolocation permission never produces a blank screen or stuck loading state.
- **AC-F0-06:** GPS resolution (from button press to weather data visible) completes without errors when permission is granted.
- **AC-F0-07:** Selecting a location appends it to `localStorage` recent searches (max 5 entries, move-to-front deduplication).
- **AC-F0-08:** Recent search chips appear on page load when `localStorage` contains saved entries; clicking a chip loads weather immediately.
- **AC-F0-09:** "City not found" message appears when geocoding returns no results.
- **AC-F0-10:** The GPS button has a visible loading state while geolocation is pending and is disabled during that period.
- **AC-F0-11:** The autocomplete dropdown is keyboard-navigable (`↑`/`↓` to move, `Enter` to select, `Escape` to close).
- **AC-F0-12:** The search input is wrapped in a `<form>` element and submitting the form (pressing `Enter` with first suggestion highlighted) selects the top suggestion.

---

## 6. F1 — Current Conditions Display

### Description

F1 is the primary content of the application — the "hero" section that answers "what is the weather right now?" It displays the dominant data points above the fold for both mobile and desktop viewports. All values must be visible without scrolling. The hero section uses a condition-aware background gradient (specified in F4) that updates with weather state and time of day.

### Terminology

- **Hero section:** The topmost content area; always visible without scrolling.
- **Current temperature:** The `current.temperature` value from `WeatherData`, displayed as an integer.
- **Feels-like temperature:** The `current.feelsLike` value; the perceived temperature accounting for wind and humidity.
- **Condition label:** Human-readable description of the WMO weather code, e.g. "Partly Cloudy".
- **Condition icon:** SVG icon representing the weather code and time-of-day; fully specified in F4.
- **High/Low pair:** `current.high` / `current.low` — the forecast maximum and minimum for today.
- **Precipitation probability:** `current.precipitationProbability` — today's maximum precipitation likelihood.
- **Unit toggle:** A visible two-state control (°C | °F) on the main screen.
- **Skeleton state:** A layout-preserving placeholder rendered while data is fetching.

### Sub-features

- Large dominant temperature display (integer, unit-aware)
- Feels-like secondary temperature
- Condition icon + text label pair
- Today's high/low temperature pair
- Precipitation probability for today
- Humidity and wind speed supporting data points
- °C/°F unit toggle
- Skeleton loading state
- Error state with retry action
- Condition-aware background gradient (behaviour defined in F4)

### Process

1. After F0 resolves a `LocationResult`, TanStack Query issues the Open-Meteo Forecast API call.
2. While the fetch is in flight (`isLoading === true`), the skeleton loading state is rendered in the hero section. The skeleton preserves the layout shape of the real content (temperature block, icon, data points) using grey placeholder shapes.
3. When data resolves successfully, the skeleton is replaced by the live hero content:
   - Temperature value rendered at heading scale (e.g., `text-6xl` or equivalent); current unit appended (`°C` or `°F`).
   - Feels-like temperature rendered below the main temperature as `"Feels like X°"`.
   - Condition icon (SVG, 64×64px or larger) and condition label (string) rendered side by side.
   - High/Low pair rendered as `"H: X° L: Y°"`.
   - Precipitation probability rendered as `"💧 X%"` or equivalent icon + percentage.
   - Humidity rendered as `"Humidity: X%"`.
   - Wind speed rendered as `"Wind: X km/h"` (or mph if °F unit is active).
4. The °C/°F toggle is visible at all times in the hero section, including during skeleton and error states.
5. Toggling the unit updates all temperature displays app-wide (hero, hourly, daily) immediately without re-fetching data. The new preference is written to `localStorage`.
6. If the fetch fails (`isError === true`), the skeleton is replaced by an error state containing an error message and a "Try again" button that triggers a manual refetch via TanStack Query's `refetch()`.

### Inputs

- `WeatherData.current` (CurrentConditions): Resolved weather data for the active location
- `unit` ("celsius" | "fahrenheit"): Current unit preference from `localStorage` / component state

### Outputs

- Hero section rendered with all data points visible above the fold
- Unit toggle written to `localStorage` on change
- `refetch()` triggered on user pressing "Try again"

### Validation Rules (Display Layer)

- Temperature displayed as `Math.round()` integer — never a decimal
- If `feelsLike` rounds to the same integer as `temperature`, display both values without change (do not hide the feels-like)
- `precipitationProbability` displayed as a whole-number percentage (0–100); the `%` symbol is always shown
- `humidity` displayed as a whole-number percentage (0–100)
- Wind speed displayed in km/h when unit is `"celsius"`, in mph when unit is `"fahrenheit"` (conversion: `Math.round(kmh * 0.621371)`)
- Condition label must always accompany the condition icon — never icon-only
- Condition icon must always use the correct day/night variant based on `current.isDay`

### Error States

| Scenario | Trigger | UI Response |
|----------|---------|-------------|
| API fetch fails | `isError === true` from TanStack Query | Error message: "Unable to load weather for [location name]. Check your connection." + "Try again" button |
| Data takes > 3s | `isLoading` still true after 3 seconds | Skeleton persists; no timeout error in v1 (TanStack Query handles retries) |
| Unknown WMO weather code | `weatherCode` not in mapping table | Fall back to code 0 (Clear Sky) icon and label |

### Acceptance Criteria (F1)

- **AC-F1-01:** The current temperature is displayed as an integer (no decimal point) at all times.
- **AC-F1-02:** All hero data points (temperature, feels-like, condition, high/low, precipitation, humidity, wind) are visible above the fold at 375px viewport width without scrolling.
- **AC-F1-03:** The °C/°F toggle is visible on the main screen at all times (not in a settings menu).
- **AC-F1-04:** Toggling °C/°F updates all temperature values app-wide instantly without a network request.
- **AC-F1-05:** The unit preference survives a page reload (read from `localStorage` on mount).
- **AC-F1-06:** A skeleton placeholder (not a blank screen or spinner-only) is shown while data is loading.
- **AC-F1-07:** An error message and "Try again" button are shown when the weather fetch fails (never a blank screen).
- **AC-F1-08:** The condition icon uses the correct day variant when `isDay === true` and the night variant when `isDay === false`.
- **AC-F1-09:** The condition label (text) is always rendered alongside the condition icon.
- **AC-F1-10:** Wind speed is shown in km/h when °C is active and mph when °F is active.

---

## 7. F2 — Hourly Forecast

### Description

F2 provides a horizontally scrollable strip of forecast cards covering the next 24 hours from the current time. It is a first-class component on the main screen — not hidden behind a tab or paywall. Each card gives the commuter persona the information they need to plan around weather windows: time, condition, temperature, and precipitation probability.

### Terminology

- **Hourly card:** A single forecast unit representing one clock hour; minimum 80px wide.
- **Scroll strip:** The horizontal scrolling container holding all 24 hourly cards.
- **Current hour card:** The first card in the strip, representing the current hour; may be visually highlighted.
- **Precipitation probability:** The `precipitationProbability` value for that specific hour (0–100%).

### Sub-features

- Horizontal scroll container with 24 forecast cards
- Per-card display: hour label, condition icon (day/night), temperature, precipitation probability
- Current-hour card visual highlight
- Touch-friendly horizontal scroll (no scrollbar on mobile, visible on desktop)
- Scroll snap points for clean card-by-card navigation

### Process

1. After `WeatherData` is available, the hourly strip is rendered from `WeatherData.hourly` (24 entries).
2. The first card corresponds to the current hour (index 0 of the pre-sliced array).
3. Each card renders:
   - **Hour label:** Formatted as `"2 PM"` or `"14:00"` depending on locale; uses `Intl.DateTimeFormat` with the location's `timezone` — never the browser's local timezone.
   - **Condition icon:** 32×32px SVG; day/night variant determined by `HourlyForecast.isDay`.
   - **Temperature:** Integer with `°` unit suffix.
   - **Precipitation probability:** Integer percentage with `%` suffix; always shown even if 0%.
4. The scroll container enables horizontal scroll via mouse wheel, touch swipe, and keyboard (Tab to focus, then arrow keys to scroll within the component).
5. The strip does not reload data from the API — it uses the same `WeatherData` already fetched by F1.

### Inputs

- `WeatherData.hourly` (HourlyForecast[]): Array of exactly 24 hourly entries
- `unit` ("celsius" | "fahrenheit"): Current unit preference

### Outputs

- Rendered horizontal scroll strip of 24 hourly forecast cards

### Validation Rules

- Exactly 24 cards are always rendered (the transformation layer guarantees this array length)
- If `precipitationProbability` for a given hour is `null` in the raw API response, it is transformed to `0` before rendering — never rendered as `null` or `"-"`
- Hour labels must use the location's timezone (not the user's device timezone)
- Temperature must be displayed as an integer (Math.round applied in transformation layer, not in the component)
- Day/night icon variant must reflect `HourlyForecast.isDay`, not the device's local time

### Error States

| Scenario | Trigger | UI Response |
|----------|---------|-------------|
| Hourly data missing from WeatherData | WeatherData.hourly is empty array | Strip is not rendered; no error state shown (graceful hide) |
| Icon for unknown WMO code | weatherCode not in icon mapping | Fall back to code 0 icon |

### Acceptance Criteria (F2)

- **AC-F2-01:** The hourly strip renders exactly 24 cards.
- **AC-F2-02:** Each card shows: hour label (correct local timezone), condition icon, temperature (integer), and precipitation probability (integer % — always shown).
- **AC-F2-03:** Hour labels use the selected location's timezone, not the user's device timezone.
- **AC-F2-04:** All card interactive elements have a minimum touch target of 44×44px.
- **AC-F2-05:** The strip is horizontally scrollable on both touch and mouse devices.
- **AC-F2-06:** Day/night icon variants are correct for each hour based on `HourlyForecast.isDay`.
- **AC-F2-07:** Precipitation probability is shown on every card; never omitted even when value is 0%.
- **AC-F2-08:** Toggling °C/°F updates all hourly temperatures without a network request.

---

## 8. F3 — 7-Day Daily Forecast

### Description

F3 provides a 7-day daily forecast list and a temperature trend visualisation using Recharts. It is the primary planning tool for the Outdoor Enthusiast persona. The 7-day list and the chart are derived from the same `WeatherData` fetch as F1 and F2 — no additional API call is made.

### Terminology

- **Daily row:** A single horizontal row representing one full calendar day.
- **Temperature trend chart:** A Recharts `AreaChart` rendering the `high` and `low` temperature curves across the 7 days.
- **Precipitation probability:** The daily maximum probability (`precipitation_probability_max`) from the Open-Meteo response.
- **Abbreviated day name:** Three-letter day name (Mon, Tue, Wed…) derived from `DailyForecast.date` using `Intl.DateTimeFormat`.

### Sub-features

- 7 daily rows (day name, icon, high, low, precipitation probability)
- Recharts `AreaChart` temperature trend (high/low curves)
- Precipitation `BarChart` (optional at P2, but the `AreaChart` is required)
- Consistent high-first / low-second ordering
- Data sourced from the same WeatherData as F1/F2

### Process

1. After `WeatherData` is available, the daily forecast section renders 7 `DailyForecast` rows.
2. Each row renders:
   - **Day name:** `"Mon"`, `"Tue"`, etc. Today's row uses `"Today"` as the label. Labels derived via `Intl.DateTimeFormat({ weekday: 'short' })` using location's timezone.
   - **Condition icon:** 32×32px SVG; always the daytime variant for daily rows (no night variant for daily forecast).
   - **High temperature:** Integer with `°` unit suffix; displayed first (left or top).
   - **Low temperature:** Integer with `°` unit suffix; displayed second (right or bottom), visually de-emphasised (lighter colour or smaller size).
   - **Precipitation probability:** Integer percentage with `%` suffix.
3. Below (or alongside) the daily list, a Recharts `AreaChart` renders:
   - X-axis: abbreviated day labels (7 points).
   - Y-axis: temperature in the active unit; auto-scaled to data range.
   - Two area series: `high` temperatures and `low` temperatures.
   - Chart has a semantic accessible fallback (see F8).
4. Unit toggle applies to chart Y-axis labels and row temperature values simultaneously.

### Inputs

- `WeatherData.daily` (DailyForecast[]): Array of exactly 7 daily entries
- `unit` ("celsius" | "fahrenheit"): Current unit preference

### Outputs

- 7 rendered daily forecast rows
- Recharts AreaChart temperature trend

### Validation Rules

- Exactly 7 daily rows are always rendered
- High temperature is always displayed before (or above) low temperature
- If `precipitationProbability` is `null` after transformation (defaulting to 0), it renders as `"0%"` — not `"-"` or blank
- Day labels use `Intl.DateTimeFormat` with location's timezone — not `Date.toLocaleDateString()` with browser timezone
- The Recharts chart Y-axis must re-scale correctly when toggling units (°C ↔ °F)

### Error States

| Scenario | Trigger | UI Response |
|----------|---------|-------------|
| Daily data missing | WeatherData.daily is empty array | Section hidden gracefully; no error state |
| Recharts render failure | Uncaught Recharts exception | Error boundary catches; fallback: raw data table rendered instead of chart |
| Unknown WMO code | weatherCode not in icon mapping | Fall back to code 0 icon |

### Acceptance Criteria (F3)

- **AC-F3-01:** Exactly 7 daily rows are rendered.
- **AC-F3-02:** Today's row is labelled "Today", not the abbreviated day name.
- **AC-F3-03:** Each row shows: day name, condition icon (daytime variant), high temp, low temp, precipitation probability.
- **AC-F3-04:** High temperature is always displayed before/above low temperature.
- **AC-F3-05:** Precipitation probability is shown on every row; never omitted even when 0%.
- **AC-F3-06:** The Recharts AreaChart renders high and low temperature curves across 7 days.
- **AC-F3-07:** The chart Y-axis updates correctly when the user toggles °C/°F.
- **AC-F3-08:** The chart has an accessible fallback for screen readers (see AC-F8-06).
- **AC-F3-09:** Day labels use the location's timezone, not the browser's local timezone.

---

## 9. F4 — Weather Icons & Visual Indicators

### Description

F4 defines the complete visual language for weather state communication across the app. Every data display that shows a weather condition must use an icon from this system. Icons have day and night variants. The hero section background gradient reacts to both weather state and time of day. All icon + background combinations meet WCAG 1.4.3 contrast requirements.

### Terminology

- **WMO weather code:** The integer code (0–99) returned by Open-Meteo's `weather_code` field, following WMO Weather Interpretation Code definitions.
- **Day variant:** Icon representing a weather condition during daylight hours.
- **Night variant:** Icon representing the same condition during nighttime hours.
- **Condition group:** A grouping of WMO codes that share an icon (e.g., codes 61, 63, 65 all represent rain at different intensities).
- **Background gradient:** A CSS `linear-gradient` or `background` property applied to the hero section container based on the current condition group and time of day.

### Sub-features

- Full WMO code 0–99 icon coverage
- Day/night icon variants for clear, partly cloudy, and overcast codes
- Consistent icon usage across all forecast components
- Condition-aware hero background gradient
- WCAG contrast compliance for all gradient + text combinations

### WMO Weather Code → Condition Mapping

| WMO Code(s) | Condition Group | Day Icon | Night Icon |
|-------------|----------------|----------|------------|
| 0 | Clear Sky | `sun` | `moon` |
| 1 | Mainly Clear | `sun-cloud` | `moon-cloud` |
| 2 | Partly Cloudy | `cloud-sun` | `cloud-moon` |
| 3 | Overcast | `cloud` | `cloud` |
| 45, 48 | Fog / Icy Fog | `fog` | `fog` |
| 51, 53, 55 | Drizzle | `drizzle` | `drizzle` |
| 56, 57 | Freezing Drizzle | `freezing-drizzle` | `freezing-drizzle` |
| 61, 63, 65 | Rain | `rain` | `rain` |
| 66, 67 | Freezing Rain | `freezing-rain` | `freezing-rain` |
| 71, 73, 75 | Snowfall | `snow` | `snow` |
| 77 | Snow Grains | `snow-grains` | `snow-grains` |
| 80, 81, 82 | Rain Showers | `showers` | `showers` |
| 85, 86 | Snow Showers | `snow-showers` | `snow-showers` |
| 95 | Thunderstorm | `thunderstorm` | `thunderstorm` |
| 96, 99 | Thunderstorm + Hail | `thunderstorm-hail` | `thunderstorm-hail` |
| *Unknown* | Fallback | `sun` (code 0) | `moon` (code 0) |

**Implementation note:** The WMO code mapping is defined as a plain TypeScript object (`const WMO_CODE_MAP: Record<number, { label: string; dayIcon: string; nightIcon: string }>`) in a dedicated `weatherCodes.ts` utility file. Components import only this map and `getConditionInfo(code: number, isDay: boolean)` — never switch-case inline logic.

### Condition Label Strings

| Condition Group | Display Label |
|----------------|---------------|
| Clear Sky | "Clear Sky" |
| Mainly Clear | "Mainly Clear" |
| Partly Cloudy | "Partly Cloudy" |
| Overcast | "Overcast" |
| Fog / Icy Fog | "Foggy" |
| Drizzle | "Drizzle" |
| Freezing Drizzle | "Freezing Drizzle" |
| Rain | "Rain" |
| Freezing Rain | "Freezing Rain" |
| Snowfall | "Snow" |
| Snow Grains | "Snow Grains" |
| Rain Showers | "Showers" |
| Snow Showers | "Snow Showers" |
| Thunderstorm | "Thunderstorm" |
| Thunderstorm + Hail | "Thunderstorm with Hail" |

### Hero Background Gradient Palette

The hero background is a CSS `linear-gradient`. Gradients are selected from this matrix based on condition group and `isDay`. All foreground text must achieve ≥ 4.5:1 contrast ratio against the gradient (measure at the darkest and lightest points).

| Condition Group | Day Gradient | Night Gradient |
|----------------|-------------|----------------|
| Clear | `#74b9ff → #0984e3` (sky blue) | `#2d3436 → #0a0a2e` (deep navy) |
| Mainly Clear / Partly Cloudy | `#a29bfe → #74b9ff` (soft blue) | `#353b48 → #1e1e3f` (muted indigo) |
| Overcast | `#b2bec3 → #636e72` (grey) | `#3d3d3d → #1a1a1a` (dark grey) |
| Fog | `#dfe6e9 → #b2bec3` (light grey) | `#4a4a5a → #2d2d3d` (dim purple-grey) |
| Drizzle / Rain / Showers | `#74b9ff → #0652DD` (rain blue) | `#2c3e50 → #1a252f` (dark blue-grey) |
| Freezing Drizzle / Freezing Rain | `#dfe6e9 → #74b9ff` (icy) | `#2c3e50 → #1a252f` |
| Snow / Snow Grains / Snow Showers | `#dfe6e9 → #a29bfe` (snow white-lavender) | `#353b48 → #1e1e3f` |
| Thunderstorm | `#636e72 → #2d3436` (storm grey) | `#1a1a2e → #0a0a1e` (near black) |
| Thunderstorm + Hail | `#636e72 → #2d3436` | `#1a1a2e → #0a0a1e` |

**Text colour on gradients:**
- Day gradients: use `#1a1a2e` (near-black) for body text, white for large heading text if the gradient dark end is used as background.
- Night gradients: use `#ffffff` or `#f5f5f5` for all text.
- All combinations must be manually verified with a contrast analyser before ship (see AC-F4-05).

### Process

1. When `WeatherData.current` is available, `getConditionInfo(current.weatherCode, current.isDay)` is called.
2. The returned day/night icon string and gradient key are applied to the hero section.
3. The same `getConditionInfo()` function is called for each hourly card (using `HourlyForecast.isDay`) and each daily row (always `isDay = true` for daily rows).
4. Icons are rendered as `<img>` or inline `<svg>` elements with `alt=""` and a visually-adjacent `<span>` containing the condition label (satisfies WCAG 1.4.1 — no colour-only information).

### Acceptance Criteria (F4)

- **AC-F4-01:** All WMO codes 0–99 map to a condition icon (no unhandled codes produce a broken image).
- **AC-F4-02:** Unknown WMO codes fall back to the clear sky / clear night icon without a runtime error.
- **AC-F4-03:** Condition icons use the correct day/night variant in all contexts (hero, hourly, daily).
- **AC-F4-04:** Daily forecast rows always use daytime icon variants.
- **AC-F4-05:** All hero background gradient + text colour combinations achieve ≥ 4.5:1 contrast ratio (manual audit passed before production deploy).
- **AC-F4-06:** The hero gradient updates when the user searches a new location.
- **AC-F4-07:** A weather condition is never communicated by colour alone — icon and text label always appear together.

---

## 10. F5 — Responsive Layout

### Description

F5 ensures the app is usable on every viewport from 375px (smallest common smartphone) to 1280px+ (desktop). The implementation is mobile-first: base styles target mobile, Tailwind responsive prefixes add desktop enhancements. There is no separate mobile codebase or user-agent detection.

### Terminology

- **Mobile breakpoint:** 375px–767px; single-column layout.
- **Tablet breakpoint:** 768px–1023px (`md:` in Tailwind).
- **Desktop breakpoint:** 1024px+ (`lg:` in Tailwind).
- **Touch target:** Any interactive element (button, card, toggle) must be at least 44×44px in both dimensions.
- **Horizontal overflow:** Any element that causes a horizontal scrollbar on the document body (not inside the hourly strip — that is intentional horizontal scroll).

### Layout Specifications

#### Mobile (375px–767px)

- Single-column stack, top to bottom: search bar → hero → hourly strip → daily list → details panel → footer
- Hero section: temperature takes full width; icon and condition label centred below
- Hourly strip: full width, horizontally scrollable; cards do not wrap
- Daily list: full width; each row spans the viewport
- All tap targets ≥ 44×44px (enforced with Tailwind `min-h-[44px] min-w-[44px]` or equivalent)
- No horizontal overflow on `<body>` at 375px

#### Tablet (768px–1023px)

- Two-column layout for hero section: left column temperature + conditions; right column today's high/low + supporting metrics
- Hourly strip: full width across both columns
- Daily list: full width or two-column grid (7 days in 2 columns: 4 + 3)
- Details panel: full width when expanded

#### Desktop (1024px+)

- Constrained max-width container (`max-w-4xl mx-auto` or equivalent)
- Left panel: hero (current conditions) + hourly strip
- Right panel: 7-day list + temperature trend chart
- Details panel: below main content, full container width when expanded
- Footer: centred, full width

### Process

1. Tailwind `responsive:` prefixes manage all breakpoint transitions; no media query CSS is written manually.
2. Every interactive element (buttons, cards, toggle, GPS button) has an applied or measured minimum size of 44×44px.
3. The hourly strip uses `overflow-x: auto` on its container and `flex-shrink-0` on each card — this is intentional and not a layout error.
4. Font sizes scale responsively; temperature display uses `clamp()` or responsive Tailwind text sizes to remain readable at all widths.
5. The daily list and hourly strip are layout-tested at 375px (the minimum supported width) before any breakpoint enhancements.

### Validation Rules

- No `overflow-x: hidden` on `<body>` or root `<div>` — overflow issues must be fixed at their source
- No fixed pixel widths on content containers except the hourly scroll cards and icon images
- The unit toggle must be visible on screen (not cut off) at all breakpoints
- All text must be legible at native (1×) device pixel ratio — no text smaller than 12px

### Error States

| Scenario | Description |
|----------|-------------|
| Viewport narrower than 375px | Not supported; minimum target is 375px; no special handling required |
| 1280px+ ultra-wide viewports | Content constrained to `max-w-4xl` or similar; centred with side margins |

### Acceptance Criteria (F5)

- **AC-F5-01:** The app renders without horizontal overflow at 375px, 768px, 1024px, and 1280px viewport widths.
- **AC-F5-02:** All interactive elements have a minimum touch target of 44×44px at all breakpoints.
- **AC-F5-03:** The single-column mobile layout is the base; desktop layout is applied via Tailwind responsive prefixes only.
- **AC-F5-04:** The hourly strip horizontal scroll does not cause `<body>` horizontal overflow.
- **AC-F5-05:** No weather data is hidden or clipped at any supported viewport width.
- **AC-F5-06:** Font sizes are legible on mobile (no text below 12px rendered size).
- **AC-F5-07:** The unit toggle is visible and usable at all supported breakpoints.

---

## 11. F6 — Secondary Weather Details Panel

### Description

F6 is a collapsible panel that reveals secondary weather metrics — data that the Outdoor Enthusiast persona wants but that would clutter the primary view for Casual Checkers. It uses progressive disclosure: collapsed by default, expanded on user interaction. All values use the location's local timezone for time-based fields.

### Terminology

- **Details panel:** The collapsible container holding secondary metrics.
- **Expanded state:** The panel is open and metrics are visible.
- **Collapsed state (default):** The panel shows only a trigger button/header; metrics are hidden.
- **UV index:** A unitless scale (0–11+) indicating ultraviolet radiation intensity.
- **Wind direction:** `windDirection` in degrees; displayed as both cardinal direction and degrees (e.g., `"NW (315°)"`).
- **Visibility:** Distance in km/mi to which objects are visible; from Open-Meteo's `visibility` field.
- **Sunrise / Sunset:** Times derived from `DailyForecast.sunrise` and `DailyForecast.sunset`; displayed in the location's local timezone using `Intl.DateTimeFormat`.

### Sub-features

- Collapsible trigger (chevron or "Details ▼" label)
- UV index display with qualitative label
- Wind direction (cardinal + degrees)
- Visibility in km (or miles when °F unit is active) — displayed only if returned by the Open-Meteo forecast endpoint; silently omitted if the field is absent (Open-Meteo free tier does not currently return visibility)
- Humidity (if not shown in hero)
- Sunrise and sunset times in local timezone

### UV Index Qualitative Labels

| UV Index Value | Label | Suggested Display Colour |
|----------------|-------|--------------------------|
| 0–2 | Low | Green |
| 3–5 | Moderate | Yellow |
| 6–7 | High | Orange |
| 8–10 | Very High | Red |
| 11+ | Extreme | Purple |

### Wind Direction Cardinal Conversion

```typescript
function degreesToCardinal(degrees: number): string {
  const directions = ["N","NNE","NE","ENE","E","ESE","SE","SSE",
                      "S","SSW","SW","WSW","W","WNW","NW","NNW"];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}
// Display as: `${degreesToCardinal(deg)} (${deg}°)`
```

### Process

1. The panel trigger (chevron button or labelled button) is rendered immediately below the hero section or at the end of the current conditions block.
2. On page load, the panel is in the collapsed state. Panel expansion state is held in component-local React state (`useState(false)`) — not in `localStorage`.
3. When the user clicks/taps the trigger, the panel expands and the trigger icon rotates 180° (CSS transition).
4. The expanded panel displays metrics from `WeatherData.current` and `WeatherData.daily[0]`:
   - **UV Index:** `daily[0].uvIndexMax` with qualitative label.
   - **Wind direction:** `current.windDirection` converted to cardinal + degrees.
   - **Visibility:** Sourced from… *Note: Open-Meteo Forecast API does not return visibility in the standard free tier. If visibility is not available, this field is omitted from the panel with no placeholder or error. UV index, wind direction, humidity, sunrise, and sunset continue to display normally.*
   - **Humidity:** `current.humidity` as a percentage (if not already displayed in the hero section).
   - **Sunrise:** `daily[0].sunrise` formatted as `h:mm AM/PM` in the location's timezone via `Intl.DateTimeFormat`.
   - **Sunset:** `daily[0].sunset` formatted as `h:mm AM/PM` in the location's timezone via `Intl.DateTimeFormat`.
5. When the user clicks the trigger again, the panel collapses.
6. Panel state resets to collapsed on every page reload.

### Inputs

- `WeatherData.current.windDirection` (number)
- `WeatherData.current.humidity` (number)
- `WeatherData.daily[0].uvIndexMax` (number | null)
- `WeatherData.daily[0].sunrise` (string — ISO 8601 local datetime)
- `WeatherData.daily[0].sunset` (string — ISO 8601 local datetime)
- `unit` ("celsius" | "fahrenheit")

### Validation Rules

- Sunrise and sunset times must use `Intl.DateTimeFormat` with the `LocationResult.timezone` option — never `toLocaleTimeString()` without a timezone
- UV index is displayed to one decimal place if the API returns a float; rounded to integer for the qualitative label lookup
- Wind direction is always displayed as cardinal + degrees — never degrees alone
- Wind speed in the Details panel uses the same unit conversion as F1: km/h when °C is active, mph when °F is active (conversion: `Math.round(kmh * 0.621371)`)
- If `uvIndexMax` is `null` after transformation, the UV row is omitted from the panel
- If the visibility field is absent from the Open-Meteo API response (not returned by the free-tier forecast endpoint), the visibility row is silently omitted — no placeholder, no "—", no error message; remaining metrics continue to display normally
- Panel state does not persist to `localStorage`

### Error States

| Scenario | Trigger | UI Response |
|----------|---------|-------------|
| `uvIndexMax` is null | null after transformation | UV index row hidden; other metrics display normally |
| Visibility field absent | Open-Meteo does not return visibility for free-tier forecast endpoint | Visibility row silently omitted; no placeholder, no error; all other metrics display normally |
| Sunrise/sunset parsing fails | Invalid ISO string | Display "—" in place of time value |

### Acceptance Criteria (F6)

- **AC-F6-01:** The details panel is collapsed by default on page load and on every page reload.
- **AC-F6-02:** Clicking/tapping the trigger expands the panel and reveals all available secondary metrics (visibility is included only when returned by the API; silently omitted if absent).
- **AC-F6-03:** Sunrise and sunset are displayed in the selected location's local timezone (not the user's device timezone).
- **AC-F6-04:** Wind direction is displayed as cardinal direction and degrees (e.g., "NW (315°)").
- **AC-F6-05:** UV index is shown with a qualitative label (Low / Moderate / High / Very High / Extreme).
- **AC-F6-06:** Panel expansion state is not persisted; returns to collapsed after page reload.
- **AC-F6-07:** The trigger button meets the 44×44px minimum touch target requirement.
- **AC-F6-08:** Wind speed in the Details panel is displayed in km/h when °C is active and mph when °F is active (same conversion as F1 hero).

---

## 12. F7 — Data Freshness & Stale State Handling

### Description

F7 ensures users always know how current their data is, and that the app behaves gracefully in offline or slow-network scenarios. TanStack Query manages caching with a `staleTime` of 10 minutes. Stale data is shown with a visible notice. A blank screen never occurs due to a network failure.

### Terminology

- **Freshness indicator:** A visible label showing how long ago the weather data was last fetched.
- **Stale data:** Data that was fetched more than 10 minutes ago; TanStack Query will re-fetch on next focus or mount event.
- **Cached data:** Data held in TanStack Query's in-memory cache from a previous fetch.
- **Offline state:** The browser's `navigator.onLine` is `false` or all network requests are failing.
- **`staleTime`:** TanStack Query option; data is considered fresh for this duration and will not be re-fetched on component mount. Set to `10 * 60 * 1000` (10 minutes in milliseconds).

### Sub-features

- "Updated X minutes ago" freshness indicator
- TanStack Query `staleTime: 600_000` (10 minutes)
- Offline / stale-cache notice
- "No data + offline" empty state (never blank screen)
- "City not found" empty state from F0 geocoding failure

### Process

1. `WeatherData.fetchedAt` is set to `Date.now()` when data resolves successfully.
2. The freshness indicator renders as `"Updated X minutes ago"` where `X = Math.floor((Date.now() - fetchedAt) / 60_000)`. If less than 1 minute has passed, it shows `"Updated just now"`.
3. The freshness indicator updates every 60 seconds via a `setInterval` in the component that owns it — it must not trigger a re-render of the full weather data tree. The interval must be cleared on component unmount via the `useEffect` cleanup return function (`return () => clearInterval(intervalId)`) to prevent stale-closure memory leaks.
4. TanStack Query is configured with:
   ```typescript
   const queryClient = new QueryClient({
     defaultOptions: {
       queries: {
         staleTime: 10 * 60 * 1000,   // 10 minutes
         gcTime: 30 * 60 * 1000,       // 30 minutes (keep in cache after unused)
         retry: 2,                      // Retry failed requests twice
         retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
       },
     },
   });
   ```
5. When the user is offline (`navigator.onLine === false` or TanStack Query `isError` with a network error) and cached data exists in TanStack Query's cache:
   - The cached weather data is displayed normally.
   - A persistent banner is shown above the weather data: `"Showing cached data from X minutes ago — check your connection"`.
6. When the user is offline and no cached data exists:
   - A friendly empty state is rendered: `"Unable to load weather — check your connection"` with a retry button.
   - Never a blank screen.
7. When the network comes back online, TanStack Query automatically triggers a background refetch. The banner is dismissed when fresh data is loaded.

### Inputs

- `WeatherData.fetchedAt` (number): Unix timestamp ms of last successful fetch
- TanStack Query's `isError`, `isLoading`, `isFetching` states
- `navigator.onLine` (boolean): Browser online state

### Validation Rules

- Freshness indicator must update at most once per minute (no sub-minute updates)
- Stale data is never hidden from the user — it is displayed with a notice
- TanStack Query `staleTime` must be set at the `QueryClient` level, not per-query, to ensure consistent behaviour
- `gcTime` (formerly `cacheTime`) must be ≥ `staleTime` to ensure data is available for offline display

### Error States

| Scenario | Trigger | UI Response |
|----------|---------|-------------|
| Network error, data cached | isError + cache exists | Cached data shown with offline banner |
| Network error, no cache | isError + no cache | "Unable to load weather" empty state + retry button |
| Data > 10 minutes old | staleTime elapsed | Background re-fetch on next focus; no visible stale indicator unless offline |
| Geocoding returns no results | API returns no `results` | "City not found — try a different spelling" (shown in search context, not weather context) |

### Acceptance Criteria (F7)

- **AC-F7-01:** A "Updated X minutes ago" indicator is visible on the main screen at all times when weather data is loaded.
- **AC-F7-02:** The indicator updates every 60 seconds without re-fetching data.
- **AC-F7-03:** TanStack Query `staleTime` is set to 10 minutes; switching between locations that were already fetched does not trigger a new API call within the stale window.
- **AC-F7-04:** When offline with cached data, the cached weather is shown with a visible offline banner.
- **AC-F7-05:** When offline with no cached data, a friendly error message and retry button are shown — never a blank screen.
- **AC-F7-06:** When the network recovers, data is automatically refreshed in the background.
- **AC-F7-07:** "City not found" message is shown when the geocoding API returns no results.

---

## 13. F8 — Accessibility (WCAG AA)

### Description

F8 defines the accessibility requirements that apply to every component in the app. WCAG 2.2 Level AA compliance is a non-negotiable requirement built from day one — not retrofitted. This feature covers keyboard navigation, screen reader announcements, contrast compliance, touch targets, accessible charts, and motion reduction.

### Terminology

- **WCAG 2.2 Level AA:** The Web Content Accessibility Guidelines 2.2, Success Criteria at Level A and AA.
- **`aria-live` region:** An HTML element with `aria-live="polite"` or `"assertive"` that announces dynamic content updates to screen readers without focus change.
- **Keyboard navigation:** The ability to reach and operate all interactive elements using only the keyboard (Tab, Shift+Tab, Enter, Space, arrow keys).
- **Focus ring:** A visible outline on the currently keyboard-focused element; must not be removed with `outline: none` without a replacement.
- **`prefers-reduced-motion`:** A CSS media query that detects when the user has requested reduced animation in their OS settings.
- **Screen reader:** Assistive technology (NVDA, VoiceOver, JAWS) that reads page content aloud to visually impaired users.

### Sub-features

- Full keyboard navigation for all interactive elements
- `aria-live` announcement region for weather data updates
- Icon + text label pairing (no colour-only condition information)
- 4.5:1 minimum contrast ratio on all text/background combinations
- 44×44px minimum touch targets (same as F5, verified here)
- Accessible Recharts chart fallback
- `prefers-reduced-motion` compliance for all CSS animations and transitions

### Keyboard Navigation Requirements

| Element | Keyboard Behaviour |
|---------|-------------------|
| Search input | Reachable with Tab; typing triggers autocomplete; `↑`/`↓` navigate suggestions; `Enter` selects; `Escape` closes dropdown |
| Autocomplete suggestion item | Each item is a `<button>` or `role="option"`; reachable via arrow keys from the input |
| GPS location button | Reachable with Tab; activated with Enter or Space |
| °C/°F unit toggle | Reachable with Tab; both options activatable with Enter or Space; or implement as `role="switch"` |
| Details panel trigger | Reachable with Tab; activated with Enter or Space; `aria-expanded` reflects open/closed state |
| Hourly scroll strip | Reachable with Tab; once focused, `←`/`→` keys scroll the strip |
| "Try again" / retry buttons | Reachable with Tab; activated with Enter or Space |
| Footer attribution link | Standard `<a>` element; reachable with Tab |

### `aria-live` Region Behaviour

A single `<div aria-live="polite" aria-atomic="true" className="sr-only">` element (visually hidden but not `display:none`) is maintained in the app root. Its text content is updated programmatically:

- When a new location is selected and weather data loads: `"Weather data loaded for [location name]: [temperature][unit], [condition label]"`
- When data is refreshed (background refetch): No announcement (avoid annoying users)
- When an error occurs: `"Unable to load weather for [location name]. Check your connection."`
- When offline cached data is shown: `"Showing cached weather data for [location name] from [X] minutes ago"`

### WCAG 1.4.1 — Use of Colour

Weather conditions must never be communicated by colour alone. Every instance of a condition icon must have an adjacent text label. This is enforced in the `WeatherIcon` component:

```tsx
// Always render icon + label together
<span className="flex items-center gap-2">
  <img src={iconSrc} alt="" aria-hidden="true" />
  <span>{conditionLabel}</span>
</span>
```

The `alt=""` and `aria-hidden="true"` on the icon are intentional — the adjacent text label provides the accessible name.

### WCAG 1.4.3 — Contrast

- All text on the hero gradient background must achieve ≥ 4.5:1 contrast against the background at the text's position. Verified at both ends of gradient for each condition/time-of-day combination.
- Body text on white/light backgrounds: `#1a1a2e` or darker on white/near-white backgrounds achieves ≥ 7:1.
- Body text on dark backgrounds: `#f5f5f5` or lighter achieves ≥ 7:1 on the night gradients.
- Placeholder text in the search input must also achieve ≥ 4.5:1 against the input background.

### WCAG 2.5.8 — Touch Targets

Every interactive element — including all buttons, the toggle, autocomplete suggestion items, hourly forecast cards (if they are buttons), and the Details panel trigger — must have a clickable/tappable area of at least 44×44 CSS pixels. Where the visible element is smaller, padding is used to expand the tap area without changing the visual appearance.

### Accessible Recharts Chart (F3 dependency)

Recharts SVG charts are not inherently accessible. The implementation must include:

```tsx
<div role="img" aria-label={`Temperature trend chart for ${locationName}: 
  ${daily.map(d => `${d.date}: high ${d.high}°, low ${d.low}°`).join('; ')}`}>
  <AreaChart ... />
</div>
```

Additionally, a visually-hidden `<table>` containing the same data is rendered immediately after the chart container with `className="sr-only"`:

```tsx
<table className="sr-only">
  <caption>7-day temperature forecast for {locationName}</caption>
  <thead><tr><th>Day</th><th>High</th><th>Low</th><th>Precipitation</th></tr></thead>
  <tbody>
    {daily.map(d => (
      <tr key={d.date}>
        <td>{formatDayLabel(d.date)}</td>
        <td>{displayTemp(d.high, unit)}</td>
        <td>{displayTemp(d.low, unit)}</td>
        <td>{d.precipitationProbability}%</td>
      </tr>
    ))}
  </tbody>
</table>
```

### `prefers-reduced-motion`

All CSS transitions and animations use the `motion-safe:` Tailwind variant (or explicit `@media (prefers-reduced-motion: reduce)` blocks):

- Hero gradient transition on location change: reduced to `none`
- Details panel expand/collapse animation: reduced to `none`
- Skeleton pulse animation: reduced to `none`
- Hourly strip scroll-snap animation: reduced to `none`
- Chevron rotation on panel toggle: reduced to `none`

### Acceptance Criteria (F8)

- **AC-F8-01:** All interactive elements are reachable and operable via keyboard (Tab navigation, Enter/Space activation, arrow keys where specified).
- **AC-F8-02:** The `aria-live` region announces weather data loads and errors to screen readers without requiring focus change.
- **AC-F8-03:** No weather condition is conveyed by colour alone — every condition icon has an adjacent text label.
- **AC-F8-04:** All text/background combinations across all hero gradient states achieve ≥ 4.5:1 contrast ratio (verified manually with a contrast analyser tool).
- **AC-F8-05:** All interactive elements have a minimum 44×44px touch target area.
- **AC-F8-06:** The Recharts temperature chart has a `role="img"` wrapper with a descriptive `aria-label`, plus a visually-hidden `<table>` data fallback rendered in the DOM.
- **AC-F8-07:** All CSS animations and transitions are disabled or reduced when `prefers-reduced-motion: reduce` is active.
- **AC-F8-08:** Zero WCAG AA violations are reported by an automated axe-core scan on the production build.
- **AC-F8-09:** The Details panel trigger has `aria-expanded="true"/"false"` reflecting its current state.
- **AC-F8-10:** Focus rings are visible on all focusable elements (no `outline: none` without a replacement focus indicator).

---

## 14. F9 — Attribution & Deployment

### Description

F9 covers the non-code requirements that make the app production-ready: Open-Meteo API license compliance and HTTPS deployment to Vercel. The geolocation API requires HTTPS — deployment to a plain HTTP origin means GPS detection never works. The Open-Meteo CC BY 4.0 license requires visible attribution.

### Terminology

- **CC BY 4.0:** Creative Commons Attribution 4.0 International license governing Open-Meteo data.
- **Attribution footer:** A persistent footer element containing the required Open-Meteo credit link.
- **Vercel deployment:** The production hosting platform; provides HTTPS by default.
- **GitHub auto-deploy:** Vercel's GitHub integration that triggers a production deploy on every push to `main`.
- **HTTPS requirement:** The Browser Geolocation API (`navigator.geolocation`) only functions on HTTPS origins (and `localhost`).

### Sub-features

- Open-Meteo attribution link in footer (every page load)
- Vercel HTTPS deployment
- GitHub → Vercel auto-deploy pipeline
- Nominatim attribution (required by OSM usage policy)

### Attribution Footer Requirements

The footer must be visible on every page load without scrolling on desktop (or within one scroll on mobile). It must contain:

1. **Open-Meteo attribution:**
   - Link text: `"Weather data by Open-Meteo"`
   - `href`: `"https://open-meteo.com/"`
   - `target="_blank" rel="noopener noreferrer"`
   - License link text: `"CC BY 4.0"` linking to `"https://creativecommons.org/licenses/by/4.0/"`

2. **Nominatim/OpenStreetMap attribution:**
   - Link text: `"Geocoding by OpenStreetMap Nominatim"`
   - `href`: `"https://nominatim.openstreetmap.org/"`
   - `target="_blank" rel="noopener noreferrer"`

### Deployment Process

1. Developer pushes to `main` branch on GitHub.
2. Vercel detects the push via GitHub integration webhook.
3. Vercel runs `npm run build` (which runs `vite build`).
4. Vercel deploys the `dist/` directory as a static site.
5. Vercel provisions HTTPS automatically via its shared TLS infrastructure.
6. No manual deploy steps. No `.env` file required (no API keys).

**`vercel.json` configuration (if needed):**
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
This ensures React Router (if used) or direct URL access returns `index.html` rather than a 404.

### Build Configuration

The production build must:
- Pass TypeScript strict-mode compilation with zero errors
- Produce a gzipped JS bundle below 300 KB (verified with `vite-bundle-visualizer` or `rollup-plugin-visualizer`)
- Contain no references to API keys in any output file (verified by `grep -r "api_key\|apiKey\|API_KEY" dist/`)

### Acceptance Criteria (F9)

- **AC-F9-01:** The Open-Meteo attribution link (`"Weather data by Open-Meteo"`) is visible in the footer on every page load without being hidden behind a scroll or click.
- **AC-F9-02:** The CC BY 4.0 licence link is present and correctly hyperlinked in the footer.
- **AC-F9-03:** The Nominatim attribution link is present in the footer.
- **AC-F9-04:** The app is deployed to a public Vercel HTTPS URL.
- **AC-F9-05:** The geolocation GPS button functions correctly on the live Vercel HTTPS URL (not just `localhost`).
- **AC-F9-06:** A push to the `main` GitHub branch automatically triggers a Vercel production deploy (no manual steps).
- **AC-F9-07:** The production `dist/` output contains no API keys or sensitive credentials (verified by grep of build output).
- **AC-F9-08:** The TypeScript build (`tsc --noEmit`) passes with zero errors in strict mode.

---

## 15. Non-Functional Requirements

### 15.1 Performance

| Requirement | Target | Measurement Method |
|-------------|--------|-------------------|
| First Contentful Paint (mobile 4G simulated) | < 2 seconds | Lighthouse / Chrome DevTools throttled |
| Time to weather data visible after city select | < 2 seconds | Manual timing from suggestion click to hero render |
| JavaScript bundle size (gzipped) | < 300 KB | Vite bundle analyser (`rollup-plugin-visualizer`) |
| Lighthouse Performance score | ≥ 90 | Lighthouse CI on production URL |
| TanStack Query `staleTime` | 10 minutes | Network tab — no duplicate calls within window |

### 15.2 Accessibility

| Requirement | Target | Measurement Method |
|-------------|--------|-------------------|
| WCAG compliance level | 2.2 Level AA | axe-core automated scan + manual screen reader test |
| Contrast ratio — all condition backgrounds | ≥ 4.5:1 for text | Colour contrast analyser (all gradient × time combinations) |
| Touch target size | ≥ 44 × 44 px | Chrome DevTools inspection |
| Keyboard navigation | 100% of interactive elements | Manual keyboard-only test session |
| Screen reader usability | VoiceOver (macOS/iOS) + NVDA (Windows) | Manual test on production build |

### 15.3 Reliability

| Requirement | Target | Measurement Method |
|-------------|--------|-------------------|
| Blank screen on API failure | Zero instances | Manual test of all error paths |
| Blank screen on geolocation denial | Zero instances | Manual test: deny permission, verify search still works |
| Offline behaviour | Cached data shown with notice | Network tab: set offline, verify cached display |
| API cache stale time | 10 minutes | Network tab: switch locations, come back, verify no re-fetch within 10 min |

### 15.4 Browser Support

| Browser | Minimum Version | Notes |
|---------|-----------------|-------|
| Chromium-based (Chrome, Edge) | 110+ | Primary development target |
| Firefox | 115+ | ESR baseline |
| Safari | 16+ | iOS mobile critical; test on device |
| Mobile Safari | iOS 16+ | Critical for mobile persona |
| Mobile Chrome | Android equivalent of Chromium 110 | Test on Android emulator |

### 15.5 Security

| Requirement | Target |
|-------------|--------|
| API key exposure | Zero — Open-Meteo and Nominatim require no keys |
| `Content-Security-Policy` | Set via Vercel headers config to restrict resource origins |
| External links | All `target="_blank"` links use `rel="noopener noreferrer"` |
| User data stored | Only unit preference and recent searches in `localStorage`; no PII |

### 15.6 Code Quality

| Requirement | Target |
|-------------|--------|
| TypeScript strict mode | Enabled in `tsconfig.json`; `strict: true`, `noImplicitAny: true` |
| `any` casts | Zero permitted in production code |
| ESLint | Zero errors on `npm run lint` |
| Component test coverage | Unit tests for transformation functions and `weatherCodes.ts` mapping |

---

## 16. Error Handling Reference

This section consolidates all error states across the application for quick developer reference.

| Feature | Scenario | User-Facing Message | UI Action |
|---------|----------|--------------------|----|
| F0 | Geocoding API returns no results | "City not found — try a different spelling" | Shown inline below search input |
| F0 | Geocoding API network error | "Search unavailable — check your connection" | Shown inline below search input |
| F0 | Geolocation permission denied | *(none)* | GPS button resets; no message |
| F0 | Geolocation position unavailable | "Location unavailable — try searching manually" | Inline message below search input |
| F0 | Geolocation timeout | "Location timed out — try searching manually" | Inline message below search input |
| F0 | Nominatim reverse geocoding fails | "Couldn't detect location name — try searching manually" | Inline message below search input |
| F1 | Weather API fetch fails | "Unable to load weather for [city]. Check your connection." | Error state with "Try again" button |
| F7 | Offline, data cached | "Showing cached data from X minutes ago — check your connection" | Persistent banner above content |
| F7 | Offline, no data cached | "Unable to load weather — check your connection" | Empty state with retry button |
| F3 | Recharts render failure | *(chart hidden; data table shown)* | Error boundary renders `<table>` fallback |
| All | Unknown WMO weather code | *(none — transparent)* | Code 0 icon and label used as fallback |
| F6 | `uvIndexMax` is null | *(none — row hidden)* | UV row omitted from details panel |
| F6 | Visibility field absent from API | *(none — row hidden)* | Visibility row silently omitted from details panel |

---

## 17. Acceptance Criteria Index

A consolidated index of all acceptance criteria by feature for sprint tracking.

| ID | Feature | Summary |
|----|---------|---------|
| AC-F0-01 | F0 | Fewer than 2 characters → no API call |
| AC-F0-02 | F0 | 2+ characters → geocoding API called after 300ms debounce |
| AC-F0-03 | F0 | Up to 5 autocomplete suggestions displayed with city/region/country |
| AC-F0-04 | F0 | Selecting a suggestion triggers weather fetch |
| AC-F0-05 | F0 | Denying geolocation → no blank screen or stuck state |
| AC-F0-06 | F0 | GPS resolution completes without error when permission granted |
| AC-F0-07 | F0 | Location selection → localStorage recent search written (max 5, move-to-front) |
| AC-F0-08 | F0 | Recent search chips load on mount; clicking a chip loads weather |
| AC-F0-09 | F0 | "City not found" message when geocoding returns no results |
| AC-F0-10 | F0 | GPS button shows loading state while pending and is disabled during that period |
| AC-F0-11 | F0 | Autocomplete dropdown is keyboard-navigable |
| AC-F0-12 | F0 | Enter on search form selects top suggestion |
| AC-F1-01 | F1 | Temperature displayed as integer at all times |
| AC-F1-02 | F1 | All hero data points visible above the fold at 375px |
| AC-F1-03 | F1 | °C/°F toggle visible on main screen (not in settings) |
| AC-F1-04 | F1 | Toggling °C/°F updates all temperatures without network request |
| AC-F1-05 | F1 | Unit preference survives page reload |
| AC-F1-06 | F1 | Skeleton loading state shown while fetching (not blank or spinner-only) |
| AC-F1-07 | F1 | Error message + retry button shown on fetch failure (not blank screen) |
| AC-F1-08 | F1 | Condition icon uses correct day/night variant |
| AC-F1-09 | F1 | Condition text label always rendered with icon |
| AC-F1-10 | F1 | Wind speed in km/h (°C) or mph (°F) |
| AC-F2-01 | F2 | Exactly 24 hourly cards rendered |
| AC-F2-02 | F2 | Each card shows hour, icon, temperature (integer), precipitation % |
| AC-F2-03 | F2 | Hour labels use location timezone (not device timezone) |
| AC-F2-04 | F2 | All card interactive elements ≥ 44×44px |
| AC-F2-05 | F2 | Strip is horizontally scrollable on touch and mouse |
| AC-F2-06 | F2 | Day/night icon variants correct per `isDay` per hour |
| AC-F2-07 | F2 | Precipitation % shown on every card (even 0%) |
| AC-F2-08 | F2 | Toggling °C/°F updates hourly temperatures without network request |
| AC-F3-01 | F3 | Exactly 7 daily rows rendered |
| AC-F3-02 | F3 | Today's row labelled "Today" |
| AC-F3-03 | F3 | Each row shows day, icon (daytime), high, low, precipitation % |
| AC-F3-04 | F3 | High temperature displayed before/above low temperature |
| AC-F3-05 | F3 | Precipitation % shown on every row (even 0%) |
| AC-F3-06 | F3 | Recharts AreaChart renders high/low curves across 7 days |
| AC-F3-07 | F3 | Chart Y-axis updates correctly on °C/°F toggle |
| AC-F3-08 | F3 | Chart has accessible fallback (see AC-F8-06) |
| AC-F3-09 | F3 | Day labels use location timezone |
| AC-F4-01 | F4 | All WMO codes 0–99 map to a valid icon |
| AC-F4-02 | F4 | Unknown WMO codes fall back to clear sky icon without runtime error |
| AC-F4-03 | F4 | Correct day/night icon variant in all contexts |
| AC-F4-04 | F4 | Daily rows always use daytime icon variant |
| AC-F4-05 | F4 | All hero gradient + text combinations achieve ≥ 4.5:1 contrast (manual audit) |
| AC-F4-06 | F4 | Hero gradient updates when location changes |
| AC-F4-07 | F4 | No condition communicated by colour alone |
| AC-F5-01 | F5 | No horizontal overflow at 375px, 768px, 1024px, 1280px |
| AC-F5-02 | F5 | All interactive elements ≥ 44×44px at all breakpoints |
| AC-F5-03 | F5 | Mobile-first base; desktop via Tailwind responsive prefixes only |
| AC-F5-04 | F5 | Hourly strip scroll does not cause body horizontal overflow |
| AC-F5-05 | F5 | No weather data hidden or clipped at any supported viewport |
| AC-F5-06 | F5 | No text below 12px rendered size |
| AC-F5-07 | F5 | Unit toggle visible and usable at all breakpoints |
| AC-F6-01 | F6 | Details panel collapsed on page load and reload |
| AC-F6-02 | F6 | Trigger expands panel showing all available secondary metrics (visibility silently omitted if absent from API) |
| AC-F6-03 | F6 | Sunrise/sunset in location's local timezone |
| AC-F6-04 | F6 | Wind direction as cardinal + degrees |
| AC-F6-05 | F6 | UV index shown with qualitative label |
| AC-F6-06 | F6 | Panel state not persisted; resets on reload |
| AC-F6-07 | F6 | Details panel trigger ≥ 44×44px |
| AC-F6-08 | F6 | Wind speed in Details panel: km/h when °C active, mph when °F active |
| AC-F7-01 | F7 | "Updated X minutes ago" visible on main screen when data loaded |
| AC-F7-02 | F7 | Freshness indicator updates every 60 seconds without data re-fetch |
| AC-F7-03 | F7 | staleTime 10 minutes — no duplicate calls within window |
| AC-F7-04 | F7 | Offline + cached data → cached display with offline banner |
| AC-F7-05 | F7 | Offline + no cache → friendly error + retry (not blank screen) |
| AC-F7-06 | F7 | Network recovery → automatic background refresh |
| AC-F7-07 | F7 | "City not found" message when geocoding returns no results |
| AC-F8-01 | F8 | All interactive elements keyboard-reachable and operable |
| AC-F8-02 | F8 | aria-live announces weather loads and errors |
| AC-F8-03 | F8 | No condition conveyed by colour alone |
| AC-F8-04 | F8 | All text/background combinations ≥ 4.5:1 contrast (manual audit) |
| AC-F8-05 | F8 | All interactive elements ≥ 44×44px touch target |
| AC-F8-06 | F8 | Recharts chart has role="img" + aria-label + sr-only data table |
| AC-F8-07 | F8 | All animations/transitions disabled under prefers-reduced-motion |
| AC-F8-08 | F8 | Zero WCAG AA violations in axe-core scan on production build |
| AC-F8-09 | F8 | Details panel trigger has correct aria-expanded state |
| AC-F8-10 | F8 | Focus rings visible on all focusable elements |
| AC-F9-01 | F9 | Open-Meteo attribution link visible in footer on every page load |
| AC-F9-02 | F9 | CC BY 4.0 licence link present and hyperlinked |
| AC-F9-03 | F9 | Nominatim attribution link present in footer |
| AC-F9-04 | F9 | App deployed to public Vercel HTTPS URL |
| AC-F9-05 | F9 | Geolocation GPS button functions on live Vercel HTTPS URL |
| AC-F9-06 | F9 | Push to main → automatic Vercel production deploy |
| AC-F9-07 | F9 | No API keys in dist/ output |
| AC-F9-08 | F9 | TypeScript strict-mode build passes with zero errors |

---

*FRD version 1.0 — generated 2026-05-01*
*Source: PRD-WeatherApp.md v1.0 (2026-04-29), PROJECT.md*
*Covers features: F0, F1, F2, F3, F4, F5, F6, F7, F8, F9 — 10/10 features specified ✓*
*Total acceptance criteria: 70 (AC-F0-01 through AC-F9-08, plus AC-F6-08 and visibility fallback behaviours)*
