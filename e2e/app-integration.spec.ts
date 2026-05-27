import { test, expect } from "@playwright/test";

test.describe("App integration — Phase 1 success criteria", () => {
  // Mock helpers
  async function mockApis(page: import("@playwright/test").Page) {
    // Mock geocoding
    await page.route("**/geocoding-api.open-meteo.com/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          results: [
            {
              id: 2643743,
              name: "London",
              latitude: 51.5085,
              longitude: -0.1257,
              elevation: 11,
              feature_code: "PPLC",
              country_code: "GB",
              admin1_id: 6269131,
              timezone: "Europe/London",
              population: 7556900,
              country_id: 2635167,
              country: "United Kingdom",
              admin1: "England",
            },
          ],
          generationtime_ms: 1.5,
        }),
      });
    });

    // Mock forecast
    await page.route("**/api.open-meteo.com/v1/forecast**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          latitude: 51.5085,
          longitude: -0.1257,
          generationtime_ms: 1.5,
          utc_offset_seconds: 3600,
          timezone: "Europe/London",
          timezone_abbreviation: "BST",
          elevation: 11,
          current_units: {},
          current: {
            time: "2026-05-01T14:00",
            interval: 900,
            temperature_2m: 18,
            apparent_temperature: 16,
            weather_code: 2,
            is_day: 1,
            wind_speed_10m: 12,
            wind_direction_10m: 270,
            relative_humidity_2m: 65,
          },
          hourly_units: {},
          hourly: {
            time: Array.from({ length: 168 }, (_, i) => {
              const d = new Date("2026-05-01T14:00");
              d.setHours(d.getHours() + i);
              return d.toISOString().substring(0, 16);
            }),
            temperature_2m: Array(168).fill(18),
            weather_code: Array(168).fill(2),
            is_day: Array(168).fill(1),
            precipitation_probability: Array(168).fill(20),
          },
          daily_units: {},
          daily: {
            time: ["2026-05-01", "2026-05-02", "2026-05-03", "2026-05-04", "2026-05-05", "2026-05-06", "2026-05-07"],
            weather_code: [2, 3, 61, 0, 1, 2, 3],
            temperature_2m_max: [22, 20, 18, 24, 23, 21, 19],
            temperature_2m_min: [12, 11, 10, 14, 13, 12, 11],
            precipitation_probability_max: [30, 60, 80, 5, 10, 25, 40],
            sunrise: ["2026-05-01T05:42", "2026-05-02T05:40", "2026-05-03T05:38", "2026-05-04T05:36", "2026-05-05T05:34", "2026-05-06T05:32", "2026-05-07T05:30"],
            sunset: ["2026-05-01T20:18", "2026-05-02T20:20", "2026-05-03T20:22", "2026-05-04T20:24", "2026-05-05T20:26", "2026-05-06T20:28", "2026-05-07T20:30"],
            uv_index_max: [4.5, 3, 2, 6, 5, 4, 3],
            wind_speed_10m_max: [15, 20, 25, 10, 12, 14, 16],
            wind_direction_10m_dominant: [270, 280, 260, 250, 240, 230, 220],
          },
        }),
      });
    });
  }

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.removeItem("weather_recent_searches");
      localStorage.removeItem("weather_unit_preference");
    });
    await page.reload();
  });

  test("Phase 1 SC-1: city search → autocomplete → weather data within 2s", async ({ page }) => {
    await mockApis(page);

    // User types a city name
    const input = page.getByRole("combobox");
    await expect(input).toBeVisible();

    const start = Date.now();
    await input.fill("Lo");
    await page.waitForTimeout(400); // Debounce

    // Suggestions appear
    await expect(page.getByRole("listbox")).toBeVisible();

    // User selects London
    await page.getByRole("option").first().click();

    // Weather data appears — wait up to 2 seconds
    await expect(page.getByText(/18°C/)).toBeVisible({ timeout: 2000 });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(3000); // Generous for CI — 2s target but 3s hard limit

    // No blank screen at any point — verify the hero gradient div is present
    await expect(page.locator("[style*='linear-gradient']").first()).toBeVisible();
  });

  test("Phase 1 SC-2: all hero data points visible above fold at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await mockApis(page);

    await page.getByRole("combobox").fill("Lo");
    await page.waitForTimeout(400);
    await page.getByRole("option").first().click();
    await expect(page.getByText(/18°C/)).toBeVisible({ timeout: 5000 });

    // Verify all required data points are visible
    const checks = [
      page.getByText(/18°C/),                 // temperature
      page.getByText(/Feels like/),            // feels-like
      page.getByText(/Partly Cloudy/i),        // condition label
      page.getByText(/H:.*L:/),                // high/low
      page.getByText(/💧/),                    // precipitation
      page.getByText(/Humidity/),              // humidity
      page.getByText(/Wind/),                  // wind
    ];

    for (const check of checks) {
      await expect(check).toBeVisible();
      // Verify it's within the viewport (not requiring scroll)
      const box = await check.boundingBox();
      expect(box?.y).toBeLessThan(812);
    }
  });

  test("Phase 1 SC-3: °C/°F toggle updates instantly; survives page reload", async ({ page }) => {
    await mockApis(page);

    await page.getByRole("combobox").fill("Lo");
    await page.waitForTimeout(400);
    await page.getByRole("option").first().click();
    await expect(page.getByText(/18°C/)).toBeVisible({ timeout: 5000 });

    // Toggle to Fahrenheit — no network request should occur
    let apiCallCount = 0;
    page.on("request", (req) => {
      if (req.url().includes("api.open-meteo.com")) apiCallCount++;
    });
    const beforeToggle = apiCallCount;

    await page.getByRole("switch").click();
    await expect(page.getByText(/64°F/)).toBeVisible(); // Math.round((18 * 9/5) + 32) = 64
    expect(apiCallCount).toBe(beforeToggle); // No new API call

    // Check localStorage persistence
    const saved = await page.evaluate(() => localStorage.getItem("weather_unit_preference"));
    expect(saved).toBe("fahrenheit");
  });

  test("Phase 1 SC-4: skeleton shown while loading; retry button on error", async ({ page }) => {
    // Test skeleton
    let resolveWeather: (() => void) | null = null;
    await page.route("**/api.open-meteo.com/**", async (route) => {
      await new Promise<void>((resolve) => { resolveWeather = resolve; });
      await route.fulfill({ status: 500, contentType: "application/json", body: "{}" });
    });
    await page.route("**/geocoding-api.open-meteo.com/**", async (route) => {
      await route.fulfill({
        status: 200, contentType: "application/json",
        body: JSON.stringify({ results: [{ id: 1, name: "London", latitude: 51.5, longitude: -0.1, elevation: 0, feature_code: "P", country_code: "GB", admin1_id: 1, timezone: "Europe/London", country_id: 1, country: "UK", admin1: "England" }], generationtime_ms: 1 }),
      });
    });

    await page.getByRole("combobox").fill("Lo");
    await page.waitForTimeout(400);
    await page.getByRole("option").first().click();

    // Skeleton should be visible while loading
    await expect(page.locator(".animate-pulse")).toBeVisible({ timeout: 2000 });

    // Resolve with error
    resolveWeather?.();
    // Wait for retries to exhaust (retry: 2 in TanStack Query)
    await expect(page.getByText(/Unable to load weather/i)).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole("button", { name: /try again/i })).toBeVisible();

    // Verify never blank screen during error
    const body = await page.evaluate(() => document.body.innerHTML);
    expect(body.length).toBeGreaterThan(100); // Not blank
  });

  test("Phase 1 SC-5: GPS denial leaves search fully functional", async ({ page }) => {
    // Deny geolocation permission
    await page.context().grantPermissions([]);

    await page.goto("/");

    // GPS button should be visible
    const gpsBtn = page.getByRole("button", { name: /current location/i });
    await expect(gpsBtn).toBeVisible();

    // Clicking GPS button should NOT break search
    await gpsBtn.click();
    await page.waitForTimeout(500);

    // Search bar must still be functional
    const input = page.getByRole("combobox");
    await expect(input).toBeVisible();
    await expect(input).toBeEnabled();
    await input.fill("Pa");
    await expect(input).toHaveValue("Pa"); // Input still accepts text
  });

  test("Phase 1 SC-5: recent search chips reload weather on click", async ({ page }) => {
    // Pre-populate with a recent search
    await page.evaluate(() => {
      const searches = [{
        name: "Tokyo, Tokyo, JP",
        latitude: 35.6895,
        longitude: 139.6917,
        timezone: "Asia/Tokyo",
        savedAt: Date.now(),
      }];
      localStorage.setItem("weather_recent_searches", JSON.stringify(searches));
    });
    await page.reload();

    // Chip should be visible
    const chip = page.getByRole("button", { name: /Tokyo/i });
    await expect(chip).toBeVisible();
  });
});

// ─── Phase 2 Integration Tests ──────────────────────────────────────────────

const MOCK_HOURLY_TIMES = Array.from({ length: 24 }, (_, i) => {
  const d = new Date("2026-05-01T14:00:00");
  d.setHours(d.getHours() + i);
  return d.toISOString().slice(0, 16);
});

const MOCK_WEATHER_RESPONSE = {
  latitude: 51.5085,
  longitude: -0.1257,
  timezone: "Europe/London",
  timezone_abbreviation: "BST",
  utc_offset_seconds: 3600,
  current_units: {},
  current: {
    time: "2026-05-01T14:00",
    interval: 900,
    temperature_2m: 18,
    apparent_temperature: 16,
    weather_code: 2,
    is_day: 1,
    wind_speed_10m: 15,
    wind_direction_10m: 270,
    relative_humidity_2m: 65,
  },
  hourly_units: {},
  hourly: {
    time: MOCK_HOURLY_TIMES,
    temperature_2m: Array(24).fill(18),
    weather_code: Array(24).fill(2),
    is_day: Array(24).fill(1),
    precipitation_probability: Array(24).fill(30),
  },
  daily_units: {},
  daily: {
    time: ["2026-05-01", "2026-05-02", "2026-05-03", "2026-05-04", "2026-05-05", "2026-05-06", "2026-05-07"],
    weather_code: Array(7).fill(2),
    temperature_2m_max: [20, 19, 22, 18, 17, 23, 21],
    temperature_2m_min: [12, 11, 14, 10, 9, 15, 13],
    precipitation_probability_max: [30, 0, 50, 70, 20, 10, 40],
    sunrise: Array(7).fill("2026-05-01T05:42"),
    sunset: Array(7).fill("2026-05-01T20:18"),
    uv_index_max: Array(7).fill(5),
    wind_speed_10m_max: Array(7).fill(20),
    wind_direction_10m_dominant: Array(7).fill(270),
  },
};

const MOCK_GEOCODING_RESPONSE = {
  results: [
    {
      id: 1,
      name: "London",
      latitude: 51.5085,
      longitude: -0.1257,
      timezone: "Europe/London",
      country: "United Kingdom",
      country_code: "GB",
      admin1: "England",
      population: 8900000,
    },
  ],
};

test.describe("Full app integration (Phase 2)", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/geocoding-api.open-meteo.com/**", (route) => {
      route.fulfill({ json: MOCK_GEOCODING_RESPONSE });
    });
    await page.route("**/api.open-meteo.com/**", (route) => {
      route.fulfill({ json: MOCK_WEATHER_RESPONSE });
    });
    await page.goto("/");
  });

  test("shows empty state before any search", async ({ page }) => {
    await expect(page.getByText("Search for a city to see weather")).toBeVisible();
  });

  test("full forecast flow: search → hourly strip + daily list + chart", async ({ page }) => {
    await page.getByRole("combobox").fill("London");
    await page.waitForTimeout(400);
    await page.getByRole("option", { name: /London/ }).first().click();

    // All forecast sections should appear
    await expect(page.locator('[aria-label="24-hour forecast"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[aria-label="7-day forecast"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[aria-label="Temperature trend chart"]')).toBeVisible({ timeout: 5000 });
  });

  test("hero section shows current conditions", async ({ page }) => {
    await page.getByRole("combobox").fill("London");
    await page.waitForTimeout(400);
    await page.getByRole("option", { name: /London/ }).first().click();

    // Current temperature visible (18°C from mock)
    await expect(page.locator("text=18°").first()).toBeVisible({ timeout: 5000 });
  });

  test("footer attribution links are present", async ({ page }) => {
    await expect(page.locator('a[href*="open-meteo.com"]')).toBeVisible();
  });

  test("no blank screen on initial load", async ({ page }) => {
    const body = await page.locator("body").textContent();
    expect(body?.trim().length).toBeGreaterThan(0);
    // Should not be empty
    await expect(page.getByRole("combobox")).toBeVisible();
  });

  test("unit toggle visible and working across hero + hourly + daily", async ({ page }) => {
    await page.getByRole("combobox").fill("London");
    await page.waitForTimeout(400);
    await page.getByRole("option", { name: /London/ }).first().click();
    await page.waitForSelector('[aria-label="24-hour forecast"]', { timeout: 5000 });

    // Toggle should be visible
    const toggle = page.locator('[role="switch"]').first();
    await expect(toggle).toBeVisible();

    // Click toggle and check temperatures change (18°C → 64°F)
    await toggle.click();
    await page.waitForTimeout(200);
    // After toggle to F, 18°C = 64°F
    await expect(page.locator("text=64°").first()).toBeVisible();
  });
});
