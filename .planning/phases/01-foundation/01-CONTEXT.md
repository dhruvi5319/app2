# Phase 1: Foundation - Context

**Gathered:** 2026-05-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can search for any city and see current weather conditions — temperature, feels-like, condition icon + label, high/low, precipitation probability, humidity, and wind speed — with no blank screens on any failure path. Includes: city autocomplete search (Open-Meteo Geocoding), optional GPS geolocation (Nominatim reverse geocoding), unit toggle (°C/°F persisted to localStorage), recent searches (localStorage), skeleton loading states, error states, and retry.

Phase 1 does NOT include: hourly forecast, 7-day forecast, weather icons beyond a placeholder, background gradients, responsive layout polish, details panel, or accessibility audit. Those are Phases 2–4.

</domain>

<decisions>
## Implementation Decisions

### Search Input Layout
- Full-width search bar pinned to the top of the page — always visible, user can search from anywhere without scrolling
- GPS icon button sits inside the right edge of the search bar (not a separate button outside it)
- Single tap target combines the location input and GPS action in a compact, expected pattern

### Autocomplete Dropdown
- Standard floating dropdown below the search bar (combobox pattern)
- Suggestions appear after 2+ characters are typed
- Dismissed on selection or outside click
- No full-screen modal variant — consistent dropdown on all viewports

### Recent Searches
- Horizontal row of chip pills displayed below the search bar at all times when searches exist
- Show up to 5 recent cities
- Each chip is one-tap to reload weather for that location
- Chips appear even when not searching (persistent navigation shortcut)

### Claude's Discretion
- Hero layout and information density (temp size, feels-like positioning, high/low, precip layout)
- Skeleton shape and animation style
- Error state copy and retry button design
- App shell / provider wiring (QueryClient, unit preference context)
- Exact Tailwind CSS classes, spacing, and typography
- Whether to show a search icon (magnifying glass) on the left side of the input

</decisions>

<specifics>
## Specific Ideas

No specific visual references provided — open to clean, modern implementation that matches the PRD vision: "checking the weather feels like reading a clock — instant, effortless."

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Feature Requirements
- `project_specs/PRD-WeatherApp.md` §F0 — Location Search & Detection capabilities and priority
- `project_specs/PRD-WeatherApp.md` §F1 — Current Conditions Display capabilities and priority
- `project_specs/FRD-WeatherApp.md` §F0 — Full functional spec for search, autocomplete, GPS, reverse geocoding, localStorage schema
- `project_specs/FRD-WeatherApp.md` §F1 — Full functional spec for hero display, unit toggle, skeleton, error states

### Architecture & Data Models
- `project_specs/TechArch-WeatherApp.md` — Component architecture, TypeScript interfaces (WeatherData, CurrentConditions, LocationResult, GeocodingResult, RecentSearch, UnitPreference), API integration patterns, caching strategy, timezone handling
- `.planning/REQUIREMENTS.md` §F0, §F1 — Acceptance criteria for Phase 1 requirements

### Key Constraints (non-negotiable)
- `timezone=auto` on every Open-Meteo API request — documented in TechArch §6 and STATE.md
- Integer-only temperature display (`Math.round()` in transformation layer, never in components) — TechArch §5
- Never a blank screen — skeleton + error states mandatory from Phase 1 — FRD §F1
- Geolocation opt-in only — GPS denial must leave city search fully functional — FRD §F0

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None yet — clean Vite scaffold, everything is net-new for Phase 1

### Established Patterns
- `src/main.tsx`: Bare `createRoot` with no providers — QueryClient and any unit preference context must be wired here in Phase 1
- `src/App.tsx`: Default Vite counter demo — will be fully replaced with app shell
- No existing components, hooks, lib, or utils directories

### Integration Points
- `main.tsx` → wrap with `<QueryClientProvider>` (TanStack Query v5)
- `App.tsx` → app shell with top-bar search + hero section
- New directories to create: `src/components/`, `src/hooks/`, `src/lib/`, `src/types/`, `src/utils/`
- `localStorage` keys to establish: `weather_unit_preference` (°C/°F), `weather_recent_searches` (array of LocationResult)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 1 scope.

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-05-01*
