import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type PointerEvent as ReactPointerEvent,
  type SetStateAction,
} from "react";
import {
  EMPTY_FOLDED_MAP_CONFIGURATION,
  getFoldedMapReview,
  resolveFoldedMapConfiguration,
  type FoldedMapConfiguration,
} from "../game/chapter4";
import {
  CHAPTER_4_CHOICE_IDS,
  CHAPTER_4_SCENE_IDS,
  FOLDED_MAP_FLAPS,
  type FoldedMapFlapId,
} from "../story/chapter4";
import type { GameFlags, Player } from "../game/types";
import { Button } from "./ui";

type FoldDirection = "left" | "right" | "top" | "bottom";

const FLAP_LAYOUT: Record<FoldedMapFlapId, {
  direction: FoldDirection;
  position: CSSProperties;
  choiceId: string;
}> = {
  survey: {
    direction: "left",
    position: { left: "0%", top: "33.333%", width: "33.334%", height: "33.334%" },
    choiceId: CHAPTER_4_CHOICE_IDS.surveyFold,
  },
  keeper: {
    direction: "right",
    position: { left: "66.666%", top: "33.333%", width: "33.334%", height: "33.334%" },
    choiceId: CHAPTER_4_CHOICE_IDS.keeperFold,
  },
  crown: {
    direction: "top",
    position: { left: "33.333%", top: "0%", width: "33.334%", height: "33.334%" },
    choiceId: CHAPTER_4_CHOICE_IDS.crownFold,
  },
  cache: {
    direction: "bottom",
    position: { left: "33.333%", top: "66.666%", width: "33.334%", height: "33.334%" },
    choiceId: CHAPTER_4_CHOICE_IDS.cacheFold,
  },
};

const PAPER_TEXTURE = {
  backgroundColor: "rgba(239, 222, 166, 0.96)",
  backgroundImage:
    "linear-gradient(115deg, rgba(105,75,33,.08) 1px, transparent 1px), repeating-linear-gradient(4deg, rgba(255,255,255,.06) 0 3px, rgba(73,50,23,.025) 3px 5px)",
  backgroundSize: "31px 31px, auto",
} satisfies CSSProperties;

function foldTransform(direction: FoldDirection, progress: number) {
  const angle = Math.round(progress * 1800) / 10;
  if (direction === "left") return `rotateY(${angle}deg)`;
  if (direction === "right") return `rotateY(${-angle}deg)`;
  if (direction === "top") return `rotateX(${-angle}deg)`;
  return `rotateX(${angle}deg)`;
}

function foldOrigin(direction: FoldDirection) {
  if (direction === "left") return "right center";
  if (direction === "right") return "left center";
  if (direction === "top") return "center bottom";
  return "center top";
}

function backFaceTransform(direction: FoldDirection) {
  return direction === "left" || direction === "right"
    ? "rotateY(180deg)"
    : "rotateX(180deg)";
}

function PaperDrawing({ flap, reverse = false }: { flap: FoldedMapFlapId; reverse?: boolean }) {
  const ink = reverse ? "#453719" : "#504426";
  const faint = reverse ? "#756438" : "#80734e";

  if (!reverse) {
    const headings = {
      survey: ["GREAT SURVEY", "benchmark 811"],
      keeper: ["KEEPER CORRECTION", "field leaf 794"],
      crown: ["WESTWARD REVISION", "survey office 817"],
      cache: ["BRIDGE LEDGER", "keeper field note"],
    } as const;
    const [heading, detail] = headings[flap];
    return (
      <svg viewBox="0 0 300 200" className="h-full w-full" aria-hidden="true">
        <path d="M16 38 C65 10 103 69 149 34 S238 59 284 23" fill="none" stroke={faint} strokeWidth="1.5" opacity=".5" />
        <path d="M12 155 C66 111 107 178 165 130 S245 150 289 104" fill="none" stroke={faint} strokeWidth="1.5" opacity=".5" />
        <path d="M22 174 L278 174" stroke={ink} strokeWidth="1" strokeDasharray="5 6" opacity=".45" />
        {flap === "survey" ? <path d="M20 140 C80 128 106 100 150 94" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" /> : null}
        {flap === "keeper" ? <path d="M150 96 C193 95 225 70 280 38" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" /> : null}
        {flap === "crown" ? <path d="M20 150 L280 39" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" /> : null}
        {flap === "cache" ? <path d="M42 112 C91 82 117 105 151 92 C190 76 224 104 264 69" fill="none" stroke={ink} strokeWidth="4" strokeDasharray="11 7" /> : null}
        <text x="18" y="24" fill={ink} fontSize="15" fontWeight="700" letterSpacing="1.6">{heading}</text>
        <text x="18" y="190" fill={ink} fontSize="11" letterSpacing="1">{detail}</text>
        <path d="M150 83 l12 12 -12 12 -12 -12 z" fill="none" stroke={ink} strokeWidth="3" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 300 200" className="h-full w-full" aria-hidden="true">
      <path d="M6 47 C58 22 93 65 144 40 S244 65 294 29" fill="none" stroke={faint} strokeWidth="2" opacity=".72" />
      <path d="M5 127 C57 102 91 145 145 119 S239 141 295 105" fill="none" stroke={faint} strokeWidth="2" opacity=".72" />
      {flap === "survey" ? (
        <>
          <path d="M12 157 C54 149 92 112 150 96" fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round" />
          <path d="M150 83 l13 13 -13 13 -13 -13 z" fill="none" stroke={ink} strokeWidth="3" />
          <path d="M104 60 L145 42" stroke={ink} strokeWidth="2" />
          <text x="20" y="186" fill={ink} fontSize="12" fontWeight="700">SURVEY 811</text>
        </>
      ) : null}
      {flap === "keeper" ? (
        <>
          <path d="M150 96 C184 98 220 72 289 38" fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round" />
          <circle cx="150" cy="96" r="15" fill="none" stroke={ink} strokeWidth="3" />
          <path d="M153 145 C190 119 225 132 282 90" fill="none" stroke={ink} strokeWidth="2" />
          <text x="196" y="186" fill={ink} fontSize="12" fontWeight="700">KEEPER 794</text>
        </>
      ) : null}
      {flap === "crown" ? (
        <>
          <path d="M12 157 L289 38" fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round" />
          <circle cx="150" cy="96" r="15" fill="none" stroke={ink} strokeWidth="3" />
          <path d="M211 60 l6 -11 7 8 8 -10 7 11 8 -6 -2 18 h-32 z" fill="none" stroke={ink} strokeWidth="2.5" />
          <path d="M82 44 C117 69 155 36 193 62" fill="none" stroke={ink} strokeWidth="2" strokeDasharray="8 5" />
          <text x="20" y="186" fill={ink} fontSize="12" fontWeight="700">REVISION 817</text>
        </>
      ) : null}
      {flap === "cache" ? (
        <>
          <path d="M31 120 C82 85 119 111 151 96 C190 77 226 103 274 65" fill="none" stroke={ink} strokeWidth="4" strokeDasharray="13 7" />
          <path d="M125 102 l12 -11 m5 2 l12 -11" stroke={ink} strokeWidth="4" strokeLinecap="round" />
          <path d="M151 96 l-17 -4 8 15" fill="none" stroke={ink} strokeWidth="3" />
          <path d="M224 68 l4 9 10 1 -8 7 2 10 -8 -5 -9 5 3 -10 -8 -7 10 -1 z" fill="none" stroke={ink} strokeWidth="2.5" />
          <text x="20" y="186" fill={ink} fontSize="12" fontWeight="700">BRIDGE FIELD LEAF</text>
        </>
      ) : null}
    </svg>
  );
}

function CentralMap() {
  return (
    <div
      className="absolute border border-amber-950/35 shadow-inner"
      style={{
        left: "33.333%",
        top: "33.333%",
        width: "33.334%",
        height: "33.334%",
        ...PAPER_TEXTURE,
      }}
      data-testid="folded-map-center"
    >
      <svg viewBox="0 0 300 200" className="h-full w-full" aria-label="Central map panel">
        <path d="M4 47 C57 21 95 67 145 40 S243 64 296 29" fill="none" stroke="#716039" strokeWidth="2" opacity=".65" />
        <path d="M4 127 C57 101 92 145 145 119 S240 142 296 105" fill="none" stroke="#716039" strokeWidth="2" opacity=".65" />
        <path d="M22 25 C55 53 82 42 102 72 C124 105 104 143 76 176" fill="none" stroke="#487586" strokeWidth="6" opacity=".7" />
        <path d="M219 30 L278 30 L278 74" fill="none" stroke="#493a1e" strokeWidth="3" />
        <path d="M226 35 v29 h44" fill="none" stroke="#493a1e" strokeWidth="2" />
        <text x="206" y="91" fill="#493a1e" fontSize="11" fontWeight="700" letterSpacing="1">UNDERWAY?</text>
        <text x="12" y="191" fill="#67552d" fontSize="10" letterSpacing="1.2">WESTROOT LOWER SURVEY · CENTER PANEL</text>
      </svg>
      <div className="pointer-events-none absolute inset-0 border border-dashed border-amber-950/30" />
    </div>
  );
}

function FoldablePaperWing({
  flap,
  folded,
  stackIndex,
  onChange,
  onNudge,
}: {
  flap: FoldedMapFlapId;
  folded: boolean;
  stackIndex: number;
  onChange: (folded: boolean) => void;
  onNudge: () => void;
}) {
  const layout = FLAP_LAYOUT[flap];
  const [dragProgress, setDragProgress] = useState<number | null>(null);
  const progressRef = useRef(folded ? 1 : 0);
  const drag = useRef<null | { pointerId: number; start: number; initial: number; size: number; moved: boolean }>(null);

  useEffect(() => {
    if (!drag.current) progressRef.current = folded ? 1 : 0;
  }, [folded]);

  const pointerCoordinate = (event: ReactPointerEvent<HTMLDivElement>) =>
    layout.direction === "left" || layout.direction === "right" ? event.clientX : event.clientY;

  const signedDelta = (delta: number) =>
    layout.direction === "right" || layout.direction === "bottom" ? -delta : delta;

  const beginDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const initial = folded ? 1 : 0;
    const rect = event.currentTarget.getBoundingClientRect();
    drag.current = {
      pointerId: event.pointerId,
      start: pointerCoordinate(event),
      initial,
      size: layout.direction === "left" || layout.direction === "right" ? rect.width : rect.height,
      moved: false,
    };
    progressRef.current = initial;
    setDragProgress(initial);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    const delta = signedDelta(pointerCoordinate(event) - drag.current.start);
    if (Math.abs(delta) > 5) drag.current.moved = true;
    const next = Math.max(0, Math.min(1, drag.current.initial + delta / Math.max(drag.current.size, 1)));
    progressRef.current = next;
    setDragProgress(next);
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    const moved = drag.current.moved;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!moved) {
      setDragProgress(null);
      onNudge();
      return;
    }
    const nextFolded = progressRef.current >= 0.5;
    setDragProgress(null);
    onChange(nextFolded);
  };

  const progress = dragProgress ?? (folded ? 1 : 0);
  const flapInfo = FOLDED_MAP_FLAPS.find((entry) => entry.id === flap)!;
  const foldInstruction = folded ? "Drag away from the center to unfold" : "Drag toward the center to fold";
  const dragCue = {
    left: folded ? "← DRAG" : "DRAG →",
    right: folded ? "DRAG →" : "← DRAG",
    top: folded ? "DRAG ↑" : "DRAG ↓",
    bottom: folded ? "DRAG ↓" : "DRAG ↑",
  }[layout.direction];
  const cuePosition = {
    left: "right-1 top-1/2 -translate-y-1/2",
    right: "left-1 top-1/2 -translate-y-1/2",
    top: "bottom-1 left-1/2 -translate-x-1/2",
    bottom: "top-1 left-1/2 -translate-x-1/2",
  }[layout.direction];

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={folded}
      aria-label={`${flapInfo.label}, ${folded ? "folded" : "open"}. ${foldInstruction}, or press Enter.`}
      data-choice-id={layout.choiceId}
      data-fold-id={flap}
      data-folded={folded ? "true" : "false"}
      onPointerDown={beginDrag}
      onPointerMove={moveDrag}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onChange(!folded);
        }
      }}
      className="absolute cursor-grab select-none outline-none transition-[filter] duration-150 focus-visible:drop-shadow-[0_0_8px_rgba(253,230,138,.9)] active:cursor-grabbing"
      style={{
        ...layout.position,
        zIndex: folded ? 30 + stackIndex : 10,
        transform: foldTransform(layout.direction, progress),
        transformOrigin: foldOrigin(layout.direction),
        transformStyle: "preserve-3d",
        transition: dragProgress === null ? "transform 420ms cubic-bezier(.2,.75,.2,1)" : "none",
        willChange: "transform",
        touchAction: "none",
      }}
    >
      <div
        className="absolute inset-0 overflow-hidden border border-amber-950/40 shadow-[0_8px_20px_rgba(43,29,10,.28)]"
        style={{
          ...PAPER_TEXTURE,
          backgroundColor: progress > 0.5 ? "rgba(239, 222, 166, 0.52)" : PAPER_TEXTURE.backgroundColor,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: progress > 0.5 ? backFaceTransform(layout.direction) : "none",
            transformStyle: "preserve-3d",
          }}
        >
          <PaperDrawing flap={flap} reverse={progress > 0.5} />
          {progress > 0.5 ? (
            <span className="pointer-events-none absolute bottom-1 left-2 text-[8px] font-bold uppercase tracking-wider text-amber-950/55 sm:text-[9px]">
              {flapInfo.label}
            </span>
          ) : null}
          <span className={`pointer-events-none absolute ${cuePosition} rounded-full border border-amber-950/25 bg-amber-50/80 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-amber-950/70 sm:text-[10px]`}>
            {dragCue}
          </span>
        </div>
      </div>
    </div>
  );
}

export function FoldedMapGraybox({ flags, setFlags, player, setPlayer, close }: {
  flags: GameFlags;
  setFlags: Dispatch<SetStateAction<GameFlags>>;
  player: Player;
  setPlayer: Dispatch<SetStateAction<Player>>;
  close: () => void;
}) {
  const [folds, setFolds] = useState<FoldedMapConfiguration>({ ...EMPTY_FOLDED_MAP_CONFIGURATION });
  const [foldOrder, setFoldOrder] = useState<FoldedMapFlapId[]>([]);
  const [feedback, setFeedback] = useState(
    flags.foldedMapAttempted
      ? getFoldedMapReview(flags)
      : "The thin paper carries four hinged wings. Fold freely; nothing is recorded until you trace a route.",
  );

  const changeFold = (flap: FoldedMapFlapId, folded: boolean) => {
    setFolds((current) => ({ ...current, [flap]: folded }));
    setFoldOrder((current) => folded
      ? [...current.filter((entry) => entry !== flap), flap]
      : current.filter((entry) => entry !== flap));
    setFeedback(
      folded
        ? `${FOLDED_MAP_FLAPS.find((entry) => entry.id === flap)!.label} laid over the center. Inspect how its ink meets the layers below.`
        : `${FOLDED_MAP_FLAPS.find((entry) => entry.id === flap)!.label} opened flat again.`,
    );
  };

  const traceRoute = () => {
    if (!Object.values(folds).some(Boolean)) {
      setFeedback("The map is still flat. Fold at least one paper wing before tracing a route.");
      return;
    }
    const result = resolveFoldedMapConfiguration(flags, folds);
    const shouldClaimCache = result.outcome === "deeper-solve" && !flags.foldedMapCacheClaimed;
    setFlags((current) => ({
      ...current,
      ...result.flags,
      ...(shouldClaimCache ? { foldedMapCacheClaimed: true } : {}),
    }));
    if (shouldClaimCache) {
      setPlayer((current) => ({
        ...current,
        inventory: {
          ...current.inventory,
          lanternwell_drop: (current.inventory.lanternwell_drop || 0) + 1,
        },
      }));
    }
    setFeedback(`${result.message}${shouldClaimCache ? " One Lanternwell Drop is recovered from the marked cache." : ""}`);
  };

  const resetFolds = () => {
    setFolds({ ...EMPTY_FOLDED_MAP_CONFIGURATION });
    setFoldOrder([]);
    setFeedback("All four wings lie flat. Previous route records remain, but the paper is ready for another construction.");
  };

  const goBack = () => {
    const mostRecent = foldOrder[foldOrder.length - 1];
    if (mostRecent) {
      changeFold(mostRecent, false);
      setFeedback("The top paper wing was unfolded. Press Back again after every wing lies flat to leave.");
      return;
    }
    close();
  };

  const foldCount = Object.values(folds).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/75 p-2 sm:items-center sm:p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="folded-map-title"
        data-scene-id={flags.foldedMapAttempted ? CHAPTER_4_SCENE_IDS.foldedMapReview : CHAPTER_4_SCENE_IDS.foldedMapGraybox}
        data-testid="folded-map-prototype"
        data-fold-configuration={FOLDED_MAP_FLAPS.filter((flap) => folds[flap.id]).map((flap) => flap.id).join(",") || "flat"}
        className="max-h-[96vh] w-full max-w-7xl overflow-y-auto rounded-[1.75rem] border border-amber-200/20 bg-slate-950 p-4 text-white shadow-2xl sm:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/70">Chapter 4 interaction spike · schematic paper prototype</div>
            <h2 id="folded-map-title" className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">The Folded Map</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-white/65">Drag a paper wing toward the center crease to fold it. The thin survey paper remains translucent when stacked, so route strokes, dates, lantern marks, and terrain lines can be compared directly.</p>
          </div>
          <Button data-choice-id={CHAPTER_4_CHOICE_IDS.close} onClick={close}>Close</Button>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
          <div className="rounded-3xl border border-amber-100/15 bg-[#2a251b] p-2 sm:p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-amber-50/65">
              <span>Four hinged wings · sixteen possible configurations</span>
              <span data-testid="fold-count">{foldCount} {foldCount === 1 ? "wing" : "wings"} folded</span>
            </div>
            <div
              className="relative mx-auto w-full max-w-[900px] overflow-visible rounded-2xl bg-[radial-gradient(circle_at_center,rgba(254,243,199,.12),transparent_55%)]"
              style={{ aspectRatio: "3 / 2", perspective: "1500px", transformStyle: "preserve-3d" }}
              aria-label="Unfolded cross-shaped map with four draggable paper wings"
            >
              <CentralMap />
              {FOLDED_MAP_FLAPS.map((flap) => (
                <FoldablePaperWing
                  key={flap.id}
                  flap={flap.id}
                  folded={folds[flap.id]}
                  stackIndex={Math.max(0, foldOrder.indexOf(flap.id))}
                  onChange={(folded) => changeFold(flap.id, folded)}
                  onNudge={() => setFeedback(`Drag the ${flap.label.toLowerCase()} toward the center. A press alone will not choose an answer.`)}
                />
              ))}
            </div>
          </div>

          <aside className="space-y-3">
            <div role="status" data-testid="folded-map-feedback" className="rounded-3xl border border-emerald-200/20 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-50">{feedback}</div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-white/70">
              <div className="font-semibold text-white">Edden's clue</div>
              <div className="mt-1">“The map lies flat. Two turns find the road. The bridge breaks twice.”</div>
              <div className="mt-4 font-semibold text-white">What can agree?</div>
              <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-white/55">
                <li>dated lantern benchmark and keeper ring</li>
                <li>both measured contour strokes</li>
                <li>one continuous road into the Underway</li>
              </ul>
              <div className="mt-4 font-semibold text-white">Recorded state</div>
              <div className="mt-1">{getFoldedMapReview(flags)}</div>
              {flags.foldedMapCacheClaimed ? <div className="mt-3 text-sky-200">Lanternwell cache reward claimed once.</div> : null}
            </div>
            <Button data-choice-id={CHAPTER_4_CHOICE_IDS.traceRoute} onClick={traceRoute} className="w-full bg-amber-500/25">Trace this folded route</Button>
            <Button data-choice-id={CHAPTER_4_CHOICE_IDS.resetFolds} onClick={resetFolds} className="w-full">Unfold all wings</Button>
            <Button data-choice-id={CHAPTER_4_CHOICE_IDS.back} onClick={goBack} className="w-full">{foldOrder.length ? "Back: unfold top wing" : "Back to Westroot"}</Button>
            <div className="px-2 text-center text-[11px] leading-4 text-white/35">Folding and unfolding is safe. Only tracing commits a route. Rootbread is not consulted.</div>
          </aside>
        </div>
      </section>
    </div>
  );
}
