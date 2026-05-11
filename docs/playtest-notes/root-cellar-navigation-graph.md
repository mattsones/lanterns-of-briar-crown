# Root Cellar Navigation Graph

Last updated: 2026-05-11

## Decision

The Old Root Cellar should keep tile-based gameplay, but it should not render or move like a uniform grid. The painted dungeon has winding rooms and tunnels, so Root Cellar movement now uses an explicit graph in `src/data/mapVisuals.ts`.

This lets the game keep the existing `MAPS.rootCellar.tiles` contract for encounters, interactions, save/load, and story flags while placing visible/debug movement nodes exactly on the artwork.

## How It Works

- `ROOT_CELLAR_NAV_CONNECTIONS` defines the only movement links used in the cellar.
- Each graph key is still a tile coordinate like `5,4`, so existing tile behaviors still fire.
- `pointOverrides` places those keys in artwork percent coordinates.
- `MapStage` renders only graph-connected cellar nodes. Wall/filler keys are hidden from the debug overlay and do not create fog reveal circles.
- `buildVisitedMap` reveals graph-connected cellar nodes by navigation distance, not by square grid radius.
- The regular directional controls still work because each graph edge has a cardinal direction.

## Editing Rules

1. Add a tile key to `MAPS.rootCellar.tiles` as a walkable tile before linking it.
2. Add a graph edge in `ROOT_CELLAR_NAV_CONNECTIONS`.
3. Add or tune the same key in `pointOverrides` so it sits on visible floor.
4. Keep the Warden between the player and `exit_door`; do not add a bypass around `9,4`.
5. Use smaller Root Cellar nodes so debug markers stay inside corridors and rooms.
6. Prefer point/graph tuning before changing the map artwork.

## Current Tuning

- Removed filler movement nodes from black-space areas, especially the northeast void and lower-right dead space.
- Removed the annotated off-path debug nodes around the mural room, central rock/mushroom edge, and Warden approach.
- Added walkable support nodes around the lower central paths so the cache, fungus, skulk, and Warden approaches feel connected without cutting through black space.
- The primary Warden route now follows the upper-right storage room corridor down to the lower-right approach instead of stepping through the removed mid-right nodes.
- Tuned stronger fog on all non-Hearthhollow maps, with the Root Cellar strongest.
- Verified a no-dialog route to the Warden using:

```text
right, right, right, right, right, right, right,
down, down, down, down, down,
right, right, up, up
```

## Verification

Run after changing cellar graph data:

```bash
npm run build
npm run test:rules
npm run playtest:smoke
```

Then open Dev Tools in the app, jump to Old Root Cellar, enable Show Map Debug, and check that every visible node is on painted floor.
