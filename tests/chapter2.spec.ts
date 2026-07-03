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
    appearanceId: "brave",
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
    appearanceId: "brave",
  });

  return {
    screen: "play",
    chapterId: 2,
    player,
    region: "bramblecross",
    position: { x: 7, y: 4 },
    visited: {
      bramblecross: buildVisitedMap("bramblecross", 7, 4, 9),
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
  await expect(page.getByText("You are standing on: Watch Clerk Enna.")).toBeVisible();
}

test("chapter two briefing Edden drawing choice opens the recovery room", async ({ page }) => {
  await loadChapter2BriefingCheckpoint(page);

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await page.getByRole("button", { name: "What did Edden draw?" }).click();
  await expect(page.getByText("Edden's Drawing")).toBeVisible();

  await page.getByRole("button", { name: "I should talk to Edden." }).click();
  await expect(page.getByText("Edden's Recovery Room")).toBeVisible();
  await expect(page.getByRole("button", { name: "Take Edden's three-door drawing." })).toBeVisible();
});

test("chapter two no-handle door frames the repair puzzle before it opens", async ({ page }) => {
  await loadChapter2Checkpoint(page, {
    lioShelterMarkFound: true,
  });

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByText("Three-Door Threshold", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Inspect the no-handle door." }).click();
  await expect(page.getByText("LET THE ROAD BEHIND YOU SPEAK TRUE")).toBeVisible();
  await expect(page.getByText("The door is not only listening to you")).toBeVisible();
  await expect(page.getByRole("button", { name: "Ask Mara about the tiny scratch." })).toBeVisible();
  await expect(page.getByText("Break the false road orders.")).not.toBeVisible();

  await page.getByRole("button", { name: "Ask Mara about the tiny scratch." }).click();
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
  await expect(page.getByRole("button", { name: "Try the Crown Door." })).not.toBeVisible();

  await page.getByRole("button", { name: "Hurry after Lio." }).click();
  await expect(page.getByRole("button", { name: "Hurry after Lio." })).not.toBeVisible();
});

test("chapter two threshold supports trying each door", async ({ page }) => {
  await loadChapter2Checkpoint(page);

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByText("Three-Door Threshold", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Try the Crown Door." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Try the Lantern Door." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Inspect the no-handle door." })).toBeVisible();

  await page.getByRole("button", { name: "Try the Lantern Door." }).click();
  await expect(page.getByText("Lantern Door", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Try the Lantern Door." }).click();
  await expect(page.getByText("travel supplies wrapped in dry leaf-cloth")).toBeVisible();
  await page.getByRole("button", { name: "Back to the Lantern Door." }).click();
  await page.getByRole("button", { name: "Back to the threshold." }).click();
  await page.getByRole("button", { name: "Try the Crown Door." }).click();
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
  await page.getByRole("button", { name: "Inspect the no-handle door." }).click();
  await expect(page.getByText("The inscription feels warmer now.")).toBeVisible();
  await page.getByRole("button", { name: /Say: A road is safest/ }).click();
  await expect(page.getByText("This time the hollow is ready")).toBeVisible();
  await page.getByRole("button", { name: "Meet the watcher on honest ground." }).click();
  await expect(page.getByText("Battle • Briar Roadwatcher")).toBeVisible();
  await expect(page.getByText("Thorn-Collared Hound")).not.toBeVisible();
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
  await page.getByRole("button", { name: "Inspect the no-handle door." }).click();
  await expect(page.getByText("LET THE ROAD BEHIND YOU SPEAK TRUE")).toBeVisible();
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
