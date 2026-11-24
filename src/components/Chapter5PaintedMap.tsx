import { useId, useState } from "react";
import { CH5_CART_ART, getChapter5MapPosition, getChapter5PaintedLayout, isChapter5MapWaypoint, type Chapter5MapPoint } from "../data/chapter5Maps";
import { getDialoguePortrait } from "../data/portraits";
import { getBriarholdBossProfile } from "../game/chapter5";
import { getChapter5MapNeighbors, walkChapter5MapTo } from "../game/chapter5Map";
import { isCompanionConscious } from "../game/companions";
import { canLeaveChapter5Scene, CH5_NODES, type Chapter5SaveState } from "../game/chapter5Runtime";
import type { Companion, Player } from "../game/types";
import { getChapter5Landmark } from "../story/chapter5Knowledge";
import { HeroArtwork } from "./HeroArtwork";

function Actor({ id, at, name, icon, portrait, size = .7 }: { id: string; at: number[]; name: string; icon: string; portrait?: string; size?: number }) {
  const clip = useId();
  const art = portrait && getDialoguePortrait(portrait);
  return <svg data-ch5-actor={id} x={at[0] - size / 2} y={at[1] - size / 2} width={size} height={size} viewBox="0 0 40 40">
    <title>{name}</title><defs><clipPath id={clip}><circle cx="20" cy="20" r="18" /></clipPath></defs>
    <circle cx="20" cy="20" r="19" fill="#18252b" stroke="#c4b48c" strokeWidth="2" />
    <text x="20" y="28" textAnchor="middle" fontSize="24">{icon}</text>
    {art ? <image href={art.src} width="40" height="40" preserveAspectRatio="xMidYMin slice" clipPath={`url(#${clip})`} onError={e => { e.currentTarget.style.display = "none"; }} /> : null}
  </svg>;
}

function ApproachStates({ state }: { state: Chapter5SaveState }) {
  const grate = !state.checks.culvert ? "closed" : state.checks.culvert.success ? "open" : "wedged";
  return <>
    <g data-testid="ch5-culvert-grate" data-state={grate} transform={`translate(29.25 28.2) rotate(${grate === "open" ? -72 : grate === "wedged" ? 16 : 0})`}>
      <rect x="-.19" y="-.78" width=".38" height="1.56" fill="#182124" stroke="#9eaa9e" strokeWidth=".07" />
      {[-.48, 0, .48].map(y => <path key={y} d={`M-.18 ${y}h.36`} stroke="#b4bdae" strokeWidth=".08" />)}
    </g>
    <Actor id="receiving-guard-west" at={[28.1, 16.35]} name="Receiving guard" icon="🛡️" />
    <Actor id="receiving-guard-east" at={[28.2, 18.0]} name="Receiving guard" icon="🛡️" />
  </>;
}

function RescueStates({ state, companion }: { state: Chapter5SaveState; companion: Companion }) {
  const defeated = state.brackenDefeated;
  const freed = state.carriageStage === "rescued";
  const cartStage = !defeated ? "parked" : state.carriageStage === "secure-carriage" ? "released" : state.carriageStage === "set-brake" ? "caught" : freed ? "freed" : "braked";
  const cartY = !defeated ? 19.1 : cartStage === "released" ? 19.9 : 20.2;
  const guards = defeated ? 0 : (state.bossProfile || getBriarholdBossProfile(state.briarhold)).enemyIds.filter(id => id === "thornseal_guard").length;
  const inRoom = state.node !== "grille" || ["r02", "r03", "r04", "r05", "r06"].includes(state.mapWaypoint);
  return <>
    <g data-testid="ch5-cart" data-state={cartStage} transform={`translate(54.8 ${cartY})`}>
      <rect x="-.55" y="-.5" width="1.1" height="1" rx=".06" fill="#67492c" stroke="#b99c69" strokeWidth=".06" />
      <image href={CH5_CART_ART} x="-.7" y="-.6" width="1.4" height="1.2" onError={e => { e.currentTarget.style.display = "none"; }} />
      <path d="M.45 -.25h.25m-.12 0v.32" fill="none" stroke="#9caca4" strokeWidth=".07" />
      {state.briarhold.lanternsRestored ? <path data-testid="ch5-brake-rod" d="M.48 .25L.66 0L.2 -.2" fill="none" stroke="#f5d48c" strokeWidth=".075" /> : null}
      <g data-testid="ch5-cuff" data-state={freed ? "open" : "closed"}>
        <path d="M-.13 -.12h.25l.1 -.12" fill="none" stroke="#e0c797" strokeWidth=".06" />
        {freed ? <path d="M.3 -.29a.13 .13 0 1 0 .06 .2" fill="none" stroke="#e0c797" strokeWidth=".055" /> : <circle cx=".3" cy="-.25" r=".13" fill="none" stroke="#e0c797" strokeWidth=".055" />}
      </g>
    </g>
    {!freed ? <Actor id="lio" at={[54.8, cartY - .06]} name="Lio, cuffed to the cart" portrait="Lio Brindle" icon="🧑" size={.6} /> : null}
    {!defeated ? <>
      <Actor id="bracken" at={[53.5, 15]} name="Officer at the route table" icon="⚔️" size={.8} />
      <Actor id="sentry" at={[52.9, 17]} name="Root-and-timber construct" icon="🪵" size={.85} />
      {guards > 0 ? <Actor id="guard-west" at={[48.6, 15.3]} name="Room guard" icon="🛡️" /> : null}
      {guards > 1 ? <Actor id="guard-east" at={[56.5, 14.7]} name="Room guard" icon="🛡️" /> : null}
    </> : <g data-ch5-actor="fallen-sentry" transform="translate(49.5 17.1) rotate(-22)"><title>Fallen Sentry</title><path d="M-.7 -.2L.7 .2M-.5 .28L.5 -.28M-.3 -.35L-.4 .35" stroke="#8f8059" strokeWidth=".23" strokeLinecap="round" /></g>}
    {!freed && inRoom ? <>
      <Actor id="mara" at={defeated ? [54, 18.9] : [46.6, 18.3]} name="Mara" portrait="Mara Brindle" icon="🧑" />
      {isCompanionConscious(companion) ? <Actor id="companion" at={defeated ? [56, 20.2] : [54.4, 17.4]} name={companion.name} portrait={companion.name} icon={companion.icon || "🛡️"} /> : null}
    </> : null}
    <g data-testid="ch5-escape-door" data-state={defeated ? "closed-after-flight" : "closed"}><path d="M59.55 17.45v1.65" stroke="#6f5334" strokeWidth=".22" /><path d="M59.42 17.65v1.2" stroke="#bd9c65" strokeWidth=".05" /></g>
    {freed && !state.brackenLootClaimed ? <g data-testid="ch5-fallen-sabre" transform="translate(52.35 16.25) rotate(35)"><title>Bracken's fallen sabre</title><path d="M0 -.4v.65m-.16 -.03h.32m-.16 0v.25" fill="none" stroke="#f4d99d" strokeWidth=".085" /></g> : null}
    <g data-testid="ch5-cell-bars" data-state={state.cellsOpened ? "open" : "closed"}>
      {[56.5, 58.95].map(x => <g key={x} transform={`translate(${x} 23.04) rotate(${state.cellsOpened ? -82 : 0})`}>
        <path d="M0 0h2.15" stroke="#9caa9e" strokeWidth=".08" />
        {[.2, .6, 1, 1.4, 1.8, 2.1].map(v => <path key={v} d={`M${v} -.13v.26`} stroke="#9caa9e" strokeWidth=".06" />)}
      </g>)}
    </g>
    {!state.wardenFreed ? <Actor id="far-cell-prisoner" at={[60.1, 24.15]} name="Far-cell prisoner" icon="🧑" size={.75} /> : null}
    {!state.porterAtWorkshop && !state.porterFreed ? <Actor id="near-cell-prisoner" at={[57.5, 24.15]} name="Near-cell prisoner" icon="🧑" size={.75} /> : state.porterAtWorkshop && !state.suppliesClaimed ? <rect data-testid="ch5-cell-bundle" x="57.1" y="23.85" width=".8" height=".6" rx=".14" fill="#8b7a51" stroke="#b6a97d" strokeWidth=".06" /> : null}
  </>;
}

function RecordsStates({ state }: { state: Chapter5SaveState }) {
  return <>
    <Actor id="records-officer"
      at={state.ledgerResolved ? [36.26, 7.8] : state.ledgerOfficerDistracted ? [36.15, 8.25] : [37.62, 7.72]}
      name={state.ledgerResolved ? "Secured officer" : "Records officer"} icon={state.ledgerResolved ? "🪢" : "🛡️"} size={.53} />
    {!state.clerkFreed ? <Actor id="records-clerk" at={[40.7, 8.4]} name="Clerk at the writing desk" icon="🪶" size={.53} />
      : state.carriageStage !== "rescued" ? <Actor id="records-clerk" at={[35.61, 11.32]} name="Sella in cover" icon="🪶" size={.4} /> : null}
  </>;
}

function WorkshopStates({ state }: { state: Chapter5SaveState }) {
  const diverted = state.workshopResolved && state.workshopResolution === "bypassed";
  const secured = state.workshopResolved && !diverted;
  return <>
    {state.workshopResolution !== "fought" ? <Actor id="workshop-supervisor"
      at={diverted ? [33.2, 31.1] : secured ? [31.19, 28.91] : [31.46, 26.61]}
      name={secured ? "Secured supervisor" : "Workshop supervisor"} icon={secured ? "🪢" : "🔨"} size={.53} /> : null}
    {state.porterAtWorkshop && !state.porterFreed ? <Actor id="workshop-porter"
      at={diverted ? [31.3, 31] : [31.52, 27.48]}
      name={diverted ? "Laborer at the wash trough" : "Laborer at the press"} icon="🧑" size={.53} />
      : state.porterAtWorkshop && state.carriageStage !== "rescued" ? <Actor id="workshop-porter" at={[34.19, 29.97]} name="Orren in cover" icon="🧑" size={.4} /> : null}
  </>;
}

export function Chapter5PaintedMap({ state, player, companion, blocked, onChoose, onInspect }: {
  state: Chapter5SaveState; player: Player; companion: Companion; blocked: boolean;
  onChoose: (point: Chapter5MapPoint) => void; onInspect: () => void;
}) {
  const layout = getChapter5PaintedLayout(state)!;
  const [showPaths, setShowPaths] = useState(false);
  const [failedSrc, setFailedSrc] = useState("");
  const src = layout.openBackground && state.briarhold.lanternsRestored ? layout.openBackground : layout.background;
  const fallback = failedSrc === src;
  const current = getChapter5MapPosition(state);
  const here = layout.nodes[current]!;
  const opening = state.view === "opening" && layout.id === "briarholdApproach";
  const heroPoint = opening ? [5.2, 20.5] : here.point;
  const [left, top, width, height] = layout.bounds;
  const place = (p: readonly number[]) => ({ left: `${(p[0] - left) / width * 100}%`, top: `${(p[1] - top) / height * 100}%` });
  const label = (id: Chapter5MapPoint) => layout.nodes[id]?.label || (getChapter5Landmark(state, id as keyof typeof CH5_NODES) || CH5_NODES[id])?.label;
  const neighbors = getChapter5MapNeighbors(state);
  const locked = blocked || !canLeaveChapter5Scene(state);
  const canChoose = (id: Chapter5MapPoint) => !locked && (isChapter5MapWaypoint(id) ? neighbors.some(n => n.id === id) : id === current || walkChapter5MapTo(state, id, companion) !== state);
  return <div className="space-y-2">
    <div data-testid="ch5-painted-map" data-map-id={layout.id} data-map-position={opening ? "opening" : current} data-map-art={fallback ? "fallback" : "painted"}
      data-guide-light={state.briarhold.lanternsRestored ? "open" : "closed"} aria-label={layout.id === "briarholdApproach" ? "Briarhold approach" : layout.id === "briarholdLedger" ? "Briarhold upper workroom" : layout.id === "briarholdWorkshop" ? "Briarhold lower workroom" : "Briarhold rescue room"}
      className="ch5-painted-frame" style={{ aspectRatio: layout.aspectRatio }}>
      {!fallback ? <img data-testid="ch5-map-background" className="ch5-map-background" src={src} alt="" draggable={false} onError={() => setFailedSrc(src)} /> : null}
      <svg className="ch5-map-overlays" viewBox={layout.bounds.join(" ")} aria-hidden="true">
        {layout.id === "briarholdApproach" ? <ApproachStates state={state} /> : layout.id === "briarholdLedger" ? <RecordsStates state={state} /> : layout.id === "briarholdWorkshop" ? <WorkshopStates state={state} /> : <RescueStates state={state} companion={companion} />}
        {showPaths || fallback ? <g data-testid="ch5-map-paths" fill="none" stroke="#eed6a4" strokeOpacity=".65" strokeWidth=".045">
          {layout.edges.map(edge => <path key={`${edge.from}-${edge.to}`} d={`M${layout.nodes[edge.from]!.point.join(" ")}L${layout.nodes[edge.to]!.point.join(" ")}`} />)}
        </g> : null}
      </svg>
      {Object.entries(layout.nodes).filter(([, node]) => !node.portal).map(([rawId, node]) => {
        const id = rawId as Chapter5MapPoint;
        const waypoint = isChapter5MapWaypoint(id);
        const available = canChoose(id);
        return <button key={id} type="button" data-ch5-map-node={id} title={label(id)}
          aria-label={`${id === current ? "Inspect" : "Move to"} ${label(id)}`} aria-current={id === current ? "location" : undefined}
          disabled={!available} className={`ch5-map-stop${waypoint ? " ch5-map-stop--waypoint" : ""}${available ? " is-available" : ""}`}
          style={place(node.point)} onClick={() => id === current && !waypoint ? onInspect() : onChoose(id)}>
          <span aria-hidden="true">{waypoint ? "·" : (getChapter5Landmark(state, id) || CH5_NODES[id]).icon}</span>
        </button>;
      })}
      <div data-testid="ch5-hero-token" className="map-hero-token ch5-hero-token" style={place(heroPoint)} aria-label={`${player.name || "Hero"} at ${opening ? "the road below Briarhold" : label(current)}`}>
        <HeroArtwork player={player} variant="token" decorative />
      </div>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-xs text-amber-50/75">
      <span data-testid="ch5-map-location">{opening ? "The road below Briarhold" : label(current)}</span>
      <label className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={showPaths} onChange={e => setShowPaths(e.target.checked)} />Show paths</label>
    </div>
    {layout.id === "briarholdLedger" || layout.id === "briarholdWorkshop" ? <button type="button" data-ch5-map-node="hub" disabled={!canChoose("hub")} className="ch5-map-exit" onClick={() => onChoose("hub")}>↓ Return to the hub</button> : null}
    {layout.id === "briarholdWorkshop" ? <button type="button" data-ch5-map-node="lanterns" disabled={!canChoose("lanterns")} className="ch5-map-exit" onClick={() => onChoose("lanterns")}>→ Up the east stair</button> : null}
    {layout.id === "briarholdCrownTable" ? <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-amber-100/75">
      <button type="button" data-ch5-map-node="door" disabled={!canChoose("door")} className="ch5-map-exit" onClick={() => onChoose("door")}>← Return to the inner post</button>
      <span>{state.briarhold.lanternsRestored ? "Amber guide light" : "Guide shutter closed"} · {state.carriageStage === "rescued" ? "Lio is free" : "Lio is cuffed to the cart"}</span>
    </div> : null}
  </div>;
}
