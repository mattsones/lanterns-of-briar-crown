import { expect, test } from "@playwright/test";
import { MAPS } from "../src/data/maps";
import { buildVisitedMap } from "../src/game/map";
import {
  buildDefaultCompanion,
  buildDefaultFlags,
  buildPlayer,
} from "../src/game/state";
import { STORAGE_KEY } from "../src/game/save";

function buildChapter2Checkpoint(flagOverrides = {}) {
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
    position: { x: 6, y: 3 },
    visited: {
      westrootTrail: buildVisitedMap("westrootTrail", 6, 3, 9),
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

async function loadChapter2Checkpoint(page, flagOverrides = {}) {
  const payload = buildChapter2Checkpoint(flagOverrides);
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: payload },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await expect(page.getByRole("heading", { name: MAPS.westrootTrail.name })).toBeVisible();
  await expect(page.getByText("You are standing on: No-Handle Stone.")).toBeVisible();
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

test("chapter two clean no-handle solve opens the Westroot gate", async ({ page }) => {
  await loadChapter2Checkpoint(page, {
    lanternSignCleaned: true,
  });

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByText("Supporting truths found: 2 of 2 needed.")).toBeVisible();
  await page.getByRole("button", { name: /Say: A road is safest/ }).click();
  await expect(page.getByText("opens cleanly").first()).toBeVisible();

  await page.getByRole("button", { name: "Move to First Westroot Gate" }).click();
  await expect(page.getByText("First Westroot Gate", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Search the threshold first." }).click();
  await expect(page.getByText("No-Handle Token").first()).toBeVisible();
  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await page.getByRole("button", { name: "Step through the gate." }).click();
  await expect(page.getByText("Chapter 2 Complete: The Westroot Trail")).toBeVisible();
});

test("chapter two messy no-handle solve triggers hard Roadwatcher pressure", async ({ page }) => {
  await loadChapter2Checkpoint(page, {
    followedFalseDetour: true,
    crownSignRejected: true,
  });

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByText("Supporting truths found: 2 of 2 needed.")).toBeVisible();
  await page.getByRole("button", { name: /Say: A road is safest/ }).click();
  await expect(page.getByText("Briar Roadwatcher Ambush")).toBeVisible();
  await page.getByRole("button", { name: "Protect Mara and hold the hollow." }).click();
  await expect(page.getByText("Battle • Briar Roadwatcher")).toBeVisible();
  await expect(page.getByText("Thorn-Collared Hound")).toBeVisible();
  await expect(page.getByText("False Sign Scratcher")).toBeVisible();
});
