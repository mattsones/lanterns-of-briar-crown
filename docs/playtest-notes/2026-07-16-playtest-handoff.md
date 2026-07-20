# Playtest Handoff — 2026-07-16

> Superseded by `docs/playtest-notes/2026-07-17-current-status.md`. Keep this file as the detailed record of the original queued Chapter 1 playtest pass.

This is the concise pickup point for the large Chapter 1 playtest-polish pass on `codex/chapter-3-vertical-slice`.

## Completed And Decided

- The Hearthhollow title symbols and most map-marker symbols were removed so painted maps carry the visual hierarchy. Movement and interaction nodes remain tile/graph based.
- Portrait tokens were repositioned and cropped where needed. Sela of the Loom now stands near Elder Brynn's well-side crowd rather than outside the gate.
- Latest-update text is presented over the map area so a full-map view does not hide important feedback.
- Recipe cards use the compact order: title, flavor line, mechanical benefit, ingredients. Healing Fizzpop still turns hair mint green in flavor text.
- Camp rest and crafting actions keep the camp interface open and provide immediate feedback.
- The narrow battle layout keeps party HP, enemy state, and the action controls usable without requiring a desktop-width viewport.
- Companion commands now identify the named ability each companion will use for Attack, Defend, and Support and describe the resulting battle behavior.
- The Bramble Boar uses its production art; the Courier Satchel reveal no longer relies on Nella or a stock scroll.
- Elder Brynn learns the order is forged only after the boar fight. The player returns the satchel to Brynn, then receives the Bramblecross/Lio objective.
- The Hearthhollow south-gate departure is an internal readiness pause. It no longer pretends a town NPC followed the player to the gate.
- The well auto-dialogue triggers once. Repeat visits remain inspectable without interrupting movement.
- Bramblecross now points the player to Enna inside the watchhouse. The notice-board interaction matches the painted board.
- Hollis recommends recruiting at the inn and leads the player directly to the Root Cellar. Regenerating the Bramblecross map for a more obvious cellar entrance is not currently necessary.
- The worried traveler uses his portrait and is convincingly fooled by the royal-looking seal rather than diagnosing the forgery himself.
- The Lantern Road bandits now ambush anyone carrying the planted order through the eastern road corridor. The encounter can no longer be bypassed by missing the hidden battle tile.
- Lantern Road remains on its tuned painted-map grid for now. Unlike the Root Cellar and Westroot Trail, its route is still readable without a hand-authored graph; the corridor trigger solves the immediate encounter problem without destabilizing the working route and smoke coverage.
- The Bramblecross notice-board interaction now lives at logical tile `7,5`, matching the painted board and allowing approach from `7,6` or `6,5`; the misleading `6,4` approach is blocked.
- Ada's missing-crate notice and the cellar/route notices are independent pickups. Hollis now explains that Edden returned shaken while his two companions did not, and asks the player to collect the public notices to understand the full pattern before going below.
- The Root Cellar Route Mural is reachable again; its previously orphaned graph node is linked to the main path.
- Dialogue art A1–A4 is selected and wired:
  - Courier Satchel evidence scene.
  - Watchhouse case-wall master, reused for the evidence board, duty ledger, wall map, and forged-order file.
  - Root Cellar evidence-wall master, reused for the Root Sigil and Route Mural.
  - True-alpha Briar Crown primary mark, used for the cellar discovery and report-back reveal.
- The Watchhouse evidence cards now use those scenes, map crops, and the Crown mark instead of stock symbols; Enna and Hollis have portrait-led talk controls inside the Watchhouse.
- Companion menus and battle cards use existing portraits in normal play, with stored emoji retained only as image-error fallbacks.
- All five level-up choices use a coordinated transparent emblem set. The decorative header sparkle is gone, and the growth emoji are fallback-only.
- Bramblecross town map v2 is the active production map. Its new visible cellar entrance is aligned to tile `(3,5)` and approachable from the road below or beside it.
- Adventure-menu tabs and inventory cards have been stabilized at narrow widths. Combat now keeps a persistent action/health dock visible on phone and ordinary laptop widths.
- The broader map-first redesign proposal is documented in `docs/planning/gameplay-ux-redesign-plan.md`.

## Remaining Work

### Priority 1 — Human QA

1. Test a complete battle at approximately 390×844 and 430×932. Confirm the sticky/mobile action area never covers HP, target selection, intent, or battle results.
2. Play Chapter 3 from the checked-in ready save at desktop and narrow-mobile widths. Focus on pacing, dialogue scrolling around its six production illustrations, and whether the Westroot hub remains readable without debug overlays.
3. Recheck camp rest, camp crafting, recipe cards, and latest-update overlays on a short viewport. Automated coverage exists, but these are visual-comfort decisions.

### Priority 2 — Finish The Dialogue-Art Migration

The full inventory and recommended replacements live in `docs/planning/dialog-stock-icon-replacement-plan.md`. A1–A4 cover the highest-value gaps, not every generic symbol in Chapters 1–3.

1. Continue through the lower-priority dialogue inventory using existing map crops and scene aliases before generating more art.
2. Decide deliberately which remaining abstract/system dialogues should be text-only.
3. Add broader regression coverage proving every production `artKey` resolves and broken images leave dialogue usable.
4. Optional new closeups should only be generated if in-game crops fail: Bramblecross notice board, exterior Root Cellar entrance, and dropped forged orders.

### Priority 3 — Story And Content Follow-Ups

1. Give Healing Fizzpop's mint-green hair a later comedic payoff. Before implementation, decide whether it is a short-lived status flag, a single scripted callback, or recurring NPC reactivity; it is currently flavor only.
2. Run one final name-consistency pass across older docs and future scripts. Current intent is Elder Brynn and Sela of the Loom in Hearthhollow, plus Mara Brindle in Bramblecross. Some selected asset filenames still contain older names and should not drive story copy.
3. Begin Chapter 4 only after the Chapter 3 human pacing pass. The next NPC/enemy art gaps are tracked in `docs/art/asset-manifest.md`.

### Priority 4 — Technical Cleanup

1. Vite still reports the main JavaScript chunk slightly above 500 KB. Treat code splitting as a focused performance task, not part of story polish.
2. `src/App.tsx` remains large. Follow `docs/planning/refactor-roadmap.md`; do not combine a major extraction with new story behavior.
3. Keep the asset workflow: source in `assets/reference/source-art/`, selected runtime derivative in the appropriate shipped folder, then run `optimize:assets` and `audit:assets`.

## Standard Verification

```bash
npm.cmd run build
npm.cmd run test:rules
npm.cmd run playtest:chapter1
npm.cmd run playtest:chapter2
npm.cmd run playtest:chapter3
npm.cmd run playtest:smoke
npm.cmd run audit:assets -- --limit=10
git diff --check
```
