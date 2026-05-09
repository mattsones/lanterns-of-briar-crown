export const RACES = [
  { id: "human", name: "Human", trait: "Versatile", description: "Balanced and adaptable. Comfortable almost anywhere.", bonuses: { Charm: 1, Wit: 1 } },
  { id: "stonekin", name: "Stonekin", trait: "Unshaken", description: "Sturdy mountain folk who respect craft and resilience.", bonuses: { Guard: 2, Grit: 1 } },
  { id: "sylvan", name: "Sylvan", trait: "Leafstep", description: "Woodland wanderers with sharp eyes and quiet feet.", bonuses: { Agility: 1, Instinct: 2 } },
  { id: "emberling", name: "Emberling", trait: "Kindled", description: "Bright, warm, and just a little too confident near open flame.", bonuses: { Might: 1, Craft: 1, Will: 1 } },
  { id: "tideborn", name: "Tideborn", trait: "Current Sense", description: "Calm traders and riverfolk with patient instincts.", bonuses: { Heart: 1, Instinct: 1, Charm: 1 } },
  { id: "cloudling", name: "Cloudling", trait: "Featherfall", description: "Quick, cheerful folk from windy heights.", bonuses: { Agility: 2, Precision: 1 } },
  { id: "mossback", name: "Mossback", trait: "Rooted", description: "Gentle, earthy guardians of gardens and old stones.", bonuses: { Vitality: 1, Guard: 1, Heart: 1 } },
  { id: "moonmark", name: "Moonmark", trait: "Glimmer Sense", description: "Rare wanderers touched by secrets and intuition.", bonuses: { Wit: 1, Instinct: 1, Will: 1 } },
];

export const APPEARANCES = [
  { id: "brave", name: "Brave", icon: "🧑" },
  { id: "cheery", name: "Cheery", icon: "😄" },
  { id: "mysterious", name: "Mysterious", icon: "😌" },
  { id: "scrappy", name: "Scrappy", icon: "😎" },
];

export const GENDERS = ["Male", "Female"];
export const STAT_ORDER = ["Might", "Guard", "Agility", "Precision", "Vitality", "Will", "Wit", "Charm", "Grit", "Instinct", "Craft", "Heart"];
export const BASE_STATS = Object.fromEntries(STAT_ORDER.map((stat) => [stat, 3]));
export const HERO_XP_CURVE = { 1: 32, 2: 70, 3: 115, 4: 165, 5: 230 };
export const HERO_GROWTH_OPTIONS = [
  { id: "power", name: "Power", icon: "⚔️", bonuses: { Might: 1, Precision: 1 }, description: "Hit harder and land cleaner strikes." },
  { id: "resolve", name: "Resolve", icon: "🛡️", bonuses: { Guard: 1, Will: 1 }, description: "Stand firm against fear, pressure, and heavy blows." },
  { id: "cleverness", name: "Cleverness", icon: "🧠", bonuses: { Wit: 1, Instinct: 1 }, description: "Read patterns faster and notice what others miss." },
  { id: "heart", name: "Heart", icon: "💛", bonuses: { Heart: 1, Charm: 1 }, description: "Lead with kindness, courage, and trust-building presence." },
  { id: "craft", name: "Craft", icon: "🛠️", bonuses: { Craft: 1, Grit: 1 }, description: "Improve practical skill, toughness, and hands-on problem solving." },
];
