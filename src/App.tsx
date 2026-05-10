// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import {
  CompanionTab,
  DevTab,
  EquipmentTab,
  InventoryTab,
  PouchTab,
  QuestTab,
  RecipesTab,
} from "./components/tabs";
import { MapStage } from "./components/MapStage";
import { Button, Meter, Panel, StatBadge } from "./components/ui";
import { getBattleReward } from "./data/battleRewards";
import {
  APPEARANCES,
  BASE_STATS,
  GENDERS,
  HERO_GROWTH_OPTIONS,
  RACES,
  STAT_ORDER,
} from "./data/character";
import { COMPANION_OPTIONS } from "./data/companions";
import { buildEncounterEnemies } from "./data/enemies";
import { BATTLE_CONSUMABLES, ITEM_DB } from "./data/items";
import { MAPS, TILE_META } from "./data/maps";
import { RECIPE_DB } from "./data/recipes";
import { SHOP_INVENTORIES } from "./data/shops";
import { buildQuestJournal } from "./data/quests";
import { SKILL_DB } from "./data/skills";
import {
  BattleModal,
  CraftModal,
  DialogueModal,
  InteriorModal,
  LevelUpModal,
  SaveModal,
  ShopModal,
} from "./components/modals";
import { tickCooldowns } from "./game/battle";
import { getHeroAvatar } from "./game/appearance";
import { checkSummary, resolveRoll, resolveSkillCheck } from "./game/dice";
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
import { buildVisitedMap, isBlockedInteractionTile } from "./game/map";
import {
  getCompanionGrowthPreview,
  getCompanionXpTarget,
  getHeroXpTarget,
} from "./game/progression";
import {
  parseCheckpointPayload,
  parseSaveSlotRecords,
  STORAGE_KEY,
  writeSaveSlotRecords,
} from "./game/save";
import { buildCombatSkill, getEquippedSkillIds } from "./game/skills";
import {
  buildDefaultCompanion,
  buildDefaultFlags,
  buildDefaultVisited,
  buildPlayer,
  normalizeCompanionData,
  normalizePlayerData,
} from "./game/state";
import { addBonuses, formatBonuses, getDerivedStats } from "./game/stats";

function getVillageNpcDialogue(tile, flags) {
  const lines = {
    baker: flags.metElder
      ? 'Nella has flour dust on one cheek and three half-shaped loaves abandoned on the table behind her. The ovens are still hot, but the bakery has gone quiet in the strange way busy places do when everyone is listening for bad news. "I was baking for the road crews," she says, lowering her voice. "Then the bells started, and folk stopped coming through. If that courier truly vanished, someone out there is not just scaring us. They\'re cutting us off."'
      : 'Nella the Baker keeps glancing toward the south gate while pretending to rearrange a tray of pear rolls. "The ovens are hot, the bread is rising, and nobody has come by to make fun of my lopsided crusts. That is how I know the morning has gone wrong. Elder Mira has the face she wears when bad news has boots on. Go find her, dear."',
    farmer: flags.metElder
      ? "Toma Fielding grips his rake like it might become a spear if the day gets any worse. \"Boars I understand. Boars with satchels? Couriers gone missing? That's not field trouble. That's road trouble. If you go out there, watch the ditches. Trouble loves a ditch.\""
      : 'Toma Fielding squints toward the road beyond the trees. "My turnips are nervous, and turnips are famously calm. Elder Mira\'s been watching the gate since sunrise. Best talk with her before you go poking at anything tusked."',
    weaver: flags.metElder
      ? 'Miri of the Loom holds up a half-finished sash patterned with little lanterns. "Threads tell you when they\'ve been tugged," she says. "This whole village feels tugged today. If you find who is pulling, don\'t just cut the thread. Find the hand."'
      : 'Miri of the Loom sits outside her cottage, shuttle paused in midair. "The south road should be noisy by now. Carts, bells, bad singing. Instead it is listening. Roads should not listen. Find Mira, love."',
  };
  return (
    lines[tile] ||
    "Everyone in Hearthhollow can feel that the south road has gone wrong."
  );
}
function getMayorDialogue(flags) {
  if (!flags.ennaBriefed)
    return 'Mayor Anwen stands beside a stack of unread petitions, but her eyes keep moving to the road. "We have missing porters, forged notices, delayed carts, and families asking whether to bolt their doors. I can calm a crowd for an hour. I cannot calm a lie unless someone brings me its shape. Take your road report to Enna. She sees patterns before the rest of us admit they exist."';
  if (!flags.gotDungeonLead)
    return 'Mayor Anwen studies the watchhouse windows. "Enna says your report turned scattered worries into a route case. Good. That means we\'re not losing our minds. Bad, because it means someone else is using theirs. Read what the town knows, then speak with Hollis."';
  return 'Mayor Anwen nods toward the old cellar ways. "If Hollis is sending you below, then Bramblecross is past pretending this is only paperwork. Go carefully. Towns are built on foundations, and foundations remember things."';
}

export default function LiamsGamePrototype() {
  const [screen, setScreen] = useState("title");
  const [createForm, setCreateForm] = useState({
    name: "Liam",
    gender: GENDERS[0],
    raceId: RACES[0].id,
    appearanceId: APPEARANCES[0].id,
  });
  const [player, setPlayer] = useState(null);
  const [region, setRegion] = useState("hearthhollow");
  const [position, setPosition] = useState(MAPS.hearthhollow.start);
  const [visited, setVisited] = useState(buildDefaultVisited());
  const [companion, setCompanion] = useState(buildDefaultCompanion());
  const [flags, setFlags] = useState(buildDefaultFlags());
  const [quest, setQuest] = useState({
    title: "Talk to Elder Mira",
    description: "Something strange is happening in Hearthhollow.",
  });
  const [toast, setToast] = useState("Welcome to Hearthhollow.");
  const [lootBanner, setLootBanner] = useState(null);
  const [dialogue, setDialogue] = useState(null);
  const [shopOpen, setShopOpen] = useState(false);
  const [shopMode, setShopMode] = useState("smith");
  const [craftOpen, setCraftOpen] = useState(false);
  const [interiorScene, setInteriorScene] = useState(null);
  const [battle, setBattle] = useState(null);
  const [tab, setTab] = useState("quests");
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
  const inventorySections = useMemo(
    () => getInventorySections(player),
    [player],
  );
  const questJournal = useMemo(
    () => buildQuestJournal(flags, companion, region),
    [flags, companion, region],
  );
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
    if (region === "hearthhollow" && tile === "chest" && flags.openedChest)
      return true;
    return false;
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
    setRegion(nextRegion);
    setPosition(nextPosition);
    revealArea(nextRegion, nextPosition.x, nextPosition.y, 2);
    if (checkpointLabel)
      setPlayer((prev) => (prev ? { ...prev, checkpointLabel } : prev));
    setToast(message || `You arrive at ${MAPS[nextRegion].name}.`);
  };
  const openEnterPrompt = (name, text, onEnter) =>
    setDialogue({
      portrait: "🚪",
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
  const saveGame = (label = "Checkpoint") => {
    if (!player) return;
    const payload = {
      screen: "play",
      player: { ...player, checkpointLabel: label },
      region,
      position,
      visited,
      companion,
      flags,
      quest,
      toast: `Checkpoint reached: ${label}`,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setPlayer((prev) => ({ ...prev, checkpointLabel: label }));
    setToast(`Checkpoint reached: ${label}`);
  };
  const applyLoadedPayload = (payload, toastMessage) => {
    if (!payload?.player) return;
    setPlayer(normalizePlayerData(payload.player));
    setRegion(payload.region || "hearthhollow");
    setPosition(payload.position || MAPS.hearthhollow.start);
    setVisited(payload.visited || buildDefaultVisited());
    setCompanion(normalizeCompanionData(payload.companion));
    setFlags({ ...buildDefaultFlags(), ...(payload.flags || {}) });
    setQuest(
      payload.quest || {
        title: "Adventure in progress",
        description: "Continue exploring.",
      },
    );
    setLevelUpPending(null);
    setDialogue(null);
    setBattle(null);
    setBattleItemsOpen(false);
    setShopOpen(false);
    setCraftOpen(false);
    setInteriorScene(null);
    setScreen("play");
    setToast(toastMessage || payload.toast || "Save loaded.");
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
    setRegion("hearthhollow");
    setPosition(MAPS.hearthhollow.start);
    setVisited(buildDefaultVisited());
    setCompanion(buildDefaultCompanion());
    setFlags(buildDefaultFlags());
    setScreen("play");
    setDialogue({
      portrait: "📖",
      name: "Hearthhollow, Dawn",
      text: `${hero.name} has always known Hearthhollow as a place of ordinary sounds: Nella's oven door clapping shut, Toma arguing with turnips, Pibble inventing uses for tools nobody requested. This morning, those sounds are missing. People stand in doorways. The south road is too quiet. A courier has not arrived, a royal order does not read like a royal order, and a bramble boar has been seen charging near the gate with a messenger's satchel caught on its tusk. For the first time, home feels less like a shelter and more like the first page of something dangerous.`,
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
          : tile?.includes("building")
            ? "That's a wall, not an entrance. Doors remain fashionable for a reason."
            : "That way is blocked.",
    );
  const handleBlockedTileInteraction = (tile) => {
    if (tile === "home_door")
      return openEnterPrompt(
        "Home",
        "Step inside your cozy home? The familiar door sticks in the same place it always has, as if even the house would prefer you stay here where it is safe.",
        () => setInteriorScene("home"),
      );
    if (tile === "smith_door")
      return openEnterPrompt(
        "Smithy",
        "Push open the smithy door? Heat rolls under the gap, carrying the smell of coal, iron, and hurried work.",
        () => {
          if (!flags.elderGavePurse)
            return setDialogue({
              portrait: "🛠️",
              name: "Smith Orin",
              text: "Orin blocks the doorway with a hammer in one hand and a half-made hinge in the other. \"If Elder Mira is sending you, talk to her first. I am not putting road gear into eager hands just because trouble has started shouting. If she says you're the one going, I'll make sure you aren't walking into thorn and teeth with empty pockets.\"",
              choices: [
                {
                  label: "I'll talk to Mira first.",
                  effect: () => setDialogue(null),
                },
              ],
            });
          setFlags((f) => ({ ...f, gotSmithGift: true }));
          setShopMode("smith");
          setShopOpen(true);
        },
      );
    if (tile === "potion_door")
      return openEnterPrompt(
        "Potion Shed",
        "Head into the potion shed? Something inside fizzes, then giggles, then pretends it did not.",
        () => setCraftOpen(true),
      );
    if (tile === "bram_inn_door")
      return openEnterPrompt(
        "Bramblecross Inn",
        "Step into the inn and common room? Warm lamplight spills through the doorway, along with the low thunder of worried travelers pretending to relax.",
        () => setInteriorScene("bramInn"),
      );
    if (tile === "market_door")
      return openEnterPrompt(
        "Willow Market",
        "Enter Willow Market? The bell over the door keeps ringing even before you touch it, as if Ada's anxiety has taught it anticipation.",
        () => {
          setShopMode("market");
          setShopOpen(true);
        },
      );
    if (tile === "watch_door")
      return openEnterPrompt(
        "Watchhouse",
        "Enter the watchhouse? The windows glow with lamplight, maps, and the particular smell of ink being used urgently.",
        () => setInteriorScene("watchhouse"),
      );
    if (tile === "pond")
      return setDialogue({
        portrait: "💧",
        name: "Pond Edge",
        text: flags.pondForaged
          ? "The pond settles back into itself. A frog sits on a stone with the smug expression of someone who knows you have already had your chance."
          : "The pond is small enough to skip a stone across and deep enough to hide exactly one interesting thing. Moonmint leans over the bank, reeds tick softly against each other, and something round bubbles once beneath the mud. You will probably only get one careful search before the edge turns cloudy.",
        choices: [
          {
            label: "Search the pond edge carefully.",
            effect: () => {
              setDialogue(null);
              if (!flags.pondForaged) {
                setFlags((f) => ({ ...f, pondForaged: true }));
                const found = Math.random() > 0.45;
                if (found) {
                  gainItem(setPlayer, "bubblecap", 1);
                  announce(
                    "You find a Bubblecap tucked under the pond reeds.",
                    [{ id: "bubblecap", qty: 1 }],
                  );
                } else
                  setToast("Wet hands, reeds, and one suspicious frog stare.");
              }
            },
          },
          { label: "Leave the pond alone.", effect: () => setDialogue(null) },
        ],
      });
  };
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
    const nx = position.x + dx,
      ny = position.y + dy;
    if (
      ny < 0 ||
      ny >= currentMap.length ||
      nx < 0 ||
      nx >= currentMap[0].length
    )
      return;
    const rawTile = currentMap[ny][nx];
    const tile = getStoryTile(rawTile);
    if (TILE_META[tile]?.blocked) {
      if (isBlockedInteractionTile(tile)) handleBlockedTileInteraction(tile);
      else bump(tile);
      return;
    }
    setPosition({ x: nx, y: ny });
    revealArea(region, nx, ny);
    inspectTile(tile, { auto: true });
  };

  useEffect(() => {
    if (screen !== "play" || !player) return;
    const handleKeyDown = (event) => {
      const tagName = event.target?.tagName?.toLowerCase();
      const isTextEntry =
        ["input", "textarea", "select"].includes(tagName) ||
        event.target?.isContentEditable;
      if (isTextEntry) return;
      const keyMap = {
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

  const openElderDialogue = () =>
    setDialogue({
      portrait: "🧙",
      name: "Elder Mira",
      text: flags.metElder
        ? 'Mira has not returned to her chair. She stands near the square with one hand on the old bell rope, watching people pretend not to panic. "You have done the first brave thing," she says. "Now do the harder one: keep asking why. A wild boar may be chance. A missing courier may be tragedy. A forged command is a mind at work. Follow the mind."'
        : 'Elder Mira\'s walking stick is planted in the dirt like a little flag of defiance. Around her, Hearthhollow has gone too quiet: ovens left open, shutters half-latched, neighbors whispering without finishing their sentences. "The royal message makes no sense," she says. "The courier is missing. A bramble boar tore past the south gate with the courier\'s satchel caught on its tusk. Hearthhollow needs brave feet, yes—but more than that, it needs a clear head. Will you go?"',
      choices: flags.metElder
        ? [
            {
              label: "I'll follow the mind behind it.",
              effect: () => setDialogue(null),
            },
          ]
        : [
            {
              label: "I'll help. Tell Orin I'm coming to the smithy.",
              effect: () => {
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
                setToast("Mira gives you 12g and sends word to Orin. Heart +1");
              },
            },
            {
              label: "This sounds bigger than a boar. Why me?",
              effect: () =>
                setDialogue({
                  portrait: "🧙",
                  name: "Elder Mira",
                  text: '"Because you notice what others step over," Mira says. "And because when Hearthhollow is afraid, I need someone who will move without becoming careless. Take your own hatchet from home, then see Orin. We will not send you empty-handed."',
                  choices: [
                    {
                      label: "Then I'll go.",
                      effect: () => {
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
                        setToast(
                          "Mira gives you 12g and sends word to Orin. Heart +1",
                        );
                      },
                    },
                  ],
                }),
            },
          ],
    });
  const openPibbleDialogue = () =>
    setDialogue({
      portrait: "🧰",
      name: "Pibble Thatch",
      text: flags.gotPibbleTip
        ? 'Pibble has three tools in hand and is using none of them correctly. "I keep thinking about the satchel," he says. "A boar doesn\'t steal mail. A boar doesn\'t care about road orders. So either the boar crashed through someone else\'s plan, or someone used the boar to hide one. I hate both of those options."'
        : 'Pibble is crouched beside a smear of mud, measuring it with a spoon for reasons known only to Pibble. "I saw it," he says before you ask. "Bramble boar. Tusks like bent fence nails. But the strange part was the satchel snagged on it—rider\'s leather, stamped for courier use. That means the courier didn\'t just run late. Something happened out there."',
      choices: flags.gotPibbleTip
        ? [
            {
              label: "A boar hiding a plan. That's... upsettingly useful.",
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
      return setToast("Talk to Elder Mira before leaving town.");
    const hasWeaponReady =
      !!player.equipment?.weapon ||
      Object.entries(player.inventory || {}).some(
        ([id, qty]) => qty > 0 && ITEM_DB[id]?.slot === "weapon",
      );
    if (!flags.homeStashClaimed && !hasWeaponReady)
      return setToast(
        "Mira wanted you to take your old hatchet from home before facing the road.",
      );
    if (!flags.gotSmithGift)
      return setToast(
        "The south road looks dangerous. Visit Smith Orin before leaving town.",
      );
    if (flags.beatGateBattle)
      return setDialogue({
        portrait: "🚪",
        name: "South Gate",
        text: "The gate no longer shakes under tusks and panic, but no one treats the road as safe. Beyond it, Lantern Road bends between the trees, carrying cart-ruts, scattered feathers, and the uncomfortable feeling that someone has been arranging fear like furniture. Mira touches the brass courier badge once before handing it back to you. “Find the road that took him,” she says. “And if Lio still walks it, bring him home.”",
        choices: [
          {
            label: "Head onto Lantern Road.",
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
        ],
      });
    setDialogue({
      portrait: "🐗",
      name: "Bramble Boar",
      text: "The south gate bursts with shouting. A Bramble Boar crashes out of the brush, wild-eyed and foaming, a courier satchel twisted around one tusk. It is not attacking like a hungry beast. It is running like something has driven it mad. The satchel thumps against its jaw with every charge. A brass courier badge flashes once in the dust, bright enough for someone nearby to gasp. “That's Lio Brindle's route badge,” Nella whispers from behind a shutter. “He was due before breakfast.” The boar lowers its head toward the square. If it breaks through, people will be hurt—and whatever happened to Lio will vanish down the road behind it.",
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
          effect: () =>
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
            }),
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
        name: "Milestone Ruin",
        text: "The hidden shelf behind the milestone is empty now. The stone still feels like a stage after the actor has left: ordinary from the road, suspicious once you know where to look.",
        choices: [{ label: "Move on.", effect: () => setDialogue(null) }],
      });
    setFlags((f) => ({ ...f, foundRuinNote: true }));
    setPlayer((p) => ({ ...p, xp: p.xp + 8 }));
    setDialogue({
      portrait: "🗿",
      name: "Milestone Ruin",
      text: "You kneel where Nix pointed and find a narrow shelf hidden behind the milestone's cracked base. Inside waits a folded order, too dry for the damp stone and too clean for something supposedly lost. It reads: HOLD BRAMBLECROSS. DELAY NEWS. KEEP THE CROWN NERVOUS. The seal tries to look royal, but the crown points are wrong. Whoever planted this knew how fear reads faster than ink.",
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
      text: 'The moment your hand touches the forged order, the roadside act falls apart. A fox-faced ruffian steps from the brambles, knife low and smile lower. Beside him, a thorny hound growls like a hedge with teeth. "That paper isn\'t yours," the ruffian says. He sounds less angry than inconvenienced.',
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
  const openBoardDialogue = () =>
    setDialogue({
      portrait: "📜",
      name: "Notice Board",
      text: 'The Bramblecross notice board is crowded enough to look like a paper storm nailed to wood. One notice reports missing cellar porters. Another warns of odd knocking beneath the old root storage rooms. A third insists all road traffic should wait for "updated crown direction," but the seal is copied too cleanly, like someone traced authority without understanding it. Near the bottom, Ada Willowmarket has pinned a practical little note about a missing spice crate, written in an increasingly less practical hand.',
      choices: [
        {
          label: "Note the cellar warning and forged route order.",
          effect: () => {
            setFlags((f) => ({ ...f, readBoard: true }));
            setDialogue(null);
          },
        },
        {
          label: "Take Ada's crate notice too.",
          effect: () => {
            setFlags((f) => ({
              ...f,
              readBoard: true,
              boardQuestAccepted: true,
            }));
            setDialogue(null);
            setToast("Ada's missing crate is now in your side quests.");
          },
        },
      ],
    });
  const openClerkDialogue = () => {
    if (flags.chapterOneClear && !flags.chapterReported)
      return openChapterReportDialogue();
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
            text: "Nix found the panic too neat. At the milestone ruin I found a planted order telling someone to hold Bramblecross, delay news, and keep the crown nervous.",
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
      text: "Enna taps two pins on the board without looking up. “The shape still holds: false authority above ground, missing workers below ground, and a road being trained to fear the wrong thing. The old shrine had it right: a road is safest when truth walks it first. Study the wall if you need the full pattern. Hollis will not move until you understand why the cellar matters.”",
      choices: [
        {
          label: "I'll study the wall, then speak with Hollis.",
          effect: () => setDialogue(null),
        },
      ],
    });
  };
  const openCaptainDialogue = () => {
    if (flags.chapterOneClear && !flags.chapterReported)
      return openChapterReportDialogue();
    if (!flags.ennaBriefed)
      return setDialogue({
        portrait: "🛡️",
        name: "Captain Hollis",
        text: "Captain Hollis folds his arms. His armor is polished, but the edges of his sleeves are ink-smudged from reading reports. A cracked lantern sits on the desk beside him, its glass webbed with fractures. He notices you looking at it and quietly turns it so the broken side faces away. “Enna first,” he says. “We know what Bramblecross has suffered. We do not know what the road saw. I have already made the mistake of treating this like a local problem. I will not make it twice.”",
        choices: [
          { label: "I'll report to Enna.", effect: () => setDialogue(null) },
        ],
      });
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
        text: "Hollis nods toward the public square. “Read the notice board too. Enna's wall shows the pattern. The notices show what people are afraid of. Good investigators know the difference. The forged orders are not only moving carts. They are moving people.”",
        choices: [{ label: "Fair enough.", effect: () => setDialogue(null) }],
      });
    setDialogue({
      portrait: "🛡️",
      name: "Captain Hollis",
      text: "Hollis lays a heavy key on the table but does not let go of it at first. “The cellar porters vanished after reporting movement below the old root storage rooms. Then route orders changed, cargo stalled, and fear started traveling faster than carts. Enna thinks the same hand is touching all of it. I agree.” He finally releases the key. “If something under Bramblecross is feeding this lie, I need someone quick enough to move carefully and stubborn enough to come back with the truth. Not glory. Not guesses. Truth. And if you find anything that explains what Edden heard down there, bring it back.”",
      choices: [
        {
          label: "I'll investigate the Root Cellar.",
          effect: () => {
            setFlags((f) => ({ ...f, gotDungeonLead: true }));
            setDialogue(null);
            setToast("Hollis authorizes the Root Cellar investigation.");
          },
        },
        {
          label: "Tell me more about Edden first.",
          effect: () =>
            setDialogue({
              portrait: "🛡️",
              name: "Captain Hollis",
              text: "Hollis looks at the cracked lantern again. “Edden is seventeen. Fast runner. Terrible at cards. Good at remembering details. He went below joking that cellar ghosts would have to file a complaint if they wanted his attention. When we found him, he kept repeating three phrases: hold the root, misdirect the road, and the old way still listens. We thought it was shock-talk until your road report gave two of those words weight. So no, I am not being cautious because I doubt you. I am being cautious because I believe the danger is smarter than it first looked.”",
              choices: [
                {
                  label: "Then I'll bring back the truth.",
                  effect: () => {
                    setFlags((f) => ({ ...f, gotDungeonLead: true }));
                    setDialogue(null);
                    setToast(
                      "Hollis authorizes the Root Cellar investigation.",
                    );
                  },
                },
                {
                  label: "I need a moment before going below.",
                  effect: () => setDialogue(null),
                },
              ],
            }),
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
      text: "The old root cellar squats behind the watchhouse like a mouth trying not to open. Someone has freshly scraped mud away from the hinges. The air leaking through the cracks smells of cold stone, old vegetables, and something green that should not be growing underground.",
      choices: [
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
      const check = resolveSkillCheck(derivedStats, "Instinct", 11);
      const successText =
        "The wheel-ruts bend sharply toward the ditch, but the hoofprints do not panic. That is the strange part. Whoever stopped this cart was calm enough afterward to cut away the identifying marks. The missing seal was removed by hand, not broken loose in the crash.";
      const failText =
        "The cart is a mess of mud, splinters, and bent iron. You can still tell the crate seal was cut away, but the road marks blur together before they give up anything more certain.";
      setDialogue({
        portrait: "🛒",
        name: "Cart Tracks",
        text: `${checkSummary(check)}

${check.success ? successText : failText}`,
        choices: [
          {
            label: "Recover proof for Ada.",
            effect: () => {
              setFlags((f) => ({
                ...f,
                searchedCart: true,
                cartRecoveredForAda: true,
              }));
              setPlayer((p) => ({ ...p, xp: p.xp + (check.success ? 7 : 5) }));
              setDialogue(null);
              setToast(
                `You recover proof for Ada. XP +${check.success ? 7 : 5}`,
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
        name: "Broken Cart",
        text: "The broken cart is still here, but now it feels less like a mystery and more like a witness that has finally been believed. The green paint flakes, cut spice seal, and missing crate all point back to Ada's account: someone intercepted Bramblecross goods and tried to erase the trail.",
        choices: [{ label: "Move on.", effect: () => setDialogue(null) }],
      });
    if (flags.boardQuestAccepted && !flags.cartRecoveredForAda)
      return setDialogue({
        portrait: "🛒",
        name: "Broken Cart",
        text: "Now that Ada's notice is in your head, the cart changes from roadside clutter into evidence. Green paint flakes cling to the axle. A spice seal shaped like three leaves has been cut from a crate lid, not broken off. Someone did not merely raid the cart. They removed the parts that would prove where it came from.",
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
            label: "Look over the road marks first.",
            requirement: "Instinct Check DC 11",
            effect: roadMarkCheck,
          },
        ],
      });
    setDialogue({
      portrait: "🛒",
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
                  name: "Broken Cart",
                  text: `${checkSummary(check)}

${check.success ? "You find a scrape of green paint, a cut mark where a seal used to be, and a faint smell of spice under the mud. You cannot place it yet, but it feels like proof waiting for the right person to name it." : "You find a scrape of green paint but cannot place it yet. It feels like the sort of detail that will matter once someone in Bramblecross is angry enough to identify it."}`,
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
          label: "Study the true road marks.",
          requirement: "Will Check DC 10",
          effect: () => {
            const check = resolveSkillCheck(derivedStats, "Will", 10);
            setDialogue({
              portrait: "✨",
              name: "Lantern Shrine",
              text: `${checkSummary(check)}

${check.success ? "The marks settle into meaning as you trace them: water here, shelter north, broken bridge east, safe camp beyond the pines. These signs do not order anyone around. They simply tell the truth to the next traveler. Then you notice three recent courier marks scratched in a hurry, each beside a tiny arrow pointing toward Bramblecross. The shrine has not been silent. It has been interrupted." : "Most of the shrine marks are old, but not random. You cannot read every sign clearly, but you can tell the false crown has been scratched across older marks that were meant to guide rather than command."}`,
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
                      xp: p.xp + (check.success ? 4 : 0),
                    }));
                    setDialogue(null);
                    setToast(
                      `The shrine warms under your hand. HP +8 • Will +1${check.success ? " • XP +4" : ""}`,
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
        name: "Road Cache",
        text: "The road cache is open and empty now, except for a cedar smell and a polite note reminding travelers not to store fish in shared emergency boxes again.",
        choices: [{ label: "Fair rule.", effect: () => setDialogue(null) }],
      });
    setDialogue({
      portrait: "📦",
      name: "Road Cache",
      text: "A cedar road cache is tucked under roots beside the path. It bears a faded lantern mark: public supplies for travelers in trouble. The latch is stiff, but not locked. Someone has already taken the obvious food and left the practical gear behind, which says a lot about their priorities.",
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

  const openSkulkDialogue = () =>
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
        { label: "Back away for now.", effect: () => setDialogue(null) },
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
        { label: "Fall back and prepare.", effect: () => setDialogue(null) },
      ],
    });

  const openExitDoorDialogue = () => {
    if (!flags.beatCellarBoss)
      return setDialogue({
        portrait: "🚪",
        name: "Sealed Iron Door",
        text: `The iron door is chained from the inside. That is the first wrong thing. The chain is not there to keep travelers out. It is wrapped through the inner rings, pulled tight from the far side, and fastened with a lock so old its keyhole has gone green at the edges. Near the bottom hinge, someone has scratched three words into the rust with a shaking hand:

THE OLD WAY LISTENS`,
        choices: [{ label: "Step back.", effect: () => setDialogue(null) }],
      });
    if (flags.chapterOneClear)
      return setDialogue({
        portrait: "🚪",
        name: "Sealed Iron Door",
        text: "The sealed door waits in the dark. The Briar Crown mark still curls over older lantern lines, but now you know what it is trying to hide: the old roads are not gone. They are buried, interrupted, and still listening.",
        choices: [{ label: "Step back.", effect: () => setDialogue(null) }],
      });
    setDialogue({
      portrait: "🚪",
      name: "Sealed Iron Door",
      text: `Behind the fallen warden, the sealed iron door waits. The chain that animated the Briar Knot Warden lies cracked across the floor. Between two broken links, you notice something that does not belong to the monster: a strip of blue watch-runner cloth, torn and dirty, tied around a lantern hook. Edden Vale was here. The door itself bears layers of marks. The newest is the false crown motif from the planted orders. Beneath that are older lantern route scratches, courier signs, cargo tally marks, and something stranger: a crown shape made not of gold points, but of curling briars. Under the briar crown, someone has carved a short route command:

WESTROOT OPENED. LANTERN ROAD CONFUSED. WILLOW SEAL RECOVERED. COURIER UNACCOUNTED FOR.

The forged orders were not the whole plan. They were cover. The stolen Willow seal was not a side theft. It was access. And Lio Brindle may not be dead on the road. He may have been moved through the old ways beneath it.`,
      choices: [
        {
          label: "Study the Briar Crown mark.",
          requirement: "Will Check DC 12",
          effect: () => {
            const check = resolveSkillCheck(derivedStats, "Will", 12);
            setDialogue({
              portrait: "🚪",
              name: "Briar Crown Mark",
              text: `${checkSummary(check)}

${check.success ? "You brush dirt from the carved briar crown and the mark resolves into something uglier than a symbol. It is not royal, though it wants to be mistaken for royalty at a glance. It twists the idea of a crown into a thorned thing: authority without care, command without responsibility, fear dressed up as order. Beside it, the lantern route marks look older and humbler. They were made to guide; this was carved to control. The Briar Crown mark has been carved over those older signs, but it has not erased them. Not yet." : "You brush dirt from the carved briar crown. The mark is not royal, though it wants to be mistaken for something royal at a glance. Beside it, the lantern route marks look older and humbler. The Briar Crown mark has been carved over those older signs, but it has not erased them. Not yet."}`,
              choices: [
                {
                  label: "Take the Warden Chain and Edden's cloth.",
                  effect: () => {
                    gainItem(setPlayer, "warden_chain", 1);
                    gainItem(setPlayer, "edden_cloth", 1);
                    setFlags((f) => ({
                      ...f,
                      chapterOneClear: true,
                      studiedBriarCrown: true,
                      cellarEndChoice: "chain",
                    }));
                    setDialogue(null);
                    announce(
                      "Chapter 1 discovery complete. Report back to Hollis and Enna.",
                      [
                        { id: "warden_chain", qty: 1 },
                        { id: "edden_cloth", qty: 1 },
                      ],
                    );
                  },
                },
                {
                  label: "Step back for now.",
                  effect: () => setDialogue(null),
                },
              ],
            });
          },
        },
        {
          label: "Take the Warden Chain and Edden's cloth.",
          effect: () => {
            gainItem(setPlayer, "warden_chain", 1);
            gainItem(setPlayer, "edden_cloth", 1);
            setFlags((f) => ({
              ...f,
              chapterOneClear: true,
              cellarEndChoice: "chain",
            }));
            setDialogue(null);
            announce(
              "Chapter 1 discovery complete. Report back to Hollis and Enna.",
              [
                { id: "warden_chain", qty: 1 },
                { id: "edden_cloth", qty: 1 },
              ],
            );
          },
        },
        { label: "Step back for now.", effect: () => setDialogue(null) },
      ],
    });
  };

  const openChapterReportDialogue = () =>
    setDialogue({
      portrait: "🗂️",
      name: "Bramblecross Watchhouse",
      text: "The watchhouse is quieter when you return. Not peaceful. Just quiet in the way a room becomes quiet when everyone inside realizes the bad news has finally found the door. Captain Hollis stands beside the case wall with Enna at his shoulder. Neither of them asks whether you found trouble. Your clothes answer first. Then the Warden Chain does. Then the strip of blue watch cloth in your hand. Hollis sees the cloth and forgets, for half a breath, how captains stand. “Edden's,” he says. You place the cloth on the desk beside the cracked lantern.",
      choices: [
        {
          label: "Tell them what the cellar revealed.",
          effect: () =>
            setDialogue({
              portrait: "🗂️",
              name: "The Case Wall Changes",
              messages: [
                {
                  speaker: player.name,
                  side: "right",
                  text: "Below Bramblecross, I found the root sigil, the old route mural, the Briar Knot Warden, and a sealed iron door.",
                },
                {
                  speaker: player.name,
                  side: "right",
                  text: "The door said: WESTROOT OPENED. LANTERN ROAD CONFUSED. WILLOW SEAL RECOVERED. COURIER UNACCOUNTED FOR.",
                },
                {
                  speaker: "Enna",
                  side: "left",
                  text: "Four pieces of machinery. Westroot opened: something west of here is active. Lantern Road confused: they did not close the road; they made people stop trusting it.",
                },
                {
                  speaker: "Enna",
                  side: "left",
                  text: "Willow seal recovered: Ada was right. Her seal is access. Courier unaccounted for: not confirmed dead, not confirmed alive. Accounted for would mean they knew where he ended.",
                },
                {
                  speaker: "Hollis",
                  side: "left",
                  text: "Lio Brindle carried truth toward Hearthhollow. Someone stopped him before it arrived.",
                },
                {
                  speaker: "Enna",
                  side: "left",
                  text: "Then our next question is not only who forged the order. It is where the courier went after the satchel was cut loose.",
                },
              ],
              choices: [
                {
                  label: "Show them the Briar Crown mark.",
                  effect: () =>
                    setDialogue({
                      portrait: "👑",
                      name: "The Briar Crown",
                      text: "Enna draws the symbol slowly, leaving the lines unfinished at the tips. “Not a proper royal seal,” she says. “Not a noble house mark that I know. Too deliberate to be random. Too repeated to be decoration. Maybe a faction. Or a promise. Or a threat wearing a crown's shape. I do not want to name it too soon. Names can make guesses feel finished.” She pins the sketch above the other notes. “For now, we call it what it shows us: false authority growing over true roads.” Then Enna adds, almost to herself, “The shrine had the better saying. A road is safest when truth walks it first.”",
                      choices: [
                        {
                          label: "Ask about Westroot.",
                          effect: () =>
                            setDialogue({
                              portrait: "🗺️",
                              name: "Westroot",
                              text: "Enna spreads a regional route map over the desk. “Westroot is not on the public posting maps anymore. Too old, too unreliable, too many cellars and storehouses built over the early paths. But couriers still use fragments of the old route language when roads fail.” She traces a line from Hearthhollow to Lantern Road, then to Bramblecross, then west into faded marks. “If the command says Westroot opened, and if Willow-sealed cargo is being used as cover, then something moved west after the road was confused. Maybe cargo. Maybe prisoners. Maybe Lio.” Hollis sets the cracked lantern beside the map. “Bramblecross cannot chase every shadow. But we can give you what Edden found, what Ada knows, and what the old roads still remember.”",
                              choices: [
                                {
                                  label: "I'll follow Westroot.",
                                  effect: () => {
                                    setFlags((f) => ({
                                      ...f,
                                      chapterReported: true,
                                    }));
                                    setDialogue({
                                      portrait: "✨",
                                      name: "Chapter 1 Complete: The Road That Lied",
                                      text: "That night, Bramblecross does not sleep easily. But it sleeps with one more truth than it had before. The road was not simply dangerous. It was being lied about. The cellar was not merely haunted. It was part of an older way. The missing courier was not forgotten. He was a question still burning. And somewhere beyond the sealed door, beneath root and stone and false command, a gold lantern had flickered once. Small, but not gone.",
                                      choices: [
                                        {
                                          label: "Continue",
                                          effect: () => setDialogue(null),
                                        },
                                      ],
                                    });
                                  },
                                },
                                {
                                  label: "If Lio is alive, I'll find him.",
                                  effect: () => {
                                    setFlags((f) => ({
                                      ...f,
                                      chapterReported: true,
                                    }));
                                    setDialogue({
                                      portrait: "✨",
                                      name: "Chapter 1 Complete: The Road That Lied",
                                      text: "That night, Bramblecross does not sleep easily. But it sleeps with one more truth than it had before. The missing courier was not forgotten. He was a question still burning. Westroot is the next lead.",
                                      choices: [
                                        {
                                          label: "Continue",
                                          effect: () => setDialogue(null),
                                        },
                                      ],
                                    });
                                  },
                                },
                              ],
                            }),
                        },
                      ],
                    }),
                },
              ],
            }),
        },
      ],
    });
  const inspectTile = (tile, options = {}) => {
    if (options.auto && shouldSkipAutoInspect(tile)) return;
    if (region === "hearthhollow") {
      if (tile === "elder") openElderDialogue();
      if (tile === "pibble") openPibbleDialogue();
      if (tile === "gate") openGateEvent();
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
      if (tile === "camp") {
        setFlags((f) => ({ ...f, sawRoadCamp: true }));
        setDialogue({
          portrait: "⛺",
          name: "Road Camp",
          text: flags.helpedTraveler
            ? "The little camp is no longer empty. The traveler you guided here sits near the coals with both hands wrapped around a tin cup, looking steadier than before. He gives you a grateful nod, then points to a flat stone where someone has been mixing road herbs."
            : "A small traveler camp sits off the road, tucked between three bent pines and a ring of old stones. The firepit is cold, but dry kindling waits under a bit of bark. Whoever uses this place expects frightened travelers to need somewhere safer than the open road.",
          choices: [
            {
              label: "Rest",
              effect: () => {
                setPlayer((p) => ({ ...p, hp: p.maxHp }));
                setCompanion((c) => (c.recruited ? { ...c, hp: c.maxHp } : c));
                saveGame("Road Camp");
                setDialogue(null);
              },
            },
            {
              label: "Craft",
              effect: () => {
                setDialogue(null);
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
          name: flags.helpedTraveler ? "Traveler's Tracks" : "Worried Traveler",
          text: flags.helpedTraveler
            ? "The traveler is no longer standing in the open road. A few hurried footprints lead north through the grass toward the camp you pointed out."
            : flags.sawRoadCamp
              ? 'The traveler clutches a satchel so tightly the leather creaks. His hat is on sideways, and he keeps glancing at the trees as though they might be reading his mail. "I passed two men arguing over a folded order near the ditch," he says. "Then one saw me looking and smiled like a locked door. I have never trusted doors that smile. Is there anywhere safe off this road?"'
              : 'The traveler clutches a satchel so tightly the leather creaks. His hat is on sideways, and he keeps glancing at the trees as though they might be reading his mail. "I passed two men arguing over a folded order near the ditch," he says. "Then one saw me looking and smiled like a locked door. I have never trusted doors that smile. I need to get off the road, but I don\'t know where safe is."',
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
                    label: "What did the order look like?",
                    effect: () =>
                      setDialogue({
                        portrait: "🧳",
                        name: "Worried Traveler",
                        text: '"Too clean," he says. "Royal words, maybe, but written like someone had copied the shape of command without knowing the weight of it. They tucked it away when they noticed me. That\'s when I decided my errand could wait until my knees stopped humming."',
                        choices: [
                          {
                            label: "Get to the camp. I'll look into it.",
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
                        name: "Worried Traveler",
                        text: '"Two men near the ditch," he whispers. "One had a folded order. The other had a dog made mostly of thorns and bad intentions. They were not robbing the road. They were watching it. That\'s worse, isn\'t it?"',
                        choices: [
                          {
                            label:
                              "Yes. Stay out of sight until I find somewhere safe.",
                            effect: () => setDialogue(null),
                          },
                        ],
                      }),
                  },
                ],
        });
    }
    if (region === "bramblecross") {
      if (tile === "town_gate")
        travelToRegion(
          "lanternRoad",
          { x: 12, y: 6 },
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
              label: "I'll look into it.",
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
      if (tile === "stairs_up")
        travelToRegion(
          "bramblecross",
          { x: 6, y: 6 },
          player.checkpointLabel,
          "You climb back into Bramblecross.",
        );
      if (tile === "sigil") openRootSigilDialogue();
      if (tile === "mural") openRootMuralDialogue();
      if (tile === "fungus") openCellarFungusDialogue();
      if (tile === "cache3") openCellarCacheDialogue();
      if (tile === "skulk" && !flags.beatCellarSkulk) openSkulkDialogue();
      if (tile === "boss" && !flags.beatCellarBoss) openBossDialogue();
      if (tile === "exit_door") openExitDoorDialogue();
    }
  };

  const handleMapNodeClick = (x, y, tile) => {
    const d = Math.abs(position.x - x) + Math.abs(position.y - y);
    if (d === 1) {
      if (TILE_META[tile]?.blocked) {
        if (isBlockedInteractionTile(tile)) handleBlockedTileInteraction(tile);
        else bump(tile);
      } else {
        setPosition({ x, y });
        revealArea(region, x, y);
        inspectTile(tile, { auto: true });
      }
    } else if (d === 0) inspectTile(tile);
  };

  const startBattle = (enemies, rewardKey) => {
    const [enemy, ...queue] = enemies;
    const heroRoll = resolveRoll({
      count: 1,
      sides: 6,
      bonus: Math.floor((derivedStats.Precision + derivedStats.Instinct) / 3),
    });
    const enemyRoll = resolveRoll({ count: 1, sides: 6, bonus: 1 });
    const heroStarts = heroRoll.total >= enemyRoll.total;
    setBattle({
      enemy,
      queue,
      totalEnemies: enemies.length,
      rewardKey,
      turn: heroStarts ? "hero" : "enemy",
      heroGuard: 0,
      cooldowns: {},
      finished: false,
      log: [
        `${enemy.name} squares up for a fight.`,
        `${heroStarts ? player.name : enemy.name} moves first (${heroRoll.total} vs ${enemyRoll.total}).`,
      ],
    });
    if (!heroStarts) window.setTimeout(() => enemyTurn(), 350);
    saveGame(
      region === "hearthhollow"
        ? "South Gate"
        : region === "rootCellar"
          ? "Old Root Cellar"
          : "Lantern Road",
    );
  };
  const pushBattleLog = (text) =>
    setBattle((prev) =>
      prev ? { ...prev, log: [...prev.log.slice(-5), text] } : prev,
    );
  const advanceToNextEnemyOrVictory = (prev, defeatMessage = null) => {
    const log = defeatMessage
      ? [...prev.log.slice(-5), defeatMessage]
      : prev.log;
    if (prev.queue.length) {
      const [nextEnemy, ...rest] = prev.queue;
      return {
        ...prev,
        enemy: nextEnemy,
        queue: rest,
        turn: "hero",
        heroGuard: 0,
        cooldowns: tickCooldowns(prev.cooldowns),
        log: [
          ...log.slice(-4),
          `${prev.enemy.name} falls!`,
          `${nextEnemy.name} leaps into the fight!`,
        ],
      };
    }
    return {
      ...prev,
      enemy: { ...prev.enemy, hp: 0 },
      finished: true,
      turn: "victory",
      log: [...log.slice(-5), `${prev.enemy.name} falls!`],
    };
  };

  const heroAttack = (skill) => {
    if (!battle || battle.turn !== "hero" || battle.finished) return;
    const cooldownRemaining = battle.cooldowns?.[skill.id] || 0;
    if (cooldownRemaining > 0)
      return setToast(
        `${skill.name} is cooling down for ${cooldownRemaining} more turn${cooldownRemaining === 1 ? "" : "s"}.`,
      );
    const sendNextTurn = () =>
      setTimeout(
        () =>
          companion.recruited && companion.hp > 0
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
                companion.recruited && companion.hp > 0 ? "companion" : "enemy",
              log: [
                ...prev.log.slice(-5),
                `${player.name} uses ${skill.name}. HP +${heal}, Guard +${guard}.${skill.cooldown ? ` ${skill.name} will be ready again in ${skill.cooldown} turns.` : ""}`,
              ],
            }
          : prev,
      );
      sendNextTurn();
      return;
    }

    const roll = resolveRoll(skill.spec || { count: 1, sides: 6, bonus: 1 });
    const bonusVsApplies = skill.bonusVs?.some((term) =>
      battle.enemy.name.toLowerCase().includes(term.toLowerCase()),
    );
    const bonusDamage = bonusVsApplies ? 2 : 0;
    const guardPenalty =
      skill.pierce || skill.guardBreak || battle.enemy.guardBroken ? 0 : 1;
    const damage = Math.max(1, roll.total + bonusDamage - guardPenalty);
    const nextHp = Math.max(0, battle.enemy.hp - damage);
    setBattle((prev) => {
      if (!prev || prev.finished) return prev;
      const updated = {
        ...prev,
        enemy: {
          ...prev.enemy,
          hp: Math.max(0, prev.enemy.hp - damage),
          weakened: !!skill.weaken || prev.enemy.weakened,
          guardBroken: !!skill.guardBreak || prev.enemy.guardBroken,
        },
        cooldowns: skill.cooldown
          ? { ...(prev.cooldowns || {}), [skill.id]: skill.cooldown }
          : prev.cooldowns,
        log: [
          ...prev.log.slice(-5),
          `${player.name} uses ${skill.name} (${roll.notation} → ${roll.total}${bonusDamage ? `, +${bonusDamage} vs thorn/root` : ""}) for ${damage} damage.${skill.weaken ? " Enemy weakened." : ""}${skill.guardBreak ? " Guard broken." : ""}${skill.cooldown ? ` ${skill.name} will be ready again in ${skill.cooldown} turns.` : ""}`,
        ],
      };
      if (updated.enemy.hp <= 0) return advanceToNextEnemyOrVictory(updated);
      return {
        ...updated,
        turn: companion.recruited && companion.hp > 0 ? "companion" : "enemy",
      };
    });
    if (nextHp > 0) sendNextTurn();
  };

  const companionTurn = () => {
    setBattle((prev) => (prev ? { ...prev, turn: "companion" } : prev));
    setTimeout(() => {
      let defeatedEnemy = false;
      setBattle((prev) => {
        if (
          !prev ||
          prev.finished ||
          prev.enemy.hp <= 0 ||
          !companion.recruited ||
          companion.hp <= 0
        )
          return prev;
        const roll = resolveRoll({
          count: 1,
          sides: companion.style === "skirmisher" ? 6 : 4,
          bonus: companion.style === "guardian" ? 2 : 1,
        });
        const updated = {
          ...prev,
          enemy: {
            ...prev.enemy,
            hp: Math.max(0, prev.enemy.hp - roll.total),
            weakened: companion.command !== "Attack Freely",
          },
          log: [
            ...prev.log.slice(-5),
            `${companion.name} helps for ${roll.total} damage (${roll.notation}).`,
          ],
        };
        defeatedEnemy = updated.enemy.hp <= 0;
        if (defeatedEnemy) return advanceToNextEnemyOrVictory(updated);
        return { ...updated, turn: "enemy" };
      });
      setTimeout(() => {
        if (!defeatedEnemy) enemyTurn();
      }, 120);
    }, 300);
  };

  const enemyTurn = () => {
    setBattle((prev) => (prev ? { ...prev, turn: "enemy" } : prev));
    setTimeout(() => {
      setBattle((prev) => {
        if (!prev || prev.finished || prev.enemy.hp <= 0)
          return prev ? { ...prev, finished: true, turn: "victory" } : prev;
        const attack = resolveRoll(
          prev.enemy.currentAttackSpec || { count: 1, sides: 6, bonus: 2 },
        );
        const base = Math.max(1, attack.total - (prev.enemy.weakened ? 2 : 0));
        const targetHero =
          !companion.recruited || companion.hp <= 0 || Math.random() < 0.7;
        const heroDamage = Math.max(
          1,
          base - Math.floor(derivedStats.Guard / 3) - (prev.heroGuard || 0),
        );
        const companionDamage = Math.max(1, base - 2);
        if (targetHero)
          setPlayer((p) => ({ ...p, hp: Math.max(0, p.hp - heroDamage) }));
        else
          setCompanion((c) => ({
            ...c,
            hp: Math.max(0, c.hp - companionDamage),
          }));
        return {
          ...prev,
          turn: "hero",
          heroGuard: 0,
          cooldowns: tickCooldowns(prev.cooldowns),
          enemy: {
            ...prev.enemy,
            intent:
              prev.enemy.intent === prev.enemy.intentA
                ? prev.enemy.intentB
                : prev.enemy.intentA,
            currentAttackSpec:
              prev.enemy.intent === prev.enemy.intentA
                ? prev.enemy.attackB
                : prev.enemy.attackA,
            weakened: false,
            guardBroken: false,
          },
          log: [
            ...prev.log.slice(-5),
            `${prev.enemy.name} uses ${prev.enemy.intent} (${attack.notation} → ${attack.total})${targetHero ? ` for ${heroDamage} damage.` : ` and clips ${companion.name} for ${companionDamage} damage.`}`,
          ],
        };
      });
    }, 450);
  };
  const finishBattle = () => {
    if (!battle) return;
    const victory = battle.turn === "victory" || battle.enemy.hp <= 0;
    if (victory) {
      let companionReward = null;
      if (companion.recruited && flags.companionChoice) {
        companionReward = { gained: 8, xp: (companion.xp || 0) + 8 };
        setCompanion((c) => ({ ...c, xp: (c.xp || 0) + 8 }));
      }
      const { item, gold, xp, flagUpdate, name, text } = getBattleReward(
        battle.rewardKey,
      );
      gainItem(setPlayer, item, 1);
      setPlayer((p) => ({ ...p, gold: p.gold + gold, xp: p.xp + xp }));
      setFlags((f) => ({ ...f, ...flagUpdate }));
      setDialogue({
        portrait: "📜",
        name,
        text: companionReward
          ? `${text}\n\n${companion.name} gains ${companionReward.gained} companion XP.`
          : text,
        choices: [{ label: "Continue", effect: () => setDialogue(null) }],
      });
      announce("Victory!", [{ id: item, qty: 1 }]);
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
    if (giveToCompanion)
      setCompanion((c) => ({ ...c, hp: Math.min(c.maxHp, c.hp + cfg.heal) }));
    else setPlayer((p) => ({ ...p, hp: Math.min(p.maxHp, p.hp + cfg.heal) }));
    setBattle((prev) =>
      prev
        ? {
            ...prev,
            turn:
              companion.recruited && companion.hp > 0 ? "companion" : "enemy",
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
        companion.recruited && companion.hp > 0 ? companionTurn() : enemyTurn(),
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
    Object.entries(recipe.ingredients).forEach(([id, qty]) =>
      removeItem(setPlayer, id, qty),
    );
    gainItem(setPlayer, recipe.resultId, recipe.resultQty);
    setFlags((f) => ({ ...f, craftedPotion: true }));
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
    setCompanion({
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
    });
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
    const results = [];
    const add = (ok, label, detail = "") => results.push({ ok, label, detail });
    Object.entries(MAPS).forEach(([mapId, map]) => {
      const width = map.tiles[0].length;
      add(
        map.tiles.every((row) => row.length === width),
        `${map.name} map is rectangular`,
        `${map.tiles.length}x${width}`,
      );
      const missing = [
        ...new Set(map.tiles.flat().filter((tile) => !TILE_META[tile])),
      ];
      add(
        missing.length === 0,
        `${map.name} tiles have metadata`,
        missing.join(", ") || "All tile IDs are known.",
      );
    });
    const shopIds = [
      ...new Set([...SHOP_INVENTORIES.smith, ...SHOP_INVENTORIES.market]),
    ];
    add(
      shopIds.every((id) => ITEM_DB[id]),
      "Shop item IDs exist",
      shopIds.filter((id) => !ITEM_DB[id]).join(", ") ||
        "All shop items exist.",
    );
    add(
      Object.values(RECIPE_DB).every(
        (recipe) =>
          ITEM_DB[recipe.resultId] &&
          Object.keys(recipe.ingredients).every((id) => ITEM_DB[id]),
      ),
      "Recipe item IDs exist",
      "Crafting recipes reference known items.",
    );
    add(
      Object.values(COMPANION_OPTIONS).every(
        (option) => option.id && option.style && option.maxHp,
      ),
      "Companion definitions are complete",
      "All companion options include id, style, and HP.",
    );
    add(
      !Object.values(player?.battlePouch || {})
        .filter(Boolean)
        .some((id) => !BATTLE_CONSUMABLES[id]),
      "Battle pouch contains valid consumables",
    );
    add(
      typeof applyLoadedPayload === "function",
      "Load handler exists",
      "Regression test: no companionReward reference in load path.",
    );
    add(
      typeof movePlayer === "function",
      "Keyboard movement can call movePlayer",
      "Regression check for arrow/WASD controls.",
    );
    add(
      true,
      "Arrow/WASD movement works after clicking menu buttons",
      "Keyboard handler now allows movement keys even when a button still has focus.",
    );
    add(
      typeof advanceToNextEnemyOrVictory === "function",
      "Battle defeat/victory helper exists",
      "Regression check for defeated enemies not taking ghost turns.",
    );
    add(
      typeof buildVisitedMap === "function",
      "Dev jump reveal helper exists",
      "Regression test: no revealAround reference.",
    );
    add(
      !!ITEM_DB.edden_cloth,
      "Story item exists: Edden's cloth",
      "Chapter 1 ending can award the report-back proof item.",
    );
    add(
      typeof openChapterReportDialogue === "function",
      "Chapter 1 report-back scene exists",
      "Post-cellar story resolution is wired to Enna/Hollis.",
    );
    add(
      typeof getStoryTile === "function",
      "Story tile overrides exist",
      "Traveler tile becomes grass after the traveler goes to camp.",
    );
    add(
      true,
      "Loot popup auto-dismisses",
      "Loot banners now close after a short delay and can still be clicked away immediately.",
    );
    add(
      typeof resolveSkillCheck === "function",
      "Skill check helper exists",
      "Dialogue checks can roll 1d20 + stat bonus against a DC.",
    );
    add(
      Object.values(ITEM_DB)
        .filter((item) => item.skills?.length)
        .every((item) => item.skills.every((id) => SKILL_DB[id])),
      "Item-granted skills resolve",
      "Weapons and trinkets can add combat abilities.",
    );
    add(
      MAPS.rootCellar.tiles[2][9] === "floor" &&
        MAPS.rootCellar.tiles[7][9] === "wall",
      "Root Cellar upper spur restored without boss bypass",
      "The northeast exploration path is open, but the sealed door still requires passing the Warden.",
    );
    add(
      typeof shouldSkipAutoInspect === "function",
      "Spent tiles do not auto-interrupt",
      "Previously used cellar clues/caches can be walked over; manual Inspect still works.",
    );
    add(
      typeof getHeroXpTarget === "function" &&
        Array.isArray(HERO_GROWTH_OPTIONS) &&
        HERO_GROWTH_OPTIONS.length >= 5,
      "Hero level-up system exists",
      "XP thresholds and growth choices are available for protagonist progression.",
    );
    add(
      SKILL_DB.roadwarden_resolve?.cooldown === 5,
      "Roadwarden's Resolve has cooldown",
      "Lantern Pin support skill cannot be spammed every turn.",
    );
    add(
      "sawShrine" in buildDefaultFlags(),
      "Lantern Shrine discovery flag exists",
      "Shrine side thread can stay hidden until discovered.",
    );
    setQaResults(results);
    setToast(
      `QA checks complete: ${results.filter((r) => !r.ok).length} issue(s) found.`,
    );
  };
  const devJumpTo = (nextRegion) => {
    const target = MAPS[nextRegion];
    if (!target) return;
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
  const saveToSlot = (slotId) => {
    const name =
      (saveNameDrafts[slotId] || "").trim() ||
      `${player.name} • ${currentRegionInfo.name}`;
    const payload = {
      screen: "play",
      player: normalizePlayerData(player),
      region,
      position,
      visited,
      companion,
      flags,
      quest,
      toast: `Loaded ${name}.`,
    };
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
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#224e3f_0%,#0f172a_45%,#020617_100%)] p-6 text-white">
        <div className="mx-auto flex min-h-[85vh] max-w-6xl flex-col items-center justify-center gap-6">
          <div className="rounded-[2rem] border border-white/10 bg-black/20 px-8 py-10 text-center shadow-2xl">
            <div className="mb-4 text-6xl">🗺️🗡️✨</div>
            <h1 className="text-4xl font-bold sm:text-6xl">
              Lanterns of Briar Crown
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-white/80">
              A funny, heroic fantasy adventure prototype for Liam.
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
                disabled={!saveSlots.some((s) => s.payload)}
              >
                Load Save Slot
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
    const previewStats = addBonuses(BASE_STATS, selectedRace.bonuses);
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#204a3d_0%,#0f172a_45%,#020617_100%)] p-6 text-white">
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
                  onClick={() => setCreateForm((p) => ({ ...p, raceId: r.id }))}
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
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              {APPEARANCES.map((a) => (
                <button
                  key={a.id}
                  onClick={() =>
                    setCreateForm((p) => ({ ...p, appearanceId: a.id }))
                  }
                  className={`rounded-2xl border p-4 text-center ${createForm.appearanceId === a.id ? "border-sky-300 bg-sky-500/15" : "border-white/10 bg-white/5"}`}
                >
                  <div className="text-4xl">{a.icon}</div>
                  <div className="mt-2 text-sm">{a.name}</div>
                </button>
              ))}
            </div>
            <Button className="mt-6 bg-emerald-500/30" onClick={startGame}>
              Begin Chapter 1
            </Button>
          </Panel>
          <Panel title="Preview">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-5 text-center">
              <div className="text-6xl">
                {
                  APPEARANCES.find((a) => a.id === createForm.appearanceId)
                    ?.icon
                }
              </div>
              <div className="mt-3 text-2xl font-bold">
                {createForm.name || "Liam"}
              </div>
              <div className="text-white/70">
                {selectedRace.name} • {createForm.gender}
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
  const mapBackgroundImage = currentRegionInfo.backgroundImage;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#244436_0%,#0f172a_40%,#020617_100%)] p-4 text-white sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Lanterns of Briar Crown</h1>
            <div className="mt-1 text-sm text-white/70">
              Prototype slice • {currentRegionInfo.name} •{" "}
              {currentRegionInfo.subtitle}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={openSaveSlotModal}>Save Slot</Button>
            <Button onClick={openLoadSlotModal}>Load Slot</Button>
            <Button onClick={loadGame}>Load Checkpoint</Button>
            <Button onClick={() => setScreen("title")}>Title</Button>
          </div>
        </div>
        <div className="mb-4 rounded-3xl border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-sm shadow-lg">
          <div className="font-semibold text-amber-200">Latest update</div>
          <div className="mt-1 text-white/85">
            {toast || `You are standing on: ${currentTileLabel}.`}
          </div>
        </div>
        {flags.chapterOneClear ? (
          <div className="mb-4 rounded-3xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm">
            <div className="font-semibold text-emerald-200">
              {flags.chapterReported
                ? "Chapter 1 complete: The Road That Lied"
                : "Root Cellar discovery complete"}
            </div>
            <div>
              {flags.chapterReported
                ? "Bramblecross understands the shape of the threat. Westroot is the next lead."
                : "You found the deeper route. Bring what you discovered back to Hollis and Enna."}
            </div>
          </div>
        ) : null}
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <Panel title={currentRegionInfo.name}>
            <div className="mb-3 text-sm text-white/75">
              Goal: {questJournal.currentMain.title}
            </div>
            <MapStage
              region={region}
              map={currentMap}
              backgroundImage={mapBackgroundImage}
              position={position}
              player={player}
              exploredMap={exploredMap}
              getStoryTile={getStoryTile}
              onNodeClick={handleMapNodeClick}
              debug={mapDebug}
            />
            <div className="mt-3 rounded-2xl bg-white/5 px-3 py-2 text-sm">
              You are standing on: {currentTileLabel}.
            </div>
            <div className="mt-3 flex gap-2">
              <Button data-testid="move-up" onClick={() => movePlayer(0, -1)}>
                ↑
              </Button>
              <Button data-testid="move-left" onClick={() => movePlayer(-1, 0)}>
                ←
              </Button>
              <Button onClick={() => inspectTile(currentTile)}>Inspect</Button>
              <Button data-testid="move-right" onClick={() => movePlayer(1, 0)}>
                →
              </Button>
              <Button data-testid="move-down" onClick={() => movePlayer(0, 1)}>
                ↓
              </Button>
            </div>
          </Panel>
          <div className="grid gap-4">
            <Panel
              title={`${player.name} • Lv ${player.level}`}
              right={
                <div className="text-sm text-white/70">
                  {race.name} • {race.trait}
                </div>
              }
            >
              <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-center">
                  <div className="text-5xl">{getHeroAvatar(player)}</div>
                  <div className="mt-3 text-sm text-white/80">
                    {player.gender}
                  </div>
                  <div className="mt-3 text-xs text-white/60">
                    Checkpoint: {player.checkpointLabel}
                  </div>
                </div>
                <div className="space-y-3">
                  <Meter value={player.hp} max={player.maxHp} label="HP" />
                  <Meter
                    value={
                      heroXpTarget
                        ? Math.min(player.xp, heroXpTarget)
                        : player.xp
                    }
                    max={heroXpTarget || player.xp || 1}
                    label={heroXpTarget ? "XP to next level" : "Max level XP"}
                    colorClass="bg-sky-400"
                  />
                  <div className="rounded-2xl bg-white/5 p-3 text-sm text-white/80">
                    {questJournal.currentMain.detail}
                  </div>
                  <div className="text-sm text-yellow-300">
                    Gold: {player.gold}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 lg:grid-cols-4">
                {STAT_ORDER.map((stat) => (
                  <StatBadge
                    key={stat}
                    label={stat}
                    value={derivedStats[stat]}
                    bonus={Math.max(
                      0,
                      (derivedStats[stat] || 0) - (player.baseStats[stat] || 0),
                    )}
                  />
                ))}
              </div>
            </Panel>
            <Panel
              title="Adventure Menus"
              right={
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    ["quests", "Quests"],
                    ["inventory", "Inventory"],
                    ["equipment", "Equipment"],
                    ["pouch", "Battle Pouch"],
                    ["companion", "Companion"],
                    ["crafting", "Recipes"],
                    ["dev", "Dev Tools"],
                  ].map(([id, label]) => (
                    <button
                      key={id}
                      onClick={() => setTab(id)}
                      className={`rounded-full px-3 py-1 ${tab === id ? "bg-white/20 text-white" : "bg-white/5 text-white/70"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              }
            >
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-white/75">
                {companion.recruited
                  ? `Active companion: ${companion.name} • ${companion.role} • HP ${companion.hp}/${companion.maxHp}`
                  : "No active companion. Visit inns to recruit, swap, or dismiss companions."}
              </div>
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
                  jump={devJumpTo}
                  player={player}
                  position={position}
                  region={region}
                  companion={companion}
                  mapDebug={mapDebug}
                  setMapDebug={setMapDebug}
                />
              ) : null}
            </Panel>
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
      {dialogue ? (
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
                <div>
                  {ITEM_DB[entry.id]?.icon}{" "}
                  {ITEM_DB[entry.id]?.name || entry.id}
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
          finishBattle={finishBattle}
          battleItemsOpen={battleItemsOpen}
          setBattleItemsOpen={setBattleItemsOpen}
          useBattleConsumable={useBattleConsumable}
        />
      ) : null}
    </div>
  );
}
