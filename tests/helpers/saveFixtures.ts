import type { Page } from "@playwright/test";
import { STORAGE_KEY } from "../../src/game/save";
import type { SavePayload } from "../../src/game/types";

export async function clearGameStorage(page: Page) {
  await page.addInitScript(() => window.localStorage.clear());
}

export async function installCheckpoint(page: Page, payload: SavePayload) {
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: payload },
  );
}

export async function continueCheckpoint(page: Page, payload: SavePayload) {
  await installCheckpoint(page, payload);
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
}

export async function openCheckedInFixture(page: Page, buttonName: string) {
  await clearGameStorage(page);
  await page.goto("/");
  await page.getByRole("button", { name: buttonName }).click();
}

export function scene(page: Page, sceneId: string) {
  return page.locator(`[data-scene-id="${sceneId}"]`);
}

export function choice(page: Page, choiceId: string) {
  return page.locator(`[data-choice-id="${choiceId}"]`);
}
