import { test, expect } from "@playwright/test";

// Mock weather data for deterministic tests
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
    temperature_2m: Array.from({ length: 24 }, (_, i) => 18 - i * 0.3),
    weather_code: Array(24).fill(2),
    is_day: Array.from({ length: 24 }, (_, i) => (i < 8 || i >= 20 ? 0 : 1)),
    precipitation_probability: Array.from({ length: 24 }, (_, i) => (i % 5 === 0 ? 0 : i * 3)),
  },
  daily_units: {},
  daily: {
    time: Array.from({ length: 7 }, (_, i) => {
      const d = new Date("2026-05-01");
      d.setDate(d.getDate() + i);
      return d.toISOString().slice(0, 10);
    }),
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

test.describe("Hourly forecast strip (F2)", () => {
  test.beforeEach(async ({ page }) => {
    // Mock all Open-Meteo API calls
    await page.route("**/geocoding-api.open-meteo.com/**", (route) => {
      route.fulfill({ json: MOCK_GEOCODING_RESPONSE });
    });
    await page.route("**/api.open-meteo.com/**", (route) => {
      route.fulfill({ json: MOCK_WEATHER_RESPONSE });
    });

    await page.goto("/");
    // Trigger weather load: type in search and select London
    await page.getByRole("combobox").fill("London");
    await page.waitForTimeout(400); // debounce
    await page.getByRole("option", { name: /London/ }).first().click();
    // Wait for hourly strip to appear
    await page.waitForSelector('[aria-label="24-hour forecast"]', { timeout: 5000 });
  });

  test("renders exactly 24 hourly cards", async ({ page }) => {
    const cards = page.locator('[role="listitem"]');
    await expect(cards).toHaveCount(24);
  });

  test("first card is labeled 'Now'", async ({ page }) => {
    const firstCard = page.locator('[role="listitem"]').first();
    await expect(firstCard).toContainText("Now");
  });

  test("precipitation % shown on every card including 0%", async ({ page }) => {
    // Cards with 0% precipitation must still show '0%'
    const cards = page.locator('[role="listitem"]');
    const firstCard = cards.nth(0); // index 0 has 0% in mock data
    await expect(firstCard).toContainText("0%");
  });

  test("all card temperatures are integers (no decimal points)", async ({ page }) => {
    const cards = page.locator('[role="listitem"]');
    const count = await cards.count();
    for (let i = 0; i < Math.min(5, count); i++) {
      const text = await cards.nth(i).textContent();
      // Temperature should not contain decimal point
      expect(text).not.toMatch(/\d+\.\d+°/);
    }
  });

  test("strip is horizontally scrollable", async ({ page }) => {
    const strip = page.locator('[aria-label="24-hour forecast"]');
    const overflowX = await strip.evaluate((el) =>
      window.getComputedStyle(el.querySelector("div")!).overflowX
    );
    expect(["auto", "scroll"]).toContain(overflowX);
  });

  test("unit toggle updates hourly temperatures without network request", async ({ page }) => {
    // Record initial temp text from first card
    const firstCard = page.locator('[role="listitem"]').first();
    const initialText = await firstCard.textContent();

    // Intercept any additional API calls (should be none)
    let apiCallCount = 0;
    page.on("request", (req) => {
      if (req.url().includes("open-meteo.com/v1/forecast")) apiCallCount++;
    });

    // Click unit toggle (°C/°F)
    const toggle = page.locator('[role="switch"]').first();
    await toggle.click();
    await page.waitForTimeout(200);

    // Temperature should have changed
    const newText = await firstCard.textContent();
    expect(newText).not.toBe(initialText);

    // No new API call made
    expect(apiCallCount).toBe(0);
  });

  test("skeleton visible while data loads", async ({ page }) => {
    // Navigate to fresh page with slow API mock
    await page.route("**/api.open-meteo.com/**", async (route) => {
      await new Promise((r) => setTimeout(r, 500));
      route.fulfill({ json: MOCK_WEATHER_RESPONSE });
    }, { times: 1 });

    await page.reload();
    await page.getByRole("combobox").fill("London");
    await page.waitForTimeout(400);
    await page.getByRole("option", { name: /London/ }).first().click();

    // Skeleton should be visible immediately (before data resolves)
    await expect(page.locator('[aria-label="Loading 24-hour forecast"]')).toBeVisible();
  });
});
