import { expect, test } from "@playwright/test";
import { resolveRoll, resolveSkillCheck } from "../src/game/dice";
import { MAPS, TILE_META } from "../src/data/maps";
import { gainItem, getDefaultBattlePouch, removeItem } from "../src/game/inventory";
import { buildDefaultVisited, buildPlayer } from "../src/game/state";
import { getHeroXpTarget } from "../src/game/progression";
import { getVisitedKey } from "../src/game/map";
import { addBonuses } from "../src/game/stats";

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
  expect(MAPS.hearthhollow.tiles[4][2]).toBe("grass");
  expect(MAPS.hearthhollow.tiles[2][5]).toBe("baker");
  expect(MAPS.hearthhollow.tiles[2][3]).toBe("home_door");
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
});
