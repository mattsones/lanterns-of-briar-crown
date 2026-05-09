export const BATTLE_REWARDS = {
  boar: {
    item: "bubblecap",
    gold: 12,
    xp: 12,
    flagUpdate: { beatGateBattle: true },
    name: "Courier Satchel",
    text: "The boar collapses in a storm of dust and snapping brambles. When it finally lies still, the square does not cheer right away. Everyone is looking at the satchel. The leather is scuffed, but the courier badge is still readable: Lio Brindle, South Lantern Route. Inside, you find a folded order bearing a crown seal that looks right until you stare at it too long. It reads: DELAY ROADS. STIR PANIC. HOLD ALL MESSENGERS. Beneath it is something worse than the order: a small lunch packet, still tied with blue string. Someone has tucked a note under the knot in a careful hand: Lio — back before noon, or I’m eating your pear roll. — Mara. Whoever carried this satchel expected to reach Hearthhollow today.",
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
};

export function getBattleReward(rewardKey) {
  return BATTLE_REWARDS[rewardKey] || BATTLE_REWARDS.boar;
}
