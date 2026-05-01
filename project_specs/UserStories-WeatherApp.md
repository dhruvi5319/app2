# User Stories
## Simple Weather App — WeatherApp

| Field | Value |
|---|---|
| **Product** | Simple Weather App |
| **Version** | 1.0 |
| **Date** | 2026-05-01 |
| **Source PRD** | PRD-WeatherApp.md v1.0 (2026-04-29) |
| **Source FRD** | FRD-WeatherApp.md v1.0 (2026-05-01) |
| **Source Personas** | PERSONAS-WeatherApp.md v1.0 (2026-05-01) |
| **Status** | Active |
| **Total Stories** | 22 |
| **Personas** | Maya (Casual Checker) · James (Commuter) · Priya (Outdoor Enthusiast) |

---

## Priority Definitions

| Priority | Definition |
|---|---|
| **P0** | Critical — must ship to call it v1.0. Blocking; no release without this. |
| **P1** | High — expected by target personas; differentiates from competitor apps. Ship in v1 after all P0 items. |
| **P2** | Medium — nice-to-have; deferred to v2+ if time is constrained. |
| **P3** | Low — future consideration; not planned for v1. |

## Complexity Definitions

| Size | Definition |
|---|---|
| **S** | Small — self-contained, < 0.5 day estimate. Single component or config change. |
| **M** | Medium — 0.5–1.5 day estimate. Involves 2–4 components or API integration. |
| **L** | Large — 1.5–3 day estimate. Cross-cutting concern, new data flow, or significant UI system. |

---

## Table of Contents

1. [F0 — Location Search & Detection](#epic-f0--location-search--detection)
2. [F1 — Current Conditions Display](#epic-f1--current-conditions-display)
3. [F2 — Hourly Forecast](#epic-f2--hourly-forecast)
4. [F3 — 7-Day Daily Forecast](#epic-f3--7-day-daily-forecast)
5. [F4 — Weather Icons & Visual Indicators](#epic-f4--weather-icons--visual-indicators)
6. [F5 — Responsive Layout](#epic-f5--responsive-layout)
7. [F6 — Secondary Weather Details Panel](#epic-f6--secondary-weather-details-panel)
8. [F7 — Data Freshness & Stale State Handling](#epic-f7--data-freshness--stale-state-handling)
9. [F8 — Accessibility (WCAG AA)](#epic-f8--accessibility-wcag-aa)
10. [F9 — Attribution & Deployment](#epic-f9--attribution--deployment)
11. [Story Index](#story-index)

---

## Epic F0 — Location Search & Detection

> Entry point for the entire app. All weather features depend on a resolved location. Two paths: city name search with autocomplete (primary, always available) and optional GPS geolocation (secondary, opt-in). Recent searches persist in `localStorage` for quick repeat access.

---

### US-01: City Name Search with Autocomplete

**As a** Maya (Casual Checker), **I want to** type a city name and see up to 5 matching suggestions, **so that** I can find my location quickly and start seeing weather data without hunting through lists.

**Acceptance Criteria:**
- [ ] Typing fewer than 2 characters produces no API call (debounce gate enforced)
- [ ] Typing 2 or more characters triggers the Open-Meteo Geocoding API after a 300ms debounce — not on every keystroke
- [ ] Up to 5 autocomplete suggestions appear in a dropdown, each showing city name, region, and country
- [ ] Selecting a suggestion closes the dropdown, populates the search input with the location name, and immediately triggers a weather data fetch
- [ ] "City not found — try a different spelling" message appears inline below the input when the geocoding API returns no results

**Priority:** P0 | **Feature Ref:** F0 | **Complexity:** M

---

### US-02: GPS Geolocation (Opt-In)

**As a** Maya (Casual Checker), **I want to** tap a GPS button to auto-detect my location, **so that** I can get weather for my current position without typing anything.

**Acceptance Criteria:**
- [ ] A GPS icon button is visible alongside the search input at all times
- [ ] Tapping the GPS button triggers the browser's native geolocation permission prompt — no prompt is shown before the button is tapped
- [ ] The GPS button shows a visible loading spinner and is disabled while geolocation is pending
- [ ] Denying geolocation permission resets the GPS button to idle with no error message shown and no blank screen; the search input remains fully usable
- [ ] When permission is granted, GPS coordinates are reverse-geocoded via Nominatim, the resolved city name is used to fetch weather data, and the location name appears in the search input

**Priority:** P0 | **Feature Ref:** F0 | **Complexity:** M

---

### US-03: Recent Searches Quick-Select

**As a** James (Commuter), **I want to** tap a recent search chip to reload weather for a previously visited city, **so that** I can check my commute route cities without retyping them every time.

**Acceptance Criteria:**
- [ ] Recent search chips are displayed below the search input on page load when `localStorage` contains saved entries
- [ ] Selecting any location (via autocomplete or GPS) saves it to `localStorage` as a recent search (maximum 5 entries, move-to-front deduplication)
- [ ] Clicking a chip immediately loads weather for that location without going through the autocomplete flow
- [ ] If `localStorage` is unavailable (private browsing or `SecurityError`), chips are silently omitted and the app continues functioning normally
- [ ] The most recently selected location always appears as the first chip

**Priority:** P0 | **Feature Ref:** F0 | **Complexity:** S

---

### US-04: Keyboard-Accessible Search

**As a** Priya (Outdoor Enthusiast), **I want to** navigate the search autocomplete entirely with my keyboard, **so that** I can use the app on desktop without reaching for a mouse.

**Acceptance Criteria:**
- [ ] The search input is wrapped in a `<form>` element; pressing `Enter` with the first suggestion highlighted selects that suggestion
- [ ] The autocomplete dropdown is navigable with `↑` / `↓` arrow keys once suggestions are visible
- [ ] Pressing `Escape` closes the dropdown without selecting a suggestion
- [ ] Pressing `Enter` while a suggestion is keyboard-focused selects it, closes the dropdown, and triggers a weather fetch
- [ ] All autocomplete suggestion items are reachable by keyboard (no mouse required to select a suggestion)

**Priority:** P0 | **Feature Ref:** F0 | **Complexity:** S

---

## Epic F1 — Current Conditions Display

> The hero section — the primary answer to "what's the weather right now?". Must be visible above the fold on both mobile and desktop. Includes temperature, feels-like, condition, high/low, precipitation, humidity, wind, and a unit toggle. Always shows a skeleton state while loading and a clear error state on failure.

---

### US-05: Current Weather Hero Display

**As a** Maya (Casual Checker), **I want to** see the current temperature, feels-like, weather condition, today's high/low, precipitation probability, humidity, and wind speed all above the fold the moment I open the app, **so that** I can answer "do I need a jacket?" in under 2 seconds without scrolling.

**Acceptance Criteria:**
- [ ] Current temperature is displayed as a large integer (no decimal point) with the active unit suffix (e.g., "18°C")
- [ ] Feels-like temperature, condition icon + label, today's high/low, precipitation probability, humidity, and wind speed are all visible above the fold at 375px viewport width without scrolling
- [ ] A skeleton loading placeholder (not a blank screen or spinner-only) is shown while the weather fetch is in progress, preserving the layout shape of the real content
- [ ] An error message ("Unable to load weather for [location]. Check your connection.") and a "Try again" button are shown if the fetch fails — never a blank screen
- [ ] The condition icon uses the correct day variant when `isDay === true` and the night variant when `isDay === false`; the condition text label is always rendered alongside the icon

**Priority:** P0 | **Feature Ref:** F1 | **Complexity:** L

---

### US-06: °C / °F Unit Toggle

**As a** Maya (Casual Checker), **I want to** switch between °C and °F from the main screen with a single tap, **so that** I can discuss the weather with family overseas without digging into settings.

**Acceptance Criteria:**
- [ ] The °C/°F toggle is visible on the main screen at all times — including during skeleton and error states — and is never buried in a settings menu
- [ ] Toggling the unit updates all temperature values app-wide (hero, hourly, daily, chart) instantly without making a new network request
- [ ] The unit preference is written to `localStorage` on every toggle and restored on the next page load
- [ ] Wind speed changes to mph when °F is active and to km/h when °C is active
- [ ] The toggle is reachable and operable via keyboard (Tab to focus, Enter or Space to activate)

**Priority:** P0 | **Feature Ref:** F1 | **Complexity:** S

---

## Epic F2 — Hourly Forecast

> A horizontally scrollable strip of 24 forecast cards on the main screen — not behind a tab or paywall. Each card shows hour, condition icon, temperature, and precipitation probability. The primary feature for James (Commuter).

---

### US-07: 24-Hour Forecast Strip

**As a** James (Commuter), **I want to** see a horizontally scrollable 24-hour forecast row directly on the main screen, **so that** I can scan precipitation windows for my morning and evening commute in a single glance without navigating to a separate screen.

**Acceptance Criteria:**
- [ ] Exactly 24 hourly cards are rendered in a horizontally scrollable strip on the main screen
- [ ] Each card displays: hour label (correct local timezone, not device timezone), condition icon (correct day/night variant), temperature as an integer, and precipitation probability as a percentage — even when the value is 0%
- [ ] The strip is scrollable via touch swipe on mobile and mouse wheel or drag on desktop; it does not cause horizontal overflow on the page body
- [ ] Toggling °C/°F updates all hourly temperatures instantly without a network request
- [ ] The strip is sourced from the same `WeatherData` fetch as the current conditions hero — no additional API call is made

**Priority:** P1 | **Feature Ref:** F2 | **Complexity:** M

---

### US-08: Hourly Card Touch Targets

**As a** James (Commuter), **I want to** be able to tap individual hourly cards comfortably on my phone while standing at a bus stop, **so that** I can interact with the forecast without mis-tapping.

**Acceptance Criteria:**
- [ ] Every interactive element within each hourly card has a minimum touch target of 44×44 CSS pixels (per WCAG 2.5.8)
- [ ] Cards have scroll-snap points so swiping lands on a clean card boundary rather than between cards
- [ ] The strip is focusable via keyboard Tab, and once focused, `←`/`→` arrow keys scroll through the cards
- [ ] Precipitation probability is never omitted from any card, including cards where the value is 0%
- [ ] Day/night icon variants reflect each hour's `isDay` value using the location's local timezone — not the device timezone

**Priority:** P1 | **Feature Ref:** F2 | **Complexity:** S

---

## Epic F3 — 7-Day Daily Forecast

> A vertical list of 7 daily forecast rows plus a Recharts AreaChart temperature trend visualisation. The primary feature for Priya (Outdoor Enthusiast). Sourced from the same API fetch as F1/F2 — no extra network call.

---

### US-09: 7-Day Forecast List

**As a** Priya (Outdoor Enthusiast), **I want to** see a full 7-day daily forecast with high/low temperatures and precipitation probability for each day, **so that** I can pick the best weather window for my weekend trail run without hitting a paywall or needing to navigate to a secondary screen.

**Acceptance Criteria:**
- [ ] Exactly 7 daily rows are rendered; today's row is labelled "Today" (not the abbreviated day name); subsequent rows use 3-letter abbreviations (Mon, Tue, etc.) derived from the location's timezone
- [ ] Each row shows: day label, condition icon (daytime variant always used for daily rows), high temperature, low temperature, and precipitation probability — precipitation is shown even when the value is 0%
- [ ] High temperature is always displayed before (or above) low temperature and is visually dominant
- [ ] The full 7-day list is visible on a 375px mobile screen without truncation or a "See more days" tap
- [ ] Toggling °C/°F updates all daily temperatures and the chart Y-axis instantly without a network request

**Priority:** P0 | **Feature Ref:** F3 | **Complexity:** M

---

### US-10: Temperature Trend Chart

**As a** Priya (Outdoor Enthusiast), **I want to** see a temperature trend chart across the 7-day forecast, **so that** I can spot cold snaps or warming patterns at a glance when planning an activity for later in the week.

**Acceptance Criteria:**
- [ ] A Recharts `AreaChart` renders two area series — high temperature and low temperature — across 7 daily data points
- [ ] The chart X-axis shows abbreviated day labels and the Y-axis shows temperature in the currently active unit; both update when the unit is toggled
- [ ] The chart has a `role="img"` wrapper with a descriptive `aria-label` listing each day's high and low, plus a visually-hidden `<table>` fallback in the DOM for screen readers
- [ ] If Recharts throws an uncaught exception, an error boundary catches it and renders the raw data table instead of the chart — the rest of the page is unaffected
- [ ] The chart is readable and not clipped on both 375px mobile and 1024px desktop viewports

**Priority:** P0 | **Feature Ref:** F3 | **Complexity:** M

---

## Epic F4 — Weather Icons & Visual Indicators

> The complete visual language for weather state across the app. Full WMO code 0–99 coverage with day/night variants. Condition-aware hero background gradient. All icon + background combinations meet WCAG 4.5:1 contrast. Conditions are never communicated by colour alone.

---

### US-11: Full WMO Icon Coverage

**As a** Maya (Casual Checker), **I want to** see a recognisable weather icon that matches the actual conditions — whether it's clear, foggy, snowing, or thundering, **so that** I can read the weather state at a glance without interpreting a text label.

**Acceptance Criteria:**
- [ ] All WMO weather codes 0–99 map to a valid condition icon; no code produces a broken image or missing icon
- [ ] Unknown or unmapped WMO codes fall back silently to the Clear Sky (code 0) icon and label — no runtime error is thrown
- [ ] The `getConditionInfo(code, isDay)` utility function is the single source of truth for icon resolution — no inline switch-case logic exists in components
- [ ] Every condition icon is accompanied by a text label; no weather state is communicated by icon or colour alone (WCAG 1.4.1)
- [ ] The complete icon mapping is defined in a dedicated `weatherCodes.ts` file and is importable by all weather components

**Priority:** P0 | **Feature Ref:** F4 | **Complexity:** M

---

### US-12: Day/Night Icon Variants and Hero Background Gradient

**As a** James (Commuter), **I want to** see day icons during the day and night icons after sunset, and a background colour that reflects the current weather and time, **so that** the app accurately reflects real conditions and I can trust the data at a glance.

**Acceptance Criteria:**
- [ ] Day and night icon variants are applied correctly in all three contexts: hero (using `current.isDay`), hourly cards (using `HourlyForecast.isDay`), and daily rows (always daytime variant)
- [ ] A sun icon never appears after sunset; a moon/stars icon is used for all night-time clear/mainly-clear states
- [ ] The hero section background gradient updates to match the current condition group and time of day (e.g., deep navy at night, sky blue on a clear day, muted grey when overcast) whenever a new location is loaded
- [ ] All hero gradient + foreground text colour combinations achieve a minimum 4.5:1 contrast ratio, verified manually across every condition × time-of-day combination before production deploy
- [ ] The gradient transitions are disabled when `prefers-reduced-motion: reduce` is active

**Priority:** P0 | **Feature Ref:** F4 | **Complexity:** M

---

## Epic F5 — Responsive Layout

> Mobile-first, one responsive implementation from 375px to 1280px+. Single-column on mobile, two-column on tablet, side-by-side panels on desktop. No horizontal overflow anywhere. All tap targets ≥ 44px at every breakpoint.

---

### US-13: Mobile Layout (375px–767px)

**As a** Maya (Casual Checker), **I want to** use the app one-handed on my iPhone in portrait mode, **so that** I can check the weather during my morning routine without needing to zoom, scroll horizontally, or mis-tap small buttons.

**Acceptance Criteria:**
- [ ] The app renders in a single-column stack at 375px viewport width with zero horizontal overflow on the page body
- [ ] All tap targets (search input actions, GPS button, unit toggle, hourly cards, details trigger) are a minimum 44×44 CSS pixels on mobile
- [ ] All weather data (hero, hourly strip, daily list, details panel) is accessible by vertical scroll only — no horizontal overflow on the document
- [ ] The hourly strip scrolls horizontally within its own container without triggering `<body>` horizontal overflow
- [ ] No text is smaller than 12px rendered size at any mobile breakpoint

**Priority:** P0 | **Feature Ref:** F5 | **Complexity:** M

---

### US-14: Tablet and Desktop Layout

**As a** Priya (Outdoor Enthusiast), **I want to** use the app on my desktop mid-week for trip planning with a wider, more information-dense layout, **so that** I can see the forecast and secondary details side-by-side without excessive scrolling.

**Acceptance Criteria:**
- [ ] At tablet widths (768px–1023px) the hero section uses a two-column layout: temperature and condition on the left; today's high/low and supporting metrics on the right
- [ ] At desktop widths (1024px+) a constrained container (`max-w-4xl`) centres the content with the current conditions + hourly strip on the left and the 7-day list + trend chart on the right
- [ ] The app renders without horizontal overflow and with no hidden or clipped weather data at 768px, 1024px, and 1280px viewport widths
- [ ] All layout transitions are handled exclusively via Tailwind CSS responsive prefixes (`md:`, `lg:`) — no JavaScript viewport detection or separate mobile codebase
- [ ] The unit toggle is visible and usable at all supported breakpoints

**Priority:** P0 | **Feature Ref:** F5 | **Complexity:** M

---

## Epic F6 — Secondary Weather Details Panel

> A collapsible "Details" panel below the hero, collapsed by default, that reveals UV index, wind direction, visibility, humidity, and sunrise/sunset times. Progressive disclosure: secondary data for Priya (Outdoor Enthusiast) without cluttering Maya's (Casual Checker) view.

---

### US-15: Collapsible Details Panel

**As a** Priya (Outdoor Enthusiast), **I want to** expand a Details panel with a single tap to see UV index, wind direction, visibility, and sunrise/sunset times, **so that** I can check secondary metrics before a hike without those numbers cluttering the main view when I don't need them.

**Acceptance Criteria:**
- [ ] The Details panel is collapsed by default on every page load and every page reload — expansion state is never persisted to `localStorage`
- [ ] Tapping or clicking the trigger button expands the panel and reveals all available secondary metrics (UV index, wind direction, humidity, sunrise, sunset; visibility is shown only if returned by the API — silently omitted if absent)
- [ ] UV index is displayed with a qualitative label: Low (0–2), Moderate (3–5), High (6–7), Very High (8–10), or Extreme (11+)
- [ ] Wind direction is displayed as both cardinal direction and degrees (e.g., "NW (315°)") — never degrees alone
- [ ] Sunrise and sunset times are displayed in the selected location's local timezone via `Intl.DateTimeFormat` — never the user's device timezone
- [ ] Wind speed in the Details panel is displayed in km/h when °C is active and mph when °F is active (matching the F1 hero conversion)

**Priority:** P1 | **Feature Ref:** F6 | **Complexity:** M

---

### US-16: Details Panel Accessibility

**As a** Priya (Outdoor Enthusiast), **I want to** expand and collapse the Details panel using only my keyboard, **so that** I can access secondary metrics without a mouse during desktop planning sessions.

**Acceptance Criteria:**
- [ ] The Details panel trigger button is reachable via Tab and activatable with Enter or Space
- [ ] The trigger button has `aria-expanded="true"` when the panel is open and `aria-expanded="false"` when collapsed
- [ ] The trigger button meets the 44×44px minimum touch target requirement
- [ ] The expand/collapse animation is disabled or reduced to instant when `prefers-reduced-motion: reduce` is active
- [ ] If `uvIndexMax` is `null` after data transformation, the UV row is omitted silently — no placeholder, no error, and all other metrics continue to display
- [ ] If the visibility field is absent from the API response, the visibility row is silently omitted — no placeholder, no "—", no error

**Priority:** P1 | **Feature Ref:** F6 | **Complexity:** S

---

## Epic F7 — Data Freshness & Stale State Handling

> Users always know how old their data is. The app never shows a blank screen on network failure. Cached data is displayed with a visible notice when offline. TanStack Query `staleTime` is 10 minutes to prevent redundant API calls on intermittent connections.

---

### US-17: Data Freshness Indicator

**As a** James (Commuter), **I want to** always see how many minutes ago the weather data was last updated, **so that** I can trust whether I'm looking at the current model run before deciding whether to bring my rain jacket.

**Acceptance Criteria:**
- [ ] A "Updated X minutes ago" indicator is visible on the main screen at all times when weather data is loaded
- [ ] If data was fetched less than 1 minute ago, the indicator reads "Updated just now"
- [ ] The indicator updates every 60 seconds via an interval — it does not trigger a re-render of the full weather data tree
- [ ] TanStack Query `staleTime` is set to 10 minutes at the `QueryClient` level; switching between recently-fetched locations does not trigger a new API call within the stale window
- [ ] When the network recovers after an offline period, data is automatically refreshed in the background and the freshness indicator updates to reflect the new fetch time

**Priority:** P1 | **Feature Ref:** F7 | **Complexity:** S

---

### US-18: Offline and Network Failure Handling

**As a** Priya (Outdoor Enthusiast), **I want to** see my last-loaded forecast with a clear "cached data" notice when I lose signal at a trailhead, **so that** I still have useful weather information even without a live connection.

**Acceptance Criteria:**
- [ ] When the network is offline and cached data exists, the last-fetched weather data is displayed with a persistent banner: "Showing cached data from X minutes ago — check your connection"
- [ ] When the network is offline and no cached data exists, a friendly empty state is shown ("Unable to load weather — check your connection") with a retry button — never a blank screen
- [ ] When the network recovers, TanStack Query automatically triggers a background refetch and dismisses the offline banner once fresh data is loaded
- [ ] A "City not found — try a different spelling" message is shown in the search context when the geocoding API returns no results — this is not treated as a network error
- [ ] Every loading and error path across the app renders visible UI — a blank screen is never an acceptable outcome

**Priority:** P1 | **Feature Ref:** F7 | **Complexity:** M

---

## Epic F8 — Accessibility (WCAG AA)

> WCAG 2.2 Level AA compliance built from day one — not retrofitted. Covers keyboard navigation for all interactive elements, `aria-live` announcements, colour-alone prohibition, contrast ratios, 44px touch targets, accessible Recharts chart, and `prefers-reduced-motion` support.

---

### US-19: Full Keyboard Navigation

**As a** Priya (Outdoor Enthusiast), **I want to** operate every part of the app using only my keyboard, **so that** I can use it on desktop without switching between keyboard and mouse, and so that users who cannot use a mouse are not excluded.

**Acceptance Criteria:**
- [ ] All interactive elements (search input, GPS button, autocomplete suggestions, unit toggle, hourly cards, details panel trigger, "Try again" button, footer links) are reachable via Tab and operable with Enter or Space
- [ ] The autocomplete dropdown supports `↑`/`↓` navigation, `Enter` to select, and `Escape` to close without selecting
- [ ] The hourly scroll strip supports `←`/`→` arrow key scrolling once the strip is focused via Tab
- [ ] Focus rings are visible on all focusable elements — `outline: none` is never used without a replacement focus indicator
- [ ] Zero WCAG AA violations are reported by an automated axe-core scan on the production build

**Priority:** P1 | **Feature Ref:** F8 | **Complexity:** M

---

### US-20: Screen Reader and ARIA Announcements

**As a** screen reader user, **I want to** hear weather data announced when it loads and be notified of errors, **so that** I can use the app independently without relying on visual feedback.

**Acceptance Criteria:**
- [ ] A single `aria-live="polite"` region in the app root announces "Weather data loaded for [location]: [temperature], [condition]" when a new location's data loads
- [ ] The `aria-live` region announces "Unable to load weather for [location]. Check your connection." on API errors
- [ ] The `aria-live` region announces "Showing cached weather data for [location] from X minutes ago" when offline cached data is displayed
- [ ] Background data refreshes (within the stale window) do not trigger an `aria-live` announcement to avoid interrupting the user
- [ ] The Recharts temperature chart has a `role="img"` wrapper with a descriptive `aria-label` plus a visually-hidden `<table>` containing the same 7-day data, rendered in the DOM for screen readers

**Priority:** P1 | **Feature Ref:** F8 | **Complexity:** M

---

### US-21: Contrast, Colour, and Motion Accessibility

**As a** Maya (Casual Checker), **I want to** read all weather information clearly regardless of the background gradient, lighting conditions, or my motion-sensitivity settings, **so that** the app works for me even in bright sunlight on my phone or when I prefer reduced animations.

**Acceptance Criteria:**
- [ ] All text/background combinations across all hero gradient states (every condition × day/night combination) achieve a minimum 4.5:1 contrast ratio — verified manually with a contrast analyser before production deploy
- [ ] No weather condition is conveyed by colour alone — every condition icon has an adjacent text label; the icon carries `alt=""` and `aria-hidden="true"`
- [ ] Search input placeholder text achieves ≥ 4.5:1 contrast against the input background
- [ ] All CSS animations and transitions (hero gradient transition, skeleton pulse, details panel expand/collapse, chevron rotation, scroll-snap) are disabled or reduced to instant when `prefers-reduced-motion: reduce` is active in the user's OS settings
- [ ] All interactive elements have a minimum 44×44px touch target area at every breakpoint

**Priority:** P1 | **Feature Ref:** F8 | **Complexity:** M

---

## Epic F9 — Attribution & Deployment

> The app is deployed on Vercel HTTPS (required for the Browser Geolocation API). The Open-Meteo CC BY 4.0 licence and Nominatim attribution are displayed in the footer on every page load. Deployment auto-triggers from a push to the `main` branch.

---

### US-22: Attribution Footer and Licence Compliance

**As a** Maya (Casual Checker), **I want to** be able to see who provides the weather data at the bottom of the page, **so that** the app fulfils its data licence obligations and I know the source of the information I'm relying on.

**Acceptance Criteria:**
- [ ] The footer is visible on every page load and contains: a "Weather data by Open-Meteo" link to `https://open-meteo.com/`, a "CC BY 4.0" licence link to the Creative Commons licence page, and a "Geocoding by OpenStreetMap Nominatim" link to `https://nominatim.openstreetmap.org/`
- [ ] All footer external links open in a new tab with `target="_blank" rel="noopener noreferrer"`
- [ ] The app is deployed to a public Vercel HTTPS URL; the GPS geolocation button functions correctly on the live HTTPS URL (not just on `localhost`)
- [ ] A push to the `main` GitHub branch automatically triggers a Vercel production deploy with no manual steps required
- [ ] The production `dist/` build output contains no API keys or sensitive credentials; the TypeScript strict-mode build (`tsc --noEmit`) passes with zero errors

**Priority:** P0 | **Feature Ref:** F9 | **Complexity:** S

---

## Story Index

| Story ID | Title | Feature | Persona(s) | Priority | Complexity |
|---|---|---|---|---|---|
| US-01 | City Name Search with Autocomplete | F0 | Maya, James, Priya | P0 | M |
| US-02 | GPS Geolocation (Opt-In) | F0 | Maya | P0 | M |
| US-03 | Recent Searches Quick-Select | F0 | James | P0 | S |
| US-04 | Keyboard-Accessible Search | F0 | Priya | P0 | S |
| US-05 | Current Weather Hero Display | F1 | Maya | P0 | L |
| US-06 | °C / °F Unit Toggle | F1 | Maya | P0 | S |
| US-07 | 24-Hour Forecast Strip | F2 | James | P1 | M |
| US-08 | Hourly Card Touch Targets | F2 | James | P1 | S |
| US-09 | 7-Day Forecast List | F3 | Priya | P0 | M |
| US-10 | Temperature Trend Chart | F3 | Priya | P0 | M |
| US-11 | Full WMO Icon Coverage | F4 | Maya, James, Priya | P0 | M |
| US-12 | Day/Night Variants and Hero Gradient | F4 | James | P0 | M |
| US-13 | Mobile Layout (375px–767px) | F5 | Maya | P0 | M |
| US-14 | Tablet and Desktop Layout | F5 | Priya | P0 | M |
| US-15 | Collapsible Details Panel | F6 | Priya | P1 | M |
| US-16 | Details Panel Accessibility | F6 | Priya | P1 | S |
| US-17 | Data Freshness Indicator | F7 | James | P1 | S |
| US-18 | Offline and Network Failure Handling | F7 | Priya, James | P1 | M |
| US-19 | Full Keyboard Navigation | F8 | Priya | P1 | M |
| US-20 | Screen Reader and ARIA Announcements | F8 | All | P1 | M |
| US-21 | Contrast, Colour, and Motion Accessibility | F8 | Maya | P1 | M |
| US-22 | Attribution Footer and Licence Compliance | F9 | All | P0 | S |

---

## Coverage Summary

| Feature | Stories | Priority | All PRD Capabilities Covered |
|---|---|---|---|
| F0 — Location Search & Detection | US-01, US-02, US-03, US-04 | P0 | ✓ |
| F1 — Current Conditions Display | US-05, US-06 | P0 | ✓ |
| F2 — Hourly Forecast | US-07, US-08 | P1 | ✓ |
| F3 — 7-Day Daily Forecast | US-09, US-10 | P0 | ✓ |
| F4 — Weather Icons & Visual Indicators | US-11, US-12 | P0 | ✓ |
| F5 — Responsive Layout | US-13, US-14 | P0 | ✓ |
| F6 — Secondary Weather Details Panel | US-15, US-16 | P1 | ✓ |
| F7 — Data Freshness & Stale State Handling | US-17, US-18 | P1 | ✓ |
| F8 — Accessibility (WCAG AA) | US-19, US-20, US-21 | P1 | ✓ |
| F9 — Attribution & Deployment | US-22 | P0 | ✓ |

**Total: 22 stories across 10 features — 10/10 PRD features covered ✓**

---

## P0 Delivery Checklist

The following stories are the minimum viable product. All must be complete before v1.0 can ship:

- [ ] US-01 — City Name Search with Autocomplete
- [ ] US-02 — GPS Geolocation (Opt-In)
- [ ] US-03 — Recent Searches Quick-Select
- [ ] US-04 — Keyboard-Accessible Search
- [ ] US-05 — Current Weather Hero Display
- [ ] US-06 — °C / °F Unit Toggle
- [ ] US-09 — 7-Day Forecast List
- [ ] US-10 — Temperature Trend Chart
- [ ] US-11 — Full WMO Icon Coverage
- [ ] US-12 — Day/Night Variants and Hero Gradient
- [ ] US-13 — Mobile Layout (375px–767px)
- [ ] US-14 — Tablet and Desktop Layout
- [ ] US-22 — Attribution Footer and Licence Compliance

---

*UserStories v1.0 — generated 2026-05-01*
*Sources: PRD-WeatherApp.md v1.0, FRD-WeatherApp.md v1.0, PERSONAS-WeatherApp.md v1.0, PROJECT.md*
*22 stories · 10 epics · 3 personas · 10/10 PRD features mapped*
