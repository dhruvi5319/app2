# Simple Weather App

## What This Is

A frontend-only single-page web application that answers one question instantly: "What's the weather right now, and what should I expect?" Users type any city name and receive current conditions plus a multi-day forecast in under 2 seconds — no account required, no ads, no backend. It targets the proven gap between "fast but ugly" developer tools (wttr.in) and "polished but bloated" consumer apps (Weather.com, AccuWeather).

## Core Value

Answer "do I need an umbrella?" in under 3 seconds — current temperature and conditions visible above the fold with zero friction, no account, no ads.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] **F0**: User can search for weather by city name with autocomplete suggestions; optional GPS geolocation; recent searches persist in localStorage
- [ ] **F1**: Hero section shows current temperature (integer only), feels-like, condition icon+label (day/night variants), today's high/low, precipitation probability, humidity, wind speed; °C/°F toggle on main screen; skeleton + error states always present
- [ ] **F2**: Horizontally scrollable 24-hour forecast row with hour label, icon, temp, and precipitation probability per card; min 44px touch targets
- [ ] **F3**: 7-day daily forecast list (day name, icon, high/low, precipitation probability) plus Recharts AreaChart temperature trend visualization
- [ ] **F4**: Full WMO weather code icon set (0–99) with day/night variants; condition-aware background gradient in hero; all backgrounds achieve WCAG 4.5:1 contrast
- [ ] **F5**: Mobile-first responsive layout from 375px to 1280px+; single-column mobile, two-column tablet, horizontal desktop; no horizontal overflow; all tap targets ≥ 44px
- [ ] **F6**: Collapsible "Details" panel (collapsed by default) showing UV index, wind direction, visibility, humidity, sunrise/sunset in local timezone
- [ ] **F7**: "Updated X minutes ago" freshness indicator; TanStack Query staleTime 10 minutes; offline cached-data notice; never a blank screen on network failure
- [ ] **F8**: WCAG 2.2 Level AA — keyboard navigation, aria-live regions, icon+text condition labels, 44px targets, Recharts accessible fallback, prefers-reduced-motion
- [ ] **F9**: Open-Meteo CC BY 4.0 attribution footer on every page; deployed to Vercel HTTPS; auto-deploy from GitHub main

### Out of Scope

- User accounts and saved locations — authentication infrastructure not justified for v1 single-location use case
- Severe weather alerts and push notifications — requires persistent backend and NWS feed integration
- Historical weather data — outside core "now/soon" question
- Radar maps — MapLibre/Leaflet complexity not core to "simple weather"
- Air quality index (AQI) — deferred to v2
- Animated weather backgrounds — accessibility complexity deferred; static gradients ship in v1
- Multiple saved locations — localStorage architecture upgrade deferred to v2
- Weather for lat/lon direct input — city name search sufficient for v1
- Autoplay video, advertising, news/trending content — anti-features; never build

## Context

- **PRD source:** `project_specs/ref_docs/PRD.md` — v1.0, generated 2026-04-29, HIGH confidence
- **Codebase scaffold:** React 19 + TypeScript + Vite 5 (Node 18 constraint prevents Vite 8; functionally equivalent)
- **No backend:** All state in component-local state, TanStack Query cache, and localStorage
- **Key risk — timezone bugs:** `timezone=auto` must be set on every Open-Meteo API call from Phase 1; use `Intl.DateTimeFormat` for all time display
- **Key risk — blank screens:** TanStack Query `isLoading`/`isError` + skeleton components must be built in Phase 1, never deferred
- **Key risk — decimal temperatures:** All temperature values must be rounded to integer display in the API response transformation layer
- **Node 18 constraint:** Vite 8 requires Node ≥ 20; using Vite 5 (latest Node-18-compatible version) — all features equivalent
- **Three personas:** Casual Checker (current conditions), Commuter (24h hourly), Outdoor Enthusiast (7-day + secondary metrics)

## Constraints

- **Tech Stack:** React 19 + TypeScript + Vite 5 + Tailwind CSS v4 + TanStack Query v5 + Recharts — pre-decided in PRD
- **No API keys:** Open-Meteo (weather + geocoding) and Nominatim (reverse geocoding) require no authentication
- **Performance:** < 2 seconds to first meaningful weather data on mobile 4G; JS bundle < 300 KB gzipped
- **Accessibility:** WCAG 2.2 Level AA from day one — non-negotiable, not a retrofit
- **Deployment:** Vercel HTTPS required (Browser Geolocation API requires HTTPS)
- **Browser support:** Chromium 110+, Firefox 115+, Safari 16+
- **Node version:** v18.20.4 — constrains Vite to v5 (Vite 8 requires Node ≥ 20)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Geocoding separate from weather fetch | Avoids coupling; enables clean cache invalidation per API | — Pending |
| `timezone=auto` on every Open-Meteo request | Without it, sunrise/sunset, hourly labels break for non-local timezones | — Pending |
| Geolocation opt-in only, never a gate | Denial must never produce blank screen; city search is always primary | — Pending |
| Integer-only temperature display | Decimal precision destroys trust without adding value | — Pending |
| TanStack Query staleTime: 10 minutes | Prevents redundant API calls; Open-Meteo rate limit protection | — Pending |
| No backend for v1 | Eliminates infrastructure cost and attack surface | — Pending |
| Vite 5 instead of Vite 8 | Node 18 constraint — Vite 8 requires Node ≥ 20 | — Pending |
| Tailwind CSS v4 with Vite plugin | Utility-first; no CSS file management overhead; co-located with Vite | — Pending |

---
*Last updated: 2026-05-01 after initialization from PRD.md*
