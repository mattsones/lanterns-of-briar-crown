import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import {
  CHAPTER_4_CHOICE_IDS,
  CHAPTER_4_SCENE_IDS,
  type FoldedMapEdge,
  type FoldedMapLanding,
} from "../src/story/chapter4";
import { parseDiskSaveText } from "../src/game/save";
import type { Flags, SavePayload } from "../src/game/types";
import { choice, continueCheckpoint, openCheckedInFixture, scene } from "./helpers/saveFixtures";

function chapter4Checkpoint(
  flagOverrides: Flags,
  position = { x: 0, y: 2 },
): SavePayload {
  const payload = parseDiskSaveText(readFileSync(
    new URL("../public/saves/chapter-3-complete.json", import.meta.url),
    "utf8",
  )).payload;
  return {
    ...payload,
    region: "underway",
    position,
    flags: {
      ...payload.flags,
      chapterFourStarted: true,
      gatewrightMet: true,
      foldedMapAttempted: true,
      foldedMapDecoded: true,
      underwayEntered: true,
      ...flagOverrides,
    },
  };
}

const CHOICE_BY_EDGE: Record<FoldedMapEdge, string> = {
  left: CHAPTER_4_CHOICE_IDS.leftEdge,
  right: CHAPTER_4_CHOICE_IDS.rightEdge,
  top: CHAPTER_4_CHOICE_IDS.topEdge,
  bottom: CHAPTER_4_CHOICE_IDS.bottomEdge,
};

const DEPTH_BY_LANDING: Record<FoldedMapLanding, number> = {
  quarter: 0.25,
  half: 0.5,
  "three-quarter": 0.75,
};

async function dragEdge(page: Page, edge: FoldedMapEdge, landing: FoldedMapLanding) {
  const handle = choice(page, CHOICE_BY_EDGE[edge]);
  const sheet = page.getByTestId("folded-map-sheet");
  await handle.scrollIntoViewIfNeeded();
  const [handleBox, sheetBox] = await Promise.all([handle.boundingBox(), sheet.boundingBox()]);
  if (!handleBox || !sheetBox) throw new Error(`Folded Map ${edge} edge is not measurable.`);
  const depth = DEPTH_BY_LANDING[landing];
  const start = { x: handleBox.x + handleBox.width / 2, y: handleBox.y + handleBox.height / 2 };
  const target = edge === "left"
    ? { x: sheetBox.x + sheetBox.width * depth, y: start.y }
    : edge === "right"
      ? { x: sheetBox.x + sheetBox.width * (1 - depth), y: start.y }
      : edge === "top"
        ? { x: start.x, y: sheetBox.y + sheetBox.height * depth }
        : { x: start.x, y: sheetBox.y + sheetBox.height * (1 - depth) };
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(target.x, target.y, { steps: 10 });
  await page.mouse.up();
  await expect(handle).toHaveAttribute("data-fold-depth", depth.toFixed(2));
}

async function moveRight(page: Page, steps: number) {
  for (let step = 0; step < steps; step += 1) {
    await page.getByTestId("move-right").click();
  }
}

const SURVEY_STATION_ROUTE_STEPS = 15;
const SURVEY_STATION_FORWARD_DIRECTIONS = [
  "down", "right", "down", "down", "down", "right", "up", "up",
  "right", "down", "down", "right", "up", "up", "up",
] as const;

async function moveThroughSurveyDescent(page: Page, steps = SURVEY_STATION_ROUTE_STEPS) {
  for (const direction of SURVEY_STATION_FORWARD_DIRECTIONS.slice(0, steps)) {
    await page.getByTestId(`move-${direction}`).click();
  }
}

async function beginChapter4AtGatewright(page: Page) {
  await openCheckedInFixture(page, "Begin Chapter 4 Playtest");
  await expect(page.getByRole("dialog", { name: "The Westward Record" })).toBeVisible();
  await choice(page, CHAPTER_4_CHOICE_IDS.beginChapter).click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.lowerGateArrival)).toBeVisible();
  await expect(page.locator('[data-map-node="7,0"]')).toHaveAccessibleName("Inspect Westroot Lower Gate");
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute("src", /lower-gate-smithy-scene-v01/);
  await choice(page, CHAPTER_4_CHOICE_IDS.meetGatewright).click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.gatewrightOffer)).toBeVisible();
  await expect(page.getByAltText("Portrait of Tasmine Rootbrace in her Lower Gate smithy")).toBeVisible();
}

async function openFoldedMapFromSurveyStation(page: Page) {
  const payload = chapter4Checkpoint({
    foldedMapAttempted: false,
    foldedMapDecoded: false,
    surveyStationReached: true,
  }, { x: 9, y: 2 });
  payload.region = "underwaySurveyStation";
  await continueCheckpoint(page, payload);
  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await choice(page, CHAPTER_4_CHOICE_IDS.openFoldedMap).click();
}

test("title offers standardized chapter playtest starts without graybox shortcuts", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Begin Chapter 2 Playtest" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Begin Chapter 3 Playtest" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Begin Chapter 4 Playtest" })).toBeVisible();
  await expect(page.getByRole("button", { name: /graybox/i })).toHaveCount(0);
});

test("Chapter 5 ready disk fixture reopens the accepted Chapter 4 ledger without replaying combat", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/");
  await page.getByRole("button", { name: "Load Save Slot" }).click();
  await page.locator('input[type="file"]').setInputFiles("public/saves/chapter-4-complete.json");
  await expect(page.getByRole("heading", { name: "Briar Relay Post", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.briarholdReveal)).toContainText("Lio's entry is bracketed with four other prisoners");
  await expect(scene(page, CHAPTER_4_SCENE_IDS.briarholdReveal)).toContainText("before dawn");
  await page.getByRole("button", { name: "Close the ledger." }).click();
  await expect(page.getByRole("heading", { name: "Briar Relay Post", exact: true })).toBeVisible();
});

test("real Chapter 3 fixture reaches the Folded Map through the required Gatewright encounter", async ({ page }) => {
  test.slow();
  await beginChapter4AtGatewright(page);

  await expect(page.getByText("Bramwell", { exact: false })).toBeVisible();
  await expect(page.getByText("buy, sell, compare", { exact: false })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Tasmine Rootbrace" })).toContainText(
    "Princess Elowen is making her first Royal Progress",
  );
  await expect(page.getByRole("dialog", { name: "Tasmine Rootbrace" })).not.toContainText(
    "survey station",
  );
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.openSmithy)).toHaveText("Visit Tasmine's Smithy");
  await choice(page, CHAPTER_4_CHOICE_IDS.openSmithy).click();
  await expect(page.getByTestId("shop-modal")).toHaveAttribute("data-shop-mode", "gatewright");
  await expect(page.getByText("Tasmine Rootbrace's Smithy", { exact: true })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Buy" })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("[data-shop-buy-item]")).toHaveCount(5);
  await page.getByRole("tab", { name: "Sell" }).click();
  await expect(page.locator("[data-shop-sell-item]").first()).toBeVisible();
  await expect(page.locator('[data-shop-sell-item="cargo_transfer_tag"]')).toHaveCount(0);
  const equippedHelm = page.locator('[data-shop-sell-item="kettle_helm"]');
  await expect(equippedHelm).toContainText("Equipped — you can remove it here before selling");
  await equippedHelm.getByRole("button", { name: "Unequip here" }).click();
  await expect(page.getByTestId("shop-feedback")).toContainText("Kettle Helm is unequipped and ready to sell");
  await expect(equippedHelm.getByRole("button", { name: /Sell/ })).toBeEnabled();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.gatewrightOffer)).toBeVisible();
  await choice(page, CHAPTER_4_CHOICE_IDS.continueToMap).click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.underwayArrival)).toBeVisible();
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.enterUnderway)).toHaveText(
    "Follow the tracks into the Underway.",
  );
  await choice(page, CHAPTER_4_CHOICE_IDS.enterUnderway).click();
  await expect(page.getByTestId("map-background")).toHaveAttribute("src", /underway-survey-station-map-v01\.webp$/);
  await expect(page.getByText("Goal: Follow the Tracks Below Westroot", { exact: true })).toBeVisible();
  await moveThroughSurveyDescent(page, SURVEY_STATION_ROUTE_STEPS - 1);
  const stationNode = page.locator('[data-map-node="9,2"]');
  await expect(stationNode).toBeVisible();
  await expect(stationNode).toHaveAccessibleName("Move to Waykeeper Survey Station");
  await page.getByTestId("move-up").click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.surveyStation)).toBeVisible();
  const stationDialogue = page.getByRole("dialog", { name: "An Old Waykeeper Station" });
  await expect(stationDialogue).toContainText("The descent levels off");
  await expect(stationDialogue).toContainText("Trying them one at a time would take time");
  await expect(stationDialogue).toContainText("Look at this!");
  await expect(stationDialogue).toContainText("Lio was here");
  await expect(stationDialogue).toContainText("a stack of matching maps");
  await expect(stationDialogue).toContainText("Rowan Reedshield has been circling the room");
  await expect(stationDialogue).toContainText("hear him call out suddenly from behind you");
  await expect(stationDialogue).not.toContainText("fresh grit");
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.openFoldedMap)).toHaveText(
    "Try to recreate the twice-folded map Lio's captors used.",
  );
  await choice(page, CHAPTER_4_CHOICE_IDS.openFoldedMap).click();

  await expect(page.getByRole("heading", { name: "The Folded Map" })).toBeVisible();
  await expect(page.getByText("Goal: Read the Waykeeper Table", { exact: true })).toBeVisible();
});

test("Tasmine's full smithy buys and sells before the Underway", async ({ page }) => {
  await beginChapter4AtGatewright(page);

  await choice(page, CHAPTER_4_CHOICE_IDS.openSmithy).click();
  await page.locator('[data-shop-buy-item="gatewright_hookblade"]').getByRole("button").click();
  await expect(page.getByText("Gold: 46", { exact: true })).toBeVisible();
  await expect(page.getByTestId("shop-feedback")).toContainText("Purchased Gatewright Hookblade for 32 gold. Owned: 1.");
  await expect(page.locator('[data-shop-buy-item="gatewright_hookblade"]')).toContainText("Owned ×1");
  await page.getByRole("tab", { name: "Sell" }).click();
  await page.locator('[data-shop-sell-item="trail_snack"]').getByRole("button").click();
  await expect(page.getByText("Gold: 48", { exact: true })).toBeVisible();
  await expect(page.getByTestId("shop-feedback")).toContainText("Sold Trail Snack for 2 gold. Remaining: 4.");
  await expect(page.locator('[data-shop-sell-item="trail_snack"]')).toContainText("×4");
});

test("the decoded story map opens the playable Old Keeper Road Underway graph", async ({ page }) => {
  await beginChapter4AtGatewright(page);
  await choice(page, CHAPTER_4_CHOICE_IDS.continueToMap).click();
  await choice(page, CHAPTER_4_CHOICE_IDS.enterUnderway).click();
  await moveRight(page, SURVEY_STATION_ROUTE_STEPS);
  await choice(page, CHAPTER_4_CHOICE_IDS.openFoldedMap).click();
  await dragEdge(page, "left", "half");
  await dragEdge(page, "bottom", "three-quarter");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await expect(page.getByTestId("folded-map-prototype").getByRole("button")).toHaveCount(1);
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.continueFromSurvey)).toHaveText(
    "Open the Old Keeper Road shutter",
  );
  await choice(page, CHAPTER_4_CHOICE_IDS.continueFromSurvey).click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.rootwaterApproach)).toBeVisible();
  const approachDialogue = page.getByRole("dialog", { name: "Beyond the Old Keeper Road Shutter" });
  await expect(approachDialogue).toContainText("moving water somewhere ahead");
  await expect(approachDialogue).toContainText("descends past the edge of your lantern light");
  await expect(approachDialogue).not.toContainText("high stone bridge");
  await choice(page, CHAPTER_4_CHOICE_IDS.approachRootwater).click();
  await expect(page.getByTestId("map-background")).toHaveAttribute("src", /rootwater-bridge-map-v01\.webp$/);
  await expect(page.getByTestId("rootwater-upstream-reveal")).toHaveCount(1);
  await expect(page.getByTestId("rootwater-downstream-reveal")).toHaveCount(1);
  await page.getByTestId("move-right").click();
  await page.getByTestId("move-left").click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.rootwaterApproach)).toHaveCount(0);
  await moveRight(page, 4);
  await expect(scene(page, CHAPTER_4_SCENE_IDS.rootwaterBridge)).toBeVisible();
  const bridgeDialogue = page.getByRole("dialog", { name: "Rootwater Bridge" });
  await expect(bridgeDialogue).toContainText("faintly blue-green beneath immense roots");
  await expect(bridgeDialogue).toContainText("same mark completed by the folded map");
  await expect(bridgeDialogue).toContainText("they were not traveling alone");
  await expect(bridgeDialogue).not.toContainText("Beyond the bridge");
  await expect(bridgeDialogue).not.toContainText("No road lantern burns here");
  await choice(page, CHAPTER_4_CHOICE_IDS.crossRootwater).click();
  await expect(page.getByTestId("map-status-overlay")).toContainText("Rootwater glows faintly below the parapet");
  await page.getByTestId("move-right").click();
  await page.getByTestId("move-left").click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.rootwaterBridge)).toHaveCount(0);
  await moveRight(page, 5);

  await expect(page.getByTestId("map-background")).toHaveAttribute(
    "src",
    /underway-approach-map-v03\.webp$/,
  );
  await moveRight(page, 8);
  await expect(scene(page, CHAPTER_4_SCENE_IDS.underwayWildlife)).toBeVisible();
  const wildlifeDialogue = page.getByRole("dialog", { name: "A Den Across the Road" });
  await expect(wildlifeDialogue).toContainText("Two tunnel rats");
  await expect(wildlifeDialogue).toContainText("no collars, thorns, or false marks");
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.faceUnderwayWildlife)).toHaveText(
    "Drive the animals back from the road.",
  );
  await choice(page, CHAPTER_4_CHOICE_IDS.faceUnderwayWildlife).click();
  await expect(page.getByRole("dialog", { name: /Battle/ })).toBeVisible();
  await expect(page.getByAltText("Portrait of a Tunnel Rat in the Underway")).toHaveCount(2);
  await expect(page.getByAltText("Portrait of the Root Gnawer in its ancient-root den")).toBeVisible();
});

test("Tasmine stocks only Westroot weapons and root-built armor", async ({ page }) => {
  await beginChapter4AtGatewright(page);

  await choice(page, CHAPTER_4_CHOICE_IDS.openSmithy).click();
  await expect(page.locator('[data-shop-buy-item="gatewright_hookblade"]')).toBeVisible();
  await expect(page.locator('[data-shop-buy-item="gatewright_passage_pike"]')).toBeVisible();
  await expect(page.locator('[data-shop-buy-item="gatewright_counterweight_maul"]')).toBeVisible();
  await expect(page.locator('[data-shop-buy-item="ironroot_ribplate"]')).toBeVisible();
  await expect(page.locator('[data-shop-buy-item="low_arch_roothelm"]')).toBeVisible();
  await expect(page.locator('[data-shop-buy-item="pebbleknock_hammer"]')).toHaveCount(0);
  await expect(page.locator('[data-shop-buy-item="giggleleaf_cloak"]')).toHaveCount(0);
  await expect(page.locator('[data-shop-buy-item="rootbread_charm"]')).toHaveCount(0);
  await page.locator('[data-shop-buy-item="gatewright_passage_pike"]').getByRole("button").click();
  await expect(page.getByText("Gold: 48", { exact: true })).toBeVisible();
  await page.locator('[data-shop-buy-item="gatewright_counterweight_maul"]').getByRole("button").click();
  await expect(page.getByText("Gold: 14", { exact: true })).toBeVisible();
});

test("posted detour choice occurs at the far side of the first map and commits to one exclusive route map", async ({ page }) => {
  test.slow();
  await continueCheckpoint(page, chapter4Checkpoint({}, { x: 7, y: 2 }));

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.underwayDetour)).toBeVisible();
  await expect(page.getByRole("dialog", { name: "A Posted Detour" })).toBeVisible();
  await choice(page, CHAPTER_4_CHOICE_IDS.inspectDetour).click();
  const inspectedDetour = page.getByRole("dialog", { name: "The Closure Plate, Up Close" });
  await expect(inspectedDetour).toBeVisible();
  await expect(inspectedDetour).toContainText("Upon closer inspection");
  await expect(inspectedDetour).toContainText("old Westroot root-and-road hazard seal");
  await expect(page.getByTestId("dialogue-feedback")).toContainText("the bronze plate is genuinely old");
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.inspectDetour)).toHaveCount(0);
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.followMappedRoute)).toContainText("Old Keeper Road");
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.followPostedDetour)).toContainText("construction detour");
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute("src", /underway-posted-detour-scene-v01/);
  expect(await choice(page, CHAPTER_4_CHOICE_IDS.followMappedRoute).getAttribute("class"))
    .toBe(await choice(page, CHAPTER_4_CHOICE_IDS.followPostedDetour).getAttribute("class"));
  await choice(page, CHAPTER_4_CHOICE_IDS.followPostedDetour).click();
  await expect(page.getByTestId("map-background")).toHaveAttribute(
    "src",
    /construction-detour-map-v03\.webp$/,
  );
  await expect(page.getByRole("button", { name: "Inspect Posted construction detour" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Inspect Old Keeper Road" })).toHaveCount(0);
  await moveRight(page, 5);
  await expect(scene(page, CHAPTER_4_SCENE_IDS.route817SignalRig)).toBeVisible();
  await expect(page.getByRole("dialog", { name: "A Live Construction Signal" })).toContainText(
    "count travelers coming through the construction detour",
  );
  await choice(page, CHAPTER_4_CHOICE_IDS.studySignalRig).click();
  await expect(page.getByTestId("map-status-overlay")).toContainText("ambush position ahead");
  await moveRight(page, 4);
  await expect(page.getByRole("button", { name: "Inspect Converged Tunnel" })).toBeVisible();
  await moveRight(page, 6);
  await expect(scene(page, CHAPTER_4_SCENE_IDS.underwayAmbush)).toBeVisible();
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.prepareAmbush)).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Ambush Revealed" })).toContainText(
    "a Briar relay guard and a Seal-Forged Sentry wait",
  );
});

test("the Old Keeper Road contains a unique waykeeper cache before convergence", async ({ page }) => {
  const payload = chapter4Checkpoint({
    underwayDetourDecisionMade: true,
    underwayDetourFollowed: false,
  });
  payload.region = "underwayRoute811";
  await continueCheckpoint(page, payload);

  await expect(page.getByTestId("map-background")).toHaveAttribute(
    "src",
    /old-keeper-road-map-v02\.webp$/,
  );
  await expect(page.getByTestId("map-stage")).toHaveClass(/painted-map-stage--local-lantern/);

  await moveRight(page, 5);
  await expect(scene(page, CHAPTER_4_SCENE_IDS.route811Cache)).toBeVisible();
  await expect(page.getByRole("dialog", { name: "An Abandoned Waykeeper Cache" })).toContainText(
    "keeper's lantern stamped on the inner band",
  );
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.takeWaykeeperHelm)).toContainText(
    "Old Waykeeper Helm",
  );
  await choice(page, CHAPTER_4_CHOICE_IDS.takeWaykeeperHelm).click();
  await expect(page.getByTestId("map-status-overlay")).toContainText(
    "Old Waykeeper Helm recovered from the Old Keeper Road.",
  );
  await moveRight(page, 4);
  await expect(page.getByRole("button", { name: "Inspect Converged Tunnel" })).toBeVisible();
});

test("Underway hides an ordinary ambush miss and reveals the attack only at the blind junction", async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0.01;
  });
  const payload = chapter4Checkpoint({ underwayDetourDecisionMade: true }, { x: 5, y: 2 });
  payload.region = "underwayConvergence";
  await continueCheckpoint(page, payload);

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByTestId("map-status-overlay")).toContainText("gives away nothing else");
  await expect(page.getByRole("button", { name: "Move to Concealed Briar Ambush" })).toHaveCount(0);

  await page.getByTestId("move-right").click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.underwayAmbush)).toBeVisible();
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.prepareAmbush)).toHaveCount(0);
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.faceAmbush)).toBeVisible();
});

test("exceptional Instinct reveals the Underway ambush and unlocks a prepared opening", async ({ page }) => {
  const payload = chapter4Checkpoint({ underwayDetourDecisionMade: true }, { x: 5, y: 2 });
  payload.region = "underwayConvergence";
  payload.player.baseStats.Instinct = 40;
  await continueCheckpoint(page, payload);

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByTestId("map-status-overlay")).toContainText("thread-thin cord crosses the floor");
  await expect(page.getByRole("button", { name: "Move to Concealed Briar Ambush" })).toBeVisible();
  await page.getByTestId("move-right").click();
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.prepareAmbush)).toBeVisible();
  await expect(page.getByText("Hero acts first", { exact: false })).toBeVisible();
  await choice(page, CHAPTER_4_CHOICE_IDS.prepareAmbush).click();
  await expect(page.getByText("Battle • Briar Relay Guard")).toBeVisible();
  await expect(page.getByText("party begins with 4 guard", { exact: false })).toHaveCount(0);
});

test("Listening Mile spaces Lio's trail across three lantern-dark travel beats", async ({ page }) => {
  const payload = chapter4Checkpoint({ underwayDetourDecisionMade: true, underwayAmbushCleared: true }, { x: 0, y: 2 });
  payload.region = "listeningPostOne";
  await continueCheckpoint(page, payload);

  await expect(page.getByRole("heading", { name: "The Listening Mile", exact: true })).toBeVisible();
  await expect(page.getByTestId("map-stage")).toHaveAttribute("data-visibility-mode", "local-lantern");
  await expect(page.getByTestId("underway-darkness")).toHaveAttribute("fill", "#000000");
  await expect(page.getByTestId("underway-lantern-halo")).toBeVisible();
  await moveRight(page, 6);
  await expect(scene(page, CHAPTER_4_SCENE_IDS.listeningMileIntro)).toBeVisible();
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute("src", /listening-mile-first-hood-scene-v01/);
  await expect(page.getByRole("dialog")).toContainText("hear around blind stone");
  await expect(page.getByRole("dialog")).not.toContainText("three flared listening hoods");
  await page.getByRole("dialog").getByRole("button", { name: "Step back from the hood.", exact: true }).click();
  await page.getByTestId("move-left").click();
  await page.getByTestId("move-right").click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.listeningMileIntro)).toBeVisible();
  await choice(page, CHAPTER_4_CHOICE_IDS.beginListeningMile).click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.listeningMileStationOne)).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Wall Listening Hood" })).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("one damaged wheel");
  await expect(page.getByRole("dialog")).not.toContainText("ambush shutter");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceSignal).click();
  await page.getByTestId("move-right").click();
  await page.getByTestId("move-left").click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.listeningMileIntro)).toHaveCount(0);
  await expect(scene(page, CHAPTER_4_SCENE_IDS.listeningMileStationOne)).toHaveCount(0);

  await expect(scene(page, CHAPTER_4_SCENE_IDS.listeningMileStationTwo)).toHaveCount(0);
  await moveRight(page, 3);
  await expect(page.getByRole("button", { name: "Inspect Listening-Mile Passage" })).toBeVisible();
  await moveRight(page, 6);
  await expect(scene(page, CHAPTER_4_SCENE_IDS.listeningMileStationTwo)).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("A voice says, “Keep them together.”");
  await expect(page.getByRole("dialog")).toContainText("someone coughs");
  await expect(page.getByRole("dialog")).toContainText("a thin, hurried scrape against bronze");
  await expect(page.getByRole("dialog")).not.toContainText("guard");
  await expect(page.getByRole("dialog")).not.toContainText("captive");
  await page.getByRole("dialog").getByRole("button", { name: "Step back from the hood.", exact: true }).click();
  await page.getByTestId("move-left").click();
  await page.getByTestId("move-right").click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.listeningMileStationTwo)).toBeVisible();
  await choice(page, CHAPTER_4_CHOICE_IDS.isolateSignal).click();
  await page.getByTestId("move-right").click();
  await page.getByTestId("move-left").click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.listeningMileStationTwo)).toHaveCount(0);
  await moveRight(page, 3);
  await expect(page.getByRole("button", { name: "Inspect Listening-Mile Passage" })).toBeVisible();
  await moveRight(page, 6);

  await expect(scene(page, CHAPTER_4_SCENE_IDS.listeningMileResult)).toBeVisible();
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute("src", /listening-mile-third-hood-scene-v01/);
  await expect(page.getByRole("dialog", { name: "Lio's Trail Marker" })).toContainText(
    "Fresh bronze dust lies below a stiff inspection shutter",
  );
  await expect(page.getByRole("dialog", { name: "Lio's Trail Marker" })).toContainText(
    "The sounds are moving away",
  );
  await expect(page.getByRole("dialog", { name: "Lio's Trail Marker" })).toContainText("small, hurried, and unmistakably his");
  await expect(page.getByTestId("dialogue-feedback")).toContainText("He knew I would look twice");
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.finishListeningMile)).toContainText(
    "loose route-record plate",
  );
  await choice(page, CHAPTER_4_CHOICE_IDS.finishListeningMile).click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.lioMessageDiscovery)).toBeVisible();
  await page.getByRole("dialog").getByRole("button", { name: "Set the plate back for now.", exact: true }).click();
  await page.getByTestId("move-left").click();
  await page.getByTestId("move-left").click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.listeningMileResult)).toHaveCount(0);
  await moveRight(page, 2);
  await expect(scene(page, CHAPTER_4_SCENE_IDS.lioMessageDiscovery)).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Loose Route-Record Plate" })).toContainText(
    "fresh letters cross the old stamped route table",
  );
  await choice(page, CHAPTER_4_CHOICE_IDS.readLioMessage).click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.lioMessageResponse)).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Still Me" })).toContainText(
    "do not follow angry. Follow clever",
  );
  await expect(page.getByRole("dialog", { name: "Still Me" })).toContainText("M—do not follow");
  await expect(page.getByRole("dialog", { name: "Still Me" })).toContainText("Taking us west");
  await expect(page.getByRole("dialog", { name: "Still Me" })).not.toContainText("Still breathing");
  await expect(page.getByTestId("dialogue-feedback")).toContainText("We follow clever");
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.finishLioMessage)).toHaveText(
    "Follow Lio's westbound direction.",
  );
  await choice(page, CHAPTER_4_CHOICE_IDS.finishLioMessage).click();

  await expect(scene(page, CHAPTER_4_SCENE_IDS.relayArrival)).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Inspect Westbound Relay Tunnel" })).toBeVisible();
  await moveRight(page, 9);
  await expect(scene(page, CHAPTER_4_SCENE_IDS.relayArrival)).toBeVisible();
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute("src", /briar-relay-post-approach-scene-v01/);
  await choice(page, CHAPTER_4_CHOICE_IDS.enterRelayPost).click();
  await page.getByTestId("move-right").click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.royalProgressBroadside)).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Royal Progress Broadside" })).toContainText("heir apparent");
  await expect(page.getByRole("dialog", { name: "Royal Progress Broadside" })).toContainText(
    "the name Tasmine mentioned at the Lower Gate",
  );
  await expect(page.getByRole("dialog", { name: "Royal Progress Broadside" })).toContainText("Every five years");
  await expect(page.getByRole("dialog", { name: "Royal Progress Broadside" })).not.toContainText("sapphire royal gown");
  await expect(page.getByTestId("dialogue-scene-image")).toHaveClass(/object-contain/);
  await choice(page, CHAPTER_4_CHOICE_IDS.readRoyalProgress).click();
  await page.getByTestId("move-right").click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.relayGuard)).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Guarded Relay Floor" })).toContainText("Crown Whisperer");
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.faceRelayGuard)).toBeVisible();
});

test("captured Relay Post records expose the forged authority and Chapter 5 rescue target", async ({ page }) => {
  const payload = chapter4Checkpoint({
    underwayDetourDecisionMade: true,
    underwayAmbushCleared: true,
    listeningMileAttempted: true,
    listeningMileOutcome: "marker-found",
    lioMessageFound: true,
    royalProgressLearned: true,
    briarRelayCleared: true,
  }, { x: 2, y: 1 });
  payload.region = "briarRelayPost";
  await continueCheckpoint(page, payload);

  await page.getByTestId("move-right").click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.forgedAuthority)).toBeVisible();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.forgedAuthority)).toHaveAttribute("data-content-layout", "stacked");
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute(
    "src",
    /relay-forged-authority-scene-v01/,
  );
  await expect(page.getByRole("dialog", { name: "Forged Authority" })).toContainText(
    "argument for national road standards",
  );
  await expect(page.getByRole("dialog", { name: "Forged Authority" })).toContainText("manufactured panic");
  await choice(page, CHAPTER_4_CHOICE_IDS.inspectForgedOrder).click();

  await page.getByTestId("move-right").click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.briarholdReveal)).toBeVisible();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.briarholdReveal)).toHaveAttribute("data-content-layout", "stacked");
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute(
    "src",
    /briarhold-route-ledger-reveal-scene-v02/,
  );
  await expect(page.getByRole("dialog", { name: "Briarhold Waystation" })).toContainText("L.B. — COURIER — ALIVE");
  await expect(page.getByRole("dialog", { name: "Briarhold Waystation" })).toContainText("with four others");
  await expect(page.getByRole("dialog", { name: "Briarhold Waystation" })).toContainText(
    "tipped a lamp across the westbound ledger to burn the evidence",
  );
  await expect(page.getByRole("dialog", { name: "Briarhold Waystation" })).not.toContainText(
    "not being carried to a known prison",
  );
  await expect(page.getByRole("dialog", { name: "Briarhold Waystation" })).toContainText("Briarhold Waystation");
  await choice(page, CHAPTER_4_CHOICE_IDS.finishChapterFour).click();
  await expect(page.getByText("Chapter 4 complete: The Riddle Road", { exact: true })).toBeVisible();
});

test("rectangular Folded Map supports two faces, many edge landings, and false and true two-fold routes", async ({ page }) => {
  test.slow();
  await openFoldedMapFromSurveyStation(page);

  const prototype = page.getByTestId("folded-map-prototype");
  const sheet = page.getByTestId("folded-map-sheet");
  await expect(page.getByRole("heading", { name: "The Folded Map" })).toBeVisible();
  await expect(page.getByText("One opaque map, printed differently on each side. Drag any edge inward to fold.", { exact: true })).toBeVisible();
  await expect(page.getByText("Look for agreement", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Edden's clue", { exact: true })).toHaveCount(0);
  await expect(scene(page, CHAPTER_4_SCENE_IDS.foldedMapGraybox)).toBeVisible();
  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:flat");
  await expect(sheet).toHaveAttribute("data-map-side", "front");

  await choice(page, CHAPTER_4_CHOICE_IDS.flipMap).click();
  await expect(sheet).toHaveAttribute("data-map-side", "back");
  await expect(page.locator('[data-map-face="back"]')).toHaveCount(1);
  await choice(page, CHAPTER_4_CHOICE_IDS.flipMap).click();
  await expect(sheet).toHaveAttribute("data-map-side", "front");

  await choice(page, CHAPTER_4_CHOICE_IDS.leftEdge).click();
  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:flat");
  await expect(page.getByTestId("folded-map-feedback")).toContainText("Pressing the handle alone");

  await dragEdge(page, "left", "quarter");
  await dragEdge(page, "top", "three-quarter");
  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:left-quarter,top-three-quarter");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await expect(prototype).toHaveAttribute("data-trace-outcome", "not-a-route");
  await expect(page.getByTestId("folded-map-result-stamp")).toContainText("NO SHUTTER MARK");
  await expect(page.getByTestId("folded-map-feedback")).toContainText("none of the three shutter marks");

  await choice(page, CHAPTER_4_CHOICE_IDS.resetFolds).click();
  await dragEdge(page, "right", "half");
  await dragEdge(page, "top", "half");
  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:right-half,top-half");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await expect(prototype).toHaveAttribute("data-trace-outcome", "false-shortcut");
  await expect(page.getByTestId("folded-map-result-stamp")).toContainText("SEALED SURVEY BORE");
  await expect(page.getByTestId("folded-map-result-stamp")).toContainText("SURVEY SHORTCUT");
  await expect(page.getByTestId("folded-map-feedback")).toContainText("proposed, never opened");
  await expect(scene(page, CHAPTER_4_SCENE_IDS.foldedMapReview)).toBeVisible();

  await choice(page, CHAPTER_4_CHOICE_IDS.resetFolds).click();
  await dragEdge(page, "left", "half");
  await dragEdge(page, "bottom", "three-quarter");
  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:left-half,bottom-three-quarter");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await expect(prototype).toHaveAttribute("data-trace-outcome", "true-route");
  await expect(page.getByTestId("folded-map-result-stamp")).toContainText("CAPTORS' SHUTTER FOUND");
  await expect(page.getByTestId("folded-map-result-stamp")).toContainText("OLD KEEPER ROAD");
  await expect(page.getByTestId("folded-map-true-evidence")).toBeVisible();
  await expect(page.getByTestId("folded-map-feedback")).toContainText("west edge lands halfway");
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.continueFromSurvey)).toBeVisible();
  await expect(prototype.getByRole("button")).toHaveCount(1);
  await expect(page.getByTestId("fold-count")).toContainText("2/2 folds");
});

test("Folded Map Back opens the latest edge before closing", async ({ page }) => {
  await openFoldedMapFromSurveyStation(page);

  const prototype = page.getByTestId("folded-map-prototype");
  await dragEdge(page, "left", "half");
  await dragEdge(page, "bottom", "three-quarter");
  await choice(page, CHAPTER_4_CHOICE_IDS.back).click();
  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:left-half");
  await choice(page, CHAPTER_4_CHOICE_IDS.back).click();
  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:flat");
  await choice(page, CHAPTER_4_CHOICE_IDS.back).click();
  await expect(page.getByRole("heading", { name: "The Folded Map" })).toHaveCount(0);
});

test("Folded Map keyboard controls do not trigger the underlying map interaction", async ({ page }) => {
  await openFoldedMapFromSurveyStation(page);

  const prototype = page.getByTestId("folded-map-prototype");
  const westHandle = choice(page, CHAPTER_4_CHOICE_IDS.leftEdge);
  await westHandle.press("Enter");

  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:left-quarter");
  await expect(page.getByRole("dialog", { name: "Noma Greenstill" })).toHaveCount(0);
});

test("rectangular Folded Map remains draggable and traceable at phone width", async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await openFoldedMapFromSurveyStation(page);

  await expect(page.getByRole("heading", { name: "The Folded Map" })).toBeInViewport();
  await dragEdge(page, "left", "half");
  await dragEdge(page, "bottom", "three-quarter");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await expect(page.getByTestId("folded-map-feedback")).toContainText("Old Keeper Road shutter");
});
