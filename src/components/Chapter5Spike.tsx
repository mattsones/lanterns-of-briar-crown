import { useEffect, useRef } from "react";
import { Button, ChoiceButton } from "./ui";
import { advanceCarriageRescue, canOpenBriarholdInnerDoor, enterBriarhold, getBriarholdBossProfile, openBriarholdDrawer, resolveInvestigatingGuard, transmitLanternSignal } from "../game/chapter5";
import { CH5_NODES, abandonLedgerDistraction, chapter5MilestoneXp, distractLedgerOfficer, freeLedgerClerk, getChapter5Edges, moveChapter5, secureLedgerOfficer, type Chapter5BattleKind, type Chapter5Node, type Chapter5Resources, type Chapter5SaveState } from "../game/chapter5Runtime";
import { resolveSkillCheck } from "../game/dice";
import { isCompanionConscious } from "../game/companions";
import { CAPTIVE_LANTERN_PANES, CAPTIVE_LANTERN_SIGNALS, CHAPTER_5_CHECKS, CHAPTER_5_SCENE_IDS, type LanternArrangement } from "../story/chapter5";
import { CHAPTER_5_ACTION_NARRATIVE as narrative, chapter5CompanionBeat, getChapter5BrakeNarrative, getChapter5EntryNarrative, getChapter5GuardNarrative, getChapter5SceneParagraphs, getChapter5SignalNarrative } from "../story/chapter5Narrative";
import type { Companion, Player, StatBlock } from "../game/types";
import { acceptOfficerSurrender, bypassChapter5Feed, collectChapter5Evidence, departChapter5Briarhold, finishChapter5CaseWall, freeChapter5CellCaptive, hearChapter5Examiner, hearChapter5ReturnTalk, hearChapter5Woodsman, isChapter5CleanupReady, openChapter5Cells, packChapter5Supplies, readChapter5CaseWall, resolveChapter5Workshop, reuniteChapter5Siblings, seeChapter5Homecoming } from "../game/chapter5Progress";
import { getChapter5AreaName } from "../game/chapter5Runtime";
import { CHAPTER_5_AFTERMATH, getChapter5FullOutcome } from "../story/chapter5Aftermath";

type Props = {
  state: Chapter5SaveState;
  player: Player;
  companion: Companion;
  stats: StatBlock;
  blocked: boolean;
  commit: (state: Chapter5SaveState, resources?: Chapter5Resources) => void;
  startBattle: (state: Chapter5SaveState) => void;
};
const marks = { red: "▲", blue: "●", green: "■", amber: "★" };
const paneColors = { red: "#fb7185", blue: "#7dd3fc", green: "#86efac", amber: "#fcd34d" };

export function Chapter5Spike({ state, player, companion, stats, blocked, commit, startBattle }: Props) {
  const stateRef = useRef(state);
  stateRef.current = state;
  const sceneRef = useRef<HTMLDivElement>(null);
  const change = (update: (current: Chapter5SaveState) => Chapter5SaveState, resources?: Chapter5Resources) => {
    if (blocked) return;
    const next = update(stateRef.current);
    if (next === stateRef.current) return;
    stateRef.current = next;
    commit(next, resources);
  };
  const close = () => change((s) => s.briarhold.investigatorPending || (s.view === "grille" && !s.lioSeen) ||
    (s.brackenDefeated && s.carriageStage !== "rescued") ? s : { ...abandonLedgerDistraction(s), view: null });
  const inspect = () => change((s) => ({ ...s, view: s.briarhold.investigatorPending ? "investigator" : s.node }));
  const edges = getChapter5Edges(state);
  const nodes = [...new Set(edges.flat())];
  const move = (dx: number, dy: number) => change((s) => {
    const current = CH5_NODES[s.node];
    const target = getChapter5Edges(s).flat().find((id) => CH5_NODES[id].x === current.x + dx && CH5_NODES[id].y === current.y + dy);
    return target ? moveChapter5(s, target) : s;
  });

  useEffect(() => {
    if (!blocked && state.view) sceneRef.current?.focus({ preventScroll: true });
  }, [state.view, blocked]);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (blocked || event.defaultPrevented) return;
      const target = event.target as HTMLElement;
      if (event.key === "Escape") { event.preventDefault(); close(); return; }
      if (target.matches("input, textarea, select") || target.isContentEditable) return;
      if (stateRef.current.view || stateRef.current.pendingBattle) return;
      const direction = { ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1], ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0] }[event.key];
      if (direction) { event.preventDefault(); move(direction[0], direction[1]); }
      else if (event.key.toLowerCase() === "e" || (event.key === "Enter" && target.tagName !== "BUTTON")) { event.preventDefault(); inspect(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const roll = (stat: string, dc: number, tildaBonus = false) => {
    const check = resolveSkillCheck(stats, stat, dc);
    if (tildaBonus && companion.id === "tilda" && isCompanionConscious(companion)) {
      check.bonus += 2;
      check.total += 2;
      check.success = check.total >= dc;
      check.label = `${stat} Check: ${check.roll} + ${check.bonus} = ${check.total} vs ${dc} (includes Tilda +2)`;
    }
    return check;
  };
  const prepareBattle = (kind: Chapter5BattleKind) => {
    if (blocked || stateRef.current.pendingBattle) return;
    const s = stateRef.current;
    if (kind === "boss" && (!s.lioSeen || !s.briarhold.innerDoorOpened || s.brackenDefeated)) return;
    if (kind === "officer" && (s.node !== "ledger" || s.ledgerResolved || s.brackenDefeated)) return;
    if (kind === "workshop" && (s.node !== "workshop" || s.workshopResolved || s.brackenDefeated)) return;
    if (kind === "tuskers" && (s.node !== "hollow" || !s.departed || s.returnRoute !== "tusker-hollow" || s.tuskersDefeated)) return;
    const next: Chapter5SaveState = { ...s, pendingBattle: kind, view: null,
      briarhold: kind === "boss" || kind === "tuskers" ? s.briarhold : kind === "gate" ? enterBriarhold(s.briarhold, "assault") : { ...s.briarhold, alert: "alerted", guardsDistracted: false },
      bossProfile: kind === "boss" ? getBriarholdBossProfile(s.briarhold) : s.bossProfile };
    stateRef.current = next;
    startBattle(next);
  };
  const respond = (response: "hide" | "silent-ambush") => change((s) => {
    if (!s.briarhold.investigatorPending) return s;
    const spec = response === "hide" ? CHAPTER_5_CHECKS.hide : CHAPTER_5_CHECKS.silentAmbush;
    const check = roll(spec.stat, spec.dc, true);
    return { ...s, checks: { ...s.checks, investigator: check }, view: "lanterns",
      briarhold: resolveInvestigatingGuard(s.briarhold, response, check.success),
      feedback: getChapter5GuardNarrative(response, check) };
  });
  const enter = (route: "culvert" | "receiving-gate", stat?: string) => change((s) => {
    if (s.briarhold.entry) return s;
    const check = stat ? roll(stat, 12) : null;
    return { ...s, node: "landing", view: "landing", briarhold: enterBriarhold(s.briarhold, route, check?.success),
      checks: check ? { ...s.checks, receiving: check } : s.checks,
      feedback: getChapter5EntryNarrative(route, check) };
  });
  const rescue = () => {
    const s = stateRef.current;
    if (!s.brackenDefeated || s.carriageStage === "rescued") return;
    const check = s.carriageStage === "set-brake" && !s.briarhold.lanternsRestored
      ? s.brakeCheck || roll(CHAPTER_5_CHECKS.unlitBrake.stat, CHAPTER_5_CHECKS.unlitBrake.dc) : s.brakeCheck;
    const result = advanceCarriageRescue(s.carriageStage, true, s.briarhold.lanternsRestored, check?.success);
    const injury = result.injuryRisk ? Math.min(4, Math.max(0, player.hp - 1)) : 0;
    const completed = result.stage === "rescued";
    change((current) => current.carriageStage !== s.carriageStage ? current : {
      ...current, carriageStage: result.stage, brakeCheck: check,
      milestoneAwarded: completed || current.milestoneAwarded,
      feedback: completed ? "You lift the release pin and guide the cuff away from Lio's wrist. Mara reaches him before the iron has finished settling against the seat, holding him so tightly that he has to laugh once, breathlessly, against her shoulder. “Still you,” she whispers. His free hand closes around the back of her coat. “Still me.” You step clear of the frame, giving them room while keeping the empty passage in view." :
        s.carriageStage === "secure-carriage" ? `Mara calls, “Lio, wheel first!” He breaks a tally bar against the seat and drives its thick end into the spokes. The wheel catches hard enough to pull him against the restraint. You reach the frame before it can wrench the bar loose, bracing its weight against the rail bed. ${chapter5CompanionBeat(companion, "secure")}` :
          getChapter5BrakeNarrative(s.briarhold.lanternsRestored, check, injury),
    }, { player: { ...player, hp: player.hp - injury,
      xp: completed && !s.milestoneAwarded ? chapter5MilestoneXp(player) : player.xp } });
  };

  const b = state.briarhold;
  const view = state.view;
  const sceneId = view === "opening" ? CHAPTER_5_SCENE_IDS.opening : view === "investigator" ? CHAPTER_5_SCENE_IDS.investigation :
    view === "ledger" ? CHAPTER_5_SCENE_IDS.ledger : view === "workshop" ? CHAPTER_5_SCENE_IDS.workshop :
    view === "lanterns" ? CHAPTER_5_SCENE_IDS.lanterns : view === "grille" ? CHAPTER_5_SCENE_IDS.firstLio :
    view === "crown" ? CHAPTER_5_SCENE_IDS.boss : view === "carriage" ? CHAPTER_5_SCENE_IDS.rescue :
    view === "hub" ? CHAPTER_5_SCENE_IDS.hub : view === "landing" ? CHAPTER_5_SCENE_IDS.landing :
    view === "cells" ? CHAPTER_5_SCENE_IDS.captives : view === "gathering" ? CHAPTER_5_SCENE_IDS.reunion :
    view === "square" ? CHAPTER_5_SCENE_IDS.homecoming : view === "watchhouse" ? CHAPTER_5_SCENE_IDS.caseWall :
    view === "overlook" ? CHAPTER_5_SCENE_IDS.overlook : `ch5-${view}`;
  const action = (id: string, label: string, effect: () => void, locked = false) => (
    <ChoiceButton key={id} choice={{ id: `ch5-${id}`, label, locked: locked || blocked }} onChoose={effect} />
  );
  const adjacent = (id: Chapter5Node) => edges.some(([a, c]) => a === state.node && c === id || c === state.node && a === id);
  const mapLeft = Math.min(...nodes.map(id => CH5_NODES[id].x)) - .6;
  const mapTop = Math.min(...nodes.map(id => CH5_NODES[id].y)) - .55;
  const mapWidth = Math.max(...nodes.map(id => CH5_NODES[id].x)) - mapLeft + .6;
  const mapHeight = Math.max(...nodes.map(id => CH5_NODES[id].y)) - mapTop + .75;
  const chooseRoute = (node: "detour" | "hollow") => change(s => moveChapter5({ ...s, view: null }, node));

  return <div data-testid="chapter5-spike" data-ch5-node={state.node} data-ch5-area={getChapter5AreaName(state)} data-alert={b.alert} className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-black/25 p-3">
      <span className="font-semibold">{CH5_NODES[state.node].label}</span>
      {state.departed ? <span className="text-amber-100">{getChapter5AreaName(state)}</span> : <span data-testid="ch5-alert" className={b.alert === "alerted" ? "text-rose-200" : "text-amber-100"}>Alert: {b.alert[0].toUpperCase() + b.alert.slice(1)}</span>}
    </div>
    {state.carriageStage === "rescued" ? <p data-testid="ch5-rescued-party" className="text-sm text-amber-100/80">Together: Mara · Lio{state.clerkFreed ? " · Sella" : ""}{state.porterFreed ? " · Orren" : ""}{state.wardenFreed ? " · Hesta" : ""}</p> : null}
    <div className={view ? "hidden md:block" : ""}>
      <div className="relative h-80 rounded-2xl border border-amber-100/15 bg-slate-950 sm:h-72" aria-label="Briarhold paths">
        <svg className="absolute h-full w-full" viewBox={`${mapLeft} ${mapTop} ${mapWidth} ${mapHeight}`} preserveAspectRatio="none" aria-hidden="true">
          {edges.map(([a, c]) => <line key={`${a}-${c}`} x1={CH5_NODES[a].x} y1={CH5_NODES[a].y} x2={CH5_NODES[c].x} y2={CH5_NODES[c].y} stroke="#ac9671" strokeWidth="0.035" />)}
        </svg>
        {nodes.map((id) => <button key={id} data-ch5-map-node={id} title={CH5_NODES[id].label} aria-label={`${id === state.node ? "Inspect" : "Move to"} ${CH5_NODES[id].label}`}
          aria-current={id === state.node ? "location" : undefined} disabled={blocked || !!view || !!state.pendingBattle || id !== state.node && !adjacent(id)}
          style={{ left: `${(CH5_NODES[id].x - mapLeft) / mapWidth * 100}%`, top: `${(CH5_NODES[id].y - mapTop) / mapHeight * 100}%` }}
          className={`absolute grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl border text-xl ${id === state.node ? "border-amber-200 bg-amber-950 ring-2 ring-amber-200/40" : "border-slate-600 bg-slate-900"} disabled:cursor-default`}
          onClick={() => id === state.node ? inspect() : change((s) => moveChapter5(s, id))}>
          {id === state.node ? "🧑‍🦱" : CH5_NODES[id].icon}
          <span aria-hidden="true" className="absolute top-full mt-1 w-12 text-center text-[10px] leading-3 text-amber-50/80 sm:w-16">{CH5_NODES[id].label}</span>
        </button>)}
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-2" aria-label="Briarhold movement controls">
        <Button aria-label="Move up" disabled={blocked || !!view || !!state.pendingBattle} onClick={() => move(0, -1)}>↑</Button>
        <Button aria-label="Move left" disabled={blocked || !!view || !!state.pendingBattle} onClick={() => move(-1, 0)}>←</Button>
        <Button disabled={blocked || !!view || !!state.pendingBattle} onClick={inspect}>Inspect</Button>
        <Button aria-label="Move right" disabled={blocked || !!view || !!state.pendingBattle} onClick={() => move(1, 0)}>→</Button>
        <Button aria-label="Move down" disabled={blocked || !!view || !!state.pendingBattle} onClick={() => move(0, 1)}>↓</Button>
      </div>
      <p className="mt-2 text-center text-xs text-white/60">Arrow keys / WASD to move · E to inspect · M for inventory and equipment</p>
    </div>
    {state.feedback ? <div data-testid="ch5-feedback" role="status" className="space-y-3 rounded-xl border border-amber-200/20 bg-amber-950/30 p-3 text-sm leading-7">{state.feedback.split("\n\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div> : null}
    {state.pendingBattle && !blocked ? action("resume-battle", "Resume the fight", () => startBattle(stateRef.current)) : null}
    {view && !state.pendingBattle ? <div ref={sceneRef} tabIndex={-1} role="dialog" aria-label={view === "opening" ? "The same night" : view === "investigator" ? "An investigating guard" : CH5_NODES[view]?.label}
      data-scene-id={sceneId} className="space-y-4 rounded-2xl border border-white/15 bg-slate-900 p-4 text-sm leading-7 sm:p-5">
      {!b.investigatorPending && !(view === "grille" && !state.lioSeen) && !(state.brackenDefeated && state.carriageStage !== "rescued") && view !== "opening" ? action("back", "Back to the path", close) : null}
      <div data-testid="ch5-scene-narrative" className="space-y-4">{getChapter5SceneParagraphs(state, companion).map((paragraph, index) => <p key={`${view}-${index}`}>{paragraph}</p>)}</div>
      {view === "opening" ? <>
        {action("cross-ridge", "Cross the nighttime ridge to the overlook", () => change((s) => ({ ...s, view: "overlook", feedback: narrative.crossRidge })))}
      </> : null}
      {view === "overlook" ? <>
        {!state.recoveryUsed ? action("recover", "Give the party first aid (restore HP once)", () => change((s) => s.recoveryUsed ? s : ({ ...s, recoveryUsed: true, feedback: narrative.recover }),
          { player: { ...player, hp: player.maxHp }, companion: companion.recruited ? { ...companion, hp: companion.maxHp } : companion })) : null}
      </> : null}
      {view === "culvert" ? <>
        {action("enter-culvert", "Enter through the culvert — Quiet", () => enter("culvert"))}</> : null}
      {view === "gate" ? <>
        {action("enter-precision", "Slip behind the wagon — Precision DC 12", () => enter("receiving-gate", "Precision"))}
        {action("enter-heart", "Act like authorized workers — Heart DC 12", () => enter("receiving-gate", "Heart"))}
        {action("assault-gate", "Attack the receiving guards — Alerted", () => prepareBattle("gate"))}
      </> : null}
      {view === "workshop" ? <>
        {!state.workshopResolved ? state.carriageStage === "rescued"
          ? action("workshop-surrender", "Secure the sealwright and approach the bench", () => change(s => resolveChapter5Workshop(s, "surrendered"))) : <>
            {action("resolve-workshop", "Quietly warn the laborer from behind the cooling rack", () => change(s => resolveChapter5Workshop(s, "bypassed", companion)))}
            {companion.id === "rowan" && isCompanionConscious(companion) && !state.rowanContainmentUsed ? action("contain-dessa", "Have Rowan quietly contain the sealwright", () => change(s => resolveChapter5Workshop(s, "contained", companion))) : null}
            {action("fight-workshop", "Confront the sealwright openly — Alerted", () => prepareBattle("workshop"))}
          </> : null}
        {state.workshopResolved && !b.shimFound ? action("take-shim", "Take the lock shim", () => change((s) => ({ ...s, briarhold: { ...s.briarhold, shimFound: true }, feedback: narrative.takeShim }))) : null}
        {state.workshopResolved && !b.workshopDisabled && companion.id === "moss" && isCompanionConscious(companion) ? action("moss-feed", "Have Moss bypass the machinery feed", () => change(s => bypassChapter5Feed(s, companion))) : null}
        {state.workshopResolved && !b.workshopDisabled ? action("disable-workshop", "Disconnect the feed to disrupt the Briar machinery", () => change((s) => ({ ...s, briarhold: { ...s.briarhold, workshopDisabled: true }, feedback: narrative.disableWorkshop }))) : null}
        {state.workshopResolved && !state.evidence.includes("false-seals") ? action("take-seals", "Wrap the seal patterns and chipped official die", () => change(s => collectChapter5Evidence(s, "false-seals"))) : null}
      </> : null}
      {view === "ledger" ? <>
        {!state.ledgerResolved ? state.carriageStage === "rescued"
          ? action("officer-surrender", "Secure the officer and reach the desk", () => change(acceptOfficerSurrender)) : <>{state.ledgerOfficerDistracted
          ? action("secure-ledger", "Ambush and bind the officer quietly — Precision DC 12", () => change((s) => {
            if (!s.ledgerOfficerDistracted || s.ledgerResolved || s.checks.ledgerOfficer) return s;
            const spec = CHAPTER_5_CHECKS.ledgerAmbush;
            return secureLedgerOfficer(s, roll(spec.stat, spec.dc, true));
          }))
          : action("resolve-ledger", "Rattle the receiving tally to draw the officer away", () => change(distractLedgerOfficer))}
          {action("fight-officer", "Confront the records officer openly — Alerted", () => prepareBattle("officer"))}</> : <>
          {!state.clerkFreed ? action("free-clerk", "Release the clerk's desk cuff", () => change(freeLedgerClerk)) : null}
          {!state.evidence.includes("transfer-ledger") ? action("take-ledger", "Take the original five-prisoner transfer ledger", () => change(s => collectChapter5Evidence(s, "transfer-ledger"))) : null}
          {!state.evidence.includes("genuine-office-instruction") ? action("take-instruction", "Preserve the original office instruction", () => change(s => collectChapter5Evidence(s, "genuine-office-instruction"))) : null}
          {action("read-chart", "Review the fixed signal chart", () => change((s) => ({ ...s, chartRead: true, feedback: narrative.readChart })))}
          {state.chartRead ? <div data-testid="ch5-signal-chart" className="overflow-x-auto rounded-xl bg-black/30 p-3">
            <p className="mb-2 font-semibold">Fixed signal chart · left → center → right</p>
            {CAPTIVE_LANTERN_SIGNALS.map((signal) => <p key={signal.id} className="mb-2"><strong>{signal.label}</strong><br />{signal.panes.map((pane) => `${pane[0].toUpperCase() + pane.slice(1)} ${marks[pane]}`).join(" → ")}</p>)}
          </div> : null}
          {!b.spareKeyFound ? action("open-drawer", "Open the locked drawer", () => change((s) => {
            const next = openBriarholdDrawer(s.briarhold);
            return { ...s, briarhold: next, feedback: next.spareKeyFound ? narrative.drawerOpened : narrative.drawerLocked };
          })) : null}
        </>}
      </> : null}
      {view === "lanterns" ? <>
        <div className="grid grid-cols-3 gap-2" data-testid="ch5-pane-controls">
          {state.panes.map((pane, index) => <label key={index} className="min-w-0 rounded-xl border border-white/15 bg-black/20 p-2 text-center">
            <span className="block font-semibold">{["Left", "Center", "Right"][index]}</span>
            <span className="my-2 block text-4xl" style={{ color: pane ? paneColors[pane] : "#94a3b8" }} aria-hidden="true">{pane ? marks[pane] : "◇"}</span>
            <select aria-label={`${["Left", "Center", "Right"][index]} lantern pane`} value={pane || ""} disabled={blocked}
              className="w-full rounded-lg border border-white/25 bg-slate-950 px-1 py-3 text-sm" onChange={(event) => {
                const value = event.target.value;
                change((s) => { const panes = [...s.panes] as Chapter5SaveState["panes"]; panes[index] = value as typeof pane || null; return { ...s, panes }; });
              }}>
              <option value="">Empty</option>
              {CAPTIVE_LANTERN_PANES.map((p) => <option key={p.id} value={p.id}>{p.label} {marks[p.id]}</option>)}
            </select>
          </label>)}
        </div>
        {action("transmit", "Pull the transmission shutters", () => change((s) => {
          if (s.panes.some((pane) => !pane)) return s;
          const result = transmitLanternSignal(s.briarhold, s.panes as LanternArrangement);
          if (!result.transmitted) return s;
          const feedback = getChapter5SignalNarrative(result.signal, result.state);
          return { ...s, briarhold: result.state, view: result.state.investigatorPending ? "investigator" : "lanterns", feedback };
        }), state.panes.some((pane) => !pane))}
        {!state.goldChannelUncovered ? action("uncover-gold", "Lift the guide lamp's cover", () => change((s) => ({ ...s, goldChannelUncovered: true, feedback: narrative.uncoverGold }))) : null}
        {state.goldChannelUncovered && !b.lanternsRestored ? action("restore-gold", "Clear the briars and raise the lamp shutter", () => change((s) => ({ ...s, briarhold: { ...s.briarhold, lanternsRestored: true }, feedback: `${narrative.restoreGold}\n\n${chapter5CompanionBeat(companion, "light")}`.trim() }))) : null}
      </> : null}
      {view === "investigator" ? <>
        {action("hide", "Hide in the recess — Instinct DC 12", () => respond("hide"))}
        {action("silent-ambush", "Disarm him silently — Precision DC 15", () => respond("silent-ambush"))}
        {action("fight-investigator", "Fight the investigating guard — Alerted", () => prepareBattle("investigator"))}
      </> : null}
      {view === "door" ? <>
        {!b.innerDoorOpened && canOpenBriarholdInnerDoor(b) ? action("unlock-door", "Unlock the inner door with the spare key", () => change((s) => ({ ...s, briarhold: { ...s.briarhold, innerDoorOpened: true }, feedback: narrative.unlockDoor }))) : null}
        {!b.innerDoorOpened ? action("fight-door", "Attack the door detail and take its key — Alerted", () => prepareBattle("door")) : null}
      </> : null}
      {view === "grille" ? <>
        {!state.lioSeen ? action("recognize-lio", "Answer Lio silently and continue", () => change((s) => ({ ...s, lioSeen: true, view: null, feedback: narrative.recognizeLio }))) : null}
      </> : null}
      {view === "crown" ? <>
        {!state.brackenDefeated ? action("fight-bracken", "Confront Bracken and his supports", () => prepareBattle("boss"), !state.lioSeen) : null}
        {state.carriageStage === "rescued" && !state.evidence.includes("examiner-transfer-record") ? action("take-docket", "Take the separate prisoner transfer docket", () => change(s => collectChapter5Evidence(s, "examiner-transfer-record"))) : null}
      </> : null}
      {view === "carriage" ? <>
        {state.carriageStage !== "rescued" ? action("rescue-step", { "secure-carriage": "Secure the carriage", "set-brake": b.lanternsRestored ? "Set the true brake" : "Read the linkage and set the brake — Instinct DC 12", "free-lio": "Release Lio's restraints", rescued: "" }[state.carriageStage], rescue) : <>
          <div className="rounded-xl border border-emerald-200/25 bg-emerald-950/30 p-3"><strong>Lio is rescued.</strong> Follow the carriage passage to the adjoining cells, gather the surviving originals, and bring everyone to the sheltered service court.</div>
          {action("continue-rescue", "Help the other prisoners", close)}
        </>}
      </> : null}
      {view === "cells" ? <>
        {!state.cellsOpened ? action("open-cells", "Lift the shared cell release bar", () => change(openChapter5Cells)) : <>
          {!state.porterFreed ? action("free-porter", "Help the man out of the nearer cell", () => change(s => freeChapter5CellCaptive(s, "porter"))) : null}
          {!state.wardenFreed ? action("free-warden", "Help the roadwarden out of the farther cell", () => change(s => freeChapter5CellCaptive(s, "warden"))) : null}
        </>}
      </> : null}
      {view === "gathering" ? <>
        <div data-testid="ch5-departure-checklist" className="rounded-xl bg-black/25 p-3">
          <p>{state.clerkFreed ? "✓ Sella safe" : "○ Clerk at the records desk"} · {state.porterFreed ? "✓ Orren safe" : "○ Nearer cell prisoner"} · {state.wardenFreed ? "✓ Hesta safe" : "○ Farther cell prisoner"}</p>
          {([["transfer-ledger", "Records desk: transfer ledger"], ["genuine-office-instruction", "Records desk: office instruction"], ["false-seals", "Workshop: seal-making materials"], ["examiner-transfer-record", "Crown Table: separate transfer docket"]] as const).map(([id, label]) => <p key={id}>{state.evidence.includes(id) ? "✓" : "○"} {label}</p>)}
        </div>
        {!state.examinerLeadLearned ? action("hear-examiner", "Hear Lio's account of the fifth prisoner", () => change(hearChapter5Examiner), !isChapter5CleanupReady(state)) : null}
        {state.examinerLeadLearned ? action("review-examiner", "Recall Lio's account of Celia Venn", () => change(s => ({ ...s, feedback: CHAPTER_5_AFTERMATH.examiner }))) : null}
        {state.examinerLeadLearned && !state.siblingsReunited ? action("reunite-siblings", "Give Mara and Lio time together", () => change(s => reuniteChapter5Siblings(s, companion))) : null}
        {state.siblingsReunited ? action("review-reunion", "Recall the siblings' reunion", () => change(s => ({ ...s, feedback: getChapter5FullOutcome("reunion", companion) }))) : null}
        {isChapter5CleanupReady(state) && !state.suppliesClaimed ? action("pack-supplies", "Pack the road stores for everyone", () => change(packChapter5Supplies)) : null}
        {action("depart", "Leave Briarhold at dawn — take the eastern trails home", () => change(s => departChapter5Briarhold(s, companion)), !state.siblingsReunited || !state.examinerLeadLearned || !isChapter5CleanupReady(state))}
      </> : null}
      {view === "woodsman" && !state.woodsmanHeard ? action("hear-woodsman", "Rest with Garrick and ask about the trails", () => change(s => hearChapter5Woodsman(s, companion))) : null}
      {view === "woodsman" && state.woodsmanHeard ? action("review-woodsman", "Recall Garrick's account and trail warning", () => change(s => ({ ...s, feedback: getChapter5FullOutcome("woodsman", companion) }))) : null}
      {view === "fork" ? <>
        {action("safe-detour", "Take the longer high-ground trail around the tuskers", () => chooseRoute("detour"))}
        {action("choose-hollow", "Approach the shorter tusker hollow", () => chooseRoute("hollow"))}
      </> : null}
      {view === "hollow" && !state.tuskersDefeated ? action("fight-tuskers", "Clear the crossing — face both territorial tuskers", () => prepareBattle("tuskers")) : null}
      {view === "eastRoad" && !state.returnConversationHeard ? action("return-talk", "Talk with Lio and Mara at the bridge", () => change(s => hearChapter5ReturnTalk(s, companion))) : null}
      {view === "eastRoad" && state.returnConversationHeard ? action("review-return-talk", "Recall the conversation at the bridge", () => change(s => ({ ...s, feedback: getChapter5FullOutcome("return-talk", companion) }))) : null}
      {view === "square" && !state.homecomingSeen ? action("homecoming", "Bring the rescued party into the homecoming", () => change(s => seeChapter5Homecoming(s, companion))) : null}
      {view === "square" && state.homecomingSeen ? action("review-homecoming", "Recall Bramblecross's welcome", () => change(s => ({ ...s, feedback: getChapter5FullOutcome("homecoming", companion) }))) : null}
      {view === "watchhouse" ? <>
        {!state.caseWallEvidenceRead ? action("read-case", "Lay out the originals and hear the witnesses", () => change(readChapter5CaseWall)) : null}
        {state.caseWallEvidenceRead && !state.caseWallComplete ? action("close-chapter", "Stay with Mara and Lio as Enna joins the evidence", () => change(s => finishChapter5CaseWall(s, companion))) : null}
        {state.caseWallEvidenceRead ? action("review-case", "Review the originals and witness accounts", () => change(s => ({ ...s, feedback: CHAPTER_5_AFTERMATH.caseReading }))) : null}
        {state.caseWallComplete ? action("review-ending", "Recall the closing conversation", () => change(s => ({ ...s, feedback: getChapter5FullOutcome("closing", companion) }))) : null}
        {state.caseWallComplete ? <p data-testid="ch5-complete" className="rounded-xl bg-emerald-950/40 p-3 font-semibold text-emerald-100">Chapter Five complete · Briarhold Waystation<br />Next lead: Celia Venn and Elowen's hearing in Lanthorne.</p> : null}
      </> : null}
    </div> : null}
  </div>;
}
