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

function buildPostWardenDoorCheckpoint(companionHp: number) {
  const checkpoint = buildChapterOneClimaxCheckpoint();
  return {
    ...checkpoint,
    position: { x: 10, y: 4 },
    visited: {
      ...checkpoint.visited,
      rootCellar: buildVisitedMap("rootCellar", 10, 4, 3),
    },
    companion: {
      ...checkpoint.companion,
      hp: companionHp,
    },
    flags: {
      ...checkpoint.flags,
      beatCellarBoss: true,
    },
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

test("the cellar marks hidden-path enemies but not the guardian painted into the map", async ({ page }) => {
  const checkpoint = buildChapterOneClimaxCheckpoint();
  checkpoint.position = { x: 8, y: 5 };
  checkpoint.visited.rootCellar = buildVisitedMap("rootCellar", 8, 5, 12);
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: checkpoint },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();

  await expect(page.locator('.map-token[title="Rustroot Skulk"] .map-token-enemy')).toHaveAttribute(
    "src",
    /rustroot-skulk/,
  );
  await expect(page.locator('.map-token[title="Cellar Guardian"]')).toHaveCount(0);
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

test("narrow combat keeps current health and actions in reach", async ({ page }) => {
  const checkpoint = buildPostBoarElderCheckpoint();
  checkpoint.position = { x: 6, y: 8 };
  checkpoint.flags.beatGateBattle = false;
  checkpoint.flags.reportedSatchelToElder = false;
  checkpoint.visited = {
    hearthhollow: buildVisitedMap("hearthhollow", 6, 8, 10),
  };

  await page.setViewportSize({ width: 430, height: 932 });
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: checkpoint },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await page.getByTestId("move-down").click();
  await page
    .getByRole("button", { name: "Stand and fight before it reaches the square." })
    .click();

  const dock = page.getByTestId("battle-action-dock");
  await expect(dock).toBeVisible();
  await expect(dock.getByText("Liam HP", { exact: true })).toBeVisible();
  await expect(dock.getByText("Bramble Boar HP", { exact: true })).toBeVisible();
  await expect(dock.getByRole("button", { name: /Strike/ })).toBeVisible();
  await expect(dock.getByRole("button", { name: /Focus Step/ })).toBeVisible();

  const box = await dock.boundingBox();
  expect(box).not.toBeNull();
  expect((box?.y || 0) + (box?.height || 0)).toBeLessThanOrEqual(932);
});

test("inventory cards stay readable instead of squeezing into narrow columns", async ({ page }) => {
  const checkpoint = buildBramblecrossInvestigationCheckpoint();
  checkpoint.player.inventory = {
    ...checkpoint.player.inventory,
    turnipwood_blade: 1,
    briar_vest: 1,
  };

  await page.setViewportSize({ width: 894, height: 900 });
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: checkpoint },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await page.getByTestId("open-adventure-menu-mobile").click();
  await page.getByRole("button", { name: "Inventory" }).click();

  const equipmentGrid = page.getByTestId("inventory-grid").first();
  const cards = equipmentGrid.getByTestId("inventory-item-card");
  await expect(cards).toHaveCount(3);
  const firstBox = await cards.nth(0).boundingBox();
  const secondBox = await cards.nth(1).boundingBox();
  expect(firstBox).not.toBeNull();
  expect(secondBox).not.toBeNull();
  expect(firstBox?.width || 0).toBeGreaterThan(600);
  expect(secondBox?.y || 0).toBeGreaterThan((firstBox?.y || 0) + (firstBox?.height || 0));
});

test("the exploration shell keeps the map primary and opens menus in a drawer", async ({ page }) => {
  const checkpoint = buildBramblecrossInvestigationCheckpoint();

  await page.setViewportSize({ width: 1400, height: 900 });
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: checkpoint },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();

  const mapBox = await page.getByTestId("map-stage").boundingBox();
  const railBox = await page.getByRole("complementary", { name: "Adventure status" }).boundingBox();
  expect(mapBox).not.toBeNull();
  expect(railBox).not.toBeNull();
  expect(mapBox?.width || 0).toBeGreaterThan((railBox?.width || 0) * 2);
  await expect(page.getByTestId("adventure-workspace")).toHaveCount(0);

  await page.keyboard.press("m");
  const workspace = page.getByTestId("adventure-workspace");
  await expect(workspace).toBeVisible();
  await expect(page.getByTestId("map-stage")).toBeVisible();
  await workspace.getByRole("button", { name: "Character", exact: true }).click();
  await expect(workspace.getByText("Full character stats")).toBeVisible();
  await workspace.getByRole("button", { name: "Close Adventure Menu" }).click();
  await expect(workspace).toHaveCount(0);
});

test("phone exploration uses a bottom status bar and full-width menu sheet", async ({ page }) => {
  const checkpoint = buildBramblecrossInvestigationCheckpoint();

  await page.setViewportSize({ width: 430, height: 932 });
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: checkpoint },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();

  const mobileBar = page.getByLabel("Adventure status and menu");
  await expect(mobileBar).toBeVisible();
  await expect(page.getByLabel("Map movement controls")).toBeVisible();
  const barBox = await mobileBar.boundingBox();
  expect((barBox?.y || 0) + (barBox?.height || 0)).toBeLessThanOrEqual(932);

  await page.getByTestId("open-adventure-menu-mobile").click();
  const workspace = page.getByTestId("adventure-workspace");
  await expect(workspace).toBeVisible();
  const workspaceBox = await workspace.boundingBox();
  expect(workspaceBox?.width || 0).toBeGreaterThanOrEqual(420);
  expect(workspaceBox?.height || 0).toBeLessThanOrEqual(932 * 0.9);
  await workspace.getByRole("button", { name: "Close Adventure Menu" }).click();
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
  await expect(travelerDialogue).toContainText("The royal crown was pressed right into the red wax");
  await expect(travelerDialogue).toContainText("So I obeyed it");
  await expect(travelerDialogue).toContainText("You obey a Crown seal like that");
  await expect(travelerDialogue).not.toContainText("copied the shape of command");
  await expect(travelerDialogue).not.toContainText("too clean");
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
  await page.getByTestId("move-down").click();
  await page.getByTestId("move-down").click();
  await page.getByTestId("move-right").click();
  let boardDialogue = page.getByRole("dialog", { name: "Notice Board" });
  await expect(boardDialogue).toBeVisible();
  await expect(boardDialogue).not.toContainText("the seal is copied too cleanly");

  await page.getByRole("button", { name: "Take Ada's crate notice too." }).click();
  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  boardDialogue = page.getByRole("dialog", { name: "Notice Board" });
  await expect(boardDialogue).toContainText("cellar warnings and copied route orders");
  await expect(
    page.getByRole("button", { name: "Collect the cellar notices and route order." }),
  ).toBeVisible();
});

test("Mayor Anwen stops warning about the cellar after the Chapter 1 report", async ({ page }) => {
  const mayorCheckpoint = buildBramblecrossInvestigationCheckpoint();
  mayorCheckpoint.position = { x: 4, y: 3 };
  mayorCheckpoint.flags.chapterOneClear = true;
  mayorCheckpoint.flags.chapterReported = true;
  mayorCheckpoint.flags.chapterTwoStarted = true;
  mayorCheckpoint.flags.chapterTwoBriefed = true;

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: mayorCheckpoint },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await page.getByTestId("move-down").click();

  const mayorDialogue = page.getByRole("dialog", { name: "Mayor Anwen" });
  await expect(mayorDialogue).toContainText("looks west instead of toward the cellar");
  await expect(mayorDialogue).toContainText("Follow the Westroot lead");
  await expect(mayorDialogue).not.toContainText("Go carefully");
});

test("Hollis explains why the cellar notices matter before sending anyone below", async ({ page }) => {
  const checkpoint = buildBramblecrossInvestigationCheckpoint();
  checkpoint.flags.readBoard = false;

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: checkpoint },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();

  await page.getByTestId("move-up").click();
  await page.getByRole("button", { name: "Enter" }).click();
  const watchhouse = page.getByRole("dialog", { name: "Inside the Watchhouse" });
  await expect(watchhouse).toContainText("a closed door farther down the hall");
  await expect(watchhouse).not.toContainText("Edden's door");
  await expect(watchhouse).not.toContainText("A focused interior scene.");
  await expect(page.getByTestId("watchhouse-enna").getByRole("img", { name: "Portrait of Enna" })).toBeVisible();
  await expect(page.getByTestId("watchhouse-hollis").getByRole("img", { name: "Portrait of Captain Hollis" })).toBeVisible();
  for (const artKey of [
    "watchhouse-card-lio-satchel",
    "watchhouse-card-planted-order",
    "watchhouse-card-willow-seal",
    "watchhouse-card-root-cellar",
    "briar-crown-mark",
  ]) {
    await expect(page.locator(`[data-art-key="${artKey}"]`)).toBeVisible();
  }
  await expect(
    page.locator('[data-art-key="watchhouse-card-willow-seal"] img'),
  ).toHaveAttribute("src", /willowmark-seal-v02/);
  await page.getByRole("button", { name: "Talk with Hollis" }).click();

  const hollisDialogue = page.getByRole("dialog", { name: "Captain Hollis" });
  await expect(hollisDialogue).toContainText("collect every notice about it");
  await expect(hollisDialogue).toContainText("Edden came back badly shaken");
  await expect(hollisDialogue).toContainText("The other two did not");
  await expect(hollisDialogue).toContainText("the full shape of this");
  await page.getByRole("button", { name: "I'll collect every cellar notice, then come back." }).click();
  await expect(watchhouse).toContainText("Edden's door");
});

test("the incomplete Watchhouse case wall uses evidence art and a deliberate empty state", async ({ page }) => {
  const checkpoint = buildBramblecrossInvestigationCheckpoint();
  checkpoint.flags.ennaBriefed = false;
  checkpoint.flags.watchEvidenceRead = false;
  checkpoint.flags.heardAboutEdden = false;

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: checkpoint },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await page.getByTestId("move-up").click();
  await page.getByRole("button", { name: "Enter" }).click();

  await expect(page.locator('[data-art-key="watchhouse-card-missing-porters"]')).toBeVisible();
  await expect(page.locator('[data-art-key="watchhouse-card-copied-orders"]')).toBeVisible();
  await expect(page.locator('[data-art-key="watchhouse-card-supply-delays"]')).toBeVisible();
  await expect(page.getByText("Awaiting field evidence", { exact: true })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Inside the Watchhouse" })).not.toContainText("📦");
});

test("the Root Cellar fog opens whole rooms while passages stay narrow", async ({ page }) => {
  const checkpoint = buildChapterOneClimaxCheckpoint();
  checkpoint.position = { x: 1, y: 5 };
  checkpoint.visited.rootCellar = {
    "1,4": true,
    "1,5": true,
    "1,6": true,
    "2,5": true,
  };

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: checkpoint },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();

  await expect(page.locator('[data-fog-area="route-mural-room"]')).toHaveCount(1);
  await expect(page.locator('[data-fog-area="cellar-cache-room"]')).toHaveCount(0);

  await page.getByTestId("move-down").click();
  await expect(page.locator('[data-fog-area="cellar-cache-room"]')).toHaveCount(1);
  await expect(page.locator('[data-fog-area="guardian-vault"]')).toHaveCount(0);
});

test("the Lantern Road ambush catches the player on the road corridor", async ({ page }) => {
  const checkpoint = buildRoadCampCheckpoint();
  checkpoint.position = { x: 6, y: 6 };
  checkpoint.flags.foundRuinNote = true;
  checkpoint.flags.clearedWildBattle = false;
  checkpoint.visited = {
    lanternRoad: buildVisitedMap("lanternRoad", 6, 6, 10),
  };

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: checkpoint },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();

  await page.getByTestId("move-right").click();
  let ambushDialogue = page.getByRole("dialog", { name: "Roadside Ambush" });
  await expect(ambushDialogue).toBeVisible();
  await expect(ambushDialogue).toContainText("waiting to ambush whoever carried the order east");
  await page.getByRole("button", { name: "Try to run and draw them away." }).click();
  await page.getByRole("button", { name: "Retreat for now." }).click();

  await page.getByTestId("move-right").click();
  ambushDialogue = page.getByRole("dialog", { name: "Roadside Ambush" });
  await expect(ambushDialogue).toBeVisible();
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
  await page.getByTestId("open-adventure-menu").click();
  await page.getByRole("button", { name: "Companion", exact: true }).click();

  await expect(page.getByRole("img", { name: "Portrait of Tilda Quickstep" })).toBeVisible();

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

test("a downed companion does not offer cellar-door reactions", async ({ page }) => {
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: buildPostWardenDoorCheckpoint(0) },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await page.getByRole("button", { name: "Inspect", exact: true }).click();

  const door = page.getByRole("dialog", { name: "Sealed Iron Door" });
  await expect(door).toBeVisible();
  await expect(door.getByRole("button", { name: /Ask Rowan Reedshield/ })).toHaveCount(0);
});

test("a living companion can discuss the door after the proof is taken", async ({ page }) => {
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: buildPostWardenDoorCheckpoint(60) },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await page.getByRole("button", { name: "Take the Warden Chain and Edden's cloth." }).click();

  let ending = page.getByRole("dialog", { name: "Chapter 1 Complete: The Road That Lied" });
  await ending.getByRole("button", { name: "Ask Rowan Reedshield about the door." }).click();
  const reaction = page.getByRole("dialog", { name: "Rowan Reedshield" });
  await expect(reaction).toBeVisible();
  await reaction.getByRole("button", { name: "Return to the chapter ending." }).click();

  ending = page.getByRole("dialog", { name: "Chapter 1 Complete: The Road That Lied" });
  await expect(ending.getByRole("button", { name: "Return with the truth." })).toBeVisible();
  await expect(
    ending.getByRole("button", { name: "Ask Rowan Reedshield about the door." }),
  ).toHaveCount(0);
});

test("a battle item revives a downed companion in time for their next turn", async ({ page }) => {
  const checkpoint = buildChapterOneClimaxCheckpoint();
  checkpoint.companion.hp = 0;
  checkpoint.player.battlePouch = {
    ...checkpoint.player.battlePouch,
    slot1: "healing_fizzpop",
  };

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: checkpoint },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await page.getByRole("button", { name: "Stand and fight." }).click();
  await page.getByRole("button", { name: "Items", exact: true }).click();
  await page.getByRole("button", { name: "Give to Rowan Reedshield" }).click();

  await page.getByText("Recent Events", { exact: true }).click();
  await expect(
    page.getByText(/Rowan Reedshield uses Linebreaker/).last(),
  ).toBeVisible({ timeout: 3000 });
});

test("a downed companion receives no victory XP", async ({ page }) => {
  const checkpoint = buildChapterOneClimaxCheckpoint();
  checkpoint.companion.hp = 0;

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: checkpoint },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
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
  await expect(page.getByText(/Rowan Reedshield gains .* companion XP/)).toHaveCount(0);
  await page.getByRole("button", { name: "Approach the sealed door." }).click();
  await expect(page.getByRole("dialog", { name: "Sealed Iron Door" })).toBeVisible();
  await page.getByRole("button", { name: "Take the Warden Chain and Edden's cloth." }).click();
  await page.getByRole("button", { name: "Return with the truth." }).click();
  await page.getByTestId("open-adventure-menu").click();
  await page.getByRole("button", { name: "Companion", exact: true }).click();
  await expect(page.getByText(/Companion XP: 0/)).toBeVisible();
});

test("chapter one golden path completes at the cellar proof and folds the report into the Westroot briefing", async ({ page }) => {
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
  await expect(page.getByRole("button", { name: "Inspect Cellar Guardian", exact: true })).toBeVisible();

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
  await page.getByRole("button", { name: "Approach the sealed door." }).click();
  await expect(page.getByTestId("map-background")).toHaveAttribute(
    "src",
    /root-cellar-no-boss-map-v01/,
  );
  await expect(page.getByRole("dialog", { name: "Sealed Iron Door", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Step back for now." })).toHaveCount(0);
  await page.getByRole("button", { name: "Study the Briar Crown mark." }).click();
  await expect(
    page.getByRole("dialog").locator('[data-art-key="briar-crown-mark"]'),
  ).toBeVisible();
  await page.getByRole("button", { name: "Take the Warden Chain and Edden's cloth." }).click();
  await expect(
    page.getByRole("dialog", { name: "Chapter 1 Complete: The Road That Lied" }),
  ).toBeVisible();
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute(
    "src",
    /chapter-1-ending-the-road-that-lied-v01/,
  );
  await expect(
    page.getByText("Chapter 1 complete. Report back to Hollis and Enna.").first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "Return with the truth." }).click();

  await page.getByTestId("open-adventure-menu").click();
  await page.getByText("More", { exact: true }).click();
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
  await expect(
    page
      .getByRole("dialog", { name: "The Briar Crown" })
      .locator('[data-art-key="briar-crown-mark"]'),
  ).toBeVisible();
  await page.getByRole("button", { name: "Ask about Westroot." }).click();
  await expect(page.getByText("Mara Brindle knows Lio's private courier marks.")).toBeVisible();
  await page.getByRole("button", { name: "I'll follow Westroot." }).click();

  await expect(
    page.getByRole("dialog", { name: "Chapter 2: The Westroot Trail" }),
  ).toBeVisible();
  await expect(page.getByText("The report and the plan have become the same piece of work.")).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("button", { name: "Call Mara to the table" })).toBeVisible();
  await expect(page.getByTestId("chapter-one-case-archive")).toBeVisible();
  await expect(page.getByRole("button", { name: "Study the completed evidence board" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Read the duty ledger" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Examine the wall map" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Read the forged orders file" })).toHaveCount(0);
  expect(runtimeErrors).toEqual([]);
});

test("cellar stairs return to the painted Bramblecross entrance", async ({ page }) => {
  const checkpoint = buildChapterOneClimaxCheckpoint();
  checkpoint.position = { x: 0, y: 1 };
  checkpoint.visited.rootCellar = buildVisitedMap("rootCellar", 0, 1, 2);

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: checkpoint },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await page.getByRole("button", { name: "Inspect", exact: true }).click();

  await expect(page.getByRole("heading", { name: "Bramblecross" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Inspect Old Root Cellar", exact: true })).toBeVisible();
});

test("a post-Warden cellar cannot be exited before the sealed-door proof", async ({ page }) => {
  const checkpoint = buildPostWardenDoorCheckpoint(60);
  checkpoint.position = { x: 0, y: 1 };
  checkpoint.visited.rootCellar = buildVisitedMap("rootCellar", 0, 1, 2);

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: checkpoint },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await page.getByRole("button", { name: "Inspect", exact: true }).click();

  await expect(page.getByRole("heading", { name: "Old Root Cellar" })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Sealed Iron Door" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Step back for now." })).toHaveCount(0);
});

test("an older post-Warden save outside the cellar returns directly to the sealed door", async ({ page }) => {
  const checkpoint = buildPostWardenDoorCheckpoint(60);
  checkpoint.region = "bramblecross";
  checkpoint.position = { x: 3, y: 5 };
  checkpoint.visited.bramblecross = buildVisitedMap("bramblecross", 3, 5, 2);

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: checkpoint },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await page.getByRole("button", { name: "Inspect", exact: true }).click();

  await expect(page.getByText("The investigation is not finished")).toBeVisible();
  await page.getByRole("button", { name: "Return to the sealed door." }).click();
  await expect(page.getByRole("heading", { name: "Old Root Cellar" })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Sealed Iron Door" })).toBeVisible();
});

test("the active companion cannot be recruited again and keeps progress after waiting at the inn", async ({ page }) => {
  const checkpoint = buildBramblecrossInvestigationCheckpoint();
  checkpoint.position = { x: 2, y: 3 };
  checkpoint.visited.bramblecross = buildVisitedMap("bramblecross", 2, 3, 3);
  checkpoint.companion = {
    ...buildDefaultCompanion(),
    recruited: true,
    id: "rowan",
    name: "Rowan Reedshield",
    hp: 18,
    maxHp: 18,
    level: 2,
    xp: 23,
    style: "guardian",
    role: "Guardian",
  };
  checkpoint.flags.companionChosen = true;
  checkpoint.flags.companionChoice = "rowan";
  checkpoint.flags.rowanStatus = "joined";

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: checkpoint },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await page.getByTestId("move-up").click();
  await page.getByRole("button", { name: "Enter" }).click();

  await expect(page.getByRole("button", { name: "Traveling" })).toBeDisabled();
  await page.getByRole("button", { name: "Ask current companion to wait here" }).click();
  await page.getByRole("button", { name: "Travel together" }).click();
  await page.getByRole("button", { name: "Welcome back." }).click();
  await page.getByTestId("open-adventure-menu").click();
  await page.getByRole("button", { name: "Companion", exact: true }).click();

  await expect(page.getByText(/Companion XP: 23/)).toBeVisible();
  await expect(page.getByText(/Guardian.*Lv 2/)).toBeVisible();
});

test("the searched pond no longer offers another one-time search", async ({ page }) => {
  const checkpoint = buildRoadCampCheckpoint();
  checkpoint.position = { x: 2, y: 6 };
  checkpoint.visited.lanternRoad = buildVisitedMap("lanternRoad", 2, 6, 2);
  checkpoint.flags.pondVisited = true;
  checkpoint.flags.pondForaged = true;

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: checkpoint },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await page.getByRole("button", { name: "Inspect", exact: true }).click();

  const pond = page.getByRole("dialog", { name: "Pond Edge" });
  await expect(pond.getByRole("button", { name: "Search the pond edge carefully." })).toHaveCount(0);
  await expect(pond.getByRole("button", { name: "Leave the pond alone." })).toBeVisible();
});
