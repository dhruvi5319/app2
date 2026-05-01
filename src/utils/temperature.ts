import type { UnitPreference } from "../types/storage";

/**
 * Converts Celsius to Fahrenheit as an integer.
 * Math.round() applied here — never in components.
 */
export function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

/**
 * Returns a display temperature in the active unit (integer string + unit symbol).
 * e.g. formatTemperature(18, "celsius") → "18°C"
 * e.g. formatTemperature(18, "fahrenheit") → "64°F"
 */
export function formatTemperature(celsius: number, unit: UnitPreference): string {
  if (unit === "fahrenheit") {
    return `${celsiusToFahrenheit(celsius)}°F`;
  }
  return `${celsius}°C`;
}

/**
 * Returns the numeric value in the active unit (integer).
 * Use when you need the number without the unit symbol.
 */
export function toDisplayTemp(celsius: number, unit: UnitPreference): number {
  return unit === "fahrenheit" ? celsiusToFahrenheit(celsius) : celsius;
}

/** Returns "°C" or "°F" for the given unit. */
export function unitSymbol(unit: UnitPreference): string {
  return unit === "fahrenheit" ? "°F" : "°C";
}
