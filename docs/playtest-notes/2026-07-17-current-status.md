# Current Project Status — 2026-07-17

Branch: `codex/chapter-3-vertical-slice`

This is the concise pickup document for the current illustrated prototype. Historical implementation notes remain in `docs/codex-handoff.md`; the detailed dialogue-art inventory remains in `docs/dialog-stock-icon-replacement-plan.md`.

## Playable State

- Chapters 1, 2, and 3 have automated playable paths.
- Chapter 1 remains the protected baseline and now includes the full queued human-playtest polish pass.
- Chapter 2 is complete through the Westroot gate and retains clean, standard, and messy puzzle outcomes.
- Chapter 3 includes the full Westroot route through Rootmarket, the Rootbread Promise, Witness Stones, Cargo Siding, Split Hall, and the Chapter 4 handoff.
- Chapter 4 has not been implemented as a playable chapter yet.

## Current UX

- Exploration is map-first on desktop: the painted map is the primary surface and a compact rail carries HP, XP, objective, companion, and menu access.
- Quests, Character, Inventory, Equipment, Battle Pouch, Companion, and Recipes share a wide desktop drawer and phone bottom sheet.
- Phones keep a fixed compact status bar and thumb-sized movement/Inspect controls at the map edge.
- Latest-update feedback overlays the map instead of falling below the visible play area.
- Combat uses compact party/enemy cards plus a persistent action dock with hero and selected-target HP. Recent Events is collapsible.
- Tile and graph movement, save compatibility, and existing story triggers remain intact.

The implementation and decisions are documented in `docs/gameplay-ux-redesign-plan.md`.

## Recent Playtest And Story Decisions

- Elder Brynn learns that the order is forged only after the Bramble Boar fight. The player reports the satchel to Brynn before following Lio's trail.
- The worried traveler believes the apparent royal order; he does not diagnose the forgery.
- Lantern Road bandits ambush the player across the eastern road corridor rather than relying on a hidden encounter icon.
- Bramblecross's notice board, visible cellar entrance, Watchhouse directions, and Hollis's cellar handoff now match the painted map and story logic.
- Ada's crate notice and the cellar/route notices are independent actions.
- Smith Orin's weapon supersedes the optional old-hatchet pickup as the main preparation objective.
- Root Cellar fog is room-aware: passages reveal narrowly, while entering one of eight authored chambers reveals most of that room and keeps it discovered.
- Ada's honest Willowmark uses a subtle nick in the left leaf. `willowmark-seal-v02.png` is the selected reference and Watchhouse evidence image.
- Camp actions keep the camp open and report results; the village well walk-on dialogue is one-time only.
- Companion Attack, Defend, and Support orders identify the named ability and mechanical behavior they select.

## Production Art Status

- Bramblecross town map v2 is selected and aligned to its visible cellar entrance.
- The Courier Satchel, Watchhouse case wall, Root Cellar evidence wall, and Briar Crown mark are selected and wired.
- Enna and Hollis use portraits inside the Watchhouse.
- Companion cards and level-up choices use production portraits/emblems with fallback symbols retained only for image failure.
- Willowmark seal v2 is optimized for runtime; the full source is preserved under `assets/reference/source-art/` and v1 is retained under `assets/reference/alternates/`.
- The optimized runtime asset set currently contains 126 images and passes the asset audit.

## Verification At Handoff

```text
npm.cmd run build                 passed
npm.cmd run test:rules            26 passed
npm.cmd run playtest:chapter1     19 passed
npm.cmd run playtest:chapter2     19 passed
npm.cmd run playtest:chapter3      2 passed
npm.cmd run playtest:smoke         1 passed
npm.cmd run audit:assets          126 images scanned; largest assets within targets
git diff --check                 passed (Windows line-ending warnings only)
```

Browser QA covered desktop exploration at 1400×900, phone exploration at 430×932, the phone menu sheet, compact phone combat, the Willowmark evidence selection, and Root Cellar room-aware fog.

## Remaining Work

### 1. Human Playtesting

1. Play Chapter 3 end to end at desktop width and at approximately 430×932. Focus on pacing, choice clarity, dialogue scrolling around the six Chapter 3 illustrations, and Westroot map readability.
2. Do one uninterrupted Chapter 1–3 playthrough with the new map-first shell. Automated paths are green, but a continuous human session may expose fatigue, drawer/sheet friction, or poorly timed feedback.
3. Tune individual Root Cellar room masks only if playtesting shows a chamber revealing too early or leaving important room art hidden.

### 2. Finish The Stock-Icon Migration

Use `docs/dialog-stock-icon-replacement-plan.md` as the inventory.

1. Replace remaining normal-path dialogue symbols with existing portraits, enemy art, map crops, or scene aliases before generating more art.
2. Mark abstract/system dialogues deliberately text-only where an illustration would be decoration rather than information.
3. Add a registry-level regression asserting that every production dialogue resolves to art or an explicit text-only treatment, while preserving error fallbacks.
4. Generate optional closeups only if map-crop QA fails. The remaining candidates are the notice board, exterior cellar entrance, and dropped forged orders.

### 3. Story Follow-Ups

1. Give Healing Fizzpop's mint-green hair a later comedic payoff. Decide first whether it is one scripted callback, a temporary status flag, or recurring NPC reactivity.
2. Run a final character-name consistency pass across older planning documents. Runtime intent is Elder Brynn, Sela of the Loom, Mara Brindle, Enna, Hollis, and Ada Willowmarket; legacy asset filenames should not dictate story names.
3. Human-playtest the Chapter 3 ending before implementing Chapter 4.

### 4. Chapter 4 And 5 Production

1. Implement the Chapter 4 playable route from the existing Chapter 3 handoff before expanding Chapter 5.
2. Produce the tracked Chapter 4–5 story-item and enemy art: Folded Map Scrap, Lanternwell Drop, True Seal Fragment, Briar Chain Link, Lio's Courier Knot, Briar Relay Guard, Crown Whisperer, Bracken Voss, Thornseal Guard, and Thornroot Sentry.
3. Continue using the source-art/alternate/runtime asset workflow and retain fallbacks until each asset passes in-game QA.

### 5. Technical Follow-Ups

1. The main JavaScript chunk remains slightly above 500 KB. Treat code splitting as a focused performance task.
2. `src/App.tsx` remains large. Continue the staged extraction in `docs/refactor-roadmap.md`; do not combine a major structural refactor with new story behavior.
3. Consider drag gestures for the phone bottom sheet only if human playtesting finds the explicit Menu button insufficient. The current button-driven sheet is intentional and tested.

## Resume Checklist

```bash
git fetch --all --prune
git switch codex/chapter-3-vertical-slice
git pull --ff-only
npm install
npm.cmd run build
npm.cmd run test:rules
```

Then use the title-screen Chapter 2 and Chapter 3 ready saves for focused playtesting instead of replaying earlier chapters.
