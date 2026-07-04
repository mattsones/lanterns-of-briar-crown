import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolveRoll, resolveSkillCheck } from "../src/game/dice";
import { RACES } from "../src/data/character";
import { ENCOUNTERS, ENEMY_DB } from "../src/data/enemies";
import {
  ARTWORK_PLAN_GROUPS,
  HERO_VARIANT_ARTWORK_PLAN,
  getArtworkBacklog,
} from "../src/data/artworkPlan";
import { ITEM_DB } from "../src/data/items";
import { MAPS, TILE_META } from "../src/data/maps";
import {
  areMapNodesConnected,
  getMapVisualConfig,
  getNavigationDestination,
  getNavigationNodeKeys,
} from "../src/data/mapVisuals";
import { gainItem, getDefaultBattlePouch, removeItem } from "../src/game/inventory";
import {
  buildDefaultCompanion,
  buildDefaultVisited,
  buildPlayer,
} from "../src/game/state";
import { getHeroXpTarget } from "../src/game/progression";
import { getVisitedKey } from "../src/game/map";
import { addBonuses } from "../src/game/stats";
import { BATTLE_REWARDS } from "../src/data/battleRewards";
import {
  CHAPTER_DEFINITIONS,
  getChapterProgress,
  normalizeChapterFlags,
} from "../src/game/chapterProgress";
import {
  CHAPTER_2_REQUIRED_END_FLAGS,
  CHAPTER_2_STORY,
  getWestrootDoorRepairState,
  getRoadwatcherEncounterKey,
  getWestrootClueCount,
  getWestrootPuzzleOutcome,
} from "../src/story/chapter2";
import {
  getActiveGuestNpc,
  guestCanEnterBattle,
  guestCanTakeDamage,
} from "../src/game/guestNpcs";
import {
  CHAPTER_1_STORY,
  appendChapter1CompanionReaction,
  getChapter1CompanionReaction,
} from "../src/story/chapter1";
import { CHAPTER_STORY_PLANS } from "../src/story/chapters2to5";
import {
  formatDiskSaveFilename,
  getSavePayload,
  parseDiskSaveText,
  serializeDiskSave,
} from "../src/game/save";
import type { SavePayload } from "../src/game/types";

test("dice helpers format notation and skill checks", () => {
  const originalRandom = Math.random;
  Math.random = () => 0.5;
  try {
    expect(resolveRoll({ count: 2, sides: 6, bonus: 1 })).toEqual({
      rolls: [3, 3],
      total: 7,
      notation: "2d6+1",
    });

    const check = resolveSkillCheck({ Wit: 4 }, "Wit", 12);
    expect(check).toMatchObject({
      stat: "Wit",
      dc: 12,
      roll: 10,
      bonus: 2,
      total: 12,
      success: true,
      label: "Wit Check: 10 + 2 = 12 vs 12",
    });
  } finally {
    Math.random = originalRandom;
  }
});

test("inventory helpers preserve pouch and item mutation behavior", () => {
  expect(getDefaultBattlePouch({ trail_snack: 1, healing_fizzpop: 1 })).toEqual({
    slot1: "healing_fizzpop",
    slot2: "trail_snack",
  });

  let player = { inventory: { trail_snack: 1 } };
  const setPlayer = (updater) => {
    player = updater(player);
  };

  gainItem(setPlayer, "trail_snack", 2);
  expect(player.inventory.trail_snack).toBe(3);

  removeItem(setPlayer, "trail_snack", 1);
  expect(player.inventory.trail_snack).toBe(2);
});

test("disk save helpers preserve Liam's Game save payloads", () => {
  const player = buildPlayer({
    name: "Liam",
    gender: "Male",
    raceId: "human",
    appearanceId: "brave",
  });
  const payload: SavePayload = {
    screen: "play",
    chapterId: 1,
    player,
    region: "hearthhollow",
    position: { x: 2, y: 4 },
    visited: buildDefaultVisited(),
    companion: buildDefaultCompanion(),
    guestNpc: null,
    flags: {},
    quest: { title: "Test", description: "Save helper test." },
    toast: "Loaded helper test.",
  };

  const parsed = parseDiskSaveText(serializeDiskSave("Liam Helper Save", payload));
  expect(parsed.name).toBe("Liam Helper Save");
  expect(parsed.payload).toMatchObject({
    region: "hearthhollow",
    position: { x: 2, y: 4 },
    player: { name: "Liam" },
  });
  expect(getSavePayload(payload)).toBe(payload);
  expect(formatDiskSaveFilename("Liam / Chapter 2: Westroot")).toBe("liam-chapter-2-westroot.json");
  expect(() => parseDiskSaveText("{}")).toThrow("Invalid Liam's Game save file.");
});

test("checked-in Chapter 2 playtest save is loadable and item-safe", () => {
  const saveText = readFileSync(
    new URL("../public/saves/chapter-2-playtest.json", import.meta.url),
    "utf8",
  );
  const imported = parseDiskSaveText(saveText);
  const payload = imported.payload;

  expect(imported.name).toBe("Chapter 2 Playtest - Chapter 1 Complete");
  expect(payload).toMatchObject({
    screen: "play",
    chapterId: 2,
    region: "bramblecross",
    position: { x: 7, y: 4 },
    flags: {
      chapterOneClear: true,
      chapterReported: true,
    },
  });
  expect(payload.flags.chapterTwoBriefed).toBeUndefined();
  expect(payload.player.equipment).toMatchObject({
    weapon: "pebbleknock_hammer",
    helm: "kettle_helm",
    armor: "briar_vest",
    trinket1: "warden_chain",
    trinket2: "lantern_pin",
  });
  Object.keys(payload.player.inventory).forEach((id) => expect(ITEM_DB[id]).toBeTruthy());
  Object.values(payload.player.equipment)
    .filter(Boolean)
    .forEach((id) => expect(ITEM_DB[id]).toBeTruthy());
});

test("progression and default map state stay compatible with chapter one", () => {
  expect(getHeroXpTarget(1)).toBe(32);
  expect(addBonuses({ Heart: 3 }, { Heart: 1 })).toEqual({ Heart: 4 });

  const hero = buildPlayer({ name: "Liam", gender: "Male", raceId: "human", appearanceId: "brave" });
  expect(hero).toMatchObject({
    name: "Liam",
    raceId: "human",
    level: 1,
    gold: 4,
    checkpointLabel: "Home",
  });
  expect(hero.inventory).toMatchObject({ moonmint: 1, bubblecap: 1 });

  const visited = buildDefaultVisited();
  expect(visited.hearthhollow[getVisitedKey(2, 4)]).toBe(true);
  expect(visited.lanternRoad).toEqual({});
  expect(getMapVisualConfig("hearthhollow").revealAll).toBe(true);
  expect(getMapVisualConfig("bramblecross").revealAll).toBe(true);
  expect(getMapVisualConfig("lanternRoad").revealAll).toBeUndefined();
  expect(getMapVisualConfig("lanternRoad").pointOverrides).toBeUndefined();
  expect(MAPS.hearthhollow.tiles[4][2]).toBe("grass");
  expect(MAPS.hearthhollow.tiles[2][5]).toBe("baker");
  expect(MAPS.hearthhollow.tiles[2][3]).toBe("home_door");
  expect(MAPS.hearthhollow.tiles[6][2]).toBe("grass");
  expect(MAPS.hearthhollow.tiles[6][1]).toBe("potion_door");
  expect(MAPS.hearthhollow.tiles[6][11]).toBe("chest");
  expect(MAPS.hearthhollow.tiles[5][10]).toBe("tree");
  expect(MAPS.hearthhollow.tiles[5][11]).toBe("tree");
  expect(MAPS.hearthhollow.tiles[4][6]).toBe("well");
  expect(
    MAPS.hearthhollow.tiles[9].every((tile, x) =>
      x === 6 ? tile === "gate" : TILE_META[tile]?.blocked,
    ),
  ).toBe(true);
  expect(TILE_META.well.blocked).toBe(true);
  expect(MAPS.bramblecross.tiles[7][6]).toBe("road");
  expect(MAPS.bramblecross.tiles[8][6]).toBe("road");
  expect(MAPS.bramblecross.tiles[6][5]).toBe("cellar");
  expect(TILE_META[MAPS.bramblecross.tiles[7][5]].blocked).toBe(true);
  expect(TILE_META[MAPS.bramblecross.tiles[8][2]].blocked).toBe(true);
  expect(MAPS.lanternRoad.start).toEqual({ x: 0, y: 7 });
  expect(MAPS.lanternRoad.tiles[1][7]).toBe("ruins");
  expect(MAPS.lanternRoad.tiles[2][11]).toBe("cart");
  expect(MAPS.lanternRoad.tiles[4][11]).toBe("chest2");
  expect(MAPS.lanternRoad.tiles[7][11]).toBe("bramblecross");
  expect(MAPS.lanternRoad.tiles[7][7]).toBe("wildbattle");
  expect(MAPS.lanternRoad.tiles[6][2]).toBe("pond");
  expect(MAPS.lanternRoad.tiles[5][2]).toBe("road");
  [
    [11, 1],
    [11, 3],
    [11, 5],
    [10, 6],
    [11, 6],
    [12, 6],
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 4],
    [3, 6],
    [4, 6],
    [3, 7],
    [4, 7],
    [5, 7],
  ].forEach(([x, y]) => {
    expect(TILE_META[MAPS.lanternRoad.tiles[y][x]].blocked).toBe(true);
  });
});

test("chapter one story script beats stay wired into data", () => {
  expect(BATTLE_REWARDS.boar.text).toBe(CHAPTER_1_STORY.battleRewards.boar.text);
  expect(BATTLE_REWARDS.boar.text).toContain("pine pitch");
  expect(BATTLE_REWARDS.boar.text).toContain(
    "Whoever cut it loose did not want him arriving at all.",
  );

  expect(CHAPTER_1_STORY.reportBack.hollisReceivesClothMessages.map((m) => m.text)).toContain(
    "He was hurt enough to be right.",
  );
  expect(CHAPTER_1_STORY.reportBack.closingChoices).toContain(
    "The Briar Crown won't get to bury this.",
  );
  expect(CHAPTER_1_STORY.reportBack.threadMessages.some((m) =>
    m.text.includes("not a side theft"),
  )).toBe(true);

  const tildaDoorReaction = getChapter1CompanionReaction("tilda", "sealedDoor");
  expect(tildaDoorReaction).toContain("inventory people");
  expect(
    appendChapter1CompanionReaction("Base text", "rowan", "reportBack"),
  ).toContain("One route at a time");
});

test("chapter progress derives current chapter from stable flags", () => {
  expect(getChapterProgress({}).currentChapterId).toBe(1);
  expect(getChapterProgress({ chapterReported: true }).currentChapterId).toBe(2);
  expect(getChapterProgress({ chapterTwoClear: true }).currentChapterId).toBe(3);
  expect(getChapterProgress({ chapterThreeClear: true }).currentChapterId).toBe(4);
  expect(getChapterProgress({ chapterFourClear: true }).currentChapterId).toBe(5);
  expect(getChapterProgress({ chapterFiveClear: true })).toMatchObject({
    currentChapterId: 5,
    allChaptersComplete: true,
  });

  const normalized = normalizeChapterFlags({});
  expect(normalized.lioAlivePastGate).toBe(false);
  expect(normalized.chapterFiveClear).toBe(false);
  expect(CHAPTER_DEFINITIONS[5].title).toBe("Briarhold Waystation");
});

test("guest NPC support keeps Mara out of combat systems", () => {
  expect(getActiveGuestNpc({})).toBeNull();

  const mara = getActiveGuestNpc({ maraJoined: true });
  expect(mara).toMatchObject({
    id: "mara",
    name: "Mara Brindle",
    present: true,
    participatesInBattle: false,
    canTakeDamage: false,
  });
  expect(guestCanEnterBattle(mara)).toBe(false);
  expect(guestCanTakeDamage(mara)).toBe(false);
  expect(getActiveGuestNpc({ maraJoined: true, chapterFiveClear: true })).toBeNull();
});

test("chapters two through five have story and art contracts", () => {
  [2, 3, 4, 5].forEach((chapterId) => {
    const plan = CHAPTER_STORY_PLANS[chapterId];
    expect(plan.title).toBeTruthy();
    expect(plan.requiredEndFlags.length).toBeGreaterThanOrEqual(4);
    expect(plan.coreBeats.length).toBeGreaterThanOrEqual(7);
    expect(plan.keyLines.length).toBeGreaterThanOrEqual(3);
    expect(plan.artTargets.maps.length).toBeGreaterThanOrEqual(1);
  });

  expect(CHAPTER_STORY_PLANS[2].keyLines).toContain("The honest one has no handle.");
  expect(CHAPTER_STORY_PLANS[5].keyLines).toContain("It was not supposed to wake yet.");
});

test("art backlog tracks full illustrated prototype scope", () => {
  expect(Object.keys(HERO_VARIANT_ARTWORK_PLAN)).toHaveLength(RACES.length * 2);
  RACES.forEach((race) => {
    expect(HERO_VARIANT_ARTWORK_PLAN[`hero_${race.id}_male`]).toBeTruthy();
    expect(HERO_VARIANT_ARTWORK_PLAN[`hero_${race.id}_female`]).toBeTruthy();
  });

  expect(ARTWORK_PLAN_GROUPS.maps.westroot_trail.status).toBe("available");
  expect(ARTWORK_PLAN_GROUPS.maps.briarhold_waystation.chapter).toBe(5);
  expect(ARTWORK_PLAN_GROUPS.symbols.briar_crown_symbols.fallback).toBe("text labels");
  expect(getArtworkBacklog().some((entry) => entry.id === "mara")).toBe(true);
});

test("future chapter data IDs exist with fallbacks", () => {
  [
    "rootbread_charm",
    "witness_stone_rubbing",
    "folded_map_scrap",
    "lanternwell_drop",
    "true_seal_fragment",
    "briar_chain_link",
    "lios_courier_knot",
  ].forEach((itemId) => {
    expect(ITEM_DB[itemId]).toBeTruthy();
    expect(ITEM_DB[itemId].icon).toBeTruthy();
  });

  [
    "thorn_collared_hound",
    "briar_relay_guard",
    "seal_forged_sentry",
    "crown_whisperer",
    "bracken_voss",
    "thornseal_guard",
    "thornroot_sentry",
  ].forEach((enemyId) => {
    expect(ENEMY_DB[enemyId]).toBeTruthy();
    expect(ENEMY_DB[enemyId].icon).toBeTruthy();
  });

  expect(ENCOUNTERS.roadwatcherHard).toContain("thorn_collared_hound");
  expect(ENCOUNTERS.briarholdBoss).toContain("bracken_voss");
  expect(BATTLE_REWARDS.roadwatcher.flagUpdate).toMatchObject({
    roadwatcherDefeated: true,
    roadwatcherEvidenceFound: true,
    briarCrownWatchingWestroot: true,
  });
});

test("chapter two westroot puzzle supports clean, standard, and messy outcomes", () => {
  const cleanFlags = {
    noHandleStoneInspected: true,
    shelterNoticeRemoved: true,
    falseNoticeLensUsed: true,
    lanternSignCleaned: true,
    understandsTrueSigns: true,
    lanternSignCompared: true,
    lioShelterMarkFound: true,
    lioHookMarkFound: true,
  };
  const clean = getWestrootPuzzleOutcome(cleanFlags);
  expect(clean).toMatchObject({
    supportingClues: 4,
    enoughClues: true,
    cleanSolve: true,
    roadwatcherPrepared: true,
    roadwatcherMode: "standard",
  });
  expect(getWestrootDoorRepairState(cleanFlags)).toMatchObject({
    falseOrdersBroken: true,
    trueLanternGuidanceRestored: true,
    lioMarkConfirmed: true,
    eddenDrawingAligned: true,
    readyToOpen: true,
  });

  const tooEarly = getWestrootPuzzleOutcome({
    noHandleStoneInspected: true,
    lioHookMarkFound: true,
  });
  expect(tooEarly.enoughClues).toBe(false);
  expect(tooEarly.cleanSolve).toBe(false);
  expect(tooEarly.repair.missingRequirements).toContain("break the false road orders");

  const standardFlags = {
    forcedNoHandleDoor: true,
    ...cleanFlags,
  };
  const standard = getWestrootPuzzleOutcome(standardFlags);
  expect(standard.cleanSolve).toBe(false);
  expect(standard.roadwatcherMode).toBe("standard");
  expect(getRoadwatcherEncounterKey(standardFlags)).toBe("roadwatcher");

  const messy = getWestrootPuzzleOutcome({
    ...cleanFlags,
    followedFalseDetour: true,
    crownSignRejected: true,
  });
  expect(messy.roadwatcherMode).toBe("hard");
  expect(getRoadwatcherEncounterKey({ followedFalseDetour: true })).toBe("roadwatcherHard");
  expect(getWestrootClueCount({ willowForgeryConfirmedAtHollow: true })).toBe(1);
});

test("chapter two contract keeps required flags, map prompt, and reveal boundaries stable", () => {
  CHAPTER_2_REQUIRED_END_FLAGS.forEach((flag) => {
    expect(normalizeChapterFlags({})[flag]).toBe(false);
  });
  expect(CHAPTER_2_STORY.mapPromptDoc).toBe("docs/art/prompts/chapter-2-westroot-trail-map.md");
  expect(CHAPTER_STORY_PLANS[2].keyLines.join(" ")).not.toContain("Princess Elowen");
  expect(MAPS.westrootTrail.backgroundImage).toContain("westroot-trail-map-v04");
  expect(getMapVisualConfig("westrootTrail")).toMatchObject({
    aspectRatio: "16 / 9",
    navBounds: { left: 5, top: 8, width: 90, height: 82 },
  });
  expect(getNavigationNodeKeys("westrootTrail")).toEqual(
    expect.arrayContaining([
      "0,3",
      "0,5",
      "0,4",
      "1,5",
      "2,6",
      "2,5",
      "3,5",
      "2,1",
      "3,4",
      "4,1",
      "4,2",
      "5,0",
      "4,3",
      "7,0",
      "6,0",
      "8,0",
      "6,1",
      "8,3",
      "7,6",
      "8,4",
      "8,6",
      "8,5",
      "7,5",
      "6,4",
      "5,5",
      "4,6",
      "3,6",
      "4,5",
      "5,6",
      "6,6",
    ]),
  );
  expect(getNavigationNodeKeys("westrootTrail")).not.toContain("8,1");
  expect(getNavigationNodeKeys("westrootTrail")).not.toContain("6,3");
  expect(getNavigationNodeKeys("westrootTrail")).not.toContain("7,3");
  expect(areMapNodesConnected("westrootTrail", { x: 0, y: 3 }, { x: 0, y: 5 })).toBe(true);
  expect(areMapNodesConnected("westrootTrail", { x: 0, y: 5 }, { x: 1, y: 5 })).toBe(true);
  expect(areMapNodesConnected("westrootTrail", { x: 1, y: 4 }, { x: 2, y: 6 })).toBe(true);
  expect(areMapNodesConnected("westrootTrail", { x: 2, y: 4 }, { x: 3, y: 5 })).toBe(true);
  expect(areMapNodesConnected("westrootTrail", { x: 4, y: 2 }, { x: 3, y: 4 })).toBe(true);
  expect(areMapNodesConnected("westrootTrail", { x: 5, y: 1 }, { x: 5, y: 0 })).toBe(true);
  expect(areMapNodesConnected("westrootTrail", { x: 7, y: 2 }, { x: 6, y: 0 })).toBe(true);
  expect(areMapNodesConnected("westrootTrail", { x: 8, y: 2 }, { x: 8, y: 0 })).toBe(true);
  expect(areMapNodesConnected("westrootTrail", { x: 8, y: 0 }, { x: 8, y: 3 })).toBe(true);
  expect(areMapNodesConnected("westrootTrail", { x: 8, y: 3 }, { x: 7, y: 6 })).toBe(true);
  expect(areMapNodesConnected("westrootTrail", { x: 7, y: 6 }, { x: 8, y: 4 })).toBe(true);
  expect(areMapNodesConnected("westrootTrail", { x: 8, y: 5 }, { x: 7, y: 5 })).toBe(true);
  expect(areMapNodesConnected("westrootTrail", { x: 6, y: 5 }, { x: 5, y: 6 })).toBe(true);
  expect(areMapNodesConnected("westrootTrail", { x: 6, y: 6 }, { x: 5, y: 5 })).toBe(true);
  expect(areMapNodesConnected("westrootTrail", { x: 4, y: 6 }, { x: 3, y: 6 })).toBe(true);
  expect(areMapNodesConnected("westrootTrail", { x: 6, y: 6 }, { x: 6, y: 4 })).toBe(true);
  expect(areMapNodesConnected("westrootTrail", { x: 3, y: 5 }, { x: 4, y: 5 })).toBe(false);
  expect(getNavigationDestination("westrootTrail", 3, 3, "up")).toEqual({ x: 2, y: 2 });
  expect(getNavigationDestination("westrootTrail", 2, 3, "up")).toEqual({ x: 3, y: 3 });
  expect(getNavigationDestination("westrootTrail", 2, 3, "left")).toBeNull();
  expect(getNavigationDestination("westrootTrail", 3, 2, "up")).toEqual({ x: 3, y: 4 });
  expect(getNavigationDestination("westrootTrail", 3, 1, "up")).toEqual({ x: 3, y: 4 });
  expect(getNavigationDestination("westrootTrail", 4, 2, "up")).toEqual({ x: 3, y: 4 });
  expect(getNavigationDestination("westrootTrail", 4, 2, "right")).toEqual({ x: 5, y: 1 });
  expect(getNavigationDestination("westrootTrail", 7, 1, "up")).toEqual({ x: 4, y: 3 });
  expect(getNavigationDestination("westrootTrail", 7, 1, "right")).toEqual({ x: 7, y: 0 });
  expect(getNavigationDestination("westrootTrail", 7, 1, "down")).toEqual({ x: 7, y: 0 });
  expect(getNavigationDestination("westrootTrail", 7, 0, "right")).toEqual({ x: 5, y: 3 });
  expect(getNavigationDestination("westrootTrail", 5, 3, "left")).toEqual({ x: 7, y: 0 });
  expect(getNavigationDestination("westrootTrail", 7, 2, "up")).toEqual({ x: 5, y: 3 });
  expect(getNavigationDestination("westrootTrail", 5, 3, "down")).toEqual({ x: 7, y: 2 });
  expect(getNavigationDestination("westrootTrail", 8, 2, "up")).toEqual({ x: 6, y: 1 });
  expect(getNavigationDestination("westrootTrail", 8, 2, "right")).toEqual({ x: 6, y: 1 });
  expect(getNavigationDestination("westrootTrail", 8, 2, "down")).toEqual({ x: 8, y: 0 });
  expect(getNavigationDestination("westrootTrail", 8, 0, "up")).toEqual({ x: 8, y: 2 });
  expect(getNavigationDestination("westrootTrail", 8, 0, "right")).toEqual({ x: 8, y: 3 });
  expect(getNavigationDestination("westrootTrail", 6, 6, "up")).toEqual({ x: 6, y: 4 });
  expect(getNavigationDestination("westrootTrail", 6, 5, "left")).toEqual({ x: 5, y: 6 });
  expect(getNavigationDestination("westrootTrail", 5, 6, "right")).toEqual({ x: 6, y: 5 });
  expect(getNavigationDestination("westrootTrail", 5, 6, "left")).toEqual({ x: 5, y: 5 });
  expect(getNavigationDestination("westrootTrail", 6, 6, "right")).toEqual({ x: 6, y: 5 });
  expect(getNavigationDestination("westrootTrail", 6, 6, "left")).toEqual({ x: 5, y: 5 });
  expect(getNavigationDestination("westrootTrail", 6, 6, "down")).toEqual({ x: 5, y: 6 });
  expect(getNavigationDestination("westrootTrail", 5, 5, "right")).toEqual({ x: 5, y: 6 });
  expect(getNavigationDestination("westrootTrail", 5, 5, "up")).toEqual({ x: 6, y: 6 });
  expect(MAPS.westrootTrail.tiles.flat()).toEqual(
    expect.arrayContaining([
      "westroot_cut",
      "shelter_nook",
      "false_notice",
      "three_hollow",
      "no_handle_stone",
      "roadwatcher",
    ]),
  );
  expect(MAPS.westrootTrail.tiles.flat()).not.toContain("westroot_gate");
});
