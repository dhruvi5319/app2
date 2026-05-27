import type { UnitPreference } from "../../types/storage";
import { toDisplayTemp, unitSymbol } from "../../utils/temperature";

interface Props {
  celsius: number;        // Integer (Math.round already applied in transformation layer)
  unit: UnitPreference;
}

/**
 * Displays the current temperature at heading scale.
 * INVARIANT: temperature is always displayed as an integer.
 * Math.round() was applied in transformForecastResponse() — this component
 * receives an integer and must NEVER apply Math.round() itself.
 * toDisplayTemp() handles Celsius→Fahrenheit conversion (also integer).
 */
export function CurrentTemp({ celsius, unit }: Props) {
  const displayValue = toDisplayTemp(celsius, unit);

  return (
    <div className="flex items-start leading-none">
      <span className="text-7xl font-bold text-white tabular-nums">
        {displayValue}
      </span>
      <span className="text-3xl font-medium text-white/80 mt-2 ml-1">
        {unitSymbol(unit)}
      </span>
    </div>
  );
}
