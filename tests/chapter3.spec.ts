import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { MAPS } from "../src/data/maps";
import { getMapVisualConfig } from "../src/data/mapVisuals";
import { buildVisitedMap } from "../src/game/map";
import { STORAGE_KEY } from "../src/game/save";
import { buildDefaultCompanion, buildDefaultFlags, buildPlayer } from "../src/game/state";

async function move(page, direction, count = 1) {
  for (let step = 0; step < count; step += 1) {
    await page.getByTestId(`move-${direction}`).click();
  }
}

async function navigateWestroot(page, start, target, { holdOpen = false } = {}) {
  const links = getMapVisualConfig("westrootHub").navigationLinks || {};
  const startKey = `${start.x},${start.y}`;
  const targetKey = `${target.x},${target.y}`;
  const queue = [{ key: startKey, route: [] }];
  const seen = new Set([startKey]);

  while (queue.length) {
    const current = queue.shift();
    if (current.key === targetKey) {
      for (const [index, direction] of current.route.entries()) {
        await move(page, direction);
        const leaveRootmarket = page.getByRole("button", { name: "Leave Rootmarket.", exact: true });
        if (index < current.route.length - 1 && await leaveRootmarket.count()) {
          await leaveRootmarket.click();
        }
      }
      return;
    }
    for (const [direction, destination] of Object.entries(links[current.key] || {})) {
      if (!destination || seen.has(destination)) continue;
      if (
        !holdOpen &&
        (
          (current.key === "5,0" && destination === "6,0") ||
          (current.key === "6,0" && destination === "5,0")
        )
      ) continue;
      seen.add(destination);
      queue.push({ key: destination, route: [...current.route, direction] });
    }
  }
  throw new Error(`No Westroot route from ${startKey} to ${targetKey}`);
}

test("the Witness Stone hold blocks its path until Split Hall removes it", async ({ page }) => {
  const payload = buildChapter3CargoCheckpoint();
  payload.position = { x: 5, y: 0 };
  payload.visited = {
    westrootHub: buildVisitedMap("westrootHub", 5, 0, 10),
  };
  payload.flags.splitHallDebateHeard = false;
  payload.flags.witnessStoneSequenceSolved = false;

  await page.goto("/");
  await page.evaluate(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: payload },
  );
  await page.reload();
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();

  const hero = page.getByTestId("hero-token");
  const heldPositionStyle = await hero.getAttribute("style");
  await page.getByTestId("move-up").click();
  await expect(page.getByText("Witness Stone Hold Notice", { exact: true })).toBeVisible();
  await expect(hero).toHaveAttribute("style", heldPositionStyle || "");
  await page.getByRole("button", { name: "Respect the hold and stay on this side." }).click();

  payload.flags.splitHallDebateHeard = true;
  await page.evaluate(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: payload },
  );
  await page.reload();
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await page.getByTestId("move-up").click();
  expect(await page.getByTestId("hero-token").getAttribute("style")).not.toBe(
    heldPositionStyle,
  );
  await expect(page.getByText("Witness Stone Hold Notice", { exact: true })).toHaveCount(0);
});

function buildChapter3CargoCheckpoint() {
  const player = buildPlayer({
    name: "Liam",
    gender: "Male",
    raceId: "human",
    humanHeritageId: "rainroot",
    appearanceId: "default",
  });
  player.level = 5;
  player.maxHp = 150;
  player.hp = 150;
  player.inventory = { ...player.inventory, old_hatchet: 1, healing_fizzpop: 5 };
  player.equipment.weapon = "old_hatchet";

  return {
    screen: "play",
    chapterId: 3,
    player,
    region: "westrootHub",
    position: { x: 7, y: 1 },
    visited: {
      westrootHub: buildVisitedMap("westrootHub", 7, 1, 10),
    },
    companion: buildDefaultCompanion(),
    guestNpc: null,
    flags: {
      ...buildDefaultFlags(),
      chapterOneClear: true,
      chapterReported: true,
      chapterTwoStarted: true,
      chapterTwoClear: true,
      westrootGateOpened: true,
      lioAlivePastGate: true,
      eddensDrawingValidated: true,
      briarCrownWatchingWestroot: true,
      crownDoorDungeonCleared: true,
      chapterThreeStarted: true,
      metBramwell: true,
      metQuill: true,
      metNoma: true,
      nomaIntroducedWitnessStones: true,
      westrootHoldBellRung: true,
      splitHallDebateHeard: true,
      witnessStoneSequenceSolved: true,
    },
    quest: { title: "Track the Missing Willow-Marked Crate", description: "Follow the wheel marks into the inner siding." },
    toast: "Loaded Chapter 3 Cargo Siding checkpoint.",
  };
}

test("illustrated dialogue keeps its opening copy visible across supported viewports", async ({ page }) => {
  const viewports = [
    { width: 1280, height: 720 },
    { width: 1366, height: 768 },
    { width: 430, height: 932 },
    { width: 390, height: 844 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
    await page.getByRole("button", { name: "Begin Chapter 3 Playtest" }).click();
    await move(page, "down");

    const dialog = page.getByRole("dialog");
    const openingCopy = page.getByText("The no-handle door closes behind you without a sound.");
    const image = page.getByTestId("dialogue-scene-image");
    await expect(dialog).toHaveAttribute("data-content-layout", "split");
    await expect(openingCopy).toBeInViewport();
    await expect(page.getByTestId("dialogue-choices")).toBeInViewport();

    const copyBox = await openingCopy.boundingBox();
    const imageBox = await image.boundingBox();
    expect(copyBox).not.toBeNull();
    expect(imageBox).not.toBeNull();
    if (viewport.width >= 768) expect(copyBox!.x).toBeGreaterThan(imageBox!.x);
    else expect(copyBox!.y).toBeLessThan(imageBox!.y);
  }
});

test("Chapter 3 real fixture runs uninterrupted through the witnessed Westroot ending", async ({ page }) => {
  test.setTimeout(120_000);
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/");
  await page.getByRole("button", { name: "Begin Chapter 3 Playtest" }).click();

  await expect(page.getByRole("heading", { name: MAPS.westrootHub.name })).toBeVisible();
  await expect(page.getByText("Goal: Enter Westroot")).toBeVisible();
  await expect(page.getByRole("button", { name: "Inspect First Westroot Gate", exact: true })).toBeVisible();
  await expect(page.locator(".map-fog-layer")).toHaveCount(0);
  await expect(page.getByTestId("map-npc-token-bramwell")).toHaveCount(1);
  await expect(page.getByTestId("map-npc-token-noma")).toHaveCount(1);
  await expect(page.getByTestId("map-npc-token-rootbread-child")).toHaveCount(0);
  await expect(page.locator(".map-token-enemy")).toHaveCount(0);

  // Movement cannot bypass Bramwell: the first attempted step opens his gate
  // conversation and leaves the party at the entrance.
  await move(page, "down");
  await expect(page.getByText("Who opened my gate?")).toBeVisible();
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute(
    "src",
    /westroot-arrival-scene-v01\.webp/,
  );
  await page.getByRole("button", { name: "The road opened when we told it the truth." }).click();
  await expect(page.getByText("I'm Liam. This is Mara Brindle and Rowan Reedshield.")).toBeVisible();
  await expect(page.getByText("Names are not permission")).toBeVisible();
  await page.getByRole("button", { name: "Listen before asking for more." }).click();
  await expect(page.getByRole("button", { name: "Inspect First Westroot Gate", exact: true })).toBeVisible();

  await navigateWestroot(page, { x: 1, y: 3 }, { x: 3, y: 3 });
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByText("Standing on Westroot Path")).toBeVisible();
  await navigateWestroot(page, { x: 3, y: 3 }, { x: 3, y: 6 });
  await expect(page.getByText("Rootmarket is trying to continue around the fact that the First Gate opened.")).toBeVisible();
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute(
    "src",
    /rootmarket-uneasy-arrival-scene-v01\.webp/,
  );
  await page.getByRole("button", { name: "Listen to the argument." }).click();
  await expect(page.getByText("They sound like neighbors deciding which fear gets to speak first.")).toBeVisible();
  await page.getByRole("button", { name: "Return to Rootmarket." }).click();
  await expect(page.getByRole("button", { name: "Listen to the argument." })).toHaveCount(0);
  await page.getByRole("button", { name: "Talk to the Stonekin repairing the shutter." }).click();
  await expect(page.getByTestId("dialogue-scene-image")).toHaveCount(0);
  await expect(page.getByText("Hold that,")).toBeVisible();
  await expect(page.getByText("Named hands are easier to ask for help.")).toBeVisible();
  await page.getByRole("button", { name: "What does that shutter do?" }).click();
  await page.getByRole("button", { name: "How did the old road keep its signals clear?" }).click();
  await expect(page.getByText("Witness Stones, past the Mossgarden.")).toBeVisible();
  await page.getByRole("button", { name: "Ask Quill about something else." }).click();
  await expect(page.getByRole("button", { name: "How did the old road keep its signals clear?" })).toHaveCount(0);
  await page.getByRole("button", { name: "What is the green wax in that ledger?" }).click();
  await expect(page.getByText("not Ada's lost spice crate, but something made to borrow its trust")).toBeVisible();
  await page.getByRole("button", { name: "Thank Quill and step back." }).click();
  await page.getByRole("button", { name: "Approach the Mossback baker." }).click();
  await expect(page.getByText("making all my soup nervous")).toBeVisible();
  await expect(page.getByText("Names first, questions after bread. Better.")).toBeVisible();
  await expect(page.getByRole("button", { name: /Rootbread Promise/ })).toHaveCount(0);
  await page.getByRole("button", { name: "Thank you. We are looking for Lio Brindle." }).click();
  await expect(page.getByText("The old Rootbread Promise")).toBeVisible();
  await page.getByRole("button", { name: "Ask Lume something else." }).click();
  await page.getByRole("button", { name: "You called it the Rootbread Promise. What does it ask of Westroot?" }).click();
  await page.getByRole("button", { name: "Look for the food left by the sealed hatch." }).click();
  await expect(page.getByTestId("map-npc-token-rootbread-child")).toHaveCount(1);

  await navigateWestroot(page, { x: 3, y: 6 }, { x: 7, y: 5 });
  await expect(page.getByText("That is Lio's knot")).toBeVisible();
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute(
    "src",
    /rootbread-promise-scene-v01\.webp/,
  );
  await expect(page.getByText("The old door rattled")).toBeVisible();
  await page.getByRole("button", { name: "When did you hear someone behind the hatch?" }).click();
  await page.getByRole("button", { name: "Ask the child something else." }).click();
  await page.getByRole("button", { name: "Leaving food without opening the hatch was careful." }).click();
  await page.getByRole("button", { name: "Tell the child whose blue knot Mara found." }).click();
  await expect(page.getByText("The Rootbread Promise is kept. XP +6").first()).toBeVisible();
  await page.getByRole("button", { name: "Thank the child and keep the promise." }).click();

  await navigateWestroot(page, { x: 7, y: 5 }, { x: 3, y: 0 });
  await expect(page.getByText("Do not step on the names")).toBeVisible();
  await expect(page.getByText("Names are not proof")).toBeVisible();
  await page.getByRole("button", { name: "We need to find the truth about a missing courier." }).click();
  await page.getByRole("button", { name: "Ask Noma something else." }).click();
  await page.getByRole("button", { name: "What are these names?" }).click();
  await expect(page.getByText("Lio would have hated that")).toHaveCount(0);
  await page.getByRole("button", { name: "Thank Noma and keep exploring." }).click();
  await expect(page.getByText("The village does not divide cleanly. It divides personally.")).toBeVisible();
  await page.getByRole("button", { name: "Who moved a crate under hold?" }).click();
  await expect(page.getByText("which signal my watch was duty-bound to follow")).toBeVisible();
  await page.getByRole("button", { name: "Go to Split Hall." }).click();

  await navigateWestroot(page, { x: 3, y: 0 }, { x: 5, y: 2 });
  await expect(page.getByText("Nobody has called the meeting. The Hold Bell did that.")).toBeVisible();
  await expect(page.getByText("Stonekin and Mossbacks sit on both sides.")).toBeVisible();
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute(
    "src",
    /split-hall-hold-debate-scene-v01\.webp/,
  );
  await page.getByRole("button", { name: "Who is still outside the sealed routes?" }).click();
  await expect(page.getByText("Six people maintain the outer cistern and the listening post.")).toBeVisible();
  await expect(page.getByText("Opening everything could tell the Crown where Lio went.")).toBeVisible();
  await page.getByRole("button", { name: "Ask the hall another question." }).click();
  await page.getByRole("button", { name: "How could the held cargo move?" }).click();
  await expect(page.getByText("The private hinge-mark was correct.")).toBeVisible();
  await expect(page.getByText("Opening everything could tell the Crown where Lio went.")).toHaveCount(0);
  await page.getByRole("button", { name: "Volunteer to track down the missing Willow crate." }).click();
  await expect(page.getByText("Then let us find the false Willow-marked crate before this hall decides who moved it")).toBeVisible();
  await expect(page.getByText("Missing from its assigned bay")).toBeVisible();
  await expect(page.getByText("Not proven gone from Westroot")).toBeVisible();
  await page.getByRole("button", { name: "Meet Bramwell and Noma at the Witness Stones." }).click();

  await navigateWestroot(page, { x: 5, y: 2 }, { x: 4, y: 1 }, { holdOpen: true });
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute(
    "src",
    /witness-stones-public-renewal-scene-v02\.webp/,
  );
  await expect(page.getByText("I ordered this closed when the Willow crate was placed under hold")).toBeVisible();
  await expect(page.getByText("The mistake was keeping the same answer after the danger changed")).toBeVisible();
  await expect(page.getByText("We open this together, with the danger named")).toBeVisible();
  await page.getByRole("button", { name: "Inspect the stone carvings." }).click();
  await expect(page.getByText("A hand pressed to stone beside a simple line")).toBeVisible();
  await expect(page.getByText("OBEY CROWN DETOUR")).toHaveCount(0);
  await page.getByRole("button", { name: "Return to the public renewal." }).click();

  await page.getByRole("button", { name: /^Begin with Warning/ }).click();

  await expect(page.getByText("warning the people who cannot hear this bell")).toBeVisible();
  await expect(page.getByText("The road holds because different hands keep them together")).toBeVisible();
  await expect(page.getByTestId("map-background")).toHaveAttribute(
    "src",
    /westroot-hub-map-v02-open-stones\.webp/,
  );
  await expect(page.getByText("Its wheel grooves run deeper into the siding")).toBeVisible();
  await expect(page.getByRole("button", { name: "Open the Cargo Siding and track the missing crate." })).toBeVisible();
  await page.getByRole("button", { name: "Open the Cargo Siding and track the missing crate." }).click();

  await navigateWestroot(page, { x: 4, y: 1 }, { x: 7, y: 1 }, { holdOpen: true });
  await expect(page.getByText("a chalk rectangle marks the empty bay")).toBeVisible();
  await page.getByRole("button", { name: "Check the rail marks and loading ledger." }).click();
  await expect(page.getByText("Fresh boot scuffs cross the ledger stand")).toBeVisible();
  await expect(page.getByText("If someone runs, Westroot will be ready.")).toBeVisible();
  await page.getByRole("button", { name: "Compare this clue with the whole crate record." }).click();
  await page.getByRole("button", { name: "Call out whoever is hiding behind the crates." }).click();
  await page.getByRole("button", { name: "Fight the Briar Cargo Runner and Seal-Forged Sentry." }).click();
  await expect(page.getByText("Checkpoint reached: Westroot").first()).toBeVisible();
  await expect(page.getByText("The party starts ready, with 4 guard.")).toHaveCount(1);
  await expect(page.getByText("Choose Liam's action and target.").first()).toBeVisible();

  const attack = page.getByRole("button", { name: /Pebbleknock Slam/ });
  for (let turn = 0; turn < 35; turn += 1) {
    const claim = page.getByRole("button", { name: "Claim Victory" });
    if (await claim.count()) {
      await claim.first().click();
      break;
    }
    if (await attack.isEnabled().catch(() => false)) await attack.click();
    await page.waitForTimeout(850);
  }

  await expect(page.getByText("Cargo Siding Cleared", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Tell Quill to shut the lantern shutter." })).toBeVisible();
  await page.getByRole("button", { name: "Tell Quill to shut the lantern shutter." }).click();
  await expect(page.getByText("The powder fails to catch.")).toBeVisible();
  await page.getByRole("button", { name: "Bring the evidence to Split Hall." }).click();

  await navigateWestroot(page, { x: 7, y: 1 }, { x: 5, y: 2 });
  await page.getByRole("button", { name: "Use the old road promises as rules for reopening." }).click();
  await expect(page.getByRole("dialog")).toHaveAttribute("data-content-layout", "stacked");
  await expect(page.getByText("Caution is not cowardice")).toBeVisible();
  await page.getByRole("button", { name: "Visit Noma in the Mossgarden." }).click();
  await expect(page.getByRole("dialog")).toHaveAttribute("data-content-layout", "stacked");
  await expect(page.getByText("Westroot's witnessed record:")).toBeVisible();
  await expect(page.getByText(/First promise: Warning/)).toBeVisible();
  await expect(page.getByText(/the prepared service passage held, and the runner was captured/)).toBeVisible();
  await expect(page.getByText(/Lio's blue courier knot was found/)).toBeVisible();
  await expect(page.getByText(/2 costs of Westroot's choice were named/)).toBeVisible();
  await page.getByRole("button", { name: "Finish Chapter 3 for now." }).click();
  await expect(page.getByText("Goal: Chapter 3 Complete — Playable Story Ends Here")).toBeVisible();
});

test("Split Hall simmers before the Hold Bell and does not repeat on walk-through", async ({ page }) => {
  const payload = buildChapter3CargoCheckpoint();
  payload.position = { x: 5, y: 2 };
  payload.visited = {
    westrootHub: buildVisitedMap("westrootHub", 5, 2, 10),
  };
  payload.flags.metNoma = false;
  payload.flags.nomaIntroducedWitnessStones = false;
  payload.flags.rootmarketVisited = true;
  payload.flags.metAuntieLume = true;
  payload.flags.westrootHoldBellRung = false;
  payload.flags.splitHallVisitedBeforeBell = false;
  payload.flags.splitHallDebateHeard = false;
  payload.flags.witnessStoneSequenceSolved = false;

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: payload },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await page.getByRole("button", { name: "Inspect", exact: true }).click();

  await expect(page.getByText("Split Hall is only half full")).toBeVisible();
  await expect(page.getByText("Nobody sits in formal sides yet.")).toBeVisible();
  await expect(page.getByTestId("dialogue-scene-image")).toHaveCount(0);
  await page.getByRole("button", { name: "Listen without taking a side." }).click();
  await expect(page.getByText("They were fighting about the gate before we became the gate problem.")).toBeVisible();
  await page.getByRole("button", { name: "Leave before this becomes a meeting." }).click();

  await move(page, "down");
  await move(page, "up");
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await navigateWestroot(page, { x: 5, y: 2 }, { x: 3, y: 0 });
  await expect(page.getByText("Do not step on the names")).toBeVisible();
  await page.getByRole("button", { name: "Why is everyone preparing for the gate to close?" }).click();
  await page.getByRole("button", { name: "Thank Noma and keep exploring." }).click();
  await page.getByRole("button", { name: "Count who will be left outside." }).click();
  await page.getByRole("button", { name: "Go to Split Hall." }).click();

  await navigateWestroot(page, { x: 3, y: 0 }, { x: 5, y: 2 });
  await expect(page.getByText("Split Hall is no longer half full.")).toBeVisible();
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute(
    "src",
    /split-hall-hold-debate-scene-v01\.webp/,
  );
});

test("focused Cargo Siding fixture preserves the unprepared escape branch", async ({ page }) => {
  test.setTimeout(90_000);
  const runtimeErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: buildChapter3CargoCheckpoint() },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await expect(page.getByRole("button", { name: "Inspect Cargo Siding", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute(
    "src",
    /cargo-siding-evidence-scene-v01\.webp/,
  );
  await expect(page.getByText("a chalk rectangle marks the empty bay")).toBeVisible();
  await expect(page.getByText("Not Ada's missing spice crate")).toBeVisible();
  await expect(page.getByText("Moved deeper while the door was made to look locked")).toBeVisible();
  await page.getByRole("button", { name: "Open the crate carefully." }).click();
  await expect(page.getByText("They made a person into cargo")).toBeVisible();
  await page.getByRole("button", { name: "Compare this clue with the whole crate record." }).click();
  await expect(page.getByText("opened from inside and outside")).toBeVisible();
  await page.getByRole("button", { name: "Call out whoever is hiding behind the crates." }).click();
  await expect(page.getByText("A hooded Briar Cargo Runner steps out")).toBeVisible();
  await expect(page.getByRole("button", { name: "Fight the Briar Cargo Runner and Seal-Forged Sentry." })).toBeVisible();
  await page.getByRole("button", { name: "Fight the Briar Cargo Runner and Seal-Forged Sentry." }).click();

  const attack = page.getByRole("button", { name: /Scrappy Chop/ });
  for (let turn = 0; turn < 35; turn += 1) {
    const claim = page.getByRole("button", { name: "Claim Victory" });
    if (await claim.count()) {
      await claim.first().click();
      break;
    }
    if (await attack.isEnabled().catch(() => false)) await attack.click();
    await page.waitForTimeout(850);
  }

  await expect(page.getByText("Cargo Siding Cleared", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Tell Quill to shut the lantern shutter." })).toHaveCount(0);
  await page.getByRole("button", { name: "Secure the evidence while the runner escapes." }).click();
  await expect(page.getByText("They ran west")).toBeVisible();
  await expect(page.getByText("Not a public road")).toBeVisible();
  await page.getByRole("button", { name: "Bring the evidence to Split Hall." }).click();

  await navigateWestroot(page, { x: 7, y: 1 }, { x: 5, y: 2 });
  await expect(page.getByText("They learned which parts of us were afraid")).toBeVisible();
  await page.getByRole("button", { name: "Use the old road promises as rules for reopening." }).click();
  await expect(page.getByText("Caution is not cowardice")).toBeVisible();
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute(
    "src",
    /split-hall-resolution-scene-v03\.webp/,
  );
  await page.getByRole("button", { name: "Visit Noma in the Mossgarden." }).click();
  await expect(page.getByText("BRINDLE PASSED. BREATHING. BOUND WEST.")).toBeVisible();
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute(
    "src",
    /mossgarden-closing-mark-scene-v01\.webp/,
  );
  await expect(page.getByText("Chapter 3 complete: The Hidden Root")).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});

test("a downed companion does not add commentary to the Witness Stone renewal", async ({ page }) => {
  const payload = buildChapter3CargoCheckpoint();
  payload.position = { x: 4, y: 1 };
  payload.visited = {
    westrootHub: buildVisitedMap("westrootHub", 4, 1, 10),
  };
  payload.flags.witnessStoneSequenceSolved = false;
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
  await page.getByRole("button", { name: /^Begin with Witness/ }).click();

  await expect(page.getByText("saying exactly what happened")).toBeVisible();
  await expect(page.getByText("A good order names the danger and the hand responsible.")).toHaveCount(0);
});

test("Noma keeps each informational question available until it has been asked", async ({ page }) => {
  const payload = buildChapter3CargoCheckpoint();
  payload.position = { x: 3, y: 0 };
  payload.visited = {
    westrootHub: buildVisitedMap("westrootHub", 3, 0, 3),
  };
  payload.flags.nomaAskedCourier = true;
  payload.flags.nomaAskedNames = false;
  payload.flags.nomaAskedGate = false;

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: payload },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await page.getByRole("button", { name: "Inspect", exact: true }).click();

  await expect(page.getByRole("button", { name: "What are these names?" })).toBeVisible();
  await expect(page.getByRole("button", { name: "We need to find the truth about a missing courier." })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Why is everyone preparing for the gate to close?" })).toBeVisible();

  await page.getByRole("button", { name: "What are these names?" }).click();
  await page.getByRole("button", { name: "Ask Noma something else." }).click();
  await expect(page.getByRole("button", { name: "What are these names?" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Why is everyone preparing for the gate to close?" })).toBeVisible();
});

test("the weathered stones do not reveal their rule before Noma explains it", async ({ page }) => {
  const stonesPayload = buildChapter3CargoCheckpoint();
  stonesPayload.position = { x: 4, y: 1 };
  stonesPayload.visited = {
    westrootHub: buildVisitedMap("westrootHub", 4, 1, 10),
  };
  stonesPayload.flags.metNoma = false;
  stonesPayload.flags.nomaIntroducedWitnessStones = false;
  stonesPayload.flags.westrootHoldBellRung = false;
  stonesPayload.flags.splitHallDebateHeard = false;
  stonesPayload.flags.witnessStoneSequenceSolved = false;

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: stonesPayload },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await expect(page.getByRole("button", { name: "Inspect Weathered Stones", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByText("A low oak-and-brass hold-shutter crosses the only approach")).toBeVisible();
  await expect(page.getByRole("button", { name: /^False Crown/ })).toHaveCount(0);
});

test("the sealed hatch does not reveal the Rootbread Promise before Lume does", async ({ page }) => {
  const hatchPayload = buildChapter3CargoCheckpoint();
  hatchPayload.position = { x: 7, y: 5 };
  hatchPayload.visited = {
    westrootHub: buildVisitedMap("westrootHub", 7, 5, 10),
  };
  hatchPayload.flags.metAuntieLume = false;
  hatchPayload.flags.lumeMentionedRootbread = false;
  hatchPayload.flags.rootbreadLeadLearned = false;
  hatchPayload.flags.rootbreadPromiseKept = false;
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: hatchPayload },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();
  await expect(page.getByRole("button", { name: "Inspect Sealed Hatch", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByText("you do not yet know who placed it here")).toBeVisible();
  await expect(page.getByText("The Rootbread Promise", { exact: true })).toHaveCount(0);
});

test("the user Chapter 3 save clearly identifies the endpoint and preserves its optional thread", async ({ page }) => {
  const importedSave = JSON.parse(
    readFileSync(resolve("public/saves/stuck ch 3.json"), "utf8"),
  );

  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: importedSave.payload },
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Checkpoint" }).click();

  await expect(page.getByText("Goal: Chapter 3 Complete — Playable Story Ends Here")).toBeVisible();
  await expect(
    page.getByText("The main Chapter 3 story is complete, and Chapter 4 is not playable yet."),
  ).toBeVisible();

  await navigateWestroot(page, { x: 4, y: 3 }, { x: 3, y: 6 });
  await expect(page.getByText("The Mossback baker in Rootmarket may still have heard something about Lio.").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Approach the Mossback baker." })).toBeVisible();
  await page.getByRole("button", { name: "Approach the Mossback baker." }).click();
  await expect(page.getByRole("button", { name: /Rootbread Promise/ })).toHaveCount(0);
  await page.getByRole("button", { name: "Thank you. We are looking for Lio Brindle." }).click();
  await page.getByRole("button", { name: "Look for the food left by the sealed hatch." }).click();

  await navigateWestroot(page, { x: 3, y: 6 }, { x: 3, y: 3 });
  await navigateWestroot(page, { x: 3, y: 3 }, { x: 3, y: 6 });
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
