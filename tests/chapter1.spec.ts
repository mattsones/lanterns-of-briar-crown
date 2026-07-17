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
      reportedSatchelToElder: true,
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

function buildPostBoarElderCheckpoint() {
  const player = buildPlayer({
    name: "Liam",
    gender: "Male",
    raceId: "human",
    humanHeritageId: "rainroot",
    appearanceId: "default",
  });
  player.inventory = { ...player.inventory, old_hatchet: 1 };
  player.equipment.weapon = "old_hatchet";

  return {
    screen: "play",
    chapterId: 1,
    player,
    region: "hearthhollow",
    position: { x: 6, y: 4 },
    visited: {
      hearthhollow: buildVisitedMap("hearthhollow", 6, 4, 10),
    },
    companion: buildDefaultCompanion(),
    guestNpc: null,
    flags: {
      ...buildDefaultFlags(),
      metElder: true,
      elderGavePurse: true,
      homeStashClaimed: true,
      gotSmithGift: true,
      beatGateBattle: true,
      reportedSatchelToElder: false,
    },
    quest: {
      title: "Bring Lio's Satchel to Elder Brynn",
      description: "Show Brynn what the boar carried.",
    },
    toast: "Loaded post-boar report checkpoint.",
  };
}

function buildWellCheckpoint() {
  const checkpoint = buildPostBoarElderCheckpoint();
  return {
    ...checkpoint,
    position: { x: 5, y: 4 },
    flags: {
      ...checkpoint.flags,
      beatGateBattle: false,
      wellVisited: false,
    },
    quest: {
      title: "Explore Hearthhollow",
      description: "Walk through the village square.",
    },
  };
}

function buildRoadCampCheckpoint() {
  const checkpoint = buildPostBoarElderCheckpoint();
  checkpoint.player.hp = checkpoint.player.maxHp - 7;
  checkpoint.position = { x: 5, y: 4 };
  checkpoint.flags.reportedSatchelToElder = true;
  return {
    ...checkpoint,
    region: "lanternRoad",
    visited: {
      lanternRoad: buildVisitedMap("lanternRoad", 5, 4, 10),
    },
    quest: {
      title: "Find What Happened to Lio Brindle",
      description: "Follow Lantern Road toward Bramblecross.",
    },
  };
}

function buildWorriedTravelerCheckpoint() {
  const checkpoint = buildRoadCampCheckpoint();
  checkpoint.position = { x: 5, y: 6 };
  checkpoint.flags.sawRoadCamp = true;
  checkpoint.visited = {
    lanternRoad: buildVisitedMap("lanternRoad", 5, 6, 10),
  };
  return checkpoint;
}

function buildBramblecrossInvestigationCheckpoint() {
  const checkpoint = buildPostBoarElderCheckpoint();
  return {
    ...checkpoint,
    region: "bramblecross",
    position: { x: 6, y: 3 },
    visited: {
      bramblecross: buildVisitedMap("bramblecross", 6, 3, 10),
    },
    flags: {
      ...checkpoint.flags,
      reportedSatchelToElder: true,
      metNix: true,
      foundRuinNote: true,
      clearedWildBattle: true,
      reachedBramblecross: true,
      enteredBramblecross: true,
      ennaBriefed: true,
      watchEvidenceRead: true,
      readBoard: true,
      gotDungeonLead: false,
    },
    quest: {
      title: "Speak with Captain Hollis",
      description: "Ask Hollis about the Old Root Cellar.",
    },
  };
}

test("the village well dialogue only opens on the first visit", async ({ page }) => {
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: buildWellCheckpoint() },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();

  await page.getByTestId("move-right").click();
  await expect(page.getByRole("dialog", { name: "Village Well" })).toBeVisible();
  await page.getByRole("button", { name: "Respect local infrastructure." }).click();

  await page.getByTestId("move-left").click();
  await page.getByTestId("move-right").click();
  await expect(page.getByRole("dialog", { name: "Village Well" })).toHaveCount(0);

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Village Well" })).toHaveCount(0);
  await expect(
    page.getByText("The village well continues to sit exactly where you left it."),
  ).toBeVisible();
});

test("the forged-order reveal happens when the satchel is returned to Elder Brynn", async ({ page }) => {
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: buildPostBoarElderCheckpoint() },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();

  await expect(page.getByText("Goal: Bring Lio's Satchel to Elder Brynn")).toBeVisible();
  await page.getByTestId("move-up").click();

  const elderDialogue = page.getByRole("dialog", { name: "Elder Brynn" });
  await expect(elderDialogue).toContainText("This did not come from the Crown");
  await expect(elderDialogue).toContainText("false order to the watch in Bramblecross");
  await page
    .getByRole("button", { name: "I'll report it in Bramblecross and look for Lio." })
    .click();

  await expect(page.getByText("Goal: Find What Happened to Lio Brindle")).toBeVisible();
});

test("the south gate departure is an internal pause with a stay option", async ({ page }) => {
  const checkpoint = buildPostBoarElderCheckpoint();
  checkpoint.position = { x: 6, y: 8 };
  checkpoint.flags.reportedSatchelToElder = true;

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: checkpoint },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();

  await page.getByTestId("move-down").click();
  const gateDialogue = page.getByRole("dialog", { name: "South Gate" });
  await expect(gateDialogue).toContainText("Deep breath. Am I really ready for this?");
  await expect(gateDialogue).not.toContainText("Brynn");
  await expect(gateDialogue).not.toContainText("Mara");
  await expect(
    page.getByRole("button", { name: "Take a deep breath and step onto Lantern Road." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Not yet. Stay in Hearthhollow." }).click();
  await expect(gateDialogue).toHaveCount(0);
});

test("road camp actions return to the camp and report what happened", async ({ page }) => {
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: buildRoadCampCheckpoint() },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();

  await page.getByTestId("move-right").click();
  let campDialogue = page.getByRole("dialog", { name: "Road Camp" });
  await expect(campDialogue).toBeVisible();

  await page.getByRole("button", { name: "Rest", exact: true }).click();
  await expect(campDialogue).toBeVisible();
  await expect(page.getByTestId("dialogue-feedback")).toContainText(
    "recovers 7 HP",
  );
  await expect(page.getByTestId("dialogue-feedback")).toContainText(
    "Checkpoint saved at Road Camp.",
  );

  const savedHp = await page.evaluate((key) => {
    const payload = JSON.parse(window.localStorage.getItem(key) || "null");
    return { hp: payload.player.hp, maxHp: payload.player.maxHp };
  }, STORAGE_KEY);
  expect(savedHp.hp).toBe(savedHp.maxHp);

  await page.getByRole("button", { name: "Craft", exact: true }).click();
  await expect(page.getByText("Camp Crafting", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Craft", exact: true }).first().click();
  await page.getByRole("button", { name: "Close", exact: true }).click();

  campDialogue = page.getByRole("dialog", { name: "Road Camp" });
  await expect(campDialogue).toBeVisible();
  await expect(page.getByTestId("dialogue-feedback")).toContainText(
    "You craft Healing Fizzpop ×1",
  );
  await expect(page.getByRole("button", { name: "Rest", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Leave camp", exact: true })).toBeVisible();
});

test("the worried traveler portrait and testimony show that the false seal fooled him", async ({ page }) => {
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: buildWorriedTravelerCheckpoint() },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();

  await page.getByTestId("move-right").click();
  let travelerDialogue = page.getByRole("dialog", { name: "Worried Traveler" });
  await expect(travelerDialogue).toBeVisible();
  await expect(
    travelerDialogue.getByRole("img", { name: "Portrait of a worried road traveler" }),
  ).toBeVisible();
  await expect(travelerDialogue).toContainText("royal crown pressed into red wax");
  await expect(travelerDialogue).toContainText("road was under Crown inspection");

  await page.getByRole("button", { name: "Did you get a look at the order?" }).click();
  travelerDialogue = page.getByRole("dialog", { name: "Worried Traveler" });
  await expect(travelerDialogue).toContainText("I barely breathed near it");
  await expect(travelerDialogue).toContainText("That sounded official to me");
  await expect(travelerDialogue).toContainText("It was official, wasn't it?");
  await expect(travelerDialogue).not.toContainText("copied the shape of command");
  await expect(
    travelerDialogue.getByRole("img", { name: "Portrait of a worried road traveler" }),
  ).toBeVisible();
});

test("Bramblecross points the player to the watchhouse and aligns the notice board", async ({ page }) => {
  const mayorCheckpoint = buildBramblecrossInvestigationCheckpoint();
  mayorCheckpoint.position = { x: 4, y: 3 };
  mayorCheckpoint.flags.ennaBriefed = false;
  mayorCheckpoint.flags.watchEvidenceRead = false;
  mayorCheckpoint.flags.readBoard = false;

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: mayorCheckpoint },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();

  await page.getByTestId("move-down").click();
  const mayorDialogue = page.getByRole("dialog", { name: "Mayor Anwen" });
  await expect(mayorDialogue).toContainText("Enna inside the watchhouse");
  await expect(mayorDialogue).toContainText("north end of the square");
  await page.getByRole("button", { name: "I'll find Enna in the watchhouse." }).click();

  await page.getByTestId("move-up").click();
  await page.getByTestId("move-right").click();
  await page.getByTestId("move-right").click();
  await page.getByTestId("move-right").click();
  await page.getByTestId("move-down").click();
  await expect(page.getByRole("dialog", { name: "Notice Board" })).toBeVisible();
});

test("Hollis recommends the inn and personally leads the player into the cellar", async ({ page }) => {
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: buildBramblecrossInvestigationCheckpoint() },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();

  await page.getByTestId("move-up").click();
  await page.getByRole("button", { name: "Enter" }).click();
  await expect(page.locator('[data-art-key="watchhouse-case-wall"]')).toBeVisible();
  await page.getByRole("button", { name: "Talk with Hollis" }).click();
  await page.getByRole("button", { name: "I'll investigate the Root Cellar." }).click();

  let hollisDialogue = page.getByRole("dialog", { name: "Captain Hollis" });
  await expect(hollisDialogue).toContainText("rather not send another person below alone");
  await expect(hollisDialogue).toContainText("Bramblecross Inn");
  await expect(
    page.getByRole("button", { name: "I'll recruit someone at the Bramblecross Inn first." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "I'll recruit someone at the Bramblecross Inn first." })
    .click();

  await page.getByRole("button", { name: "Talk with Hollis" }).click();
  await page.getByRole("button", { name: "I'm ready to go below." }).click();
  hollisDialogue = page.getByRole("dialog", { name: "Captain Hollis" });
  await expect(hollisDialogue).toContainText("Rowan, Tilda, and Moss");
  await page.getByRole("button", { name: "I'll go alone. Take me to the cellar." }).click();

  await expect(page.getByText(/Hollis leads you behind the watchhouse/)).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Old Root Cellar" })).toHaveCount(0);
  await expect(page.getByTestId("map-stage")).toBeVisible();
});

test("the Root Sigil uses the recent-mark crop of the cellar evidence master", async ({ page }) => {
  const checkpoint = buildChapterOneClimaxCheckpoint();
  checkpoint.position = { x: 3, y: 1 };
  checkpoint.visited.rootCellar = buildVisitedMap("rootCellar", 3, 1, 2);
  checkpoint.flags.readCellarSigil = false;
  checkpoint.flags.readCellarMural = false;

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: checkpoint },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();

  await page.getByTestId("move-right").click();
  await expect(page.getByRole("dialog", { name: "Root Sigil" })).toBeVisible();
  await expect(page.locator('[data-art-key="root-cellar-sigil"]')).toBeVisible();
});

test("the Route Mural uses the older-history crop of the cellar evidence master", async ({ page }) => {
  const checkpoint = buildChapterOneClimaxCheckpoint();
  checkpoint.position = { x: 3, y: 4 };
  checkpoint.visited.rootCellar = buildVisitedMap("rootCellar", 3, 4, 2);
  checkpoint.flags.readCellarMural = false;

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: checkpoint },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();

  await page.getByTestId("move-left").click();

  await expect(page.getByRole("dialog", { name: "Route Mural" })).toBeVisible();
  await expect(page.locator('[data-art-key="root-cellar-mural"]')).toBeVisible();
});

test("the Companion menu connects every battle order to its named ability", async ({ page }) => {
  const checkpoint = buildChapterOneClimaxCheckpoint();
  checkpoint.companion = {
    ...checkpoint.companion,
    id: "tilda",
    name: "Tilda Quickstep",
    hp: 14,
    maxHp: 14,
    style: "skirmisher",
    role: "Skirmisher",
  };
  checkpoint.flags.companionChoice = "tilda";

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: checkpoint },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await page.getByRole("button", { name: "Companion", exact: true }).click();

  const order = page.getByLabel("Companion battle order");
  const preview = page.getByTestId("companion-command-preview");

  await expect(order).toHaveValue("Attack Freely");
  await expect(preview).toContainText("Quick Feint");
  await expect(preview).toContainText("1d6+1 damage");
  await expect(page.getByText("Quick Feint", { exact: true }).locator("..")).toContainText(
    "Attack",
  );

  await order.selectOption("Defend Me");
  await expect(preview).toContainText("Spoil the Timing");
  await expect(preview).toContainText("reducing its next attack by 2");

  await order.selectOption("Use Support Skills");
  await expect(preview).toContainText("Pocket Tricks");
  await expect(preview).toContainText("1d4 damage and 2 Guard");
});

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
  await expect(page.locator('[data-art-key="briar-crown-mark"]')).toBeVisible();
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
  await expect(page.locator('[data-art-key="briar-crown-mark"]')).toBeVisible();
  await page.getByRole("button", { name: "Ask about Westroot." }).click();
  await page.getByRole("button", { name: "I'll follow Westroot." }).click();

  await expect(
    page.getByText("Chapter 1 Complete: The Road That Lied", { exact: true }),
  ).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});
