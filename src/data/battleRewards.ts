import { CHAPTER_1_STORY } from "../story/chapter1";

export const BATTLE_REWARDS = {
  boar: {
    item: "bubblecap",
    gold: 12,
    xp: 12,
    flagUpdate: { beatGateBattle: true },
    name: CHAPTER_1_STORY.battleRewards.boar.name,
    text: CHAPTER_1_STORY.battleRewards.boar.text,
  },
  wilds: {
    item: "trail_snack",
    gold: 14,
    xp: 14,
    flagUpdate: { clearedWildBattle: true },
    name: "Dropped Orders",
    text: "The thug drops more forged paperwork. Someone is organized and funded.",
  },
  cellarSkulk: {
    item: "trail_snack",
    gold: 10,
    xp: 16,
    flagUpdate: { beatCellarSkulk: true },
    name: "Broken Shell",
    text: "Under the skulk's shell you find treated root fiber.",
  },
  cellarBoss: {
    item: "healing_fizzpop",
    gold: 22,
    xp: 24,
    flagUpdate: { beatCellarBoss: true },
    name: "Briar Knot Warden",
    text: "As the guardian falls, forged seal-cloth tears free from its chains.",
  },
  roadwatcher: {
    item: "pine_pitch_wax",
    extraItems: ["split_crown_slat"],
    gold: 18,
    xp: 20,
    flagUpdate: {
      beatRoadwatcher: true,
      roadwatcherDefeated: true,
      roadwatcherEvidenceFound: true,
      briarCrownWatchingWestroot: true,
      crownDoorKeyFound: true,
      crownDoorUnlocked: true,
    },
    name: "Briar Roadwatcher",
    text: "The watcher falls back, leaving thorn-scraps, seal-cloth, sticky pine-pitch wax, and a split false-sign slat. The bent crown mark on the slat looks less like loot than a key.",
  },
  roadwatcherHard: {
    item: "pine_pitch_wax",
    extraItems: ["split_crown_slat"],
    gold: 22,
    xp: 24,
    flagUpdate: {
      beatRoadwatcher: true,
      roadwatcherDefeated: true,
      roadwatcherHardCleared: true,
      roadwatcherEvidenceFound: true,
      briarCrownWatchingWestroot: true,
      crownDoorKeyFound: true,
      crownDoorUnlocked: true,
    },
    name: "Briar Roadwatcher",
    text: "The harder ambush finally collapses. Under the false sign-scraps you find pine-pitch wax, the edge of a copied Willow mark, and a split crown slat shaped like it belongs in the false door.",
  },
  crownDenGuard: {
    item: "trail_snack",
    gold: 8,
    xp: 14,
    flagUpdate: {
      beatCrownDenGuard: true,
      crownDoorGuardDefeated: true,
    },
    name: "False Sign Guard",
    text: "The den guard breaks apart in a clatter of sign nails and scraped paint. The room suddenly sounds less certain of itself.",
  },
};

export function getBattleReward(rewardKey) {
  return BATTLE_REWARDS[rewardKey] || BATTLE_REWARDS.boar;
}
