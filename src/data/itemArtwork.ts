export type ItemArtwork = {
  src: string;
  alt: string;
};

const oldHatchetIcon = new URL("../../assets/icons/items/old-hatchet-icon-v01.png", import.meta.url).href;
const turnipwoodBladeIcon = new URL("../../assets/icons/items/turnipwood-blade-icon-v01.png", import.meta.url).href;
const pebbleknockHammerIcon = new URL("../../assets/icons/items/pebbleknock-hammer-icon-v02.png", import.meta.url).href;
const apprenticeKettleHelmIcon = new URL("../../assets/icons/items/apprentice-kettle-helm-icon-v01.png", import.meta.url).href;
const briarweaveVestIcon = new URL("../../assets/icons/items/briarweave-vest-icon-v01.png", import.meta.url).href;
const giggleleafCloakIcon = new URL("../../assets/icons/items/giggleleaf-cloak-icon-v01.png", import.meta.url).href;
const friendmakerCloakIcon = new URL("../../assets/icons/items/friendmaker-cloak-icon-v01.png", import.meta.url).href;
const stormbellCharmIcon = new URL("../../assets/icons/items/stormbell-charm-icon-v01.png", import.meta.url).href;
const lanternPinIcon = new URL("../../assets/icons/items/lantern-pin-icon-v01.png", import.meta.url).href;
const wardenChainIcon = new URL("../../assets/icons/items/warden-chain-icon-v01.png", import.meta.url).href;
const eddensBlueWatchClothIcon = new URL("../../assets/icons/items/eddens-blue-watch-cloth-icon-v01.png", import.meta.url).href;
const eddensThreeDoorDrawingIcon = new URL(
  "../../assets/icons/items/eddens-three-door-drawing-icon-v02.png",
  import.meta.url,
).href;
const willowmarkLensIcon = new URL("../../assets/icons/items/willowmark-lens-icon-v01.png", import.meta.url).href;
const brokenFalseSealWaxIcon = new URL("../../assets/icons/items/broken-false-seal-wax-icon-v01.png", import.meta.url)
  .href;
const pinePitchWaxIcon = new URL("../../assets/icons/items/pine-pitch-wax-icon-v01.png", import.meta.url).href;
const noHandleTokenIcon = new URL("../../assets/icons/items/no-handle-token-icon-v01.png", import.meta.url).href;
const witnessNoteForBramblecrossIcon = new URL(
  "../../assets/icons/items/witness-note-for-bramblecross-icon-v01.png",
  import.meta.url,
).href;
const healingFizzpopIcon = new URL("../../assets/icons/items/healing-fizzpop-icon-v01.png", import.meta.url).href;
const trailSnackIcon = new URL("../../assets/icons/items/trail-snack-icon-v01.png", import.meta.url).href;
const fizzberryHandpieIcon = new URL("../../assets/icons/items/fizzberry-handpie-icon-v01.png", import.meta.url).href;
const bubbleburstTonicIcon = new URL("../../assets/icons/items/bubbleburst-tonic-icon-v01.png", import.meta.url).href;
const moonmintIcon = new URL("../../assets/icons/items/moonmint-icon-v01.png", import.meta.url).href;
const bubblecapMushroomIcon = new URL("../../assets/icons/items/bubblecap-mushroom-icon-v01.png", import.meta.url).href;
const rootbreadCharmIcon = new URL("../../assets/icons/items/rootbread-charm-icon-v01.png", import.meta.url).href;
const witnessStoneRubbingIcon = new URL(
  "../../assets/icons/items/witness-stone-rubbing-icon-v02.png",
  import.meta.url,
).href;
const cargoTransferTagIcon = new URL(
  "../../assets/icons/items/cargo-transfer-tag-icon-v02.png",
  import.meta.url,
).href;
const splitCrownSlatIcon = new URL(
  "../../assets/icons/map-tokens/crown-den-slat-rack-broken-token-v01.png",
  import.meta.url,
).href;
const briarSignmakerLedgerIcon = new URL(
  "../../assets/icons/map-tokens/crown-den-witness-ledger-token-v01.png",
  import.meta.url,
).href;
const cleanedLanternMarkIcon = new URL(
  "../../assets/icons/map-tokens/crown-den-false-map-cleared-token-v01.png",
  import.meta.url,
).href;

// Production item icons should live in assets/icons/items/ and be registered here.
// Keep ITEM_DB emoji values as fallbacks for missing or broken artwork.
export const ITEM_ARTWORK: Record<string, ItemArtwork> = {
  old_hatchet: {
    src: oldHatchetIcon,
    alt: "Painted icon of the Old Hatchet",
  },
  turnipwood_blade: {
    src: turnipwoodBladeIcon,
    alt: "Painted icon of the Turnipwood Blade",
  },
  pebbleknock_hammer: {
    src: pebbleknockHammerIcon,
    alt: "Painted icon of the Pebbleknock Hammer",
  },
  kettle_helm: {
    src: apprenticeKettleHelmIcon,
    alt: "Painted icon of the Apprentice Kettle Helm",
  },
  briar_vest: {
    src: briarweaveVestIcon,
    alt: "Painted icon of the Briarweave Vest",
  },
  giggleleaf_cloak: {
    src: giggleleafCloakIcon,
    alt: "Painted icon of the Giggleleaf Cloak",
  },
  friendmaker_cloak: {
    src: friendmakerCloakIcon,
    alt: "Painted icon of the Friendmaker Cloak",
  },
  stormbell_charm: {
    src: stormbellCharmIcon,
    alt: "Painted icon of the Stormbell Charm",
  },
  lantern_pin: {
    src: lanternPinIcon,
    alt: "Painted icon of the Lantern Pin",
  },
  warden_chain: {
    src: wardenChainIcon,
    alt: "Painted icon of the Warden Chain",
  },
  edden_cloth: {
    src: eddensBlueWatchClothIcon,
    alt: "Painted icon of Edden's Blue Watch Cloth",
  },
  eddens_three_door_drawing: {
    src: eddensThreeDoorDrawingIcon,
    alt: "Painted icon of Edden's Three-Door Drawing",
  },
  willowmark_lens: {
    src: willowmarkLensIcon,
    alt: "Painted icon of the Willowmark Lens",
  },
  broken_false_seal_wax: {
    src: brokenFalseSealWaxIcon,
    alt: "Painted icon of the Broken False Seal Wax",
  },
  pine_pitch_wax: {
    src: pinePitchWaxIcon,
    alt: "Painted icon of the Pine-Pitch Wax",
  },
  no_handle_token: {
    src: noHandleTokenIcon,
    alt: "Painted icon of the No-Handle Token",
  },
  witness_note_bramblecross: {
    src: witnessNoteForBramblecrossIcon,
    alt: "Painted icon of the Witness Note for Bramblecross",
  },
  witness_note_for_bramblecross: {
    src: witnessNoteForBramblecrossIcon,
    alt: "Painted icon of the Witness Note for Bramblecross",
  },
  healing_fizzpop: {
    src: healingFizzpopIcon,
    alt: "Painted icon of the Healing Fizzpop",
  },
  trail_snack: {
    src: trailSnackIcon,
    alt: "Painted icon of the Trail Snack",
  },
  fizzberry_handpie: {
    src: fizzberryHandpieIcon,
    alt: "Painted icon of the Fizzberry Handpie",
  },
  bubbleburst_tonic: {
    src: bubbleburstTonicIcon,
    alt: "Painted icon of the Bubbleburst Tonic",
  },
  moonmint: {
    src: moonmintIcon,
    alt: "Painted icon of Moonmint",
  },
  bubblecap: {
    src: bubblecapMushroomIcon,
    alt: "Painted icon of the Bubblecap Mushroom",
  },
  rootbread_charm: {
    src: rootbreadCharmIcon,
    alt: "Painted icon of the Rootbread Charm",
  },
  witness_stone_rubbing: {
    src: witnessStoneRubbingIcon,
    alt: "Painted icon of the Witness Stone Rubbing",
  },
  cargo_transfer_tag: {
    src: cargoTransferTagIcon,
    alt: "Painted icon of the Cargo Transfer Tag",
  },
  split_crown_slat: {
    src: splitCrownSlatIcon,
    alt: "Painted token of the broken Split Crown Slat",
  },
  briar_signmaker_ledger: {
    src: briarSignmakerLedgerIcon,
    alt: "Painted token of the Briar Signmaker's Ledger",
  },
  cleaned_lantern_mark: {
    src: cleanedLanternMarkIcon,
    alt: "Painted token of the Cleaned Lantern Mark",
  },
};

export function getItemArtwork(itemId?: string | null) {
  if (!itemId) return null;
  return ITEM_ARTWORK[itemId] || null;
}
