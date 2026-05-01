# Requirements Traceability Matrix
## Simple Weather App — WeatherApp

| Field | Value |
|---|---|
| **Document Type** | Requirements Traceability Matrix (RTM) |
| **Project** | Simple Weather App |
| **Acronym** | WeatherApp |
| **Version** | 1.0 |
| **Date** | 2026-05-01 |
| **Status** | Active |
| **Prepared By** | Pivota Spec RTM Generator |
| **Source PRD** | PRD-WeatherApp.md v1.0 (2026-04-29) |
| **Source FRD** | FRD-WeatherApp.md v1.0 (2026-05-01) |
| **Source TechArch** | TechArch-WeatherApp.md v1.0 (2026-05-01) |
| **Source UserStories** | UserStories-WeatherApp.md v1.0 (2026-05-01) |

---

## Table of Contents

1. [Overview](#1-overview)
2. [Requirements Summary](#2-requirements-summary)
3. [Top-Level Traceability (REQ → Features)](#3-top-level-traceability-req--features)
4. [Full Traceability Matrix (PRD → FRD → TechArch → UserStories)](#4-full-traceability-matrix-prd--frd--techarch--userstories)
5. [Requirements Detail by Feature](#5-requirements-detail-by-feature)
6. [Test Case Coverage Matrix](#6-test-case-coverage-matrix)
7. [Non-Functional Requirements Traceability](#7-non-functional-requirements-traceability)
8. [Change Management Log](#8-change-management-log)
9. [Approval & Sign-Off](#9-approval--sign-off)

---

## 1. Overview

This Requirements Traceability Matrix (RTM) provides bidirectional traceability across all specification documents for the Simple Weather App. It ensures that every top-level requirement is addressed by at least one product feature, every feature is fully specified by functional acceptance criteria, every specification maps to a concrete technical component, and every user story is covered by verifiable acceptance criteria that can be used as test cases.

The Simple Weather App is a frontend-only, single-page React 19 + TypeScript application that answers one question instantly: "What's the weather right now, and what should I expect?" The app has no backend, requires no API keys, and targets a proven market gap between fast-but-ugly developer tools and polished-but-bloated consumer apps.

Traceability spans five levels in this document:

**Level 1 — Business Requirements (REQ):** Five top-level requirements (REQ-01 through REQ-05) derived from the project charter in PROJECT.md and formalised in PRD-WeatherApp.md. Each REQ represents a distinct user capability at the highest level of abstraction.

**Level 2 — Product Features (F):** Ten product features (F0–F9) defined in PRD-WeatherApp.md. Each feature maps to one or more REQ-level requirements. Features have a priority (P0 or P1) and a delivery phase (Phase 1–4).

**Level 3 — Functional Acceptance Criteria (AC):** Seventy acceptance criteria (AC-F0-01 through AC-F9-08) defined in FRD-WeatherApp.md, grouped by feature. Each AC is a testable, binary pass/fail condition. These form the primary test case source.

**Level 4 — Technical Components (COMP):** Named architectural components, services, hooks, and utility functions defined in TechArch-WeatherApp.md. Each component is responsible for implementing one or more acceptance criteria.

**Level 5 — User Stories (US):** Twenty-two user stories (US-01 through US-22) defined in UserStories-WeatherApp.md, each owned by a persona (Maya — Casual Checker, James — Commuter, or Priya — Outdoor Enthusiast). Each user story maps to a product feature and references the acceptance criteria from Level 3.

This RTM uses forward traceability (REQ → US) to confirm complete implementation coverage, and backward traceability (US → REQ) to confirm no orphaned requirements or gold-plating.

---

## 2. Requirements Summary

### Top-Level Requirements (REQ)

- **REQ-01** — User can search for weather by city or location name (city name text search with autocomplete + optional GPS geolocation). Implemented by F0.
- **REQ-02** — User can view current weather conditions including temperature, description, humidity, and wind speed. Implemented by F1.
- **REQ-03** — User can view a multi-day forecast (7-day daily list + 24-hour hourly view). Implemented by F2 and F3.
- **REQ-04** — User can see weather icons and visual indicators for weather conditions (WMO codes 0–99, day/night variants, condition-aware background). Implemented by F2, F3, and F4.
- **REQ-05** — App displays data clearly on both desktop and mobile (375px to 1280px+, mobile-first, no horizontal overflow). Implemented by F5.

### Product Features (F) — Coverage Count

- **F0** — Location Search & Detection → REQ-01 → 4 user stories → 12 acceptance criteria
- **F1** — Current Conditions Display → REQ-02 → 2 user stories → 10 acceptance criteria
- **F2** — Hourly Forecast → REQ-03, REQ-04 → 2 user stories → 8 acceptance criteria
- **F3** — 7-Day Daily Forecast → REQ-03 → 2 user stories → 9 acceptance criteria
- **F4** — Weather Icons & Visual Indicators → REQ-04 → 2 user stories → 7 acceptance criteria
- **F5** — Responsive Layout → REQ-05 → 2 user stories → 7 acceptance criteria
- **F6** — Secondary Weather Details Panel → (no direct REQ mapping; supports REQ-02 broadly) → 2 user stories → 8 acceptance criteria
- **F7** — Data Freshness & Stale State Handling → (no direct REQ mapping; supports reliability NFR) → 2 user stories → 7 acceptance criteria
- **F8** — Accessibility (WCAG AA) → (no direct REQ mapping; mandated NFR) → 3 user stories → 10 acceptance criteria
- **F9** — Attribution & Deployment → (no direct REQ mapping; legal and infrastructure requirement) → 1 user story → 8 acceptance criteria

### User Stories (US) — Persona Distribution

- **P0 (Critical — MVP):** US-01, US-02, US-03, US-04, US-05, US-06, US-09, US-10, US-11, US-12, US-13, US-14, US-22 → 13 stories
- **P1 (High — ship in v1):** US-07, US-08, US-15, US-16, US-17, US-18, US-19, US-20, US-21 → 9 stories
- **Personas covered:** Maya (Casual Checker), James (Commuter), Priya (Outdoor Enthusiast)

### Acceptance Criteria — Total Count

- F0: 12 ACs (AC-F0-01 through AC-F0-12)
- F1: 10 ACs (AC-F1-01 through AC-F1-10)
- F2: 8 ACs (AC-F2-01 through AC-F2-08)
- F3: 9 ACs (AC-F3-01 through AC-F3-09)
- F4: 7 ACs (AC-F4-01 through AC-F4-07)
- F5: 7 ACs (AC-F5-01 through AC-F5-07)
- F6: 8 ACs (AC-F6-01 through AC-F6-08)
- F7: 7 ACs (AC-F7-01 through AC-F7-07)
- F8: 10 ACs (AC-F8-01 through AC-F8-10)
- F9: 8 ACs (AC-F9-01 through AC-F9-08)
- **Total: 86 acceptance criteria across 10 features**

---

## 3. Top-Level Traceability (REQ → Features)

This table maps the five top-level business requirements to their implementing product features, delivery phases, and priorities. All five REQ-level requirements are fully covered.

| REQ ID | Requirement Description | Implementing Features | Phase | Priority | Coverage |
|--------|------------------------|-----------------------|-------|----------|----------|
| REQ-01 | User can search for weather by city/location name | F0 | Phase 1 | P0 | ✓ Full |
| REQ-02 | User can view current weather conditions (temperature, description, humidity, wind) | F1 | Phase 1 | P0 | ✓ Full |
| REQ-03 | User can view a multi-day forecast (3–7 days) | F2, F3 | Phase 2 | P0/P1 | ✓ Full |
| REQ-04 | User can see weather icons/visual indicators for conditions | F2, F3, F4 | Phase 2–3 | P0/P1 | ✓ Full |
| REQ-05 | App displays data clearly on both desktop and mobile | F5 | Phase 3 | P0 | ✓ Full |

**Coverage: 5/5 top-level requirements fully mapped ✓**

*Note: F6, F7, F8, and F9 address non-functional requirements (secondary data, reliability, accessibility, and deployment) mandated by the PRD as constraints and success metrics rather than as numbered REQ items. They are traced in Section 7.*

---

## 4. Full Traceability Matrix (PRD → FRD → TechArch → UserStories)

This is the primary traceability table. Each row links a PRD feature to its FRD acceptance criteria, implementing TechArch components, and associated user stories. Rows are grouped by feature for readability.

### F0 — Location Search & Detection

| PRD Feature | FRD Acceptance Criteria | TechArch Components | User Story |
|-------------|------------------------|---------------------|------------|
| F0 — City name search with 2-char debounce and autocomplete dropdown | AC-F0-01, AC-F0-02, AC-F0-03 | `SearchBar.tsx`, `AutocompleteDropdown.tsx`, `useGeocodingSearch.ts`, `geocodingApi.ts` | US-01 |
| F0 — Selecting a suggestion loads weather and persists to localStorage | AC-F0-04, AC-F0-07 | `App.tsx`, `useRecentSearches.ts`, `localStorage.ts` | US-01, US-03 |
| F0 — "City not found" inline message when no geocoding results | AC-F0-09 | `AutocompleteDropdown.tsx`, `geocodingApi.ts` | US-01 |
| F0 — GPS geolocation button (opt-in), loading state, permission handling | AC-F0-05, AC-F0-06, AC-F0-10 | `GpsButton.tsx`, `useGeolocation.ts`, `useReverseGeocode.ts`, `nominatimApi.ts` | US-02 |
| F0 — Recent searches persisted in localStorage as quick-select chips | AC-F0-07, AC-F0-08 | `RecentSearchChips.tsx`, `useRecentSearches.ts`, `localStorage.ts` | US-03 |
| F0 — Keyboard-navigable autocomplete (`↑`/`↓`/`Enter`/`Escape`) | AC-F0-11, AC-F0-12 | `AutocompleteDropdown.tsx`, `SearchBar.tsx` | US-04 |

### F1 — Current Conditions Display

| PRD Feature | FRD Acceptance Criteria | TechArch Components | User Story |
|-------------|------------------------|---------------------|------------|
| F1 — Integer temperature display; all hero data above the fold at 375px | AC-F1-01, AC-F1-02 | `HeroSection.tsx`, `CurrentTemp.tsx`, `WeatherStats.tsx` | US-05 |
| F1 — Skeleton loading state while fetching | AC-F1-06 | `SkeletonHero.tsx`, `useWeatherData.ts` | US-05 |
| F1 — Error state with "Try again" button on fetch failure | AC-F1-07 | `ErrorState.tsx`, `useWeatherData.ts` | US-05 |
| F1 — Condition icon with correct day/night variant; text label always paired | AC-F1-08, AC-F1-09 | `ConditionDisplay.tsx`, `WeatherIcon.tsx`, `weatherCodes.ts` | US-05 |
| F1 — °C/°F toggle visible on main screen; unit persisted to localStorage | AC-F1-03, AC-F1-04, AC-F1-05 | `UnitToggle.tsx`, `useUnitPreference.ts`, `localStorage.ts` | US-06 |
| F1 — Wind speed converted to mph/km/h based on active unit | AC-F1-10 | `WeatherStats.tsx`, `wind.ts`, `temperature.ts` | US-06 |

### F2 — Hourly Forecast

| PRD Feature | FRD Acceptance Criteria | TechArch Components | User Story |
|-------------|------------------------|---------------------|------------|
| F2 — Exactly 24 hourly cards; each showing hour, icon, integer temp, precipitation % | AC-F2-01, AC-F2-02, AC-F2-07 | `HourlyStrip.tsx`, `HourlyCard.tsx`, `useWeatherData.ts` | US-07 |
| F2 — Hour labels use location timezone (not device timezone) | AC-F2-03 | `HourlyCard.tsx`, `time.ts`, `formatHour()` | US-07 |
| F2 — Horizontally scrollable; no body overflow; unit toggle updates without re-fetch | AC-F2-05, AC-F2-08 | `HourlyStrip.tsx`, `useUnitPreference.ts` | US-07 |
| F2 — Correct day/night icon variant per `HourlyForecast.isDay`; 44px touch targets | AC-F2-04, AC-F2-06 | `HourlyCard.tsx`, `WeatherIcon.tsx`, `weatherCodes.ts` | US-08 |
| F2 — Scroll-snap; keyboard `←`/`→` scrolling once strip focused | AC-F2-04 | `HourlyStrip.tsx` | US-08 |

### F3 — 7-Day Daily Forecast

| PRD Feature | FRD Acceptance Criteria | TechArch Components | User Story |
|-------------|------------------------|---------------------|------------|
| F3 — Exactly 7 daily rows; today labelled "Today"; day names from location timezone | AC-F3-01, AC-F3-02, AC-F3-09 | `DailyForecastList.tsx`, `DailyForecastRow.tsx`, `time.ts`, `formatDayLabel()` | US-09 |
| F3 — Each row: daytime icon, high temp, low temp, precipitation % | AC-F3-03, AC-F3-04, AC-F3-05 | `DailyForecastRow.tsx`, `WeatherIcon.tsx`, `weatherCodes.ts` | US-09 |
| F3 — Recharts AreaChart with high/low curves; Y-axis updates on unit toggle | AC-F3-06, AC-F3-07 | `TemperatureTrendChart.tsx`, `ChartErrorBoundary.tsx` | US-10 |
| F3 — Chart error boundary renders raw `<table>` fallback on Recharts exception | AC-F3-08 | `ChartErrorBoundary.tsx` | US-10 |
| F3 — Chart accessible fallback: `role="img"` + `aria-label` + sr-only `<table>` | AC-F3-08 | `TemperatureTrendChart.tsx` (accessibility section) | US-10 |

### F4 — Weather Icons & Visual Indicators

| PRD Feature | FRD Acceptance Criteria | TechArch Components | User Story |
|-------------|------------------------|---------------------|------------|
| F4 — Full WMO code 0–99 mapping; unknown codes fall back to code 0 | AC-F4-01, AC-F4-02 | `weatherCodes.ts`, `WMO_CODE_MAP`, `getConditionInfo()` | US-11 |
| F4 — Single `getConditionInfo()` source of truth; no inline switch-case in components | AC-F4-01 | `weatherCodes.ts`, `WeatherIcon.tsx` | US-11 |
| F4 — Conditions never communicated by colour alone; icon + text label always paired | AC-F4-07 | `ConditionDisplay.tsx`, `WeatherIcon.tsx` | US-11 |
| F4 — Day/night icon variants correct in hero, hourly, and daily contexts | AC-F4-03, AC-F4-04 | `ConditionDisplay.tsx`, `HourlyCard.tsx`, `DailyForecastRow.tsx`, `weatherCodes.ts` | US-12 |
| F4 — Hero background gradient condition-aware; updates on location change | AC-F4-05, AC-F4-06 | `HeroSection.tsx`, `gradient.ts`, `getHeroGradient()` | US-12 |
| F4 — All gradient + text combos achieve ≥ 4.5:1 contrast (manual audit) | AC-F4-05 | Design constraint — verified manually prior to deploy | US-12 |

### F5 — Responsive Layout

| PRD Feature | FRD Acceptance Criteria | TechArch Components | User Story |
|-------------|------------------------|---------------------|------------|
| F5 — Single-column mobile layout at 375px; no horizontal overflow; min 44px targets | AC-F5-01, AC-F5-02, AC-F5-04 | `AppLayout.tsx`, Tailwind base styles, all interactive components | US-13 |
| F5 — All weather data accessible by vertical scroll only; no text below 12px | AC-F5-05, AC-F5-06 | `AppLayout.tsx`, responsive Tailwind classes | US-13 |
| F5 — Tablet (768px) two-column hero; desktop (1024px+) side-by-side panels; max-w-4xl | AC-F5-01, AC-F5-03 | `AppLayout.tsx`, `HeroSection.tsx`, Tailwind `md:` and `lg:` prefixes | US-14 |
| F5 — No JS viewport detection; layout via Tailwind responsive prefixes only | AC-F5-03 | `AppLayout.tsx`, Tailwind CSS v4 | US-14 |
| F5 — Unit toggle visible and usable at all breakpoints | AC-F5-07 | `UnitToggle.tsx`, responsive Tailwind classes | US-14 |

### F6 — Secondary Weather Details Panel

| PRD Feature | FRD Acceptance Criteria | TechArch Components | User Story |
|-------------|------------------------|---------------------|------------|
| F6 — Panel collapsed by default; state not persisted to localStorage | AC-F6-01, AC-F6-06 | `DetailsPanel.tsx` (`useState(false)`) | US-15 |
| F6 — UV index with qualitative label (Low/Moderate/High/Very High/Extreme) | AC-F6-05 | `DetailsPanel.tsx` | US-15 |
| F6 — Wind direction as cardinal + degrees (e.g., "NW (315°)") | AC-F6-04 | `DetailsPanel.tsx`, `wind.ts`, `degreesToCardinal()` | US-15 |
| F6 — Sunrise/sunset in location local timezone via `Intl.DateTimeFormat` | AC-F6-03 | `DetailsPanel.tsx`, `time.ts`, `formatTime()` | US-15 |
| F6 — Visibility silently omitted when absent from API; UV row omitted when null | AC-F6-02 | `DetailsPanel.tsx` | US-15, US-16 |
| F6 — Wind speed in km/h (°C) or mph (°F) — same conversion as F1 | AC-F6-08 | `DetailsPanel.tsx`, `wind.ts`, `kmhToMph()` | US-15 |
| F6 — Trigger reachable by Tab; `aria-expanded` reflects state; 44px target | AC-F6-07, AC-F8-09 | `DetailsPanel.tsx` | US-16 |
| F6 — Expand/collapse animation disabled under `prefers-reduced-motion` | AC-F8-07 | `DetailsPanel.tsx`, Tailwind `motion-safe:` variants | US-16 |

### F7 — Data Freshness & Stale State Handling

| PRD Feature | FRD Acceptance Criteria | TechArch Components | User Story |
|-------------|------------------------|---------------------|------------|
| F7 — "Updated X minutes ago" freshness indicator; updates every 60s | AC-F7-01, AC-F7-02 | `FreshnessIndicator.tsx`, `useFreshnessTimer.ts` | US-17 |
| F7 — TanStack Query staleTime 10 min; no duplicate calls within window | AC-F7-03 | `main.tsx` (`QueryClient`), `useWeatherData.ts` | US-17 |
| F7 — Network recovery triggers automatic background refresh | AC-F7-06 | TanStack Query `refetchOnReconnect: true` in `main.tsx` | US-17 |
| F7 — Offline + cached data → cached display with persistent offline banner | AC-F7-04 | `OfflineBanner.tsx`, TanStack Query cache | US-18 |
| F7 — Offline + no cache → friendly error state + retry button; never blank screen | AC-F7-05 | `ErrorState.tsx`, `AppErrorBoundary.tsx` | US-18 |
| F7 — "City not found" message when geocoding returns no results | AC-F7-07 | `AutocompleteDropdown.tsx`, `geocodingApi.ts` | US-18 |

### F8 — Accessibility (WCAG AA)

| PRD Feature | FRD Acceptance Criteria | TechArch Components | User Story |
|-------------|------------------------|---------------------|------------|
| F8 — All interactive elements keyboard-reachable and operable; focus rings visible | AC-F8-01, AC-F8-10 | All interactive components; Tailwind `focus-visible:ring-2` | US-19 |
| F8 — Autocomplete `↑`/`↓`/`Enter`/`Escape`; hourly strip `←`/`→` | AC-F8-01 | `AutocompleteDropdown.tsx`, `HourlyStrip.tsx` | US-19 |
| F8 — Zero WCAG AA violations in axe-core scan on production build | AC-F8-08 | Verified with axe-core automated tooling on production | US-19 |
| F8 — `aria-live` region announces weather loads, errors, offline state | AC-F8-02 | `App.tsx` (`aria-live="polite"` region) | US-20 |
| F8 — Recharts chart: `role="img"` + `aria-label` + sr-only `<table>` | AC-F8-06 | `TemperatureTrendChart.tsx` | US-20 |
| F8 — No condition communicated by colour alone; icon + text always paired | AC-F8-03 | `ConditionDisplay.tsx`, `WeatherIcon.tsx` | US-21 |
| F8 — All text/background combinations ≥ 4.5:1 contrast; placeholder text ≥ 4.5:1 | AC-F8-04 | `gradient.ts` palette; design audit | US-21 |
| F8 — All interactive elements ≥ 44px touch targets | AC-F8-05 | All interactive components, Tailwind `min-h-[44px] min-w-[44px]` | US-21 |
| F8 — All animations disabled/reduced under `prefers-reduced-motion` | AC-F8-07 | All animated components, Tailwind `motion-safe:` variants | US-21 |
| F8 — Details panel trigger has correct `aria-expanded` state | AC-F8-09 | `DetailsPanel.tsx` | US-16 |

### F9 — Attribution & Deployment

| PRD Feature | FRD Acceptance Criteria | TechArch Components | User Story |
|-------------|------------------------|---------------------|------------|
| F9 — Open-Meteo attribution link and CC BY 4.0 licence link in footer | AC-F9-01, AC-F9-02 | `Footer.tsx` | US-22 |
| F9 — Nominatim attribution link in footer | AC-F9-03 | `Footer.tsx` | US-22 |
| F9 — App deployed to public Vercel HTTPS URL | AC-F9-04 | `vercel.json`, Vercel build pipeline | US-22 |
| F9 — GPS geolocation functions on live HTTPS URL | AC-F9-05 | Vercel HTTPS (required by Browser Geolocation API) | US-22 |
| F9 — Push to `main` triggers automatic Vercel deploy; no manual steps | AC-F9-06 | GitHub → Vercel webhook integration | US-22 |
| F9 — No API keys in `dist/` build output | AC-F9-07 | All services (Open-Meteo and Nominatim are keyless) | US-22 |
| F9 — TypeScript strict-mode build passes with zero errors | AC-F9-08 | `tsconfig.json` (`strict: true`, `noImplicitAny: true`) | US-22 |

---

## 5. Requirements Detail by Feature

This section enumerates all acceptance criteria per feature with their verification method, enabling sprint-level test planning.

### F0 — Location Search & Detection (REQ-01)

- **AC-F0-01** — Typing fewer than 2 characters produces no API call (verified via browser network tab)
- **AC-F0-02** — Typing 2+ characters triggers the geocoding API after a 300ms debounce; no call on every keystroke
- **AC-F0-03** — Up to 5 autocomplete suggestions appear; each shows city name, region, and country
- **AC-F0-04** — Selecting a suggestion closes the dropdown, populates the input, and triggers a weather fetch
- **AC-F0-05** — Denying geolocation permission never produces a blank screen or stuck loading state
- **AC-F0-06** — GPS resolution (button press to weather visible) completes without errors when permission granted
- **AC-F0-07** — Selecting a location appends it to `localStorage` recent searches (max 5, move-to-front deduplication)
- **AC-F0-08** — Recent search chips appear on page load when `localStorage` contains saved entries; clicking a chip loads weather immediately
- **AC-F0-09** — "City not found — try a different spelling" message appears when geocoding returns no results
- **AC-F0-10** — GPS button shows visible loading state while pending and is disabled during that period
- **AC-F0-11** — Autocomplete dropdown is keyboard-navigable (`↑`/`↓` to move, `Enter` to select, `Escape` to close)
- **AC-F0-12** — Submitting the search form (pressing `Enter` with first suggestion highlighted) selects the top suggestion

### F1 — Current Conditions Display (REQ-02)

- **AC-F1-01** — Current temperature displayed as an integer (no decimal point) at all times
- **AC-F1-02** — All hero data points (temperature, feels-like, condition, high/low, precipitation, humidity, wind) visible above the fold at 375px without scrolling
- **AC-F1-03** — °C/°F toggle visible on main screen at all times (not in a settings menu)
- **AC-F1-04** — Toggling °C/°F updates all temperature values app-wide instantly without a network request
- **AC-F1-05** — Unit preference survives a page reload (read from `localStorage` on mount)
- **AC-F1-06** — Skeleton placeholder (not a blank screen or spinner-only) shown while data is loading
- **AC-F1-07** — Error message and "Try again" button shown when weather fetch fails (never a blank screen)
- **AC-F1-08** — Condition icon uses the correct day variant when `isDay === true` and night variant when `isDay === false`
- **AC-F1-09** — Condition text label always rendered alongside the condition icon
- **AC-F1-10** — Wind speed shown in km/h when °C is active and mph when °F is active

### F2 — Hourly Forecast (REQ-03, REQ-04)

- **AC-F2-01** — Exactly 24 hourly cards rendered in the strip
- **AC-F2-02** — Each card shows hour label (correct local timezone), condition icon, temperature (integer), and precipitation probability (integer % — always shown)
- **AC-F2-03** — Hour labels use the selected location's timezone, not the user's device timezone
- **AC-F2-04** — All card interactive elements have a minimum touch target of 44×44px
- **AC-F2-05** — Strip is horizontally scrollable on both touch and mouse devices
- **AC-F2-06** — Day/night icon variants correct for each hour based on `HourlyForecast.isDay`
- **AC-F2-07** — Precipitation probability shown on every card; never omitted even when value is 0%
- **AC-F2-08** — Toggling °C/°F updates all hourly temperatures without a network request

### F3 — 7-Day Daily Forecast (REQ-03)

- **AC-F3-01** — Exactly 7 daily rows rendered
- **AC-F3-02** — Today's row labelled "Today", not the abbreviated day name
- **AC-F3-03** — Each row shows: day name, condition icon (daytime variant), high temp, low temp, precipitation probability
- **AC-F3-04** — High temperature always displayed before/above low temperature
- **AC-F3-05** — Precipitation probability shown on every row; never omitted even when 0%
- **AC-F3-06** — Recharts AreaChart renders high and low temperature curves across 7 days
- **AC-F3-07** — Chart Y-axis updates correctly when the user toggles °C/°F
- **AC-F3-08** — Chart has an accessible fallback for screen readers (`role="img"` + `aria-label` + sr-only `<table>`)
- **AC-F3-09** — Day labels use the location's timezone, not the browser's local timezone

### F4 — Weather Icons & Visual Indicators (REQ-04)

- **AC-F4-01** — All WMO codes 0–99 map to a valid condition icon (no unhandled codes produce a broken image)
- **AC-F4-02** — Unknown WMO codes fall back to the clear sky/clear night icon without a runtime error
- **AC-F4-03** — Condition icons use the correct day/night variant in all contexts (hero, hourly, daily)
- **AC-F4-04** — Daily forecast rows always use daytime icon variants
- **AC-F4-05** — All hero background gradient + text colour combinations achieve ≥ 4.5:1 contrast ratio (manual audit passed before production deploy)
- **AC-F4-06** — Hero gradient updates when the user searches a new location
- **AC-F4-07** — A weather condition is never communicated by colour alone — icon and text label always appear together

### F5 — Responsive Layout (REQ-05)

- **AC-F5-01** — App renders without horizontal overflow at 375px, 768px, 1024px, and 1280px viewport widths
- **AC-F5-02** — All interactive elements have a minimum touch target of 44×44px at all breakpoints
- **AC-F5-03** — Single-column mobile layout is the base; desktop layout applied via Tailwind responsive prefixes only
- **AC-F5-04** — Hourly strip horizontal scroll does not cause `<body>` horizontal overflow
- **AC-F5-05** — No weather data hidden or clipped at any supported viewport width
- **AC-F5-06** — No text below 12px rendered size on mobile
- **AC-F5-07** — Unit toggle visible and usable at all supported breakpoints

### F6 — Secondary Weather Details Panel

- **AC-F6-01** — Details panel is collapsed by default on page load and on every page reload
- **AC-F6-02** — Clicking/tapping the trigger expands the panel and reveals all available secondary metrics (visibility silently omitted if absent from API)
- **AC-F6-03** — Sunrise and sunset displayed in the selected location's local timezone (not the user's device timezone)
- **AC-F6-04** — Wind direction displayed as cardinal direction and degrees (e.g., "NW (315°)")
- **AC-F6-05** — UV index shown with a qualitative label (Low / Moderate / High / Very High / Extreme)
- **AC-F6-06** — Panel expansion state is not persisted; returns to collapsed after page reload
- **AC-F6-07** — The trigger button meets the 44×44px minimum touch target requirement
- **AC-F6-08** — Wind speed in the Details panel is displayed in km/h when °C is active and mph when °F is active

### F7 — Data Freshness & Stale State Handling

- **AC-F7-01** — "Updated X minutes ago" indicator visible on main screen at all times when data is loaded
- **AC-F7-02** — Freshness indicator updates every 60 seconds without re-fetching data
- **AC-F7-03** — TanStack Query `staleTime` is set to 10 minutes; switching between recently-fetched locations does not trigger a new API call within the stale window
- **AC-F7-04** — When offline with cached data, the cached weather is shown with a visible offline banner
- **AC-F7-05** — When offline with no cached data, a friendly error message and retry button are shown — never a blank screen
- **AC-F7-06** — When the network recovers, data is automatically refreshed in the background
- **AC-F7-07** — "City not found" message is shown when the geocoding API returns no results

### F8 — Accessibility (WCAG AA)

- **AC-F8-01** — All interactive elements are reachable and operable via keyboard (Tab navigation, Enter/Space activation, arrow keys where specified)
- **AC-F8-02** — The `aria-live` region announces weather data loads and errors to screen readers without requiring focus change
- **AC-F8-03** — No weather condition is conveyed by colour alone — every condition icon has an adjacent text label
- **AC-F8-04** — All text/background combinations across all hero gradient states achieve ≥ 4.5:1 contrast ratio (verified manually)
- **AC-F8-05** — All interactive elements have a minimum 44×44px touch target area
- **AC-F8-06** — Recharts temperature chart has a `role="img"` wrapper with a descriptive `aria-label`, plus a visually-hidden `<table>` data fallback in the DOM
- **AC-F8-07** — All CSS animations and transitions are disabled or reduced when `prefers-reduced-motion: reduce` is active
- **AC-F8-08** — Zero WCAG AA violations are reported by an automated axe-core scan on the production build
- **AC-F8-09** — Details panel trigger has `aria-expanded="true"/"false"` reflecting its current state
- **AC-F8-10** — Focus rings are visible on all focusable elements (no `outline: none` without a replacement focus indicator)

### F9 — Attribution & Deployment

- **AC-F9-01** — Open-Meteo attribution link ("Weather data by Open-Meteo") visible in the footer on every page load
- **AC-F9-02** — CC BY 4.0 licence link present and correctly hyperlinked in the footer
- **AC-F9-03** — Nominatim attribution link present in the footer
- **AC-F9-04** — App deployed to a public Vercel HTTPS URL
- **AC-F9-05** — Geolocation GPS button functions correctly on the live Vercel HTTPS URL (not just `localhost`)
- **AC-F9-06** — A push to the `main` GitHub branch automatically triggers a Vercel production deploy (no manual steps)
- **AC-F9-07** — Production `dist/` output contains no API keys or sensitive credentials
- **AC-F9-08** — TypeScript strict-mode build (`tsc --noEmit`) passes with zero errors

---

## 6. Test Case Coverage Matrix

This matrix maps each user story to its acceptance criteria (used as test cases), summarises the count, and records the verification method. A story is considered fully covered when all its mapped acceptance criteria pass.

| Story ID | Story Title | Feature | Mapped Acceptance Criteria | AC Count | Verification Method | Coverage |
|----------|-------------|---------|---------------------------|----------|---------------------|----------|
| US-01 | City Name Search with Autocomplete | F0 | AC-F0-01, AC-F0-02, AC-F0-03, AC-F0-04, AC-F0-09 | 5 | Network tab; manual UI; axe-core | ☐ Pending |
| US-02 | GPS Geolocation (Opt-In) | F0 | AC-F0-05, AC-F0-06, AC-F0-10 | 3 | Manual (grant/deny permission); DevTools geolocation override | ☐ Pending |
| US-03 | Recent Searches Quick-Select | F0 | AC-F0-07, AC-F0-08 | 2 | Manual localStorage inspection; chip interaction test | ☐ Pending |
| US-04 | Keyboard-Accessible Search | F0 | AC-F0-11, AC-F0-12 | 2 | Manual keyboard-only test session | ☐ Pending |
| US-05 | Current Weather Hero Display | F1 | AC-F1-01, AC-F1-02, AC-F1-06, AC-F1-07, AC-F1-08, AC-F1-09 | 6 | Visual inspect at 375px; network failure simulation; screen reader | ☐ Pending |
| US-06 | °C / °F Unit Toggle | F1 | AC-F1-03, AC-F1-04, AC-F1-05, AC-F1-10 | 4 | Visual inspect; page reload; network tab (no re-fetch) | ☐ Pending |
| US-07 | 24-Hour Forecast Strip | F2 | AC-F2-01, AC-F2-02, AC-F2-03, AC-F2-05, AC-F2-07, AC-F2-08 | 6 | Card count; timezone verification; touch scroll; unit toggle | ☐ Pending |
| US-08 | Hourly Card Touch Targets | F2 | AC-F2-04, AC-F2-06 | 2 | DevTools inspection (44px); keyboard scroll; isDay verification | ☐ Pending |
| US-09 | 7-Day Forecast List | F3 | AC-F3-01, AC-F3-02, AC-F3-03, AC-F3-04, AC-F3-05, AC-F3-09 | 6 | Row count; "Today" label; timezone; visual order; 375px layout | ☐ Pending |
| US-10 | Temperature Trend Chart | F3 | AC-F3-06, AC-F3-07, AC-F3-08 | 3 | Chart render; Y-axis toggle; error boundary; screen reader table | ☐ Pending |
| US-11 | Full WMO Icon Coverage | F4 | AC-F4-01, AC-F4-02, AC-F4-07 | 3 | WMO code sweep; unknown code fallback; icon+label pairing | ☐ Pending |
| US-12 | Day/Night Variants and Hero Gradient | F4 | AC-F4-03, AC-F4-04, AC-F4-05, AC-F4-06 | 4 | Time override (day/night); gradient update; contrast analyser | ☐ Pending |
| US-13 | Mobile Layout (375px–767px) | F5 | AC-F5-01, AC-F5-02, AC-F5-04, AC-F5-05, AC-F5-06 | 5 | DevTools 375px; horizontal overflow check; 44px inspection | ☐ Pending |
| US-14 | Tablet and Desktop Layout | F5 | AC-F5-01, AC-F5-03, AC-F5-05, AC-F5-07 | 4 | DevTools 768px, 1024px, 1280px; no JS resize detection | ☐ Pending |
| US-15 | Collapsible Details Panel | F6 | AC-F6-01, AC-F6-02, AC-F6-03, AC-F6-04, AC-F6-05, AC-F6-06, AC-F6-08 | 7 | Default state; expand/collapse; timezone; cardinal direction; UV label | ☐ Pending |
| US-16 | Details Panel Accessibility | F6 | AC-F6-07, AC-F8-07, AC-F8-09 | 3 | Keyboard Tab; aria-expanded; DevTools 44px; reduced-motion OS setting | ☐ Pending |
| US-17 | Data Freshness Indicator | F7 | AC-F7-01, AC-F7-02, AC-F7-03, AC-F7-06 | 4 | Visual inspect; 60s update (no fetch); network tab; reconnect test | ☐ Pending |
| US-18 | Offline and Network Failure Handling | F7 | AC-F7-04, AC-F7-05, AC-F7-07 | 3 | DevTools offline mode (with/without cache); city not found test | ☐ Pending |
| US-19 | Full Keyboard Navigation | F8 | AC-F8-01, AC-F8-08, AC-F8-10 | 3 | Manual keyboard-only session; axe-core scan; focus ring visual | ☐ Pending |
| US-20 | Screen Reader and ARIA Announcements | F8 | AC-F8-02, AC-F8-06 | 2 | VoiceOver / NVDA test; DOM inspection for sr-only table | ☐ Pending |
| US-21 | Contrast, Colour, and Motion Accessibility | F8 | AC-F8-03, AC-F8-04, AC-F8-05, AC-F8-07 | 4 | Contrast analyser; colour-alone audit; 44px check; reduced-motion OS | ☐ Pending |
| US-22 | Attribution Footer and Licence Compliance | F9 | AC-F9-01, AC-F9-02, AC-F9-03, AC-F9-04, AC-F9-05, AC-F9-06, AC-F9-07, AC-F9-08 | 8 | Footer visual; Vercel URL check; GPS live test; grep dist/; tsc check | ☐ Pending |

### Coverage Summary

| Feature | User Stories | Total ACs Mapped | P0 ACs | P1 ACs | Coverage Status |
|---------|-------------|-----------------|--------|--------|-----------------|
| F0 — Location Search | US-01, US-02, US-03, US-04 | 12 | 12 | 0 | ☐ Pending |
| F1 — Current Conditions | US-05, US-06 | 10 | 10 | 0 | ☐ Pending |
| F2 — Hourly Forecast | US-07, US-08 | 8 | 0 | 8 | ☐ Pending |
| F3 — 7-Day Forecast | US-09, US-10 | 9 | 9 | 0 | ☐ Pending |
| F4 — Icons & Visuals | US-11, US-12 | 7 | 7 | 0 | ☐ Pending |
| F5 — Responsive Layout | US-13, US-14 | 7 | 7 | 0 | ☐ Pending |
| F6 — Details Panel | US-15, US-16 | 8 | 0 | 8 | ☐ Pending |
| F7 — Data Freshness | US-17, US-18 | 7 | 0 | 7 | ☐ Pending |
| F8 — Accessibility | US-19, US-20, US-21 | 10 | 0 | 10 | ☐ Pending |
| F9 — Attribution | US-22 | 8 | 8 | 0 | ☐ Pending |
| **TOTAL** | **22 stories** | **86 ACs** | **53** | **33** | **0/86 Passed** |

---

## 7. Non-Functional Requirements Traceability

Non-functional requirements (NFRs) are defined in PRD Section 7 and FRD Section 15. They do not map to a single REQ-level requirement but are enforced as constraints across all features.

### Performance NFRs

| NFR | Target | Implementing Component(s) | Verification |
|-----|--------|--------------------------|--------------|
| First Contentful Paint (mobile 4G) | < 2 seconds | `main.tsx`, Vite 5 build, Vercel CDN | Lighthouse CI on production URL |
| Time to weather data visible after city select | < 2 seconds | `useWeatherData.ts`, TanStack Query cache, `transformForecastResponse()` | Manual timing from suggestion click to hero render |
| JavaScript bundle size (gzipped) | < 300 KB | Vite 5 build, `rollup-plugin-visualizer` | Bundle analyser on each production build |
| Lighthouse Performance score | ≥ 90 | Vite 5 build, TanStack Query staleTime | Lighthouse CI |
| TanStack Query staleTime | 10 minutes | `QueryClient` in `main.tsx` | Network tab — no duplicate calls within window |

### Accessibility NFRs

| NFR | Target | Implementing Component(s) | Verification |
|-----|--------|--------------------------|--------------|
| WCAG compliance level | 2.2 Level AA | All interactive components; `AppLayout.tsx` | axe-core automated scan + manual screen reader (VoiceOver, NVDA) |
| Contrast ratio — all condition backgrounds | ≥ 4.5:1 for text | `gradient.ts` palette; `HeroSection.tsx` | Colour contrast analyser (all gradient × time-of-day combinations) |
| Touch target size | ≥ 44×44px | All buttons, `UnitToggle.tsx`, `GpsButton.tsx`, `HourlyCard.tsx`, `DetailsPanel.tsx` | Chrome DevTools inspection |
| Keyboard navigation | 100% of interactive elements | All interactive components | Manual keyboard-only test session |
| Screen reader usability | VoiceOver + NVDA | `App.tsx` (`aria-live`), `TemperatureTrendChart.tsx` | Manual test on production build |

### Reliability NFRs

| NFR | Target | Implementing Component(s) | Verification |
|-----|--------|--------------------------|--------------|
| Blank screen on API failure | Zero instances | `ErrorState.tsx`, `AppErrorBoundary.tsx`, `SkeletonHero.tsx` | Manual test of all error paths |
| Blank screen on geolocation denial | Zero instances | `GpsButton.tsx`, `useGeolocation.ts` | Manual test: deny permission, verify search still works |
| Offline behaviour | Cached data shown with notice | `OfflineBanner.tsx`, TanStack Query gcTime 30 min | Network tab: set offline, verify cached display |

### Security NFRs

| NFR | Target | Implementing Component(s) | Verification |
|-----|--------|--------------------------|--------------|
| API key exposure | Zero — Open-Meteo and Nominatim require no keys | `weatherApi.ts`, `geocodingApi.ts`, `nominatimApi.ts` | `grep -r "api_key\|apiKey\|API_KEY" dist/` on build output |
| Content-Security-Policy | Restrict resource origins | `vercel.json` CSP header | HTTP header inspection on deployed URL |
| External links safety | `rel="noopener noreferrer"` on all `target="_blank"` | `Footer.tsx` | Code review; HTML inspection |

### Code Quality NFRs

| NFR | Target | Implementing Component(s) | Verification |
|-----|--------|--------------------------|--------------|
| TypeScript strict mode | Zero errors with `strict: true` | `tsconfig.json` | `tsc --noEmit` in CI |
| `any` casts | Zero in production code | All TypeScript files | TypeScript compiler + ESLint `@typescript-eslint/no-explicit-any` |
| ESLint | Zero errors on `npm run lint` | All source files | `npm run lint` in CI |
| Component test coverage | Unit tests for transform functions and `weatherCodes.ts` | `src/utils/`, `src/services/` | Test runner (Vitest recommended) |

---

## 8. Change Management Log

This log records material changes to specification documents after initial publication. All future changes to PRD, FRD, TechArch, or UserStories documents that affect traceability must be recorded here.

| Change ID | Date | Document Affected | Section/Item Changed | Nature of Change | Author | Rationale | RTM Impact |
|-----------|------|-------------------|---------------------|------------------|--------|-----------|------------|
| CHG-001 | 2026-05-01 | FRD-WeatherApp.md | F1 — Current Conditions | Added clarification: `precipitation_probability` is NOT available in Open-Meteo `current` block; must be sourced from `daily.precipitation_probability_max[0]` | Pivota Spec | Prevent common API misuse that returns `undefined` | AC-F1-02 implementation note updated |
| CHG-002 | 2026-05-01 | FRD-WeatherApp.md | F6 — Details Panel | Visibility field silently omitted when absent (Open-Meteo free tier does not return visibility); added AC-F6-02 note | Pivota Spec | Prevent placeholder UI for unavailable data | AC-F6-02 revised |
| CHG-003 | 2026-05-01 | TechArch-WeatherApp.md | Section 6.3 | Nominatim post-flow: must call Open-Meteo Geocoding after Nominatim to obtain canonical timezone | Pivota Spec | Nominatim does not return timezone; required for `timezone=auto` compliance | Data flow diagram updated |

*No further changes recorded at time of RTM v1.0 publication.*

---

## 9. Approval & Sign-Off

This section records stakeholder review and approval of the RTM. All sections must be reviewed and signed before the RTM is considered baseline. Subsequent changes require an updated entry in the Change Management Log (Section 8) and re-approval by the relevant stakeholder.

### Review Checklist

Before signing, each reviewer should confirm the following:

- [ ] All 5 REQ-level requirements (REQ-01 through REQ-05) are fully mapped to product features
- [ ] All 10 PRD features (F0–F9) have at least one acceptance criterion in the FRD
- [ ] All 86 acceptance criteria (AC-F0-01 through AC-F9-08) appear in the traceability matrix
- [ ] All 22 user stories (US-01 through US-22) are mapped to at least one acceptance criterion
- [ ] All TechArch components referenced in Section 4 exist in TechArch-WeatherApp.md
- [ ] Non-functional requirements (performance, accessibility, reliability, security) are traced in Section 7
- [ ] The Change Management Log (Section 8) is up to date
- [ ] No acceptance criteria is listed without a verification method

### Sign-Off Table

| Role | Name | Signature | Date | Status |
|------|------|-----------|------|--------|
| Product Owner | — | — | — | ☐ Pending |
| Lead Developer | — | — | — | ☐ Pending |
| QA Lead | — | — | — | ☐ Pending |
| Accessibility Reviewer | — | — | — | ☐ Pending |
| Deployment Approver | — | — | — | ☐ Pending |

### Baseline Declaration

Once all roles above have signed, this RTM is declared **Baseline v1.0**. Any modification to a source specification document (PRD, FRD, TechArch, UserStories) that affects a traced requirement must:

1. Be recorded in the Change Management Log (Section 8) with a CHG-xxx ID
2. Update the affected row(s) in the Traceability Matrix (Section 4)
3. Update the Coverage Summary (Section 6) if AC counts change
4. Obtain re-approval from the affected role in the Sign-Off table above before being incorporated into the build

---

## Appendix A: ID Conventions Quick Reference

| Prefix | Level | Document Source | Example |
|--------|-------|-----------------|---------|
| `REQ-` | Top-level business requirement | PRD-WeatherApp.md §Requirement Traceability | REQ-01, REQ-05 |
| `F` | Product feature (PRD) | PRD-WeatherApp.md §Feature Index | F0, F9 |
| `AC-Fx-yy` | Functional acceptance criterion | FRD-WeatherApp.md §Acceptance Criteria Index | AC-F0-01, AC-F9-08 |
| `US-` | User story | UserStories-WeatherApp.md §Story Index | US-01, US-22 |
| `COMP` | TechArch component/service | TechArch-WeatherApp.md §Component Architecture | `HeroSection.tsx`, `weatherCodes.ts` |
| `CHG-` | Change management record | RTM Section 8 | CHG-001 |

---

*RTM version 1.0 — generated 2026-05-01*
*Sources: PRD-WeatherApp.md v1.0 · FRD-WeatherApp.md v1.0 · TechArch-WeatherApp.md v1.0 · UserStories-WeatherApp.md v1.0 · PROJECT.md*
*Coverage: 5/5 REQ · 10/10 Features · 86/86 ACs · 22/22 User Stories · 5 NFR categories*
