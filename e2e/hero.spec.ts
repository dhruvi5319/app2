import { test, expect } from "@playwright/test";

// Helper: mock the weather API with realistic data
async function mockWeatherApi(page: import("@playwright/test").Page) {
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
        current_units: { temperature_2m: "°C" },
        current: {
          time: "2026-05-01T14:00",
          interval: 900,
          temperature_2m: 18.47,         // Should display as 18 after Math.round
          apparent_temperature: 16.2,    // Should display as 16 after Math.round
          weather_code: 2,               // Partly Cloudy
          is_day: 1,
          wind_speed_10m: 12.3,         // Should display as 12 km/h
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
          temperature_2m_max: [22.7, 20, 18, 24, 23, 21, 19],   // Should display as integers
          temperature_2m_min: [12.3, 11, 10, 14, 13, 12, 11],
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

// Helper: mock geocoding API
async function mockGeocodingApi(page: import("@playwright/test").Page) {
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
}

// Helper: select a city to trigger weather display
async function selectCity(page: import("@playwright/test").Page) {
  await page.getByRole("combobox").fill("Lo");
  await page.waitForTimeout(400);
  await page.getByRole("option").first().click();
  // Wait for weather data to load
  await page.waitForResponse("**/api.open-meteo.com/**", { timeout: 10_000 });
  await page.waitForTimeout(500);
}

test.describe("Hero section — F1: Current Conditions Display", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.removeItem("weather_recent_searches");
      localStorage.removeItem("weather_unit_preference");
    });
    await page.reload();
  });

  test("AC-F1-06: skeleton appears while weather data is loading", async ({ page }) => {
    // Don't resolve the weather API immediately — use delayed response
    await page.route("**/api.open-meteo.com/**", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({}) });
    });
    await mockGeocodingApi(page);

    await page.getByRole("combobox").fill("Lo");
    await page.waitForTimeout(400);
    await page.getByRole("option").first().click();

    // Skeleton should be visible during loading (animate-pulse element)
    const skeleton = page.locator(".animate-pulse");
    await expect(skeleton).toBeVisible({ timeout: 2000 });
  });

  test("AC-F1-07: error state with Try again button on API failure", async ({ page }) => {
    await page.route("**/api.open-meteo.com/**", async (route) => {
      await route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ error: "Server error" }) });
    });
    await mockGeocodingApi(page);

    await page.getByRole("combobox").fill("Lo");
    await page.waitForTimeout(400);
    await page.getByRole("option").first().click();
    await page.waitForTimeout(3000); // Wait for retries to exhaust

    await expect(page.getByText(/Unable to load weather/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("button", { name: /try again/i })).toBeVisible();
  });

  test("AC-F1-01: temperature displayed as integer (no decimal)", async ({ page }) => {
    await mockWeatherApi(page);
    await mockGeocodingApi(page);
    await selectCity(page);

    // Temperature should be "18" not "18.47"
    await expect(page.getByText(/^18°C$|^18°/)).toBeVisible();
    // Ensure no decimal is shown for the main temp
    const tempText = await page.locator("span.text-7xl").textContent();
    expect(tempText).not.toMatch(/\./);
    expect(tempText?.trim()).toBe("18");
  });

  test("AC-F1-02: all hero data points visible above fold at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await mockWeatherApi(page);
    await mockGeocodingApi(page);
    await selectCity(page);

    // All key data points must be visible
    await expect(page.getByText(/Partly Cloudy/i)).toBeVisible();
    await expect(page.getByText(/Feels like/i)).toBeVisible();
    await expect(page.getByText(/H:.*L:/i)).toBeVisible();
    await expect(page.getByText(/Humidity/i)).toBeVisible();
    await expect(page.getByText(/Wind/i)).toBeVisible();
    await expect(page.getByText(/💧/)).toBeVisible();

    // Verify no scrolling needed — all above 812px fold
    const heroSection = page.locator("[style*='linear-gradient']").first();
    const heroBox = await heroSection.boundingBox();
    // Hero section bottom should be within the viewport
    expect(heroBox!.y + heroBox!.height).toBeLessThanOrEqual(812);
  });

  test("AC-F1-03: unit toggle is visible at all times", async ({ page }) => {
    await page.goto("/");
    // Unit toggle should be visible even with no location selected
    await expect(page.getByRole("switch")).toBeVisible();
  });

  test("AC-F1-04 + AC-F1-05: unit toggle updates temperatures and persists", async ({ page }) => {
    await mockWeatherApi(page);
    await mockGeocodingApi(page);
    await selectCity(page);

    // Initially in Celsius
    await expect(page.getByText(/18°C/)).toBeVisible();

    // Toggle to Fahrenheit
    await page.getByRole("switch").click();

    // Temperature should now show Fahrenheit: Math.round((18 * 9/5) + 32) = 64
    await expect(page.getByText(/64°F/)).toBeVisible();
    // No network request should have been made (check by verifying same weather data)
    await expect(page.getByText(/Partly Cloudy/i)).toBeVisible();

    // Reload page — preference should persist
    await page.reload();
    await mockWeatherApi(page);
    await mockGeocodingApi(page);
    // Reload recent search if available via localStorage
    const unitPref = await page.evaluate(() => localStorage.getItem("weather_unit_preference"));
    expect(unitPref).toBe("fahrenheit");
  });

  test("AC-F1-08 + AC-F1-09: condition icon paired with label", async ({ page }) => {
    await mockWeatherApi(page);
    await mockGeocodingApi(page);
    await selectCity(page);

    // Condition label "Partly Cloudy" must be present alongside icon
    await expect(page.getByText("Partly Cloudy")).toBeVisible();
    // Icon should have aria-hidden (not conveying info to screen readers via icon alone)
    const icon = page.locator("img[aria-hidden='true']").first();
    await expect(icon).toBeVisible();
  });

  test("AC-F1-10: wind speed shows km/h in Celsius mode, mph in Fahrenheit mode", async ({ page }) => {
    await mockWeatherApi(page);
    await mockGeocodingApi(page);
    await selectCity(page);

    // Celsius: wind speed in km/h (raw value 12.3 → rounded 12)
    await expect(page.getByText(/12 km\/h/i)).toBeVisible();

    // Switch to Fahrenheit: wind should switch to mph (Math.round(12.3 * 0.621371) = 8)
    await page.getByRole("switch").click();
    await expect(page.getByText(/\d+ mph/i)).toBeVisible();
    await expect(page.getByText(/km\/h/)).not.toBeVisible();
  });
});
