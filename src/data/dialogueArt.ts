export type DialogueSceneArt = {
  id: string;
  src: string;
  alt: string;
  focusX?: number;
  focusY?: number;
  zoom?: number;
  presentation?: "scene" | "emblem";
};

const courierSatchelScene = new URL(
  "../../assets/scenes/courier-satchel-evidence-scene-v01.webp",
  import.meta.url,
).href;
const watchhouseCaseWallScene = new URL(
  "../../assets/scenes/bramblecross-watchhouse-case-wall-scene-v01.webp",
  import.meta.url,
).href;
const rootCellarEvidenceWallScene = new URL(
  "../../assets/scenes/root-cellar-evidence-wall-scene-v01.webp",
  import.meta.url,
).href;
const chapterOneEndingScene = new URL(
  "../../assets/scenes/chapter-1-ending-the-road-that-lied-v01.webp",
  import.meta.url,
).href;
const briarCrownPrimaryMark = new URL(
  "../../assets/icons/ui/briar-crown-primary-mark-v01.png",
  import.meta.url,
).href;
const princessElowenRoyalPortrait = new URL(
  "../../assets/portraits/characters/princess-elowen-royal-portrait-v01.webp",
  import.meta.url,
).href;
const princessElowenProgressNotice = new URL(
  "../../assets/scenes/princess-elowen-progress-notice-v01.webp",
  import.meta.url,
).href;
const relayForgedAuthorityScene = new URL(
  "../../assets/scenes/relay-forged-authority-scene-v01.webp",
  import.meta.url,
).href;
const briarholdRouteLedgerRevealScene = new URL(
  "../../assets/scenes/briarhold-route-ledger-reveal-scene-v02.webp",
  import.meta.url,
).href;

export const DIALOGUE_SCENE_ART: Record<string, DialogueSceneArt> = {
  chapterOneEnding: {
    id: "chapter-one-ending",
    src: chapterOneEndingScene,
    alt: "The defeated Briar Knot Warden collapsed before the sealed old-road door beneath Bramblecross",
  },
  courierSatchel: {
    id: "courier-satchel",
    src: courierSatchelScene,
    alt: "Lio Brindle's scuffed courier satchel, false seal, brass badge, and blue-string lunch packet",
  },
  watchhouseCaseWall: {
    id: "watchhouse-case-wall",
    src: watchhouseCaseWallScene,
    alt: "The completed Bramblecross Watchhouse case wall, route map, ledger, and forged-order file",
  },
  watchhouseEvidenceBoard: {
    id: "watchhouse-evidence-board",
    src: watchhouseCaseWallScene,
    alt: "The Bramblecross evidence board connecting false notices, road incidents, and cellar reports",
    focusX: 25,
    focusY: 42,
    zoom: 175,
  },
  watchhouseDutyLedger: {
    id: "watchhouse-duty-ledger",
    src: watchhouseCaseWallScene,
    alt: "The watchhouse duty ledger opened to altered route assignments",
    focusX: 38,
    focusY: 76,
    zoom: 210,
  },
  watchhouseWallMap: {
    id: "watchhouse-wall-map",
    src: watchhouseCaseWallScene,
    alt: "The watchhouse wall map marked with public roads and older half-erased routes",
    focusX: 73,
    focusY: 38,
    zoom: 170,
  },
  watchhouseForgedOrders: {
    id: "watchhouse-forged-orders",
    src: watchhouseCaseWallScene,
    alt: "A tied file of copied orders bearing crooked red wax over older green Willow seals",
    focusX: 72,
    focusY: 78,
    zoom: 215,
  },
  rootCellarEvidenceWall: {
    id: "root-cellar-evidence-wall",
    src: rootCellarEvidenceWallScene,
    alt: "A recent coercive root sigil painted beside an older communal route mural",
  },
  rootCellarSigil: {
    id: "root-cellar-sigil",
    src: rootCellarEvidenceWallScene,
    alt: "A recent dark-green root sigil bending a road away from its true path",
    focusX: 25,
    focusY: 50,
    zoom: 175,
  },
  rootCellarMural: {
    id: "root-cellar-mural",
    src: rootCellarEvidenceWallScene,
    alt: "An old communal mural connecting Bramblecross storehouses, cellars, and underground routes",
    focusX: 75,
    focusY: 50,
    zoom: 175,
  },
  briarCrownMark: {
    id: "briar-crown-mark",
    src: briarCrownPrimaryMark,
    alt: "A counterfeit crown assembled from five crooked briar points, red wax, and an overwritten road slat",
    presentation: "emblem",
  },
  princessElowenRoyalPortrait: {
    id: "princess-elowen-royal-portrait",
    src: princessElowenRoyalPortrait,
    alt: "Princess Elowen in her sapphire royal gown on a palace garden terrace",
    focusX: 50,
    focusY: 50,
    zoom: 66,
  },
  princessElowenProgressNotice: {
    id: "princess-elowen-progress-notice",
    src: princessElowenProgressNotice,
    alt: "The Royal Progress notice showing Princess Elowen in sapphire royal attire above the public limits of her route authority",
    focusX: 50,
    focusY: 50,
    zoom: 66,
  },
  relayForgedAuthority: {
    id: "relay-forged-authority",
    src: relayForgedAuthorityScene,
    alt: "The Relay desk comparing Princess Elowen's public Royal Progress notice with the false ledger and forged secret orders hidden beneath it",
  },
  briarholdRouteLedgerReveal: {
    id: "briarhold-route-ledger-reveal",
    src: briarholdRouteLedgerRevealScene,
    alt: "The scorched westbound ledger naming Lio alive and bound for Briarhold Waystation, with gold and sickly green route lights visible beyond the signal slit",
  },
};

export function getDialogueSceneArt(artKey?: string | null) {
  return artKey ? DIALOGUE_SCENE_ART[artKey] || null : null;
}
