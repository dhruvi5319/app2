export const queryKeys = {
  weather: (latitude: number, longitude: number) =>
    ["weather", latitude, longitude] as const,
  geocoding: (query: string) =>
    ["geocoding", query] as const,
} as const;
