import type { GeocodingResult } from "../../types/weather";

interface Props {
  results: GeocodingResult[];
  isLoading: boolean;
  activeIndex: number;
  onSelect: (result: GeocodingResult) => void;
  onActiveIndexChange: (index: number) => void;
  inputId: string;
}

/**
 * Floating dropdown suggestion list below the search bar (combobox pattern).
 * LOCKED DECISION: no full-screen modal on any viewport.
 * Keyboard: ↑↓ to navigate, Enter to select, Escape handled in SearchBar.
 */
export function AutocompleteDropdown({
  results,
  isLoading,
  activeIndex,
  onSelect,
  onActiveIndexChange,
  inputId,
}: Props) {
  if (!isLoading && results.length === 0) return null;

  return (
    <ul
      role="listbox"
      aria-labelledby={inputId}
      className="absolute left-0 right-0 top-full mt-1 z-50 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
    >
      {isLoading && (
        <li className="px-4 py-3 text-sm text-gray-500" role="option" aria-selected={false}>
          Searching...
        </li>
      )}
      {!isLoading &&
        results.map((result, index) => (
          <li
            key={result.id}
            role="option"
            aria-selected={index === activeIndex}
            className={`
              flex flex-col px-4 py-3 cursor-pointer min-h-[44px] justify-center
              ${index === activeIndex ? "bg-blue-50 text-blue-900" : "hover:bg-gray-50 text-gray-900"}
              ${index > 0 ? "border-t border-gray-100" : ""}
            `}
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent input blur before selection
              onSelect(result);
            }}
            onMouseEnter={() => onActiveIndexChange(index)}
          >
            <span className="font-medium text-sm">{result.name}</span>
            <span className="text-xs text-gray-500">
              {[result.admin1, result.country].filter(Boolean).join(", ")}
            </span>
          </li>
        ))}
    </ul>
  );
}
