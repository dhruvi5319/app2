import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "mobile-375", width: 375, height: 667 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1024", width: 1024, height: 768 },
  { name: "desktop-1280", width: 1280, height: 800 },
];

test.describe("Responsive layout — F5", () => {
  for (const vp of VIEWPORTS) {
    test(`no horizontal overflow at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");

      // Check document body does not overflow horizontally
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // 1px tolerance
    });

    test(`search bar visible and accessible at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");

      const searchInput = page.getByRole("combobox", { name: /search/i });
      await expect(searchInput).toBeVisible();

      // Check tap target: bounding box height ≥ 44px
      const box = await searchInput.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    });
  }

  test("mobile 375px: single-column layout, no horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Confirm page renders without overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(376);

    // GPS button visible as touch target
    const gpsBtn = page.getByRole("button", { name: /location|gps/i });
    await expect(gpsBtn).toBeVisible();
    const box = await gpsBtn.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test("desktop 1280px: app container does not exceed viewport width", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(1281);
  });
});
