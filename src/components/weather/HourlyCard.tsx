import { HourlyForecast } from "../../types/weather";
import { UnitPreference } from "../../types/storage";
import { formatHour } from "../../utils/time";
import { toDisplayTemp, unitSymbol } from "../../utils/temperature";
import { getConditionInfo } from "../../utils/weatherCodes";
import { WeatherIcon } from "../shared/WeatherIcon";

interface HourlyCardProps {
  forecast: HourlyForecast;
  timezone: string;
  unit: UnitPreference;
  isFirst: boolean;
}

export function HourlyCard({ forecast, timezone, unit, isFirst }: HourlyCardProps) {
  const { label } = getConditionInfo(forecast.weatherCode, forecast.isDay);
  const hourLabel = isFirst ? "Now" : formatHour(forecast.time, timezone);
  const temp = toDisplayTemp(forecast.temperature, unit);
  const sym = unitSymbol(unit);

  return (
    <div
      className={`flex flex-col items-center justify-between min-w-[80px] px-3 py-3 rounded-xl min-h-[44px] ${
        isFirst ? "bg-white/20" : "bg-white/10"
      }`}
      aria-label={`${hourLabel}: ${label}, ${temp}${sym}, ${forecast.precipitationProbability}% precipitation`}
    >
      <span className="text-sm font-medium text-white/90">{hourLabel}</span>
      <WeatherIcon
        weatherCode={forecast.weatherCode}
        isDay={forecast.isDay}
        size={32}
      />
      <span className="text-base font-semibold text-white">
        {temp}{sym}
      </span>
      <span className="text-xs text-white/80 flex items-center gap-0.5">
        <span aria-hidden="true">💧</span>
        {forecast.precipitationProbability}%
      </span>
    </div>
  );
}
