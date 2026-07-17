import { GENDERS, HUMAN_HERITAGES, RACES } from "../data/character";
import { COMPANION_OPTIONS } from "../data/companions";
import { HERO_VARIANT_ARTWORK_PLAN, MAP_ARTWORK_PLAN } from "../data/artworkPlan";
import { BATTLE_CONSUMABLES, ITEM_DB } from "../data/items";
import { MAPS, TILE_META } from "../data/maps";
import { getNavigationNodeKeys } from "../data/mapVisuals";
import { RECIPE_DB } from "../data/recipes";
import { SHOP_INVENTORIES } from "../data/shops";
import { SKILL_DB } from "../data/skills";
import { CHAPTER_STORY_PLANS } from "../story/chapters2to5";
import { getChapterProgress } from "./chapterProgress";
import { getActiveGuestNpc } from "./guestNpcs";
import { isBlockedInteractionTile } from "./map";
import { validateAllMapNavigationGraphs } from "./mapValidation";
import { getHeroXpTarget } from "./progression";
import { buildDefaultFlags } from "./state";
import type { Flags, Player } from "./types";
import { getWestrootPuzzleOutcome } from "../story/chapter2";

export type QaResult = {
  ok: boolean;
  label: string;
  detail?: string;
};

export type RuntimeQaCheck = QaResult;

export type GameQaOptions = {
  flags?: Flags;
  player?: Partial<Player> | null;
  runtimeChecks?: RuntimeQaCheck[];
};

function addResult(results: QaResult[], ok: boolean, label: string, detail = "") {
  results.push({ ok, label, detail });
}

function getQaStoryTile(tile: string, region: string, flags: Flags) {
  if (region === "lanternRoad" && tile === "traveler" && flags.helpedTraveler) return "grass";
  if (region === "rootCellar" && tile === "boss" && flags.beatCellarBoss) return "floor";
  if (region === "crownDoorDen" && tile === "den_guard" && flags.beatCrownDenGuard) {
    return "floor";
  }
  return tile;
}

function getItemSkillIds(item: unknown) {
  const skills = (item as { skills?: string[] }).skills;
  return Array.isArray(skills) ? skills : [];
}

export function runGameQaChecks({
  flags = {},
  player = null,
  runtimeChecks = [],
}: GameQaOptions = {}): QaResult[] {
  const results: QaResult[] = [];

  Object.entries(MAPS).forEach(([, map]) => {
    const width = map.tiles[0].length;
    addResult(
      results,
      map.tiles.every((row) => row.length === width),
      `${map.name} map is rectangular`,
      `${map.tiles.length}x${width}`,
    );

    const missing = [
      ...new Set(map.tiles.flat().filter((tile) => !TILE_META[tile])),
    ];
    addResult(
      results,
      missing.length === 0,
      `${map.name} tiles have metadata`,
      missing.join(", ") || "All tile IDs are known.",
    );
  });

  addResult(
    results,
    MAPS.hearthhollow.tiles[4][2] !== "baker" &&
      MAPS.hearthhollow.tiles[2][5] === "baker" &&
      MAPS.hearthhollow.tiles[2][3] === "home_door" &&
      MAPS.hearthhollow.tiles[6][1] === "potion_door" &&
      MAPS.hearthhollow.tiles[6][11] === "chest" &&
      MAPS.hearthhollow.tiles[5][10] === "tree" &&
      MAPS.hearthhollow.tiles[5][11] === "tree" &&
      MAPS.hearthhollow.tiles[4][6] === "well" &&
      MAPS.hearthhollow.tiles[4][4] === "weaver" &&
      MAPS.hearthhollow.tiles[8][10] === "grass" &&
      MAPS.hearthhollow.tiles[8][11] === "grass" &&
      MAPS.hearthhollow.tiles[9].every(
        (tile, x) => x === 6 ? tile === "gate" : TILE_META[tile]?.blocked,
      ) &&
      !TILE_META.well?.blocked &&
      !isBlockedInteractionTile("well") &&
      MAPS.lanternRoad.tiles[6][2] === "pond" &&
      !TILE_META.pond?.blocked &&
      !isBlockedInteractionTile("pond"),
    "Hearthhollow placement tweaks are tuned",
    "Doors, chest, Sela's gathering spot left of the well, quiet well/pond landmarks, upper-right trees, and south-row gate boundary match the latest map pass.",
  );

  const shopIds = [
    ...new Set([...SHOP_INVENTORIES.smith, ...SHOP_INVENTORIES.market]),
  ];
  addResult(
    results,
    shopIds.every((id) => ITEM_DB[id]),
    "Shop item IDs exist",
    shopIds.filter((id) => !ITEM_DB[id]).join(", ") || "All shop items exist.",
  );

  addResult(
    results,
    Object.values(RECIPE_DB).every(
      (recipe) =>
        ITEM_DB[recipe.resultId] &&
        Object.keys(recipe.ingredients).every((id) => ITEM_DB[id]),
    ),
    "Recipe item IDs exist",
    "Crafting recipes reference known items.",
  );

  addResult(
    results,
    Object.values(COMPANION_OPTIONS).every(
      (option) => option.id && option.style && option.maxHp,
    ),
    "Companion definitions are complete",
    "All companion options include id, style, and HP.",
  );

  addResult(
    results,
    !Object.values(player?.battlePouch || {})
      .filter(Boolean)
      .some((id) => !BATTLE_CONSUMABLES[id]),
    "Battle pouch contains valid consumables",
  );

  addResult(
    results,
    !!ITEM_DB.edden_cloth,
    "Story item exists: Edden's cloth",
    "Chapter 1 ending can award the report-back proof item.",
  );

  addResult(
    results,
    Object.values(ITEM_DB)
      .filter((item) => getItemSkillIds(item).length)
      .every((item) => getItemSkillIds(item).every((id) => SKILL_DB[id])),
    "Item-granted skills resolve",
    "Weapons and trinkets can add combat abilities.",
  );

  const rootCellarNodeKeys = getNavigationNodeKeys("rootCellar");
  const removedCellarFillerNodes = [
    "1,2",
    "1,3",
    "2,3",
    "3,6",
    "4,3",
    "5,3",
    "5,4",
    "9,1",
    "8,2",
    "9,2",
    "8,4",
    "8,7",
    "2,8",
    "10,5",
  ];
  const rootCellarGraphIsWalkable =
    rootCellarNodeKeys.length > 0 &&
    rootCellarNodeKeys.every((key) => {
      const [x, y] = key.split(",").map(Number);
      const tile = MAPS.rootCellar.tiles[y]?.[x];
      return tile && !TILE_META[getQaStoryTile(tile, "rootCellar", flags)]?.blocked;
    }) &&
    removedCellarFillerNodes.every((key) => !rootCellarNodeKeys.includes(key));
  addResult(
    results,
    rootCellarGraphIsWalkable,
    "Root Cellar uses walkable-only graph nodes",
    "The cellar debug overlay now omits black-space filler nodes and keeps movement on linked painted paths.",
  );

  validateAllMapNavigationGraphs().forEach((result) => {
    addResult(
      results,
      result.ok,
      `${MAPS[result.region].name} navigation graph validates`,
      result.issues.map((issue) => issue.message).join("; ") || "Navigation graph passes reusable validation.",
    );
  });

  addResult(
    results,
    typeof getHeroXpTarget === "function" &&
      Array.isArray(HERO_VARIANT_ARTWORK_PLAN) === false &&
      Object.keys(HERO_VARIANT_ARTWORK_PLAN).length >= 1,
    "Hero artwork registry is object-shaped",
    "Hero art backlog can be checked by ancestry, Human heritage, and gender.",
  );

  addResult(
    results,
    getHeroXpTarget(1) === 32,
    "Hero level-up system exists",
    "XP thresholds are available for protagonist progression.",
  );

  addResult(
    results,
    SKILL_DB.roadwarden_resolve?.cooldown === 5,
    "Roadwarden's Resolve has cooldown",
    "Lantern Pin support skill cannot be spammed every turn.",
  );

  addResult(
    results,
    "sawShrine" in buildDefaultFlags(),
    "Lantern Shrine discovery flag exists",
    "Shrine side thread can stay hidden until discovered.",
  );

  addResult(
    results,
    getChapterProgress(flags).currentChapterId >= 1,
    "Chapter progress contract resolves",
    `Current chapter: ${getChapterProgress(flags).currentTitle}.`,
  );

  addResult(
    results,
    [2, 3, 4, 5].every((chapterId) => CHAPTER_STORY_PLANS[chapterId]?.requiredEndFlags?.length),
    "Chapter 2-5 story contracts exist",
    "Later chapters have implementation-facing beats, key lines, required flags, and art targets.",
  );

  addResult(
    results,
    Object.keys(HERO_VARIANT_ARTWORK_PLAN).length ===
      (RACES.length - 1) * GENDERS.length +
        HUMAN_HERITAGES.length * GENDERS.length,
    "Hero variant art backlog covers Human heritages",
    "Hero art is keyed by ancestry, Human heritage, and gender.",
  );

  addResult(
    results,
    MAP_ARTWORK_PLAN.westroot_trail?.status === "available",
    "Westroot Trail painted map is tracked",
    "Chapter 2 map art is registered while fallback behavior remains in place.",
  );

  const guest = getActiveGuestNpc(flags);
  addResult(
    results,
    !guest || (!guest.participatesInBattle && !guest.canTakeDamage),
    "Guest NPCs stay out of combat",
    guest ? `${guest.name} is present as a protected story guest.` : "No active guest NPC.",
  );

  const cleanWestrootOutcome = getWestrootPuzzleOutcome({
    noHandleStoneInspected: true,
    shelterNoticeRemoved: true,
    falseNoticeLensUsed: true,
    lanternSignCleaned: true,
    understandsTrueSigns: true,
    lanternSignCompared: true,
    lioShelterMarkFound: true,
    lioHookMarkFound: true,
  });
  const messyWestrootOutcome = getWestrootPuzzleOutcome({
    noHandleStoneInspected: true,
    shelterNoticeRemoved: true,
    falseNoticeLensUsed: true,
    lanternSignCleaned: true,
    understandsTrueSigns: true,
    lanternSignCompared: true,
    lioShelterMarkFound: true,
    followedFalseDetour: true,
    lioHookMarkFound: true,
    crownSignRejected: true,
  });
  addResult(
    results,
    cleanWestrootOutcome.cleanSolve &&
      cleanWestrootOutcome.roadwatcherMode === "standard" &&
      messyWestrootOutcome.roadwatcherMode === "hard",
    "Chapter 2 clean and messy outcomes diverge",
    "A careful truth-first solve prepares the standard Roadwatcher fight; a false detour escalates to the hard encounter.",
  );

  runtimeChecks.forEach((check) => addResult(results, check.ok, check.label, check.detail));

  return results;
}
