import { getConditionInfo } from "../../utils/weatherCodes";

interface Props {
  weatherCode: number;
  isDay: boolean;
  size?: number; // px, default 48
  className?: string;
}

/**
 * Renders a weather condition icon from public/icons/*.svg.
 * alt="" and aria-hidden="true" — condition label must always be in adjacent span.
 * This satisfies WCAG 1.4.1 (no colour-only information).
 */
export function WeatherIcon({ weatherCode, isDay, size = 48, className = "" }: Props) {
  const { icon } = getConditionInfo(weatherCode, isDay);

  return (
    <img
      src={`/icons/${icon}.svg`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={className}
      // Fallback: hide broken image gracefully (icon file may not exist yet in Phase 1)
      onError={(e) => {
        (e.target as HTMLImageElement).style.opacity = "0.3";
      }}
    />
  );
}
