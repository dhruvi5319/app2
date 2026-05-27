import { useGeolocation } from "../../hooks/useGeolocation";
import type { LocationResult } from "../../types/weather";
import { useReverseGeocode } from "../../hooks/useReverseGeocode";
import { useEffect } from "react";

interface Props {
  onLocationResolved: (location: LocationResult) => void;
}

/**
 * GPS button positioned inside the right edge of the search bar.
 * LOCKED DECISION: GPS icon inside right edge of search bar (not external button).
 * Behaviours:
 * - Shows loading spinner while geolocation is pending
 * - PERMISSION_DENIED: silently resets to idle — no error shown to user
 * - POSITION_UNAVAILABLE/TIMEOUT: shows inline message (passed up via error state)
 * - On success: triggers reverse geocoding → Open-Meteo geocoding → LocationResult
 */
export function GpsButton({ onLocationResolved }: Props) {
  const { state: geoState, requestLocation, reset } = useGeolocation();

  const coords =
    geoState.status === "success"
      ? { latitude: geoState.latitude, longitude: geoState.longitude }
      : null;

  const { data: location, isLoading: isResolving } = useReverseGeocode(coords);

  // When reverse geocode resolves, forward the LocationResult up
  useEffect(() => {
    if (location) {
      onLocationResolved(location);
      reset();
    }
  }, [location, onLocationResolved, reset]);

  const isPending =
    geoState.status === "pending" || (geoState.status === "success" && isResolving);

  return (
    <button
      type="button"
      onClick={requestLocation}
      disabled={isPending}
      aria-label={isPending ? "Detecting location..." : "Use my current location"}
      className="flex items-center justify-center min-h-[44px] min-w-[44px] p-2 text-gray-500 hover:text-blue-600 disabled:opacity-50 transition-colors"
    >
      {isPending ? (
        // Loading spinner
        <svg
          className="w-5 h-5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        // GPS/location icon
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      )}
    </button>
  );
}
