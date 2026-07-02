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
    gold: 18,
    xp: 20,
    flagUpdate: {
      beatRoadwatcher: true,
      roadwatcherDefeated: true,
      roadwatcherEvidenceFound: true,
      briarCrownWatchingWestroot: true,
    },
    name: "Briar Roadwatcher",
    text: "The watcher breaks apart into thorn-scraps, seal-cloth, and sticky pine-pitch wax. The hollow is open, and whatever is using Westroot knows witnesses are coming.",
  },
  roadwatcherHard: {
    item: "pine_pitch_wax",
    gold: 22,
    xp: 24,
    flagUpdate: {
      beatRoadwatcher: true,
      roadwatcherDefeated: true,
      roadwatcherHardCleared: true,
      roadwatcherEvidenceFound: true,
      briarCrownWatchingWestroot: true,
    },
    name: "Briar Roadwatcher",
    text: "The harder ambush finally collapses. Under the false sign-scraps you find pine-pitch wax and the edge of a copied Willow mark.",
  },
};

export function getBattleReward(rewardKey) {
  return BATTLE_REWARDS[rewardKey] || BATTLE_REWARDS.boar;
}
