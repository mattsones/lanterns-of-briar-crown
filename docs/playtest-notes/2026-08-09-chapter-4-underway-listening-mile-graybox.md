# Chapter 4 Underway And Listening Mile Graybox — 2026-08-09

## Scope

Automated the playable Chapter 4 route from the canonical Chapter 3-complete fixture through:

1. Bramwell and Noma's Lower Gate walk and friendly introduction to Tasmine Rootbrace;
2. Tasmine's five-item regional buy/sell smithy, including three Rare gate-tool weapons and two root-built armor pieces;
3. the Survey Correction Room evidence bridge;
4. the accepted Folded Map solve;
5. mapped route 811 followed by a posted detour decision well inside the Underway;
6. ordinary-hidden and exceptional-revealed ambush states;
7. three physically separated Listening Mile posts under local lantern visibility;
8. Lio's hidden route-plate message endpoint.

## Decisions

- Keep the Underway and Listening Mile on one focused navigation graph for this slice. Preserve the Briar Relay Post as a likely separate focused map.
- The Folded Map does not depend on a new message from Edden. Tasmine, Bramwell, and Noma combine the carried Cargo Transfer Tag, Witness Stone rubbing, and Edden bundle with the stitched Survey working sheet.
- The Folded Map establishes route 811 but does not choose the later branch. A legitimate-looking closure board encountered well inside the passage redirects travelers into 817; trusting either the map or current safety guidance is reasonable.
- Route 811 and route 817 converge at the same blind junction. Choosing the posted 817 detour adds a Seal-Forged Sentry.
- An ordinary miss on the hidden Instinct DC 16 check displays no enemy marker or failure disclosure. Exceptional success reveals the covered signal cord, displays the marker, and allows the hero to start first with 4 guard.
- The Underway uses local lantern visibility: black surrounds the hero, only the immediate connected passage is visible, and traveled tunnel returns to darkness.
- The Listening Mile's three hoods are separate map locations. The player returns to movement and crosses quiet dark tunnel between each sound beat before finding Lio's blue knot at the final post.
- Player-facing Chapter 4 prose describes observable causes rather than rebutting earlier prototypes. The rejected talking-tube, stored-voice, water-channel, moral-question, and automated-clapper ideas remain documented only as development history.
- Tasmine uses the standard full shop interface but sells only five Westroot pieces: the Hookblade, Passage Pike, Counterweight Maul, Ironroot Ribplate, and Low-Arch Roothelm. She does not stock Orin's gear, cloaks, charms, or supplies. She still buys ordinary non-story inventory, and nothing auto-equips.

## Deferred Follow-up

Chapter 2 should clearly establish that Edden gives the party a bundle of route drawings, not only one three-door drawing. Keep that briefing, Edden-scene, inventory-copy, and reference update as a separate cross-chapter clarity slice.

## Verification

- `npm.cmd run verify:chapter4` passed.
- Production audit scanned 133 images.
- TypeScript and Vite build passed; the existing report-only main-bundle warning remains.
- Rules suite passed: 41 tests.
- Chapter 4 browser suite passed: 12 tests.
- `git diff --check` passed with normal Windows line-ending warnings only.

## Next Step

Start the next Lanterns session with the dark-tunnel experience review in `docs/planning/chapter-4-dark-underway-experience.md`. Human-play the lantern radius and spacing between all three posts before building Lio's message or the Briar Relay Post.
