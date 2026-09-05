# Chapter 4 Owner Playtest Follow-up

Date: 2026-09-02

## Playtest Reach

The owner replayed the revised Chapter 4 route from Tasmine's Lower Gate briefing through the westbound Relay approach. The next session should resume there and continue through the Briar Relay Post, forged-authority evidence, and Briarhold reveal.

## Accepted Story And Interaction Changes

- Tasmine's opening exchange now carries her remembered second-watch ledger entry and visible record of Lio's captors.
- Noma states her Lower Gate farewell in her own voice rather than being summarized by narration.
- Mara's Survey Station discovery now establishes the two-sided map, Lio's twice-folded rectangle, and the discarded failed fold before offering the action to recreate the captors' map.
- Solving the Folded Map leaves one route action: opening the Old Keeper Road shutter.
- Rootwater's shutter approach and bridge arrival are separate, one-shot dialogues. The bridge description establishes the faintly blue-green underground river, road-crew ring, wheel scuffs, and westbound footprints without an unnecessary beyond-the-bridge line.
- Right remains the universal forward key through the descent; Up or Down also works where a painted switchback makes that direction intuitive.

## Wildlife Encounter

- Two Tunnel Rats and one Root Gnawer now form a required territorial encounter before the Posted Detour.
- The Root Gnawer scene is a tangle of ancient roots with no river and no lantern carried by the animal.
- Victory copy no longer states that the animals were defending a den or denies any Briar affiliation. It simply reports observable retreat and recovered supplies.
- Chapter 1 already has sufficient wild-creature pressure, Chapter 2 has only an optional future Westroot Trail possibility, and Chapter 3 should keep its civic and political pacing.

## Posted Detour

- Inspecting the bronze closure board is not a hidden check.
- Before inspection, the dialogue remains **A Posted Detour**.
- After inspection, it becomes **The Closure Plate, Up Close**, presents the finding first, provides explicit completion feedback, and removes the Inspect choice.
- The sign's tree-like device is identified positively as an old Westroot root-and-road hazard seal. Player-facing text does not deny an interpretation the player was never given.

## Movement And Lantern Alignment

- Corrected the reported Blind Junction waypoint below the road.
- Corrected five marked waypoints on the first Listening Mile stretch.
- Corrected four marked waypoints on the second Listening Mile stretch.
- Corrected the marked third-stretch entry.
- Corrected three marked waypoints on the westbound Relay approach.
- Widened only the Relay approach's path reveal so a correctly placed player does not leave the immediately adjacent paving clipped by darkness.

## Listening Hood Recurrence

- The first and second hoods now keep separate heard-state flags.
- Stepping back before listening leaves the hood repeatable.
- Completing the listen makes later crossings silent.
- The final hood uses its existing completed clue state for the same one-shot behavior.
- Save migration infers heard-state flags for saves already beyond the relevant hood.

## Verification

- `npm.cmd run build` passed.
- `npm.cmd run test:rules` passed: 50 tests.
- `npm.cmd run playtest:chapter4` passed: 14 tests, including the Posted Detour inspection and complete Listening Mile recurrence path.
- `git diff --check` passed; only the repository's existing LF-to-CRLF notices remain.

## Owner Signoff — 2026-09-04

The owner continued through the Briar Relay Post, forged-authority comparison, and Briarhold reveal, then accepted Chapter 4 as good after the complete playthrough. Chapter 4 is ready to leave owner playtest and enter the Chapter 5 handoff.

A cross-chapter menu issue found immediately afterward was also resolved: restorative inventory items can now be used on either Liam or the active companion outside battle. Full-health targets are disabled so the item is not consumed without effect. Post-fix release-candidate verification passed the production build, 50 rules tests, 31 Chapter 1 tests, 31 Chapter 2 tests, 11 Chapter 3 tests, 14 Chapter 4 tests, and the smoke test.
