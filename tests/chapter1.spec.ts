import { expect, test } from "@playwright/test";
import { buildDefaultCompanion, buildDefaultFlags, buildPlayer } from "../src/game/state";
import { buildVisitedMap } from "../src/game/map";
import { STORAGE_KEY } from "../src/game/save";

function buildChapterOneClimaxCheckpoint() {
  const player = buildPlayer({
    name: "Liam",
    gender: "Male",
    raceId: "human",
    humanHeritageId: "rainroot",
    appearanceId: "default",
  });
  player.level = 3;
  player.maxHp = 140;
  player.hp = 140;
  player.inventory = { ...player.inventory, old_hatchet: 1, healing_fizzpop: 3 };
  player.equipment.weapon = "old_hatchet";

  const companion = {
    ...buildDefaultCompanion(),
    recruited: true,
    id: "rowan",
    name: "Rowan Reedshield",
    hp: 60,
    maxHp: 60,
    style: "guardian",
    command: "Attack Freely",
    icon: "🛡️",
    role: "Guardian",
  };

  return {
    screen: "play",
    chapterId: 1,
    player,
    region: "rootCellar",
    position: { x: 9, y: 4 },
    visited: {
      rootCellar: buildVisitedMap("rootCellar", 9, 4, 10),
      bramblecross: buildVisitedMap("bramblecross", 6, 8, 10),
    },
    companion,
    guestNpc: null,
    flags: {
      ...buildDefaultFlags(),
      metElder: true,
      gotSmithGift: true,
      beatGateBattle: true,
      metNix: true,
      foundRuinNote: true,
      clearedWildBattle: true,
      reachedBramblecross: true,
      enteredBramblecross: true,
      readBoard: true,
      ennaBriefed: true,
      watchEvidenceRead: true,
      gotDungeonLead: true,
      enteredRootCellar: true,
      companionChosen: true,
      companionChoice: "rowan",
    },
    quest: {
      title: "Investigate the Old Root Cellar",
      description: "Find what is using the old ways beneath Bramblecross.",
    },
    toast: "Loaded Chapter 1 climax checkpoint.",
  };
}

test("chapter one golden path completes the Warden, cellar proof, and report-back", async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: buildChapterOneClimaxCheckpoint() },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await expect(page.getByText("You are standing on: Cellar Guardian.")).toBeVisible();

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await page.getByRole("button", { name: "Stand and fight." }).click();

  const attack = page.getByRole("button", { name: /Scrappy Chop/ });
  for (let turn = 0; turn < 30; turn += 1) {
    const claim = page.getByRole("button", { name: "Claim Victory" });
    if (await claim.count()) {
      await claim.first().click();
      break;
    }
    if (await attack.isEnabled().catch(() => false)) await attack.click();
    await page.waitForTimeout(900);
  }

  await expect(page.getByText("Briar Knot Warden", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByTestId("move-right").click();
  await expect(page.getByText("Sealed Iron Door", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Study the Briar Crown mark." }).click();
  await page.getByRole("button", { name: "Take the Warden Chain and Edden's cloth." }).click();
  await expect(
    page.getByText("Chapter 1 discovery complete. Report back to Hollis and Enna.").first(),
  ).toBeVisible();

  await page.getByRole("button", { name: "Dev Tools" }).click();
  await page.getByRole("button", { name: "Bramblecross", exact: true }).click();
  for (let step = 0; step < 6; step += 1) {
    await page.getByTestId("move-up").click();
    await page.waitForTimeout(120);
  }
  await page.getByRole("button", { name: "Enter" }).click();
  await page.getByRole("button", { name: "Talk with Hollis" }).click();
  await page.getByRole("button", { name: "Tell them what the cellar revealed." }).click();
  await page.getByRole("button", { name: "Edden reached the door. He left proof." }).click();
  await page.getByRole("button", { name: "Let Enna connect the threads." }).click();
  await page.getByRole("button", { name: "Show them the Briar Crown mark." }).click();
  await page.getByRole("button", { name: "Ask about Westroot." }).click();
  await page.getByRole("button", { name: "I'll follow Westroot." }).click();

  await expect(
    page.getByText("Chapter 1 Complete: The Road That Lied", { exact: true }),
  ).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});
