# Chapter 4 Transition And Smithy Follow-up — 2026-08-30

## Outcome

The owner acceptance pass exposed three presentation problems at the Chapter 3–4 seam: the checked-in Chapter 3-complete review save required an unmotivated walk across Westroot, the Lower Gate lacked a visible Tasmine marker, and the smithy made equipment sales require a long menu round trip. The Folded Map also carried too much puzzle-facing instruction and an unsettled Edden provenance claim.

## Implemented

- Loading **Begin Chapter 4 Playtest** reopens **The Westward Record** and offers the direct continuation with Bramwell and Noma.
- Committing to Chapter 4 moves Liam to the Lower Gate before the arrival tableau opens. Westroot remains available afterward.
- Bramwell, Noma, and Tasmine stage at the Lower Gate during the sendoff. Tasmine remains visibly marked there after Chapter 3 completion.
- Tasmine's dialogue button is now simply **Visit Tasmine's Smithy**.
- Shops now use separate Buy and Sell tabs.
- Purchases show persistent in-shop confirmation and an updated owned count.
- Equipped items can be unequipped from the Sell tab and then sold without leaving the shop.
- The Folded Map instruction is now: **One opaque map, printed differently on each side. Drag any edge inward to fold.**
- Removed the numbered workflow panel, Edden clue panel, **Look for agreement**, recorded-state panel, configuration-count language, folding-table label, and the extra experimentation footer.
- The excess puzzle chrome was replaced by a restrained wood-and-iron work surface; the deeper-route follow-up below relocates that surface from Tasmine's room to the waykeeper table.

## Deeper Route Follow-up

The owner approved moving the Folded Map away from the Lower Gate without adding explorable wrong tunnels or mixing it into the later construction detour.

- Tasmine now opens the Lower Gate before the map is solved. Bramwell saw Lio's captors enter Westroot, and Tasmine saw the same party leave; their dialogue ends with the unseen road beyond the gate rather than naming the station in advance.
- A new playable Lower Gate descent leads to an unmanned waykeeper Survey Station.
- The station is revealed by the party's lantern while it is still the next map node. After entering, Liam searches dusty papers while Mara drops beneath the table and discovers Lio's hook-tail scratch beside a tiny rectangle with two edges turned inward.
- The Folded Map now opens at the waykeeper table. Three closed shutters hide their passages and share one counterweight selector, making the fold necessary to identify the captors' choice without testing every noisy gate. The persuasive Survey Shortcut exposes a proposed, unopened bore only when checked against the center selector, so a wrong solve creates no tunnel branch.
- The existing construction detour remains later in the journey and mechanically unchanged.
- A new linear Rootwater Bridge map sits between the Survey Station and the existing Underway approach. Its faintly bioluminescent river, non-glowing road-crew carving, and fresh tracks confirm that Lio's party continued west.
- Rootwater is atmospheric travel, not another puzzle, choice, check, combat, or failure state. The bridge has no fixed lantern.

## Resolved Story Decision

The Folded Map belongs to the abandoned waykeeper Survey Station. Edden's Chapter 2 testimony, the Cargo Transfer Tag, and the Witness Stone Rubbing no longer explain the fold or select the Underway branch. Bramwell and Tasmine correctly know that Lio's captors crossed Westroot and used the Lower Gate; only the captors and their prisoner saw which station shutter they selected deeper inside.

## Verification

- `npm.cmd run build` — pass.
- `npm.cmd run test:rules` — 50 passed.
- `npm.cmd run playtest:chapter3` — 11 passed.
- `npm.cmd run playtest:chapter4` — 14 passed.
- The deeper-route implementation again passes `npm.cmd run build`, `npm.cmd run test:rules` (50), and `npm.cmd run playtest:chapter4` (14).
- After the final bridge-dialogue polish, the affected end-to-end Chapter 4 route test passed again and the full Chapter 3 suite passed all 11 tests.
- `npm.cmd run audit:assets` scanned 169 production images; both new WebP maps are within the documented map targets.
- Visible in-app-browser QA confirmed Lower Gate copy, descent-node alignment, Survey Station framing, the station-specific Folded Map, Rootwater's blue-green glow beneath the moving lantern mask, and the clean handoff to the unchanged detour approach.
- Visible in-app-browser QA confirmed the reopened closing scene, direct Lower Gate staging, simplified smithy choice, Buy/Sell tabs, purchase feedback, equipped-item removal, reduced Folded Map copy, and the Tasmine worktable treatment.
- Browser console error check — clear.
