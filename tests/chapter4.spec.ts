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

async function beginChapter4AtGatewright(page: Page) {
  await openCheckedInFixture(page, "Review Chapter 3 Complete Save");
  await choice(page, CHAPTER_4_CHOICE_IDS.beginChapter).click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.lowerGateArrival)).toBeVisible();
  await choice(page, CHAPTER_4_CHOICE_IDS.meetGatewright).click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.gatewrightOffer)).toBeVisible();
}

test("real Chapter 3 fixture reaches the Folded Map through the required Gatewright encounter", async ({ page }) => {
  await beginChapter4AtGatewright(page);

  await expect(page.getByText("Bramwell", { exact: false })).toBeVisible();
  await expect(page.getByText("buy, sell, compare", { exact: false })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Tasmine Rootbrace" })).toContainText(
    "Princess Elowen is making her first Royal Progress",
  );
  await choice(page, CHAPTER_4_CHOICE_IDS.openSmithy).click();
  await expect(page.getByTestId("shop-modal")).toHaveAttribute("data-shop-mode", "gatewright");
  await expect(page.getByText("Tasmine Rootbrace's Smithy", { exact: true })).toBeVisible();
  await expect(page.locator("[data-shop-buy-item]")).toHaveCount(5);
  await expect(page.locator("[data-shop-sell-item]").first()).toBeVisible();
  await expect(page.locator('[data-shop-sell-item="cargo_transfer_tag"]')).toHaveCount(0);
  const equippedHelm = page.locator('[data-shop-sell-item="kettle_helm"]');
  await expect(equippedHelm).toContainText("Equipped — unequip it before selling");
  await expect(equippedHelm.getByRole("button", { name: "Equipped" })).toBeDisabled();
  await page.getByRole("button", { name: "Close" }).click();
  await page.getByRole("button", { name: "Visit Tasmine Rootbrace" }).click();
  await choice(page, CHAPTER_4_CHOICE_IDS.continueToMap).click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.foldedMapBriefing)).toBeVisible();
  await choice(page, CHAPTER_4_CHOICE_IDS.openFoldedMap).click();

  await expect(page.getByRole("heading", { name: "The Folded Map" })).toBeVisible();
  await expect(page.getByText("Goal: Decode the Folded Map", { exact: true })).toBeVisible();
});

test("Tasmine's full smithy buys and sells before the Underway", async ({ page }) => {
  await beginChapter4AtGatewright(page);

  await choice(page, CHAPTER_4_CHOICE_IDS.openSmithy).click();
  await page.locator('[data-shop-buy-item="gatewright_hookblade"]').getByRole("button").click();
  await expect(page.getByText("Gold: 46", { exact: true })).toBeVisible();
  await page.locator('[data-shop-sell-item="trail_snack"]').getByRole("button").click();
  await expect(page.getByText("Gold: 48", { exact: true })).toBeVisible();
  await expect(page.locator('[data-shop-sell-item="trail_snack"]')).toContainText("x4");
});

test("the decoded story map opens the playable Old Keeper Road Underway graph", async ({ page }) => {
  await beginChapter4AtGatewright(page);
  await choice(page, CHAPTER_4_CHOICE_IDS.continueToMap).click();
  await choice(page, CHAPTER_4_CHOICE_IDS.openFoldedMap).click();
  await dragEdge(page, "left", "half");
  await dragEdge(page, "bottom", "three-quarter");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await choice(page, CHAPTER_4_CHOICE_IDS.close).click();

  await choice(page, CHAPTER_4_CHOICE_IDS.enterUnderway).click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.underwayArrival)).toBeVisible();
  await choice(page, CHAPTER_4_CHOICE_IDS.enterUnderway).click();
  await page.getByTestId("move-right").click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.underwayRoute)).toBeVisible();
  await choice(page, CHAPTER_4_CHOICE_IDS.followMappedRoute).click();

  await expect(page.getByTestId("map-background")).toHaveAttribute(
    "src",
    /underway-approach-map-v03\.webp$/,
  );
  await moveRight(page, 5);
  await expect(page.getByRole("button", { name: "Inspect Underway Passage" })).toBeVisible();
  await page.getByTestId("move-right").click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.underwayDetour)).toBeVisible();
  await expect(page.getByText("posted closure should protect travelers", { exact: false })).toBeVisible();
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
  await choice(page, CHAPTER_4_CHOICE_IDS.inspectDetour).click();
  await expect(page.getByText("real old Westroot hazard stamp", { exact: false })).toBeVisible();
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.followMappedRoute)).toContainText("Old Keeper Road");
  await expect(choice(page, CHAPTER_4_CHOICE_IDS.followPostedDetour)).toContainText("construction detour");
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
  await expect(page.getByRole("dialog")).toContainText("hear around blind stone");
  await expect(page.getByRole("dialog")).not.toContainText("three flared listening hoods");
  await choice(page, CHAPTER_4_CHOICE_IDS.beginListeningMile).click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.listeningMileStationOne)).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Wall Listening Hood" })).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("one damaged wheel");
  await expect(page.getByRole("dialog")).not.toContainText("ambush shutter");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceSignal).click();

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
  await choice(page, CHAPTER_4_CHOICE_IDS.isolateSignal).click();
  await moveRight(page, 3);
  await expect(page.getByRole("button", { name: "Inspect Listening-Mile Passage" })).toBeVisible();
  await moveRight(page, 6);

  await expect(scene(page, CHAPTER_4_SCENE_IDS.listeningMileResult)).toBeVisible();
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
  await choice(page, CHAPTER_4_CHOICE_IDS.enterRelayPost).click();
  await page.getByTestId("move-right").click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.royalProgressBroadside)).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Royal Progress Broadside" })).toContainText("heir apparent");
  await expect(page.getByRole("dialog", { name: "Royal Progress Broadside" })).toContainText(
    "the name Tasmine mentioned at the Lower Gate",
  );
  await expect(page.getByRole("dialog", { name: "Royal Progress Broadside" })).toContainText("Every five years");
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
  await expect(page.getByRole("dialog", { name: "Forged Authority" })).toContainText(
    "argument for national road standards",
  );
  await expect(page.getByRole("dialog", { name: "Forged Authority" })).toContainText("manufactured panic");
  await choice(page, CHAPTER_4_CHOICE_IDS.inspectForgedOrder).click();

  await page.getByTestId("move-right").click();
  await expect(scene(page, CHAPTER_4_SCENE_IDS.briarholdReveal)).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Briarhold Waystation" })).toContainText("L.B. — COURIER — ALIVE");
  await expect(page.getByRole("dialog", { name: "Briarhold Waystation" })).toContainText("with four others");
  await expect(page.getByRole("dialog", { name: "Briarhold Waystation" })).not.toContainText(
    "not being carried to a known prison",
  );
  await expect(page.getByRole("dialog", { name: "Briarhold Waystation" })).toContainText("Briarhold Waystation");
  await choice(page, CHAPTER_4_CHOICE_IDS.finishChapterFour).click();
  await expect(page.getByText("Chapter 4 complete: The Riddle Road", { exact: true })).toBeVisible();
});

test("rectangular Folded Map supports two faces, many edge landings, and false and true two-fold routes", async ({ page }) => {
  test.slow();
  await openCheckedInFixture(page, "Test Folded Map Graybox");

  const prototype = page.getByTestId("folded-map-prototype");
  const sheet = page.getByTestId("folded-map-sheet");
  await expect(page.getByRole("heading", { name: "The Folded Map" })).toBeVisible();
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
  await expect(page.getByTestId("folded-map-result-stamp")).toContainText("NO CONTINUOUS ROUTE");
  await expect(page.getByTestId("folded-map-feedback")).toContainText("evidence does not");

  await choice(page, CHAPTER_4_CHOICE_IDS.resetFolds).click();
  await dragEdge(page, "right", "half");
  await dragEdge(page, "top", "half");
  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:right-half,top-half");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await expect(prototype).toHaveAttribute("data-trace-outcome", "false-shortcut");
  await expect(page.getByTestId("folded-map-result-stamp")).toContainText("TEMPTING ROUTE REJECTED");
  await expect(page.getByTestId("folded-map-result-stamp")).toContainText("SURVEY SHORTCUT");
  await expect(page.getByTestId("folded-map-feedback")).toContainText("wonderfully straight shortcut");
  await expect(scene(page, CHAPTER_4_SCENE_IDS.foldedMapReview)).toBeVisible();

  await choice(page, CHAPTER_4_CHOICE_IDS.resetFolds).click();
  await dragEdge(page, "left", "half");
  await dragEdge(page, "bottom", "three-quarter");
  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:left-half,bottom-three-quarter");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await expect(prototype).toHaveAttribute("data-trace-outcome", "true-route");
  await expect(page.getByTestId("folded-map-result-stamp")).toContainText("TRUE ROUTE FOUND");
  await expect(page.getByTestId("folded-map-result-stamp")).toContainText("UNDERWAY DECODED");
  await expect(page.getByTestId("folded-map-true-evidence")).toBeVisible();
  await expect(page.getByTestId("folded-map-feedback")).toContainText("west edge lands halfway");
  await expect(page.getByText("True route recorded", { exact: false })).toBeVisible();

  await choice(page, CHAPTER_4_CHOICE_IDS.topEdge).press("Enter");
  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:left-half,bottom-three-quarter");
  await expect(page.getByTestId("folded-map-feedback")).toContainText("Hold the route to two folds");
  await expect(page.getByTestId("fold-count")).toContainText("2/2 folds active");
});

test("Folded Map Back opens the latest edge before closing", async ({ page }) => {
  await openCheckedInFixture(page, "Test Folded Map Graybox");

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
  await openCheckedInFixture(page, "Test Folded Map Graybox");

  const prototype = page.getByTestId("folded-map-prototype");
  const westHandle = choice(page, CHAPTER_4_CHOICE_IDS.leftEdge);
  await westHandle.press("Enter");

  await expect(prototype).toHaveAttribute("data-fold-configuration", "front:left-quarter");
  await expect(page.getByRole("dialog", { name: "Noma Greenstill" })).toHaveCount(0);
});

test("rectangular Folded Map remains draggable and traceable at phone width", async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await openCheckedInFixture(page, "Test Folded Map Graybox");

  await expect(page.getByRole("heading", { name: "The Folded Map" })).toBeInViewport();
  await dragEdge(page, "left", "half");
  await dragEdge(page, "bottom", "three-quarter");
  await choice(page, CHAPTER_4_CHOICE_IDS.traceRoute).click();
  await expect(page.getByTestId("folded-map-feedback")).toContainText("Underway");
});
