import type { LocationResult } from "../../types/weather";
import type { UnitPreference } from "../../types/storage";
import { useWeatherData } from "../../hooks/useWeatherData";
import { getHeroGradient } from "../../utils/gradient";
import { SkeletonHero } from "../feedback/SkeletonHero";
import { ErrorState } from "../feedback/ErrorState";
import { CurrentTemp } from "./CurrentTemp";
import { ConditionDisplay } from "./ConditionDisplay";
import { WeatherStats } from "./WeatherStats";
import { UnitToggle } from "./UnitToggle";
import { FreshnessIndicator } from "./FreshnessIndicator";

interface Props {
  location: LocationResult | null;
  unit: UnitPreference;
  onUnitToggle: () => void;
}

/**
 * Hero section: the primary content answering "what's the weather right now?".
 * Routes to:
 *   - EmptyState (no location selected)
 *   - SkeletonHero (isLoading)
 *   - ErrorState (isError)
 *   - Live data view
 *
 * Applies condition-aware gradient background from getHeroGradient().
 * UnitToggle is rendered in ALL states (including skeleton and error).
 * Never a blank screen — every path renders visible UI.
 */
export function HeroSection({ location, unit, onUnitToggle }: Props) {
  const { data, isLoading, isError, refetch } = useWeatherData(location);

  // Determine background gradient
  const gradient =
    data
      ? getHeroGradient(data.current.weatherCode, data.current.isDay)
      : "linear-gradient(to bottom, #74b9ff, #0984e3)"; // Default: clear day

  const locationName = location?.name ?? "";

  return (
    <div
      className="rounded-2xl overflow-hidden mt-4 motion-safe:transition-all motion-safe:duration-500"
      style={{ background: gradient }}
    >
      {/* UnitToggle in top-right — visible in ALL states (skeleton, error, data) */}
      <div className="flex justify-end p-4 pb-0">
        <UnitToggle unit={unit} onToggle={onUnitToggle} />
      </div>

      {/* No location state */}
      {!location && (
        <div className="px-6 pb-8 pt-2 text-center text-white/70">
          <p className="text-lg">Search for a city to see weather</p>
        </div>
      )}

      {/* Loading skeleton */}
      {location && isLoading && <SkeletonHero />}

      {/* Error state */}
      {location && isError && (
        <ErrorState locationName={locationName} onRetry={() => void refetch()} />
      )}

      {/* Live data */}
      {location && data && (
        <div className="px-6 pb-6 pt-2">
          {/* Location name */}
          <p className="text-sm font-medium text-white/70 mb-2">{data.location.name}</p>

          {/* Main temperature */}
          <CurrentTemp celsius={data.current.temperature} unit={unit} />

          {/* Condition icon + label — always paired (WCAG 1.4.1) */}
          <div className="mt-3 mb-4">
            <ConditionDisplay
              weatherCode={data.current.weatherCode}
              isDay={data.current.isDay}
            />
          </div>

          {/* All supporting stats */}
          <WeatherStats current={data.current} unit={unit} />

          {/* Freshness indicator */}
          <FreshnessIndicator fetchedAt={data.fetchedAt} />
        </div>
      )}
    </div>
  );
}
