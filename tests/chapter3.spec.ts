import { expect, test } from "@playwright/test";
import { MAPS } from "../src/data/maps";

test("Chapter 3 ready save enters Westroot and corrects the Witness Stones fail-forward", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/");
  await page.getByRole("button", { name: "Load Chapter 3 Ready Save" }).click();

  await expect(page.getByRole("heading", { name: MAPS.westrootHub.name })).toBeVisible();
  await expect(page.getByText("Goal: Enter Westroot")).toBeVisible();
  await expect(page.getByText("You are standing on: First Westroot Gate.")).toBeVisible();

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByText("Who opened my gate?")).toBeVisible();
  await page.getByRole("button", { name: "The road opened when we told it the truth." }).click();
  await page.getByRole("button", { name: "Listen before asking for more." }).click();

  await page.getByTestId("move-right").click();
  await page.getByTestId("move-right").click();
  await expect(page.getByText("You are the gate problem.")).toBeVisible();
  await page.getByRole("button", { name: "What does the lantern shutter do?" }).click();
  await page.getByRole("button", { name: "Thank Quill." }).click();

  await page.getByTestId("move-down").click();
  await page.getByTestId("move-right").click();
  await expect(page.getByText("Do not step on the names")).toBeVisible();
  await page.getByRole("button", { name: "Study the Witness Stones." }).click();
  await expect(page.getByText("The old road did not begin with command.").first()).toBeVisible();

  await page.getByRole("button", { name: "False Crown — obey without guidance." }).click();
  await expect(page.getByText("A mistake")).toBeVisible();
  await page.getByRole("button", { name: "Name the mistake and try again." }).click();
  await page.getByRole("button", { name: "Witness — tell what is true." }).click();
  await page.getByRole("button", { name: "Warning — name the danger." }).click();
  await page.getByRole("button", { name: "Shelter — protect the traveler." }).click();
  await page.getByRole("button", { name: "Water — sustain the journey." }).click();

  await expect(page.getByText("A ROAD IS SAFEST WHEN TRUTH WALKS IT FIRST.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Follow the Willow cargo." })).toBeVisible();
});
