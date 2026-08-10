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
import type { GameFlags, Player } from "../game/types";
import { Button } from "./ui";

const SHEET_WIDTH = 1000;
const SHEET_HEIGHT = 620;

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
    title: "TRUE ROUTE FOUND",
    summary: "UNDERWAY DECODED · The continuous road-crew route is now recorded.",
    panelClass: "border-emerald-300/70 bg-emerald-400/15 text-emerald-50 shadow-[0_0_34px_rgba(52,211,153,0.24)]",
    stampClass: "border-emerald-200/70 bg-emerald-950/95 text-emerald-50 shadow-[0_0_38px_rgba(52,211,153,0.38)]",
  },
  "false-shortcut": {
    icon: "!",
    title: "TEMPTING ROUTE REJECTED",
    summary: "817 SHORTCUT · Straight and convincing, but the terrain runs backward.",
    panelClass: "border-amber-300/60 bg-amber-400/15 text-amber-50 shadow-[0_0_28px_rgba(251,191,36,0.18)]",
    stampClass: "border-amber-200/70 bg-amber-950/95 text-amber-50 shadow-[0_0_32px_rgba(251,191,36,0.28)]",
  },
  "deeper-solve": {
    icon: "✦",
    title: "LANTERNWELL CACHE FOUND",
    summary: "OPTIONAL THIRD FOLD · The hidden road-crew mark is complete.",
    panelClass: "border-sky-300/60 bg-sky-400/15 text-sky-50 shadow-[0_0_30px_rgba(56,189,248,0.22)]",
    stampClass: "border-sky-200/70 bg-sky-950/95 text-sky-50 shadow-[0_0_34px_rgba(56,189,248,0.3)]",
  },
  "not-a-route": {
    icon: "×",
    title: "NO CONTINUOUS ROUTE",
    summary: "The marks disagree. Nothing has been committed; refold freely.",
    panelClass: "border-slate-300/30 bg-slate-300/10 text-slate-100",
    stampClass: "border-slate-300/50 bg-slate-950/95 text-slate-100",
  },
};

function FrontMapArtwork() {
  return (
    <g data-map-face="front">
      <rect width={SHEET_WIDTH} height={SHEET_HEIGHT} fill="#ead8a0" />
      <rect width={SHEET_WIDTH} height={SHEET_HEIGHT} fill="url(#paper-grain-front)" opacity=".62" />
      <g fill="none" stroke="#75623b" strokeWidth="3" opacity=".55">
        <path d="M28 112 C150 41 257 141 374 75 S626 125 770 64 S920 98 983 54" />
        <path d="M20 236 C128 175 250 267 371 206 S601 252 733 196 S898 223 985 174" />
        <path d="M26 432 C162 361 269 468 399 401 S632 451 766 391 S924 419 987 379" />
        <path d="M35 526 C159 481 258 558 386 509 S627 548 762 500 S920 517 976 487" />
      </g>
      <path d="M600 -18 C642 42 584 101 620 155 C661 226 586 314 620 402 C650 480 598 548 620 638" fill="none" stroke="#4f8290" strokeWidth="14" opacity=".76" />
      <g fill="none" stroke="#6d5730" opacity=".86">
        <path d="M648 18 L785 86" strokeWidth="7" strokeLinecap="round" />
        <path d="M925 236 L987 267" strokeWidth="7" strokeLinecap="round" />
        <path d="M648 18 L785 86 M925 236 L987 267" stroke="#f7e7ad" strokeWidth="2" strokeDasharray="10 9" />
      </g>
      <text x="520" y="32" fill="#6d5730" fontSize="13" fontWeight="700" letterSpacing="2">ROUTE 817 · OFFICE REVISION</text>
      <text x="900" y="225" fill="#6d5730" fontSize="12" fontWeight="700" letterSpacing="1.6">817</text>
      <path d="M690 165 C735 158 768 122 804 106" fill="none" stroke="#563f22" strokeWidth="10" strokeLinecap="round" />
      <path d="M690 165 C735 158 768 122 804 106" fill="none" stroke="#fff2bd" strokeWidth="2" strokeDasharray="12 12" opacity=".75" />
      <path d="M804 62 h115 v70 h-115 z M820 78 v38 h83" fill="none" stroke="#4b381e" strokeWidth="5" />
      <text x="808" y="151" fill="#4b381e" fontSize="19" fontWeight="700" letterSpacing="2">UNDERWAY</text>
      <path d="M420 139 l16 16 -16 16 -16 -16 z" fill="none" stroke="#4f3b20" strokeWidth="5" />
      <text x="34" y="48" fill="#55411f" fontSize="25" fontWeight="800" letterSpacing="3">GREAT SURVEY OF WESTROOT</text>
      <text x="36" y="78" fill="#79663e" fontSize="14" letterSpacing="2">SURVEY ROUTE FACE · WESTROOT REVISION</text>
      <text x="662" y="586" fill="#79663e" fontSize="13" letterSpacing="2">LOWER GATE DISTRICT · SHEET 4</text>
      <g stroke="#8b7444" strokeWidth="2" opacity=".45">
        {Array.from({ length: 9 }, (_, index) => <line key={`v-${index}`} x1={100 + index * 100} y1="92" x2={100 + index * 100} y2="575" />)}
        {Array.from({ length: 5 }, (_, index) => <line key={`h-${index}`} x1="25" y1={120 + index * 100} x2="975" y2={120 + index * 100} />)}
      </g>
    </g>
  );
}

function BackMapArtwork() {
  return (
    <g data-map-face="back">
      <rect width={SHEET_WIDTH} height={SHEET_HEIGHT} fill="#cabd91" />
      <rect width={SHEET_WIDTH} height={SHEET_HEIGHT} fill="url(#paper-grain-back)" opacity=".72" />
      <g fill="none" stroke="#51492e" strokeWidth="3" opacity=".58">
        <path d="M18 91 C151 151 269 48 390 111 S639 62 768 120 S905 78 985 126" />
        <path d="M22 206 C139 269 262 170 391 231 S631 181 771 244 S913 198 981 252" />
        <path d="M18 405 C151 470 270 367 395 429 S627 380 765 442 S914 397 984 453" />
        <path d="M28 531 C146 579 260 492 389 548 S629 502 760 559 S910 522 975 571" />
      </g>

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

      {/* Optional third fold: the north-quarter root arrow touches the south-fold bridge. */}
      <path d="M620 0 C650 22 715 43 760 60" fill="none" stroke="#3f3a24" strokeWidth="6" strokeDasharray="13 8" />
      <path d="M620 0 l18 4 -11 14" fill="none" stroke="#3f3a24" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M755 52 l5 11 12 1 -9 8 3 12 -11 -6 -10 6 2 -12 -9 -8 12 -1 z" fill="none" stroke="#3f3a24" strokeWidth="4" />

      <text x="318" y="286" fill="#4c442b" fontSize="24" fontWeight="800" letterSpacing="3">ROAD-CREW CORRECTION FIELD</text>
      <text x="383" y="315" fill="#6a6040" fontSize="14" letterSpacing="2">REVERSE FACE · OLDER ROAD-CREW FIELD LEAF</text>
      <text x="438" y="347" fill="#6a6040" fontSize="13" fontStyle="italic">“The map lies flat. Two turns find the road.”</text>
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
        backgroundImage: "radial-gradient(circle at center, rgba(255,244,194,.09) 0 1px, transparent 1.5px)",
        backgroundSize: "18px 18px",
      }}
    >
      <div className="pointer-events-none absolute bottom-2 right-3 z-10 rounded bg-[#211b14]/80 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-amber-100/45">
        Folding table · dashed frame is the flat sheet
      </div>
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

        {traceOutcome === "true-route" || traceOutcome === "deeper-solve" ? (
          <g data-testid="folded-map-true-evidence" pointerEvents="none">
            <path d="M252 110 C360 119 424 151 500 165 C555 173 635 173 690 165 C735 158 768 122 804 106" fill="none" stroke="#0f766e" strokeWidth="18" strokeLinecap="round" opacity=".34" />
            <path d="M252 110 C360 119 424 151 500 165 C555 173 635 173 690 165 C735 158 768 122 804 106" fill="none" stroke="#d1fae5" strokeWidth="4" strokeDasharray="14 10" strokeLinecap="round" />
            <circle cx="505" cy="165" r="27" fill="none" stroke="#d1fae5" strokeWidth="5" />
            <text x="420" y="214" fill="#134e4a" fontSize="15" fontWeight="900" letterSpacing="2">ROAD-CREW ROUTE CONFIRMED</text>
            <g transform="translate(430 8)">
              <rect width="365" height="42" rx="8" fill="#e5d8a8" stroke="#7f1d1d" strokeWidth="3" />
              <path d="M12 10 L353 32 M353 10 L12 32" stroke="#991b1b" strokeWidth="4" opacity=".72" />
              <text x="18" y="27" fill="#571b16" fontSize="12.5" fontWeight="900" letterSpacing="1.2">ROUTE 817 VOID · TERRAIN REVERSED</text>
            </g>
          </g>
        ) : null}
        {traceOutcome === "deeper-solve" ? (
          <g data-testid="folded-map-cache-evidence" pointerEvents="none">
            <path d="M620 155 C650 133 715 112 760 95" fill="none" stroke="#7dd3fc" strokeWidth="9" strokeDasharray="12 9" strokeLinecap="round" />
            <circle cx="760" cy="95" r="24" fill="#082f49" stroke="#bae6fd" strokeWidth="4" />
            <text x="760" y="103" fill="#e0f2fe" fontSize="24" fontWeight="900" textAnchor="middle">✦</text>
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

      {FOLDED_MAP_EDGES.map(({ id }) => (
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
      ))}
    </div>
  );
}

export function FoldedMapGraybox({ flags, setFlags, player, setPlayer, close, onTraceOutcome }: {
  flags: GameFlags;
  setFlags: Dispatch<SetStateAction<GameFlags>>;
  player: Player;
  setPlayer: Dispatch<SetStateAction<Player>>;
  close: () => void;
  onTraceOutcome?: (outcome: FoldedMapOutcome) => void;
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
      : "Inspect either face while the sheet is flat. Then drag an edge inward and release it near a quarter guide.",
  );

  const foldCount = getFoldedMapFoldCount(configuration);
  const maxFolds = flags.foldedMapDecoded ? 3 : 2;
  const tracePresentation = traceOutcome ? TRACE_PRESENTATION[traceOutcome] : null;

  const beginEdgeDrag = (edge: FoldedMapEdge) => {
    if (configuration.folds[edge] === null && foldCount >= maxFolds) {
      setFeedback(flags.foldedMapDecoded
        ? "Three folds are already stacked. Unfold one before moving another edge."
        : "Hold the route to two folds for now. Unfold one edge before trying another construction.");
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
    const shouldClaimCache = result.outcome === "deeper-solve" && !flags.foldedMapCacheClaimed;
    setFlags((current) => ({ ...current, ...result.flags, ...(shouldClaimCache ? { foldedMapCacheClaimed: true } : {}) }));
    if (shouldClaimCache) {
      setPlayer((current) => ({
        ...current,
        inventory: { ...current.inventory, lanternwell_drop: (current.inventory.lanternwell_drop || 0) + 1 },
      }));
    }
    setTraceOutcome(result.outcome);
    setFeedback(`${result.message}${shouldClaimCache ? " One Lanternwell Drop is recovered from the marked cache." : ""}`);
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
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/70">Westroot Lower Gate · Survey working sheet</div>
            <h2 id="folded-map-title" className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">The Folded Map</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-white/65">One opaque map, printed differently on each side. Drag any edge inward; its landing snaps to the ¼, ½, or ¾ guide, and the fold reveals only the opposite face.</p>
          </div>
          <Button data-choice-id={CHAPTER_4_CHOICE_IDS.close} onClick={close}>Close</Button>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
          <div className={`relative rounded-3xl border bg-[#211b14] p-3 transition-all sm:p-5 ${tracePresentation ? tracePresentation.panelClass : "border-amber-100/15"}`}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-50/65">
              <span>One sheet · two faces · 54 two-fold configurations</span>
              <span data-testid="fold-count">{foldCount}/{maxFolds} folds active · {configuration.side} face up</span>
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
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-white/70">
              <div className="font-semibold text-white">Edden's clue</div>
              <div className="mt-1">“The map lies flat. Two turns find the road. At the road-crew bridge, roots point beyond it.”</div>
              <div className="mt-4 font-semibold text-white">Look for agreement</div>
              <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-white/55">
                <li>the Survey lantern benchmark and an older road-crew ring</li>
                <li>two contour strokes meeting without reversal</li>
                <li>one road continuing into the Underway</li>
                <li>route 817 is strikingly straight</li>
              </ul>
              <div className="mt-4 font-semibold text-white">Recorded state</div>
              <div className="mt-1">{getFoldedMapReview(flags)}</div>
              {flags.foldedMapCacheClaimed ? <div className="mt-3 text-sky-200">Lanternwell cache reward claimed once.</div> : null}
            </div>
            <Button data-choice-id={CHAPTER_4_CHOICE_IDS.flipMap} onClick={flipMap} disabled={foldCount > 0} className="w-full">Turn the flat map over</Button>
            <Button data-choice-id={CHAPTER_4_CHOICE_IDS.traceRoute} onClick={traceRoute} className="w-full bg-amber-500/25">Trace this folded route</Button>
            <Button data-choice-id={CHAPTER_4_CHOICE_IDS.resetFolds} onClick={unfoldAll} className="w-full">Unfold the whole sheet</Button>
            <Button data-choice-id={CHAPTER_4_CHOICE_IDS.back} onClick={goBack} className="w-full">{foldOrder.length ? "Back: open latest fold" : "Back to Westroot"}</Button>
            <div className="px-2 text-center text-[11px] leading-4 text-white/35">Experimentation is safe. Only tracing commits a route.</div>
          </aside>
        </div>
      </section>
    </div>
  );
}
