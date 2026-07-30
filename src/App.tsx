import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  AdventureStatusRail,
  AdventureWorkspace,
  CharacterWorkspace,
  MobileAdventureBar,
} from "./components/AdventureShell";
import { MapStage } from "./components/MapStage";
import { Button, ItemIcon, Meter, Panel, StatBadge } from "./components/ui";
import { getBattleReward } from "./data/battleRewards";
import {
  BASE_STATS,
  DEFAULT_HUMAN_HERITAGE_ID,
  GENDERS,
  HERO_GROWTH_OPTIONS,
  HUMAN_HERITAGES,
  RACES,
  STAT_ORDER,
  getHumanHeritage,
} from "./data/character";
import { COMPANION_OPTIONS, getCompanionPronouns } from "./data/companions";
import { buildEncounterEnemies } from "./data/enemies";
import { BATTLE_CONSUMABLES, ITEM_DB } from "./data/items";
import { MAPS, TILE_META } from "./data/maps";
import {
  areMapNodesConnected,
  getNavigationDestination,
  hasNavigationGraph,
} from "./data/mapVisuals";
import { RECIPE_DB } from "./data/recipes";
import { SHOP_INVENTORIES } from "./data/shops";
import { buildQuestJournal } from "./data/quests";
import { HeroArtwork } from "./components/HeroArtwork";
import {
  damageBattleEnemy,
  getLivingEnemies,
  getSelectedBattleEnemy,
  prepareBattleEnemies,
  rotateEnemyIntent,
  tickCooldowns,
} from "./game/battle";
import {
  getCompanionCommandAbility,
  isCompanionConscious,
} from "./game/companions";
import { getChapterProgress } from "./game/chapterProgress";
import { checkSummary, resolveRoll, resolveSkillCheck } from "./game/dice";
import { getActiveGuestNpc } from "./game/guestNpcs";
import {
  canCraftRecipe,
  gainItem,
  getBuyPrice,
  getEquippedCount,
  getInventorySections,
  getSellPrice,
  hasItem,
  itemFitsSlot,
  removeItem,
} from "./game/inventory";
import {
  buildVisitedMap,
  ensureVisitedIncludesPosition,
  getRegionCheckpointLabel,
  isBlockedInteractionTile,
  normalizeMapPosition,
} from "./game/map";
import {
  getCompanionGrowthPreview,
  getCompanionXpTarget,
  getHeroXpTarget,
} from "./game/progression";
import { runGameQaChecks } from "./game/qa";
import {
  CHAPTER_2_PLAYTEST_SAVE_PATH,
  CHAPTER_2_COMPLETE_SAVE_PATH,
  formatDiskSaveFilename,
  getSavePayload,
  parseCheckpointPayload,
  parseDiskSaveText,
  parseSaveSlotRecords,
  serializeDiskSave,
  STORAGE_KEY,
  writeSaveSlotRecords,
} from "./game/save";
import { buildCombatSkill, getEquippedSkillIds } from "./game/skills";
import { getWestrootMapNpcTokens } from "./game/westrootMap";
import {
  buildDefaultCompanion,
  buildDefaultFlags,
  buildDefaultVisited,
  buildPlayer,
  normalizeCompanionData,
  normalizePlayerData,
} from "./game/state";
import { addBonuses, formatBonuses, getDerivedStats } from "./game/stats";
import type { CompanionId, CompanionRoster, Flags, Position } from "./game/types";
import {
  CHAPTER_1_STORY,
  appendChapter1CompanionReaction,
  getChapter1CompanionReaction,
} from "./story/chapter1";
import {
  CHAPTER_2_STORY,
  CHAPTER_2_SCENE_COPY,
  formatDoorNeedsCrownTruthText,
  formatDoorOpensText,
  formatDoorWaitsText,
  formatNoHandleDoorText,
  formatPreparedRoadwatcherText,
  formatWestrootGateText,
  getChapter2CompanionRead,
  getCrownDenFalseMapText,
  getCrownDoorText,
  getCrownSignText,
  getLanternSignText,
  getNoHandleLioText,
  getRoadwatcherEncounterKey,
  getWestrootDoorRepairState,
  getWestrootClueCount,
  getWestrootPuzzleOutcome,
} from "./story/chapter2";
import {
  BRAMBLECROSS_CONTACT_CHOICES,
  CHAPTER_3_SCENE_COPY,
  CHAPTER_3_FULL_SCENE_COPY,
  WITNESS_STONE_LABELS,
  WITNESS_STONE_RESPONSES,
  appendChapter3CompanionReaction,
  getSplitHallResolution,
} from "./story/chapter3";
import type { BramblecrossContactChoice } from "./story/chapter3";

const QuestTab = React.lazy(() =>
  import("./components/tabs").then((module) => ({ default: module.QuestTab })),
);
const InventoryTab = React.lazy(() =>
  import("./components/tabs").then((module) => ({ default: module.InventoryTab })),
);
const EquipmentTab = React.lazy(() =>
  import("./components/tabs").then((module) => ({ default: module.EquipmentTab })),
);
const PouchTab = React.lazy(() =>
  import("./components/tabs").then((module) => ({ default: module.PouchTab })),
);
const CompanionTab = React.lazy(() =>
  import("./components/tabs").then((module) => ({ default: module.CompanionTab })),
);
const RecipesTab = React.lazy(() =>
  import("./components/tabs").then((module) => ({ default: module.RecipesTab })),
);
const DevTab = React.lazy(() =>
  import("./components/tabs").then((module) => ({ default: module.DevTab })),
);

const LevelUpModal = React.lazy(() =>
  import("./components/modals").then((module) => ({ default: module.LevelUpModal })),
);
const DialogueModal = React.lazy(() =>
  import("./components/modals").then((module) => ({ default: module.DialogueModal })),
);
const InteriorModal = React.lazy(() =>
  import("./components/modals").then((module) => ({ default: module.InteriorModal })),
);
const ShopModal = React.lazy(() =>
  import("./components/modals").then((module) => ({ default: module.ShopModal })),
);
const CraftModal = React.lazy(() =>
  import("./components/modals").then((module) => ({ default: module.CraftModal })),
);
const BattleModal = React.lazy(() =>
  import("./components/modals").then((module) => ({ default: module.BattleModal })),
);
const SaveModal = React.lazy(() =>
  import("./components/modals").then((module) => ({ default: module.SaveModal })),
);

function shouldTriggerLanternRoadAmbush(
  region: string,
  flags: Flags,
  position: Position,
) {
  return (
    region === "lanternRoad" &&
    flags.foundRuinNote &&
    !flags.clearedWildBattle &&
    position.x >= 7 &&
    position.y >= 6
  );
}

const threeDoorsThresholdScene = new URL(
  "../assets/scenes/three-doors-threshold-v01.webp",
  import.meta.url,
).href;
const eddensThreeDoorDrawingScene = new URL(
  "../assets/scenes/eddens-three-door-drawing-scene-v01.webp",
  import.meta.url,
).href;
const westrootThresholdOpeningScene = new URL(
  "../assets/scenes/westroot-threshold-opening-v02.webp",
  import.meta.url,
).href;
const westrootArrivalScene = new URL("../assets/scenes/westroot-arrival-scene-v01.webp", import.meta.url).href;
const rootmarketUneasyArrivalScene = new URL(
  "../assets/scenes/rootmarket-uneasy-arrival-scene-v01.webp",
  import.meta.url,
).href;
const witnessStonesScene = new URL(
  "../assets/scenes/witness-stones-public-renewal-scene-v03.webp",
  import.meta.url,
).href;
const rootbreadCheckpointScene = new URL(
  "../assets/scenes/rootbread-transfer-checkpoint-scene-v01.webp",
  import.meta.url,
).href;
const cargoSidingEvidenceScene = new URL(
  "../assets/scenes/cargo-siding-evidence-scene-v01.webp",
  import.meta.url,
).href;
const splitHallHoldDebateScene = new URL(
  "../assets/scenes/split-hall-hold-debate-scene-v01.webp",
  import.meta.url,
).href;
const splitHallResolutionScene = new URL(
  "../assets/scenes/split-hall-resolution-scene-v03.webp",
  import.meta.url,
).href;
const mossgardenClosingMarkScene = new URL(
  "../assets/scenes/mossgarden-closing-mark-scene-v01.webp",
  import.meta.url,
).href;
const willowmarkSealImage = new URL(
  "../assets/icons/ui/willowmark-seal-v02.png",
  import.meta.url,
).href;
const titleKeyArt = new URL(
  "../assets/maps/hearthhollow-gameplay-map-v04.webp",
  import.meta.url,
).href;

const WESTROOT_STORY_POSITIONS = {
  witnessStones: { x: 4, y: 1 },
  splitHallApproach: { x: 6, y: 1 },
  cargoSidingApproach: { x: 7, y: 2 },
} satisfies Record<string, Position>;
const crownDenDistantScratchingIcon = new URL(
  "../assets/icons/ui/crown-den-distant-scratching-icon-v01.png",
  import.meta.url,
).href;
const crownDenChainDragIcon = new URL(
  "../assets/icons/ui/crown-den-chain-drag-icon-v01.png",
  import.meta.url,
).href;
const crownDenHoundWarningIcon = new URL(
  "../assets/icons/ui/crown-den-hound-warning-icon-v01.png",
  import.meta.url,
).href;
const crownDenPatrolCaughtUpIcon = new URL(
  "../assets/icons/ui/crown-den-patrol-caught-up-icon-v01.png",
  import.meta.url,
).href;
const crownDenExitToken = new URL(
  "../assets/icons/map-tokens/crown-den-exit-token-v01.png",
  import.meta.url,
).href;
const crownDenWaxTableToken = new URL(
  "../assets/icons/map-tokens/crown-den-wax-table-token-v01.png",
  import.meta.url,
).href;
const crownDenWaxTableClearedToken = new URL(
  "../assets/icons/map-tokens/crown-den-wax-table-cleared-token-v01.png",
  import.meta.url,
).href;
const crownDenSlatRackToken = new URL(
  "../assets/icons/map-tokens/crown-den-slat-rack-token-v01.png",
  import.meta.url,
).href;
const crownDenSlatRackBrokenToken = new URL(
  "../assets/icons/map-tokens/crown-den-slat-rack-broken-token-v01.png",
  import.meta.url,
).href;
const crownDenWitnessLedgerToken = new URL(
  "../assets/icons/map-tokens/crown-den-witness-ledger-token-v01.png",
  import.meta.url,
).href;
const crownDenWitnessLedgerCopiedToken = new URL(
  "../assets/icons/map-tokens/crown-den-witness-ledger-copied-token-v01.png",
  import.meta.url,
).href;
const crownDenCollarKennelToken = new URL(
  "../assets/icons/map-tokens/crown-den-collar-kennel-token-v01.png",
  import.meta.url,
).href;
const crownDenCollarKennelBrokenToken = new URL(
  "../assets/icons/map-tokens/crown-den-collar-kennel-broken-token-v01.png",
  import.meta.url,
).href;
const crownDenFalseMapToken = new URL(
  "../assets/icons/map-tokens/crown-den-false-map-token-v01.png",
  import.meta.url,
).href;
const crownDenFalseMapClearedToken = new URL(
  "../assets/icons/map-tokens/crown-den-false-map-cleared-token-v01.png",
  import.meta.url,
).href;

const CROWN_DEN_TENSION_STEPS = [
  {
    level: 1,
    label: "Distant scratching",
    src: crownDenDistantScratchingIcon,
  },
  {
    level: 2,
    label: "Chain drag",
    src: crownDenChainDragIcon,
  },
  {
    level: 3,
    label: "Collar warning",
    src: crownDenHoundWarningIcon,
  },
  {
    level: 4,
    label: "Patrol caught up",
    src: crownDenPatrolCaughtUpIcon,
  },
];

const crownDenPortraitImage = (src, alt) => ({ src, alt });

function getVillageNpcDialogue(tile, flags) {
  const lines = {
    baker: flags.metElder
      ? 'Nella has flour dust on one cheek and three half-shaped loaves abandoned on the table behind her. The ovens are still hot, but the bakery has gone quiet in the strange way busy places do when everyone is listening for bad news. "I was baking for the road crews," she says, lowering her voice. "Then the bells started, and folk stopped coming through. If that courier truly vanished, the people behind it are not just scaring us. They\'re cutting us off."'
      : 'Nella the Baker keeps glancing toward the south gate while pretending to rearrange a tray of pear rolls. "The ovens are hot, the bread is rising, and nobody has come by to make fun of my lopsided crusts. That is how I know the morning has gone wrong. Elder Brynn has the face she wears when bad news has boots on. Go find her, dear."',
    farmer: flags.metElder
      ? "Toma Fielding grips his rake like it might become a spear if the day gets any worse. \"Boars I understand. Boars with satchels? Couriers gone missing? That's not field trouble. That's road trouble. If you go out there, watch the ditches. Trouble loves a ditch.\""
      : 'Toma Fielding squints toward the road beyond the trees. "My turnips are nervous, and turnips are famously calm. Elder Brynn\'s been watching the gate since sunrise. Best talk with her before you go poking at anything tusked."',
    weaver: flags.metElder
      ? 'Sela of the Loom holds up a half-finished sash patterned with little lanterns. "Threads tell you when they\'ve been tugged," she says. "This whole village feels tugged today. If you find who is pulling, don\'t just cut the thread. Find the hand."'
      : 'Sela of the Loom sits outside her cottage, shuttle paused in midair. "The south road should be noisy by now. Carts, bells, bad singing. Instead it is listening. Roads should not listen. Find Elder Brynn, love."',
  };
  return (
    lines[tile] ||
    "Everyone in Hearthhollow can feel that the south road has gone wrong."
  );
}

function CrownDenTension({ level, text }) {
  const currentLevel = Math.max(1, Math.min(4, Number(level || 1)));
  const current = CROWN_DEN_TENSION_STEPS[currentLevel - 1];

  return (
    <div className="mb-4 rounded-3xl border border-rose-300/25 bg-rose-950/35 px-4 py-3 text-sm shadow-lg">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-rose-200/25 bg-black/25">
            <img
              src={current.src}
              alt=""
              className="h-full w-full object-contain p-1.5"
            />
          </div>
          <div>
            <div className="font-semibold text-rose-100">
              Signworks closing in
            </div>
            <div className="mt-0.5 text-white/80">{text}</div>
          </div>
        </div>
        <div className="flex gap-1.5 sm:ml-auto">
          {CROWN_DEN_TENSION_STEPS.map((step) => {
            const active = step.level <= currentLevel;
            return (
              <div
                key={step.level}
                className={`flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border ${
                  active
                    ? "border-rose-200/35 bg-rose-300/15"
                    : "border-white/10 bg-black/15 opacity-45"
                }`}
                title={step.label}
              >
                <img
                  src={step.src}
                  alt=""
                  className="h-full w-full object-contain p-1"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getMayorDialogue(flags) {
  if (!flags.ennaBriefed)
    return 'Mayor Anwen stands beside a stack of unread petitions, but her eyes keep moving to the road. "We have missing porters, forged notices, delayed carts, and families asking whether to bolt their doors. I can calm a crowd for an hour. I cannot calm a lie unless someone brings me its shape. Take your road report to Enna inside the watchhouse—the large stone building at the north end of the square. She sees patterns before the rest of us admit they exist."';
  if (flags.chapterReported)
    return 'Mayor Anwen looks west instead of toward the cellar. "Hollis has guards on the entrance, and Enna says the danger beneath us was protecting a road beyond us. Bramblecross can hold its own doors. Follow the Westroot leadâ€”and if Lio Brindle is still on that road, bring him home."';
  if (flags.chapterOneClear)
    return 'Mayor Anwen takes in the cellar mud on your boots and the chain in your hands. "You came back. Good. Hollis and Enna have been waiting in the watchhouse. Tell them what was below us before rumor gets there first."';
  if (flags.beatCellarBoss)
    return 'Mayor Anwen studies the cellar mud on your boots. "Hollis says the guardian fell, but the sealed door still holds the truth you went below to find. Go back for the door before Bramblecross mistakes a defeated monster for a finished investigation."';
  if (!flags.gotDungeonLead)
    return 'Mayor Anwen studies the watchhouse windows. "Enna says your report turned scattered worries into a route case. Good. That means we\'re not losing our minds. Bad, because it means a deliberate mind is behind this. Read what the town knows, then speak with Hollis."';
  return 'Mayor Anwen nods toward the old cellar ways. "If Hollis is sending you below, then Bramblecross is past pretending this is only paperwork. Go carefully. Towns are built on foundations, and foundations remember things."';
}

export default function LiamsGamePrototype() {
  const [screen, setScreen] = useState("title");
  const [createForm, setCreateForm] = useState({
    name: "Liam",
    gender: GENDERS[0],
    raceId: RACES[0].id,
    humanHeritageId: DEFAULT_HUMAN_HERITAGE_ID,
    appearanceId: "",
  });
  const [player, setPlayer] = useState(null);
  const [region, setRegion] = useState("hearthhollow");
  const [position, setPosition] = useState(MAPS.hearthhollow.start);
  const previousPositionByRegionRef = useRef<Partial<Record<string, Position>>>({});
  const [visited, setVisited] = useState(buildDefaultVisited());
  const [companion, setCompanion] = useState(buildDefaultCompanion());
  const [companionRoster, setCompanionRoster] = useState<CompanionRoster>({});
  const companionIsConscious = isCompanionConscious(companion);
  const companionPronouns = getCompanionPronouns(companion.id);
  const [flags, setFlags] = useState(buildDefaultFlags());
  const [quest, setQuest] = useState({
    title: "Talk to Elder Brynn",
    description: "Something strange is happening in Hearthhollow.",
  });
  const [toast, setToast] = useState("Welcome to Hearthhollow.");
  const [lootBanner, setLootBanner] = useState(null);
  const [dialogue, setDialogue] = useState(null);
  const [shopOpen, setShopOpen] = useState(false);
  const [shopMode, setShopMode] = useState("smith");
  const [craftOpen, setCraftOpen] = useState(false);
  const [craftContext, setCraftContext] = useState("potionShed");
  const [interiorScene, setInteriorScene] = useState(null);
  const [battle, setBattle] = useState(null);
  const [tab, setTab] = useState("quests");
  const [adventureMenuOpen, setAdventureMenuOpen] = useState(false);
  const [mapDebug, setMapDebug] = useState(false);
  const [equipmentFocusSlot, setEquipmentFocusSlot] = useState("weapon");
  const [pouchFocusSlot, setPouchFocusSlot] = useState("slot1");
  const [battleItemsOpen, setBattleItemsOpen] = useState(false);
  const [qaResults, setQaResults] = useState([]);
  const [saveSlots, setSaveSlots] = useState(() => parseSaveSlotRecords());
  const [saveNameDrafts, setSaveNameDrafts] = useState(() =>
    Object.fromEntries(
      parseSaveSlotRecords().map((slot) => [slot.id, slot.name || ""]),
    ),
  );
  const [saveModalMode, setSaveModalMode] = useState(null);
  const [levelUpPending, setLevelUpPending] = useState(null);

  useEffect(() => {
    if (!companion.id) return;
    setCompanionRoster((current) => ({
      ...current,
      [companion.id as CompanionId]: companion,
    }));
  }, [companion]);

  const currentMap = MAPS[region].tiles;
  const currentRegionInfo = MAPS[region];
  const derivedStats = useMemo(
    () => (player ? getDerivedStats(player) : BASE_STATS),
    [player],
  );
  const race = useMemo(
    () => RACES.find((r) => r.id === player?.raceId) || RACES[0],
    [player],
  );
  const humanHeritage = useMemo(
    () => getHumanHeritage(player?.humanHeritageId),
    [player],
  );
  const playerAncestryLabel =
    race.id === "human" ? `${humanHeritage.name} Human` : race.name;
  const inventorySections = useMemo(
    () => getInventorySections(player),
    [player],
  );
  const questJournal = useMemo(
    () => buildQuestJournal(flags, companion, region),
    [flags, companion, region],
  );
  const chapterProgress = useMemo(() => getChapterProgress(flags), [flags]);
  const heroXpTarget = getHeroXpTarget(player?.level || 1);
  const getStoryTile = (tile, tileRegion = region) => {
    if (
      tileRegion === "lanternRoad" &&
      tile === "traveler" &&
      flags.helpedTraveler
    )
      return "grass";
    if (tileRegion === "rootCellar" && tile === "boss" && flags.beatCellarBoss)
      return "floor";
    if (tileRegion === "crownDoorDen" && tile === "den_guard" && flags.beatCrownDenGuard)
      return "floor";
    if (tileRegion === "westrootHub" && tile === "cargo_siding" && flags.willowCargoExposed)
      return "westroot_path";
    return tile;
  };
  const rawCurrentTile = currentMap[position.y]?.[position.x] || "grass";
  const currentTile = getStoryTile(rawCurrentTile);
  const currentTileLabel = TILE_META[currentTile]?.label || "Unknown";
  const shouldSkipAutoInspect = (tile) => {
    if (region === "rootCellar") {
      if (tile === "sigil" && flags.readCellarSigil) return true;
      if (tile === "mural" && flags.readCellarMural) return true;
      if (tile === "fungus" && flags.harvestedCellarFungus) return true;
      if (tile === "cache3" && flags.openedCellarCache) return true;
      if (tile === "skulk" && flags.beatCellarSkulk) return true;
      if (tile === "boss" && flags.beatCellarBoss) return true;
      if (tile === "exit_door" && flags.chapterOneClear) return true;
    }
    if (region === "lanternRoad") {
      if (tile === "chest2" && flags.openedWildChest) return true;
      if (tile === "pond" && flags.pondVisited) return true;
      if (tile === "shrine" && flags.usedShrine) return true;
      if (tile === "ruins" && flags.foundRuinNote) return true;
      if (
        tile === "cart" &&
        (flags.boardQuestCompleted ||
          (flags.searchedCart && !flags.boardQuestAccepted))
      )
        return true;
      if (tile === "wildbattle" && flags.clearedWildBattle) return true;
    }
    if (region === "hearthhollow") {
      if (tile === "chest" && flags.openedChest) return true;
      if (tile === "well" && flags.wellVisited) return true;
    }
    if (region === "westrootTrail") {
      if (
        tile === "westroot_cut" &&
        (flags.noHandleStoneInspected
          ? flags.westrootCutCopied
          : flags.westrootCutStudied)
      )
        return true;
      if (tile === "shelter_nook" && flags.shelterNoticeRemoved && flags.lioShelterMarkFound)
        return true;
      if (
        tile === "false_notice" &&
        (flags.falseNoticeLensUsed || flags.falseNoticeLanternRead || flags.followedFalseDetour)
      )
        return true;
      if (tile === "crown_sign" && (flags.crownSignRejected || flags.crownSignLensUsed))
        return true;
      if (tile === "lantern_sign" && flags.lanternSignCleaned && flags.lanternSignCompared)
        return true;
      if (tile === "no_handle_stone" && flags.westrootGateOpened) return true;
      if (tile === "roadwatcher" && (flags.roadwatcherDefeated || flags.roadwatcherEncounterAvoided))
        return true;
      if (tile === "westroot_gate" && flags.chapterTwoClear) return true;
    }
    if (region === "crownDoorDen") {
      if (tile === "crown_vestibule" && flags.crownDoorDungeonEntered) return true;
      if (tile === "wax_table" && flags.crownDoorWaxTableCleared) return true;
      if (tile === "slat_rack" && flags.crownDoorSlatsBroken) return true;
      if (tile === "witness_ledger" && flags.crownDoorWitnessLedgerFound) return true;
      if (tile === "collar_kennel" && flags.crownDoorCollarsBroken) return true;
      if (tile === "false_map" && flags.crownDoorDungeonCleared) return true;
      if (tile === "den_guard" && flags.beatCrownDenGuard) return true;
    }
    if (region === "westrootHub") {
      if (
        tile === "westroot_first_gate" &&
        flags.metBramwell &&
        !flags.rootbreadLeadLearned
      ) return true;
      if (tile === "rootmarket" && flags.metQuill && flags.metAuntieLume) return true;
      if (tile === "mossgarden" && flags.metNoma) return true;
      if (tile === "witness_stones" && flags.witnessStoneSequenceSolved) return true;
      if (tile === "cargo_siding" && flags.willowCargoExposed) return true;
      if (
        tile === "split_hall" &&
        (
          flags.chapterThreeClear ||
          (flags.splitHallVisitedBeforeBell && !flags.westrootHoldBellRung) ||
          (flags.splitHallDebateHeard && !flags.willowCargoExposed)
        )
      ) return true;
    }
    return false;
  };
  const getMapTokenState = (tile, tileRegion = region) => {
    if (tileRegion === "hearthhollow") {
      if (tile === "gate" && flags.beatGateBattle) return "spent";
    }
    if (tileRegion === "rootCellar") {
      if (tile === "skulk" && flags.beatCellarSkulk) return "spent";
      if (tile === "boss" && flags.beatCellarBoss) return "spent";
    }
    if (tileRegion === "westrootTrail") {
      if (
        tile === "false_notice" &&
        (flags.falseNoticeLensUsed || flags.falseNoticeLanternRead || flags.followedFalseDetour)
      )
        return "spent";
      if (tile === "roadwatcher" && flags.roadwatcherDefeated) return "spent";
      if (tile === "crown_sign" && (flags.crownSignRejected || flags.crownSignLensUsed))
        return "spent";
      if (tile === "lantern_sign" && flags.lanternSignCleaned && flags.lanternSignCompared)
        return "spent";
    }
    if (tileRegion === "crownDoorDen") {
      if (tile === "wax_table" && flags.crownDoorWaxTableCleared) return "spent";
      if (tile === "slat_rack" && flags.crownDoorSlatsBroken) return "spent";
      if (tile === "witness_ledger" && flags.crownDoorWitnessLedgerFound) return "spent";
      if (tile === "collar_kennel" && flags.crownDoorCollarsBroken) return "spent";
      if (tile === "false_map" && flags.crownDoorDungeonCleared) return "spent";
      if (tile === "den_guard" && flags.beatCrownDenGuard) return "spent";
    }
    if (tileRegion === "westrootHub") {
      if (tile === "cargo_siding" && !flags.witnessStoneSequenceSolved) return "hidden";
      if (tile === "cargo_siding" && flags.willowCargoExposed) return "spent";
      if (tile === "witness_stones" && flags.witnessStoneSequenceSolved) return "spent";
    }
    return "active";
  };
  const heroSkills = useMemo(() => {
    const core = [
      {
        id: "strike",
        name: "Strike",
        kind: "attack",
        description: `1d6+${2 + Math.floor(derivedStats.Might / 2)} • A dependable physical hit.`,
        spec: {
          count: 1,
          sides: 6,
          bonus: 2 + Math.floor(derivedStats.Might / 2),
        },
      },
      {
        id: "focus_step",
        name: "Focus Step",
        kind: "attack",
        description: `1d6+${1 + Math.floor((derivedStats.Precision + derivedStats.Instinct) / 2)} • A precise hit guided by instinct and timing.`,
        spec: {
          count: 1,
          sides: 6,
          bonus:
            1 +
            Math.floor((derivedStats.Precision + derivedStats.Instinct) / 2),
        },
      },
    ];
    const itemSkills = getEquippedSkillIds(player)
      .map((id) => buildCombatSkill(id, derivedStats))
      .filter(Boolean);
    return [...core, ...itemSkills];
  }, [player?.equipment, derivedStats]);

  const announce = (message, loot = []) => {
    setToast(message);
    if (loot.length) setLootBanner({ message, loot, id: Date.now() });
  };
  const revealArea = (regionId, x, y, radius = 1) =>
    setVisited((prev) => ({
      ...prev,
      [regionId]: {
        ...(prev[regionId] || {}),
        ...buildVisitedMap(regionId, x, y, radius),
      },
    }));
  const travelToRegion = (
    nextRegion,
    nextPosition,
    checkpointLabel,
    message,
  ) => {
    setDialogue(null);
    previousPositionByRegionRef.current[nextRegion] = undefined;
    setRegion(nextRegion);
    setPosition(nextPosition);
    revealArea(nextRegion, nextPosition.x, nextPosition.y, 2);
    if (checkpointLabel)
      setPlayer((prev) => (prev ? { ...prev, checkpointLabel } : prev));
    setToast(message || `You arrive at ${MAPS[nextRegion].name}.`);
  };
  const openEnterPrompt = (name, text, onEnter, mapVignette) =>
    setDialogue({
      portrait: "🚪",
      mapVignette,
      name,
      text,
      choices: [
        {
          label: "Enter",
          effect: () => {
            setDialogue(null);
            onEnter();
          },
        },
        { label: "Stay outside", effect: () => setDialogue(null) },
      ],
    });
  const buildCurrentSavePayload = (
    payloadToast = "Save loaded.",
    playerSnapshot = player,
    companionSnapshot = companion,
  ) => {
    if (!playerSnapshot) return null;
    const companionRosterSnapshot = companionSnapshot.id
      ? {
          ...companionRoster,
          [companionSnapshot.id]: companionSnapshot,
        }
      : companionRoster;
    return {
      screen: "play",
      chapterId: getChapterProgress(flags).currentChapterId,
      player: normalizePlayerData(playerSnapshot),
      region,
      position,
      visited,
      companion: companionSnapshot,
      companionRoster: companionRosterSnapshot,
      guestNpc: getActiveGuestNpc(flags),
      flags,
      quest,
      toast: payloadToast,
    };
  };
  const saveGame = (label = "Checkpoint") => {
    if (!player) return;
    const payload = buildCurrentSavePayload(`Checkpoint reached: ${label}`, {
      ...player,
      checkpointLabel: label,
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setPlayer((prev) => ({ ...prev, checkpointLabel: label }));
    setToast(`Checkpoint reached: ${label}`);
  };
  const applyLoadedPayload = (rawPayload, toastMessage) => {
    const payload = getSavePayload(rawPayload);
    if (!payload?.player) {
      setToast("That save file could not be loaded.");
      return false;
    }
    const nextRegion = MAPS[payload.region] ? payload.region : "hearthhollow";
    const nextPosition = normalizeMapPosition(
      nextRegion,
      payload.position || MAPS[nextRegion].start,
    );
    const nextPlayer = normalizePlayerData(payload.player);
    const nextVisited = ensureVisitedIncludesPosition(
      payload.visited || buildDefaultVisited(),
      nextRegion,
      nextPosition,
    );
    const nextCompanion = normalizeCompanionData(payload.companion);
    const nextCompanionRoster = { ...(payload.companionRoster || {}) };
    if (nextCompanion.id)
      nextCompanionRoster[nextCompanion.id as CompanionId] = nextCompanion;
    const nextFlags = { ...buildDefaultFlags(), ...(payload.flags || {}) };
    const nextQuest =
      (payload.quest as { title: string; description: string } | undefined) || {
        title: "Adventure in progress",
        description: "Continue exploring.",
      };
    setPlayer(nextPlayer);
    previousPositionByRegionRef.current = {};
    setRegion(nextRegion);
    setPosition(nextPosition);
    setVisited(nextVisited);
    setCompanion(nextCompanion);
    setCompanionRoster(nextCompanionRoster);
    setFlags(nextFlags);
    setQuest(nextQuest);
    setLevelUpPending(null);
    setDialogue(null);
    setBattle(null);
    setBattleItemsOpen(false);
    setShopOpen(false);
    setCraftOpen(false);
    setInteriorScene(null);
    setScreen("play");
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...payload,
        screen: "play",
        player: nextPlayer,
        region: nextRegion,
        position: nextPosition,
        visited: nextVisited,
        companion: nextCompanion,
        companionRoster: nextCompanionRoster,
        flags: nextFlags,
        quest: nextQuest,
      }),
    );
    setToast(toastMessage || payload.toast || "Save loaded.");
    return true;
  };
  const loadGame = () =>
    applyLoadedPayload(parseCheckpointPayload(), "Checkpoint loaded.");
  const chooseHeroGrowth = (growth) => {
    const target = getHeroXpTarget(player?.level || 1);
    if (!target || !growth) return setLevelUpPending(null);
    setPlayer((p) => {
      const nextMaxHp = (p.maxHp || 0) + 4;
      return {
        ...p,
        level: (p.level || 1) + 1,
        xp: Math.max(0, (p.xp || 0) - target),
        maxHp: nextMaxHp,
        hp: Math.min(nextMaxHp, (p.hp || 0) + 4),
        baseStats: addBonuses(p.baseStats, growth.bonuses),
      };
    });
    setLevelUpPending(null);
    setToast(
      `Level up! ${growth.name} growth chosen. Max HP +4 • Current HP +4 • ${formatBonuses(growth.bonuses)}`,
    );
  };

  const startGame = () => {
    const hero = buildPlayer(createForm);
    setPlayer(hero);
    previousPositionByRegionRef.current = {};
    setRegion("hearthhollow");
    setPosition(MAPS.hearthhollow.start);
    setVisited(buildDefaultVisited());
    setCompanion(buildDefaultCompanion());
    setCompanionRoster({});
    setFlags(buildDefaultFlags());
    setScreen("play");
    setDialogue({
      portrait: "📖",
      name: "Hearthhollow, Dawn",
      text: `${hero.name} has always known Hearthhollow as a place of ordinary sounds: Nella's oven door clapping shut, Toma arguing with turnips, Pibble inventing uses for tools nobody requested. This morning, those sounds are missing. People stand in doorways. The south road is too quiet. A courier has not arrived, and a bramble boar has been seen charging near the gate with a messenger's satchel caught on its tusk. For the first time, home feels less like a shelter and more like the first page of something dangerous.`,
      choices: [
        { label: "Step into the morning", effect: () => setDialogue(null) },
      ],
    });
  };
  const bump = (tile) =>
    setToast(
      tile === "tree"
        ? "Oof. That tree was stronger than it looked."
        : tile === "water"
          ? "Your boots vote no on that water."
          : tile === "fenced_yard"
            ? "The fence has made a very convincing argument."
          : ["neighbor_building", "neighbor2_building"].includes(tile)
            ? "That cottage is closed for the morning. Hearthhollow has enough trouble without you trying every painted door."
          : tile?.includes("building")
            ? "The building is solid here. Follow the painted path to its proper entrance."
            : "That way is blocked.",
    );
  const isLockedCellarExit = (tile) =>
    region === "rootCellar" && tile === "exit_door" && !flags.beatCellarBoss;
  const blockLockedCellarExit = () =>
    setToast("The Briar Knot Warden blocks the sealed door.");
  const getCrownDenAlertText = (level) => {
    if (level >= 4)
      return "The scratchers find you. Red thread snaps tight across the passage, and a false sign clatters like a warning bell.";
    if (level === 3)
      return "The scraping is close now. Something is moving from room to room, following the sound of broken signs.";
    if (level === 2)
      return "A chain drags somewhere deeper in the den. Mara goes still and points toward the next room.";
    return "From deeper in the signworks comes a dry scratch, scratch, scratch, like someone copying a road mark in the dark.";
  };
  const advanceCrownDenThreat = () => {
    if (
      region !== "crownDoorDen" ||
      flags.crownDoorDungeonCleared ||
      flags.crownDenPatrolDefeated ||
      flags.crownDenPatrolEscaped
    )
      return false;

    const nextLevel = Math.min(4, Number(flags.crownDenAlertLevel || 0) + 1);
    setFlags((f) => ({ ...f, crownDenAlertLevel: nextLevel }));

    if (nextLevel >= 4) {
      setDialogue({
        portrait: "!",
        portraitImage: crownDenPortraitImage(
          crownDenPatrolCaughtUpIcon,
          "Painted crossed sign slats showing the patrol catching up",
        ),
        name: "The Signworks Finds You",
        text: `${getCrownDenAlertText(nextLevel)}\n\nTwo false-sign scratchers skitter out from opposite passages, their wooden claws stained with red wax.`,
        choices: [
          {
            label: "Stand and fight.",
            effect: () => {
              setDialogue(null);
              startBattle(buildEncounterEnemies("crownDenPatrol"), "crownDenPatrol");
            },
          },
          {
            label: "Run back to the threshold.",
            effect: () => {
              setFlags((f) => ({ ...f, crownDenPatrolEscaped: true, crownDenAlertLevel: 0 }));
              returnToThreeDoorThreshold();
            },
          },
        ],
      });
      return true;
    }

    setToast(getCrownDenAlertText(nextLevel));
    return false;
  };
  const openVillageWellDialogue = () => {
    if (flags.wellVisited) {
      setToast("The village well continues to sit exactly where you left it.");
      return;
    }
    setFlags((f) => ({ ...f, wellVisited: true }));
    setDialogue({
      portrait: TILE_META.well.icon,
      mapVignette: "hearthWell",
      name: "Village Well",
      text: "The village well sits exactly where wells like to sit: in everybody's way and somehow still very useful. You consider climbing onto the rim for a better view, but the well has the solemn confidence of a thing that has already watched three generations make that mistake.",
      choices: [
        {
          label: "Respect local infrastructure.",
          effect: () => setDialogue(null),
        },
      ],
    });
  };
  const openPondDialogue = () => {
    setFlags((f) => ({ ...f, pondVisited: true }));
    setDialogue({
      portrait: TILE_META.pond.icon,
      mapVignette: "lanternPond",
      name: "Pond Edge",
      text: flags.pondForaged
        ? "The pond settles back into itself. A frog sits on a stone with the smug expression of someone who knows you have already had your chance."
        : "The pond is small enough to skip a stone across and deep enough to hide exactly one interesting thing. Moonmint leans over the bank, reeds tick softly against each other, and something round bubbles once beneath the mud. You will probably only get one careful search before the edge turns cloudy.",
      choices: [
        !flags.pondForaged
          ? {
              label: "Search the pond edge carefully.",
              effect: () => {
                setDialogue(null);
                setFlags((f) => ({ ...f, pondVisited: true, pondForaged: true }));
                const found = Math.random() > 0.45;
                if (found) {
                  gainItem(setPlayer, "bubblecap", 1);
                  announce(
                    "You find a Bubblecap tucked under the pond reeds.",
                    [{ id: "bubblecap", qty: 1 }],
                  );
                } else
                  setToast("Wet hands, reeds, and one suspicious frog stare.");
              },
            }
          : null,
        { label: "Leave the pond alone.", effect: () => setDialogue(null) },
      ].filter(Boolean),
    });
  };
  const handleBlockedTileInteraction = (tile) => {
    if (tile === "home_door")
      return openEnterPrompt(
        "Home",
        "Step inside your cozy home? The familiar door sticks in the same place it always has, as if even the house would prefer you stay here where it is safe.",
        () => setInteriorScene("home"),
        "hearthHome",
      );
    if (tile === "smith_door")
      return openEnterPrompt(
        "Smithy",
        "Step beneath the smithy's open awning? Heat shimmers around the anvil, carrying the smell of coal, iron, and hurried work.",
        () => {
          if (!flags.elderGavePurse)
            return setDialogue({
              portrait: "🛠️",
              name: "Smith Orin",
              text: "Orin blocks the workbench with a hammer in one hand and a half-made hinge in the other. \"If Elder Brynn is sending you, talk to her first. I am not putting road gear into eager hands just because trouble has started shouting. If she says you're the one going, I'll make sure you aren't walking into thorn and teeth with empty pockets.\"",
              choices: [
                {
                  label: "I'll talk to Brynn first.",
                  effect: () => setDialogue(null),
                },
              ],
            });
          setFlags((f) => ({ ...f, gotSmithGift: true }));
          setShopMode("smith");
          setShopOpen(true);
        },
        "hearthSmithy",
      );
    if (tile === "potion_door")
      return openEnterPrompt(
        "Potion Shed",
        "Head into the potion shed? Something inside fizzes, then giggles, then pretends it did not.",
        () => {
          setCraftContext("potionShed");
          setCraftOpen(true);
        },
        "hearthPotionShed",
      );
    if (tile === "bram_inn_door")
      return openEnterPrompt(
        "Bramblecross Inn",
        "Step into the inn and common room? Warm lamplight spills through the doorway, along with the low thunder of worried travelers pretending to relax.",
        () => setInteriorScene("bramInn"),
        "brambleInn",
      );
    if (tile === "market_door")
      return openEnterPrompt(
        "Willow Market",
        "Enter Willow Market? The bell over the door keeps ringing even before you touch it, as if Ada's anxiety has taught it anticipation.",
        () => {
          setShopMode("market");
          setShopOpen(true);
        },
        "brambleMarket",
      );
    if (tile === "watch_door")
      return openEnterPrompt(
        "Watchhouse",
        "Enter the watchhouse? The windows glow with lamplight, maps, and the particular smell of ink being used urgently.",
        () => setInteriorScene("watchhouse"),
        "brambleWatchhouse",
      );
    if (tile === "well") return openVillageWellDialogue();
    if (tile === "pond") return openPondDialogue();
  };

  const isClosedWestrootHoldCrossing = (from: Position, to: Position) => {
    if (region !== "westrootHub" || flags.splitHallDebateHeard) return false;
    const crossing = `${from.x},${from.y}->${to.x},${to.y}`;
    return crossing === "5,0->6,0" || crossing === "6,0->5,0";
  };

  const openWestrootHoldPathNotice = () =>
    setDialogue({
      portrait: "!",
      name: "Witness Stone Hold Notice",
      text: `${CHAPTER_3_FULL_SCENE_COPY.witnessStones.shutterInspection}\n\nThe hold remains until Split Hall reviews both the cargo danger and the unanswered outer-shelter call.`,
      choices: [
        {
          label: "Respect the hold and stay on this side.",
          effect: () => setDialogue(null),
        },
      ],
    });

  const movePlayer = (dx, dy) => {
    if (
      dialogue ||
      battle ||
      shopOpen ||
      craftOpen ||
      interiorScene ||
      saveModalMode
    )
      return;
    if (routeUnintroducedPartyToBramwell()) return;
    const direction =
      dx === 1 ? "right" : dx === -1 ? "left" : dy === 1 ? "down" : "up";
    const graphDestination = getNavigationDestination(
      region,
      position.x,
      position.y,
      direction,
    );
    if (hasNavigationGraph(region) && !graphDestination) return;
    const nx = graphDestination?.x ?? position.x + dx;
    const ny = graphDestination?.y ?? position.y + dy;
    if (
      isClosedWestrootHoldCrossing(position, { x: nx, y: ny })
    ) {
      openWestrootHoldPathNotice();
      return;
    }
    if (
      ny < 0 ||
      ny >= currentMap.length ||
      nx < 0 ||
      nx >= currentMap[0].length
    )
      return;
    const rawTile = currentMap[ny][nx];
    const tile = getStoryTile(rawTile);
    if (isLockedCellarExit(tile)) {
      blockLockedCellarExit();
      return;
    }
    if (TILE_META[tile]?.blocked) {
      if (isBlockedInteractionTile(tile)) handleBlockedTileInteraction(tile);
      else bump(tile);
      return;
    }
    const previousPosition = { x: position.x, y: position.y };
    previousPositionByRegionRef.current[region] = previousPosition;
    setPosition({ x: nx, y: ny });
    revealArea(region, nx, ny);
    if (region === "crownDoorDen" && tile !== "crown_den_exit" && advanceCrownDenThreat())
      return;
    if (shouldTriggerLanternRoadAmbush(region, flags, { x: nx, y: ny })) {
      openWildBattleDialogue();
      return;
    }
    inspectTile(tile, { auto: true, previousPosition });
  };

  useEffect(() => {
    if (screen !== "play" || !player) return;
    const handleKeyDown = (event) => {
      const tagName = event.target?.tagName?.toLowerCase();
      const isTextEntry =
        ["input", "textarea", "select"].includes(tagName) ||
        event.target?.isContentEditable;
      if (isTextEntry) return;
      if (event.key === "m" || event.key === "M") {
        event.preventDefault();
        if (
          !dialogue &&
          !battle &&
          !shopOpen &&
          !craftOpen &&
          !interiorScene &&
          !saveModalMode
        )
          setAdventureMenuOpen((open) => !open);
        return;
      }
      if (adventureMenuOpen) return;
      const keyMap: Record<string, [number, number]> = {
        ArrowUp: [0, -1],
        w: [0, -1],
        W: [0, -1],
        ArrowDown: [0, 1],
        s: [0, 1],
        S: [0, 1],
        ArrowLeft: [-1, 0],
        a: [-1, 0],
        A: [-1, 0],
        ArrowRight: [1, 0],
        d: [1, 0],
        D: [1, 0],
      };
      if (keyMap[event.key]) {
        event.preventDefault();
        if (tagName === "button" && event.target?.blur) event.target.blur();
        movePlayer(...keyMap[event.key]);
        return;
      }
      if (tagName === "button") return;
      if (event.key === "e" || event.key === "E" || event.key === "Enter") {
        event.preventDefault();
        if (
          !dialogue &&
          !battle &&
          !shopOpen &&
          !craftOpen &&
          !interiorScene &&
          !saveModalMode
        )
          inspectTile(currentTile);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    screen,
    player,
    position,
    region,
    currentTile,
    dialogue,
    battle,
    shopOpen,
    craftOpen,
    interiorScene,
    saveModalMode,
    adventureMenuOpen,
    flags,
    companion,
  ]);

  useEffect(() => {
    if (!lootBanner) return;
    const timeout = window.setTimeout(() => setLootBanner(null), 4500);
    return () => window.clearTimeout(timeout);
  }, [lootBanner?.id]);

  useEffect(() => {
    const target = getHeroXpTarget(player?.level || 1);
    if (
      screen !== "play" ||
      !player ||
      !target ||
      levelUpPending ||
      player.xp < target ||
      dialogue ||
      battle ||
      shopOpen ||
      craftOpen ||
      interiorScene ||
      saveModalMode ||
      lootBanner
    )
      return;
    setLevelUpPending({ level: player.level || 1, target });
  }, [
    screen,
    player?.level,
    player?.xp,
    levelUpPending,
    dialogue,
    battle,
    shopOpen,
    craftOpen,
    interiorScene,
    saveModalMode,
    lootBanner,
  ]);

  useEffect(() => {
    if (!battle || !player || battle.finished) return;
    if (player.hp <= 0) {
      setBattle((prev) =>
        prev
          ? {
              ...prev,
              finished: true,
              turn: "defeat",
              log: [
                ...prev.log.slice(-5),
                `${player.name} falls! The fight is lost.`,
              ],
            }
          : prev,
      );
      setToast("You were defeated.");
    }
  }, [player?.hp, battle?.finished]);

  const acceptElderRequest = () => {
    setFlags((f) => ({
      ...f,
      metElder: true,
      elderGavePurse: true,
    }));
    setPlayer((p) => ({
      ...p,
      gold: p.gold + 12,
      xp: p.xp + 4,
      baseStats: addBonuses(p.baseStats, { Heart: 1 }),
    }));
    setDialogue(null);
    setToast("Brynn gives you 12g and sends word to Orin. Heart +1");
  };
  const openElderDialogue = () => {
    if (!flags.metElder)
      return setDialogue({
        portrait: "🧙",
        name: "Elder Brynn",
        text: 'Elder Brynn\'s walking stick is planted in the dirt like a little flag of defiance. Around her, Hearthhollow has gone too quiet: ovens left open, shutters half-latched, neighbors whispering without finishing their sentences. "Lio Brindle should have arrived before breakfast," she says. "He did not. Now a bramble boar is charging near the south gate with a courier\'s satchel caught on its tusk. First we protect the village. Then we find out what happened on that road. Will you go?"',
        choices: [
          {
            label: "I'll help. Tell Orin I'm coming to the smithy.",
            effect: acceptElderRequest,
          },
          {
            label: "This sounds bigger than a boar. Why me?",
            effect: () =>
              setDialogue({
                portrait: "🧙",
                name: "Elder Brynn",
                text: '"Because you notice what others step over," Brynn says. "And because when Hearthhollow is afraid, I need someone who will move without becoming careless. Take your own hatchet from home, then see Orin. We will not send you empty-handed."',
                choices: [{ label: "Then I'll go.", effect: acceptElderRequest }],
              }),
          },
        ],
      });

    if (!flags.beatGateBattle)
      return setDialogue({
        portrait: "🧙",
        name: "Elder Brynn",
        text: 'Brynn has not returned to her chair. She stands near the square with one hand on the old bell rope, watching people pretend not to panic. "First the boar," she says. "Then the satchel. Whatever happened to Lio happened on the road, but Hearthhollow needs you here before it needs you chasing answers."',
        choices: [
          {
            label: "I'll stop it and bring back the satchel.",
            effect: () => setDialogue(null),
          },
        ],
      });

    if (!flags.reportedSatchelToElder)
      return setDialogue({
        portrait: "🧙",
        name: "Elder Brynn",
        text: `You place Lio's satchel in Brynn's hands and unfold the order beside it. She reads the command once. Then again, slower. Her thumb presses into the crooked crown seal.

"No," she says. "This did not come from the Crown. A true road order names the danger, the people it protects, and the hand responsible for it. This names only panic. Someone forged authority because fear makes a trusted seal harder to question."

She looks from Lio's badge to the lunch packet still tied with Mara's blue string.

"Take the satchel and this false order to the watch in Bramblecross. They may know the seal, the phrasing, or where Lio's route was broken. Follow Lantern Road and look for the place the strap was cut. If Lio left any sign behind, find it. If he still walks that road, bring him home."`,
        choices: [
          {
            label: "I'll report it in Bramblecross and look for Lio.",
            effect: () => {
              setFlags((f) => ({ ...f, reportedSatchelToElder: true }));
              setDialogue(null);
              setToast(
                "New objective: report the false order in Bramblecross and look for Lio.",
              );
            },
          },
        ],
      });

    return setDialogue({
      portrait: "🧙",
      name: "Elder Brynn",
      text: 'Brynn keeps one hand on the bell rope and looks south. "The false order belongs in front of people who know Bramblecross records," she says. "But Lio belongs to more than a case file. Watch the road for his marks, and do not let the paper make you forget the person."',
      choices: [
        {
          label: "I'll keep looking for him.",
          effect: () => setDialogue(null),
        },
      ],
    });
  };
  const openPibbleDialogue = () =>
    setDialogue({
      portrait: "🧰",
      name: "Pibble Thatch",
      text: flags.gotPibbleTip
        ? 'Pibble has three tools in hand and is using none of them correctly. "I keep thinking about the satchel," he says. "A boar doesn\'t steal mail, and that strap was cut before it ever touched a tusk. Whatever happened to Lio happened first. The boar only carried the evidence home."'
        : 'Pibble is crouched beside a smear of mud, measuring it with a spoon for reasons known only to Pibble. "I saw it," he says before you ask. "Bramble boar. Tusks like bent fence nails. But the strange part was the satchel snagged on it—rider\'s leather, stamped for courier use. That means the courier didn\'t just run late. Something happened out there."',
      choices: flags.gotPibbleTip
        ? [
            {
              label: "So the trail starts before the boar.",
              effect: () => setDialogue(null),
            },
          ]
        : [
            {
              label: "What else did you notice?",
              effect: () =>
                setDialogue({
                  portrait: "🧰",
                  name: "Pibble Thatch",
                  text: '"The boar came from the road, not the fields," Pibble says. "And the satchel strap was cut, not torn. See? Helpful panic. Very different from regular panic." He presses a trail snack into your hand. "For thinking while walking."',
                  choices: [
                    {
                      label: "Thanks, Pibble.",
                      effect: () => {
                        setFlags((f) => ({ ...f, gotPibbleTip: true }));
                        gainItem(setPlayer, "trail_snack", 1);
                        setDialogue(null);
                        announce("Pibble hands you a trail snack.", [
                          { id: "trail_snack", qty: 1 },
                        ]);
                      },
                    },
                  ],
                }),
            },
            {
              label: "I'll check the gate.",
              effect: () => {
                setFlags((f) => ({ ...f, gotPibbleTip: true }));
                gainItem(setPlayer, "trail_snack", 1);
                setDialogue(null);
                announce("Pibble hands you a trail snack.", [
                  { id: "trail_snack", qty: 1 },
                ]);
              },
            },
          ],
    });
  const openGateEvent = () => {
    if (!flags.metElder)
      return setToast("Talk to Elder Brynn before leaving town.");
    const hasWeaponReady =
      !!player.equipment?.weapon ||
      (Object.entries(player.inventory || {}) as [string, number][]).some(
        ([id, qty]) => qty > 0 && ITEM_DB[id]?.slot === "weapon",
      );
    if (!flags.homeStashClaimed && !hasWeaponReady)
      return setToast(
        "Brynn wanted you to take your old hatchet from home before facing the road.",
      );
    if (!flags.gotSmithGift)
      return setToast(
        "The south road looks dangerous. Visit Smith Orin before leaving town.",
      );
    if (flags.beatGateBattle && !flags.reportedSatchelToElder)
      return setToast(
        "Take Lio's satchel and the false order to Elder Brynn before leaving Hearthhollow.",
      );
    if (flags.beatGateBattle)
      return setDialogue({
        portrait: "🚪",
        mapVignette: "hearthSouthGate",
        name: "South Gate",
        text: `The gate no longer shakes under tusks and panic, but no one treats the road as safe. Beyond it, Lantern Road bends between the trees, carrying cart-ruts, scattered feathers, and the uncomfortable feeling that someone has been arranging fear like furniture.

You check the satchel strap and feel the folded false order inside. Hearthhollow is behind you. Lio is somewhere ahead—if you're lucky.

Deep breath. Am I really ready for this?`,
        choices: [
          {
            label: "Take a deep breath and step onto Lantern Road.",
            effect: () => {
              setDialogue(null);
              travelToRegion(
                "lanternRoad",
                MAPS.lanternRoad.start,
                "South Gate",
                "You step onto Lantern Road.",
              );
            },
          },
          {
            label: "Not yet. Stay in Hearthhollow.",
            effect: () => setDialogue(null),
          },
        ],
      });
    setDialogue({
      portrait: "🐗",
      name: "Bramble Boar",
      text: "The south gate bursts with shouting. A Bramble Boar crashes out of the brush, wild-eyed and foaming, a courier satchel twisted around one tusk. It is not attacking like a hungry beast. It is running like something has driven it mad. The satchel thumps against its jaw with every charge. A brass courier badge flashes once in the dust. Even at a glance, you recognize Lio Brindle's route badge—the one he wore on every Hearthhollow run. He was due before breakfast. The boar lowers its head toward the square. If it breaks through, people will be hurt—and whatever happened to Lio will vanish down the road behind it.",
      choices: [
        {
          label: "Stand and fight before it reaches the square.",
          effect: () => {
            setDialogue(null);
            startBattle(buildEncounterEnemies("boar"), "boar");
          },
        },
        {
          label: "Try to draw it away from town.",
          effect: () => {
            setDialogue({
              portrait: "🐗",
              name: "Bramble Boar",
              text: "You feint toward the road, waving and shouting, trying to pull the boar’s attention away from the square. For a heartbeat, it works. The boar turns. The courier satchel swings wide, and you see a cut strap whipping loose beside the brass badge. Then the animal scrapes the dirt and lunges back toward the gate. There is no clean escape without leaving the village exposed. This fight is coming whether you like it or not.",
              choices: [
                {
                  label: "Then I stand and fight.",
                  effect: () => {
                    setDialogue(null);
                    startBattle(buildEncounterEnemies("boar"), "boar");
                  },
                },
                {
                  label: "Back away for now.",
                  effect: () => setDialogue(null),
                },
              ],
            });
          },
        },
      ],
    });
  };
  const openNixDialogue = () => {
    if (flags.foundRuinNote)
      return setDialogue({
        portrait: "🏹",
        name: "Nix Fernwhistle",
        text: "Nix reads the planted order without touching it more than necessary. His mouth tightens at the false crown seal. “There it is. Too clean to be lost, too hidden to be public, and placed exactly where a frightened traveler would feel clever for finding it.” He looks down the road toward Bramblecross. “This was bait with paperwork on it. Someone wants fear to arrive before the truth does. If the ambushers were guarding that note, then the next question is who benefits when Bramblecross waits, worries, and stops trusting the road.”",
        choices: [
          {
            label: "Then Bramblecross needs the truth first.",
            effect: () => setDialogue(null),
          },
        ],
      });
    return setDialogue({
      portrait: "🏹",
      name: "Nix Fernwhistle",
      text: flags.metNix
        ? "Nix keeps one ear turned toward the trees. “Once you know panic can be planted, the road looks different. The milestone ruin is the place I'd hide an order if I wanted travelers to find it and believe they found it by accident. Check the stones. Check behind the stones. And then check why someone wanted you checking stones.”"
        : "A wiry road-scout steps out from behind a bent pine with an arrow notched but lowered. “Easy. I'm Nix Fernwhistle. The hoofprints are real enough, but the panic is wrong. Too neat. Too useful. Somebody keeps planting orders where frightened people will find them and think fear came with a royal seal.”",
      choices: flags.metNix
        ? [
            {
              label: "I'll check the stones carefully.",
              effect: () => setDialogue(null),
            },
          ]
        : [
            {
              label: "How can you tell the panic was arranged?",
              effect: () =>
                setDialogue({
                  portrait: "🏹",
                  name: "Nix Fernwhistle",
                  text: "“Because scared people scatter,” Nix says. “These rumors march. They move from marker to marker like they were trained. Start at the old milestone ruin. If I'm right, you'll find a command meant to be discovered.”",
                  choices: [
                    {
                      label: "Then let's stop them.",
                      effect: () => {
                        setFlags((f) => ({ ...f, metNix: true }));
                        setPlayer((p) => ({ ...p, xp: p.xp + 6 }));
                        setDialogue(null);
                        setToast(
                          "Nix points you toward the old milestone ruin. XP +6",
                        );
                      },
                    },
                  ],
                }),
            },
          ],
    });
  };
  const openRuinDialogue = () => {
    if (!flags.metNix)
      return setDialogue({
        portrait: "🗿",
        mapVignette: "lanternMilestone",
        name: "Milestone Ruin",
        text: "The old milestone leans at the edge of the road, carved with distances that weather has nearly swallowed. Someone has scraped fresh mud around its base, but without Nix's road-scout eye you cannot tell whether that means accident, hiding place, or merely a very ambitious worm.",
        choices: [
          {
            label: "I should ask someone who knows the road.",
            effect: () => setDialogue(null),
          },
        ],
      });
    if (flags.foundRuinNote)
      return setDialogue({
        portrait: "🗿",
        mapVignette: "lanternMilestone",
        name: "Milestone Ruin",
        text: "The hidden shelf behind the milestone is empty now. The stone still feels like a stage after the actor has left: ordinary from the road, suspicious once you know where to look.",
        choices: [{ label: "Move on.", effect: () => setDialogue(null) }],
      });
    setFlags((f) => ({ ...f, foundRuinNote: true }));
    setPlayer((p) => ({ ...p, xp: p.xp + 8 }));
    setDialogue({
      portrait: "🗿",
      mapVignette: "lanternMilestone",
      name: "Milestone Ruin",
      text: "You kneel where Nix pointed and find a narrow shelf hidden behind the milestone's cracked base. Inside waits a folded order, too dry for the damp stone and too clean for something supposedly lost. It reads: HOLD BRAMBLECROSS. SUSPEND OUTBOUND COURIERS. AWAIT CROWN INSPECTION. The seal tries to look royal, but the crown points are wrong. Whoever planted this knew how fear reads faster than ink.",
      choices: [
        { label: "Take the planted order.", effect: () => setDialogue(null) },
      ],
    });
  };
  const openWildBattleDialogue = () => {
    if (flags.clearedWildBattle)
      return setToast(
        "The ambush site is quiet now. Even the brambles look embarrassed to have been involved.",
      );
    if (!flags.foundRuinNote)
      return setDialogue({
        portrait: "⚔️",
        name: "Suspicious Roadside Figures",
        text: "Two shapes linger near the ditch where the road bends. One pretends to check a boot buckle. The other pretends not to watch you. A thorny hound noses the ground between them. They do not strike, but they are clearly waiting to see whether you understand what they are guarding.",
        choices: [
          {
            label: "Back away before they know what I know.",
            effect: () => setDialogue(null),
          },
        ],
      });
    setDialogue({
      portrait: "⚔️",
      name: "Roadside Ambush",
      text: 'The road narrows between two banks of bramble. The ruffian and his thorny hound wait until you are committed to the bend, then step out behind you and close the road back. A second shape blocks the way ahead. "That paper isn\'t yours," the ruffian says, knife low and smile lower. They were never guarding one spot on the map. They were waiting to ambush whoever carried the order east.',
      choices: [
        {
          label: "Break up the ambush.",
          effect: () => {
            setDialogue(null);
            startBattle(buildEncounterEnemies("wilds"), "wilds");
          },
        },
        {
          label: "Try to run and draw them away.",
          effect: () =>
            setDialogue({
              portrait: "⚔️",
              name: "Roadside Ambush",
              text: "You step back toward the open road, but the hound pads sideways to cut off the easy path. You could retreat fully for now, but slipping past them with the orders will not be simple.",
              choices: [
                {
                  label: "Stand and fight.",
                  effect: () => {
                    setDialogue(null);
                    startBattle(buildEncounterEnemies("wilds"), "wilds");
                  },
                },
                { label: "Retreat for now.", effect: () => setDialogue(null) },
              ],
            }),
        },
      ],
    });
  };
  const openBramblecrossDialogue = () => {
    if (!flags.clearedWildBattle)
      return setToast(
        "The road ahead still isn't safe. Clear the trouble first.",
      );
    if (flags.reachedBramblecross) {
      return travelToRegion(
        "bramblecross",
        MAPS.bramblecross.start,
        "Bramblecross Gate",
        flags.ennaBriefed
          ? "You return to Bramblecross. Enna's case wall is waiting with the road report already pinned in place."
          : "You return to Bramblecross.",
      );
    }
    setDialogue({
      portrait: "🏘️",
      mapVignette: "brambleGate",
      name: "Road to Bramblecross",
      text: "The trees thin, and Bramblecross rises ahead: market roofs, watchhouse stone, chimney smoke, and the kind of nervous movement that says a town is trying very hard to look normal. You are arriving with news Hearthhollow did not have and proof Bramblecross has not yet seen.",
      choices: [
        {
          label: "Enter Bramblecross with the road report.",
          effect: () => {
            setFlags((f) => ({
              ...f,
              reachedBramblecross: true,
              enteredBramblecross: true,
            }));
            setDialogue(null);
            travelToRegion(
              "bramblecross",
              MAPS.bramblecross.start,
              "Bramblecross Gate",
              "You step into Bramblecross.",
            );
          },
        },
      ],
    });
  };
  const openBoardDialogue = () => {
    const boardText = flags.boardQuestCompleted
      ? "The Bramblecross notice board is still crowded, but Ada's increasingly urgent spice-crate notice has been taken down. The cellar warnings and false route orders remain pinned for anyone with enough patience to read fear in official handwriting."
      : flags.boardQuestAccepted
        ? "The Bramblecross notice board still rustles with cellar warnings and copied route orders. Ada's crate notice is gone from the corner because it is already folded in your pack."
        : flags.readBoard
          ? "The Bramblecross notice board looks a little less like a paper storm now that you know which warnings matter. You have already noted the cellar reports and forged route order. Near the bottom, Ada Willowmarket's missing crate notice still waits in a cramped, increasingly angry hand."
          : 'The Bramblecross notice board is crowded enough to look like a paper storm nailed to wood. One notice reports missing cellar porters. Another warns of odd knocking beneath the old root storage rooms. A third insists all road traffic should wait for "updated crown direction." Near the bottom, Ada Willowmarket has pinned a practical little note about a missing spice crate, written in an increasingly less practical hand.';
    const boardChoices = [
      {
        label: flags.readBoard
          ? "Review the collected cellar notices and route order."
          : "Collect the cellar notices and route order.",
        effect: () => {
          setFlags((f) => ({ ...f, readBoard: true }));
          setDialogue(null);
          setToast(
            flags.readBoard
              ? "You review the cellar reports and route order."
              : "You collect the cellar reports and route order for review.",
          );
        },
      },
    ];
    if (!flags.boardQuestAccepted && !flags.boardQuestCompleted) {
      boardChoices.push({
        label: "Take Ada's crate notice too.",
        effect: () => {
          setFlags((f) => ({
            ...f,
            boardQuestAccepted: true,
          }));
          setDialogue(null);
          setToast("Ada's missing crate is now in your side quests.");
        },
      });
    }
    setDialogue({
      name: "Notice Board",
      portrait: "📜",
      text: boardText,
      choices: boardChoices,
    });
  };
  const openClerkDialogue = () => {
    if (flags.chapterOneClear && !flags.chapterReported)
      return openChapterReportDialogue();
    if (flags.chapterReported && !flags.chapterTwoClear)
      return openChapter2Briefing();
    if (!flags.ennaBriefed)
      return setDialogue({
        portrait: "🗂️",
        name: "Watch Clerk Enna",
        messages: [
          {
            speaker: "Enna",
            side: "left",
            text: "You came in off the south road? Good. Do not summarize yet. Tell me only what you actually saw. Bramblecross has the town-side fragments. We do not have the road-side picture.",
          },
          {
            speaker: player.name,
            side: "right",
            text: "Hearthhollow was hit first. A bramble boar reached the gate with Lio Brindle's courier satchel. Pibble noticed the strap looked cut, not torn.",
          },
          {
            speaker: "Enna",
            side: "left",
            text: "Cut strap. So the satchel was removed before the animal carried it. That puts the courier incident before the village panic.",
          },
          {
            speaker: player.name,
            side: "right",
            text: "Nix found the panic too neat. At the milestone ruin I found a planted order telling Bramblecross to suspend outbound couriers and await a Crown inspection that was never coming.",
          },
          {
            speaker: "Enna",
            side: "left",
            text: "Planted for discovery. Public enough to scare travelers, hidden enough to feel secret. Useful fear. Go on.",
          },
          {
            speaker: player.name,
            side: "right",
            text: "The ambushers guarded the road after that. They did not act like bandits looking for coins. They acted like guards protecting a lie.",
          },
          {
            speaker: "Enna",
            side: "left",
            text: "Then the wall changes. Missing porters, forged notices, road panic, intercepted goods—one route pattern. The shrine phrase fits better than I like: a road is safest when truth walks it first. Someone is making lies walk first. Study the completed case wall inside, then Hollis can send you to the right cellar instead of the nearest dark hole.",
          },
        ],
        choices: [
          {
            label: "Add my field report to the case wall.",
            effect: () => {
              setFlags((f) => ({ ...f, ennaBriefed: true }));
              setPlayer((p) => ({ ...p, xp: p.xp + 6 }));
              setDialogue(null);
              setToast("Enna adds your report to the case wall. XP +6");
            },
          },
        ],
      });
    setDialogue({
      portrait: "🗂️",
      name: "Watch Clerk Enna",
      text: `Enna taps two pins on the board without looking up. "The shape still holds: false authority above ground, missing workers below ground, and a road being trained to fear the wrong thing. The old shrine had it right: a road is safest when truth walks it first. Study the wall if you need the full pattern. Hollis will not move until you understand why the cellar matters."${companionIsConscious ? "" : companion.recruited ? `\n\nShe glances toward ${companion.name}. "Before you go below again, let ${companionPronouns.object} recover at the Bramblecross Inn."` : '\n\nShe nods toward the square. "Before you go below, consider taking another pair of eyes. Rowan, Tilda, and Moss are staying at the Bramblecross Inn."'}`,
      choices: [
        {
          label: "I'll study the wall, then speak with Hollis.",
          effect: () => setDialogue(null),
        },
      ],
    });
  };
  const enterRootCellarWithHollis = () => {
    setFlags((f) => ({
      ...f,
      gotDungeonLead: true,
      enteredRootCellar: true,
    }));
    setDialogue(null);
    setInteriorScene(null);
    travelToRegion(
      "rootCellar",
      MAPS.rootCellar.start,
      "Old Root Cellar",
      "Hollis leads you behind the watchhouse, unlocks the Old Root Cellar, and watches until your lantern disappears below.",
    );
  };
  const beginRootCellarDeparture = () => {
    setFlags((f) => ({ ...f, gotDungeonLead: true }));
    if (companionIsConscious) return enterRootCellarWithHollis();
    setDialogue({
      portrait: "🛡️",
      name: "Captain Hollis",
      text: 'Hollis closes his hand around the cellar key. "I will not order you to take help, but I would rather not send another person below alone. Rowan, Tilda, and Moss are staying at the Bramblecross Inn. Any one of them would give you another pair of eyes—and someone to pull you back if the old roots shift."',
      choices: [
        {
          label: "I'll recruit someone at the Bramblecross Inn first.",
          effect: () => {
            setDialogue(null);
            setToast("Potential companions are waiting inside the Bramblecross Inn.");
          },
        },
        {
          label: "I'll go alone. Take me to the cellar.",
          effect: enterRootCellarWithHollis,
        },
      ],
    });
  };
  const openCaptainDialogue = () => {
    if (flags.chapterOneClear && !flags.chapterReported)
      return openChapterReportDialogue();
    if (flags.chapterReported && !flags.eddenDrawingReceived)
      return openEddenRecoveryDialogue();
    if (flags.chapterReported && !flags.chapterTwoClear)
      return openChapter2Briefing();
    if (!flags.ennaBriefed)
      return setDialogue({
        portrait: "🛡️",
        name: "Captain Hollis",
        text: "Captain Hollis folds his arms. His armor is polished, but the edges of his sleeves are ink-smudged from reading reports. A cracked lantern sits on the desk beside him, its glass webbed with fractures. He notices you looking at it and quietly turns it so the broken side faces away. “Enna first,” he says. “We know what Bramblecross has suffered. We do not know what the road saw. I have already made the mistake of treating this like a local problem. I will not make it twice.”",
        choices: [
          { label: "I'll report to Enna.", effect: () => setDialogue(null) },
        ],
      });
    if (!flags.heardAboutEdden)
      setFlags((f) => ({ ...f, heardAboutEdden: true }));
    if (!flags.watchEvidenceRead)
      return setDialogue({
        portrait: "🛡️",
        name: "Captain Hollis",
        text: "“Study Enna's completed case wall first,” Hollis says. “A cellar is not a place for guesses. Not this cellar. When the first porter vanished, I sent Edden Vale below with two others and a lantern. They found the lantern again. They found Edden too, eventually, sitting under the east stair and whispering road names that are not on any current map. He has not slept right since. I am not sending another person below with only courage for a map.”",
        choices: [
          {
            label: "I'll study the case wall.",
            effect: () => setDialogue(null),
          },
        ],
      });
    if (!flags.readBoard)
      return setDialogue({
        portrait: "🛡️",
        name: "Captain Hollis",
        text: "Hollis nods toward the public square. “Before you decide whether to brave the cellar, collect every notice about it from the board. When the first porter vanished, I sent Edden Vale below with two others. Edden came back badly shaken. The other two did not. Each notice caught a different piece of what happened before and after they went down—the knocking, the missing workers, the changed routes. I want you to see the full shape of this, not walk into it on the strength of one official report.”",
        choices: [
          {
            label: "I'll collect every cellar notice, then come back.",
            effect: () => setDialogue(null),
          },
        ],
      });
    if (flags.gotDungeonLead)
      return setDialogue({
        portrait: "🛡️",
        name: "Captain Hollis",
        text: 'Hollis keeps the cellar key ready on the desk. The questions are not gone, but the permission is settled. "You know what the wall shows," he says. "Go below when you are ready, and come back with truth instead of rumors."',
        choices: [
          {
            label: companionIsConscious
              ? "We're ready. Take us to the Root Cellar."
              : "I'm ready to go below.",
            effect: beginRootCellarDeparture,
          },
        ],
      });
    if (flags.askedHollisAboutEdden)
      return setDialogue({
        portrait: "🛡️",
        name: "Captain Hollis",
        text: 'Hollis sees you return and rests one hand beside the key. He does not make you ask about Edden again. "You have the shape of it now: missing porters, altered routes, and a runner who came back speaking old road names. If you are ready, take the key and go carefully."',
        choices: [
          {
            label: companionIsConscious
              ? "We're ready. Take us to the Root Cellar."
              : "I'm ready to go below.",
            effect: beginRootCellarDeparture,
          },
          {
            label: "I still need a moment.",
            effect: () => setDialogue(null),
          },
        ],
      });
    setDialogue({
      portrait: "🛡️",
      name: "Captain Hollis",
      text: "Hollis lays a heavy key on the table but does not let go of it at first. “The cellar porters vanished after reporting movement below the old root storage rooms. Then route orders changed, cargo stalled, and fear started traveling faster than carts. Enna thinks the same hand is touching all of it. I agree.” He finally releases the key. “If something under Bramblecross is feeding this lie, I need someone quick enough to move carefully and stubborn enough to come back with the truth. Not glory. Not guesses. Truth. And if you find anything that explains what Edden heard down there, bring it back.”",
      choices: [
        {
          label: "I'll investigate the Root Cellar.",
          effect: beginRootCellarDeparture,
        },
        {
          label: "Tell me more about Edden first.",
          effect: () => {
            setFlags((f) => ({ ...f, askedHollisAboutEdden: true }));
            setDialogue({
              portrait: "🛡️",
              name: "Captain Hollis",
              text: "Hollis looks at the cracked lantern again. “Edden is seventeen. Fast runner. Terrible at cards. Good at remembering details. He went below joking that cellar ghosts would have to file a complaint if they wanted his attention. When we found him, he kept repeating three phrases: hold the root, misdirect the road, and the old way still listens. We thought it was shock-talk until your road report gave two of those words weight. So no, I am not being cautious because I doubt you. I am being cautious because I believe the danger is smarter than it first looked.”",
              choices: [
                {
                  label: companionIsConscious
                    ? "Then take us to the Root Cellar."
                    : "Then I'm ready to go below.",
                  effect: beginRootCellarDeparture,
                },
                {
                  label: "I need a moment before going below.",
                  effect: () => setDialogue(null),
                },
              ],
            });
          },
        },
      ],
    });
  };
  const openCellarDialogue = () => {
    if (!flags.gotDungeonLead)
      return setToast("You do not know enough to go below yet.");
    setDialogue({
      portrait: "🕳️",
      name: "Old Root Cellar",
      text:
        flags.beatCellarBoss && !flags.chapterOneClear
          ? "The guardian is down, but the sealed iron door still holds the cellar's answer. The investigation is not finished until you face what the Warden guarded."
          : "The old root cellar squats behind the watchhouse like a mouth trying not to open. Someone has freshly scraped mud away from the hinges. The air leaking through the cracks smells of cold stone, old vegetables, and something green that should not be growing underground.",
      choices: flags.beatCellarBoss && !flags.chapterOneClear
        ? [
            {
              label: "Return to the sealed door.",
              effect: () => {
                travelToRegion(
                  "rootCellar",
                  { x: 10, y: 4 },
                  "Old Root Cellar",
                  "You return to the truth waiting behind the fallen Warden.",
                );
                openExitDoorDialogue({ beatCellarBoss: true });
              },
            },
          ]
        : [
        {
          label: "Descend into the Root Cellar.",
          effect: () => {
            setFlags((f) => ({ ...f, enteredRootCellar: true }));
            setDialogue(null);
            travelToRegion(
              "rootCellar",
              MAPS.rootCellar.start,
              "Old Root Cellar",
              "You descend into the Old Root Cellar.",
            );
          },
        },
        { label: "Not yet.", effect: () => setDialogue(null) },
      ],
    });
  };
  const openMerchantDialogue = () => {
    if (flags.chapterReported && !flags.adaSealLessonComplete)
      return openAdaSealLesson();
    if (flags.chapterReported && flags.adaSealLessonComplete && !flags.chapterTwoClear)
      return openAdaSealLesson();
    if (
      flags.boardQuestAccepted &&
      flags.cartRecoveredForAda &&
      !flags.boardQuestCompleted
    )
      return setDialogue({
        portrait: "🧺",
        name: "Ada Willowmarket",
        text: "Ada takes the crate-mark rubbing and goes very still. For the first time, the market around her seems louder than she is. “That is my paint. My seal. My missing spice crate.” She turns the cut piece of crate lid in her hands, running one thumb over the place where the three-leaf mark was carved away. “They did not want the spice. Not really. If they wanted spice, they would have taken jars and left splinters. They wanted the seal. With this mark, a crate can pass as Willow Market goods. A guard sees it and waves it through. A porter stacks it without opening it. A clerk records it as ordinary. False orders above, false cargo below. Same trick, different wrapping.”",
        choices: [
          {
            label: "Tell her about the forged orders too.",
            effect: () =>
              setDialogue({
                portrait: "🧺",
                name: "Ada Willowmarket",
                text: "When you show her the forged route language, Ada's expression hardens into something colder than anger. “Of course,” she says. “A forged order tells people what to fear. A forged crate tells people what not to inspect. Put those together and you can move goods, messages, or prisoners through a town while everyone argues about the paperwork.” She pulls a small handpie from under the counter and wraps it with more force than strictly necessary. “Take this. Also take eight gold. Also take my professional opinion that whoever is doing this deserves to step barefoot on a crate nail. And if you find crates below the town marked with my seal, they are not mine. Remember that.”",
                choices: [
                  {
                    label: "I'll remember.",
                    effect: () => {
                      setFlags((f) => ({
                        ...f,
                        boardQuestCompleted: true,
                        marketDiscount: true,
                      }));
                      setPlayer((p) => ({
                        ...p,
                        gold: p.gold + 8,
                        xp: p.xp + 6,
                      }));
                      gainItem(setPlayer, "fizzberry_handpie", 1);
                      setDialogue(null);
                      announce(
                        "Ada pays what she can and slips you a handpie for the road.",
                        [{ id: "fizzberry_handpie", qty: 1 }],
                      );
                    },
                  },
                ],
              }),
          },
        ],
      });
    setDialogue({
      portrait: "🧺",
      name: "Ada Willowmarket",
      text: flags.boardQuestAccepted
        ? "Ada has a ledger open on one side of the stall and a rolling pin on the other, which feels like a complete philosophy of business. “If you find the broken cart, look for green Willow Market paint and a spice seal shaped like three leaves,” she says. “If the crate was stolen, I want proof. If it was smashed, I want to be angry accurately.” She pauses, then lowers her voice. “And if the seal is gone, that is worse than stolen spice. Spice can be replaced. Trust cannot.”"
        : "Ada Willowmarket does not waste motion. She weighs beans, corrects a delivery slip, and eyes the road in the same breath. Her stall smells of cinnamon, lamp oil, dried apples, and the sort of worry that has been carefully organized into ledgers. “Bramblecross runs on carts, flour, salt, lamp oil, and people arriving roughly when they promised,” she says. “None of that feels dependable today.” She taps a little green stamp beside her ledger: three leaves inside a circle. “That mark means something here. If a crate has the Willow seal, people let it pass. Which is why I am very interested in the crate that did not arrive.”",
      choices: [
        {
          label: flags.boardQuestAccepted
            ? "I'll look for the crate marks."
            : "That sounds like another piece of the pattern.",
          effect: () => setDialogue(null),
        },
      ],
    });
  };
  const openCartDialogue = () => {
    const roadMarkCheck = () => {
      const alreadyAttempted = !!flags.cartTrackCheckAttempted;
      const check = alreadyAttempted
        ? null
        : resolveSkillCheck(derivedStats, "Instinct", 11);
      const success = alreadyAttempted
        ? !!flags.cartTrackCheckSucceeded
        : !!check?.success;
      if (!alreadyAttempted)
        setFlags((f) => ({
          ...f,
          cartTrackCheckAttempted: true,
          cartTrackCheckSucceeded: success,
        }));
      const successText =
        "The wheel-ruts bend sharply toward the ditch, but the hoofprints do not panic. That is the strange part. Whoever stopped this cart was calm enough afterward to cut away the identifying marks. The missing seal was removed by hand, not broken loose in the crash.";
      const failText =
        "The cart is a mess of mud, splinters, and bent iron. You gather enough paint flakes and crate-lid splinters for Ada to inspect, but the road marks blur together before they give up anything more certain.";
      setDialogue({
        portrait: "🛒",
        mapVignette: "lanternCart",
        name: "Cart Tracks",
        text: `${alreadyAttempted ? "You review the road marks you already examined." : checkSummary(check)}

${success ? successText : failText}`,
        choices: [
          {
            label: "Recover proof for Ada.",
            effect: () => {
              setFlags((f) => ({
                ...f,
                searchedCart: true,
                cartRecoveredForAda: true,
              }));
              setPlayer((p) => ({ ...p, xp: p.xp + (success ? 7 : 5) }));
              setDialogue(null);
              setToast(
                `You recover proof for Ada. XP +${success ? 7 : 5}`,
              );
            },
          },
          { label: "Leave it for now.", effect: () => setDialogue(null) },
        ],
      });
    };
    if (flags.boardQuestCompleted)
      return setDialogue({
        portrait: "🛒",
        mapVignette: "lanternCart",
        name: "Broken Cart",
        text: "The broken cart is still here, but now it feels less like a mystery and more like a witness that has finally been believed. The green paint flakes, cut spice seal, and missing crate all point back to Ada's account: someone intercepted Bramblecross goods and tried to erase the trail.",
        choices: [{ label: "Move on.", effect: () => setDialogue(null) }],
      });
    if (flags.boardQuestAccepted && !flags.cartRecoveredForAda)
      return setDialogue({
        portrait: "🛒",
        mapVignette: "lanternCart",
        name: "Broken Cart",
        text: "Now that Ada's notice is in your head, the cart changes from roadside clutter into evidence. Green paint flakes cling to the axle. A spice seal shaped like three leaves has been cut from a crate lid, not broken off. The raider did not merely loot the cart. He removed the parts that would prove where it came from.",
        choices: [
          {
            label: "Recover the paint flakes and cut seal for Ada.",
            effect: () => {
              setFlags((f) => ({
                ...f,
                searchedCart: true,
                cartRecoveredForAda: true,
              }));
              setPlayer((p) => ({ ...p, xp: p.xp + 5 }));
              setDialogue(null);
              setToast("You recover proof for Ada. XP +5");
            },
          },
          {
            label: flags.cartTrackCheckAttempted
              ? "Review the road marks."
              : "Look over the road marks first.",
            requirement: flags.cartTrackCheckAttempted
              ? undefined
              : "Instinct Check DC 11",
            effect: roadMarkCheck,
          },
        ],
      });
    setDialogue({
      portrait: "🛒",
      mapVignette: "lanternCart",
      name: "Broken Cart",
      text: flags.searchedCart
        ? "The broken cart has nothing left to give except questions. The missing crate still bothers you: smashed goods scatter loudly, but stolen goods disappear quietly."
        : "A broken cart leans beside the road, one wheel sunk into mud. One crate has been smashed open. Another is missing entirely. Without knowing whose goods these were, you can only tell that the damage was quick, deliberate, and interrupted. A handful of moonmint leaves poke through a cracked slat, somehow cheerful about surviving the whole thing.",
      choices: flags.searchedCart
        ? [
            {
              label: "Step away from the wreck.",
              effect: () => setDialogue(null),
            },
          ]
        : [
            {
              label: "Search remaining supplies.",
              effect: () => {
                setFlags((f) => ({ ...f, searchedCart: true }));
                gainItem(setPlayer, "moonmint", 1);
                setDialogue(null);
                announce("You salvage Moonmint from the broken cart.", [
                  { id: "moonmint", qty: 1 },
                ]);
              },
            },
            {
              label: "Look for ownership marks.",
              requirement: "Instinct Check DC 10",
              effect: () => {
                const check = resolveSkillCheck(derivedStats, "Instinct", 10);
                setDialogue({
                  portrait: "🛒",
                  mapVignette: "lanternCart",
                  name: "Broken Cart",
                  text: `${checkSummary(check)}

${check.success ? "You find a scrape of green paint, a cut mark where a seal used to be, and a faint smell of spice under the mud. You cannot place it yet, but it feels like proof waiting for the right person to name it." : "You find a scrape of green paint under the mud. It might be ordinary wagon paint, or it might matter later. Without a local owner, it stays a color instead of a clue."}`,
                  choices: [
                    {
                      label: "Keep that in mind.",
                      effect: () => {
                        setFlags((f) => ({ ...f, searchedCart: true }));
                        setDialogue(null);
                      },
                    },
                  ],
                });
              },
            },
          ],
    });
  };

  const openShrineDialogue = () => {
    if (!flags.sawShrine) setFlags((f) => ({ ...f, sawShrine: true }));
    if (flags.usedShrine)
      return setDialogue({
        portrait: "✨",
        mapVignette: "lanternShrine",
        name: "Lantern Shrine",
        text: `The roadside shrine glows with a quieter light now. The little bronze lantern above it has stopped swinging, but warmth still lingers in the stone. The false crown mark is gone. Beneath it, the true road signs remain: shelter, water, warning, witness. Around the base, the old traveler saying holds steady:

A road is safest when truth walks it first.`,
        choices: [
          {
            label: "Rest a hand on the warm stone.",
            effect: () => setDialogue(null),
          },
        ],
      });
    setDialogue({
      portrait: "✨",
      mapVignette: "lanternShrine",
      name: "Lantern Shrine",
      text: `A waist-high shrine stands where Lantern Road dips between two old stones, half-hidden by violet moss and old candle-stubs. The bronze lantern inside is unlit, but the glass catches sunlight that is not falling from the sky. Scratched names cover the shrine: drivers, couriers, pilgrims, market children practicing letters, and little route marks carved by people who needed the road to remember them kindly. Around the base, worn almost smooth by weather and touch, is an old traveler saying:

A road is safest when truth walks it first.

But one fresh mark cuts across the older names: a false crown seal, copied badly. It has been scratched over the lantern marks as if command could erase memory.`,
      choices: [
        {
          label: "Clean the false seal from the shrine.",
          effect: () => {
            setFlags((f) => ({
              ...f,
              usedShrine: true,
              foundShrineSecret: true,
            }));
            setPlayer((p) => ({
              ...p,
              hp: Math.min(p.maxHp, p.hp + 8),
              baseStats: addBonuses(p.baseStats, { Will: 1 }),
            }));
            setDialogue(null);
            setToast("The shrine warms under your hand. HP +8 • Will +1");
          },
        },
        {
          label: flags.shrineStudyAttempted
            ? "Review the true road marks."
            : "Study the true road marks.",
          requirement: flags.shrineStudyAttempted
            ? undefined
            : "Will Check DC 10",
          effect: () => {
            const alreadyAttempted = !!flags.shrineStudyAttempted;
            const check = alreadyAttempted
              ? null
              : resolveSkillCheck(derivedStats, "Will", 10);
            const success = alreadyAttempted
              ? !!flags.shrineStudySucceeded
              : !!check?.success;
            if (!alreadyAttempted)
              setFlags((f) => ({
                ...f,
                shrineStudyAttempted: true,
                shrineStudySucceeded: success,
              }));
            setDialogue({
              portrait: "✨",
              mapVignette: "lanternShrine",
              name: "Lantern Shrine",
              text: `${alreadyAttempted ? "You retrace the marks you already studied." : checkSummary(check)}

${success ? "The marks settle into meaning as you trace them: water here, shelter north, broken bridge east, safe camp beyond the pines. These signs do not order anyone around. They simply tell the truth to the next traveler. Then you notice three recent courier marks scratched in a hurry, each beside a tiny arrow pointing toward Bramblecross. The shrine has not been silent. It has been interrupted." : "Most of the shrine marks are old, layered, and worn smooth by weather. The fresh crown scratch is easier to see than the cuts beneath it, which is probably why it was put there."}`,
              choices: [
                {
                  label: "Clean the false seal and honor the true marks.",
                  effect: () => {
                    setFlags((f) => ({
                      ...f,
                      usedShrine: true,
                      foundShrineSecret: true,
                    }));
                    setPlayer((p) => ({
                      ...p,
                      hp: Math.min(p.maxHp, p.hp + 8),
                      baseStats: addBonuses(p.baseStats, { Will: 1 }),
                      xp: p.xp + (success ? 4 : 0),
                    }));
                    setDialogue(null);
                    setToast(
                      `The shrine warms under your hand. HP +8 • Will +1${success ? " • XP +4" : ""}`,
                    );
                  },
                },
                {
                  label: "Leave the shrine for now.",
                  effect: () => setDialogue(null),
                },
              ],
            });
          },
        },
        {
          label: "Leave the shrine untouched.",
          effect: () => setDialogue(null),
        },
      ],
    });
  };

  const openRoadCacheDialogue = () => {
    if (flags.openedWildChest)
      return setDialogue({
        portrait: "📦",
        mapVignette: "lanternCache",
        name: "Road Cache",
        text: "The road cache is open and empty now, except for a cedar smell and a polite note reminding travelers not to store fish in shared emergency boxes again.",
        choices: [{ label: "Fair rule.", effect: () => setDialogue(null) }],
      });
    setDialogue({
      portrait: "📦",
      mapVignette: "lanternCache",
      name: "Road Cache",
      text: "A cedar road cache is tucked under roots beside the path. It bears a faded lantern mark: public supplies for travelers in trouble. The latch is stiff, but not locked. A previous visitor took the obvious food and left the practical gear behind, which says a lot about that visitor's priorities.",
      choices: [
        {
          label: "Open the cache.",
          effect: () => {
            setFlags((f) => ({ ...f, openedWildChest: true }));
            gainItem(setPlayer, "briar_vest", 1);
            setDialogue(null);
            announce("You find a Briarweave Vest in the road cache.", [
              { id: "briar_vest", qty: 1 },
            ]);
          },
        },
        { label: "Leave it closed.", effect: () => setDialogue(null) },
      ],
    });
  };

  const openRootSigilDialogue = () =>
    setDialogue({
      portrait: "✶",
      artKey: "rootCellarSigil",
      name: "Root Sigil",
      text: flags.readCellarSigil
        ? "The sigil no longer flickers, but its message remains scratched into your memory: HOLD THE ROOT. MISDIRECT THE ROAD."
        : "A root-shaped sigil has been painted on the stone in dark green pigment. It is not old like the cellar walls. It is recent, deliberate, and ugly with purpose. The words beneath it read: HOLD THE ROOT. MISDIRECT THE ROAD. Whoever wrote this wanted the road confused and the cellar protected.",
      choices: [
        {
          label: flags.readCellarSigil
            ? "Move on."
            : "Copy the sigil into your notes.",
          effect: () => {
            setFlags((f) => ({ ...f, readCellarSigil: true }));
            setDialogue(null);
          },
        },
      ],
    });

  const openRootMuralDialogue = () =>
    setDialogue({
      portrait: "🧱",
      artKey: "rootCellarMural",
      name: "Route Mural",
      text: flags.readCellarMural
        ? "The mural's faded arrows still show the same hidden logic: food above, routes below, and Bramblecross built over more passages than its people remember."
        : "The wall mural is older than the sigil by generations. Faded arrows link storehouses, root cellars, roadside markers, and an old tunnel symbol that has been scratched out so many times it has become darker than the paint around it. Bramblecross was not merely built beside the road. It was built over it.",
      choices: [
        {
          label: flags.readCellarMural
            ? "Step back from the mural."
            : "Study the hidden route pattern.",
          effect: () => {
            if (!flags.readCellarMural)
              setPlayer((p) => ({ ...p, xp: p.xp + 6 }));
            setFlags((f) => ({ ...f, readCellarMural: true }));
            setDialogue(null);
            if (!flags.readCellarMural)
              setToast("You understand part of the old route map. XP +6");
          },
        },
      ],
    });

  const openCellarCacheDialogue = () => {
    if (flags.openedCellarCache)
      return setDialogue({
        portrait: "📦",
        name: "Cellar Cache",
        text: "The cache hangs open. Whoever stocked it expected people to be down here long enough to need emergency fizzpops, which is not a comforting thought.",
        choices: [{ label: "Move on.", effect: () => setDialogue(null) }],
      });
    setDialogue({
      portrait: "📦",
      name: "Cellar Cache",
      text: "A small supply cache is wedged behind a cracked barrel. It has the same lantern mark as the road cache, but someone has tried to scrape it away. Inside, something glassy rolls with a soft clink.",
      choices: [
        {
          label: "Open the cache.",
          effect: () => {
            setFlags((f) => ({ ...f, openedCellarCache: true }));
            gainItem(setPlayer, "healing_fizzpop", 1);
            setDialogue(null);
            announce("You find a Healing Fizzpop in the cellar cache.", [
              { id: "healing_fizzpop", qty: 1 },
            ]);
          },
        },
        { label: "Leave it alone.", effect: () => setDialogue(null) },
      ],
    });
  };

  const openCellarFungusDialogue = () => {
    if (flags.harvestedCellarFungus)
      return setDialogue({
        portrait: "🍄",
        name: "Glowcap Cluster",
        text: "The glowcap stalks you harvested have already curled back into the wall. A few pale spores drift upward like tiny lanterns learning to float.",
        choices: [
          { label: "Pretty, but suspicious.", effect: () => setDialogue(null) },
        ],
      });
    setDialogue({
      portrait: "🍄",
      name: "Glowcap Cluster",
      text: "A cluster of bubblecaps grows from a crack in the wet stone. They pulse with faint blue light whenever the cellar groans. Pibble would either call this a clue or try to measure it with a spoon.",
      choices: [
        {
          label: "Harvest one carefully.",
          effect: () => {
            setFlags((f) => ({ ...f, harvestedCellarFungus: true }));
            gainItem(setPlayer, "bubblecap", 1);
            setDialogue(null);
            announce("You harvest a Bubblecap from the cellar wall.", [
              { id: "bubblecap", qty: 1 },
            ]);
          },
        },
        {
          label: "Leave the glowing fungus alone.",
          effect: () => setDialogue(null),
        },
      ],
    });
  };

  const openSkulkDialogue = (fallbackPosition) =>
    setDialogue({
      portrait: "🦂",
      name: "Rustroot Skulk",
      text: "Something clicks in the wall. A rust-colored shape peels itself from the roots, all jointed legs and splintered shell. It does not look hungry. It looks assigned.",
      choices: [
        {
          label: "Fight the skulk.",
          effect: () => {
            setDialogue(null);
            startBattle(buildEncounterEnemies("cellarSkulk"), "cellarSkulk");
          },
        },
        {
          label: "Back away for now.",
          effect: () => {
            if (fallbackPosition) {
              setPosition(fallbackPosition);
              revealArea("rootCellar", fallbackPosition.x, fallbackPosition.y);
              setToast("You back away from the skulk.");
            }
            setDialogue(null);
          },
        },
      ],
    });

  const openBossDialogue = () =>
    setDialogue({
      portrait: "👹",
      name: "Briar Knot Warden",
      text: "The chamber tightens around you. Roots braid together over a rusted chain, dragging broken boards and old iron into the shape of a hulking warden. A strip of forged seal-cloth flutters from its chest like a badge made by someone who never understood honor. It raises one knotted arm and the cellar answers with a groan.",
      choices: [
        {
          label: "Stand and fight.",
          effect: () => {
            setDialogue(null);
            startBattle(buildEncounterEnemies("cellarBoss"), "cellarBoss");
          },
        },
        {
          label: "Fall back and prepare.",
          effect: () => {
            setPosition({ x: 9, y: 5 });
            revealArea("rootCellar", 9, 5);
            setDialogue(null);
            setToast("You fall back from the Warden's reach.");
          },
        },
      ],
    });

  const getActiveCompanionReaction = (
    beat,
    assumedFlags: Partial<Flags> = {},
  ) => {
    const viewFlags = { ...flags, ...assumedFlags };
    if (beat === "sealedDoor" && viewFlags.cellarCompanionDoorReactionHeard)
      return "";
    return companionIsConscious
      ? getChapter1CompanionReaction(companion.id, beat)
      : "";
  };

  const openChapterOneCompletionDialogue = (
    studiedBriarCrown = false,
    assumedFlags: Partial<Flags> = {},
  ) => {
    const companionDoorReaction = getActiveCompanionReaction(
      "sealedDoor",
      assumedFlags,
    );
    setDialogue({
      portrait: "✨",
      artKey: "chapterOneEnding",
      name: "Chapter 1 Complete: The Road That Lied",
      size: "wide",
      contentLayout: "stacked",
      text: CHAPTER_1_STORY.rootCellar.completionTableau,
      choices: [
        companionDoorReaction
          ? {
              label: `Ask ${companion.name} about the door.`,
              effect: () =>
                openCellarCompanionReaction("sealedDoor", studiedBriarCrown, true),
            }
          : null,
        { label: "Return with the truth.", effect: () => setDialogue(null) },
      ].filter(Boolean),
    });
  };

  const completeCellarDiscovery = (
    studiedBriarCrown = false,
    assumedFlags: Partial<Flags> = {},
  ) => {
    gainItem(setPlayer, "warden_chain", 1);
    gainItem(setPlayer, "edden_cloth", 1);
    setFlags((f) => ({
      ...f,
      chapterOneClear: true,
      studiedBriarCrown: studiedBriarCrown || f.studiedBriarCrown,
      cellarEndChoice: "chain",
    }));
    openChapterOneCompletionDialogue(studiedBriarCrown, assumedFlags);
    announce(CHAPTER_1_STORY.rootCellar.discoveryCompleteToast, [
      { id: "warden_chain", qty: 1 },
      { id: "edden_cloth", qty: 1 },
    ]);
  };

  const openCellarCompanionReaction = (
    beat,
    studiedBriarCrown = false,
    returnToCompletion = false,
  ) => {
    const reaction = getActiveCompanionReaction(beat);
    if (!reaction) return;
    const heardDoorReaction = beat === "sealedDoor";
    if (heardDoorReaction)
      setFlags((f) => ({ ...f, cellarCompanionDoorReactionHeard: true }));
    setDialogue({
      portrait: companion.icon || "✨",
      name: companion.name,
      text: reaction,
      choices: returnToCompletion
        ? [
            {
              label: "Return to the chapter ending.",
              effect: () =>
                openChapterOneCompletionDialogue(
                  studiedBriarCrown,
                  heardDoorReaction
                    ? { cellarCompanionDoorReactionHeard: true }
                    : {},
                ),
            },
          ]
        : [
            {
              label: CHAPTER_1_STORY.rootCellar.takeProofLabel,
              effect: () =>
                completeCellarDiscovery(
                  studiedBriarCrown,
                  heardDoorReaction
                    ? { cellarCompanionDoorReactionHeard: true }
                    : {},
                ),
            },
            {
              label: "Return to the sealed door.",
              effect: () =>
                openExitDoorDialogue({
                  beatCellarBoss: true,
                  ...(heardDoorReaction
                    ? { cellarCompanionDoorReactionHeard: true }
                    : {}),
                }),
            },
          ],
    });
  };

  const openExitDoorDialogue = (assumedFlags: Partial<Flags> = {}) => {
    const viewFlags = { ...flags, ...assumedFlags };
    if (!viewFlags.beatCellarBoss)
      return setDialogue({
        portrait: "🚪",
        mapVignette: "rootCellarDoor",
        name: "Sealed Iron Door",
        text: CHAPTER_1_STORY.rootCellar.sealedDoorBeforeWarden,
        choices: [{ label: "Step back.", effect: () => setDialogue(null) }],
      });
    if (viewFlags.chapterOneClear)
      return setDialogue({
        portrait: "🚪",
        mapVignette: "rootCellarDoor",
        name: "Sealed Iron Door",
        text: CHAPTER_1_STORY.rootCellar.repeatAfterDiscovery,
        choices: [{ label: "Step back.", effect: () => setDialogue(null) }],
      });
    setDialogue({
      portrait: "🚪",
      mapVignette: "rootCellarDoor",
      name: "Sealed Iron Door",
      text: CHAPTER_1_STORY.rootCellar.sealedDoorAfterWarden,
      choices: [
        {
          label: flags.briarCrownCheckAttempted
            ? "Review the Briar Crown mark."
            : "Study the Briar Crown mark.",
          requirement: flags.briarCrownCheckAttempted
            ? undefined
            : "Will Check DC 12",
          effect: () => {
            const alreadyAttempted = !!flags.briarCrownCheckAttempted;
            const check = alreadyAttempted
              ? null
              : resolveSkillCheck(derivedStats, "Will", 12);
            const success = alreadyAttempted
              ? !!flags.briarCrownCheckSucceeded
              : !!check?.success;
            if (!alreadyAttempted)
              setFlags((f) => ({
                ...f,
                briarCrownCheckAttempted: true,
                briarCrownCheckSucceeded: success,
              }));
            setDialogue({
              portrait: "👑",
              artKey: "briarCrownMark",
              name: "Briar Crown Mark",
              text: `${alreadyAttempted ? "You review the mark without testing your first impression again." : checkSummary(check)}

${success ? CHAPTER_1_STORY.rootCellar.briarCrownStudySuccess : CHAPTER_1_STORY.rootCellar.briarCrownStudyFallback}`,
              choices: [
                {
                  label: CHAPTER_1_STORY.rootCellar.takeProofLabel,
                  effect: () => completeCellarDiscovery(true),
                },
                getActiveCompanionReaction("briarCrown")
                  ? {
                      label: `Hear ${companion.name}'s reaction.`,
                      effect: () =>
                        openCellarCompanionReaction("briarCrown", true),
                    }
                  : null,
                getActiveCompanionReaction("sealedDoor", viewFlags)
                  ? {
                      label: `Ask ${companion.name} about the door.`,
                      effect: () =>
                        openCellarCompanionReaction("sealedDoor", true),
                    }
                  : null,
              ].filter(Boolean),
            });
          },
        },
        {
          label: CHAPTER_1_STORY.rootCellar.takeProofLabel,
          effect: () => completeCellarDiscovery(false),
        },
        getActiveCompanionReaction("sealedDoor", viewFlags)
          ? {
              label: `Ask ${companion.name} about the door.`,
              effect: () => openCellarCompanionReaction("sealedDoor", false),
            }
          : null,
      ].filter(Boolean),
    });
  };

  const completeWestrootBriefing = (closingChoice) => {
    setFlags((f) => ({
      ...f,
      chapterReported: true,
      chapterTwoStarted: true,
      chapterTwoBriefed: true,
      chapterClosingChoice: closingChoice,
    }));
    setDialogue({
      portrait: "🗺️",
      name: "Chapter 2: The Westroot Trail",
      size: "wide",
      text: CHAPTER_1_STORY.reportBack.expeditionReady,
      choices: [{ label: "Continue", effect: () => setDialogue(null) }],
    });
  };

  const openWestrootLeadDialogue = () =>
    setDialogue({
      portrait: "🗺️",
      name: "Westroot",
      text: appendChapter1CompanionReaction(
        CHAPTER_1_STORY.reportBack.westrootLead,
        companionIsConscious ? companion.id : null,
        "reportBack",
      ),
      choices: CHAPTER_1_STORY.reportBack.closingChoices.map((label) => ({
        label,
        effect: () => completeWestrootBriefing(label),
      })),
    });

  const openChapterReportThreadsDialogue = () =>
    setDialogue({
      portrait: "🗂️",
      name: "The Case Wall Changes",
      messages: CHAPTER_1_STORY.reportBack.threadMessages,
      choices: [
        {
          label: "Show them the Briar Crown mark.",
          effect: () =>
            setDialogue({
              portrait: "👑",
              artKey: "briarCrownMark",
              name: "The Briar Crown",
              text: CHAPTER_1_STORY.reportBack.briarCrownInterpretation,
              choices: [
                {
                  label: "Ask about Westroot.",
                  effect: openWestrootLeadDialogue,
                },
              ],
            }),
        },
      ],
    });

  const openChapterReportDialogue = () =>
    setDialogue({
      portrait: "🗂️",
      name: "Bramblecross Watchhouse",
      size: "wide",
      text: CHAPTER_1_STORY.reportBack.opening,
      choices: [
        {
          label: "Tell them what the cellar revealed.",
          effect: () =>
            setDialogue({
              portrait: "🗂️",
              name: "The Case Wall Changes",
              messages: CHAPTER_1_STORY.reportBack.playerReportMessages(
                player.name,
              ),
              choices: [
                {
                  label: "Edden reached the door. He left proof.",
                  effect: () =>
                    setDialogue({
                      portrait: "🛡️",
                      name: "Captain Hollis",
                      messages:
                        CHAPTER_1_STORY.reportBack.hollisReceivesClothMessages,
                      choices: [
                        {
                          label: "Let Enna connect the threads.",
                          effect: openChapterReportThreadsDialogue,
                        },
                      ],
                    }),
                },
              ],
            }),
        },
      ],
    });

  const gainStoryItemOnce = (itemId) => {
    if (!hasItem(player, itemId, 1)) gainItem(setPlayer, itemId, 1);
  };

  const hasWillowmarkLens = () =>
    flags.adaSealLessonComplete || hasItem(player, "willowmark_lens", 1);

  const addLocalResult = (text, viewFlags: Flags & { localResult?: string } = {}) =>
    viewFlags.localResult ? `${text}\n\n${viewFlags.localResult}` : text;

  const chapter2CompanionLine = (rowan, tilda, moss, fallback = "") => {
    if (!companionIsConscious) return fallback;
    if (companion.id === "rowan") return rowan;
    if (companion.id === "tilda") return tilda;
    if (companion.id === "moss") return moss;
    return fallback;
  };

  const formatWestrootDoorWhisper = (repair) => {
    if (repair.readyToOpen)
      return "The inscription glows warm. Every false command behind you has gone quiet. The door is ready—speak the old road phrase.";
    if (repair.readyForRoadwatcher && repair.roadwatcherDefeated && !repair.crownFalsehoodCleared)
      return "The door listens past you toward the Crown Door. One false room is still speaking behind the road.";
    if (repair.readyForRoadwatcher)
      return "The false signs are exposed enough for the road to answer. Something behind the Crown Door has noticed.";
    if (repair.completedRequirements >= 2)
      return "The roots shift as if the threshold almost remembers its shape. The road behind you is closer to making sense.";
    if (repair.doorHasAskedForTruth)
      return "The door is not only listening to you. It is listening to the trail you just walked.";
    return "The no-handle door waits with the patience of a locked room that knows you have missed something.";
  };

  const openChapter2Briefing = () => {
    if (!flags.chapterReported)
      return setToast("Finish reporting Chapter 1 before following Westroot.");
    const briefingTableText = flags.eddenDrawingReceived
      ? "Enna has three records spread across the table: the public road, courier marks, and Edden's charcoal drawing. None of them agree, but they all point west."
      : "Enna has the public road and old courier marks spread across the table. A clear space waits between them for whatever Edden can remember clearly enough to share.";
    if (flags.chapterTwoBriefed)
      return setDialogue({
        portrait: "🗺️",
        name: "Westroot Briefing",
        size: "wide",
        text: flags.maraJoined
          ? `${briefingTableText} Mara watches the maps like they might try to leave without her.\n\nHollis has added Ada's name to the margin: if Willow-marked cargo appears west of town, her lens may show what ordinary eyes miss.`
          : `${briefingTableText}\n\nHollis nods toward the inn and the watchhouse door. "Choose your companion if you want one, then speak with Mara. She knows Lio's private marks better than any of us. Before you leave, borrow Ada's lens too. Her seal was named under the cellar, and Westroot may hide cargo lies as well as road lies."`,
        choices: [
          {
            label: "What exactly is Westroot?",
            effect: () =>
              setDialogue({
                portrait: "map",
                name: "Westroot",
                size: "wide",
                text: "Enna pulls out an older strip of parchment. \"Westroot is not listed like a town. It appears in old courier shorthand as a root mark, a lantern mark, and sometimes a storehouse tally. It may be a route, a gate, a hidden waystation, or all of those wearing one name.\"\n\nHollis looks toward the cellar stairs. \"Edden reached the sealed door and came back saying the old way still listens. If Westroot is part of that old way, then someone just opened more than a tunnel.\"",
                choices: [{ label: "Back to the map table.", effect: openChapter2Briefing }],
              }),
          },
          flags.eddenDrawingReceived
            ? {
                label: "Review Edden's drawing.",
                effect: () =>
                  setDialogue({
                    portrait: "paper",
                    name: "Edden's Drawing",
                    sceneImage: {
                      src: eddensThreeDoorDrawingScene,
                      alt: "Edden's shaky charcoal drawing of three root-buried doors.",
                    },
                    size: "wide",
                    text: CHAPTER_2_SCENE_COPY.edden.drawingReview,
                    choices: [{ label: "Back to the map table.", effect: openChapter2Briefing }],
                  }),
              }
            : null,
          !flags.maraJoined
            ? { label: "Call Mara into the plan.", effect: () => openMaraChapter2Dialogue() }
            : null,
          !flags.eddenDrawingReceived
            ? { label: "Visit Edden's recovery room.", effect: () => openEddenRecoveryDialogue() }
            : null,
          { label: "Step back.", effect: () => setDialogue(null) },
        ].filter(Boolean),
      });

    setDialogue({
      portrait: "🗺️",
      name: "Bramblecross Watchhouse",
      size: "wide",
      text: `${companionIsConscious ? "Enna nods once to the companion at your side. \"Good. One clear witness is better than a crowd of half-listeners.\"" : companion.recruited ? `Enna glances toward ${companion.name}. "Your witness needs rest before the road asks anything more of ${companionPronouns.object}."` : "Enna looks at the empty space beside you. \"You can follow this lead alone if you must, but I would rather you did not. The road west is not simply dangerous. It is being edited.\""}\n\nHollis stands near the case wall, where Edden's blue cloth is pinned beside the Briar Crown mark.\n\n\"The sealed cellar door still opens from the far side,\" he says. \"We cannot chase Westroot through it yet. But the old courier maps show a surface cut west of town that reaches the same buried road.\"\n\nEnna taps the public road map and the older courier marks, then leaves a deliberate space between them. Edden reached the buried road; his testimony belongs there when he is ready to give it.\n\n\"Someone else has already opened Westroot,\" she says. \"This chapter of the search is about proving where Lio went and whether he survived the gate. Mara reads his smallest marks. Ada's lens reads copied Willow marks. We should have both before the west road gets a vote.\"\n\nFor the first time, the room stops treating Lio Brindle like a route problem. He becomes someone's brother.`,
      choices: [
        {
          label: "What exactly is Westroot?",
          effect: () =>
            setDialogue({
              portrait: "🗺️",
              name: "Westroot",
              text: "Enna pulls out an older strip of parchment. \"Westroot is not listed like a town. It appears in old courier shorthand as a root mark, a lantern mark, and sometimes a storehouse tally. It may be a route, a gate, a hidden waystation, or all of those wearing one name.\"",
              choices: [{ label: "Then we follow the old marks.", effect: openChapter2Briefing }],
            }),
        },
        flags.eddenDrawingReceived
          ? {
              label: "Review Edden's drawing.",
              effect: () =>
                setDialogue({
                  portrait: "📜",
                  name: "Edden's Drawing",
                  sceneImage: {
                    src: eddensThreeDoorDrawingScene,
                    alt: "Edden's shaky charcoal drawing of three root-buried doors.",
                  },
                  size: "wide",
                  text: CHAPTER_2_SCENE_COPY.edden.drawingReview,
                  choices: [{ label: "Back to the map table.", effect: openChapter2Briefing }],
                }),
            }
          : {
              label: "Visit Edden's recovery room.",
              effect: () => {
                setFlags((f) => ({ ...f, chapterTwoBriefed: true, chapterTwoStarted: true }));
                openEddenRecoveryDialogue({ allowPreBriefing: true });
              },
            },
        {
          label: "How does this help us find Lio?",
          effect: () => {
            setFlags((f) => ({ ...f, chapterTwoBriefed: true, chapterTwoStarted: true }));
            setDialogue({
              portrait: "🧵",
              name: "Mara Brindle",
              text: "Enna draws a line from Hearthhollow to Lantern Road, then Bramblecross, then west. \"If Lio was moved through the old ways, Westroot is the next honest place to look. And if he left even one courier mark behind, someone who knows him may be able to read what the rest of us miss.\"\n\nA voice from the doorway says, \"That would be me, then.\"",
              choices: [{ label: "Mara, come in.", effect: openMaraChapter2Dialogue }],
            });
          },
        },
        {
          label: "I understand the lead.",
          effect: () => {
            setFlags((f) => ({ ...f, chapterTwoBriefed: true, chapterTwoStarted: true }));
            setDialogue(null);
            setToast("Chapter 2 started: The Westroot Trail.");
          },
        },
      ],
    });
  };

  const openMaraChapter2Dialogue = () => {
    setFlags((f) => ({ ...f, chapterTwoBriefed: true, chapterTwoStarted: true }));
    setDialogue({
      portrait: "🧵",
      name: "Mara Brindle",
      text: flags.maraJoined
        ? "Mara has arranged crumbs, string, and a button into what may be a route diagram. \"If Lio left a mark, it will be where grown-ups almost see it and then decide it is probably just dirt.\""
        : "A girl stands in the watchhouse doorway with road dust on her boots and a blue string tied around one wrist. \"I am Mara Brindle,\" she says. \"If you are making a plan about my brother without me, it is probably a worse plan than it needs to be.\"\n\nShe points to Edden's drawing. \"Lio writes small when he is worried. And if he wants me to know a mark is his, he adds a little hook-tail to the arrow.\"",
      choices: [
        {
          label: flags.maraJoined ? "I remember: hook-tail arrows." : "Then help us read what he left behind.",
          effect: () => {
            setFlags((f) => ({ ...f, maraJoined: true }));
            setPlayer((p) => ({ ...p, xp: p.xp + (flags.maraJoined ? 0 : 6) }));
            setDialogue(null);
            setToast(flags.maraJoined ? "Mara watches for Lio's marks." : "Mara joins the Westroot search. XP +6");
          },
        },
        { label: "Step back.", effect: () => setDialogue(null) },
      ],
    });
  };

  const openEddenRecoveryDialogue = ({ allowPreBriefing = false } = {}) => {
    if (!flags.chapterTwoBriefed && !allowPreBriefing)
      return setToast("Get the Westroot briefing from Enna and Hollis first.");
    setDialogue({
      portrait: "📜",
      portraitName: "Edden Vale",
      name: "Edden's Recovery Room",
      text: flags.eddenDrawingReceived
        ? CHAPTER_2_SCENE_COPY.edden.recoveryRepeat
        : CHAPTER_2_SCENE_COPY.edden.recoveryFirst,
      choices: [
        !flags.eddenDrawingReceived
          ? {
              label: "Take Edden's three-door drawing.",
              effect: () => {
                setFlags((f) => ({ ...f, eddenVisited: true, eddenDrawingReceived: true }));
                gainStoryItemOnce("eddens_three_door_drawing");
                setPlayer((p) => ({ ...p, xp: p.xp + 6 }));
                setDialogue(null);
                announce("Edden gives you his three-door drawing. XP +6", [{ id: "eddens_three_door_drawing", qty: 1 }]);
              },
            }
          : null,
        { label: "Let him rest.", effect: () => setDialogue(null) },
      ].filter(Boolean),
    });
  };

  const openAdaSealLesson = () => {
    if (!flags.eddenDrawingReceived)
      return setDialogue({
        portrait: "🔍",
        portraitName: "Ada Willowmarket",
        name: "Ada Willowmarket",
        text: "Ada turns a brass inspection lens beside her ledger, studying the tiny Willow mark on a practice crate tag. \"If Enna and Hollis are sending you west, I want to know what kind of lie you are walking into first. Bring me the watchhouse shape of it, and I will show you exactly how a copied Willow mark gives itself away.\"",
        choices: [{ label: "I'll speak with the watchhouse first.", effect: () => setDialogue(null) }],
      });
    if (flags.adaSealLessonComplete)
      return setDialogue({
        portrait: "🔍",
        portraitName: "Ada Willowmarket No Lens",
        name: "Ada Willowmarket",
        text: "Ada taps the Willowmark Lens. \"Remember: honest marks have familiar flaws. Mine has a nick in the left leaf. Copied marks are often too smooth. Altered marks have fresh scraping around the circle.\"",
        choices: [{ label: "I'll watch for that.", effect: () => setDialogue(null) }],
      });
    setDialogue({
      portrait: "🔍",
      portraitName: "Ada Willowmarket",
      name: "Ada's Seal Lesson",
      text: "Ada turns a practice crate-mark under a small brass lens. \"Trust is a tool,\" she says. \"A good seal lets tired people move food, oil, bandages, and news without arguing over every box. A copied seal steals that trust.\"\n\nUnder the lens, her honest Willow mark shows a tiny nick in the left leaf. \"That flaw is mine. If you see a mark too perfect, or stamped over scraped wax, be suspicious.\"",
      choices: [
        {
          label: "Borrow the Willowmark Lens.",
          effect: () => {
            setFlags((f) => ({ ...f, adaSealLessonComplete: true }));
            gainStoryItemOnce("willowmark_lens");
            setPlayer((p) => ({ ...p, xp: p.xp + 6 }));
            setDialogue({
              portrait: "🔍",
              portraitName: "Ada Willowmarket No Lens",
              name: "Ada Willowmarket",
              text: "Ada folds your fingers around the Willowmark Lens, and her own hand goes instinctively to the empty place on her work strap. \"Bring it back with fewer scratches than you bring back yourself,\" she says. \"And remember the nick in the left leaf. A perfect mark is often the most suspicious thing in the room.\"",
              choices: [{ label: "I'll bring it back.", effect: () => setDialogue(null) }],
            });
            announce("Ada lends you the Willowmark Lens. XP +6", [{ id: "willowmark_lens", qty: 1 }]);
          },
        },
      ],
    });
  };

  const openWestrootDeparture = () => {
    if (!flags.chapterTwoBriefed) return setToast("Get the Westroot lead from Enna and Hollis first.");
    if (!flags.maraJoined) return setToast("Mara may recognize Lio's personal marks. Speak with her at the watchhouse first.");
    if (!flags.eddenDrawingReceived) return setToast("Edden's drawing may help you read the road west.");
    if (!flags.adaSealLessonComplete)
      return setDialogue({
        portrait: "map",
        name: "Leave Without Ada's Lens?",
        size: "wide",
        text: "Hollis glances toward Willow Market before you leave. \"Ada's seal was named on the cellar door. If her mark is being used west of town, her lens may show what ordinary eyes miss.\"\n\nEnna does not block the gate. She only adds, \"You can follow Westroot now. Just know that copied seals and altered wax may stay silent if you do.\"",
        choices: [
          {
            label: "Leave without the Willowmark Lens.",
            effect: () =>
              setDialogue({
                portrait: "trail",
                name: "Leaving Bramblecross",
                text: "You choose speed over certainty. If the west road hides false cargo marks, you will have to read them without Ada's lens.",
                choices: [
                  { label: "Mara, watch for Lio's smallest marks.", effect: () => departToWestroot("lioMarks") },
                  { label: "Mara, keep Edden's drawing ready.", effect: () => departToWestroot("eddenDrawing") },
                  { label: "Mara, watch the lantern signs.", effect: () => departToWestroot("lanternSigns") },
                  { label: "Mara, stay behind us when danger starts.", effect: () => departToWestroot("safety") },
                  { label: "Stay in Bramblecross.", effect: () => setDialogue(null) },
                ],
              }),
          },
          { label: "I'll check in with Ada first.", effect: () => setDialogue(null) },
        ],
      });
    setDialogue({
      portrait: "✦",
      name: "Leaving Bramblecross",
      text: `The westward cut does not look like a road at first. It looks like a place where the grass has been persuaded to lean the same direction for a very long time.\n\nMara touches the blue string at her wrist. Hollis says, \"Mara stays behind the line when trouble starts.\"\n\n${companionIsConscious ? chapter2CompanionLine("Rowan adjusts his shield. \"Then we walk carefully.\"", "Tilda grins. \"I have always wanted to argue with a road.\"", "Moss touches the mossy lantern mark. \"Old roads ask so we remember what kind of travelers we are.\"") : companion.recruited ? `${companion.name} is still recovering. The westward cut will have to wait—or be faced without ${companionPronouns.possessive} help.` : "The westward cut waits in silence. It does not look safer for being quiet."}`,
      choices: [
        { label: "Mara, watch for Lio's smallest marks.", effect: () => departToWestroot("lioMarks") },
        { label: "Mara, keep Edden's drawing ready.", effect: () => departToWestroot("eddenDrawing") },
        { label: "Mara, watch the lantern signs.", effect: () => departToWestroot("lanternSigns") },
        { label: "Mara, stay behind us when danger starts.", effect: () => departToWestroot("safety") },
        { label: "Stay in Bramblecross.", effect: () => setDialogue(null) },
      ],
    });
  };

  const departToWestroot = (maraJob) => {
    setFlags((f) => ({ ...f, maraJob }));
    setDialogue(null);
    travelToRegion(
      "westrootTrail",
      MAPS.westrootTrail.start,
      "Westroot Trail",
      "You step onto the old Westroot Trail.",
    );
  };

  const openWestrootCutDialogue = () => {
    const alreadyStudied = !!flags.westrootCutStudied;
    const alreadyCopied = !!flags.westrootCutCopied;
    const repairMode = !!flags.noHandleStoneInspected;
    setDialogue({
      portrait: "✦",
      name: "Old Westward Cut",
      text: alreadyStudied
        ? repairMode
          ? "The westward cut looks different now that the no-handle door has refused you. The small cuts in the stone are not dramatic, but they are steady: an older road language under newer scratches."
          : "The old cut still points west. Mara keeps moving, eyes low, looking for the next mark Lio would have left in a hurry."
        : repairMode
          ? "Old cart ruts appear, vanish, then appear again under grass. A small route mark survives on a knee-high stone, half hidden by fresh scrapes. It is easy to miss because it is not trying to impress anyone."
          : "Old cart ruts appear, vanish, then appear again under grass. Mara is already ahead, one hand on the blue string at her wrist.\n\n\"Lio came this way,\" she says. \"He cuts his arrows low when he does not want tall people noticing them. West. Fast.\"",
      choices: [
        repairMode && !alreadyCopied
          ? {
              label: "Copy the old route mark.",
              effect: () => {
                setFlags((f) => ({
                  ...f,
                  westrootCutStudied: true,
                  westrootCutCopied: true,
                }));
                setPlayer((p) => ({ ...p, xp: p.xp + 4 }));
                setDialogue(null);
                setToast("You copy the old route mark. XP +4");
              },
            }
          : null,
        !repairMode && !alreadyStudied
          ? {
              label: "Keep following Lio's mark.",
              effect: () => {
                setFlags((f) => ({ ...f, westrootCutStudied: true }));
                setDialogue(null);
                setToast("Mara keeps the trail moving west.");
              },
            }
          : null,
        { label: "Continue west.", effect: () => setDialogue(null) },
      ].filter(Boolean),
    });
  };

  const openShelterNookDialogue = (assumedFlags: Flags & { localResult?: string } = {}) => {
    const viewFlags = { ...flags, ...assumedFlags };
    const repairMode = !!viewFlags.noHandleStoneInspected;
    setDialogue({
      portrait: "⌂",
      name: "Roadside Shelter Nook",
      text: addLocalResult(viewFlags.lioShelterMarkFound
        ? viewFlags.shelterNoticeRemoved
          ? "The turn-back notice is gone. Old traveler notes cover the cedar wall again, and Mara keeps glancing at the low hook-tailed arrow under the bench.\n\n\"West,\" she says. \"Still west. That part is really him.\""
          : "Mara finds the low hook-tailed arrow under the bench and presses both hands to her knees.\n\n\"Lio was here,\" she says. \"West. Still west. That part is really him.\""
        : viewFlags.shelterNoticeRemoved
          ? "The turn-back notice is gone. Behind it, old traveler notes cover the cedar wall: rain east, bridge low, berries safe after first frost, kindling tucked under the left stone."
        : repairMode
          ? "The cedar shelter waits under fern and root. The notice on the back wall is easier to notice on the way back: BY CROWN ORDER, ALL WESTBOUND TRAVELERS MUST RETURN TO BRAMBLECROSS AND AWAIT SAFE COMMAND.\n\nThe no-handle door's words tug at the memory of it."
          : "A small cedar shelter sits under fern and root. A posted warning says westbound travelers should return to Bramblecross until the road is safe.\n\nMara ignores the big notice and drops to one knee near the bench, searching low where Lio would expect her to look.", viewFlags),
      choices: [
        repairMode && !viewFlags.shelterNoticeRemoved
          ? {
              label: "Take down the turn-back notice.",
              effect: () => {
                setFlags((f) => ({ ...f, shelterNoticeRemoved: true }));
                if (!flags.shelterNoticeRemoved) setPlayer((p) => ({ ...p, xp: p.xp + 5 }));
                openShelterNookDialogue({
                  ...assumedFlags,
                  shelterNoticeRemoved: true,
                  localResult: "You uncover the old shelter notes. XP +5",
                });
              },
            }
          : null,
        !viewFlags.lioShelterMarkFound
          ? {
              label: "Search for Lio's mark.",
              effect: () => {
                setFlags((f) => ({ ...f, lioShelterMarkFound: true }));
                if (!flags.lioShelterMarkFound) setPlayer((p) => ({ ...p, xp: p.xp + 4 }));
                openShelterNookDialogue({
                  ...assumedFlags,
                  lioShelterMarkFound: true,
                  localResult: "Mara finds Lio's hook-tailed shelter mark. XP +4",
                });
              },
            }
          : null,
        !viewFlags.shelterRested
          ? {
              label: "Rest briefly.",
              effect: () => {
                setFlags((f) => ({ ...f, shelterRested: true }));
                setPlayer((p) => ({ ...p, hp: Math.min(p.maxHp, p.hp + 8) }));
                setCompanion((c) => (c.recruited ? { ...c, hp: Math.min(c.maxHp, c.hp + 8) } : c));
                setToast("The shelter gives everyone a little steadiness. HP +8");
                openShelterNookDialogue({ ...assumedFlags, shelterRested: true });
              },
            }
          : null,
        { label: "Leave the shelter.", effect: () => setDialogue(null) },
      ].filter(Boolean),
    });
  };

  const openFalseNoticeDialogue = (assumedFlags: Flags & { localResult?: string } = {}) => {
    const viewFlags = { ...flags, ...assumedFlags };
    const repairMode = !!viewFlags.noHandleStoneInspected;
    setDialogue({
      portrait: "!",
      name: "False Detour Notice",
      text: addLocalResult(viewFlags.falseNoticeLensUsed || viewFlags.falseNoticeLanternRead
        ? "The detour notice hangs crooked now, its seal broken and its post scraped clean enough for older marks to show through."
        : repairMode
          ? "The notice orders all westbound travelers to detour east and await Crown direction. You remember how quickly you passed it before. Now the nail heads, wax edge, and moss-covered scratch beside it all seem worth a second look."
          : "A fresh notice orders westbound travelers to detour east and return to Bramblecross. Mara looks past it, not at it, and finds a tiny hook-tailed arrow cut into the bark beyond.\n\n\"Lio did not turn back,\" she says. \"Neither do we.\"", viewFlags),
      choices: [
        repairMode && !viewFlags.falseNoticeInspected
          ? {
              label: "Check the seal closely.",
              effect: () => {
                setFlags((f) => ({ ...f, falseNoticeInspected: true }));
                openFalseNoticeDialogue({
                  ...assumedFlags,
                  falseNoticeInspected: true,
                  localResult: "The wax edge has been lifted and pressed down again.",
                });
              },
            }
          : null,
        repairMode && hasWillowmarkLens() && !viewFlags.falseNoticeLensUsed
          ? {
              label: "Use the Willowmark Lens on the seal.",
              effect: () => {
                setFlags((f) => ({
                  ...f,
                  falseNoticeLensUsed: true,
                  willowForgeryConfirmedAtHollow: true,
                  brokenSealWaxFound: true,
                }));
                gainStoryItemOnce("broken_false_seal_wax");
                if (!flags.falseNoticeLensUsed) setPlayer((p) => ({ ...p, xp: p.xp + 5 }));
                announce("The lens reveals scraped Willow wax under the false seal. XP +5", [{ id: "broken_false_seal_wax", qty: 1 }]);
                openFalseNoticeDialogue({
                  ...assumedFlags,
                  falseNoticeLensUsed: true,
                  willowForgeryConfirmedAtHollow: true,
                  brokenSealWaxFound: true,
                  localResult: "The lens reveals scraped Willow wax under the false seal. XP +5",
                });
              },
            }
          : null,
        repairMode && !viewFlags.falseNoticeLanternRead
          ? {
              label: "Clear the moss around the smaller scratch.",
              effect: () => {
                setFlags((f) => ({ ...f, falseNoticeLanternRead: true, trustedLanternBeforeHollow: true }));
                openFalseNoticeDialogue({
                  ...assumedFlags,
                  falseNoticeLanternRead: true,
                  trustedLanternBeforeHollow: true,
                  localResult: "The smaller scratch points west, almost hidden under the detour notice.",
                });
              },
            }
          : null,
        {
          label: repairMode ? "Test the false detour east anyway." : "Risk the detour east.",
          effect: () => {
            setFlags((f) => ({ ...f, followedFalseDetour: true, messyWestrootSolve: true }));
            setDialogue(null);
            setToast("The detour loops back on itself. Something wanted travelers confused.");
          },
        },
        { label: "Step away from the notice.", effect: () => setDialogue(null) },
      ].filter(Boolean),
    });
  };

  const openThreeHollowDialogue = (assumedFlags: Flags & { localResult?: string } = {}) => {
    const viewFlags = { ...flags, ...assumedFlags };
    const repairMode = !!viewFlags.noHandleStoneInspected;
    setDialogue({
      portrait: "3",
      name: "The Three-Sign Hollow",
      text: addLocalResult(viewFlags.crownSignRejected || viewFlags.crownSignLensUsed
        ? "The three warnings no longer agree with one another. One sign is down, one seal has cracked, and the third points back to Bramblecross with less confidence than paint should have."
        : repairMode
          ? "Three warning signs crowd a narrow hollow. TURN BACK EAST TOWARD BRAMBLECROSS. WESTROOT UNSAFE. AWAIT CROWN COMMAND.\n\nOn the first pass they were scenery. Now they feel like hands pushing at your shoulders."
          : "Three warning signs crowd a narrow hollow. TURN BACK EAST TOWARD BRAMBLECROSS. WESTROOT UNSAFE. AWAIT CROWN COMMAND.\n\nMara barely slows. \"Lio saw these too,\" she says. \"He still went on.\"", viewFlags),
      choices: [
        repairMode && !viewFlags.crownSignRejected
          ? {
              label: "Pull down the newest turn-back sign.",
              effect: () => {
                setFlags((f) => ({ ...f, crownSignRejected: true }));
                openThreeHollowDialogue({
                  ...assumedFlags,
                  crownSignRejected: true,
                  localResult: "The hollow looks less certain with one warning gone.",
                });
              },
            }
          : null,
        repairMode && hasWillowmarkLens() && !viewFlags.crownSignLensUsed
          ? {
              label: "Use the Willowmark Lens on the wax.",
              effect: () => {
                setFlags((f) => ({ ...f, crownSignLensUsed: true, willowForgeryConfirmedAtHollow: true }));
                openThreeHollowDialogue({
                  ...assumedFlags,
                  crownSignLensUsed: true,
                  willowForgeryConfirmedAtHollow: true,
                  localResult: "The lens catches scraped wax under a too-clean crown seal.",
                });
              },
            }
          : null,
        !viewFlags.crownSignRejected
          ? {
              label: repairMode ? "Test the false return path anyway." : "Turn back like the signs say.",
              effect: () => {
                setFlags((f) => ({
                  ...f,
                  followedFalseDetour: true,
                  trustedCrownSignAtHollow: true,
                  messyWestrootSolve: true,
                }));
                setToast("The return path bends strangely and drops you back where you started.");
                setDialogue(null);
              },
            }
          : null,
        { label: repairMode ? "Leave the hollow." : "Continue west, following Lio.", effect: () => setDialogue(null) },
      ].filter(Boolean),
    });
  };

  const stepBackFromThreeDoorThreshold = (fallbackPosition?: Position) => {
    const destination =
      fallbackPosition ||
      previousPositionByRegionRef.current.westrootTrail ||
      getNavigationDestination("westrootTrail", 6, 4, "down");
    if (destination) {
      previousPositionByRegionRef.current.westrootTrail = { x: 6, y: 4 };
      setPosition(destination);
      revealArea("westrootTrail", destination.x, destination.y);
      setToast("You step back from the three doors.");
    }
    setDialogue(null);
  };

  const openThreeDoorThresholdDialogue = (fallbackPosition, assumedFlags: Flags & { localResult?: string } = {}) =>
    setDialogue({
      portrait: CHAPTER_2_SCENE_COPY.threeDoorThreshold.portrait,
      name: CHAPTER_2_SCENE_COPY.threeDoorThreshold.name,
      sceneImage: {
        src: threeDoorsThresholdScene,
        alt: CHAPTER_2_SCENE_COPY.threeDoorThreshold.sceneAlt,
      },
      size: "wide",
      contentLayout: "split",
      choiceLayout: "grouped",
      text: addLocalResult(CHAPTER_2_SCENE_COPY.threeDoorThreshold.text, assumedFlags),
      choices: [
        {
          label: CHAPTER_2_SCENE_COPY.threeDoorThreshold.labels.crownDoor,
          choiceGroup: "doors",
          effect: () => openCrownDoorDialogue({}, fallbackPosition),
        },
        {
          label: CHAPTER_2_SCENE_COPY.threeDoorThreshold.labels.lanternDoor,
          choiceGroup: "doors",
          effect: () => openLanternDoorDialogue({}, fallbackPosition),
        },
        {
          label: CHAPTER_2_SCENE_COPY.threeDoorThreshold.labels.noHandleDoor,
          choiceGroup: "doors",
          effect: () => openNoHandleStoneDialogue({}, fallbackPosition),
        },
        flags.westrootGateOpened
          ? { label: CHAPTER_2_SCENE_COPY.threeDoorThreshold.labels.westrootGate, effect: () => openWestrootGateDialogue() }
          : null,
        !(flags.maraConsultedAtThreshold || assumedFlags.maraConsultedAtThreshold)
          ? {
              label: CHAPTER_2_SCENE_COPY.threeDoorThreshold.labels.maraRead,
              choiceGroup: "reads",
              effect: () => openMaraHollowJobDialogue(fallbackPosition),
            }
          : null,
        companionIsConscious &&
        !(flags.companionReadThreshold || assumedFlags.companionReadThreshold)
          ? {
              label: CHAPTER_2_SCENE_COPY.threeDoorThreshold.labels.companionRead,
              choiceGroup: "reads",
              effect: () => openCompanionHollowReadDialogue(fallbackPosition),
            }
          : null,
        {
          label: CHAPTER_2_SCENE_COPY.threeDoorThreshold.labels.back,
          variant: "quiet",
          effect: () => stepBackFromThreeDoorThreshold(fallbackPosition),
        },
      ].filter(Boolean),
    });

  const openCrownDoorDialogue = (assumedFlags: Flags & { localResult?: string } = {}, fallbackPosition) => {
    const viewFlags = { ...flags, ...assumedFlags };
    const canOpenDen = !!(viewFlags.crownDoorKeyFound || hasItem(player, "split_crown_slat", 1));
    setDialogue({
      portrait: CHAPTER_2_SCENE_COPY.crownDoor.portrait,
      name: CHAPTER_2_SCENE_COPY.crownDoor.name,
      visual: "crownDoor",
      size: "wide",
      contentLayout: "split",
      choiceLayout: "grouped",
      text: getCrownDoorText(viewFlags, canOpenDen),
      choices: [
        {
          label: viewFlags.crownSignRejected || viewFlags.crownSignLensUsed
            ? CHAPTER_2_SCENE_COPY.crownDoor.labels.reviewSign
            : CHAPTER_2_SCENE_COPY.crownDoor.labels.inspectSign,
          choiceGroup: "investigate",
          effect: () => openCrownSignDialogue(viewFlags, fallbackPosition),
        },
        canOpenDen
          ? {
              label: viewFlags.crownDoorDungeonCleared
                ? CHAPTER_2_SCENE_COPY.crownDoor.labels.returnDen
                : CHAPTER_2_SCENE_COPY.crownDoor.labels.openWithSlat,
              choiceGroup: "investigate",
              effect: () => enterCrownDoorDen(),
            }
          : !viewFlags.crownDoorTried
            ? {
              label: CHAPTER_2_SCENE_COPY.crownDoor.labels.tryDoor,
              choiceGroup: "investigate",
              effect: () => openBlockedCrownDoorDialogue({ ...assumedFlags, crownDoorTried: true }, fallbackPosition),
            }
            : null,
        !viewFlags.maraQuestionedCrownDoor
          ? {
          label: CHAPTER_2_SCENE_COPY.crownDoor.labels.askMara,
          choiceGroup: "reads",
          effect: () => {
            setFlags((f) => ({ ...f, maraQuestionedCrownDoor: true }));
            setDialogue({
              portrait: "🧵",
              name: "Mara at the Crown Door",
              text: CHAPTER_2_SCENE_COPY.crownDoor.maraRead,
              choices: [{ label: CHAPTER_2_SCENE_COPY.crownDoor.labels.backDoor, effect: () => openCrownDoorDialogue({ ...assumedFlags, maraQuestionedCrownDoor: true }, fallbackPosition) }],
            });
          },
        }
          : null,
        companionIsConscious && !viewFlags.companionReadCrownDoor
          ? {
              label: CHAPTER_2_SCENE_COPY.crownDoor.labels.askCompanion,
              choiceGroup: "reads",
              effect: () => {
                setFlags((f) => ({ ...f, companionReadCrownDoor: true }));
                openCompanionDoorReadDialogue("crown", fallbackPosition, viewFlags);
              },
            }
          : null,
        {
          label: CHAPTER_2_SCENE_COPY.crownDoor.labels.backThreshold,
          variant: "quiet",
          effect: () => openThreeDoorThresholdDialogue(fallbackPosition),
        },
      ].filter(Boolean),
    });
  };

  const openBlockedCrownDoorDialogue = (assumedFlags: Flags & { localResult?: string } = {}, fallbackPosition) => {
    const trustedFalseSign = !!assumedFlags.trustedCrownSignAtHollow;
    setFlags((f) => ({
      ...f,
      crownDoorTried: true,
      ...(trustedFalseSign
        ? {
            followedFalseDetour: true,
            trustedCrownSignAtHollow: true,
            messyWestrootSolve: true,
          }
        : {}),
    }));
    setDialogue({
      portrait: CHAPTER_2_SCENE_COPY.crownDoor.portrait,
      name: CHAPTER_2_SCENE_COPY.blockedCrownDoor.name,
      visual: "crownDoor",
      size: "wide",
      contentLayout: "split",
      text: trustedFalseSign
        ? CHAPTER_2_SCENE_COPY.blockedCrownDoor.text.trustedSign
        : CHAPTER_2_SCENE_COPY.blockedCrownDoor.text.tried,
      choiceLayout: "grouped",
      choices: [
        {
          label: CHAPTER_2_SCENE_COPY.blockedCrownDoor.labels.returnDoor,
          choiceGroup: "return",
          effect: () => openCrownDoorDialogue({ ...assumedFlags, crownDoorTried: true }, fallbackPosition),
        },
        {
          label: CHAPTER_2_SCENE_COPY.blockedCrownDoor.labels.returnThreshold,
          choiceGroup: "return",
          effect: () => openThreeDoorThresholdDialogue(fallbackPosition),
        },
      ],
    });
  };

  const enterCrownDoorDen = () => {
    setFlags((f) => ({
      ...f,
      crownDoorDungeonEntered: true,
      crownDoorUnlocked: true,
      crownDenAlertLevel: f.crownDoorDungeonCleared || f.crownDenPatrolDefeated ? f.crownDenAlertLevel : 0,
      crownDenPatrolEscaped: false,
    }));
    setDialogue(null);
    travelToRegion(
      "crownDoorDen",
      MAPS.crownDoorDen.start,
      "Crown Door Den",
      CHAPTER_2_SCENE_COPY.crownDoorDen.enterTravelText,
    );
  };

  const returnToThreeDoorThreshold = () => {
    if (!flags.crownDoorDungeonCleared && !flags.crownDenPatrolDefeated) {
      setFlags((f) => ({ ...f, crownDenPatrolEscaped: true, crownDenAlertLevel: 0 }));
    }
    travelToRegion(
      "westrootTrail",
      { x: 6, y: 4 },
      "Westroot Trail",
      CHAPTER_2_SCENE_COPY.crownDoorDen.returnTravelText,
    );
  };

  const openCrownVestibuleDialogue = () => {
    setFlags((f) => ({ ...f, crownDoorDungeonEntered: true }));
    setDialogue({
      portrait: "",
      portraitImage: crownDenPortraitImage(
        crownDenExitToken,
        CHAPTER_2_SCENE_COPY.crownDoorDen.vestibule.portraitAlt,
      ),
      name: CHAPTER_2_SCENE_COPY.crownDoorDen.vestibule.name,
      text: CHAPTER_2_SCENE_COPY.crownDoorDen.vestibule.text,
      choices: [{ label: CHAPTER_2_SCENE_COPY.crownDoorDen.vestibule.moveDeeper, effect: () => setDialogue(null) }],
    });
  };

  const openWaxTableDialogue = (assumedFlags: Flags & { localResult?: string } = {}) => {
    const viewFlags = { ...flags, ...assumedFlags };
    setDialogue({
      portrait: "wax",
      portraitImage: crownDenPortraitImage(
        viewFlags.crownDoorWaxTableCleared
          ? crownDenWaxTableClearedToken
          : crownDenWaxTableToken,
        CHAPTER_2_SCENE_COPY.crownDoorDen.waxTable.portraitAlt,
      ),
      name: CHAPTER_2_SCENE_COPY.crownDoorDen.waxTable.name,
      text: addLocalResult(
        viewFlags.crownDoorWaxTableCleared
          ? CHAPTER_2_SCENE_COPY.crownDoorDen.waxTable.text.cleared
          : CHAPTER_2_SCENE_COPY.crownDoorDen.waxTable.text.active,
        viewFlags,
      ),
      choices: [
        !viewFlags.crownDoorWaxTableCleared
          ? {
              label: hasWillowmarkLens()
                ? CHAPTER_2_SCENE_COPY.crownDoorDen.waxTable.labels.useLens
                : CHAPTER_2_SCENE_COPY.crownDoorDen.waxTable.labels.scrape,
              effect: () => {
                setFlags((f) => ({
                  ...f,
                  crownDoorWaxTableCleared: true,
                  willowForgeryConfirmedAtHollow: hasWillowmarkLens() || !!f.willowForgeryConfirmedAtHollow,
                }));
                gainStoryItemOnce("broken_false_seal_wax");
                setPlayer((p) => ({ ...p, xp: p.xp + 4 }));
                if (advanceCrownDenThreat()) return;
                openWaxTableDialogue({
                  crownDoorWaxTableCleared: true,
                  willowForgeryConfirmedAtHollow: hasWillowmarkLens(),
                  localResult: hasWillowmarkLens()
                    ? CHAPTER_2_SCENE_COPY.crownDoorDen.waxTable.results.lens
                    : CHAPTER_2_SCENE_COPY.crownDoorDen.waxTable.results.scrape,
                });
              },
            }
          : null,
        { label: CHAPTER_2_SCENE_COPY.crownDoorDen.waxTable.labels.leave, effect: () => setDialogue(null) },
      ].filter(Boolean),
    });
  };

  const openSlatRackDialogue = (assumedFlags: Flags & { localResult?: string } = {}) => {
    const viewFlags = { ...flags, ...assumedFlags };
    setDialogue({
      portrait: "sign",
      portraitImage: crownDenPortraitImage(
        viewFlags.crownDoorSlatsBroken
          ? crownDenSlatRackBrokenToken
          : crownDenSlatRackToken,
        CHAPTER_2_SCENE_COPY.crownDoorDen.slatRack.portraitAlt,
      ),
      name: CHAPTER_2_SCENE_COPY.crownDoorDen.slatRack.name,
      text: addLocalResult(
        viewFlags.crownDoorSlatsBroken
          ? CHAPTER_2_SCENE_COPY.crownDoorDen.slatRack.text.cleared
          : CHAPTER_2_SCENE_COPY.crownDoorDen.slatRack.text.active,
        viewFlags,
      ),
      choices: [
        !viewFlags.crownDoorSlatsBroken
          ? {
              label: CHAPTER_2_SCENE_COPY.crownDoorDen.slatRack.labels.breakSigns,
              effect: () => {
                setFlags((f) => ({ ...f, crownDoorSlatsBroken: true, crownSignRejected: true }));
                setPlayer((p) => ({ ...p, xp: p.xp + 4 }));
                if (advanceCrownDenThreat()) return;
                openSlatRackDialogue({
                  crownDoorSlatsBroken: true,
                  localResult: CHAPTER_2_SCENE_COPY.crownDoorDen.slatRack.result,
                });
              },
            }
          : null,
        { label: CHAPTER_2_SCENE_COPY.crownDoorDen.slatRack.labels.leave, effect: () => setDialogue(null) },
      ].filter(Boolean),
    });
  };

  const openWitnessLedgerDialogue = (assumedFlags: Flags & { localResult?: string } = {}) => {
    const viewFlags = { ...flags, ...assumedFlags };
    setDialogue({
      portrait: "book",
      portraitImage: crownDenPortraitImage(
        viewFlags.crownDoorWitnessLedgerFound
          ? crownDenWitnessLedgerCopiedToken
          : crownDenWitnessLedgerToken,
        CHAPTER_2_SCENE_COPY.crownDoorDen.witnessLedger.portraitAlt,
      ),
      name: CHAPTER_2_SCENE_COPY.crownDoorDen.witnessLedger.name,
      text: addLocalResult(
        viewFlags.crownDoorWitnessLedgerFound
          ? CHAPTER_2_SCENE_COPY.crownDoorDen.witnessLedger.text.copied
          : CHAPTER_2_SCENE_COPY.crownDoorDen.witnessLedger.text.active,
        viewFlags,
      ),
      choices: [
        !viewFlags.crownDoorWitnessLedgerFound
          ? {
              label: CHAPTER_2_SCENE_COPY.crownDoorDen.witnessLedger.labels.copy,
              effect: () => {
                setFlags((f) => ({ ...f, crownDoorWitnessLedgerFound: true }));
                gainStoryItemOnce("briar_signmaker_ledger");
                setPlayer((p) => ({ ...p, xp: p.xp + 5 }));
                if (advanceCrownDenThreat()) return;
                openWitnessLedgerDialogue({
                  crownDoorWitnessLedgerFound: true,
                  localResult: CHAPTER_2_SCENE_COPY.crownDoorDen.witnessLedger.result,
                });
              },
            }
          : null,
        { label: CHAPTER_2_SCENE_COPY.crownDoorDen.witnessLedger.labels.leave, effect: () => setDialogue(null) },
      ].filter(Boolean),
    });
  };

  const openCollarKennelDialogue = (assumedFlags: Flags & { localResult?: string } = {}) => {
    const viewFlags = { ...flags, ...assumedFlags };
    setDialogue({
      portrait: "link",
      portraitImage: crownDenPortraitImage(
        viewFlags.crownDoorCollarsBroken
          ? crownDenCollarKennelBrokenToken
          : crownDenCollarKennelToken,
        CHAPTER_2_SCENE_COPY.crownDoorDen.collarKennel.portraitAlt,
      ),
      name: CHAPTER_2_SCENE_COPY.crownDoorDen.collarKennel.name,
      text: addLocalResult(
        viewFlags.crownDoorCollarsBroken
          ? viewFlags.crownDenHoundFreed
            ? CHAPTER_2_SCENE_COPY.crownDoorDen.collarKennel.text.houndFreed
            : CHAPTER_2_SCENE_COPY.crownDoorDen.collarKennel.text.broken
          : CHAPTER_2_SCENE_COPY.crownDoorDen.collarKennel.text.active,
        viewFlags,
      ),
      choices: [
        !viewFlags.crownDoorCollarsBroken
          ? {
              label: CHAPTER_2_SCENE_COPY.crownDoorDen.collarKennel.labels.easeHound,
              effect: () => {
                const check = resolveSkillCheck(derivedStats, "Heart", 12);
                if (!check.success) {
                  setDialogue({
                    portrait: "link",
                    portraitImage: crownDenPortraitImage(
                      crownDenHoundWarningIcon,
                      "Painted thorn collar warning icon",
                    ),
                    name: CHAPTER_2_SCENE_COPY.crownDoorDen.collarKennel.failureName,
                    text: `${checkSummary(check)}\n\n${CHAPTER_2_SCENE_COPY.crownDoorDen.collarKennel.failureText}`,
                    choices: [
                      {
                        label: CHAPTER_2_SCENE_COPY.crownDoorDen.collarKennel.labels.battle,
                        effect: () => {
                          setDialogue(null);
                          startBattle(buildEncounterEnemies("crownDenHound"), "crownDenHound");
                        },
                      },
                    ],
                  });
                  return;
                }
                setFlags((f) => ({
                  ...f,
                  crownDoorCollarsBroken: true,
                  crownDenHoundFreed: true,
                }));
                setPlayer((p) => ({ ...p, xp: p.xp + 6 }));
                if (advanceCrownDenThreat()) return;
                openCollarKennelDialogue({
                  crownDoorCollarsBroken: true,
                  crownDenHoundFreed: true,
                  localResult: `${checkSummary(check)}\n\n${CHAPTER_2_SCENE_COPY.crownDoorDen.collarKennel.successResult}`,
                });
              },
            }
          : null,
        !viewFlags.crownDoorCollarsBroken
          ? {
              label: CHAPTER_2_SCENE_COPY.crownDoorDen.collarKennel.labels.force,
              effect: () => {
                setDialogue(null);
                startBattle(buildEncounterEnemies("crownDenHound"), "crownDenHound");
              },
            }
          : null,
        { label: CHAPTER_2_SCENE_COPY.crownDoorDen.collarKennel.labels.leave, effect: () => setDialogue(null) },
      ].filter(Boolean),
    });
  };

  const openCrownDenGuardDialogue = (fallbackPosition) => {
    if (flags.beatCrownDenGuard) return setToast(CHAPTER_2_SCENE_COPY.crownDoorDen.guard.defeatedToast);
    setDialogue({
      portrait: "!",
      portraitImage: crownDenPortraitImage(
        crownDenPatrolCaughtUpIcon,
        CHAPTER_2_SCENE_COPY.crownDoorDen.guard.portraitAlt,
      ),
      name: CHAPTER_2_SCENE_COPY.crownDoorDen.guard.name,
      text: CHAPTER_2_SCENE_COPY.crownDoorDen.guard.text,
      choices: [
        {
          label: CHAPTER_2_SCENE_COPY.crownDoorDen.guard.labels.clear,
          effect: () => {
            setDialogue(null);
            startBattle(buildEncounterEnemies("crownDenGuard"), "crownDenGuard");
          },
        },
        {
          label: CHAPTER_2_SCENE_COPY.crownDoorDen.guard.labels.backAway,
          effect: () => {
            if (fallbackPosition) {
              setPosition(fallbackPosition);
              revealArea("crownDoorDen", fallbackPosition.x, fallbackPosition.y);
            }
            setDialogue(null);
          },
        },
      ],
    });
  };

  const openFalseMapRoomDialogue = (assumedFlags: Flags & { localResult?: string } = {}) => {
    const viewFlags = { ...flags, ...assumedFlags };
    const missing = [
      !viewFlags.crownDoorWaxTableCleared ? "read the wax table" : null,
      !viewFlags.crownDoorSlatsBroken ? "break the false sign slats" : null,
      !viewFlags.crownDoorWitnessLedgerFound ? "copy the witness ledger" : null,
      !viewFlags.crownDoorCollarsBroken ? "break the spare thorn collars" : null,
      !viewFlags.beatCrownDenGuard ? "clear the signworks guard" : null,
    ].filter(Boolean);
    const ready = missing.length === 0;
    setDialogue({
      portrait: "map",
      portraitImage: crownDenPortraitImage(
        viewFlags.crownDoorDungeonCleared
          ? crownDenFalseMapClearedToken
          : crownDenFalseMapToken,
        CHAPTER_2_SCENE_COPY.crownDoorDen.falseMap.portraitAlt,
      ),
      name: CHAPTER_2_SCENE_COPY.crownDoorDen.falseMap.name,
      text: addLocalResult(getCrownDenFalseMapText(viewFlags, missing), viewFlags),
      choices: [
        ready && !viewFlags.crownDoorDungeonCleared
          ? {
              label: CHAPTER_2_SCENE_COPY.crownDoorDen.falseMap.labels.pull,
              effect: () => {
                setFlags((f) => ({
                  ...f,
                  crownDoorFalseMapRead: true,
                  crownDoorDungeonCleared: true,
                  cleanedLanternMarkFound: true,
                  crownSignRejected: true,
                }));
                gainStoryItemOnce("cleaned_lantern_mark");
                setPlayer((p) => ({ ...p, xp: p.xp + 8 }));
                openFalseMapRoomDialogue({
                  ...viewFlags,
                  crownDoorFalseMapRead: true,
                  crownDoorDungeonCleared: true,
                  cleanedLanternMarkFound: true,
                  localResult: CHAPTER_2_SCENE_COPY.crownDoorDen.falseMap.result,
                });
              },
            }
          : null,
        viewFlags.crownDoorDungeonCleared
          ? { label: CHAPTER_2_SCENE_COPY.crownDoorDen.falseMap.labels.returnThreshold, effect: returnToThreeDoorThreshold }
          : null,
        { label: CHAPTER_2_SCENE_COPY.crownDoorDen.falseMap.labels.leave, effect: () => setDialogue(null) },
      ].filter(Boolean),
    });
  };

  const openLanternDoorDialogue = (assumedFlags: Flags & { localResult?: string } = {}, fallbackPosition) => {
    const viewFlags = { ...flags, ...assumedFlags };
    setDialogue({
      portrait: CHAPTER_2_SCENE_COPY.lanternDoor.portrait,
      name: CHAPTER_2_SCENE_COPY.lanternDoor.name,
      visual: "lanternDoor",
      size: "wide",
      contentLayout: "split",
      choiceLayout: "grouped",
      text: viewFlags.lanternDoorTried
        ? CHAPTER_2_SCENE_COPY.lanternDoor.text.tried
        : CHAPTER_2_SCENE_COPY.lanternDoor.text.default,
      choices: [
        {
          label: viewFlags.lanternSignCleaned
            ? CHAPTER_2_SCENE_COPY.lanternDoor.labels.reviewSign
            : CHAPTER_2_SCENE_COPY.lanternDoor.labels.inspectSign,
          choiceGroup: "investigate",
          effect: () => openLanternSignDialogue(viewFlags, fallbackPosition),
        },
        !viewFlags.lanternDoorTried
          ? {
          label: CHAPTER_2_SCENE_COPY.lanternDoor.labels.tryDoor,
          choiceGroup: "investigate",
          effect: () => {
            const firstTry = !flags.lanternDoorTried && !viewFlags.lanternDoorTried;
            setFlags((f) => ({ ...f, lanternDoorTried: true }));
            if (firstTry) {
              gainItem(setPlayer, "trail_snack", 1);
              gainItem(setPlayer, "healing_fizzpop", 1);
            }
            setDialogue({
              portrait: CHAPTER_2_SCENE_COPY.lanternDoor.portrait,
              name: CHAPTER_2_SCENE_COPY.lanternDoor.name,
              text: firstTry
                ? CHAPTER_2_SCENE_COPY.lanternDoor.text.firstTry
                : CHAPTER_2_SCENE_COPY.lanternDoor.text.empty,
              choices: [{ label: CHAPTER_2_SCENE_COPY.lanternDoor.labels.backDoor, effect: () => openLanternDoorDialogue({ ...assumedFlags, lanternDoorTried: true }, fallbackPosition) }],
            });
          },
        }
          : null,
        !viewFlags.maraQuestionedLanternDoor
          ? {
          label: CHAPTER_2_SCENE_COPY.lanternDoor.labels.askMara,
          choiceGroup: "reads",
          effect: () => {
            setFlags((f) => ({ ...f, maraQuestionedLanternDoor: true }));
            setDialogue({
              portrait: "🧵",
              name: "Mara at the Lantern Door",
              text: CHAPTER_2_SCENE_COPY.lanternDoor.maraRead,
              choices: [{ label: CHAPTER_2_SCENE_COPY.lanternDoor.labels.backDoor, effect: () => openLanternDoorDialogue({ ...assumedFlags, maraQuestionedLanternDoor: true }, fallbackPosition) }],
            });
          },
        }
          : null,
        companionIsConscious && !viewFlags.companionReadLanternDoor
          ? {
              label: CHAPTER_2_SCENE_COPY.lanternDoor.labels.askCompanion,
              choiceGroup: "reads",
              effect: () => {
                setFlags((f) => ({ ...f, companionReadLanternDoor: true }));
                openCompanionDoorReadDialogue("lantern", fallbackPosition, viewFlags);
              },
            }
          : null,
        {
          label: CHAPTER_2_SCENE_COPY.lanternDoor.labels.backThreshold,
          variant: "quiet",
          effect: () => openThreeDoorThresholdDialogue(fallbackPosition),
        },
      ].filter(Boolean),
    });
  };

  const openMaraHollowJobDialogue = (fallbackPosition) => {
    setFlags((f) => ({ ...f, maraConsultedAtThreshold: true }));
    setDialogue({
      portrait: "🧵",
      name: CHAPTER_2_SCENE_COPY.maraThresholdRead.name,
      text: CHAPTER_2_SCENE_COPY.maraThresholdRead.text,
      choices: [
        {
          label: CHAPTER_2_SCENE_COPY.maraThresholdRead.labels.lioMarks,
          effect: () => {
            setFlags((f) => ({ ...f, maraJob: "lioMarks", maraConsultedAtThreshold: true }));
            openThreeDoorThresholdDialogue(fallbackPosition, {
              maraConsultedAtThreshold: true,
              localResult: CHAPTER_2_SCENE_COPY.maraThresholdRead.results.lioMarks,
            });
          },
        },
        {
          label: CHAPTER_2_SCENE_COPY.maraThresholdRead.labels.eddenDrawing,
          effect: () => {
            setFlags((f) => ({ ...f, maraJob: "eddenDrawing", eddensDrawingRotated: true, maraConsultedAtThreshold: true }));
            setPlayer((p) => ({ ...p, xp: p.xp + 4 }));
            openThreeDoorThresholdDialogue(fallbackPosition, {
              maraConsultedAtThreshold: true,
              localResult: CHAPTER_2_SCENE_COPY.maraThresholdRead.results.eddenDrawing,
            });
          },
        },
        {
          label: CHAPTER_2_SCENE_COPY.maraThresholdRead.labels.lanternSigns,
          effect: () => {
            setFlags((f) => ({ ...f, maraJob: "lanternSigns", maraWatchedLantern: true, maraConsultedAtThreshold: true }));
            openThreeDoorThresholdDialogue(fallbackPosition, {
              maraConsultedAtThreshold: true,
              localResult: CHAPTER_2_SCENE_COPY.maraThresholdRead.results.lanternSigns,
            });
          },
        },
        {
          label: CHAPTER_2_SCENE_COPY.maraThresholdRead.labels.safety,
          effect: () => {
            setFlags((f) => ({ ...f, maraJob: "safety", maraConsultedAtThreshold: true }));
            openThreeDoorThresholdDialogue(fallbackPosition, {
              maraConsultedAtThreshold: true,
              localResult: CHAPTER_2_SCENE_COPY.maraThresholdRead.results.safety,
            });
          },
        },
      ],
    });
  };

  const openCompanionHollowReadDialogue = (fallbackPosition) => {
    if (!companionIsConscious)
      return openThreeDoorThresholdDialogue(fallbackPosition);
    setFlags((f) => ({ ...f, companionReadThreshold: true }));
    const text = getChapter2CompanionRead("threshold", companion.id);
    setDialogue({
      portrait: companion.icon || "3",
      name: companion.recruited ? `${companion.name}'s Read` : "The Threshold Waits",
      text,
      choices: [
        {
          label: "Back to the threshold.",
          effect: () =>
            openThreeDoorThresholdDialogue(fallbackPosition, {
              companionReadThreshold: true,
              localResult: text,
            }),
        },
      ],
    });
  };

  const openCompanionDoorReadDialogue = (door, fallbackPosition, returnFlags: Flags = {}) => {
    if (!companionIsConscious)
      return openThreeDoorThresholdDialogue(fallbackPosition);
    const doorText = {
      crown: getChapter2CompanionRead("crownDoor", companion.id),
      lantern: getChapter2CompanionRead("lanternDoor", companion.id),
      noHandle: getChapter2CompanionRead("noHandleDoor", companion.id),
    };
    const returnToDoor = () => {
      if (door === "crown")
        return openCrownDoorDialogue({ ...returnFlags, companionReadCrownDoor: true }, fallbackPosition);
      if (door === "lantern")
        return openLanternDoorDialogue({ ...returnFlags, companionReadLanternDoor: true }, fallbackPosition);
      return openNoHandleStoneDialogue({ ...returnFlags, companionReadNoHandleDoor: true }, fallbackPosition);
    };
    const returnLabel = door === "crown"
      ? CHAPTER_2_SCENE_COPY.crownDoor.labels.backDoor
      : door === "lantern"
        ? CHAPTER_2_SCENE_COPY.lanternDoor.labels.backDoor
        : "Back to the No-Handle Door.";
    setDialogue({
      portrait: companion.icon || "3",
      name: companion.recruited ? `${companion.name}'s Read` : "The Hollow Waits",
      text: doorText[door] || doorText.noHandle,
      choices: [{ label: returnLabel, effect: returnToDoor }],
    });
  };

  const openCrownSignDialogue = (assumedFlags: Flags & { localResult?: string } = {}, fallbackPosition) => {
    const viewFlags = { ...flags, ...assumedFlags };
    const repairMode = !!viewFlags.noHandleStoneInspected;
    setDialogue({
      portrait: CHAPTER_2_SCENE_COPY.crownDoor.portrait,
      name: CHAPTER_2_SCENE_COPY.crownSign.name,
      text: addLocalResult(getCrownSignText(viewFlags), viewFlags),
      choices: [
        repairMode && !viewFlags.crownSignRejected
          ? {
              label: CHAPTER_2_SCENE_COPY.crownSign.labels.loosen,
              effect: () => {
                setFlags((f) => ({ ...f, crownSignRejected: true }));
                openCrownSignDialogue({
                  ...assumedFlags,
                  crownSignRejected: true,
                  localResult: CHAPTER_2_SCENE_COPY.crownSign.results.loosen,
                }, fallbackPosition);
              },
            }
          : null,
        repairMode && hasWillowmarkLens() && !viewFlags.crownSignLensUsed
          ? {
              label: CHAPTER_2_SCENE_COPY.crownSign.labels.lens,
              effect: () => {
                setFlags((f) => ({ ...f, crownSignLensUsed: true, willowForgeryConfirmedAtHollow: true }));
                openCrownSignDialogue({
                  ...assumedFlags,
                  crownSignLensUsed: true,
                  willowForgeryConfirmedAtHollow: true,
                  localResult: CHAPTER_2_SCENE_COPY.crownSign.results.lens,
                }, fallbackPosition);
              },
            }
          : null,
        !viewFlags.crownSignRejected
          ? {
              label: CHAPTER_2_SCENE_COPY.crownSign.labels.testDirection,
              effect: () => openBlockedCrownDoorDialogue({ ...assumedFlags, trustedCrownSignAtHollow: true }, fallbackPosition),
            }
          : null,
        { label: CHAPTER_2_SCENE_COPY.crownSign.labels.backDoor, effect: () => openCrownDoorDialogue(viewFlags, fallbackPosition) },
      ].filter(Boolean),
    });
  };

  const openLanternSignDialogue = (assumedFlags: Flags & { localResult?: string } = {}, fallbackPosition) => {
    const viewFlags = { ...flags, ...assumedFlags };
    const repairMode = !!viewFlags.noHandleStoneInspected;
    setDialogue({
      portrait: CHAPTER_2_SCENE_COPY.lanternDoor.portrait,
      name: CHAPTER_2_SCENE_COPY.lanternSign.name,
      text: addLocalResult(getLanternSignText(viewFlags), viewFlags),
      choices: [
        repairMode && !viewFlags.lanternSignCleaned
          ? {
              label: CHAPTER_2_SCENE_COPY.lanternSign.labels.clean,
              effect: () => {
                setFlags((f) => ({ ...f, lanternSignCleaned: true, understandsTrueSigns: true }));
                if (!viewFlags.lanternSignCleaned) setPlayer((p) => ({ ...p, xp: p.xp + 4 }));
                openLanternSignDialogue({
                  ...assumedFlags,
                  lanternSignCleaned: true,
                  understandsTrueSigns: true,
                  localResult: CHAPTER_2_SCENE_COPY.lanternSign.results.clean,
                }, fallbackPosition);
              },
            }
          : null,
        repairMode && !viewFlags.lanternSignCompared
          ? {
              label: CHAPTER_2_SCENE_COPY.lanternSign.labels.compare,
              effect: () => {
                setFlags((f) => ({ ...f, lanternSignCompared: true, eddensDrawingRotated: true }));
                openLanternSignDialogue({
                  ...assumedFlags,
                  lanternSignCompared: true,
                  eddensDrawingRotated: true,
                  localResult: CHAPTER_2_SCENE_COPY.lanternSign.results.compare,
                }, fallbackPosition);
              },
            }
          : null,
        repairMode && !viewFlags.understandsTrueSigns
          ? {
              label: CHAPTER_2_SCENE_COPY.lanternSign.labels.askMarks,
              effect: () => {
                setFlags((f) => ({ ...f, understandsTrueSigns: true }));
                openLanternSignDialogue(
                  {
                    ...assumedFlags,
                    understandsTrueSigns: true,
                    localResult: CHAPTER_2_SCENE_COPY.lanternSign.results.askMarks,
                  },
                  fallbackPosition,
                );
              },
            }
          : null,
        { label: CHAPTER_2_SCENE_COPY.lanternSign.labels.backDoor, effect: () => openLanternDoorDialogue(viewFlags, fallbackPosition) },
      ].filter(Boolean),
    });
  };

  const openNoHandleStoneDialogue = (assumedFlags: Flags & { localResult?: string } = {}, fallbackPosition) => {
    const doorFlags = { ...assumedFlags, noHandleStoneInspected: true };
    const outcome = getWestrootPuzzleOutcome(flags, doorFlags);
    const repair = getWestrootDoorRepairState(flags, doorFlags);
    const viewFlags = { ...flags, ...doorFlags };
    const lioText = getNoHandleLioText(viewFlags, repair);
    const openReadyWestrootDoor = () => {
      setFlags((f) => ({
        ...f,
        ...doorFlags,
        westrootGateOpened: true,
        lioAlivePastGate: true,
        cleanWestrootSolve: !!f.cleanWestrootSolve || outcome.cleanSolve,
        eddensDrawingValidated: true,
        briarCrownWatchingWestroot: true,
      }));
      if (!viewFlags.westrootGateOpened) setPlayer((p) => ({ ...p, xp: p.xp + 10 }));
      setDialogue({
        portrait: CHAPTER_2_SCENE_COPY.noHandleDoor.portrait,
        name: CHAPTER_2_SCENE_COPY.noHandleDoor.doorOpensName,
        text: formatDoorOpensText(),
        choices: [
          {
            label: CHAPTER_2_SCENE_COPY.noHandleDoor.labels.stepGate,
            effect: () => openWestrootGateDialogue({ westrootGateOpened: true }),
          },
        ],
      });
    };

    setFlags((f) => ({ ...f, noHandleStoneInspected: true }));
    setDialogue({
      portrait: CHAPTER_2_SCENE_COPY.noHandleDoor.portrait,
      name: CHAPTER_2_SCENE_COPY.noHandleDoor.name,
      visual: "noHandleDoor",
      size: "wide",
      contentLayout: "split",
      choiceLayout: "grouped",
      text: addLocalResult(formatNoHandleDoorText(lioText, formatWestrootDoorWhisper(repair)), viewFlags),
      choices: [
        !viewFlags.noHandleDoorStudied
          ? {
          label: CHAPTER_2_SCENE_COPY.noHandleDoor.labels.study,
          choiceGroup: "investigate",
          effect: () => {
            setFlags((f) => ({ ...f, noHandleDoorStudied: true }));
            openNoHandleStoneDialogue(
              {
                ...doorFlags,
                noHandleDoorStudied: true,
                localResult: repair.readyToOpen
                  ? CHAPTER_2_SCENE_COPY.noHandleDoor.results.studyReady
                  : CHAPTER_2_SCENE_COPY.noHandleDoor.results.studyWaiting,
              },
              fallbackPosition,
            );
          },
        }
          : null,
        (!viewFlags.maraAskedNoHandleMark ||
          (!!viewFlags.lioShelterMarkFound && !viewFlags.lioHookMarkFound))
          ? {
          label: viewFlags.maraAskedNoHandleMark
            ? "Ask Mara to compare the shelter mark."
            : CHAPTER_2_SCENE_COPY.noHandleDoor.labels.askMara,
          choiceGroup: "reads",
          effect: () => {
            const foundMark = !!(flags.lioShelterMarkFound || doorFlags.lioShelterMarkFound);
            const markFlags = {
              maraAskedNoHandleMark: true,
              ...(foundMark ? { lioHookMarkFound: true } : {}),
            };
            setFlags((f) => ({ ...f, ...markFlags }));
            if (foundMark && !flags.lioHookMarkFound)
              setPlayer((p) => ({ ...p, xp: p.xp + 5 }));
            openNoHandleStoneDialogue(
              {
                ...doorFlags,
                ...markFlags,
                localResult: foundMark
                  ? CHAPTER_2_SCENE_COPY.noHandleDoor.results.lioMarkMatched
                  : CHAPTER_2_SCENE_COPY.noHandleDoor.results.lioMarkKnown,
              },
              fallbackPosition,
            );
          },
        }
          : null,
        companionIsConscious && !viewFlags.companionReadNoHandleDoor
          ? {
              label: CHAPTER_2_SCENE_COPY.noHandleDoor.labels.askCompanion,
              choiceGroup: "reads",
              effect: () => {
                setFlags((f) => ({ ...f, companionReadNoHandleDoor: true }));
                openCompanionDoorReadDialogue("noHandle", fallbackPosition, viewFlags);
              },
            }
          : null,
        (!viewFlags.eddenDrawingComparedAtDoor ||
          (!!viewFlags.lanternSignCleaned && !viewFlags.eddensDrawingValidated))
          ? {
          label: viewFlags.eddenDrawingComparedAtDoor
            ? "Compare Edden's drawing with the cleaned sign."
            : CHAPTER_2_SCENE_COPY.noHandleDoor.labels.compareDrawing,
          choiceGroup: "investigate",
          effect: () => {
            const drawingMatches = !!(
              flags.lanternSignCleaned || doorFlags.lanternSignCleaned
            );
            const drawingFlags = {
              eddenDrawingComparedAtDoor: true,
              ...(drawingMatches
                ? { eddensDrawingRotated: true, eddensDrawingValidated: true }
                : {}),
            };
            setFlags((f) => ({ ...f, ...drawingFlags }));
            if (drawingMatches && !flags.eddensDrawingValidated)
              setPlayer((p) => ({ ...p, xp: p.xp + 5 }));
            openNoHandleStoneDialogue(
              {
                ...doorFlags,
                ...drawingFlags,
                localResult:
                  drawingMatches
                    ? CHAPTER_2_SCENE_COPY.noHandleDoor.results.drawingMatched
                    : CHAPTER_2_SCENE_COPY.noHandleDoor.results.drawingAlmost,
              },
              fallbackPosition,
            );
          },
        }
          : null,
        {
          label: repair.readyToOpen
            ? `Say: ${CHAPTER_2_STORY.oldRoadPhrase} — open the door.`
            : `Say: ${CHAPTER_2_STORY.oldRoadPhrase}`,
          requirement: repair.readyToOpen
            ? "The road is clear. Speaking the phrase will open the door."
            : undefined,
          variant: repair.readyToOpen ? "primary" : undefined,
          choiceGroup: "door-actions",
          effect: () => {
            if (!outcome.enoughClues) {
              setFlags((f) => ({ ...f, incompleteTruthPhraseSpoken: true }));
              setDialogue({
                portrait: CHAPTER_2_SCENE_COPY.noHandleDoor.portrait,
                name: CHAPTER_2_SCENE_COPY.noHandleDoor.doorWaitsName,
                text: formatDoorWaitsText(formatWestrootDoorWhisper(repair)),
                choices: [
                  {
                    label: CHAPTER_2_SCENE_COPY.noHandleDoor.labels.listenThreshold,
                    effect: () => openThreeDoorThresholdDialogue(fallbackPosition),
                  },
                ],
              });
              return;
            }

            if (flags.roadwatcherDefeated && !repair.readyToOpen) {
              setDialogue({
                portrait: CHAPTER_2_SCENE_COPY.noHandleDoor.portrait,
                name: CHAPTER_2_SCENE_COPY.noHandleDoor.doorListensName,
                text: formatDoorNeedsCrownTruthText(formatWestrootDoorWhisper(repair)),
                choices: [
                  {
                    label: CHAPTER_2_SCENE_COPY.noHandleDoor.labels.returnThreshold,
                    effect: () => openThreeDoorThresholdDialogue(fallbackPosition),
                  },
                ],
              });
              return;
            }

            if (repair.readyToOpen) {
              openReadyWestrootDoor();
              return;
            }

            const encounterKey = getRoadwatcherEncounterKey(flags, doorFlags);
            const maraProtected = !!(
              outcome.cleanSolve ||
              flags.maraWatchedLantern ||
              doorFlags.maraWatchedLantern ||
              flags.maraJob === "safety" ||
              flags.maraJob === "lanternSigns"
            );
            setFlags((f) => ({
              ...f,
              ...doorFlags,
              westrootGateOpeningPending: true,
              roadwatcherSummoned: true,
              roadwatcherEncounterAvoided: false,
              roadwatcherPrepared: outcome.cleanSolve,
              maraProtectedAtHollow: maraProtected,
              messyWestrootSolve: encounterKey === "roadwatcherHard" || !!f.messyWestrootSolve,
              cleanWestrootSolve: outcome.cleanSolve,
              eddensDrawingValidated: true,
              briarCrownWatchingWestroot: true,
            }));
            openRoadwatcherAmbushDialogue(encounterKey, {
              prepared: outcome.cleanSolve,
              maraProtected,
              previousPosition: fallbackPosition,
            });
          },
        },
        !viewFlags.forcedNoHandleDoorTwice
          ? {
          label: CHAPTER_2_SCENE_COPY.noHandleDoor.labels.force,
          choiceGroup: "door-actions",
          effect: () => {
            setFlags((f) => ({
              ...f,
              forcedNoHandleDoor: true,
              forcedNoHandleDoorTwice: !!f.forcedNoHandleDoor || !!f.forcedNoHandleDoorTwice,
              messyWestrootSolve: !!f.forcedNoHandleDoor || !!f.messyWestrootSolve,
            }));
            openNoHandleStoneDialogue(
              {
                ...doorFlags,
                forcedNoHandleDoor: true,
                forcedNoHandleDoorTwice: !!flags.forcedNoHandleDoor || !!flags.forcedNoHandleDoorTwice,
                localResult: CHAPTER_2_SCENE_COPY.noHandleDoor.results.force,
              },
              fallbackPosition,
            );
          },
        }
          : null,
        {
          label: CHAPTER_2_SCENE_COPY.noHandleDoor.labels.backThreshold,
          variant: "quiet",
          effect: () => openThreeDoorThresholdDialogue(fallbackPosition),
        },
      ].filter(Boolean),
    });
  };

  const backAwayFromWestrootDialogue = (fallbackPosition, message) => {
    if (fallbackPosition) {
      setPosition(fallbackPosition);
      revealArea("westrootTrail", fallbackPosition.x, fallbackPosition.y);
      setToast(message);
    }
    setDialogue(null);
  };

  const openRoadwatcherAmbushDialogue = (
    encounterKey = getRoadwatcherEncounterKey(flags),
    options: { prepared?: boolean; maraProtected?: boolean; previousPosition?: Position } = {},
  ) => {
    const hard = encounterKey === "roadwatcherHard";
    const prepared = !!(options.prepared || flags.roadwatcherPrepared);
    const maraProtected = !!(options.maraProtected || flags.maraProtectedAtHollow);
    setDialogue({
      portrait: CHAPTER_2_SCENE_COPY.roadwatcher.portrait,
      name: hard ? CHAPTER_2_SCENE_COPY.roadwatcher.hardName : CHAPTER_2_SCENE_COPY.roadwatcher.name,
      text: hard
        ? CHAPTER_2_SCENE_COPY.roadwatcher.hardText
        : prepared
          ? formatPreparedRoadwatcherText(maraProtected)
          : CHAPTER_2_SCENE_COPY.roadwatcher.standardText,
      choices: [
        {
          label: hard
            ? CHAPTER_2_SCENE_COPY.roadwatcher.labels.hard
            : prepared
              ? CHAPTER_2_SCENE_COPY.roadwatcher.labels.prepared
              : CHAPTER_2_SCENE_COPY.roadwatcher.labels.standard,
          effect: () => {
            setDialogue(null);
            startBattle(buildEncounterEnemies(encounterKey), encounterKey);
          },
        },
        {
          label: CHAPTER_2_SCENE_COPY.roadwatcher.labels.backAway,
          effect: () =>
            backAwayFromWestrootDialogue(
              options.previousPosition,
              CHAPTER_2_SCENE_COPY.roadwatcher.backAwayToast,
            ),
        },
      ],
    });
  };

  const openRoadwatcherDialogue = (fallbackPosition) => {
    if (flags.beatRoadwatcher || flags.roadwatcherDefeated || flags.roadwatcherEncounterAvoided)
      return setToast(CHAPTER_2_SCENE_COPY.roadwatcher.quietToast);
    setDialogue({
      portrait: CHAPTER_2_SCENE_COPY.roadwatcher.portrait,
      name: CHAPTER_2_SCENE_COPY.roadwatcher.name,
      text: CHAPTER_2_SCENE_COPY.roadwatcher.directText,
      choices: [
        {
          label: CHAPTER_2_SCENE_COPY.roadwatcher.labels.breakWatcher,
          effect: () => {
            setDialogue(null);
            startBattle(
              buildEncounterEnemies(getRoadwatcherEncounterKey(flags)),
              getRoadwatcherEncounterKey(flags),
            );
          },
        },
        {
          label: CHAPTER_2_SCENE_COPY.roadwatcher.labels.backAway,
          effect: () =>
            backAwayFromWestrootDialogue(
              fallbackPosition,
              CHAPTER_2_SCENE_COPY.roadwatcher.backAwayToast,
            ),
        },
      ],
    });
  };

  const enterWestrootHub = () => {
    travelToRegion(
      "westrootHub",
      MAPS.westrootHub.start,
      "Westroot Gate",
      "You step beneath the hill into Westroot.",
    );
    openWestrootFirstGateDialogue();
  };

  const introduceWestrootParty = () =>
    `"I'm ${player?.name || "Liam"}. This is Mara Brindle${
      companion.recruited ? ` and ${companion.name}` : ""
    }."`;

  const openWestrootFirstGateDialogue = () => {
    if (flags.rootbreadLeadLearned && !flags.rootbreadPromiseKept) {
      return openRootbreadCheckpointDialogue();
    }
    if (flags.metBramwell) {
      if (!flags.chapterThreeStarted) {
        setFlags((current) => ({ ...current, chapterThreeStarted: true }));
      }
      return setDialogue({
        portrait: "◈",
        name: CHAPTER_3_SCENE_COPY.firstGate.name,
        portraitName: "Bramwell Gatehand",
        sceneImage: {
          src: westrootArrivalScene,
          alt: "Mara arriving at the lantern-lit First Westroot Gate beneath the hill.",
        },
        text: `${flags.chapterThreeClear
          ? "Bramwell has reopened the First Gate to witnessed messages, not unmarked cargo. Two gatekeepers compare every outgoing warning aloud. \"A shield needs eyes on both sides,\" he says."
          : flags.westrootHoldBellRung
            ? "Red hold-cords cross the First Gate. Bramwell's people are checking names against watch times instead of waving anyone through. \"The danger is real,\" he says. \"Split Hall is deciding whether our answer will be real too.\""
            : CHAPTER_3_SCENE_COPY.firstGate.repeat}${
              flags.rootbreadPromiseKept
                ? `\n\n${CHAPTER_3_FULL_SCENE_COPY.rootbread.repeat}`
                : ""
            }`,
        choices: [{ label: "Continue into Westroot.", effect: () => setDialogue(null) }],
      });
    }
    const welcomeWestroot = (answer) => {
      answer = `${introduceWestrootParty()}\n\n${CHAPTER_3_FULL_SCENE_COPY.firstGate.nameReaction}\n\n${answer}`;
      setFlags((f) => ({ ...f, chapterThreeStarted: true, metBramwell: true }));
      setDialogue({
        portrait: "◈",
        name: CHAPTER_3_SCENE_COPY.firstGate.name,
        portraitName: "Bramwell Gatehand",
        sceneImage: {
          src: westrootArrivalScene,
          alt: "Mara arriving at the lantern-lit First Westroot Gate beneath the hill.",
        },
        text: `${answer}\n\nBramwell studies the party again, this time as people rather than a problem. \"You may cross to the market. You may speak. You may not wander into sealed ways, touch a lantern shutter, or call this place yours because a door answered you.\"\n\nMara folds her arms. \"You can close every door in this hill if you want. But my brother is on the other side of one of them.\"\n\nBramwell's face changes—not into agreement, but recognition. \"Then we have a reason to be careful with one another.\"`,
        choices: [{ label: "Listen before asking for more.", effect: () => setDialogue(null) }],
      });
    };
    setDialogue({
      portrait: "◈",
      name: CHAPTER_3_SCENE_COPY.firstGate.name,
      portraitName: "Bramwell Gatehand",
      sceneImage: {
        src: westrootArrivalScene,
        alt: "Mara arriving at the lantern-lit First Westroot Gate beneath the hill.",
      },
      text: CHAPTER_3_SCENE_COPY.firstGate.text,
      choices: [
        {
          label: "The old phrase-lock opened after we restored its marks.",
          effect: () =>
            welcomeWestroot(
              "Bramwell looks past you to the sealed stone. \"Then you repaired an old mechanism. You did not supply an account or a gatekeeper expecting you. That difference is why everyone here is afraid.\"",
            ),
        },
        {
          label: "We are looking for Lio Brindle. He came through here alive.",
          effect: () =>
            welcomeWestroot(
              "Mara takes one step forward. Bramwell lifts a hand—not threatening, only stopping the bridge from becoming a rush. \"A missing courier is a reason,\" he says. \"It is not yet permission.\"",
            ),
        },
        {
          label: "Ask us what we brought before you decide what we are.",
          effect: () =>
            welcomeWestroot(
              "\"That is fair,\" Bramwell says after a moment. \"It is also the first fair thing I have heard at this gate in a long time.\"",
            ),
        },
      ],
    });
  };

  const routeUnintroducedPartyToBramwell = () => {
    if (region !== "westrootHub" || flags.metBramwell) return false;
    const gatePosition = MAPS.westrootHub.start;
    if (position.x !== gatePosition.x || position.y !== gatePosition.y) {
      setPosition(gatePosition);
      revealArea("westrootHub", gatePosition.x, gatePosition.y, 2);
    }
    openWestrootFirstGateDialogue();
    return true;
  };

  const withChapter3CompanionReaction = (text, beat) =>
    appendChapter3CompanionReaction(
      text,
      companionIsConscious ? companion.id : null,
      beat,
    );

  const openHoldBellResponseDialogue = (response) =>
    setDialogue({
      portrait: "!",
      name: "The Hold Bell",
      text: withChapter3CompanionReaction(
        `${response}\n\n${CHAPTER_3_FULL_SCENE_COPY.holdBell.converged}`,
        "holdBell",
      ),
      choices: [{
        label: "Go to Split Hall.",
        effect: () => {
          const destination = WESTROOT_STORY_POSITIONS.splitHallApproach;
          setPosition(destination);
          revealArea("westrootHub", destination.x, destination.y, 2);
          setDialogue(null);
        },
      }],
      size: "wide",
    });

  const openWestrootHoldBellDialogue = () => {
    if (!flags.westrootHoldBellRung) {
      setFlags((current) => ({ ...current, westrootHoldBellRung: true }));
    }
    setDialogue({
      portrait: "!",
      name: "The Hold Bell",
      text: CHAPTER_3_FULL_SCENE_COPY.holdBell.introduction,
      choices: [
        {
          label: "Count who will be left outside.",
          effect: () => openHoldBellResponseDialogue(CHAPTER_3_FULL_SCENE_COPY.holdBell.boundaryResponse),
        },
        {
          label: "A warning cannot stop at Westroot's gate.",
          effect: () => openHoldBellResponseDialogue(CHAPTER_3_FULL_SCENE_COPY.holdBell.warningResponse),
        },
        {
          label: "Who moved a crate under hold?",
          effect: () => openHoldBellResponseDialogue(CHAPTER_3_FULL_SCENE_COPY.holdBell.cargoResponse),
        },
      ],
      size: "wide",
    });
  };

  const finishWestrootConversation = (assumedFlags: Flags = {}, onQuietReturn = () => setDialogue(null)) => {
    const viewFlags = { ...flags, ...assumedFlags };
    if (
      viewFlags.metQuill &&
      viewFlags.nomaIntroducedWitnessStones &&
      !viewFlags.westrootHoldBellRung
    ) {
      return openWestrootHoldBellDialogue();
    }
    onQuietReturn();
  };

  const openQuillTopicResponse = (response, askedFlag, assumedFlags: Flags = {}) => {
    const nextFlags = { ...assumedFlags, metQuill: true, [askedFlag]: true };
    const viewFlags = { ...flags, ...nextFlags };
    const hasAnotherTopic = !viewFlags.quillAskedOldRoad || !viewFlags.quillAskedCargo;
    setFlags((current) => ({ ...current, ...nextFlags }));
    setDialogue({
      portrait: "⌂",
      name: "Quill Pebbleturn",
      text: response,
      choices: [
        hasAnotherTopic
          ? {
              label: "Ask Quill about something else.",
              effect: () => openQuillFollowupDialogue(nextFlags),
            }
          : null,
        {
          label: "Thank Quill and step back.",
          effect: () => finishWestrootConversation(
            nextFlags,
            () => openRootmarketDialogue({ ...nextFlags, rootmarketVisited: true }),
          ),
        },
      ].filter(Boolean),
    });
  };

  const openQuillFollowupDialogue = (assumedFlags: Flags = {}, openingResponse = "") => {
    const viewFlags = { ...flags, ...assumedFlags, metQuill: true };
    setDialogue({
      portrait: "⌂",
      name: "Quill Pebbleturn",
      text: openingResponse
        ? `${openingResponse}\n\n${CHAPTER_3_FULL_SCENE_COPY.rootmarket.converged}`
        : viewFlags.quillAskedOldRoad || viewFlags.quillAskedCargo
          ? CHAPTER_3_FULL_SCENE_COPY.rootmarket.topicPrompt
          : CHAPTER_3_FULL_SCENE_COPY.rootmarket.converged,
      choices: [
        !viewFlags.quillAskedOldRoad
          ? {
              label: "How did the old road keep its signals clear?",
              effect: () => openQuillTopicResponse(
                CHAPTER_3_FULL_SCENE_COPY.rootmarket.oldRule,
                "quillAskedOldRoad",
                viewFlags,
              ),
            }
          : null,
        !viewFlags.quillAskedCargo
          ? {
              label: "What is the green wax in that ledger?",
              effect: () => openQuillTopicResponse(
                CHAPTER_3_FULL_SCENE_COPY.rootmarket.cargo,
                "quillAskedCargo",
                viewFlags,
              ),
            }
          : null,
        {
          label: "Thank Quill and step back.",
          effect: () => finishWestrootConversation(
            viewFlags,
            () => openRootmarketDialogue({ ...viewFlags, rootmarketVisited: true }),
          ),
        },
      ].filter(Boolean),
    });
  };

  const openQuillResponseDialogue = (response) =>
    openQuillFollowupDialogue({ metQuill: true }, response);

  const openAuntieLumeResponseDialogue = (
    response,
    updates: Flags,
    assumedFlags: Flags = {},
  ) => {
    const nextFlags = { ...assumedFlags, metAuntieLume: true, ...updates };
    const viewFlags = { ...flags, ...nextFlags };
    const hasAnotherTopic =
      !viewFlags.lumeAskedLio ||
      !viewFlags.lumeAskedHospitality ||
      (viewFlags.lumeMentionedRootbread && !viewFlags.lumeAskedPromise);
    setFlags((current) => ({ ...current, ...nextFlags }));
    setDialogue({
      portrait: "🍞",
      name: "Auntie Lume",
      text: response,
      choices: [
        hasAnotherTopic
          ? {
              label: "Ask Lume something else.",
              effect: () => openAuntieLumeDialogue(nextFlags),
            }
          : null,
        viewFlags.rootbreadLeadLearned
          ? { label: "Follow the Rootbread clue at the Transfer Checkpoint.", effect: () => setDialogue(null) }
          : null,
        {
          label: "Return to Rootmarket.",
          effect: () => openRootmarketDialogue({ ...nextFlags, rootmarketVisited: true }),
        },
      ].filter(Boolean),
    });
  };

  const openAuntieLumeDialogue = (assumedFlags: Flags = {}) => {
    const viewFlags = { ...flags, ...assumedFlags };
    const firstMeeting = !viewFlags.metAuntieLume;
    if (firstMeeting) setFlags((current) => ({ ...current, metAuntieLume: true }));
    if (viewFlags.rootbreadPromiseKept) {
      return setDialogue({
        portrait: "🍞",
        name: "Auntie Lume",
        text: CHAPTER_3_FULL_SCENE_COPY.auntieLume.repeat,
        choices: [{
          label: "Return to Rootmarket.",
          effect: () => openRootmarketDialogue({ ...viewFlags, rootmarketVisited: true, metAuntieLume: true }),
        }],
      });
    }
    const conversationFlags = { ...viewFlags, metAuntieLume: true };
    setDialogue({
      portrait: "🍞",
      name: firstMeeting ? "Mossback Baker" : "Auntie Lume",
      portraitName: "Auntie Lume",
      text: firstMeeting
        ? `${CHAPTER_3_FULL_SCENE_COPY.auntieLume.introduction}\n\n${introduceWestrootParty()}\n\n${CHAPTER_3_FULL_SCENE_COPY.auntieLume.nameReaction}`
        : CHAPTER_3_FULL_SCENE_COPY.auntieLume.topicPrompt,
      choices: [
        !conversationFlags.lumeAskedLio
          ? {
              label: "Thank you. We are looking for Lio Brindle.",
              effect: () => openAuntieLumeResponseDialogue(
                CHAPTER_3_FULL_SCENE_COPY.auntieLume.lioResponse,
                {
                  lumeAskedLio: true,
                  lumeMentionedRootbread: true,
                  rootbreadLeadLearned: true,
                },
                conversationFlags,
              ),
            }
          : null,
        !conversationFlags.lumeAskedHospitality
          ? {
              label: "Why offer us food before you know whether to trust us?",
              effect: () => openAuntieLumeResponseDialogue(
                CHAPTER_3_FULL_SCENE_COPY.auntieLume.hospitalityResponse,
                { lumeAskedHospitality: true, lumeMentionedRootbread: true },
                conversationFlags,
              ),
            }
          : null,
        conversationFlags.lumeMentionedRootbread && !conversationFlags.lumeAskedPromise
          ? {
              label: "You called it the Rootbread Promise. What does it ask of Westroot?",
              effect: () => openAuntieLumeResponseDialogue(
                CHAPTER_3_FULL_SCENE_COPY.auntieLume.promiseResponse,
                { lumeAskedPromise: true },
                conversationFlags,
              ),
            }
          : null,
        firstMeeting
          ? {
              label: "I should not take food from people who do not trust me.",
              effect: () => openAuntieLumeResponseDialogue(
                CHAPTER_3_FULL_SCENE_COPY.auntieLume.refusalResponse,
                { lumeAskedHospitality: true, lumeMentionedRootbread: true },
                conversationFlags,
              ),
            }
          : null,
        conversationFlags.rootbreadLeadLearned
          ? { label: "Follow the Rootbread clue at the Transfer Checkpoint.", effect: () => setDialogue(null) }
          : null,
        {
          label: "Return to Rootmarket.",
          effect: () => openRootmarketDialogue({ ...conversationFlags, rootmarketVisited: true }),
        },
      ].filter(Boolean),
    });
  };

  const openQuillDialogue = () => {
    if (!flags.metQuill) setFlags((current) => ({ ...current, metQuill: true }));
    setDialogue({
      portrait: "⌂",
      name: "Stonekin Shutter-Mender",
      portraitName: "Quill Pebbleturn",
      text: `${CHAPTER_3_FULL_SCENE_COPY.rootmarket.quillIntro}\n\n${introduceWestrootParty()}\n\n${CHAPTER_3_FULL_SCENE_COPY.rootmarket.quillNameReaction}`,
      choices: [
        {
          label: "Then ask us what you need to know.",
          effect: () => openQuillResponseDialogue(CHAPTER_3_FULL_SCENE_COPY.rootmarket.guestResponse),
        },
        {
          label: "What does that shutter do?",
          effect: () => openQuillResponseDialogue(CHAPTER_3_FULL_SCENE_COPY.rootmarket.shutterResponse),
        },
        {
          label: "We are following a missing courier.",
          effect: () => openQuillResponseDialogue(CHAPTER_3_FULL_SCENE_COPY.rootmarket.lioResponse),
        },
      ],
    });
  };

  const openRootmarketAmbientDialogue = () => {
    const nextFlags = { rootmarketVisited: true, rootmarketVoicesHeard: true };
    setFlags((current) => ({ ...current, ...nextFlags }));
    setDialogue({
      portrait: "⌂",
      name: "Rootmarket Voices",
      text: CHAPTER_3_FULL_SCENE_COPY.rootmarket.ambientVoices,
      choices: [{
        label: "Return to Rootmarket.",
        effect: () => openRootmarketDialogue(nextFlags),
      }],
    });
  };

  const openRootmarketDialogue = (assumedFlags = {}) => {
    if (routeUnintroducedPartyToBramwell()) return;
    const viewFlags = { ...flags, ...assumedFlags };
    if (!viewFlags.rootmarketVisited) {
      setFlags((current) => ({ ...current, rootmarketVisited: true }));
    }
    setDialogue({
      portrait: "⌂",
      name: CHAPTER_3_SCENE_COPY.rootmarket.name,
      sceneImage: {
        src: rootmarketUneasyArrivalScene,
        alt: "A Stonekin repairs a lantern shutter across Rootmarket from a Mossback baker's counter while guarded neighbors continue their morning work.",
      },
      text: viewFlags.chapterThreeClear
        ? CHAPTER_3_FULL_SCENE_COPY.rootmarket.restoredRepeat
        : viewFlags.splitHallDebateHeard
          ? CHAPTER_3_FULL_SCENE_COPY.rootmarket.debateRepeat
          : viewFlags.westrootHoldBellRung
            ? CHAPTER_3_FULL_SCENE_COPY.rootmarket.holdBellRepeat
            : viewFlags.rootmarketVisited
              ? CHAPTER_3_FULL_SCENE_COPY.rootmarket.repeat
              : CHAPTER_3_FULL_SCENE_COPY.rootmarket.arrival,
      choices: viewFlags.westrootHoldBellRung && !viewFlags.splitHallDebateHeard
        ? [{
            label: "Follow the market crowd to Split Hall.",
            effect: () => {
              const destination = WESTROOT_STORY_POSITIONS.splitHallApproach;
              setPosition(destination);
              revealArea("westrootHub", destination.x, destination.y, 2);
              setDialogue(null);
            },
          }]
        : [
            viewFlags.metQuill
              ? { label: "Talk with Quill.", effect: () => openQuillFollowupDialogue(viewFlags) }
              : { label: "Talk to the Stonekin repairing the shutter.", effect: openQuillDialogue },
            viewFlags.metAuntieLume
              ? { label: "Talk with Auntie Lume.", effect: () => openAuntieLumeDialogue(viewFlags) }
              : { label: "Approach the Mossback baker.", effect: () => openAuntieLumeDialogue(viewFlags) },
            !viewFlags.westrootHoldBellRung && !viewFlags.rootmarketVoicesHeard
              ? { label: "Listen to the argument.", effect: openRootmarketAmbientDialogue }
              : null,
            { label: "Leave Rootmarket.", effect: () => setDialogue(null) },
          ].filter(Boolean),
    });
  };

  const walkToWitnessStonesWithNoma = (assumedFlags: Flags = {}) => {
    const nextFlags = {
      ...assumedFlags,
      metNoma: true,
      nomaIntroducedWitnessStones: true,
    };
    const destination = WESTROOT_STORY_POSITIONS.witnessStones;
    setFlags((current) => ({ ...current, ...nextFlags }));
    setPosition(destination);
    revealArea("westrootHub", destination.x, destination.y, 2);
    setDialogue({
      portrait: "âœ¿",
      name: "Noma Greenstill",
      portraitName: "Noma Greenstill",
      text: CHAPTER_3_FULL_SCENE_COPY.mossgarden.converged,
      choices: [{
        label: "Finish looking at the Witness Stones with Noma.",
        effect: () => finishWestrootConversation(nextFlags),
      }],
    });
  };

  const openMossgardenWitnessContext = (
    response,
    askedFlag,
    assumedFlags: Flags = {},
  ) => {
    const nextFlags = {
      ...assumedFlags,
      metNoma: true,
      [askedFlag]: true,
    };
    const viewFlags = { ...flags, ...nextFlags };
    const hasAnotherQuestion =
      !viewFlags.nomaAskedNames || !viewFlags.nomaAskedCourier || !viewFlags.nomaAskedGate;
    setFlags((current) => ({ ...current, ...nextFlags }));
    setDialogue({
      portrait: "✿",
      name: "Noma Greenstill",
      text: response,
      choices: [
        hasAnotherQuestion
          ? {
              label: "Ask Noma something else.",
              effect: () => openMossgardenDialogue(nextFlags),
            }
          : null,
        {
          label: viewFlags.nomaIntroducedWitnessStones
            ? "Return to the Witness Stones with Noma."
            : "Walk with Noma to the Witness Stones.",
          effect: () => walkToWitnessStonesWithNoma(nextFlags),
        },
        {
          label: "Thank Noma and keep exploring.",
          effect: () => finishWestrootConversation(nextFlags),
        },
      ].filter(Boolean),
    });
  };

  const openMossgardenDialogue = (assumedFlags: Flags = {}) => {
    const viewFlags = { ...flags, ...assumedFlags };
    if (!viewFlags.metNoma) setFlags((f) => ({ ...f, metNoma: true }));
    const questionChoices = [
      !viewFlags.nomaAskedNames
        ? {
            label: "What are these names?",
            effect: () =>
              openMossgardenWitnessContext(
                CHAPTER_3_FULL_SCENE_COPY.mossgarden.namesResponse,
                "nomaAskedNames",
                viewFlags,
              ),
          }
        : null,
      !viewFlags.nomaAskedCourier
        ? {
            label: "We need to find the truth about a missing courier.",
            effect: () =>
              openMossgardenWitnessContext(
                CHAPTER_3_FULL_SCENE_COPY.mossgarden.courierResponse,
                "nomaAskedCourier",
                viewFlags,
              ),
          }
        : null,
      !viewFlags.nomaAskedGate
        ? {
            label: "Why is everyone preparing for the gate to close?",
            effect: () =>
              openMossgardenWitnessContext(
                CHAPTER_3_FULL_SCENE_COPY.mossgarden.gateResponse,
                "nomaAskedGate",
                viewFlags,
              ),
          }
        : null,
    ].filter(Boolean);
    setDialogue({
      portrait: "✿",
      name: viewFlags.metNoma ? "Noma Greenstill" : "Mossback Caretaker",
      portraitName: "Noma Greenstill",
      text: viewFlags.metNoma
        ? viewFlags.splitHallDebateHeard
          ? CHAPTER_3_FULL_SCENE_COPY.mossgarden.debateRepeat
          : viewFlags.westrootHoldBellRung
            ? CHAPTER_3_FULL_SCENE_COPY.mossgarden.holdBellRepeat
            : CHAPTER_3_SCENE_COPY.mossgarden.repeat
        : `${CHAPTER_3_SCENE_COPY.mossgarden.text}\n\n${introduceWestrootParty()}\n\n${CHAPTER_3_FULL_SCENE_COPY.mossgarden.nameReaction}`,
      choices: [
        ...questionChoices,
        {
          label: viewFlags.nomaIntroducedWitnessStones
            ? "Return to the Witness Stones with Noma."
            : "Ask Noma to show you the Witness Stones.",
          effect: () => walkToWitnessStonesWithNoma(viewFlags),
        },
        {
          label: viewFlags.metNoma ? "Thank Noma and keep exploring." : "Keep exploring for now.",
          effect: () => finishWestrootConversation(viewFlags),
        },
      ].filter(Boolean),
    });
  };

  const openWitnessStoneInspectionDialogue = (assumedFlags: Flags = {}) =>
    setDialogue({
      portrait: "◌",
      name: "Witness Stone Carvings",
      text: Object.entries(CHAPTER_3_FULL_SCENE_COPY.witnessStones.inspections)
        .map(([id, text]) => `${WITNESS_STONE_LABELS[id]}\n${text}`)
        .join("\n\n"),
      choices: [
        {
          label: "Return to the public renewal.",
          effect: () => openWitnessStonesDialogue([], "", assumedFlags),
        },
        { label: "Step back for now.", effect: () => setDialogue(null) },
      ],
    });

  const renewWitnessStones = (promise) => {
    const promiseFlag = {
      witness: "witnessPromiseWitnessChosen",
      warning: "witnessPromiseWarningChosen",
      shelter: "witnessPromiseShelterChosen",
      water: "witnessPromiseWaterChosen",
    }[promise];
    setFlags((f) => ({
      ...f,
      witnessStoneSequenceSolved: true,
      [promiseFlag]: true,
    }));
    gainStoryItemOnce("witness_stone_rubbing");
    setPlayer((p) => ({ ...p, xp: p.xp + 12 }));
    announce("Westroot renews the road promises together. XP +12", [
      { id: "witness_stone_rubbing", qty: 1 },
    ]);
    setDialogue({
      portrait: "◌",
      name: CHAPTER_3_SCENE_COPY.witnessStones.name,
      sceneImage: {
        src: witnessStonesScene,
        alt: "Four carved Witness Stones standing unobstructed inside Westroot's lantern-lit water circle.",
      },
      text: withChapter3CompanionReaction(
        `${WITNESS_STONE_RESPONSES[promise]}\n\n${CHAPTER_3_SCENE_COPY.witnessStones.success}`,
        "witnessRenewal",
      ),
      choices: [{
        label: "Follow Bramwell and Noma toward the Cargo Siding.",
        effect: () => {
          const destination = WESTROOT_STORY_POSITIONS.cargoSidingApproach;
          setPosition(destination);
          revealArea("westrootHub", destination.x, destination.y, 2);
          setDialogue(null);
        },
      }],
      size: "wide",
    });
  };

  const openWitnessStonesDialogue = (_order = [], _guidance = "", assumedFlags: Flags = {}) => {
    const viewFlags = { ...flags, ...assumedFlags };
    if (!viewFlags.nomaIntroducedWitnessStones) {
      return setDialogue({
        portrait: "◌",
        name: "Closed Witness Stone Walk",
        text: "A low oak-and-brass hold-shutter crosses the only approach to four weathered stones. The public seal names Bramwell Gatehand. The slate lists the Willow cargo hold, the stone walk and listening marks, and review at Split Hall. The Mossback caretaker in the nearby garden may know what work has been paused here.",
        choices: [{ label: "Respect the hold and step back.", effect: () => setDialogue(null) }],
      });
    }
    if (viewFlags.metQuill && viewFlags.nomaIntroducedWitnessStones && !viewFlags.westrootHoldBellRung) {
      return openWestrootHoldBellDialogue();
    }
    if (!viewFlags.splitHallDebateHeard) {
      return setDialogue({
        portrait: "!",
        name: "Witness Stone Hold-Shutter",
        text: `${CHAPTER_3_FULL_SCENE_COPY.witnessStones.shutterInspection}\n\nNoma keeps her hands away from Bramwell's latch. \"The hall hears both costs first,\" she says. \"Then Bramwell and I can change this order in public.\"`,
        choices: [{ label: viewFlags.westrootHoldBellRung ? "Hear Westroot at Split Hall first." : "Leave the lawful hold in place.", effect: () => setDialogue(null) }],
      });
    }
    if (viewFlags.witnessStoneSequenceSolved) {
      return setDialogue({
        portrait: "◌",
        name: CHAPTER_3_SCENE_COPY.witnessStones.name,
        text: "The hold-shutter stands open. Fresh witness tags hang beside the four stones, and the outer shelter's answered water tally rests at Water. The Cargo Siding order now bears Bramwell's and Noma's names.",
        choices: [{ label: "Continue.", effect: () => setDialogue(null) }],
      });
    }
    setDialogue({
      portrait: "◌",
      name: CHAPTER_3_SCENE_COPY.witnessStones.name,
      sceneImage: {
        src: witnessStonesScene,
        alt: "Four carved Witness Stones standing unobstructed inside Westroot's lantern-lit water circle.",
      },
      text: `${CHAPTER_3_SCENE_COPY.witnessStones.introduction}\n\n${CHAPTER_3_SCENE_COPY.witnessStones.prompt}`,
      choices: [
        {
          label: "Inspect the stone carvings.",
          effect: () => openWitnessStoneInspectionDialogue(viewFlags),
        },
        ...Object.entries(WITNESS_STONE_LABELS).map(([id, label]) => ({
          label,
          effect: () => renewWitnessStones(id),
        })),
      ],
      size: "wide",
    });
  };

  const completeRootbreadPromise = () => {
    setFlags((f) => ({ ...f, rootbreadPromiseKept: true, lioKnotFound: true, metRootbreadChild: true }));
    gainStoryItemOnce("rootbread_charm");
    setPlayer((p) => ({ ...p, xp: p.xp + 6 }));
    announce("The Rootbread Promise reached Lio. XP +6", [{ id: "rootbread_charm", qty: 1 }]);
    setDialogue({
      portrait: "🍞",
      name: CHAPTER_3_SCENE_COPY.rootbread.name,
      portraitName: "Westroot Rootbread Child",
      sceneImage: {
        src: rootbreadCheckpointScene,
        alt: "Mara and a young Mossback restocking the Transfer Checkpoint tray after identifying Lio's blue knot on a returned cup.",
      },
      text: withChapter3CompanionReaction(CHAPTER_3_FULL_SCENE_COPY.rootbread.converged, "rootbread"),
      choices: [{ label: "Leave the restocked tray for the next traveler.", effect: () => setDialogue(null) }],
    });
  };

  const openRootbreadChildResponse = (
    response,
    askedFlag,
    assumedFlags: Flags = {},
  ) => {
    const nextFlags = { ...assumedFlags, metRootbreadChild: true, [askedFlag]: true };
    const viewFlags = { ...flags, ...nextFlags };
    const hasAnotherQuestion =
      !viewFlags.rootbreadChildAskedWhen || !viewFlags.rootbreadChildAskedSafety;
    setFlags((current) => ({ ...current, ...nextFlags }));
    setDialogue({
      portrait: "🍞",
      name: "Westroot Child",
      portraitName: "Westroot Rootbread Child",
      sceneImage: {
        src: rootbreadCheckpointScene,
        alt: "A young Mossback presents Lio's returned cup to Mara at Westroot's Transfer Checkpoint.",
      },
      text: `${response}${hasAnotherQuestion ? "" : `\n\n${CHAPTER_3_FULL_SCENE_COPY.rootbread.cupReveal}`}`,
      choices: [
        hasAnotherQuestion
          ? {
              label: "Ask the child something else.",
              effect: () => openRootbreadCheckpointDialogue(nextFlags),
            }
          : null,
        !hasAnotherQuestion
          ? {
              label: "Restock the tray for the next traveler.",
              effect: completeRootbreadPromise,
            }
          : null,
      ].filter(Boolean),
    });
  };

  const openRootbreadCheckpointDialogue = (assumedFlags: Flags = {}) => {
    const viewFlags = { ...flags, ...assumedFlags };
    if (!viewFlags.rootbreadLeadLearned) {
      return setDialogue({
        portrait: "🍞",
        name: "Westroot Transfer Checkpoint",
        text: CHAPTER_3_FULL_SCENE_COPY.rootbread.unavailable,
        choices: [{ label: "Continue into Westroot.", effect: () => setDialogue(null) }],
      });
    }
    if (viewFlags.rootbreadPromiseKept) {
      return setDialogue({
        portrait: "🍞",
        name: CHAPTER_3_SCENE_COPY.rootbread.name,
        portraitName: "Westroot Rootbread Child",
        text: CHAPTER_3_FULL_SCENE_COPY.rootbread.repeat,
        choices: [{ label: "Leave the record and tray in place.", effect: () => setDialogue(null) }],
      });
    }
    const firstMeeting = !viewFlags.metRootbreadChild;
    const conversationFlags = { ...viewFlags, metRootbreadChild: true };
    if (firstMeeting) setFlags((current) => ({ ...current, metRootbreadChild: true }));
    setDialogue({
      portrait: "🍞",
      name: firstMeeting ? CHAPTER_3_SCENE_COPY.rootbread.name : "Westroot Child",
      portraitName: "Westroot Rootbread Child",
      sceneImage: {
        src: rootbreadCheckpointScene,
        alt: "A young Mossback helper speaking with Mara beside the basin, airing rack, account rail, and rootbread tray at Westroot's Transfer Checkpoint.",
      },
      text: firstMeeting
        ? CHAPTER_3_FULL_SCENE_COPY.rootbread.introduction
        : CHAPTER_3_FULL_SCENE_COPY.rootbread.childPrompt,
      choices: [
        !conversationFlags.rootbreadChildAskedWhen
          ? {
              label: "What did the courier look like?",
              effect: () => openRootbreadChildResponse(
                CHAPTER_3_FULL_SCENE_COPY.rootbread.appearanceResponse,
                "rootbreadChildAskedWhen",
                conversationFlags,
              ),
            }
          : null,
        !conversationFlags.rootbreadChildAskedSafety
          ? {
              label: "How did Lio manage to mark the cup?",
              effect: () => openRootbreadChildResponse(
                CHAPTER_3_FULL_SCENE_COPY.rootbread.routineResponse,
                "rootbreadChildAskedSafety",
                conversationFlags,
              ),
            }
          : null,
      ].filter(Boolean),
    });
  };

  const openCargoEvidenceDialogue = (assumedFlags = {}) => {
    const viewFlags = { ...flags, ...assumedFlags };
    setDialogue({
      portrait: "▰",
      name: CHAPTER_3_SCENE_COPY.cargoSiding.name,
      text: CHAPTER_3_FULL_SCENE_COPY.cargoSiding.evidence,
      choices: [
        {
          label: "Call out whoever is hiding behind the crates.",
          effect: () =>
            setDialogue({
              portrait: "▰",
              name: CHAPTER_3_SCENE_COPY.cargoSiding.name,
              text: CHAPTER_3_FULL_SCENE_COPY.cargoSiding.battle,
              choices: [
                {
                  label: "Fight the Briar Cargo Runner and Seal-Forged Sentry before he can escape.",
                  effect: () => {
                    setDialogue(null);
                    startBattle(buildEncounterEnemies("westrootCargo"), "westrootCargo", {
                      heroStarts: viewFlags.cargoAmbushPrepared ? true : undefined,
                      heroGuard: viewFlags.cargoAmbushPrepared ? 4 : 0,
                      openingLog: viewFlags.cargoAmbushPrepared
                        ? "Your ledger work exposed the runner's escape route. Quill and two gatekeepers cover the service passage. The party starts ready, with 4 guard."
                        : null,
                    });
                  },
                },
                { label: "Back away before the runner and sentry attack.", effect: () => setDialogue(null) },
              ],
            }),
        },
        { label: "Bring the evidence to Split Hall later.", effect: () => setDialogue(null) },
      ],
    });
  };

  const openCargoInspectionDialogue = (
    result,
    flagUpdate = {},
    portraitImage = null,
  ) => {
    if (Object.keys(flagUpdate).length) setFlags((f) => ({ ...f, ...flagUpdate }));
    setDialogue({
      portrait: "▰",
      name: CHAPTER_3_SCENE_COPY.cargoSiding.name,
      portraitImage,
      text: result,
      choices: [
        { label: "Compare this clue with the whole crate record.", effect: () => openCargoEvidenceDialogue(flagUpdate) },
        { label: "Keep investigating the siding.", effect: openCargoSidingDialogue },
        { label: "Step back for now.", effect: () => setDialogue(null) },
      ],
    });
  };

  const openCargoSidingDialogue = () => {
    if (!flags.witnessStoneSequenceSolved) {
      return setDialogue({
        portrait: "▰",
        name: CHAPTER_3_SCENE_COPY.cargoSiding.name,
        text: flags.nomaIntroducedWitnessStones
          ? CHAPTER_3_SCENE_COPY.cargoSiding.locked
          : "A fitted-stone door seals the rail passage. Four worn symbols circle its lock, but none is labeled. Forcing it would confirm every fear Westroot has about strangers beneath the hill.",
        choices: [{ label: "Leave the sealed siding alone.", effect: () => setDialogue(null) }],
      });
    }
    if (flags.willowCargoExposed)
      return setToast("The Cargo Siding is quiet now. The evidence is waiting in Split Hall.");
    setDialogue({
      portrait: "▰",
      name: CHAPTER_3_SCENE_COPY.cargoSiding.name,
      sceneImage: {
        src: cargoSidingEvidenceScene,
        alt: "Mara examining false Willow cargo and the sealed crate evidence at Westroot's Cargo Siding.",
      },
      text: CHAPTER_3_SCENE_COPY.cargoSiding.text,
      choices: [
        hasItem(player, "willowmark_lens", 1)
          ? {
              label: "Use the Willowmark Lens.",
              effect: () => openCargoInspectionDialogue(
                CHAPTER_3_FULL_SCENE_COPY.cargoSiding.lensResult,
                {},
                {
                  src: willowmarkSealImage,
                  alt: "Ada Willowmarket's green three-leaf seal with its identifying nick in the left leaf",
                },
              ),
            }
          : null,
        { label: "Inspect the wax and crate tags closely.", effect: () => openCargoInspectionDialogue(CHAPTER_3_FULL_SCENE_COPY.cargoSiding.manualResult) },
        {
          label: "Check the rail marks and loading ledger.",
          effect: () => openCargoInspectionDialogue(
            `${CHAPTER_3_FULL_SCENE_COPY.cargoSiding.ledgerResult}\n\n${CHAPTER_3_FULL_SCENE_COPY.cargoSiding.preparedResult}`,
            { cargoAmbushPrepared: true },
          ),
        },
        { label: "Open the crate carefully.", effect: () => openCargoInspectionDialogue(CHAPTER_3_FULL_SCENE_COPY.cargoSiding.crateResult) },
        { label: "Leave the crates for now.", effect: () => setDialogue(null) },
      ].filter(Boolean),
    });
  };

  const resolveCargoBattleOutcome = (outcome) => {
    const captured = outcome === "captured";
    setFlags((f) => ({ ...f, cargoRunnerCaptured: captured, cargoRunnerEscaped: !captured }));
    gainStoryItemOnce("cargo_transfer_tag");
    announce("Cargo Transfer Tag recovered.", [{ id: "cargo_transfer_tag", qty: 1 }]);
    setDialogue({
      portrait: "▰",
      name: "Cargo Siding Cleared",
      text: withChapter3CompanionReaction(
        `${captured ? CHAPTER_3_FULL_SCENE_COPY.cargoSiding.captured : CHAPTER_3_FULL_SCENE_COPY.cargoSiding.escaped}\n\n${CHAPTER_3_FULL_SCENE_COPY.cargoSiding.converged}`,
        "cargo",
      ),
      choices: [{ label: "Bring the evidence to Split Hall.", effect: () => setDialogue(null) }],
    });
  };

  const openChapterThreeClosing = () =>
    setDialogue({
      portrait: "✿",
      name: CHAPTER_3_SCENE_COPY.closing.name,
      portraitName: "Noma Greenstill",
      sceneImage: {
        src: mossgardenClosingMarkScene,
        alt: "Mara and Noma comparing the recovered transfer tag with an older Lower West Gate route index in the lantern-lit Mossgarden.",
      },
      contentLayout: "stacked",
      text: `${CHAPTER_3_SCENE_COPY.closing.text}\n\n${
        flags.rootbreadPromiseKept
          ? "Chapter 3 is complete. The playable story currently ends here; the westward lead continues in Chapter 4."
          : flags.rootbreadLeadLearned
            ? "Chapter 3's main story is complete. The playable story currently ends here, but one optional lead remains: return to the Transfer Checkpoint and ask Lume's helper about the unnamed courier."
            : flags.metAuntieLume
              ? "Chapter 3's main story is complete. The playable story currently ends here. Lume may still know whether anyone in Westroot saw a sign of Lio."
              : "Chapter 3's main story is complete. The playable story currently ends here. The Mossback baker in Rootmarket may still have heard something about Lio."
      }`,
      choices: [{ label: "Finish Chapter 3 for now.", effect: () => setDialogue(null) }],
      size: "wide",
    });

  const completeChapterThree = (contactChoice: BramblecrossContactChoice) => {
    setFlags((f) => ({ ...f, westrootTrustEarned: true, chapterThreeClear: true }));
    setPlayer((p) => ({ ...p, xp: p.xp + 16 }));
    announce("Westroot restores its first Bramblecross compact. Chapter 3 complete. XP +16");
    setDialogue({
      portrait: "▤",
      name: CHAPTER_3_SCENE_COPY.splitHall.name,
      sceneImage: {
        src: splitHallResolutionScene,
        alt: "Mara, Bramwell, Noma, the Rootmarket baker, and their Stonekin and Mossback neighbors resolve Westroot's future in Split Hall.",
      },
      contentLayout: "stacked",
      text: withChapter3CompanionReaction(
        getSplitHallResolution(contactChoice),
        "resolution",
      ),
      choices: [{ label: "Visit Noma in the Mossgarden.", effect: openChapterThreeClosing }],
      size: "wide",
    });
  };

  const openBramblecrossContactChoice = (response) =>
    setDialogue({
      portrait: "▤",
      name: "Split Hall — First Contact",
      sceneImage: {
        src: splitHallResolutionScene,
        alt: "Mara, Bramwell, Noma, the Rootmarket baker, and the Stonekin and Mossback neighbors of Westroot deciding how to renew contact with Bramblecross.",
      },
      contentLayout: "stacked",
      text: `${response}\n\n${CHAPTER_3_FULL_SCENE_COPY.splitHall.contactPrompt}`,
      choices: Object.entries(BRAMBLECROSS_CONTACT_CHOICES).map(([key, choice]) => ({
        label: choice.label,
        effect: () => completeChapterThree(key as BramblecrossContactChoice),
      })),
      size: "wide",
    });

  const openSplitHallPreBellResponse = (response) =>
    setDialogue({
      portrait: "!",
      name: "Split Hall",
      text: response,
      choices: [{ label: "Leave before this becomes a meeting.", effect: () => setDialogue(null) }],
      size: "wide",
    });

  const openSplitHallPreBellDialogue = () => {
    if (!flags.splitHallVisitedBeforeBell) {
      setFlags((current) => ({ ...current, splitHallVisitedBeforeBell: true }));
    }
    setDialogue({
      portrait: "!",
      name: "Split Hall",
      text: flags.splitHallVisitedBeforeBell
        ? CHAPTER_3_FULL_SCENE_COPY.splitHall.preBellRepeat
        : CHAPTER_3_FULL_SCENE_COPY.splitHall.preBellIntroduction,
      choices: flags.splitHallVisitedBeforeBell
        ? [{ label: "Keep exploring.", effect: () => setDialogue(null) }]
        : [
            {
              label: "A closed gate can still leave someone outside.",
              effect: () => openSplitHallPreBellResponse(
                CHAPTER_3_FULL_SCENE_COPY.splitHall.preBellCloseResponse,
              ),
            },
            {
              label: "Holding suspicious cargo is not abandoning the road.",
              effect: () => openSplitHallPreBellResponse(
                CHAPTER_3_FULL_SCENE_COPY.splitHall.preBellHoldResponse,
              ),
            },
            {
              label: "Listen without taking a side.",
              effect: () => openSplitHallPreBellResponse(
                CHAPTER_3_FULL_SCENE_COPY.splitHall.preBellListenResponse,
              ),
            },
          ],
      size: "wide",
    });
  };

  const openSplitHallInvestigationOffer = (assumedFlags: Flags = {}) => {
    const viewFlags = { ...flags, ...assumedFlags, splitHallDebateHeard: true };
    const hasAnotherQuestion =
      !viewFlags.splitHallAskedOuterShelter ||
      !viewFlags.splitHallAskedGateCost ||
      !viewFlags.splitHallAskedCargoHold;
    setDialogue({
      portrait: "!",
      name: "Split Hall — The Missing Crate",
      text: CHAPTER_3_FULL_SCENE_COPY.splitHall.investigationOffer,
      choices: [
        hasAnotherQuestion
          ? {
              label: "Ask one more question before we go.",
              effect: () => openSplitHallEarlyDialogue(viewFlags),
            }
          : null,
        {
          label: "Walk with Bramwell and Noma to the Witness Stones.",
          effect: () => {
            const destination = WESTROOT_STORY_POSITIONS.witnessStones;
            setPosition(destination);
            revealArea("westrootHub", destination.x, destination.y, 2);
            openWitnessStonesDialogue([], "", viewFlags);
          },
        },
      ].filter(Boolean),
      size: "wide",
    });
  };

  const openSplitHallEarlyResponse = (
    response,
    askedFlag,
    assumedFlags: Flags = {},
  ) => {
    const priorFlags = { ...flags, ...assumedFlags };
    const firstHallResponse = !priorFlags.splitHallDebateHeard;
    const nextFlags = { ...assumedFlags, splitHallDebateHeard: true, [askedFlag]: true };
    setFlags((current) => ({ ...current, ...nextFlags }));
    setDialogue({
      portrait: "!",
      name: "Split Hall — The Hold Debate",
      text: firstHallResponse
        ? `${response}\n\n${CHAPTER_3_FULL_SCENE_COPY.splitHall.earlyConverged}`
        : response,
      choices: [
        {
          label: "Ask the hall another question.",
          effect: () => openSplitHallEarlyDialogue(nextFlags),
        },
        {
          label: "Volunteer to track down the missing Willow crate.",
          effect: () => openSplitHallInvestigationOffer(nextFlags),
        },
      ],
      size: "wide",
    });
  };

  const openSplitHallEarlyDialogue = (assumedFlags = {}) => {
    const viewFlags = { ...flags, ...assumedFlags };
    const questions = [
      !viewFlags.splitHallAskedOuterShelter
        ? {
            label: "Who is still outside the sealed routes?",
            effect: () => openSplitHallEarlyResponse(
              CHAPTER_3_FULL_SCENE_COPY.splitHall.outerShelterResponse,
              "splitHallAskedOuterShelter",
              viewFlags,
            ),
          }
        : null,
      !viewFlags.splitHallAskedGateCost
        ? {
            label: "What has keeping the gate open already cost?",
            effect: () => openSplitHallEarlyResponse(
              CHAPTER_3_FULL_SCENE_COPY.splitHall.gateCostResponse,
              "splitHallAskedGateCost",
              viewFlags,
            ),
          }
        : null,
      !viewFlags.splitHallAskedCargoHold
        ? {
            label: "How could the held cargo move?",
            effect: () => openSplitHallEarlyResponse(
              CHAPTER_3_FULL_SCENE_COPY.splitHall.cargoHoldResponse,
              "splitHallAskedCargoHold",
              viewFlags,
            ),
          }
        : null,
    ].filter(Boolean);
    setDialogue({
      portrait: "!",
      name: "Split Hall — The Hold Debate",
      sceneImage: {
        src: splitHallHoldDebateScene,
        alt: "Bramwell, Noma, Mara, Quill, and divided Westroot neighbors facing one another across the repaired Split Hall table after the Hold Bell.",
      },
      text: viewFlags.splitHallDebateHeard
        ? CHAPTER_3_FULL_SCENE_COPY.splitHall.earlyRepeat
        : viewFlags.splitHallVisitedBeforeBell
          ? CHAPTER_3_FULL_SCENE_COPY.splitHall.earlyReturnIntroduction
          : CHAPTER_3_FULL_SCENE_COPY.splitHall.earlyIntroduction,
      choices: [
        ...questions,
        viewFlags.splitHallDebateHeard
          ? {
              label: "Volunteer to track down the missing Willow crate.",
              effect: () => openSplitHallInvestigationOffer(viewFlags),
            }
          : null,
      ].filter(Boolean),
      size: "wide",
    });
  };

  const openSplitHallDialogue = () => {
    if (flags.chapterThreeClear) {
      return setDialogue({
        portrait: "▤",
        name: CHAPTER_3_SCENE_COPY.splitHall.name,
        text: "The hall is full of copied warnings, open ledgers, and people making themselves useful. The recovered transfer tag, the Willowmark comparison, and the guarded Bramblecross compact are filed together where anyone in the hall may review them. Westroot is not opening blindly, and it is no longer letting lies travel unchallenged.",
        choices: [{ label: "Continue.", effect: () => setDialogue(null) }],
      });
    }
    if (!flags.willowCargoExposed) {
      if (flags.westrootHoldBellRung) return openSplitHallEarlyDialogue();
      return openSplitHallPreBellDialogue();
    }
    const rememberedTestimony = [
      flags.splitHallAskedOuterShelter
        ? CHAPTER_3_FULL_SCENE_COPY.splitHall.earlyMemories.outerShelter
        : null,
      flags.splitHallAskedGateCost
        ? CHAPTER_3_FULL_SCENE_COPY.splitHall.earlyMemories.gateCost
        : null,
      flags.splitHallAskedCargoHold
        ? CHAPTER_3_FULL_SCENE_COPY.splitHall.earlyMemories.cargoHold
        : null,
    ].filter(Boolean).join("\n");
    setDialogue({
      portrait: "▤",
      name: CHAPTER_3_SCENE_COPY.splitHall.name,
      text: `${CHAPTER_3_FULL_SCENE_COPY.splitHall.fullIntroduction}${
        rememberedTestimony ? `\n\nThe hall has heard these fears before:\n${rememberedTestimony}` : ""
      }`,
      choices: [
        { label: "Frame the compact around the danger that closure failed to stop.", effect: () => openBramblecrossContactChoice(CHAPTER_3_FULL_SCENE_COPY.splitHall.bramwellResponse) },
        { label: "Frame the compact around warnings and shelter traveling together.", effect: () => openBramblecrossContactChoice(CHAPTER_3_FULL_SCENE_COPY.splitHall.nomaResponse) },
        { label: "Frame the compact around the four road promises.", effect: () => openBramblecrossContactChoice(CHAPTER_3_FULL_SCENE_COPY.splitHall.stonesResponse) },
      ],
      size: "wide",
    });
  };

  const openWestrootGateDialogue = (assumedFlags: Flags & { localResult?: string } = {}) => {
    const viewFlags = { ...flags, ...assumedFlags };
    if (!viewFlags.westrootGateOpened)
      return setToast(CHAPTER_2_SCENE_COPY.westrootGate.closedToast);
    if (viewFlags.chapterTwoClear)
      return setDialogue({
        portrait: CHAPTER_2_SCENE_COPY.westrootGate.portrait,
        name: CHAPTER_2_SCENE_COPY.westrootGate.name,
        text: "The First Westroot Gate stands open. The truth that opened it does not need to be proven twice.",
        choices: [
          {
            label: CHAPTER_2_SCENE_COPY.westrootGate.labels.continue,
            effect: enterWestrootHub,
          },
        ],
      });
    setDialogue({
      portrait: CHAPTER_2_SCENE_COPY.westrootGate.portrait,
      name: CHAPTER_2_SCENE_COPY.westrootGate.name,
      text: formatWestrootGateText(),
      choices: [
        !viewFlags.searchedWestrootThreshold
          ? {
              label: CHAPTER_2_SCENE_COPY.westrootGate.labels.search,
              effect: () => {
                setFlags((f) => ({ ...f, searchedWestrootThreshold: true }));
                gainStoryItemOnce("no_handle_token");
                announce(CHAPTER_2_SCENE_COPY.westrootGate.thresholdFound, [{ id: "no_handle_token", qty: 1 }]);
                openWestrootGateDialogue({ ...assumedFlags, searchedWestrootThreshold: true });
              },
            }
          : null,
        !viewFlags.witnessNoteSent
          ? {
              label: CHAPTER_2_SCENE_COPY.westrootGate.labels.witnessNote,
              effect: () => {
                setFlags((f) => ({ ...f, witnessNoteSent: true }));
                gainStoryItemOnce("witness_note_bramblecross");
                announce(CHAPTER_2_SCENE_COPY.westrootGate.witnessNotePrepared, [{ id: "witness_note_bramblecross", qty: 1 }]);
                openWestrootGateDialogue({ ...assumedFlags, witnessNoteSent: true });
              },
            }
          : null,
        {
          label: CHAPTER_2_SCENE_COPY.westrootGate.labels.stepThrough,
          effect: () => {
            setFlags((f) => ({
              ...f,
              chapterTwoClear: true,
              lioAlivePastGate: true,
              eddensDrawingValidated: true,
              briarCrownWatchingWestroot: true,
            }));
            setPlayer((p) => ({ ...p, xp: p.xp + 16 }));
            setDialogue({
              portrait: "✨",
              name: CHAPTER_2_SCENE_COPY.westrootGate.completeName,
              text: CHAPTER_2_SCENE_COPY.westrootGate.completeText,
              sceneImage: {
                src: westrootThresholdOpeningScene,
                alt: CHAPTER_2_SCENE_COPY.westrootGate.completeSceneAlt,
              },
              contentLayout: "stacked",
              size: "wide",
              choices: [{ label: CHAPTER_2_SCENE_COPY.westrootGate.labels.continue, effect: enterWestrootHub }],
            });
          },
        },
      ].filter(Boolean),
    });
  };

  const inspectTile = (tile, options: { auto?: boolean; previousPosition?: Position } = {}) => {
    if (routeUnintroducedPartyToBramwell()) return;
    if (options.auto && shouldSkipAutoInspect(tile)) return;
    if (region === "hearthhollow") {
      if (tile === "elder") openElderDialogue();
      if (tile === "pibble") openPibbleDialogue();
      if (tile === "gate") openGateEvent();
      if (tile === "well") openVillageWellDialogue();
      if (tile === "chest" && !flags.openedChest) {
        setFlags((f) => ({ ...f, openedChest: true }));
        gainItem(setPlayer, "trail_snack", 1);
        gainItem(setPlayer, "moonmint", 1);
        announce("You open the old supply chest.", [
          { id: "trail_snack", qty: 1 },
          { id: "moonmint", qty: 1 },
        ]);
      }
      if (["baker", "farmer", "weaver"].includes(tile))
        setDialogue({
          portrait: TILE_META[tile].icon,
          name: TILE_META[tile].label,
          text: getVillageNpcDialogue(tile, flags),
          choices: [
            { label: "I'll be careful.", effect: () => setDialogue(null) },
          ],
        });
    }
    if (region === "lanternRoad") {
      if (tile === "return_gate")
        travelToRegion(
          "hearthhollow",
          { x: 6, y: 8 },
          player.checkpointLabel,
          "You head back to Hearthhollow.",
        );
      if (tile === "ranger") openNixDialogue();
      if (tile === "ruins") openRuinDialogue();
      if (tile === "wildbattle") openWildBattleDialogue();
      if (tile === "bramblecross") openBramblecrossDialogue();
      if (tile === "cart") openCartDialogue();
      if (tile === "pond") openPondDialogue();
      if (tile === "camp") {
        setFlags((f) => ({ ...f, sawRoadCamp: true }));
        setDialogue({
          portrait: "⛺",
          mapVignette: "lanternCamp",
          name: "Road Camp",
          text: flags.helpedTraveler
            ? "The little camp is no longer empty. The traveler you guided here sits near the coals with both hands wrapped around a tin cup, looking steadier than before. He gives you a grateful nod, then points to a flat stone where someone has been mixing road herbs."
            : "A small traveler camp sits off the road, tucked between three bent pines and a ring of old stones. The firepit is cold, but dry kindling waits under a bit of bark. Whoever uses this place expects frightened travelers to need somewhere safer than the open road.",
          choices: [
            {
              label: "Rest",
              effect: () => {
                const heroRecovered = Math.max(0, player.maxHp - player.hp);
                const companionRecovered = companion.recruited
                  ? Math.max(0, companion.maxHp - companion.hp)
                  : 0;
                const restedPlayer = {
                  ...player,
                  hp: player.maxHp,
                  checkpointLabel: "Road Camp",
                };
                const restedCompanion = companion.recruited
                  ? { ...companion, hp: companion.maxHp }
                  : companion;
                const recovery = [
                  heroRecovered > 0
                    ? `${player.name} recovers ${heroRecovered} HP.`
                    : `${player.name} is already at full health.`,
                  companion.recruited
                    ? companionRecovered > 0
                      ? `${companion.name} recovers ${companionRecovered} HP.`
                      : `${companion.name} is already at full health.`
                    : null,
                  "Checkpoint saved at Road Camp.",
                ]
                  .filter(Boolean)
                  .join(" ");

                setPlayer(restedPlayer);
                setCompanion(restedCompanion);
                const payload = buildCurrentSavePayload(
                  "Checkpoint reached: Road Camp",
                  restedPlayer,
                  restedCompanion,
                );
                localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
                setToast("Checkpoint reached: Road Camp");
                setDialogue((current) =>
                  current?.name === "Road Camp"
                    ? { ...current, feedback: recovery }
                    : current,
                );
              },
            },
            {
              label: "Craft",
              effect: () => {
                setCraftContext("roadCamp");
                setCraftOpen(true);
              },
            },
            { label: "Leave camp", effect: () => setDialogue(null) },
          ],
        });
      }
      if (tile === "shrine") openShrineDialogue();
      if (tile === "chest2") openRoadCacheDialogue();
      if (tile === "traveler")
        setDialogue({
          portrait: "🧳",
          portraitName: flags.helpedTraveler
            ? undefined
            : "Worried Road Traveler",
          name: flags.helpedTraveler ? "Traveler's Tracks" : "Worried Traveler",
          text: flags.helpedTraveler
            ? "The traveler is no longer standing in the open road. A few hurried footprints lead north through the grass toward the camp you pointed out."
            : flags.sawRoadCamp
              ? 'The traveler clutches a satchel so tightly the leather creaks. His hat is on sideways, and he keeps glancing at the trees as though they might be reading his mail. "I passed two men near the ditch with a folded order," he says. "It had the royal crown pressed into red wax. They said the road was under Crown inspection. Then one saw me listening and smiled like a locked door. I have never trusted doors that smile. Is there anywhere safe off this road?"'
              : 'The traveler clutches a satchel so tightly the leather creaks. His hat is on sideways, and he keeps glancing at the trees as though they might be reading his mail. "I passed two men near the ditch with a folded order," he says. "It had the royal crown pressed into red wax. They said the road was under Crown inspection. Then one saw me listening and smiled like a locked door. I have never trusted doors that smile. I need to get off the road, but I don\'t know where safe is."',
          choices: flags.helpedTraveler
            ? [
                {
                  label: "Follow the tracks with your eyes.",
                  effect: () => setDialogue(null),
                },
              ]
            : flags.sawRoadCamp
              ? [
                  {
                    label:
                      "I found a camp north of the road. Head there and keep low.",
                    effect: () => {
                      setFlags((f) => ({ ...f, helpedTraveler: true }));
                      setPlayer((p) => ({ ...p, xp: p.xp + 5 }));
                      setDialogue(null);
                      setToast("You point the traveler toward the camp. XP +5");
                    },
                  },
                  {
                    label: "Did you get a look at the order?",
                    effect: () =>
                      setDialogue({
                        portrait: "🧳",
                        portraitName: "Worried Road Traveler",
                        name: "Worried Traveler",
                        text: '"I saw enough," he insists. "The royal crown was pressed right into the red wax. The order said Bramblecross was being held and no couriers could leave until a Crown inspection. So I trusted it. A Crown seal is supposed to mean somebody responsible has named a real danger. Then the men started asking why I was still on the road, and I realized the seal was the only responsible-looking thing about them."',
                        choices: [
                          {
                            label: "The seal may be false. Get to the camp.",
                            effect: () => {
                              setFlags((f) => ({ ...f, helpedTraveler: true }));
                              setPlayer((p) => ({ ...p, xp: p.xp + 5 }));
                              setDialogue(null);
                              setToast(
                                "You point the traveler toward the camp. XP +5",
                              );
                            },
                          },
                          {
                            label: "Stay hidden for now.",
                            effect: () => setDialogue(null),
                          },
                        ],
                      }),
                  },
                  {
                    label: "Stay hidden for now.",
                    effect: () => setDialogue(null),
                  },
                ]
              : [
                  {
                    label:
                      "I haven't found a safe place yet. Stay low while I look.",
                    effect: () => setDialogue(null),
                  },
                  {
                    label: "Ask what scared him.",
                    effect: () =>
                      setDialogue({
                        portrait: "🧳",
                        portraitName: "Worried Road Traveler",
                        name: "Worried Traveler",
                        text: '"Two men near the ditch," he whispers. "One held a folded order with the royal crown stamped into red wax. He said the road was under Crown inspection. The other had a dog made mostly of thorns and bad intentions. I thought they were Crown men, but then they started watching me instead of the road. They were Crown men, weren\'t they?"',
                        choices: [
                          {
                            label:
                              "I don't think so. Stay hidden while I find somewhere safe.",
                            effect: () => setDialogue(null),
                          },
                        ],
                      }),
                  },
                ],
        });
    }
    if (region === "bramblecross") {
      if (tile === "town_gate" && flags.chapterReported && !flags.chapterTwoClear)
        openWestrootDeparture();
      else if (tile === "town_gate")
        travelToRegion(
          "lanternRoad",
          { x: 11, y: 7 },
          player.checkpointLabel,
          "You head back onto Lantern Road.",
        );
      if (tile === "mayor")
        setDialogue({
          portrait: "👑",
          name: "Mayor Anwen",
          text: getMayorDialogue(flags),
          choices: [
            {
              label: flags.ennaBriefed
                ? flags.chapterReported
                  ? "We'll follow the Westroot lead."
                  : flags.chapterOneClear
                    ? "I'll report what we found."
                    : "I'll look into it."
                : "I'll find Enna in the watchhouse.",
              effect: () => {
                setFlags((f) => ({ ...f, metMayor: true }));
                setDialogue(null);
              },
            },
          ],
        });
      if (tile === "board") openBoardDialogue();
      if (tile === "clerk") openClerkDialogue();
      if (tile === "captain") openCaptainDialogue();
      if (tile === "merchant") openMerchantDialogue();
      if (tile === "cellar") openCellarDialogue();
    }
    if (region === "rootCellar") {
      if (tile === "stairs_up") {
        if (flags.beatCellarBoss && !flags.chapterOneClear) {
          setPosition({ x: 10, y: 4 });
          openExitDoorDialogue({ beatCellarBoss: true });
          return;
        }
        travelToRegion(
          "bramblecross",
          { x: 3, y: 5 },
          player.checkpointLabel,
          "You climb back into Bramblecross.",
        );
      }
      if (tile === "sigil") openRootSigilDialogue();
      if (tile === "mural") openRootMuralDialogue();
      if (tile === "fungus") openCellarFungusDialogue();
      if (tile === "cache3") openCellarCacheDialogue();
      if (tile === "skulk" && !flags.beatCellarSkulk)
        openSkulkDialogue(options.previousPosition);
      if (tile === "boss" && !flags.beatCellarBoss) openBossDialogue();
      if (tile === "exit_door") openExitDoorDialogue();
    }
    if (region === "westrootTrail") {
      if (tile === "westroot_return")
        travelToRegion(
          "bramblecross",
          { x: 6, y: 9 },
          player.checkpointLabel,
          "You return to Bramblecross with Westroot still behind you.",
        );
      if (tile === "westroot_cut") openWestrootCutDialogue();
      if (tile === "shelter_nook") openShelterNookDialogue();
      if (tile === "false_notice") openFalseNoticeDialogue();
      if (tile === "three_hollow") openThreeHollowDialogue();
      if (tile === "crown_sign") openCrownSignDialogue({}, options.previousPosition);
      if (tile === "lantern_sign") openLanternSignDialogue({}, options.previousPosition);
      if (tile === "no_handle_stone")
        openThreeDoorThresholdDialogue(
          options.previousPosition || previousPositionByRegionRef.current.westrootTrail,
        );
      if (tile === "roadwatcher")
        openRoadwatcherDialogue(options.previousPosition);
      if (tile === "westroot_gate") openWestrootGateDialogue();
    }
    if (region === "crownDoorDen") {
      if (tile === "crown_den_exit") returnToThreeDoorThreshold();
      if (tile === "crown_vestibule") openCrownVestibuleDialogue();
      if (tile === "wax_table") openWaxTableDialogue();
      if (tile === "slat_rack") openSlatRackDialogue();
      if (tile === "witness_ledger") openWitnessLedgerDialogue();
      if (tile === "collar_kennel") openCollarKennelDialogue();
      if (tile === "false_map") openFalseMapRoomDialogue();
      if (tile === "den_guard") openCrownDenGuardDialogue(options.previousPosition);
    }
    if (region === "westrootHub") {
      if (tile === "westroot_first_gate") openWestrootFirstGateDialogue();
      if (tile === "rootmarket") openRootmarketDialogue();
      if (tile === "mossgarden") openMossgardenDialogue();
      if (tile === "witness_stones") openWitnessStonesDialogue();
      if (tile === "cargo_siding") openCargoSidingDialogue();
      if (tile === "split_hall") openSplitHallDialogue();
    }
  };

  const handleMapNodeClick = (x, y, tile) => {
    if (routeUnintroducedPartyToBramwell()) return;
    const isCurrentNode = position.x === x && position.y === y;
    const isConnectedNode = areMapNodesConnected(region, position, { x, y });
    if (isConnectedNode) {
      if (isClosedWestrootHoldCrossing(position, { x, y })) {
        openWestrootHoldPathNotice();
        return;
      }
      if (isLockedCellarExit(tile)) {
        blockLockedCellarExit();
        return;
      }
      if (TILE_META[tile]?.blocked) {
        if (isBlockedInteractionTile(tile)) handleBlockedTileInteraction(tile);
        else bump(tile);
      } else {
        const previousPosition = { x: position.x, y: position.y };
        previousPositionByRegionRef.current[region] = previousPosition;
        setPosition({ x, y });
        revealArea(region, x, y);
        if (shouldTriggerLanternRoadAmbush(region, flags, { x, y })) {
          openWildBattleDialogue();
          return;
        }
        inspectTile(tile, { auto: true, previousPosition });
      }
    } else if (isCurrentNode) inspectTile(tile);
  };

  const startBattle = (
    enemies,
    rewardKey,
    options: { heroStarts?: boolean; heroGuard?: number; openingLog?: string | null } = {},
  ) => {
    const battleEnemies = prepareBattleEnemies(enemies);
    const firstEnemy = battleEnemies[0];
    if (!firstEnemy) return;
    const heroRoll = resolveRoll({
      count: 1,
      sides: 6,
      bonus: Math.floor((derivedStats.Precision + derivedStats.Instinct) / 3),
    });
    const enemyRoll = resolveRoll({ count: 1, sides: 6, bonus: 1 });
    const heroStarts = options.heroStarts ?? (heroRoll.total >= enemyRoll.total);
    setBattle({
      enemies: battleEnemies,
      selectedTargetId: firstEnemy.battleId,
      totalEnemies: battleEnemies.length,
      rewardKey,
      turn: heroStarts ? "hero" : "enemy",
      heroGuard: options.heroGuard || 0,
      cooldowns: {},
      finished: false,
      log: [
        `${battleEnemies.length} ${battleEnemies.length === 1 ? "enemy squares" : "enemies square"} up across the field.`,
        options.openingLog,
        options.heroStarts === true
          ? `${player.name} moves first because the ambush route is covered.`
          : `${heroStarts ? player.name : "The enemy side"} moves first (${heroRoll.total} vs ${enemyRoll.total}).`,
      ].filter(Boolean),
    });
    if (!heroStarts) window.setTimeout(() => enemyTurn(), 350);
    saveGame(getRegionCheckpointLabel(region));
  };
  const pushBattleLog = (text) =>
    setBattle((prev) =>
      prev ? { ...prev, log: [...prev.log.slice(-5), text] } : prev,
    );
  const advanceToNextEnemyOrVictory = (prev, defeatMessage = null) => {
    const livingEnemies = getLivingEnemies(prev.enemies);
    const log = defeatMessage ? [...prev.log.slice(-7), defeatMessage] : prev.log;
    if (!livingEnemies.length)
      return { ...prev, finished: true, turn: "victory", log };
    const selectedTarget = getSelectedBattleEnemy(prev.enemies, prev.selectedTargetId);
    return {
      ...prev,
      selectedTargetId: selectedTarget?.battleId || livingEnemies[0].battleId,
      log,
    };
  };

  const selectBattleTarget = (battleId) =>
    setBattle((prev) => {
      if (!prev || prev.finished) return prev;
      const target = getSelectedBattleEnemy(prev.enemies, battleId);
      return target ? { ...prev, selectedTargetId: target.battleId } : prev;
    });

  const heroAttack = (skill) => {
    if (!battle || battle.turn !== "hero" || battle.finished) return;
    const target = getSelectedBattleEnemy(battle.enemies, battle.selectedTargetId);
    if (!target) return;
    const cooldownRemaining = battle.cooldowns?.[skill.id] || 0;
    if (cooldownRemaining > 0) {
      setToast(
        `${skill.name} is cooling down for ${cooldownRemaining} more turn${cooldownRemaining === 1 ? "" : "s"}.`,
      );
      return;
    }

    const sendNextTurn = () =>
      window.setTimeout(
        () =>
          companionIsConscious
            ? companionTurn()
            : enemyTurn(),
        250,
      );

    if (skill.kind === "guardHeal") {
      const bonus = skill.computedBonus || 0;
      const heal = (skill.baseHeal || 0) + bonus;
      const guard = (skill.baseGuard || 0) + bonus;
      setPlayer((p) => ({ ...p, hp: Math.min(p.maxHp, p.hp + heal) }));
      setBattle((prev) =>
        prev
          ? {
              ...prev,
              heroGuard: Math.max(prev.heroGuard || 0, guard),
              cooldowns: skill.cooldown
                ? { ...(prev.cooldowns || {}), [skill.id]: skill.cooldown }
                : prev.cooldowns,
              turn:
                companionIsConscious ? "companion" : "enemy",
              log: [
                ...prev.log.slice(-7),
                `${player.name} uses ${skill.name}. HP +${heal}, Guard +${guard}.`,
              ],
            }
          : prev,
      );
      sendNextTurn();
      return;
    }

    const roll = resolveRoll(skill.spec || { count: 1, sides: 6, bonus: 1 });
    const bonusVsApplies = skill.bonusVs?.some((term) =>
      target.name.toLowerCase().includes(term.toLowerCase()),
    );
    const bonusDamage = bonusVsApplies ? 2 : 0;
    const guardPenalty = skill.pierce || skill.guardBreak || target.guardBroken ? 0 : 1;
    const damage = Math.max(1, roll.total + bonusDamage - guardPenalty);
    const targetWillFall = target.hp - damage <= 0;
    const otherLivingEnemies = getLivingEnemies(battle.enemies).filter(
      (enemy) => enemy.battleId !== target.battleId,
    );

    setBattle((prev) => {
      if (!prev || prev.finished) return prev;
      const activeTarget = getSelectedBattleEnemy(prev.enemies, target.battleId);
      if (!activeTarget) return prev;
      const nextEnemies = damageBattleEnemy(prev.enemies, activeTarget.battleId, damage, {
        weaken: skill.weaken,
        guardBreak: skill.guardBreak,
      });
      const updated = {
        ...prev,
        enemies: nextEnemies,
        cooldowns: skill.cooldown
          ? { ...(prev.cooldowns || {}), [skill.id]: skill.cooldown }
          : prev.cooldowns,
        log: [
          ...prev.log.slice(-7),
          `${player.name} uses ${skill.name} on ${activeTarget.name} for ${damage} damage (${roll.notation}).`,
          ...(activeTarget.hp - damage <= 0 ? [`${activeTarget.name} falls!`] : []),
        ].slice(-8),
      };
      if (!getLivingEnemies(nextEnemies).length)
        return advanceToNextEnemyOrVictory(updated);
      const nextTarget = getSelectedBattleEnemy(nextEnemies, prev.selectedTargetId);
      return {
        ...updated,
        selectedTargetId: nextTarget?.battleId,
        turn: companionIsConscious ? "companion" : "enemy",
      };
    });

    if (!targetWillFall || otherLivingEnemies.length) sendNextTurn();
  };

  const companionTurn = (allowRevivedCompanion = false) => {
    setBattle((prev) => (prev ? { ...prev, turn: "companion" } : prev));
    window.setTimeout(() => {
      let allEnemiesDefeated = false;
      const ability = getCompanionCommandAbility(companion);
      const roll = ability?.effect.damage
        ? resolveRoll(ability.effect.damage)
        : null;
      const damage = roll?.total || 0;

      if (ability?.effect.heroHeal) {
        setPlayer((current) => ({
          ...current,
          hp: Math.min(
            current.maxHp,
            current.hp + (ability.effect.heroHeal || 0),
          ),
        }));
      }
      if (ability?.effect.companionHeal) {
        setCompanion((current) => ({
          ...current,
          hp: Math.min(
            current.maxHp,
            current.hp + (ability.effect.companionHeal || 0),
          ),
        }));
      }

      setBattle((prev) => {
        if (
          !prev ||
          prev.finished ||
          !companion.recruited ||
          (companion.hp <= 0 && !allowRevivedCompanion)
        )
          return prev;
        const target = getSelectedBattleEnemy(prev.enemies, prev.selectedTargetId);
        if (!target) return advanceToNextEnemyOrVictory(prev);
        if (!ability) return { ...prev, turn: "enemy" };

        const nextEnemies =
          damage || ability.effect.weaken
            ? damageBattleEnemy(prev.enemies, target.battleId, damage, {
                weaken: ability.effect.weaken,
              })
            : prev.enemies;
        allEnemiesDefeated = !getLivingEnemies(nextEnemies).length;
        const effectSummary = [
          roll ? `${damage} damage (${roll.notation})` : null,
          ability.effect.heroGuard
            ? `${ability.effect.heroGuard} Guard for ${player.name}`
            : null,
          ability.effect.weaken
            ? `${target.name}'s next attack is reduced by 2`
            : null,
          ability.effect.heroHeal
            ? `restores up to ${ability.effect.heroHeal} HP to ${player.name}`
            : null,
          ability.effect.companionHeal
            ? `restores up to ${ability.effect.companionHeal} HP to ${companion.name}`
            : null,
        ].filter(Boolean);
        const updated = {
          ...prev,
          enemies: nextEnemies,
          heroGuard: Math.max(
            prev.heroGuard || 0,
            ability.effect.heroGuard || 0,
          ),
          log: [
            ...prev.log.slice(-7),
            `${companion.name} uses ${ability.name}: ${effectSummary.join(", ")}.`,
            ...(damage > 0 && target.hp - damage <= 0
              ? [`${target.name} falls!`]
              : []),
          ].slice(-8),
        };
        if (allEnemiesDefeated) return advanceToNextEnemyOrVictory(updated);
        const nextTarget = getSelectedBattleEnemy(nextEnemies, prev.selectedTargetId);
        return { ...updated, selectedTargetId: nextTarget?.battleId, turn: "enemy" };
      });
      window.setTimeout(() => {
        if (!allEnemiesDefeated) enemyTurn();
      }, 120);
    }, 300);
  };

  const enemyTurn = () => {
    setBattle((prev) => (prev ? { ...prev, turn: "enemy" } : prev));
    window.setTimeout(() => {
      setBattle((prev) => {
        if (!prev || prev.finished) return prev;
        const livingEnemies = getLivingEnemies(prev.enemies);
        if (!livingEnemies.length) return advanceToNextEnemyOrVictory(prev);
        let totalHeroDamage = 0;
        let totalCompanionDamage = 0;
        const attackLogs = livingEnemies.map((enemy) => {
          const attack = resolveRoll(
            enemy.currentAttackSpec || { count: 1, sides: 6, bonus: 2 },
          );
          const base = Math.max(1, attack.total - (enemy.weakened ? 2 : 0));
          const companionStanding =
            companion.recruited && companion.hp - totalCompanionDamage > 0;
          const targetHero = !companionStanding || Math.random() < 0.7;
          const damage = targetHero
            ? Math.max(
                1,
                base - Math.floor(derivedStats.Guard / 3) - (prev.heroGuard || 0),
              )
            : Math.max(1, base - 2);
          if (targetHero) totalHeroDamage += damage;
          else totalCompanionDamage += damage;
          return `${enemy.name} uses ${enemy.intent} for ${damage} damage${targetHero ? "" : ` to ${companion.name}`}.`;
        });
        if (totalHeroDamage)
          setPlayer((p) => ({ ...p, hp: Math.max(0, p.hp - totalHeroDamage) }));
        if (totalCompanionDamage)
          setCompanion((c) => ({
            ...c,
            hp: Math.max(0, c.hp - totalCompanionDamage),
          }));
        return {
          ...prev,
          turn: "hero",
          heroGuard: 0,
          cooldowns: tickCooldowns(prev.cooldowns),
          enemies: prev.enemies.map((enemy) =>
            enemy.hp > 0 ? rotateEnemyIntent(enemy) : enemy,
          ),
          log: [...prev.log, ...attackLogs].slice(-8),
        };
      });
    }, 450);
  };

  const finishBattle = () => {
    if (!battle) return;
    const victory =
      battle.turn === "victory" || getLivingEnemies(battle.enemies).length === 0;
    if (victory) {
      let companionReward = null;
      if (companionIsConscious && flags.companionChoice) {
        companionReward = { gained: 8, xp: (companion.xp || 0) + 8 };
        setCompanion((c) => ({ ...c, xp: (c.xp || 0) + 8 }));
      }
      const {
        item,
        extraItems = [],
        gold,
        xp,
        flagUpdate,
        artKey,
        name,
        text,
      } = getBattleReward(battle.rewardKey);
      const rewardItems = [item, ...extraItems].filter(Boolean);
      rewardItems.forEach((rewardItem) => gainItem(setPlayer, rewardItem, 1));
      setPlayer((p) => ({ ...p, gold: p.gold + gold, xp: p.xp + xp }));
      setFlags((f) => ({
        ...f,
        ...flagUpdate,
        ...(battle.rewardKey?.startsWith("roadwatcher") && f.westrootGateOpeningPending
          ? {
              westrootGateOpeningPending: false,
              cleanWestrootSolve: !!f.cleanWestrootSolve,
              messyWestrootSolve: battle.rewardKey === "roadwatcherHard" || !!f.messyWestrootSolve,
              roadwatcherEncounterAvoided: false,
              roadwatcherEvidenceFound: true,
              briarCrownWatchingWestroot: true,
              crownDoorKeyFound: true,
              crownDoorUnlocked: true,
            }
          : {}),
      }));
      setDialogue({
        portrait: "📜",
        artKey,
        name,
        text: companionReward
          ? `${text}\n\n${companion.name} gains ${companionReward.gained} companion XP.`
          : text,
        choices:
          battle.rewardKey === "westrootCargo"
            ? [
                flags.cargoAmbushPrepared ? {
                  label: "Signal Quill to close the runner's prepared escape route.",
                  effect: () => resolveCargoBattleOutcome("captured"),
                } : null,
                {
                  label: flags.cargoAmbushPrepared
                    ? "Secure the evidence instead; let the runner reach the passage."
                    : "Secure the evidence; the runner reaches the uncovered passage.",
                  effect: () => resolveCargoBattleOutcome("escaped"),
                },
              ].filter(Boolean)
            : [
                {
                  label:
                    battle.rewardKey === "boar"
                      ? "Take the satchel to Elder Brynn."
                      : battle.rewardKey === "cellarBoss"
                        ? "Approach the sealed door."
                        : "Continue",
                  effect: () => {
                    if (battle.rewardKey === "cellarBoss") {
                      setPosition({ x: 10, y: 4 });
                      openExitDoorDialogue({ beatCellarBoss: true });
                      return;
                    }
                    setDialogue(null);
                  },
                },
              ],
      });
      announce("Victory!", rewardItems.map((rewardItem) => ({ id: rewardItem, qty: 1 })));
    } else {
      loadGame();
      setDialogue({
        portrait: "💀",
        name: "Defeat",
        text: "You fall in battle. The world blurs, then snaps back to your last checkpoint.",
        choices: [{ label: "Try again", effect: () => setDialogue(null) }],
      });
    }
    setBattle(null);
    setBattleItemsOpen(false);
  };
  const useBattleConsumable = (itemId, target = "hero") => {
    const cfg = BATTLE_CONSUMABLES[itemId];
    if (
      !battle ||
      battle.turn !== "hero" ||
      battle.finished ||
      !cfg ||
      !hasItem(player, itemId, 1)
    )
      return;
    removeItem(setPlayer, itemId, 1);
    const giveToCompanion = target === "companion" && companion.recruited;
    const companionActsNext =
      companionIsConscious ||
      (giveToCompanion && companion.hp + cfg.heal > 0);
    if (giveToCompanion)
      setCompanion((c) => ({ ...c, hp: Math.min(c.maxHp, c.hp + cfg.heal) }));
    else setPlayer((p) => ({ ...p, hp: Math.min(p.maxHp, p.hp + cfg.heal) }));
    setBattle((prev) =>
      prev
        ? {
            ...prev,
            turn:
              companionActsNext ? "companion" : "enemy",
            log: [
              ...prev.log.slice(-5),
              giveToCompanion
                ? `${player.name} gives ${cfg.name} to ${companion.name}. ${cfg.heal} HP restored.`
                : `${player.name} uses ${cfg.name}. ${cfg.heal} HP restored.`,
            ],
          }
        : prev,
    );
    setBattleItemsOpen(false);
    setTimeout(
      () =>
        companionActsNext
          ? companionTurn(giveToCompanion && !companionIsConscious)
          : enemyTurn(),
      200,
    );
  };

  const equipItemToSlot = (itemId, slot) => {
    const item = ITEM_DB[itemId];
    if (!itemFitsSlot(item, slot)) return;
    const equippedCount = getEquippedCount(player, itemId);
    const available =
      (player.inventory[itemId] || 0) -
      equippedCount +
      (player.equipment[slot] === itemId ? 1 : 0);
    if (available <= 0)
      return setToast(`You don't have an extra ${item.name} available.`);
    setPlayer((p) => ({ ...p, equipment: { ...p.equipment, [slot]: itemId } }));
    setToast(`Equipped ${item.name}.`);
  };
  const equipItem = (itemId) => {
    const item = ITEM_DB[itemId];
    if (!item?.slot) return;
    let slot = item.slot;
    if (item.slot.startsWith("trinket"))
      slot = !player.equipment.trinket1
        ? "trinket1"
        : !player.equipment.trinket2
          ? "trinket2"
          : "trinket1";
    equipItemToSlot(itemId, slot);
  };
  const unequipSlot = (slot) => {
    const name = ITEM_DB[player.equipment[slot]]?.name || "item";
    setPlayer((p) => ({ ...p, equipment: { ...p.equipment, [slot]: null } }));
    setToast(`Removed ${name}.`);
  };
  const useFieldItem = (itemId) => {
    const heal = BATTLE_CONSUMABLES[itemId]?.heal || 0;
    if (!heal || !hasItem(player, itemId)) return;
    removeItem(setPlayer, itemId, 1);
    setPlayer((p) => ({ ...p, hp: Math.min(p.maxHp, p.hp + heal) }));
    setToast(`Used ${ITEM_DB[itemId].name}. HP +${heal}.`);
  };
  const assignBattlePouchItem = (slot, itemId) => {
    if (!BATTLE_CONSUMABLES[itemId]) return;
    setPlayer((p) => {
      const pouch = { ...(p.battlePouch || {}), [slot]: itemId };
      Object.keys(pouch).forEach((k) => {
        if (k !== slot && pouch[k] === itemId) pouch[k] = null;
      });
      return { ...p, battlePouch: pouch };
    });
    setToast(
      `${ITEM_DB[itemId].name} assigned to ${slot === "slot1" ? "Slot 1" : "Slot 2"}.`,
    );
  };
  const craftRecipe = (recipeId) => {
    const recipe = RECIPE_DB[recipeId];
    if (!recipe || !canCraftRecipe(player, recipe)) return;
    (Object.entries(recipe.ingredients) as [string, number][]).forEach(([id, qty]) =>
      removeItem(setPlayer, id, qty),
    );
    gainItem(setPlayer, recipe.resultId, recipe.resultQty);
    setFlags((f) => ({ ...f, craftedPotion: true }));
    if (craftContext === "roadCamp") {
      const resultName = ITEM_DB[recipe.resultId]?.name || recipe.name;
      setDialogue((current) =>
        current?.name === "Road Camp"
          ? {
              ...current,
              feedback: `You craft ${resultName} ×${recipe.resultQty}. It has been added to your pack.`,
            }
          : current,
      );
    }
    announce(`You craft ${recipe.name}.`, [
      { id: recipe.resultId, qty: recipe.resultQty },
    ]);
  };
  const buyItem = (itemId) => {
    const base = getBuyPrice(itemId);
    const isEquipment = !!ITEM_DB[itemId]?.slot;
    const discount =
      shopMode === "smith" &&
      isEquipment &&
      flags.elderGavePurse &&
      !flags.smithStarterDiscountUsed
        ? 4
        : shopMode === "market" && flags.marketDiscount
          ? 2
          : 0;
    const cost = Math.max(1, base - discount);
    if (player.gold < cost) return;
    gainItem(setPlayer, itemId, 1);
    setPlayer((p) => ({ ...p, gold: p.gold - cost }));
    if (shopMode === "smith" && discount)
      setFlags((f) => ({ ...f, smithStarterDiscountUsed: true }));
    setToast(`Bought ${ITEM_DB[itemId].name}.`);
  };
  const sellItem = (itemId) => {
    const sellable =
      (player.inventory[itemId] || 0) - getEquippedCount(player, itemId);
    if (sellable <= 0) return setToast("Unequip it before selling.");
    removeItem(setPlayer, itemId, 1);
    setPlayer((p) => ({ ...p, gold: p.gold + getSellPrice(itemId) }));
  };
  const setActiveCompanion = (id) => {
    const opt = COMPANION_OPTIONS[id];
    const savedCompanion = companionRoster[id];
    setCompanion(
      savedCompanion
        ? { ...normalizeCompanionData(savedCompanion), recruited: true }
        : {
            ...buildDefaultCompanion(),
            recruited: true,
            id,
            name: opt.name,
            hp: opt.maxHp,
            maxHp: opt.maxHp,
            icon: opt.icon,
            role: opt.role,
            style: opt.style,
            futurePathOptions: getCompanionGrowthPreview(id),
          },
    );
    setFlags((f) => ({
      ...f,
      companionChosen: true,
      companionChoice: id,
      [`${id}Status`]: "joined",
    }));
    setToast(`${opt.name} is now traveling with you.`);
  };
  const dismissCompanion = () => {
    const name = companion.name;
    setCompanion(buildDefaultCompanion());
    setFlags((f) => ({ ...f, companionChoice: null }));
    setToast(`${name} waits at the inn.`);
  };
  const runQaChecks = () => {
    const results = runGameQaChecks({
      flags,
      player,
      runtimeChecks: [
        {
          ok: typeof applyLoadedPayload === "function",
          label: "Load handler exists",
          detail: "Regression test: no companionReward reference in load path.",
        },
        {
          ok: typeof movePlayer === "function",
          label: "Keyboard movement can call movePlayer",
          detail: "Regression check for arrow/WASD controls.",
        },
        {
          ok: true,
          label: "Arrow/WASD movement works after clicking menu buttons",
          detail: "Keyboard handler now allows movement keys even when a button still has focus.",
        },
        {
          ok: typeof advanceToNextEnemyOrVictory === "function",
          label: "Battle defeat/victory helper exists",
          detail: "Regression check for defeated enemies not taking ghost turns.",
        },
        {
          ok: typeof buildVisitedMap === "function",
          label: "Dev jump reveal helper exists",
          detail: "Regression test: no revealAround reference.",
        },
        {
          ok: typeof openChapterReportDialogue === "function",
          label: "Chapter 1 report-back scene exists",
          detail: "Post-cellar story resolution is wired to Enna/Hollis.",
        },
        {
          ok: typeof getStoryTile === "function",
          label: "Story tile overrides exist",
          detail: "Traveler tile becomes grass after the traveler goes to camp.",
        },
        {
          ok: true,
          label: "Loot popup auto-dismisses",
          detail: "Loot banners now close after a short delay and can still be clicked away immediately.",
        },
        {
          ok: typeof resolveSkillCheck === "function",
          label: "Skill check helper exists",
          detail: "Dialogue checks can roll 1d20 + stat bonus against a DC.",
        },
        {
          ok: typeof shouldSkipAutoInspect === "function",
          label: "Spent tiles do not auto-interrupt",
          detail: "Previously used cellar clues/caches can be walked over; manual Inspect still works.",
        },
        {
          ok: Array.isArray(HERO_GROWTH_OPTIONS) && HERO_GROWTH_OPTIONS.length >= 5,
          label: "Hero growth options exist",
          detail: "Growth choices are available for protagonist progression.",
        },
      ],
    });
    setQaResults(results);
    setToast(
      `QA checks complete: ${results.filter((r) => !r.ok).length} issue(s) found.`,
    );
  };
  const devJumpTo = (nextRegion) => {
    const target = MAPS[nextRegion];
    if (!target) return;
    previousPositionByRegionRef.current[nextRegion] = undefined;
    setRegion(nextRegion);
    setPosition(target.start);
    revealArea(nextRegion, target.start.x, target.start.y, 2);
    setDialogue(null);
    setBattle(null);
    setInteriorScene(null);
    setShopOpen(false);
    setCraftOpen(false);
    setToast(`Dev jump: ${target.name}.`);
  };
  const devGiveTestSupplies = () => {
    [
      "healing_fizzpop",
      "trail_snack",
      "fizzberry_handpie",
      "bubblecap",
      "moonmint",
    ].forEach((id) => gainItem(setPlayer, id, 3));
    setPlayer((p) => ({ ...p, gold: p.gold + 30 }));
    setToast("Dev supplies added.");
  };
  const devHealParty = () => {
    setPlayer((p) => ({ ...p, hp: p.maxHp }));
    setCompanion((c) => (c.recruited ? { ...c, hp: c.maxHp } : c));
    setToast("Party restored.");
  };
  const devResetCombatFlags = () => {
    setFlags((f) => ({
      ...f,
      beatGateBattle: false,
      reportedSatchelToElder: false,
      clearedWildBattle: false,
      beatCellarSkulk: false,
      beatCellarBoss: false,
      chapterOneClear: false,
    }));
    setToast("Combat flags reset.");
  };

  const openSaveSlotModal = () => {
    setSaveNameDrafts(
      Object.fromEntries(saveSlots.map((s) => [s.id, s.name || ""])),
    );
    setSaveModalMode("save");
  };
  const openLoadSlotModal = () => {
    setSaveNameDrafts(
      Object.fromEntries(saveSlots.map((s) => [s.id, s.name || ""])),
    );
    setSaveModalMode("load");
  };
  const exportSaveToDisk = () => {
    const name = `${player.name} - ${currentRegionInfo.name}`;
    const payload = buildCurrentSavePayload(`Loaded ${name}.`);
    if (!payload) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    const blob = new Blob([serializeDiskSave(name, payload)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = formatDiskSaveFilename(name);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setToast(`Disk save exported: ${link.download}`);
  };
  const importSaveFromDisk = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imported = parseDiskSaveText(await file.text());
      applyLoadedPayload(imported.payload, `Loaded disk save: ${imported.name || file.name}`);
      setSaveModalMode(null);
    } catch (error) {
      setToast(error?.message || "That save file could not be loaded.");
    } finally {
      event.target.value = "";
    }
  };
  const loadCheckedInSave = async (path, missingMessage, fallbackMessage) => {
    try {
      const response = await fetch(path, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error(missingMessage);
      const imported = parseDiskSaveText(await response.text());
      applyLoadedPayload(imported.payload, `Loaded ${imported.name}.`);
      setSaveModalMode(null);
    } catch (error) {
      setToast(error?.message || fallbackMessage);
    }
  };
  const loadChapter2PlaytestSave = () =>
    loadCheckedInSave(
      CHAPTER_2_PLAYTEST_SAVE_PATH,
      "Chapter 2 playtest save is missing.",
      "Chapter 2 playtest save could not be loaded.",
    );
  const loadChapter2CompleteSave = () =>
    loadCheckedInSave(
      CHAPTER_2_COMPLETE_SAVE_PATH,
      "Chapter 2 complete save is missing.",
      "Chapter 2 complete save could not be loaded.",
    );
  const saveToSlot = (slotId) => {
    const name =
      (saveNameDrafts[slotId] || "").trim() ||
      `${player.name} • ${currentRegionInfo.name}`;
    const payload = buildCurrentSavePayload(`Loaded ${name}.`);
    const next = saveSlots.map((slot) =>
      slot.id === slotId
        ? { ...slot, name, updatedAt: Date.now(), payload }
        : slot,
    );
    writeSaveSlotRecords(next);
    setSaveSlots(next);
    setSaveModalMode(null);
    setToast(`Saved to slot ${slotId}: ${name}`);
  };
  const loadFromSlot = (slotId) => {
    const slot = saveSlots.find((s) => s.id === slotId);
    if (!slot?.payload) return;
    applyLoadedPayload(
      slot.payload,
      `Loaded slot ${slot.id}: ${slot.name || "Unnamed Save"}`,
    );
    setSaveModalMode(null);
  };

  if (screen === "title")
    return (
      <div className="storybook-shell min-h-screen p-4 text-white sm:p-6">
        <div className="mx-auto flex min-h-[85vh] max-w-6xl flex-col items-center justify-center gap-6">
          <div className="title-book-page w-full overflow-hidden rounded-[2rem] border border-amber-100/20 px-5 py-6 text-center shadow-2xl sm:px-8 sm:py-8">
            <figure className="title-key-art relative mx-auto mb-7 min-h-64 max-w-4xl overflow-hidden rounded-[1.5rem] border border-amber-100/20">
              <img src={titleKeyArt} alt="Painted map of Hearthhollow beneath the old forest" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
              <figcaption className="absolute bottom-4 left-4 right-4 text-left text-sm text-amber-50/80">Every road begins at somebody's front door.</figcaption>
            </figure>
            <h1 className="text-4xl font-bold sm:text-6xl">
              Lanterns of Briar Crown
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-white/80">
              A funny, heroic fantasy about false roads, brave friends, and finding the truth beneath the thorns.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                className="bg-emerald-500/30"
                onClick={() => setScreen("create")}
              >
                New Adventure
              </Button>
              <Button
                onClick={loadGame}
                disabled={!parseCheckpointPayload()?.player}
              >
                Continue Checkpoint
              </Button>
              <Button
                onClick={openLoadSlotModal}
              >
                Load Save Slot
              </Button>
              <Button onClick={loadChapter2PlaytestSave}>
                Begin Chapter 2 Playtest
              </Button>
              <Button onClick={loadChapter2CompleteSave}>
                Begin Chapter 3 Playtest
              </Button>
            </div>
          </div>
        </div>
        {saveModalMode ? (
          <SaveModal
            mode={saveModalMode}
            slots={saveSlots}
            drafts={saveNameDrafts}
            setDrafts={setSaveNameDrafts}
            close={() => setSaveModalMode(null)}
            save={saveToSlot}
            load={loadFromSlot}
            exportToDisk={player ? exportSaveToDisk : null}
            importFromDisk={importSaveFromDisk}
            loadChapter2PlaytestSave={loadChapter2PlaytestSave}
            loadChapter2CompleteSave={loadChapter2CompleteSave}
            loadCheckpoint={() => {
              loadGame();
              setSaveModalMode(null);
            }}
          />
        ) : null}
      </div>
    );

  if (screen === "create") {
    const selectedRace =
      RACES.find((r) => r.id === createForm.raceId) || RACES[0];
    const selectedHumanHeritage = getHumanHeritage(createForm.humanHeritageId);
    const selectedAncestryLabel =
      selectedRace.id === "human"
        ? `${selectedHumanHeritage.name} Human`
        : selectedRace.name;
    const previewStats = addBonuses(BASE_STATS, selectedRace.bonuses);
    return (
      <div className="storybook-shell min-h-screen p-4 text-white sm:p-6">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Panel
            title="Create Your Hero"
            right={<Button onClick={() => setScreen("title")}>Back</Button>}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm">
                <div className="mb-1 text-white/70">Name</div>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </label>
              <label className="text-sm">
                <div className="mb-1 text-white/70">Gender</div>
                <select
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
                  value={createForm.gender}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, gender: e.target.value }))
                  }
                >
                  {GENDERS.map((g) => (
                    <option key={g} value={g} className="bg-slate-900">
                      {g}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {RACES.map((r) => (
                <button
                  key={r.id}
                  onClick={() =>
                    setCreateForm((p) => ({
                      ...p,
                      raceId: r.id,
                      humanHeritageId:
                        p.humanHeritageId || DEFAULT_HUMAN_HERITAGE_ID,
                    }))
                  }
                  className={`rounded-2xl border p-3 text-left ${createForm.raceId === r.id ? "border-emerald-400 bg-emerald-500/15" : "border-white/10 bg-white/5"}`}
                >
                  <div className="font-semibold">{r.name}</div>
                  <div className="mt-1 text-xs text-white/70">
                    Trait: {r.trait}
                  </div>
                  <div className="mt-2 text-xs text-white/80">
                    {r.description}
                  </div>
                </button>
              ))}
            </div>
            {selectedRace.id === "human" ? (
              <div className="mt-5">
                <div className="mb-2 text-sm font-semibold text-amber-200">
                  Human Heritage
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {HUMAN_HERITAGES.map((heritage) => (
                    <button
                      key={heritage.id}
                      onClick={() =>
                        setCreateForm((p) => ({
                          ...p,
                          humanHeritageId: heritage.id,
                        }))
                      }
                      className={`rounded-2xl border p-3 text-left ${createForm.humanHeritageId === heritage.id ? "border-amber-300 bg-amber-400/15" : "border-white/10 bg-white/5"}`}
                    >
                      <div className="font-semibold">{heritage.name}</div>
                      <div className="mt-2 text-xs text-white/80">
                        {heritage.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <Button className="mt-6 bg-emerald-500/30" onClick={startGame}>
              Begin Chapter 1
            </Button>
          </Panel>
          <Panel title="Preview">
            <div className="text-center">
              <HeroArtwork
                raceId={createForm.raceId}
                gender={createForm.gender}
                humanHeritageId={createForm.humanHeritageId}
                name={createForm.name || "Liam"}
                variant="full"
                className="mx-auto min-h-[24rem] w-full max-w-sm"
              />
              <div className="mt-3 text-2xl font-bold">
                {createForm.name || "Liam"}
              </div>
              <div className="text-white/70">
                {selectedAncestryLabel} • {createForm.gender}
              </div>
              <div className="mt-2 text-emerald-300">
                Trait: {selectedRace.trait}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {STAT_ORDER.map((stat) => (
                <StatBadge
                  key={stat}
                  label={stat}
                  value={previewStats[stat]}
                  bonus={selectedRace.bonuses[stat] || 0}
                />
              ))}
            </div>
          </Panel>
        </div>
      </div>
    );
  }

  const exploredMap = visited[region] || {};
  const activeShop =
    shopMode === "market"
      ? { title: "Willow Market", inventory: SHOP_INVENTORIES.market }
      : { title: "Smith Orin's Shop", inventory: SHOP_INVENTORIES.smith };
  const mapBackgroundImage =
    region === "rootCellar" &&
    flags.beatCellarBoss &&
    "completedBackgroundImage" in currentRegionInfo
      ? currentRegionInfo.completedBackgroundImage
      : region === "westrootHub" &&
          flags.witnessStoneSequenceSolved &&
          "restoredBackgroundImage" in currentRegionInfo
        ? currentRegionInfo.restoredBackgroundImage
        : currentRegionInfo.backgroundImage;
  const crownDenAlertLevel = Math.min(
    4,
    Math.max(0, Number(flags.crownDenAlertLevel || 0)),
  );
  const showCrownDenTension =
    region === "crownDoorDen" &&
    crownDenAlertLevel > 0 &&
    !flags.crownDoorDungeonCleared &&
    !flags.crownDenPatrolDefeated &&
    !flags.crownDenPatrolEscaped;

  return (
    <div className="storybook-shell min-h-screen p-3 pb-28 text-white sm:p-5 lg:pb-5">
      <div className="mx-auto max-w-[96rem]">
        <div className="relative mb-3 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold sm:text-3xl">Lanterns of Briar Crown</h1>
            <div className="mt-0.5 text-xs text-white/65 sm:mt-1 sm:text-sm">
              <span className="sm:hidden">{currentRegionInfo.name}</span>
              <span className="hidden sm:inline">Prototype slice • {currentRegionInfo.name} • {currentRegionInfo.subtitle}</span>
            </div>
          </div>
          <div className="hidden flex-wrap gap-2 sm:flex">
            <Button onClick={openSaveSlotModal}>Save Slot</Button>
            <Button onClick={openLoadSlotModal}>Load Slot</Button>
            <Button onClick={loadGame}>Load Checkpoint</Button>
            <Button onClick={() => setScreen("title")}>Title</Button>
          </div>
          <details className="game-actions-menu sm:hidden">
            <summary className="storybook-button rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white">
              Game
            </summary>
            <div className="absolute right-0 top-[calc(100%+0.4rem)] z-30 grid w-48 gap-2 rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl">
              <Button onClick={openSaveSlotModal}>Save Slot</Button>
              <Button onClick={openLoadSlotModal}>Load Slot</Button>
              <Button onClick={loadGame}>Load Checkpoint</Button>
              <Button onClick={() => setScreen("title")}>Title</Button>
            </div>
          </details>
        </div>
        {showCrownDenTension ? (
          <CrownDenTension
            level={crownDenAlertLevel}
            text={getCrownDenAlertText(crownDenAlertLevel)}
          />
        ) : null}
        {flags.chapterOneClear ? (
          <div className="mb-3 rounded-3xl border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm">
            <div className="font-semibold text-emerald-200">
              {chapterProgress.currentChapterId >= 2
                ? flags.chapterThreeClear
                  ? "Chapter 3 complete: The Hidden Root"
                  : chapterProgress.currentChapterId >= 3
                    ? "Chapter 3: The Hidden Root"
                    : flags.chapterTwoClear
                      ? "Chapter 2 complete: The Westroot Trail"
                      : "Chapter 2: The Westroot Trail"
                : flags.chapterReported
                  ? "Chapter 1 complete: The Road That Lied"
                  : "Root Cellar discovery complete"}
            </div>
            <div className="mt-0.5 hidden sm:block">
              {chapterProgress.currentChapterId >= 2
                ? flags.chapterThreeClear
                  ? flags.rootbreadPromiseKept
                    ? "The current playable story ends here. Westroot now points toward Chapter 4 and the deeper western road."
                    : flags.rootbreadLeadLearned
                      ? "The main story ends here for now. Lume's Transfer Checkpoint lead remains open in Westroot."
                      : flags.metAuntieLume
                        ? "The main story ends here for now. Lume may still know whether anyone saw a sign of Lio."
                        : "The main story ends here for now. The Mossback baker in Rootmarket may still have heard something about Lio."
                  : chapterProgress.currentChapterId >= 3
                    ? "Earn Westroot's trust, renew the road promises, and expose the false cargo route."
                    : flags.chapterTwoClear
                      ? "Lio is alive past the First Westroot Gate. The hidden road is ready to continue."
                      : "Follow Westroot, clear the false roadwork, and open the old way beneath the hill."
                : flags.chapterReported
                  ? "Bramblecross understands the shape of the threat. Westroot is the next lead."
                  : "You found the deeper route. Bring what you discovered back to Hollis and Enna."}
            </div>
          </div>
        ) : null}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_19rem] xl:grid-cols-[minmax(0,1fr)_20rem]">
          <Panel
            title={currentRegionInfo.name}
            right={
              <div className="hidden max-w-[24rem] truncate text-right text-xs text-white/60 sm:block">
                Goal: {questJournal.currentMain.title}
              </div>
            }
          >
            <div className="map-stage-shell">
              <MapStage
                region={region}
                map={currentMap}
                backgroundImage={mapBackgroundImage}
                position={position}
                player={player}
                exploredMap={exploredMap}
                getStoryTile={getStoryTile}
                getTokenState={getMapTokenState}
                npcTokens={
                  region === "westrootHub"
                    ? getWestrootMapNpcTokens(flags)
                    : []
                }
                onNodeClick={handleMapNodeClick}
                debug={mapDebug}
                fogComplete={
                  (region === "rootCellar" && !!flags.chapterOneClear) ||
                  (region === "crownDoorDen" && !!flags.crownDoorDungeonCleared)
                }
              />
              <div
                data-testid="map-status-overlay"
                className="map-status-overlay"
                role="status"
                aria-live="polite"
              >
                <span className="map-status-label">Latest update</span>
                <span className="map-status-message">
                  {toast || `You are standing on: ${currentTileLabel}.`}
                </span>
              </div>
              <div className="map-movement-overlay" aria-label="Map movement controls">
                <div className="map-movement-controls">
                  <Button aria-label="Move up" data-testid="move-up" onClick={() => movePlayer(0, -1)}>↑</Button>
                  <Button aria-label="Move left" data-testid="move-left" onClick={() => movePlayer(-1, 0)}>←</Button>
                  <Button className="map-inspect-button" onClick={() => inspectTile(currentTile)}>Inspect</Button>
                  <Button aria-label="Move right" data-testid="move-right" onClick={() => movePlayer(1, 0)}>→</Button>
                  <Button aria-label="Move down" data-testid="move-down" onClick={() => movePlayer(0, 1)}>↓</Button>
                </div>
              </div>
            </div>
          </Panel>
          <AdventureStatusRail
            player={player}
            ancestryLabel={playerAncestryLabel}
            raceTrait={race.trait}
            heroXpTarget={heroXpTarget}
            questJournal={questJournal}
            companion={companion}
            derivedStats={derivedStats}
            openWorkspace={() => setAdventureMenuOpen(true)}
            openCharacter={() => {
              setTab("character");
              setAdventureMenuOpen(true);
            }}
          />
        </div>
      </div>

      <MobileAdventureBar
        player={player}
        objective={questJournal.currentMain.title}
        openWorkspace={() => setAdventureMenuOpen(true)}
      />

      <AdventureWorkspace
        open={adventureMenuOpen}
        tab={tab}
        setTab={setTab}
        close={() => setAdventureMenuOpen(false)}
        companion={companion}
      >
        <Suspense
          fallback={
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70" role="status">
              Opening adventure menu…
            </div>
          }
        >
          {tab === "character" ? (
            <CharacterWorkspace
              player={player}
              ancestryLabel={playerAncestryLabel}
              raceTrait={race.trait}
              heroXpTarget={heroXpTarget}
              questJournal={questJournal}
              derivedStats={derivedStats}
              statOrder={STAT_ORDER}
            />
          ) : null}
          {tab === "quests" ? <QuestTab journal={questJournal} /> : null}
          {tab === "inventory" ? (
            <InventoryTab
              sections={inventorySections}
              player={player}
              equipItem={equipItem}
              setTab={setTab}
              setEquipmentFocusSlot={setEquipmentFocusSlot}
              setPouchFocusSlot={setPouchFocusSlot}
              useFieldItem={useFieldItem}
            />
          ) : null}
          {tab === "equipment" ? (
            <EquipmentTab
              player={player}
              focusSlot={equipmentFocusSlot}
              setFocusSlot={setEquipmentFocusSlot}
              equipItemToSlot={equipItemToSlot}
              unequipSlot={unequipSlot}
            />
          ) : null}
          {tab === "pouch" ? (
            <PouchTab
              player={player}
              focusSlot={pouchFocusSlot}
              setFocusSlot={setPouchFocusSlot}
              assign={assignBattlePouchItem}
              clear={(slot) =>
                setPlayer((p) => ({
                  ...p,
                  battlePouch: { ...p.battlePouch, [slot]: null },
                }))
              }
            />
          ) : null}
          {tab === "companion" ? (
            <CompanionTab
              companion={companion}
              setCompanion={setCompanion}
              flags={flags}
              dismiss={dismissCompanion}
            />
          ) : null}
          {tab === "crafting" ? <RecipesTab player={player} /> : null}
          {tab === "dev" ? (
            <DevTab
              qaResults={qaResults}
              runQaChecks={runQaChecks}
              giveSupplies={devGiveTestSupplies}
              heal={devHealParty}
              reset={devResetCombatFlags}
              startTestBattle={() =>
                startBattle(
                  buildEncounterEnemies("roadwatcherHard"),
                  "roadwatcherHard",
                )
              }
              jump={(destination) => {
                devJumpTo(destination);
                setAdventureMenuOpen(false);
              }}
              player={player}
              position={position}
              region={region}
              companion={companion}
              mapDebug={mapDebug}
              setMapDebug={setMapDebug}
            />
          ) : null}
        </Suspense>
      </AdventureWorkspace>

      <Suspense
        fallback={
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" role="status">
            <div className="rounded-3xl border border-white/10 bg-slate-900 px-6 py-4 text-sm text-white/80 shadow-2xl">
              Opening scene…
            </div>
          </div>
        }
      >
      {saveModalMode ? (
        <SaveModal
          mode={saveModalMode}
          slots={saveSlots}
          drafts={saveNameDrafts}
          setDrafts={setSaveNameDrafts}
          close={() => setSaveModalMode(null)}
          save={saveToSlot}
          load={loadFromSlot}
          exportToDisk={exportSaveToDisk}
          importFromDisk={importSaveFromDisk}
          loadChapter2PlaytestSave={loadChapter2PlaytestSave}
          loadChapter2CompleteSave={loadChapter2CompleteSave}
          loadCheckpoint={() => {
            loadGame();
            setSaveModalMode(null);
          }}
        />
      ) : null}
      {levelUpPending ? (
        <LevelUpModal
          player={player}
          target={levelUpPending.target}
          choose={chooseHeroGrowth}
        />
      ) : null}
      {dialogue && !craftOpen ? (
        <DialogueModal dialogue={dialogue} close={() => setDialogue(null)} />
      ) : null}
      {interiorScene ? (
        <InteriorModal
          scene={interiorScene}
          close={() => setInteriorScene(null)}
          flags={flags}
          setFlags={setFlags}
          player={player}
          setPlayer={setPlayer}
          companion={companion}
          setCompanion={setCompanion}
          setActiveCompanion={setActiveCompanion}
          dismissCompanion={dismissCompanion}
          saveGame={saveGame}
          announce={announce}
          setShopOpen={setShopOpen}
          setCraftOpen={setCraftOpen}
          setDialogue={setDialogue}
          openClerkDialogue={openClerkDialogue}
          openCaptainDialogue={openCaptainDialogue}
          openChapter2Briefing={openChapter2Briefing}
          openMaraChapter2Dialogue={openMaraChapter2Dialogue}
          openEddenRecoveryDialogue={openEddenRecoveryDialogue}
        />
      ) : null}
      {shopOpen ? (
        <ShopModal
          shop={activeShop}
          player={player}
          close={() => setShopOpen(false)}
          buyItem={buyItem}
          sellItem={sellItem}
          shopMode={shopMode}
          flags={flags}
        />
      ) : null}
      {craftOpen ? (
        <CraftModal
          player={player}
          close={() => setCraftOpen(false)}
          craftRecipe={craftRecipe}
          context={craftContext}
        />
      ) : null}
      {lootBanner ? (
        <button
          type="button"
          onClick={() => setLootBanner(null)}
          className="fixed right-4 top-24 z-40 w-[22rem] max-w-[calc(100vw-2rem)] rounded-3xl border border-emerald-300/20 bg-slate-900/95 p-4 text-left shadow-2xl"
        >
          <div className="text-sm font-semibold text-emerald-300">
            Loot found
          </div>
          <div className="mt-1 text-sm text-white/80">{lootBanner.message}</div>
          <div className="mt-3 grid gap-2">
            {lootBanner.loot.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2 text-sm"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <ItemIcon item={ITEM_DB[entry.id]} size="sm" />
                  <span>{ITEM_DB[entry.id]?.name || entry.id}</span>
                </div>
                <div className="text-emerald-300">+{entry.qty}</div>
              </div>
            ))}
          </div>
        </button>
      ) : null}
      {battle ? (
        <BattleModal
          battle={battle}
          player={player}
          companion={companion}
          heroSkills={heroSkills}
          heroAttack={heroAttack}
          selectTarget={selectBattleTarget}
          finishBattle={finishBattle}
          battleItemsOpen={battleItemsOpen}
          setBattleItemsOpen={setBattleItemsOpen}
          useBattleConsumable={useBattleConsumable}
        />
      ) : null}
      </Suspense>
    </div>
  );
}
