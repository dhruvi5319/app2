import type { CurrentConditions, DailyForecast } from "../../types/weather";
import type { UnitPreference } from "../../types/storage";
import { degreesToCardinal, kmhToMph } from "../../utils/wind";
import { formatTime } from "../../utils/time";

interface DetailsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  current: CurrentConditions;
  daily: DailyForecast[]; // daily[0] = today
  timezone: string;
  unit: UnitPreference;
}

/**
 * Collapsible details panel for power-user secondary metrics.
 * Shows UV index, wind direction, visibility (if available), humidity,
 * sunrise, and sunset — all in the location's local timezone.
 * Wind speed unit matches °C/°F unit toggle (km/h / mph).
 * Panel is collapsed by default; state controlled by parent.
 */
export function DetailsPanel({
  isOpen,
  onToggle,
  current,
  daily,
  timezone,
  unit,
}: DetailsPanelProps) {
  const today = daily[0];
  const windUnit = unit === "fahrenheit" ? "mph" : "km/h";
  const windMaxSpeed =
    unit === "fahrenheit" ? kmhToMph(today.windSpeedMax) : today.windSpeedMax;
  const cardinal = degreesToCardinal(current.windDirection);

  const sunrise = today ? formatTime(today.sunrise, timezone) : "—";
  const sunset = today ? formatTime(today.sunset, timezone) : "—";
  const uvIndex = today ? Math.round(today.uvIndexMax) : 0;

  return (
    <section className="mt-4 rounded-xl overflow-hidden bg-white/10">
      {/* Toggle button — always visible */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls="details-panel-content"
        className="w-full flex items-center justify-between px-4 py-3 text-white font-medium text-sm min-h-[44px] hover:bg-white/10 transition-colors"
      >
        <span>Details</span>
        <span
          aria-hidden="true"
          className={`transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {/* Collapsible content */}
      {isOpen && (
        <div
          id="details-panel-content"
          className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-sm text-white/90"
        >
          {/* UV Index */}
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wide">UV Index</p>
            <p className="font-medium">{uvIndex}</p>
          </div>

          {/* Wind direction */}
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wide">Wind Direction</p>
            <p className="font-medium">{cardinal} ({current.windDirection}°)</p>
          </div>

          {/* Wind speed (max today) */}
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wide">Wind Speed Max</p>
            <p className="font-medium">{windMaxSpeed} {windUnit}</p>
          </div>

          {/* Humidity */}
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wide">Humidity</p>
            <p className="font-medium">{current.humidity}%</p>
          </div>

          {/* Sunrise */}
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wide">Sunrise</p>
            <p className="font-medium">{sunrise}</p>
          </div>

          {/* Sunset */}
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wide">Sunset</p>
            <p className="font-medium">{sunset}</p>
          </div>
        </div>
      )}
    </section>
  );
}
