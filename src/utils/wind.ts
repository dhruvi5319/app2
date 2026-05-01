/**
 * Converts km/h to mph as an integer.
 * Conversion: Math.round(kmh * 0.621371)
 */
export function kmhToMph(kmh: number): number {
  return Math.round(kmh * 0.621371);
}

/** Converts wind direction degrees (0–360) to a cardinal direction string. */
export function degreesToCardinal(degrees: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(((degrees % 360) + 360) % 360 / 22.5) % 16;
  return dirs[index];
}
