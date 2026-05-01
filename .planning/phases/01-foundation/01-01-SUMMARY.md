---
phase: 01-foundation
plan: "01"
subsystem: foundation
tags: [dependencies, types, utilities, tanstack-query, tailwind, react19]
dependency_graph:
  requires: []
  provides:
    - WeatherData, CurrentConditions, LocationResult, GeocodingResult, HourlyForecast, DailyForecast (src/types/weather.ts)
    - UnitPreference, RecentSearch (src/types/storage.ts)
    - OpenMeteoForecastResponse, OpenMeteoGeocodingResponse, NominatimReverseResponse (src/types/api.ts)
    - queryKeys.weather, queryKeys.geocoding (src/constants/queryKeys.ts)
    - WMO_CODE_MAP, getConditionInfo, ConditionInfo (src/utils/weatherCodes.ts)
    - celsiusToFahrenheit, formatTemperature, toDisplayTemp, unitSymbol (src/utils/temperature.ts)
    - kmhToMph, degreesToCardinal (src/utils/wind.ts)
    - formatHour, formatDayLabel, formatTime, formatFreshness (src/utils/time.ts)
    - getHeroGradient (src/utils/gradient.ts)
    - readUnitPreference, writeUnitPreference, readRecentSearches, writeRecentSearch (src/utils/localStorage.ts)
  affects:
    - All subsequent plans depend on these types and utilities
tech_stack:
  added:
    - "@tanstack/react-query@^5.100.6"
    - "recharts@^2.15.4"
    - "tailwindcss@^4.2.4"
    - "@tailwindcss/vite@^4.2.4"
    - "react@^19.2.5 (upgraded from 18.3.1)"
    - "react-dom@^19.2.5 (upgraded from 18.3.1)"
    - "@types/react@^19.2.14 (upgraded from 18.3.12)"
    - "@types/react-dom@^19.2.3 (upgraded from 18.3.1)"
  patterns:
    - TanStack Query v5 with QueryClientProvider wrapping App
    - Tailwind CSS v4 via @tailwindcss/vite Vite plugin
    - WMO code map with fallback pattern
    - localStorage helpers with try/catch for SecurityError and JSON.parse failures
key_files:
  created:
    - src/types/weather.ts
    - src/types/storage.ts
    - src/types/api.ts
    - src/constants/queryKeys.ts
    - src/utils/weatherCodes.ts
    - src/utils/temperature.ts
    - src/utils/wind.ts
    - src/utils/time.ts
    - src/utils/gradient.ts
    - src/utils/localStorage.ts
  modified:
    - package.json
    - package-lock.json
    - vite.config.ts
    - src/main.tsx
    - src/index.css
decisions:
  - "Manually placed @tailwindcss/oxide-linux-x64-gnu native binary into oxide package dir to resolve Node 18 npm optional dependency skip issue"
  - "TanStack Query staleTime=10min, gcTime=30min, retry=2 as specified in TechArch §7"
  - "WMO_CODE_MAP uses 24 discrete code entries; unknown codes fall back to Clear Sky via FALLBACK constant"
metrics:
  duration: "~15 minutes"
  completed: "2026-05-01"
  tasks_completed: 3
  files_created: 10
  files_modified: 5
---

# Phase 1 Plan 01: Foundation Bootstrap Summary

**One-liner:** React 19 + TanStack Query v5 + Tailwind CSS v4 project bootstrap with complete TypeScript type system and utility layer for Open-Meteo weather API.

---

## What Was Built

This plan bootstrapped all shared foundation artifacts required by every subsequent plan:

1. **Dependency setup** — Installed and configured TanStack Query v5, Recharts, Tailwind CSS v4, upgraded React to v19
2. **TypeScript type system** — Complete type definitions for all weather data shapes, storage types, and raw API responses
3. **Utility layer** — Six utility modules covering weather codes, temperature, wind, time formatting, hero gradients, and localStorage

---

## Packages Installed and Versions

### New Runtime Dependencies
| Package | Version Installed | Purpose |
|---------|------------------|---------|
| `@tanstack/react-query` | `^5.100.6` | Server state management |
| `recharts` | `^2.15.4` | Chart components for forecasts |

### New Dev Dependencies
| Package | Version Installed | Purpose |
|---------|------------------|---------|
| `tailwindcss` | `^4.2.4` | Utility CSS framework |
| `@tailwindcss/vite` | `^4.2.4` | Tailwind v4 Vite integration |

### Upgraded Packages
| Package | From | To |
|---------|------|----|
| `react` | `^18.3.1` | `^19.2.5` |
| `react-dom` | `^18.3.1` | `^19.2.5` |
| `@types/react` | `^18.3.12` | `^19.2.14` |
| `@types/react-dom` | `^18.3.1` | `^19.2.3` |

---

## Files Created

### Type Definitions

**`src/types/weather.ts`**
- Exports: `GeocodingResult`, `LocationResult`, `WeatherData`, `CurrentConditions`, `HourlyForecast`, `DailyForecast`
- All fields match TechArch §5 exactly

**`src/types/storage.ts`**
- Exports: `UnitPreference` (union type), `RecentSearch`

**`src/types/api.ts`**
- Exports: `OpenMeteoGeocodingResponse`, `OpenMeteoForecastResponse`, `NominatimReverseResponse`
- Raw API response shapes with snake_case field names

**`src/constants/queryKeys.ts`**
- Exports: `queryKeys` with `weather(lat, lon)` and `geocoding(query)` factories

### Utility Functions

**`src/utils/weatherCodes.ts`**
- Exports: `ConditionInfo` (interface), `WMO_CODE_MAP` (24 code entries), `getConditionInfo`
- Unknown codes fall back to `FALLBACK` (Clear Sky/Sun/Moon)

**`src/utils/temperature.ts`**
- Exports: `celsiusToFahrenheit`, `formatTemperature`, `toDisplayTemp`, `unitSymbol`
- All conversions use `Math.round()` — never `toFixed()`

**`src/utils/wind.ts`**
- Exports: `kmhToMph`, `degreesToCardinal`
- 16-point compass with `Math.round(kmh * 0.621371)` conversion

**`src/utils/time.ts`**
- Exports: `formatHour`, `formatDayLabel`, `formatTime`, `formatFreshness`
- All use `Intl.DateTimeFormat` with explicit `timeZone` parameter — never browser local timezone

**`src/utils/gradient.ts`**
- Exports: `getHeroGradient`
- Maps all WMO condition groups to CSS linear-gradient strings per FRD §F4

**`src/utils/localStorage.ts`**
- Exports: `readUnitPreference`, `writeUnitPreference`, `readRecentSearches`, `writeRecentSearch`
- Every read/write wrapped in try/catch for SecurityError
- `writeRecentSearch` deduplicates by ±0.001° lat/lon, move-to-front, max 5 entries

---

## Files Modified

**`vite.config.ts`** — Added `@tailwindcss/vite` plugin, removed default Vite template config

**`src/index.css`** — Replaced all Vite default CSS with `@import "tailwindcss";`

**`src/main.tsx`** — Added `QueryClientProvider` wrapping `<App>` with:
- `staleTime: 10 * 60 * 1000` (10 minutes)
- `gcTime: 30 * 60 * 1000` (30 minutes)
- `retry: 2`
- Exponential backoff via `retryDelay`
- `refetchOnWindowFocus: true`, `refetchOnReconnect: true`

---

## Issues Encountered and Resolved

### Issue: `@tailwindcss/oxide` Native Binding Missing on Node 18

**Root cause:** `@tailwindcss/oxide@4.2.4` requires Node >= 20. On Node 18.20.4, npm silently skips optional dependencies that fail engine checks. The native `.node` binary (`tailwindcss-oxide.linux-x64-gnu.node`) was never placed in `node_modules/@tailwindcss/oxide/`.

**Error:** `Error: Cannot find native binding` when Vite tried to load `vite.config.ts`.

**Resolution (Rule 3 — Auto-fix blocking issue):**
1. Used `npm pack @tailwindcss/oxide-linux-x64-gnu@4.2.4` to download the package to `/tmp/`
2. Extracted the tarball to get `tailwindcss-oxide.linux-x64-gnu.node`
3. Copied the binary to `node_modules/@tailwindcss/oxide/tailwindcss-oxide.linux-x64-gnu.node`
4. The `oxide/index.js` loader first tries `require('./tailwindcss-oxide.linux-x64-gnu.node')` locally — this now succeeds

**Outcome:** Build passes cleanly. The binary is in the working tree but not committed (it's in node_modules which is gitignored).

---

## Commits

| Hash | Description |
|------|-------------|
| `b4b1ba2` | feat(01-01): install dependencies and configure Vite + Tailwind CSS v4 + TanStack Query v5 |
| `2458d92` | feat(01-01): create TypeScript type definitions (weather.ts, storage.ts, api.ts, queryKeys.ts) |
| `3985e8e` | feat(01-01): create utility functions (weatherCodes, temperature, wind, time, gradient, localStorage) |

---

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed missing `@tailwindcss/oxide` native binding on Node 18**
- **Found during:** Task 1 build verification
- **Issue:** npm silently skips optional packages on Node 18 when engine requirement is Node >= 20, leaving `@tailwindcss/oxide` without its native `.node` binary
- **Fix:** Manually downloaded `@tailwindcss/oxide-linux-x64-gnu@4.2.4` via `npm pack`, extracted the binary, and placed it in the oxide package directory
- **Files modified:** `node_modules/@tailwindcss/oxide/tailwindcss-oxide.linux-x64-gnu.node` (not committed — in gitignored node_modules)
- **Commit:** Part of b4b1ba2 (verification passed after fix)

---

## Final Build Status

```
vite v5.4.21 building for production...
✓ 84 modules transformed.
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/react-CHdo91hT.svg    4.13 kB │ gzip:  2.14 kB
dist/assets/index-CgNk-Xr9.css   21.97 kB │ gzip:  5.03 kB
dist/assets/index-CetXSH0p.js   222.83 kB │ gzip: 69.04 kB
✓ built in 1.82s
```

**Status: PASSED** — `npm run build` exits 0 with zero TypeScript errors.

---

## Self-Check: PASSED

All 10 created files verified present on disk. All 3 task commits verified in git log.
