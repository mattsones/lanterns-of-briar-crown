import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import {
  CHAPTER_4_CHOICE_IDS,
  CHAPTER_4_SCENE_IDS,
  type FoldedMapEdge,
  type FoldedMapLanding,
} from "../src/story/chapter4";
import { parseDiskSaveText } from "../src/game/save";
import type { Flags, SavePayload } from "../src/game/types";
import { choice, continueCheckpoint, openCheckedInFixture, scene } from "./helpers/saveFixtures";

function chapter4Checkpoint(
  flagOverrides: Flags,
  position = { x: 0, y: 2 },
): SavePayload {
  const payload = parseDiskSaveText(readFileSync(
    new URL("../public/saves/chapter-3-complete.json", import.meta.url),
    "utf8",
  )).payload;
  return {
    ...payload,
    region: "underway",
    position,
    flags: {
      ...payload.flags,
      chapterFourStarted: true,
      gatewrightMet: true,
      foldedMapAttempted: true,
      foldedMapDecoded: true,
      underwayEntered: true,
      ...flagOverrides,
    },
  };
}

const CHOICE_BY_EDGE: Record<FoldedMapEdge, string> = {
  left: CHAPTER_4_CHOICE_IDS.leftEdge,
  right: CHAPTER_4_CHOICE_IDS.rightEdge,
  top: CHAPTER_4_CHOICE_IDS.topEdge,
  bottom: CHAPTER_4_CHOICE_IDS.bottomEdge,
};

const DEPTH_BY_LANDING: Record<FoldedMapLanding, number> = {
  quarter: 0.25,
  half: 0.5,
  "three-quarter": 0.75,
};

async function dragEdge(page: Page, edge: FoldedMapEdge, landing: FoldedMapLanding) {
  const handle = choice(page, CHOICE_BY_EDGE[edge]);
  const sheet = page.getByTestId("folded-map-sheet");
  await handle.scrollIntoViewIfNeeded();
  const [handleBox, sheetBox] = await Promise.all([handle.boundingBox(), sheet.boundingBox()]);
  if (!handleBox || !sheetBox) throw new Error(`Folded Map ${edge} edge is not measurable.`);
  const depth = DEPTH_BY_LANDING[landing];
  const start = { x: handleBox.x + handleBox.width / 2, y: handleBox.y + handleBox.height / 2 };
  const target = edge === "left"
    ? { x: sheetBox.x + sheetBox.width * depth, y: start.y }
    : edge === "right"
      ? { x: sheetBox.x + sheetBox.width * (1 - depth), y: start.y }
      : edge === "top"
        ? { x: start.x, y: sheetBox.y + sheetBox.height * depth }
        : { x: start.x, y: sheetBox.y + sheetBox.height * (1 - depth) };
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(target.x, target.y, { steps: 10 });
  await page.mouse.up();
  await expect(handle).toHaveAttribute("data-fold-depth", depth.toFixed(2));
}

async function beginChapter4AtGatewright(page: Page) {
  await openCheckedInFixture(page, "Review Chapter 3 Complete Save");
  await choice(page, CHAPTER_4_CHOICE_IDS.beginChapter).click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.lowerGateArrival)).toBeVisible();
  await choice(page, CHAPTER_4_CHOICE_IDS.meetGatewright).click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.gatewrightOffer)).toBeVisible();
}

test("real Chapter 3 fixture reaches the Folded Map through the required Gatewright encounter", async ({ page }) => {
  await beginChapter4AtGatewright(page);

  await expect(page.getByText("Bramwell", { exact: false })).toBeVisible();
  await expect(page.getByText("buy, sell, compare", { exact: false })).toBeVisible();
  await choice(page, CHAPTER_4_CHOICE_IDS.openSmithy).click();
  await expect(page.getByTestId("shop-modal")).toHaveAttribute("data-shop-mode", "gatewright");
  await expect(page.getByText("Tasmine Rootbrace's Smithy", { exact: true })).toBeVisible();
  await expect(page.locator("[data-shop-buy-item]")).toHaveCount(5);
  await expect(page.locator("[data-shop-sell-item]").first()).toBeVisible();
  await expect(page.locator('[data-shop-sell-item="cargo_transfer_tag"]')).toHaveCount(0);
  await page.getByRole("button", { name: "Close" }).click();
  await page.getByRole("button", { name: "Visit Tasmine Rootbrace" }).click();
  await choice(page, CHAPTER_4_CHOICE_IDS.continueToMap).click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.foldedMapBriefing)).toBeVisible();
  await choice(page, CHAPTER_4_CHOICE_IDS.openFoldedMap).click();

  await expect(page.getByRole("heading", { name: "The Folded Map" })).toBeVisible();
  await expect(page.getByText("Goal: Decode the Folded Map", { exact: true })).toBeVisible();
});

test("Tasmine's full smithy buys and sells before the Underway", async ({ page }) => {
  await beginChapter4AtGatewright(page);

  await choice(page, CHAPTER_4_CHOICE_IDS.openSmithy).click();
  await page.locator('[data-shop-buy-item="gatewright_hookblade"]').getByRole("button").click();
  await expect(page.getByText("Gold: 46", { exact: true })).toBeVisible();
  await page.locator('[data-shop-sell-item="trail_snack"]').getByRole("button").click();
  await expect(page.getByText("Gold: 48", { exact: true })).toBeVisible();
  await expect(page.locator('[data-shop-sell-item="trail_snack"]')).toContainText("x4");
});

test("the decoded story map opens the playable 811 Underway graph", async ({ page }) => {
  await beginChapter4AtGatewright(page);
  await choice(page, CHAPTER_4_CHOICE_IDS.continueToMap).click();
  await choice(page, CHAPTER_4_CHOICE_IDS.openFoldedMap).click();
  await dragEdge(page, "left", "half");
  await dragEdge(page, "bottom", "three-quarter");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await choice(page, CHAPTER_4_CHOICE_IDS.close).click();

  await choice(page, CHAPTER_4_CHOICE_IDS.enterUnderway).click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.underwayArrival)).toBeVisible();
  await choice(page, CHAPTER_4_CHOICE_IDS.enterUnderway).click();
  await page.getByTestId("move-right").click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.underwayRoute)).toBeVisible();
  await choice(page, CHAPTER_4_CHOICE_IDS.followMappedRoute).click();

  await expect(page.getByTestId("map-background")).toHaveAttribute(
    "src",
    /^data:image\/svg\+xml/,
  );
  await page.getByTestId("move-right").click();
  await expect(page.getByRole("button", { name: "Inspect Underway Passage" })).toBeVisible();
  await page.getByTestId("move-right").click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.underwayDetour)).toBeVisible();
  await expect(page.getByText("posted closure should protect travelers", { exact: false })).toBeVisible();
});

test("Tasmine stocks only Westroot weapons and root-built armor", async ({ page }) => {
  await beginChapter4AtGatewright(page);

  await choice(page, CHAPTER_4_CHOICE_IDS.openSmithy).click();
  await expect(page.locator('[data-shop-buy-item="gatewright_hookblade"]')).toBeVisible();
  await expect(page.locator('[data-shop-buy-item="gatewright_passage_pike"]')).toBeVisible();
  await expect(page.locator('[data-shop-buy-item="gatewright_counterweight_maul"]')).toBeVisible();
  await expect(page.locator('[data-shop-buy-item="ironroot_ribplate"]')).toBeVisible();
  await expect(page.locator('[data-shop-buy-item="low_arch_roothelm"]')).toBeVisible();
  await expect(page.locator('[data-shop-buy-item="pebbleknock_hammer"]')).toHaveCount(0);
  await expect(page.locator('[data-shop-buy-item="giggleleaf_cloak"]')).toHaveCount(0);
  await expect(page.locator('[data-shop-buy-item="rootbread_charm"]')).toHaveCount(0);
  await page.locator('[data-shop-buy-item="gatewright_passage_pike"]').getByRole("button").click();
  await expect(page.getByText("Gold: 48", { exact: true })).toBeVisible();
  await page.locator('[data-shop-buy-item="gatewright_counterweight_maul"]').getByRole("button").click();
  await expect(page.getByText("Gold: 14", { exact: true })).toBeVisible();
});

test("posted detour choice occurs inside the Underway and both routes remain plausible", async ({ page }) => {
  await continueCheckpoint(page, chapter4Checkpoint({}, { x: 3, y: 2 }));

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.underwayDetour)).toBeVisible();
  await choice(page, CHAPTER_4_CHOICE_IDS.inspectDetour).click();
  await expect(page.getByText("real old Westroot hazard stamp", { exact: false })).toBeVisible();
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.followMappedRoute)).toContainText("mapped route");
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.followPostedDetour)).toContainText("posted safety detour");
  await choice(page, CHAPTER_4_CHOICE_IDS.followPostedDetour).click();
  await expect(page.getByRole("button", { name: "Inspect Maintenance Gallery 817" })).toBeVisible();
});

test("Underway hides an ordinary ambush miss and reveals the attack only at the blind junction", async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0.01;
  });
  await continueCheckpoint(page, chapter4Checkpoint({ underwayDetourDecisionMade: true }, { x: 6, y: 2 }));

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByTestId("map-status-overlay")).toContainText("gives away nothing else");
  await expect(page.getByRole("button", { name: "Move to Concealed Briar Ambush" })).toHaveCount(0);

  await page.getByTestId("move-right").click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.underwayAmbush)).toBeVisible();
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.prepareAmbush)).toHaveCount(0);
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.faceAmbush)).toBeVisible();
});

test("exceptional Instinct reveals the Underway ambush and unlocks a prepared opening", async ({ page }) => {
  const payload = chapter4Checkpoint({ underwayDetourDecisionMade: true }, { x: 6, y: 2 });
  payload.player.baseStats.Instinct = 40;
  await continueCheckpoint(page, payload);

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByTestId("map-status-overlay")).toContainText("thread-thin cord crosses the floor");
  await expect(page.getByRole("button", { name: "Move to Concealed Briar Ambush" })).toBeVisible();
  await page.getByTestId("move-right").click();
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.prepareAmbush)).toBeVisible();
  await expect(page.getByText("Hero acts first", { exact: false })).toBeVisible();
  await choice(page, CHAPTER_4_CHOICE_IDS.prepareAmbush).click();
  await expect(page.getByText("Battle • Briar Relay Guard")).toBeVisible();
  await expect(page.getByText("party begins with 4 guard", { exact: false })).toHaveCount(0);
});

test("Listening Mile spaces Lio's trail across three lantern-dark travel beats", async ({ page }) => {
  await continueCheckpoint(page, chapter4Checkpoint({ underwayDetourDecisionMade: true, underwayAmbushCleared: true }, { x: 8, y: 2 }));

  await expect(page.getByTestId("map-stage")).toHaveAttribute("data-visibility-mode", "local-lantern");
  await expect(page.getByTestId("underway-darkness")).toHaveAttribute("fill", "#000000");
  await expect(page.getByTestId("underway-lantern-halo")).toBeVisible();
  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.listeningMileIntro)).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("small sounds of the road");
  await choice(page, CHAPTER_4_CHOICE_IDS.beginListeningMile).click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.listeningMileStationOne)).toBeVisible();
  await choice(page, CHAPTER_4_CHOICE_IDS.traceSignal).click();

  await expect(scene(page, CHAPTER_4_SCENE_IDS.listeningMileStationTwo)).toHaveCount(0);
  await page.getByTestId("move-right").click();
  await page.getByTestId("move-right").click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.listeningMileStationTwo)).toBeVisible();
  await choice(page, CHAPTER_4_CHOICE_IDS.isolateSignal).click();
  await page.getByTestId("move-right").click();
  await page.getByTestId("move-right").click();

  await expect(scene(page, CHAPTER_4_SCENE_IDS.listeningMileResult)).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Lio's Trail Marker" })).toContainText("small, hurried, and unmistakably his");
  await expect(page.getByTestId("dialogue-feedback")).toContainText("He knew I would look twice");
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.finishListeningMile)).toContainText(
    "loose route-record plate",
  );
});

test("rectangular Folded Map supports two faces, many edge landings, false and true routes, and the optional third fold", async ({ page }) => {
  await openCheckedInFixture(page, "Test Folded Map Graybox");

  const prototype = page.getByTestId("folded-map-prototype");
  const sheet = page.getByTestId("folded-map-sheet");
  await expect(page.getByRole("heading", { name: "The Folded Map" })).toBeVisible();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.foldedMapGraybox)).toBeVisible();
  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:flat");
  await expect(sheet).toHaveAttribute("data-map-side", "front");

  await choice(page, CHAPTER_4_CHOICE_IDS.flipMap).click();
  await expect(sheet).toHaveAttribute("data-map-side", "back");
  await expect(page.locator('[data-map-face="back"]')).toHaveCount(1);
  await choice(page, CHAPTER_4_CHOICE_IDS.flipMap).click();
  await expect(sheet).toHaveAttribute("data-map-side", "front");

  await choice(page, CHAPTER_4_CHOICE_IDS.leftEdge).click();
  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:flat");
  await expect(page.getByTestId("folded-map-feedback")).toContainText("Pressing the handle alone");

  await dragEdge(page, "left", "quarter");
  await dragEdge(page, "top", "three-quarter");
  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:left-quarter,top-three-quarter");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await expect(prototype).toHaveAttribute("data-trace-outcome", "not-a-route");
  await expect(page.getByTestId("folded-map-result-stamp")).toContainText("NO CONTINUOUS ROUTE");
  await expect(page.getByTestId("folded-map-feedback")).toContainText("evidence does not");

  await choice(page, CHAPTER_4_CHOICE_IDS.resetFolds).click();
  await dragEdge(page, "right", "half");
  await dragEdge(page, "top", "half");
  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:right-half,top-half");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await expect(prototype).toHaveAttribute("data-trace-outcome", "false-shortcut");
  await expect(page.getByTestId("folded-map-result-stamp")).toContainText("TEMPTING ROUTE REJECTED");
  await expect(page.getByTestId("folded-map-feedback")).toContainText("wonderfully straight road");
  await expect(scene(page, CHAPTER_4_SCENE_IDS.foldedMapReview)).toBeVisible();

  await choice(page, CHAPTER_4_CHOICE_IDS.resetFolds).click();
  await dragEdge(page, "left", "half");
  await dragEdge(page, "bottom", "three-quarter");
  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:left-half,bottom-three-quarter");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await expect(prototype).toHaveAttribute("data-trace-outcome", "true-route");
  await expect(page.getByTestId("folded-map-result-stamp")).toContainText("TRUE ROUTE FOUND");
  await expect(page.getByTestId("folded-map-result-stamp")).toContainText("UNDERWAY DECODED");
  await expect(page.getByTestId("folded-map-true-evidence")).toBeVisible();
  await expect(page.getByTestId("folded-map-feedback")).toContainText("west edge lands halfway");
  await expect(page.getByText("True route recorded", { exact: false })).toBeVisible();

  await dragEdge(page, "top", "quarter");
  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:left-half,top-quarter,bottom-three-quarter");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await expect(prototype).toHaveAttribute("data-trace-outcome", "deeper-solve");
  await expect(page.getByTestId("folded-map-result-stamp")).toContainText("LANTERNWELL CACHE FOUND");
  await expect(page.getByTestId("folded-map-cache-evidence")).toBeVisible();
  await expect(page.getByTestId("folded-map-feedback")).toContainText("One Lanternwell Drop");
  await expect(page.getByText("Lanternwell cache reward claimed once.")).toBeVisible();
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await expect(page.getByTestId("folded-map-feedback")).not.toContainText("One Lanternwell Drop");
});

test("Folded Map Back opens the latest edge before closing", async ({ page }) => {
  await openCheckedInFixture(page, "Test Folded Map Graybox");

  const prototype = page.getByTestId("folded-map-prototype");
  await dragEdge(page, "left", "half");
  await dragEdge(page, "bottom", "three-quarter");
  await choice(page, CHAPTER_4_CHOICE_IDS.back).click();
  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:left-half");
  await choice(page, CHAPTER_4_CHOICE_IDS.back).click();
  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:flat");
  await choice(page, CHAPTER_4_CHOICE_IDS.back).click();
  await expect(page.getByRole("heading", { name: "The Folded Map" })).toHaveCount(0);
});

test("Folded Map keyboard controls do not trigger the underlying map interaction", async ({ page }) => {
  await openCheckedInFixture(page, "Test Folded Map Graybox");

  const prototype = page.getByTestId("folded-map-prototype");
  const westHandle = choice(page, CHAPTER_4_CHOICE_IDS.leftEdge);
  await westHandle.press("Enter");

  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:left-quarter");
  await expect(page.getByRole("dialog", { name: "Noma Greenstill" })).toHaveCount(0);
});

test("rectangular Folded Map remains draggable and traceable at phone width", async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await openCheckedInFixture(page, "Test Folded Map Graybox");

  await expect(page.getByRole("heading", { name: "The Folded Map" })).toBeInViewport();
  await dragEdge(page, "left", "half");
  await dragEdge(page, "bottom", "three-quarter");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await expect(page.getByTestId("folded-map-feedback")).toContainText("Underway");
});
