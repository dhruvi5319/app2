# UX Mockup — Simple Weather App

**Project:** WeatherApp
**Generated:** 2026-05-01
**Based on:** UserStories-WeatherApp.md · PRD-WeatherApp.md · FRD-WeatherApp.md · JOURNEYS-WeatherApp.md · PROJECT.md
**Personas:** Maya (Casual Checker) · James (Commuter) · Priya (Outdoor Enthusiast)

---

## Design Principles

1. **Above the fold — always.** Temperature, condition, feels-like, and precipitation probability must be readable on a 375 px screen without a single scroll. This is the product's singular promise.
2. **No blank screens, ever.** Every loading, error, and offline path renders visible, structured UI. Skeletons preserve layout shape; errors give users an action.
3. **Progressive disclosure.** The casual checker sees three numbers. The outdoor enthusiast can get fourteen metrics with one tap. The Details panel keeps secondary data available but out of the way.
4. **Trust through transparency.** "Updated just now" is not decoration — it is load-bearing trust infrastructure for the commuter and the trail runner.
5. **Mobile-first, not mobile-only.** Tailwind responsive prefixes promote the layout at `md:` and `lg:`; there is no separate codebase or JS viewport detection.
6. **Accessibility is not a layer.** WCAG 2.2 AA — keyboard nav, `aria-live`, contrast, 44 px targets, `prefers-reduced-motion` — is designed in, not bolted on.

---

## Table of Contents

1. [Component Inventory](#component-inventory)
2. [Screen 1 — Initial / Empty State](#screen-1--initial--empty-state)
3. [Screen 2 — Search Autocomplete Dropdown](#screen-2--search-autocomplete-dropdown)
4. [Screen 3 — Main Weather View · Mobile (375 px)](#screen-3--main-weather-view--mobile-375-px)
5. [Screen 4 — Main Weather View · Desktop (1024 px+)](#screen-4--main-weather-view--desktop-1024-px)
6. [Screen 5 — Loading / Skeleton State](#screen-5--loading--skeleton-state)
7. [Screen 6 — Error State (API Failure)](#screen-6--error-state-api-failure)
8. [Screen 7 — Offline State (Cached Data)](#screen-7--offline-state-cached-data)
9. [Screen 8 — Details Panel · Expanded](#screen-8--details-panel--expanded)
10. [Screen 9 — Hourly Forecast Row (Horizontal Scroll)](#screen-9--hourly-forecast-row-horizontal-scroll)
11. [Screen 10 — 7-Day Forecast + Temperature Chart](#screen-10--7-day-forecast--temperature-chart)
12. [User Flows](#user-flows)
13. [Interaction Patterns](#interaction-patterns)
14. [Responsive Considerations](#responsive-considerations)
15. [Accessibility Notes (WCAG 2.2 AA)](#accessibility-notes-wcag-22-aa)

---

## Component Inventory

| Component | Feature | Priority | User Story |
|---|---|---|---|
| SearchBar (input + GPS button) | F0 | P0 | US-01, US-02, US-04 |
| RecentSearchChips | F0 | P0 | US-03 |
| AutocompleteDropdown | F0 | P0 | US-01, US-04 |
| WeatherHero | F1, F4 | P0 | US-05, US-06, US-11, US-12 |
| UnitToggle | F1 | P0 | US-06 |
| FreshnessIndicator | F7 | P1 | US-17 |
| HourlyStrip | F2 | P1 | US-07, US-08 |
| HourlyCard | F2 | P1 | US-07, US-08 |
| DailyForecastList | F3 | P0 | US-09 |
| DailyRow | F3 | P0 | US-09 |
| TemperatureChart (Recharts AreaChart) | F3 | P0 | US-10 |
| DetailsPanel (collapsible) | F6 | P1 | US-15, US-16 |
| SkeletonHero | F1 | P0 | US-05 |
| ErrorState | F1, F7 | P0 | US-05, US-18 |
| OfflineBanner | F7 | P1 | US-18 |
| AriaLiveRegion | F8 | P1 | US-20 |
| AttributionFooter | F9 | P0 | US-22 |

---

## Screen 1 — Initial / Empty State

**Purpose:** First render — no location selected, no weather data. Entry point for all three personas. The search bar is the sole focal point.
**User Stories:** US-01, US-02, US-03, US-04

### Layout — Mobile (375 px)

```
┌─────────────────────────────────────┐  ← 375 px viewport
│                                     │
│      ☁  Simple Weather App          │  ← App wordmark / logo row
│                                     │
│  ┌─────────────────────────┐  [📍]  │  ← Search input + GPS button
│  │  Search for a city...   │        │     min-h: 52px (tap target)
│  └─────────────────────────┘        │
│                                     │
│  ── Recent ──────────────────────── │  ← Section label (hidden when no chips)
│  [ London  ×]  [ Tokyo  ×]          │  ← RecentSearchChips (max 5)
│                                     │     each chip: min 44×44 px
│                                     │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │   ⛅  What's the weather    │    │  ← Hero placeholder / welcome card
│  │      like where you are?   │    │     Condition-neutral, no gradient yet
│  │                             │    │
│  │  Search above or tap 📍     │    │
│  │  to use your location.      │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│─────────────────────────────────────│
│  Weather data by Open-Meteo CC BY4  │  ← Attribution footer (always visible)
│  Geocoding by OpenStreetMap Nominatim│
└─────────────────────────────────────┘
```

### Information Hierarchy

| Priority | Content | Placement | Rationale |
|---|---|---|---|
| Primary | Search input | Top of viewport, full-width | Entry gate for all weather features |
| Primary | GPS button | Right of search input | One-tap alternative for Maya |
| Secondary | Recent search chips | Below input | Instant reload for James's commute cities |
| Tertiary | Welcome card | Centre of page | Orientation; disappears once location is set |
| Utility | Attribution footer | Bottom | Licence obligation; never hides on initial view |

### States

| State | Trigger | Appearance |
|---|---|---|
| No recent searches | First visit / private mode | Chips row entirely hidden; no "Recent" label |
| Has recent searches | localStorage has entries | Chips visible; most-recent first |
| GPS pending | User tapped GPS button | Input disabled; GPS button shows spinner, is `disabled` |
| GPS denied | Permission denied | GPS button resets to idle; no error shown; input usable |
| GPS position unavailable | POSITION_UNAVAILABLE error | Toast: "Location unavailable — try searching manually"; input usable |

### Interactive Elements

| Element | ARIA Role | Keyboard | Min Size |
|---|---|---|---|
| Search input | `role="combobox"` `aria-autocomplete="list"` | Tab to focus, type to search | 52 px h |
| GPS button | `<button>` | Tab, Enter/Space | 44×44 px |
| Recent chip | `<button>` | Tab, Enter/Space | 44×44 px h |
| Attribution links | `<a>` | Tab, Enter | standard link |

---

## Screen 2 — Search Autocomplete Dropdown

**Purpose:** Mid-typing autocomplete — 2+ characters typed, geocoding API responded. Shows up to 5 city suggestions with region/country disambiguators.
**User Stories:** US-01, US-04 | **Journey:** JRN-01.01 Stage 2, JRN-02.02 Stage 2, JRN-03.01 Stage 1

### Layout — Mobile (375 px)

```
┌─────────────────────────────────────┐
│                                     │
│      ☁  Simple Weather App          │
│                                     │
│  ┌─────────────────────────┐  [📍]  │  ← Input shows typed text "Lon"
│  │ Lon█                    │  [×]   │     [×] clear button appears mid-type
│  └─────────────────────────┘        │     inline spinner while API is in-flight
│  ┌─────────────────────────────┐    │
│  │ 🏙 London            GB    │    │  ← Suggestion item 1 (HIGHLIGHTED)
│  │    England                  │    │     aria-selected="true"
│  ├─────────────────────────────┤    │
│  │ 🏙 Londonderry       GB    │    │  ← Suggestion item 2
│  │    Northern Ireland          │    │
│  ├─────────────────────────────┤    │
│  │ 🏙 Longford          IE    │    │  ← Suggestion item 3
│  │    County Longford           │    │
│  ├─────────────────────────────┤    │
│  │ 🏙 Longueuil         CA    │    │  ← Suggestion item 4
│  │    Quebec                    │    │
│  ├─────────────────────────────┤    │
│  │ 🏙 Longview          US    │    │  ← Suggestion item 5
│  │    Texas                     │    │
│  └─────────────────────────────┘    │
│                                     │
│─────────────────────────────────────│
│  Weather data by Open-Meteo CC BY4  │
└─────────────────────────────────────┘
```

### Empty / Error Sub-states

```
── "No results" sub-state ─────────────
│  ┌─────────────────────────┐  [📍]  │
│  │ Xyzqr█                  │  [×]   │
│  └─────────────────────────┘        │
│  ⚠ City not found — try a different │
│    spelling                          │  ← Inline below input, not a modal
│                                     │

── "API error" sub-state ──────────────
│  ┌─────────────────────────┐  [📍]  │
│  │ Lon█                    │  [×]   │
│  └─────────────────────────┘        │
│  ⚠ Search unavailable — check your  │
│    connection                        │  ← Inline below input
```

### Information Hierarchy

| Priority | Content | Placement |
|---|---|---|
| Primary | City name | Left side, large text |
| Secondary | Region (admin1) | Below city name, smaller/muted |
| Tertiary | Country code | Right-aligned, muted |

### Interaction Patterns

- **Debounce:** No API call until 2+ characters have been typed AND 300 ms have elapsed since last keystroke (AC-F0-01, AC-F0-02).
- **Inline spinner:** Appears inside the input right-end while geocoding is in-flight; does not replace the input.
- **Keyboard navigation:**
  - `↓` from input → focus moves to first suggestion item
  - `↑` / `↓` within dropdown → cycles through suggestions
  - `Enter` on highlighted item → selects; dropdown closes; weather fetch triggered
  - `Escape` → closes dropdown; focus returns to input; no selection made
  - `Tab` → closes dropdown (focus leaves combobox); no selection
- **Mouse/touch:** Click or tap on any suggestion row → same behaviour as `Enter`.
- **Selection result:** Input populates with `"London, England, GB"`; clear `[×]` button remains visible to reset.

### Accessibility Notes

- Dropdown is a `<ul role="listbox">` containing `<li role="option">` items.
- Input has `aria-controls="autocomplete-listbox"` `aria-expanded="true"` when dropdown is open.
- Each `<li>` has `aria-selected="true"` for the keyboard-highlighted item, `aria-selected="false"` for others.
- Each suggestion item minimum touch target: 44 px height (AC-F5-02, AC-F8-05).
- Screen reader announcement on open: driven by `aria-live="polite"` region updating to "5 suggestions available".

---

## Screen 3 — Main Weather View · Mobile (375 px)

**Purpose:** The primary product experience — all essential data visible above the fold. Answers "do I need an umbrella?" in under 2 seconds on a 375 px screen without scrolling.
**User Stories:** US-05, US-06, US-07, US-09, US-12, US-13, US-17 | **Journey:** JRN-01.01 Stage 3–4, JRN-02.01 Stage 3–5

### Full-page Layout — Mobile Single-column Stack

```
┌─────────────────────────────────────┐  375 px
│ [← Back / Search field]   [°C] [°F] │  ← Top bar: location back-to-search
│  London, England, GB                │     + Unit toggle (ALWAYS VISIBLE)
│                                     │  ← UnitToggle: min 44×44 px each option
╔═════════════════════════════════════╗
║                                     ║  ← HERO SECTION — condition-aware
║  ⛅                                ║    gradient background
║  Partly Cloudy         [Updated     ║
║                         just now]   ║  ← Freshness indicator (right-aligned,
║  ┌───────────────────────────────┐  ║    small, always visible with data)
║  │         18°C                  │  ║  ← DOMINANT TEMP — text-7xl / ~72px
║  │     Feels like 15°            │  ║  ← Feels-like — text-lg, muted
║  └───────────────────────────────┘  ║
║                                     ║
║  H: 22°  L: 11°    💧 70%  💨 14km/h ║  ← High/Low · Precip · Wind
║                                     ║    All above the fold on 375 px ✓
╚═════════════════════════════════════╝
│                                     │
│  ── Details ▼ ─────────────────── │  ← Collapsed Details panel trigger
│                                     │    min-h: 44 px, full-width tap target
│                                     │
│  ── Next 24 Hours ──────────────── │  ← Hourly section label
│  ┌─────────────────────────────────── (scrolls right →)
│  │[2PM] [3PM] [4PM] [5PM] [6PM] [7PM]│
│  │ ☁    🌧    🌧    ⛅   ☀    ☀  │
│  │ 18°  17°   16°   17°  19°  18° │
│  │ 70%  80%   75%   40%  10%   5% │
│  └─────────────────────────────────── (→ more cards)
│                                     │
│  ── 7-Day Forecast ─────────────── │
│  ┌─────────────────────────────────┐ │
│  │ Today  ⛅  H:22°  L:11°  💧70% │ │  ← DailyRow 1
│  ├─────────────────────────────────┤ │
│  │ Mon    🌧  H:17°  L:9°   💧85% │ │  ← DailyRow 2
│  ├─────────────────────────────────┤ │
│  │ Tue    🌧  H:15°  L:8°   💧90% │ │  ← DailyRow 3
│  ├─────────────────────────────────┤ │
│  │ Wed    ⛅  H:18°  L:10°  💧40% │ │  ← DailyRow 4
│  ├─────────────────────────────────┤ │
│  │ Thu    ☀  H:21°  L:12°  💧15% │ │  ← DailyRow 5
│  ├─────────────────────────────────┤ │
│  │ Fri    ☀  H:23°  L:13°  💧 5% │ │  ← DailyRow 6
│  ├─────────────────────────────────┤ │
│  │ Sat    ⛅  H:20°  L:11°  💧25% │ │  ← DailyRow 7
│  └─────────────────────────────────┘ │
│                                     │
│  ── Temperature Trend ─────────── │
│  ┌─────────────────────────────────┐ │
│  │   High — — — — ·               │ │  ← Recharts AreaChart
│  │ 23°                   ·   ·    │ │    role="img" aria-label="..."
│  │     ·   ·   ·   ·         ·   │ │    Two area series: high + low
│  │ 15°                             │ │    X-axis: day abbreviations
│  │         Low _ _ _ _             │ │    Y-axis: °C or °F
│  │  Tod Mon Tue Wed Thu Fri Sat   │ │
│  └─────────────────────────────────┘ │
│                                     │
│─────────────────────────────────────│
│  Weather data by Open-Meteo · CC BY4│  ← Footer always at bottom of page
│  Geocoding by OpenStreetMap Nominatim│
└─────────────────────────────────────┘
```

### Above-the-Fold Guarantee (375 px · ~667 px viewport)

The hero section must fit above the fold. Budget (approximate):

| Element | Height |
|---|---|
| Top bar (search field + unit toggle) | ~52 px |
| Hero gradient section | ~200 px |
| — Condition icon + label | ~40 px |
| — Temperature (72 px text) | ~88 px |
| — Feels-like | ~24 px |
| — H/L · Precip · Wind row | ~32 px |
| — Internal padding | ~16 px |
| **Total to fold** | **~252 px** |

Remaining viewport (~415 px) holds the Details trigger + start of hourly strip — both visible without scrolling on a standard iPhone SE/14 (667–844 px viewport height).

### Information Hierarchy

| Priority | Element | Behaviour |
|---|---|---|
| P1 (dominant) | Current temperature | text-7xl, white on gradient, integer only |
| P1 | Condition icon + label | Icon 64 px, label adjacent text-lg |
| P2 | Feels-like | text-lg, muted white (0.8 opacity) |
| P2 | High / Low pair | Inline, compact, H before L |
| P2 | Precipitation probability | 💧 or raindrop icon + percentage |
| P2 | Wind speed | Wind icon + value + unit (km/h or mph) |
| P3 | Freshness indicator | text-xs right-aligned, updates every 60 s |
| P3 | Unit toggle | Always visible in top bar; not buried |
| P4 | Details panel trigger | Full-width, single-tap reveals secondary data |

### States

| State | Appearance |
|---|---|
| Default (data loaded) | Gradient hero, live data, freshness indicator |
| Loading | Skeleton (Screen 5) |
| Error | Error card (Screen 6) |
| Offline + cached | Offline banner (Screen 7) + data |
| Offline + no cache | Full-page error with retry |

---

## Screen 4 — Main Weather View · Desktop (1024 px+)

**Purpose:** Expanded layout for Priya's desktop trip-planning session — two-column grid puts current conditions + hourly on the left and 7-day + chart on the right. All data visible without horizontal overflow. Container max-width: `max-w-4xl` (896 px) centred.
**User Stories:** US-05, US-07, US-09, US-10, US-14, US-15 | **Journey:** JRN-03.01

### Layout — Desktop Two-panel Grid

```
┌──────────────────────────────────────────────────────────────────┐  1024 px+
│  [🔍 London, England, GB          ] [📍]     [°C] [°F]          │  ← Top bar
│                                                                   │    search always accessible
├──────────────────────────────────────────────────────────────────┤
│                    max-w-4xl  (centred, mx-auto)                  │
│  ┌─────────────────────────────┐ ┌──────────────────────────────┐ │
│  │  LEFT PANEL                 │ │  RIGHT PANEL                 │ │
│  │                             │ │                              │ │
│  │  ╔═══════════════════════╗  │ │  ── 7-Day Forecast ────────  │ │
│  │  ║  ⛅  Partly Cloudy    ║  │ │  Today  ⛅ H:22° L:11° 70%  │ │
│  │  ║                       ║  │ │  Mon    🌧 H:17° L:9°  85%  │ │
│  │  ║       18°C            ║  │ │  Tue    🌧 H:15° L:8°  90%  │ │
│  │  ║   Feels like 15°      ║  │ │  Wed    ⛅ H:18° L:10° 40%  │ │
│  │  ║                       ║  │ │  Thu    ☀ H:21° L:12° 15%  │ │
│  │  ║  H:22° L:11° 💧70%   ║  │ │  Fri    ☀ H:23° L:13°  5%  │ │
│  │  ║  💨 14 km/h           ║  │ │  Sat    ⛅ H:20° L:11° 25%  │ │
│  │  ║  Updated just now     ║  │ │                              │ │
│  │  ╚═══════════════════════╝  │ │  ── Temperature Trend ─────  │ │
│  │                             │ │  ┌──────────────────────┐    │ │
│  │  ── Details ▼ ──────────── │ │  │  High ——·    ·——      │    │ │
│  │                             │ │  │       ·  ·  ·  ·  ·  │    │ │
│  │  ── Next 24 Hours ───────── │ │  │  Low __ _ _ _ _       │    │ │
│  │  ┌─────────────────────── (→)│ │  │ Tod Mon Tue Wed Thu  │    │ │
│  │  │[2PM][3PM][4PM][5PM][6PM]  │ │  └──────────────────────┘    │ │
│  │  │ ☁   🌧   🌧   ⛅  ☀    │ │  │                              │ │
│  │  │ 18° 17°  16°  17° 19°   │ │  └──────────────────────────────┘ │
│  │  │ 70% 80%  75%  40% 10%   │ │                              │ │
│  │  └─────────────────────────  │ │                              │ │
│  └─────────────────────────────┘ └──────────────────────────────┘ │
│                                                                   │
├──────────────────────────────────────────────────────────────────┤
│    Weather data by Open-Meteo · CC BY 4.0                         │  ← Footer
│    Geocoding by OpenStreetMap Nominatim                           │
└──────────────────────────────────────────────────────────────────┘
```

### Tablet Layout (768 px – 1023 px)

At `md:` breakpoint the hero section switches to a two-column row within a single-column page:

```
┌──────────────────────────────────────────────┐  768 px – 1023 px
│  [🔍 London, England  ]  [📍]   [°C] [°F]   │
├──────────────────────────────────────────────┤
│  ╔═══════════════════════════════════════╗   │
│  ║  LEFT (temp + condition)  │ RIGHT     ║   │
│  ║  ⛅ Partly Cloudy         │ H: 22°    ║   │
│  ║                           │ L: 11°    ║   │
│  ║       18°C                │ 💧 70%    ║   │
│  ║   Feels like 15°          │ 💨 14km/h ║   │
│  ╚═══════════════════════════════════════╝   │
│                                              │
│  ── Details ▼ ────────────────────────────  │
│                                              │
│  ── 24-Hour Strip ─────────────────────── → │
│  [2PM][3PM][4PM][5PM][6PM][7PM][8PM]...      │
│                                              │
│  ── 7-Day Forecast ──────────────────────── │
│  [Full-width rows as mobile]                 │
│                                              │
│  ── Temperature Trend ──────────────────── │
│  [Full-width chart]                          │
└──────────────────────────────────────────────┘
```

### Information Hierarchy — Desktop

| Priority | Panel | Content |
|---|---|---|
| P1 | Left | Hero: condition, temperature, feels-like |
| P2 | Left | Hero: H/L, precipitation, wind, freshness |
| P2 | Left (below hero) | Details trigger + hourly strip |
| P1 | Right | 7-day forecast list |
| P2 | Right | Temperature trend chart |

---

## Screen 5 — Loading / Skeleton State

**Purpose:** Rendered immediately when a location is selected and the weather API call is in-flight. Preserves layout shape to prevent layout shift when data arrives. Never shows a blank screen or spinner-only state.
**User Stories:** US-05 (AC-F1-06) | **Journey:** JRN-01.01 Stage 1, JRN-02.02 Stage 3, JRN-03.02 Stage 1

### Skeleton Layout — Mobile (375 px)

```
┌─────────────────────────────────────┐
│ [🔍 London, England, GB   ]  [°C][°F]│
╔═════════════════════════════════════╗
║  ▓▓▓▓▓▓▓▓▓▓▓             ▓▓▓▓▓▓▓  ║  ← Skeleton: condition label + freshness
║                                     ║
║  ┌─────────────────────────────┐   ║
║  │         ▓▓▓▓▓              │   ║  ← Skeleton: large temperature block
║  │       ▓▓▓▓▓▓▓▓▓▓           │   ║    ~88 px tall grey rectangle, pulsing
║  │     ▓▓▓▓▓▓▓▓▓              │   ║    (reduced to static under
║  └─────────────────────────────┘   ║    prefers-reduced-motion)
║                                     ║
║  ▓▓▓▓▓   ▓▓▓▓▓   ▓▓▓   ▓▓▓▓▓▓▓   ║  ← Skeleton: H/L · precip · wind row
╚═════════════════════════════════════╝
│  ── Details ▼ ─────────────────── │  ← Unit toggle still visible and operable
│                                     │
│  ── Next 24 Hours ──────────────── │
│  ┌──────────────────────────────── →
│  │[▓▓▓][▓▓▓][▓▓▓][▓▓▓][▓▓▓]       │  ← Skeleton hourly cards
│  │ ▓▓   ▓▓   ▓▓   ▓▓   ▓▓         │
│  │ ▓▓▓  ▓▓▓  ▓▓▓  ▓▓▓  ▓▓▓       │
│  │ ▓▓   ▓▓   ▓▓   ▓▓   ▓▓         │
│  └──────────────────────────────── →
│                                     │
│  ── 7-Day Forecast ─────────────── │
│  ▓▓▓▓▓  ▓▓  ▓▓▓▓  ▓▓▓▓  ▓▓▓▓▓   │  ← 7 skeleton daily rows
│  ▓▓▓▓▓  ▓▓  ▓▓▓▓  ▓▓▓▓  ▓▓▓▓▓   │
│  ▓▓▓▓▓  ▓▓  ▓▓▓▓  ▓▓▓▓  ▓▓▓▓▓   │
│  ▓▓▓▓▓  ▓▓  ▓▓▓▓  ▓▓▓▓  ▓▓▓▓▓   │
│  ▓▓▓▓▓  ▓▓  ▓▓▓▓  ▓▓▓▓  ▓▓▓▓▓   │
│  ▓▓▓▓▓  ▓▓  ▓▓▓▓  ▓▓▓▓  ▓▓▓▓▓   │
│  ▓▓▓▓▓  ▓▓  ▓▓▓▓  ▓▓▓▓  ▓▓▓▓▓   │
│                                     │
│  ── Temperature Trend ─────────── │
│  ┌─────────────────────────────────┐ │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │ │  ← Skeleton chart area (rectangle)
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Skeleton Design Rules

- **Shape preservation:** Each skeleton block matches the exact dimensions of the real content it will replace. No reflow when data arrives.
- **Pulse animation:** `animate-pulse` (Tailwind) creates a subtle breathing effect on skeleton blocks using opacity.
- **`prefers-reduced-motion`:** Pulse animation is removed; blocks are static grey (`bg-gray-300` or `bg-white/20` on gradient).
- **Unit toggle:** Remains visible and fully interactive during skeleton state (AC-F1-03). Toggling while skeleton is displayed updates the preference; it applies when data loads.
- **Details trigger:** Visible but not interactive during skeleton (data not yet available to expand). `aria-disabled="true"`.
- **Aria:** Skeleton container has `aria-busy="true"` `aria-label="Loading weather data for [location]"`. The `aria-live` region announces "Loading weather data for London, England, GB."

### Transition to Live Data

Skeleton is replaced in a single React render pass — no flash of intermediate state. If data arrives in < 200 ms, skeleton may not be visible at all (acceptable).

---

## Screen 6 — Error State (API Failure)

**Purpose:** Weather fetch fails (`isError === true` from TanStack Query, after 2 automatic retries). Gives the user a clear message and a "Try again" action. Never a blank screen.
**User Stories:** US-05 (AC-F1-07), US-18 (AC-F7-05) | **Journey:** JRN-02.02 Stage 1 (network drop)

### Layout — Mobile (375 px)

```
┌─────────────────────────────────────┐
│ [🔍 London, England, GB   ]  [°C][°F]│  ← Search remains accessible
╔═════════════════════════════════════╗
║                                     ║
║        ⚠️                           ║  ← Error icon (not colour-alone;
║                                     ║    icon + text always together)
║  Unable to load weather for         ║
║  London, England, GB.               ║  ← Specific location name in message
║  Check your connection.             ║
║                                     ║
║  ┌─────────────────────────────┐   ║
║  │       Try again             │   ║  ← Primary CTA, min 44×44 px
║  └─────────────────────────────┘   ║    triggers TanStack Query refetch()
║                                     ║
╚═════════════════════════════════════╝
│                                     │
│  ── Details ▼ ─────────────────── │  ← Trigger visible but disabled
│                                     │
│  [No hourly strip — hidden]         │
│  [No 7-day list — hidden]           │
│  [No chart — hidden]                │
│                                     │
│─────────────────────────────────────│
│  Weather data by Open-Meteo CC BY4  │
└─────────────────────────────────────┘
```

### Error State Rules

| Rule | Detail |
|---|---|
| Never blank screen | Error card fills the hero section — same visual weight as the hero |
| Location-specific message | Always includes the attempted location name |
| Retry is always available | "Try again" button calls `refetch()` — no page reload needed |
| Search remains usable | User can type a new city without needing to retry |
| Unit toggle visible | Remains in top bar; operable even in error state (AC-F1-03) |
| No hourly / daily shown | Gracefully hidden when no `WeatherData` exists |
| Aria | `aria-live` region announces: "Unable to load weather for London, England, GB. Check your connection." |

### Geocoding "No Results" Error (Search Context)

This is distinct from the weather API error — it occurs in the search input, not the hero:

```
│  ┌─────────────────────────┐  [📍]  │
│  │ Xyzqr                   │  [×]   │
│  └─────────────────────────┘        │
│  ⚠ City not found — try a different │
│    spelling                          │  ← Inline, below input, not a modal
```

---

## Screen 7 — Offline State (Cached Data)

**Purpose:** User is offline (or network has failed) but TanStack Query's cache holds a previous fetch. Displays cached weather data with a persistent, prominent banner communicating the staleness. All sections are fully populated from cache.
**User Stories:** US-17, US-18 | **Journey:** JRN-03.02 (Priya at the trailhead)

### Layout — Mobile (375 px)

```
┌─────────────────────────────────────┐
│ [🔍 Brecon, Powys, Wales  ]  [°C][°F]│
│                                     │
│  ┌─────────────────────────────────┐ │
│  │ 📶 Showing cached data from     │ │  ← OFFLINE BANNER — persistent,
│  │    25 minutes ago —             │ │    prominent, amber/warning colour
│  │    check your connection        │ │    always above hero content
│  └─────────────────────────────────┘ │
│                                     │
╔═════════════════════════════════════╗
║                                     ║  ← Hero gradient (from cached data)
║  ⛅  Partly Cloudy    [Cached: 25m] ║  ← Freshness shows "25 minutes ago"
║                                     ║    NOT "Updated just now"
║         16°C                        ║
║     Feels like 13°                  ║
║                                     ║
║  H:16°  L:10°    💧20%  💨 18km/h   ║
╚═════════════════════════════════════╝
│                                     │
│  ── Details ▼ ─────────────────── │  ← Opens from cache — no API call
│                                     │
│  ── Next 24 Hours ──────────────── │  ← Full 24-hour row from cache
│  ┌──────────────────────────────── →
│  │ [6AM][7AM][8AM][9AM][10AM]...   │  ← All 24 cards present
│  │  ⛅   ⛅   ⛅   ⛅   ⛅         │    (local time labels from cache)
│  │  9°   11°  13°  14°  15°        │
│  │  10%  15%  15%  20%  20%        │
│  └────────────────────────────────→ │
│                                     │
│  ── 7-Day Forecast ─────────────── │  ← Full 7-day from cache
│  │ Today  ⛅  H:16°  L:10°  💧20% │
│  │ Sun    🌧  H:14°  L:8°   💧70% │
│  ...                                │
└─────────────────────────────────────┘
```

### Offline Banner Design

```
┌─────────────────────────────────────────┐
│ ⚡ Showing cached data from             │  ← Amber/warning background
│   25 minutes ago — check your           │    #fef3c7 bg / #92400e text
│   connection              [Retry]       │    (meets 4.5:1 contrast)
└─────────────────────────────────────────┘
```

- Banner stays **persistently visible** while offline — not dismissible.
- Banner disappears automatically when network recovers and fresh data is fetched.
- `[Retry]` button triggers a manual `refetch()` attempt.
- `aria-live="assertive"` region announces the cached state on first display.

### Offline — No Cached Data Sub-state

```
╔═════════════════════════════════════╗
║                                     ║
║     📶                              ║
║                                     ║
║  Unable to load weather —           ║
║  check your connection.             ║
║                                     ║
║  ┌─────────────────────────────┐   ║
║  │          Retry              │   ║  ← min 44×44 px
║  └─────────────────────────────┘   ║
║                                     ║
╚═════════════════════════════════════╝
```

- This state is reached only when there is no TanStack Query cache at all (first-ever visit, or cache was garbage-collected after 30 min `gcTime`).
- Search input remains functional — user can type a city and the geocoding call may succeed if DNS is cached locally.

---

## Screen 8 — Details Panel · Expanded

**Purpose:** Progressive disclosure of secondary metrics for Priya (Outdoor Enthusiast). Collapsed by default. One tap reveals UV index, wind direction, visibility (if available), humidity, sunrise, and sunset — all in local timezone.
**User Stories:** US-15, US-16 | **Journey:** JRN-03.01 Stage 4–5, JRN-03.02 Stage 4

### Layout — Collapsed (default)

```
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  Details                      ▾ │ │  ← Trigger row, full-width, min 44 px h
│  └─────────────────────────────────┘ │    aria-expanded="false"
│                                     │
```

### Layout — Expanded

```
│  ┌─────────────────────────────────┐ │
│  │  Details                      ▲ │ │  ← Trigger with chevron rotated 180°
│  ├─────────────────────────────────┤ │    aria-expanded="true"
│  │                                 │ │
│  │  🌞  UV Index                   │ │
│  │      5.2 — Moderate             │ │  ← UV value + qualitative label
│  │      ████░░░░░░  (progress bar) │ │    Colour-coded bar (not sole indicator)
│  │                                 │ │    Label always present: AC-F8-03
│  ├─────────────────────────────────┤ │
│  │  🧭  Wind Direction             │ │
│  │      NW (315°)                  │ │  ← Cardinal + degrees: AC-F6-04
│  ├─────────────────────────────────┤ │
│  │  💧  Humidity                   │ │
│  │      74%                        │ │
│  ├─────────────────────────────────┤ │
│  │  🌅  Sunrise                    │ │
│  │      6:12 AM (BST)              │ │  ← Local timezone via Intl.DateTimeFormat
│  ├─────────────────────────────────┤ │
│  │  🌇  Sunset                     │ │
│  │      8:47 PM (BST)              │ │  ← Location timezone, NOT device TZ
│  └─────────────────────────────────┘ │
│                                     │
```

### UV Index Qualitative Labels and Progress Bar

```
UV 0–2  : Low        [■■░░░░░░░░░░]  green    (#22c55e)
UV 3–5  : Moderate   [■■■■░░░░░░░░]  yellow   (#eab308)
UV 6–7  : High       [■■■■■■░░░░░░]  orange   (#f97316)
UV 8–10 : Very High  [■■■■■■■■░░░░]  red      (#ef4444)
UV 11+  : Extreme    [■■■■■■■■■■■■]  purple   (#a855f7)
```

Note: The label text ("Moderate") is always shown alongside the colour bar. Colour is never the sole indicator (WCAG 1.4.1, AC-F8-03). The UV row is silently omitted if `uvIndexMax` is `null` after transformation (AC from US-16).

### Expand / Collapse Interaction

- **Trigger:** Full-width `<button>` row with chevron SVG.
- **Animation:** Height animates from `0` to auto using CSS transition on `max-height` (or `grid-template-rows` trick). Duration: 200 ms ease-out.
- **`prefers-reduced-motion`:** Animation reduced to instant (no transition). Panel state still toggles; only motion is removed.
- **ARIA:** `aria-expanded="true"` / `"false"` on trigger button. Panel has `id="details-panel"` and trigger has `aria-controls="details-panel"`.
- **Keyboard:** Tab → focus trigger, Enter/Space → toggle. Tab while expanded → focus moves into panel content.
- **State persistence:** NOT persisted to `localStorage`. Every page reload returns panel to collapsed state (AC-F6-06).

### Desktop Panel Layout (1024 px+)

On desktop the Details panel spans full container width below the two-column hero section, making it equally accessible to Priya on her MacBook:

```
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Details                                                  ▲ │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │  🌞 UV: 5.2 Moderate   🧭 NW (315°)   💧 74%              │ │
│  │  🌅 Sunrise: 6:12 AM   🌇 Sunset: 8:47 PM                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
```

On desktop the metrics display in a horizontal grid (2–3 columns) rather than stacked rows, reducing vertical space usage.

---

## Screen 9 — Hourly Forecast Row (Horizontal Scroll)

**Purpose:** A horizontally scrollable strip of 24 hourly forecast cards. First-class component on the main screen — not behind a tab or paywall. Primary feature for James (Commuter). Precipitation probability appears on every card, even at 0%.
**User Stories:** US-07, US-08 | **Journey:** JRN-02.01 Stages 3–4

### Full Strip Layout

```
── Next 24 Hours ─────────────────────────────────────────────────────────────
← scroll                                                              scroll →
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬──────┐
│ 2PM │ 3PM │ 4PM │ 5PM │ 6PM │ 7PM │ 8PM │ 9PM │10PM │11PM │12AM │ 1AM  │ →
│  ⛅  │  🌧  │  🌧  │  ⛅  │  ☀  │  ☀  │  🌙  │  🌙  │  🌙  │  🌙  │  🌙  │  🌙  │
│ 18° │ 17° │ 16° │ 17° │ 19° │ 18° │ 16° │ 15° │ 14° │ 13° │ 12° │ 12°  │
│ 70% │ 80% │ 75% │ 40% │ 10% │  5% │  5% │  0% │  0% │  0% │  0% │  0%  │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴──────┘
                    ← 24 cards total (3PM to next day 1PM — or current hour onward)
```

### Single Card Anatomy

```
┌──────────┐  ← min-w: 72px (card); min touch target: 44×44px
│   2 PM   │  ← Hour label — location timezone via Intl.DateTimeFormat
│          │     (NOT device timezone) AC-F2-03
│    ⛅    │  ← Condition icon 32×32px, day/night variant per HourlyForecast.isDay
│          │
│   18°    │  ← Temperature — integer, active unit suffix
│          │
│   70%    │  ← Precipitation probability — always shown, even when 0%
└──────────┘    AC-F2-07
```

### Scroll Behaviour

| Interaction | Behaviour |
|---|---|
| Touch swipe (left/right) | Native momentum scroll within container |
| Mouse wheel (horizontal) | Scrolls the strip if pointer is inside it |
| Mouse drag | Supported (via CSS `cursor: grab` on the container) |
| Keyboard Tab | Focuses the strip container |
| Arrow keys (←/→) after Tab focus | Scrolls strip left/right (AC-F8-01) |
| Scroll-snap | `scroll-snap-type: x mandatory` on container; each card has `scroll-snap-align: start` — swipe always lands on clean card boundary (AC from US-08) |

### Current Hour Highlight

The first card (current hour) has a subtle visual distinction:

```
┌──────────┐
│   NOW    │  ← "Now" label instead of clock time (or current hour with accent)
│ ▐▌ border│  ← Left accent border (2px solid) or lighter bg tint
│    ⛅    │
│   18°    │
│   70%    │
└──────────┘
```

### Body Overflow Prevention

The hourly strip container has:
- `overflow-x: auto` (intentional horizontal scroll on the strip itself)
- `max-width: 100%` + `flex-shrink: 0` on cards
- Parent page has `overflow-x: hidden` NOT set on `<body>` — overflow is contained to the strip's own scroll container (AC-F5-04)

---

## Screen 10 — 7-Day Forecast + Temperature Chart

**Purpose:** Full-week planning view for Priya. All 7 days visible on mobile without truncation. Temperature trend chart visualises warming/cooling patterns at a glance. Sourced from the same `WeatherData` fetch — no extra API call.
**User Stories:** US-09, US-10 | **Journey:** JRN-03.01 Stages 2–3

### 7-Day List Layout

```
── 7-Day Forecast ──────────────────────────────────
┌─────────────────────────────────────────────────┐
│  Today  │  ⛅  │  H: 22°  L: 11°  │  💧 70%   │  ← Row 1: "Today" label
├─────────────────────────────────────────────────┤
│  Mon    │  🌧  │  H: 17°  L: 9°   │  💧 85%   │  ← Row 2–7: 3-letter abbrev.
├─────────────────────────────────────────────────┤      via Intl.DateTimeFormat
│  Tue    │  🌧  │  H: 15°  L: 8°   │  💧 90%   │      with location timezone
├─────────────────────────────────────────────────┤
│  Wed    │  ⛅  │  H: 18°  L: 10°  │  💧 40%   │
├─────────────────────────────────────────────────┤
│  Thu    │  ☀  │  H: 21°  L: 12°  │  💧 15%   │
├─────────────────────────────────────────────────┤
│  Fri    │  ☀  │  H: 23°  L: 13°  │  💧  5%   │
├─────────────────────────────────────────────────┤
│  Sat    │  ⛅  │  H: 20°  L: 11°  │  💧 25%   │
└─────────────────────────────────────────────────┘
  Day     │ Icon │  H (dominant) L  │  Precip %
          ↑                ↑
      32×32px         H always before L (AC-F3-04)
      always daytime  Low visually de-emphasised
      variant         (smaller, lighter colour)
      (AC-F4-04)
```

### Daily Row Anatomy

```
[ Day label ]  [ Icon ]  [ H: 22° ]  [ L: 11° ]  [ 💧 70% ]
   64 px w     32×32px   dominant    muted text   right-aligned
   min 44px h                        smaller size
```

- **High always first**, left-to-right on desktop; top-to-bottom on narrow mobile.
- **Low de-emphasised** via `text-sm` and `text-gray-500` / `text-white/70` on dark gradient.
- **Precipitation always shown**, including 0% (AC-F3-05).
- **Icons:** Always daytime variant for daily rows (AC-F4-04). `alt=""` + `aria-hidden="true"` on icon img. Adjacent `<span>` with condition label is rendered (small, visually subtle on list rows).

### Temperature Trend Chart Layout

```
── Temperature Trend ───────────────────────────────
┌────────────────────────────────────────────────────┐
│  °C                                                │  ← Y-axis: auto-scaled
│                                                    │    Updates on °C/°F toggle
│ 24° ·                              ·               │
│      ╲               High          ╲               │
│ 20°   ╲             ——————         ╱               │
│         ╲         ╱          ╲   ╱                 │
│ 16°      ·       ·            · ·                  │
│            ╲   ╱                                   │
│ 12°          · ·    Low                            │
│              _ _ _ _ _ _ _ _ _ _ _ _               │
│  8°                                                │
│      Tod   Mon   Tue   Wed   Thu   Fri   Sat       │  ← X-axis
└────────────────────────────────────────────────────┘
  Shaded area between High and Low curves
  High series: solid line, warmer colour
  Low series:  dashed line, cooler colour
  Shaded fill: semi-transparent area between curves
```

### Chart Implementation Notes

- **Library:** Recharts `AreaChart` with two `<Area>` series (`high` and `low`).
- **X-axis:** `<XAxis dataKey="dayLabel" />` using abbreviated day names (location timezone).
- **Y-axis:** Auto-scaled; tick labels in active unit (°C or °F); updates immediately on unit toggle without re-fetch.
- **Error boundary:** If Recharts throws during render, a React error boundary catches the error and renders the `<table className="sr-only">` fallback as a visible `<table>` in the main document instead (AC-F3-08).
- **Accessibility wrapper:**
  ```
  <div role="img" aria-label="Temperature trend chart for Brecon:
    Today high 16°C low 10°C; Mon high 14°C low 8°C; ...">
    <AreaChart ... />
  </div>
  <table className="sr-only">  ← always in DOM for screen readers
    ...7-day data rows...
  </table>
  ```
- **Responsiveness:** Chart uses `<ResponsiveContainer width="100%" height={180}>` so it fills its parent column at every breakpoint without clipping.

---

## User Flows

### Flow 1 — First-Time City Search (JRN-01.01)

**Trigger:** User opens the app for the first time with no location set.
**Primary Persona:** Maya (Casual Checker)
**User Stories:** US-01, US-02, US-03, US-05

```
[App opens — Screen 1: Initial State]
    │
    ├── User taps search input
    │       │
    │       ├── Types < 2 chars → [No API call; no dropdown]
    │       │
    │       └── Types 2+ chars → [300ms debounce] → Geocoding API call
    │               │
    │               ├── Results arrive → [Screen 2: Autocomplete Dropdown]
    │               │       │
    │               │       ├── User clicks/taps suggestion
    │               │       │       → LocationResult set
    │               │       │       → Weather API call triggered
    │               │       │       → [Screen 5: Skeleton]
    │               │       │               │
    │               │       │               ├── Success → [Screen 3: Main View]
    │               │       │               │       → RecentSearch written to localStorage
    │               │       │               │       → aria-live: "Weather loaded for..."
    │               │       │               │
    │               │       │               └── Error → [Screen 6: Error State]
    │               │       │                       → aria-live: "Unable to load..."
    │               │       │
    │               │       └── User presses Escape → [Dropdown closes; input retains text]
    │               │
    │               └── No results → [Inline: "City not found — try a different spelling"]
    │
    └── User taps GPS button [📍]
            │
            ├── Browser permission prompt shown (native OS dialog)
            │       │
            │       ├── Granted → GPS spinner shows → Nominatim reverse geocode
            │       │       → Open-Meteo Geocoding API (get canonical timezone)
            │       │       → LocationResult set
            │       │       → [Screen 5: Skeleton] → [Screen 3: Main View]
            │       │
            │       └── Denied → GPS button resets to idle; no error; input usable
            │
            └── Position unavailable / timeout → Toast notification; input usable
```

---

### Flow 2 — Unit Toggle (JRN-01.02)

**Trigger:** User wants to convert temperature unit while data is displayed.
**Primary Persona:** Maya (Casual Checker)
**User Story:** US-06

```
[Screen 3: Main View — data loaded, showing °C]
    │
    User taps [°F] in unit toggle
    │
    ├── localStorage.setItem("weather_unit_preference", "fahrenheit")
    │
    └── Single React re-render — all temperature values convert
            (hero, feels-like, H/L, hourly cards, daily rows, chart Y-axis)
            No network request made
            ≤ 500ms update (AC-F1-04)
            │
            └── [Screen 3: Main View — same data, now showing °F]
                    Unit toggle reflects active state: [°C] [●°F]
```

---

### Flow 3 — Commuter Hourly Scan (JRN-02.01)

**Trigger:** James opens app; last location auto-loads from recent search chip.
**Primary Persona:** James (Commuter)
**User Stories:** US-03, US-07, US-08, US-17

```
[App opens — Screen 1 with recent search chips visible]
    │
    User taps [London ×] chip (first chip = most recent)
    │
    → LocationResult loaded from chip (no geocoding needed)
    → TanStack Query checks cache:
    │
    ├── Cache fresh (< 10 min old) → Data serves from cache immediately
    │       → [Screen 3: Main View]
    │       → Freshness: "Updated 4 minutes ago"
    │       → No network request
    │
    └── Cache stale / missing → [Screen 5: Skeleton] → API call → [Screen 3]
            │
            └── Network error → [Screen 6: Error] or [Screen 7: Offline + cache]

[Screen 3: Main View — data loaded]
    │
    User swipes hourly strip right (or presses → after Tab focus)
    │
    → Cards scroll smoothly with snap-to-card alignment
    → User reads precipitation % on 8AM–10AM cards
    → User continues scrolling to 5PM–7PM evening cards
    → Decision made; user exits app
```

---

### Flow 4 — Outdoor Enthusiast 7-Day Planning (JRN-03.01)

**Trigger:** Priya on desktop, planning a weekend trail run.
**Primary Persona:** Priya (Outdoor Enthusiast)
**User Stories:** US-01, US-09, US-10, US-15, US-16

```
[Screen 4: Desktop Layout — no location set]
    │
    Priya types "Brecon" in search → autocomplete → selects "Brecon, Powys, Wales"
    │
    → [Screen 5: Skeleton] → API call → [Screen 4: Desktop Main View]
            │
            Priya reads 7-day list in right panel
            └── Reads Saturday vs Sunday precip comparison
                    │
                    Priya scrolls right panel down to Temperature Trend Chart
                    └── Identifies Friday cold dip → decides Saturday is better
                            │
                            Priya taps "Details ▼" trigger
                            └── [Screen 8: Details Panel Expanded]
                                    Reads UV 5 (Moderate), Wind NW (22 km/h),
                                    Sunrise 06:14 BST
                                    │
                                    Priya taps trigger again → Panel collapses
                                    Takes screenshot → Books car-share for Saturday
```

---

### Flow 5 — Offline / Trailhead Check (JRN-03.02)

**Trigger:** Priya at trailhead with no signal; app was last opened 25 min ago.
**Primary Persona:** Priya (Outdoor Enthusiast)
**User Stories:** US-17, US-18

```
[App opens — navigator.onLine === false]
    │
    TanStack Query attempts refetch → network fails → serves cached data
    │
    → [Screen 7: Offline State with Offline Banner]
            "Showing cached data from 25 minutes ago — check your connection"
            │
            Priya reads current conditions + hourly 11AM–1PM cards
            → All 24 hourly cards present from cache
                    │
                    Priya taps "Details ▼"
                    → Panel expands; reads from cache (no API call)
                    → UV 4, Wind SW 18 km/h, Sunrise 06:12 BST
                            │
                            Priya makes go/no-go decision → exits app
                            │
                            [Later: Network recovers]
                            → TanStack Query background refetch triggers
                            → Offline banner dismissed
                            → Freshness: "Updated just now"
```

---

## Interaction Patterns

### Pattern 1 — Debounced Search Input

**When:** User types in the search field.
**Behaviour:**
1. Characters 1: nothing — no API call, no spinner.
2. Characters 1–2 (< 2 total): nothing.
3. Character 2 typed: 300 ms timer starts.
4. If user types another character within 300 ms: timer resets.
5. After 300 ms of inactivity with 2+ characters: geocoding API call fires.
6. Inline spinner appears in input right-end while call is in-flight.
7. Results appear as dropdown list OR inline "City not found" message.

**Why it matters:** Prevents hammering the API on every keystroke; 300 ms feels instant to the user but dramatically reduces API call volume (AC-F0-01, AC-F0-02).

---

### Pattern 2 — Unit Toggle (Instant, App-wide)

**When:** User taps °C or °F toggle.
**Behaviour:**
1. `localStorage.setItem("weather_unit_preference", newUnit)` called.
2. Application state updates `unit` in a single `useState` / Zustand store update.
3. All temperature-rendering components re-render: hero temp, feels-like, H/L, hourly cards (all 24), daily rows (all 7), chart Y-axis labels.
4. No network request. No loading state. No skeleton.
5. Total time: < 200 ms (pure re-render, no side effects).

**Visual feedback:** Toggle button shows active state via filled/outlined style.
```
  Inactive: [°C]  [°F]  ← both outlined
  °C active: [●°C] [°F] ← °C filled/solid, °F outlined
  °F active: [°C] [●°F] ← °F filled/solid, °C outlined
```

---

### Pattern 3 — Hero Background Gradient Transition

**When:** New location is selected and weather data loads.
**Behaviour:**
1. Previous gradient persists during skeleton state.
2. When new `WeatherData` arrives, `getConditionInfo(weatherCode, isDay)` resolves the new gradient key.
3. CSS transition: `transition: background 0.6s ease-in-out` on the hero container.
4. New gradient fades in over 600 ms.

**`prefers-reduced-motion`:** Transition duration becomes 0 ms. Gradient updates instantly. No visual flash (just instant swap).

---

### Pattern 4 — Details Panel Expand / Collapse

**When:** User taps "Details" trigger.
**Behaviour:**
1. React state `isOpen` toggles.
2. Panel `max-height` transitions: `0 → auto` (expand) or `auto → 0` (collapse).
3. Chevron icon rotates 180° via CSS transform transition.
4. `aria-expanded` updates synchronously.
5. Focus remains on the trigger button after activation.

**Keyboard:** Tab from trigger enters panel content when expanded. Shift+Tab returns to trigger.

---

### Pattern 5 — Skeleton → Live Transition

**When:** Weather API call resolves successfully.
**Behaviour:**
1. TanStack Query sets `isLoading → false`, `data → WeatherData`.
2. React replaces skeleton components with live components in a single render pass.
3. No FLIP animation (content reflows in-place — skeletons are sized to match real content).
4. `aria-live` region announces the loaded data.
5. `aria-busy="false"` set on main content area.

---

### Pattern 6 — Freshness Indicator Tick

**When:** Weather data is loaded.
**Behaviour:**
1. `setInterval` runs every 60 seconds.
2. Recalculates `Math.floor((Date.now() - fetchedAt) / 60_000)`.
3. Updates only the freshness indicator text node — does not trigger re-render of parent components.
4. Display: "Updated just now" (< 1 min), "Updated 1 minute ago", "Updated X minutes ago".
5. Interval is cleared on component unmount.

**Why isolated:** A full weather data tree re-render every 60 seconds would be wasteful and could cause scroll position resets or animation interruptions.

---

### Pattern 7 — Offline → Online Recovery

**When:** `navigator.onLine` transitions to `true`.
**Behaviour:**
1. Browser fires `window` "online" event.
2. TanStack Query's `networkMode: 'online'` default triggers automatic refetch.
3. If refetch succeeds: cached data replaced with fresh data; offline banner dismissed; freshness indicator resets to "Updated just now".
4. If refetch fails (flaky signal): offline banner remains; previous cached data stays visible.

---

## Responsive Considerations

### Breakpoint Matrix

| Element | Mobile (375–767 px) | Tablet (768–1023 px) | Desktop (1024 px+) |
|---|---|---|---|
| Layout | Single-column stack | Single-column + hero 2-col | Two-panel grid |
| Hero temperature font | `text-7xl` (~72 px) | `text-8xl` (~96 px) | `text-8xl` |
| Hero section | Full-width, stacked | Two-col (temp left, metrics right) | Left panel |
| 7-day list | Full-width rows | Full-width rows | Right panel |
| Chart | Full-width, h:180px | Full-width, h:200px | Right panel, h:200px |
| Details panel | Full-width | Full-width | Full-width below hero |
| Hourly strip | Full-width scroll | Full-width scroll | Left panel scroll |
| Search input | Full-width | Full-width | Full-width in top bar |
| Unit toggle | Top bar, right | Top bar, right | Top bar, right |
| Footer | Stacked | Inline | Inline |
| Container max-width | Full viewport | Full viewport | `max-w-4xl mx-auto` |

### Mobile-First Implementation Rules

1. All Tailwind styles are written without prefix first (mobile base).
2. `md:` prefix adds tablet behaviour at 768 px.
3. `lg:` prefix adds desktop behaviour at 1024 px.
4. Zero JavaScript viewport detection — only CSS.
5. No separate mobile/desktop component trees — same JSX, responsive classes.

### Touch Target Enforcement

All interactive elements meet 44×44 px regardless of visual size:

```tsx
// Example: GPS button that appears small visually but has large touch area
<button
  className="relative flex items-center justify-center
             min-w-[44px] min-h-[44px] p-2"
  aria-label="Use my current location"
>
  <MapPinIcon className="h-5 w-5" aria-hidden="true" />
</button>
```

This pattern applies to: GPS button, unit toggle options, hourly cards, Details trigger, "Try again" button, recent search chips, autocomplete suggestion items.

### No Horizontal Overflow Rules

- `<body>` and root `<div>`: no `overflow-x: hidden` (masks bugs; forbidden per FRD).
- Hourly strip: `overflow-x: auto` scoped to `<div class="hourly-container">` only.
- Daily rows: `width: 100%`; text truncates with ellipsis if city name is very long.
- Unit toggle: always fits within top bar even at 375 px (two short labels, small font).
- Footer links: wrap onto two lines on mobile if needed.

---

## Accessibility Notes (WCAG 2.2 AA)

### 1. Keyboard Navigation — Complete Tab Order

**User Stories:** US-19 (Full Keyboard Navigation), US-04 (Keyboard-Accessible Search)

```
Tab 1:  Search input  (role="combobox")
Tab 2:  GPS button    (when dropdown closed)
   ↓↑   (within dropdown) autocomplete items  (role="option")
Tab 3:  Unit toggle — °C option
Tab 4:  Unit toggle — °F option
Tab 5:  Details panel trigger  (aria-expanded)
Tab 6+: (when panel open) Details panel content items
Tab N:  Hourly strip container  (then ← → keys)
Tab N+: "Try again" button  (when error state active)
Tab N+: Footer links  (standard <a> elements)
```

All elements above must be reachable via Tab and activated via Enter/Space. Zero `outline: none` without replacement (AC-F8-10). Custom focus ring: `focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`.

---

### 2. `aria-live` Region

A single invisible region in the app root:

```html
<div
  aria-live="polite"
  aria-atomic="true"
  class="sr-only"
  id="weather-status"
></div>
```

Updated programmatically in these scenarios only:

| Event | Announcement text |
|---|---|
| New location data loaded | "Weather data loaded for London, England, GB: 18°C, Partly Cloudy" |
| Weather fetch error | "Unable to load weather for London, England, GB. Check your connection." |
| Offline + cached data shown | "Showing cached weather data for London, England, GB from 25 minutes ago" |
| Background refetch completes | *(no announcement — avoid interrupting user)* |
| Skeleton loading starts | "Loading weather data for London, England, GB" |

`aria-live="polite"` (not assertive) — screen reader announces when idle, not interrupting current speech.

---

### 3. WCAG 1.4.1 — Colour Alone (Condition Icons)

Every condition icon must have an adjacent text label:

```html
<!-- Correct — icon is decorative; text carries the meaning -->
<img src="/icons/partly-cloudy-day.svg" alt="" aria-hidden="true" />
<span>Partly Cloudy</span>

<!-- WRONG — icon carries meaning without text -->
<img src="/icons/rain.svg" alt="Rain" />
```

UV index progress bar: colour + text label always paired (the colour bar is not the sole indicator of severity).

---

### 4. WCAG 1.4.3 — Contrast (4.5:1 minimum)

**User Stories:** US-21 (Contrast, Colour, and Motion Accessibility), US-12 (Day/Night Variants and Hero Gradient)

#### Hero Gradient Text Colours

| Condition | Time | Background | Text colour | Contrast |
|---|---|---|---|---|
| Clear | Day | `#0984e3` | `#ffffff` (white) | 4.7:1 ✓ |
| Clear | Night | `#0a0a2e` (dark end) | `#ffffff` | 18:1 ✓ |
| Overcast | Day | `#636e72` (dark end) | `#ffffff` | 4.6:1 ✓ |
| Overcast | Night | `#1a1a1a` | `#f5f5f5` | 18:1 ✓ |
| Rain | Day | `#0652DD` (dark end) | `#ffffff` | 5.6:1 ✓ |
| Thunderstorm | Day | `#2d3436` | `#ffffff` | 10:1 ✓ |
| Snow | Day | `#a29bfe` (light end) | `#1a1a2e` (dark) | 5.1:1 ✓ |
| Fog | Day | `#dfe6e9` (light end) | `#1a1a2e` (dark) | 9.4:1 ✓ |

*All combinations must be verified manually with a contrast analyser before production deploy (AC-F4-05, AC-F8-04).*

#### Search Input Placeholder

`color: #6b7280` on `background: #ffffff` → ratio 4.6:1 ✓ (AC-F8-04).

---

### 5. WCAG 2.5.8 — Minimum Touch Target Size (44×44 px)

| Component | Visual size | Touch target | Method |
|---|---|---|---|
| Search input | ~52 px h | 52 px h | Natural height |
| GPS button | 24×24 px icon | 44×44 px | `min-w-[44px] min-h-[44px]` + padding |
| Unit toggle options | ~32 px | 44 px h | `min-h-[44px]` on each option |
| Recent search chips | ~36 px h | 44 px h | `min-h-[44px]` + padding |
| Autocomplete items | ~52 px h | 52 px h | Natural height |
| Hourly cards | ~100 px h | 44 px min-w | `min-w-[44px]` + scroll snapping |
| Details trigger | Full-width | 44 px h | `min-h-[44px]` |
| Daily rows | ~44 px h | 44 px h | Natural height |
| Try again button | ~44 px h | 44 px h | `min-h-[44px]` |
| Footer links | ~24 px h | 44 px h | `min-h-[44px]` on wrapper |

---

### 6. Recharts Chart Accessibility

```tsx
// Accessible chart implementation
<div
  role="img"
  aria-label={`Temperature trend for ${locationName}: ${
    daily.map(d => `${formatDay(d.date)}: high ${display(d.high, unit)}, low ${display(d.low, unit)}`).join('; ')
  }`}
>
  <ResponsiveContainer width="100%" height={180}>
    <AreaChart data={chartData}>
      {/* ... */}
    </AreaChart>
  </ResponsiveContainer>
</div>

{/* Always in DOM for screen readers; visually hidden unless Recharts fails */}
<table className="sr-only">
  <caption>7-day temperature forecast for {locationName}</caption>
  <thead>
    <tr>
      <th scope="col">Day</th>
      <th scope="col">High</th>
      <th scope="col">Low</th>
      <th scope="col">Precipitation</th>
    </tr>
  </thead>
  <tbody>
    {daily.map(d => (
      <tr key={d.date}>
        <td>{formatDayLabel(d.date, timezone)}</td>
        <td>{displayTemp(d.high, unit)}</td>
        <td>{displayTemp(d.low, unit)}</td>
        <td>{d.precipitationProbability}%</td>
      </tr>
    ))}
  </tbody>
</table>
```

Error boundary: if Recharts throws, the `<table>` loses `className="sr-only"` and becomes the visible fallback.

---

### 7. `prefers-reduced-motion` Compliance

All animations are gated:

| Animation | Normal | Reduced-motion |
|---|---|---|
| Hero gradient transition | `transition: background 0.6s ease` | `transition: none` |
| Skeleton pulse | `animate-pulse` (Tailwind) | `animation: none` |
| Details panel expand/collapse | `transition: max-height 0.2s ease-out` | `transition: none` |
| Chevron rotation on toggle | `transition: transform 0.2s ease` | `transition: none` |
| Hourly scroll snap scroll | CSS smooth scroll | Instant scroll |

Implementation: Tailwind `motion-safe:` variant or `@media (prefers-reduced-motion: reduce)` CSS block.

```css
@media (prefers-reduced-motion: reduce) {
  .hero-gradient { transition: none; }
  .skeleton-pulse { animation: none; }
  .details-panel { transition: none; }
  .chevron { transition: none; }
}
```

---

### 8. Screen Reader Announcement Flow (VoiceOver / NVDA)

**Happy path — new city search:**
1. User types "London" — autocomplete opens.
2. VoiceOver: "London, England, GB. 1 of 5. Press Enter to select."  (from `role="option" aria-selected`)
3. User presses Enter.
4. VoiceOver: "Loading weather data for London, England, GB." (`aria-live` update)
5. Data loads.
6. VoiceOver: "Weather data loaded for London, England, GB: 18°C, Partly Cloudy." (`aria-live` update)

**Error path:**
1. API call fails.
2. VoiceOver: "Unable to load weather for London, England, GB. Check your connection."

**Details panel:**
1. User tabs to "Details" button.
2. VoiceOver: "Details, collapsed, button." (`aria-expanded="false"`)
3. User presses Enter.
4. VoiceOver: "Details, expanded, button." (`aria-expanded="true"`)
5. User tabs: "UV Index: 5.2 Moderate" / "Wind Direction: NW 315 degrees" / etc.

---

*UX-Mockup-WeatherApp v1.0 — generated 2026-05-01*
*Source: UserStories-WeatherApp.md · PRD-WeatherApp.md v1.0 · FRD-WeatherApp.md v1.0 · JOURNEYS-WeatherApp.md v1.0 · PROJECT.md*
*Covers: 10 screens · 5 user flows · 7 interaction patterns · 3 breakpoints · WCAG 2.2 AA*
*User stories referenced: US-01 through US-22 (22/22 mapped) · Features: F0–F9 (10/10)*
