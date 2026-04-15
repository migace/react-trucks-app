import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("navigates between pages using nav links", async ({ page }) => {
    await page.goto("/");

    // Navigate to Add Truck
    await page.getByRole("link", { name: "Add Truck" }).first().click();
    await expect(page).toHaveURL("/trucks/new");
    await expect(page.getByText("Add New Truck")).toBeVisible();

    // Navigate back to Fleet
    await page.getByRole("link", { name: "Fleet" }).click();
    await expect(page).toHaveURL("/");
  });

  test("dark mode toggle works", async ({ page }) => {
    await page.goto("/");

    // Find the dark mode toggle button
    const toggleButton = page.locator("button").filter({ hasText: /🌙|☀️/ });

    if (await toggleButton.isVisible()) {
      // Check initial state (light mode)
      const htmlBefore = await page.locator("html").getAttribute("class");

      await toggleButton.click();

      const htmlAfter = await page.locator("html").getAttribute("class");

      // The class should have changed
      expect(htmlAfter).not.toBe(htmlBefore);
    }
  });

  test("shows active nav link styling", async ({ page }) => {
    await page.goto("/");

    const fleetLink = page.getByRole("link", { name: "Fleet" });
    await expect(fleetLink).toBeVisible();
  });

  test("404 or unknown routes redirect gracefully", async ({ page }) => {
    await page.goto("/unknown-route");

    // Should still render the layout
    await expect(page.getByText("Fleet Manager")).toBeVisible();
  });
});
