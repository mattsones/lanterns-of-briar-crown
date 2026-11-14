import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { parseDiskSaveText, STORAGE_KEY } from "../src/game/save";

// Byte-for-byte copy of the owner's pending-boss export, not a boosted fixture.
const checkpoint = () => parseDiskSaveText(readFileSync("tests/fixtures/chapter5-alerted-owner.json", "utf8")).payload;

for (const attackStyle of ["hammer", "mixed"] as const) for (const seed of [11, 23, 41]) {
  test(`exact owner checkpoint remains winnable with ${attackStyle} attacks and mixed targets, seed ${seed}`, async ({ page }) => {
    test.slow();
    const phone = attackStyle === "mixed" && seed === 41;
    if (phone) await page.setViewportSize({ width: 390, height: 844 });
    await page.clock.install();
    await page.addInitScript(initial => {
      let rng = initial >>> 0;
      Math.random = () => { rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0; return rng / 4294967296; };
    }, seed);
    const payload = checkpoint();
    await page.goto("/");
    await page.getByRole("button", { name: "Load Save Slot", exact: true }).click();
    await page.locator('input[type="file"]').setInputFiles({ name: "owner-checkpoint.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(payload)) });
    await page.getByRole("button", { name: "Resume the fight", exact: true }).click();
    await page.clock.runFor(1600);
    const battle = page.getByRole("dialog", { name: /Battle/ });
    await expect(battle).toContainText("4 of 4 enemies");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const hp = async (label: string) => Number((await battle.getByText(label, { exact: true }).locator("..").innerText()).match(/(\d+)\/\d+/)![1]);
    const initialRowanHP = payload.companion.hp;
    let rowanWasHit = false;
    let rowanDowns = 0;
    let rowanWasDown = false;
    let itemsUsed = 0;
    let turns = 0;
    for (; turns < 60; turns++) {
      const heroHP = await hp("Hero HP");
      const rowanHP = await hp("Companion HP");
      rowanWasHit ||= rowanHP < initialRowanHP;
      if (rowanHP === 0 && !rowanWasDown) rowanDowns++;
      rowanWasDown = rowanHP === 0;
      if (await battle.getByRole("button", { name: "Claim Victory", exact: true }).isVisible()) break;
      expect(heroHP, `Exact checkpoint lost with ${attackStyle}, seed ${seed}, turn ${turns}`).toBeGreaterThan(0);
      const respite = battle.getByRole("button", { name: /^Rootbread Respite/ });
      const healWho = rowanHP <= 6 && heroHP > 16 ? "Give to Rowan Reedshield" : heroHP <= 14 && !(await respite.isEnabled()) ? "Use on Liam" : null;
      let usedItem = false;
      if (healWho) {
        if (await battle.getByRole("button", { name: "Items", exact: true }).isVisible()) await battle.getByRole("button", { name: "Items", exact: true }).click();
        for (const item of [/^Healing Fizzpop\s*×/, /^Fizzberry Handpie\s*×/]) {
          const heal = battle.getByText(item).locator("..").getByRole("button", { name: healWho, exact: true });
          if (await heal.isEnabled()) { await heal.click(); usedItem = true; itemsUsed++; break; }
        }
      }
      if (!usedItem) {
        if (await respite.isEnabled()) await respite.click();
        else {
          const sentry = battle.getByRole("button", { name: /Thornroot Sentry/ });
          const bracken = battle.getByRole("button", { name: /Bracken Voss/ });
          const guards = battle.getByRole("button", { name: /Thornseal Guard/ });
          const target = await sentry.isEnabled() ? sentry : await bracken.isEnabled() ? bracken :
            await guards.nth(0).isEnabled() ? guards.nth(0) : guards.nth(1);
          await target.click();
          const targetGuard = Number((await target.innerText()).match(/Guard:\s*(\d+)/)?.[1] || 0);
          await battle.getByRole("button", { name: attackStyle === "mixed" && targetGuard === 0 ? /^Rootbind/ : /^Pebbleknock Slam/ }).click();
        }
      }
      await page.clock.runFor(1600);
    }
    await expect(battle.getByRole("button", { name: "Claim Victory", exact: true })).toBeVisible();
    expect(rowanWasHit, "The RNG must exercise attacks on Rowan, not only Liam").toBe(true);
    const result = { attackStyle, seed, turns, heroHP: await hp("Hero HP"), rowanHP: await hp("Companion HP"), itemsUsed, rowanDowns };
    console.log("OWNER_BOSS_RESULT", JSON.stringify(result));
    if (seed === 23 && attackStyle === "mixed") {
      await battle.evaluate(element => { element.scrollTop = 0; });
      await page.screenshot({ path: "test-results/ch5-owner-checkpoint-victory.png" });
    }
    if (phone) {
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await battle.evaluate(element => { element.scrollTop = 0; });
      await page.screenshot({ path: "test-results/ch5-owner-checkpoint-phone.png" });
    }
    await battle.getByRole("button", { name: "Claim Victory", exact: true }).click();
    await expect(page.locator('[data-choice-id="ch5-rescue-step"]')).toBeVisible();
    const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), STORAGE_KEY);
    expect(saved.player.baseStats).toEqual(payload.player.baseStats);
    expect(saved.player.equipment).toEqual(payload.player.equipment);
    expect(saved.player.maxHp).toBe(payload.player.maxHp);
    expect(saved.chapter5.bossProfile).toEqual(payload.chapter5!.bossProfile);
  });
}
