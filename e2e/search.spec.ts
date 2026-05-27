import { test, expect } from "@playwright/test";

test.describe("Search subsystem", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.removeItem("weather_recent_searches");
      localStorage.removeItem("weather_unit_preference");
    });
    await page.reload();
  });

  test("search bar is visible above the fold on load", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.getByRole("combobox");
    await expect(searchInput).toBeVisible();
    // Verify it is within the first 200px from the top
    const box = await searchInput.boundingBox();
    expect(box?.y).toBeLessThan(200);
  });

  test("no autocomplete API call for fewer than 2 characters", async ({ page }) => {
    await page.goto("/");
    const apiCalls: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("geocoding-api.open-meteo.com")) {
        apiCalls.push(req.url());
      }
    });
    await page.getByRole("combobox").fill("L");
    await page.waitForTimeout(400); // Wait longer than 300ms debounce
    expect(apiCalls).toHaveLength(0);
  });

  test("autocomplete suggestions appear after 2+ characters with debounce", async ({ page }) => {
    await page.goto("/");
    // Mock the geocoding API response
    await page.route("**/geocoding-api.open-meteo.com/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          results: [
            {
              id: 1,
              name: "London",
              latitude: 51.5085,
              longitude: -0.1257,
              elevation: 11,
              feature_code: "PPLC",
              country_code: "GB",
              admin1_id: 1,
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

    await page.getByRole("combobox").fill("Lo");
    // Wait for debounce + dropdown
    await page.waitForTimeout(400);
    await expect(page.getByRole("listbox")).toBeVisible();
    await expect(page.getByRole("option", { name: /London/ })).toBeVisible();
  });

  test("keyboard navigation: ↑↓ arrows navigate suggestions, Enter selects", async ({ page }) => {
    await page.goto("/");
    await page.route("**/geocoding-api.open-meteo.com/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          results: [
            { id: 1, name: "London", latitude: 51.5085, longitude: -0.1257, elevation: 11, feature_code: "PPLC", country_code: "GB", admin1_id: 1, timezone: "Europe/London", population: 7556900, country_id: 2635167, country: "United Kingdom", admin1: "England" },
            { id: 2, name: "Louisville", latitude: 38.2542, longitude: -85.7594, elevation: 149, feature_code: "PPLA2", country_code: "US", admin1_id: 2, timezone: "America/Kentucky/Louisville", population: 597337, country_id: 6252001, country: "United States", admin1: "Kentucky" },
          ],
          generationtime_ms: 1.5,
        }),
      });
    });

    const input = page.getByRole("combobox");
    await input.fill("Lo");
    await page.waitForTimeout(400);
    await expect(page.getByRole("listbox")).toBeVisible();

    // Navigate down to first item
    await input.press("ArrowDown");
    // Navigate down to second item
    await input.press("ArrowDown");
    // Press Enter to select second item (Louisville)
    await input.press("Enter");

    // Dropdown should close
    await expect(page.getByRole("listbox")).not.toBeVisible();
    // Input should show selected location name
    await expect(input).toHaveValue(/Louisville/i);
  });

  test("Escape closes the autocomplete dropdown", async ({ page }) => {
    await page.goto("/");
    await page.route("**/geocoding-api.open-meteo.com/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          results: [
            { id: 1, name: "London", latitude: 51.5085, longitude: -0.1257, elevation: 11, feature_code: "PPLC", country_code: "GB", admin1_id: 1, timezone: "Europe/London", population: 7556900, country_id: 2635167, country: "United Kingdom", admin1: "England" },
          ],
          generationtime_ms: 1.5,
        }),
      });
    });

    const input = page.getByRole("combobox");
    await input.fill("Lo");
    await page.waitForTimeout(400);
    await expect(page.getByRole("listbox")).toBeVisible();
    await input.press("Escape");
    await expect(page.getByRole("listbox")).not.toBeVisible();
  });

  test("no results shows 'City not found' message", async ({ page }) => {
    await page.goto("/");
    await page.route("**/geocoding-api.open-meteo.com/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ generationtime_ms: 0.5 }), // No results key
      });
    });

    await page.getByRole("combobox").fill("Xyzzyqux");
    await page.waitForTimeout(400);
    // Click outside to trigger blur/close
    await page.click("body", { force: true });
    await page.waitForTimeout(200);
    await expect(page.getByText("City not found")).toBeVisible();
  });

  test("GPS button is visible inside the search bar", async ({ page }) => {
    await page.goto("/");
    const gpsButton = page.getByRole("button", { name: /current location/i });
    await expect(gpsButton).toBeVisible();
    // GPS button should be positioned relative to the search bar
    const searchBar = page.getByRole("combobox");
    const searchBox = await searchBar.boundingBox();
    const gpsBox = await gpsButton.boundingBox();
    // GPS button right edge should be near search bar right edge (within 60px)
    expect(Math.abs((gpsBox!.x + gpsBox!.width) - (searchBox!.x + searchBox!.width))).toBeLessThan(60);
  });

  test("recent search chips appear after selecting a city", async ({ page }) => {
    // Pre-populate localStorage with a recent search
    await page.goto("/");
    await page.evaluate(() => {
      const searches = [{
        name: "Paris, Île-de-France, FR",
        latitude: 48.8534,
        longitude: 2.3488,
        timezone: "Europe/Paris",
        savedAt: Date.now(),
      }];
      localStorage.setItem("weather_recent_searches", JSON.stringify(searches));
    });
    await page.reload();

    // Chip should be visible
    await expect(page.getByRole("button", { name: /Paris/i })).toBeVisible();
  });
});
