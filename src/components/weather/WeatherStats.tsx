import type { CurrentConditions } from "../../types/weather";
import type { UnitPreference } from "../../types/storage";
import { toDisplayTemp, unitSymbol } from "../../utils/temperature";
import { kmhToMph } from "../../utils/wind";

interface Props {
  current: CurrentConditions;
  unit: UnitPreference;
}

/**
 * Displays: feels-like temp, today H/L, precipitation probability, humidity, wind speed.
 * Wind speed: km/h when °C, mph when °F (per FRD §F1 AC-F1-10).
 * All values visible above the fold at 375px.
 */
export function WeatherStats({ current, unit }: Props) {
  const feelsLike = toDisplayTemp(current.feelsLike, unit);
  const high = toDisplayTemp(current.high, unit);
  const low = toDisplayTemp(current.low, unit);
  const sym = unitSymbol(unit);
  const windSpeed =
    unit === "fahrenheit" ? kmhToMph(current.windSpeed) : current.windSpeed;
  const windUnit = unit === "fahrenheit" ? "mph" : "km/h";

  return (
    <div className="space-y-2 text-white/90 text-sm">
      {/* Feels like */}
      <p>Feels like {feelsLike}{sym}</p>

      {/* High / Low */}
      <p>H: {high}{sym} · L: {low}{sym}</p>

      {/* Stats row: precip, humidity, wind */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <span>💧 {current.precipitationProbability}%</span>
        <span>Humidity: {current.humidity}%</span>
        <span>Wind: {windSpeed} {windUnit}</span>
      </div>
    </div>
  );
}
