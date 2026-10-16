import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { buildChapter5SaveState, type Chapter5SaveState } from "../src/game/chapter5Runtime";
import { buildBriarholdState, enterBriarhold } from "../src/game/chapter5";
import { parseDiskSaveText, STORAGE_KEY } from "../src/game/save";
import type { SavePayload } from "../src/game/types";
import { choice } from "./helpers/saveFixtures";

const fixture = () => parseDiskSaveText(readFileSync("public/saves/chapter-4-complete.json", "utf8")).payload;
const spike = (overrides: Partial<Chapter5SaveState> = {}) => ({ ...buildChapter5SaveState(), started: true,
  node: "hub" as const, view: null, briarhold: enterBriarhold(buildBriarholdState(), "culvert"), ...overrides });
async function load(page: Page, state: Chapter5SaveState, powerful = false) {
  const payload = fixture();
  payload.chapter5 = state;
  payload.flags.chapterFiveStarted = true;
  if (powerful) { payload.player.baseStats.Might = 200; payload.player.baseStats.Guard = 200; }
  await importPayload(page, payload);
}
async function importPayload(page: Page, payload: SavePayload) {
  await page.goto("/");
  await page.getByRole("button", { name: "Load Save Slot", exact: true }).click();
  await page.locator('input[type="file"]').setInputFiles({ name: "chapter5-test.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(payload)) });
}
async function go(page: Page, node: string) {
  await page.locator(`[data-ch5-map-node="${node}"]`).click();
  await expect(page.getByTestId("chapter5-spike")).toHaveAttribute("data-ch5-node", node);
}
async function inspect(page: Page) { await page.getByRole("button", { name: "Inspect", exact: true }).click(); }
async function back(page: Page) { await choice(page, "ch5-back").click(); }
async function panes(page: Page, arrangement: string[]) {
  for (let i = 0; i < 3; i++) await page.getByLabel(`${["Left", "Center", "Right"][i]} lantern pane`).selectOption(arrangement[i]);
}
async function saved(page: Page) { return page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY); }
async function reload(page: Page) {
  await page.reload();
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
}
async function win(page: Page) {
  for (let turn = 0; turn < 20; turn++) {
    const claim = page.getByRole("button", { name: "Claim Victory", exact: true });
    if (await claim.isVisible()) { await claim.click(); return; }
    const strike = page.getByRole("button", { name: /^Strike/ });
    await expect(strike).toBeEnabled({ timeout: 8000 });
    await strike.click();
  }
  throw new Error("Confrontation did not reach victory.");
}

test("real entry, early drawer revisit, fixed chart, pane-only edits, Back, and quiet door chain", async ({ page }) => {
  test.slow();
  await page.addInitScript(() => { Math.random = () => .99; });
  await page.goto("/");
  await page.getByRole("button", { name: "Begin Chapter 5 Playtest", exact: true }).click();
  await choice(page, "ch5-cross-ridge").click();
  await choice(page, "ch5-recover").click();
  expect((await saved(page)).player.hp).toBe(50);
  await expect(choice(page, "ch5-recover")).toHaveCount(0);
  await back(page);
  await go(page, "ridge"); await go(page, "runoff"); await go(page, "culvert"); await inspect(page);
  await choice(page, "ch5-enter-culvert").click();
  await expect(page.locator('[data-scene-id="ch5-service-landing"]')).toBeVisible();
  const landingText = await page.getByTestId("ch5-scene-narrative").innerText();
  await expect(page.getByTestId("ch5-scene-narrative")).toContainText("culvert stair");
  await back(page); await go(page, "hub"); await inspect(page);
  await expect(page.locator('[data-scene-id="ch5-briarhold-hub"]')).toBeVisible();
  expect(await page.getByTestId("ch5-scene-narrative").innerText()).not.toBe(landingText);
  await back(page);
  await go(page, "ledger"); await inspect(page); await choice(page, "ch5-resolve-ledger").click();
  await choice(page, "ch5-secure-ledger").click(); await choice(page, "ch5-free-clerk").click();
  await choice(page, "ch5-open-drawer").click();
  await expect(page.getByTestId("ch5-feedback")).toContainText("leaving the drawer intact");
  await choice(page, "ch5-read-chart").click();
  await expect(page.getByTestId("ch5-signal-chart")).toContainText("Front Gate Alert");
  await back(page); await go(page, "hub"); await go(page, "workshop"); await inspect(page);
  await choice(page, "ch5-resolve-workshop").click(); await choice(page, "ch5-take-shim").click();
  await choice(page, "ch5-disable-workshop").click();
  await back(page); await go(page, "hub"); await go(page, "ledger"); await inspect(page);
  await choice(page, "ch5-open-drawer").click();
  await expect(page.getByTestId("ch5-feedback")).toContainText("spare inner-door key");
  await back(page); await go(page, "hub"); await go(page, "workshop"); await go(page, "lanterns"); await inspect(page);
  await expect(choice(page, "ch5-transmit")).toBeDisabled();
  await panes(page, ["red", "amber", "blue"]);
  await choice(page, "ch5-transmit").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("chapter5-spike")).toHaveAttribute("data-ch5-node", "lanterns");
  expect((await saved(page)).chapter5.briarhold.guardsDistracted).toBe(false);
  await expect(page.getByTestId("ch5-signal-chart")).toHaveCount(0);
  await back(page); await inspect(page);
  await expect(page.getByLabel("Center lantern pane")).toHaveValue("amber");
  await choice(page, "ch5-transmit").click();
  await choice(page, "ch5-uncover-gold").click();
  await expect(page.getByTestId("ch5-scene-narrative")).toContainText("wedged between the shutter and its frame");
  await expect(page.getByTestId("ch5-scene-narrative")).not.toContainText(/False Order|Shaken|penalty/);
  await choice(page, "ch5-restore-gold").click();
  await reload(page);
  await expect(page.getByTestId("ch5-feedback")).toContainText("Warm gold lamplight");
  await back(page); await go(page, "door"); await inspect(page); await choice(page, "ch5-unlock-door").click();
  await back(page); await go(page, "grille");
  await page.keyboard.press("Escape");
  await expect(choice(page, "ch5-recognize-lio")).toBeVisible();
  await choice(page, "ch5-recognize-lio").click(); await go(page, "crown"); await inspect(page);
  await expect(page.getByRole("dialog", { name: "Crown Table" })).not.toContainText(/False Order|Shaken|penalty|repair|opponents answer/);
  await choice(page, "ch5-fight-bracken").click();
  await expect(page.getByRole("dialog", { name: /Battle/ })).toContainText("2 of 2 enemies");
  const data = await saved(page);
  expect(data.chapter5.bossProfile).toMatchObject({ enemyIds: ["bracken_voss", "thornroot_sentry"], falseOrderPenalty: 0, sentryRepairAvailable: false });
  expect(data.position).toEqual({ x: 4, y: 1 }); // underlying Relay cannot move behind the interaction
});

test("ledger knowledge follows cover, temporary distraction, officer restraint, and clerk release", async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => .99; });
  await load(page, spike({ node: "ledger", view: "ledger" }));
  const story = page.getByTestId("ch5-scene-narrative");
  await expect(story).toContainText("storage crates");
  await expect(story).toContainText("cuff on her wrist");
  await expect(story).not.toContainText(/signal chart|drawer|Sella|Westroot/);
  for (const id of ["ch5-read-chart", "ch5-open-drawer", "ch5-free-clerk", "ch5-secure-ledger"]) await expect(choice(page, id)).toHaveCount(0);

  await choice(page, "ch5-resolve-ledger").click();
  await expect(story).not.toContainText(/signal chart|drawer|Sella/);
  await expect(choice(page, "ch5-open-drawer")).toHaveCount(0);
  expect((await saved(page)).chapter5).toMatchObject({ ledgerOfficerDistracted: true, ledgerResolved: false, clerkFreed: false });
  await reload(page);
  await expect(choice(page, "ch5-secure-ledger")).toBeVisible();
  await page.keyboard.press("Escape");
  expect((await saved(page)).chapter5).toMatchObject({ ledgerOfficerDistracted: false, ledgerResolved: false, clerkFreed: false, briarhold: { alert: "suspicious" } });
  await expect(page.getByTestId("ch5-feedback")).toContainText("still chained");
  await inspect(page); await choice(page, "ch5-resolve-ledger").click(); await choice(page, "ch5-secure-ledger").click();
  await expect(page.getByTestId("ch5-feedback")).toContainText("Success — Precision Check");
  const officerCheck = (await saved(page)).chapter5.checks.ledgerOfficer;
  expect(officerCheck).toMatchObject({ stat: "Precision", dc: 12, success: true });
  await expect(story).toContainText("fixed signal chart");
  await expect(story).toContainText("brass latch");
  await expect(story).not.toContainText("Sella");
  await expect(choice(page, "ch5-read-chart")).toBeVisible();
  await choice(page, "ch5-free-clerk").click();
  await expect(page.getByTestId("ch5-feedback")).toContainText("spare inner-door key");
  expect((await saved(page)).chapter5).toMatchObject({ ledgerOfficerDistracted: false, ledgerResolved: true, clerkFreed: true, briarhold: { spareKeyFound: false } });
  await reload(page);
  await expect(choice(page, "ch5-free-clerk")).toHaveCount(0);
  expect((await saved(page)).chapter5.checks.ledgerOfficer).toEqual(officerCheck);
  await expect(story).toContainText("Sella Reedmere");
  await choice(page, "ch5-open-drawer").click();
  expect((await saved(page)).chapter5.briarhold.spareKeyFound).toBe(false);
  await expect(page.getByTestId("ch5-feedback")).toContainText("leaving the drawer intact");
});

for (const startingAlert of ["quiet", "suspicious"] as const) {
  test(`a missed officer ambush raises ${startingAlert} awareness and preserves the desk route on reload`, async ({ page }) => {
    await page.addInitScript(() => { Math.random = () => .01; });
    const state = spike({ node: "ledger", view: "ledger", workshopResolved: true });
    state.briarhold = { ...state.briarhold, alert: startingAlert, guardsDistracted: true, shimFound: true };
    await load(page, state);
    const heroHp = (await saved(page)).player.hp;
    await choice(page, "ch5-resolve-ledger").click();
    await expect(choice(page, "ch5-secure-ledger")).toContainText("Precision DC 12");
    await choice(page, "ch5-secure-ledger").click();
    const expectedAlert = startingAlert === "quiet" ? "suspicious" : "alerted";
    await expect(page.getByTestId("ch5-feedback")).toContainText("Help!");
    await expect(page.getByTestId("ch5-feedback")).toContainText("Complication — Precision Check");
    const recorded = (await saved(page)).chapter5.checks.ledgerOfficer;
    expect(recorded).toMatchObject({ stat: "Precision", roll: 1, dc: 12, success: false });
    expect((await saved(page)).chapter5).toMatchObject({ ledgerResolved: true, ledgerOfficerDistracted: false,
      clerkFreed: false, briarhold: { alert: expectedAlert, guardsDistracted: expectedAlert !== "alerted" } });
    expect((await saved(page)).player.hp).toBe(heroHp);
    await reload(page);
    await expect(choice(page, "ch5-secure-ledger")).toHaveCount(0);
    expect((await saved(page)).chapter5.checks.ledgerOfficer).toEqual(recorded);
    await choice(page, "ch5-free-clerk").click(); await choice(page, "ch5-open-drawer").click();
    expect((await saved(page)).chapter5).toMatchObject({ clerkFreed: true, briarhold: { spareKeyFound: true, alert: expectedAlert } });
    await back(page); await go(page, "hub"); await go(page, "door"); await inspect(page);
    if (expectedAlert === "suspicious") await expect(choice(page, "ch5-unlock-door")).toBeVisible();
    else {
      await expect(choice(page, "ch5-unlock-door")).toHaveCount(0);
      await expect(choice(page, "ch5-fight-door")).toBeVisible();
    }
  });
}

test("only a conscious Tilda adds the officer ambush bonus", async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => .01; });
  let baseBonus = 0;
  for (const conscious of [false, true]) {
    const payload = fixture();
    payload.companion = { ...payload.companion, id: "tilda", name: "Tilda Quickstep", style: "skirmisher",
      hp: conscious ? payload.companion.maxHp : 0, recruited: true };
    payload.chapter5 = spike({ node: "ledger", view: "ledger" });
    await importPayload(page, payload);
    await choice(page, "ch5-resolve-ledger").click(); await choice(page, "ch5-secure-ledger").click();
    const check = (await saved(page)).chapter5.checks.ledgerOfficer;
    if (conscious) {
      expect(check.bonus).toBe(baseBonus + 2);
      expect(check.label).toContain("includes Tilda +2");
    } else {
      baseBonus = check.bonus;
      expect(check.label).not.toContain("Tilda");
    }
  }
});

test("workshop cover conceals bench knowledge until the workers leave, and interventions persist", async ({ page }) => {
  const payload = fixture();
  payload.chapter5 = spike();
  payload.companion = { ...payload.companion, id: "moss", name: "Moss", recruited: true };
  await importPayload(page, payload);
  await go(page, "workshop");
  await expect(page.getByTestId("ch5-feedback")).toContainText("storage recess");
  await inspect(page);
  const story = page.getByTestId("ch5-scene-narrative");
  await expect(story).toContainText("cooling rack");
  await expect(story).toContainText("lamplit aisle");
  await expect(story).not.toContainText(/lock shim|root brace|coupling|Thornroot Sentry|DESSA FLINT|confrontation|repair/i);
  await expect(choice(page, "ch5-take-shim")).toHaveCount(0);
  await expect(choice(page, "ch5-disable-workshop")).toHaveCount(0);
  await reload(page);
  await expect(story).not.toContainText(/lock shim|root brace|coupling|Thornroot Sentry|DESSA FLINT|confrontation|repair/i);

  await choice(page, "ch5-resolve-workshop").click();
  await expect(page.getByTestId("ch5-feedback")).toContainText("cross the empty aisle");
  await expect(story).toContainText("DESSA FLINT");
  await expect(story).toContainText("removable pin");
  await expect(story).toContainText("disrupt the Briar machinery");
  await expect(story).not.toContainText(/confrontation|when you confront|deny it a repair/i);
  expect((await saved(page)).chapter5).toMatchObject({ workshopResolved: true, briarhold: { shimFound: false, workshopDisabled: false } });
  await choice(page, "ch5-take-shim").click();
  expect((await saved(page)).chapter5.briarhold).toMatchObject({ shimFound: true, workshopDisabled: false });
  await choice(page, "ch5-disable-workshop").click();
  await expect(page.getByTestId("ch5-feedback")).toContainText("can no longer draw replacement braces");
  await expect(page.getByTestId("ch5-feedback")).not.toContainText(/confrontation|when you confront/i);
  await reload(page);
  await expect(story).toContainText("disconnected coupling");
  for (const id of ["ch5-resolve-workshop", "ch5-take-shim", "ch5-disable-workshop"]) await expect(choice(page, id)).toHaveCount(0);
  expect((await saved(page)).chapter5.briarhold).toMatchObject({ shimFound: true, workshopDisabled: true });
});

test("invalid transmission blocks departure and reload preserves a silent response and second alarm", async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => .99; });
  await load(page, spike({ node: "lanterns", view: "lanterns" }));
  await panes(page, ["red", "red", "red"]); await choice(page, "ch5-transmit").click();
  await expect(choice(page, "ch5-back")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(choice(page, "ch5-silent-ambush")).toBeVisible();
  await reload(page);
  await choice(page, "ch5-silent-ambush").click();
  await expect(page.getByTestId("ch5-alert")).toHaveText("Alert: Suspicious");
  expect((await saved(page)).chapter5.briarhold.investigatorRemoved).toBe("silent");
  await choice(page, "ch5-transmit").click();
  await expect(page.getByTestId("ch5-alert")).toHaveText("Alert: Alerted");
  await expect(choice(page, "ch5-silent-ambush")).toHaveCount(0);
  await panes(page, ["red", "amber", "blue"]); await choice(page, "ch5-transmit").click();
  await expect(page.getByTestId("ch5-feedback")).toContainText("ignore the diversion");
  expect((await saved(page)).chapter5.briarhold.invalidSignals).toBe(2);
});

for (const response of ["hide", "silent-ambush"] as const) {
  test(`failed ${response} alerts the station, shows the stored check, and permits the direct fight`, async ({ page }) => {
    await page.addInitScript(() => { Math.random = () => .01; });
    await load(page, spike({ node: "lanterns", view: "lanterns" }));
    await panes(page, ["red", "red", "red"]); await choice(page, "ch5-transmit").click();
    await choice(page, `ch5-${response}`).click();
    await expect(page.getByTestId("ch5-feedback")).toContainText("vs");
    await expect(page.getByTestId("ch5-alert")).toHaveText("Alert: Alerted");
    await back(page); await go(page, "door"); await inspect(page);
    await expect(choice(page, "ch5-fight-door")).toBeEnabled();
    await expect(choice(page, "ch5-unlock-door")).toHaveCount(0);
    await reload(page);
    expect((await saved(page)).chapter5.checks.investigator.roll).toBe(1);
  });
}

test("successful hiding keeps the guard, and all routine signals give distinct feedback", async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => .99; });
  await load(page, spike({ node: "lanterns", view: "lanterns" }));
  await panes(page, ["green", "green", "blue"]); await choice(page, "ch5-transmit").click();
  await expect(page.getByTestId("ch5-feedback")).toContainText("lifts the wagon barrier");
  await panes(page, ["amber", "red", "red"]); await choice(page, "ch5-transmit").click();
  await expect(page.getByTestId("ch5-feedback")).toContainText("halts the waiting wagon");
  await panes(page, ["red", "red", "red"]); await choice(page, "ch5-transmit").click(); await choice(page, "ch5-hide").click();
  expect((await saved(page)).chapter5.briarhold).toMatchObject({ alert: "suspicious", investigatorRemoved: "none" });
});

test("open investigator fight resolves once without a key or a silent bonus", async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => .5; });
  await load(page, spike({ node: "lanterns", view: "lanterns" }), true);
  await panes(page, ["red", "red", "red"]); await choice(page, "ch5-transmit").click();
  await choice(page, "ch5-fight-investigator").click(); await win(page);
  expect((await saved(page)).chapter5.briarhold).toMatchObject({ alert: "alerted", investigatorRemoved: "open", spareKeyFound: false });
  await expect(choice(page, "ch5-fight-investigator")).toHaveCount(0);
});

test("command recall, direct door, four-card boss, saved retry, and unlit rescue advance without duplicate injury", async ({ page }) => {
  test.slow();
  await page.addInitScript(() => { Math.random = () => .01; });
  await load(page, spike({ node: "lanterns", view: "lanterns" }), true);
  await panes(page, ["red", "blue", "amber"]); await choice(page, "ch5-transmit").click();
  await expect(page.getByTestId("ch5-alert")).toHaveText("Alert: Alerted");
  await back(page); await go(page, "door"); await inspect(page); await choice(page, "ch5-fight-door").click(); await win(page);
  await back(page); await go(page, "grille"); await choice(page, "ch5-recognize-lio").click(); await go(page, "crown"); await inspect(page);
  await expect(page.getByRole("dialog", { name: "Crown Table" })).not.toContainText(/False Order|Shaken|penalty|repair|opponents answer/);
  await choice(page, "ch5-fight-bracken").click();
  await expect(page.getByRole("dialog", { name: /Battle/ })).toContainText("4 of 4 enemies");
  await page.screenshot({ path: "test-results/ch5-four-card-desktop.png", fullPage: true });
  await reload(page);
  await choice(page, "ch5-resume-battle").click();
  await expect(page.getByRole("dialog", { name: /Battle/ })).toContainText("4 of 4 enemies");
  await win(page);
  await choice(page, "ch5-rescue-step").click();
  const beforeBrake = await saved(page);
  await reload(page); await choice(page, "ch5-rescue-step").click();
  const afterBrake = await saved(page);
  expect(afterBrake.player.hp).toBe(Math.max(1, beforeBrake.player.hp - 4));
  expect(afterBrake.chapter5.brakeCheck).toMatchObject({ roll: 1, success: false });
  await reload(page);
  expect((await saved(page)).player.hp).toBe(afterBrake.player.hp);
  await choice(page, "ch5-rescue-step").click();
  await expect(page.getByText("Lio is rescued.", { exact: true })).toBeVisible();
  const growth = page.getByRole("dialog", { name: "Level Up!" });
  await expect(growth).toBeVisible();
  await growth.getByRole("button", { name: /Resolve/ }).click();
  await reload(page);
  const done = await saved(page);
  expect(done.flags).toMatchObject({ lioRescued: true, brackenEscaped: true, chapterFiveClear: false });
  expect(done.chapter5.milestoneAwarded).toBe(true);
  expect(done.player).toMatchObject({ level: 5, xp: 33 });
  await expect(page.getByRole("dialog", { name: "Level Up!" })).toHaveCount(0);
  await expect(choice(page, "ch5-rescue-step")).toHaveCount(0);
});

test("phone controls, pane keyboard navigation, menu Back, and gold rescue with no companion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const payload = fixture();
  payload.chapter5 = spike({ node: "lanterns", view: "lanterns" });
  payload.companion = { ...payload.companion, recruited: false, id: null, hp: 0 };
  await page.goto("/");
  await page.getByRole("button", { name: "Load Save Slot", exact: true }).click();
  await page.locator('input[type="file"]').setInputFiles({ name: "chapter5-phone.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(payload)) });
  await panes(page, ["blue", "green", "amber"]);
  await page.getByLabel("Left lantern pane").focus(); await page.keyboard.press("ArrowDown");
  await expect(page.getByTestId("chapter5-spike")).toHaveAttribute("data-ch5-node", "lanterns");
  await page.keyboard.press("Tab"); await page.keyboard.press("Escape"); await inspect(page);
  await choice(page, "ch5-transmit").focus(); await page.keyboard.press("m");
  await expect(page.getByRole("button", { name: "Close Adventure Menu", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByLabel("Right lantern pane")).toHaveValue("amber");
  await choice(page, "ch5-uncover-gold").click(); await choice(page, "ch5-restore-gold").click();
  await page.screenshot({ path: "test-results/ch5-lantern-phone.png", fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const s = spike({ node: "carriage", view: "carriage", lioSeen: true, brackenDefeated: true, carriageStage: "set-brake",
    briarhold: { ...payload.chapter5.briarhold, innerDoorOpened: true, lanternsRestored: true } });
  payload.chapter5 = s;
  await page.goto("/");
  await page.getByRole("button", { name: "Load Save Slot", exact: true }).click();
  await page.locator('input[type="file"]').setInputFiles({ name: "chapter5-rescue.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(payload)) });
  await choice(page, "ch5-rescue-step").click();
  expect((await saved(page)).chapter5.brakeCheck).toBeNull();
  await choice(page, "ch5-rescue-step").click();
  expect((await saved(page)).flags.lioRescued).toBe(true);
});

test("Sentry repair occurs once and restored gold counters only Bracken's False Order", async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => .5; });
  const state = spike({ node: "crown", view: "crown", lioSeen: true });
  state.briarhold.innerDoorOpened = true;
  state.briarhold.lanternsRestored = true;
  await load(page, state, true);
  await choice(page, "ch5-fight-bracken").click();
  await page.getByRole("button", { name: /Thornroot Sentry/ }).click();
  await page.getByRole("button", { name: /^Focus Step/ }).click();
  await expect(page.getByRole("button", { name: /^Strike/ })).toBeEnabled();
  await page.getByText("Recent Events", { exact: true }).click();
  await expect(page.getByRole("dialog", { name: /Battle/ })).toContainText("workshop linkage repairs the Thornroot Sentry");
  await expect(page.getByRole("dialog", { name: /Battle/ })).toContainText("adds no Shaken penalty");
  await expect(page.getByRole("dialog", { name: /Battle/ })).toContainText("Shaken, -2"); // Sentry remains independent
  await expect(page.getByRole("button", { name: /Thornroot Sentry/ })).toContainText("28/32");
  await page.getByRole("button", { name: /^Focus Step/ }).click();
  await expect(page.getByRole("button", { name: /^Strike/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /Thornroot Sentry/ })).toContainText("20/32"); // second 8 damage receives no repair
});

test("disconnecting the feed visibly prevents a damaged Sentry's repair once", async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => .5; });
  const state = spike({ node: "crown", view: "crown", lioSeen: true });
  state.briarhold.innerDoorOpened = true;
  state.briarhold.workshopDisabled = true;
  await load(page, state, true);
  await expect(page.getByTestId("ch5-scene-narrative")).toContainText("feed cord running into the workshop wall");
  await choice(page, "ch5-fight-bracken").click();
  await page.getByRole("button", { name: /Thornroot Sentry/ }).click();
  await page.getByRole("button", { name: /^Focus Step/ }).click();
  await expect(page.getByRole("button", { name: /^Strike/ })).toBeEnabled();
  await page.getByText("Recent Events", { exact: true }).click();
  const battle = page.getByRole("dialog", { name: /Battle/ });
  await expect(battle).toContainText("disconnected feed hangs slack");
  await expect(page.getByRole("button", { name: /Thornroot Sentry/ })).toContainText("22/32"); // Liam's 6 + Rowan's 4; no repair
  await page.getByRole("button", { name: /^Focus Step/ }).click();
  await expect(page.getByRole("button", { name: /^Strike/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /Thornroot Sentry/ })).toContainText("14/32"); // Liam's Shaken 4 + Rowan's 4
  // A repeated failed attempt would be appended after the second turn's effects.
  await expect(battle.getByRole("heading", { name: "Recent Events" }).locator("..").locator("span")).not.toContainText("disconnected feed");
});

test("the ordinary quiet fixture wins with defensive companion orders and standard equipment", async ({ page }) => {
  test.slow();
  await page.addInitScript(() => { Math.random = () => .5; });
  const payload = fixture();
  payload.player.hp = payload.player.maxHp;
  payload.companion.hp = payload.companion.maxHp;
  payload.companion.command = "Defend Me";
  payload.chapter5 = spike({ node: "crown", view: "crown", lioSeen: true });
  payload.chapter5.briarhold = { ...payload.chapter5.briarhold, innerDoorOpened: true, lanternsRestored: true, workshopDisabled: true };
  await importPayload(page, payload);
  await choice(page, "ch5-fight-bracken").click();
  for (let turn = 0; turn < 30; turn++) {
    const claim = page.getByRole("button", { name: "Claim Victory", exact: true });
    const slam = page.getByRole("button", { name: /^Pebbleknock Slam/ });
    await expect.poll(async () => await claim.isVisible() || await slam.isEnabled()).toBe(true);
    if (await claim.isVisible()) { await claim.click(); break; }
    const resolve = page.getByRole("button", { name: /^Roadwarden's Resolve/ });
    if (await resolve.isEnabled()) await resolve.click();
    else await slam.click();
  }
  await expect(choice(page, "ch5-rescue-step")).toBeVisible();
  expect((await saved(page)).player.hp).toBeGreaterThan(0);
});

test("downed companions receive no stealth bonus and the overlook can restore them once", async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => .45; });
  const payload = fixture();
  payload.companion = { ...payload.companion, id: "tilda", name: "Tilda Quickstep", hp: 0, style: "skirmisher" };
  payload.chapter5 = spike({ node: "lanterns", view: "lanterns" });
  await importPayload(page, payload);
  await panes(page, ["red", "red", "red"]); await choice(page, "ch5-transmit").click(); await choice(page, "ch5-hide").click();
  expect((await saved(page)).chapter5.checks.investigator.label).not.toContain("Tilda +2");
  payload.chapter5 = { ...buildChapter5SaveState(), started: true, view: "overlook" };
  await importPayload(page, payload);
  await choice(page, "ch5-recover").click();
  expect((await saved(page)).companion.hp).toBe(payload.companion.maxHp);
  await reload(page); await expect(choice(page, "ch5-recover")).toHaveCount(0);
  payload.chapter5 = spike({ node: "lanterns", view: "lanterns" });
  payload.companion.hp = payload.companion.maxHp;
  await importPayload(page, payload);
  await panes(page, ["red", "red", "red"]); await choice(page, "ch5-transmit").click(); await choice(page, "ch5-hide").click();
  expect((await saved(page)).chapter5.checks.investigator).toMatchObject({ success: true, bonus: 4 });
  expect((await saved(page)).chapter5.checks.investigator.label).toContain("Tilda +2");
});

for (const success of [true, false]) {
  test(`receiving-gate check ${success ? "succeeds quietly" : "fails forward with suspicion"} and remains saved`, async ({ page }) => {
    await page.addInitScript((random) => { Math.random = () => random; }, success ? .99 : .01);
    await load(page, { ...buildChapter5SaveState(), started: true, node: "gate", view: "gate" });
    await choice(page, "ch5-enter-precision").click();
    await expect(page.locator('[data-scene-id="ch5-service-landing"]')).toBeVisible();
    await expect(page.getByTestId("ch5-scene-narrative")).toContainText("receiving wall");
    await expect(page.getByTestId("ch5-scene-narrative")).not.toContainText("culvert stair");
    expect((await saved(page)).chapter5).toMatchObject({ node: "landing", checks: { receiving: { success } }, briarhold: { entry: "receiving-gate", alert: success ? "quiet" : "suspicious" } });
    await reload(page);
    expect((await saved(page)).chapter5.checks.receiving.roll).toBe(success ? 20 : 1);
    await expect(choice(page, "ch5-enter-precision")).toHaveCount(0);
  });
}

test("receiving-gate assault enters after combat and keeps its declared alarm", async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => .5; });
  await load(page, { ...buildChapter5SaveState(), started: true, node: "gate", view: "gate" }, true);
  await choice(page, "ch5-assault-gate").click();
  await expect(page.getByRole("dialog", { name: /Battle/ })).toContainText("2 of 2 enemies");
  await win(page);
  await expect(page.locator('[data-scene-id="ch5-service-landing"]')).toBeVisible();
  await expect(page.getByTestId("ch5-scene-narrative")).toContainText("defeated gate detail");
  expect((await saved(page)).chapter5).toMatchObject({ node: "landing", pendingBattle: null, briarhold: { entry: "assault", alert: "alerted" } });
});
