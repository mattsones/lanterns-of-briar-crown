import { expect, test, type Page } from "@playwright/test";
import {
  CHAPTER_4_CHOICE_IDS,
  CHAPTER_4_SCENE_IDS,
  type FoldedMapEdge,
  type FoldedMapLanding,
} from "../src/story/chapter4";
import { choice, openCheckedInFixture, scene } from "./helpers/saveFixtures";

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
  await expect(page.getByTestId("folded-map-feedback")).toContainText("evidence does not");

  await choice(page, CHAPTER_4_CHOICE_IDS.resetFolds).click();
  await dragEdge(page, "right", "half");
  await dragEdge(page, "top", "half");
  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:right-half,top-half");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await expect(page.getByTestId("folded-map-feedback")).toContainText("wonderfully straight road");
  await expect(scene(page, CHAPTER_4_SCENE_IDS.foldedMapReview)).toBeVisible();

  await choice(page, CHAPTER_4_CHOICE_IDS.resetFolds).click();
  await dragEdge(page, "left", "half");
  await dragEdge(page, "bottom", "three-quarter");
  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:left-half,bottom-three-quarter");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await expect(page.getByTestId("folded-map-feedback")).toContainText("west edge lands halfway");
  await expect(page.getByText("True route recorded", { exact: false })).toBeVisible();

  await dragEdge(page, "top", "quarter");
  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:left-half,top-quarter,bottom-three-quarter");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
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

test("rectangular Folded Map remains draggable and traceable at phone width", async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await openCheckedInFixture(page, "Test Folded Map Graybox");

  await expect(page.getByRole("heading", { name: "The Folded Map" })).toBeInViewport();
  await dragEdge(page, "left", "half");
  await dragEdge(page, "bottom", "three-quarter");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await expect(page.getByTestId("folded-map-feedback")).toContainText("Underway");
});
