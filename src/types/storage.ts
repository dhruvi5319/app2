/** Unit preference stored in localStorage. Default: "celsius". */
export type UnitPreference = "celsius" | "fahrenheit";

/** A recent location search entry persisted in localStorage. */
export interface RecentSearch {
  name: string;      // Display name, e.g. "London, England, GB"
  latitude: number;
  longitude: number;
  timezone: string;
  savedAt: number;   // Unix timestamp ms
}
