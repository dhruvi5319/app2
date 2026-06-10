import { HourlyForecast } from "../../types/weather";
import { UnitPreference } from "../../types/storage";
import { HourlyCard } from "./HourlyCard";

interface HourlyStripProps {
  hourly: HourlyForecast[];
  timezone: string;
  unit: UnitPreference;
}

export function HourlyStrip({ hourly, timezone, unit }: HourlyStripProps) {
  if (hourly.length === 0) return null;

  return (
    <section aria-label="24-hour forecast" className="w-full overflow-x-hidden">
      <div
        className="flex flex-row gap-2 overflow-x-auto pb-2 motion-safe:scroll-smooth [scrollbar-width:thin]"
        style={{ scrollSnapType: "x mandatory" }}
        tabIndex={0}
        role="list"
      >
        {hourly.map((h, i) => (
          <div key={h.time} style={{ scrollSnapAlign: "start" }} role="listitem">
            <HourlyCard forecast={h} timezone={timezone} unit={unit} isFirst={i === 0} />
          </div>
        ))}
      </div>
    </section>
  );
}
