# Requirements: Simple Weather App

**Defined:** 2026-05-01
**Core Value:** Answer "do I need an umbrella?" in under 3 seconds — current temperature and conditions visible above the fold with zero friction, no account, no ads.

## v1 Requirements

Requirements for initial release. Each maps to a roadmap phase. Feature IDs preserved from PRD.

### Location (P0 — Critical)

- [ ] **F0**: User can search for weather by city name with autocomplete suggestions (after 2+ characters); selecting a result loads weather immediately; recent searches persist in localStorage as quick-select chips; GPS opt-in button requests geolocation; geolocation denial leaves search fully functional with no error or blank screen; reverse geocoding via Nominatim displays a human-readable city name for GPS results

### Current Conditions (P0 — Critical)

- [ ] **F1**: Hero section shows current temperature as an integer (never decimal), feels-like temperature, condition icon + text label with day/night variants, today's high/low, precipitation probability percentage, humidity, and wind speed; °C/°F unit toggle visible on main screen with preference persisted in localStorage; skeleton loading state shown while fetching; clear error message shown on API failure; never a blank screen

### Forecasts (P0 — Critical)

- [ ] **F3**: 7-day daily forecast list showing abbreviated day name, condition icon (daytime), high temp, low temp, and precipitation probability for each day; Recharts AreaChart temperature trend visualization rendered alongside/below the list; precipitation probability never omitted; high/low always displayed high-first

### Hourly Forecast (P1 — High)

- [ ] **F2**: Horizontally scrollable 24-hour forecast row; each card shows hour label, condition icon with day/night variant, temperature, and precipitation probability; minimum 44px touch targets on all card elements; no additional API call (derived from same response as F1/F3)

### Icons & Visual Design (P0 — Critical)

- [ ] **F4**: Full WMO weather interpretation code coverage (0–99): clear, cloudy, foggy, drizzle, rain, freezing rain, snow, shower, thunderstorm variants; day and night icon variants for all clear/partly-cloudy/overcast states; condition-aware background gradient in hero shifts by weather state and time of day; all condition × time-of-day background combinations achieve WCAG 1.4.3 minimum 4.5:1 contrast ratio with overlaid text

### Responsive Layout (P0 — Critical)

- [ ] **F5**: Mobile-first layout from 375px to 1280px+; mobile (375–767px): single-column, no horizontal overflow, all tap targets ≥ 44px; tablet (768–1023px): optional two-column layout; desktop (1024px+): horizontal panels for forecast and details; Tailwind CSS v4 responsive breakpoints manage all transitions; one codebase for all viewports

### Secondary Details (P1 — High)

- [ ] **F6**: Collapsible "Details" panel collapsed by default; expanded panel shows UV index, wind speed and direction (cardinal + degrees), visibility (only if returned by API — silently omitted if absent), humidity (if not in hero), sunrise time, sunset time; all times use the location's local timezone; panel state resets to collapsed on page reload; wind speed unit matches °C/°F toggle (km/h when °C, mph when °F)

### Data Freshness & Offline (P1 — High)

- [ ] **F7**: "Updated X minutes ago" freshness indicator visible at all times when data is loaded; TanStack Query staleTime set to 10 minutes; if offline, last cached data is shown with a visible "showing cached data from X minutes ago" notice; if no cached data and network fails, a friendly connection error message is shown (never a blank screen); "City not found — try a different spelling" message shown when geocoding returns no results

### Accessibility (P1 — High)

- [ ] **F8**: WCAG 2.2 Level AA compliance — all interactive elements (search, GPS button, forecast cards, unit toggle, details panel) keyboard-navigable; `aria-live` regions announce data updates; weather condition never conveyed by color alone (icon + text always paired); 4.5:1 contrast ratio on all text across all condition backgrounds; 44px minimum touch targets; Recharts charts include accessible data table or `aria-label` fallback; all animations respect `prefers-reduced-motion`

### Deployment & Attribution (P0 — Critical)

- [ ] **F9**: Open-Meteo CC BY 4.0 attribution link visible in footer on every page load; deployed to Vercel HTTPS (required for Geolocation API); auto-deploy triggers from GitHub main branch push

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Future Features

- **AQI**: Air quality index display using Open-Meteo AQI endpoint — deferred to preserve v1 focus
- **Multiple saved locations**: localStorage architecture upgrade to support pinned locations
- **Animated weather backgrounds**: CSS keyframe animations for weather states — deferred due to accessibility complexity

## Out of Scope

Explicitly excluded from v1.0. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| User accounts and saved locations | Authentication infrastructure not justified for single-location v1 use case |
| Severe weather alerts and push notifications | Requires persistent backend, NWS feed integration, and legal review of accuracy obligations |
| Historical weather data | Outside core "now/soon" user question |
| Radar maps | MapLibre/Leaflet tile-server complexity not core to "simple weather" |
| Animated weather backgrounds | Non-trivial accessibility compliance; static gradients ship in v1 |
| Direct lat/lon coordinate input | City name search sufficient for all v1 personas |
| Autoplay video, advertising, news/trending content | Anti-features; never build |
| Weather for multiple simultaneous locations | Out of scope for single-active-location v1 architecture |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Phase Name | Status |
|-------------|-------|------------|--------|
| F0 | Phase 1 | Foundation | Pending |
| F1 | Phase 1 | Foundation | Pending |
| F2 | Phase 2 | Forecasts & Visuals | Pending |
| F3 | Phase 2 | Forecasts & Visuals | Pending |
| F4 | Phase 2 | Forecasts & Visuals | Pending |
| F5 | Phase 3 | Layout & Details | Pending |
| F6 | Phase 3 | Layout & Details | Pending |
| F7 | Phase 3 | Layout & Details | Pending |
| F8 | Phase 4 | Accessibility & Deployment | Pending |
| F9 | Phase 4 | Accessibility & Deployment | Pending |

**Coverage:**
- v1 requirements: 10 total
- Mapped to phases: 10
- Unmapped: 0 ✓

**Phase Summary:**
- Phase 1 (Foundation): F0, F1 — location + current conditions core
- Phase 2 (Forecasts & Visuals): F2, F3, F4 — hourly, daily, icons/gradients
- Phase 3 (Layout & Details): F5, F6, F7 — responsive layout, details panel, freshness/offline
- Phase 4 (Accessibility & Deployment): F8, F9 — WCAG AA, Vercel deploy, attribution

---
*Requirements defined: 2026-05-01*
*Last updated: 2026-05-01 after initialization from PRD.md*
