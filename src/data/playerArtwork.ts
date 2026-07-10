import { DEFAULT_HUMAN_HERITAGE_ID, normalizeHumanHeritageId } from "./character";

export type PlayerArtwork = {
  src: string;
  alt: string;
  raceId: string;
  humanHeritageId?: string;
  gender: "male" | "female";
};

export type PlayerArtworkSelection = {
  raceId?: string | null;
  gender?: string | null;
  humanHeritageId?: string | null;
};

const cloudlingFemale = new URL("../../assets/portraits/player/cloudling-female-v02.png", import.meta.url).href;
const cloudlingMale = new URL("../../assets/portraits/player/cloudling-male-v02.png", import.meta.url).href;
const emberlingFemale = new URL("../../assets/portraits/player/emberling-female-v06.png", import.meta.url).href;
const emberlingMale = new URL("../../assets/portraits/player/emberling-male-v06.png", import.meta.url).href;
const humanDawnmereFemale = new URL("../../assets/portraits/player/human-dawnmere-female-v01.png", import.meta.url)
  .href;
const humanDawnmereMale = new URL("../../assets/portraits/player/human-dawnmere-male-v01.png", import.meta.url)
  .href;
const humanHearthvaleFemale = new URL("../../assets/portraits/player/human-hearthvale-female-v01.png", import.meta.url)
  .href;
const humanHearthvaleMale = new URL("../../assets/portraits/player/human-hearthvale-male-v01.png", import.meta.url)
  .href;
const humanRainrootFemale = new URL("../../assets/portraits/player/human-rainroot-female-v01.png", import.meta.url)
  .href;
const humanRainrootMale = new URL("../../assets/portraits/player/human-rainroot-male-v01.png", import.meta.url).href;
const humanSunreachFemale = new URL("../../assets/portraits/player/human-sunreach-female-v01.png", import.meta.url)
  .href;
const humanSunreachMale = new URL("../../assets/portraits/player/human-sunreach-male-v01.png", import.meta.url).href;
const moonmarkFemale = new URL("../../assets/portraits/player/moonmark-female-v04.png", import.meta.url).href;
const moonmarkMale = new URL("../../assets/portraits/player/moonmark-male-v02.png", import.meta.url).href;
const mossbackFemale = new URL("../../assets/portraits/player/mossback-female-v02.png", import.meta.url).href;
const mossbackMale = new URL("../../assets/portraits/player/mossback-male-v02.png", import.meta.url).href;
const stonekinFemale = new URL("../../assets/portraits/player/stonekin-female-v06.png", import.meta.url).href;
const stonekinMale = new URL("../../assets/portraits/player/stonekin-male-v04.png", import.meta.url).href;
const sylvanFemale = new URL("../../assets/portraits/player/sylvan-female-v04.png", import.meta.url).href;
const sylvanMale = new URL("../../assets/portraits/player/sylvan-male-v03.png", import.meta.url).href;
const tidebornFemale = new URL("../../assets/portraits/player/tideborn-female-v02.png", import.meta.url).href;
const tidebornMale = new URL("../../assets/portraits/player/tideborn-male-v01.png", import.meta.url).href;

function artwork(
  src: string,
  raceId: string,
  gender: "male" | "female",
  label: string,
  humanHeritageId?: string,
): PlayerArtwork {
  return {
    src,
    alt: `${label} hero full-body art`,
    raceId,
    humanHeritageId,
    gender,
  };
}

export const PLAYER_HERO_ARTWORK: Record<string, PlayerArtwork> = {
  cloudling_female: artwork(cloudlingFemale, "cloudling", "female", "Cloudling Female"),
  cloudling_male: artwork(cloudlingMale, "cloudling", "male", "Cloudling Male"),
  emberling_female: artwork(emberlingFemale, "emberling", "female", "Emberling Female"),
  emberling_male: artwork(emberlingMale, "emberling", "male", "Emberling Male"),
  human_dawnmere_female: artwork(humanDawnmereFemale, "human", "female", "Dawnmere Human Female", "dawnmere"),
  human_dawnmere_male: artwork(humanDawnmereMale, "human", "male", "Dawnmere Human Male", "dawnmere"),
  human_hearthvale_female: artwork(
    humanHearthvaleFemale,
    "human",
    "female",
    "Hearthvale Human Female",
    "hearthvale",
  ),
  human_hearthvale_male: artwork(humanHearthvaleMale, "human", "male", "Hearthvale Human Male", "hearthvale"),
  human_rainroot_female: artwork(humanRainrootFemale, "human", "female", "Rainroot Human Female", "rainroot"),
  human_rainroot_male: artwork(humanRainrootMale, "human", "male", "Rainroot Human Male", "rainroot"),
  human_sunreach_female: artwork(humanSunreachFemale, "human", "female", "Sunreach Human Female", "sunreach"),
  human_sunreach_male: artwork(humanSunreachMale, "human", "male", "Sunreach Human Male", "sunreach"),
  moonmark_female: artwork(moonmarkFemale, "moonmark", "female", "Moonmark Female"),
  moonmark_male: artwork(moonmarkMale, "moonmark", "male", "Moonmark Male"),
  mossback_female: artwork(mossbackFemale, "mossback", "female", "Mossback Female"),
  mossback_male: artwork(mossbackMale, "mossback", "male", "Mossback Male"),
  stonekin_female: artwork(stonekinFemale, "stonekin", "female", "Stonekin Female"),
  stonekin_male: artwork(stonekinMale, "stonekin", "male", "Stonekin Male"),
  sylvan_female: artwork(sylvanFemale, "sylvan", "female", "Sylvan Female"),
  sylvan_male: artwork(sylvanMale, "sylvan", "male", "Sylvan Male"),
  tideborn_female: artwork(tidebornFemale, "tideborn", "female", "Tideborn Female"),
  tideborn_male: artwork(tidebornMale, "tideborn", "male", "Tideborn Male"),
};

export function normalizePlayerArtworkGender(gender?: string | null): "male" | "female" {
  return gender?.toLowerCase() === "female" ? "female" : "male";
}

export function getPlayerArtworkKey(raceId?: string | null, gender?: string | null, humanHeritageId?: string | null) {
  if (!raceId) return null;
  if (raceId === "human") {
    return `human_${normalizeHumanHeritageId(humanHeritageId || DEFAULT_HUMAN_HERITAGE_ID)}_${normalizePlayerArtworkGender(gender)}`;
  }
  return `${raceId}_${normalizePlayerArtworkGender(gender)}`;
}

export function getPlayerArtworkBySelection(raceId?: string | null, gender?: string | null, humanHeritageId?: string | null) {
  const key = getPlayerArtworkKey(raceId, gender, humanHeritageId);
  return key ? PLAYER_HERO_ARTWORK[key] || null : null;
}

export function getPlayerArtwork(selection?: PlayerArtworkSelection | null) {
  return getPlayerArtworkBySelection(selection?.raceId, selection?.gender, selection?.humanHeritageId);
}
