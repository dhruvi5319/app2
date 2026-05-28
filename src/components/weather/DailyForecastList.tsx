import { DailyForecast } from "../../types/weather";
import { UnitPreference } from "../../types/storage";
import { DailyForecastRow } from "./DailyForecastRow";

interface DailyForecastListProps {
  daily: DailyForecast[];
  timezone: string;
  unit: UnitPreference;
}

export function DailyForecastList({ daily, timezone, unit }: DailyForecastListProps) {
  if (daily.length === 0) return null;

  return (
    <section aria-label="7-day forecast" className="w-full rounded-xl bg-white/10 overflow-hidden">
      <div role="list" className="divide-y divide-white/10">
        {daily.map((day, i) => (
          <div key={day.date} role="listitem">
            <DailyForecastRow forecast={day} timezone={timezone} unit={unit} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
