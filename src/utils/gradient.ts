/**
 * Returns a CSS gradient string for the hero background based on weather state.
 * Condition groups and gradient values from FRD §F4 Hero Background Gradient Palette.
 */
export function getHeroGradient(weatherCode: number, isDay: boolean): string {
  // Determine condition group from WMO code
  const code = weatherCode;

  if (code === 0) {
    return isDay
      ? "linear-gradient(to bottom, #74b9ff, #0984e3)"   // Clear day: sky blue
      : "linear-gradient(to bottom, #2d3436, #0a0a2e)";  // Clear night: deep navy
  }
  if (code === 1 || code === 2) {
    return isDay
      ? "linear-gradient(to bottom, #a29bfe, #74b9ff)"   // Mainly clear/partly cloudy day: soft blue
      : "linear-gradient(to bottom, #353b48, #1e1e3f)";  // Night: muted indigo
  }
  if (code === 3) {
    return isDay
      ? "linear-gradient(to bottom, #b2bec3, #636e72)"   // Overcast day: grey
      : "linear-gradient(to bottom, #3d3d3d, #1a1a1a)";  // Overcast night: dark grey
  }
  if (code === 45 || code === 48) {
    return isDay
      ? "linear-gradient(to bottom, #dfe6e9, #b2bec3)"   // Fog day: light grey
      : "linear-gradient(to bottom, #4a4a5a, #2d2d3d)";  // Fog night: dim purple-grey
  }
  // Rain / drizzle / showers: codes 51,53,55,61,63,65,80,81,82
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    return isDay
      ? "linear-gradient(to bottom, #74b9ff, #0652DD)"   // Rain day: rain blue
      : "linear-gradient(to bottom, #2c3e50, #1a252f)";  // Rain night: dark blue-grey
  }
  // Freezing precipitation: 56, 57, 66, 67
  if ([56, 57, 66, 67].includes(code)) {
    return isDay
      ? "linear-gradient(to bottom, #dfe6e9, #74b9ff)"   // Icy day
      : "linear-gradient(to bottom, #2c3e50, #1a252f)";  // Icy night
  }
  // Snow: 71, 73, 75, 77, 85, 86
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return isDay
      ? "linear-gradient(to bottom, #dfe6e9, #a29bfe)"   // Snow day: white-lavender
      : "linear-gradient(to bottom, #353b48, #1e1e3f)";  // Snow night
  }
  // Thunderstorm: 95, 96, 99
  if ([95, 96, 99].includes(code)) {
    return isDay
      ? "linear-gradient(to bottom, #636e72, #2d3436)"   // Storm day: grey
      : "linear-gradient(to bottom, #1a1a2e, #0a0a1e)";  // Storm night: near black
  }
  // Fallback: clear sky
  return isDay
    ? "linear-gradient(to bottom, #74b9ff, #0984e3)"
    : "linear-gradient(to bottom, #2d3436, #0a0a2e)";
}
