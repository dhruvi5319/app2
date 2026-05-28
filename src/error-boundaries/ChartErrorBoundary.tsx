import React from "react";
import { DailyForecast } from "../types/weather";
import { UnitPreference } from "../types/storage";
import { formatDayLabel } from "../utils/time";
import { toDisplayTemp, unitSymbol } from "../utils/temperature";

interface Props {
  children: React.ReactNode;
  daily: DailyForecast[];
  timezone: string;
  unit: UnitPreference;
}

interface State {
  hasError: boolean;
}

export class ChartErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Chart render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      const { daily, timezone, unit } = this.props;
      const sym = unitSymbol(unit);
      return (
        <div className="w-full rounded-xl bg-white/10 p-4">
          <p className="text-white/70 text-sm mb-3">Temperature trend unavailable</p>
          <table className="w-full text-sm text-white/90">
            <thead>
              <tr className="text-white/60 border-b border-white/10">
                <th className="text-left py-1">Day</th>
                <th className="text-right py-1">High</th>
                <th className="text-right py-1">Low</th>
                <th className="text-right py-1">Precip</th>
              </tr>
            </thead>
            <tbody>
              {daily.map((d, i) => (
                <tr key={d.date} className="border-b border-white/5">
                  <td className="py-1">{i === 0 ? "Today" : formatDayLabel(d.date, timezone)}</td>
                  <td className="text-right py-1">{toDisplayTemp(d.high, unit)}{sym}</td>
                  <td className="text-right py-1 text-white/60">{toDisplayTemp(d.low, unit)}{sym}</td>
                  <td className="text-right py-1">{d.precipitationProbability}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return this.props.children;
  }
}
