import { expect, test } from "@playwright/test";
import { MAPS } from "../src/data/maps";
import { buildVisitedMap } from "../src/game/map";
import { STORAGE_KEY } from "../src/game/save";
import { buildDefaultCompanion, buildDefaultFlags, buildPlayer } from "../src/game/state";

async function move(page, direction, count = 1) {
  for (let step = 0; step < count; step += 1) {
    await page.getByTestId(`move-${direction}`).click();
  }
}

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
      witnessStoneSequenceSolved: true,
    },
    quest: { title: "Follow the Willow Cargo", description: "Expose the false cargo route." },
    toast: "Loaded Chapter 3 Cargo Siding checkpoint.",
  };
}

test("Chapter 3 keeps the Rootbread Promise and Witness Stones fail-forward sequence", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/");
  await page.getByRole("button", { name: "Load Chapter 3 Ready Save" }).click();

  await expect(page.getByRole("heading", { name: MAPS.westrootHub.name })).toBeVisible();
  await expect(page.getByText("Goal: Enter Westroot")).toBeVisible();
  await expect(page.getByRole("button", { name: "Inspect First Westroot Gate", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByText("Who opened my gate?")).toBeVisible();
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute(
    "src",
    /westroot-arrival-scene-v01\.webp/,
  );
  await page.getByRole("button", { name: "The road opened when we told it the truth." }).click();
  await page.getByRole("button", { name: "Listen before asking for more." }).click();

  await move(page, "right", 2);
  await expect(page.getByText("Hold that,")).toBeVisible();
  await page.getByRole("button", { name: "What does that shutter do?" }).click();
  await page.getByRole("button", { name: "Listen to Quill's old-road rule." }).click();
  await page.getByRole("button", { name: "Speak with Auntie Lume." }).click();
  await expect(page.getByText("making all my soup nervous")).toBeVisible();
  await page.getByRole("button", { name: "What is the Rootbread Promise?" }).click();
  await page.getByRole("button", { name: "Follow the Rootbread Promise." }).click();

  await move(page, "right", 4);
  await move(page, "down", 2);
  await expect(page.getByText("That is Lio's knot")).toBeVisible();
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute(
    "src",
    /rootbread-promise-scene-v01\.webp/,
  );
  await expect(page.getByText("The old door rattled")).toBeVisible();
  await page.getByRole("button", { name: "You did the right thing." }).click();
  await page.getByRole("button", { name: "Keep Lio's knot safe." }).click();
  await expect(page.getByText("The Rootbread Promise is kept. XP +6").first()).toBeVisible();
  await page.getByRole("button", { name: "Thank the child and keep the promise." }).click();

  await move(page, "up", 2);
  await move(page, "left", 4);
  await move(page, "up", 3);
  await expect(page.getByText("Do not step on the names")).toBeVisible();
  await page.getByRole("button", { name: "We need to find the truth about a missing courier." }).click();
  await page.getByRole("button", { name: "Show me how the stones are meant to work." }).click();
  await expect(page.getByTestId("dialogue-scene-image")).toHaveAttribute(
    "src",
    /witness-stones-scene-v01\.webp/,
  );
  await page.getByRole("button", { name: "Inspect the stone carvings." }).click();
  await expect(page.getByText("No destination, danger, shelter, or reason is named.")).toBeVisible();
  await page.getByRole("button", { name: "Return to the sequence." }).click();

  await page.getByRole("button", { name: /^False Crown/ }).click();
  await expect(page.getByText("A mistake")).toBeVisible();
  await expect(page.getByText("Noma gives you a Witness Stone Rubbing.").first()).toBeVisible();
  await page.getByRole("button", { name: "Name the mistake and try again." }).click();
  await page.getByRole("button", { name: /^Witness/ }).click();
  await page.getByRole("button", { name: /^Warning/ }).click();
  await page.getByRole("button", { name: /^Shelter/ }).click();
  await page.getByRole("button", { name: /^Water/ }).click();

  await expect(page.getByText("A ROAD IS SAFEST WHEN TRUTH WALKS IT FIRST.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Follow the Willow cargo." })).toBeVisible();
});

test("Chapter 3 Cargo Siding resolves into Split Hall and the westward handoff", async ({ page }) => {
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
  await page.getByRole("button", { name: "Open the crate carefully." }).click();
  await expect(page.getByText("They made a person into cargo")).toBeVisible();
  await page.getByRole("button", { name: "Read the whole crate record." }).click();
  await expect(page.getByText("opened from inside and outside")).toBeVisible();
  await page.getByRole("button", { name: "Confront the cargo operation." }).click();
  await page.getByRole("button", { name: "Clear the Cargo Siding." }).click();

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
  await page.getByRole("button", { name: "Secure the evidence while the runner escapes." }).click();
  await expect(page.getByText("They ran west")).toBeVisible();
  await expect(page.getByText("Not a public road")).toBeVisible();
  await page.getByRole("button", { name: "Bring the evidence to Split Hall." }).click();

  await move(page, "down", 2);
  await move(page, "left", 2);
  await move(page, "up");
  await expect(page.getByText("They learned which parts of us were afraid")).toBeVisible();
  await page.getByRole("button", { name: "The Witness Stones already gave us the answer." }).click();
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
