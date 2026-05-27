---
phase: 02-forecasts-visuals
plan: "01"
subsystem: ui
tags: [react, typescript, tailwind, hourly-forecast, playwright, e2e]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: HourlyForecast type, UnitPreference type, formatHour, toDisplayTemp, unitSymbol, getConditionInfo, WeatherIcon
provides:
  - HourlyCard component (src/components/weather/HourlyCard.tsx)
  - HourlyStrip component (src/components/weather/HourlyStrip.tsx)
  - SkeletonHourly component (src/components/feedback/SkeletonHourly.tsx)
  - Playwright e2e tests for hourly strip (e2e/hourly.spec.ts)
affects:
  - 02-04-app-integration (consumes HourlyStrip + SkeletonHourly)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Horizontal scroll strip with scrollSnapType x mandatory for per-card snapping
    - isFirst prop pattern for "Now" label on first card
    - precipitation % always rendered (never omitted even for 0%)
    - SkeletonHourly matches HourlyCard dimensions for layout-preserving loading state
    - Playwright route mocking with deterministic 24-hour mock data

key-files:
  created:
    - src/components/weather/HourlyCard.tsx
    - src/components/weather/HourlyStrip.tsx
    - src/components/feedback/SkeletonHourly.tsx
    - e2e/hourly.spec.ts
  modified: []

key-decisions:
  - "Used WeatherIcon(weatherCode, isDay) props API instead of plan's incorrect icon prop — WeatherIcon component resolves icon internally"
  - "Precipitation % rendered in both aria-label AND visible span to satisfy WCAG and always-shown invariant"
  - "scrollSnapType x mandatory in inline style (not Tailwind) for reliable cross-browser scroll snap"

patterns-established:
  - "HourlyCard isFirst prop: first card shows 'Now', all others use formatHour(time, timezone)"
  - "Strip components accept hourly[], timezone, unit — no internal data fetching"

# Metrics
duration: 2min
completed: 2026-05-27
---

# Phase 2 Plan 01: Hourly Forecast Strip Summary

**HourlyStrip + HourlyCard + SkeletonHourly components with horizontal scroll, 24-card layout, local-timezone labels, and Playwright e2e test suite with route mocking.**

## Performance

- **Duration:** 2 min
- **Started:** 2026-05-27T16:49:02Z
- **Completed:** 2026-05-27T16:51:40Z
- **Tasks:** 2 completed
- **Files modified:** 4

## Accomplishments
- HourlyStrip horizontal scroll container rendering 24 HourlyCard components with scroll snap
- HourlyCard: "Now" on first card, local-timezone hour labels, day/night weather icon, integer temp with unit, precipitation % always shown (including 0%)
- SkeletonHourly: 8-card pulse animation skeleton matching HourlyCard dimensions
- Playwright e2e test suite: 6 tests covering card count, "Now" label, 0% precip display, integer temps, horizontal scroll, unit toggle without network request

## Task Commits

Each task was committed atomically:

1. **Task 1: Create HourlyCard, HourlyStrip, and SkeletonHourly components** - `ab380b7` (feat)
2. **Task 2: Playwright e2e tests for hourly strip** - `ccfd860` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `src/components/weather/HourlyCard.tsx` — Single hourly card: hour label (Now/time), WeatherIcon, integer temp, precipitation % always shown
- `src/components/weather/HourlyStrip.tsx` — Horizontal scroll container for 24 HourlyCard components, graceful empty state
- `src/components/feedback/SkeletonHourly.tsx` — 8-card pulse animation skeleton with layout-preserving dimensions
- `e2e/hourly.spec.ts` — 6 Playwright tests: card count, Now label, 0% precip, integer temps, scroll, unit toggle

## Decisions Made

- Used `WeatherIcon(weatherCode, isDay)` props instead of the plan's `icon` prop snippet — the existing WeatherIcon component resolves the icon filename internally from weatherCode + isDay, not from a pre-computed icon string
- Precipitation `{forecast.precipitationProbability}%` rendered in both the visible span AND the aria-label to ensure it's always present and accessible
- `scrollSnapType: "x mandatory"` applied via inline style (not Tailwind class) for consistent cross-browser scroll snap behavior

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed incorrect WeatherIcon prop API in HourlyCard**
- **Found during:** Task 1 (HourlyCard implementation)
- **Issue:** Plan code snippet used `<WeatherIcon icon={icon} size={32} alt="" />` but the existing WeatherIcon component (created in Phase 1 Plan 02) accepts `weatherCode` and `isDay` props, not an `icon` prop
- **Fix:** Used `<WeatherIcon weatherCode={forecast.weatherCode} isDay={forecast.isDay} size={32} />` matching the actual component API
- **Files modified:** src/components/weather/HourlyCard.tsx
- **Verification:** TypeScript compiles with zero errors; no `any` casts
- **Committed in:** ab380b7 (Task 1 commit)

**2. [Rule 3 - Blocking] Re-applied @tailwindcss/oxide native binary after npm install**
- **Found during:** Task 1 build verification
- **Issue:** `npm install` run to restore node_modules re-triggered the known Node 18 oxide binary issue (same as Phase 1 Plan 01)
- **Fix:** Re-ran the same fix from Phase 1: `npm pack @tailwindcss/oxide-linux-x64-gnu@4.2.4`, extracted binary, placed in oxide package dir
- **Files modified:** node_modules/@tailwindcss/oxide/tailwindcss-oxide.linux-x64-gnu.node (gitignored)
- **Verification:** `npm run build` exits 0, ✓ 114 modules transformed
- **Committed in:** Not committed (node_modules gitignored)

---

**Total deviations:** 2 (1 bug fix, 1 blocking issue)
**Impact on plan:** Both fixes essential — wrong WeatherIcon API would cause TS error; oxide binary required for build. No scope creep.

## Issues Encountered

- `npm install` was needed to restore missing `vite` package, which then re-triggered the oxide binary missing issue — resolved same way as Phase 1

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- HourlyStrip + HourlyCard + SkeletonHourly are ready for integration in plan 02-04 (App integration)
- E2E tests written; execution deferred to verify phase (`/pivota_spec-verify-work 02-forecasts-visuals`)
- F2 independent of F3 (daily forecast) — both feed into plan 02-04

## Self-Check: PASSED

- `src/components/weather/HourlyCard.tsx` — FOUND
- `src/components/weather/HourlyStrip.tsx` — FOUND
- `src/components/feedback/SkeletonHourly.tsx` — FOUND
- `e2e/hourly.spec.ts` — FOUND
- Commit `ab380b7` — FOUND in git log
- Commit `ccfd860` — FOUND in git log

---
*Phase: 02-forecasts-visuals*
*Completed: 2026-05-27*
