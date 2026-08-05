# Chapter 4 Graybox Entry Playtest — 2026-08-04

## Scope

Played the canonical Chapter 3-complete fixture into the first Chapter 4 graybox slice at desktop and 430px phone width:

1. commit to Chapter 4 from the Westroot completion banner;
2. enter the Westroot Lower Gate sequence;
3. meet Tamsin Rootbrace;
4. buy or decline the optional Gatewright Hookblade;
5. compare the Survey cases;
6. open and solve the accepted Folded Map;
7. return to the explicit Underway-next endpoint.

## Decisions

- Keep the Lower Gate as a dialogue-driven graybox entrance from the existing Westroot hub. Do not settle final Underway map topology yet.
- Tamsin Rootbrace is the Westroot gatewright. Meeting her is required; buying her 32-gold Rare Hookblade is optional.
- Buying the Hookblade leaves the Pebbleknock Hammer equipped and reports the remaining 46 gold explicitly.
- The quest journal advances through Lower Gate, Folded Map, and Underway-next objectives.
- The existing Folded Map remains the accepted interaction and is now reached through story context rather than only a title-screen test hook.

## Findings And Fixes

- Fixed Enter/Space on a Folded Map edge leaking into the underlying Westroot Inspect handler and opening Noma's dialogue.
- Updated the game header to identify Chapter 4 after the player commits to the Lower Gate.
- Added outcome callbacks so the map's Latest Update reports true route, false shortcut, ordinary failure, or deeper cache progress.
- Desktop dialogue hierarchy and purchase choices read clearly. The 430px layout keeps the entry banner, dialogue, map handles, clue copy, and scroll behavior usable.

## Remaining Questions

- The first Underway graybox should decide whether Chapter 4 uses one connected navigation graph or several focused maps.
- The maintenance detour needs visible pressure when the Underway is implemented, without invalidating the corrected true route.
- Final Gatewright, Folded Map, and Underway art remains deferred until the route topology and Listening Mile presentation are proven.

## Next Step

Build the Underway traversal and Listening Mile graybox from the decoded Folded Map endpoint, preserving both guidance and maintenance fail-forward outcomes.

## Verification

`npm.cmd run verify:full` passed after the playtest fixes: build, 39 rules tests, 30 Chapter 1 tests, 31 Chapter 2 tests, 11 Chapter 3 tests, 6 Chapter 4 tests, and 1 smoke test. The production audit scanned 133 images.
