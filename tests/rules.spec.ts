import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { resolveRoll, resolveSkillCheck } from "../src/game/dice";
import { DEFAULT_HUMAN_HERITAGE_ID, GENDERS, HUMAN_HERITAGES, RACES } from "../src/data/character";
import { COMPANION_OPTIONS } from "../src/data/companions";
import { buildEncounterEnemies, ENCOUNTERS, ENEMY_DB } from "../src/data/enemies";
import {
  damageBattleEnemy,
  getLivingEnemies,
  getSelectedBattleEnemy,
  prepareBattleEnemies,
  rotateEnemyIntent,
} from "../src/game/battle";
import {
  ARTWORK_PLAN_GROUPS,
  HERO_VARIANT_ARTWORK_PLAN,
  MAP_ARTWORK_PLAN,
  getArtworkBacklog,
} from "../src/data/artworkPlan";
import { PLAYER_HERO_ARTWORK, getPlayerArtworkBySelection } from "../src/data/playerArtwork";
import { ITEM_DB } from "../src/data/items";
import { SKILL_DB } from "../src/data/skills";
import { ITEM_ARTWORK } from "../src/data/itemArtwork";
import { HERO_GROWTH_ARTWORK } from "../src/data/growthArtwork";
import { MAPS, TILE_META } from "../src/data/maps";
import { DIALOGUE_PORTRAITS } from "../src/data/portraits";
import { buildQuestJournal } from "../src/data/quests";
import {
  areMapNodesConnected,
  getMapNodePoint,
  getMapVisualConfig,
  getNavigationDestination,
  getNavigationNodeKeys,
} from "../src/data/mapVisuals";
import { gainItem, getDefaultBattlePouch, itemFitsSlot, removeItem } from "../src/game/inventory";
import {
  buildDefaultCompanion,
  buildDefaultFlags,
  buildDefaultVisited,
  buildPlayer,
} from "../src/game/state";
import { getHeroXpTarget } from "../src/game/progression";
import {
  getCompanionAbilityCards,
  getCompanionCommandAbility,
  getCompanionCommandOptions,
  isCompanionConscious,
} from "../src/game/companions";
import { getRegionCheckpointLabel, getVisitedKey, isBlockedInteractionTile } from "../src/game/map";
import { getWestrootMapNpcTokens } from "../src/game/westrootMap";
import { addBonuses, getDerivedStats } from "../src/game/stats";
import { buildCombatSkill, getEquippedSkillIds } from "../src/game/skills";
import { BATTLE_REWARDS } from "../src/data/battleRewards";
import { DIALOGUE_SCENE_ART } from "../src/data/dialogueArt";
import {
  CHAPTER_DEFINITIONS,
  getChapterProgress,
  normalizeChapterFlags,
} from "../src/game/chapterProgress";
import {
  CHAPTER_2_REQUIRED_END_FLAGS,
  CHAPTER_2_SCENE_COPY,
  CHAPTER_2_STORY,
  getChapter2CompanionRead,
  getCrownDoorText,
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
  BRAMBLECROSS_CONTACT_CHOICES,
  canStartChapter3,
  CHAPTER_3_HUB_NODES,
  CHAPTER_3_STORY,
  getSplitHallResolution,
  isChapter3Complete,
} from "../src/story/chapter3";
import {
  formatDiskSaveFilename,
  getSavePayload,
  migrateFlags,
  migrateSavePayload,
  parseDiskSaveText,
  SAVE_FILE_VERSION,
  serializeDiskSave,
} from "../src/game/save";
import { validateAllMapNavigationGraphs } from "../src/game/mapValidation";
import { runGameQaChecks } from "../src/game/qa";
import { validateChapter4ReadyPayload } from "../src/game/chapter4Readiness";
import {
  claimFoldedMapCache,
  getGatewrightOfferPrice,
  purchaseGatewrightWeapon,
  resolveFoldedMapPair,
  validateChapter4Contract,
} from "../src/game/chapter4";
import {
  CHAPTER_4_CONTRACT,
  CHAPTER_4_OPTIONAL_FLAGS,
  GATEWRIGHT_WEAPON_CONTRACT,
} from "../src/story/chapter4";
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
  });
  expect(player.humanHeritageId).toBe(DEFAULT_HUMAN_HERITAGE_ID);
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
  expect(getSavePayload(payload)).toMatchObject({
    region: "hearthhollow",
    position: { x: 2, y: 4 },
    player: { name: "Liam", humanHeritageId: DEFAULT_HUMAN_HERITAGE_ID },
    flags: { chapterTwoClear: false },
  });
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
    position: { x: 6, y: 3 },
    flags: {
      chapterOneClear: true,
      chapterReported: true,
    },
  });
  expect(payload.flags.chapterTwoBriefed).toBe(false);
  expect(payload.player.humanHeritageId).toBe(DEFAULT_HUMAN_HERITAGE_ID);
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

test("simultaneous combat keeps every enemy active and targetable", () => {
  const enemies = prepareBattleEnemies(buildEncounterEnemies("roadwatcherHard") as any);
  expect(enemies).toHaveLength(3);
  expect(new Set(enemies.map((enemy) => enemy.battleId)).size).toBe(3);
  expect(getSelectedBattleEnemy(enemies, enemies[1].battleId)?.name).toBe(
    "Thorn-Collared Hound",
  );

  const afterDefeat = damageBattleEnemy(
    enemies,
    enemies[1].battleId,
    enemies[1].maxHp,
    { weaken: true },
  );
  expect(getLivingEnemies(afterDefeat)).toHaveLength(2);
  expect(getSelectedBattleEnemy(afterDefeat, enemies[1].battleId)?.battleId).toBe(
    enemies[0].battleId,
  );

  const rotated = rotateEnemyIntent(enemies[0]);
  expect(rotated.intent).toBe(enemies[0].intentB);
  expect(rotated.currentAttackSpec).toEqual(enemies[0].attackB);
});

test("Chapter 3 scaffold has explicit entry, hub, and completion contracts", () => {
  const entryFlags = Object.fromEntries(
    CHAPTER_3_STORY.entryRequirements.map((flag) => [flag, true]),
  );
  const endFlags = Object.fromEntries(
    CHAPTER_3_STORY.requiredEndFlags.map((flag) => [flag, true]),
  );
  expect(canStartChapter3(entryFlags)).toBe(true);
  expect(isChapter3Complete({ ...entryFlags, ...endFlags })).toBe(true);
  expect(CHAPTER_3_HUB_NODES.map((node) => node.id)).toEqual(
    expect.arrayContaining(["first_gate", "witness_stones", "split_hall", "cargo_siding"]),
  );
});

test("battle checkpoints use the current region's actual name", () => {
  expect(getRegionCheckpointLabel("hearthhollow")).toBe("South Gate");
  expect(getRegionCheckpointLabel("rootCellar")).toBe("Old Root Cellar");
  expect(getRegionCheckpointLabel("westrootHub")).toBe("Westroot");
  expect(getRegionCheckpointLabel("not-a-region")).toBe("South Gate");
});

test("companion commands select named abilities with distinct battle effects", () => {
  const tilda = {
    ...buildDefaultCompanion(),
    recruited: true,
    name: "Tilda Quickstep",
    style: "skirmisher",
    command: "Attack Freely",
  };

  expect(getCompanionCommandOptions(tilda).map((option) => option.label)).toEqual([
    "Attack: Quick Feint",
    "Defend: Spoil the Timing",
    "Support: Pocket Tricks",
  ]);
  expect(getCompanionAbilityCards(tilda).map((ability) => ability.commandLabel)).toEqual([
    "Attack",
    "Defend",
    "Support",
  ]);
  expect(getCompanionCommandAbility(tilda)).toMatchObject({
    name: "Quick Feint",
    effect: { damage: { count: 1, sides: 6, bonus: 1 } },
  });
  expect(getCompanionCommandAbility(tilda, "Defend Me")).toMatchObject({
    name: "Spoil the Timing",
    effect: { weaken: true },
  });
  expect(getCompanionCommandAbility(tilda, "Use Support Skills")).toMatchObject({
    name: "Pocket Tricks",
    effect: {
      damage: { count: 1, sides: 4 },
      heroGuard: 2,
    },
  });

  expect(
    getCompanionCommandAbility(
      { ...tilda, style: "guardian" },
      "Defend Me",
    ),
  ).toMatchObject({ name: "Shielding Step", effect: { heroGuard: 4 } });
  expect(
    getCompanionCommandAbility(
      { ...tilda, style: "sage" },
      "Use Support Skills",
    ),
  ).toMatchObject({
    name: "Field Mending",
    effect: { heroHeal: 4, companionHeal: 2 },
  });
});

test("companion availability distinguishes recruitment from consciousness", () => {
  const companion = {
    ...buildDefaultCompanion(),
    recruited: true,
    id: "rowan",
    name: "Rowan Reedshield",
    hp: 12,
    maxHp: 12,
  };

  expect(isCompanionConscious(companion)).toBe(true);
  expect(isCompanionConscious({ ...companion, hp: 0 })).toBe(false);
  expect(isCompanionConscious(buildDefaultCompanion())).toBe(false);

  const journal = buildQuestJournal(
    { ...buildDefaultFlags(), reachedBramblecross: true },
    { ...companion, hp: 0 },
  );
  expect(journal.sideQuests.find((quest) => quest.id === "companion")).toMatchObject({
    status: "Downed",
    active: true,
  });
});

test("Chapter 3 Westroot placeholder hub and cargo encounter preserve the vertical-slice contract", () => {
  expect(MAPS.westrootHub).toMatchObject({
    name: "Westroot",
    start: { x: 1, y: 3 },
  });
  expect(MAPS.westrootHub.backgroundImage).toContain("westroot-hub-map-v01");
  expect(MAPS.westrootHub.restoredBackgroundImage).toContain(
    "westroot-hub-map-v02-open-stones",
  );
  const hubTiles = MAPS.westrootHub.tiles.flat();
  [
    "westroot_first_gate",
    "rootmarket",
    "mossgarden",
    "witness_stones",
    "split_hall",
    "cargo_siding",
  ].forEach((tile) => {
    expect(hubTiles).toContain(tile);
    expect(TILE_META[tile]).toBeTruthy();
  });
  expect(ENCOUNTERS.westrootCargo).toEqual([
    "briar_cargo_runner",
    "seal_forged_sentry",
  ]);
  expect(BATTLE_REWARDS.westrootCargo.flagUpdate).toMatchObject({
    willowCargoExposed: true,
  });
  expect(existsSync(resolve("docs/art/prompts/chapter-3-westroot-hub-map.md"))).toBe(true);
});

test("Westroot hub movement follows the painted road in short, room-aware steps", () => {
  const visual = getMapVisualConfig("westrootHub");
  expect(visual).toMatchObject({
    revealAll: true,
  });
  expect(visual.fogRadius).toBeUndefined();
  expect(visual.fogPathWidth).toBeUndefined();
  expect(visual.fogRevealAreas).toBeUndefined();
  expect(getNavigationDestination("westrootHub", 1, 3, "down")).toEqual({ x: 1, y: 4 });
  expect(getNavigationDestination("westrootHub", 1, 3, "right")).toEqual({ x: 1, y: 4 });
  expect(getNavigationDestination("westrootHub", 3, 3, "up")).toEqual({ x: 3, y: 6 });
  expect(getNavigationDestination("westrootHub", 2, 3, "right")).toEqual({ x: 3, y: 4 });
  expect(getNavigationDestination("westrootHub", 3, 4, "up")).toEqual({ x: 2, y: 2 });
  expect(getNavigationDestination("westrootHub", 3, 6, "down")).toEqual({ x: 3, y: 3 });
  expect(getNavigationDestination("westrootHub", 3, 3, "right")).toEqual({ x: 4, y: 3 });
  expect(getNavigationDestination("westrootHub", 3, 6, "right")).toEqual({ x: 4, y: 3 });
  expect(getNavigationDestination("westrootHub", 4, 3, "up")).toEqual({ x: 3, y: 6 });
  expect(getNavigationDestination("westrootHub", 4, 3, "right")).toEqual({ x: 5, y: 3 });
  expect(getNavigationDestination("westrootHub", 5, 3, "down")).toEqual({ x: 4, y: 4 });
  expect(getNavigationDestination("westrootHub", 5, 3, "left")).toEqual({ x: 4, y: 2 });
  expect(getNavigationDestination("westrootHub", 5, 3, "right")).toEqual({ x: 6, y: 3 });
  expect(getNavigationDestination("westrootHub", 5, 3, "up")).toEqual({ x: 6, y: 1 });
  expect(getNavigationNodeKeys("westrootHub")).not.toContain("4,5");
  expect(getNavigationDestination("westrootHub", 4, 2, "down")).toEqual({ x: 4, y: 4 });
  // Noma's garden and the stone spur meet at the 1,2 / 4,0 junction.
  expect(getNavigationDestination("westrootHub", 3, 0, "down")).toEqual({ x: 1, y: 0 });
  expect(getNavigationDestination("westrootHub", 1, 0, "right")).toEqual({ x: 1, y: 2 });
  expect(getNavigationDestination("westrootHub", 1, 2, "up")).toEqual({ x: 4, y: 0 });
  expect(getNavigationDestination("westrootHub", 3, 0, "right")).toEqual({ x: 1, y: 0 });
  expect(areMapNodesConnected(
    "westrootHub",
    { x: 3, y: 0 },
    { x: 4, y: 0 },
  )).toBe(false);
  expect(getNavigationDestination("westrootHub", 4, 0, "right")).toEqual({ x: 2, y: 0 });
  expect(getNavigationDestination("westrootHub", 2, 0, "right")).toEqual({ x: 5, y: 0 });
  expect(getNavigationDestination("westrootHub", 5, 0, "up")).toEqual({ x: 6, y: 0 });
  expect(getNavigationDestination("westrootHub", 6, 0, "up")).toEqual({ x: 4, y: 1 });
  // Split Hall rejoins the town road, so the siding does not require the western loop.
  expect(getNavigationDestination("westrootHub", 5, 2, "down")).toEqual({ x: 6, y: 1 });
  expect(getNavigationDestination("westrootHub", 6, 1, "down")).toEqual({ x: 4, y: 2 });
  expect(getNavigationDestination("westrootHub", 4, 4, "up")).toEqual({ x: 4, y: 2 });
  expect(getNavigationDestination("westrootHub", 6, 4, "right")).toEqual({ x: 7, y: 3 });
  // The two new painted-road loops meet on the center-right path.
  expect(getNavigationDestination("westrootHub", 4, 4, "down")).toEqual({ x: 8, y: 0 });
  expect(getNavigationDestination("westrootHub", 8, 3, "down")).toEqual({ x: 5, y: 6 });
  expect(getNavigationDestination("westrootHub", 3, 3, "down")).toEqual({ x: 8, y: 4 });
  expect(MAPS.westrootHub.tiles[3][3]).toBe("westroot_path");
  expect(MAPS.westrootHub.tiles[6][3]).toBe("rootmarket");
  expect(getMapNodePoint("westrootHub", 3, 6, 9, 7)).toEqual({ x: 40.6, y: 52.7 });
  expect(getMapNodePoint("westrootHub", 4, 1, 9, 7)).toEqual({ x: 41.4, y: 15 });
  expect(getNavigationDestination("westrootHub", 7, 3, "down")).toEqual({ x: 7, y: 4 });

  const followWestrootRoute = (
    start: { x: number; y: number },
    directions: Array<"up" | "down" | "left" | "right">,
  ) => directions.reduce((position, direction) => {
    const destination = getNavigationDestination(
      "westrootHub",
      position.x,
      position.y,
      direction,
    );
    if (!destination) {
      throw new Error(
        `Westroot continuity route stopped at ${position.x},${position.y} on ${direction}`,
      );
    }
    return destination;
  }, start);

  // Long organic stretches should repeat one arrow until the painted road
  // actually turns or reaches a fork.
  expect(followWestrootRoute(
    { x: 3, y: 6 },
    ["down", "left", "up", "up", "up", "up", "up", "up", "left", "left"],
  )).toEqual({ x: 3, y: 0 });
  expect(followWestrootRoute(
    { x: 3, y: 0 },
    ["right", "right", "down", "down", "down", "down", "down", "down", "right", "up"],
  )).toEqual({ x: 3, y: 6 });
  expect(followWestrootRoute(
    { x: 4, y: 1 },
    ["down", "down", "down", "down", "down"],
  )).toEqual({ x: 4, y: 4 });
  expect(followWestrootRoute(
    { x: 4, y: 4 },
    ["down", "down", "down", "down", "right"],
  )).toEqual({ x: 6, y: 5 });
  expect(followWestrootRoute(
    { x: 6, y: 5 },
    ["left", "left", "left", "left", "left"],
  )).toEqual({ x: 4, y: 4 });

  const directionIsVisuallyConsistent = {
    up: (dx: number, dy: number) => dy < 0 && Math.abs(dy) >= 0.45 * Math.abs(dx),
    down: (dx: number, dy: number) => dy > 0 && Math.abs(dy) >= 0.45 * Math.abs(dx),
    left: (dx: number, dy: number) => dx < 0 && Math.abs(dx) >= 0.45 * Math.abs(dy),
    right: (dx: number, dy: number) => dx > 0 && Math.abs(dx) >= 0.45 * Math.abs(dy),
  };
  Object.entries(visual.navigationLinks || {}).forEach(([from, exits]) => {
    const [fromX, fromY] = from.split(",").map(Number);
    const fromPoint = getMapNodePoint("westrootHub", fromX, fromY, 9, 7);
    Object.entries(exits).forEach(([direction, destination]) => {
      if (!destination) return;
      const [toX, toY] = destination.split(",").map(Number);
      const toPoint = getMapNodePoint("westrootHub", toX, toY, 9, 7);
      const dx = toPoint.x - fromPoint.x;
      const dy = toPoint.y - fromPoint.y;
      expect(
        directionIsVisuallyConsistent[direction](dx, dy),
        `${from} ${direction} -> ${destination} should match the painted direction`,
      ).toBe(true);
    });
  });

  const edgeLengths = Object.entries(visual.navigationLinks || {}).flatMap(([from, exits]) => {
    const [fromX, fromY] = from.split(",").map(Number);
    const fromPoint = getMapNodePoint("westrootHub", fromX, fromY, 9, 7);
    return Object.values(exits).flatMap((destination) => {
      if (
        !destination ||
        from >= destination ||
        from === "3,6" ||
        destination === "3,6" ||
        (from === "4,3" && destination === "5,3")
      ) return [];
      const [toX, toY] = destination.split(",").map(Number);
      const toPoint = getMapNodePoint("westrootHub", toX, toY, 9, 7);
      return [Math.hypot(toPoint.x - fromPoint.x, toPoint.y - fromPoint.y)];
    });
  });
  expect(Math.max(...edgeLengths)).toBeLessThanOrEqual(12);
});

test("Westroot map NPC markers follow the story's physical staging", () => {
  const initialFlags = buildDefaultFlags();
  expect(getWestrootMapNpcTokens(initialFlags)).toMatchObject([
    { id: "bramwell", x: 1, y: 4 },
    { id: "noma", name: "Mossback caretaker", x: 3, y: 0 },
    { id: "quill", name: "Stonekin shutter-mender", x: 3, y: 6 },
    { id: "lume", name: "Mossback baker", x: 3, y: 6 },
  ]);

  const holdMeeting = {
    ...initialFlags,
    metNoma: true,
    westrootHoldBellRung: true,
  };
  expect(getWestrootMapNpcTokens(holdMeeting)).toMatchObject([
    { id: "bramwell", x: 5, y: 2 },
    { id: "noma", name: "Noma Greenstill", x: 5, y: 2 },
    { id: "quill", x: 5, y: 2 },
    { id: "lume", x: 5, y: 2 },
  ]);

  const atWitnessStones = {
    ...holdMeeting,
    splitHallDebateHeard: true,
    rootbreadLeadLearned: true,
  };
  expect(getWestrootMapNpcTokens(atWitnessStones)).toMatchObject([
    { id: "bramwell", x: 4, y: 1 },
    { id: "noma", x: 4, y: 1 },
    { id: "quill", x: 4, y: 1 },
    { id: "lume", x: 4, y: 1 },
    { id: "rootbread-child", x: 1, y: 3 },
  ]);

  const atCargoSiding = {
    ...atWitnessStones,
    witnessStoneSequenceSolved: true,
  };
  expect(getWestrootMapNpcTokens(atCargoSiding)).toMatchObject([
    { id: "bramwell", x: 7, y: 2 },
    { id: "noma", x: 7, y: 2 },
    { id: "quill", x: 7, y: 2 },
    { id: "rootbread-child", x: 1, y: 3 },
  ]);

  const resolved = {
    ...atCargoSiding,
    willowCargoExposed: true,
    rootbreadPromiseKept: true,
    chapterThreeClear: true,
  };
  expect(getWestrootMapNpcTokens(resolved)).toMatchObject([
    { id: "bramwell", x: 1, y: 4 },
    { id: "noma", x: 3, y: 0 },
    { id: "lume", x: 3, y: 6 },
  ]);
});

test("Chapter 3 production artwork is selected and fallback-safe", () => {
  expect(DIALOGUE_PORTRAITS["Bramble Boar"].src).toContain("bramble-boar-v01");
  expect(DIALOGUE_PORTRAITS["Bramwell Gatehand"].src).toContain("bramwell-gatehand-portrait-v01");
  expect(DIALOGUE_PORTRAITS["Quill Pebbleturn"].src).toContain("quill-pebbleturn-portrait-v01");
  expect(DIALOGUE_PORTRAITS["Auntie Lume"].src).toContain("auntie-lume-portrait-v02");
  expect(DIALOGUE_PORTRAITS["Noma Greenstill"].src).toContain("noma-greenstill-portrait-v02");
  expect(DIALOGUE_PORTRAITS["Westroot Rootbread Child"].src).toContain(
    "westroot-rootbread-child-portrait-v02",
  );
  expect(ENEMY_DB.briar_cargo_runner.artwork?.src).toContain("briar-cargo-runner-v01");
  expect(ENEMY_DB.seal_forged_sentry.artwork?.src).toContain("seal-forged-sentry-v01");
  expect(ITEM_ARTWORK.rootbread_charm?.src).toContain("rootbread-charm-icon-v01");
  expect(ITEM_ARTWORK.witness_stone_rubbing?.src).toContain("witness-stone-rubbing-icon-v02");
  expect(ITEM_ARTWORK.cargo_transfer_tag?.src).toContain("cargo-transfer-tag-icon-v02");
  expect(ITEM_ARTWORK.split_crown_slat?.src).toContain("crown-den-slat-rack-broken-token-v01");
  expect(ITEM_ARTWORK.briar_signmaker_ledger?.src).toContain("crown-den-witness-ledger-token-v01");
  expect(ITEM_ARTWORK.cleaned_lantern_mark?.src).toContain("crown-den-false-map-cleared-token-v01");
  expect(ARTWORK_PLAN_GROUPS.portraits.westroot_npcs.status).toBe("available");
  expect(ARTWORK_PLAN_GROUPS.enemies.briar_cargo_runner.status).toBe("available");
  expect(ARTWORK_PLAN_GROUPS.enemies.seal_forged_sentry.status).toBe("available");
  expect(ARTWORK_PLAN_GROUPS.items.cargo_transfer_tag.status).toBe("available");
});

test("level-up growth choices use the coordinated production emblem set", () => {
  expect(Object.keys(HERO_GROWTH_ARTWORK)).toEqual([
    "power",
    "resolve",
    "cleverness",
    "heart",
    "craft",
  ]);
  expect(HERO_GROWTH_ARTWORK.power.src).toContain("level-up-power-v01");
  expect(HERO_GROWTH_ARTWORK.resolve.src).toContain("level-up-resolve-v01");
  expect(HERO_GROWTH_ARTWORK.cleverness.src).toContain("level-up-cleverness-v01");
  expect(HERO_GROWTH_ARTWORK.heart.src).toContain("level-up-heart-v01");
  expect(HERO_GROWTH_ARTWORK.craft.src).toContain("level-up-craft-v02");
});

test("checked-in Chapter 2 complete save is Chapter 3 ready", () => {
  const saveText = readFileSync(
    new URL("../public/saves/chapter-2-complete.json", import.meta.url),
    "utf8",
  );
  const imported = parseDiskSaveText(saveText);
  const payload = imported.payload;

  expect(imported.name).toBe("Chapter 2 Complete - Chapter 3 Ready");
  expect(payload).toMatchObject({
    screen: "play",
    chapterId: 3,
    region: "westrootHub",
    position: { x: 1, y: 3 },
    flags: {
      reportedSatchelToElder: true,
      chapterReported: true,
      chapterTwoStarted: true,
      chapterTwoClear: true,
      westrootGateOpened: true,
      lioAlivePastGate: true,
      eddensDrawingValidated: true,
      briarCrownWatchingWestroot: true,
      crownDoorDungeonCleared: true,
    },
  });
  expect(getChapterProgress(payload.flags)).toMatchObject({
    currentChapterId: 3,
    completedChapterIds: [1, 2],
  });
  expect(payload.visited.westrootHub["1,3"]).toBe(true);
  [
    "eddens_three_door_drawing",
    "willowmark_lens",
    "pine_pitch_wax",
    "split_crown_slat",
    "briar_signmaker_ledger",
    "cleaned_lantern_mark",
    "no_handle_token",
    "witness_note_bramblecross",
  ].forEach((id) => expect(payload.player.inventory[id]).toBeGreaterThan(0));
  Object.keys(payload.player.inventory).forEach((id) => expect(ITEM_DB[id]).toBeTruthy());
});

test("the Rootbread Charm is a wearable support upgrade over the Lantern Pin", () => {
  const rootbreadCharm = ITEM_DB.rootbread_charm;
  const lanternPin = ITEM_DB.lantern_pin;
  const rootbreadSkill = SKILL_DB.rootbread_respite;
  const lanternSkill = SKILL_DB.roadwarden_resolve;

  expect(rootbreadCharm).toMatchObject({
    rarity: "Rare",
    slot: "trinket1",
    bonuses: { Heart: 2, Will: 1 },
    skills: ["rootbread_respite"],
  });
  expect(itemFitsSlot(rootbreadCharm, "trinket1")).toBe(true);
  expect(itemFitsSlot(rootbreadCharm, "trinket2")).toBe(true);
  expect(rootbreadCharm.bonuses.Heart).toBeGreaterThan(lanternPin.bonuses.Heart);
  expect(rootbreadCharm.bonuses.Will).toBeGreaterThanOrEqual(lanternPin.bonuses.Will);
  expect(rootbreadSkill.baseHeal).toBeGreaterThan(lanternSkill.baseHeal);
  expect(rootbreadSkill.baseGuard).toBeGreaterThan(lanternSkill.baseGuard);
  expect(rootbreadSkill.cooldown).toBeLessThan(lanternSkill.cooldown);

  const hero = buildPlayer({ name: "Liam", gender: "Male", raceId: "human" });
  hero.inventory.rootbread_charm = 1;
  hero.equipment.trinket1 = "rootbread_charm";
  const stats = getDerivedStats(hero);
  const equippedSkill = buildCombatSkill("rootbread_respite", stats);
  const lanternBaseline = buildCombatSkill("roadwarden_resolve", stats);

  expect(getEquippedSkillIds(hero)).toContain("rootbread_respite");
  expect(equippedSkill?.baseHeal).toBeGreaterThan(lanternBaseline?.baseHeal || 0);
  expect(equippedSkill?.baseGuard).toBeGreaterThan(lanternBaseline?.baseGuard || 0);
});

test("checked-in Chapter 3 complete save is Chapter 4 ready without requiring Rootbread", () => {
  const saveText = readFileSync(
    new URL("../public/saves/chapter-3-complete.json", import.meta.url),
    "utf8",
  );
  const imported = parseDiskSaveText(saveText);
  const payload = imported.payload;

  expect(imported.name).toBe("Chapter 3 Complete - Chapter 4 Ready");
  expect(validateChapter4ReadyPayload(payload)).toEqual([]);
  expect(getChapterProgress(payload.flags)).toMatchObject({
    currentChapterId: 4,
    completedChapterIds: [1, 2, 3],
  });
  expect(buildQuestJournal(payload.flags, payload.companion, payload.region).currentMain.id).toBe(
    "ch3-complete",
  );
  expect(payload.flags.rootbreadPromiseKept).toBe(true);
  expect(payload.player.inventory.rootbread_charm).toBe(1);
  expect(Object.values(payload.player.equipment)).not.toContain("rootbread_charm");

  const noRootbreadPayload = structuredClone(payload);
  ([
    "lumeMentionedRootbread",
    "lumeAskedLio",
    "lumeAskedHospitality",
    "lumeAskedPromise",
    "rootbreadLeadLearned",
    "metRootbreadChild",
    "rootbreadChildAskedWhen",
    "rootbreadChildAskedSafety",
    "rootbreadPromiseKept",
    "lioKnotFound",
  ] as const).forEach((flag) => {
    noRootbreadPayload.flags[flag] = false;
  });
  delete noRootbreadPayload.player.inventory.rootbread_charm;
  expect(validateChapter4ReadyPayload(noRootbreadPayload)).toEqual([]);
});

test("Chapter 4 executable contract is complete and keeps optional routes optional", () => {
  expect(validateChapter4Contract()).toEqual([]);
  expect(CHAPTER_4_CONTRACT.entry.fixture).toBe("/saves/chapter-3-complete.json");
  expect(CHAPTER_4_CONTRACT.entry.requiredFlags).toContain("chapterThreeClear");
  expect(CHAPTER_4_CONTRACT.requiredEndFlags).toContain("briarholdLeadFound");
  expect(CHAPTER_4_CONTRACT.requiredEndFlags).not.toContain("captivePorterHelped");
  expect(CHAPTER_4_OPTIONAL_FLAGS).toContain("captivePorterHelped");
  expect(CHAPTER_4_CONTRACT.requiredEndFlags).not.toContain("rootbreadPromiseKept");
  expect(GATEWRIGHT_WEAPON_CONTRACT).toMatchObject({
    purchaseRequired: false,
    accessRequired: true,
    durability: false,
    availableBeforeRegion: "underway",
  });
});

test("Chapter 4 save migration infers prerequisite Folded Map state", () => {
  expect(migrateFlags({ foldedMapDecoded: true })).toMatchObject({
    chapterFourStarted: true,
    foldedMapAttempted: true,
    foldedMapDecoded: true,
  });
  expect(migrateFlags({ foldedMapDeeperSolved: true })).toMatchObject({
    chapterFourStarted: true,
    foldedMapAttempted: true,
    foldedMapDecoded: true,
    foldedMapDeeperSolved: true,
  });
  expect(migrateFlags({ gatewrightWeaponPurchased: true })).toMatchObject({
    gatewrightMet: true,
    gatewrightWeaponPurchased: true,
  });
});

test("Folded Map state separates mistake, route decode, deeper solve, and one-time reward", () => {
  const initial = buildDefaultFlags();
  const cleanDecode = resolveFoldedMapPair(initial, "survey_lantern", "keeper_lantern");
  expect(cleanDecode).toMatchObject({
    outcome: "true-route",
    flags: {
      chapterFourStarted: true,
      foldedMapAttempted: true,
      foldedMapDecoded: true,
    },
  });
  expect(cleanDecode.flags.foldedMapMaintenanceDetour).toBeUndefined();
  expect(cleanDecode.flags.foldedMapFirstAttemptMistake).toBeUndefined();

  const mistake = resolveFoldedMapPair(initial, "survey_lantern", "crown_shortcut");
  expect(mistake).toMatchObject({
    outcome: "false-shortcut",
    flags: {
      chapterFourStarted: true,
      foldedMapAttempted: true,
      foldedMapFirstAttemptMistake: true,
      foldedMapMaintenanceDetour: true,
    },
  });

  const afterMistake = { ...initial, ...mistake.flags };
  const decoded = resolveFoldedMapPair(afterMistake, "survey_lantern", "keeper_lantern");
  expect(decoded.outcome).toBe("true-route");
  expect(decoded.flags.foldedMapDecoded).toBe(true);
  expect(decoded.flags.foldedMapMaintenanceDetour).toBeUndefined();

  const afterDecode = { ...afterMistake, ...decoded.flags };
  const deeper = resolveFoldedMapPair(afterDecode, "root_arrow", "broken_bridge");
  expect(deeper.outcome).toBe("deeper-solve");
  expect(deeper.flags.foldedMapDeeperSolved).toBe(true);

  const hero = buildPlayer({ name: "Liam", gender: "Male", raceId: "human" });
  const firstClaim = claimFoldedMapCache(hero, { ...afterDecode, ...deeper.flags });
  expect(firstClaim.claimed).toBe(true);
  expect(firstClaim.player.inventory.lanternwell_drop).toBe(1);
  const secondClaim = claimFoldedMapCache(firstClaim.player, {
    ...afterDecode,
    ...deeper.flags,
    foldedMapCacheClaimed: true,
  });
  expect(secondClaim.claimed).toBe(false);
  expect(secondClaim.player.inventory.lanternwell_drop).toBe(1);
});

test("Gatewright Hookblade is an affordable Chapter 4 upgrade without durability", () => {
  const hookblade = ITEM_DB.gatewright_hookblade;
  const hammer = ITEM_DB.pebbleknock_hammer;
  const hero = buildPlayer({ name: "Liam", gender: "Male", raceId: "human" });
  hero.gold = 78;
  hero.inventory.pebbleknock_hammer = 1;
  hero.equipment.weapon = "pebbleknock_hammer";

  expect(hookblade).toMatchObject({
    rarity: "Rare",
    slot: "weapon",
    bonuses: { Might: 2, Precision: 2, Craft: 1 },
    skills: ["keeper_gatehook"],
  });
  expect(Object.values(hookblade.bonuses).reduce((sum, value) => sum + value, 0)).toBeGreaterThan(
    Object.values(hammer.bonuses).reduce((sum, value) => sum + value, 0),
  );
  expect(getGatewrightOfferPrice()).toBe(32);

  const purchase = purchaseGatewrightWeapon(hero, buildDefaultFlags());
  expect(purchase.purchased).toBe(true);
  expect(purchase.player.gold).toBe(46);
  expect(purchase.player.inventory.gatewright_hookblade).toBe(1);
  expect(purchase.player.equipment.weapon).toBe("pebbleknock_hammer");
  expect(purchase.flags).toEqual({
    gatewrightMet: true,
    gatewrightWeaponPurchased: true,
  });

  const hammerSkill = buildCombatSkill("pebbleknock_slam", getDerivedStats(hero));
  const hookbladeHero = {
    ...purchase.player,
    equipment: { ...purchase.player.equipment, weapon: "gatewright_hookblade" },
  };
  const hookbladeSkill = buildCombatSkill("keeper_gatehook", getDerivedStats(hookbladeHero));
  expect(hookbladeSkill?.sides).toBe(hammerSkill?.sides);
  expect(hookbladeSkill?.computedBonus).toBeGreaterThan(hammerSkill?.computedBonus || 0);
});

test("save migrations normalize older payloads before load", () => {
  const player = buildPlayer({
    name: "Old Liam",
    gender: "Male",
    raceId: "human",
  });
  const oldPayload = {
    screen: "play",
    player: {
      ...player,
      humanHeritageId: undefined,
      appearanceId: undefined,
    },
    region: "westrootTrail",
    position: { x: 6, y: 3 },
    visited: {},
    companion: buildDefaultCompanion(),
    flags: {
      reportedSatchelToMira: true,
      chapterReported: true,
      chapterTwoClear: true,
      roadwatcherCleared: true,
      crownDenCleared: true,
    },
    quest: null,
    toast: "",
  } as SavePayload;

  const migrated = migrateSavePayload(oldPayload, 1);
  expect(SAVE_FILE_VERSION).toBe(2);
  expect(migrated.position).toEqual({ x: 6, y: 4 });
  expect(migrated.visited.westrootTrail["6,4"]).toBe(true);
  expect(migrated.player.humanHeritageId).toBe(DEFAULT_HUMAN_HERITAGE_ID);
  expect(migrated.player.appearanceId).toBe("default");
  expect(migrated.flags).toMatchObject({
    reportedSatchelToElder: true,
    chapterTwoClear: true,
    chapterTwoStarted: true,
    westrootGateOpened: true,
    roadwatcherDefeated: true,
    crownDoorDungeonCleared: true,
    lioAlivePastGate: true,
    eddensDrawingValidated: true,
    briarCrownWatchingWestroot: true,
  });
  expect(getChapterProgress(migrated.flags).currentChapterId).toBe(3);

  const oldChapter3Flags = migrateFlags({
    chapterThreeStarted: true,
    metBramwell: true,
    metQuill: true,
    metNoma: true,
    witnessStoneSequenceSolved: true,
  });
  expect(oldChapter3Flags.westrootHoldBellRung).toBe(true);
  expect(oldChapter3Flags.splitHallDebateHeard).toBe(true);
  expect(oldChapter3Flags.nomaIntroducedWitnessStones).toBe(true);

  const oldRootbreadFlags = migrateFlags({
    chapterThreeStarted: true,
    metAuntieLume: true,
  });
  expect(oldRootbreadFlags.lumeMentionedRootbread).toBe(true);
  expect(oldRootbreadFlags.rootbreadLeadLearned).toBe(true);
});

test("progression and default map state stay compatible with chapter one", () => {
  expect(getHeroXpTarget(1)).toBe(32);
  expect(addBonuses({ Heart: 3 }, { Heart: 1 })).toEqual({ Heart: 4 });

  const hero = buildPlayer({ name: "Liam", gender: "Male", raceId: "human" });
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
  expect(getMapVisualConfig("rootCellar").fogRevealAreas?.map((area) => area.id)).toEqual([
    "entrance-alcove",
    "root-sigil-chamber",
    "upper-store-room",
    "route-mural-room",
    "glowcap-chamber",
    "cellar-cache-room",
    "lower-root-chamber",
    "guardian-vault",
  ]);
  expect(MAPS.hearthhollow.tiles[4][2]).toBe("grass");
  expect(MAPS.hearthhollow.tiles[2][5]).toBe("baker");
  expect(MAPS.hearthhollow.tiles[2][3]).toBe("home_door");
  expect(MAPS.hearthhollow.tiles[6][2]).toBe("grass");
  expect(MAPS.hearthhollow.tiles[6][1]).toBe("potion_door");
  expect(MAPS.hearthhollow.tiles[6][11]).toBe("chest");
  expect(MAPS.hearthhollow.tiles[5][10]).toBe("tree");
  expect(MAPS.hearthhollow.tiles[5][11]).toBe("tree");
  expect(MAPS.hearthhollow.tiles[4][6]).toBe("well");
  expect(MAPS.hearthhollow.tiles[4][4]).toBe("weaver");
  expect(MAPS.hearthhollow.tiles[8][10]).toBe("grass");
  expect(MAPS.hearthhollow.tiles[8][11]).toBe("grass");
  expect(
    MAPS.hearthhollow.tiles[9].every((tile, x) =>
      x === 6 ? tile === "gate" : TILE_META[tile]?.blocked,
    ),
  ).toBe(true);
  expect(TILE_META.well.blocked).toBe(false);
  expect(isBlockedInteractionTile("well")).toBe(false);
  expect(MAPS.bramblecross.tiles[2][6]).toBe("watch_door");
  expect(MAPS.bramblecross.backgroundImage).toContain("bramblecross-town-map-v02");
  expect(MAPS.bramblecross.tiles[4][7]).toBe("fenced_yard");
  expect(MAPS.bramblecross.tiles[5][7]).toBe("board");
  expect(
    getMapNodePoint(
      "bramblecross",
      7,
      5,
      MAPS.bramblecross.tiles[0].length,
      MAPS.bramblecross.tiles.length,
    ),
  ).toEqual({ x: 54.8, y: 47.5 });
  [
    ...Array.from({ length: 9 }, (_, index) => [3 + index, 9]),
    ...Array.from({ length: 9 }, (_, index) => [3 + index, 6]),
    ...Array.from({ length: 3 }, (_, index) => [10, 4 + index]),
    ...Array.from({ length: 4 }, (_, index) => [3, 6 + index]),
    ...Array.from({ length: 4 }, (_, index) => [11, 6 + index]),
  ].forEach(([x, y]) => {
    const tile = MAPS.bramblecross.tiles[y][x];
    expect(TILE_META[tile]?.blocked).toBe(false);
    if (!(x === 6 && y === 9)) {
      expect(tile).toBe("road");
    }
  });
  expect(MAPS.bramblecross.tiles[7][6]).toBe("road");
  expect(MAPS.bramblecross.tiles[8][6]).toBe("road");
  [
    [4, 7],
    [4, 8],
    [5, 8],
    [7, 8],
    [8, 7],
    [8, 8],
    [5, 4],
    [3, 4],
    [8, 4],
    [8, 5],
    [8, 2],
  ].forEach(([x, y]) => {
    const tile = MAPS.bramblecross.tiles[y][x];
    expect(tile).toBe("fenced_yard");
    expect(TILE_META[tile]?.blocked).toBe(true);
  });
  expect(MAPS.bramblecross.tiles[5][3]).toBe("cellar");
  expect(MAPS.bramblecross.tiles[6][5]).toBe("road");
  expect(
    getMapNodePoint(
      "bramblecross",
      3,
      5,
      MAPS.bramblecross.tiles[0].length,
      MAPS.bramblecross.tiles.length,
    ),
  ).toEqual({ x: 25.2, y: 49.7 });
  expect(TILE_META[MAPS.bramblecross.tiles[7][5]].blocked).toBe(true);
  expect(TILE_META[MAPS.bramblecross.tiles[8][2]].blocked).toBe(true);
  expect(MAPS.lanternRoad.start).toEqual({ x: 0, y: 7 });
  expect(MAPS.lanternRoad.tiles[1][7]).toBe("ruins");
  expect(MAPS.lanternRoad.tiles[2][11]).toBe("cart");
  expect(MAPS.lanternRoad.tiles[4][11]).toBe("chest2");
  expect(MAPS.lanternRoad.tiles[7][11]).toBe("bramblecross");
  expect(MAPS.lanternRoad.tiles[7][7]).toBe("wildbattle");
  expect(MAPS.lanternRoad.tiles[6][2]).toBe("pond");
  expect(TILE_META.pond.blocked).toBe(false);
  expect(isBlockedInteractionTile("pond")).toBe(false);
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
    "HOLD ALL COURIERS FOR INSPECTION. AWAIT CROWN AUTHORITY.",
  );
  expect(BATTLE_REWARDS.boar.text).not.toContain("STIR PANIC");
  expect(BATTLE_REWARDS.boar.text).toContain(
    "Whoever cut it loose did not want him arriving at all.",
  );
  expect(BATTLE_REWARDS.boar.artKey).toBe("courierSatchel");
  expect(DIALOGUE_SCENE_ART.courierSatchel.src).toContain(
    "courier-satchel-evidence-scene-v01",
  );
  expect(DIALOGUE_SCENE_ART.watchhouseEvidenceBoard).toMatchObject({
    id: "watchhouse-evidence-board",
    focusX: 25,
    zoom: 175,
  });
  expect(DIALOGUE_SCENE_ART.watchhouseWallMap.src).toBe(
    DIALOGUE_SCENE_ART.watchhouseEvidenceBoard.src,
  );
  expect(DIALOGUE_SCENE_ART.rootCellarSigil.src).toContain(
    "root-cellar-evidence-wall-scene-v01",
  );
  expect(DIALOGUE_SCENE_ART.rootCellarMural.src).toBe(
    DIALOGUE_SCENE_ART.rootCellarSigil.src,
  );
  expect(DIALOGUE_SCENE_ART.chapterOneEnding).toMatchObject({
    id: "chapter-one-ending",
    alt: expect.stringContaining("defeated Briar Knot Warden"),
  });
  expect(DIALOGUE_SCENE_ART.chapterOneEnding.src).toContain(
    "chapter-1-ending-the-road-that-lied-v01",
  );
  expect(DIALOGUE_SCENE_ART.briarCrownMark).toMatchObject({
    id: "briar-crown-mark",
    presentation: "emblem",
  });
  expect(DIALOGUE_SCENE_ART.briarCrownMark.src).toContain(
    "briar-crown-primary-mark-v01",
  );
  expect(MAPS.rootCellar.completedBackgroundImage).toContain(
    "root-cellar-no-boss-map-v01",
  );

  expect(CHAPTER_1_STORY.reportBack.hollisReceivesClothMessages.map((m) => m.text)).toContain(
    "He was hurt enough to be right.",
  );
  expect(CHAPTER_1_STORY.reportBack.closingChoices).toContain(
    "The Briar Crown won't get to bury this.",
  );
  expect(CHAPTER_1_STORY.rootCellar.completionTableau).toContain(
    "The battle is over. The road beneath Bramblecross is only beginning to speak.",
  );
  expect(CHAPTER_1_STORY.reportBack.westrootLead).toContain(
    "Mara Brindle knows Lio's private courier marks.",
  );
  expect(CHAPTER_1_STORY.reportBack.westrootLead).toContain(
    "leaves a deliberate space between them for Edden's testimony",
  );
  expect(CHAPTER_1_STORY.reportBack.westrootLead).not.toContain(
    "Edden's charcoal drawing",
  );
  expect(CHAPTER_1_STORY.reportBack.expeditionReady).toContain(
    "The report and the plan have become the same piece of work.",
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

test("story writing rules keep singular character pronouns explicit", () => {
  const writingRules = readFileSync(resolve("docs/story/writing-rules.md"), "utf8");
  expect(writingRules).toContain("Use **they/them/their** only for a clearly plural antecedent");
  expect(writingRules).toContain("| Moss Fenmere | Male | he/him/his |");
  expect(writingRules).toContain("| Noma Greenstill | Female | she/her/her |");
  expect(writingRules).toContain("| Quill Pebbleturn | Male | he/him/his |");
  expect(COMPANION_OPTIONS.moss.pronouns).toEqual({
    subject: "he",
    object: "him",
    possessive: "his",
  });

  const currentStorySources = [
    "src/story/chapter1.ts",
    "src/story/chapter2.ts",
    "src/story/chapter3.ts",
    "src/components/modals.tsx",
    "docs/story/chapter-1-story-script.md",
    "docs/story/chapter-2-story-script.md",
    "docs/story/chapter-3-story-script.md",
  ].map((path) => readFileSync(resolve(path), "utf8")).join("\n");

  [
    "Moss closes their",
    "Moss looks at you as if they",
    "Quill stills their",
    "Quill places their",
    "Noma inclines their",
    "Noma keeps their",
    "The Cargo Runner looks less angry than alarmed. They",
    "“They ran west,” Mara says",
  ].forEach((disallowedCopy) => expect(currentStorySources).not.toContain(disallowedCopy));
});

test("every Bramblecross contact choice produces the guarded Split Hall compact", () => {
  expect(Object.keys(BRAMBLECROSS_CONTACT_CHOICES)).toEqual([
    "enna",
    "hollis",
    "anwen",
    "all",
  ]);

  Object.keys(BRAMBLECROSS_CONTACT_CHOICES).forEach((choice) => {
    const resolution = getSplitHallResolution(
      choice as keyof typeof BRAMBLECROSS_CONTACT_CHOICES,
    );
    expect(resolution).toContain("Westroot restores one surface compact: Bramblecross.");
    expect(resolution).toContain("The room answers with a single audible gasp.");
    expect(resolution).toContain("She was right.");
    expect(resolution).toContain("The First Gate stays guarded.");
  });
});

test("the boar reveal must be reported to Elder Brynn before the Lio search begins", () => {
  const companion = buildDefaultCompanion();
  const afterBoar = buildQuestJournal(
    {
      ...buildDefaultFlags(),
      metElder: true,
      homeStashClaimed: true,
      gotSmithGift: true,
      beatGateBattle: true,
    },
    companion,
  );

  expect(afterBoar.currentMain).toMatchObject({
    id: "elder-report",
    title: "Bring Lio's Satchel to Elder Brynn",
  });

  const afterElder = buildQuestJournal(
    {
      ...buildDefaultFlags(),
      metElder: true,
      homeStashClaimed: true,
      gotSmithGift: true,
      beatGateBattle: true,
      reportedSatchelToElder: true,
    },
    companion,
  );

  expect(afterElder.currentMain).toMatchObject({
    id: "lio",
    title: "Find What Happened to Lio Brindle",
  });
  expect(afterElder.currentMain.detail).toContain("report it in Bramblecross");
});

test("Smith Orin's weapon supersedes the optional hatchet pickup", () => {
  const journal = buildQuestJournal(
    {
      ...buildDefaultFlags(),
      metElder: true,
      homeStashClaimed: false,
      gotSmithGift: true,
    },
    buildDefaultCompanion(),
  );

  expect(journal.mainSteps.find((step) => step.id === "prepare")).toMatchObject({
    done: true,
    active: false,
  });
  expect(journal.currentMain).toMatchObject({
    id: "boar",
    title: "Stop the Bramble Boar",
  });
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

  expect(CHAPTER_STORY_PLANS[2].keyLines).toContain("Back first. Old side listens behind.");
  expect(CHAPTER_STORY_PLANS[5].keyLines).toContain("It was not supposed to wake yet.");
});

test("art backlog tracks full illustrated prototype scope", () => {
  const expectedHeroVariants =
    (RACES.length - 1) * GENDERS.length +
    HUMAN_HERITAGES.length * GENDERS.length;
  expect(Object.keys(HERO_VARIANT_ARTWORK_PLAN)).toHaveLength(expectedHeroVariants);
  expect(Object.keys(PLAYER_HERO_ARTWORK)).toHaveLength(expectedHeroVariants);
  RACES.forEach((race) => {
    if (race.id === "human") {
      HUMAN_HERITAGES.forEach((heritage) => {
        GENDERS.forEach((gender) => {
          const normalizedGender = gender.toLowerCase();
          const plan = HERO_VARIANT_ARTWORK_PLAN[
            `hero_human_${heritage.id}_${normalizedGender}`
          ];
          const artwork = getPlayerArtworkBySelection(
            "human",
            gender,
            heritage.id,
          );
          expect(plan).toBeTruthy();
          expect(plan.status).toBe("available");
          expect(plan.label).toContain(`${heritage.name} Human ${gender}`);
          expect(artwork?.src).toContain(
            `human-${heritage.id}-${normalizedGender}`,
          );
          expect(artwork?.alt).toContain(`${heritage.name} Human ${gender}`);
        });
      });
      expect(getPlayerArtworkBySelection("human", "Male")?.src).toContain(
        "human-rainroot-male",
      );
      return;
    }

    GENDERS.forEach((gender) => {
      const normalizedGender = gender.toLowerCase();
      const plan = HERO_VARIANT_ARTWORK_PLAN[`hero_${race.id}_${normalizedGender}`];
      const artwork = getPlayerArtworkBySelection(race.id, gender);
      expect(plan).toBeTruthy();
      expect(plan.status).toBe("available");
      expect(artwork?.src).toContain(`${race.id}-${normalizedGender}`);
      expect(artwork?.alt).toContain(`${race.name} ${gender}`);
    });
  });

  expect(ARTWORK_PLAN_GROUPS.maps.westroot_trail.status).toBe("available");
  expect(ARTWORK_PLAN_GROUPS.portraits.mara.status).toBe("available");
  expect(ARTWORK_PLAN_GROUPS.enemies.false_sign_scratcher.status).toBe("available");
  expect(ARTWORK_PLAN_GROUPS.maps.briarhold_waystation.chapter).toBe(5);
  expect(ARTWORK_PLAN_GROUPS.symbols.briar_crown_symbols).toMatchObject({
    fallback: "crown emoji",
    status: "available",
  });
  expect(getArtworkBacklog().some((entry) => entry.category === "hero")).toBe(false);
  expect(getArtworkBacklog().some((entry) => entry.id === "bracken_voss")).toBe(true);
});

test("future chapter data IDs exist with fallbacks", () => {
  [
    "rootbread_charm",
    "witness_stone_rubbing",
    "cargo_transfer_tag",
    "folded_map_scrap",
    "lanternwell_drop",
    "true_seal_fragment",
    "briar_chain_link",
    "lios_courier_knot",
    "split_crown_slat",
    "briar_signmaker_ledger",
    "cleaned_lantern_mark",
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
  expect(ENEMY_DB.briar_roadwatcher.artwork?.src).toContain("briar-roadwatcher-v02");
  expect(ENEMY_DB.false_sign_scratcher.artwork?.src).toContain("false-sign-scratcher-v02");

  expect(ENCOUNTERS.roadwatcher).toContain("thorn_collared_hound");
  expect(ENCOUNTERS.roadwatcherHard).toContain("thorn_collared_hound");
  expect(ENCOUNTERS.crownDenGuard.filter((id) => id === "false_sign_scratcher")).toHaveLength(2);
  expect(ENCOUNTERS.crownDenGuard).toContain("thorn_collared_hound");
  expect(ENCOUNTERS.crownDenPatrol).toEqual(["false_sign_scratcher", "false_sign_scratcher"]);
  expect(ENCOUNTERS.crownDenHound).toEqual(["thorn_collared_hound"]);
  expect(ENCOUNTERS.briarholdBoss).toContain("bracken_voss");
  expect(BATTLE_REWARDS.crownDenHound.flagUpdate).toMatchObject({
    crownDoorCollarsBroken: true,
    crownDenHoundDefeated: true,
  });
  expect(BATTLE_REWARDS.crownDenPatrol.flagUpdate).toMatchObject({
    crownDenPatrolDefeated: true,
    crownDenAlertLevel: 0,
  });
  expect(BATTLE_REWARDS.roadwatcher.extraItems).toContain("split_crown_slat");
  expect(BATTLE_REWARDS.roadwatcher.flagUpdate).toMatchObject({
    roadwatcherDefeated: true,
    roadwatcherEvidenceFound: true,
    briarCrownWatchingWestroot: true,
    crownDoorKeyFound: true,
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
    readyForRoadwatcher: true,
    readyToOpen: false,
  });
  expect(getWestrootDoorRepairState({ ...cleanFlags, crownDoorDungeonCleared: true })).toMatchObject({
    crownFalsehoodCleared: true,
    readyForRoadwatcher: true,
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
  expect(CHAPTER_2_SCENE_COPY.threeDoorThreshold.text).toContain("three doors");
  expect(CHAPTER_2_SCENE_COPY.crownDoorDen.falseMap.result).toContain("cleaned lantern mark");
  expect(CHAPTER_2_SCENE_COPY.westrootGate.completeText).toContain("Let's be someone");
  expect(CHAPTER_2_SCENE_COPY.westrootGate.completeText).toContain("Lio came this way");
  expect(CHAPTER_2_SCENE_COPY.westrootGate.completeSceneAlt).toContain("oval-topped");
  expect(CHAPTER_2_SCENE_COPY.westrootGate.completeSceneAlt).not.toMatch(/hero|Mara/i);
  expect(getChapter2CompanionRead("threshold", "tilda")).toContain("rude, suspicious");
  expect(getCrownDoorText({ crownDoorDungeonCleared: true })).toContain("workshop");
  expect(CHAPTER_STORY_PLANS[2].keyLines.join(" ")).not.toContain("Princess Elowen");
  expect(MAPS.westrootTrail.backgroundImage).toContain("westroot-trail-map-v04");
  expect(MAPS.crownDoorDen.backgroundImage).toContain("crown-door-den-map-v01");
  expect(MAP_ARTWORK_PLAN.crown_door_den.status).toBe("available");
  expect(MAPS.crownDoorDen.tiles.flat()).toEqual(
    expect.arrayContaining([
      "crown_den_exit",
      "wax_table",
      "slat_rack",
      "witness_ledger",
      "collar_kennel",
      "false_map",
      "den_guard",
    ]),
  );
  expect(getMapVisualConfig("crownDoorDen")).toMatchObject({
    aspectRatio: "16 / 9",
    completedFogOpacity: 0.18,
  });
  expect(getNavigationNodeKeys("crownDoorDen")).toEqual(
    expect.arrayContaining([
      "1,0",
      "1,1",
      "2,1",
      "2,2",
      "3,1",
      "4,2",
      "5,0",
      "5,2",
      "5,3",
      "3,3",
      "1,3",
      "1,4",
      "2,4",
      "3,0",
      "3,2",
    ]),
  );
  expect(areMapNodesConnected("crownDoorDen", { x: 1, y: 1 }, { x: 2, y: 1 })).toBe(true);
  expect(areMapNodesConnected("crownDoorDen", { x: 3, y: 1 }, { x: 3, y: 0 })).toBe(true);
  expect(areMapNodesConnected("crownDoorDen", { x: 5, y: 1 }, { x: 5, y: 0 })).toBe(true);
  expect(areMapNodesConnected("crownDoorDen", { x: 3, y: 2 }, { x: 2, y: 2 })).toBe(true);
  expect(areMapNodesConnected("crownDoorDen", { x: 2, y: 2 }, { x: 2, y: 3 })).toBe(true);
  expect(areMapNodesConnected("crownDoorDen", { x: 5, y: 1 }, { x: 4, y: 2 })).toBe(true);
  expect(areMapNodesConnected("crownDoorDen", { x: 4, y: 2 }, { x: 5, y: 2 })).toBe(true);
  expect(areMapNodesConnected("crownDoorDen", { x: 1, y: 3 }, { x: 1, y: 4 })).toBe(true);
  expect(areMapNodesConnected("crownDoorDen", { x: 3, y: 3 }, { x: 4, y: 3 })).toBe(true);
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

test("hand-authored map navigation graphs pass reusable validation", () => {
  const results = validateAllMapNavigationGraphs();
  expect(results.map((result) => result.region).sort()).toEqual([
    "crownDoorDen",
    "rootCellar",
    "westrootHub",
    "westrootTrail",
  ]);
  results.forEach((result) => {
    expect(result.issues).toEqual([]);
    expect(result.ok).toBe(true);
  });
});

test("reusable game QA checks pass without rendering App", () => {
  const qaResults = runGameQaChecks({
    flags: buildDefaultFlags(),
    player: buildPlayer({ name: "QA Liam", gender: "Male", raceId: "human" }),
  });

  expect(qaResults.filter((result) => !result.ok)).toEqual([]);
  expect(qaResults.map((result) => result.label)).toEqual(
    expect.arrayContaining([
      "Hearthhollow placement tweaks are tuned",
      "Root Cellar uses walkable-only graph nodes",
      "Westroot Trail navigation graph validates",
      "Chapter 2 clean and messy outcomes diverge",
    ]),
  );
});

test("asset audit command and export guidance are documented", () => {
  const scriptUrl = new URL("../scripts/audit-assets.mjs", import.meta.url);
  const optimizerUrl = new URL("../scripts/optimize-assets.mjs", import.meta.url);
  const manifest = readFileSync(
    new URL("../docs/art/asset-manifest.md", import.meta.url),
    "utf8",
  );

  expect(existsSync(scriptUrl)).toBe(true);
  expect(existsSync(optimizerUrl)).toBe(true);
  expect(readFileSync(scriptUrl, "utf8")).toContain("Production asset audit");
  expect(readFileSync(optimizerUrl, "utf8")).toContain("optimization-manifest.json");
  expect(manifest).toContain("npm.cmd run audit:assets");
  expect(manifest).toContain("npm.cmd run optimize:assets");
  expect(manifest).toContain("assets/reference/source-art");
  expect(manifest).toContain("Production Export Discipline");
  expect(manifest).toContain("Playable maps");
});
