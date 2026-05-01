---
pivota_spec_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: Not started
last_updated: "2026-05-01T03:44:52.496Z"
progress:
  total_phases: 4
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# State: Simple Weather App

## Project Reference

**Core Value:** Answer "do I need an umbrella?" in under 3 seconds — current temperature and conditions visible above the fold with zero friction, no account, no ads.

**Current Focus:** Phase 1 — Foundation (location search + current conditions)

---

## Current Position

**Active Phase:** 1 — Foundation
**Active Plan:** None (roadmap just created; planning not yet started)
**Status:** Not started
**Progress:** ░░░░░░░░░░ 0%

```
Phase 1: Foundation           ░░░░░░░░░░  Not started
Phase 2: Forecasts & Visuals  ░░░░░░░░░░  Not started
Phase 3: Layout & Details     ░░░░░░░░░░  Not started
Phase 4: Accessibility & Deployment ░░░░░░░░░░  Not started
```

---

## Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Plans complete | - | 0 |
| Phases complete | 4 | 0 |
| Requirements shipped | 10 | 0 |

---

## Accumulated Context

### Key Decisions Made

| Decision | Rationale |
|----------|-----------|
| `timezone=auto` on every Open-Meteo request | Without it, sunrise/sunset, hourly labels, and `isDay` break for non-local timezones — non-negotiable from Phase 1 |
| Integer-only temperature display | `Math.round()` applied in `transformForecastResponse()`, never in components |
| Skeleton components built in Phase 1 | Blank-screen prevention is a foundation concern, not a polish concern |
| Geolocation opt-in, never a gate | GPS denial must never produce a blank screen; city search is always primary |
| TanStack Query `staleTime: 10 minutes` | Rate limit protection + prevents redundant fetches |
| Vite 5 instead of Vite 8 | Node 18 constraint (v18.20.4); functionally equivalent for this project |
| No backend for v1 | All state in component-local state, TanStack Query cache, and `localStorage` |

### Critical Risks to Watch

| Risk | Mitigation |
|------|-----------|
| Timezone display bugs | `timezone=auto` + `Intl.DateTimeFormat` with explicit `timeZone` from `LocationResult` — never browser local timezone |
| Blank screens | TanStack Query `isLoading`/`isError` + skeleton components must be in Phase 1 |
| Decimal temperatures | `Math.round()` enforced in transformation layer, verified before Phase 2 |
| Recharts inaccessible to screen readers | Verify ARIA support in Phase 2; `<table>` fallback via `ChartErrorBoundary` if insufficient |
| WCAG contrast on dynamic gradients | Full gradient palette designed and contrast-verified in Phase 2 before ship |

### Phase Boundary Notes

- **Phase 1 → Phase 2**: `WeatherData` TypeScript interfaces must be stable before Phase 2 (hourly/daily components depend on them)
- **Phase 2 → Phase 3**: All 3 API services (`weatherApi.ts`, `geocodingApi.ts`, `nominatimApi.ts`) must be complete before Phase 3 polish begins
- **Phase 3 → Phase 4**: Responsive layout tested at all breakpoints before accessibility audit; can't audit what's still shifting

### TODOs / Flags

- [ ] Verify Recharts ARIA support when Phase 2 begins — may need `<table>` fallback from the start
- [ ] Bundle size check after Phase 2 (Recharts is the largest dependency; target < 300 KB gzipped)
- [ ] Update Nominatim `User-Agent` header with actual Vercel deploy URL before Phase 4 ship

---

## Session Continuity

**Last session:** 2026-05-01T03:44:52.491Z
**Next action:** Run `/pivota_spec-plan-phase 1` to create the Phase 1 execution plan

**To resume:** Read this file first, then `.planning/ROADMAP.md` for phase structure, then `.planning/REQUIREMENTS.md` for requirement details.

---
*STATE.md initialized: 2026-05-01*
*Last updated: 2026-05-01 after roadmap creation*
