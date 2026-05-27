import { useState, useCallback } from "react";

type GeolocationState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success"; latitude: number; longitude: number }
  | { status: "denied" }      // PERMISSION_DENIED — silent, no error shown
  | { status: "unavailable"; message: string }   // POSITION_UNAVAILABLE
  | { status: "timeout"; message: string };      // TIMEOUT

/**
 * Wraps the Browser Geolocation API for opt-in GPS location detection.
 *
 * Key behaviours (from FRD §F0 error states):
 * - PERMISSION_DENIED: status → "denied"; no error shown to user; button resets silently
 * - POSITION_UNAVAILABLE: status → "unavailable"; inline message shown
 * - TIMEOUT: status → "timeout"; inline message shown
 */
export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({ status: "idle" });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        status: "unavailable",
        message: "Location unavailable — try searching manually",
      });
      return;
    }

    setState({ status: "pending" });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          status: "success",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        if (error.code === GeolocationPositionError.PERMISSION_DENIED) {
          // Silent reset — no error shown to user per FRD §F0
          setState({ status: "denied" });
        } else if (error.code === GeolocationPositionError.POSITION_UNAVAILABLE) {
          setState({
            status: "unavailable",
            message: "Location unavailable — try searching manually",
          });
        } else {
          // TIMEOUT
          setState({
            status: "timeout",
            message: "Location timed out — try searching manually",
          });
        }
      },
      { timeout: 10_000 },
    );
  }, []);

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, requestLocation, reset };
}
