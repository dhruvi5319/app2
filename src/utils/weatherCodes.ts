export interface ConditionInfo {
  label: string;
  dayIcon: string;    // filename in public/icons/, e.g. "sun"
  nightIcon: string;  // filename in public/icons/, e.g. "moon"
}

export const WMO_CODE_MAP: Record<number, ConditionInfo> = {
  0:  { label: "Clear Sky",            dayIcon: "sun",               nightIcon: "moon" },
  1:  { label: "Mainly Clear",         dayIcon: "sun-cloud",         nightIcon: "moon-cloud" },
  2:  { label: "Partly Cloudy",        dayIcon: "cloud-sun",         nightIcon: "cloud-moon" },
  3:  { label: "Overcast",             dayIcon: "cloud",             nightIcon: "cloud" },
  45: { label: "Foggy",                dayIcon: "fog",               nightIcon: "fog" },
  48: { label: "Foggy",                dayIcon: "fog",               nightIcon: "fog" },
  51: { label: "Drizzle",              dayIcon: "drizzle",           nightIcon: "drizzle" },
  53: { label: "Drizzle",              dayIcon: "drizzle",           nightIcon: "drizzle" },
  55: { label: "Drizzle",              dayIcon: "drizzle",           nightIcon: "drizzle" },
  56: { label: "Freezing Drizzle",     dayIcon: "freezing-drizzle",  nightIcon: "freezing-drizzle" },
  57: { label: "Freezing Drizzle",     dayIcon: "freezing-drizzle",  nightIcon: "freezing-drizzle" },
  61: { label: "Rain",                 dayIcon: "rain",              nightIcon: "rain" },
  63: { label: "Rain",                 dayIcon: "rain",              nightIcon: "rain" },
  65: { label: "Rain",                 dayIcon: "rain",              nightIcon: "rain" },
  66: { label: "Freezing Rain",        dayIcon: "freezing-rain",     nightIcon: "freezing-rain" },
  67: { label: "Freezing Rain",        dayIcon: "freezing-rain",     nightIcon: "freezing-rain" },
  71: { label: "Snow",                 dayIcon: "snow",              nightIcon: "snow" },
  73: { label: "Snow",                 dayIcon: "snow",              nightIcon: "snow" },
  75: { label: "Snow",                 dayIcon: "snow",              nightIcon: "snow" },
  77: { label: "Snow Grains",          dayIcon: "snow-grains",       nightIcon: "snow-grains" },
  80: { label: "Showers",              dayIcon: "showers",           nightIcon: "showers" },
  81: { label: "Showers",              dayIcon: "showers",           nightIcon: "showers" },
  82: { label: "Showers",              dayIcon: "showers",           nightIcon: "showers" },
  85: { label: "Snow Showers",         dayIcon: "snow-showers",      nightIcon: "snow-showers" },
  86: { label: "Snow Showers",         dayIcon: "snow-showers",      nightIcon: "snow-showers" },
  95: { label: "Thunderstorm",         dayIcon: "thunderstorm",      nightIcon: "thunderstorm" },
  96: { label: "Thunderstorm with Hail", dayIcon: "thunderstorm-hail", nightIcon: "thunderstorm-hail" },
  99: { label: "Thunderstorm with Hail", dayIcon: "thunderstorm-hail", nightIcon: "thunderstorm-hail" },
} as const;

const FALLBACK: ConditionInfo = { label: "Clear Sky", dayIcon: "sun", nightIcon: "moon" };

/** Returns condition info for a WMO code, falling back to code 0 for unknowns. */
export function getConditionInfo(weatherCode: number, isDay: boolean): {
  label: string;
  icon: string;
} {
  const info = WMO_CODE_MAP[weatherCode] ?? FALLBACK;
  return {
    label: info.label,
    icon: isDay ? info.dayIcon : info.nightIcon,
  };
}
