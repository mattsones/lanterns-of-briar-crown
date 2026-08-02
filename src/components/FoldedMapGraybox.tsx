import { useState, type Dispatch, type SetStateAction } from "react";
import { getFoldedMapReview, resolveFoldedMapPair } from "../game/chapter4";
import type { FoldedMapMarkId } from "../story/chapter4";
import {
  CHAPTER_4_CHOICE_IDS,
  CHAPTER_4_SCENE_IDS,
  FOLDED_MAP_MARKS,
} from "../story/chapter4";
import type { GameFlags, Player } from "../game/types";
import { Button } from "./ui";

const CHOICE_ID_BY_MARK: Record<FoldedMapMarkId, string> = {
  survey_lantern: CHAPTER_4_CHOICE_IDS.surveyLantern,
  keeper_lantern: CHAPTER_4_CHOICE_IDS.keeperLantern,
  crown_shortcut: CHAPTER_4_CHOICE_IDS.crownShortcut,
  root_arrow: CHAPTER_4_CHOICE_IDS.rootArrow,
  broken_bridge: CHAPTER_4_CHOICE_IDS.brokenBridge,
};

export function FoldedMapGraybox({ flags, setFlags, player, setPlayer, close }: {
  flags: GameFlags;
  setFlags: Dispatch<SetStateAction<GameFlags>>;
  player: Player;
  setPlayer: Dispatch<SetStateAction<Player>>;
  close: () => void;
}) {
  const [selectedMark, setSelectedMark] = useState<FoldedMapMarkId | null>(null);
  const [feedback, setFeedback] = useState(
    flags.foldedMapAttempted
      ? getFoldedMapReview(flags)
      : "Choose two marks whose cut lines should meet when the paper is folded.",
  );

  const chooseMark = (markId: FoldedMapMarkId) => {
    if (!selectedMark) {
      setSelectedMark(markId);
      setFeedback("First edge held. Choose the mark that should meet it across the fold.");
      return;
    }
    if (selectedMark === markId) {
      setSelectedMark(null);
      setFeedback("That edge was released. Choose a first mark again.");
      return;
    }

    const result = resolveFoldedMapPair(flags, selectedMark, markId);
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
    setSelectedMark(null);
    setFeedback(`${result.message}${shouldClaimCache ? " The graybox awards one Lanternwell Drop as the cache placeholder." : ""}`);
  };

  const goBack = () => {
    if (selectedMark) {
      setSelectedMark(null);
      setFeedback("Selection cleared. The map remains open.");
      return;
    }
    close();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 p-4 sm:items-center">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="folded-map-title"
        data-scene-id={flags.foldedMapAttempted ? CHAPTER_4_SCENE_IDS.foldedMapReview : CHAPTER_4_SCENE_IDS.foldedMapGraybox}
        className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-amber-200/20 bg-slate-900 p-5 text-white shadow-2xl"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/70">Chapter 4 interaction spike · placeholder presentation</div>
            <h2 id="folded-map-title" className="mt-1 text-2xl font-semibold">Folded Map Graybox</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/70">This tests whether comparing an official Survey layer with an older keeper correction feels like folding and interpretation—not whether the final art is attractive.</p>
          </div>
          <Button data-choice-id={CHAPTER_4_CHOICE_IDS.close} onClick={close}>Close</Button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-3xl border border-amber-100/15 bg-amber-50/5 p-4">
            <div className="mb-3 flex flex-wrap gap-2 text-xs">
              <span className={`rounded-full px-3 py-1 ${flags.foldedMapDecoded ? "bg-emerald-400/20 text-emerald-100" : "bg-white/10 text-white/60"}`}>True route {flags.foldedMapDecoded ? "decoded" : "unresolved"}</span>
              <span className={`rounded-full px-3 py-1 ${flags.foldedMapMaintenanceDetour ? "bg-rose-400/20 text-rose-100" : "bg-white/10 text-white/60"}`}>Maintenance pressure {flags.foldedMapMaintenanceDetour ? "recorded" : "clear"}</span>
              <span className={`rounded-full px-3 py-1 ${flags.foldedMapDeeperSolved ? "bg-sky-400/20 text-sky-100" : "bg-white/10 text-white/60"}`}>Deeper alignment {flags.foldedMapDeeperSolved ? "found" : "optional"}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {FOLDED_MAP_MARKS.map((mark) => {
                const cacheMarkLocked = mark.phase === "cache" && !flags.foldedMapDecoded;
                const selected = selectedMark === mark.id;
                return (
                  <button
                    key={mark.id}
                    type="button"
                    data-choice-id={CHOICE_ID_BY_MARK[mark.id]}
                    disabled={cacheMarkLocked}
                    aria-pressed={selected}
                    onClick={() => chooseMark(mark.id)}
                    className={`min-h-36 rounded-3xl border p-4 text-left transition ${cacheMarkLocked ? "cursor-not-allowed border-white/5 bg-black/15 text-white/30" : selected ? "border-amber-200 bg-amber-300/20 shadow-[0_0_0_2px_rgba(253,230,138,0.12)]" : mark.id === "crown_shortcut" ? "border-rose-300/25 bg-rose-500/10 hover:bg-rose-500/20" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                  >
                    <span className="block text-3xl" aria-hidden="true">{mark.symbol}</span>
                    <span className="mt-2 block font-semibold">{mark.label}</span>
                    <span className="mt-1 block text-xs leading-5 opacity-70">{mark.description}</span>
                    {cacheMarkLocked ? <span className="mt-2 block text-xs">Decode the true route first.</span> : null}
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="space-y-4">
            <div role="status" data-testid="folded-map-feedback" className="rounded-3xl border border-emerald-200/20 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-50">{feedback}</div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-white/70">
              <div className="font-semibold text-white">Edden's clue</div>
              <div className="mt-1">“The map lies flat. Fold it.”</div>
              <div className="mt-4 font-semibold text-white">Review state</div>
              <div className="mt-1">{getFoldedMapReview(flags)}</div>
              {flags.foldedMapCacheClaimed ? <div className="mt-3 text-sky-200">Lanternwell cache reward claimed once.</div> : null}
              <div className="mt-4 text-xs text-white/45">Rootbread state is intentionally absent from every availability and outcome check.</div>
            </div>
            <Button data-choice-id={CHAPTER_4_CHOICE_IDS.back} onClick={goBack} className="w-full">{selectedMark ? "Back: clear selected edge" : "Back to Westroot"}</Button>
          </aside>
        </div>
      </section>
    </div>
  );
}
