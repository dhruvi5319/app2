import { useState, useCallback } from "react";
import { readUnitPreference, writeUnitPreference } from "../utils/localStorage";
import type { UnitPreference } from "../types/storage";

/**
 * Reads unit preference from localStorage on init.
 * Writes to localStorage on every toggle.
 * Toggle triggers re-render of all temperature displays — no network request.
 */
export function useUnitPreference() {
  const [unit, setUnitState] = useState<UnitPreference>(readUnitPreference);

  const setUnit = useCallback((newUnit: UnitPreference) => {
    writeUnitPreference(newUnit);
    setUnitState(newUnit);
  }, []);

  const toggle = useCallback(() => {
    setUnit(unit === "celsius" ? "fahrenheit" : "celsius");
  }, [unit, setUnit]);

  return { unit, setUnit, toggle };
}
