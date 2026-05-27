import { useState, useRef, useCallback, useId } from "react";
import { useGeocodingSearch } from "../../hooks/useGeocodingSearch";
import { useRecentSearches } from "../../hooks/useRecentSearches";
import { AutocompleteDropdown } from "./AutocompleteDropdown";
import { GpsButton } from "./GpsButton";
import { RecentSearchChips } from "./RecentSearchChips";
import type { GeocodingResult, LocationResult } from "../../types/weather";

interface Props {
  onLocationSelect: (location: LocationResult) => void;
}

/**
 * Full-width search bar pinned to the top of the page.
 * LOCKED DECISIONS:
 * - Full-width, pinned to top
 * - GPS button inside right edge of the bar
 * - Autocomplete: floating dropdown combobox, appears after 2+ chars, dismissed on select/outside click
 * - Recent chips: horizontal row below search bar, always visible when searches exist
 *
 * Keyboard: ↑↓ to navigate suggestions, Enter to select, Escape to close dropdown.
 * Form submission (Enter with no active suggestion): selects first suggestion if available.
 */
export function SearchBar({ onLocationSelect }: Props) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const { data: suggestions = [], isLoading: isSuggesting } = useGeocodingSearch(query);
  const { addSearch } = useRecentSearches();

  const handleSelect = useCallback(
    (result: GeocodingResult) => {
      const location: LocationResult = {
        name: [result.name, result.admin1, result.countryCode]
          .filter(Boolean)
          .join(", "),
        latitude: result.latitude,
        longitude: result.longitude,
        timezone: result.timezone,
      };
      setQuery(location.name);
      setIsOpen(false);
      setActiveIndex(-1);
      addSearch(location);
      onLocationSelect(location);
    },
    [addSearch, onLocationSelect],
  );

  const handleGpsLocation = useCallback(
    (location: LocationResult) => {
      setQuery(location.name);
      addSearch(location);
      onLocationSelect(location);
    },
    [addSearch, onLocationSelect],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, -1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const targetIndex = activeIndex >= 0 ? activeIndex : 0;
        if (suggestions[targetIndex]) {
          handleSelect(suggestions[targetIndex]);
        }
      } else if (e.key === "Escape") {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    },
    [isOpen, activeIndex, suggestions, handleSelect],
  );

  // Error messages from geocoding
  const showNoResults =
    !isSuggesting && query.trim().length >= 2 && suggestions.length === 0 && !isOpen;

  return (
    <div>
      {/* Search bar container */}
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (suggestions.length > 0) handleSelect(suggestions[0]);
        }}
        className="relative"
      >
        <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-200 pr-1">
          {/* Search icon (magnifying glass on left per CONTEXT.md discretion) */}
          <svg
            className="w-5 h-5 ml-3 text-gray-400 flex-shrink-0"
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            ref={inputRef}
            id={inputId}
            type="search"
            role="combobox"
            aria-expanded={isOpen && suggestions.length > 0}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-controls={`${inputId}-listbox`}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => {
              if (query.trim().length >= 2) setIsOpen(true);
            }}
            onBlur={() => {
              // Delay close to allow mousedown on dropdown items to fire first
              setTimeout(() => setIsOpen(false), 150);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search for a city..."
            className="flex-1 py-3 px-3 bg-transparent text-gray-900 placeholder-gray-400 text-base focus:outline-none min-h-[44px]"
            autoComplete="off"
            spellCheck={false}
          />

          {/* GPS button — LOCKED: inside right edge of search bar */}
          <GpsButton onLocationResolved={handleGpsLocation} />
        </div>

        {/* Autocomplete dropdown — LOCKED: floating combobox below bar */}
        {isOpen && (
          <AutocompleteDropdown
            results={suggestions}
            isLoading={isSuggesting}
            activeIndex={activeIndex}
            onSelect={handleSelect}
            onActiveIndexChange={setActiveIndex}
            inputId={`${inputId}-listbox`}
          />
        )}

        {/* No results inline message (FRD §F0 error states) */}
        {showNoResults && (
          <p className="mt-1 text-sm text-gray-500 px-1" role="status">
            City not found — try a different spelling
          </p>
        )}
      </form>

      {/* Recent search chips — LOCKED: horizontal row below search bar, always visible when searches exist */}
      <RecentSearchChips onSelect={onLocationSelect} />
    </div>
  );
}
