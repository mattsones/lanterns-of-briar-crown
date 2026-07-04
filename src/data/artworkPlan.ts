import { GENDERS, RACES } from "./character";

export type ArtworkStatus = "available" | "needed";

export type ArtworkPlanEntry = {
  id: string;
  label: string;
  category: "hero" | "map" | "portrait" | "enemy" | "item" | "symbol-ui";
  status: ArtworkStatus;
  chapter: number | "shared";
  fallback: string;
  notes?: string;
};

function entry(
  id: string,
  label: string,
  category: ArtworkPlanEntry["category"],
  chapter: ArtworkPlanEntry["chapter"],
  fallback: string,
  status: ArtworkStatus = "needed",
  notes?: string,
): ArtworkPlanEntry {
  return { id, label, category, chapter, fallback, status, notes };
}

export const HERO_VARIANT_ARTWORK_PLAN: Record<string, ArtworkPlanEntry> = Object.fromEntries(
  RACES.flatMap((race) =>
    GENDERS.map((gender) => {
      const id = `hero_${race.id}_${gender.toLowerCase()}`;
      return [
        id,
        entry(
          id,
          `${race.name} ${gender} Hero`,
          "hero",
          "shared",
          "appearance emoji",
          "needed",
          "One curated base illustration per race/gender. Appearance choices remain UI/personality for now.",
        ),
      ];
    }),
  ),
);

export const MAP_ARTWORK_PLAN: Record<string, ArtworkPlanEntry> = {
  hearthhollow: entry("hearthhollow", "Hearthhollow Gameplay Map", "map", 1, "painted-map-fallback", "available"),
  lantern_road: entry("lantern_road", "Lantern Road Gameplay Map", "map", 1, "painted-map-fallback", "available"),
  bramblecross: entry("bramblecross", "Bramblecross Town Map", "map", 1, "painted-map-fallback", "available"),
  root_cellar: entry("root_cellar", "Old Root Cellar Map", "map", 1, "painted-map-fallback", "available"),
  westroot_trail: entry("westroot_trail", "Westroot Trail Map", "map", 2, "painted-map-fallback", "available"),
  crown_door_den: entry("crown_door_den", "Crown Door Den Map", "map", 2, "painted-map-fallback", "available", "Roadwatcher signworks behind the false Crown Door."),
  westroot_hub: entry("westroot_hub", "Westroot Hub Map", "map", 3, "painted-map-fallback"),
  riddle_road_underway: entry("riddle_road_underway", "Riddle Road Underway Map", "map", 4, "painted-map-fallback"),
  briarhold_waystation: entry("briarhold_waystation", "Briarhold Waystation Map", "map", 5, "painted-map-fallback"),
};

export const PORTRAIT_ARTWORK_PLAN: Record<string, ArtworkPlanEntry> = {
  mira: entry("mira", "Elder Mira", "portrait", 1, "dialogue emoji", "available"),
  enna: entry("enna", "Watch Clerk Enna", "portrait", 1, "dialogue emoji", "available"),
  hollis: entry("hollis", "Captain Hollis", "portrait", 1, "dialogue emoji", "available"),
  nix: entry("nix", "Nix Fernwhistle", "portrait", 1, "dialogue emoji", "available"),
  pibble: entry("pibble", "Pibble Thatch", "portrait", 1, "dialogue emoji", "available"),
  rowan: entry("rowan", "Rowan Reedshield", "portrait", 1, "dialogue emoji", "available"),
  tilda: entry("tilda", "Tilda Quickstep", "portrait", 1, "dialogue emoji", "available"),
  moss: entry("moss", "Moss Fenmere", "portrait", 1, "dialogue emoji", "available"),
  ada: entry("ada", "Ada Willowmarket", "portrait", 1, "dialogue emoji"),
  orin: entry("orin", "Smith Orin", "portrait", 1, "dialogue emoji"),
  anwen: entry("anwen", "Mayor Anwen", "portrait", 1, "dialogue emoji"),
  nella: entry("nella", "Nella the Baker", "portrait", 1, "dialogue emoji"),
  toma: entry("toma", "Toma Fielding", "portrait", 1, "dialogue emoji"),
  miri: entry("miri", "Miri of the Loom", "portrait", 1, "dialogue emoji"),
  mara: entry("mara", "Mara Brindle", "portrait", 2, "dialogue emoji"),
  edden: entry("edden", "Edden Vale", "portrait", 2, "dialogue emoji"),
  lio: entry("lio", "Lio Brindle", "portrait", 5, "dialogue emoji"),
  bracken_voss: entry("bracken_voss", "Bracken Voss", "portrait", 5, "dialogue emoji"),
  westroot_npcs: entry("westroot_npcs", "Key Westroot NPC Set", "portrait", 3, "dialogue emoji"),
};

export const ENEMY_ARTWORK_PLAN: Record<string, ArtworkPlanEntry> = {
  bramble_boar: entry("bramble_boar", "Bramble Boar", "enemy", 1, "enemy emoji"),
  thorncoat_ruffian: entry("thorncoat_ruffian", "Thorncoat Ruffian", "enemy", 1, "enemy emoji"),
  thorny_hound: entry("thorny_hound", "Thorny Hound", "enemy", 1, "enemy emoji"),
  rustroot_skulk: entry("rustroot_skulk", "Rustroot Skulk", "enemy", 1, "enemy emoji"),
  briar_knot_warden: entry("briar_knot_warden", "Briar Knot Warden", "enemy", 1, "enemy emoji"),
  briar_roadwatcher: entry("briar_roadwatcher", "Briar Roadwatcher", "enemy", 2, "enemy emoji"),
  thorn_collared_hound: entry("thorn_collared_hound", "Thorn-Collared Hound", "enemy", 2, "enemy emoji"),
  false_sign_scratcher: entry("false_sign_scratcher", "False Sign Scratcher", "enemy", 2, "enemy emoji"),
  briar_relay_guard: entry("briar_relay_guard", "Briar Relay Guard", "enemy", 4, "enemy emoji"),
  seal_forged_sentry: entry("seal_forged_sentry", "Seal-Forged Sentry", "enemy", 4, "enemy emoji"),
  crown_whisperer: entry("crown_whisperer", "Crown Whisperer", "enemy", 4, "enemy emoji"),
  bracken_voss: entry("bracken_voss", "Bracken Voss", "enemy", 5, "enemy emoji"),
  thornseal_guard: entry("thornseal_guard", "Thornseal Guard", "enemy", 5, "enemy emoji"),
  thornroot_sentry: entry("thornroot_sentry", "Thornroot Sentry", "enemy", 5, "enemy emoji"),
};

export const ITEM_ARTWORK_BACKLOG: Record<string, ArtworkPlanEntry> = {
  rootbread_charm: entry("rootbread_charm", "Rootbread Charm", "item", 3, "item emoji"),
  witness_stone_rubbing: entry("witness_stone_rubbing", "Witness Stone Rubbing", "item", 3, "item emoji"),
  folded_map_scrap: entry("folded_map_scrap", "Folded Map Scrap", "item", 4, "item emoji"),
  lanternwell_drop: entry("lanternwell_drop", "Lanternwell Drop", "item", 4, "item emoji"),
  true_seal_fragment: entry("true_seal_fragment", "True Seal Fragment", "item", 5, "item emoji"),
  briar_chain_link: entry("briar_chain_link", "Briar Chain Link", "item", 5, "item emoji"),
  lios_courier_knot: entry("lios_courier_knot", "Lio's Courier Knot", "item", 5, "item emoji"),
};

export const SYMBOL_UI_ARTWORK_PLAN: Record<string, ArtworkPlanEntry> = {
  lantern_road_symbols: entry("lantern_road_symbols", "Lantern Road Symbol Sheet", "symbol-ui", "shared", "text labels"),
  briar_crown_symbols: entry("briar_crown_symbols", "Briar Crown Symbol Sheet", "symbol-ui", "shared", "text labels"),
  willow_seal_reference: entry("willow_seal_reference", "Willow Seal Reference Sheet", "symbol-ui", "shared", "text labels"),
  parchment_panels: entry("parchment_panels", "Parchment UI Panel Treatment", "symbol-ui", "shared", "CSS panels"),
};

export const ARTWORK_PLAN_GROUPS = {
  heroVariants: HERO_VARIANT_ARTWORK_PLAN,
  maps: MAP_ARTWORK_PLAN,
  portraits: PORTRAIT_ARTWORK_PLAN,
  enemies: ENEMY_ARTWORK_PLAN,
  items: ITEM_ARTWORK_BACKLOG,
  symbols: SYMBOL_UI_ARTWORK_PLAN,
};

export function getArtworkBacklog() {
  return Object.values(ARTWORK_PLAN_GROUPS).flatMap((group) =>
    Object.values(group).filter((item) => item.status === "needed"),
  );
}
