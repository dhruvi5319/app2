import { test, expect } from "@playwright/test";

// Same mock fixture as details.spec.ts
const MOCK_FORECAST = {
  current: {
    time: "2026-06-10T14:00",
    temperature_2m: 22,
    apparent_temperature: 20,
    weather_code: 1,
    is_day: 1,
    wind_speed_10m: 15,
    wind_direction_10m: 180,
    relative_humidity_2m: 60,
  },
  hourly: {
    time: Array.from({ length: 168 }, (_, i) => {
      const d = new Date("2026-06-10T14:00:00Z");
      d.setHours(d.getHours() + i);
      return d.toISOString().slice(0, 16);
    }),
    temperature_2m: Array(168).fill(22),
    weather_code: Array(168).fill(1),
    is_day: Array(168).fill(1),
    precipitation_probability: Array(168).fill(10),
  },
  daily: {
    time: ["2026-06-10", "2026-06-11", "2026-06-12", "2026-06-13", "2026-06-14", "2026-06-15", "2026-06-16"],
    weather_code: Array(7).fill(1),
    temperature_2m_max: Array(7).fill(25),
    temperature_2m_min: Array(7).fill(15),
    precipitation_probability_max: Array(7).fill(10),
    sunrise: ["2026-06-10T05:30", "2026-06-11T05:31", "2026-06-12T05:32", "2026-06-13T05:33", "2026-06-14T05:34", "2026-06-15T05:35", "2026-06-16T05:36"],
    sunset:  ["2026-06-10T20:45", "2026-06-11T20:44", "2026-06-12T20:43", "2026-06-13T20:42", "2026-06-14T20:41", "2026-06-15T20:40", "2026-06-16T20:39"],
    uv_index_max: [7, 6, 5, 6, 7, 8, 6],
    wind_speed_10m_max: Array(7).fill(20),
    wind_direction_10m_dominant: Array(7).fill(180),
  },
};

const MOCK_GEOCODING = {
  results: [
    {
      id: 1,
      name: "London",
      country: "United Kingdom",
      country_code: "GB",
      admin1: "England",
      latitude: 51.5,
      longitude: -0.12,
      timezone: "Europe/London",
      population: 8961989,
    },
  ],
};

async function setupMocks(page: import("@playwright/test").Page) {
  await page.route("**/open-meteo.com/v1/forecast**", (route) =>
    route.fulfill({ json: MOCK_FORECAST })
  );
  await page.route("**/geocoding-api.open-meteo.com/**", (route) =>
    route.fulfill({ json: MOCK_GEOCODING })
  );
  await page.route("**/nominatim.openstreetmap.org/**", (route) =>
    route.fulfill({ json: { display_name: "London, England, GB", address: { city: "London", country: "United Kingdom", country_code: "gb", state: "England" } } })
  );
}

test.describe("Freshness and offline — F7", () => {
  test("freshness indicator visible when data loaded", async ({ page }) => {
    await setupMocks(page);
    await page.goto("/");
    await page.getByRole("combobox").fill("London");
    await page.getByRole("option", { name: /London/ }).first().click();
    // Wait for weather to render
    await expect(page.getByText(/°C|°F/)).toBeVisible({ timeout: 5000 });
    // Freshness indicator: "Just now" or "Updated X minutes ago"
    await expect(page.getByText(/just now|updated.*ago/i)).toBeVisible();
  });

  test("no offline banner when online with data", async ({ page }) => {
    await setupMocks(page);
    await page.goto("/");
    await page.getByRole("combobox").fill("London");
    await page.getByRole("option", { name: /London/ }).first().click();
    await expect(page.getByText(/°C|°F/)).toBeVisible({ timeout: 5000 });
    // No offline banner when online
    await expect(page.getByRole("alert", { name: /offline/i })).not.toBeVisible();
  });

  test("offline banner appears when going offline with cached data", async ({ page }) => {
    await setupMocks(page);
    await page.goto("/");
    // Load data first
    await page.getByRole("combobox").fill("London");
    await page.getByRole("option", { name: /London/ }).first().click();
    await expect(page.getByText(/°C|°F/)).toBeVisible({ timeout: 5000 });

    // Go offline
    await page.context().setOffline(true);
    // Banner should appear
    await expect(page.getByRole("alert")).toBeVisible({ timeout: 3000 });
    await expect(page.getByRole("alert")).toContainText(/offline/i);
  });

  test("offline banner disappears when coming back online", async ({ page }) => {
    await setupMocks(page);
    await page.goto("/");
    await page.getByRole("combobox").fill("London");
    await page.getByRole("option", { name: /London/ }).first().click();
    await expect(page.getByText(/°C|°F/)).toBeVisible({ timeout: 5000 });

    await page.context().setOffline(true);
    await expect(page.getByRole("alert")).toBeVisible({ timeout: 3000 });

    await page.context().setOffline(false);
    await expect(page.getByRole("alert")).not.toBeVisible({ timeout: 3000 });
  });

  test("no blank screen when offline with no cached data", async ({ page }) => {
    // Do NOT load any city — go offline immediately
    await page.route("**/open-meteo.com/v1/forecast**", (route) => route.abort());
    await page.route("**/geocoding-api.open-meteo.com/**", (route) => route.abort());
    await page.goto("/");
    // App should show empty state prompt, not a blank screen
    await expect(page.getByText(/search for a city/i)).toBeVisible();
    // No blank / empty body
    const bodyText = await page.evaluate(() => document.body.innerText.trim());
    expect(bodyText.length).toBeGreaterThan(0);
  });

  test("error state (not blank screen) when network fails with no cache", async ({ page }) => {
    // Routes return geocoding results but forecast fails
    await page.route("**/geocoding-api.open-meteo.com/**", (route) =>
      route.fulfill({ json: MOCK_GEOCODING })
    );
    await page.route("**/open-meteo.com/v1/forecast**", (route) => route.abort());
    await page.goto("/");
    await page.getByRole("combobox").fill("London");
    await page.getByRole("option", { name: /London/ }).first().click();
    // Should show retry button, not blank screen
    await expect(page.getByRole("button", { name: /retry/i })).toBeVisible({ timeout: 8000 });
  });
});
