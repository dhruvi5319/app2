# Jobs-to-be-Done Document
## Simple Weather App

| Field | Value |
|---|---|
| **Product** | Simple Weather App |
| **Version** | 1.0 |
| **Date** | 2026-05-01 |
| **Related Personas** | PERSONAS-WeatherApp.md (PER-01, PER-02, PER-03) |
| **Related PRD** | PRD-WeatherApp.md (v1.0, 2026-04-29) |
| **Status** | Active |
| **Total Jobs** | 8 (PER-01: 2, PER-02: 3, PER-03: 3) |

---

## JTBD Summary Table

| JTBD-ID | Persona | Job Statement (abbreviated) | Priority |
|---|---|---|---|
| JTBD-01.1 | PER-01 Casual Checker | Instant umbrella decision before leaving home | P0 |
| JTBD-01.2 | PER-01 Casual Checker | Switch temperature units without opening settings | P1 |
| JTBD-02.1 | PER-02 Commuter | Identify safe commute window from a single screen | P0 |
| JTBD-02.2 | PER-02 Commuter | Trust that displayed data reflects current conditions | P1 |
| JTBD-02.3 | PER-02 Commuter | Check weather for a travel destination mid-commute | P1 |
| JTBD-03.1 | PER-03 Outdoor Enthusiast | Choose the best weekend day for an outdoor activity | P0 |
| JTBD-03.2 | PER-03 Outdoor Enthusiast | Access secondary metrics to decide on gear and sun protection | P1 |
| JTBD-03.3 | PER-03 Outdoor Enthusiast | Verify trail-start conditions from a low-signal trailhead | P1 |

---

## PER-01: Maya Torres — The Casual Checker

### JTBD-01.1: Instant Umbrella Decision Before Leaving Home

**Job Statement:**
When I am getting ready in the morning and have less than 10 seconds before I need to leave, I want to see the current temperature, feels-like value, and today's rain chance in one glance, so I can decide what to wear without breaking my routine.

**Current Alternatives:**
- Opens Weather.com or AccuWeather on mobile — waits 4–8 seconds through ad scripts before data appears; sometimes leaves without checking
- Glances out the window — no precipitation probability, no feels-like temperature
- Checks a home-screen weather widget — shows temperature only, no rain probability or unit toggle

**Hiring Criteria:**
- Current temperature, feels-like, today's high/low, and precipitation probability all visible above the fold on a 375px screen — zero scroll required
- Weather data on screen within 2 seconds of app open on a mobile 4G connection
- No account prompts, notification permission dialogs, or sponsored content on first load or any subsequent load
- Integer-only temperature values (e.g., "18°C", never "18.47°C") — rounding to nearest degree is non-negotiable for trust

**Success Measure:** User can read current temperature, feels-like, and today's rain probability within 5 seconds of opening the app, on a 375px mobile screen, without scrolling or dismissing any dialog.

**Related Features:** F0, F1, F4, F5, F9
**Priority:** P0

---

### JTBD-01.2: Switch Temperature Units Without Opening Settings

**Job Statement:**
When I am texting with family overseas who use a different temperature scale, I want to toggle between °C and °F directly from the main screen, so I can communicate the temperature accurately without hunting through menus.

**Current Alternatives:**
- Digs into Settings on every app she has tried — often gives up and converts mentally
- Searches "18 celsius to fahrenheit" in a separate browser tab — breaks app context entirely
- Asks family to do the conversion themselves

**Hiring Criteria:**
- °C/°F toggle is visible and reachable with a single tap from the main weather screen — never buried in a settings menu
- Unit preference persists across sessions (stored in `localStorage`) so she does not re-toggle every visit
- All displayed temperatures (current, feels-like, high/low, hourly cards, 7-day rows) update immediately when the unit is toggled

**Success Measure:** User reaches and activates the unit toggle within 1 tap from the main screen, with all temperature values updating in under 500ms, on first and all subsequent visits.

**Related Features:** F1, F5
**Priority:** P1

---

## PER-02: James Okafor — The Daily Commuter

### JTBD-02.1: Identify a Safe Commute Window From a Single Screen

**Job Statement:**
When I am about to leave for work or a client meeting on my bicycle and need to decide whether to leave now or wait 30 minutes, I want to scan the hourly precipitation probability across the next 3 hours without navigating away from the main screen, so I can time my departure around rain windows without interrupting my flow.

**Current Alternatives:**
- Uses apps where hourly data is behind a "Hourly" tab — requires 2–3 taps while walking; often abandons mid-flow
- Subscribes to premium tiers that gate hourly data — has cancelled two subscriptions when paywalls appeared after sign-up
- Uses a generalised "today will be rainy" summary — misses the specific hour-level window he needs
- Checks multiple apps and averages the impression — slow and unreliable

**Hiring Criteria:**
- Horizontally scrollable 24-hour forecast row is a first-class component on the main screen — reachable without any navigation tap
- Precipitation probability percentage shown on every hourly card without exception — never omitted or replaced by an icon alone
- Day/night icon variants correct for the searched location's local timezone (a sun icon at 7pm breaks trust immediately)
- No paywall, account requirement, or subscription prompt on the hourly row — ever
- Full row accessible on Android Chrome with minimum 44px touch targets

**Success Measure:** User can scan precipitation probability for a specific 2-hour commute window within 10 seconds of opening the app, on the main screen, without any navigation tap or subscription prompt.

**Related Features:** F0, F2, F4, F5
**Priority:** P0

---

### JTBD-02.2: Trust That Displayed Data Reflects Current Conditions

**Job Statement:**
When I am about to step outside after checking conditions 20 minutes ago, I want to know exactly how old the data is and be confident it has not silently gone stale, so I can make a rain jacket decision I can rely on rather than second-guess.

**Current Alternatives:**
- Closes and reopens the app hoping it triggers a refresh — sometimes works, often does not
- Checks the timestamp buried deep in app settings — present in some apps, absent in others
- Pulls to refresh with no confirmation that a new data fetch actually completed
- Loses trust in the app entirely after a "clear sky" icon displays during a downpour and switches to a different app

**Hiring Criteria:**
- "Updated X minutes ago" freshness indicator always visible on the main screen when data is loaded — never hidden or conditional
- When the network drops during a commute (WiFi → cellular handoff), cached data remains visible with a clear "showing cached data" notice — never a blank screen
- Data is not re-fetched on every component mount (10-minute stale time) — no flickering or loading spinners mid-commute for data that is still fresh

**Success Measure:** User can confirm data freshness within 3 seconds of opening the app on any network state (online, cached, transitioning), with zero blank screen or spinner-only states across all tested network conditions.

**Related Features:** F7, F1, F5
**Priority:** P1

---

### JTBD-02.3: Check Weather for a Different City Mid-Commute

**Job Statement:**
When I am travelling to a client city and need to know if it is raining there right now, I want to search a new city name and get its current conditions and hourly forecast in under 10 seconds, so I can decide whether to grab an umbrella from my bag before I exit the station.

**Current Alternatives:**
- Types city into Google Search — gets a weather card but lacks hourly detail or unit preference
- Opens a second weather app he trusts less — breaks his established mental model
- Texts a colleague in that city for a real-world check — slow and socially awkward

**Hiring Criteria:**
- City name search with autocomplete suggestions activates after 2+ characters — no need to type a full city name accurately while moving
- Selecting an autocomplete result loads weather data for the new location in under 2 seconds
- Recent searches available as quick-select chips below the search input — enables re-checking a frequently visited client city without retyping
- Geolocation denial (if GPS was used and then revoked) never produces a blank screen — search input remains fully functional

**Success Measure:** User searches a new city, selects an autocomplete suggestion, and sees current conditions + hourly row for that city within 5 seconds on a mobile 4G connection, with zero blank or error screens on the transition.

**Related Features:** F0, F1, F2, F5, F7
**Priority:** P1

---

## PER-03: Priya Nair — The Outdoor Enthusiast

### JTBD-03.1: Choose the Best Weekend Day for an Outdoor Activity

**Job Statement:**
When I am mid-week at my desk planning a weekend trail run and want to pick Saturday or Sunday based on weather, I want to read a full 7-day forecast with temperature highs/lows, precipitation probability, and a visual temperature trend curve, so I can choose the day with the best conditions without switching to a different tool or hitting a paywall.

**Current Alternatives:**
- Uses mainstream apps (AccuWeather) — 7-day forecast is present but buried under sponsored "Weekend Planner" content and premium tier prompts
- Opens `wttr.in` in a terminal — fast and data-rich but requires interpreting ASCII output, lacks visual trend curve, and is awkward on mobile
- Checks two or three apps and triangulates — time-consuming and produces conflicting results
- Mobile apps truncate the forecast to 3 days on small screens — forces a switch to desktop mid-workflow

**Hiring Criteria:**
- Full 7-day daily forecast visible on a 375px mobile screen without truncation, a "See more days" button, or an account/paywall gate
- Recharts `AreaChart` temperature trend visualization rendered and readable on both 375px mobile and 1024px+ desktop viewports
- Precipitation probability shown on every daily row — never omitted
- No sponsored content, promoted tiers, or editorial "weather stories" competing with the forecast data
- Data sourced from the same API response as current conditions — no additional load time for the 7-day view

**Success Measure:** User can read all 7 days of high/low temperatures, precipitation probability, and the temperature trend curve on a 375px mobile screen within 5 seconds of searching their destination, with zero scroll-gating or paywall prompts.

**Related Features:** F0, F3, F4, F5, F9
**Priority:** P0

---

### JTBD-03.2: Access Secondary Metrics to Decide on Gear and Sun Protection

**Job Statement:**
When I am finalising my kit for a 6-hour ridge hike the next morning, I want to see the UV index, wind speed and direction, visibility, and sunrise time for the trailhead location, so I can pack the right sun protection and clothing layers without opening a second app or navigating beyond one tap.

**Current Alternatives:**
- Uses separate apps for UV index (UV Index app), wind (Windy), and sunrise time (Sun Surveyor) — context switching between 3 apps for one decision
- Checks a "Weather for Athletes" premium tier in a mainstream app — costs a monthly subscription for data that should be free
- Opens `wttr.in` in terminal — has the data but requires interpretation; no visual layout; breaks flow on mobile

**Hiring Criteria:**
- UV index, wind speed, wind direction (cardinal + degrees), visibility, humidity, sunrise, and sunset accessible from the main screen via a single expand tap — never behind a paywall or a third-level navigation
- Sunrise and sunset times display in the searched location's local timezone, not the user's browser timezone — a critical accuracy requirement for pre-dawn trail starts
- Details panel collapsed by default — does not clutter the primary view for PER-01 or PER-02
- All secondary metric values readable on both 375px mobile (scouting the trail) and 1024px+ desktop (mid-week planning)

**Success Measure:** User can read UV index, wind direction, and sunrise time for the destination location within 2 taps from the main screen, with sunrise/sunset times verified as correct for the location's local timezone (not the browser's timezone).

**Related Features:** F6, F4, F5, F7
**Priority:** P1

---

### JTBD-03.3: Verify Trail-Start Conditions From a Low-Signal Trailhead

**Job Statement:**
When I am already at the trailhead with weak or no cellular signal and need to make a final go/no-go call on a planned activity, I want the app to show me the most recently cached forecast with a clear indication of how old the data is, so I can make an informed decision even when I cannot fetch fresh data.

**Current Alternatives:**
- Screenshots the forecast at home before leaving — static image, no context on how stale it is by arrival
- Uses a cached page in a different browser tab — no staleness indicator; unclear if data was refreshed at home or 6 hours earlier
- Accepts a blank screen from apps that do not cache — abandons the decision to intuition

**Hiring Criteria:**
- Last successful forecast data (7-day, current conditions, secondary metrics) remains fully visible when the network drops — zero blank screens on offline or low-signal state
- A visible "showing cached data from X minutes ago" notice distinguishes cached state from live data — user always knows the freshness of what they are seeing
- App does not loop in a loading spinner or crash when no network is available — graceful degradation to cached state is the default behaviour
- Cached state covers full 7-day data and secondary metrics, not just current conditions

**Success Measure:** App displays a complete cached forecast (7-day view + current conditions) with a visible staleness notice within 3 seconds of opening on a device with no network connection, with zero blank screens or error-only states across all offline test scenarios.

**Related Features:** F7, F3, F6, F5
**Priority:** P1

---

## Outcome-to-Feature Traceability

| JTBD-ID | Related Features | Expected Outcome |
|---|---|---|
| JTBD-01.1 | F0, F1, F4, F5, F9 | Current temp, feels-like, rain probability above the fold in ≤ 2 seconds; zero dialogs on load |
| JTBD-01.2 | F1, F5 | °C/°F toggle reachable in 1 tap; all temperatures update instantly; preference persists in localStorage |
| JTBD-02.1 | F0, F2, F4, F5 | 24-hour hourly row with per-card precipitation % on main screen; no navigation tap required; no paywall |
| JTBD-02.2 | F7, F1, F5 | "Updated X min ago" always visible; cached data shown with notice on offline; never a blank screen |
| JTBD-02.3 | F0, F1, F2, F5, F7 | City search with autocomplete → new location data in ≤ 2 seconds; recent searches as quick-select chips |
| JTBD-03.1 | F0, F3, F4, F5, F9 | Full 7-day forecast + temperature trend chart on 375px screen; no paywall, no sponsored content |
| JTBD-03.2 | F6, F4, F5, F7 | UV, wind, sunrise/sunset in local timezone via 1 expand tap; collapsed by default; readable mobile + desktop |
| JTBD-03.3 | F7, F3, F6, F5 | Full cached forecast visible with staleness notice on zero-network state; no blank screen or infinite spinner |

**Feature coverage check:**

| Feature | Covered By | Coverage Status |
|---|---|---|
| F0 — Location Search & Detection | JTBD-01.1, JTBD-02.1, JTBD-02.3, JTBD-03.1 | ✓ |
| F1 — Current Conditions Display | JTBD-01.1, JTBD-01.2, JTBD-02.1, JTBD-02.2, JTBD-02.3 | ✓ |
| F2 — Hourly Forecast (24h) | JTBD-02.1, JTBD-02.3 | ✓ |
| F3 — 7-Day Daily Forecast | JTBD-03.1, JTBD-03.3 | ✓ |
| F4 — Weather Icons & Visual Indicators | JTBD-01.1, JTBD-02.1, JTBD-03.1, JTBD-03.2 | ✓ |
| F5 — Responsive Layout | All 8 JTBD entries | ✓ |
| F6 — Secondary Weather Details Panel | JTBD-03.2, JTBD-03.3 | ✓ |
| F7 — Data Freshness & Stale State Handling | JTBD-02.2, JTBD-02.3, JTBD-03.2, JTBD-03.3 | ✓ |
| F8 — Accessibility (WCAG AA) | Cross-cutting — enforced via hiring criteria 44px targets and contrast in JTBD-01.1, JTBD-02.1 | ✓ |
| F9 — Attribution & Deployment | JTBD-01.1, JTBD-03.1 | ✓ |

---

## NaC Preview

Candidate Natural Acceptance Criteria derived from each job's success measure. These will be refined into full acceptance criteria in the STORY-MAP document.

| JTBD-ID | Outcome (from Success Measure) | Candidate NaC |
|---|---|---|
| JTBD-01.1 | Current temp + rain probability visible within 5s, no scroll, no dialogs | **Given** a user opens the app cold on a 375px mobile screen on a 4G connection, **when** the location resolves, **then** current temperature, feels-like, precipitation probability, and today's high/low are all readable above the fold within 5 seconds, and no account prompt or notification dialog has appeared |
| JTBD-01.2 | Unit toggle reachable in 1 tap; all values update in ≤ 500ms | **Given** the main screen is showing current conditions, **when** the user taps the °C/°F toggle once, **then** all displayed temperature values switch units within 500ms and the preference is persisted on the next page reload |
| JTBD-02.1 | Hourly precipitation % scannable in 10s, no nav tap, no paywall | **Given** the main screen is loaded for any city, **when** the user views the page without any additional navigation tap, **then** a horizontally scrollable 24-hour row is visible with a precipitation percentage on every hourly card |
| JTBD-02.2 | Freshness indicator visible in 3s across all network states; never blank | **Given** weather data has been loaded at least once, **when** the user opens the app in any network state (online, offline, or transitioning), **then** a freshness timestamp is visible on the main screen within 3 seconds, and no blank screen or spinner-only state occurs |
| JTBD-02.3 | New city search resolves to full data in ≤ 5s; no blank on transition | **Given** a user types 2+ characters into the location search input, **when** they select an autocomplete suggestion, **then** current conditions and the 24-hour hourly row for the new city are fully displayed within 5 seconds with no blank intermediate state |
| JTBD-03.1 | Full 7-day forecast + trend chart on 375px; no paywall, ≤ 5s | **Given** a user searches any city on a 375px mobile screen, **when** weather data loads, **then** all 7 days of high/low, precipitation probability, and the temperature trend AreaChart are visible without truncation, a "See more" gate, or any paywall prompt |
| JTBD-03.2 | UV, wind, sunrise in local timezone via ≤ 2 taps; collapsed default | **Given** the main screen is showing current conditions for any city, **when** the user expands the Details panel (1 tap), **then** UV index, wind speed, wind direction, visibility, sunrise time, and sunset time are all displayed, with sunrise/sunset times matching the searched location's local timezone (not the browser timezone) |
| JTBD-03.3 | Full cached forecast visible with staleness notice on zero-network | **Given** weather data was previously loaded and the device subsequently loses network connectivity, **when** the user opens or returns to the app, **then** the full 7-day forecast and current conditions are visible from cache with a "showing cached data from X minutes ago" notice, and no blank screen or infinite spinner state occurs |

---

## Validation Checklist

- [x] Every persona (PER-01, PER-02, PER-03) has at least 2 jobs
- [x] Every job uses "When / I want / So I can" format
- [x] All hiring criteria are specific and testable (not vague)
- [x] All success measures are quantifiable (time, tap count, screen size, network state)
- [x] Outcome-to-Feature traceability covers all PRD features F0–F9
- [x] No two jobs are redundant across personas
- [x] NaC Preview table is complete (8 entries, one per JTBD)
- [x] No job statement describes a product feature ("I want a dashboard") — all are outcome-driven
- [x] Jobs are scoped to personas using PER-01 / PER-02 / PER-03 IDs

---

*JTBD v1.0 — generated 2026-05-01*
*Source: PERSONAS-WeatherApp.md v1.0, PRD-WeatherApp.md v1.0, PROJECT.md*
*Next documents: STORY-MAP-WeatherApp.md (NaC refinement), UX-JOURNEYS-WeatherApp.md*
