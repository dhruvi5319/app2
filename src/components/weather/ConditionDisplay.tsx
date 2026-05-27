import { getConditionInfo } from "../../utils/weatherCodes";
import { WeatherIcon } from "../shared/WeatherIcon";

interface Props {
  weatherCode: number;
  isDay: boolean;
}

/**
 * Always renders icon AND label together — never icon-only.
 * Satisfies WCAG 1.4.1: weather condition not conveyed by colour alone.
 * Icon has alt="" aria-hidden="true"; label in adjacent <span>.
 */
export function ConditionDisplay({ weatherCode, isDay }: Props) {
  const { label } = getConditionInfo(weatherCode, isDay);

  return (
    <div className="flex items-center gap-3">
      <WeatherIcon weatherCode={weatherCode} isDay={isDay} size={48} />
      <span className="text-lg font-medium text-white/90">{label}</span>
    </div>
  );
}
