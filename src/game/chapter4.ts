import { ENCOUNTERS, ENEMY_DB } from "../data/enemies";
import { ITEM_DB } from "../data/items";
import {
  CHAPTER_4_CONTRACT,
  CHAPTER_4_OPTIONAL_FLAGS,
  FOLDED_MAP_CONTRACT,
  GATEWRIGHT_WEAPON_CONTRACT,
  type FoldedMapMarkId,
} from "../story/chapter4";
import { buildDefaultFlags } from "./state";
import type { Flags, GameFlags, Player } from "./types";

export type FoldedMapOutcome =
  | "selected"
  | "true-route"
  | "false-shortcut"
  | "deeper-solve"
  | "not-a-pair";

export function isMarkPair(
  first: FoldedMapMarkId,
  second: FoldedMapMarkId,
  expected: readonly string[],
) {
  return expected.includes(first) && expected.includes(second) && first !== second;
}

export function resolveFoldedMapPair(
  flags: Flags,
  first: FoldedMapMarkId,
  second: FoldedMapMarkId,
): { outcome: FoldedMapOutcome; flags: Partial<GameFlags>; message: string } {
  const common: Partial<GameFlags> = {
    chapterFourStarted: true,
    foldedMapAttempted: true,
  };

  if (isMarkPair(first, second, FOLDED_MAP_CONTRACT.trueRoutePair)) {
    return {
      outcome: "true-route",
      flags: { ...common, foldedMapDecoded: true },
      message:
        "The Survey lantern meets the older keeper lantern. Their mismatched records agree on one winding route through the Underway.",
    };
  }

  if (flags.foldedMapDecoded && isMarkPair(first, second, FOLDED_MAP_CONTRACT.deeperPair)) {
    return {
      outcome: "deeper-solve",
      flags: { ...common, foldedMapDecoded: true, foldedMapDeeperSolved: true },
      message:
        "The root arrow crosses the broken bridge notch. A second fold reveals a small keeper cache mark beside Lanternwell.",
    };
  }

  if (first === FOLDED_MAP_CONTRACT.decoyMark || second === FOLDED_MAP_CONTRACT.decoyMark) {
    return {
      outcome: "false-shortcut",
      flags: {
        ...common,
        foldedMapFirstAttemptMistake: !flags.foldedMapAttempted || !!flags.foldedMapFirstAttemptMistake,
        foldedMapMaintenanceDetour: true,
      },
      message:
        "The crown line makes a beautifully straight route—and sends the old echo marks into a sealed maintenance approach. The mistake is recorded, but the map remains solvable.",
    };
  }

  return {
    outcome: "not-a-pair",
    flags: common,
    message: "Those edges touch, but their dates and cut marks do not continue across the fold.",
  };
}

export function getFoldedMapReview(flags: Flags) {
  if (flags.foldedMapDeeperSolved) {
    return "True route decoded; deeper Lanternwell cache alignment found.";
  }
  if (flags.foldedMapDecoded) {
    return "True route decoded; the optional root-and-bridge alignment remains.";
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
