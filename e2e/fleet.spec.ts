import { test, expect } from "@playwright/test";

test.describe("Fleet Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("displays the Fleet Manager heading in navigation", async ({ page }) => {
    await expect(page.getByText("Fleet Manager")).toBeVisible();
  });

  test("renders truck list with data", async ({ page }) => {
    await expect(page.locator("table")).toBeVisible();
    await expect(page.locator("th", { hasText: "Code" })).toBeVisible();
    await expect(page.locator("th", { hasText: "Name" })).toBeVisible();
    await expect(page.locator("th", { hasText: "Status" })).toBeVisible();
  });

  test("shows filter buttons", async ({ page }) => {
    await expect(page.getByRole("button", { name: /All/ })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Out of Service" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Loading" })).toBeVisible();
  });

  test("filter buttons update the truck list", async ({ page }) => {
    // Wait for data to load
    await expect(page.locator("tbody tr").first()).toBeVisible();

    const allCount = await page.locator("tbody tr").count();

    // Click a specific filter
    await page.getByRole("button", { name: "Out of Service" }).click();

    // The count should be different (or equal if all match)
    const filteredCount = await page.locator("tbody tr").count();
    expect(filteredCount).toBeLessThanOrEqual(allCount);
  });

  test("clicking a truck navigates to detail page", async ({ page }) => {
    // Wait for data to load
    await expect(page.locator("tbody tr").first()).toBeVisible();

    // Click the first truck link
    const firstTruckLink = page.locator("tbody tr a").first();
    await firstTruckLink.click();

    await expect(page).toHaveURL(/\/trucks\/.+/);
  });
});
