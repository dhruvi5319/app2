/**
 * Footer component with required data source attributions.
 * Open-Meteo: CC BY 4.0 — weather and geocoding data
 * Nominatim/OSM: ODbL — reverse geocoding
 */
export function Footer() {
  return (
    <footer className="mt-8 pb-6 text-center text-sm text-white/50 space-y-1">
      <p>
        Weather data by{" "}
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white/70 transition-colors"
        >
          Open-Meteo
        </a>{" "}
        (CC BY 4.0)
      </p>
      <p>
        Geocoding by{" "}
        <a
          href="https://nominatim.openstreetmap.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white/70 transition-colors"
        >
          Nominatim / OpenStreetMap
        </a>
      </p>
    </footer>
  );
}
