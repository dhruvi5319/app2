import { useState, useRef } from "react";
import type { LocationResult } from "./types/weather";
import { AppLayout } from "./components/layout/AppLayout";
import { Footer } from "./components/layout/Footer";
import { SearchBar } from "./components/search/SearchBar";
import { HeroSection } from "./components/weather/HeroSection";
import { HourlyStrip } from "./components/weather/HourlyStrip";
import { SkeletonHourly } from "./components/feedback/SkeletonHourly";
import { DailyForecastList } from "./components/weather/DailyForecastList";
import { SkeletonDaily } from "./components/feedback/SkeletonDaily";
import { TemperatureTrendChart } from "./components/weather/TemperatureTrendChart";
import { ChartErrorBoundary } from "./error-boundaries/ChartErrorBoundary";
import { AppErrorBoundary } from "./error-boundaries/AppErrorBoundary";
import { useWeatherData } from "./hooks/useWeatherData";
import { useUnitPreference } from "./hooks/useUnitPreference";
import { DetailsPanel } from "./components/weather/DetailsPanel";

/**
 * Inner component has access to hooks.
 * Owns: activeLocation (LocationResult | null), unit preference.
 * Wires all Phase 1 + Phase 2 components per TechArch §3 component tree:
 *   AppErrorBoundary → AppLayout
 *     → aria-live announcer
 *     → SearchBar (+ AutocompleteDropdown, GpsButton, RecentSearchChips)
 *     → [if location] HeroSection, HourlyStrip, DailyForecastList, TemperatureTrendChart
 *     → Footer
 */
function WeatherApp() {
  const [activeLocation, setActiveLocation] = useState<LocationResult | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { unit, toggle } = useUnitPreference();
  const { data: weatherData, isLoading, isError } = useWeatherData(activeLocation);
  const announcerRef = useRef<HTMLDivElement>(null);

  // Announce location changes to screen readers (TechArch §11)
  const handleLocationSelect = (location: LocationResult) => {
    setActiveLocation(location);
    setDetailsOpen(false);
    if (announcerRef.current) {
      announcerRef.current.textContent = "";
      requestAnimationFrame(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = `Loading weather for ${location.name}`;
        }
      });
    }
  };

  const handleUnitToggle = () => {
    toggle();
  };

  return (
    <AppLayout>
      {/* Global aria-live announcer — persistent DOM element, updated via ref */}
      {/* Per TechArch §11: never re-render live content, only update this element */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        ref={announcerRef}
      />

      <SearchBar onLocationSelect={handleLocationSelect} />

      {activeLocation ? (
        <>
          {/* Hero: full width at all breakpoints */}
          <HeroSection
            location={activeLocation}
            unit={unit}
            onUnitToggle={handleUnitToggle}
          />

          {/* Details panel: collapsible secondary metrics (F6) */}
          {weatherData && (
            <DetailsPanel
              isOpen={detailsOpen}
              onToggle={() => setDetailsOpen((prev) => !prev)}
              current={weatherData.current}
              daily={weatherData.daily}
              timezone={activeLocation.timezone}
              unit={unit}
            />
          )}

          {/* Hourly strip: full width, horizontal scroll */}
          <div className="mt-4">
            {isLoading && <SkeletonHourly />}
            {weatherData && (
              <HourlyStrip
                hourly={weatherData.hourly}
                timezone={activeLocation.timezone}
                unit={unit}
              />
            )}
          </div>

          {/* Daily + Chart: stacked on mobile, side-by-side on lg+ */}
          <div className="mt-4">
            {isLoading && <SkeletonDaily />}
            {weatherData && (
              <div className="lg:grid lg:grid-cols-2 lg:gap-6">
                <DailyForecastList
                  daily={weatherData.daily}
                  timezone={activeLocation.timezone}
                  unit={unit}
                />
                <div className="mt-4 lg:mt-0">
                  <ChartErrorBoundary
                    daily={weatherData.daily}
                    timezone={activeLocation.timezone}
                    unit={unit}
                  >
                    <TemperatureTrendChart
                      daily={weatherData.daily}
                      timezone={activeLocation.timezone}
                      unit={unit}
                      locationName={activeLocation.name}
                    />
                  </ChartErrorBoundary>
                </div>
              </div>
            )}
          </div>

          {isError && !weatherData && !isLoading && null}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-white/60">
          <p className="text-lg">Search for a city to see weather</p>
        </div>
      )}

      <Footer />
    </AppLayout>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <WeatherApp />
    </AppErrorBoundary>
  );
}
