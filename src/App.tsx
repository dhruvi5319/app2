import { useState, useRef, useCallback } from "react";
import { AppErrorBoundary } from "./error-boundaries/AppErrorBoundary";
import { AppLayout } from "./components/layout/AppLayout";
import { SearchBar } from "./components/search/SearchBar";
import { HeroSection } from "./components/weather/HeroSection";
import { useUnitPreference } from "./hooks/useUnitPreference";
import type { LocationResult } from "./types/weather";
import "./App.css";

/**
 * Root application component.
 * Owns: activeLocation (LocationResult | null), delegated unit preference.
 * Structure from TechArch §3 component tree:
 *   AppErrorBoundary → QueryClientProvider (in main.tsx) → AppLayout
 *     → SearchBar (+ AutocompleteDropdown, GpsButton, RecentSearchChips)
 *     → HeroSection (+ SkeletonHero | ErrorState | data)
 *     → aria-live announcer
 */
export default function App() {
  const [activeLocation, setActiveLocation] = useState<LocationResult | null>(null);
  const { unit, toggle } = useUnitPreference();
  const announcerRef = useRef<HTMLDivElement>(null);

  const handleLocationSelect = useCallback(
    (location: LocationResult) => {
      setActiveLocation(location);
      // Announce location change to screen readers (TechArch §11)
      if (announcerRef.current) {
        announcerRef.current.textContent = "";
        requestAnimationFrame(() => {
          if (announcerRef.current) {
            announcerRef.current.textContent = `Loading weather for ${location.name}`;
          }
        });
      }
    },
    [],
  );

  return (
    <AppErrorBoundary>
      <AppLayout>
        {/* Search bar — always visible, pinned to top per CONTEXT.md locked decision */}
        <SearchBar onLocationSelect={handleLocationSelect} />

        {/* Hero section — current conditions */}
        <HeroSection
          location={activeLocation}
          unit={unit}
          onUnitToggle={toggle}
        />

        {/* Global aria-live announcer — single element in DOM, updated programmatically */}
        {/* Per TechArch §11: never re-render live content, only update this single element */}
        <div
          ref={announcerRef}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />
      </AppLayout>
    </AppErrorBoundary>
  );
}
