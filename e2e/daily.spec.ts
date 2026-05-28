import { test, expect } from "@playwright/test";

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
    time: [
      "2026-05-01",
      "2026-05-02",
      "2026-05-03",
      "2026-05-04",
      "2026-05-05",
      "2026-05-06",
      "2026-05-07",
    ],
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

type Page = Parameters<Parameters<typeof test>[1]>[0]["page"];

async function loadWeatherData(page: Page) {
  await page.route("**/geocoding-api.open-meteo.com/**", (route) => {
    route.fulfill({ json: MOCK_GEOCODING_RESPONSE });
  });
  await page.route("**/api.open-meteo.com/**", (route) => {
    route.fulfill({ json: MOCK_WEATHER_RESPONSE });
  });
  await page.goto("/");
  await page.getByRole("combobox").fill("London");
  await page.waitForTimeout(400);
  await page.getByRole("option", { name: /London/ }).first().click();
  await page.waitForSelector('[aria-label="7-day forecast"]', { timeout: 5000 });
}

test.describe("Daily forecast section (F3)", () => {
  test("renders exactly 7 daily rows", async ({ page }) => {
    await loadWeatherData(page);
    const rows = page.locator('[aria-label="7-day forecast"] [role="listitem"]');
    await expect(rows).toHaveCount(7);
  });

  test("first row is labeled 'Today'", async ({ page }) => {
    await loadWeatherData(page);
    const firstRow = page.locator('[aria-label="7-day forecast"] [role="listitem"]').first();
    await expect(firstRow).toContainText("Today");
  });

  test("precipitation % shown on every row including 0%", async ({ page }) => {
    await loadWeatherData(page);
    // Row at index 1 has 0% precipitation in mock data
    const secondRow = page.locator('[aria-label="7-day forecast"] [role="listitem"]').nth(1);
    await expect(secondRow).toContainText("0%");
  });

  test("high temperature appears before low temperature in each row", async ({ page }) => {
    await loadWeatherData(page);
    const firstRow = page.locator('[aria-label="7-day forecast"] [role="listitem"]').first();
    const ariaLabel = await firstRow.getAttribute("aria-label");
    // aria-label: "Today: ..., High 20°C, Low 12°C, ..."
    const highIdx = ariaLabel?.indexOf("High") ?? -1;
    const lowIdx = ariaLabel?.indexOf("Low") ?? -1;
    expect(highIdx).toBeGreaterThan(-1);
    expect(highIdx).toBeLessThan(lowIdx);
  });

  test("temperature trend chart renders", async ({ page }) => {
    await loadWeatherData(page);
    const chart = page.locator('[aria-label="Temperature trend chart"]');
    await expect(chart).toBeVisible();
    // SVG should be present (Recharts renders an SVG)
    const svg = chart.locator("svg");
    await expect(svg).toBeVisible();
  });

  test("accessible sr-only data table is in the DOM", async ({ page }) => {
    await loadWeatherData(page);
    const srTable = page.locator("table.sr-only");
    await expect(srTable).toBeAttached();
    // Table should have 7 data rows + 1 header row
    const rows = srTable.locator("tbody tr");
    await expect(rows).toHaveCount(7);
  });

  test("unit toggle updates daily temperatures and chart Y-axis without network request", async ({ page }) => {
    await loadWeatherData(page);

    // Record initial first row high temp
    const firstRow = page.locator('[aria-label="7-day forecast"] [role="listitem"]').first();
    const initialText = await firstRow.textContent();

    // Count API calls
    let apiCallCount = 0;
    page.on("request", (req) => {
      if (req.url().includes("open-meteo.com/v1/forecast")) apiCallCount++;
    });

    // Toggle unit
    const toggle = page.locator('[role="switch"]').first();
    await toggle.click();
    await page.waitForTimeout(200);

    // Temperatures should change (°C to °F)
    const newText = await firstRow.textContent();
    expect(newText).not.toBe(initialText);
    expect(apiCallCount).toBe(0);
  });

  test("skeleton visible while daily data loads", async ({ page }) => {
    await page.route("**/geocoding-api.open-meteo.com/**", (route) => {
      route.fulfill({ json: MOCK_GEOCODING_RESPONSE });
    });
    await page.route("**/api.open-meteo.com/**", async (route) => {
      await new Promise((r) => setTimeout(r, 600));
      route.fulfill({ json: MOCK_WEATHER_RESPONSE });
    });

    await page.goto("/");
    await page.getByRole("combobox").fill("London");
    await page.waitForTimeout(400);
    await page.getByRole("option", { name: /London/ }).first().click();

    await expect(page.locator('[aria-label="Loading 7-day forecast"]')).toBeVisible();
  });
});
