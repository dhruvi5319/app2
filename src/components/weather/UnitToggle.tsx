import type { UnitPreference } from "../../types/storage";

interface Props {
  unit: UnitPreference;
  onToggle: () => void;
}

/**
 * °C/°F unit toggle visible at all times on the main screen.
 * role="switch" with aria-checked per TechArch §11.
 * Per FRD §F1: visible during skeleton and error states.
 * Per FRD §F1 AC-F1-04: toggling updates all temperatures instantly — no network request.
 */
export function UnitToggle({ unit, onToggle }: Props) {
  return (
    <button
      role="switch"
      aria-checked={unit === "fahrenheit"}
      aria-label={`Temperature unit: currently ${unit === "celsius" ? "Celsius" : "Fahrenheit"}. Click to switch.`}
      onClick={onToggle}
      className="
        flex items-center gap-1 px-3 py-1.5 rounded-full
        bg-white/20 hover:bg-white/30 text-white text-sm font-medium
        transition-colors min-h-[44px]
        focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1
      "
    >
      <span className={unit === "celsius" ? "font-bold" : "opacity-60"}>°C</span>
      <span className="opacity-40 mx-0.5">|</span>
      <span className={unit === "fahrenheit" ? "font-bold" : "opacity-60"}>°F</span>
    </button>
  );
}
