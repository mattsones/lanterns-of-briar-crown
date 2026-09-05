import type { CSSProperties } from "react";
import { ENEMY_DB } from "../data/enemies";
import { TILE_META } from "../data/maps";
import {
  areMapNodesConnected,
  getMapNodePoint,
  getMapVisualConfig,
  getNavigationNodeKeys,
  hasNavigationGraph,
  isMapNavigationNode,
} from "../data/mapVisuals";
import { getDialoguePortrait } from "../data/portraits";
import { getVisitedKey, isBlockedInteractionTile } from "../game/map";
import type { MapNpcToken } from "../game/westrootMap";
import { HeroArtwork } from "./HeroArtwork";

const MAP_TOKEN_CONFIG: Record<
  string,
  {
    kind: "npc" | "action" | "threat";
    portraitName?: string;
    artworkSrc?: string;
    spentArtworkSrc?: string;
    artworkAlt?: string;
    artworkMode?: "icon" | "enemy";
    hideWhenSpent?: boolean;
    portraitFocus?: { x: number; y: number; scale?: number };
  }
> = {
  elder: {
    kind: "npc",
    portraitName: "Elder Brynn",
    portraitFocus: { x: 56, y: 27, scale: 1.7 },
  },
  pibble: {
    kind: "npc",
    portraitName: "Pibble Thatch",
    portraitFocus: { x: 55, y: 25, scale: 1.75 },
  },
  baker: {
    kind: "npc",
    portraitName: "Nella the Baker",
    portraitFocus: { x: 59, y: 22, scale: 1.65 },
  },
  farmer: {
    kind: "npc",
    portraitName: "Toma Fielding",
    portraitFocus: { x: 51, y: 24, scale: 1.7 },
  },
  weaver: {
    kind: "npc",
    portraitName: "Sela of the Loom",
    portraitFocus: { x: 44, y: 27, scale: 1.9 },
  },
  ranger: {
    kind: "npc",
    portraitName: "Nix Fernwhistle",
    portraitFocus: { x: 50, y: 26, scale: 1.7 },
  },
  traveler: {
    kind: "npc",
    portraitName: "Road Traveler",
    portraitFocus: { x: 53, y: 24, scale: 1.75 },
  },
  mayor: {
    kind: "npc",
    portraitName: "Mayor Anwen",
    portraitFocus: { x: 53, y: 25, scale: 1.75 },
  },
  captain: {
    kind: "npc",
    portraitName: "Captain Hollis",
    portraitFocus: { x: 55, y: 23, scale: 1.75 },
  },
  merchant: {
    kind: "npc",
    portraitName: "Ada Willowmarket",
    portraitFocus: { x: 54, y: 24, scale: 1.75 },
  },
  clerk: {
    kind: "npc",
    portraitName: "Watch Clerk Enna",
    portraitFocus: { x: 57, y: 26, scale: 1.65 },
  },
  home_door: { kind: "action" },
  potion_door: { kind: "action" },
  smith_door: { kind: "action" },
  bram_inn_door: { kind: "action" },
  market_door: { kind: "action" },
  bramble_smith_door: { kind: "action" },
  watch_door: { kind: "action" },
  gate: {
    kind: "threat",
    artworkSrc: ENEMY_DB.bramble_boar.artwork.src,
    artworkAlt: ENEMY_DB.bramble_boar.artwork.alt,
    artworkMode: "enemy",
    hideWhenSpent: true,
  },
  chest: { kind: "action" },
  return_gate: { kind: "action" },
  camp: { kind: "action" },
  ruins: { kind: "action" },
  shrine: { kind: "action" },
  bramblecross: { kind: "action" },
  cart: { kind: "action" },
  chest2: { kind: "action" },
  town_gate: { kind: "action" },
  board: { kind: "action" },
  cellar: { kind: "action" },
  westroot_return: { kind: "action" },
  westroot_cut: { kind: "action" },
  shelter_nook: { kind: "action" },
  false_notice: { kind: "action" },
  three_hollow: { kind: "action" },
  crown_sign: { kind: "action" },
  lantern_sign: { kind: "action" },
  no_handle_stone: { kind: "action" },
  westroot_gate: { kind: "action" },
  roadwatcher: {
    kind: "threat",
    artworkSrc: ENEMY_DB.briar_roadwatcher.artwork.src,
    artworkAlt: ENEMY_DB.briar_roadwatcher.artwork.alt,
    artworkMode: "enemy",
    hideWhenSpent: true,
  },
  crown_den_exit: { kind: "action" },
  wax_table: { kind: "action" },
  slat_rack: { kind: "action" },
  witness_ledger: { kind: "action" },
  collar_kennel: {
    kind: "threat",
    artworkSrc: ENEMY_DB.thorn_collared_hound.artwork.src,
    artworkAlt: ENEMY_DB.thorn_collared_hound.artwork.alt,
    artworkMode: "enemy",
    hideWhenSpent: true,
  },
  false_map: { kind: "action" },
  den_guard: {
    kind: "threat",
    artworkSrc: ENEMY_DB.false_sign_scratcher.artwork.src,
    artworkAlt: ENEMY_DB.false_sign_scratcher.artwork.alt,
    artworkMode: "enemy",
    hideWhenSpent: true,
  },
  westroot_first_gate: { kind: "action" },
  rootmarket: { kind: "action" },
  mossgarden: { kind: "action" },
  witness_stones: { kind: "action" },
  split_hall: { kind: "action" },
  cargo_siding: {
    kind: "threat",
    artworkSrc: ENEMY_DB.seal_forged_sentry.artwork.src,
    artworkAlt: ENEMY_DB.seal_forged_sentry.artwork.alt,
    artworkMode: "enemy",
    hideWhenSpent: true,
  },
  underway_gate: { kind: "action" },
  underway_threshold: { kind: "action" },
  survey_station: { kind: "action" },
  rootwater_entry: { kind: "action" },
  rootwater_bridge: { kind: "action" },
  rootwater_exit: { kind: "action" },
  underway_approach_entry: { kind: "action" },
  underway_wildlife: {
    kind: "threat",
    artworkSrc: ENEMY_DB.root_gnawer.artwork.src,
    artworkAlt: ENEMY_DB.root_gnawer.artwork.alt,
    artworkMode: "enemy",
    hideWhenSpent: true,
  },
  detour_notice: { kind: "action" },
  mapped_gallery: { kind: "action" },
  maintenance_hatch: { kind: "action" },
  waykeeper_cache: { kind: "action", hideWhenSpent: true },
  construction_signal_rig: { kind: "action", hideWhenSpent: true },
  underway_route_exit: { kind: "action" },
  convergence_entry: { kind: "action" },
  convergence_exit: { kind: "action" },
  listening_mile_entry: { kind: "action" },
  listening_mile_exit: { kind: "action" },
  listening_post_one: { kind: "action" },
  listening_post_two: { kind: "action" },
  listening_post_three: { kind: "action" },
  lio_message_plate: { kind: "action" },
  relay_approach_entry: { kind: "action" },
  relay_post_gate: { kind: "action" },
  relay_entry: { kind: "action" },
  royal_progress_broadside: { kind: "action" },
  relay_guard: {
    kind: "threat",
    hideWhenSpent: true,
  },
  forged_order_desk: { kind: "action" },
  briarhold_route_ledger: { kind: "action" },
  underway_ambush: {
    kind: "threat",
    hideWhenSpent: true,
  },
  stairs_up: { kind: "action" },
  sigil: { kind: "action" },
  mural: { kind: "action" },
  fungus: { kind: "action" },
  cache3: { kind: "action" },
  exit_door: { kind: "action" },
  wildbattle: { kind: "threat" },
  skulk: {
    kind: "threat",
    artworkSrc: ENEMY_DB.rustroot_skulk.artwork.src,
    artworkAlt: ENEMY_DB.rustroot_skulk.artwork.alt,
    artworkMode: "enemy",
    hideWhenSpent: true,
  },
  boss: { kind: "threat" },
};

function getDebugState(tile: string) {
  if (isBlockedInteractionTile(tile)) return "interaction";
  if (TILE_META[tile]?.blocked) return "blocked";
  if (MAP_TOKEN_CONFIG[tile]?.kind === "threat") return "threat";
  if (MAP_TOKEN_CONFIG[tile]) return "interactable";
  return "open";
}

function getPortraitTokenStyle(
  focus: { x: number; y: number; scale?: number } | undefined,
) {
  const scale = focus?.scale ?? 1.75;
  const focusX = focus?.x ?? 50;
  const focusY = focus?.y ?? 25;

  return {
    "--map-token-portrait-size": `${scale * 100}%`,
    "--map-token-portrait-left": `${50 - (focusX - 50) * scale}%`,
    "--map-token-portrait-top": `${50 - (focusY - 50) * scale * 1.5}%`,
  } as CSSProperties;
}

export function MapStage({
  region,
  map,
  backgroundImage,
  position,
  player,
  exploredMap,
  getStoryTile,
  onNodeClick,
  debug = false,
  fogComplete = false,
  getTokenState = (_tile: string, _tileRegion: string) => "active",
  npcTokens = [] as MapNpcToken[],
}) {
  const visual = getMapVisualConfig(region);
  const rows = map.length;
  const columns = map[0]?.length || 1;
  const revealAll = !!visual.revealAll;
  const localLantern = !!visual.localLantern;
  const usesNavigationGraph = hasNavigationGraph(region);
  const fogMaskId = `map-fog-${region}`;
  const fogBlurId = `${fogMaskId}-blur`;
  const ambientRevealPaths = visual.ambientRevealPaths || [];

  const nodes = map.flatMap((row, y) =>
    row.map((rawTile, x) => {
      const tile = getStoryTile(rawTile, region);
      const point = getMapNodePoint(region, x, y, columns, rows);
      const isPlayer = position.x === x && position.y === y;
      const explored = !!exploredMap[getVisitedKey(x, y)] || isPlayer;
      const withinLantern = isPlayer || areMapNodesConnected(region, position, { x, y });
      const visible = revealAll || (localLantern ? withinLantern : explored) || debug;
      const meta = TILE_META[tile] || TILE_META.hidden;
      const tokenState = getTokenState(tile, region);
      const clickable =
        isPlayer || areMapNodesConnected(region, position, { x, y });
      const debugState = getDebugState(tile);

      return {
        key: `${region}-${x}-${y}`,
        x,
        y,
        tile,
        point,
        isPlayer,
        explored,
        withinLantern,
        visible,
        meta,
        tokenState,
        clickable,
        debugState,
      };
    }),
  );

  const tokens = nodes.filter(
    (node) => node.visible && !node.isPlayer && MAP_TOKEN_CONFIG[node.tile],
  );
  const renderedNodes = usesNavigationGraph
    ? nodes.filter(
        (node) => node.isPlayer || isMapNavigationNode(region, node.x, node.y),
      )
    : nodes;
  const fogNodes = renderedNodes.filter((node) =>
    localLantern ? node.withinLantern : node.explored,
  );
  const fogNodeKeys = new Set(fogNodes.map((node) => `${node.x},${node.y}`));
  const fogRevealAreas = (visual.fogRevealAreas || []).filter((area) => {
    const visitedNodeCount = area.nodeKeys.filter((key) => fogNodeKeys.has(key)).length;
    return visitedNodeCount >= (area.minVisitedNodes ?? 1);
  });
  const navigationNodeKeys = usesNavigationGraph
    ? getNavigationNodeKeys(region)
    : [];
  const graphFullyExplored =
    !localLantern &&
    usesNavigationGraph &&
    navigationNodeKeys.length > 0 &&
    navigationNodeKeys.every((key) => fogNodeKeys.has(key));
  const completedFog = fogComplete || graphFullyExplored;
  const fogOpacity = completedFog ? visual.completedFogOpacity ?? 0.55 : 1;
  const fogPathWidth =
    visual.fogPathWidth || (visual.fogRadius || 8) * 1.7;
  const fogEdges = usesNavigationGraph
    ? fogNodes.flatMap((node) =>
        fogNodes
          .filter(
            (other) =>
              `${node.x},${node.y}` < `${other.x},${other.y}` &&
              areMapNodesConnected(
                region,
                { x: node.x, y: node.y },
                { x: other.x, y: other.y },
              ),
          )
          .map((other) => ({
            key: `fog-edge-${node.key}-${other.key}`,
            from: node.point,
            to: other.point,
          })),
      )
    : [];
  const renderedTokens = tokens.filter(
    (node) =>
      !usesNavigationGraph || isMapNavigationNode(region, node.x, node.y),
  );
  const heroPoint = getMapNodePoint(
    region,
    position.x,
    position.y,
    columns,
    rows,
  );
  const renderedNpcTokens = npcTokens.map((token) => ({
    ...token,
    point: getMapNodePoint(region, token.x, token.y, columns, rows),
    portrait: getDialoguePortrait(token.portraitName),
  }));

  return (
    <div
      data-testid="map-stage"
      data-visibility-mode={localLantern ? "local-lantern" : "exploration-fog"}
      className={`painted-map-stage${localLantern ? " painted-map-stage--local-lantern" : ""}`}
      style={{ aspectRatio: visual.aspectRatio }}
    >
      {backgroundImage ? (
        <img
          data-testid="map-background"
          src={backgroundImage}
          alt=""
          className="painted-map-image"
        />
      ) : (
        <div data-testid="map-background" className="painted-map-fallback" />
      )}
      <div className="painted-map-vignette" />
      {!revealAll && !debug ? (
        <svg
          className="map-fog-layer"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <filter
              id={fogBlurId}
              x="-20"
              y="-20"
              width="140"
              height="140"
            >
              <feGaussianBlur stdDeviation="0.9" />
            </filter>
            {localLantern ? (
              <radialGradient id={`${fogMaskId}-lantern`}>
                <stop offset="0" stopColor="#fff3c4" stopOpacity=".55" />
                <stop offset=".38" stopColor="#f59e0b" stopOpacity=".3" />
                <stop offset=".72" stopColor="#c2410c" stopOpacity=".09" />
                <stop offset="1" stopColor="#d97706" stopOpacity="0" />
              </radialGradient>
            ) : null}
            <mask
              id={fogMaskId}
              x="0"
              y="0"
              width="100"
              height="100"
              maskUnits="userSpaceOnUse"
              maskContentUnits="userSpaceOnUse"
            >
              <rect width="100" height="100" fill="white" />
              <g filter={`url(#${fogBlurId})`}>
                {ambientRevealPaths.map((area) => {
                  const shade = Math.round((area.darknessOpacity ?? 0.55) * 255);
                  return (
                    <path
                      key={`ambient-mask-${area.id}`}
                      data-testid={area.id}
                      d={area.d}
                      fill={`rgb(${shade} ${shade} ${shade})`}
                    />
                  );
                })}
                {fogRevealAreas.map((area) => (
                  <ellipse
                    key={`fog-area-${area.id}`}
                    data-fog-area={area.id}
                    cx={area.x}
                    cy={area.y}
                    rx={area.radiusX}
                    ry={area.radiusY}
                    fill="black"
                    transform={
                      area.rotation
                        ? `rotate(${area.rotation} ${area.x} ${area.y})`
                        : undefined
                    }
                  />
                ))}
                {fogEdges.map((edge) => (
                  <line
                    key={edge.key}
                    x1={edge.from.x}
                    y1={edge.from.y}
                    x2={edge.to.x}
                    y2={edge.to.y}
                    stroke="black"
                    strokeWidth={fogPathWidth}
                    strokeLinecap="round"
                  />
                ))}
                {fogNodes.map((node) => (
                  <circle
                    key={`fog-${node.key}`}
                    cx={node.point.x}
                    cy={node.point.y}
                    r={visual.fogRadius || 8}
                    fill="black"
                  />
                ))}
              </g>
            </mask>
          </defs>
          {localLantern ? (
            <circle
              data-testid="underway-lantern-halo"
              className="underway-lantern-halo"
              cx={heroPoint.x}
              cy={heroPoint.y}
              r={(visual.fogRadius || 8) * 1.6}
              fill={`url(#${fogMaskId}-lantern)`}
            />
          ) : null}
          <rect
            data-testid={localLantern ? "underway-darkness" : undefined}
            width="100"
            height="100"
            fill={visual.fogColor || "#020617"}
            opacity={fogOpacity}
            mask={`url(#${fogMaskId})`}
          />
        </svg>
      ) : null}
      <div className="map-node-layer" aria-label="Map movement layer">
        {renderedNodes.filter((node) => debug || node.clickable).map((node) => (
          <button
            key={node.key}
            type="button"
            title={`${node.meta.label} (${node.x}, ${node.y})`}
            data-map-node={`${node.x},${node.y}`}
            data-reachable={node.clickable ? "true" : "false"}
            aria-label={
              node.isPlayer
                ? `Inspect ${node.meta.label}`
                : node.clickable
                  ? `Move to ${node.meta.label}`
                  : `Map node ${node.meta.label} at ${node.x}, ${node.y}; not directly reachable`
            }
            disabled={!node.clickable}
            onClick={() => onNodeClick(node.x, node.y, node.tile)}
            className={`map-node-hitbox ${node.clickable ? "is-clickable" : "is-unreachable"} ${node.isPlayer ? "is-current" : ""} ${debug ? "is-debug" : ""} is-${node.debugState}`}
            style={{
              left: `${node.point.x}%`,
              top: `${node.point.y}%`,
              width: visual.nodeHitboxSize,
            }}
          >
            {debug ? (
              <span className="map-debug-label">
                {node.x},{node.y}
              </span>
            ) : null}
          </button>
        ))}
      </div>
      <div className="map-token-layer" aria-hidden="true">
        {renderedTokens.map((node) => {
          const config = MAP_TOKEN_CONFIG[node.tile];
          if (node.tokenState === "hidden") return null;
          if (node.tokenState === "spent" && config.hideWhenSpent) return null;
          const portrait = getDialoguePortrait(
            config.portraitName || node.meta.label,
          );
          const artworkSrc =
            node.tokenState === "spent" && config.spentArtworkSrc
              ? config.spentArtworkSrc
              : config.artworkSrc;
          const artwork = artworkSrc
            ? {
                src: artworkSrc,
                alt: config.artworkAlt || "",
                className:
                  config.artworkMode === "enemy"
                    ? "map-token-enemy"
                    : "map-token-artwork",
              }
            : portrait
              ? {
                  src: portrait.src,
                  alt: "",
                  className: "map-token-portrait",
                }
              : null;

          // Painted maps carry ordinary doors and landmarks themselves. Only
          // bespoke artwork and character portraits need a visible overlay;
          // every movement/interaction node remains active underneath.
          if (!artwork) return null;

          return (
            <div
              key={`token-${node.key}`}
              className={`map-token map-token--${config.kind} is-${node.tokenState} ${artwork ? "has-artwork" : ""}`}
              title={node.meta.label}
              style={{ left: `${node.point.x}%`, top: `${node.point.y}%` }}
            >
              <span className="map-token-fallback">
                {node.meta.icon || "•"}
              </span>
              {artwork ? (
                <img
                  src={artwork.src}
                  alt={artwork.alt}
                  className={artwork.className}
                  style={
                    artwork.className === "map-token-portrait"
                      ? getPortraitTokenStyle(config.portraitFocus)
                      : undefined
                  }
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                    event.currentTarget.parentElement?.style.setProperty(
                      "display",
                      "none",
                    );
                  }}
                />
              ) : null}
            </div>
          );
        })}
        {renderedNpcTokens.map((token) => (
          <div
            key={`npc-token-${token.id}`}
            data-testid={`map-npc-token-${token.id}`}
            className="map-token map-token--npc has-artwork"
            title={token.name}
            style={{
              left: `${token.point.x + (token.offsetX || 0)}%`,
              top: `${token.point.y + (token.offsetY || 0)}%`,
            }}
          >
            <span className="map-token-fallback">•</span>
            {token.portrait ? (
              <img
                src={token.portrait.src}
                alt=""
                className="map-token-portrait"
                style={getPortraitTokenStyle(token.portraitFocus)}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                  event.currentTarget.parentElement?.style.setProperty(
                    "display",
                    "none",
                  );
                }}
              />
            ) : null}
          </div>
        ))}
      </div>
      <div
        data-testid="hero-token"
        className="map-hero-token"
        style={{ left: `${heroPoint.x}%`, top: `${heroPoint.y}%` }}
        aria-label={`${player?.name || "Hero"} on the map`}
      >
        <HeroArtwork player={player} variant="token" decorative />
      </div>
      {debug ? (
        <div
          data-testid="map-debug-bounds"
          className="map-debug-bounds"
          style={{
            left: `${visual.navBounds.left}%`,
            top: `${visual.navBounds.top}%`,
            width: `${visual.navBounds.width}%`,
            height: `${visual.navBounds.height}%`,
          }}
        />
      ) : null}
    </div>
  );
}
