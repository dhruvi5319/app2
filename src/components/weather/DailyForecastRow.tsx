import { DailyForecast } from "../../types/weather";
import { UnitPreference } from "../../types/storage";
import { formatDayLabel } from "../../utils/time";
import { toDisplayTemp, unitSymbol } from "../../utils/temperature";
import { getConditionInfo } from "../../utils/weatherCodes";
import { WeatherIcon } from "../shared/WeatherIcon";

interface DailyForecastRowProps {
  forecast: DailyForecast;
  timezone: string;
  unit: UnitPreference;
  index: number;
}

export function DailyForecastRow({ forecast, timezone, unit, index }: DailyForecastRowProps) {
  const dayLabel = index === 0 ? "Today" : formatDayLabel(forecast.date, timezone);
  const { label } = getConditionInfo(forecast.weatherCode, true); // always daytime
  const sym = unitSymbol(unit);
  const high = toDisplayTemp(forecast.high, unit);
  const low = toDisplayTemp(forecast.low, unit);

  return (
    <div
      className="flex flex-row items-center justify-between gap-2 py-3 px-3 min-h-[44px]"
      aria-label={`${dayLabel}: ${label}, High ${high}${sym}, Low ${low}${sym}, ${forecast.precipitationProbability}% precipitation`}
    >
      <span className="w-16 text-sm font-medium text-white">{dayLabel}</span>
      <WeatherIcon weatherCode={forecast.weatherCode} isDay={true} size={32} />
      <span className="text-xs text-white/70 flex items-center gap-0.5">
        <span aria-hidden="true">💧</span>
        {forecast.precipitationProbability}%
      </span>
      <div className="flex items-center gap-2 ml-auto">
        <span className="text-sm font-semibold text-white">{high}{sym}</span>
        <span className="text-sm text-white/60">{low}{sym}</span>
      </div>
    </div>
  );
}
