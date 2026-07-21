import { expect, test } from "@playwright/test";

test("starts a new adventure and passes built-in QA checks", async ({
  page,
}) => {
  test.setTimeout(60_000);
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
  await expect(page.getByText("Goal: Speak with Elder Brynn")).toBeVisible();

  const mapStage = page.getByTestId("map-stage");
  const mapStatusOverlay = page.getByTestId("map-status-overlay");
  const heroToken = page.getByTestId("hero-token");
  await expect(mapStage).toBeVisible();
  await expect(mapStatusOverlay).toBeVisible();
  await expect(mapStatusOverlay).toHaveCSS("position", "absolute");
  await expect(mapStatusOverlay).toHaveCSS("pointer-events", "none");
  const mapBox = await mapStage.boundingBox();
  const statusBox = await mapStatusOverlay.boundingBox();
  expect(mapBox).not.toBeNull();
  expect(statusBox).not.toBeNull();
  expect(statusBox!.y).toBeGreaterThanOrEqual(mapBox!.y);
  expect(statusBox!.y + statusBox!.height).toBeLessThan(mapBox!.y + mapBox!.height);
  await expect(mapStage.getByTestId("map-background")).toBeVisible();
  await expect(heroToken).toBeVisible();
  await expect(heroToken.getByTestId("hero-token-art")).toBeVisible();
  await expect(page.getByTestId("map-grid")).toHaveCount(0);
  await expect(mapStage.locator("text=?")).toHaveCount(0);
  await expect(mapStage.locator(".map-token:not(.has-artwork)")).toHaveCount(0);
  await expect(mapStage.locator(".map-token--npc.has-artwork")).toHaveCount(5);

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
  await expect(page.getByRole("dialog", { name: "Sela of the Loom" })).toBeVisible();
  await page.getByRole("button", { name: "I'll be careful." }).click();

  await page.getByTestId("move-down").click();
  await page.waitForTimeout(250);
  const downBox = await getHeroBox();
  expect(downBox.y).toBeGreaterThan(secondRightBox.y);

  await page.getByTestId("move-up").click();
  await page.waitForTimeout(250);
  const upBox = await getHeroBox();
  expect(upBox.y).toBeLessThan(downBox.y);
  await expect(page.getByRole("dialog", { name: "Sela of the Loom" })).toBeVisible();
  await page.getByRole("button", { name: "I'll be careful." }).click();

  await page.getByTestId("move-left").click();
  await page.waitForTimeout(250);
  const leftBox = await getHeroBox();
  expect(leftBox.x).toBeLessThan(upBox.x);

  await page.getByTestId("move-up").click();
  await page.getByTestId("move-up").click();
  await expect(page.getByText("Step inside your cozy home?")).toBeVisible();
  await expect(page.getByTestId("dialogue-map-vignette")).toHaveAttribute(
    "aria-label",
    /Hearthhollow home entrance/,
  );
  await expect(page.getByTestId("dialogue-map-vignette").locator("img")).toHaveAttribute(
    "src",
    /hearthhollow-gameplay-map-v04/,
  );
  await expect(page.getByRole("dialog").getByText("🚪", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Stay outside" }).click();

  await page.getByTestId("move-down").click();
  await page.getByTestId("move-down").click();
  await page.getByTestId("move-down").click();
  await page.getByTestId("move-left").click();
  await page.getByTestId("move-left").click();
  await expect(page.getByText("Head into the potion shed?")).toBeVisible();
  await expect(page.getByTestId("dialogue-map-vignette")).toHaveAttribute(
    "aria-label",
    /potion shed/,
  );
  await page.getByRole("button", { name: "Enter" }).click();
  await expect(page.getByText("Potion Shed", { exact: true })).toBeVisible();
  await expect(page.getByText("What it does", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Restores 10 HP", { exact: true })).toBeVisible();
  await expect(page.getByText("Restores 6 HP", { exact: true })).toBeVisible();
  await expect(page.getByText("Restores 4 HP", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Close", exact: true }).click();

  await page.getByRole("button", { name: "Save Slot" }).click();
  await expect(page.getByText("Save Slots")).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();

  await page.getByRole("button", { name: "Load Slot" }).click();
  await expect(page.getByText("Load Save Slot")).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();

  await page.getByTestId("open-adventure-menu").click();
  await page.getByText("More", { exact: true }).click();
  await page.getByRole("button", { name: "Dev Tools" }).click();
  const visibleMovementNodeCount = await page.locator(".map-node-hitbox").count();
  await page.getByRole("button", { name: "Show Map Debug" }).click();
  await expect(page.getByTestId("map-debug-bounds")).toBeVisible();
  const debugNodes = page.locator(".map-node-hitbox.is-debug");
  expect(await debugNodes.count()).toBeGreaterThan(visibleMovementNodeCount);
  expect(await page.locator(".map-node-hitbox.is-debug.is-clickable").count()).toBeGreaterThan(0);
  expect(await page.locator(".map-node-hitbox.is-debug.is-unreachable").count()).toBeGreaterThan(0);
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
