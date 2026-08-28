const adaPortrait = new URL("../../assets/portraits/characters/ada-willowmarket-portrait-v02.webp", import.meta.url)
  .href;
const adaNoLensPortrait = new URL("../../assets/portraits/characters/ada-willowmarket-portrait-no-lens-v02.webp", import.meta.url)
  .href;
const eddenPortrait = new URL("../../assets/portraits/characters/edden-vale-portrait-v02.webp", import.meta.url).href;
const ennaPortrait = new URL("../../assets/portraits/characters/enna-portrait-v03.webp", import.meta.url).href;
const hollisPortrait = new URL("../../assets/portraits/characters/hollis-portrait-v02.webp", import.meta.url).href;
const lioPortrait = new URL("../../assets/portraits/characters/lio-brindle-portrait-v02.webp", import.meta.url).href;
const maraPortrait = new URL("../../assets/portraits/characters/mara-brindle-portrait-v02.webp", import.meta.url).href;
const mayorAnwenPortrait = new URL("../../assets/portraits/characters/mayor-anwen-portrait-v02.webp", import.meta.url)
  .href;
const elderBrynnPortrait = new URL("../../assets/portraits/characters/mira-portrait-v02.webp", import.meta.url).href;
const selaPortrait = new URL("../../assets/portraits/characters/miri-portrait-v03.webp", import.meta.url).href;
const mossPortrait = new URL("../../assets/portraits/characters/moss-portrait-v02.webp", import.meta.url).href;
const nellaPortrait = new URL("../../assets/portraits/characters/nella-portrait-v04.webp", import.meta.url).href;
const nixPortrait = new URL("../../assets/portraits/characters/nix-portrait-v02.webp", import.meta.url).href;
const pibblePortrait = new URL("../../assets/portraits/characters/pibble-portrait-v02.webp", import.meta.url).href;
const rowanPortrait = new URL("../../assets/portraits/characters/rowan-portrait-v03.webp", import.meta.url).href;
const smithOrinPortrait = new URL("../../assets/portraits/characters/smith-orin-portrait-v03.webp", import.meta.url)
  .href;
const tildaPortrait = new URL("../../assets/portraits/characters/tilda-portrait-v02.webp", import.meta.url).href;
const tomaPortrait = new URL("../../assets/portraits/characters/toma-fielding-portrait-v03.webp", import.meta.url).href;
const worriedRoadTravelerPortrait = new URL(
  "../../assets/portraits/characters/worried-road-traveler-portrait-v02.webp",
  import.meta.url,
).href;
const auntieLumePortrait = new URL(
  "../../assets/portraits/characters/auntie-lume-portrait-v03.webp",
  import.meta.url,
).href;
const bramwellGatehandPortrait = new URL(
  "../../assets/portraits/characters/bramwell-gatehand-portrait-v02.webp",
  import.meta.url,
).href;
const nomaGreenstillPortrait = new URL(
  "../../assets/portraits/characters/noma-greenstill-portrait-v03.webp",
  import.meta.url,
).href;
const tasmineRootbracePortrait = new URL(
  "../../assets/portraits/characters/tasmine-rootbrace-portrait-v01.webp",
  import.meta.url,
).href;
const quillPebbleturnPortrait = new URL(
  "../../assets/portraits/characters/quill-pebbleturn-portrait-v02.webp",
  import.meta.url,
).href;
const westrootRootbreadChildPortrait = new URL(
  "../../assets/portraits/characters/westroot-rootbread-child-portrait-v03.webp",
  import.meta.url,
).href;
const princessElowenPortrait = new URL(
  "../../assets/portraits/characters/princess-elowen-portrait-v02.webp",
  import.meta.url,
).href;
const queenIsaraPortrait = new URL(
  "../../assets/portraits/characters/queen-isara-portrait-v01.webp",
  import.meta.url,
).href;
const kingEdranPortrait = new URL(
  "../../assets/portraits/characters/king-edran-portrait-v01.webp",
  import.meta.url,
).href;
const brambleBoarPortrait = new URL(
  "../../assets/portraits/enemies/bramble-boar-v01.webp",
  import.meta.url,
).href;

export const DIALOGUE_PORTRAITS = {
  "Elder Brynn": { src: elderBrynnPortrait, alt: "Portrait of Elder Brynn" },
  "Pibble Thatch": { src: pibblePortrait, alt: "Portrait of Pibble Thatch" },
  "Nix Fernwhistle": { src: nixPortrait, alt: "Portrait of Nix Fernwhistle" },
  "Smith Orin": { src: smithOrinPortrait, alt: "Portrait of Smith Orin" },
  "Mayor Anwen": { src: mayorAnwenPortrait, alt: "Portrait of Mayor Anwen" },
  "Nella the Baker": { src: nellaPortrait, alt: "Portrait of Nella the Baker" },
  "Toma Fielding": { src: tomaPortrait, alt: "Portrait of Toma Fielding" },
  "Sela of the Loom": { src: selaPortrait, alt: "Portrait of Sela of the Loom" },
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
  "Bramwell Gatehand": { src: bramwellGatehandPortrait, alt: "Portrait of Bramwell Gatehand" },
  "Quill Pebbleturn": { src: quillPebbleturnPortrait, alt: "Portrait of Quill Pebbleturn" },
  "Auntie Lume": { src: auntieLumePortrait, alt: "Portrait of Auntie Lume" },
  "Noma Greenstill": { src: nomaGreenstillPortrait, alt: "Portrait of Noma Greenstill" },
  "Tasmine Rootbrace": { src: tasmineRootbracePortrait, alt: "Portrait of Tasmine Rootbrace in her Lower Gate smithy" },
  "Westroot Rootbread Child": {
    src: westrootRootbreadChildPortrait,
    alt: "Portrait of the Westroot Rootbread child",
  },
  "Princess Elowen": {
    src: princessElowenPortrait,
    alt: "Portrait of Princess Elowen studying a road map during her Royal Progress",
  },
  "Queen Isara": {
    src: queenIsaraPortrait,
    alt: "Portrait of Queen Isara presiding over the Chamber of Compacts",
  },
  "King Edran": {
    src: kingEdranPortrait,
    alt: "Portrait of King Edran seated in a Hearthvale council chamber",
  },
  "Rowan Reedshield": { src: rowanPortrait, alt: "Portrait of Rowan Reedshield" },
  "Tilda Quickstep": { src: tildaPortrait, alt: "Portrait of Tilda Quickstep" },
  "Moss Fenmere": { src: mossPortrait, alt: "Portrait of Moss Fenmere" },
  "Bramble Boar": { src: brambleBoarPortrait, alt: "Portrait of the charging Bramble Boar" },
};

export function getDialoguePortrait(name = "") {
  return DIALOGUE_PORTRAITS[name] || null;
}
