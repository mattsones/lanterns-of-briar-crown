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
import { HeroArtwork } from "./HeroArtwork";

const waxTableToken = new URL(
  "../../assets/icons/map-tokens/crown-den-wax-table-token-v01.png",
  import.meta.url,
).href;
const waxTableClearedToken = new URL(
  "../../assets/icons/map-tokens/crown-den-wax-table-cleared-token-v01.png",
  import.meta.url,
).href;
const slatRackToken = new URL(
  "../../assets/icons/map-tokens/crown-den-slat-rack-token-v01.png",
  import.meta.url,
).href;
const slatRackBrokenToken = new URL(
  "../../assets/icons/map-tokens/crown-den-slat-rack-broken-token-v01.png",
  import.meta.url,
).href;
const witnessLedgerToken = new URL(
  "../../assets/icons/map-tokens/crown-den-witness-ledger-token-v01.png",
  import.meta.url,
).href;
const witnessLedgerCopiedToken = new URL(
  "../../assets/icons/map-tokens/crown-den-witness-ledger-copied-token-v01.png",
  import.meta.url,
).href;
const collarKennelToken = new URL(
  "../../assets/icons/map-tokens/crown-den-collar-kennel-token-v01.png",
  import.meta.url,
).href;
const collarKennelBrokenToken = new URL(
  "../../assets/icons/map-tokens/crown-den-collar-kennel-broken-token-v01.png",
  import.meta.url,
).href;
const falseMapToken = new URL(
  "../../assets/icons/map-tokens/crown-den-false-map-token-v01.png",
  import.meta.url,
).href;
const falseMapClearedToken = new URL(
  "../../assets/icons/map-tokens/crown-den-false-map-cleared-token-v01.png",
  import.meta.url,
).href;
const crownDenExitToken = new URL(
  "../../assets/icons/map-tokens/crown-den-exit-token-v01.png",
  import.meta.url,
).href;

const MAP_TOKEN_CONFIG: Record<
  string,
  {
    kind: "npc" | "action" | "threat";
    portraitName?: string;
    artworkSrc?: string;
    spentArtworkSrc?: string;
    artworkAlt?: string;
  }
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
  false_notice: {
    kind: "action",
    artworkSrc: slatRackToken,
    spentArtworkSrc: slatRackBrokenToken,
    artworkAlt: "Painted token of a false detour sign",
  },
  three_hollow: { kind: "action" },
  crown_sign: { kind: "action" },
  lantern_sign: { kind: "action" },
  no_handle_stone: { kind: "action" },
  westroot_gate: { kind: "action" },
  roadwatcher: { kind: "threat" },
  crown_den_exit: {
    kind: "action",
    artworkSrc: crownDenExitToken,
    artworkAlt: "Painted token of the Crown Door Den exit",
  },
  wax_table: {
    kind: "action",
    artworkSrc: waxTableToken,
    spentArtworkSrc: waxTableClearedToken,
    artworkAlt: "Painted token of wax, seal tools, and spoons",
  },
  slat_rack: {
    kind: "action",
    artworkSrc: slatRackToken,
    spentArtworkSrc: slatRackBrokenToken,
    artworkAlt: "Painted token of broken sign slats",
  },
  witness_ledger: {
    kind: "action",
    artworkSrc: witnessLedgerToken,
    spentArtworkSrc: witnessLedgerCopiedToken,
    artworkAlt: "Painted token of a bound witness ledger",
  },
  collar_kennel: {
    kind: "action",
    artworkSrc: collarKennelToken,
    spentArtworkSrc: collarKennelBrokenToken,
    artworkAlt: "Painted token of thorn collars and kennel straw",
  },
  false_map: {
    kind: "action",
    artworkSrc: falseMapToken,
    spentArtworkSrc: falseMapClearedToken,
    artworkAlt: "Painted token of a false road map",
  },
  den_guard: { kind: "threat" },
  westroot_first_gate: { kind: "action" },
  rootmarket: { kind: "action" },
  mossgarden: { kind: "action" },
  witness_stones: { kind: "action" },
  split_hall: { kind: "action" },
  cargo_siding: { kind: "threat" },
  rootbread_hatch: { kind: "action" },
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
  getTokenState = (_tile: string, _tileRegion: string) => "active",
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
        {renderedNodes.filter((node) => node.clickable).map((node) => (
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
          const artworkSrc =
            node.tokenState === "spent" && config.spentArtworkSrc
              ? config.spentArtworkSrc
              : config.artworkSrc;
          const artwork = artworkSrc
            ? {
                src: artworkSrc,
                alt: config.artworkAlt || "",
                className: "map-token-artwork",
              }
            : portrait
              ? {
                  src: portrait.src,
                  alt: "",
                  className: "map-token-portrait",
                }
              : null;

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
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                    event.currentTarget.parentElement?.classList.remove(
                      "has-artwork",
                    );
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
