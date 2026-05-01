# Roadmap: Simple Weather App

## Overview

Four phases deliver a frontend-only weather SPA from scaffolded project to production-deployed app. Phase 1 establishes the critical data foundation — location resolution and current conditions — with every safety net (skeletons, error states, timezone handling) in place from day one. Phase 2 builds the complete forecast experience: hourly strip, 7-day list, and the full visual icon/gradient system. Phase 3 layers in the features that serve power users — responsive layout polish, the collapsible details panel, and data freshness/offline handling. Phase 4 completes the product by ensuring every interaction is accessible to all users and deploying to production HTTPS.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Location search + current conditions with full error/loading safety nets
- [ ] **Phase 2: Forecasts & Visuals** - Hourly strip, 7-day daily list, complete icon and gradient system
- [ ] **Phase 3: Layout & Details** - Responsive layout across all breakpoints, details panel, offline/freshness handling
- [ ] **Phase 4: Accessibility & Deployment** - WCAG 2.2 AA compliance, Vercel production deploy, attribution footer

## Phase Details

### Phase 1: Foundation
**Status**: executing
**Goal**: Users can search for any city and see current weather conditions — temperature, feels-like, condition icon, high/low, precipitation, humidity, wind — with no blank screens on any failure path
**Depends on**: Nothing (first phase)
**Requirements**: F0, F1
**Success Criteria** (what must be TRUE):
  1. User types a city name, sees autocomplete suggestions after 2+ characters, selects one, and weather data appears within 2 seconds — no blank screen at any point
  2. User sees current temperature (integer only), feels-like, condition icon + label, today's high/low, precipitation probability, humidity, and wind speed all above the fold at 375px viewport without scrolling
  3. User can toggle °C/°F on the main screen and all temperatures update instantly; preference survives a page reload
  4. A skeleton layout (not a blank screen or spinner-only) appears while data loads; a retry button appears on API failure — never a blank screen
  5. Denying GPS permission leaves city search fully functional with no error or stuck state; recent searches persist as chips and reload weather on click
**Plans**: 5 plans

Plans:
- [ ] 01-01-PLAN.md — Project setup: deps, Tailwind v4, TanStack Query v5, TypeScript types, utility functions
- [ ] 01-02-PLAN.md — API services (weatherApi, geocodingApi, nominatimApi) + custom React hooks
- [ ] 01-03-PLAN.md — Search subsystem: SearchBar, AutocompleteDropdown, GpsButton, RecentSearchChips + e2e tests
- [ ] 01-04-PLAN.md — Hero section: HeroSection, CurrentTemp, ConditionDisplay, WeatherStats, UnitToggle, skeletons, error state + e2e tests
- [ ] 01-05-PLAN.md — App integration: wire App.tsx, weather SVG icons, end-to-end integration tests

### Phase 2: Forecasts & Visuals
**Goal**: Users can see the full forecast picture — 24-hour hourly strip, 7-day daily list with temperature trend chart, and condition-appropriate icons and background gradients across all weather states
**Depends on**: Phase 1
**Requirements**: F2, F3, F4
**Success Criteria** (what must be TRUE):
  1. A horizontally scrollable 24-card hourly strip renders with correct local-timezone hour labels, day/night icon variants, integer temperatures, and precipitation probability on every card — no card omits precipitation even at 0%
  2. A 7-day daily list renders with "Today" as the first label, daytime icons, high-before-low temperatures, and a Recharts AreaChart temperature trend that re-scales when the unit is toggled
  3. Every WMO weather code 0–99 renders an icon without a broken image; unknown codes fall back to Clear Sky gracefully
  4. The hero background gradient updates to reflect the current weather state and time of day (clear day = sky blue, night = deep navy, storm = grey, etc.) and all text on every gradient passes WCAG 4.5:1 contrast
**Plans**: TBD

### Phase 3: Layout & Details
**Goal**: The app is usable on every viewport from 375px to 1280px+, offers a collapsible Details panel for power users, and always shows data freshness — including graceful offline behavior
**Depends on**: Phase 2
**Requirements**: F5, F6, F7
**Success Criteria** (what must be TRUE):
  1. The app renders without horizontal overflow and with all data visible at 375px, 768px, 1024px, and 1280px — no content clipped, no layout broken, all tap targets ≥ 44px at every breakpoint
  2. A "Details" panel (collapsed by default) expands to show UV index, wind direction (cardinal + degrees), visibility (if available), humidity, sunrise, and sunset in the location's local timezone — all times correct for a city in a different timezone than the browser
  3. "Updated X minutes ago" is visible whenever data is loaded; going offline shows a "showing cached data from X minutes ago" banner; with no cache and no network, a friendly error message appears — never a blank screen
**Plans**: TBD

### Phase 4: Accessibility & Deployment
**Goal**: Every user — keyboard-only, screen reader, reduced-motion — can fully use the app, and the app is live at a public HTTPS Vercel URL with Open-Meteo attribution
**Depends on**: Phase 3
**Requirements**: F8, F9
**Success Criteria** (what must be TRUE):
  1. All interactive elements (search, GPS button, forecast cards, unit toggle, details panel) are reachable and operable via keyboard alone with a logical tab order
  2. A screen reader announces weather updates when a new city is loaded via an `aria-live` region; the Recharts chart has an accessible data table or aria-label fallback
  3. All animations respect `prefers-reduced-motion`; no weather condition is conveyed by color alone — icon and text label always appear together
  4. The app is live at a public HTTPS Vercel URL; auto-deploy from GitHub main is working; Open-Meteo CC BY 4.0 attribution link is visible in the footer on every page load
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/5 | Not started | - |
| 2. Forecasts & Visuals | 0/TBD | Not started | - |
| 3. Layout & Details | 0/TBD | Not started | - |
| 4. Accessibility & Deployment | 0/TBD | Not started | - |

---
*Roadmap created: 2026-05-01*
*Coverage: 10/10 v1 requirements mapped ✓*