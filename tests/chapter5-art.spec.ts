import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { CH5_APPROACH_MAP, CH5_RESCUE_MAP } from "../src/data/chapter5Maps";
import { buildChapter5SaveState, type Chapter5SaveState } from "../src/game/chapter5Runtime";
import { parseDiskSaveText, STORAGE_KEY } from "../src/game/save";
import { choice } from "./helpers/saveFixtures";

const start = (): Chapter5SaveState => ({ ...buildChapter5SaveState(), started: true, view: null });
const room = (overrides: Partial<Chapter5SaveState> = {}): Chapter5SaveState => ({ ...start(), node: "grille", lioSeen: true,
  briarhold: { ...start().briarhold, entry: "culvert", innerDoorOpened: true }, ...overrides });
async function load(page: Page, s: Chapter5SaveState, companionHP?: number) {
  const payload = parseDiskSaveText(readFileSync("public/saves/chapter-4-complete.json", "utf8")).payload;
  payload.chapter5 = s; payload.player.level = 5;
  if (companionHP !== undefined) payload.companion.hp = companionHP;
  await page.goto("/");
  await page.getByRole("button", { name: "Load Save Slot", exact: true }).click();
  await page.locator('input[type="file"]').setInputFiles({ name: "chapter5-art.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(payload)) });
}
const saved = (page: Page) => page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
async function reload(page: Page) { await page.reload(); await page.getByRole("button", { name: "Continue Checkpoint", exact: true }).click(); }
const frame = (page: Page) => page.getByTestId("ch5-painted-map");
async function loaded(page: Page) { await expect.poll(() => page.getByTestId("ch5-map-background").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth)).toBe(2048); }

for (const preset of [{ name: "desktop", width: 1280, height: 720, mapWidth: 870, token: 52 },
  { name: "phone390", width: 390, height: 844, mapWidth: 332, token: 32 },
  { name: "phone430", width: 430, height: 932, mapWidth: 372, token: 32 }]) {
  for (const kind of ["approach", "rescue"] as const) test(`${kind} painting uses the master crop and hero scale at ${preset.name}`, async ({ page }) => {
    await page.setViewportSize(preset);
    const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
    await load(page, kind === "approach" ? start() : room());
    await loaded(page);
    expect(await page.getByTestId("ch5-map-background").evaluate(image => getComputedStyle(image).filter)).toBe("none");
    const layout = kind === "approach" ? CH5_APPROACH_MAP : CH5_RESCUE_MAP;
    await expect(frame(page)).toHaveAttribute("data-map-id", layout.id);
    const map = await frame(page).boundingBox(); const hero = await page.getByTestId("ch5-hero-token").boundingBox();
    expect(map.width).toBeCloseTo(preset.mapWidth, 0);
    expect(map.height).toBeCloseTo(preset.mapWidth * layout.bounds[3] / layout.bounds[2], 0);
    expect(hero.width).toBeCloseTo(preset.token, 0); expect(hero.height).toBeCloseTo(preset.token, 0);
    const point = layout.nodes[kind === "approach" ? "overlook" : "grille"].point;
    expect(hero.x + hero.width / 2).toBeCloseTo(map.x + (point[0] - layout.bounds[0]) / layout.bounds[2] * map.width, 0);
    expect(hero.y + hero.height * .7).toBeCloseTo(map.y + (point[1] - layout.bounds[1]) / layout.bounds[3] * map.height, 0);
    await expect(page.getByTestId("ch5-map-paths")).toHaveCount(0);
    await expect(page.getByLabel("Show paths")).not.toBeChecked();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await frame(page).screenshot({ path: `test-results/ch5-art-${kind}-${preset.name}.png` });
    expect(errors).toEqual([]);
  });
}

test("phone footsteps and reciprocal controls survive reload before the next story anchor", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await load(page, start());
  const before = await saved(page);
  await page.getByRole("button", { name: "Move down", exact: true }).click();
  await expect(frame(page)).toHaveAttribute("data-map-position", "a01");
  await expect(page.getByRole("button", { name: "Inspect", exact: true })).toBeDisabled();
  await reload(page);
  await expect(frame(page)).toHaveAttribute("data-map-position", "a01");
  expect((await saved(page)).player).toEqual({ ...before.player, checkpointLabel: "Briarhold Waystation" });
  await page.keyboard.press("ArrowUp"); await expect(frame(page)).toHaveAttribute("data-map-position", "overlook");
  await page.keyboard.press("ArrowDown"); await page.keyboard.press("ArrowRight"); await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("chapter5-spike")).toHaveAttribute("data-ch5-node", "ridge");
  await expect(page.locator('[data-scene-id="ch5-ridge"]')).toBeVisible();
  await expect(page.getByRole("button", { name: "Back to the path", exact: true })).toHaveCount(0);
  await page.keyboard.press("ArrowDown"); await expect(frame(page)).toHaveAttribute("data-map-position", "a04");
  await page.keyboard.press("ArrowUp"); await expect(frame(page)).toHaveAttribute("data-map-position", "ridge");
});

test("the first grille sight gates the room; the gallery exit returns to the existing hub graph", async ({ page }) => {
  await load(page, room({ lioSeen: false, view: "grille" }));
  await expect(page.locator('[data-ch5-map-node="crown"]')).toBeDisabled();
  await choice(page, "ch5-recognize-lio").click();
  await page.getByRole("button", { name: "Move down", exact: true }).click();
  await expect(frame(page)).toHaveAttribute("data-map-position", "r00");
  await page.getByRole("button", { name: "Move up", exact: true }).click();
  await expect(frame(page)).toHaveAttribute("data-map-position", "grille");
  await page.locator('[data-ch5-map-node="crown"]').click();
  await expect(page.getByTestId("chapter5-spike")).toHaveAttribute("data-ch5-node", "crown");
  await expect(page.locator('[data-ch5-actor="mara"]')).toBeAttached();
  await page.locator('[data-ch5-map-node="door"]').click();
  await expect(frame(page)).toHaveCount(0);
  await expect(page.getByTestId("chapter5-spike")).toHaveAttribute("data-ch5-node", "door");
});

test("guide light, the cart, cuff, loot and cell occupants follow the saved rescue states on phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const dark = room({ node: "carriage", view: "carriage", brackenDefeated: true });
  await load(page, dark, 0); await loaded(page);
  await expect(page.getByTestId("ch5-map-background")).toHaveAttribute("src", /rescue-closed/);
  await expect(page.getByTestId("ch5-brake-rod")).toHaveCount(0);
  await expect(page.getByTestId("ch5-cart")).toHaveAttribute("data-state", "released");
  await expect(page.locator('[data-ch5-actor="companion"]')).toHaveCount(0);
  for (const id of ["bracken", "sentry", "guard-west", "guard-east"]) await expect(page.locator(`[data-ch5-actor="${id}"]`)).toHaveCount(0);
  await expect(page.locator('[data-ch5-actor="fallen-sentry"]')).toBeAttached();
  await expect(page.getByTestId("ch5-escape-door")).toHaveAttribute("data-state", "closed-after-flight");
  const lit = { ...dark, briarhold: { ...dark.briarhold, lanternsRestored: true } };
  await load(page, lit); await loaded(page);
  await expect(page.getByTestId("ch5-map-background")).toHaveAttribute("src", /rescue-open/);
  await expect(page.getByTestId("ch5-brake-rod")).toBeAttached();
  await choice(page, "ch5-rescue-step").click();
  await expect(page.getByTestId("ch5-cart")).toHaveAttribute("data-state", "caught");
  const stoppedY = Number((await page.getByTestId("ch5-cart").getAttribute("transform")).match(/54\.8 ([\d.]+)/)[1]);
  expect(21.5 - (stoppedY + .6)).toBeCloseTo(.7);
  await reload(page); await expect(page.getByTestId("ch5-cart")).toHaveAttribute("data-state", "caught");
  await choice(page, "ch5-rescue-step").click();
  await expect(page.getByTestId("ch5-cuff")).toHaveAttribute("data-state", "closed");
  await expect(page.getByTestId("ch5-cart")).toHaveAttribute("data-state", "braked");
  await choice(page, "ch5-rescue-step").click();
  await expect(page.getByTestId("ch5-cuff")).toHaveAttribute("data-state", "open");
  await expect(page.locator('[data-ch5-actor="lio"]')).toHaveCount(0);
  await expect(page.getByTestId("ch5-fallen-sabre")).toBeAttached();
  await choice(page, "ch5-continue-rescue").click(); await page.locator('[data-ch5-map-node="crown"]').click();
  await choice(page, "ch5-take-bracken-loot").click();
  await expect(page.getByTestId("ch5-fallen-sabre")).toHaveCount(0);
  await page.locator('[data-ch5-map-node="cells"]').click();
  await expect(page.locator('[data-ch5-actor="far-cell-prisoner"]')).toBeAttached();
  await expect(page.locator('[data-ch5-actor="near-cell-prisoner"]')).toHaveCount(0);
  await expect(page.getByTestId("ch5-cell-bundle")).toBeAttached();
  await choice(page, "ch5-open-cells").click(); await choice(page, "ch5-free-warden").click();
  await expect(page.getByTestId("ch5-cell-bars")).toHaveAttribute("data-state", "open");
  await expect(page.locator('[data-ch5-actor="far-cell-prisoner"]')).toHaveCount(0);
  await frame(page).screenshot({ path: "test-results/ch5-art-rescue-open-cleanup-phone.png" });
});

test("a missing map image preserves landmark controls and saved navigation", async ({ page }) => {
  await page.route("**/*briarhold-approach-v05*", route => route.abort());
  await load(page, start());
  await expect(frame(page)).toHaveAttribute("data-map-art", "fallback");
  await expect(page.getByTestId("ch5-map-paths")).toBeAttached();
  await page.locator('[data-ch5-map-node="ridge"]').click();
  await expect(page.getByTestId("chapter5-spike")).toHaveAttribute("data-ch5-node", "ridge");
  expect((await saved(page)).chapter5.briarhold.entry).toBeNull();
});

test("the opening begins on the road and the silent climb reaches the off-road shelter", async ({ page }) => {
  await page.goto("/"); await page.getByRole("button", { name: "Begin Chapter 5 Playtest", exact: true }).click();
  await expect(frame(page)).toHaveAttribute("data-map-position", "opening");
  await expect(page.getByTestId("ch5-map-location")).toHaveText("The road below Briarhold");
  await choice(page, "ch5-cross-ridge").click();
  await expect(frame(page)).toHaveAttribute("data-map-position", "overlook");
  expect((await saved(page)).chapter5.recoveryUsed).toBe(false);
});

for (const success of [true, false]) test(`the culvert grate ${success ? "opens" : "wedges"} after its saved attempt`, async ({ page }) => {
  await page.addInitScript(roll => { Math.random = () => roll; }, success ? .99 : .01);
  await load(page, { ...start(), node: "culvert", view: "culvert" });
  await expect(page.getByTestId("ch5-culvert-grate")).toHaveAttribute("data-state", "closed");
  await choice(page, "ch5-open-culvert-grate").click();
  await expect(page.getByTestId("ch5-culvert-grate")).toHaveAttribute("data-state", success ? "open" : "wedged");
  await reload(page);
  await expect(page.getByTestId("ch5-culvert-grate")).toHaveAttribute("data-state", success ? "open" : "wedged");
  expect((await saved(page)).chapter5.briarhold.entry).toBeNull();
});

test("the legacy near-cell porter is exclusive with the bundle and disappears when freed", async ({ page }) => {
  const oldCells = room({ node: "cells", view: "cells", brackenDefeated: true, carriageStage: "rescued", cellsOpened: true, porterAtWorkshop: false });
  await load(page, oldCells);
  await expect(page.locator('[data-ch5-actor="near-cell-prisoner"]')).toBeAttached();
  await expect(page.getByTestId("ch5-cell-bundle")).toHaveCount(0);
  await choice(page, "ch5-free-porter").click();
  await expect(page.locator('[data-ch5-actor="near-cell-prisoner"]')).toHaveCount(0);
  await reload(page); await expect(page.getByTestId("ch5-cell-bundle")).toHaveCount(0);
});
