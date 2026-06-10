---
phase: 03-layout-details
plan: "03"
subsystem: ui
tags: [offline, freshness, playwright, react-hooks, navigator-online]

# Dependency graph
requires:
  - phase: 03-layout-details
    plan: "01"
    provides: AppLayout.tsx — stable responsive container OfflineBanner slots into
provides:
  - useOnlineStatus hook (src/hooks/useOnlineStatus.ts) — reactive online/offline status via window events
  - OfflineBanner component (src/components/feedback/OfflineBanner.tsx) — cached-data banner when offline
  - App.tsx wired with OfflineBanner + useOnlineStatus (isOnline + fetchedAt props)
  - e2e/offline.spec.ts — 6 Playwright tests covering all offline/freshness paths
affects: [04-accessibility-deployment]

# Tech tracking
tech-stack:
  added: []
  patterns: ["navigator.onLine + window online/offline events for reactive status", "role=alert + aria-live=assertive for offline banner accessibility"]

key-files:
  created:
    - src/hooks/useOnlineStatus.ts
    - src/components/feedback/OfflineBanner.tsx
    - e2e/offline.spec.ts
  modified:
    - src/App.tsx

key-decisions:
  - "OfflineBanner only renders when !isOnline && fetchedAt > 0 — no-cache error handled by TanStack Query isError path (ErrorState)"
  - "OfflineBanner uses useFreshnessTimer for ticking cached-data age display"
  - "City not found message already in SearchBar.tsx showNoResults — no duplication needed"
  - "Playwright E2E tests written as deliverable; execution deferred to verify phase per test execution boundary"

patterns-established:
  - "useOnlineStatus pattern: navigator.onLine initial state + addEventListener online/offline"
  - "Feedback banner pattern: role=alert + aria-live=assertive for immediate screen reader announcement"

# Metrics
duration: 2min
completed: 2026-06-10
---

# Phase 3 Plan 03: Offline Resilience & Freshness Summary

**useOnlineStatus hook + OfflineBanner component implementing F7 offline detection — banner appears/dismisses reactively, no-cache error handled by existing ErrorState, 6 Playwright E2E tests written for all offline paths**

## Performance

- **Duration:** 2 min
- **Started:** 2026-06-10T20:38:26Z
- **Completed:** 2026-06-10T20:40:36Z
- **Tasks:** 2
- **Files modified:** 4 (3 created + 1 modified)

## Accomplishments
- Created `useOnlineStatus` hook that initializes from `navigator.onLine` and subscribes to window online/offline events
- Created `OfflineBanner` component with `role="alert"` + `aria-live="assertive"` that shows cached data age using `useFreshnessTimer`
- Wired `App.tsx` with `useOnlineStatus` hook and `OfflineBanner` as first child of `AppLayout`
- Verified "City not found" message already handled by `SearchBar.tsx` `showNoResults` — no duplication needed
- Wrote 6 Playwright E2E tests in `e2e/offline.spec.ts` covering freshness indicator, online/offline banner states, and no-blank-screen guarantees

## Task Commits

Each task was committed atomically:

1. **Task 1: useOnlineStatus hook, OfflineBanner component, App.tsx wired** - `47c2975` (feat)
2. **Task 2: Playwright tests for offline and freshness paths** - `b165acb` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `src/hooks/useOnlineStatus.ts` — React hook returning boolean online/offline status via navigator.onLine + window events
- `src/components/feedback/OfflineBanner.tsx` — Fixed amber banner shown when offline + cached data available (role=alert)
- `src/App.tsx` — Added useOnlineStatus hook, OfflineBanner as first AppLayout child with isOnline + fetchedAt props
- `e2e/offline.spec.ts` — 6 Playwright tests: freshness indicator visible, no banner when online, banner on setOffline(true), banner gone on setOffline(false), no blank screen states

## Decisions Made
- OfflineBanner only renders when `!isOnline && fetchedAt > 0` — the no-cache + no-network path is handled by TanStack Query's `isError` state in HeroSection (shows ErrorState with retry button), avoiding duplicated logic
- `useFreshnessTimer(fetchedAt)` reused in OfflineBanner for consistent ticking "X minutes ago" display
- City not found message already present in SearchBar.tsx `showNoResults` condition — verified no change needed
- Playwright test execution deferred to verify phase per test execution boundary rules (E2E requires browser + server)

## Deviations from Plan

None - plan executed exactly as written. The "City not found" path was already handled by SearchBar.tsx as documented in the plan's contingency.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- F7 fully implemented: freshness indicator (existing FreshnessIndicator in HeroSection), offline banner with cached data age, graceful no-cache error (ErrorState), and "City not found" message all in place
- All Phase 3 features (F5 responsive layout, F6 details panel, F7 offline/freshness) now complete
- Phase 3 ready for verify phase: e2e/responsive.spec.ts, e2e/details.spec.ts, and e2e/offline.spec.ts all written
- Phase 4 (Accessibility & Deployment) can proceed after verification

---
*Phase: 03-layout-details*
*Completed: 2026-06-10*

## Self-Check: PASSED
- `src/hooks/useOnlineStatus.ts` — FOUND
- `src/components/feedback/OfflineBanner.tsx` — FOUND
- `e2e/offline.spec.ts` — FOUND (143 lines, min_lines: 40 satisfied)
- `src/App.tsx` — FOUND (contains useOnlineStatus + OfflineBanner)
- Commits `47c2975` and `b165acb` — FOUND
