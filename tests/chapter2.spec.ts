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
  await expect(page.getByRole("button", { name: `Inspect ${expectedTile}`, exact: true })).toBeVisible();
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
  await expect(page.getByRole("button", { name: "Inspect Road", exact: true })).toBeVisible();
}

test("Mossgirl's completed Three-Door save can open the No-Handle Door", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/");
  await page.getByRole("button", { name: "Load Save Slot" }).click();
  await page.locator('input[type="file"]').setInputFiles("public/saves/mossgirl-westroot-trail 3Doors.json");

  await expect(page.getByRole("heading", { name: MAPS.westrootTrail.name })).toBeVisible();

  await page.getByRole("button", { name: "Move up" }).click();
  await page.getByRole("button", { name: "Approach the No-Handle Door." }).click();
  await expect(page.getByText("The door is ready—speak the old road phrase.")).toBeVisible();
  const openDoor = page.getByRole("button", { name: /Say: A road is safest.*open the door/ });
  await expect(openDoor).toContainText("The road is clear. Speaking the phrase will open the door.");
  await expect(openDoor).toHaveClass(/border-emerald-300/);
  await openDoor.click();
  await expect(page.getByRole("dialog", { name: "The No-Handle Door Opens" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Step to the First Westroot Gate." })).toBeVisible();
});

test("visible Westroot and Crown Den encounters use enemy markers instead of clue markers", async ({ page, context }) => {
  await loadChapter2Checkpoint(
    page,
    {},
    { position: { x: 8, y: 2 }, expectedTile: "Road" },
  );

  await expect(page.locator('.map-token[title="Watched Road"] .map-token-enemy')).toHaveAttribute(
    "src",
    /briar-roadwatcher/,
  );
  await expect(page.locator('.map-token[title="False Detour Notice"]')).toHaveCount(0);

  const payload = buildChapter2Checkpoint(
    {
      roadwatcherDefeated: true,
      crownDoorKeyFound: true,
      crownDoorDungeonEntered: true,
    },
    { x: 6, y: 4 },
  );
  payload.region = "crownDoorDen";
  payload.position = { x: 1, y: 1 };
  payload.visited = {
    ...payload.visited,
    crownDoorDen: buildVisitedMap("crownDoorDen", 1, 1, 9),
  };
  const denPage = await context.newPage();
  await denPage.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: payload },
  );
  await denPage.goto("/");
  await denPage.getByRole("button", { name: "Continue Checkpoint" }).click();

  await expect(denPage.locator('.map-token[title="Collar Kennel"] .map-token-enemy')).toHaveAttribute(
    "src",
    /thorn-collared-hound/,
  );
  await expect(denPage.locator('.map-token[title="False Sign Guard"] .map-token-enemy')).toHaveAttribute(
    "src",
    /false-sign-scratcher/,
  );
  for (const title of ["Wax Table", "Slat Rack", "Witness Ledger Nook", "False Map Room"]) {
    await expect(denPage.locator(`.map-token[title="${title}"]`)).toHaveCount(0);
  }
  await denPage.close();
});

test("title screen loads the checked-in Chapter 2 playtest save", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/");
  await page.getByRole("button", { name: "Begin Chapter 2 Playtest" }).click();

  await expect(page.getByRole("heading", { name: MAPS.bramblecross.name })).toBeVisible();
  await expect(page.getByText("Goal: Return to the Watchhouse")).toBeVisible();
  await expect(page.getByRole("button", { name: "Inspect Road", exact: true })).toBeVisible();
  await expect(page.getByText("Chapter 2: The Westroot Trail")).toBeVisible();
});

test("title screen loads the checked-in Chapter 3 ready save", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/");
  await page.getByRole("button", { name: "Begin Chapter 3 Playtest" }).click();

  await expect(page.getByRole("heading", { name: MAPS.westrootHub.name })).toBeVisible();
  await expect(page.getByRole("button", { name: "Inspect First Westroot Gate", exact: true })).toBeVisible();
  await expect(page.getByText("Chapter 3: The Hidden Root", { exact: true })).toBeVisible();
  await expect(page.getByText("Goal: Enter Westroot")).toBeVisible();
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
  await expect(page.getByRole("button", { name: "Inspect Three-Door Threshold", exact: true })).toBeVisible();

  const stored = await page.evaluate((key) => {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }, STORAGE_KEY);
  expect(stored.position).toEqual({ x: 6, y: 4 });
  expect(stored.visited.westrootTrail["6,4"]).toBe(true);
});

test("chapter two briefing withholds Edden's drawing until he gives it to the player", async ({ page }) => {
  await loadChapter2BriefingCheckpoint(page);

  await page.keyboard.press("ArrowUp");
  await page.getByRole("button", { name: "Enter" }).click();
  await page.getByRole("button", { name: "Review the Westroot briefing" }).click();
  const briefing = page.getByRole("dialog", { name: "Bramblecross Watchhouse" });
  await expect(briefing.getByRole("button", { name: "Review Edden's drawing." })).toHaveCount(0);
  await expect(briefing.getByRole("button", { name: "What did Edden draw?" })).toHaveCount(0);
  await expect(briefing.getByTestId("dialogue-scene-image")).toHaveCount(0);

  await briefing.getByRole("button", { name: "Visit Edden's recovery room." }).click();
  await expect(page.getByText("Edden's Recovery Room", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Take Edden's three-door drawing." })).toBeVisible();
  await page.getByRole("button", { name: "Take Edden's three-door drawing." }).click();
  await page.getByRole("button", { name: "Review the Westroot briefing" }).click();
  await page.getByRole("button", { name: "Review Edden's drawing." }).click();
  await expect(page.getByText("Edden's Drawing")).toBeVisible();
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute(
    "src",
    /eddens-three-door-drawing-scene-v01/,
  );
  await expect(page.getByText("THE HONEST ONE HAS NO HANDLE")).not.toBeVisible();
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
  await expect(page.getByRole("button", { name: "Inspect Ada Willowmarket", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Ada Willowmarket", exact: true })).toBeVisible();
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
  await expect(page.getByRole("button", { name: "Inspect Ada Willowmarket", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByText("Ada's Seal Lesson", { exact: true })).toBeVisible();
  await expect(page.getByAltText("Portrait of Ada Willowmarket")).toBeVisible();
  await expect(page.getByAltText("Portrait of Ada Willowmarket without the Willowmark Lens")).toHaveCount(0);

  await page.getByRole("button", { name: "Borrow the Willowmark Lens." }).click();
  await expect(page.getByRole("dialog", { name: "Ada Willowmarket", exact: true })).toBeVisible();
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
  await expect(page.getByRole("button", { name: "Inspect False Detour Notice", exact: true })).toBeVisible();

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
  await expect(page.getByText("TURN BACK EAST TOWARD BRAMBLECROSS")).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue west, following Lio." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Approach the Crown Door." })).not.toBeVisible();

  await page.getByRole("button", { name: "Continue west, following Lio." }).click();
  await expect(page.getByRole("button", { name: "Continue west, following Lio." })).not.toBeVisible();
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
  await expect(page.getByText("The Crown Door Holds")).toBeVisible();
  await expect(page.getByText(/It does not open/)).toBeVisible();
  await expect(page.getByText("False Crown Passage")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Mark this as a dangerous branch." })).toHaveCount(0);
});

test("trusting the false Crown Sign reaches a sealed door without revealing the den", async ({ page }) => {
  await loadChapter2Checkpoint(page);

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await page.getByRole("button", { name: "Approach the Crown Door." }).click();
  await page.getByRole("button", { name: "Inspect the Crown Sign." }).click();
  await page.getByRole("button", { name: "Test the false direction anyway." }).click();

  await expect(page.getByRole("dialog", { name: "The Crown Door Holds" })).toBeVisible();
  await expect(page.getByText(/The order brought you to a sealed wall and cost you time/)).toBeVisible();
  await expect(page.getByText("False Crown Passage")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Return to the Crown Door." })).toBeVisible();
  await page.getByRole("button", { name: "Return to the Crown Door." }).click();
  await expect(page.getByRole("button", { name: "Try the Crown Door." })).toHaveCount(0);
});

test("the threshold groups short actions on wide screens and stacks them on phones", async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });
  await loadChapter2Checkpoint(page);

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  const threshold = page.getByRole("dialog", { name: "Three-Door Threshold" });
  const sceneImage = threshold.getByTestId("dialogue-scene-image");
  const copy = threshold.getByTestId("dialogue-copy");
  await expect(threshold.getByText(/The trail pinches between roots and old stone/)).toBeInViewport();

  const desktopImageBox = await sceneImage.boundingBox();
  const desktopCopyBox = await copy.boundingBox();
  expect(desktopImageBox).not.toBeNull();
  expect(desktopCopyBox).not.toBeNull();
  expect(Math.abs(desktopImageBox.y - desktopCopyBox.y)).toBeLessThan(12);

  const doorGroup = page.getByTestId("dialogue-choice-group-doors");
  const doorButtons = doorGroup.getByRole("button");
  await expect(doorButtons).toHaveCount(3);

  const desktopBoxes = await doorButtons.evaluateAll((buttons) =>
    buttons.map((button) => {
      const box = button.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width };
    }),
  );
  expect(Math.abs(desktopBoxes[0].y - desktopBoxes[1].y)).toBeLessThan(2);
  expect(Math.abs(desktopBoxes[1].y - desktopBoxes[2].y)).toBeLessThan(2);
  expect(desktopBoxes[0].x).toBeLessThan(desktopBoxes[1].x);
  expect(desktopBoxes[1].x).toBeLessThan(desktopBoxes[2].x);

  await page.setViewportSize({ width: 430, height: 932 });
  await expect(threshold.getByText(/The trail pinches between roots and old stone/)).toBeInViewport();
  const phoneImageBox = await sceneImage.boundingBox();
  const phoneCopyBox = await copy.boundingBox();
  expect(phoneImageBox).not.toBeNull();
  expect(phoneCopyBox).not.toBeNull();
  expect(phoneCopyBox.y).toBeLessThan(phoneImageBox.y);

  const phoneBoxes = await doorButtons.evaluateAll((buttons) =>
    buttons.map((button) => {
      const box = button.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width };
    }),
  );
  expect(phoneBoxes[0].y).toBeLessThan(phoneBoxes[1].y);
  expect(phoneBoxes[1].y).toBeLessThan(phoneBoxes[2].y);
  expect(Math.abs(phoneBoxes[0].x - phoneBoxes[1].x)).toBeLessThan(2);
});

test("cleaning the Lantern Sign awards XP once and becomes a review", async ({ page }) => {
  await loadChapter2Checkpoint(page, { noHandleStoneInspected: true });

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await page.getByRole("button", { name: "Approach the Lantern Door." }).click();
  await page.getByRole("button", { name: "Inspect the Lantern Sign." }).click();
  await page.getByRole("button", { name: "Clean the Lantern Sign fully." }).click();

  await expect(page.getByRole("button", { name: "Clean the Lantern Sign fully." })).toHaveCount(0);
  await expect(page.getByText("4/32", { exact: true }).first()).toBeAttached();
  await page.getByRole("button", { name: "Back to the Lantern Door." }).click();

  await expect(page.getByRole("button", { name: "Inspect the Lantern Sign." })).toHaveCount(0);
  await page.getByRole("button", { name: "Review the Lantern Sign." }).click();
  await expect(page.getByRole("button", { name: "Clean the Lantern Sign fully." })).toHaveCount(0);
  await expect(page.getByText("4/32", { exact: true }).first()).toBeAttached();
});

test("door closeups keep their text visible and compact related actions", async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });
  await loadChapter2Checkpoint(page);

  await page.getByRole("button", { name: "Inspect", exact: true }).click();

  const doorChecks = [
    {
      button: "Approach the Crown Door.",
      name: "Crown Door",
      visual: "dialogue-visual-crownDoor",
      copy: /The Crown Door is tall, straight/,
    },
    {
      button: "Approach the Lantern Door.",
      name: "Lantern Door",
      visual: "dialogue-visual-lanternDoor",
      copy: /The Lantern Door is squat and weathered/,
    },
    {
      button: "Approach the No-Handle Door.",
      name: "No-Handle Door",
      visual: "dialogue-visual-noHandleDoor",
      copy: /The stone door has no handle/,
    },
  ];

  for (const check of doorChecks) {
    await page.getByRole("button", { name: check.button }).click();
    const door = page.getByRole("dialog", { name: check.name });
    const visual = door.getByTestId(check.visual);
    const copy = door.getByTestId("dialogue-copy");
    await expect(visual).toBeInViewport();
    await expect(door.getByText(check.copy)).toBeInViewport();
    await expect(door.getByText(check.name, { exact: true })).toHaveCount(1);

    const visualBox = await visual.boundingBox();
    const copyBox = await copy.boundingBox();
    expect(visualBox).not.toBeNull();
    expect(copyBox).not.toBeNull();
    expect(Math.abs(visualBox.y - copyBox.y)).toBeLessThan(12);

    if (check.name === "No-Handle Door") break;
    await door.getByRole("button", { name: "Back to the threshold." }).click();
  }

  const noHandleDoor = page.getByRole("dialog", { name: "No-Handle Door" });
  await expect(noHandleDoor.getByTestId("dialogue-choice-group-investigate").getByRole("button")).toHaveCount(2);
  await expect(noHandleDoor.getByTestId("dialogue-choice-group-door-actions").getByRole("button")).toHaveCount(2);

  await page.setViewportSize({ width: 430, height: 932 });
  await expect(noHandleDoor.getByText(/The stone door has no handle/)).toBeInViewport();
});

test("stepping back from the threshold returns to the previous trail node", async ({ page }) => {
  await loadChapter2Checkpoint(
    page,
    {},
    { position: { x: 6, y: 6 }, expectedTile: "Road" },
  );

  await page.getByRole("button", { name: "Move up" }).click();
  await expect(page.getByRole("dialog", { name: "Three-Door Threshold" })).toBeVisible();
  await page.getByRole("button", { name: "Step back." }).click();

  await expect(page.getByRole("button", { name: "Inspect Road", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Inspect Three-Door Threshold", exact: true })).toHaveCount(0);
});

test("companion door reads return to the door that launched them", async ({ page }) => {
  const payload = buildChapter2Checkpoint();
  payload.companion = {
    ...buildDefaultCompanion(),
    recruited: true,
    id: "rowan",
    name: "Rowan Reedshield",
    hp: 18,
    maxHp: 18,
    style: "guardian",
    role: "Guardian",
  };
  payload.flags.companionChosen = true;
  payload.flags.companionChoice = "rowan";

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: payload },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await page.getByRole("button", { name: "Inspect", exact: true }).click();

  const checks = [
    {
      approach: "Approach the Crown Door.",
      name: "Crown Door",
      ask: "Ask your companion about this door.",
      back: "Back to the Crown Door.",
    },
    {
      approach: "Approach the Lantern Door.",
      name: "Lantern Door",
      ask: "Ask your companion about this door.",
      back: "Back to the Lantern Door.",
    },
    {
      approach: "Approach the No-Handle Door.",
      name: "No-Handle Door",
      ask: "Ask your companion about this door.",
      back: "Back to the No-Handle Door.",
    },
  ];

  for (const check of checks) {
    await page.getByRole("button", { name: check.approach }).click();
    await page.getByRole("button", { name: check.ask }).click();
    await page.getByRole("button", { name: check.back }).click();

    const door = page.getByRole("dialog", { name: check.name });
    await expect(door).toBeVisible();
    await expect(door.getByRole("button", { name: check.ask })).toHaveCount(0);
    if (check.name !== "No-Handle Door")
      await door.getByRole("button", { name: "Back to the threshold." }).click();
  }
});

test("a downed companion cannot read the Chapter 2 threshold or doors", async ({ page }) => {
  const payload = buildChapter2Checkpoint();
  payload.companion = {
    ...buildDefaultCompanion(),
    recruited: true,
    id: "rowan",
    name: "Rowan Reedshield",
    hp: 0,
    maxHp: 18,
    style: "guardian",
    role: "Guardian",
  };
  payload.flags.companionChosen = true;
  payload.flags.companionChoice = "rowan";

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: payload },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await page.getByRole("button", { name: "Inspect", exact: true }).click();

  await expect(
    page.getByRole("button", { name: "Ask your companion for their read." }),
  ).toHaveCount(0);

  for (const door of ["Crown", "Lantern", "No-Handle"]) {
    await page.getByRole("button", { name: `Approach the ${door} Door.` }).click();
    await expect(
      page.getByRole("button", { name: "Ask your companion about this door." }),
    ).toHaveCount(0);
    await page.getByRole("button", { name: "Back to the threshold." }).click();
  }
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
  await expect(page.getByRole("button", { name: "Inspect Crown Vestibule", exact: true })).toBeVisible();
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
  await expect(page.getByText("The door is ready—speak the old road phrase.")).toBeVisible();
  const openDoor = page.getByRole("button", { name: /Say: A road is safest.*open the door/ });
  await expect(openDoor).toContainText("The road is clear. Speaking the phrase will open the door.");
  await expect(openDoor).toHaveClass(/border-emerald-300/);
  await openDoor.click();
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
    /westroot-threshold-opening-v02/,
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
  await expect(page.getByRole("button", { name: "Inspect False Map Room", exact: true })).toBeVisible();

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
  await expect(page.getByRole("button", { name: "Inspect Road", exact: true })).toBeVisible();
});

test("the return trip can copy the Westward Cut after it was studied outbound", async ({ page }) => {
  await loadChapter2Checkpoint(
    page,
    {
      noHandleStoneInspected: true,
      westrootCutStudied: true,
      westrootCutCopied: false,
    },
    { position: { x: 1, y: 3 }, expectedTile: "Old Westward Cut" },
  );

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByRole("button", { name: "Copy the old route mark." })).toBeVisible();
  await page.getByRole("button", { name: "Copy the old route mark." }).click();
  await expect(page.getByText("You copy the old route mark. XP +4")).toBeVisible();
});

test("early No-Handle questions remain resolvable after their matching clues are found", async ({ page }) => {
  await loadChapter2Checkpoint(page, {
    noHandleStoneInspected: true,
    noHandleDoorStudied: true,
    maraAskedNoHandleMark: true,
    lioShelterMarkFound: true,
    lioHookMarkFound: false,
    eddenDrawingComparedAtDoor: true,
    lanternSignCleaned: true,
    eddensDrawingValidated: false,
  });

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await page.getByRole("button", { name: "Approach the No-Handle Door." }).click();
  await expect(page.getByRole("button", { name: "Ask Mara to compare the shelter mark." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Compare Edden's drawing with the cleaned sign." })).toBeVisible();

  await page.getByRole("button", { name: "Ask Mara to compare the shelter mark." }).click();
  await expect(page.getByText(/Mara matches the tiny hook-tail/i)).toBeVisible();
  await expect(page.getByRole("button", { name: "Ask Mara to compare the shelter mark." })).toHaveCount(0);

  await page.getByRole("button", { name: "Compare Edden's drawing with the cleaned sign." }).click();
  await expect(page.getByText(/drawing/i)).toBeVisible();
  await expect(page.getByRole("button", { name: "Compare Edden's drawing with the cleaned sign." })).toHaveCount(0);
});

test("spent Crown and Lantern Door opinions are not offered again", async ({ page }) => {
  const companion = {
    ...buildDefaultCompanion(),
    recruited: true,
    id: "rowan",
    name: "Rowan Reedshield",
    hp: 18,
    maxHp: 18,
    style: "guardian",
    role: "Guardian",
  };
  const payload = buildChapter2Checkpoint({
    maraQuestionedCrownDoor: true,
    companionReadCrownDoor: true,
    maraQuestionedLanternDoor: true,
    companionReadLanternDoor: true,
    lanternDoorTried: true,
  });
  payload.companion = companion;
  payload.flags.companionChosen = true;
  payload.flags.companionChoice = "rowan";

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: payload },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await page.getByRole("button", { name: "Inspect", exact: true }).click();

  await page.getByRole("button", { name: "Approach the Crown Door." }).click();
  let door = page.getByRole("dialog", { name: "Crown Door" });
  await expect(door.getByRole("button", { name: /Ask Mara/ })).toHaveCount(0);
  await expect(door.getByRole("button", { name: /Ask your companion/ })).toHaveCount(0);
  await door.getByRole("button", { name: "Back to the threshold." }).click();

  await page.getByRole("button", { name: "Approach the Lantern Door." }).click();
  door = page.getByRole("dialog", { name: "Lantern Door" });
  await expect(door.getByRole("button", { name: /Ask Mara/ })).toHaveCount(0);
  await expect(door.getByRole("button", { name: /Ask your companion/ })).toHaveCount(0);
  await expect(door.getByRole("button", { name: /Try the Lantern Door/ })).toHaveCount(0);
});
