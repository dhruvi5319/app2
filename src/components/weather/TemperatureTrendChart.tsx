import { DailyForecast } from "../../types/weather";
import { UnitPreference } from "../../types/storage";
import { formatDayLabel } from "../../utils/time";
import { toDisplayTemp, unitSymbol } from "../../utils/temperature";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

interface TemperatureTrendChartProps {
  daily: DailyForecast[];
  timezone: string;
  unit: UnitPreference;
  locationName: string;
}

export function TemperatureTrendChart({ daily, timezone, unit, locationName }: TemperatureTrendChartProps) {
  const sym = unitSymbol(unit);

  const chartData = daily.map((d, i) => ({
    day: i === 0 ? "Today" : formatDayLabel(d.date, timezone),
    high: toDisplayTemp(d.high, unit),
    low: toDisplayTemp(d.low, unit),
    precip: d.precipitationProbability,
  }));

  const ariaLabel = `Temperature trend for ${locationName}: ${
    daily
      .map((d, i) => {
        const label = i === 0 ? "Today" : formatDayLabel(d.date, timezone);
        return `${label}: high ${toDisplayTemp(d.high, unit)}${sym}, low ${toDisplayTemp(d.low, unit)}${sym}`;
      })
      .join("; ")
  }`;

  return (
    <section aria-label="Temperature trend chart" className="w-full">
      {/* Recharts chart — accessible wrapper per TechArch §11 */}
      <div
        role="img"
        aria-label={ariaLabel}
        className="w-full h-48"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="day"
              tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}${sym}`}
              domain={["auto", "auto"]}
            />
            <Tooltip
              formatter={(value: number, name: string) => [`${value}${sym}`, name === "high" ? "High" : "Low"]}
              contentStyle={{ background: "rgba(0,0,0,0.7)", border: "none", borderRadius: 8, color: "#fff" }}
            />
            <Area
              type="monotone"
              dataKey="high"
              stroke="#fbbf24"
              fill="rgba(251,191,36,0.2)"
              strokeWidth={2}
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="low"
              stroke="#60a5fa"
              fill="rgba(96,165,250,0.1)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Screen-reader accessible data table — always in DOM, visually hidden */}
      <table className="sr-only">
        <caption>7-day temperature forecast for {locationName}</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">High</th>
            <th scope="col">Low</th>
            <th scope="col">Precipitation</th>
          </tr>
        </thead>
        <tbody>
          {daily.map((d, i) => (
            <tr key={d.date}>
              <td>{i === 0 ? "Today" : formatDayLabel(d.date, timezone)}</td>
              <td>{toDisplayTemp(d.high, unit)}{sym}</td>
              <td>{toDisplayTemp(d.low, unit)}{sym}</td>
              <td>{d.precipitationProbability}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
