export const MAPS = {
  hearthhollow: {
    name: "Hearthhollow", subtitle: "Home village", start: { x: 2, y: 4 },
    tiles: [
      ["tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree"],
      ["tree", "home_building", "home_building", "home_building", "grass", "elder", "grass", "neighbor_building", "neighbor_building", "neighbor2_building", "neighbor2_building", "chest", "tree"],
      ["tree", "home_building", "home_building", "home_building", "grass", "grass", "grass", "neighbor_building", "neighbor_building", "neighbor2_building", "neighbor2_building", "grass", "tree"],
      ["tree", "grass", "home_door", "home_building", "grass", "grass", "grass", "baker", "grass", "farmer", "grass", "grass", "tree"],
      ["tree", "tree", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "tree"],
      ["tree", "potion_building", "potion_building", "potion_building", "grass", "grass", "grass", "smith_building", "smith_building", "smith_building", "grass", "grass", "tree"],
      ["tree", "potion_building", "potion_building", "potion_building", "grass", "pibble", "grass", "smith_building", "smith_building", "smith_building", "grass", "grass", "tree"],
      ["tree", "potion_building", "potion_door", "potion_building", "grass", "grass", "grass", "smith_building", "smith_door", "smith_building", "grass", "gate", "tree"],
      ["tree", "grass", "grass", "grass", "tree", "grass", "grass", "weaver", "grass", "grass", "grass", "grass", "tree"],
      ["tree", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "tree"],
      ["tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree"],
    ],
  },
  lanternRoad: {
    name: "Lantern Road", subtitle: "The wilds beyond the gate", start: { x: 1, y: 4 },
    tiles: [
      ["tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree"],
      ["tree", "grass", "grass", "camp", "grass", "grass", "grass", "grass", "grass", "grass", "chest2", "grass", "tree"],
      ["tree", "grass", "tree", "grass", "road", "grass", "ranger", "grass", "tree", "grass", "grass", "grass", "tree"],
      ["tree", "grass", "tree", "grass", "road", "grass", "grass", "ruins", "tree", "grass", "pond", "grass", "tree"],
      ["tree", "return_gate", "road", "road", "road", "road", "road", "road", "road", "road", "road", "bramblecross", "tree"],
      ["tree", "grass", "tree", "grass", "road", "grass", "grass", "cart", "tree", "grass", "shrine", "grass", "tree"],
      ["tree", "wildbattle", "grass", "grass", "road", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "tree"],
      ["tree", "grass", "grass", "grass", "grass", "grass", "traveler", "grass", "grass", "grass", "grass", "grass", "tree"],
      ["tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree"],
    ],
  },
  bramblecross: {
    name: "Bramblecross", subtitle: "First real town hub", start: { x: 1, y: 5 },
    tiles: [
      ["tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree"],
      ["tree", "grass", "bram_inn_building", "bram_inn_building", "bram_inn_building", "grass", "market_building", "market_building", "market_building", "grass", "board", "grass", "tree"],
      ["tree", "grass", "bram_inn_building", "bram_inn_building", "bram_inn_building", "grass", "market_building", "market_building", "market_building", "grass", "merchant", "grass", "tree"],
      ["tree", "grass", "bram_inn_building", "bram_inn_door", "bram_inn_building", "grass", "market_building", "market_door", "market_building", "grass", "mayor", "grass", "tree"],
      ["tree", "grass", "grass", "grass", "grass", "grass", "road", "road", "road", "grass", "grass", "grass", "tree"],
      ["tree", "town_gate", "road", "road", "road", "road", "road", "road", "road", "road", "road", "grass", "tree"],
      ["tree", "grass", "watch_building", "watch_building", "watch_building", "grass", "captain", "grass", "cellar", "grass", "clerk", "grass", "tree"],
      ["tree", "grass", "watch_building", "watch_door", "watch_building", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "tree"],
      ["tree", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "tree"],
      ["tree", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "tree"],
      ["tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree"],
    ],
  },
  rootCellar: {
    name: "Old Root Cellar", subtitle: "First real dungeon", start: { x: 1, y: 1 },
    tiles: [
      ["wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall"],
      ["wall", "stairs_up", "floor", "mural", "wall", "floor", "sigil", "floor", "floor", "cache3", "wall"],
      ["wall", "floor", "wall", "floor", "wall", "floor", "wall", "wall", "wall", "floor", "wall"],
      ["wall", "floor", "wall", "floor", "floor", "floor", "floor", "fungus", "wall", "floor", "wall"],
      ["wall", "floor", "wall", "wall", "wall", "floor", "wall", "floor", "wall", "floor", "wall"],
      ["wall", "floor", "floor", "floor", "wall", "floor", "wall", "floor", "skulk", "floor", "wall"],
      ["wall", "water", "wall", "floor", "wall", "floor", "wall", "wall", "wall", "floor", "wall"],
      ["wall", "floor", "floor", "floor", "floor", "floor", "floor", "boss", "exit_door", "wall", "wall"],
      ["wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall"],
    ],
  },
};

function makeTile(icon, label, blocked, classes) { return { icon, label, blocked, classes }; }
export const TILE_META = {
  tree: makeTile("🌲", "Tree", true, "bg-green-900/60"), grass: makeTile("", "Grass", false, "bg-green-600/70"), road: makeTile("·", "Road", false, "bg-amber-700/80"), hidden: makeTile("❓", "Unexplored", false, "bg-slate-950/95"),
  floor: makeTile("", "Cellar Floor", false, "bg-stone-700/70"), wall: makeTile("", "Cellar Wall", true, "bg-stone-950/95"), water: makeTile("≈", "Flooded Channel", true, "bg-sky-800/80"), stairs_up: makeTile("↟", "Cellar Stairs", false, "bg-amber-500/80"), sigil: makeTile("✶", "Root Sigil", false, "bg-fuchsia-800/80"), mural: makeTile("🧱", "Route Mural", false, "bg-orange-900/80"), fungus: makeTile("🍄", "Glowcap Cluster", false, "bg-emerald-800/80"), cache3: makeTile("📦", "Cellar Cache", false, "bg-yellow-700/80"), skulk: makeTile("🦂", "Rustroot Skulk", false, "bg-red-800/80"), boss: makeTile("👹", "Cellar Guardian", false, "bg-red-950/90"), exit_door: makeTile("🚪", "Sealed Iron Door", false, "bg-slate-700/85"),
  home_building: makeTile("🏠", "Home Exterior", true, "bg-amber-700/85"), home_door: makeTile("🚪", "Home Door", true, "bg-amber-500/90"), neighbor_building: makeTile("🏡", "Neighbor Cottage", true, "bg-orange-700/80"), neighbor2_building: makeTile("🏠", "Neighbor House", true, "bg-amber-800/80"), potion_building: makeTile("⚗️", "Potion Shed Exterior", true, "bg-cyan-700/85"), potion_door: makeTile("🚪", "Potion Shed Door", true, "bg-cyan-500/90"), smith_building: makeTile("🛠️", "Smithy Exterior", true, "bg-stone-700/85"), smith_door: makeTile("🚪", "Smithy Door", true, "bg-stone-500/90"), bram_inn_building: makeTile("🏨", "Bramblecross Inn Exterior", true, "bg-rose-700/85"), bram_inn_door: makeTile("🚪", "Bramblecross Inn Door", true, "bg-rose-500/90"), market_building: makeTile("🏪", "Willow Market Exterior", true, "bg-emerald-700/85"), market_door: makeTile("🚪", "Willow Market Door", true, "bg-emerald-500/90"), watch_building: makeTile("🏛️", "Watchhouse Exterior", true, "bg-slate-700/85"), watch_door: makeTile("🚪", "Watchhouse Door", true, "bg-slate-500/90"),
  elder: makeTile("🧙", "Elder Mira", false, "bg-violet-600/70"), pibble: makeTile("🧰", "Pibble", false, "bg-rose-600/75"), baker: makeTile("🥖", "Nella the Baker", false, "bg-amber-600/80"), farmer: makeTile("🌾", "Toma Fielding", false, "bg-lime-700/80"), weaver: makeTile("🧵", "Miri of the Loom", false, "bg-pink-700/80"), gate: makeTile("🚪", "South Gate", false, "bg-slate-600/80"), chest: makeTile("📦", "Old Supply Chest", false, "bg-yellow-500/75"),
  return_gate: makeTile("↩️", "Path to Hearthhollow", false, "bg-slate-600/80"), camp: makeTile("⛺", "Road Camp", false, "bg-orange-500/80"), ranger: makeTile("🏹", "Nix Fernwhistle", false, "bg-emerald-500/75"), ruins: makeTile("🗿", "Milestone Ruin", false, "bg-stone-500/80"), pond: makeTile("💧", "Pond", true, "bg-sky-500/80"), shrine: makeTile("✨", "Lantern Shrine", false, "bg-fuchsia-500/75"), wildbattle: makeTile("⚔️", "Trouble on the Road", false, "bg-red-600/80"), bramblecross: makeTile("🏘️", "Road to Bramblecross", false, "bg-indigo-600/80"), cart: makeTile("🛒", "Broken Cart", false, "bg-stone-700/80"), chest2: makeTile("📦", "Road Cache", false, "bg-yellow-500/75"), traveler: makeTile("🧳", "Road Traveler", false, "bg-orange-700/80"),
  town_gate: makeTile("🏘️", "Bramblecross Gate", false, "bg-indigo-600/80"), board: makeTile("📜", "Notice Board", false, "bg-yellow-700/80"), mayor: makeTile("👑", "Mayor Anwen", false, "bg-fuchsia-700/80"), captain: makeTile("🛡️", "Captain Hollis", false, "bg-sky-700/80"), merchant: makeTile("🧺", "Ada Willowmarket", false, "bg-emerald-700/80"), clerk: makeTile("🗂️", "Watch Clerk Enna", false, "bg-slate-600/80"), cellar: makeTile("🕳️", "Old Root Cellar", false, "bg-stone-800/90"),
};
