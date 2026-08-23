const DEFAULT_ATTACK_A = { count: 1, sides: 6, bonus: 1 };
const DEFAULT_ATTACK_B = { count: 1, sides: 6, bonus: 2 };

const brambleBoarArtwork = new URL("../../assets/portraits/enemies/bramble-boar-v01.webp", import.meta.url).href;
const briarKnotWardenArtwork = new URL("../../assets/portraits/enemies/briar-knot-warden-v01.webp", import.meta.url)
  .href;
const briarRoadwatcherArtwork = new URL("../../assets/portraits/enemies/briar-roadwatcher-v02.webp", import.meta.url)
  .href;
const falseSignScratcherArtwork = new URL(
  "../../assets/portraits/enemies/false-sign-scratcher-v02.webp",
  import.meta.url,
).href;
const rustrootSkulkArtwork = new URL("../../assets/portraits/enemies/rustroot-skulk-v02.webp", import.meta.url).href;
const thornCollaredHoundArtwork = new URL(
  "../../assets/portraits/enemies/thorn-collared-hound-v01.webp",
  import.meta.url,
).href;
const thorncoatRuffianArtwork = new URL("../../assets/portraits/enemies/thorncoat-ruffian-v02.webp", import.meta.url)
  .href;
const thornyHoundArtwork = new URL("../../assets/portraits/enemies/thorny-hound-v01.webp", import.meta.url).href;
const briarCargoRunnerArtwork = new URL(
  "../../assets/portraits/enemies/briar-cargo-runner-v01.webp",
  import.meta.url,
).href;
const sealForgedSentryArtwork = new URL(
  "../../assets/portraits/enemies/seal-forged-sentry-v01.webp",
  import.meta.url,
).href;
const briarRelayGuardArtwork = new URL(
  "../../assets/portraits/enemies/briar-relay-guard-v02.webp",
  import.meta.url,
).href;
const crownWhispererArtwork = new URL(
  "../../assets/portraits/enemies/crown-whisperer-v02.webp",
  import.meta.url,
).href;

export const ENEMY_DB = {
  bramble_boar: {
    name: "Bramble Boar",
    artwork: { src: brambleBoarArtwork, alt: "Portrait of a Bramble Boar" },
    icon: "🐗",
    hp: 24,
    intentA: "Wild Charge",
    intentB: "Briar Burst",
  },
  thorncoat_ruffian: {
    name: "Thorncoat Ruffian",
    artwork: { src: thorncoatRuffianArtwork, alt: "Portrait of a Thorncoat Ruffian" },
    icon: "🦊",
    hp: 22,
    intentA: "Knife Rush",
    intentB: "Dirty Trick",
  },
  thorny_hound: {
    name: "Thorny Hound",
    artwork: { src: thornyHoundArtwork, alt: "Portrait of a Thorny Hound" },
    icon: "🐕",
    hp: 14,
    intentA: "Snap Lunge",
    intentB: "Briar Bark",
    attackA: { count: 1, sides: 4, bonus: 1 },
    attackB: { count: 1, sides: 6, bonus: 1 },
  },
  rustroot_skulk: {
    name: "Rustroot Skulk",
    artwork: { src: rustrootSkulkArtwork, alt: "Portrait of a Rustroot Skulk" },
    icon: "🦂",
    hp: 30,
    intentA: "Claw Flurry",
    intentB: "Root Snap",
    attackA: { count: 2, sides: 4, bonus: 1 },
    attackB: { count: 1, sides: 8, bonus: 2 },
  },
  briar_knot_warden: {
    name: "Briar Knot Warden",
    artwork: { src: briarKnotWardenArtwork, alt: "Portrait of the Briar Knot Warden" },
    icon: "👹",
    hp: 38,
    intentA: "Chain Slam",
    intentB: "Root Surge",
    attackA: { count: 1, sides: 8, bonus: 3 },
    attackB: { count: 2, sides: 6, bonus: 2 },
  },
  briar_roadwatcher: {
    name: "Briar Roadwatcher",
    artwork: { src: briarRoadwatcherArtwork, alt: "Portrait of a Briar Roadwatcher" },
    icon: "👁️",
    hp: 28,
    intentA: "False Command",
    intentB: "Thorn Lash",
    attackA: { count: 1, sides: 8, bonus: 2 },
    attackB: { count: 2, sides: 4, bonus: 2 },
  },
  false_sign_scratcher: {
    name: "False Sign Scratcher",
    artwork: { src: falseSignScratcherArtwork, alt: "Portrait of a False Sign Scratcher" },
    icon: "🪧",
    hp: 18,
    intentA: "Scrape Mark",
    intentB: "Pocket Sand",
    attackA: { count: 1, sides: 6, bonus: 1 },
    attackB: { count: 1, sides: 4, bonus: 2 },
  },
  thorn_collared_hound: {
    name: "Thorn-Collared Hound",
    artwork: { src: thornCollaredHoundArtwork, alt: "Portrait of a Thorn-Collared Hound" },
    icon: "🐕",
    hp: 18,
    intentA: "Collar-Snap",
    intentB: "Forced Lunge",
    attackA: { count: 1, sides: 6, bonus: 2 },
    attackB: { count: 2, sides: 4, bonus: 1 },
  },
  briar_relay_guard: {
    name: "Briar Relay Guard",
    artwork: { src: briarRelayGuardArtwork, alt: "Portrait of a Briar Relay Guard" },
    icon: "🛡️",
    hp: 32,
    intentA: "Bar the Route",
    intentB: "Seal-Cloth Strike",
    attackA: { count: 1, sides: 6, bonus: 1 },
    attackB: { count: 2, sides: 4, bonus: 2 },
    effectA: { guardSelf: 4, guardAlly: 4 },
  },
  seal_forged_sentry: {
    name: "Seal-Forged Sentry",
    artwork: { src: sealForgedSentryArtwork, alt: "Portrait of a Seal-Forged Sentry" },
    icon: "📜",
    hp: 26,
    intentA: "Stamp Command",
    intentB: "Waxen Guard",
    attackA: { count: 1, sides: 6, bonus: 3 },
    attackB: { count: 1, sides: 8, bonus: 1 },
  },
  briar_cargo_runner: {
    name: "Briar Cargo Runner",
    artwork: { src: briarCargoRunnerArtwork, alt: "Portrait of a Briar Cargo Runner" },
    icon: "📦",
    hp: 24,
    intentA: "Slip the Siding",
    intentB: "Seal-Cloth Feint",
    attackA: { count: 1, sides: 6, bonus: 3 },
    attackB: { count: 2, sides: 4, bonus: 1 },
  },
  crown_whisperer: {
    name: "Crown Whisperer",
    artwork: { src: crownWhispererArtwork, alt: "Portrait of a Crown Whisperer" },
    icon: "♛",
    hp: 24,
    intentA: "Frighten the Road",
    intentB: "Wrong-Way Murmur",
    attackA: { count: 2, sides: 4, bonus: 1 },
    attackB: { count: 1, sides: 8, bonus: 1 },
    effectA: { heroAttackPenalty: 2 },
    effectB: { heroGuardBypass: 3 },
  },
  bracken_voss: {
    name: "Bracken Voss",
    icon: "♜",
    hp: 44,
    intentA: "False Order",
    intentB: "Commanding Seal",
    attackA: { count: 2, sides: 6, bonus: 3 },
    attackB: { count: 1, sides: 10, bonus: 3 },
  },
  thornseal_guard: {
    name: "Thornseal Guard",
    icon: "🛡️",
    hp: 28,
    intentA: "Guard the Ledger",
    intentB: "Thornseal Bash",
    attackA: { count: 1, sides: 8, bonus: 2 },
    attackB: { count: 2, sides: 4, bonus: 2 },
  },
  thornroot_sentry: {
    name: "Thornroot Sentry",
    icon: "🌿",
    hp: 32,
    intentA: "Root Snare",
    intentB: "Briar Sweep",
    attackA: { count: 1, sides: 8, bonus: 2 },
    attackB: { count: 2, sides: 6, bonus: 1 },
  },
};

export const ENCOUNTERS = {
  boar: ["bramble_boar"],
  wilds: ["thorncoat_ruffian", "thorny_hound"],
  cellarSkulk: ["rustroot_skulk"],
  cellarBoss: ["briar_knot_warden"],
  roadwatcher: ["briar_roadwatcher", "thorn_collared_hound"],
  roadwatcherHard: ["briar_roadwatcher", "thorn_collared_hound", "false_sign_scratcher"],
  crownDenPatrol: ["false_sign_scratcher", "false_sign_scratcher"],
  crownDenHound: ["thorn_collared_hound"],
  crownDenGuard: ["false_sign_scratcher", "thorn_collared_hound", "false_sign_scratcher"],
  westrootCargo: ["briar_cargo_runner", "seal_forged_sentry"],
  underwayAmbush: ["briar_relay_guard"],
  underwayAmbushHard: ["briar_relay_guard", "seal_forged_sentry"],
  briarRelay: ["briar_relay_guard", "seal_forged_sentry", "crown_whisperer"],
  briarholdBoss: ["bracken_voss", "thornseal_guard", "thornroot_sentry"],
};

export function buildEnemy(enemyId) {
  const enemy = ENEMY_DB[enemyId];
  if (!enemy) throw new Error(`Unknown enemy: ${enemyId}`);

  const attackA = { ...(enemy.attackA || DEFAULT_ATTACK_A) };
  const attackB = { ...(enemy.attackB || DEFAULT_ATTACK_B) };

  return {
    name: enemy.name,
    icon: enemy.icon,
    artwork: enemy.artwork,
    hp: enemy.hp,
    maxHp: enemy.hp,
    intentA: enemy.intentA,
    intentB: enemy.intentB,
    intent: enemy.intentA,
    currentAttackSpec: attackA,
    attackA,
    attackB,
    currentEffect: enemy.effectA,
    effectA: enemy.effectA,
    effectB: enemy.effectB,
    guard: 0,
    guardBroken: false,
    weakened: false,
  };
}

export function buildEncounterEnemies(encounterId) {
  const enemyIds = ENCOUNTERS[encounterId] || ENCOUNTERS.boar;
  return enemyIds.map((enemyId) => buildEnemy(enemyId));
}
