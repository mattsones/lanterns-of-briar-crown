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
import { getAppearanceIcon } from "../game/appearance";
import { getVisitedKey, isBlockedInteractionTile } from "../game/map";

const MAP_TOKEN_CONFIG: Record<
  string,
  { kind: "npc" | "action" | "threat"; portraitName?: string }
> = {
  elder: { kind: "npc", portraitName: "Elder Mira" },
  pibble: { kind: "npc", portraitName: "Pibble Thatch" },
  baker: { kind: "npc" },
  farmer: { kind: "npc" },
  weaver: { kind: "npc" },
  ranger: { kind: "npc", portraitName: "Nix Fernwhistle" },
  traveler: { kind: "npc" },
  mayor: { kind: "npc" },
  captain: { kind: "npc", portraitName: "Captain Hollis" },
  merchant: { kind: "npc" },
  clerk: { kind: "npc", portraitName: "Watch Clerk Enna" },
  home_door: { kind: "action" },
  potion_door: { kind: "action" },
  smith_door: { kind: "action" },
  bram_inn_door: { kind: "action" },
  market_door: { kind: "action" },
  watch_door: { kind: "action" },
  gate: { kind: "action" },
  chest: { kind: "action" },
  well: { kind: "action" },
  return_gate: { kind: "action" },
  camp: { kind: "action" },
  ruins: { kind: "action" },
  pond: { kind: "action" },
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
  roadwatcher: { kind: "threat" },
  stairs_up: { kind: "action" },
  sigil: { kind: "action" },
  mural: { kind: "action" },
  fungus: { kind: "action" },
  cache3: { kind: "action" },
  exit_door: { kind: "action" },
  wildbattle: { kind: "threat" },
  skulk: { kind: "threat" },
  boss: { kind: "threat" },
};

function getDebugState(tile: string) {
  if (isBlockedInteractionTile(tile)) return "interaction";
  if (TILE_META[tile]?.blocked) return "blocked";
  if (MAP_TOKEN_CONFIG[tile]?.kind === "threat") return "threat";
  if (MAP_TOKEN_CONFIG[tile]) return "interactable";
  return "open";
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
}) {
  const visual = getMapVisualConfig(region);
  const rows = map.length;
  const columns = map[0]?.length || 1;
  const revealAll = !!visual.revealAll;
  const usesNavigationGraph = hasNavigationGraph(region);
  const fogMaskId = `map-fog-${region}`;
  const fogBlurId = `${fogMaskId}-blur`;

  const nodes = map.flatMap((row, y) =>
    row.map((rawTile, x) => {
      const tile = getStoryTile(rawTile, region);
      const point = getMapNodePoint(region, x, y, columns, rows);
      const isPlayer = position.x === x && position.y === y;
      const explored = !!exploredMap[getVisitedKey(x, y)] || isPlayer;
      const visible = revealAll || explored || debug;
      const meta = TILE_META[tile] || TILE_META.hidden;
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
        visible,
        meta,
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
  const fogNodes = renderedNodes.filter((node) => node.explored);
  const fogNodeKeys = new Set(fogNodes.map((node) => `${node.x},${node.y}`));
  const navigationNodeKeys = usesNavigationGraph
    ? getNavigationNodeKeys(region)
    : [];
  const graphFullyExplored =
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

  return (
    <div
      data-testid="map-stage"
      className="painted-map-stage"
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
          <rect
            width="100"
            height="100"
            fill="#020617"
            opacity={fogOpacity}
            mask={`url(#${fogMaskId})`}
          />
        </svg>
      ) : null}
      <div className="map-node-layer" aria-label="Map movement layer">
        {renderedNodes.map((node) => (
          <button
            key={node.key}
            type="button"
            title={`${node.meta.label} (${node.x}, ${node.y})`}
            aria-label={
              node.isPlayer
                ? `Inspect ${node.meta.label}`
                : `Move to ${node.meta.label}`
            }
            disabled={!node.clickable}
            onClick={() => onNodeClick(node.x, node.y, node.tile)}
            className={`map-node-hitbox ${node.clickable ? "is-clickable" : ""} ${debug ? "is-debug" : ""} is-${node.debugState}`}
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
          const portrait = getDialoguePortrait(
            config.portraitName || node.meta.label,
          );

          return (
            <div
              key={`token-${node.key}`}
              className={`map-token map-token--${config.kind}`}
              title={node.meta.label}
              style={{ left: `${node.point.x}%`, top: `${node.point.y}%` }}
            >
              <span className="map-token-fallback">
                {node.meta.icon || "•"}
              </span>
              {portrait ? (
                <img
                  src={portrait.src}
                  alt=""
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
      <div
        data-testid="hero-token"
        className="map-hero-token"
        style={{ left: `${heroPoint.x}%`, top: `${heroPoint.y}%` }}
        aria-label={`${player?.name || "Hero"} on the map`}
      >
        <span>{getAppearanceIcon(player)}</span>
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
