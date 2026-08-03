import { ENCOUNTERS, ENEMY_DB } from "../data/enemies";
import { ITEM_DB } from "../data/items";
import {
  CHAPTER_4_CONTRACT,
  CHAPTER_4_OPTIONAL_FLAGS,
  FOLDED_MAP_EDGES,
  FOLDED_MAP_CONTRACT,
  FOLDED_MAP_LANDINGS,
  GATEWRIGHT_WEAPON_CONTRACT,
  type FoldedMapEdge,
  type FoldedMapLanding,
  type FoldedMapSide,
} from "../story/chapter4";
import { buildDefaultFlags } from "./state";
import type { Flags, GameFlags, Player } from "./types";

export type FoldedMapOutcome =
  | "true-route"
  | "false-shortcut"
  | "deeper-solve"
  | "not-a-route";

export type FoldedMapConfiguration = {
  side: FoldedMapSide;
  folds: Record<FoldedMapEdge, FoldedMapLanding | null>;
};

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

  if (
    flags.foldedMapDecoded &&
    isFoldedMapConfiguration(configuration, FOLDED_MAP_CONTRACT.deeperConfiguration)
  ) {
    return {
      outcome: "deeper-solve",
      flags: { ...common, foldedMapDecoded: true, foldedMapDeeperSolved: true },
      message:
        "With the true route still held, the north edge lands one-quarter across. Its reverse-side root arrow begins at the keeper bridge and leads to a cache star beside Lanternwell.",
    };
  }

  if (isFoldedMapConfiguration(configuration, FOLDED_MAP_CONTRACT.trueRouteConfiguration)) {
    return {
      outcome: "true-route",
      flags: { ...common, foldedMapDecoded: true },
      message:
        "The west edge lands halfway and supplies the western approach, but leaves the road unfinished. The south edge lands three-quarters across and lifts the keeper ring and bridge span into that gap, joining both contour strokes to one winding road into the Underway.",
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
        "The east and north half-folds join the later office marks into a wonderfully straight road. Traced onward, however, its contour runs backward and ends at a sealed maintenance approach. The persuasive mistake is recorded, but the paper remains yours to refold.",
    };
  }

  return {
    outcome: "not-a-route",
    flags: common,
    message:
      "The paper holds this shape, but the evidence does not: a terrain stroke doubles back, a revision mark meets empty paper, or the road stops at a cut edge. Unfold and try another construction.",
  };
}

export function getFoldedMapReview(flags: Flags) {
  if (flags.foldedMapDeeperSolved) {
    return "True route decoded; deeper Lanternwell cache alignment found.";
  }
  if (flags.foldedMapDecoded) {
    return "True route recorded; the root mark beside the keeper bridge suggests an optional third fold.";
  }
  if (flags.foldedMapMaintenanceDetour) {
    return "Crown shortcut rejected; maintenance-route pressure recorded; true route unresolved.";
  }
  if (flags.foldedMapAttempted) return "The map has been handled, but no route is decoded yet.";
  return "No fold has been attempted.";
}

export function claimFoldedMapCache(player: Player, flags: Flags) {
  if (!flags.foldedMapDeeperSolved || flags.foldedMapCacheClaimed) {
    return { player, flags: {}, claimed: false };
  }
  return {
    player: {
      ...player,
      inventory: {
        ...player.inventory,
        [FOLDED_MAP_CONTRACT.deeperReward]:
          (player.inventory[FOLDED_MAP_CONTRACT.deeperReward] || 0) + 1,
      },
    },
    flags: { foldedMapCacheClaimed: true } satisfies Partial<GameFlags>,
    claimed: true,
  };
}

export function getGatewrightOfferPrice() {
  return GATEWRIGHT_WEAPON_CONTRACT.price;
}

export function canPurchaseGatewrightWeapon(player: Player, flags: Flags) {
  return (
    !flags.gatewrightWeaponPurchased &&
    !player.inventory[GATEWRIGHT_WEAPON_CONTRACT.itemId] &&
    player.gold >= getGatewrightOfferPrice()
  );
}

export function purchaseGatewrightWeapon(player: Player, flags: Flags) {
  if (!canPurchaseGatewrightWeapon(player, flags)) {
    return { player, flags: {}, purchased: false };
  }
  return {
    player: {
      ...player,
      gold: player.gold - getGatewrightOfferPrice(),
      inventory: {
        ...player.inventory,
        [GATEWRIGHT_WEAPON_CONTRACT.itemId]: 1,
      },
    },
    flags: {
      gatewrightMet: true,
      gatewrightWeaponPurchased: true,
    } satisfies Partial<GameFlags>,
    purchased: true,
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
