import { ENCOUNTERS, ENEMY_DB } from "../data/enemies";
import { ITEM_DB } from "../data/items";
import {
  CHAPTER_4_CONTRACT,
  CHAPTER_4_OPTIONAL_FLAGS,
  FOLDED_MAP_CONTRACT,
  GATEWRIGHT_WEAPON_CONTRACT,
  type FoldedMapFlapId,
} from "../story/chapter4";
import { buildDefaultFlags } from "./state";
import type { Flags, GameFlags, Player } from "./types";

export type FoldedMapOutcome =
  | "true-route"
  | "false-shortcut"
  | "deeper-solve"
  | "not-a-route";

export type FoldedMapConfiguration = Record<FoldedMapFlapId, boolean>;

export const EMPTY_FOLDED_MAP_CONFIGURATION: FoldedMapConfiguration = {
  survey: false,
  keeper: false,
  crown: false,
  cache: false,
};

export function isFoldedMapConfiguration(
  folds: FoldedMapConfiguration,
  expectedFolded: readonly FoldedMapFlapId[],
) {
  return (Object.keys(folds) as FoldedMapFlapId[]).every(
    (flap) => folds[flap] === expectedFolded.includes(flap),
  );
}

export function resolveFoldedMapConfiguration(
  flags: Flags,
  folds: FoldedMapConfiguration,
): { outcome: FoldedMapOutcome; flags: Partial<GameFlags>; message: string } {
  const common: Partial<GameFlags> = {
    chapterFourStarted: true,
    foldedMapAttempted: true,
  };

  if (
    flags.foldedMapDecoded &&
    isFoldedMapConfiguration(folds, FOLDED_MAP_CONTRACT.deeperConfiguration)
  ) {
    return {
      outcome: "deeper-solve",
      flags: { ...common, foldedMapDecoded: true, foldedMapDeeperSolved: true },
      message:
        "The third fold carries the root arrow across the broken bridge notch. Together they draw a keeper cache mark beside Lanternwell.",
    };
  }

  if (isFoldedMapConfiguration(folds, FOLDED_MAP_CONTRACT.trueRouteConfiguration)) {
    return {
      outcome: "true-route",
      flags: { ...common, foldedMapDecoded: true },
      message:
        "The 811 benchmark lantern sits inside the older keeper ring. Beyond it, both contour strokes and the winding road continue without a break. The folds agree on the Underway.",
    };
  }

  if (isFoldedMapConfiguration(folds, FOLDED_MAP_CONTRACT.temptingFalseConfiguration)) {
    return {
      outcome: "false-shortcut",
      flags: {
        ...common,
        foldedMapFirstAttemptMistake: !flags.foldedMapAttempted || !!flags.foldedMapFirstAttemptMistake,
        foldedMapMaintenanceDetour: true,
      },
      message:
        "The two lantern marks meet and the 817 revision draws a wonderfully straight road. Traced onward, however, its contour runs backward and ends at a sealed maintenance approach. The persuasive mistake is recorded, but the paper remains yours to refold.",
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
  if (flags.foldedMapDeeperSolved) {
    return "True route decoded; deeper Lanternwell cache alignment found.";
  }
  if (flags.foldedMapDecoded) {
    return "True route recorded; Edden's bridge notation suggests an optional third fold.";
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
