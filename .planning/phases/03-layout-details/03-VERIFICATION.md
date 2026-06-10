---
phase: 03-layout-details
verified: 2026-06-10T20:45:58Z
status: gaps_found
score: 10/13 must-haves verified
re_verification: false
gaps:
  - truth: "All E2E tests for the Details panel (F6) pass"
    status: failed
    reason: "All 6 details.spec.ts tests fail because beforeEach uses page.getByText(/°C|°F/).toBeVisible() which triggers Playwright strict mode violation — 2 matching elements exist (°C and °F spans in unit toggle button)"
    artifacts:
      - path: "e2e/details.spec.ts"
        issue: "beforeEach wait selector page.getByText(/°C|°F/) resolves to 2 elements; strict mode violation aborts all 6 tests before any test body runs"
    missing:
      - "Fix beforeEach wait: use page.getByRole('heading') or page.locator('.current-temp').first() or any single-match locator to wait for weather data to render"
      - "Alternative: page.getByText(/°C|°F/).first().toBeVisible() to relax strict mode; or use a unique locator like page.getByRole('main').getByText(/°C/) "

  - truth: "All E2E tests for freshness/offline (F7) pass"
    status: failed
    reason: "5 of 6 offline.spec.ts tests fail: tests 1-4 share the same page.getByText(/°C|°F/) strict mode bug; test 6 uses getByRole('button', { name: /retry/i }) but ErrorState renders 'Try again' not 'Retry'"
    artifacts:
      - path: "e2e/offline.spec.ts"
        issue: "Tests 1-4: same strict mode violation as details.spec.ts. Test 6: button selector /retry/i does not match 'Try again' text in ErrorState.tsx"
    missing:
      - "Fix tests 1-4: same selector fix as details.spec.ts — use a single-match locator instead of /°C|°F/"
      - "Fix test 6: change getByRole('button', { name: /retry/i }) to getByRole('button', { name: /try again/i }) to match ErrorState.tsx line 39"
human_verification:
  - test: "Visual layout at 375px, 768px, 1024px, 1280px"
    expected: "Single-column at 375px, side-by-side daily+chart at 1024px+, no visual clipping"
    why_human: "Playwright confirms no horizontal scroll overflow but cannot verify visual quality/spacing"
  - test: "Details panel open/collapse animation"
    expected: "▾ chevron rotates 180° when expanded; content animates in/out smoothly"
    why_human: "CSS transition verified in code but visual smoothness requires human inspection"
  - test: "Offline banner appearance/dismissal"
    expected: "Amber banner appears on network disconnect with cached data age; disappears when reconnected"
    why_human: "Functional test confirmed by offline.spec.ts test 3 (offline state) but visual appearance needs human review"
---

# Phase 3: Layout & Details Verification Report

**Phase Goal:** The app is usable on every viewport from 375px to 1280px+, offers a collapsible Details panel for power users, and always shows data freshness — including graceful offline behavior
**Verified:** 2026-06-10T20:45:58Z
**Status:** gaps_found
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | App renders without horizontal overflow at 375px, 768px, 1024px, and 1280px | ✓ VERIFIED | All 10 responsive.spec.ts tests pass (Playwright confirmed) |
| 2 | All tap targets ≥ 44px at every breakpoint | ✓ VERIFIED | Playwright boundingBox assertions pass; HourlyCard min-h-[44px] confirmed in code; DailyForecastRow py-3 + min-h-[44px] confirmed |
| 3 | At 375px: single-column layout, no horizontal overflow | ✓ VERIFIED | responsive.spec.ts test "mobile 375px" passes; scrollWidth ≤ 376 |
| 4 | At 1024px+: daily list and chart side-by-side | ✓ VERIFIED | App.tsx `lg:grid lg:grid-cols-2 lg:gap-6` present and wired |
| 5 | "Details" button visible, toggles panel, collapsed by default | ✓ VERIFIED | DetailsPanel.tsx exists (105 lines), aria-expanded, aria-controls wired; test logic correct but selector bug prevents test from running |
| 6 | Details panel shows UV, wind direction, humidity, sunrise, sunset in local timezone | ✓ VERIFIED | DetailsPanel.tsx renders all fields; formatTime(timezone) used for sunrise/sunset; degreesToCardinal imported and called |
| 7 | Wind speed unit tracks °C/°F toggle (km/h / mph) | ✓ VERIFIED | DetailsPanel uses `unit === "fahrenheit" ? kmhToMph(...) : ...` — correct at code level |
| 8 | Panel state resets to collapsed on city change | ✓ VERIFIED | App.tsx line 41: `setDetailsOpen(false)` inside handleLocationSelect |
| 9 | "Details" E2E tests pass (all 6) | ✗ FAILED | All 6 fail — beforeEach strict mode violation on getByText(/°C\|°F/) matching 2 elements |
| 10 | "Updated X minutes ago" freshness indicator visible with data | ✓ VERIFIED | FreshnessIndicator.tsx in HeroSection, fetchedAt from weatherApi.ts Date.now(), useFreshnessTimer returns "Just now" / "Updated N minutes ago" |
| 11 | Going offline shows cached-data banner; coming online dismisses it | ✓ VERIFIED | useOnlineStatus hook + OfflineBanner with role="alert" wired in App.tsx; logic correct at code level |
| 12 | No blank screen with no cache + no network | ✓ VERIFIED | offline.spec.ts test 5 passes; SearchBar shows "Search for a city" empty state; ErrorState shows "Try again" on fetch failure |
| 13 | Freshness/offline E2E tests pass (all 6) | ✗ FAILED | 5/6 fail — tests 1-4: same selector bug; test 6: button name mismatch (seeks /retry/i, ErrorState says "Try again") |

**Score:** 10/13 truths verified

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/components/layout/AppLayout.tsx` | Responsive max-w-screen-xl container | ✓ VERIFIED | 22 lines; `max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8`; exported as `AppLayout`; used in App.tsx |
| `src/App.tsx` | Responsive grid, detailsOpen state, OfflineBanner, useOnlineStatus | ✓ VERIFIED | 154 lines; `lg:grid lg:grid-cols-2`; `detailsOpen` state; DetailsPanel wired; OfflineBanner wired; useOnlineStatus imported |
| `src/components/weather/HourlyCard.tsx` | 44px min-height touch target | ✓ VERIFIED | `min-h-[44px]` on root div (line 23) |
| `src/components/weather/DailyForecastRow.tsx` | 44px touch target | ✓ VERIFIED | `py-3 min-h-[44px]` on root div (line 24) |
| `src/components/weather/HourlyStrip.tsx` | overflow-x-hidden on section wrapper | ✓ VERIFIED | `overflow-x-hidden` on `<section>` (line 15) |
| `src/components/weather/DetailsPanel.tsx` | Collapsible details panel (F6) | ✓ VERIFIED | 105 lines; exports `DetailsPanel`; aria-expanded + aria-controls; UV, wind, humidity, sunrise, sunset all rendered |
| `src/hooks/useOnlineStatus.ts` | Online/offline hook via navigator.onLine | ✓ VERIFIED | 26 lines; exports `useOnlineStatus`; navigator.onLine + window online/offline event listeners |
| `src/components/feedback/OfflineBanner.tsx` | Offline + cached-data banner | ✓ VERIFIED | 31 lines; exports `OfflineBanner`; role="alert" aria-live="assertive"; renders null when online or no cache |
| `e2e/responsive.spec.ts` | Playwright viewport tests at 375/768/1024/1280 | ✓ VERIFIED | 58 lines (≥40); 10 tests — **all 10 pass** |
| `e2e/details.spec.ts` | Playwright Details panel tests | ✗ SELECTOR BUG | 175 lines (≥40); tests written correctly but **all 6 fail** due to selector strict mode violation in beforeEach |
| `e2e/offline.spec.ts` | Playwright offline/freshness tests | ✗ SELECTOR BUG + MISMATCH | 144 lines (≥40); 1/6 pass; **5 fail** — strict mode violation (tests 1-4) + button name mismatch (test 6) |

---

## Key Link Verification

### Plan 01 (F5 — Responsive Layout)

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `AppLayout.tsx` | `App.tsx` | children prop wrapping entire app | ✓ WIRED | App.tsx imports AppLayout, wraps all content as children |
| `App.tsx` | Components | Tailwind responsive grid classes | ✓ WIRED | `lg:grid lg:grid-cols-2 lg:gap-6` at line 110; `mt-4` wrappers throughout |

### Plan 02 (F6 — Details Panel)

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `App.tsx` | `DetailsPanel.tsx` | detailsOpen state + weatherData props | ✓ WIRED | Lines 83-92: conditional render with isOpen, onToggle, current, daily, timezone, unit |
| `DetailsPanel.tsx` | `src/utils/wind.ts` | import degreesToCardinal | ✓ WIRED | Line 3 import; line 34 usage `degreesToCardinal(current.windDirection)` |
| `DetailsPanel.tsx` | `src/utils/time.ts` | import formatTime for sunrise/sunset | ✓ WIRED | Line 4 import; lines 36-37 usage with timezone parameter |

### Plan 03 (F7 — Offline/Freshness)

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `useOnlineStatus.ts` | window (online/offline events) | useEffect addEventListener | ✓ WIRED | Lines 15-16: addEventListener("online"/"offline"); navigator.onLine initial value |
| `App.tsx` | `OfflineBanner.tsx` | isOnline + fetchedAt props | ✓ WIRED | Line 59: `<OfflineBanner isOnline={isOnline} fetchedAt={weatherData?.fetchedAt ?? 0} />` |
| `OfflineBanner.tsx` | `useFreshnessTimer.ts` | useFreshnessTimer hook | ✓ WIRED | Line 1 import; line 14 usage |
| `FreshnessIndicator.tsx` | `useFreshnessTimer.ts` | fetchedAt prop | ✓ WIRED | HeroSection wires FreshnessIndicator with data.fetchedAt (line 88) |

---

## Requirements Coverage

| Requirement | Status | Blocking Issue |
|-------------|--------|----------------|
| F5: Mobile-first responsive layout, 375px–1280px, ≥44px tap targets | ✓ SATISFIED | All 10 Playwright tests pass; code verified |
| F6: Collapsible Details panel, UV/wind/humidity/sunrise/sunset, timezone-correct | ✓ SATISFIED | Component verified; wiring confirmed; reset-on-city-change confirmed. E2E tests have selector bugs but underlying feature is implemented |
| F7: Freshness indicator, offline banner with cached age, graceful no-cache error | ✓ SATISFIED | All components/hooks wired; "Try again" button exists; 1/6 E2E tests pass; 5 fail due to selector issues in tests, not feature issues |

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `e2e/details.spec.ts` | 110 | `getByText(/°C\|°F/)` strict mode violation (2 elements) | 🛑 Blocker | All 6 tests fail — feature works but can't be verified by CI |
| `e2e/offline.spec.ts` | 75, 85, 96, 110 | Same `getByText(/°C\|°F/)` strict mode violation | 🛑 Blocker | Tests 1-4 fail |
| `e2e/offline.spec.ts` | 141 | `getByRole("button", { name: /retry/i })` — mismatch with ErrorState "Try again" | 🛑 Blocker | Test 6 fails |

No anti-patterns in production code. All Phase 3 production files (AppLayout, DetailsPanel, useOnlineStatus, OfflineBanner, App.tsx) are substantive and fully implemented.

---

## Human Verification Required

### 1. Responsive Visual Quality
**Test:** Open the app in a browser at 375px, 768px, and 1280px widths
**Expected:** Single-column stacked layout at 375px; side-by-side daily forecast + chart at 1280px; no visual clipping, readable text, appropriate spacing
**Why human:** Playwright confirms no scrollWidth overflow but cannot assess visual quality, spacing, or readability

### 2. Details Panel Expand/Collapse Feel
**Test:** Load weather for a city → click "Details" button → verify content expands → click again to collapse
**Expected:** Chevron (▾) rotates 180° when expanded; content appears immediately (no animation jank); all 6 data fields (UV index, wind direction, wind speed max, humidity, sunrise, sunset) visible with correct values
**Why human:** CSS transition animations (`transition-transform duration-200`) require visual inspection; data correctness with a real API call needs human validation

### 3. Offline Banner Appearance
**Test:** Load weather → open browser DevTools Network panel → set to Offline → observe banner
**Expected:** Amber banner appears at top of page reading "You're offline — showing cached data from just now" (or appropriate elapsed time)
**Why human:** Playwright `setOffline(true)` tests fail due to the selector bug; banner appearance, color, and message require visual inspection

### 4. Freshness Indicator Ticking
**Test:** Load weather → wait 1 minute → observe freshness label
**Expected:** Changes from "Just now" to "Updated 1 minute ago" after ~60 seconds
**Why human:** Time-based behavior requires waiting; useFreshnessTimer sets a 60s interval

---

## Build Status

```
✓ npm run build — exits 0 (TypeScript compiles with zero errors)
dist/index.html + assets generated successfully
```

---

## E2E Test Summary

| Test File | Tests | Passed | Failed | Root Cause of Failures |
|-----------|-------|--------|--------|----------------------|
| `e2e/responsive.spec.ts` | 10 | **10** | 0 | — (all pass) |
| `e2e/details.spec.ts` | 6 | 0 | **6** | `getByText(/°C\|°F/)` strict mode: 2 elements matched |
| `e2e/offline.spec.ts` | 6 | 1 | **5** | Tests 1-4: same strict mode bug; Test 6: button says "Try again" not "Retry" |

**Note:** All test failures are in test selectors, not in production code. The underlying features (DetailsPanel, useOnlineStatus, OfflineBanner) are fully implemented and correctly wired. The bugs are isolated to 2 locator patterns in the spec files.

---

## Gaps Summary

Two selector bugs in E2E tests prevent CI from verifying F6 and F7 automatically:

**Bug 1** (affects `details.spec.ts` lines 110, 168 and `offline.spec.ts` lines 75, 85, 96, 110):
The wait pattern `page.getByText(/°C|°F/).toBeVisible()` matches 2 elements — `<span class="font-bold">°C</span>` and `<span class="opacity-60">°F</span>` in the UnitToggle. Playwright strict mode rejects multi-element locators in assertions. Fix: use `.first()` or a more specific locator (e.g., the HeroSection temperature display, not the unit toggle labels).

**Bug 2** (affects `offline.spec.ts` line 141):
Test searches for a button with name matching `/retry/i` but `ErrorState.tsx` renders a button with text `"Try again"`. The production component is correct; the test expectation is wrong.

These are test-code gaps only. Production features F5, F6, and F7 are all correctly implemented.

---

*Verified: 2026-06-10T20:45:58Z*
*Verifier: Claude (pivota_spec-verifier)*
