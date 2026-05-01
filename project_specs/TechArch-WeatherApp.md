# Technical Architecture Document
## Simple Weather App — WeatherApp

**Version:** 1.0
**Date:** 2026-05-01
**Status:** Active
**Source PRD:** PRD-WeatherApp.md v1.0
**Source FRD:** FRD-WeatherApp.md v1.0
**Scope:** Frontend-only SPA — no backend, no database, no server infrastructure

---

## Table of Contents

1. [Architectural Overview](#1-architectural-overview)
2. [Project Directory Structure](#2-project-directory-structure)
3. [Component Architecture](#3-component-architecture)
4. [Data Flow & State Management](#4-data-flow--state-management)
5. [TypeScript Data Models](#5-typescript-data-models)
6. [External API Integration](#6-external-api-integration)
7. [Caching Strategy](#7-caching-strategy)
8. [Timezone Handling](#8-timezone-handling)
9. [Error Boundary Strategy](#9-error-boundary-strategy)
10. [Responsive Layout System](#10-responsive-layout-system)
11. [Accessibility Architecture](#11-accessibility-architecture)
12. [Security Architecture](#12-security-architecture)
13. [Technology Stack](#13-technology-stack)
14. [Deployment Architecture](#14-deployment-architecture)
15. [Key Architectural Decisions](#15-key-architectural-decisions)

---

## 1. Architectural Overview

### Pattern

The Simple Weather App is a **client-only Single-Page Application (SPA)** using the **Presentation / Data-Fetching / Utility** layered pattern. There is no backend — all state lives in component-local state, TanStack Query's in-memory cache, and `localStorage`. The app makes direct HTTPS requests from the browser to three public, keyless APIs.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        BROWSER (SPA Runtime)                            │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      React 19 + TypeScript                      │   │
│  │                                                                 │   │
│  │  ┌─────────────────┐   ┌──────────────────────────────────────┐│   │
│  │  │   Presentation  │   │         Data Fetching Layer          ││   │
│  │  │     Layer       │   │      (TanStack Query v5)             ││   │
│  │  │                 │   │                                      ││   │
│  │  │  UI Components  │◄──│  useGeocodingSearch()                ││   │
│  │  │  (React 19)     │   │  useWeatherData()                    ││   │
│  │  │                 │   │  useReverseGeocode()                 ││   │
│  │  │  Tailwind CSS v4│   │                                      ││   │
│  │  │  Recharts       │   │  Query cache (staleTime: 10 min)     ││   │
│  │  └────────┬────────┘   └──────────────┬───────────────────────┘│   │
│  │           │                           │                         │   │
│  │  ┌────────▼────────────────────────────▼───────────────────┐   │   │
│  │  │                   Utility / Transform Layer              │   │   │
│  │  │                                                          │   │   │
│  │  │  transformForecastResponse()  weatherCodes.ts            │   │   │
│  │  │  getConditionInfo()           degreesToCardinal()        │   │   │
│  │  │  formatTemperature()          formatTime()               │   │   │
│  │  │  localStorage helpers         unitConversion()           │   │   │
│  │  └──────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      localStorage                               │   │
│  │    weather_unit_preference     weather_recent_searches          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │ HTTPS fetch() — all keyless
          ┌─────────────────────────┼─────────────────────────────┐
          │                         │                             │
          ▼                         ▼                             ▼
┌──────────────────┐   ┌────────────────────────┐   ┌─────────────────────┐
│  Open-Meteo      │   │  Open-Meteo Geocoding   │   │  Nominatim          │
│  Forecast API    │   │  API                    │   │  Reverse Geocoding  │
│                  │   │                         │   │                     │
│  api.open-meteo  │   │  geocoding-api.open-    │   │  nominatim.         │
│  .com/v1/        │   │  meteo.com/v1/search    │   │  openstreetmap.org  │
│  forecast        │   │                         │   │  /reverse           │
│                  │   │  City name → lat/lon     │   │                     │
│  lat/lon →       │   │  + timezone + metadata  │   │  GPS lat/lon →      │
│  current + 24h   │   │                         │   │  city name          │
│  hourly + 7-day  │   │  No auth required        │   │                     │
│  daily           │   │                         │   │  No auth required   │
│                  │   │                         │   │  1 req/sec limit    │
│  No auth required│   │                         │   │                     │
│  timezone=auto   │   │                         │   │                     │
└──────────────────┘   └────────────────────────┘   └─────────────────────┘
```

### Deployment Topology

```
┌──────────────────────────────────────────────────────────────┐
│                      GitHub (main branch)                    │
│                                                              │
│   Developer push → triggers Vercel webhook                   │
└──────────────────────────────────┬───────────────────────────┘
                                   │ webhook
                                   ▼
┌──────────────────────────────────────────────────────────────┐
│                      Vercel Build                            │
│                                                              │
│   node v18.20.4                                              │
│   npm install → npm run build (vite build)                   │
│   TypeScript strict compilation (tsc --noEmit)               │
│   Output: dist/ (static HTML + JS + CSS + assets)            │
└──────────────────────────────────┬───────────────────────────┘
                                   │ deploy
                                   ▼
┌──────────────────────────────────────────────────────────────┐
│                   Vercel Edge Network (CDN)                  │
│                                                              │
│   Static file serving (dist/)                                │
│   HTTPS by default (required for Geolocation API)            │
│   vercel.json rewrites: all routes → /index.html             │
│   No servers. No runtime. No API keys stored anywhere.       │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Project Directory Structure

```
weather-app/
│
├── public/
│   └── icons/                        # Weather condition SVG icons
│       ├── sun.svg                   # WMO code 0, day
│       ├── moon.svg                  # WMO code 0, night
│       ├── sun-cloud.svg             # WMO code 1, day
│       ├── moon-cloud.svg            # WMO code 1, night
│       ├── cloud-sun.svg             # WMO code 2, day
│       ├── cloud-moon.svg            # WMO code 2, night
│       ├── cloud.svg                 # WMO code 3
│       ├── fog.svg                   # WMO codes 45, 48
│       ├── drizzle.svg               # WMO codes 51, 53, 55
│       ├── freezing-drizzle.svg      # WMO codes 56, 57
│       ├── rain.svg                  # WMO codes 61, 63, 65
│       ├── freezing-rain.svg         # WMO codes 66, 67
│       ├── snow.svg                  # WMO codes 71, 73, 75
│       ├── snow-grains.svg           # WMO code 77
│       ├── showers.svg               # WMO codes 80, 81, 82
│       ├── snow-showers.svg          # WMO codes 85, 86
│       ├── thunderstorm.svg          # WMO code 95
│       └── thunderstorm-hail.svg     # WMO codes 96, 99
│
├── src/
│   │
│   ├── main.tsx                      # React 19 root — createRoot, QueryClientProvider
│   ├── App.tsx                       # Root component — layout shell, location state
│   │
│   ├── components/                   # UI components (pure presentation)
│   │   ├── search/
│   │   │   ├── SearchBar.tsx         # Location text input + GPS button shell
│   │   │   ├── AutocompleteDropdown.tsx  # Suggestion list with keyboard nav
│   │   │   ├── GpsButton.tsx         # GPS trigger, loading + idle states
│   │   │   └── RecentSearchChips.tsx # localStorage quick-select chips
│   │   │
│   │   ├── weather/
│   │   │   ├── HeroSection.tsx       # Current conditions hero (temp, icon, stats)
│   │   │   ├── CurrentTemp.tsx       # Large dominant temperature display
│   │   │   ├── ConditionDisplay.tsx  # Icon + label pair (satisfies WCAG 1.4.1)
│   │   │   ├── WeatherStats.tsx      # Humidity, wind speed, precipitation row
│   │   │   ├── UnitToggle.tsx        # °C / °F toggle (role="switch")
│   │   │   ├── HourlyStrip.tsx       # Horizontal scroll 24h forecast container
│   │   │   ├── HourlyCard.tsx        # Single hour card within the strip
│   │   │   ├── DailyForecastList.tsx # 7-day vertical list container
│   │   │   ├── DailyForecastRow.tsx  # Single day row (name/icon/high/low/precip)
│   │   │   ├── TemperatureTrendChart.tsx  # Recharts AreaChart for 7-day trend
│   │   │   ├── DetailsPanel.tsx      # Collapsible secondary metrics panel
│   │   │   └── FreshnessIndicator.tsx  # "Updated X minutes ago" label
│   │   │
│   │   ├── feedback/
│   │   │   ├── SkeletonHero.tsx      # Layout-preserving skeleton for hero section
│   │   │   ├── SkeletonHourly.tsx    # Skeleton for hourly strip
│   │   │   ├── SkeletonDaily.tsx     # Skeleton for daily list
│   │   │   ├── ErrorState.tsx        # Error message + retry button
│   │   │   ├── OfflineBanner.tsx     # Cached data notice banner
│   │   │   └── Toast.tsx             # Geolocation error toasts
│   │   │
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx         # Max-width container, responsive grid shell
│   │   │   └── Footer.tsx            # Open-Meteo + Nominatim attribution links
│   │   │
│   │   └── shared/
│   │       └── WeatherIcon.tsx       # Icon img element (alt="" aria-hidden) wrapper
│   │
│   ├── hooks/                        # Custom React hooks (data + behaviour)
│   │   ├── useWeatherData.ts         # TanStack Query hook — Open-Meteo Forecast API
│   │   ├── useGeocodingSearch.ts     # TanStack Query hook — Geocoding API + debounce
│   │   ├── useReverseGeocode.ts      # Nominatim reverse geocoding (one-shot)
│   │   ├── useGeolocation.ts         # Browser Geolocation API wrapper (opt-in)
│   │   ├── useUnitPreference.ts      # localStorage read/write for °C/°F
│   │   ├── useRecentSearches.ts      # localStorage CRUD for recent searches
│   │   └── useFreshnessTimer.ts      # setInterval tick for "Updated X ago" label
│   │
│   ├── services/                     # API call functions (pure fetch, no React)
│   │   ├── weatherApi.ts             # Open-Meteo Forecast API fetch + transform
│   │   ├── geocodingApi.ts           # Open-Meteo Geocoding API fetch + transform
│   │   └── nominatimApi.ts           # Nominatim reverse geocoding fetch + transform
│   │
│   ├── utils/                        # Pure utility functions (no React, no API)
│   │   ├── weatherCodes.ts           # WMO code → { label, dayIcon, nightIcon } map
│   │   ├── temperature.ts            # formatTemperature(), celsiusToFahrenheit()
│   │   ├── wind.ts                   # degreesToCardinal(), kmhToMph()
│   │   ├── time.ts                   # formatHour(), formatDayLabel(), formatTime()
│   │   ├── gradient.ts               # getHeroGradient(weatherCode, isDay) → CSS string
│   │   └── localStorage.ts           # readUnitPreference(), writeRecentSearch(), etc.
│   │
│   ├── types/                        # TypeScript interfaces (canonical shapes)
│   │   ├── weather.ts                # WeatherData, CurrentConditions, HourlyForecast,
│   │   │                             #   DailyForecast, LocationResult, GeocodingResult
│   │   ├── storage.ts                # UnitPreference, RecentSearch
│   │   └── api.ts                    # Raw API response shapes (OpenMeteoForecastResponse,
│   │                                 #   OpenMeteoGeocodingResponse, NominatimReverseResponse)
│   │
│   ├── constants/
│   │   └── queryKeys.ts              # TanStack Query key factories
│   │
│   └── error-boundaries/
│       ├── ChartErrorBoundary.tsx    # Catches Recharts render failures → table fallback
│       └── AppErrorBoundary.tsx      # Top-level catch-all (never blank screen)
│
├── index.html                        # Vite entry point
├── vite.config.ts                    # Vite 5 config with @tailwindcss/vite plugin
├── tailwind.config.ts                # Tailwind CSS v4 config (if needed)
├── tsconfig.json                     # strict: true, noImplicitAny: true
├── tsconfig.node.json                # Vite config type support
├── vercel.json                       # SPA rewrite rule
├── package.json
└── .gitignore
```

---

## 3. Component Architecture

### Component Tree

```
<App>
  ├── <AppErrorBoundary>            ← top-level fallback; never blank screen
  │   └── <QueryClientProvider>     ← TanStack Query context
  │       └── <AppLayout>           ← max-w-4xl container, responsive grid
  │           │
  │           ├── <SearchBar>       ← location entry; always visible
  │           │   ├── <AutocompleteDropdown>   ← suggestions list
  │           │   ├── <GpsButton>              ← opt-in geolocation
  │           │   └── <RecentSearchChips>      ← localStorage chips
  │           │
  │           │   [if no location selected]
  │           ├── <EmptyState>      ← "Search for a city to see weather"
  │           │
  │           │   [if location selected]
  │           ├── <HeroSection>     ← condition-aware gradient background
  │           │   ├── [isLoading]  <SkeletonHero>
  │           │   ├── [isError]    <ErrorState refetch={...} />
  │           │   └── [data]
  │           │       ├── <CurrentTemp>        ← large integer temperature
  │           │       ├── <ConditionDisplay>   ← icon + label pair
  │           │       ├── <WeatherStats>       ← humidity, wind, precipitation
  │           │       ├── <UnitToggle>         ← °C/°F, role="switch"
  │           │       └── <FreshnessIndicator> ← "Updated X minutes ago"
  │           │
  │           ├── <OfflineBanner>   ← shown when offline + cache exists
  │           │
  │           ├── <HourlyStrip>     ← horizontal scroll 24-card container
  │           │   ├── [isLoading]  <SkeletonHourly>
  │           │   └── [data]       24× <HourlyCard>
  │           │
  │           ├── <DailyForecastList>          ← 7-day vertical list
  │           │   ├── [isLoading]  <SkeletonDaily>
  │           │   └── [data]       7× <DailyForecastRow>
  │           │
  │           ├── <ChartErrorBoundary>         ← catches Recharts failures
  │           │   └── <TemperatureTrendChart>  ← Recharts AreaChart + sr-only table
  │           │
  │           ├── <DetailsPanel>    ← collapsible; default collapsed
  │           │   └── UV / wind direction / humidity / sunrise / sunset
  │           │
  │           └── <Footer>          ← Open-Meteo + Nominatim attribution
  │
  └── <div aria-live="polite" className="sr-only" />  ← global announcer
```

### Component Responsibility Summary

| Component | Responsibility | Data Source |
|-----------|---------------|-------------|
| `App.tsx` | Active `LocationResult` state; orchestrates location selection flow | Component state |
| `AppLayout.tsx` | Responsive grid shell; max-width constraint; no business logic | Props / children |
| `SearchBar.tsx` | Owns the search input string; delegates to hooks and child components | `useGeocodingSearch`, `useRecentSearches` |
| `AutocompleteDropdown.tsx` | Renders suggestion list; handles keyboard navigation (`↑↓ Enter Esc`) | `GeocodingResult[]` props |
| `GpsButton.tsx` | Triggers `useGeolocation`; manages pending/idle UI states | `useGeolocation` hook |
| `RecentSearchChips.tsx` | Renders max 5 recent location chips; dispatches selection to parent | `useRecentSearches` hook |
| `HeroSection.tsx` | Applies condition-aware gradient CSS; routes to skeleton/error/data views | `useWeatherData` |
| `CurrentTemp.tsx` | Renders integer temperature at display scale; respects unit preference | `CurrentConditions` props |
| `ConditionDisplay.tsx` | Always renders icon + label pair; `alt=""` + `aria-hidden` on icon | `weatherCode`, `isDay` props |
| `WeatherStats.tsx` | Humidity, wind speed (unit-aware), precipitation probability | `CurrentConditions` props |
| `UnitToggle.tsx` | `role="switch"`; writes to `localStorage` on change via `useUnitPreference` | `useUnitPreference` hook |
| `FreshnessIndicator.tsx` | "Updated X minutes ago"; ticks via `useFreshnessTimer`; no re-fetch | `fetchedAt` prop |
| `HourlyStrip.tsx` | `overflow-x: auto` scroll container; renders 24 `HourlyCard`s | `HourlyForecast[]` props |
| `HourlyCard.tsx` | Hour label (timezone-aware), icon, temp (integer), precip % | `HourlyForecast` prop |
| `DailyForecastList.tsx` | Container for 7 `DailyForecastRow`s | `DailyForecast[]` props |
| `DailyForecastRow.tsx` | Day label ("Today" for index 0), daytime icon, H/L, precip % | `DailyForecast` prop |
| `TemperatureTrendChart.tsx` | Recharts `AreaChart`; `role="img"` wrapper; `sr-only` data table | `DailyForecast[]` props |
| `DetailsPanel.tsx` | `useState(false)` for expand/collapse; `aria-expanded`; UV, wind dir, sunrise/sunset | `WeatherData` props |
| `OfflineBanner.tsx` | Shown when `isError` and stale cache exists; never auto-dismiss on error | TanStack Query state |
| `SkeletonHero/Hourly/Daily.tsx` | Layout-preserving grey placeholder shapes; pulse animation (`motion-safe:`) | None |
| `ErrorState.tsx` | Error message + "Try again" button that calls TanStack Query `refetch()` | `error`, `refetch` props |
| `ChartErrorBoundary.tsx` | Class component; catches Recharts exceptions; renders raw `<table>` | Error boundary |
| `Footer.tsx` | Open-Meteo CC BY 4.0 + Nominatim OSM attribution links | Static |

---

## 4. Data Flow & State Management

### State Ownership Map

```
┌─────────────────────────────────────────────────────────────────┐
│                         State Locations                         │
├──────────────────────┬──────────────────────────────────────────┤
│  Component State     │  TanStack Query Cache   │  localStorage   │
│  (React useState)    │  (in-memory)            │  (persistent)   │
├──────────────────────┼─────────────────────────┼─────────────────┤
│  activeLocation      │  WeatherData per        │  unit_preference│
│  (LocationResult|    │  [lat, lon] query key   │  recent_searches│
│   null)              │                         │  (up to 5)      │
│                      │  GeocodingResult[]      │                 │
│  searchQuery         │  per search string key  │                 │
│  (string)            │                         │                 │
│                      │  (staleTime: 10 min)    │                 │
│  detailsPanelOpen    │  (gcTime: 30 min)       │                 │
│  (boolean)           │  (retry: 2)             │                 │
│                      │                         │                 │
│  geolocating         │                         │                 │
│  (boolean)           │                         │                 │
└──────────────────────┴─────────────────────────┴─────────────────┘
```

### Primary Data Flow: City Search → Weather Display

```
User types "Lon..."
      │
      ▼ (after 300ms debounce, ≥2 chars)
useGeocodingSearch("Lon")
      │
      ├── TanStack Query checks cache [geocoding, "Lon"]
      │     └── cache miss → fetch geocoding-api.open-meteo.com
      │                         ?name=Lon&count=5&language=en&format=json
      │
      ▼
GeocodingResult[]  →  <AutocompleteDropdown> renders 5 suggestions
      │
User selects "London, England, GB"
      │
      ▼
App.tsx: setActiveLocation(LocationResult)
      │
      ├── writeRecentSearch(entry)  →  localStorage
      │
      ▼
useWeatherData(locationResult)
      │
      ├── TanStack Query checks cache [weather, 51.5085, -0.1257]
      │     └── cache miss → fetch api.open-meteo.com/v1/forecast
      │                         ?latitude=51.5085
      │                         &longitude=-0.1257
      │                         &timezone=auto          ← non-negotiable
      │                         &current=...
      │                         &hourly=...
      │                         &daily=...
      │                         &forecast_days=7
      │
      ▼
OpenMeteoForecastResponse (raw)
      │
      ▼
transformForecastResponse()   ← called inside weatherApi.ts, not in components
      │  ├── Math.round() all temperatures
      │  ├── cast is_day: 1→true, 0→false
      │  ├── slice hourly to current hour + 24 entries
      │  ├── null precipitation defaults to 0
      │  └── fetchedAt = Date.now()
      │
      ▼
WeatherData  →  TanStack Query cache  →  components re-render
      │
      ├── HeroSection renders with condition-aware gradient
      ├── HourlyStrip renders 24 cards
      ├── DailyForecastList renders 7 rows
      ├── TemperatureTrendChart renders Recharts AreaChart
      └── aria-live region: "Weather data loaded for London: 18°C, Partly Cloudy"
```

### Secondary Flow: GPS Geolocation → Weather Display

```
User clicks GPS button
      │
      ▼
useGeolocation.getCurrentPosition()
      │
      ├── [permission denied] → GPS button resets; no error shown; search stays usable
      │
      ├── [position unavailable] → GPS button resets; toast: "Location unavailable..."
      │
      └── [success] coords { latitude, longitude }
            │
            ▼
      useReverseGeocode(latitude, longitude)
            │
            └── fetch nominatim.openstreetmap.org/reverse
                  ?lat=...&lon=...&format=json&zoom=10
                  User-Agent: SimpleWeatherApp/1.0 (https://...)
                │
                ▼
            city name extracted from address.city ?? address.town ?? address.village
                │
                ▼
            useGeocodingSearch(cityName)   ← resolves canonical LocationResult with timezone
                │
                ▼
            App.tsx: setActiveLocation(LocationResult)
                │
                └── → same weather fetch flow as city search above
```

### Unit Toggle Flow

```
User clicks °C/°F toggle
      │
      ▼
useUnitPreference.setUnit("fahrenheit")
      │
      ├── localStorage.setItem("weather_unit_preference", "fahrenheit")
      │
      └── React state update → re-render all temperature displays
            │
            ├── CurrentTemp: Math.round((celsius * 9/5) + 32) → display
            ├── HourlyCard: same conversion per card
            ├── DailyForecastRow: high/low converted
            └── TemperatureTrendChart: Y-axis data converted
                (NO network request — all data already in WeatherData as °C)
```

---

## 5. TypeScript Data Models

All interfaces are defined in `src/types/` and must be used consistently across all layers. Raw API response types are isolated to `src/types/api.ts` and must never leak into UI components.

### Canonical Application Types (`src/types/weather.ts`)

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
```

### Storage Types (`src/types/storage.ts`)

```typescript
/** Unit preference stored in localStorage. Default: "celsius". */
export type UnitPreference = "celsius" | "fahrenheit";

/** A recent location search entry persisted in localStorage. */
export interface RecentSearch {
  name: string;      // Display name, e.g. "London, England, GB"
  latitude: number;
  longitude: number;
  timezone: string;
  savedAt: number;   // Unix timestamp ms
}
```

### Raw API Response Types (`src/types/api.ts`)

```typescript
/** Raw shape returned by the Open-Meteo Geocoding API. */
export interface OpenMeteoGeocodingResponse {
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
    timezone: string;
    population?: number;
    country_id: number;
    country: string;
    admin1?: string;
    admin2?: string;
  }>;
  generationtime_ms: number;
}

/** Raw shape returned by the Open-Meteo Forecast API. */
export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;

  current_units: Record<string, string>;
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    apparent_temperature: number;
    weather_code: number;
    is_day: number;            // 1 = day, 0 = night
    wind_speed_10m: number;
    wind_direction_10m: number;
    relative_humidity_2m: number;
  };

  hourly_units: Record<string, string>;
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    is_day: number[];
    precipitation_probability: (number | null)[];
  };

  daily_units: Record<string, string>;
  daily: {
    time: string[];
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

/** Raw shape returned by the Nominatim Reverse Geocoding API. */
export interface NominatimReverseResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
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

### Utility Type: Weather Code Map (`src/utils/weatherCodes.ts`)

```typescript
export interface ConditionInfo {
  label: string;
  dayIcon: string;    // filename in public/icons/, e.g. "sun"
  nightIcon: string;  // filename in public/icons/, e.g. "moon"
}

export const WMO_CODE_MAP: Record<number, ConditionInfo> = {
  0:  { label: "Clear Sky",            dayIcon: "sun",               nightIcon: "moon" },
  1:  { label: "Mainly Clear",         dayIcon: "sun-cloud",         nightIcon: "moon-cloud" },
  2:  { label: "Partly Cloudy",        dayIcon: "cloud-sun",         nightIcon: "cloud-moon" },
  3:  { label: "Overcast",             dayIcon: "cloud",             nightIcon: "cloud" },
  45: { label: "Foggy",                dayIcon: "fog",               nightIcon: "fog" },
  48: { label: "Foggy",                dayIcon: "fog",               nightIcon: "fog" },
  51: { label: "Drizzle",              dayIcon: "drizzle",           nightIcon: "drizzle" },
  53: { label: "Drizzle",              dayIcon: "drizzle",           nightIcon: "drizzle" },
  55: { label: "Drizzle",              dayIcon: "drizzle",           nightIcon: "drizzle" },
  56: { label: "Freezing Drizzle",     dayIcon: "freezing-drizzle",  nightIcon: "freezing-drizzle" },
  57: { label: "Freezing Drizzle",     dayIcon: "freezing-drizzle",  nightIcon: "freezing-drizzle" },
  61: { label: "Rain",                 dayIcon: "rain",              nightIcon: "rain" },
  63: { label: "Rain",                 dayIcon: "rain",              nightIcon: "rain" },
  65: { label: "Rain",                 dayIcon: "rain",              nightIcon: "rain" },
  66: { label: "Freezing Rain",        dayIcon: "freezing-rain",     nightIcon: "freezing-rain" },
  67: { label: "Freezing Rain",        dayIcon: "freezing-rain",     nightIcon: "freezing-rain" },
  71: { label: "Snow",                 dayIcon: "snow",              nightIcon: "snow" },
  73: { label: "Snow",                 dayIcon: "snow",              nightIcon: "snow" },
  75: { label: "Snow",                 dayIcon: "snow",              nightIcon: "snow" },
  77: { label: "Snow Grains",          dayIcon: "snow-grains",       nightIcon: "snow-grains" },
  80: { label: "Showers",              dayIcon: "showers",           nightIcon: "showers" },
  81: { label: "Showers",              dayIcon: "showers",           nightIcon: "showers" },
  82: { label: "Showers",             dayIcon: "showers",           nightIcon: "showers" },
  85: { label: "Snow Showers",         dayIcon: "snow-showers",      nightIcon: "snow-showers" },
  86: { label: "Snow Showers",         dayIcon: "snow-showers",      nightIcon: "snow-showers" },
  95: { label: "Thunderstorm",         dayIcon: "thunderstorm",      nightIcon: "thunderstorm" },
  96: { label: "Thunderstorm with Hail", dayIcon: "thunderstorm-hail", nightIcon: "thunderstorm-hail" },
  99: { label: "Thunderstorm with Hail", dayIcon: "thunderstorm-hail", nightIcon: "thunderstorm-hail" },
} as const;

const FALLBACK: ConditionInfo = { label: "Clear Sky", dayIcon: "sun", nightIcon: "moon" };

/** Returns condition info for a WMO code, falling back to code 0 for unknowns. */
export function getConditionInfo(weatherCode: number, isDay: boolean): {
  label: string;
  icon: string;
} {
  const info = WMO_CODE_MAP[weatherCode] ?? FALLBACK;
  return {
    label: info.label,
    icon: isDay ? info.dayIcon : info.nightIcon,
  };
}
```

---

## 6. External API Integration

### 6.1 Open-Meteo Forecast API

**Service file:** `src/services/weatherApi.ts`

```
Base URL:       https://api.open-meteo.com/v1/forecast
Authentication: None
Rate limit:     None (non-commercial free tier)
```

**Request parameters:**

| Parameter | Value | Notes |
|-----------|-------|-------|
| `latitude` | `LocationResult.latitude` | WGS84 float |
| `longitude` | `LocationResult.longitude` | WGS84 float |
| `timezone` | `"auto"` | **Non-negotiable. Always `"auto"`.** |
| `current` | `temperature_2m,apparent_temperature,weather_code,is_day,wind_speed_10m,wind_direction_10m,relative_humidity_2m` | All current variables |
| `hourly` | `temperature_2m,weather_code,is_day,precipitation_probability` | 168 entries (7d × 24h) |
| `daily` | `weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max,wind_speed_10m_max,wind_direction_10m_dominant` | 7 daily entries |
| `forecast_days` | `7` | Always 7 |
| `wind_speed_unit` | `"kmh"` | Default; stored internally in km/h |

**TanStack Query key:** `["weather", latitude, longitude]`

**Transformation rules (applied in `transformForecastResponse()`):**
- All temperature fields: `Math.round()` — never `toFixed()`
- `is_day: number` → `isDay: boolean` (`1 → true`, `0 → false`)
- `precipitationProbability`: `null → 0`
- `uvIndexMax`: `null → 0`
- Hourly array: sliced from current hour index, 24 entries forward
- `fetchedAt`: `Date.now()` immediately after fetch resolves

---

### 6.2 Open-Meteo Geocoding API

**Service file:** `src/services/geocodingApi.ts`

```
Base URL:       https://geocoding-api.open-meteo.com/v1/search
Authentication: None
Rate limit:     None documented
```

**Request parameters:**

| Parameter | Value | Notes |
|-----------|-------|-------|
| `name` | User search string (trimmed) | Min 2 chars before calling |
| `count` | `5` | Max autocomplete suggestions |
| `language` | `"en"` | English results |
| `format` | `"json"` | Always JSON |

**TanStack Query key:** `["geocoding", query]`

**No-results handling:** API returns `{}` (no `results` key) when no city matches. `response.results === undefined` is a valid "no results" state — not an error. App displays: "City not found — try a different spelling".

---

### 6.3 Nominatim Reverse Geocoding API

**Service file:** `src/services/nominatimApi.ts`

```
Base URL:       https://nominatim.openstreetmap.org/reverse
Authentication: None (but User-Agent required by policy)
Rate limit:     1 request/second (easily satisfied — only called on GPS activation)
```

**Request parameters:**

| Parameter | Value | Notes |
|-----------|-------|-------|
| `lat` | GPS `coords.latitude` | Float |
| `lon` | GPS `coords.longitude` | Float |
| `format` | `"json"` | Always JSON |
| `zoom` | `10` | City-level precision |

**Required header:**
```
User-Agent: SimpleWeatherApp/1.0 (https://your-vercel-url.vercel.app)
```

**Post-Nominatim flow:** After receiving the Nominatim response, the app calls the Open-Meteo Geocoding API with the resolved city name to obtain the canonical `LocationResult` (including timezone). Nominatim does not return timezone data.

**City name extraction:**
```typescript
const cityName =
  address.city ?? address.town ?? address.village ?? display_name.split(",")[0];
```

---

## 7. Caching Strategy

### TanStack Query Configuration (`src/main.tsx`)

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,           // 10 minutes — no re-fetch within window
      gcTime: 30 * 60 * 1000,              // 30 minutes — keep in cache after unmount
      retry: 2,                             // Retry failed requests twice
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000), // exp. backoff
      refetchOnWindowFocus: true,           // Re-fetch on tab focus if stale
      refetchOnReconnect: true,             // Re-fetch on network recovery
    },
  },
});
```

### Query Key Factories (`src/constants/queryKeys.ts`)

```typescript
export const queryKeys = {
  weather: (latitude: number, longitude: number) =>
    ["weather", latitude, longitude] as const,
  geocoding: (query: string) =>
    ["geocoding", query] as const,
} as const;
```

### Cache Behaviour by Scenario

| Scenario | Behaviour |
|----------|-----------|
| User searches same city twice within 10 min | TanStack Query returns cached `WeatherData`; zero API calls |
| User switches between two recently viewed cities | Both cached independently by `[lat, lon]` key; instant switch |
| Data > 10 minutes old, user focuses tab | Background re-fetch triggered; stale data displayed until fresh data arrives |
| User offline, data in cache | Stale data displayed with `<OfflineBanner>`; no blank screen |
| User offline, no cache | `isError` → `<ErrorState>` with retry button; no blank screen |
| Network recovers | `refetchOnReconnect: true` triggers automatic background refresh |

### localStorage Caching

`localStorage` provides persistence across page reloads for two keys only:

| Key | Type | Purpose | TTL |
|-----|------|---------|-----|
| `weather_unit_preference` | `"celsius" \| "fahrenheit"` | °C/°F display preference | Permanent |
| `weather_recent_searches` | `RecentSearch[]` (max 5) | Quick-select chips | Permanent (max 5 entries, FIFO) |

All `localStorage` reads are wrapped in `try/catch` to handle `SecurityError` (private browsing) and `JSON.parse` failures silently, falling back to defaults.

---

## 8. Timezone Handling

### The Non-Negotiable Rule

**`timezone=auto` must be sent on every Open-Meteo Forecast API request.** This is non-negotiable. Without it, all time-dependent data — sunrise/sunset times, hourly labels, and the `isDay` field — will be computed in UTC and will be wrong for any location not in the user's local timezone.

### What `timezone=auto` Does

When `timezone=auto` is sent, Open-Meteo resolves the IANA timezone for the requested coordinates and returns all timestamps in that local timezone. The `HourlyForecast.time` values (e.g. `"2026-05-01T14:00"`) and `DailyForecast.sunrise`/`sunset` values are already in the location's local time — they require no further timezone conversion.

### Display Formatting (`src/utils/time.ts`)

All time and date formatting uses `Intl.DateTimeFormat` with the explicit `timeZone` option sourced from `LocationResult.timezone`. The browser's local timezone is **never** used for location-specific time display.

```typescript
/** Format an ISO local datetime string as "2 PM" or "14:00" (locale-aware). */
export function formatHour(isoString: string, timezone: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    hour12: true,
    timeZone: timezone,
  }).format(date);
}

/** Format an ISO date string as abbreviated day name: "Mon", "Tue", etc. */
export function formatDayLabel(isoDate: string, timezone: string): string {
  const date = new Date(isoDate + "T12:00:00"); // noon avoids DST edge cases
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    timeZone: timezone,
  }).format(date);
}

/** Format an ISO local datetime string as "5:42 AM" in the location's timezone. */
export function formatTime(isoString: string, timezone: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  }).format(date);
}
```

### Day/Night Icon Logic

The `isDay` field is set by Open-Meteo per-hour in the hourly array and for the current snapshot. Components must use the `isDay` value from the data — never compute it from `Date.now()` or the browser's local time.

```
Current conditions:  use current.isDay
Hourly cards:        use HourlyForecast.isDay  (per-hour from API)
Daily forecast rows: always isDay = true       (daily rows always show daytime icon)
```

---

## 9. Error Boundary Strategy

### Layered Error Containment

```
Layer 1: AppErrorBoundary (src/error-boundaries/AppErrorBoundary.tsx)
  ├── Catches: any unhandled React render error in the entire tree
  ├── Fallback: "Something went wrong. Please refresh the page."
  └── Never: blank screen

Layer 2: ChartErrorBoundary (src/error-boundaries/ChartErrorBoundary.tsx)
  ├── Catches: Recharts render exceptions specifically
  ├── Fallback: raw <table> with the 7-day data (always accessible)
  └── Scope: wraps <TemperatureTrendChart> only

Layer 3: TanStack Query error states
  ├── isLoading → skeleton components (layout-preserving placeholders)
  ├── isError   → <ErrorState> with "Try again" button (calls refetch())
  └── Never: blank screen, never undefined rendered as nothing
```

### Error State Mapping

| Feature | Error Trigger | Component Shown | Never Shows |
|---------|--------------|-----------------|-------------|
| Weather fetch fails | `useWeatherData` `isError` | `<ErrorState>` with retry | Blank screen |
| Loading in progress | `useWeatherData` `isLoading` | `<SkeletonHero>` + `<SkeletonHourly>` + `<SkeletonDaily>` | Blank screen |
| Offline, cache exists | `isError` + stale data | Live data + `<OfflineBanner>` | Blank screen |
| Offline, no cache | `isError` + no data | `<ErrorState>` with retry | Blank screen |
| Geocoding no results | `results === undefined` | Inline "City not found" message | Error page |
| GPS permission denied | `PERMISSION_DENIED` | GPS button idle (silent) | Blank screen, error message |
| GPS position unavailable | `POSITION_UNAVAILABLE` | Toast notification | Blank screen |
| Recharts render error | Uncaught JS exception | `<ChartErrorBoundary>` fallback table | Blank chart |
| Unknown WMO code | Code not in `WMO_CODE_MAP` | Code 0 (Clear Sky) fallback | Broken image |

### Skeleton Component Strategy

Skeletons are layout-preserving — they match the exact dimensions and structure of the live components they replace. They use a CSS pulse animation that respects `prefers-reduced-motion`:

```tsx
// Example skeleton shape — matches CurrentTemp layout
<div className="animate-pulse motion-reduce:animate-none">
  <div className="h-20 w-36 bg-white/20 rounded-lg mb-2" />  {/* temp */}
  <div className="h-5 w-24 bg-white/15 rounded mb-4" />       {/* feels like */}
  <div className="flex gap-3">
    <div className="h-16 w-16 bg-white/20 rounded-full" />    {/* icon */}
    <div className="h-6 w-28 bg-white/15 rounded" />          {/* label */}
  </div>
</div>
```

---

## 10. Responsive Layout System

### Breakpoint Strategy (Tailwind CSS v4, Mobile-First)

| Breakpoint | Tailwind Prefix | Range | Layout |
|------------|----------------|-------|--------|
| Mobile (base) | *(none)* | 375px – 767px | Single-column stack |
| Tablet | `md:` | 768px – 1023px | Two-column hero; full-width strips |
| Desktop | `lg:` | 1024px+ | Side-by-side panels; max-w-4xl constrained |

No media query CSS is written manually. All breakpoint transitions use Tailwind responsive prefixes exclusively.

### Layout Grid (Desktop — `lg:`)

```
┌──────────────────────────────────────────────────────────────────────┐
│                     max-w-4xl mx-auto px-4                          │
│                                                                      │
│  ┌──────────────────────┐  ┌─────────────────────────────────────┐  │
│  │   <SearchBar>        │  (full width, top)                     │  │
│  └──────────────────────┘                                           │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  <HeroSection> — condition-aware gradient, full width         │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  <HourlyStrip> — full width horizontal scroll                 │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌────────────────────────────┐  ┌───────────────────────────────┐  │
│  │  <DailyForecastList>       │  │  <TemperatureTrendChart>      │  │
│  │  7 daily rows              │  │  Recharts AreaChart           │  │
│  │  (lg: w-1/2)               │  │  (lg: w-1/2)                  │  │
│  └────────────────────────────┘  └───────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  <DetailsPanel> — collapsible, full width                     │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  <Footer> — attribution links, centred                        │   │
│  └──────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

### Layout Grid (Mobile — base)

```
┌─────────────────────────┐
│  375px viewport          │
│                          │
│  <SearchBar>             │  ← full width, top
│  <RecentSearchChips>     │  ← below input
│                          │
│  <HeroSection>           │  ← full width, temp centred
│    temperature           │
│    feels-like            │
│    icon + label          │
│    H/L + precip + wind   │
│    <UnitToggle>          │
│    <FreshnessIndicator>  │
│                          │
│  <HourlyStrip>           │  ← full width, overflow-x: auto
│  ← swipe →               │  ← cards do not wrap
│                          │
│  <DailyForecastList>     │  ← full width, rows stack
│  7× <DailyForecastRow>   │
│                          │
│  <TemperatureTrendChart> │  ← full width Recharts
│                          │
│  <DetailsPanel>          │  ← collapsed trigger
│                          │
│  <Footer>                │  ← attribution links
└─────────────────────────┘
```

### Touch Target Enforcement

All interactive elements must have a minimum 44×44 CSS pixel clickable/tappable area. Where the visible element is smaller, padding expands the tap area:

```tsx
// Example: small icon button with 44px tap target
<button className="flex items-center justify-center min-h-[44px] min-w-[44px] p-2">
  <GpsIcon className="w-5 h-5" />
</button>
```

**Elements requiring 44px enforcement:**
- Search input (height ≥ 44px)
- GPS button
- Autocomplete suggestion items
- °C/°F toggle (each option)
- Hourly forecast cards (interactive area)
- Details panel trigger
- "Try again" / retry buttons
- Footer attribution links (padding applied)

---

## 11. Accessibility Architecture

### WCAG 2.2 Level AA — Implementation Map

| WCAG Criterion | Requirement | Implementation |
|---------------|-------------|----------------|
| 1.4.1 Use of Colour | No info by colour alone | Every condition icon paired with text label; `alt=""` + `aria-hidden` on icon; label in adjacent `<span>` |
| 1.4.3 Contrast (text) | ≥ 4.5:1 all text | Hero gradient palette designed for contrast; manual audit before ship per condition × time-of-day |
| 2.1.1 Keyboard | All functionality via keyboard | Search: Tab + ↑↓ Enter Esc; GPS: Tab + Enter/Space; Toggle: role="switch"; Details: Tab + Enter/Space + aria-expanded |
| 2.4.7 Focus Visible | Focus rings on all focused elements | Tailwind `focus-visible:ring-2 focus-visible:ring-offset-2`; no `outline: none` without replacement |
| 2.5.8 Target Size | ≥ 44×44px targets | `min-h-[44px] min-w-[44px]` applied universally; verified by DevTools |
| 4.1.3 Status Messages | Announced without focus | Single `aria-live="polite" aria-atomic="true"` region in app root; updated on location change, errors, offline |

### Global `aria-live` Announcer

A single visually-hidden element is maintained in the DOM at all times. It is updated programmatically — never by React re-renders of live content (which would cause double-announcements):

```tsx
// In App.tsx
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
  ref={announcerRef}
/>

// Announcement triggers:
// Location loaded:   "Weather data loaded for London: 18°C, Partly Cloudy"
// Error:             "Unable to load weather for London. Check your connection."
// Offline cached:    "Showing cached weather data for London from 5 minutes ago"
// Background fetch:  (no announcement — avoid noise)
```

### Accessible Chart Implementation

```tsx
<div
  role="img"
  aria-label={`Temperature trend for ${locationName}: ${
    daily.map(d => `${formatDayLabel(d.date, timezone)}: high ${d.high}°, low ${d.low}°`).join("; ")
  }`}
>
  <AreaChart data={chartData} ... />
</div>

{/* Screen reader data table — visually hidden, always in DOM */}
<table className="sr-only">
  <caption>7-day temperature forecast for {locationName}</caption>
  <thead>
    <tr><th scope="col">Day</th><th scope="col">High</th><th scope="col">Low</th><th scope="col">Precipitation</th></tr>
  </thead>
  <tbody>
    {daily.map(d => (
      <tr key={d.date}>
        <td>{formatDayLabel(d.date, timezone)}</td>
        <td>{displayTemp(d.high, unit)}</td>
        <td>{displayTemp(d.low, unit)}</td>
        <td>{d.precipitationProbability}%</td>
      </tr>
    ))}
  </tbody>
</table>
```

### Motion Reduction

All animations use Tailwind's `motion-safe:` / `motion-reduce:` variants:

```
Skeleton pulse:           motion-safe:animate-pulse (disabled under prefers-reduced-motion)
Details panel expand:     motion-safe:transition-all motion-safe:duration-300
Chevron rotation:         motion-safe:transition-transform motion-safe:duration-300
Hero gradient transition: motion-safe:transition-all motion-safe:duration-500
Hourly scroll-snap:       motion-safe:scroll-smooth
```

Under `prefers-reduced-motion: reduce`, all transitions and animations are removed immediately — elements jump to their final state without animation.

---

## 12. Security Architecture

### Attack Surface Analysis

This app has an exceptionally small attack surface because it is frontend-only with no backend, no authentication, and no API keys.

| Attack Vector | Status | Mitigation |
|--------------|--------|------------|
| API key exposure | N/A | Open-Meteo and Nominatim require zero API keys |
| Server-side injection | N/A | No server |
| Database injection | N/A | No database |
| XSS via user input | Low risk | React JSX escapes all interpolated values by default; no `dangerouslySetInnerHTML` used |
| localStorage data poisoning | Low risk | All `localStorage` reads use `try/catch` + explicit type guards; invalid data falls back to defaults |
| CORS | None | All APIs allow browser fetch from any origin |
| Geolocation data leakage | Opt-in only | GPS coordinates are passed to Nominatim only after explicit user activation; not stored beyond session |
| Third-party data integrity | Low risk | Open-Meteo and Nominatim are trusted public infrastructure; no user-supplied URLs |

### Content Security Policy (`vercel.json`)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; connect-src 'self' https://api.open-meteo.com https://geocoding-api.open-meteo.com https://nominatim.openstreetmap.org; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### External Link Safety

All external links use `rel="noopener noreferrer"` to prevent tab-napping:

```tsx
<a
  href="https://open-meteo.com/"
  target="_blank"
  rel="noopener noreferrer"
>
  Weather data by Open-Meteo
</a>
```

### Data Stored in `localStorage`

Only two non-sensitive values are persisted:
- `weather_unit_preference`: `"celsius"` or `"fahrenheit"` — no PII
- `weather_recent_searches`: City names + coordinates — no PII; user-visible data only

No personal data, no session tokens, no credentials are ever stored.

---

## 13. Technology Stack

| Layer | Technology | Version | Purpose | Rationale |
|-------|------------|---------|---------|-----------|
| Framework | React | 19 | UI component tree | Best ecosystem for data fetching, charting, and TanStack Query integration |
| Language | TypeScript | 5.x (latest) | Static typing | `strict: true`; zero `any` casts enforced |
| Build Tool | Vite | 5.x | Dev server + production build | Node 18 compatible (Vite 8 requires Node ≥ 20); fast HMR; static `dist/` output |
| Styling | Tailwind CSS | v4 | Utility-first CSS | Vite plugin integration; responsive breakpoints; no CSS file overhead |
| Data Fetching | TanStack Query | v5 | Server state management, caching | `staleTime: 10min`; `isLoading`/`isError` states; deduplication; retry logic |
| Charting | Recharts | 2.x | Temperature trend AreaChart | React-native SVG charts; composable API; accessible with wrappers |
| Weather API | Open-Meteo Forecast | v1 | Current + hourly + daily weather | No API key; `timezone=auto`; CC BY 4.0; 14-day forecasts |
| Geocoding API | Open-Meteo Geocoding | v1 | City name → lat/lon + autocomplete | No API key; same domain as weather API; separate cache key |
| Reverse Geocoding | Nominatim (OSM) | v1 | GPS lat/lon → city name | No API key; 1 req/sec limit acceptable for opt-in GPS flow |
| Hosting | Vercel | — | Static site hosting | Zero-config HTTPS; GitHub auto-deploy; HTTPS required for Geolocation API |
| Node | Node.js | v18.20.4 | Build environment | Existing constraint; Vite 5 is the latest Node-18-compatible version |
| Package Manager | npm | 9.x | Dependency management | Default for Vite `create` scaffolding |

### Key Dependencies (`package.json`)

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@tanstack/react-query": "^5.0.0",
    "recharts": "^2.12.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "rollup-plugin-visualizer": "^5.0.0"
  }
}
```

### Bundle Size Targets

| Segment | Budget | Notes |
|---------|--------|-------|
| Total JS (gzipped) | < 300 KB | Verified with `rollup-plugin-visualizer` on each build |
| React + ReactDOM | ~45 KB gzipped | Fixed cost |
| TanStack Query v5 | ~13 KB gzipped | Fixed cost |
| Recharts | ~80–100 KB gzipped | Largest single dependency; monitor for overrun |
| App code + utils | < 80 KB gzipped | Target |

If Recharts causes the 300 KB budget to be exceeded, the mitigation is lazy-loading the chart component via `React.lazy()` + `Suspense`.

---

## 14. Deployment Architecture

### Build Process

```
1. npm run build
       │
       ▼
   TypeScript compilation (tsc --noEmit)
   Zero errors required in strict mode
       │
       ▼
   Vite 5 bundle (vite build)
   - Tree-shakes unused code
   - Minifies and gzips output
   - Outputs to dist/
       │
       ▼
   dist/
   ├── index.html              (entry point for all routes)
   ├── assets/
   │   ├── index.[hash].js     (main bundle, gzipped < 300 KB)
   │   └── index.[hash].css    (Tailwind output, purged)
   └── icons/
       └── *.svg               (weather condition icons from public/)
```

### Vercel Configuration (`vercel.json`)

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy", "value": "..." },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

The rewrite rule ensures that any direct URL (e.g. a bookmarked deep link) serves `index.html` rather than a 404. React handles routing client-side.

### Vite Config (`vite.config.ts`)

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      plugins: [
        // Bundle analysis (remove before production or guard with env flag)
        // visualizer({ open: false, gzipSize: true, filename: "dist/stats.html" }),
      ],
    },
  },
});
```

### TypeScript Config (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### CI/CD Pipeline

```
Developer workstation
      │
      │  git push origin main
      ▼
GitHub repository (main branch)
      │
      │  Vercel GitHub integration webhook
      ▼
Vercel Build Runner
      ├── node --version   → v18.20.4 (configured in Vercel project settings)
      ├── npm install
      ├── npm run build    → tsc --noEmit && vite build
      └── [if build fails] → deploy blocked; previous version remains live
      │
      │  [if build succeeds]
      ▼
Vercel Edge Network
      ├── dist/ deployed globally
      ├── HTTPS certificate provisioned (automatic)
      └── Production URL live (no manual step)
```

No `.env` file is required. No secrets are configured in Vercel. No API keys exist.

---

## 15. Key Architectural Decisions

### Decision 1: Geocoding is Separate from Weather Fetching

**Decision:** The city search flow (Open-Meteo Geocoding → `GeocodingResult[]`) and the weather data flow (lat/lon → Open-Meteo Forecast → `WeatherData`) are distinct API calls with separate TanStack Query keys.

**Rationale:** Coupling them (e.g. one combined hook) would force re-fetching weather whenever a user types in the search box, even for a location already in cache. Separate caching enables: (1) autocomplete suggestions cached independently by search string, (2) weather data cached by exact coordinates, (3) switching between two previously-viewed cities is instant with zero API calls.

**Implementation constraint:** The `LocationResult` (containing lat/lon + timezone) is the hand-off between the geocoding and weather layers. It is the only value passed to `useWeatherData`.

---

### Decision 2: `timezone=auto` is Non-Negotiable

**Decision:** Every Open-Meteo Forecast API request sends `timezone=auto`. This parameter is hardcoded in `weatherApi.ts` and cannot be overridden or omitted.

**Rationale:** Without `timezone=auto`, all timestamps are returned in UTC. This breaks: (1) sunrise/sunset times shown in the user's local time, (2) hourly forecast labels (a "14:00" in UTC is a different hour in Tokyo), (3) the `isDay` field per hour. This is the single most common cause of incorrect time display in weather apps.

**Implementation constraint:** The `weatherApi.ts` service function constructs the URL with `&timezone=auto` as a hardcoded parameter. No caller can override this.

---

### Decision 3: Geolocation is Opt-In Only

**Decision:** The GPS button is an enhancement — city text search is always the primary path. The app never calls `navigator.geolocation.getCurrentPosition()` without explicit user activation of the GPS button.

**Rationale:** (1) Geolocation permission denial must never produce a blank screen or stuck state — the app must function without it. (2) Unsolicited permission requests frustrate users and reduce grant rates. (3) On non-HTTPS environments (local dev via HTTP), geolocation throws without graceful handling — this design prevents that failure mode.

**Implementation constraint:** The GPS button is the sole trigger for geolocation. Denial sets the button back to idle state silently. No error is shown to the user for `PERMISSION_DENIED`.

---

### Decision 4: Integer-Only Temperature Display

**Decision:** All temperatures are displayed as integers. `Math.round()` is applied in the `transformForecastResponse()` function at the API boundary. Components receive integers and never apply rounding themselves.

**Rationale:** Displaying "18.47°C" instead of "18°C" creates false precision that users don't need and don't trust. The transformation boundary (service layer, not component layer) is the correct place to enforce this — it ensures no component can accidentally display a float.

**Implementation constraint:** `CurrentConditions.temperature`, `HourlyForecast.temperature`, and `DailyForecast.high`/`low` are all typed as `number` with the documented constraint that values are integers. The Fahrenheit conversion also applies `Math.round()`: `Math.round((celsius * 9/5) + 32)`.

---

### Decision 5: No Backend for v1

**Decision:** The app is purely frontend-only. All state is in component-local React state, TanStack Query's in-memory cache, and `localStorage`. There is no server, no serverless function, no edge function, and no database of any kind.

**Rationale:** (1) Zero infrastructure cost — Vercel static hosting is free. (2) Zero attack surface for server-side vulnerabilities. (3) Open-Meteo and Nominatim require no API keys, eliminating the only reason a backend would otherwise be needed (key proxying). (4) Simplicity — no backend means no deployment complexity, no CORS configuration, no rate-limit proxying.

**Implementation constraint:** If a future feature requires an API key, a backend will be required. This architectural decision is explicitly scoped to v1.

---

### Decision 6: Vite 5 over Vite 8

**Decision:** The project uses Vite 5, not Vite 8.

**Rationale:** The build environment runs Node.js v18.20.4. Vite 8 requires Node.js ≥ 20. Vite 5 is the latest release series that supports Node 18. All features required by this project (Tailwind CSS v4 Vite plugin, React plugin, static build) are fully supported in Vite 5.

**Implementation constraint:** The `vite` package is pinned to `^5.0.0` in `package.json`. Vercel build settings specify Node 18. If the environment is upgraded to Node 20+, Vite can be upgraded to v8 without any code changes.

---

### Decision 7: Tailwind CSS v4 with Vite Plugin

**Decision:** Tailwind CSS v4 is used via the `@tailwindcss/vite` plugin (not the PostCSS plugin used in v3).

**Rationale:** Tailwind v4's Vite plugin integrates directly into the Vite build pipeline without PostCSS configuration, reducing build toolchain complexity. The utility-first approach eliminates CSS file management overhead and enables co-located responsive breakpoints (`md:`, `lg:`) in JSX.

**Implementation constraint:** The `tailwind.config.ts` file is minimal or absent (v4 uses CSS-based configuration). The `@tailwindcss/vite` plugin is listed in `vite.config.ts` plugins array.

---

### Decision 8: Transformation at the API Boundary

**Decision:** Raw API responses (`OpenMeteoForecastResponse`, `OpenMeteoGeocodingResponse`, `NominatimReverseResponse`) are transformed into canonical application types (`WeatherData`, `GeocodingResult[]`) inside the service functions before being returned to TanStack Query. Components never receive raw API types.

**Rationale:** (1) Components are simpler — they receive clean, typed data with no null-handling or format conversion. (2) The transformation logic (rounding, null defaults, array slicing) is testable in isolation from React. (3) If Open-Meteo changes their API response shape, only the service layer needs updating.

**Implementation constraint:** `src/types/api.ts` contains raw API shapes. `src/types/weather.ts` contains canonical application types. The `transformForecastResponse()` function in `src/services/weatherApi.ts` is the only place raw types are converted to application types.

---

*TechArch version 1.0 — generated 2026-05-01*
*Sources: PRD-WeatherApp.md v1.0, FRD-WeatherApp.md v1.0, PROJECT.md*
*Covers: Component architecture, data flow, TypeScript types, API integration, caching, timezone handling, error boundaries, responsive layout, accessibility, security, deployment*
