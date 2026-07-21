import { useEffect, useRef, useState } from "react";
import { HERO_GROWTH_OPTIONS } from "../data/character";
import { COMPANION_OPTIONS } from "../data/companions";
import { getDialogueSceneArt } from "../data/dialogueArt";
import { getHeroGrowthArtwork } from "../data/growthArtwork";
import { BATTLE_CONSUMABLES, ITEM_DB } from "../data/items";
import { MAPS } from "../data/maps";
import { getDialoguePortrait } from "../data/portraits";
import { RECIPE_DB } from "../data/recipes";
import {
  getCompanionCommandHint,
  isCompanionConscious,
} from "../game/companions";
import { checkSummary, resolveSkillCheck } from "../game/dice";
import { canCraftRecipe, formatIngredients, gainItem, getBuyPrice, getItemHighlights, getSellPrice } from "../game/inventory";
import { formatSaveTimestamp } from "../game/save";
import { formatBonuses, getDerivedStats } from "../game/stats";
import { appendChapter1CompanionReaction } from "../story/chapter1";
import { Button, ChoiceButton, ItemIcon, Meter } from "./ui";
import { HeroArtwork } from "./HeroArtwork";
import { CompanionPortrait } from "./CompanionPortrait";

const willowmarkSeal = new URL(
  "../../assets/icons/ui/willowmark-seal-v02.png",
  import.meta.url,
).href;

function useModalAccessibility(close?: () => void) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const modal = modalRef.current;
    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const firstFocusable = modal?.querySelector<HTMLElement>(focusableSelector);
    (firstFocusable || modal)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeRef.current) {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab" || !modal) return;
      const focusable = Array.from(modal.querySelectorAll<HTMLElement>(focusableSelector));
      if (!focusable.length) {
        event.preventDefault();
        modal.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, []);

  return modalRef;
}

const threeDoorsThresholdScene = new URL(
  "../../assets/scenes/three-doors-threshold-v01.webp",
  import.meta.url,
).href;
const crownDoorCloseupScene = new URL(
  "../../assets/scenes/crown-door-closeup-v01.webp",
  import.meta.url,
).href;
const lanternDoorCloseupScene = new URL(
  "../../assets/scenes/lantern-door-closeup-v01.webp",
  import.meta.url,
).href;
const noHandleDoorCloseupScene = new URL(
  "../../assets/scenes/no-handle-door-closeup-v01.webp",
  import.meta.url,
).href;

type MapInteractionVignetteConfig = {
  src: string;
  alt: string;
  fallback: string;
  focusX: number;
  focusY: number;
  zoom: number;
};

const MAP_INTERACTION_VIGNETTES: Record<string, MapInteractionVignetteConfig> = {
  hearthHome: {
    src: MAPS.hearthhollow.backgroundImage,
    alt: "Painted map detail of the familiar Hearthhollow home entrance",
    fallback: "Home entrance",
    focusX: 27,
    focusY: 27,
    zoom: 230,
  },
  hearthSmithy: {
    src: MAPS.hearthhollow.backgroundImage,
    alt: "Painted map detail of the smithy's anvil and glowing entrance",
    fallback: "Smithy entrance",
    focusX: 74,
    focusY: 33,
    zoom: 215,
  },
  hearthPotionShed: {
    src: MAPS.hearthhollow.backgroundImage,
    alt: "Painted map detail of the potion shed and its outdoor bottles",
    fallback: "Potion shed",
    focusX: 12,
    focusY: 56,
    zoom: 225,
  },
  hearthWell: {
    src: MAPS.hearthhollow.backgroundImage,
    alt: "Painted map detail of the stone village well",
    fallback: "Village well",
    focusX: 50,
    focusY: 44,
    zoom: 235,
  },
  hearthSouthGate: {
    src: MAPS.hearthhollow.backgroundImage,
    alt: "Painted map detail of Hearthhollow's lantern-lit south gate",
    fallback: "South gate",
    focusX: 50,
    focusY: 80,
    zoom: 210,
  },
  lanternPond: {
    src: MAPS.lanternRoad.backgroundImage,
    alt: "Painted map detail of the water and reeds beside Lantern Road",
    fallback: "Pond edge",
    focusX: 18,
    focusY: 72,
    zoom: 185,
  },
  lanternMilestone: {
    src: MAPS.lanternRoad.backgroundImage,
    alt: "Painted map detail of the ruined milestone beside Lantern Road",
    fallback: "Milestone ruin",
    focusX: 57,
    focusY: 18,
    zoom: 210,
  },
  lanternCart: {
    src: MAPS.lanternRoad.backgroundImage,
    alt: "Painted map detail of the abandoned cart on Lantern Road",
    fallback: "Broken cart",
    focusX: 84,
    focusY: 22,
    zoom: 210,
  },
  lanternCamp: {
    src: MAPS.lanternRoad.backgroundImage,
    alt: "Painted map detail of the sheltered road camp and firepit",
    fallback: "Road camp",
    focusX: 51,
    focusY: 48,
    zoom: 205,
  },
  lanternShrine: {
    src: MAPS.lanternRoad.backgroundImage,
    alt: "Painted map detail of the lantern shrine in the trees",
    fallback: "Lantern shrine",
    focusX: 24,
    focusY: 18,
    zoom: 215,
  },
  lanternCache: {
    src: MAPS.lanternRoad.backgroundImage,
    alt: "Painted map detail of the roadside supply cache",
    fallback: "Road cache",
    focusX: 83,
    focusY: 47,
    zoom: 215,
  },
  brambleInn: {
    src: MAPS.bramblecross.backgroundImage,
    alt: "Painted map detail of the Bramblecross inn entrance",
    fallback: "Bramblecross Inn",
    focusX: 20,
    focusY: 25,
    zoom: 220,
  },
  brambleWatchhouse: {
    src: MAPS.bramblecross.backgroundImage,
    alt: "Painted map detail of the Bramblecross watchhouse entrance",
    fallback: "Watchhouse",
    focusX: 50,
    focusY: 24,
    zoom: 220,
  },
  brambleMarket: {
    src: MAPS.bramblecross.backgroundImage,
    alt: "Painted map detail of the Willow Market entrance",
    fallback: "Willow Market",
    focusX: 79,
    focusY: 26,
    zoom: 220,
  },
  brambleGate: {
    src: MAPS.bramblecross.backgroundImage,
    alt: "Painted map detail of the main gate into Bramblecross",
    fallback: "Bramblecross gate",
    focusX: 50,
    focusY: 82,
    zoom: 190,
  },
  rootCellarDoor: {
    src: MAPS.rootCellar.backgroundImage,
    alt: "Painted map detail of the sealed iron door in the Old Root Cellar",
    fallback: "Sealed iron door",
    focusX: 86,
    focusY: 42,
    zoom: 225,
  },
};

function dialogueArtCrop(artKey, id, focusX, focusY, zoom) {
  const art = getDialogueSceneArt(artKey);
  return art ? { ...art, id, focusX, focusY, zoom } : null;
}

const WATCHHOUSE_EVIDENCE_ART = {
  missingPorters: dialogueArtCrop("watchhouseDutyLedger", "watchhouse-card-missing-porters", 38, 76, 230),
  copiedOrders: dialogueArtCrop("watchhouseForgedOrders", "watchhouse-card-copied-orders", 72, 78, 230),
  supplyDelays: {
    id: "watchhouse-card-supply-delays",
    src: MAPS.bramblecross.backgroundImage,
    alt: "Carts, crates, and market stalls in Bramblecross",
    focusX: 77,
    focusY: 48,
    zoom: 270,
  },
  lioSatchel: dialogueArtCrop("courierSatchel", "watchhouse-card-lio-satchel", 66, 50, 145),
  plantedOrder: {
    id: "watchhouse-card-planted-order",
    src: MAPS.lanternRoad.backgroundImage,
    alt: "The ruined milestone where a planted order was hidden",
    focusX: 57,
    focusY: 18,
    zoom: 275,
  },
  willowSeal: {
    id: "watchhouse-card-willow-seal",
    src: willowmarkSeal,
    alt: "Ada Willowmarket's green three-leaf cargo seal on a crate, with a tiny identifying nick in the left leaf",
    focusX: 50,
    focusY: 48,
    zoom: 112,
  },
  rootCellar: {
    id: "watchhouse-card-root-cellar",
    src: MAPS.rootCellar.backgroundImage,
    alt: "The lantern-lit entrance stairs into the Old Root Cellar",
    focusX: 14,
    focusY: 13,
    zoom: 285,
  },
  falseCrown: getDialogueSceneArt("briarCrownMark"),
};

function GrowthEmblem({ growth }) {
  const artwork = getHeroGrowthArtwork(growth.id);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => setImageFailed(false), [growth.id, artwork?.src]);

  return (
    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/55 text-3xl md:h-24 md:w-full">
      {!artwork || imageFailed ? <span aria-hidden="true">{growth.icon}</span> : null}
      {artwork && !imageFailed ? (
        <img
          src={artwork.src}
          alt={artwork.alt}
          className="absolute inset-0 h-full w-full object-contain p-1.5"
          onError={() => setImageFailed(true)}
        />
      ) : null}
    </div>
  );
}

export function LevelUpModal({ player, target, choose }) {
  const modalRef = useModalAccessibility();
  return <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 p-4 sm:items-center">
    <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="level-up-title" tabIndex={-1} className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-sky-300/20 bg-slate-900 p-5 shadow-2xl">
      <div className="text-center">
        <div id="level-up-title" className="text-3xl font-bold">Level Up!</div>
        <div className="mt-1 text-white/70">{player.name} reached Level {(player.level || 1) + 1}. XP {player.xp}/{target}</div>
        <div className="mt-3 rounded-2xl border border-sky-300/20 bg-sky-400/10 p-3 text-sm text-white/80">Every level gives <span className="font-semibold text-sky-200">Max HP +4</span> and <span className="font-semibold text-sky-200">Current HP +4</span>. Choose how your hero grows.</div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {HERO_GROWTH_OPTIONS.map((growth) => <button key={growth.id} onClick={() => choose(growth)} className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-3 text-left transition hover:border-sky-300/40 hover:bg-sky-400/10 md:block md:p-4">
          <GrowthEmblem growth={growth} />
          <div className="min-w-0 md:mt-3">
            <div className="text-lg font-semibold">{growth.name}</div>
            <div className="mt-1 text-sm text-emerald-300">{formatBonuses(growth.bonuses)}</div>
            <div className="mt-2 text-xs leading-5 text-white/70">{growth.description}</div>
          </div>
        </button>)}
      </div>
    </div>
  </div>;
}

function DialogueVisual({ kind, compact = false }) {
  const doors = [
    {
      key: "crownDoor",
      title: "Crown Door",
      mark: "Crown",
      src: crownDoorCloseupScene,
      alt: "Painted closeup of the thorn-crowned red Crown Door",
    },
    {
      key: "lanternDoor",
      title: "Lantern Door",
      mark: "Lantern",
      src: lanternDoorCloseupScene,
      alt: "Painted closeup of the Lantern Door glowing under roots",
    },
    {
      key: "noHandleDoor",
      title: "No-Handle Door",
      mark: "No handle",
      src: noHandleDoorCloseupScene,
      alt: "Painted closeup of the smooth No-Handle Door",
    },
  ];
  const singleDoor = {
    crownDoor: {
      title: "Crown Door",
      mark: "Crown",
      src: crownDoorCloseupScene,
      alt: "Painted closeup of the thorn-crowned red Crown Door",
    },
    lanternDoor: {
      title: "Lantern Door",
      mark: "Lantern",
      src: lanternDoorCloseupScene,
      alt: "Painted closeup of the Lantern Door glowing under roots",
    },
    noHandleDoor: {
      title: "No-Handle Door",
      mark: "No handle",
      src: noHandleDoorCloseupScene,
      alt: "Painted closeup of the smooth No-Handle Door",
    },
  }[kind];

  if (kind === "threeDoors")
    return (
      <div className="mt-4 rounded-3xl border border-emerald-300/20 bg-emerald-950/30 p-4">
        <figure className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <img
            src={threeDoorsThresholdScene}
            alt="Painted threshold with the Crown, Lantern, and No-Handle Doors"
            className="aspect-video w-full object-cover object-[center_58%]"
          />
        </figure>
        <div className="grid gap-3 sm:grid-cols-3">
          {doors.map((door) => (
            <figure
              key={door.key}
              className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black/20"
            >
              <img
                src={door.src}
                alt={door.alt}
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="border-t border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-white/75">
                {door.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    );

  if (!singleDoor) return null;

  return (
    <figure
      className={`${compact ? "mt-0 rounded-2xl" : "mt-4 rounded-3xl"} overflow-hidden border border-emerald-300/20 bg-emerald-950/30`}
    >
      <img
        data-testid={`dialogue-visual-${kind}`}
        src={singleDoor.src}
        alt={singleDoor.alt}
        className={`${compact ? "max-h-[22rem]" : "max-h-[58vh]"} aspect-[4/3] w-full object-cover`}
      />
    </figure>
  );
}

function DialogueSceneImage({ image, compact = false }) {
  if (!image?.src) return null;

  const focusX = image.focusX ?? 50;
  const focusY = image.focusY ?? 50;
  const zoom = image.zoom ?? 100;
  const isEmblem = image.presentation === "emblem";

  return (
    <figure
      data-art-key={image.id}
      className={`relative overflow-hidden rounded-xl border border-white/10 ${compact ? "mt-0" : "mt-4"} ${isEmblem ? "aspect-[5/2] bg-[radial-gradient(circle_at_center,_rgba(127,29,29,0.28),_rgba(2,6,23,0.72)_68%)]" : "aspect-video bg-black/20"}`}
    >
      <img
        data-testid="dialogue-scene-image"
        src={image.src}
        alt={image.alt || ""}
        className={isEmblem ? "absolute inset-0 h-full w-full object-contain p-5 sm:p-7" : "absolute left-1/2 top-1/2 h-auto max-w-none"}
        style={isEmblem ? undefined : {
          width: `${zoom}%`,
          transform: `translate(-${focusX}%, -${focusY}%)`,
        }}
      />
      <div className={`pointer-events-none absolute inset-0 ${isEmblem ? "bg-gradient-to-t from-slate-950/20 via-transparent to-red-950/10" : "bg-gradient-to-t from-slate-950/20 via-transparent to-black/10"}`} />
    </figure>
  );
}

function DialogueMapVignette({ kind }) {
  const [imageFailed, setImageFailed] = useState(false);
  const vignette = MAP_INTERACTION_VIGNETTES[kind];

  useEffect(() => setImageFailed(false), [kind]);

  if (!vignette) return null;

  return (
    <figure
      data-testid="dialogue-map-vignette"
      role="img"
      aria-label={vignette.alt}
      className="relative mt-3 h-32 overflow-hidden rounded-2xl border border-amber-100/15 bg-slate-950 shadow-inner sm:h-52"
    >
      {imageFailed ? (
        <div className="flex h-full items-center justify-center bg-amber-950/30 px-4 text-center text-sm font-semibold text-amber-100/70">
          {vignette.fallback}
        </div>
      ) : (
        <img
          src={vignette.src}
          alt=""
          aria-hidden="true"
          onError={() => setImageFailed(true)}
          className="absolute left-1/2 top-1/2 h-auto max-w-none"
          style={{
            width: `${vignette.zoom}%`,
            transform: `translate(-${vignette.focusX}%, -${vignette.focusY}%)`,
          }}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-black/10" />
    </figure>
  );
}

export function DialogueModal({ dialogue, close }) {
  const portraitAsset = getDialoguePortrait(dialogue.portraitName || dialogue.name);
  const portraitImage = dialogue.portraitImage;
  const sceneImage = dialogue.sceneImage || getDialogueSceneArt(dialogue.artKey);
  const hasMapVignette = Boolean(MAP_INTERACTION_VIGNETTES[dialogue.mapVignette]);
  const showPortrait = Boolean(portraitImage || portraitAsset) && !hasMapVignette && !dialogue.visual && !sceneImage;
  const usesSplitVisual = dialogue.contentLayout === "split" && Boolean(dialogue.visual);
  const usesStackedScene = dialogue.contentLayout === "stacked" && Boolean(sceneImage);
  const usesSplitScene = Boolean(sceneImage) && !usesStackedScene;
  const widthClass = dialogue.size === "wide" || dialogue.visual || sceneImage ? "max-w-5xl" : "max-w-3xl";
  const choiceRows = dialogue.choices.reduce((rows, choice, index) => {
    const choiceGroup = dialogue.choiceLayout === "grouped" ? choice.choiceGroup : null;
    const existingRow = choiceGroup ? rows.find((row) => row.group === choiceGroup) : null;
    if (existingRow) {
      existingRow.choices.push(choice);
      return rows;
    }
    rows.push({
      id: choiceGroup ? `group-${choiceGroup}` : `choice-${index}`,
      group: choiceGroup,
      choices: [choice],
    });
    return rows;
  }, []);
  const scrollRef = useRef(null);
  const modalRef = useModalAccessibility(close);
  const dialogueCopy = (
    <div data-testid="dialogue-copy" className="min-w-0">
      {dialogue.messages ? <div className="mt-3 space-y-2">{dialogue.messages.map((m, i) => <div key={`${m.speaker}-${i}`} className={`flex ${m.side === "right" ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 text-base leading-7 ${m.side === "right" ? "bg-emerald-500/20" : "bg-white/10 text-white/85"}`}><div className="mb-1 text-[10px] uppercase tracking-wide text-white/50">{m.speaker}</div><div>{m.text}</div></div></div>)}</div> : <div className="mt-2 whitespace-pre-line text-base leading-7 text-white/85">{dialogue.text}</div>}
      {dialogue.feedback ? <div role="status" data-testid="dialogue-feedback" className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-100">{dialogue.feedback}</div> : null}
    </div>
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [dialogue.name, dialogue.text, dialogue.feedback, dialogue.visual, dialogue.mapVignette, sceneImage?.src, dialogue.messages?.length]);

  const dialogueChoices = (
    <div
      data-testid="dialogue-choices"
      className="mt-5 grid gap-2 border-t border-white/10 pt-4"
    >
      {choiceRows.map((row) => {
        const responsiveColumns = row.choices.length >= 4
          ? "sm:grid-cols-2 lg:grid-cols-4"
          : row.choices.length === 3
            ? "sm:grid-cols-2 lg:grid-cols-3"
            : row.choices.length === 2
              ? "sm:grid-cols-2"
              : "grid-cols-1";
        return (
          <div
            key={row.id}
            data-testid={row.group ? `dialogue-choice-group-${row.group}` : undefined}
            className={`grid grid-cols-1 gap-2 ${responsiveColumns}`}
          >
            {row.choices.map((choice, i) => (
              <ChoiceButton
                key={`${choice.label}-${i}`}
                choice={choice}
                onChoose={(selected) => selected.effect?.()}
              />
            ))}
          </div>
        );
      })}
    </div>
  );

  return <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-4 sm:items-center">
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialogue-title"
      data-content-layout={usesStackedScene ? "stacked" : usesSplitScene || usesSplitVisual ? "split" : "standard"}
      tabIndex={-1}
      className={`flex max-h-[85vh] w-full ${widthClass} flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 p-5 shadow-2xl`}
    >
      <div ref={scrollRef} data-testid="dialogue-scroll-region" className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className={showPortrait ? "flex items-start gap-4" : "block"}>
          {showPortrait ? <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-white/10 text-4xl">
            <span className={portraitImage || portraitAsset ? "opacity-0" : ""}>{dialogue.portrait}</span>
            {portraitImage ? <img src={portraitImage.src} alt={portraitImage.alt || ""} onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.previousElementSibling?.classList.remove("opacity-0"); }} className="absolute inset-0 h-full w-full object-contain p-2" /> : null}
            {!portraitImage && portraitAsset ? <img src={portraitAsset.src} alt={portraitAsset.alt} onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.previousElementSibling?.classList.remove("opacity-0"); }} className="absolute inset-0 h-full w-full object-cover" /> : null}
          </div> : null}
          <div className="min-w-0 flex-1">
            <div id="dialogue-title" className="text-xl font-semibold">{dialogue.name}</div>
            {hasMapVignette ? <DialogueMapVignette kind={dialogue.mapVignette} /> : null}
            {sceneImage && !usesSplitScene ? <DialogueSceneImage image={sceneImage} /> : null}
            {usesSplitScene ? (
              <div className="mt-3 grid gap-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-start">
                <div className="order-2 md:order-1">
                  <DialogueSceneImage image={sceneImage} compact />
                </div>
                <div className="order-1 md:order-2">{dialogueCopy}</div>
              </div>
            ) : usesSplitVisual ? (
              <div className="mt-3 grid gap-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-start">
                <DialogueVisual kind={dialogue.visual} compact />
                {dialogueCopy}
              </div>
            ) : (
              <>
                {dialogue.visual ? <DialogueVisual kind={dialogue.visual} /> : null}
                {dialogueCopy}
              </>
            )}
          </div>
        </div>
        {usesStackedScene ? dialogueChoices : null}
      </div>
      {!usesStackedScene ? dialogueChoices : null}
    </div>
  </div>;
}

function WatchhousePersonButton({ portraitName, displayName = portraitName, role, fallback, onClick, testId }) {
  const portrait = getDialoguePortrait(portraitName);
  return (
    <button
      type="button"
      data-testid={testId}
      aria-label={`Talk with ${displayName}`}
      onClick={onClick}
      className="storybook-button flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 text-left text-white transition hover:border-emerald-200/25 hover:bg-white/15"
    >
      <span className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 text-2xl">
        <span aria-hidden="true" className={portrait ? "opacity-0" : ""}>{fallback}</span>
        {portrait ? (
          <img
            src={portrait.src}
            alt={portrait.alt}
            className="absolute inset-0 h-full w-full object-cover object-top"
            onError={(event) => {
              event.currentTarget.style.display = "none";
              event.currentTarget.previousElementSibling?.classList.remove("opacity-0");
            }}
          />
        ) : null}
      </span>
      <span className="min-w-0">
        <span className="block text-base font-semibold">{displayName}</span>
        <span className="mt-0.5 block text-xs uppercase tracking-wide text-emerald-200/75">{role}</span>
        <span className="mt-2 block text-sm text-white/75">Talk with {displayName}</span>
      </span>
    </button>
  );
}

function EvidenceThumbnail({ image, fallback }) {
  if (!image?.src) {
    return <div className="flex h-20 items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/15 px-3 text-center text-xs font-semibold uppercase tracking-wide text-white/40">{fallback}</div>;
  }

  const focusX = image.focusX ?? 50;
  const focusY = image.focusY ?? 50;
  const zoom = image.zoom ?? 100;
  const isEmblem = image.presentation === "emblem";

  return (
    <figure
      data-art-key={image.id}
      role="img"
      aria-label={image.alt || fallback}
      className={`relative h-20 overflow-hidden rounded-2xl border border-white/10 ${isEmblem ? "bg-[radial-gradient(circle_at_center,_rgba(127,29,29,0.28),_rgba(2,6,23,0.8)_68%)]" : "bg-black/20"}`}
    >
      <span className="absolute inset-0 flex items-center justify-center px-3 text-center text-xs text-white/35 opacity-0">{fallback}</span>
      <img
        src={image.src}
        alt=""
        className={isEmblem ? "absolute inset-0 h-full w-full object-contain p-2" : "absolute left-1/2 top-1/2 h-auto max-w-none"}
        style={isEmblem ? undefined : {
          width: `${zoom}%`,
          transform: `translate(-${focusX}%, -${focusY}%)`,
        }}
        onError={(event) => {
          event.currentTarget.style.display = "none";
          event.currentTarget.previousElementSibling?.classList.remove("opacity-0");
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-black/10" />
    </figure>
  );
}

function EvidenceCard({ title, description, image = null, placeholder = null, accent = false }) {
  return (
    <article className={`rounded-3xl border p-4 ${accent ? "border-fuchsia-300/20 bg-fuchsia-400/10" : "border-white/10 bg-black/20"}`}>
      <EvidenceThumbnail image={image} fallback={placeholder || title} />
      <div className="mt-3 font-semibold">{title}</div>
      <div className="mt-1 text-xs text-white/60">{description}</div>
    </article>
  );
}

export function InteriorModal({ scene, close, flags, setFlags, player, setPlayer, companion, setCompanion, setActiveCompanion, dismissCompanion, saveGame, announce, setShopOpen, setCraftOpen, setDialogue, openClerkDialogue, openCaptainDialogue, openChapter2Briefing, openMaraChapter2Dialogue, openEddenRecoveryDialogue }) {
  const modalRef = useModalAccessibility(close);
  const knowsEdden = Boolean(
    flags.heardAboutEdden ||
    flags.askedHollisAboutEdden ||
    flags.gotDungeonLead ||
    flags.enteredRootCellar ||
    flags.chapterOneClear ||
    flags.chapterReported,
  );
  const getRecruitmentScene = (option) => {
    const scenes = {
      rowan: { opening: "Rowan Reedshield sits near the inn's side wall, not at a table but beside it, where he can see both the front door and the stairs. A scratched shield rests across his knees. He is polishing out a dent slowly, not because the shield needs polish, but because the work gives his hands somewhere calm to be. When a cart-driver bumps into a serving girl, Rowan rises halfway before anyone else notices. The girl steadies the tray, the driver apologizes, and Rowan sits again without asking to be thanked.", ask: "He looks up when you approach. “If you're looking for someone to swing first and think later, keep walking. If you're looking for someone to make sure people come home, sit down.”", goodLabel: "People are in danger. I need someone who protects first and boasts never.", goodReply: "Rowan studies you for a long moment, then sets the shield strap properly across his shoulder. “Good answer. Trouble is loud enough without us adding noise. I'll come. If the road is being trained to fear the wrong thing, then we keep our heads, keep our line, and bring people home.”", badLabel: "I need someone sturdy enough to stand in front of me.", badReply: "Rowan's expression closes like a gate. “A shield is not furniture, and neither am I. Come back when you are asking for a companion, not a wall with boots.”", neutralLabel: "What kind of trouble are you expecting?", neutralReply: "“The organized kind,” Rowan says. “The kind that counts on frightened people shoving each other aside. That's when someone steady matters most. Ask me straight if you want me with you.”" },
      tilda: { opening: "Tilda Quickstep is perched backward on a chair near the hearth, flicking apple seeds into a tin cup across the room. She misses twice on purpose, hits once without looking, and grins when a nearby card player checks his sleeve for missing coins. There is a little chaos around her, but it is tidy chaos—the sort that trips a bully, not a child.", ask: "She tilts her head at you. “Let me guess. Road trouble, fake orders, dramatic cellar noises, and someone important said ‘be careful’ in a voice that made careful sound impossible?”", goodLabel: "I need someone clever enough to spot traps and quick enough to laugh at them.", goodReply: "Tilda snaps her fingers and points at you like you just solved a riddle. “Finally, someone with respect for proper nonsense. Yes. I'm in. If we're chasing people who plant fake orders, I want to see their faces when the wrong person finds the right clue.”", badLabel: "Just follow my orders and don't ask questions.", badReply: "Tilda makes a wounded sound and presses a hand to her heart. “No questions? In this economy of suspicious paper? Absolutely not. Try again when you need a partner instead of a shadow.”", neutralLabel: "You seem like you already know what's happening.", neutralReply: "“I know what people look like when they're lying badly,” Tilda says. “And half this town looks like it has been handed a lie and told to hold it carefully. That's interesting. Dangerous, but interesting.”" },
      moss: { opening: "Moss Fenmere sits where the firelight thins, turning a cracked teacup between both hands. No steam rises from it, but the surface ripples whenever the inn beams creak. A child nearby whispers that the cellar is haunted. Moss does not correct the child at first. They listen, then say gently, “Haunted is a word people use when history has not finished speaking.”", ask: "Moss looks at you as if they have already heard the question arrive. “The road is frightened above ground, and the roots are restless below it. That is not two problems.”", goodLabel: "There is old magic under this. I need someone patient enough to notice what others miss.", goodReply: "Moss smiles faintly. “Patience is how the quiet things become readable. I will come. But understand this: old places do not only hide monsters. They hide reasons. We should be prepared to find both.”", badLabel: "Can you do spooky magic at things until the problem goes away?", badReply: "Moss blinks once. “Magic is not a broom for sweeping fear under a rug. Come back when you are ready to listen as much as act.”", neutralLabel: "What do you mean the road and roots are one problem?", neutralReply: "“Roads are promises,” Moss says. “Roots are memory. Someone is using one to disturb the other. That is why everyone feels the wrongness before they understand it.”" },
    };
    return scenes[option.id];
  };

  const recruitConversation = (option) => {
    const scene = getRecruitmentScene(option);
    if (!scene) return;
    if (companion.id === option.id) return;
    if (flags[`${option.id}Status`] === "joined") {
      setActiveCompanion(option.id);
      close();
      setDialogue({
        portrait: option.icon,
        name: option.name,
        text: `${option.name} gathers their gear and falls back into step beside you.`,
        choices: [{ label: "Welcome back.", effect: () => setDialogue(null) }],
      });
      return;
    }
    const stats = getDerivedStats(player);
    const checkCfg = option.id === "rowan" ? { stat: "Heart", dc: 10 } : option.id === "tilda" ? { stat: "Wit", dc: 10 } : { stat: "Will", dc: 10 };
    const recruitmentCheckAttempted = !!flags[`${option.id}RecruitmentCheckAttempted`];
    const join = (check = null) => {
      const bonusXp = check?.success ? 5 : 0;
      setActiveCompanion(option.id);
      if (bonusXp) setCompanion((c) => ({ ...c, xp: (c.xp || 0) + bonusXp }));
      close();
      setDialogue({ portrait: option.icon, name: option.name, text: `${check ? `${checkSummary(check)}

` : ""}${scene.goodReply}${bonusXp ? `

${option.name} starts with +${bonusXp} companion XP because your approach earned immediate trust.` : ""}`, choices: [{ label: "Welcome to the party.", effect: () => setDialogue(null) }] });
    };
    const attemptRecruit = () => {
      setFlags((prev) => ({ ...prev, [`${option.id}RecruitmentCheckAttempted`]: true }));
      const check = resolveSkillCheck(stats, checkCfg.stat, checkCfg.dc);
      if (check.success) return join(check);
      setDialogue({ portrait: option.icon, name: option.name, text: `${checkSummary(check)}

Your approach is right, but the words land awkwardly in the noise of the inn. ${option.name} does not walk away. They wait to see whether you mean it plainly.`, choices: [{ label: "Say it plainly and ask them to come.", effect: () => join(check) }, { label: "Step back for now.", effect: () => setDialogue(null) }] });
    };
    const goodChoice = recruitmentCheckAttempted
      ? { label: "Ask plainly if they will come.", effect: () => join() }
      : { label: scene.goodLabel, requirement: `${checkCfg.stat} Check DC ${checkCfg.dc}`, effect: attemptRecruit };
    setDialogue({ portrait: option.icon, name: option.name, text: `${scene.opening}

${scene.ask}`, choices: [
      goodChoice,
      { label: scene.neutralLabel, effect: () => setDialogue({ portrait: option.icon, name: option.name, text: scene.neutralReply, choices: [goodChoice, { label: "I'll think about it.", effect: () => setDialogue(null) }] }) },
      { label: scene.badLabel, effect: () => { setFlags((prev) => ({ ...prev, [`${option.id}Status`]: "declined" })); setDialogue({ portrait: option.icon, name: option.name, text: scene.badReply, choices: [{ label: "Fair. I'll rethink that.", effect: () => setDialogue(null) }] }); } },
    ] });
  };

  const openWatchhouseCheck = ({
    readFlag,
    successFlag,
    stat,
    portrait,
    artKey,
    name,
    successText,
    failureText,
    successLabel,
    failureLabel,
    companionBeat = null,
  }) => {
    const alreadyRead = !!flags[readFlag];
    const check = alreadyRead ? null : resolveSkillCheck(getDerivedStats(player), stat, 10);
    const success = alreadyRead ? !!flags[successFlag] : !!check?.success;
    if (!alreadyRead) {
      setFlags((current) => ({
        ...current,
        watchEvidenceRead: true,
        [readFlag]: true,
        [successFlag]: success,
      }));
    }
    const resultText = `${alreadyRead ? "You review what you learned earlier." : checkSummary(check)}

${success ? successText : failureText}`;
    setDialogue({
      portrait,
      artKey,
      name,
      text: companionBeat
        ? appendChapter1CompanionReaction(
            resultText,
            isCompanionConscious(companion) ? companion.id : null,
            companionBeat,
          )
        : resultText,
      choices: [
        {
          label: success ? successLabel : failureLabel,
          effect: () => setDialogue(null),
        },
      ],
    });
  };

  return <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-4 sm:items-center"><div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="interior-title" tabIndex={-1} className="max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-900 p-5 shadow-2xl"><div className="mb-4 flex items-center justify-between gap-3"><div><div id="interior-title" className="text-2xl font-semibold">{scene === "home" ? "Inside Your Home" : scene === "bramInn" ? "Inside the Bramblecross Inn" : scene === "watchhouse" ? "Inside the Watchhouse" : "Interior"}</div>{scene === "watchhouse" && !flags.ennaBriefed ? <div className="text-sm text-white/70">An incomplete case wall waits for your road report.</div> : null}</div><Button onClick={close}>Leave</Button></div>
    {scene === "home" ? <div className="space-y-4"><div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/80">A warm, familiar room. Your own things suddenly feel more important now that the road has gone dangerous.</div><div className="flex flex-wrap gap-2"><Button onClick={() => { setPlayer((p) => ({ ...p, hp: Math.min(p.maxHp, p.hp + 6) })); }}>Rest a little</Button>{!flags.homeStashClaimed ? <Button onClick={() => { gainItem(setPlayer, "old_hatchet", 1); setFlags((f) => ({ ...f, homeStashClaimed: true })); announce("You gather your old village hatchet from home.", [{ id: "old_hatchet", qty: 1 }]); }}>Take your old hatchet</Button> : null}</div></div> : null}
    {scene === "bramInn" ? <div className="space-y-4"><div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/80">The Bramblecross Inn is trying very hard to feel ordinary. Mugs clink, someone laughs too loudly, and every traveler in the room seems to be listening for news from the road. Three capable strangers stand out—not because they are waiting to be hired, but because each of them is already responding to the crisis in their own way. Recruitment is conversation-driven: the way you speak to them matters.</div><div className="flex flex-wrap gap-2">{companion.recruited ? <Button onClick={dismissCompanion}>Ask current companion to wait here</Button> : null}<Button onClick={() => { setPlayer((p) => ({ ...p, hp: p.maxHp })); setCompanion((c) => c.recruited ? { ...c, hp: c.maxHp } : c); saveGame("Bramblecross Inn"); }}>Rest for the night</Button></div><div className="grid gap-3 md:grid-cols-3">{Object.values(COMPANION_OPTIONS).map((o) => <div key={o.id} className="rounded-3xl border border-white/10 bg-white/5 p-4"><div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-white/10 text-4xl"><span>{o.icon}</span>{o.portraitSrc ? <img src={o.portraitSrc} alt={`Portrait of ${o.name}`} onError={(event) => { event.currentTarget.style.display = "none"; }} className="absolute inset-0 h-full w-full object-cover" /> : null}</div><div className="mt-2 text-lg font-semibold">{o.name}</div><div className="text-sm text-emerald-300">{o.role}</div><div className="mt-2 text-sm text-white/75">{o.description}</div><div className="mt-2 text-xs text-white/55">{o.id === "rowan" ? "Polishing a dented shield while watching the door." : o.id === "tilda" ? "Making apple seeds land where apple seeds should not." : "Listening to the fire as if it is telling the truth slowly."}</div><div className="mt-4"><Button onClick={() => recruitConversation(o)} disabled={companion.id === o.id}>{companion.id === o.id ? "Traveling" : flags[`${o.id}Status`] === "joined" ? "Travel together" : "Talk"}</Button></div></div>)}</div></div> : null}
    {scene === "watchhouse" ? <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm uppercase tracking-wide text-white/50">People Inside</div>
        <div className="mt-2 text-xl font-semibold">Watchhouse Table</div>
        <div className="mt-2 text-sm leading-6 text-white/75">
          {knowsEdden
            ? "Enna keeps the maps pinned down with inkpots and impatience. Hollis stands close enough to the case wall to look official, but not close enough to stop watching Edden's door."
            : "Enna keeps the maps pinned down with inkpots and impatience. Hollis stands near the case wall, glancing with grave concern toward a closed door farther down the hall."}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <WatchhousePersonButton portraitName="Enna" role="Watch Clerk" fallback="E" testId="watchhouse-enna" onClick={() => openClerkDialogue?.()} />
          <WatchhousePersonButton portraitName="Captain Hollis" displayName="Hollis" role="Captain" fallback="H" testId="watchhouse-hollis" onClick={() => openCaptainDialogue?.()} />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {flags.chapterReported && !flags.chapterTwoClear ? <Button className="justify-start text-left" onClick={() => openChapter2Briefing?.()}>Review the Westroot briefing</Button> : null}
          {flags.chapterTwoBriefed && !flags.maraJoined ? <Button className="justify-start text-left" onClick={() => openMaraChapter2Dialogue?.()}>Call Mara to the table</Button> : null}
          {flags.chapterTwoBriefed ? <Button className="justify-start text-left" onClick={() => openEddenRecoveryDialogue?.({ allowPreBriefing: true })}>Visit Edden's recovery room</Button> : null}
        </div>
      </div>
      {!flags.ennaBriefed ? <>
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm uppercase tracking-wide text-white/50">Case Wall</div>
            <div className="mt-2 text-xl font-semibold">Incomplete Pattern</div>
            <div className="mt-3 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-white/80">The watchhouse wall is full of Bramblecross-only fragments. Enna has pins, string, and worried handwriting—but your Hearthhollow and Lantern Road discoveries are still missing.</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <EvidenceCard title="Missing Porters" description="Last assigned near the old root cellar." image={WATCHHOUSE_EVIDENCE_ART.missingPorters} />
            <EvidenceCard title="Copied Orders" description="The seal looks official until someone reads closely." image={WATCHHOUSE_EVIDENCE_ART.copiedOrders} />
            <EvidenceCard title="Supply Delays" description="Carts and crates arriving late, wrong, or not at all." image={WATCHHOUSE_EVIDENCE_ART.supplyDelays} />
            <EvidenceCard title="Road-Side Evidence Missing" description="Report to Enna to complete the picture." placeholder="Awaiting field evidence" />
          </div>
        </div>
        <div className="rounded-3xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-white/85">Enna notices the road dust on your boots. Talk to her at the clerk's desk before trusting the wall as complete.</div>
      </> : flags.chapterReported ? <>
        <div data-testid="chapter-one-case-archive" className="rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-5">
          <div className="text-sm uppercase tracking-wide text-emerald-200/80">Chapter 1 Case Archived</div>
          <div className="mt-2 text-xl font-semibold">The Road That Lied</div>
          <div className="mt-2 text-sm leading-6 text-white/80">The satchel, planted order, stolen Willow seal, Root Cellar, and Briar Crown mark are preserved in Enna's completed file. The active table now belongs to the Westroot search.</div>
        </div>
      </> : <>
        <DialogueSceneImage image={getDialogueSceneArt("watchhouseCaseWall")} />
        <div className="rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-5">
          <div className="text-sm uppercase tracking-wide text-emerald-200/80">Completed Case Wall</div>
          <div className="mt-2 text-2xl font-semibold">False authority growing over true roads</div>
          <div className="mt-2 text-sm leading-6 text-white/80">Your field report has changed the shape of the investigation. Bramblecross paperwork, Hearthhollow panic, Lantern Road evidence, missing cargo, and cellar rumors now point to one route-based pattern.</div>
        </div>
        <div className="grid gap-3 lg:grid-cols-5">
          <EvidenceCard title="Lio's Satchel" description="Cut loose before the village panic." image={WATCHHOUSE_EVIDENCE_ART.lioSatchel} />
          <EvidenceCard title="Planted Order" description="Meant to be discovered at the milestone." image={WATCHHOUSE_EVIDENCE_ART.plantedOrder} />
          <EvidenceCard title="Willow Seal" description="Trusted cargo mark may be stolen." image={WATCHHOUSE_EVIDENCE_ART.willowSeal} />
          <EvidenceCard title="Root Cellar" description="Missing porters and old routes below town." image={WATCHHOUSE_EVIDENCE_ART.rootCellar} />
          <EvidenceCard title="False Crown?" description="Not a royal seal. Not random." image={WATCHHOUSE_EVIDENCE_ART.falseCrown} accent />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button className="justify-start text-left" onClick={() => openWatchhouseCheck({ readFlag: "watchBoardRead", successFlag: "watchBoardCheckSucceeded", stat: "Wit", portrait: "🧷", artKey: "watchhouseEvidenceBoard", name: "Evidence Board", successText: "The red string no longer runs from clue to clue. It runs from system to system: road signs, cargo marks, public notices, old cellars, and frightened people. The pattern is not theft or random monster trouble. It is misdirection built to make ordinary systems lie.", failureText: "The board is dense and crowded. Hearthhollow, Lantern Road, Bramblecross, and the cellar all have strings on them, but following the full shape yourself makes the room feel louder. Enna has clearly seen something here; you have the pieces, not the pattern.", successLabel: "That pattern matters.", failureLabel: "Keep the board in mind.", companionBeat: "caseWall" })}>{flags.watchBoardRead ? "Review the completed evidence board" : "Study the completed evidence board"}</Button>
          <Button className="justify-start text-left" onClick={() => openWatchhouseCheck({ readFlag: "watchLedgerRead", successFlag: "watchLedgerCheckSucceeded", stat: "Wit", portrait: "📚", artKey: "watchhouseDutyLedger", name: "Duty Ledger", successText: "The missing porters were last assigned near the old root cellar. Someone altered the route notes afterward, turning an ordinary storage shift into a blind corner in the records. The changed handwriting is trying to imitate the clerk's shorthand, but the route marks are copied backward.", failureText: "You find the missing porters' names and their last root-cellar assignment. After that, the corrections, arrows, and shorthand marks crowd together until the page looks more anxious than informative.", successLabel: "Useful.", failureLabel: "Set the ledger back." })}>{flags.watchLedgerRead ? "Review the duty ledger" : "Read the duty ledger"}</Button>
          <Button className="justify-start text-left" onClick={() => openWatchhouseCheck({ readFlag: "watchMapRead", successFlag: "watchMapCheckSucceeded", stat: "Instinct", portrait: "🗺️", artKey: "watchhouseWallMap", name: "Wall Map", successText: "Pins connect Hearthhollow, Lantern Road, Bramblecross, and cellar paths under the warehouses. Some lines are public roads. Some are older, half-erased routes that still match the marks at the Lantern Shrine. One faded line bends west into a cluster of obsolete marks Enna has circled twice.", failureText: "Pins connect Hearthhollow, Lantern Road, Bramblecross, and cellar paths under the warehouses. You can follow the public roads, but the older half-erased lines fade into smudges before they tell you where they go.", successLabel: "Memorize it.", failureLabel: "Step back from the map." })}>{flags.watchMapRead ? "Review the wall map" : "Examine the wall map"}</Button>
          <Button className="justify-start text-left" onClick={() => openWatchhouseCheck({ readFlag: "watchOrdersRead", successFlag: "watchOrdersCheckSucceeded", stat: "Will", portrait: "📄", artKey: "watchhouseForgedOrders", name: "Forged Orders File", successText: "The copied orders borrow royal language but push fear instead of wise command. Enna has underlined the verbs: delay, hold, misdirect, recover. Whoever wrote them thinks in routes and pressure points. The tone feels like a crown without care: command stripped of responsibility.", failureText: "The copied orders use heavy royal phrasing. Enna has underlined the verbs: delay, hold, misdirect, recover. You can feel the pressure in the wording, but what that pressure proves keeps slipping away.", successLabel: "The tone itself is fake.", failureLabel: "Set the file aside." })}>{flags.watchOrdersRead ? "Review the forged orders file" : "Read the forged orders file"}</Button>
        </div>
        <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-white/75">Enna has left a note in the corner: <span className="italic text-white">“A road is safest when truth walks it first. Someone is making lies walk first.”</span></div>
      </>}
    </div> : null}</div></div>;
}
function ShopkeeperPortrait({ shopMode, flags }) {
  const portraitName =
    shopMode === "smith"
      ? "Smith Orin"
      : shopMode === "market"
        ? flags?.adaSealLessonComplete
          ? "Ada Willowmarket No Lens"
          : "Ada Willowmarket"
        : null;
  const portrait = portraitName ? getDialoguePortrait(portraitName) : null;
  if (!portrait) return null;

  return (
    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/20 text-3xl">
      <span aria-hidden="true">{shopMode === "smith" ? "O" : "A"}</span>
      <img
        src={portrait.src}
        alt={portrait.alt}
        className="absolute inset-0 h-full w-full object-cover object-top"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}

export function ShopModal({ shop, player, close, buyItem, sellItem, shopMode, flags }) { return <div className="fixed inset-0 z-30 overflow-y-auto bg-black/50 p-4"><div className="mx-auto my-8 max-w-3xl rounded-[2rem] border border-white/10 bg-slate-900 p-5"><div className="mb-4 flex justify-between gap-4"><div className="flex min-w-0 items-center gap-4"><ShopkeeperPortrait shopMode={shopMode} flags={flags} /><div><div className="text-2xl font-semibold">{shop.title}</div><div className="text-sm text-yellow-300">Gold: {player.gold}</div>{shopMode === "smith" && flags.elderGavePurse && !flags.smithStarterDiscountUsed ? <div className="text-sm text-emerald-300">Starter discount available.</div> : null}</div></div><Button onClick={close}>Close</Button></div><div className="grid gap-5 lg:grid-cols-2"><div><div className="mb-2 text-sm font-semibold text-emerald-300">Buy</div><div className="grid gap-3">{shop.inventory.map((id) => { const item = ITEM_DB[id]; const discount = shopMode === "smith" && item?.slot && flags.elderGavePurse && !flags.smithStarterDiscountUsed ? 4 : shopMode === "market" && flags.marketDiscount ? 2 : 0; const cost = Math.max(1, getBuyPrice(id) - discount); return <div key={id} className="rounded-2xl border border-white/10 bg-white/5 p-3"><div className="flex justify-between gap-3"><div className="flex min-w-0 items-start gap-3"><ItemIcon item={item} size="sm" /><div className="min-w-0"><div className="font-medium">{item.name}</div><div className="mt-1 text-xs text-white/70">{item.description}</div>{getItemHighlights(item).slice(0, 2).map((line) => <div key={line} className="mt-1 text-[11px] text-emerald-300/90">{line}</div>)}</div></div><Button onClick={() => buyItem(id)} disabled={player.gold < cost}>Buy • {cost}g</Button></div></div>; })}</div></div><div><div className="mb-2 text-sm font-semibold text-amber-300">Sell</div><div className="grid gap-3">{(Object.entries(player.inventory) as [string, number][]).filter(([, c]) => c > 0).map(([id, count]) => <div key={id} className="rounded-2xl border border-white/10 bg-white/5 p-3"><div className="flex justify-between gap-3"><div className="flex min-w-0 items-center gap-2"><ItemIcon item={ITEM_DB[id]} size="sm" /><span>{ITEM_DB[id]?.name} <span className="text-xs text-white/60">x{count}</span></span></div><Button onClick={() => sellItem(id)}>Sell • {getSellPrice(id)}g</Button></div></div>)}</div></div></div></div></div>; }
export function CraftModal({ player, close, craftRecipe, context = "potionShed" }) {
  const isRoadCamp = context === "roadCamp";
  return (
    <div className="fixed inset-0 z-30 overflow-y-auto bg-black/50 p-4">
      <div className="mx-auto my-8 max-w-2xl rounded-[2rem] border border-white/10 bg-slate-900 p-5">
        <div className="mb-4 flex justify-between gap-4">
          <div>
            <div className="text-2xl font-semibold">{isRoadCamp ? "Camp Crafting" : "Potion Shed"}</div>
            <div className="text-sm text-white/70">
              {isRoadCamp
                ? "Mix road supplies beside the fire."
                : "Brew something useful or memorable."}
            </div>
          </div>
          <Button onClick={close}>Close</Button>
        </div>
        <div className="space-y-3">
          {Object.values(RECIPE_DB).map((recipe) => {
            const item = ITEM_DB[recipe.resultId];
            const effectText = item.effectText?.replace(
              /^Use: Restore /,
              "Restores ",
            );

            return (
              <div
                key={recipe.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <ItemIcon item={item} />
                    <div className="min-w-0">
                      <div className="font-medium">{recipe.name}</div>
                      <div className="mt-1 text-sm text-white/75">
                        {recipe.note}
                      </div>
                      {effectText ? (
                        <div className="mt-2 text-sm font-medium text-emerald-300">
                          {effectText}
                        </div>
                      ) : null}
                      <div className="mt-2 text-xs text-white/60">
                        Ingredients: {formatIngredients(recipe.ingredients)}
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => craftRecipe(recipe.id)}
                    disabled={!canCraftRecipe(player, recipe)}
                  >
                    Craft
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
function EnemyPortrait({ enemy, className = "ml-auto aspect-[4/3] w-full max-w-64" }) {
  const [artFailed, setArtFailed] = useState(false);

  useEffect(() => {
    setArtFailed(false);
  }, [enemy?.name, enemy?.artwork?.src]);

  const showArtwork = !!enemy?.artwork?.src && !artFailed;

  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 text-5xl ${className}`}>
      {!showArtwork ? <span>{enemy?.icon}</span> : null}
      {showArtwork ? (
        <img
          src={enemy.artwork.src}
          alt={enemy.artwork.alt || `Portrait of ${enemy.name}`}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
            setArtFailed(true);
          }}
        />
      ) : null}
    </div>
  );
}

export function BattleModal({ battle, player, companion, heroSkills, heroAttack, finishBattle, battleItemsOpen, setBattleItemsOpen, useBattleConsumable, selectTarget }) {
  const modalRef = useModalAccessibility();
  const livingEnemies = battle.enemies.filter((enemy) => enemy.hp > 0);
  const selectedEnemy =
    livingEnemies.find((enemy) => enemy.battleId === battle.selectedTargetId) ||
    livingEnemies[0] ||
    battle.enemies[0];
  const victory = battle.turn === "victory" || livingEnemies.length === 0;
  const turnText =
    battle.turn === "hero"
      ? `Choose ${player.name}'s action and target.`
      : battle.turn === "companion"
        ? `${companion.name} is acting.`
        : battle.turn === "enemy"
          ? `${livingEnemies.length === 1 ? livingEnemies[0].name : "The enemy side"} is acting…`
          : victory
            ? "Victory!"
            : "Defeat…";

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center overflow-y-auto bg-slate-950/90 p-2 sm:items-center sm:p-4">
      <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="battle-title" tabIndex={-1} className="max-h-[calc(100vh-1rem)] w-full max-w-7xl overflow-y-auto rounded-[2rem] border border-amber-100/15 bg-slate-900 p-4 pb-64 shadow-2xl sm:p-5 sm:pb-64 2xl:pb-5">
        <header className="sticky top-0 z-20 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/95 p-3 backdrop-blur">
          <div>
            <h2 id="battle-title" className="text-2xl font-bold">Battle • {selectedEnemy?.name || "Enemy side"}</h2>
            <div className="text-sm text-white/70">{livingEnemies.length} of {battle.totalEnemies} enemies standing • {turnText}</div>
          </div>
          <Button onClick={finishBattle} disabled={!battle.finished}>
            {battle.finished ? (victory ? "Claim Victory" : "You Died • Return") : "Battle in Progress"}
          </Button>
        </header>

        <div className="battlefield-grid grid gap-3 xl:grid-cols-[0.72fr_1.28fr]">
          <section aria-labelledby="party-side-title" className="rounded-3xl border border-emerald-200/15 bg-emerald-950/20 p-3">
            <h3 id="party-side-title" className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/80">Your party</h3>
            <div className={`grid gap-2 ${companion.recruited ? "sm:grid-cols-2 xl:grid-cols-1" : ""}`}>
              <article className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
                <HeroArtwork player={player} variant="portrait" className="h-24 w-[4.5rem]" />
                <div className="min-w-0">
                  <div className="truncate text-lg font-semibold">{player.name}</div>
                  <div className="mt-2"><Meter value={player.hp} max={player.maxHp} label="Hero HP" /></div>
                </div>
              </article>
              {companion.recruited ? (
                <article className={`grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 ${companion.hp <= 0 ? "opacity-50 grayscale" : ""}`}>
                  <CompanionPortrait companion={companion} className="h-24 w-[4.5rem]" />
                  <div className="min-w-0">
                    <div className="truncate text-lg font-semibold">{companion.name}</div>
                    <div className="text-xs text-white/55">{companion.role}</div>
                    <div className="mt-2"><Meter value={companion.hp} max={companion.maxHp} label="Companion HP" colorClass="bg-rose-400" /></div>
                  </div>
                </article>
              ) : null}
            </div>
          </section>

          <section aria-labelledby="enemy-side-title" className="rounded-3xl border border-orange-200/15 bg-orange-950/15 p-3">
            <h3 id="enemy-side-title" className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-200/80">Enemy side • select a target</h3>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {battle.enemies.map((enemy) => {
                const selected = enemy.battleId === selectedEnemy?.battleId && enemy.hp > 0;
                const defeated = enemy.hp <= 0;
                return (
                  <button key={enemy.battleId} type="button" onClick={() => selectTarget(enemy.battleId)} disabled={defeated || battle.finished} aria-pressed={selected} className={`relative rounded-2xl border p-3 text-left transition ${selected ? "border-amber-300 bg-amber-400/10 ring-2 ring-amber-300/30" : "border-white/10 bg-black/20 hover:border-orange-200/35"} ${defeated ? "opacity-45 grayscale" : ""}`}>
                    <EnemyPortrait enemy={enemy} className="aspect-[16/9] w-full" />
                    <div className="mt-2 flex items-start justify-between gap-2">
                      <div className="font-semibold">{enemy.name}</div>
                      {selected ? <span className="rounded-full bg-amber-300/20 px-2 py-1 text-[10px] uppercase tracking-wide text-amber-100">Target</span> : null}
                      {defeated ? <span className="text-xs text-white/50">Defeated</span> : null}
                    </div>
                    <div className="mt-2"><Meter value={enemy.hp} max={enemy.maxHp} label="HP" colorClass="bg-orange-400" /></div>
                    <div className="mt-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-white/65">Intent: <span className="text-orange-100">{enemy.intent}</span></div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="mt-4 space-y-3">
          <section data-testid="battle-action-dock" aria-label="Battle actions and current health" className="fixed inset-x-2 bottom-2 z-30 max-h-[48vh] overflow-y-auto rounded-3xl border border-sky-200/20 bg-slate-900/95 p-3 shadow-2xl backdrop-blur sm:inset-x-4 sm:p-4 2xl:static 2xl:max-h-none 2xl:overflow-visible 2xl:border-white/10 2xl:bg-black/20 2xl:shadow-none">
            <div className="mb-3 grid grid-cols-2 gap-3 2xl:hidden">
              <Meter value={player.hp} max={player.maxHp} label={`${player.name} HP`} />
              <Meter value={selectedEnemy?.hp || 0} max={selectedEnemy?.maxHp || 1} label={`${selectedEnemy?.name || "Target"} HP`} colorClass="bg-orange-400" />
            </div>
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <h3 className="text-lg font-semibold">Actions</h3>
              <div className="text-xs text-white/65 sm:text-sm">{turnText}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-5 2xl:grid-cols-2">
              {heroSkills.map((skill) => {
                const cooldownRemaining = battle.cooldowns?.[skill.id] || 0;
                return (
                  <button key={skill.name} onClick={() => heroAttack(skill)} disabled={battle.turn !== "hero" || battle.finished || cooldownRemaining > 0} className="min-h-14 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-left hover:bg-white/20 disabled:opacity-40 sm:py-3">
                    <div className="flex items-center justify-between gap-2"><span className="font-medium">{skill.name}</span>{cooldownRemaining > 0 ? <span className="text-[10px] text-sky-200">Ready in {cooldownRemaining}</span> : null}</div>
                    <div className="mt-1 hidden text-xs text-white/70 lg:block 2xl:block">{skill.description}</div>
                  </button>
                );
              })}
              <Button className="min-h-14" onClick={() => setBattleItemsOpen((open) => !open)} disabled={battle.turn !== "hero" || battle.finished}>{battleItemsOpen ? "Hide Items" : "Items"}</Button>
            </div>
            {battleItemsOpen ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="mb-2 text-xs uppercase tracking-wide text-white/50">Battle Pouch</div>
                {["slot1", "slot2"].map((slot, index) => {
                  const id = player.battlePouch?.[slot];
                  if (!id || !BATTLE_CONSUMABLES[id]) return <div key={slot} className="mb-2 text-sm text-white/55">Slot {index + 1} is empty.</div>;
                  const config = BATTLE_CONSUMABLES[id];
                  const quantity = player.inventory?.[id] || 0;
                  return <div key={slot} className="mb-2 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-black/20 p-3"><span>{config.name} ×{quantity}</span><div className="flex gap-2"><Button onClick={() => useBattleConsumable(id, "hero")} disabled={quantity <= 0 || player.hp >= player.maxHp}>Use on {player.name}</Button>{companion.recruited ? <Button onClick={() => useBattleConsumable(id, "companion")} disabled={quantity <= 0 || companion.hp >= companion.maxHp}>Give to {companion.name}</Button> : null}</div></div>;
                })}
              </div>
            ) : null}
            {companion.recruited ? <div className="mt-4 text-xs text-white/60">Companion command: <span className="text-white">{companion.command}</span> • {getCompanionCommandHint(companion)}</div> : null}
          </section>

          <details className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <summary className="cursor-pointer list-none">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold">Recent Events</h3>
                <span className="max-w-[70%] truncate text-right text-xs text-white/55">{battle.log[battle.log.length - 1]}</span>
              </div>
            </summary>
            <div aria-live="polite" className="mt-3 space-y-2 text-sm text-white/75">{[...battle.log].reverse().map((entry, index) => <div key={`${entry}-${index}`} className="rounded-2xl bg-white/5 px-3 py-2">{entry}</div>)}</div>
          </details>
        </div>
      </div>
    </div>
  );
}
export function SaveModal({
  mode,
  slots,
  drafts,
  setDrafts,
  close,
  save,
  load,
  loadCheckpoint,
  exportToDisk,
  importFromDisk,
  loadChapter2PlaytestSave,
  loadChapter2CompleteSave,
}) {
  const isSave = mode === "save";
  const fileButtonClass =
    "inline-flex cursor-pointer items-center rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20";

  return <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/60 p-4"><div className="mx-auto my-8 max-w-4xl rounded-[2rem] border border-white/10 bg-slate-900 p-5"><div className="mb-4 flex justify-between"><div><div className="text-2xl font-semibold">{isSave ? "Save Slots" : "Load Save Slot"}</div><div className="text-sm text-white/70">Multiple named saves for testing branches.</div></div><Button onClick={close}>Close</Button></div><div className="mb-3 grid gap-3 md:grid-cols-2">{isSave ? <div className="rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-4"><div className="mb-3 text-sm uppercase tracking-wide text-emerald-200/80">Disk Save</div><Button onClick={exportToDisk} disabled={!exportToDisk}>Save Current to Disk</Button></div> : null}<div className="rounded-3xl border border-sky-300/20 bg-sky-400/10 p-4"><div className="mb-3 text-sm uppercase tracking-wide text-sky-200/80">Disk Load</div><div className="flex flex-wrap gap-2"><label className={fileButtonClass}>Load From Disk<input type="file" accept="application/json,.json" className="sr-only" onChange={importFromDisk} /></label><Button onClick={loadChapter2PlaytestSave}>Load Chapter 2 Playtest Save</Button><Button onClick={loadChapter2CompleteSave}>Load Chapter 3 Ready Save</Button>{!isSave ? <Button onClick={loadCheckpoint}>Load Latest Checkpoint</Button> : null}</div></div></div><div className="grid gap-3">{slots.map((slot) => <div key={slot.id} className="rounded-3xl border border-white/10 bg-white/5 p-4"><div className="flex flex-wrap justify-between gap-3"><div><div className="text-sm uppercase tracking-wide text-white/50">Slot {slot.id}</div><div className="mt-1 text-lg font-semibold">{slot.name || `Empty Slot ${slot.id}`}</div><div className="mt-1 text-xs text-white/50">{formatSaveTimestamp(slot.updatedAt)}</div></div>{isSave ? <Button onClick={() => save(slot.id)}>{slot.payload ? "Overwrite" : "Save Here"}</Button> : <Button onClick={() => load(slot.id)} disabled={!slot.payload}>Load</Button>}</div>{isSave ? <input className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none" value={drafts[slot.id] || ""} placeholder="Save name" onChange={(e) => setDrafts((p) => ({ ...p, [slot.id]: e.target.value }))} /> : null}</div>)}</div></div></div>;
}
