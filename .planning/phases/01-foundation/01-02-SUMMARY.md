---
phase: 01-foundation
plan: "02"
subsystem: api
tags: [open-meteo, nominatim, tanstack-query, geolocation, localstorage, react-hooks]

# Dependency graph
requires:
  - phase: 01-foundation
    plan: "01"
    provides: "WeatherData, LocationResult, GeocodingResult types; queryKeys; localStorage utils; UnitPreference, RecentSearch types"
provides:
  - fetchWeatherData() with timezone=auto hardcoded (src/services/weatherApi.ts)
  - transformForecastResponse() with Math.round() on all temps, precipitationProbability from daily[0] (src/services/weatherApi.ts)
  - searchCity() for Open-Meteo Geocoding API (src/services/geocodingApi.ts)
  - reverseGeocode() with Nominatim User-Agent header (src/services/nominatimApi.ts)
  - useWeatherData TanStack Query hook (src/hooks/useWeatherData.ts)
  - useGeocodingSearch with 300ms debounce (src/hooks/useGeocodingSearch.ts)
  - useReverseGeocode two-step Nominatim→Open-Meteo (src/hooks/useReverseGeocode.ts)
  - useGeolocation with silent PERMISSION_DENIED handling (src/hooks/useGeolocation.ts)
  - useUnitPreference localStorage-synced (src/hooks/useUnitPreference.ts)
  - useRecentSearches move-to-front max-5 (src/hooks/useRecentSearches.ts)
  - useFreshnessTimer ticking 60s interval (src/hooks/useFreshnessTimer.ts)
affects:
  - Plans 03 and 04 (UI components consume these hooks)
  - All weather display components depend on transformForecastResponse contract

# Tech tracking
tech-stack:
  added: []
  patterns:
    - TanStack Query useQuery with enabled flag for conditional fetching
    - Two-step reverse geocoding (Nominatim city name → Open-Meteo canonical LocationResult)
    - 300ms debounce using useState + useEffect clearTimeout pattern
    - GPS PERMISSION_DENIED silent status pattern (no error shown to user)
    - localStorage sync on every toggle (not on unmount)

key-files:
  created:
    - src/services/weatherApi.ts
    - src/services/geocodingApi.ts
    - src/services/nominatimApi.ts
    - src/hooks/useWeatherData.ts
    - src/hooks/useGeocodingSearch.ts
    - src/hooks/useReverseGeocode.ts
    - src/hooks/useGeolocation.ts
    - src/hooks/useUnitPreference.ts
    - src/hooks/useRecentSearches.ts
    - src/hooks/useFreshnessTimer.ts
  modified: []

key-decisions:
  - "precipitationProbability in CurrentConditions sourced from daily.precipitation_probability_max[0] — current block has no precip field"
  - "useReverseGeocode uses retry:false — GPS-triggered calls should not be retried automatically"
  - "useFreshnessTimer returns empty string when fetchedAt=0 — no stale label shown before first fetch"

patterns-established:
  - "API service files are pure fetch functions — no React, no hooks, no side effects"
  - "Hooks consume services via TanStack Query — no direct fetch() calls in hooks"
  - "All temperature rounding happens in transformForecastResponse() — never in components"

# Metrics
duration: 3min
completed: 2026-05-27
---

# Phase 1 Plan 02: API Services and Custom Hooks Summary

**Three Open-Meteo/Nominatim service functions + 7 custom React hooks providing complete data-fetching layer with timezone=auto enforcement, integer temperature transformation, and silent GPS denial handling.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-27T14:35:58Z
- **Completed:** 2026-05-27T14:39:00Z
- **Tasks:** 2 completed
- **Files modified:** 10 created

## Accomplishments
- Created 3 pure service functions: `fetchWeatherData`, `searchCity`, `reverseGeocode`
- `transformForecastResponse()` enforces all data invariants: integer temps, timezone=auto, precipitation from daily[0]
- Created 7 custom hooks covering all data-fetching, state, and storage concerns
- `useGeocodingSearch` 300ms debounce with 2-character minimum
- `useGeolocation` handles all GPS error codes with PERMISSION_DENIED as silent reset
- `npm run build` exits 0 with zero TypeScript errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Create API service functions (weatherApi, geocodingApi, nominatimApi)** - `6b948a7` (feat)
2. **Task 2: Create custom React hooks** - `7ed3336` (feat)

**Plan metadata:** _(docs commit follows)_

## Files Created/Modified

### Service Files
- `src/services/weatherApi.ts` — `fetchWeatherData()` + `transformForecastResponse()` for Open-Meteo Forecast API
- `src/services/geocodingApi.ts` — `searchCity()` for Open-Meteo Geocoding API
- `src/services/nominatimApi.ts` — `reverseGeocode()` for Nominatim reverse geocoding with User-Agent header

### Hook Files
- `src/hooks/useWeatherData.ts` — TanStack Query hook; enabled only when `location !== null`
- `src/hooks/useGeocodingSearch.ts` — 300ms debounce; enabled only when `debouncedQuery.length >= 2`
- `src/hooks/useReverseGeocode.ts` — Two-step: Nominatim city name → Open-Meteo canonical `LocationResult`
- `src/hooks/useGeolocation.ts` — GPS wrapper; PERMISSION_DENIED → `{status:"denied"}` (silent)
- `src/hooks/useUnitPreference.ts` — `readUnitPreference()` on init; `writeUnitPreference()` on every toggle
- `src/hooks/useRecentSearches.ts` — `addSearch()` writes then re-reads for fresh deduped state
- `src/hooks/useFreshnessTimer.ts` — Ticks every 60s; returns `""` when `fetchedAt === 0`

## Decisions Made

- **precipitationProbability source:** Open-Meteo's `current` block does not include a precipitation probability field. Sourced from `daily.precipitation_probability_max[0]` (today's max) instead — this is the correct interpretation per TechArch §6.1.
- **useReverseGeocode with `retry: false`:** GPS-triggered reverse geocode calls should not retry automatically since GPS coordinates are fleeting user actions, not stable query keys.
- **useFreshnessTimer returns `""` for `fetchedAt === 0`:** Before the first fetch, no freshness label should render. Empty string lets UI components conditionally show the label.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Reinstalled npm dependencies (node_modules was empty)**
- **Found during:** Task 2 build verification
- **Issue:** `node_modules/` directory was empty (0 packages); all imports failed TypeScript compilation
- **Fix:** Ran `npm install` to restore all 228 packages; re-applied the known `@tailwindcss/oxide-linux-x64-gnu` binary fix (same Node 18 issue documented in Plan 01-01)
- **Files modified:** `node_modules/` (gitignored); no source files changed
- **Verification:** `npm run build` exited 0 after fix
- **Committed in:** Not committed — node_modules is gitignored

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Node_modules empty was a pre-existing environment issue, not caused by this plan's changes. Fix was a one-command restore identical to Plan 01-01's documented workaround.

## Issues Encountered
- `@tailwindcss/oxide` native binding missing again after `npm install` — same Node 18 optional dependency skip documented in Plan 01-01. Applied same fix: `npm pack @tailwindcss/oxide-linux-x64-gnu@4.2.4`, extract, copy `.node` binary to oxide package dir.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All data-fetching infrastructure complete for Plans 03 and 04
- Components can now import: `useWeatherData`, `useGeocodingSearch`, `useGeolocation`, `useUnitPreference`, `useRecentSearches`, `useFreshnessTimer`
- Service functions available for any direct use if needed
- `npm run build` exits 0 — ready to add UI components

---
*Phase: 01-foundation*
*Completed: 2026-05-27*

## Self-Check: PASSED

All 10 created files verified present on disk. Both task commits (6b948a7, 7ed3336) verified in git log.
