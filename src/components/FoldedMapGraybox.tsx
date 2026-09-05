import {
  useRef,
  useState,
  type Dispatch,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  type SetStateAction,
} from "react";
import {
  EMPTY_FOLDED_MAP_CONFIGURATION,
  getFoldedMapFoldCount,
  getFoldedMapLandingDepth,
  getFoldedMapReview,
  resolveFoldedMapConfiguration,
  type FoldedMapConfiguration,
  type FoldedMapOutcome,
} from "../game/chapter4";
import {
  CHAPTER_4_CHOICE_IDS,
  CHAPTER_4_SCENE_IDS,
  FOLDED_MAP_EDGES,
  FOLDED_MAP_LANDINGS,
  type FoldedMapEdge,
  type FoldedMapLanding,
} from "../story/chapter4";
import type { GameFlags } from "../game/types";
import { Button } from "./ui";

const SHEET_WIDTH = 1000;
const SHEET_HEIGHT = 620;
const surveyFaceArtwork = new URL(
  "../../assets/maps/folded-map-survey-face-v01.webp",
  import.meta.url,
).href;
const roadCrewFaceArtwork = new URL(
  "../../assets/maps/folded-map-road-crew-face-v01.webp",
  import.meta.url,
).href;

const EDGE_META: Record<FoldedMapEdge, { label: string; shortLabel: string; choiceId: string }> = {
  left: { label: "west edge", shortLabel: "WEST", choiceId: CHAPTER_4_CHOICE_IDS.leftEdge },
  right: { label: "east edge", shortLabel: "EAST", choiceId: CHAPTER_4_CHOICE_IDS.rightEdge },
  top: { label: "north edge", shortLabel: "NORTH", choiceId: CHAPTER_4_CHOICE_IDS.topEdge },
  bottom: { label: "south edge", shortLabel: "SOUTH", choiceId: CHAPTER_4_CHOICE_IDS.bottomEdge },
};

const TRACE_PRESENTATION: Record<FoldedMapOutcome, {
  icon: string;
  title: string;
  summary: string;
  panelClass: string;
  stampClass: string;
}> = {
  "true-route": {
    icon: "✓",
    title: "CAPTORS' SHUTTER FOUND",
    summary: "OLD KEEPER ROAD · The completed mark matches their chosen shutter.",
    panelClass: "border-emerald-300/70 bg-emerald-400/15 text-emerald-50 shadow-[0_0_34px_rgba(52,211,153,0.24)]",
    stampClass: "border-emerald-200/70 bg-emerald-950/95 text-emerald-50 shadow-[0_0_38px_rgba(52,211,153,0.38)]",
  },
  "false-shortcut": {
    icon: "!",
    title: "SEALED SURVEY BORE",
    summary: "SURVEY SHORTCUT · The planned road ends in unbroken stone.",
    panelClass: "border-amber-300/60 bg-amber-400/15 text-amber-50 shadow-[0_0_28px_rgba(251,191,36,0.18)]",
    stampClass: "border-amber-200/70 bg-amber-950/95 text-amber-50 shadow-[0_0_32px_rgba(251,191,36,0.28)]",
  },
  "not-a-route": {
    icon: "×",
    title: "NO SHUTTER MARK",
    summary: "The marks disagree with every route fixture in the station.",
    panelClass: "border-slate-300/30 bg-slate-300/10 text-slate-100",
    stampClass: "border-slate-300/50 bg-slate-950/95 text-slate-100",
  },
};

function FrontMapArtwork() {
  return (
    <g data-map-face="front">
      <image
        href={surveyFaceArtwork}
        width={SHEET_WIDTH}
        height={SHEET_HEIGHT}
        preserveAspectRatio="xMidYMid slice"
        data-testid="folded-map-survey-artwork"
      />
      <rect width={SHEET_WIDTH} height={SHEET_HEIGHT} fill="#f7e8b5" opacity=".07" />
      <g fill="none" stroke="#6d5730" opacity=".86">
        <path d="M648 18 L785 86" strokeWidth="7" strokeLinecap="round" />
        <path d="M925 236 L987 267" strokeWidth="7" strokeLinecap="round" />
        <path d="M648 18 L785 86 M925 236 L987 267" stroke="#f7e7ad" strokeWidth="2" strokeDasharray="10 9" />
      </g>
      <text x="520" y="32" fill="#4f3b20" stroke="#ead8a0" strokeWidth="4" paintOrder="stroke" fontSize="13" fontWeight="800" letterSpacing="2">SURVEY SHORTCUT · OFFICE REVISION</text>
      <text x="900" y="225" fill="#4f3b20" stroke="#ead8a0" strokeWidth="3" paintOrder="stroke" fontSize="10" fontWeight="800" letterSpacing="1.2">DETOUR</text>
      <path d="M690 165 C735 158 768 122 804 106" fill="none" stroke="#563f22" strokeWidth="10" strokeLinecap="round" />
      <path d="M690 165 C735 158 768 122 804 106" fill="none" stroke="#fff2bd" strokeWidth="2" strokeDasharray="12 12" opacity=".75" />
      <path d="M804 62 h115 v70 h-115 z M820 78 v38 h83" fill="none" stroke="#4b381e" strokeWidth="5" />
      <text x="808" y="151" fill="#4b381e" stroke="#ead8a0" strokeWidth="4" paintOrder="stroke" fontSize="19" fontWeight="800" letterSpacing="2">UNDERWAY</text>
      <path d="M420 139 l16 16 -16 16 -16 -16 z" fill="none" stroke="#4f3b20" strokeWidth="5" />
      <rect x="23" y="16" width="438" height="72" rx="8" fill="#ead8a0" opacity=".76" />
      <text x="34" y="48" fill="#55411f" fontSize="25" fontWeight="800" letterSpacing="3">GREAT SURVEY OF WESTROOT</text>
      <text x="36" y="78" fill="#6b5732" fontSize="14" fontWeight="700" letterSpacing="2">SURVEY ROUTE FACE · WESTROOT REVISION</text>
      <text x="662" y="586" fill="#4f3b20" stroke="#ead8a0" strokeWidth="4" paintOrder="stroke" fontSize="13" fontWeight="800" letterSpacing="2">LOWER GATE DISTRICT · SHEET 4</text>
      <g stroke="#8b7444" strokeWidth="1.5" opacity=".16">
        {Array.from({ length: 9 }, (_, index) => <line key={`v-${index}`} x1={100 + index * 100} y1="92" x2={100 + index * 100} y2="575" />)}
        {Array.from({ length: 5 }, (_, index) => <line key={`h-${index}`} x1="25" y1={120 + index * 100} x2="975" y2={120 + index * 100} />)}
      </g>
    </g>
  );
}

function BackMapArtwork() {
  return (
    <g data-map-face="back">
      <image
        href={roadCrewFaceArtwork}
        width={SHEET_WIDTH}
        height={SHEET_HEIGHT}
        preserveAspectRatio="xMidYMid slice"
        data-testid="folded-map-road-crew-artwork"
      />
      <rect width={SHEET_WIDTH} height={SHEET_HEIGHT} fill="#7b6a43" opacity=".08" />

      {/* True route fragments: west-half and south-three-quarter folds. */}
      <path d="M0 165 C70 161 136 126 250 110" fill="none" stroke="#3f3a24" strokeWidth="11" strokeLinecap="round" />
      <path d="M0 165 C70 161 136 126 250 110" fill="none" stroke="#f1e6bb" strokeWidth="2" strokeDasharray="12 12" />
      <path d="M5 152 l13 13 -13 13 -13 -13 z" fill="none" stroke="#3f3a24" strokeWidth="5" />

      {/* The south-three-quarter fold supplies the missing middle road, road-crew ring, and bridge. */}
      <path d="M500 610 C555 602 635 602 690 610" fill="none" stroke="#3f3a24" strokeWidth="11" strokeLinecap="round" />
      <path d="M500 610 C555 602 635 602 690 610" fill="none" stroke="#f1e6bb" strokeWidth="2" strokeDasharray="12 12" />
      <circle cx="505" cy="610" r="18" fill="none" stroke="#3f3a24" strokeWidth="5" />
      <path d="M620 620 C592 565 650 512 620 454 C596 410 608 385 620 366" fill="none" stroke="#4f8290" strokeWidth="12" opacity=".76" />
      <g stroke="#3f3a24" strokeLinecap="round" strokeLinejoin="round">
        <rect x="594" y="596" width="52" height="24" rx="4" fill="#d8c894" strokeWidth="5" />
        <path d="M607 598 V618 M620 598 V618 M633 598 V618" strokeWidth="3" />
      </g>
      <path d="M282 454 C357 430 426 485 502 449 S647 472 733 430" fill="none" stroke="#51492e" strokeWidth="4" />
      <path d="M284 492 C360 468 430 522 506 487 S652 509 739 468" fill="none" stroke="#51492e" strokeWidth="4" />

      {/* Persuasive later straight route: north-half and east-half folds. */}
      <path d="M350 96 L650 0" fill="none" stroke="#3f3a24" strokeWidth="15" strokeLinecap="round" />
      <path d="M850 310 L750 342" fill="none" stroke="#3f3a24" strokeWidth="15" strokeLinecap="round" />
      <path d="M350 96 L650 0 M850 310 L750 342" fill="none" stroke="#f1e6bb" strokeWidth="3" strokeDasharray="13 10" />
      <path d="M884 246 C916 214 944 213 978 181" fill="none" stroke="#51492e" strokeWidth="4" strokeDasharray="12 8" />

      <rect x="301" y="259" width="540" height="102" rx="10" fill="#c8b889" opacity=".77" />
      <text x="318" y="286" fill="#3f3925" fontSize="24" fontWeight="800" letterSpacing="3">ROAD-CREW CORRECTION FIELD</text>
      <text x="383" y="315" fill="#51482f" fontSize="14" fontWeight="700" letterSpacing="2">REVERSE FACE · OLDER ROAD-CREW FIELD LEAF</text>
      <text x="438" y="347" fill="#51482f" fontSize="13" fontWeight="700" fontStyle="italic">“The map lies flat. Two turns find the road.”</text>
    </g>
  );
}

function SheetDefinitions() {
  return (
    <defs>
      <pattern id="paper-grain-front" width="26" height="26" patternUnits="userSpaceOnUse">
        <path d="M0 7 L26 4 M0 19 L26 16" stroke="#7d683e" strokeWidth="1" opacity=".18" />
        <circle cx="8" cy="12" r="1" fill="#ffffff" opacity=".18" />
      </pattern>
      <pattern id="paper-grain-back" width="31" height="31" patternUnits="userSpaceOnUse">
        <path d="M0 6 L31 11 M0 24 L31 29" stroke="#64593a" strokeWidth="1" opacity=".2" />
      </pattern>
      <linearGradient id="fold-sheen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff7d6" stopOpacity=".72" />
        <stop offset=".45" stopColor="#fff7d6" stopOpacity=".08" />
        <stop offset="1" stopColor="#594522" stopOpacity=".38" />
      </linearGradient>
      <filter id="fold-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#211609" floodOpacity=".42" />
      </filter>
    </defs>
  );
}

type FoldGeometry = {
  clip: { x: number; y: number; width: number; height: number };
  crease: number;
  transform: string;
};

function getFoldGeometry(edge: FoldedMapEdge, depth: number): FoldGeometry | null {
  if (depth <= 0) return null;
  if (edge === "left") {
    const crease = depth * SHEET_WIDTH / 2;
    return { clip: { x: crease, y: 0, width: crease, height: SHEET_HEIGHT }, crease, transform: `matrix(-1 0 0 1 ${2 * crease} 0)` };
  }
  if (edge === "right") {
    const distance = depth * SHEET_WIDTH;
    const crease = SHEET_WIDTH - distance / 2;
    return { clip: { x: SHEET_WIDTH - distance, y: 0, width: distance / 2, height: SHEET_HEIGHT }, crease, transform: `matrix(-1 0 0 1 ${2 * crease} 0)` };
  }
  if (edge === "top") {
    const crease = depth * SHEET_HEIGHT / 2;
    return { clip: { x: 0, y: crease, width: SHEET_WIDTH, height: crease }, crease, transform: `matrix(1 0 0 -1 0 ${2 * crease})` };
  }
  const distance = depth * SHEET_HEIGHT;
  const crease = SHEET_HEIGHT - distance / 2;
  return { clip: { x: 0, y: SHEET_HEIGHT - distance, width: SHEET_WIDTH, height: distance / 2 }, crease, transform: `matrix(1 0 0 -1 0 ${2 * crease})` };
}

function landingForDepth(depth: number): FoldedMapLanding | null {
  if (depth < 0.125) return null;
  return FOLDED_MAP_LANDINGS.reduce((best, option) =>
    Math.abs(option.depth - depth) < Math.abs(best.depth - depth) ? option : best,
  ).id;
}

function EdgeHandle({
  edge,
  depth,
  crossPositionPercent,
  stageRef,
  onBegin,
  onPreview,
  onSnap,
  onNudge,
}: {
  edge: FoldedMapEdge;
  depth: number;
  crossPositionPercent: number;
  stageRef: RefObject<HTMLDivElement | null>;
  onBegin: () => boolean;
  onPreview: (depth: number) => void;
  onSnap: (landing: FoldedMapLanding | null) => void;
  onNudge: () => void;
}) {
  const drag = useRef<null | { pointerId: number; moved: boolean }>(null);
  const depthRef = useRef(depth);
  depthRef.current = depth;
  const meta = EDGE_META[edge];
  const isVertical = edge === "left" || edge === "right";
  const snappedLanding = landingForDepth(depth);
  const landingMark = snappedLanding === "quarter" ? "¼" : snappedLanding === "half" ? "½" : snappedLanding === "three-quarter" ? "¾" : "";
  const position = edge === "left"
    ? { left: `${depth * 100}%`, top: `${crossPositionPercent}%`, transform: "translate(-50%, -50%)" }
    : edge === "right"
      ? { left: `${(1 - depth) * 100}%`, top: `${crossPositionPercent}%`, transform: "translate(-50%, -50%)" }
      : edge === "top"
        ? { left: `${crossPositionPercent}%`, top: `${depth * 100}%`, transform: "translate(-50%, -50%)" }
        : { left: `${crossPositionPercent}%`, top: `${(1 - depth) * 100}%`, transform: "translate(-50%, -50%)" };

  const depthFromPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return depthRef.current;
    if (edge === "left") return (event.clientX - rect.left) / rect.width;
    if (edge === "right") return (rect.right - event.clientX) / rect.width;
    if (edge === "top") return (event.clientY - rect.top) / rect.height;
    return (rect.bottom - event.clientY) / rect.height;
  };

  const begin = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!onBegin()) return;
    drag.current = { pointerId: event.pointerId, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    const next = Math.max(0, Math.min(0.75, depthFromPointer(event)));
    if (Math.abs(next - depthRef.current) > 0.015) drag.current.moved = true;
    depthRef.current = next;
    onPreview(next);
  };

  const finish = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    const moved = drag.current.moved;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!moved) {
      onNudge();
      onPreview(getFoldedMapLandingDepth(landingForDepth(depth)));
      return;
    }
    onSnap(landingForDepth(depthRef.current));
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${meta.label} fold handle. Drag inward to the quarter, half, or three-quarter guide.`}
      data-choice-id={meta.choiceId}
      data-fold-edge={edge}
      data-fold-depth={depth.toFixed(2)}
      onPointerDown={begin}
      onPointerMove={move}
      onPointerUp={finish}
      onPointerCancel={finish}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        event.stopPropagation();
        if (!onBegin()) return;
        const currentIndex = FOLDED_MAP_LANDINGS.findIndex((option) => option.depth === depth);
        onSnap(currentIndex < 0 ? "quarter" : currentIndex === FOLDED_MAP_LANDINGS.length - 1 ? null : FOLDED_MAP_LANDINGS[currentIndex + 1].id);
      }}
      className={`absolute z-40 flex cursor-grab select-none items-center justify-center rounded-full border-2 border-amber-950/50 bg-amber-50 text-[9px] font-black tracking-wider text-amber-950 shadow-lg outline-none focus-visible:ring-4 focus-visible:ring-amber-300/70 active:cursor-grabbing sm:text-[11px] ${snappedLanding ? "h-10 w-10 px-0" : isVertical ? "min-h-12 px-2 py-1" : "min-w-16 px-2 py-1"}`}
      style={{ ...position, touchAction: "none" }}
    >
      {snappedLanding ? `${meta.shortLabel[0]}${landingMark}` : meta.shortLabel}
    </div>
  );
}

function FoldedSheet({
  configuration,
  previewDepths,
  foldOrder,
  draggingEdge,
  traceOutcome,
  stageRef,
  onBegin,
  onPreview,
  onSnap,
  onNudge,
  locked,
}: {
  configuration: FoldedMapConfiguration;
  previewDepths: Record<FoldedMapEdge, number>;
  foldOrder: FoldedMapEdge[];
  draggingEdge: FoldedMapEdge | null;
  traceOutcome: FoldedMapOutcome | null;
  stageRef: RefObject<HTMLDivElement | null>;
  onBegin: (edge: FoldedMapEdge) => boolean;
  onPreview: (edge: FoldedMapEdge, depth: number) => void;
  onSnap: (edge: FoldedMapEdge, landing: FoldedMapLanding | null) => void;
  onNudge: (edge: FoldedMapEdge) => void;
  locked: boolean;
}) {
  const depths = previewDepths;
  const leftCut = depths.left * SHEET_WIDTH / 2;
  const rightCut = depths.right * SHEET_WIDTH / 2;
  const topCut = depths.top * SHEET_HEIGHT / 2;
  const bottomCut = depths.bottom * SHEET_HEIGHT / 2;
  const remainingWidth = Math.max(0, SHEET_WIDTH - leftCut - rightCut);
  const remainingHeight = Math.max(0, SHEET_HEIGHT - topCut - bottomCut);
  const topHandlePosition = (leftCut + remainingWidth * 0.65) / SHEET_WIDTH * 100;
  const bottomHandlePosition = (leftCut + remainingWidth * 0.92) / SHEET_WIDTH * 100;
  const verticalHandlePosition = (topCut + remainingHeight * 0.78) / SHEET_HEIGHT * 100;
  const renderOrder = [
    ...FOLDED_MAP_EDGES.map(({ id }) => id).filter((edge) => depths[edge] > 0 && edge !== draggingEdge),
    ...(draggingEdge && depths[draggingEdge] > 0 ? [draggingEdge] : []),
  ];
  const BaseArtwork = configuration.side === "front" ? FrontMapArtwork : BackMapArtwork;
  const ReverseArtwork = configuration.side === "front" ? BackMapArtwork : FrontMapArtwork;

  return (
    <div
      ref={stageRef}
      data-testid="folded-map-sheet"
      data-map-side={configuration.side}
      className="relative mx-auto w-full max-w-[1000px] overflow-visible rounded-2xl border border-amber-100/10 bg-[#33291c] shadow-inner"
      style={{
        aspectRatio: `${SHEET_WIDTH} / ${SHEET_HEIGHT}`,
        backgroundImage:
          "linear-gradient(90deg, transparent 0 49.7%, rgba(34,20,11,.55) 49.8% 50.2%, transparent 50.3%), repeating-linear-gradient(4deg, rgba(255,231,170,.025) 0 2px, rgba(23,13,8,.08) 3px 9px), linear-gradient(145deg, #4b3421, #2a1b12 58%, #3b2819)",
        boxShadow: "inset 0 0 0 2px rgba(239,196,117,.08), inset 0 18px 34px rgba(255,214,139,.035), inset 0 -24px 40px rgba(10,6,3,.35)",
      }}
    >
      <svg viewBox={`0 0 ${SHEET_WIDTH} ${SHEET_HEIGHT}`} className="absolute inset-0 h-full w-full overflow-visible" aria-label={`${configuration.side} face of one rectangular paper map`}>
        <SheetDefinitions />
        <defs>
          <clipPath id="base-sheet-clip">
            <rect x={leftCut} y={topCut} width={Math.max(0, SHEET_WIDTH - leftCut - rightCut)} height={Math.max(0, SHEET_HEIGHT - topCut - bottomCut)} />
          </clipPath>
          {FOLDED_MAP_EDGES.map(({ id }) => {
            const geometry = getFoldGeometry(id, depths[id]);
            const clip = geometry ? { ...geometry.clip } : null;
            if (clip && (id === "left" || id === "right")) {
              clip.y = topCut;
              clip.height = Math.max(0, SHEET_HEIGHT - topCut - bottomCut);
            }
            if (clip && (id === "top" || id === "bottom")) {
              clip.x = leftCut;
              clip.width = Math.max(0, SHEET_WIDTH - leftCut - rightCut);
            }
            return geometry ? (
              <clipPath id={`fold-clip-${id}`} key={id}>
                <rect {...clip!} />
              </clipPath>
            ) : null;
          })}
        </defs>

        <rect x="1.5" y="1.5" width={SHEET_WIDTH - 3} height={SHEET_HEIGHT - 3} rx="14" fill="none" stroke="#f4df9a" strokeWidth="3" strokeDasharray="12 12" opacity=".2" />

        <g clipPath="url(#base-sheet-clip)" filter="url(#fold-shadow)">
          <BaseArtwork />
        </g>
        <rect x={leftCut} y={topCut} width={remainingWidth} height={remainingHeight} fill="none" stroke="#f3e3b3" strokeWidth="3" opacity=".5" />

        {renderOrder.map((edge) => {
          const geometry = getFoldGeometry(edge, depths[edge]);
          if (!geometry) return null;
          return (
            <g key={edge} clipPath={`url(#fold-clip-${edge})`} filter="url(#fold-shadow)" data-fold-layer={edge}>
              <g transform={geometry.transform}>
                <ReverseArtwork />
              </g>
              <rect {...geometry.clip} fill="url(#fold-sheen)" opacity=".3" />
              <rect {...geometry.clip} fill="none" stroke="#fff1bf" strokeWidth="4" opacity=".7" />
              <text x={geometry.clip.x + 12} y={geometry.clip.y + 22} fill="#51452b" fontSize="11" fontWeight="800" letterSpacing="1.5" opacity=".72">REVERSE</text>
              {edge === "left" || edge === "right"
                ? <><line x1={geometry.crease} y1="0" x2={geometry.crease} y2={SHEET_HEIGHT} stroke="#211609" strokeWidth="12" opacity=".28" /><line x1={geometry.crease} y1="0" x2={geometry.crease} y2={SHEET_HEIGHT} stroke="#f6e7b6" strokeWidth="3" strokeDasharray="10 8" /></>
                : <><line x1="0" y1={geometry.crease} x2={SHEET_WIDTH} y2={geometry.crease} stroke="#211609" strokeWidth="12" opacity=".28" /><line x1="0" y1={geometry.crease} x2={SHEET_WIDTH} y2={geometry.crease} stroke="#f6e7b6" strokeWidth="3" strokeDasharray="10 8" /></>}
            </g>
          );
        })}

        {traceOutcome === "true-route" ? (
          <g data-testid="folded-map-true-evidence" pointerEvents="none">
            <path d="M252 110 C360 119 424 151 500 165 C555 173 635 173 690 165 C735 158 768 122 804 106" fill="none" stroke="#0f766e" strokeWidth="18" strokeLinecap="round" opacity=".34" />
            <path d="M252 110 C360 119 424 151 500 165 C555 173 635 173 690 165 C735 158 768 122 804 106" fill="none" stroke="#d1fae5" strokeWidth="4" strokeDasharray="14 10" strokeLinecap="round" />
            <circle cx="505" cy="165" r="27" fill="none" stroke="#d1fae5" strokeWidth="5" />
            <text x="420" y="214" fill="#134e4a" fontSize="15" fontWeight="900" letterSpacing="2">ROAD-CREW ROUTE CONFIRMED</text>
          </g>
        ) : null}
        {draggingEdge ? FOLDED_MAP_LANDINGS.map((landing) => {
          const fromFarEdge = draggingEdge === "right" || draggingEdge === "bottom";
          const coordinate = (fromFarEdge ? 1 - landing.depth : landing.depth) * (draggingEdge === "left" || draggingEdge === "right" ? SHEET_WIDTH : SHEET_HEIGHT);
          const vertical = draggingEdge === "left" || draggingEdge === "right";
          return (
            <g key={landing.id} pointerEvents="none">
              {vertical
                ? <line x1={coordinate} y1="0" x2={coordinate} y2={SHEET_HEIGHT} stroke="#fff2bd" strokeWidth="3" strokeDasharray="10 10" opacity=".8" />
                : <line x1="0" y1={coordinate} x2={SHEET_WIDTH} y2={coordinate} stroke="#fff2bd" strokeWidth="3" strokeDasharray="10 10" opacity=".8" />}
              <text x={vertical ? coordinate + 8 : 15} y={vertical ? 24 : coordinate - 8} fill="#fff2bd" fontSize="18" fontWeight="700">{landing.id === "quarter" ? "¼" : landing.id === "half" ? "½" : "¾"}</text>
            </g>
          );
        }) : null}
      </svg>

      {!locked ? FOLDED_MAP_EDGES.map(({ id }) => (
        <EdgeHandle
          key={id}
              edge={id}
              depth={depths[id]}
              crossPositionPercent={id === "left" || id === "right"
                ? verticalHandlePosition
                : id === "bottom"
                  ? bottomHandlePosition
                  : topHandlePosition}
              stageRef={stageRef}
          onBegin={() => onBegin(id)}
          onPreview={(depth) => onPreview(id, depth)}
          onSnap={(landing) => onSnap(id, landing)}
          onNudge={() => onNudge(id)}
        />
      )) : null}
    </div>
  );
}

export function FoldedMapGraybox({ flags, setFlags, close, onTraceOutcome, onContinue }: {
  flags: GameFlags;
  setFlags: Dispatch<SetStateAction<GameFlags>>;
  close: () => void;
  onTraceOutcome?: (outcome: FoldedMapOutcome) => void;
  onContinue?: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [configuration, setConfiguration] = useState<FoldedMapConfiguration>({
    side: EMPTY_FOLDED_MAP_CONFIGURATION.side,
    folds: { ...EMPTY_FOLDED_MAP_CONFIGURATION.folds },
  });
  const [previewDepths, setPreviewDepths] = useState<Record<FoldedMapEdge, number>>({ left: 0, right: 0, top: 0, bottom: 0 });
  const [foldOrder, setFoldOrder] = useState<FoldedMapEdge[]>([]);
  const [draggingEdge, setDraggingEdge] = useState<FoldedMapEdge | null>(null);
  const [traceOutcome, setTraceOutcome] = useState<FoldedMapOutcome | null>(null);
  const [feedback, setFeedback] = useState(
    flags.foldedMapAttempted
      ? getFoldedMapReview(flags)
      : "Mara sets Lio's scratched rectangle beside the sheet. “Two edges folded in,” she says. “Let's see what he saw.”",
  );

  const foldCount = getFoldedMapFoldCount(configuration);
  const maxFolds = 2;
  const tracePresentation = traceOutcome ? TRACE_PRESENTATION[traceOutcome] : null;
  const solved = !!flags.foldedMapDecoded;

  const beginEdgeDrag = (edge: FoldedMapEdge) => {
    if (configuration.folds[edge] === null && foldCount >= maxFolds) {
      setFeedback("Hold the route to two folds. Unfold one edge before trying another construction.");
      return false;
    }
    setDraggingEdge(edge);
    return true;
  };

  const previewEdge = (edge: FoldedMapEdge, depth: number) => {
    setPreviewDepths((current) => ({ ...current, [edge]: depth }));
  };

  const snapEdge = (edge: FoldedMapEdge, landing: FoldedMapLanding | null) => {
    const depth = getFoldedMapLandingDepth(landing);
    setPreviewDepths((current) => ({ ...current, [edge]: depth }));
    setConfiguration((current) => ({ ...current, folds: { ...current.folds, [edge]: landing } }));
    setFoldOrder((current) => landing
      ? [...current.filter((candidate) => candidate !== edge), edge]
      : current.filter((candidate) => candidate !== edge));
    setDraggingEdge(null);
    setTraceOutcome(null);
    const landingLabel = FOLDED_MAP_LANDINGS.find((option) => option.id === landing)?.label;
    setFeedback(landing
      ? `The ${EDGE_META[edge].label} now lands ${landingLabel}. The opposite face is visible on the folded paper; inspect its seams before tracing.`
      : `The ${EDGE_META[edge].label} lies flat again.`);
  };

  const traceRoute = () => {
    if (foldCount === 0) {
      setTraceOutcome(null);
      setFeedback("The sheet is still flat. Fold an edge before tracing a route.");
      return;
    }
    const result = resolveFoldedMapConfiguration(flags, configuration);
    setFlags((current) => ({ ...current, ...result.flags }));
    setTraceOutcome(result.outcome);
    setFeedback(result.message);
    onTraceOutcome?.(result.outcome);
  };

  const unfoldAll = () => {
    setConfiguration((current) => ({ ...current, folds: { ...EMPTY_FOLDED_MAP_CONFIGURATION.folds } }));
    setPreviewDepths({ left: 0, right: 0, top: 0, bottom: 0 });
    setFoldOrder([]);
    setDraggingEdge(null);
    setTraceOutcome(null);
    setFeedback("The sheet lies flat. Turn it over for another look, or begin a new fold from any edge.");
  };

  const flipMap = () => {
    if (foldCount > 0) {
      setFeedback("Unfold the sheet before turning the whole map over.");
      return;
    }
    setConfiguration((current) => ({ ...current, side: current.side === "front" ? "back" : "front" }));
    setTraceOutcome(null);
    setFeedback(configuration.side === "front"
      ? "The road-crew correction is face-up, its dark field ink crossing the paper grain."
      : "The Great Survey route face is up again.");
  };

  const goBack = () => {
    const mostRecent = foldOrder[foldOrder.length - 1];
    if (mostRecent) {
      snapEdge(mostRecent, null);
      setFeedback("The most recent fold was opened. Back leaves only after the whole sheet is flat.");
      return;
    }
    close();
  };

  const configurationLabel = `${configuration.side}:${FOLDED_MAP_EDGES
    .filter(({ id }) => configuration.folds[id])
    .map(({ id }) => `${id}-${configuration.folds[id]}`)
    .join(",") || "flat"}`;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/75 p-2 sm:items-center sm:p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="folded-map-title"
        data-scene-id={flags.foldedMapAttempted ? CHAPTER_4_SCENE_IDS.foldedMapReview : CHAPTER_4_SCENE_IDS.foldedMapGraybox}
        data-testid="folded-map-prototype"
        data-fold-configuration={configurationLabel}
        data-trace-outcome={traceOutcome || "untraced"}
        className="max-h-[96vh] w-full max-w-7xl overflow-y-auto rounded-[1.75rem] border border-amber-200/20 bg-slate-950 p-4 text-white shadow-2xl sm:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/70">Dusty waykeeper table · three shutter marks</div>
            <h2 id="folded-map-title" className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">The Folded Map</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-white/65">One opaque map, printed differently on each side. Drag any edge inward to fold.</p>
          </div>
          {!solved ? <Button data-choice-id={CHAPTER_4_CHOICE_IDS.close} onClick={close}>Close</Button> : null}
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
          <div className={`relative rounded-3xl border bg-[#211b14] p-3 transition-all sm:p-5 ${tracePresentation ? tracePresentation.panelClass : "border-amber-100/15"}`}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-50/65">
              <span>{configuration.side === "front" ? "Survey face" : "Road-crew face"} up</span>
              <span data-testid="fold-count">{foldCount}/{maxFolds} folds</span>
            </div>
            <div className="relative">
              <FoldedSheet
                configuration={configuration}
                previewDepths={previewDepths}
                foldOrder={foldOrder}
                draggingEdge={draggingEdge}
                traceOutcome={traceOutcome}
                stageRef={stageRef}
                onBegin={beginEdgeDrag}
                onPreview={previewEdge}
                onSnap={snapEdge}
                onNudge={(edge) => setFeedback(`Drag the ${EDGE_META[edge].label} inward. Pressing the handle alone does not choose a fold.`)}
                locked={solved}
              />
              {tracePresentation ? (
                <div
                  data-testid="folded-map-result-stamp"
                  className={`pointer-events-none absolute bottom-7 left-1/2 z-50 flex w-[min(88%,34rem)] -translate-x-1/2 items-center gap-3 rounded-2xl border-2 px-4 py-3 ${tracePresentation.stampClass}`}
                >
                  <div aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-current text-2xl font-black">{tracePresentation.icon}</div>
                  <div>
                    <div className="text-sm font-black tracking-[0.14em] sm:text-base">{tracePresentation.title}</div>
                    <div className="mt-1 text-[11px] font-semibold leading-4 opacity-80 sm:text-xs">{tracePresentation.summary}</div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <aside className="space-y-3">
            <div
              role="status"
              aria-live="assertive"
              data-testid="folded-map-feedback"
              className={`rounded-3xl border p-4 text-sm leading-6 ${tracePresentation ? tracePresentation.panelClass : "border-emerald-200/20 bg-emerald-400/10 text-emerald-50"}`}
            >
              {tracePresentation ? (
                <>
                  <div className="text-xs font-black tracking-[0.14em]">{tracePresentation.icon} {tracePresentation.title}</div>
                  <div className="mt-1 text-xs font-semibold opacity-75">{tracePresentation.summary}</div>
                  <div className="my-3 h-px bg-current opacity-20" />
                </>
              ) : null}
              <div>{feedback}</div>
            </div>
            {solved && onContinue ? (
              <Button
                data-choice-id={CHAPTER_4_CHOICE_IDS.continueFromSurvey}
                onClick={onContinue}
                className="w-full border-amber-200/60 bg-amber-400/30 text-amber-50"
              >
                Open the Old Keeper Road shutter
              </Button>
            ) : null}
            {!solved ? (
              <>
                <Button data-choice-id={CHAPTER_4_CHOICE_IDS.flipMap} onClick={flipMap} disabled={foldCount > 0} className="w-full">Turn the flat map over</Button>
                <Button data-choice-id={CHAPTER_4_CHOICE_IDS.traceRoute} onClick={traceRoute} className="w-full border-emerald-200/50 bg-emerald-500/35 text-emerald-50">Compare this fold with the shutter marks</Button>
                <Button data-choice-id={CHAPTER_4_CHOICE_IDS.resetFolds} onClick={unfoldAll} className="w-full">Unfold the whole sheet</Button>
                <Button data-choice-id={CHAPTER_4_CHOICE_IDS.back} onClick={goBack} className="w-full">{foldOrder.length ? "Back: open latest fold" : "Back to the survey table"}</Button>
              </>
            ) : null}
          </aside>
        </div>
      </section>
    </div>
  );
}
