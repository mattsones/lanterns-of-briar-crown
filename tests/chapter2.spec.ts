import { expect, test } from "@playwright/test";
import { MAPS } from "../src/data/maps";
import { buildVisitedMap } from "../src/game/map";
import {
  buildDefaultCompanion,
  buildDefaultFlags,
  buildPlayer,
} from "../src/game/state";
import { STORAGE_KEY } from "../src/game/save";

function buildChapter2Checkpoint(flagOverrides = {}, position = { x: 6, y: 4 }) {
  const player = buildPlayer({
    name: "Liam",
    gender: "Male",
    raceId: "human",
  });
  player.inventory = {
    ...player.inventory,
    eddens_three_door_drawing: 1,
    willowmark_lens: 1,
  };

  return {
    screen: "play",
    chapterId: 2,
    player,
    region: "westrootTrail",
    position,
    visited: {
      westrootTrail: buildVisitedMap("westrootTrail", position.x, position.y, 9),
    },
    companion: buildDefaultCompanion(),
    guestNpc: null,
    flags: {
      ...buildDefaultFlags(),
      chapterOneClear: true,
      chapterReported: true,
      chapterTwoStarted: true,
      chapterTwoBriefed: true,
      maraJoined: true,
      eddenVisited: true,
      eddenDrawingReceived: true,
      adaSealLessonComplete: true,
      maraJob: "lioMarks",
      ...flagOverrides,
    },
    quest: { title: "The Westroot Trail", description: "Follow the old road west." },
    toast: "Loaded Chapter 2 test checkpoint.",
  };
}

function buildChapter2BriefingCheckpoint() {
  const player = buildPlayer({
    name: "Liam",
    gender: "Male",
    raceId: "human",
  });

  return {
    screen: "play",
    chapterId: 2,
    player,
    region: "bramblecross",
    position: { x: 6, y: 3 },
    visited: {
      bramblecross: buildVisitedMap("bramblecross", 6, 3, 9),
    },
    companion: buildDefaultCompanion(),
    guestNpc: null,
    flags: {
      ...buildDefaultFlags(),
      chapterOneClear: true,
      chapterReported: true,
      reachedBramblecross: true,
      enteredBramblecross: true,
    },
    quest: { title: "The Westroot Lead", description: "Get the Westroot briefing from Enna and Hollis." },
    toast: "Loaded Chapter 2 briefing test checkpoint.",
  };
}

async function loadChapter2Checkpoint(page, flagOverrides = {}, options = {}) {
  const position = options.position || { x: 6, y: 4 };
  const expectedTile = options.expectedTile || "Three-Door Threshold";
  const payload = buildChapter2Checkpoint(flagOverrides, position);
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: payload },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await expect(page.getByRole("heading", { name: MAPS.westrootTrail.name })).toBeVisible();
  await expect(page.getByText(`You are standing on: ${expectedTile}.`)).toBeVisible();
  await expect(page.getByTestId("map-background")).toBeVisible();
  await expect(page.getByTestId("map-background")).toHaveAttribute("src", /westroot-trail-map-v04/);
  await expect(page.getByTestId("hero-token")).toBeVisible();
  await expect(page.getByTestId("hero-token").getByTestId("hero-token-art")).toBeVisible();
}

async function loadChapter2BriefingCheckpoint(page) {
  const payload = buildChapter2BriefingCheckpoint();
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: payload },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await expect(page.getByRole("heading", { name: MAPS.bramblecross.name })).toBeVisible();
  await expect(page.getByText("You are standing on: Road.")).toBeVisible();
}

test("title screen loads the checked-in Chapter 2 playtest save", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/");
  await page.getByRole("button", { name: "Load Chapter 2 Playtest Save" }).click();

  await expect(page.getByRole("heading", { name: MAPS.bramblecross.name })).toBeVisible();
  await expect(page.getByText("Goal: Return to the Watchhouse")).toBeVisible();
  await expect(page.getByText("You are standing on: Road.")).toBeVisible();
  await expect(page.getByText("Chapter 2: The Westroot Trail")).toBeVisible();
});

test("title screen loads the checked-in Chapter 3 ready save", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/");
  await page.getByRole("button", { name: "Load Chapter 3 Ready Save" }).click();

  await expect(page.getByRole("heading", { name: MAPS.westrootTrail.name })).toBeVisible();
  await expect(page.getByText("You are standing on: Three-Door Threshold.")).toBeVisible();
  await expect(page.getByText("Chapter 2 complete: The Westroot Trail", { exact: true })).toBeVisible();
  await expect(page.getByText("Goal: Chapter 2 Complete: The Westroot Trail")).toBeVisible();
});

test("chapter two fog covers map tokens instead of floating over darkness", async ({ page }) => {
  await page.setViewportSize({ width: 2048, height: 1280 });
  await loadChapter2Checkpoint(
    page,
    {},
    { position: { x: 2, y: 1 }, expectedTile: "Roadside Shelter Nook" },
  );

  await expect(page.locator(".map-fog-layer")).toBeVisible();
  await expect(page.locator(".map-token-layer")).toHaveCSS("z-index", "2");
  await expect(page.locator(".map-fog-layer")).toHaveCSS("z-index", "3");

  const bounds = await page.evaluate(() => {
    const stage = document.querySelector('[data-testid="map-stage"]')?.getBoundingClientRect();
    const fog = document.querySelector(".map-fog-layer")?.getBoundingClientRect();
    return stage && fog
      ? {
          stageWidth: stage.width,
          stageHeight: stage.height,
          fogWidth: fog.width,
          fogHeight: fog.height,
        }
      : null;
  });
  expect(bounds).not.toBeNull();
  expect(Math.abs(bounds.stageWidth - bounds.fogWidth)).toBeLessThan(3);
  expect(Math.abs(bounds.stageHeight - bounds.fogHeight)).toBeLessThan(3);
});

test("chapter two loaded saves refresh fog after westroot node normalization", async ({ page }) => {
  const payload = buildChapter2Checkpoint({}, { x: 6, y: 3 });
  payload.visited = {
    westrootTrail: {
      "6,3": true,
    },
  };

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: payload },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();

  await expect(page.getByRole("heading", { name: MAPS.westrootTrail.name })).toBeVisible();
  await expect(page.getByText("You are standing on: Three-Door Threshold.")).toBeVisible();

  const stored = await page.evaluate((key) => {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }, STORAGE_KEY);
  expect(stored.position).toEqual({ x: 6, y: 4 });
  expect(stored.visited.westrootTrail["6,4"]).toBe(true);
});

test("chapter two briefing Edden drawing choice opens the recovery room", async ({ page }) => {
  await loadChapter2BriefingCheckpoint(page);

  await page.keyboard.press("ArrowUp");
  await page.getByRole("button", { name: "Enter" }).click();
  await page.getByRole("button", { name: "Review the Westroot briefing" }).click();
  await page.getByRole("button", { name: "What did Edden draw?" }).click();
  await expect(page.getByText("Edden's Drawing")).toBeVisible();
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute(
    "src",
    /eddens-three-door-drawing-scene-v01/,
  );
  await expect(page.getByText("THE HONEST ONE HAS NO HANDLE")).not.toBeVisible();

  await page.getByRole("button", { name: "I should talk to Edden." }).click();
  await expect(page.getByText("Edden's Recovery Room", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Take Edden's three-door drawing." })).toBeVisible();
  await page.getByRole("button", { name: "Take Edden's three-door drawing." }).click();
  await page.getByRole("button", { name: "Review the Westroot briefing" }).click();
  await expect(page.getByRole("button", { name: "What exactly is Westroot?" })).toBeVisible();
});

test("chapter two Ada pre-briefing interaction opens a dialog", async ({ page }) => {
  const payload = buildChapter2BriefingCheckpoint();
  payload.position = { x: 9, y: 4 };
  payload.visited = {
    bramblecross: buildVisitedMap("bramblecross", 9, 4, 9),
  };

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: payload },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await expect(page.getByText("You are standing on: Ada Willowmarket.")).toBeVisible();

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByText("Ada Willowmarket", { exact: true })).toBeVisible();
  await expect(page.getByText("Bring me the watchhouse shape of it")).toBeVisible();
  await expect(page.getByAltText("Portrait of Ada Willowmarket")).toBeVisible();
});

test("chapter two Ada seal lesson swaps to no-lens portrait immediately", async ({ page }) => {
  const payload = buildChapter2BriefingCheckpoint();
  payload.position = { x: 9, y: 4 };
  payload.visited = {
    bramblecross: buildVisitedMap("bramblecross", 9, 4, 9),
  };
  payload.player.inventory.eddens_three_door_drawing = 1;
  payload.flags.chapterTwoStarted = true;
  payload.flags.chapterTwoBriefed = true;
  payload.flags.eddenVisited = true;
  payload.flags.eddenDrawingReceived = true;
  payload.flags.adaSealLessonComplete = false;

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: payload },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await expect(page.getByText("You are standing on: Ada Willowmarket.")).toBeVisible();

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByText("Ada's Seal Lesson", { exact: true })).toBeVisible();
  await expect(page.getByAltText("Portrait of Ada Willowmarket")).toBeVisible();
  await expect(page.getByAltText("Portrait of Ada Willowmarket without the Willowmark Lens")).toHaveCount(0);

  await page.getByRole("button", { name: "Borrow the Willowmark Lens." }).click();
  await expect(page.getByText("Ada Willowmarket", { exact: true })).toBeVisible();
  await expect(page.getByText("empty place on her work strap")).toBeVisible();
  await expect(page.getByAltText("Portrait of Ada Willowmarket without the Willowmark Lens")).toBeVisible();
  await expect(page.getByRole("button", { name: "I'll bring it back." })).toBeVisible();
});

test("chapter two skipped Ada lesson hides Willowmark Lens choices", async ({ page }) => {
  const payload = buildChapter2Checkpoint(
    {
      adaSealLessonComplete: false,
      noHandleStoneInspected: true,
    },
    { x: 4, y: 1 },
  );
  delete payload.player.inventory.willowmark_lens;

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: payload },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await expect(page.getByText("You are standing on: False Detour Notice.")).toBeVisible();

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByRole("button", { name: "Use the Willowmark Lens on the seal." })).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Clear the moss around the smaller scratch." })).toBeVisible();
});

test("chapter two no-handle door frames the repair puzzle before it opens", async ({ page }) => {
  await loadChapter2Checkpoint(page, {
    lioShelterMarkFound: true,
  });

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByText("Three-Door Threshold", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Approach the No-Handle Door." }).click();
  await expect(page.getByText("LET THE ROAD BEHIND YOU SPEAK")).toBeVisible();
  await expect(page.getByText("I DO NOT ANSWER HANDS")).toBeVisible();
  await expect(page.getByText("The door is not only listening to you")).toBeVisible();
  await expect(page.getByRole("button", { name: "Ask Mara to read the tiny scratch." })).toBeVisible();
  await expect(page.getByText("Break the false road orders.")).not.toBeVisible();

  await page.getByRole("button", { name: "Ask Mara to read the tiny scratch." }).click();
  await expect(page.getByText("Mara matches the tiny hook-tail")).toBeVisible();
  await page.getByRole("button", { name: /Say: A road is safest/ }).click();
  await expect(page.getByText("The Door Waits")).toBeVisible();
  await expect(page.getByText("The door is not only listening to you")).toBeVisible();
  await expect(page.getByText(/Still waiting:/)).not.toBeVisible();
});

test("chapter two three-sign hollow is a turn-back warning area", async ({ page }) => {
  await loadChapter2Checkpoint(
    page,
    {},
    { position: { x: 4, y: 3 }, expectedTile: "Three-Sign Hollow" },
  );

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByText("RETURN TO BRAMBLECROSS")).toBeVisible();
  await expect(page.getByRole("button", { name: "Hurry after Lio." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Approach the Crown Door." })).not.toBeVisible();

  await page.getByRole("button", { name: "Hurry after Lio." }).click();
  await expect(page.getByRole("button", { name: "Hurry after Lio." })).not.toBeVisible();
});

test("chapter two threshold supports trying each door", async ({ page }) => {
  await loadChapter2Checkpoint(page);

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByText("Three-Door Threshold", { exact: true })).toBeVisible();
  await expect(page.getByTestId("dialogue-scene-image")).toBeVisible();
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute("src", /three-doors-threshold-v01/);
  await expect(page.getByRole("button", { name: "Approach the Crown Door." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Approach the Lantern Door." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Approach the No-Handle Door." })).toBeVisible();

  await page.getByRole("button", { name: "Approach the Lantern Door." }).click();
  await expect(page.getByRole("button", { name: "Try the Lantern Door." })).toBeVisible();
  await page.getByRole("button", { name: "Try the Lantern Door." }).click();
  await expect(page.getByText("travel supplies wrapped in dry leaf-cloth")).toBeVisible();
  await page.getByRole("button", { name: "Back to the Lantern Door." }).click();
  await page.getByRole("button", { name: "Back to the threshold." }).click();
  await page.getByRole("button", { name: "Approach the Crown Door." }).click();
  await page.getByRole("button", { name: "Try the Crown Door." }).click();
  await expect(page.getByText("False Crown Passage")).toBeVisible();
  await expect(page.getByRole("button", { name: "Mark this as a dangerous branch." })).toBeVisible();
});

test("chapter two shelter nook supports multiple local actions in one visit", async ({ page }) => {
  await loadChapter2Checkpoint(
    page,
    {},
    { position: { x: 2, y: 1 }, expectedTile: "Roadside Shelter Nook" },
  );

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByRole("button", { name: "Take down the turn-back notice." })).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Search for Lio's mark." })).toBeVisible();

  await page.getByRole("button", { name: "Search for Lio's mark." }).click();
  await expect(page.getByText("Lio was here")).toBeVisible();
  await expect(page.getByRole("button", { name: "Rest briefly." })).toBeVisible();
});

test("chapter two clean no-handle solve prepares the Roadwatcher fight", async ({ page }) => {
  await loadChapter2Checkpoint(page, {
    shelterNoticeRemoved: true,
    falseNoticeLensUsed: true,
    lanternSignCleaned: true,
    understandsTrueSigns: true,
    lanternSignCompared: true,
    lioShelterMarkFound: true,
    lioHookMarkFound: true,
  });

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await page.getByRole("button", { name: "Approach the No-Handle Door." }).click();
  await expect(page.getByText("Something behind the Crown Door has noticed")).toBeVisible();
  await page.getByRole("button", { name: /Say: A road is safest/ }).click();
  await expect(page.getByText("This time the hollow is ready")).toBeVisible();
  await page.getByRole("button", { name: "Meet the watcher on honest ground." }).click();
  await expect(page.getByText("Battle • Briar Roadwatcher")).toBeVisible();
  await expect(page.getByText("Thorn-Collared Hound")).toBeVisible();
});

test("chapter two Roadwatcher slat opens the Crown Door den", async ({ page }) => {
  await loadChapter2Checkpoint(page, {
    roadwatcherDefeated: true,
    crownDoorKeyFound: true,
  });

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await page.getByRole("button", { name: "Approach the Crown Door." }).click();
  await expect(page.getByRole("button", { name: "Open the Crown Door with the split slat." })).toBeVisible();

  await page.getByRole("button", { name: "Open the Crown Door with the split slat." }).click();
  await expect(page.getByRole("heading", { name: "Crown Door Den" })).toBeVisible();
  await expect(page.getByText("You are standing on: Crown Vestibule.")).toBeVisible();
  await expect(page.getByTestId("map-background")).toBeVisible();
});

test("chapter two no-handle door waits for the Crown Door den to be cleared", async ({ page }) => {
  await loadChapter2Checkpoint(page, {
    shelterNoticeRemoved: true,
    falseNoticeLensUsed: true,
    lanternSignCleaned: true,
    understandsTrueSigns: true,
    lanternSignCompared: true,
    lioShelterMarkFound: true,
    lioHookMarkFound: true,
    roadwatcherDefeated: true,
    crownDoorKeyFound: true,
  });

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await page.getByRole("button", { name: "Approach the No-Handle Door." }).click();
  await page.getByRole("button", { name: /Say: A road is safest/ }).click();
  await expect(page.getByText("The Door Listens Behind You")).toBeVisible();
  await expect(page.getByText("The watcher had a key for a reason")).toBeVisible();
});

test("chapter two clearing the Crown Door den lets the no-handle door open", async ({ page }) => {
  await loadChapter2Checkpoint(page, {
    shelterNoticeRemoved: true,
    falseNoticeLensUsed: true,
    lanternSignCleaned: true,
    understandsTrueSigns: true,
    lanternSignCompared: true,
    lioShelterMarkFound: true,
    lioHookMarkFound: true,
    roadwatcherDefeated: true,
    crownDoorKeyFound: true,
    crownDoorDungeonCleared: true,
    cleanedLanternMarkFound: true,
  });

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await page.getByRole("button", { name: "Approach the No-Handle Door." }).click();
  await expect(page.getByText("The inscription feels warmer now.")).toBeVisible();
  await page.getByRole("button", { name: /Say: A road is safest/ }).click();
  await expect(page.getByText("The No-Handle Door Opens", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Step to the First Westroot Gate." }).click();
  await expect(page.getByText("First Westroot Gate")).toBeVisible();
  await page.getByRole("button", { name: "Step through the gate." }).click();
  await expect(
    page.getByText("Chapter 2 Complete: The Westroot Trail", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("He hoped someone would. That is different.")).toBeVisible();
  await expect(page.getByText("Not a threat. Not a welcome. A question.")).toBeVisible();
  await expect(page.getByText("Lio came this way.")).toBeVisible();
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute(
    "src",
    /westroot-threshold-opening-v01/,
  );
});

test("chapter two false map room clears the Crown Door den", async ({ page }) => {
  const payload = buildChapter2Checkpoint(
    {
      roadwatcherDefeated: true,
      crownDoorKeyFound: true,
      crownDoorDungeonEntered: true,
      crownDoorWaxTableCleared: true,
      crownDoorSlatsBroken: true,
      crownDoorWitnessLedgerFound: true,
      crownDoorCollarsBroken: true,
      beatCrownDenGuard: true,
    },
    { x: 6, y: 4 },
  );
  payload.region = "crownDoorDen";
  payload.position = { x: 3, y: 3 };
  payload.visited = {
    ...payload.visited,
    crownDoorDen: buildVisitedMap("crownDoorDen", 3, 3, 2),
  };

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: payload },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await expect(page.getByRole("heading", { name: "Crown Door Den" })).toBeVisible();
  await expect(page.getByText("You are standing on: False Map Room.")).toBeVisible();

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByText("it looks like a confession")).toBeVisible();
  await page.getByRole("button", { name: "Pull the false road off the map." }).click();
  await expect(page.getByText("The false route tears loose")).toBeVisible();
  await expect(page.getByRole("button", { name: "Return to the Three-Door Threshold." })).toBeVisible();
});

test("chapter two messy no-handle solve triggers hard Roadwatcher pressure", async ({ page }) => {
  await loadChapter2Checkpoint(page, {
    shelterNoticeRemoved: true,
    falseNoticeLensUsed: true,
    lanternSignCleaned: true,
    understandsTrueSigns: true,
    lanternSignCompared: true,
    lioShelterMarkFound: true,
    lioHookMarkFound: true,
    followedFalseDetour: true,
    crownSignRejected: true,
  });

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await page.getByRole("button", { name: "Approach the No-Handle Door." }).click();
  await expect(page.getByText("LET THE ROAD BEHIND YOU SPEAK")).toBeVisible();
  await expect(page.getByText("I DO NOT ANSWER HANDS")).toBeVisible();
  await page.getByRole("button", { name: /Say: A road is safest/ }).click();
  await expect(page.getByText("Briar Roadwatcher Ambush")).toBeVisible();
  await page.getByRole("button", { name: "Protect Mara and hold the hollow." }).click();
  await expect(page.getByText("Battle • Briar Roadwatcher")).toBeVisible();
  await expect(page.getByText("Thorn-Collared Hound")).toBeVisible();
  await expect(page.getByText("False Sign Scratcher")).toBeVisible();
});

test("chapter two roadwatcher back away returns to the previous trail node", async ({ page }) => {
  await loadChapter2Checkpoint(
    page,
    {},
    { position: { x: 8, y: 2 }, expectedTile: "Road" },
  );

  await page.getByTestId("move-up").click();
  await expect(page.getByText("Briar Roadwatcher", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Back away." }).click();
  await expect(page.getByText("You are standing on: Road.")).toBeVisible();
});
