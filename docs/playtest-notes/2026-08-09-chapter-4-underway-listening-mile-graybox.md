# Chapter 4 Underway And Listening Mile Graybox — 2026-08-09

## Owner Feel-Check — 2026-08-13

The owner accepted the lantern-dark Underway play experience and approved continuing the Chapter 4 critical path. The darkness, local halo, junction choices, and travel between Listening Mile posts are good enough for the graybox milestone.

August 13 follow-up: the owner requested a much longer physical journey. The current implementation supersedes the single-graph topology below with separate approach/fork, exclusive Old Keeper Road or construction-detour passage, convergence, three listening-post, and Relay-approach maps. This file retains the original acceptance findings as historical context.

Deferred polish:

- Replace the placeholder image under the fog; its current road reads too modern. Judge final Underway art through the lantern mask.
- Clean up the seams between movement steps and dialogue beats during the later continuity pass.

Neither finding blocks the next graybox slice.

## Scope

Automated the playable Chapter 4 route from the canonical Chapter 3-complete fixture through:

1. Bramwell and Noma's Lower Gate walk and friendly introduction to Tasmine Rootbrace;
2. Tasmine's five-item regional buy/sell smithy, including three Rare gate-tool weapons and two root-built armor pieces;
3. the Survey Correction Room evidence bridge;
4. the accepted Folded Map solve;
5. the mapped Old Keeper Road followed by a posted detour decision well inside the Underway;
6. ordinary-hidden and exceptional-revealed ambush states;
7. three physically separated Listening Mile posts under local lantern visibility;
8. Lio's hidden route-plate message endpoint.

## Decisions

- Superseded on August 13: split the Underway and Listening Mile into focused sequential maps so the unchosen route is never visible and each hood has its own travel stretch.
- The Folded Map does not depend on a new message from Edden. Tasmine, Bramwell, and Noma combine the carried Cargo Transfer Tag, Witness Stone rubbing, and Edden bundle with the stitched Survey working sheet.
- The Folded Map establishes the Old Keeper Road but does not choose the later branch. A legitimate-looking closure board encountered well inside the passage redirects travelers into a construction detour that is not present in the map puzzle; trusting either the map or current safety guidance is reasonable.
- The Old Keeper Road and construction detour converge at the same blind junction. Choosing the posted detour adds a Seal-Forged Sentry.
- Before that convergence, the Old Keeper Road offers the unique Old Waykeeper Helm from an abandoned keeper niche; the construction detour lets the party jam a live signal and trace it to the ambush, guaranteeing the prepared-opening option.
- An ordinary miss on the hidden Instinct DC 16 check displays no enemy marker or failure disclosure. Exceptional success reveals the covered signal cord, displays the marker, and allows the hero to start first with 4 guard.
- The Underway uses local lantern visibility: black surrounds the hero, only the immediate connected passage is visible, and traveled tunnel returns to darkness.
- The Listening Mile's three hoods are separate map locations, but only the current hood is known in story copy. The first carries a damaged wheel. The second carries unidentified voices, a cough, a jammed shutter, and a hurried scrape against bronze. At the third, the travelers are fading west while bronze dust and shutter scores establish where that scratching occurred before Mara finds Lio's knot.
- Player-facing Chapter 4 prose describes observable causes rather than rebutting earlier prototypes. The rejected talking-tube, stored-voice, water-channel, moral-question, and automated-clapper ideas remain documented only as development history.
- Tasmine uses the standard full shop interface but sells only five Westroot pieces: the Hookblade, Passage Pike, Counterweight Maul, Ironroot Ribplate, and Low-Arch Roothelm. She does not stock Orin's gear, cloaks, charms, or supplies. She still buys ordinary non-story inventory, and nothing auto-equips. Equipped-only inventory now remains visible but has a disabled `Equipped` sell button and an inline instruction to unequip first.

## Deferred Follow-up

Chapter 2 should clearly establish that Edden gives the party a bundle of route drawings, not only one three-door drawing. Keep that briefing, Edden-scene, inventory-copy, and reference update as a separate cross-chapter clarity slice.

## Verification

- The affected Chapter 4 verification commands passed after the August 13 owner-feedback polish.
- Production audit scanned 133 images.
- TypeScript and Vite build passed; the existing report-only main-bundle warning remains.
- Rules suite passed: 45 tests.
- Chapter 4 browser suite passed: 14 tests.
- Smoke suite passed, and a manual in-app browser check confirmed that equipped items display visible disabled sell controls with inline guidance.
- `git diff --check` passed with normal Windows line-ending warnings only.

## Next Step

Human-play the expanded sequence documented in `docs/planning/chapter-4-dark-underway-experience.md`, with special attention to whether the provisional post-message Relay approach should remain.
