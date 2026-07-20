# Gameplay UX Redesign Plan

Last updated: 2026-07-17

## Outcome

The regular play screen should become a **map-first adventure workspace**. The painted map remains the primary surface; character status stays compact and glanceable; deeper systems such as Inventory, Equipment, Quests, Recipes, Companion, and the Battle Pouch open in a workspace sized for their content instead of being squeezed into the narrow status rail.

This plan preserves tile-based movement, story triggers, save compatibility, and the current illustrated presentation.

## Problems Observed

1. The current desktop shell gives the map roughly 60% of the width and places both the full character sheet and every adventure menu in the remaining rail.
2. Menu breakpoints respond to the browser viewport rather than the width of the rail containing them. A two-column inventory can therefore activate while each item card has too little usable width.
3. The Adventure Menus title competes horizontally with seven tabs.
4. Character art, twelve stat tiles, the current objective, and the complete menu workspace all remain expanded at once, creating excessive vertical travel.
5. Combat previously placed actions after tall party and enemy sections. On phone and ordinary laptop widths, the player could lose access to actions while reading HP and target state.

## Stabilization Completed

- Adventure-menu tabs now occupy their own row below the title.
- Inventory sections use one readable column, with item actions beside the content when space permits and below it on phones.
- Combat uses a persistent action dock below the `2xl` breakpoint. It repeats hero and selected-target HP and keeps skills, items, and companion command available while the battlefield scrolls.
- Bramblecross v2 replaces the old map. The new visible cellar entrance uses logical tile `(3,5)` and the marker is focused on the painted steps.

These are safe repairs, not the full shell redesign.

## Redesign Implemented

The full shell redesign was completed on 2026-07-17:

- Desktop exploration now uses a map-first layout with a compact status rail and a prominent Adventure Menu launcher.
- Player-facing menus share a wide right-hand drawer on desktop and a full-width bottom sheet on phones.
- The full character portrait and stat grid live in an explicit Character workspace instead of remaining expanded beside the map.
- Movement controls sit over the lower edge of the map, with Inspect as the large central action.
- Phones use a fixed compact status bar for hero HP, objective, and menu access; save/load utilities collapse into a small Game menu.
- Combatants use compact horizontal cards, the persistent action dock retains both critical HP bars, and the battle log is a collapsed Recent Events region.
- Dev Tools remain available in development builds behind a More control.

The drawer and bottom sheet use the same active-tab state, so switching viewport sizes does not create parallel menu implementations.

## Recommended Desktop Layout

### Default exploration state

- **Main stage (about 70%)**: painted map, latest-update overlay, contextual interaction label, and compact movement controls.
- **Status rail (about 30%)**: compact hero portrait, HP/XP, gold, current objective, companion summary, and a single **Adventure Menu** button.
- Do not keep all twelve stats visible during ordinary movement. Show the four or five most relevant values or a compact summary; the full character sheet belongs in the menu workspace.

### Menu workspace

Opening Quests, Inventory, Equipment, Pouch, Companion, or Recipes should slide in a wide right-hand drawer over part of the map, approximately `min(760px, 62vw)`.

- The map remains visible enough to preserve place and atmosphere.
- Menu cards can use their own responsive width rather than inheriting the status rail.
- Closing the drawer returns immediately to the same map position.
- Dev Tools should live behind a small development-only overflow action rather than share equal visual weight with player-facing menus.

## Recommended Phone And Narrow-Tablet Layout

- The map occupies the upper `55–65vh` and remains the visual anchor.
- A collapsed bottom sheet shows hero HP, objective, latest update, and the current contextual action.
- Pulling the sheet upward opens the full Adventure Menu at screen width.
- Movement controls form a compact thumb dock at the bottom edge of the map; **Inspect** becomes the larger central action.
- Opening Inventory or Equipment replaces the expanded sheet content rather than stacking it underneath the full character card.

This is preferable to shrinking the desktop two-column layout until it technically fits.

## Combat Direction

The current persistent action dock resolves the original access problem. A later visual refinement can make combat feel even more deliberate:

1. Convert the hero, companion, and enemies into compact combatants with portrait, HP, and intent in one horizontal band.
2. Keep the selected enemy visually dominant; secondary enemies can use smaller cards until selected.
3. Keep the action dock persistent at every practical viewport size.
4. Move the battle log into a collapsible **Recent Events** drawer so it does not compete with actions.
5. Preserve the existing command/ability logic and simultaneous-enemy behavior.

## Implementation Phases

### Phase 1 — Responsive stabilization (complete)

- Fix inventory card width.
- Separate the Adventure Menus heading and tabs.
- Add the combat action/health dock.
- Add phone-width regression coverage.

### Phase 2 — Map-first shell (complete)

- Extract a compact `AdventureStatusRail` from the current hero panel.
- Keep map and status visible without rendering the full active tab below them.
- Add one prominent menu launcher and keyboard shortcut.

### Phase 3 — Adventure workspace drawer (complete)

- Render existing tab components in a wide overlay drawer.
- Add close/back behavior and preserve active tab/focus.
- Make Inventory, Equipment, Pouch, and Companion respond to their container width.
- Move the full stat grid into an explicit Character or Equipment workspace.

### Phase 4 — Mobile bottom sheet (complete)

- Reuse the same menu state and tab content in a bottom-sheet presentation.
- Keep movement and the current contextual action reachable with one thumb.
- Test at 390×844 and 430×932.

### Phase 5 — Combat visual compression (complete)

- Compact combatant cards and enemy selection.
- Convert the log to a collapsible region.
- Retain the persistent action dock and its duplicate critical HP state.

## Decision Recommendation

Use a **desktop drawer + mobile bottom sheet**, backed by the same existing tab state. This gives the game a meaningful spatial hierarchy without rewriting the game systems or replacing tile movement. A permanent wide third column or more aggressive card shrinking would preserve the current structural problem.

## Verification Targets

- The map remains the largest single surface at desktop and phone widths.
- Opening a menu never reduces an item description below a comfortable reading width.
- Hero HP, target HP, and actions are simultaneously available during combat.
- Latest-update text remains visible without pushing the map below the fold.
- Every existing menu action, save, story trigger, and tile coordinate behaves identically after the shell extraction.
