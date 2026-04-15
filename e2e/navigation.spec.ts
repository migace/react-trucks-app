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

    const toggleButton = page.getByRole("button", { name: /mode/i });
    await expect(toggleButton).toBeVisible();

    // Initial state: light mode
    await expect(page.locator("html")).not.toHaveClass(/dark/);

    // Toggle to dark mode
    await toggleButton.click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Toggle back to light mode
    await toggleButton.click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("shows active nav link styling", async ({ page }) => {
    await page.goto("/");

    const fleetLink = page.getByRole("link", { name: "Fleet" });
    await expect(fleetLink).toBeVisible();
  });

  test("404 page shows for unknown routes", async ({ page }) => {
    await page.goto("/unknown-route");

    await expect(page.getByText("404")).toBeVisible();
    await expect(
      page.getByText("The page you're looking for doesn't exist."),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Back to Fleet" }),
    ).toBeVisible();
  });
});
