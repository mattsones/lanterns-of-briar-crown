import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { buildChapter5SaveState, type Chapter5SaveState } from "../src/game/chapter5Runtime";
import { CHAPTER_5_EVIDENCE_ITEMS } from "../src/game/chapter5Progress";
import { parseDiskSaveText, STORAGE_KEY } from "../src/game/save";
import type { SavePayload } from "../src/game/types";
import { choice } from "./helpers/saveFixtures";

const fixture = () => parseDiskSaveText(readFileSync("public/saves/chapter-4-complete.json", "utf8")).payload;
const a = (page: Page, id: string) => choice(page, `ch5-${id}`);
const saved = (page: Page): Promise<SavePayload> => page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
async function load(page: Page, payload: SavePayload) {
  await page.goto("/");
  await page.getByRole("button", { name: "Load Save Slot", exact: true }).click();
  await page.locator('input[type="file"]').setInputFiles({ name: "chapter5-full.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(payload)) });
}
async function reload(page: Page) { await page.reload(); await page.getByRole("button", { name: "Continue Checkpoint" }).click(); }
async function go(page: Page, ...nodes: string[]) {
  for (const node of nodes) {
    await page.locator(`[data-ch5-map-node="${node}"]`).click();
    await expect(page.getByTestId("chapter5-spike")).toHaveAttribute("data-ch5-node", node);
  }
}
const inspect = (page: Page) => page.getByRole("button", { name: "Inspect", exact: true }).click();
const back = (page: Page) => a(page, "back").click();
async function win(page: Page, ordinary = false) {
  for (let turn = 0; turn < 32; turn++) {
    const claim = page.getByRole("button", { name: "Claim Victory", exact: true });
    const attack = page.getByRole("button", { name: ordinary ? /^Pebbleknock Slam/ : /^Strike/ });
    await expect.poll(async () => await claim.isVisible() || await attack.isEnabled()).toBe(true);
    if (await claim.isVisible()) { await claim.click(); return; }
    const resolve = page.getByRole("button", { name: /^Roadwarden's Resolve/ });
    if (ordinary && await resolve.isEnabled()) await resolve.click();
    else await attack.click();
  }
  throw new Error("Battle did not reach victory.");
}
function rescued(): Chapter5SaveState {
  return { ...buildChapter5SaveState(), started: true, node: "carriage", view: "carriage", lioSeen: true,
    brackenDefeated: true, carriageStage: "rescued", milestoneAwarded: true,
    briarhold: { ...buildChapter5SaveState().briarhold, entry: "culvert", innerDoorOpened: true } };
}
function gathered(): Chapter5SaveState {
  return { ...rescued(), node: "gathering", view: "gathering", ledgerResolved: true, clerkFreed: true,
    workshopResolved: true, workshopResolution: "surrendered", cellsOpened: true, porterFreed: true, wardenFreed: true,
    evidence: ["transfer-ledger", "genuine-office-instruction", "false-seals", "examiner-transfer-record"], examinerLeadLearned: true, siblingsReunited: true };
}
async function finishCleanup(page: Page) {
  await a(page, "continue-rescue").click();
  await go(page, "crown"); await inspect(page); await a(page, "take-docket").click();
  await back(page); await go(page, "cells"); await inspect(page);
  await a(page, "open-cells").click(); await a(page, "free-porter").click(); await a(page, "free-warden").click();
  await back(page); await go(page, "crown", "grille", "door", "hub", "ledger"); await inspect(page);
  if (await a(page, "officer-surrender").isVisible()) await a(page, "officer-surrender").click();
  for (const id of ["free-clerk", "take-ledger", "take-instruction"]) if (await a(page, id).isVisible()) await a(page, id).click();
  await back(page); await go(page, "hub", "workshop"); await inspect(page);
  if (await a(page, "workshop-surrender").isVisible()) await a(page, "workshop-surrender").click();
  if (await a(page, "take-seals").isVisible()) await a(page, "take-seals").click();
  await back(page); await go(page, "hub", "landing", "gathering"); await inspect(page);
  await expect(a(page, "depart")).toBeDisabled();
  await a(page, "hear-examiner").click();
  await expect(page.getByTestId("ch5-feedback")).toContainText("Celia Venn");
  await expect(a(page, "depart")).toBeDisabled();
  await a(page, "reunite-siblings").click(); await a(page, "pack-supplies").click();
}
async function walkToFork(page: Page) {
  await a(page, "depart").click(); await back(page); await go(page, "returnRidge", "woodsman");
  await expect(a(page, "hear-woodsman")).toBeVisible();
  await a(page, "hear-woodsman").click();
  await expect(page.getByTestId("ch5-feedback")).toContainText("two adult tuskers");
  await go(page, "fork");
}
async function finishTown(page: Page) {
  await expect(a(page, "return-talk")).toBeVisible(); await a(page, "return-talk").click();
  await expect(page.getByTestId("ch5-feedback")).toContainText("washed-out crossing became a minor delay");
  await go(page, "townGate"); await back(page); await go(page, "square");
  expect((await saved(page)).flags.chapterFiveClear).toBe(false);
  await a(page, "homecoming").click();
  await expect(page.getByTestId("ch5-feedback")).toContainText("Hollis catches him by both shoulders");
  expect((await saved(page)).flags.briarCrownFactionRevealed).toBe(false);
  await back(page); await go(page, "watchhouse"); await inspect(page);
  await expect(a(page, "close-chapter")).toHaveCount(0);
  await a(page, "read-case").click();
  expect((await saved(page)).flags.chapterFiveClear).toBe(false);
  await reload(page);
  await a(page, "close-chapter").click();
  await expect(page.getByTestId("ch5-feedback")).toContainText("He is still out there.");
  await expect(page.getByTestId("ch5-feedback")).toContainText("So are we.");
  await expect(page.getByTestId("ch5-complete")).toBeVisible();
  const done = await saved(page);
  expect(done).toMatchObject({ region: "bramblecross", position: { x: 6, y: 8 }, chapterId: 5,
    flags: { chapterFiveClear: true, lioRescued: true, brackenEscaped: true, briarCrownFactionRevealed: true } });
  for (const item of Object.values(CHAPTER_5_EVIDENCE_ITEMS)) expect(done.player.inventory[item]).toBe(1);
  await reload(page);
  await expect(page.getByTestId("ch5-complete")).toBeVisible();
  await a(page, "review-case").click(); await a(page, "review-ending").click();
  expect((await saved(page)).player).toEqual(done.player);
  return done;
}

test("full chapter from the title: ordinary quiet puzzle route, rescue, safe return, and private ending", async ({ page }) => {
  test.setTimeout(150_000);
  await page.addInitScript(() => { Math.random = () => .5; });
  await page.goto("/"); await page.getByRole("button", { name: "Begin Chapter 5 Playtest", exact: true }).click();
  await page.getByTestId("open-adventure-menu").click();
  await page.getByRole("button", { name: "Companion", exact: true }).click();
  await page.getByLabel("Companion battle order").selectOption("Defend Me");
  await page.getByRole("button", { name: "Close Adventure Menu", exact: true }).click();
  await a(page, "cross-ridge").click(); await a(page, "recover").click(); await back(page);
  await go(page, "ridge", "runoff", "culvert"); await inspect(page); await a(page, "enter-culvert").click();
  await back(page); await go(page, "hub", "ledger"); await inspect(page);
  await a(page, "resolve-ledger").click();
  await page.evaluate(() => { Math.random = () => .99; }); // Exercise the successful quiet check with the actual fixture bonus.
  await a(page, "secure-ledger").click();
  await page.evaluate(() => { Math.random = () => .5; });
  await a(page, "free-clerk").click();
  await a(page, "take-ledger").click(); await a(page, "take-instruction").click(); await a(page, "read-chart").click();
  await back(page); await go(page, "hub", "workshop"); await inspect(page);
  await a(page, "resolve-workshop").click(); await a(page, "take-shim").click(); await a(page, "disable-workshop").click(); await a(page, "take-seals").click();
  await back(page); await go(page, "hub", "ledger"); await inspect(page); await a(page, "open-drawer").click();
  await back(page); await go(page, "hub", "workshop", "lanterns"); await inspect(page);
  for (const [i, pane] of ["red", "amber", "blue"].entries()) await page.getByLabel(`${["Left", "Center", "Right"][i]} lantern pane`).selectOption(pane);
  await a(page, "transmit").click(); await a(page, "uncover-gold").click(); await a(page, "restore-gold").click();
  await back(page); await go(page, "door"); await inspect(page); await a(page, "unlock-door").click();
  await back(page); await go(page, "grille"); await a(page, "recognize-lio").click(); await go(page, "crown"); await inspect(page);
  await a(page, "fight-bracken").click(); await win(page, true);
  for (let i = 0; i < 3; i++) await a(page, "rescue-step").click();
  await page.getByRole("dialog", { name: "Level Up!" }).getByRole("button", { name: /Resolve/ }).click();
  expect((await saved(page)).player).toMatchObject({ level: 5, xp: 33 });
  await finishCleanup(page);
  await reload(page); await expect(a(page, "pack-supplies")).toHaveCount(0);
  await walkToFork(page); await a(page, "safe-detour").click(); await go(page, "longTrail", "eastRoad");
  const done = await finishTown(page);
  expect(done.chapter5).toMatchObject({ returnRoute: "safe-detour", tuskersDefeated: false, workshopResolution: "bypassed" });
  expect(done.player.xp).toBe(33);
  await page.screenshot({ path: "test-results/ch5-full-ending-desktop.png", fullPage: true });
});

test("a legacy carriage checkpoint with skipped wings finishes all cleanup without another mandatory fight", async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 390, height: 844 });
  const p = fixture(); p.chapter5 = rescued(); p.player.level = 5;
  // Simulate the saved format before the full-chapter fields existed.
  for (const key of ["workshopResolution", "evidence", "cellsOpened", "porterFreed", "wardenFreed", "departed", "caseWallComplete"]) delete p.chapter5[key];
  p.companion = { ...p.companion, recruited: false, hp: 0, id: null };
  await load(page, p);
  await back(page); await go(page, "crown", "grille", "door", "hub", "landing", "gathering"); await inspect(page);
  await expect(a(page, "depart")).toBeDisabled(); await expect(a(page, "hear-examiner")).toBeDisabled();
  await back(page); await go(page, "landing", "hub", "door", "grille", "crown", "carriage"); await inspect(page);
  await finishCleanup(page);
  await page.screenshot({ path: "test-results/ch5-full-court-phone.png", fullPage: true });
  const before = await saved(page);
  expect(before.chapter5).toMatchObject({ ledgerResolved: true, workshopResolution: "surrendered", checks: {} });
  expect(before.player.gold).toBe(p.player.gold + 12);
  await walkToFork(page);
  await a(page, "choose-hollow").click(); await inspect(page); await back(page); await go(page, "fork");
  await a(page, "safe-detour").click(); await go(page, "longTrail", "eastRoad");
  const done = await finishTown(page);
  expect(done.player.hp).toBe(p.player.hp);
  expect(done.chapter5.tuskersDefeated).toBe(false);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: "test-results/ch5-full-ending-phone.png", fullPage: true });
});

test("optional tuskers use ordinary level-five combat, save a retry, and rejoin the same ending", async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 430, height: 932 });
  await page.addInitScript(() => { Math.random = () => .5; });
  const p = fixture(); p.chapter5 = gathered(); p.player.level = 5; p.player.hp = p.player.maxHp = 54;
  p.companion.command = "Defend Me"; p.companion.hp = p.companion.maxHp;
  await load(page, p); await a(page, "pack-supplies").click();
  await walkToFork(page); await a(page, "choose-hollow").click(); await inspect(page);
  const before = await saved(page);
  await a(page, "fight-tuskers").click();
  const battle = page.getByRole("dialog", { name: /Battle/ });
  await expect(battle).toContainText("2 of 2 enemies");
  await page.getByText("Recent Events", { exact: true }).click();
  await expect(battle).toContainText("Lio leads Mara and the rescued party behind the fallen trunk");
  await page.screenshot({ path: "test-results/ch5-tuskers-phone.png", fullPage: true });
  await reload(page); await a(page, "resume-battle").click(); await win(page, true);
  const won = await saved(page);
  expect(won.player.xp).toBe(before.player.xp + 8);
  expect(won.chapter5.briarhold.alert).toBe(before.chapter5.briarhold.alert);
  await reload(page); await expect(a(page, "fight-tuskers")).toHaveCount(0);
  await back(page); await go(page, "hollowEdge", "eastRoad");
  const done = await finishTown(page);
  expect(done.chapter5).toMatchObject({ returnRoute: "tusker-hollow", tuskersDefeated: true });
  expect(done.player.xp).toBe(won.player.xp);
  expect(done.player.hp).toBeGreaterThan(0);
});

test("Rowan containment and Moss bypass require a conscious companion; open room fights alert the station", async ({ page }) => {
  test.setTimeout(90_000);
  await page.addInitScript(() => { Math.random = () => .5; });
  const p = fixture();
  p.chapter5 = { ...buildChapter5SaveState(), started: true, node: "workshop", view: "workshop",
    briarhold: { ...buildChapter5SaveState().briarhold, entry: "culvert" } };
  p.companion.hp = 0; await load(page, p);
  await expect(a(page, "contain-dessa")).toHaveCount(0);
  p.companion.hp = p.companion.maxHp; await load(page, p);
  await a(page, "contain-dessa").click();
  expect((await saved(page)).chapter5).toMatchObject({ workshopResolution: "contained", rowanContainmentUsed: true, briarhold: { alert: "quiet" } });
  await reload(page); await expect(a(page, "contain-dessa")).toHaveCount(0);
  p.chapter5 = (await saved(page)).chapter5; p.companion.id = "moss"; p.companion.name = "Moss"; p.companion.style = "mender";
  await load(page, p); await a(page, "moss-feed").click();
  expect((await saved(page)).chapter5).toMatchObject({ mossBypassUsed: true, briarhold: { workshopDisabled: true } });
  for (const room of ["ledger", "workshop"] as const) {
    p.chapter5 = { ...buildChapter5SaveState(), started: true, node: room, view: room,
      briarhold: { ...buildChapter5SaveState().briarhold, entry: "culvert" } };
    p.player.baseStats.Might = 200; p.player.baseStats.Guard = 200;
    await load(page, p); await a(page, room === "ledger" ? "fight-officer" : "fight-workshop").click(); await win(page);
    const s = (await saved(page)).chapter5;
    expect(s.briarhold.alert).toBe("alerted");
    expect(room === "ledger" ? s.ledgerResolved : s.workshopResolution === "fought").toBe(true);
    await reload(page); await expect(a(page, room === "ledger" ? "fight-officer" : "fight-workshop")).toHaveCount(0);
  }
});
