import { useRecentSearches } from "../../hooks/useRecentSearches";
import type { LocationResult } from "../../types/weather";

interface Props {
  onSelect: (location: LocationResult) => void;
}

/**
 * Horizontal chip row displayed below the search bar.
 * LOCKED DECISION: always visible when searches exist (not just while searching);
 *   horizontal row; up to 5 chips; one-tap reloads weather.
 */
export function RecentSearchChips({ onSelect }: Props) {
  const { searches } = useRecentSearches();

  if (searches.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap mt-2" role="group" aria-label="Recent searches">
      {searches.map((search) => (
        <button
          key={`${search.latitude}-${search.longitude}`}
          type="button"
          onClick={() =>
            onSelect({
              name: search.name,
              latitude: search.latitude,
              longitude: search.longitude,
              timezone: search.timezone,
            })
          }
          className="
            inline-flex items-center px-3 py-1.5 rounded-full
            bg-white border border-gray-300 text-sm text-gray-700
            hover:bg-gray-50 hover:border-gray-400
            min-h-[44px] transition-colors
            focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1
          "
        >
          {search.name.split(",")[0]}
        </button>
      ))}
    </div>
  );
}
