const ennaPortrait = new URL("../../assets/portraits/characters/enna-portrait-v02.png", import.meta.url).href;
const hollisPortrait = new URL("../../assets/portraits/characters/hollis-portrait-v01.png", import.meta.url).href;
const miraPortrait = new URL("../../assets/portraits/characters/mira-portrait-v01.png", import.meta.url).href;
const mossPortrait = new URL("../../assets/portraits/characters/moss-portrait-v01.png", import.meta.url).href;
const nixPortrait = new URL("../../assets/portraits/characters/nix-portrait-v01.png", import.meta.url).href;
const pibblePortrait = new URL("../../assets/portraits/characters/pibble-portrait-v01.png", import.meta.url).href;
const rowanPortrait = new URL("../../assets/portraits/characters/rowan-portrait-v02.png", import.meta.url).href;
const tildaPortrait = new URL("../../assets/portraits/characters/tilda-portrait-v01.png", import.meta.url).href;

export const DIALOGUE_PORTRAITS = {
  "Elder Mira": { src: miraPortrait, alt: "Portrait of Elder Mira" },
  "Pibble Thatch": { src: pibblePortrait, alt: "Portrait of Pibble Thatch" },
  "Nix Fernwhistle": { src: nixPortrait, alt: "Portrait of Nix Fernwhistle" },
  "Watch Clerk Enna": { src: ennaPortrait, alt: "Portrait of Enna" },
  Enna: { src: ennaPortrait, alt: "Portrait of Enna" },
  "Captain Hollis": { src: hollisPortrait, alt: "Portrait of Captain Hollis" },
  "Rowan Reedshield": { src: rowanPortrait, alt: "Portrait of Rowan Reedshield" },
  "Tilda Quickstep": { src: tildaPortrait, alt: "Portrait of Tilda Quickstep" },
  "Moss Fenmere": { src: mossPortrait, alt: "Portrait of Moss Fenmere" },
};

export function getDialoguePortrait(name = "") {
  return DIALOGUE_PORTRAITS[name] || null;
}
