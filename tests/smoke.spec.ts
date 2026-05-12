import { expect, test } from "@playwright/test";

test("starts a new adventure and passes built-in QA checks", async ({
  page,
}) => {
  const runtimeErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));

  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Lanterns of Briar Crown" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "New Adventure" }).click();
  await page.getByRole("button", { name: "Begin Chapter 1" }).click();

  await expect(page.getByText("Hearthhollow, Dawn")).toBeVisible();
  await expect(page.getByText("has always known Hearthhollow")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Step into the morning" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Step into the morning" }).click();
  await expect(page.getByText("Goal: Speak with Elder Mira")).toBeVisible();

  const mapStage = page.getByTestId("map-stage");
  const heroToken = page.getByTestId("hero-token");
  await expect(mapStage).toBeVisible();
  await expect(mapStage.getByTestId("map-background")).toBeVisible();
  await expect(heroToken).toBeVisible();
  await expect(page.getByTestId("map-grid")).toHaveCount(0);
  await expect(mapStage.locator("text=?")).toHaveCount(0);

  const getHeroBox = async () => {
    const box = await heroToken.boundingBox();
    expect(box).not.toBeNull();
    return box!;
  };

  const startBox = await getHeroBox();
  await page.getByTestId("move-right").click();
  await page.waitForTimeout(250);
  const rightBox = await getHeroBox();
  expect(rightBox.x).toBeGreaterThan(startBox.x);

  await page.getByTestId("move-right").click();
  await page.waitForTimeout(250);
  const secondRightBox = await getHeroBox();
  expect(secondRightBox.x).toBeGreaterThan(rightBox.x);

  await page.getByTestId("move-down").click();
  await page.waitForTimeout(250);
  const downBox = await getHeroBox();
  expect(downBox.y).toBeGreaterThan(secondRightBox.y);

  await page.getByTestId("move-up").click();
  await page.waitForTimeout(250);
  const upBox = await getHeroBox();
  expect(upBox.y).toBeLessThan(downBox.y);

  await page.getByTestId("move-left").click();
  await page.waitForTimeout(250);
  const leftBox = await getHeroBox();
  expect(leftBox.x).toBeLessThan(upBox.x);

  await page.getByRole("button", { name: "Save Slot" }).click();
  await expect(page.getByText("Save Slots")).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();

  await page.getByRole("button", { name: "Load Slot" }).click();
  await expect(page.getByText("Load Save Slot")).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();

  await page.getByRole("button", { name: "Dev Tools" }).click();
  await page.getByRole("button", { name: "Show Map Debug" }).click();
  await expect(page.getByTestId("map-debug-bounds")).toBeVisible();
  await page.getByRole("button", { name: "Hide Map Debug" }).click();
  await expect(page.getByTestId("map-debug-bounds")).toHaveCount(0);
  await page.getByRole("button", { name: "Run QA Checks" }).click();

  await expect(page.getByText("Hearthhollow map is rectangular")).toBeVisible();
  await expect(
    page.getByText("Hearthhollow tiles have metadata"),
  ).toBeVisible();
  await expect(page.getByText("Lantern Road map is rectangular")).toBeVisible();
  await expect(
    page.getByText("Lantern Road tiles have metadata"),
  ).toBeVisible();
  await expect(
    page.getByText("Hearthhollow placement tweaks are tuned"),
  ).toBeVisible();
  await expect(page.getByText("Bramblecross map is rectangular")).toBeVisible();
  await expect(
    page.getByText("Bramblecross tiles have metadata"),
  ).toBeVisible();
  await expect(
    page.getByText("Old Root Cellar map is rectangular"),
  ).toBeVisible();
  await expect(
    page.getByText("Old Root Cellar tiles have metadata"),
  ).toBeVisible();
  await expect(page.getByText("Shop item IDs exist")).toBeVisible();
  await expect(page.getByText("Recipe item IDs exist")).toBeVisible();
  await expect(
    page.getByText("Companion definitions are complete"),
  ).toBeVisible();
  await expect(
    page.getByText("Root Cellar uses walkable-only graph nodes"),
  ).toBeVisible();
  await expect(page.locator("text=⚠")).toHaveCount(0);
  await page.getByRole("button", { name: "Old Root Cellar" }).click();
  const moveCellar = async (direction: string) => {
    await page.getByTestId(`move-${direction}`).click();
    const sigilChoice = page.getByRole("button", {
      name: "Copy the sigil into your notes.",
    });
    if (await sigilChoice.isVisible().catch(() => false)) {
      await sigilChoice.click();
    }
    await page.waitForTimeout(120);
  };
  for (const direction of [
    "right",
    "right",
    "right",
    "right",
    "right",
    "right",
    "right",
    "down",
    "down",
    "down",
    "down",
    "right",
    "right",
    "right",
    "up",
    "up",
  ]) {
    await moveCellar(direction);
  }
  await expect(page.getByText("Briar Knot Warden")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Stand and fight." }),
  ).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});
