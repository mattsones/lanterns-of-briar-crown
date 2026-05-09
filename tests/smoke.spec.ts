import { expect, test } from "@playwright/test";

test("starts a new adventure and passes built-in QA checks", async ({ page }) => {
  const runtimeErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));

  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Lanterns of Briar Crown" })).toBeVisible();
  await page.getByRole("button", { name: "New Adventure" }).click();
  await page.getByRole("button", { name: "Begin Chapter 1" }).click();

  await expect(page.getByText("Hearthhollow, Dawn")).toBeVisible();
  await page.getByRole("button", { name: "Step into the morning" }).click();
  await expect(page.getByText("Goal: Speak with Elder Mira")).toBeVisible();

  await page.getByRole("button", { name: "Dev Tools" }).click();
  await page.getByRole("button", { name: "Run QA Checks" }).click();

  await expect(page.getByText("Hearthhollow map is rectangular")).toBeVisible();
  await expect(page.getByText("Hearthhollow tiles have metadata")).toBeVisible();
  await expect(page.getByText("Lantern Road map is rectangular")).toBeVisible();
  await expect(page.getByText("Lantern Road tiles have metadata")).toBeVisible();
  await expect(page.getByText("Bramblecross map is rectangular")).toBeVisible();
  await expect(page.getByText("Bramblecross tiles have metadata")).toBeVisible();
  await expect(page.getByText("Old Root Cellar map is rectangular")).toBeVisible();
  await expect(page.getByText("Old Root Cellar tiles have metadata")).toBeVisible();
  await expect(page.getByText("Shop item IDs exist")).toBeVisible();
  await expect(page.getByText("Recipe item IDs exist")).toBeVisible();
  await expect(page.getByText("Companion definitions are complete")).toBeVisible();
  await expect(page.getByText("Root Cellar upper spur restored without boss bypass")).toBeVisible();
  await expect(page.locator("text=⚠")).toHaveCount(0);
  expect(runtimeErrors).toEqual([]);
});
