# Product Requirements Document
## Simple Weather App

**Version:** 1.0
**Date:** 2026-04-29
**Status:** Active
**Confidence:** HIGH (based on research/SUMMARY.md, 2026-04-28)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Product Vision](#3-product-vision)
4. [Target Users & Personas](#4-target-users--personas)
5. [Technical Architecture](#5-technical-architecture)
6. [Feature Requirements](#6-feature-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Success Metrics](#8-success-metrics)
9. [Out of Scope](#9-out-of-scope)
10. [Risks & Mitigations](#10-risks--mitigations)
11. [Feature Index](#11-feature-index)

---

## 1. Executive Summary

The Simple Weather App is a frontend-only web application that answers one question instantly: "What's the weather right now, and what should I expect?" Users type any city name and see current conditions plus a multi-day forecast in under 2 seconds — no account required, no ads, no bloat. The app targets a proven market gap: over 100 million daily queries go to a command-line ASCII tool (`wttr.in`) precisely because mainstream weather apps are slow, invasive, and cluttered. This product delivers mainstream-quality weather information with the speed and simplicity of a developer tool.

---

## 2. Problem Statement

Weather information is universally needed but poorly delivered. The dominant consumer apps (Weather.com, AccuWeather) have become advertising platforms first and weather tools second — they load slowly, require accounts for basic features, autoplay video, and bury the data users actually want under layers of promoted content. The core user need is simple: **answer "do I need an umbrella?" in under 3 seconds**.

The developer-tool alternatives (`wttr.in`, command-line tools) prove massive latent demand for fast, no-account weather access — but they lack the visual clarity and usability that mainstream audiences require. The gap between "fast but ugly" and "polished but bloated" is wide open.

Key pain points this product addresses:

- **Speed:** Mainstream apps take 4–8 seconds to load useful data on mobile due to ads and tracking scripts
- **Friction:** Account creation prompts, notification permission demands, and location auto-detection paywalls gate basic features
- **Noise:** Sponsored content, news feeds, and video autoplay compete for attention in apps where users just want temperature
- **Precision theatre:** Showing "18.47°C" instead of "18°C" destroys trust without adding value
- **Mobile frustration:** Touch targets too small, forecast cards overflow, unit toggle buried in settings menus

---

## 3. Product Vision

**Vision statement:** A weather app so fast and clean that checking the weather feels like reading a clock — instant, effortless, always correct.

**Strategic goals:**

- Deliver the core weather answer (current temp + conditions) within 2 seconds of search on a mobile connection
- Require zero user accounts, zero API keys exposed to users, and zero permissions except optional geolocation
- Achieve feature parity with major apps on the data users actually use while eliminating everything they do not
- Build to WCAG AA accessibility standards from day one — not as a retrofit
- Deploy as a fully static frontend with no backend infrastructure or recurring server cost
- Establish correct data-layer patterns (timezone handling, caching, error states) before adding visual polish — the #1 failure mode across the 26,000+ portfolio weather apps surveyed

---

## 4. Target Users & Personas

### Persona A: The Casual Checker

**Who they are:** Anyone deciding what to wear or whether to bring an umbrella. They open weather apps 1–3 times per day, most often on mobile, most often in the morning.

**What they need:** Current temperature (large and dominant), feels-like temperature, today's high/low, and a precipitation probability — all visible without scrolling.

**What frustrates them:** Slow load times, ads, notification prompts, account walls, and needing to hunt for the °C/°F toggle.

**How this app serves them:** The hero section displays the core data pair (temperature + condition) above the fold with a visible unit toggle on the main screen. No account. No ads.

---

### Persona B: The Commuter

**Who they are:** Daily commuters planning travel around weather windows. They check weather 2–4 times daily, often quickly between tasks, and care about hourly changes during their commute window.

**What they need:** Hourly forecast for the next 24 hours, precipitation probability per hour, and a quick scan of whether conditions change during their commute.

**What frustrates them:** Having to navigate multiple screens to get hourly data, or discovering the hourly view is paywalled.

**How this app serves them:** A horizontally scrollable hourly forecast row is a first-class component — visible on the main screen, not behind a tab or paywall. Precipitation probability is shown on every hourly card.

---

### Persona C: The Outdoor Enthusiast

**Who they are:** Hikers, cyclists, gardeners, and weekend athletes who need to plan activities around weather windows. They check 3–7 day forecasts regularly and care about secondary metrics (wind speed, UV index, sunrise/sunset).

**What they need:** 7-day daily forecast, secondary metrics (UV, wind, visibility, sunrise/sunset), and enough forecast depth to plan a weekend activity.

**What frustrates them:** Apps that hide the 7-day view behind an account, show only 3 days on mobile, or bury wind/UV data in hard-to-find settings.

**How this app serves them:** The 7-day daily forecast is a primary component. Secondary metrics (UV, wind direction, visibility, sunrise/sunset) are accessible via a progressive-disclosure "Details" panel — present but not cluttering the primary view.

---

## 5. Technical Architecture

The app is a single-page application with no backend. All state lives in component-local state, TanStack Query's cache, and `localStorage`. There are no servers to operate, no API keys to manage at runtime, and no user data stored beyond browser-local preferences.

| Layer | Technology | Rationale |
|---|---|---|
| Framework | React 19 + TypeScript | Best ecosystem for data fetching, charting, and state management; TanStack Query integration |
| Build Tool | Vite 5 | Fast HMR, `react-ts` template, static `dist/` output for zero-config Vercel deploy (Node 18 compatible) |
| Styling | Tailwind CSS v4 | Vite plugin; utility-first responsive layout; no CSS file management overhead |
| Weather Data | Open-Meteo API | No API key required (eliminates #1 portfolio app pitfall); 14-day forecasts; `timezone=auto`; CC BY 4.0 |
| Data Fetching | TanStack Query v5 | `staleTime: 10min` prevents redundant calls; `isLoading`/`isError` states drive UI feedback |
| Charting | Recharts | React-native `AreaChart` for temperature trend; `BarChart` for precipitation probability |
| Geocoding | Open-Meteo Geocoding API | City name → lat/lon with autocomplete; no key required |
| Reverse Geocoding | Nominatim | GPS lat/lon → city name when geolocation is used; no key required |
| Deployment | Vercel | Zero-config HTTPS deploy from GitHub; HTTPS required for Geolocation API |

**Key architecture decisions:**

- **Geocoding is separate from weather fetching.** City search (Open-Meteo Geocoding → lat/lon) and weather data (lat/lon → Open-Meteo Forecast) are distinct API calls cached independently. This avoids coupling and enables clean cache invalidation.
- **`timezone=auto` is set on every Open-Meteo request from day one.** This is non-negotiable — without it, sunrise/sunset, hourly labels, and all time-dependent displays break for locations outside the user's local timezone.
- **Geolocation is opt-in, never a gate.** The GPS button is an enhancement. City search is always the primary path. Denying geolocation never produces a blank screen.
- **No backend, ever (v1).** All caching is TanStack Query + `localStorage`. This eliminates infrastructure cost and attack surface for a v1 product.
- **Vite 5 instead of Vite 8.** Node 18 (v18.20.4) constrains the build tool to Vite 5 — the latest Node-18-compatible release. All features are functionally equivalent to Vite 8 for this project.

---

## 6. Feature Requirements

### F0: Location Search & Detection (REQ-01)

**Description:** Users find weather for any location via city name search with autocomplete suggestions, or via optional GPS geolocation. The location bar is always visible and is the primary entry point into the app.

**Capabilities:**
- Text input triggers autocomplete suggestions from the Open-Meteo Geocoding API after 2+ characters are typed
- Selecting a suggestion loads weather data for that location immediately
- GPS opt-in button appears alongside the search input; tapping it requests browser geolocation permission
- If geolocation permission is denied or unavailable, the search input remains fully functional with no error state or blank screen
- Reverse geocoding via Nominatim translates GPS coordinates into a human-readable city name for display
- Recent location searches persist in `localStorage` and appear as quick-select chips below the search input

**Priority:** P0 — Critical (MVP requirement; all other features depend on location resolution)

---

### F1: Current Conditions Display (REQ-02)

**Description:** The hero section of the app shows the current weather snapshot for the selected location. This is the primary answer to the core user question and must be visible above the fold on both mobile and desktop.

**Capabilities:**
- Current temperature displayed large and dominant; integer values only (e.g., "18°C", never "18.47°C")
- Feels-like temperature displayed as a secondary data point adjacent to current temp
- Weather condition shown with both an icon and a text label (e.g., "Partly Cloudy")
- Icons use day/night variants — a sun icon never appears at 9pm
- Today's high and low temperatures displayed as a paired value
- Precipitation probability for the current day displayed as a percentage
- Humidity and wind speed displayed as supporting data points
- °C/°F unit toggle visible on the main screen (not buried in settings); preference persisted in `localStorage`
- Skeleton loading state displayed while data is fetching; clear error message shown on API failure; never a blank screen

**Priority:** P0 — Critical (MVP requirement)

---

### F2: Hourly Forecast (REQ-03 partial, REQ-04)

**Description:** A horizontally scrollable row of forecast cards showing weather conditions for each of the next 24 hours. This serves commuters and anyone planning activities within the current day.

**Capabilities:**
- Horizontal scroll row of cards, each showing: hour label, condition icon (day/night variant), temperature, and precipitation probability percentage
- Minimum 44px touch targets on all interactive card elements (per WCAG 2.5.8)
- Precipitation probability shown on every card — never omitted
- Cards derived from the same Open-Meteo API response as current conditions (no additional API call required)
- Day/night icon variant logic applied correctly per the location's local timezone

**Priority:** P1 — High (differentiator; commuter persona primary feature)

---

### F3: 7-Day Daily Forecast (REQ-03)

**Description:** A vertical list of daily forecast rows covering the next 7 days. This is the planning view for outdoor enthusiasts and anyone looking beyond today.

**Capabilities:**
- 7 rows showing: abbreviated day name, condition icon (representative daytime icon), high temperature, low temperature, and precipitation probability percentage
- Recharts `AreaChart` temperature trend visualization rendered alongside or below the daily list, showing the temperature curve across the week at a glance
- Precipitation probability shown on every daily row — never omitted
- High/low pair displayed consistently (high first, then low)
- Data sourced from the same Open-Meteo API response as current conditions

**Priority:** P0 — Critical (MVP requirement; directly satisfies REQ-03)

---

### F4: Weather Icons & Visual Indicators (REQ-04)

**Description:** All weather data is accompanied by recognizable condition icons that communicate weather state at a glance. Icons adapt to time of day and cover all WMO weather code states returned by the Open-Meteo API.

**Capabilities:**
- Icon set covers the full WMO weather interpretation code range (0–99): clear, cloudy, foggy, drizzle, rain, freezing rain, snow, shower, and thunderstorm variants
- Day and night variants for all clear/partly-cloudy/overcast states — sun icon never shows after sunset; moon/stars icon used for night conditions
- Icons used consistently across current conditions, hourly forecast, and daily forecast components
- Condition-aware background gradient in the current conditions hero shifts to reflect weather state and time of day (e.g., deep navy at night, sky blue on clear day, muted grey on overcast)
- All condition + time-of-day background combinations achieve WCAG 1.4.3 minimum 4.5:1 contrast ratio with overlaid text

**Priority:** P0 — Critical (MVP requirement; REQ-04)

---

### F5: Responsive Layout — Desktop & Mobile (REQ-05)

**Description:** The app is built mobile-first and displays correctly at all standard viewport widths from 375px (mobile) to 1280px+ (desktop) without horizontal overflow, truncated labels, or unusable tap targets.

**Capabilities:**
- Mobile layout (375px–767px): single-column stack; all data visible without horizontal overflow; all tap targets ≥ 44px
- Tablet layout (768px–1023px): optional two-column layout for current conditions + details panel
- Desktop layout (1024px+): wider layout with forecast and details panels arranged horizontally
- Tailwind CSS v4 responsive breakpoints manage all layout transitions
- No separate mobile codebase — one responsive implementation serves all viewports

**Priority:** P0 — Critical (MVP requirement; REQ-05)

---

### F6: Secondary Weather Details Panel

**Description:** A collapsible "Details" panel provides secondary weather metrics for users who need more than temperature and precipitation. Collapsed by default to avoid cluttering the primary view for casual users.

**Capabilities:**
- Collapsed by default; user taps/clicks to expand (progressive disclosure pattern)
- When expanded, displays: UV index, wind speed and direction (cardinal + degrees), humidity (if not shown in hero), sunrise time, and sunset time; visibility (km/mi) is shown only if the Open-Meteo free-tier forecast endpoint returns it — if unavailable, the visibility row is silently omitted with no placeholder
- All values use the location's local timezone for sunrise/sunset display
- Panel state does not persist across page reloads — returns to collapsed on next visit

**Priority:** P1 — High (outdoor enthusiast persona; differentiator over basic weather apps)

---

### F7: Data Freshness & Stale State Handling

**Description:** Users always know how current their weather data is, and the app behaves gracefully when the network is unavailable or slow.

**Capabilities:**
- "Updated X minutes ago" freshness indicator visible on the main screen at all times when data is loaded
- TanStack Query `staleTime` set to 10 minutes — data is not re-fetched on every component mount
- If the network is offline, the last cached data is displayed with a visible "showing cached data from X minutes ago" notice
- If no cached data exists and the network fails, a friendly "Unable to load weather — check your connection" message is shown (never a blank screen)
- "City not found — try a different spelling" message displayed when the geocoding API returns no results

**Priority:** P1 — High (trust and reliability; critical for mobile users on intermittent connections)

---

### F8: Accessibility (WCAG AA Compliance)

**Description:** The app meets WCAG 2.2 Level AA across all components and states, verified by both automated tooling and manual screen reader testing.

**Capabilities:**
- All interactive elements (search input, GPS button, forecast cards, unit toggle, details panel) reachable and operable via keyboard
- `aria-live` regions announce weather data updates to screen readers when location changes or data refreshes
- WCAG 1.4.1: Weather condition never conveyed by color alone — icon + text label always paired
- WCAG 1.4.3: 4.5:1 contrast ratio on all text across all condition-aware background states
- WCAG 2.5.8: Minimum 44px touch targets on all interactive elements
- Recharts chart components include accessible text fallback (data table or `aria-label` descriptions) for screen readers
- All animations and transitions respect `prefers-reduced-motion` media query

**Priority:** P1 — High (Phase 4 delivery; non-negotiable for production quality)

---

### F9: Attribution & Deployment

**Description:** The app is publicly deployed on HTTPS and includes required attribution for the Open-Meteo API, fulfilling both the license obligation and the geolocation security requirement.

**Capabilities:**
- Deployed to Vercel with HTTPS by default (required for Browser Geolocation API to function)
- Open-Meteo CC BY 4.0 attribution link visible in the app footer on every page load
- Deployment auto-triggers from GitHub main branch push (zero manual deploy steps)

**Priority:** P0 — Critical (geolocation requires HTTPS; Open-Meteo license requires attribution)

---

## 7. Non-Functional Requirements

| Category | Requirement | Target | Verification |
|---|---|---|---|
| Performance | Initial page load (mobile 4G) | < 2 seconds to first meaningful content | Core Web Vitals / Lighthouse |
| Performance | Time to weather data visible after city select | < 2 seconds | Manual timing + TanStack Query cache |
| Performance | JavaScript bundle size (gzipped) | < 300 KB | Vite bundle analysis |
| Accessibility | WCAG compliance level | 2.2 Level AA | Automated (axe-core) + manual screen reader |
| Accessibility | Contrast ratio — all condition backgrounds | ≥ 4.5:1 (text) | Colour contrast analyser |
| Accessibility | Touch target size | ≥ 44 × 44 px | DevTools inspection |
| Responsiveness | Supported viewport range | 375px – 1280px+ | Manual + BrowserStack |
| Responsiveness | No horizontal overflow | Zero overflow at any breakpoint | Automated layout test |
| Reliability | API cache stale time | 10 minutes (no redundant calls) | Network tab observation |
| Reliability | Offline behaviour | Cached data shown, never blank screen | TanStack Query cache verification |
| Security | API key exposure | None — Open-Meteo requires no key | Code audit |
| Browser Support | Target browsers | Chromium 110+, Firefox 115+, Safari 16+ | BrowserStack |
| Motion | Animations | All respect `prefers-reduced-motion` | CSS media query audit |

---

## 8. Success Metrics

**User experience:**
- Time to first meaningful weather data ≤ 2 seconds on a simulated mobile 4G connection (measured via Lighthouse)
- Bounce rate from initial load < 30% — indicating users are finding data without confusion
- Unit toggle usage visible on main screen — no support requests about "how to change to Fahrenheit"

**Accessibility:**
- Zero WCAG AA violations in automated axe-core scan on production build
- All condition + time-of-day background combinations achieve ≥ 4.5:1 contrast ratio (manual audit passes)
- All interactive elements keyboard-navigable with logical tab order (manual screen reader test passes)

**Reliability:**
- API error states render a visible error message — zero instances of blank screen on API failure (manual testing across all error paths)
- Geolocation denial produces no blank screen or stuck state — search input remains usable in 100% of test cases

**Code quality:**
- TypeScript strict mode with zero `any` casts at deploy time
- Zero exposed API keys in source or build output
- Open-Meteo CC BY 4.0 attribution footer present on every production page load

**Deployment:**
- App live at a public HTTPS Vercel URL
- Geolocation API functioning correctly in production (requires HTTPS — verified on live URL, not localhost)

---

## 9. Out of Scope

The following features are explicitly excluded from v1.0. They are documented here to prevent scope creep and to clearly communicate product boundaries to stakeholders.

**Excluded from v1.0:**

- **User accounts and saved locations** — Adds authentication infrastructure and state management complexity not justified by the v1 use case. Single active location is sufficient.
- **Severe weather alerts and push notifications** — Requires persistent backend infrastructure, NWS feed integration, and legal review of alert accuracy obligations. Out of scope for a frontend-only app.
- **Historical weather data** — Not part of the core user question ("what is it doing now / soon?"). Adds API complexity without serving primary personas.
- **Radar maps** — MapLibre/Leaflet integration with tile server adds significant complexity; not core to "simple weather."
- **Air quality index (AQI)** — Open-Meteo has an AQI endpoint; deferred to v2 to preserve focus.
- **Animated weather backgrounds** — CSS keyframe animation for weather states is non-trivial to implement accessibly; condition-aware static gradients ship in v1.
- **Multiple saved locations** — Requires `localStorage` architecture upgrade; deferred to v2.
- **Weather for coordinates (lat/lon direct input)** — City name search is sufficient for v1 personas.
- **Autoplay video, advertising, news/trending content** — Anti-features; never build.

---

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Timezone display bugs (UTC vs. location timezone) | HIGH | HIGH | Set `timezone=auto` on every Open-Meteo request from Phase 1; use `Intl.DateTimeFormat` for all time display; never use browser's local timezone for location data |
| Geolocation denial produces blank/stuck screen | HIGH | HIGH | Geolocation is opt-in only; city search is always the primary path; denial path tested explicitly in Phase 1 |
| WCAG contrast failure on dynamic condition backgrounds | HIGH | MEDIUM | Design color palette for all weather × time-of-day combinations with contrast target before implementing Phase 3; validate with contrast analyser before ship |
| No loading/error states (blank screen on slow/failed API) | HIGH | HIGH | TanStack Query `isLoading`/`isError` + skeleton components built in Phase 1; never deferred to "polish later" |
| Precision mismatch (decimal temperatures destroy trust) | MEDIUM | MEDIUM | All temperature values rounded to integer display; enforced in API response transformation layer |
| Open-Meteo geocoding quality for ambiguous city names | MEDIUM | LOW | "City not found" error state built in Phase 4; Nominatim available as fallback geocoder |
| Recharts SVG charts inaccessible to screen readers | MEDIUM | MEDIUM | Verify Recharts ARIA support in Phase 2; implement `<table>` or `aria-label` data fallback if library support is insufficient |
| Bundle size exceeds 300 KB gzipped | LOW | MEDIUM | Verify against Core Web Vitals after Phase 2 (Recharts is the largest addition); code-split or replace if target is missed |
| Open-Meteo rate limits exceeded | LOW | LOW | `staleTime: 10min` in TanStack Query prevents redundant calls; Open-Meteo non-commercial free tier is generous for portfolio traffic |

---

## 11. Feature Index

| ID | Feature | REQ Coverage | Priority | Phase | Status |
|---|---|---|---|---|---|
| F0 | Location Search & Detection | REQ-01 | P0 | Phase 1 | Not started |
| F1 | Current Conditions Display | REQ-02 | P0 | Phase 1 | Not started |
| F2 | Hourly Forecast | REQ-03, REQ-04 | P1 | Phase 2 | Not started |
| F3 | 7-Day Daily Forecast | REQ-03 | P0 | Phase 2 | Not started |
| F4 | Weather Icons & Visual Indicators | REQ-04 | P0 | Phase 2–3 | Not started |
| F5 | Responsive Layout | REQ-05 | P0 | Phase 3 | Not started |
| F6 | Secondary Weather Details Panel | — | P1 | Phase 3 | Not started |
| F7 | Data Freshness & Stale State Handling | — | P1 | Phase 3–4 | Not started |
| F8 | Accessibility (WCAG AA) | — | P1 | Phase 4 | Not started |
| F9 | Attribution & Deployment | — | P0 | Phase 4 | Not started |

**Priority summary:**

- **P0 (Critical — ship to call it v1.0):** F0, F1, F3, F4, F5, F9 — 6 features
- **P1 (High — expected by target personas):** F2, F6, F7, F8 — 4 features
- **P2/P3 (Deferred — v2+):** See [Out of Scope](#9-out-of-scope)

---

## Requirement Traceability

| Requirement | Description | Features | Phase |
|---|---|---|---|
| REQ-01 | User can search for weather by city/location name | F0 | Phase 1 |
| REQ-02 | User can view current weather conditions (temperature, description, humidity, wind) | F1 | Phase 1 |
| REQ-03 | User can view a multi-day forecast (3–7 days) | F2, F3 | Phase 2 |
| REQ-04 | User can see weather icons/visual indicators for conditions | F2, F3, F4 | Phase 2–3 |
| REQ-05 | App displays data clearly on both desktop and mobile | F5 | Phase 3 |

**Coverage: 5/5 requirements fully mapped ✓**

---

*PRD version 1.0 — generated 2026-04-29*
*Sources: PROJECT.md, research/SUMMARY.md, ROADMAP.md*
*Next documents: FRD (functional requirements), TechArch (architecture decisions), UserStories (sprint-ready stories)*
