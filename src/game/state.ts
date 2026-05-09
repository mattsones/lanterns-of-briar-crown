import { BASE_STATS, RACES } from "../data/character";
import { addBonuses } from "./stats";
import { buildDefaultVisited } from "./map";
import { getDefaultBattlePouch } from "./inventory";
import type { Companion, Flags, Inventory, Player } from "./types";

export { buildDefaultVisited };

export function getInitialInventory(): Inventory {
  return { moonmint: 1, bubblecap: 1 };
}

export function buildPlayer({ name, gender, raceId, appearanceId }): Player {
  const race = RACES.find((r) => r.id === raceId) || RACES[0];
  const baseStats = addBonuses(BASE_STATS, race.bonuses);
  const inventory = getInitialInventory();
  return {
    name: name || "Liam",
    gender,
    raceId: race.id,
    appearanceId,
    level: 1,
    xp: 0,
    gold: 4,
    maxHp: 24 + baseStats.Vitality * 2,
    hp: 24 + baseStats.Vitality * 2,
    baseStats,
    inventory,
    equipment: { weapon: null, helm: null, cloak: null, trinket1: null, trinket2: null, armor: null },
    battlePouch: getDefaultBattlePouch(inventory),
    checkpointLabel: "Home",
  };
}

export function buildDefaultCompanion(): Companion {
  return {
    recruited: false,
    id: null,
    name: "No Companion Yet",
    hp: 14,
    maxHp: 14,
    level: 1,
    xp: 0,
    command: "Attack Freely",
    buffed: false,
    style: null,
    icon: null,
    role: null,
    futurePath: null,
    futurePathOptions: null,
  };
}

export function buildDefaultFlags(): Flags {
  return {
    metElder: false,
    elderGavePurse: false,
    smithStarterDiscountUsed: false,
    gotSmithGift: false,
    homeStashClaimed: false,
    openedChest: false,
    craftedPotion: false,
    gotPibbleTip: false,
    beatGateBattle: false,
    metNix: false,
    foundRuinNote: false,
    clearedWildBattle: false,
    reachedBramblecross: false,
    enteredBramblecross: false,
    metMayor: false,
    readBoard: false,
    boardQuestAccepted: false,
    boardQuestCompleted: false,
    marketDiscount: false,
    ennaBriefed: false,
    watchEvidenceRead: false,
    watchLedgerRead: false,
    watchMapRead: false,
    watchOrdersRead: false,
    gotDungeonLead: false,
    enteredRootCellar: false,
    openedCellarCache: false,
    readCellarSigil: false,
    readCellarMural: false,
    harvestedCellarFungus: false,
    beatCellarSkulk: false,
    beatCellarBoss: false,
    chapterOneClear: false,
    cellarEndChoice: null,
    chapterReported: false,
    studiedBriarCrown: false,
    rowanStatus: null,
    tildaStatus: null,
    mossStatus: null,
    companionChosen: false,
    companionChoice: null,
    helpedTraveler: false,
    searchedCart: false,
    cartRecoveredForAda: false,
    openedWildChest: false,
    pondForaged: false,
    usedShrine: false,
    sawShrine: false,
    foundShrineSecret: false,
    sawRoadCamp: false,
  };
}

export function normalizePlayerData(player: Player | null) {
  if (!player) return player;
  const equipment = {
    weapon: null,
    helm: null,
    cloak: null,
    trinket1: null,
    trinket2: null,
    armor: null,
    ...(player.equipment || {}),
  };
  return {
    ...player,
    inventory: player.inventory || {},
    equipment,
    battlePouch: { ...getDefaultBattlePouch(player.inventory || {}), ...(player.battlePouch || {}) },
  };
}

export function normalizeCompanionData(companion: Companion | null) {
  return { ...buildDefaultCompanion(), ...(companion || {}) };
}
