import { expect, test } from "@playwright/test";
import { CHAPTER_4_CHOICE_IDS, CHAPTER_4_SCENE_IDS } from "../src/story/chapter4";
import { choice, openCheckedInFixture, scene } from "./helpers/saveFixtures";

test("Folded Map graybox fails forward, decodes the true route, and awards the deeper cache once", async ({ page }) => {
  await openCheckedInFixture(page, "Test Folded Map Graybox");

  await expect(page.getByRole("heading", { name: "Folded Map Graybox" })).toBeVisible();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.foldedMapGraybox)).toBeVisible();
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.rootArrow)).toBeDisabled();

  await choice(page, CHAPTER_4_CHOICE_IDS.surveyLantern).click();
  await choice(page, CHAPTER_4_CHOICE_IDS.crownShortcut).click();
  await expect(page.getByTestId("folded-map-feedback")).toContainText("sealed maintenance approach");
  await expect(page.getByText("Maintenance pressure recorded")).toBeVisible();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.foldedMapReview)).toBeVisible();

  await choice(page, CHAPTER_4_CHOICE_IDS.surveyLantern).click();
  await choice(page, CHAPTER_4_CHOICE_IDS.keeperLantern).click();
  await expect(page.getByTestId("folded-map-feedback")).toContainText("one winding route");
  await expect(page.getByText("True route decoded", { exact: true })).toBeVisible();
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.rootArrow)).toBeEnabled();

  await choice(page, CHAPTER_4_CHOICE_IDS.rootArrow).click();
  await choice(page, CHAPTER_4_CHOICE_IDS.brokenBridge).click();
  await expect(page.getByTestId("folded-map-feedback")).toContainText("awards one Lanternwell Drop");
  await expect(page.getByText("Lanternwell cache reward claimed once.")).toBeVisible();

  await choice(page, CHAPTER_4_CHOICE_IDS.close).click();
  await page.getByRole("button", { name: "Review Folded Map Graybox" }).click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.foldedMapReview)).toBeVisible();
  await choice(page, CHAPTER_4_CHOICE_IDS.rootArrow).click();
  await choice(page, CHAPTER_4_CHOICE_IDS.brokenBridge).click();
  await expect(page.getByTestId("folded-map-feedback")).not.toContainText("awards one Lanternwell Drop");
});

test("Folded Map Back clears a selected edge before closing", async ({ page }) => {
  await openCheckedInFixture(page, "Test Folded Map Graybox");

  await choice(page, CHAPTER_4_CHOICE_IDS.surveyLantern).click();
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.surveyLantern)).toHaveAttribute("aria-pressed", "true");
  await choice(page, CHAPTER_4_CHOICE_IDS.back).click();
  await expect(page.getByTestId("folded-map-feedback")).toContainText("Selection cleared");
  await expect(scene(page, CHAPTER_4_SCENE_IDS.foldedMapGraybox)).toBeVisible();

  await choice(page, CHAPTER_4_CHOICE_IDS.back).click();
  await expect(page.getByRole("heading", { name: "Folded Map Graybox" })).toHaveCount(0);
});

test("Folded Map graybox remains operable at phone width", async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await openCheckedInFixture(page, "Test Folded Map Graybox");

  await expect(page.getByRole("heading", { name: "Folded Map Graybox" })).toBeInViewport();
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.surveyLantern)).toBeVisible();
  await choice(page, CHAPTER_4_CHOICE_IDS.surveyLantern).click();
  await choice(page, CHAPTER_4_CHOICE_IDS.keeperLantern).click();
  await expect(page.getByTestId("folded-map-feedback")).toContainText("one winding route");
});
