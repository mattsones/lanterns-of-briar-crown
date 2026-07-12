const adaPortrait = new URL("../../assets/portraits/characters/ada-willowmarket-portrait-v01.webp", import.meta.url)
  .href;
const adaNoLensPortrait = new URL("../../assets/portraits/characters/ada-willowmarket-portrait-no-lens-v01.webp", import.meta.url)
  .href;
const eddenPortrait = new URL("../../assets/portraits/characters/edden-vale-portrait-v01.webp", import.meta.url).href;
const ennaPortrait = new URL("../../assets/portraits/characters/enna-portrait-v02.webp", import.meta.url).href;
const hollisPortrait = new URL("../../assets/portraits/characters/hollis-portrait-v01.webp", import.meta.url).href;
const lioPortrait = new URL("../../assets/portraits/characters/lio-brindle-portrait-v01.webp", import.meta.url).href;
const maraPortrait = new URL("../../assets/portraits/characters/mara-brindle-portrait-v01.webp", import.meta.url).href;
const mayorAnwenPortrait = new URL("../../assets/portraits/characters/mayor-anwen-portrait-v01.webp", import.meta.url)
  .href;
const miraPortrait = new URL("../../assets/portraits/characters/mira-portrait-v01.webp", import.meta.url).href;
const miriPortrait = new URL("../../assets/portraits/characters/miri-portrait-v02.webp", import.meta.url).href;
const mossPortrait = new URL("../../assets/portraits/characters/moss-portrait-v01.webp", import.meta.url).href;
const nellaPortrait = new URL("../../assets/portraits/characters/nella-portrait-v03.webp", import.meta.url).href;
const nixPortrait = new URL("../../assets/portraits/characters/nix-portrait-v01.webp", import.meta.url).href;
const pibblePortrait = new URL("../../assets/portraits/characters/pibble-portrait-v01.webp", import.meta.url).href;
const rowanPortrait = new URL("../../assets/portraits/characters/rowan-portrait-v02.webp", import.meta.url).href;
const smithOrinPortrait = new URL("../../assets/portraits/characters/smith-orin-portrait-v02.webp", import.meta.url)
  .href;
const tildaPortrait = new URL("../../assets/portraits/characters/tilda-portrait-v01.webp", import.meta.url).href;
const tomaPortrait = new URL("../../assets/portraits/characters/toma-fielding-portrait-v02.webp", import.meta.url).href;
const worriedRoadTravelerPortrait = new URL(
  "../../assets/portraits/characters/worried-road-traveler-portrait-v01.webp",
  import.meta.url,
).href;

export const DIALOGUE_PORTRAITS = {
  "Elder Mira": { src: miraPortrait, alt: "Portrait of Elder Mira" },
  "Pibble Thatch": { src: pibblePortrait, alt: "Portrait of Pibble Thatch" },
  "Nix Fernwhistle": { src: nixPortrait, alt: "Portrait of Nix Fernwhistle" },
  "Smith Orin": { src: smithOrinPortrait, alt: "Portrait of Smith Orin" },
  "Mayor Anwen": { src: mayorAnwenPortrait, alt: "Portrait of Mayor Anwen" },
  "Nella the Baker": { src: nellaPortrait, alt: "Portrait of Nella the Baker" },
  "Toma Fielding": { src: tomaPortrait, alt: "Portrait of Toma Fielding" },
  "Miri of the Loom": { src: miriPortrait, alt: "Portrait of Miri of the Loom" },
  "Ada Willowmarket": { src: adaPortrait, alt: "Portrait of Ada Willowmarket" },
  "Ada Willowmarket No Lens": {
    src: adaNoLensPortrait,
    alt: "Portrait of Ada Willowmarket without the Willowmark Lens",
  },
  "Mara Brindle": { src: maraPortrait, alt: "Portrait of Mara Brindle" },
  "Edden Vale": { src: eddenPortrait, alt: "Portrait of Edden Vale" },
  "Lio Brindle": { src: lioPortrait, alt: "Portrait of Lio Brindle" },
  "Road Traveler": { src: worriedRoadTravelerPortrait, alt: "Portrait of a worried road traveler" },
  "Worried Road Traveler": { src: worriedRoadTravelerPortrait, alt: "Portrait of a worried road traveler" },
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
