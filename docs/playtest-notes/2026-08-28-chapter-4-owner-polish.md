# Chapter 4 Owner Playtest Polish — 2026-08-28

## Outcome

Implemented the owner notes from the Chapter 4 playthrough. The chapter now begins and advances through world locations and story interfaces rather than developer progression buttons.

## Flow changes

- Chapter 3's closing scene can continue directly with Bramwell and Noma to the Lower Gate.
- Existing Chapter 3-complete saves receive **Walk to the Lower Gate** as the active objective.
- The Lower Gate is an inspectable Westroot landmark at the lower-right of the painted hub.
- The Chapter 4 banner no longer exposes begin, Tasmine, Folded Map, or Underway progression buttons.
- Closing Tasmine's smithy returns to Tasmine's dialogue.
- The Folded Map explains its three-step workflow, calls the route action **Check this route against the evidence**, and exposes Underway entry after a successful check.
- The obsolete Old Keeper Road confirmation immediately inside the Underway was removed.

## Art and presentation

- Added Tasmine Rootbrace's portrait and a Lower Gate smithy tableau.
- Added scenes for the posted detour, first listening hood, final listening hood, and Briar Relay Post approach.
- Corrected the detour art so the rope blocks only the closed Old Keeper Road. The construction route is unobstructed.
- Added a document presentation mode for the Royal Progress broadside so its top and bottom remain visible.
- Removed prose that redundantly described Elowen's visible clothing and painted pose.

## Map and story clarity

- Retuned all three Listening Mile node paths and the Relay Approach path to follow the painted paving and lantern light.
- Gave both route decisions at the posted detour the same button treatment.
- Clarified the scorched ledger: a hostile clerk tipped a lamp across it during the fight to burn the evidence, and the heavy cover smothered the flame before the transfer page was lost.

## Verification

- `npm.cmd run build` — pass.
- `npm.cmd run test:rules` — 50 passed.
- `npm.cmd run playtest:chapter4` — 14 passed.
- Focused affected Chapter 3 title/endpoint tests — 2 passed.
- Visible in-app-browser QA confirmed the map-based Lower Gate entry, scene crop, Tasmine portrait, and smithy-close return.

## Remaining release work

Run an owner playthrough from the Chapter 3 ending through the Briarhold reveal. If accepted, run the deferred uninterrupted Chapters 1–4 release-candidate gate before Chapter 5 production begins.

