import { test, expect } from "@playwright/test";

// Fixture matching Open-Meteo forecast API response shape
const MOCK_FORECAST = {
  current: {
    time: "2026-06-10T14:00",
    temperature_2m: 22,
    apparent_temperature: 20,
    weather_code: 1,
    is_day: 1,
    wind_speed_10m: 15,
    wind_direction_10m: 180, // South
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
    time: [
      "2026-06-10",
      "2026-06-11",
      "2026-06-12",
      "2026-06-13",
      "2026-06-14",
      "2026-06-15",
      "2026-06-16",
    ],
    weather_code: Array(7).fill(1),
    temperature_2m_max: Array(7).fill(25),
    temperature_2m_min: Array(7).fill(15),
    precipitation_probability_max: Array(7).fill(10),
    sunrise: [
      "2026-06-10T05:30",
      "2026-06-11T05:31",
      "2026-06-12T05:32",
      "2026-06-13T05:33",
      "2026-06-14T05:34",
      "2026-06-15T05:35",
      "2026-06-16T05:36",
    ],
    sunset: [
      "2026-06-10T20:45",
      "2026-06-11T20:44",
      "2026-06-12T20:43",
      "2026-06-13T20:42",
      "2026-06-14T20:41",
      "2026-06-15T20:40",
      "2026-06-16T20:39",
    ],
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
    route.fulfill({
      json: {
        display_name: "London, England, GB",
        address: {
          city: "London",
          country: "United Kingdom",
          country_code: "gb",
          state: "England",
        },
      },
    })
  );
}

test.describe("Details panel — F6", () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await page.goto("/");
    // Select London via search to load weather data
    await page.getByRole("combobox").fill("London");
    await page.getByRole("option", { name: /London/ }).first().click();
    // Wait for hero data to render
    await expect(page.getByText(/°C|°F/)).toBeVisible({ timeout: 5000 });
  });

  test("Details button is visible with ≥ 44px height", async ({ page }) => {
    const btn = page.getByRole("button", { name: /details/i });
    await expect(btn).toBeVisible();
    const box = await btn.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test("panel is collapsed by default", async ({ page }) => {
    const btn = page.getByRole("button", { name: /details/i });
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#details-panel-content")).not.toBeVisible();
  });

  test("clicking Details expands the panel and shows UV index", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /details/i }).click();
    const content = page.locator("#details-panel-content");
    await expect(content).toBeVisible();
    // UV index from mock: 7
    await expect(content).toContainText("7");
    // Wind direction: 180° = South = "S"
    await expect(content).toContainText("S");
    await expect(content).toContainText("180°");
  });

  test("panel shows sunrise and sunset", async ({ page }) => {
    await page.getByRole("button", { name: /details/i }).click();
    await expect(page.locator("#details-panel-content")).toBeVisible();
    await expect(page.locator("#details-panel-content")).toContainText(
      /5:30|5:31/
    );
    await expect(page.locator("#details-panel-content")).toContainText(
      /8:45|20:45/
    );
  });

  test("clicking Details again collapses the panel", async ({ page }) => {
    const btn = page.getByRole("button", { name: /details/i });
    await btn.click();
    await expect(page.locator("#details-panel-content")).toBeVisible();
    await btn.click();
    await expect(page.locator("#details-panel-content")).not.toBeVisible();
    await expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  test("panel resets to collapsed when new city selected", async ({ page }) => {
    // Expand the panel
    await page.getByRole("button", { name: /details/i }).click();
    await expect(page.locator("#details-panel-content")).toBeVisible();

    // Select same city again (triggers new selection → reset)
    await page.getByRole("combobox").clear();
    await page.getByRole("combobox").fill("London");
    await page.getByRole("option", { name: /London/ }).first().click();
    await expect(page.getByText(/°C|°F/)).toBeVisible({ timeout: 5000 });

    // Panel should be collapsed after new city load
    const btn = page.getByRole("button", { name: /details/i });
    await expect(btn).toHaveAttribute("aria-expanded", "false");
  });
});
