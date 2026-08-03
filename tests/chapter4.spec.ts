import { expect, test, type Page } from "@playwright/test";
import { CHAPTER_4_CHOICE_IDS, CHAPTER_4_SCENE_IDS, type FoldedMapFlapId } from "../src/story/chapter4";
import { choice, openCheckedInFixture, scene } from "./helpers/saveFixtures";

const CHOICE_BY_FLAP: Record<FoldedMapFlapId, string> = {
  survey: CHAPTER_4_CHOICE_IDS.surveyFold,
  keeper: CHAPTER_4_CHOICE_IDS.keeperFold,
  crown: CHAPTER_4_CHOICE_IDS.crownFold,
  cache: CHAPTER_4_CHOICE_IDS.cacheFold,
};

async function dragWing(page: Page, flap: FoldedMapFlapId, fold = true) {
  const wing = choice(page, CHOICE_BY_FLAP[flap]);
  const box = await wing.boundingBox();
  if (!box) throw new Error(`Folded Map ${flap} wing has no bounding box.`);
  const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  const direction = {
    survey: { x: 0.82, y: 0 },
    keeper: { x: -0.82, y: 0 },
    crown: { x: 0, y: 0.82 },
    cache: { x: 0, y: -0.82 },
  }[flap];
  const multiplier = fold ? 1 : -1;
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(
    start.x + direction.x * box.width * multiplier,
    start.y + direction.y * box.height * multiplier,
    { steps: 8 },
  );
  await page.mouse.up();
  await expect(wing).toHaveAttribute("aria-pressed", fold ? "true" : "false");
}

test("Folded Map requires paper manipulation and distinguishes ordinary, tempting, true, and deeper constructions", async ({ page }) => {
  await openCheckedInFixture(page, "Test Folded Map Graybox");

  const prototype = page.getByTestId("folded-map-prototype");
  await expect(page.getByRole("heading", { name: "The Folded Map" })).toBeVisible();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.foldedMapGraybox)).toBeVisible();
  await expect(prototype).toHaveAttribute("data-fold-configuration", "flat");

  await choice(page, CHAPTER_4_CHOICE_IDS.surveyFold).click();
  await expect(prototype).toHaveAttribute("data-fold-configuration", "flat");
  await expect(page.getByTestId("folded-map-feedback")).toContainText("press alone will not choose");

  await dragWing(page, "keeper");
  await dragWing(page, "cache");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await expect(page.getByTestId("folded-map-feedback")).toContainText("evidence does not");
  await expect(page.getByText("Crown shortcut rejected", { exact: false })).toHaveCount(0);

  await choice(page, CHAPTER_4_CHOICE_IDS.resetFolds).click();
  await dragWing(page, "survey");
  await dragWing(page, "crown");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await expect(page.getByTestId("folded-map-feedback")).toContainText("wonderfully straight road");
  await expect(scene(page, CHAPTER_4_SCENE_IDS.foldedMapReview)).toBeVisible();

  await choice(page, CHAPTER_4_CHOICE_IDS.resetFolds).click();
  await dragWing(page, "survey");
  await dragWing(page, "keeper");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await expect(page.getByTestId("folded-map-feedback")).toContainText("both contour strokes");
  await expect(page.getByText("True route recorded", { exact: false })).toBeVisible();

  await dragWing(page, "cache");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await expect(page.getByTestId("folded-map-feedback")).toContainText("One Lanternwell Drop");
  await expect(page.getByText("Lanternwell cache reward claimed once.")).toBeVisible();

  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await expect(page.getByTestId("folded-map-feedback")).not.toContainText("One Lanternwell Drop");
});

test("Folded Map Back unfolds the top paper wing before closing", async ({ page }) => {
  await openCheckedInFixture(page, "Test Folded Map Graybox");

  await dragWing(page, "survey");
  await dragWing(page, "keeper");
  await choice(page, CHAPTER_4_CHOICE_IDS.back).click();
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.keeperFold)).toHaveAttribute("aria-pressed", "false");
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.surveyFold)).toHaveAttribute("aria-pressed", "true");
  await expect(scene(page, CHAPTER_4_SCENE_IDS.foldedMapGraybox)).toBeVisible();

  await choice(page, CHAPTER_4_CHOICE_IDS.back).click();
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.surveyFold)).toHaveAttribute("aria-pressed", "false");
  await choice(page, CHAPTER_4_CHOICE_IDS.back).click();
  await expect(page.getByRole("heading", { name: "The Folded Map" })).toHaveCount(0);
});

test("Folded Map paper remains draggable and traceable at phone width", async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await openCheckedInFixture(page, "Test Folded Map Graybox");

  await expect(page.getByRole("heading", { name: "The Folded Map" })).toBeInViewport();
  await dragWing(page, "survey");
  await dragWing(page, "keeper");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await expect(page.getByTestId("folded-map-feedback")).toContainText("Underway");
});
