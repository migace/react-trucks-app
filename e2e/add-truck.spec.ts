import { test, expect } from "@playwright/test";

test.describe("Add Truck Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/trucks/new");
  });

  test("displays the Add New Truck form", async ({ page }) => {
    await expect(page.getByText("Add New Truck")).toBeVisible();
    await expect(page.getByLabel("Code")).toBeVisible();
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Status")).toBeVisible();
    await expect(page.getByLabel("Description")).toBeVisible();
  });

  test("shows validation errors on empty submit", async ({ page }) => {
    await page.getByRole("button", { name: "Add Truck" }).click();

    await expect(page.getByText("Code is required")).toBeVisible();
    await expect(
      page.getByText("Name must be at least 2 characters"),
    ).toBeVisible();
  });

  test("successfully submits valid form data", async ({ page }) => {
    await page.getByLabel("Code").fill("E2E-001");
    await page.getByLabel("Name").fill("E2E Test Truck");
    await page.getByLabel("Status").selectOption("LOADING");
    await page.getByLabel("Description").fill("Created by E2E test");

    await page.getByRole("button", { name: "Add Truck" }).click();

    // Should show success toast
    await expect(page.getByText("Truck added successfully")).toBeVisible();
  });

  test("navigates back to fleet page via nav link", async ({ page }) => {
    await page.getByRole("link", { name: "Fleet" }).click();
    await expect(page).toHaveURL("/");
  });
});
