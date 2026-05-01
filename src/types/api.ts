/** Raw shape returned by the Open-Meteo Geocoding API. */
export interface OpenMeteoGeocodingResponse {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    feature_code: string;
    country_code: string;
    admin1_id: number;
    admin2_id?: number;
    timezone: string;
    population?: number;
    country_id: number;
    country: string;
    admin1?: string;
    admin2?: string;
  }>;
  generationtime_ms: number;
}

/** Raw shape returned by the Open-Meteo Forecast API. */
export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;

  current_units: Record<string, string>;
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    apparent_temperature: number;
    weather_code: number;
    is_day: number;            // 1 = day, 0 = night
    wind_speed_10m: number;
    wind_direction_10m: number;
    relative_humidity_2m: number;
  };

  hourly_units: Record<string, string>;
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    is_day: number[];
    precipitation_probability: (number | null)[];
  };

  daily_units: Record<string, string>;
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: (number | null)[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: (number | null)[];
    wind_speed_10m_max: number[];
    wind_direction_10m_dominant: number[];
  };
}

/** Raw shape returned by the Nominatim Reverse Geocoding API. */
export interface NominatimReverseResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country: string;
    country_code: string;
    postcode?: string;
  };
  boundingbox: string[];
}
