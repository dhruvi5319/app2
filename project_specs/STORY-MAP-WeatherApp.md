# Story Map Document
## Simple Weather App — WeatherApp

| Field | Value |
|---|---|
| **Product** | Simple Weather App |
| **Version** | 1.0 |
| **Date** | 2026-05-01 |
| **Related Personas** | PERSONAS-WeatherApp.md (PER-01, PER-02, PER-03) |
| **Related JTBD** | JTBD-WeatherApp.md (JTBD-01.1–JTBD-03.3) |
| **Related Journeys** | JOURNEYS-WeatherApp.md (JRN-01.01–JRN-03.02) |
| **Related Stories** | UserStories-WeatherApp.md (US-01–US-22) |
| **Related PRD** | PRD-WeatherApp.md v1.0 (2026-04-29) |
| **Status** | Active |
| **Total Stories Mapped** | 22 |
| **Releases Defined** | 2 (R1: MVP/P0, R2: Differentiators/P1) |

---

## 1. Overview

This Story Map organises all 22 user stories (US-01 through US-22) into a two-dimensional grid:

- **X-axis (columns):** The five universal journey stages that every persona traverses — **Arrive → Locate → Absorb → Deepen → Trust** — derived from the six journeys in JOURNEYS-WeatherApp.md and collapsed into a canonical stage set.
- **Y-axis (rows):** Epics (F0–F9) with individual stories within each, sorted by persona and priority.
- **NaC column:** Each story carries a Natural Acceptance Criterion — a testable statement derived from a specific JTBD outcome applied to the journey stage context. NaC are not invented; they are the intersection of *JTBD outcome* × *journey stage* × *story scope*.
- **Release column:** R1 = all P0 stories (MVP / v1.0 launch gate); R2 = all P1 stories (differentiators, shipped immediately after MVP).

**Stage definitions (canonical, derived from all 6 journeys):**

| Stage | What happens here | Primary journeys |
|---|---|---|
| **Arrive** | App loads; location resolves; first data appears | JRN-01.01 S1–S2, JRN-02.01 S1, JRN-02.02 S1–S3, JRN-03.01 S1, JRN-03.02 S1 |
| **Locate** | User finds or confirms their target location | JRN-01.01 S2, JRN-02.02 S2–S3, JRN-03.01 S1 |
| **Absorb** | User reads the primary weather answer (current + today) | JRN-01.01 S3–S5, JRN-02.01 S3–S5, JRN-02.02 S4, JRN-03.01 S2–S3 |
| **Deepen** | User expands into hourly, 7-day, or secondary metrics | JRN-02.01 S3–S4, JRN-03.01 S2–S5, JRN-03.02 S3–S4 |
| **Trust** | User verifies data age/correctness; offline resilience | JRN-01.01 S5, JRN-01.02 S1, JRN-02.01 S2+S5, JRN-02.02 S5, JRN-03.02 S2–S5 |

---

## 2. Story Map Matrix

> **Read this table:** Each row is one user story. Columns show which journey stage the story serves, its NaC (traced to a JTBD outcome), and its release.

### Epic F0 — Location Search & Detection

| SM-ID | Story | Persona(s) | Journey Stage | JTBD | NaC | Release |
|---|---|---|---|---|---|---|
| SM-F0.1 | US-01: City Name Search with Autocomplete | PER-01, PER-02, PER-03 | **Locate** | JTBD-02.3 | Given a user types 2+ chars, autocomplete suggestions appear with city + region in < 300ms debounce; selecting a result loads weather within 2 seconds with no blank intermediate state | R1 |
| SM-F0.2 | US-02: GPS Geolocation (Opt-In) | PER-01 | **Arrive** | JTBD-01.1 | Given the GPS button is tapped, the native permission prompt appears; denying it never produces a blank screen and the search input remains fully functional | R1 |
| SM-F0.3 | US-03: Recent Searches Quick-Select | PER-02 | **Arrive** | JTBD-02.1 | Given a user has previously searched a city, a chip for that city appears on load; tapping it loads weather immediately without re-typing — commute re-check in < 1 tap | R1 |
| SM-F0.4 | US-04: Keyboard-Accessible Search | PER-03 | **Locate** | JTBD-03.1 | Given a user navigates with keyboard only, ↑/↓ selects suggestions, Enter confirms, Escape dismisses — full 7-day forecast reachable without touching a mouse | R1 |

### Epic F1 — Current Conditions Display

| SM-ID | Story | Persona(s) | Journey Stage | JTBD | NaC | Release |
|---|---|---|---|---|---|---|
| SM-F1.1 | US-05: Current Weather Hero Display | PER-01 | **Absorb** | JTBD-01.1 | Given the app opens on a 375px mobile screen on a 4G connection, current temperature (integer), feels-like, condition icon+label, high/low, precipitation probability, humidity, and wind speed are all visible above the fold within 2 seconds; no blank screen occurs on slow or failed fetch | R1 |
| SM-F1.2 | US-06: °C / °F Unit Toggle | PER-01 | **Absorb** | JTBD-01.2 | Given the main screen is visible, the °C/°F toggle is reachable in exactly 1 tap; all temperature values (hero, hourly, daily, chart) update within 500ms; preference persists to localStorage and survives page reload | R1 |

### Epic F2 — Hourly Forecast

| SM-ID | Story | Persona(s) | Journey Stage | JTBD | NaC | Release |
|---|---|---|---|---|---|---|
| SM-F2.1 | US-07: 24-Hour Forecast Strip | PER-02 | **Deepen** | JTBD-02.1 | Given the main screen is loaded for any city, a 24-hour horizontally scrollable strip is visible without any navigation tap; every card shows precipitation probability as a percentage (including 0%); no paywall gate exists at any position in the strip | R2 |
| SM-F2.2 | US-08: Hourly Card Touch Targets | PER-02 | **Deepen** | JTBD-02.1 | Given a user scans the hourly strip on Android Chrome while standing, every card touch target is ≥ 44×44px; scroll-snap lands on clean card boundaries; day/night icon reflects each hour's local timezone isDay value | R2 |

### Epic F3 — 7-Day Daily Forecast

| SM-ID | Story | Persona(s) | Journey Stage | JTBD | NaC | Release |
|---|---|---|---|---|---|---|
| SM-F3.1 | US-09: 7-Day Forecast List | PER-03 | **Deepen** | JTBD-03.1 | Given a user searches any city on a 375px mobile screen, all 7 daily rows (day label, icon, high, low, precipitation %) are visible without truncation, a "See more" gate, or any paywall prompt — reading today through day 7 requires only vertical scroll | R1 |
| SM-F3.2 | US-10: Temperature Trend Chart | PER-03 | **Deepen** | JTBD-03.1 | Given the 7-day list is loaded, a Recharts AreaChart renders high/low curves across all 7 days on both 375px mobile and 1024px+ desktop; toggling °C/°F updates the Y-axis instantly; if the chart throws an error, a data-table fallback renders and the rest of the page is unaffected | R1 |

### Epic F4 — Weather Icons & Visual Indicators

| SM-ID | Story | Persona(s) | Journey Stage | JTBD | NaC | Release |
|---|---|---|---|---|---|---|
| SM-F4.1 | US-11: Full WMO Icon Coverage | PER-01, PER-02, PER-03 | **Absorb** | JTBD-01.1 | Given any WMO code 0–99 is returned by Open-Meteo, a valid condition icon and text label are rendered — no broken image, no missing icon, no runtime error; unknown codes fall back silently to Clear Sky | R1 |
| SM-F4.2 | US-12: Day/Night Variants and Hero Gradient | PER-02 | **Absorb** | JTBD-02.2 | Given the current hour is after sunset for the searched location's local timezone, a night icon variant is displayed (never a sun icon); the hero gradient updates per condition × time-of-day; all gradient+text combinations achieve ≥ 4.5:1 contrast | R1 |

### Epic F5 — Responsive Layout

| SM-ID | Story | Persona(s) | Journey Stage | JTBD | NaC | Release |
|---|---|---|---|---|---|---|
| SM-F5.1 | US-13: Mobile Layout (375px–767px) | PER-01 | **Arrive** | JTBD-01.1 | Given the app opens on a 375px viewport, zero horizontal overflow occurs on the page body; all tap targets are ≥ 44×44px; all weather data is accessible by vertical scroll only; no text is smaller than 12px rendered | R1 |
| SM-F5.2 | US-14: Tablet and Desktop Layout | PER-03 | **Arrive** | JTBD-03.1 | Given the app opens at 768px, 1024px, or 1280px, a multi-column layout renders with no hidden or clipped weather data; the unit toggle is visible and usable at all breakpoints; layout transitions use Tailwind responsive prefixes only — no JS viewport detection | R1 |

### Epic F6 — Secondary Weather Details Panel

| SM-ID | Story | Persona(s) | Journey Stage | JTBD | NaC | Release |
|---|---|---|---|---|---|---|
| SM-F6.1 | US-15: Collapsible Details Panel | PER-03 | **Deepen** | JTBD-03.2 | Given the main screen is showing current conditions, expanding the Details panel with 1 tap reveals UV index (with qualitative label), wind direction (cardinal + degrees), visibility, humidity, sunrise, and sunset — all in the searched location's local timezone, never the browser timezone; panel is collapsed by default on every load | R2 |
| SM-F6.2 | US-16: Details Panel Accessibility | PER-03 | **Deepen** | JTBD-03.2 | Given a keyboard user Tab-focuses the Details trigger, pressing Enter/Space expands the panel; aria-expanded is correctly toggled; expand animation is instant when prefers-reduced-motion is active; if uvIndexMax is null, the UV row is silently omitted with no error | R2 |

### Epic F7 — Data Freshness & Stale State Handling

| SM-ID | Story | Persona(s) | Journey Stage | JTBD | NaC | Release |
|---|---|---|---|---|---|---|
| SM-F7.1 | US-17: Data Freshness Indicator | PER-02 | **Trust** | JTBD-02.2 | Given weather data is loaded, an "Updated X minutes ago" indicator (or "Updated just now" if < 1 min) is always visible on the main screen; the indicator updates every 60 seconds without triggering a full data re-render; TanStack Query staleTime is 10 minutes — no redundant API calls within the stale window | R2 |
| SM-F7.2 | US-18: Offline and Network Failure Handling | PER-03, PER-02 | **Trust** | JTBD-03.3 | Given the device loses network connectivity after data was previously loaded, the full cached forecast (current conditions, 24h hourly row, 7-day list) remains visible with a persistent "Showing cached data from X minutes ago" banner; zero blank screens or infinite spinners occur in any offline or network-transition state | R2 |

### Epic F8 — Accessibility (WCAG AA)

| SM-ID | Story | Persona(s) | Journey Stage | JTBD | NaC | Release |
|---|---|---|---|---|---|---|
| SM-F8.1 | US-19: Full Keyboard Navigation | PER-03 | **Arrive / Locate / Absorb / Deepen** | JTBD-03.1 | Given a keyboard-only user, every interactive element (search, GPS button, autocomplete, unit toggle, hourly strip, details trigger, retry button) is reachable via Tab and operable with Enter/Space; zero WCAG AA violations in axe-core scan on production build | R2 |
| SM-F8.2 | US-20: Screen Reader and ARIA Announcements | All | **Absorb / Trust** | JTBD-01.1 | Given a screen reader is active and weather data loads for a new location, aria-live="polite" announces "[temp], [condition] for [location]"; errors and cached-data states are also announced; background re-fetches within stale time do NOT trigger announcements | R2 |
| SM-F8.3 | US-21: Contrast, Colour, and Motion Accessibility | PER-01 | **Absorb** | JTBD-01.1 | Given the hero gradient is active for any condition × time-of-day combination, all text achieves ≥ 4.5:1 contrast; no condition is conveyed by colour alone (every icon has an adjacent text label); all CSS animations are disabled or instant when prefers-reduced-motion: reduce is set | R2 |

### Epic F9 — Attribution & Deployment

| SM-ID | Story | Persona(s) | Journey Stage | JTBD | NaC | Release |
|---|---|---|---|---|---|---|
| SM-F9.1 | US-22: Attribution Footer and Licence Compliance | All | **Arrive** | JTBD-01.1 | Given the app loads on the public Vercel HTTPS URL, the footer displays Open-Meteo CC BY 4.0 and Nominatim attribution links on every page load; the GPS geolocation button functions correctly on HTTPS (not just localhost); TypeScript strict-mode build passes with zero errors and zero exposed API keys | R1 |

---

## 3. NaC Derivation Table

> Full traceability chain: JTBD Outcome → Journey Stage → NaC text → Story mapped.
> NaC are derived exclusively from JTBD success measures applied to the journey stage context.

| NaC-ID | JTBD-ID | JTBD Outcome (from Success Measure) | Journey Stage | NaC Statement | Story |
|---|---|---|---|---|---|
| NaC-01 | JTBD-01.1 | Current temp + rain probability visible in ≤ 5s on 375px, no scroll, no dialogs | Arrive | App skeleton renders within 2s on 4G; GPS opt-in never blocks data render; no account or notification prompt before first data | US-02, US-13 |
| NaC-02 | JTBD-01.1 | Current temp + rain probability visible in ≤ 5s on 375px, no scroll, no dialogs | Absorb | Temperature (integer), feels-like, precipitation %, high/low all above the fold on 375px — zero scroll required to read core data | US-05, US-11 |
| NaC-03 | JTBD-01.1 | Current temp + rain probability visible in ≤ 5s on 375px, no scroll, no dialogs | Arrive | App deployed to HTTPS; attribution footer present; no API key in build output — prerequisites for GPS and licence compliance | US-22 |
| NaC-04 | JTBD-01.2 | Unit toggle reachable in 1 tap; all values update in ≤ 500ms; preference persists | Absorb | °C/°F toggle visible on main screen; 1 tap switches all temperatures simultaneously; preference survives page reload | US-06 |
| NaC-05 | JTBD-02.1 | Hourly precipitation % scannable in ≤ 10s on main screen, no nav tap, no paywall | Locate | Recent search chip for commute city loads weather in 1 tap — no retyping required on daily use | US-03 |
| NaC-06 | JTBD-02.1 | Hourly precipitation % scannable in ≤ 10s on main screen, no nav tap, no paywall | Deepen | 24-hour row on main screen; precipitation % on every card including 0%; full row scrollable with no paywall gate at any position | US-07, US-08 |
| NaC-07 | JTBD-02.2 | Freshness indicator visible in ≤ 3s across all network states; never blank | Trust | "Updated X min ago" always visible; night icon never shows a sun; day/night icon reflects location timezone not device timezone | US-12, US-17 |
| NaC-08 | JTBD-02.3 | New city search → full data in ≤ 5s; no blank on location transition | Locate | Autocomplete triggers at 2 chars; "Manchester, England" resolves in top 3 suggestions; skeleton shown on transition (no blank); data loads ≤ 2s | US-01, US-04 |
| NaC-09 | JTBD-03.1 | Full 7-day forecast + trend chart on 375px; no paywall; ≤ 5s | Deepen | All 7 daily rows visible on 375px without truncation or "see more" gate; precipitation % on every row; AreaChart renders on both 375px and 1024px+ | US-09, US-10 |
| NaC-10 | JTBD-03.1 | Full 7-day forecast + trend chart on 375px; no paywall; ≤ 5s | Arrive | Desktop layout places forecast + chart side-by-side at 1024px+; tablet layout uses two-column hero; no clipped data at any PRD-supported viewport | US-14 |
| NaC-11 | JTBD-03.2 | UV, wind, sunrise in location's local timezone via ≤ 2 taps; collapsed default | Deepen | Single tap expands Details panel; sunrise/sunset times match searched location's IANA timezone (not browser timezone); panel collapsed by default — does not clutter PER-01 or PER-02 view | US-15, US-16 |
| NaC-12 | JTBD-03.3 | Full cached forecast visible with staleness notice on zero-network state | Trust | On zero-network open, full 7-day + current conditions + hourly row served from TanStack Query cache with "Showing cached data from X minutes ago" banner; no blank screen, no infinite spinner | US-18 |
| NaC-13 | JTBD-01.1 (cross-cutting) | WMO icons across all conditions — trust via accuracy | Absorb | Full WMO 0–99 coverage; unknown codes fall back silently; every icon paired with a text label (WCAG 1.4.1); single source of truth in weatherCodes.ts | US-11 |
| NaC-14 | JTBD-03.1 (cross-cutting) | Full app reachable via keyboard for desktop planning sessions | Arrive / Locate / Absorb / Deepen | Every interactive element Tab-reachable + operable Enter/Space; autocomplete supports ↑/↓; axe-core zero violations on production | US-04, US-19 |
| NaC-15 | JTBD-01.1 (cross-cutting) | Weather data announced to screen readers; no blank screen on any state | Absorb / Trust | aria-live announces weather load, error, and cached-data states; background re-fetches silent; chart has aria-label + hidden data table | US-20 |
| NaC-16 | JTBD-01.1 (cross-cutting) | Contrast and motion accessibility across all hero gradient states | Absorb | All condition × time-of-day backgrounds achieve ≥ 4.5:1 contrast; all CSS animations disabled/instant under prefers-reduced-motion | US-21 |

---

## 4. Release Planning

### Release 1 — "Complete Core Journey" (MVP / v1.0 Launch Gate)

**Theme:** Every persona can arrive, find their location, and read a complete weather answer — including the full 7-day forecast — on any viewport. No gaps in the primary journey.

**Release criterion:** All P0 stories ship before the first public URL is shared. Zero P0 stories deferred.

**Stories in R1 (13 stories):**

| Story | Epic | Persona(s) | JTBD Addressed | Journey Stage |
|---|---|---|---|---|
| US-01 | F0 | PER-01, PER-02, PER-03 | JTBD-02.3, JTBD-03.1 | Locate |
| US-02 | F0 | PER-01 | JTBD-01.1 | Arrive |
| US-03 | F0 | PER-02 | JTBD-02.1 | Arrive |
| US-04 | F0 | PER-03 | JTBD-03.1 | Locate |
| US-05 | F1 | PER-01 | JTBD-01.1 | Absorb |
| US-06 | F1 | PER-01 | JTBD-01.2 | Absorb |
| US-09 | F3 | PER-03 | JTBD-03.1 | Deepen |
| US-10 | F3 | PER-03 | JTBD-03.1 | Deepen |
| US-11 | F4 | PER-01, PER-02, PER-03 | JTBD-01.1, JTBD-02.1, JTBD-03.1 | Absorb |
| US-12 | F4 | PER-02 | JTBD-02.2 | Absorb |
| US-13 | F5 | PER-01 | JTBD-01.1 | Arrive |
| US-14 | F5 | PER-03 | JTBD-03.1 | Arrive |
| US-22 | F9 | All | JTBD-01.1, JTBD-03.1 | Arrive |

**Journey completeness check for R1:**
- PER-01 (Maya) — Arrive ✓ · Locate ✓ · Absorb ✓ · Trust: partial (no freshness indicator yet — mitigated by skeleton + error states in US-05)
- PER-02 (James) — Arrive ✓ · Locate ✓ · Absorb ✓ · Deepen: hourly strip deferred to R2 · Trust: partial
- PER-03 (Priya) — Arrive ✓ · Locate ✓ · Absorb ✓ · Deepen: 7-day ✓, secondary metrics deferred to R2

**Personas served:** PER-01 fully served (JTBD-01.1, JTBD-01.2). PER-02 partially served (JTBD-02.1 needs US-07/US-08 from R2). PER-03 partially served (JTBD-03.2 and JTBD-03.3 need R2).

---

### Release 2 — "Differentiators & Trust" (P1 Features)

**Theme:** James gets his hourly strip. Priya gets secondary metrics and offline confidence. All personas get the freshness indicator, offline resilience, and full WCAG AA compliance.

**Release criterion:** Shipped immediately after R1; no functionality gate. R2 completes the full JTBD set for all three personas.

**Stories in R2 (9 stories):**

| Story | Epic | Persona(s) | JTBD Addressed | Journey Stage |
|---|---|---|---|---|
| US-07 | F2 | PER-02 | JTBD-02.1 | Deepen |
| US-08 | F2 | PER-02 | JTBD-02.1 | Deepen |
| US-15 | F6 | PER-03 | JTBD-03.2 | Deepen |
| US-16 | F6 | PER-03 | JTBD-03.2 | Deepen |
| US-17 | F7 | PER-02 | JTBD-02.2 | Trust |
| US-18 | F7 | PER-02, PER-03 | JTBD-02.2, JTBD-03.3 | Trust |
| US-19 | F8 | PER-03 | JTBD-03.1 | All stages |
| US-20 | F8 | All | JTBD-01.1 | Absorb / Trust |
| US-21 | F8 | PER-01 | JTBD-01.1 | Absorb |

**Journey completeness check for R2:**
- PER-01 (Maya) — All 4 stages complete · JTBD-01.1 ✓ · JTBD-01.2 ✓
- PER-02 (James) — All 5 stages complete · JTBD-02.1 ✓ · JTBD-02.2 ✓ · JTBD-02.3 ✓
- PER-03 (Priya) — All 5 stages complete · JTBD-03.1 ✓ · JTBD-03.2 ✓ · JTBD-03.3 ✓

---

## 5. Coverage Analysis

### 5a. Persona Coverage per Release

| Persona | R1 JTBD Addressed | R1 Journey Stages Covered | R2 JTBD Added | R2 Journey Stages Completed |
|---|---|---|---|---|
| PER-01 Maya (Casual Checker) | JTBD-01.1, JTBD-01.2 | Arrive, Locate, Absorb | — (all jobs addressed in R1) | Trust (US-20, US-21) |
| PER-02 James (Commuter) | JTBD-02.1 (partial), JTBD-02.3 | Arrive, Locate, Absorb | JTBD-02.1 (full), JTBD-02.2 | Deepen, Trust |
| PER-03 Priya (Outdoor Enthusiast) | JTBD-03.1 | Arrive, Locate, Absorb, Deepen (7-day) | JTBD-03.2, JTBD-03.3 | Deepen (details), Trust (offline) |

### 5b. JTBD Coverage per Release

| JTBD-ID | Priority | R1 Stories | R2 Stories | Status After R2 |
|---|---|---|---|---|
| JTBD-01.1 | P0 | US-02, US-05, US-11, US-12, US-13, US-22 | US-20, US-21 | ✅ Fully addressed |
| JTBD-01.2 | P1 | US-06 | — | ✅ Fully addressed (US-06 is P0) |
| JTBD-02.1 | P0 | US-03 (arrive/re-open) | US-07, US-08 | ✅ Fully addressed |
| JTBD-02.2 | P1 | US-12 (day/night trust) | US-17, US-18 | ✅ Fully addressed |
| JTBD-02.3 | P1 | US-01, US-04 | — | ✅ Fully addressed (US-01 is P0) |
| JTBD-03.1 | P0 | US-01, US-04, US-09, US-10, US-14 | US-19 | ✅ Fully addressed |
| JTBD-03.2 | P1 | — | US-15, US-16 | ✅ Fully addressed |
| JTBD-03.3 | P1 | — | US-18 | ✅ Fully addressed |

### 5c. Gap Analysis

**Journey stages with no mapped stories:** None — all 5 canonical stages have at least 2 stories mapped.

**JTBD outcomes without a derived NaC:** None — all 8 JTBD entries have at least one NaC in the derivation table (NaC-01 through NaC-16).

**Stories not mapped to any journey stage (orphans):** None — all 22 stories (US-01 through US-22) appear in the Story Map Matrix with a stage, JTBD, and NaC assignment.

**JTBD without at least one R1 story:**
- JTBD-03.2 (Secondary Metrics) — no R1 story; first coverage in R2 (US-15, US-16). **Accepted:** progressive disclosure (F6 collapsed by default) means PER-03 has a working journey in R1 via the 7-day list; secondary metrics are a differentiator, not a blocker.
- JTBD-03.3 (Offline Cache) — no R1 story; first coverage in R2 (US-18). **Accepted:** TanStack Query's default caching provides partial resilience in R1; explicit offline banner is a P1 enhancement.
- JTBD-02.2 (Data Freshness) — partial R1 coverage via US-12 (day/night trust); full freshness indicator lands in R2 (US-17). **Accepted:** skeleton + error states (US-05) prevent blank screens in R1; timestamp is a differentiator.

**Personas not fully served in R1:**
- PER-02: Hourly strip (JTBD-02.1 core deliverable) is a P1 story (F2 = P1 per PRD). James can still use the app in R1 via current conditions + 7-day list, but his primary feature is R2. This is consistent with PRD priority definitions.

---

## 6. NaC-to-Acceptance Criteria Alignment

> Verifies that each NaC is directly supported by the corresponding UserStory acceptance criteria.

| NaC-ID | NaC Statement (abbreviated) | Story | AC Alignment |
|---|---|---|---|
| NaC-01 | Skeleton in ≤ 2s; GPS denial never blank; no prompts before data | US-02, US-13 | US-02 AC: "Denying geolocation resets GPS button with no blank screen"; US-13 AC: "Zero horizontal overflow; all tap targets ≥ 44px; no text < 12px" ✓ |
| NaC-02 | Core data above fold on 375px, ≤ 2s, integer temp | US-05, US-11 | US-05 AC: "Feels-like, condition, high/low, precipitation % all visible above fold at 375px; skeleton not blank"; US-11 AC: "All WMO 0–99 covered; text label always alongside icon" ✓ |
| NaC-03 | HTTPS; attribution; no API key in build | US-22 | US-22 AC: "Footer on every page load; HTTPS Vercel URL; GPS works on HTTPS; build passes tsc strict with no secrets" ✓ |
| NaC-04 | 1-tap toggle; all values update ≤ 500ms; persists | US-06 | US-06 AC: "Toggle visible at all times; updates all temps without network request; preference written to localStorage and restored on reload" ✓ |
| NaC-05 | Recent chip loads weather in 1 tap | US-03 | US-03 AC: "Clicking a chip immediately loads weather; localStorage saved on every selection; move-to-front deduplication" ✓ |
| NaC-06 | 24h row on main screen; precip % on every card; no paywall | US-07, US-08 | US-07 AC: "24 cards on main screen; precipitation % even at 0%"; US-08 AC: "44×44px targets; scroll-snap; day/night per isDay value" ✓ |
| NaC-07 | Freshness label always visible; night icon never sun | US-12, US-17 | US-12 AC: "Sun never after sunset; night variants correct; hero gradient contrast ≥ 4.5:1"; US-17 AC: "'Updated X minutes ago' always visible; updates every 60s without full re-render" ✓ |
| NaC-08 | Autocomplete at 2 chars; skeleton on transition; data ≤ 2s | US-01, US-04 | US-01 AC: "2+ chars triggers geocoding after 300ms debounce; selecting suggestion triggers weather fetch"; US-04 AC: "↑/↓ navigation; Enter to select; Escape to dismiss" ✓ |
| NaC-09 | All 7 days on 375px; no gate; AreaChart both viewports | US-09, US-10 | US-09 AC: "7 rows, 375px no truncation, no See more gate, precip % on every row"; US-10 AC: "Recharts AreaChart high+low on 375px and 1024px; error boundary falls back to data table" ✓ |
| NaC-10 | Desktop two-column; no clipped data at 768/1024/1280 | US-14 | US-14 AC: "Two-column hero at 768–1023px; constrained container at 1024px+; no overflow at 768/1024/1280" ✓ |
| NaC-11 | 1 tap → Details panel; sunrise in location timezone; collapsed default | US-15, US-16 | US-15 AC: "Collapsed on every page load; 1 tap reveals UV+wind+visibility+sunrise/sunset; sunrise via Intl.DateTimeFormat with location timezone"; US-16 AC: "Tab+Enter/Space opens; aria-expanded toggled; animation disabled on reduced-motion" ✓ |
| NaC-12 | Full cached forecast + staleness banner on zero-network | US-18 | US-18 AC: "When offline + cached data exists: persistent 'Showing cached data from X minutes ago' banner; never blank screen; auto-refetch on recovery" ✓ |
| NaC-13 | WMO 0–99 coverage; unknown codes silent fallback; icon+label | US-11 | US-11 AC: "All WMO 0–99 map to valid icon; unknown codes fall back to Clear Sky; every icon has text label; single source getConditionInfo()" ✓ |
| NaC-14 | Every element Tab-reachable; axe-core zero violations | US-04, US-19 | US-04 AC: "Search navigable keyboard-only; Enter selects, Escape closes"; US-19 AC: "All elements Tab+Enter/Space; arrow key strip navigation; visible focus rings; zero axe-core violations" ✓ |
| NaC-15 | aria-live on weather load / error / cached-data; chart table fallback | US-20 | US-20 AC: "aria-live announces load, error, and cached-data events; background refreshes silent; chart has aria-label + hidden data table" ✓ |
| NaC-16 | ≥ 4.5:1 contrast all conditions; prefers-reduced-motion respected | US-21 | US-21 AC: "All hero gradients ≥ 4.5:1 contrast; no condition by colour alone; all animations disabled/instant under prefers-reduced-motion" ✓ |

**NaC alignment result: 16/16 NaC directly supported by existing UserStory acceptance criteria. Zero invented or unsupported NaC.**

---

## 7. Full Story-to-Journey Stage Index

> Quick-reference: every story ID mapped to its SM-ID, stage, and release.

| Story | SM-ID | Epic | Stage | Release |
|---|---|---|---|---|
| US-01 | SM-F0.1 | F0 | Locate | R1 |
| US-02 | SM-F0.2 | F0 | Arrive | R1 |
| US-03 | SM-F0.3 | F0 | Arrive | R1 |
| US-04 | SM-F0.4 | F0 | Locate | R1 |
| US-05 | SM-F1.1 | F1 | Absorb | R1 |
| US-06 | SM-F1.2 | F1 | Absorb | R1 |
| US-07 | SM-F2.1 | F2 | Deepen | R2 |
| US-08 | SM-F2.2 | F2 | Deepen | R2 |
| US-09 | SM-F3.1 | F3 | Deepen | R1 |
| US-10 | SM-F3.2 | F3 | Deepen | R1 |
| US-11 | SM-F4.1 | F4 | Absorb | R1 |
| US-12 | SM-F4.2 | F4 | Absorb | R1 |
| US-13 | SM-F5.1 | F5 | Arrive | R1 |
| US-14 | SM-F5.2 | F5 | Arrive | R1 |
| US-15 | SM-F6.1 | F6 | Deepen | R2 |
| US-16 | SM-F6.2 | F6 | Deepen | R2 |
| US-17 | SM-F7.1 | F7 | Trust | R2 |
| US-18 | SM-F7.2 | F7 | Trust | R2 |
| US-19 | SM-F8.1 | F8 | Arrive/Locate/Absorb/Deepen | R2 |
| US-20 | SM-F8.2 | F8 | Absorb/Trust | R2 |
| US-21 | SM-F8.3 | F8 | Absorb | R2 |
| US-22 | SM-F9.1 | F9 | Arrive | R1 |

**Total: 22 stories mapped · 0 orphans · 13 in R1 · 9 in R2**

---

## Validation Checklist

- [x] Every UserStory (US-01 through US-22) appears in the Story Map Matrix — 22/22 mapped
- [x] Every mapped story has a NaC derived from a specific JTBD outcome — 16 NaC cover all 22 stories
- [x] NaC Derivation Table (Section 3) has full traceability chains (JTBD-ID → Stage → NaC → Story)
- [x] Release planning groups are defined — R1 (13 P0 stories), R2 (9 P1 stories)
- [x] Coverage analysis identifies gaps and orphans — 0 orphans, 3 accepted R1 JTBD gaps documented
- [x] NaC-to-Acceptance Criteria mapping (Section 6) verifies alignment — 16/16 NaC confirmed ✓
- [x] No orphan stories (all 22 stories mapped to at least one journey stage)
- [x] Each release enables at least one complete journey — R1: PER-01 and PER-03 (7-day); R2: all three personas fully served
- [x] No NaC invented without a grounding JTBD outcome
- [x] No new stories generated — only existing US-01 through US-22 are mapped

---

*STORY-MAP v1.0 — generated 2026-05-01*
*Sources: PERSONAS-WeatherApp.md v1.0, JTBD-WeatherApp.md v1.0, JOURNEYS-WeatherApp.md v1.0, UserStories-WeatherApp.md v1.0, PRD-WeatherApp.md v1.0*
*22 stories · 10 epics · 3 personas · 8 JTBD · 16 NaC · 2 releases*
