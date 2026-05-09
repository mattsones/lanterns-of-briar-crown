export const SKILL_DB = {
  scrappy_chop: { id: "scrappy_chop", name: "Scrappy Chop", kind: "attack", count: 1, sides: 6, stats: ["Might"], baseBonus: 1, bonusVs: ["Briar", "Thorn", "Root"], description: "A familiar hatchet swing. +2 damage against thorn, briar, or root enemies." },
  rootcut_lunge: { id: "rootcut_lunge", name: "Rootcut Lunge", kind: "attack", count: 1, sides: 8, stats: ["Precision"], baseBonus: 1, description: "A cleaner, more precise blade strike guided by footwork." },
  pebbleknock_slam: { id: "pebbleknock_slam", name: "Pebbleknock Slam", kind: "attack", count: 1, sides: 10, stats: ["Might"], baseBonus: 0, guardBreak: true, description: "A heavy hammer blow that breaks the enemy's guard for this hit." },
  spark_toss: { id: "spark_toss", name: "Spark Toss", kind: "attack", count: 1, sides: 6, stats: ["Will", "Precision"], divisor: 3, baseBonus: 1, pierce: true, description: "A crackling little bolt that ignores the usual enemy guard penalty." },
  roadwarden_resolve: { id: "roadwarden_resolve", name: "Roadwarden's Resolve", kind: "guardHeal", stats: ["Heart", "Will"], divisor: 3, baseHeal: 3, baseGuard: 2, cooldown: 5, description: "Steady yourself with true-road courage: heal a little and gain guard. Cooldown: 5 turns." },
  rootbind: { id: "rootbind", name: "Rootbind", kind: "attack", count: 1, sides: 8, stats: ["Will"], baseBonus: 1, weaken: true, description: "A chain-marked strike that weakens the enemy's next attack." },
};
