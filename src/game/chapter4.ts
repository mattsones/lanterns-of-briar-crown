import { ENCOUNTERS, ENEMY_DB } from "../data/enemies";
import { ITEM_DB } from "../data/items";
import {
  CHAPTER_4_CONTRACT,
  CHAPTER_4_OPTIONAL_FLAGS,
  FOLDED_MAP_EDGES,
  FOLDED_MAP_CONTRACT,
  FOLDED_MAP_LANDINGS,
  GATEWRIGHT_WEAPON_CONTRACT,
  GATEWRIGHT_WEAPON_CONTRACTS,
  LIO_MESSAGE_CONTRACT,
  type GatewrightWeaponId,
  type FoldedMapEdge,
  type FoldedMapLanding,
  type FoldedMapSide,
} from "../story/chapter4";
import { buildDefaultFlags } from "./state";
import type { Flags, GameFlags, Player } from "./types";

export type FoldedMapOutcome =
  | "true-route"
  | "false-shortcut"
  | "not-a-route";

export type FoldedMapConfiguration = {
  side: FoldedMapSide;
  folds: Record<FoldedMapEdge, FoldedMapLanding | null>;
};

export function getChapter4EntryErrors(player: Player, flags: Flags) {
  const errors = CHAPTER_4_CONTRACT.entry.requiredFlags
    .filter((flag) => !flags[flag])
    .map((flag) => `Missing Chapter 4 entry flag: ${flag}.`);
  CHAPTER_4_CONTRACT.entry.requiredItems.forEach((itemId) => {
    if (!player.inventory[itemId]) errors.push(`Missing Chapter 4 entry item: ${itemId}.`);
  });
  return errors;
}

export function beginChapter4(player: Player, flags: Flags) {
  const errors = getChapter4EntryErrors(player, flags);
  return {
    started: errors.length === 0,
    errors,
    flags: errors.length === 0
      ? ({ chapterFourStarted: true } satisfies Partial<GameFlags>)
      : {},
  };
}

export function meetGatewright() {
  return {
    chapterFourStarted: true,
    gatewrightMet: true,
  } satisfies Partial<GameFlags>;
}

export const EMPTY_FOLDED_MAP_CONFIGURATION: FoldedMapConfiguration = {
  side: "front",
  folds: {
    left: null,
    right: null,
    top: null,
    bottom: null,
  },
};

export function isFoldedMapConfiguration(
  configuration: FoldedMapConfiguration,
  expected: {
    readonly side: FoldedMapSide;
    readonly folds: Readonly<Record<FoldedMapEdge, FoldedMapLanding | null>>;
  },
) {
  return configuration.side === expected.side && FOLDED_MAP_EDGES.every(
    ({ id }) => configuration.folds[id] === expected.folds[id],
  );
}

export function getFoldedMapFoldCount(configuration: FoldedMapConfiguration) {
  return FOLDED_MAP_EDGES.filter(({ id }) => configuration.folds[id] !== null).length;
}

export function getFoldedMapLandingDepth(landing: FoldedMapLanding | null) {
  if (!landing) return 0;
  return FOLDED_MAP_LANDINGS.find((option) => option.id === landing)?.depth || 0;
}

export function resolveFoldedMapConfiguration(
  flags: Flags,
  configuration: FoldedMapConfiguration,
): { outcome: FoldedMapOutcome; flags: Partial<GameFlags>; message: string } {
  const common: Partial<GameFlags> = {
    chapterFourStarted: true,
    foldedMapAttempted: true,
  };

  if (isFoldedMapConfiguration(configuration, FOLDED_MAP_CONTRACT.trueRouteConfiguration)) {
    return {
      outcome: "true-route",
      flags: { ...common, foldedMapDecoded: true },
      message:
        "The west edge lands halfway across and the south edge reaches the three-quarter guide. Reverse-side road-crew ink closes the old keeper lantern ring, both contour strokes, and one winding road into the Underway.",
    };
  }

  if (isFoldedMapConfiguration(configuration, FOLDED_MAP_CONTRACT.temptingFalseConfiguration)) {
    return {
      outcome: "false-shortcut",
      flags: {
        ...common,
        foldedMapFirstAttemptMistake: !flags.foldedMapAttempted || !!flags.foldedMapFirstAttemptMistake,
        foldedMapMaintenanceDetour: true,
      },
      message:
        "The east and north half-folds join the newer Survey ticks into a wonderfully straight shortcut. Traced onward, however, its contour runs backward and ends against unbroken stone. The persuasive mistake is recorded, but the paper remains yours to refold.",
    };
  }

  return {
    outcome: "not-a-route",
    flags: common,
    message:
      "The paper holds this shape, but the evidence does not: a terrain stroke doubles back, a dated tick meets empty paper, or the road stops at a cut edge. Unfold and try another construction.",
  };
}

export function getFoldedMapReview(flags: Flags) {
  if (flags.foldedMapDecoded) {
    return "True route recorded; the Old Keeper Road is ready to follow into the Underway.";
  }
  if (flags.foldedMapMaintenanceDetour) {
    return "Persuasive Survey Shortcut rejected; true route unresolved.";
  }
  if (flags.foldedMapAttempted) return "The map has been handled, but no route is decoded yet.";
  return "No fold has been attempted.";
}

export function getGatewrightOfferPrice() {
  return GATEWRIGHT_WEAPON_CONTRACT.price;
}

export function getGatewrightWeaponContract(itemId: GatewrightWeaponId = GATEWRIGHT_WEAPON_CONTRACT.itemId) {
  return GATEWRIGHT_WEAPON_CONTRACTS.find((option) => option.itemId === itemId);
}

export function canPurchaseGatewrightWeapon(
  player: Player,
  _flags: Flags,
  itemId: GatewrightWeaponId = GATEWRIGHT_WEAPON_CONTRACT.itemId,
) {
  const offer = getGatewrightWeaponContract(itemId);
  return (
    !!offer &&
    !player.inventory[offer.itemId] &&
    player.gold >= offer.price
  );
}

export function purchaseGatewrightWeapon(
  player: Player,
  flags: Flags,
  itemId: GatewrightWeaponId = GATEWRIGHT_WEAPON_CONTRACT.itemId,
) {
  const offer = getGatewrightWeaponContract(itemId);
  if (!offer || !canPurchaseGatewrightWeapon(player, flags, itemId)) {
    return { player, flags: {}, purchased: false };
  }
  return {
    player: {
      ...player,
      gold: player.gold - offer.price,
      inventory: {
        ...player.inventory,
        [offer.itemId]: 1,
      },
    },
    flags: {
      gatewrightMet: true,
      gatewrightWeaponPurchased: true,
    } satisfies Partial<GameFlags>,
    purchased: true,
  };
}

export function resolveListeningMileClue() {
  const outcome = "marker-found";
  return {
    outcome,
    flags: {
      listeningMileAttempted: true,
      listeningMileOutcome: outcome,
    } satisfies Partial<GameFlags>,
  } as const;
}

export function resolveLioMessage(player: Player, flags: Flags) {
  if (!flags.listeningMileAttempted) {
    return { player, flags: {}, found: false, awardedKnot: false };
  }

  const awardedKnot = !flags.lioMessageFound && !player.inventory[LIO_MESSAGE_CONTRACT.item];
  return {
    player: awardedKnot
      ? {
          ...player,
          inventory: {
            ...player.inventory,
            [LIO_MESSAGE_CONTRACT.item]: 1,
          },
        }
      : player,
    flags: { lioMessageFound: true } satisfies Partial<GameFlags>,
    found: !flags.lioMessageFound,
    awardedKnot,
  };
}

export function learnRoyalProgressAuthority() {
  return { royalProgressLearned: true } satisfies Partial<GameFlags>;
}

export function recordForgedRoyalAuthority(flags: Flags) {
  if (!flags.royalProgressLearned || !flags.briarRelayCleared) return {};
  return { princessNameSeen: true } satisfies Partial<GameFlags>;
}

export function completeChapter4FromRelay(flags: Flags) {
  if (!flags.lioMessageFound || !flags.princessNameSeen || !flags.briarRelayCleared) return {};
  return {
    briarholdLeadFound: true,
    chapterFourClear: true,
  } satisfies Partial<GameFlags>;
}

export function getUnderwayApproach(flags: Flags) {
  return flags.underwayDetourFollowed ? "maintenance-gallery" : "mapped-gallery";
}

export function resolveUnderwayDetour(followDetour: boolean) {
  return {
    underwayDetourDecisionMade: true,
    underwayDetourFollowed: followDetour,
  } satisfies Partial<GameFlags>;
}

export function resolveUnderwayAmbushDiscovery(total: number, dc = 16) {
  return {
    attempted: true,
    revealed: total >= dc,
    dc,
  };
}

export function validateChapter4Contract() {
  const errors: string[] = [];
  const defaults = buildDefaultFlags();

  [...CHAPTER_4_CONTRACT.entry.requiredFlags, ...CHAPTER_4_CONTRACT.requiredEndFlags, ...CHAPTER_4_OPTIONAL_FLAGS].forEach(
    (flag) => {
      if (!(flag in defaults)) errors.push(`Chapter 4 flag has no default: ${flag}.`);
    },
  );
  [...CHAPTER_4_CONTRACT.entry.requiredItems, ...CHAPTER_4_CONTRACT.requiredItems, ...CHAPTER_4_CONTRACT.optionalItems].forEach(
    (itemId) => {
      if (!ITEM_DB[itemId]) errors.push(`Chapter 4 item is missing: ${itemId}.`);
    },
  );
  CHAPTER_4_CONTRACT.enemies.forEach((enemyId) => {
    if (!ENEMY_DB[enemyId]) errors.push(`Chapter 4 enemy is missing: ${enemyId}.`);
  });
  if (!ENCOUNTERS[CHAPTER_4_CONTRACT.encounter]) {
    errors.push(`Chapter 4 encounter is missing: ${CHAPTER_4_CONTRACT.encounter}.`);
  }
  CHAPTER_4_OPTIONAL_FLAGS.forEach((flag) => {
    if (CHAPTER_4_CONTRACT.requiredEndFlags.includes(flag as never)) {
      errors.push(`Optional Chapter 4 flag is also required: ${flag}.`);
    }
  });
  if (GATEWRIGHT_WEAPON_CONTRACT.durability !== false) {
    errors.push("Chapter 4 gatewright contract must not introduce durability.");
  }

  return errors;
}
