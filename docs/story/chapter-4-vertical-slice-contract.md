# Chapter 4 Vertical-Slice Contract

Last updated: 2026-08-10

Status: executable contract complete; the graybox route is playable through the Lower Gate sendoff, Tasmine's full smithy, accepted Folded Map, posted Underway detour, concealed ambush, and Listening Mile signal trace, with Lio's written message as the next critical-path milestone

## Chapter Promise

Follow corroborated route evidence instead of counterfeit speed, find Lio's own message, and identify Briarhold Waystation as the Chapter 5 rescue target.

## Non-Goals

- Do not rescue Lio in Chapter 4.
- Do not require the Rootbread Promise, Rootbread Charm, or captive porter thread.
- Do not introduce weapon durability or require a return to Hearthhollow.
- Do not reveal the Briar Crown's entire hierarchy.
- Do not commission final Folded Map or Underway art before the graybox interaction is accepted.

The executable source of truth is `src/story/chapter4.ts`; pure transitions and validation live in `src/game/chapter4.ts`.

## Entry Contract

- Checked-in fixture: `public/saves/chapter-3-complete.json`
- Starting region: Westroot hub
- Chapter 3 required ending: trust earned, Witness Stones renewed, false Willow cargo exposed, Chapter 3 clear
- Required carried evidence: Edden's drawing, Witness Stone Rubbing, Cargo Transfer Tag
- Rootbread completion: canonical in the fixture, absent from every Chapter 4 prerequisite
- Chapter 4 starts only when the player commits to a Chapter 4 interaction; loading the fixture alone does not mutate its ending state

## Critical Path

Implementation status: steps 1–5 are playable. Step 6 remains optional future content; step 7 is the next required slice.

1. Walk to the Lower Gate with Bramwell and Noma and receive a friendly introduction to Tasmine Rootbrace.
2. Visit Tasmine's full buy/sell smithy; every purchase remains optional.
3. Compare the Great Survey layer and the older road-crew correction in the Folded Map interaction.
4. Enter the Underway on decoded route 811, then decide at a later posted detour whether to stay with the map or trust current safety guidance into maintenance route 817.
5. Travel through the lantern-dark Listening Mile, using three separate acoustic hoods to follow westbound road sounds and find Lio's quickly hidden courier knot.
6. Optionally help the captive porter.
7. Find Lio's message.
8. Clear the Briar Relay Post.
9. Read Elowen's name in the forged-authority evidence.
10. Identify Briarhold Waystation and stop at the explicit Chapter 5 handoff.

## Folded Map Mechanical Contract

The prototype is available from the title screen through **Test Folded Map Graybox** and can be reopened from the Chapter 3 completion banner. It uses schematic vectors and paper textures so interaction can be judged without production art.

Required route solve:

- manipulate one opaque rectangular map whose Survey face and road-crew-correction face are visibly distinct and never transparent;
- drag any of its four edges inward and snap that edge to the quarter, half, or three-quarter landing guide;
- support 54 distinct two-edge configurations before considering fold order, single folds, the reverse face, or the optional third fold;
- land the west edge at one-half and the south edge at three-quarters for the required two-fold solution;
- make the west fold visibly incomplete on its own, then use the south fold's road-crew ring and bridge span to close the road and align the surrounding contours;
- keep the map surface itself non-selectable: only moving an edge changes construction, and only **Trace this folded route** commits it;
- give keyboard users the same landing states by cycling the focused edge handle.

Fail-forward mistake:

- landing the east edge at one-half and the north edge at one-half creates the deliberately tempting 817 false configuration;
- its lantern and straight road align convincingly, while its date and terrain evidence do not;
- ordinary wrong configurations are also possible and do not create route consequences;
- folding and unfolding is consequence-free; only **Trace this folded route** commits the current configuration;
- committing the tempting revision records the persuasive 817 notation but does not choose the later route branch;
- correcting the map still decodes the true route;
- the actual route choice occurs later at a posted closure board, and neither branch may remove Lio's-message progression.

Optional deeper solve:

- after the true route is recorded, leave the west-half and south-three-quarter edges folded and add the north edge at one-quarter as a third fold;
- make the root arrow visibly continue from the south fold's bridge to a separate cache mark;
- reveal the Lanternwell cache mark through the layered drawing;
- award exactly one Lanternwell Drop;
- repeat visits remain reviewable and cannot repeat the reward.

Back behavior:

- Back unfolds the most recently folded edge first;
- Back closes the interaction only when every edge lies flat.

## Folded Map State

| Concern | State/decision |
|---|---|
| Started | `chapterFourStarted` |
| Attempted | `foldedMapAttempted` |
| First mistake | `foldedMapFirstAttemptMistake` |
| Persuasive 817 construction found | `foldedMapMaintenanceDetour` |
| Required solve | `foldedMapDecoded` |
| Optional deeper solve | `foldedMapDeeperSolved` |
| One-time reward | `foldedMapCacheClaimed` |
| Companion | Hints only; no conscious companion required |
| Save migration | Decoded and deeper-solved saves infer earlier prerequisite state |

## Listening Mile Contract

The Listening Mile uses three flared wall hoods connected to fired-clay conduits. Each post occupies its own navigation node, with dark tunnel between them.

- The first post establishes the physical rule by carrying the party's own recent movement behind them and fresh westbound footsteps ahead.
- The second post carries present boots, a chain scrape, and an inspection shutter being opened farther west.
- At the final post, Mara finds a familiar blue courier knot hidden behind the hood's rim and a tiny scratch pointing toward Lio's written message.
- The nearby stiff shutter explains why the guards had to stop; hiding the knot and scratch took Lio only seconds.
- After each of the first two listening beats, dialogue closes and the player physically travels to the next post.

Attempt and result remain separate through `listeningMileAttempted` and the `marker-found` value in `listeningMileOutcome`.

## Underway Graybox Contract

The first Underway graybox uses one focused navigation graph and local lantern visibility. Black covers the map outside the hero and the immediately connected passage segments; explored tunnel does not remain lit after the party moves away. The party travels some distance along mapped route 811 before encountering a legitimate-looking closure board. That board redirects westbound travelers into maintenance route 817. The map is credible evidence about destination; the closure is credible evidence about present safety. Inspecting the plate reveals a real old hazard stamp, a newer holding cord, fresh traffic into 817, and stone movement beyond 811 without making either choice obviously wrong. The two branches converge at a blind junction before the Listening Mile.

The blind junction contains an intentionally concealed ambush:

- every route reaches it, so the playable slice cannot bypass the encounter;
- the 811 route faces one Briar Relay Guard;
- following the posted 817 detour faces the guard plus a Seal-Forged Sentry;
- a hidden Instinct DC 16 check occurs at the approach;
- a normal miss reveals no enemy marker and no failure message before the attack;
- exceptional success reveals the physical signal cord and enemy marker;
- the revealed route allows a prepared opening: hero acts first with 4 guard;
- every ambush state converges on the Listening Mile.

## Gatewright Weapon Economy

The Lower Gate introduction is mandatory before the Underway; every purchase is optional. Tasmine's smithy uses the same full buy/sell interface as the established shops, but its stock is regional rather than cumulative. She sells five Westroot pieces: three gate tools, Ironroot Ribplate, and a Low-Arch Roothelm. She does not stock Orin's equipment, cloaks, charms, or general supplies. Tasmine still buys ordinary non-story inventory; story evidence cannot be sold.

| Pattern | Role | Price | Bonuses | Skill |
|---|---|---:|---|---|
| Gatewright Hookblade | Control | 32 gold | +2 Might, +2 Precision, +1 Craft | Passage Gatehook: 1d10, mixed scaling, guard break |
| Gatewright Passage Pike | Precision | 30 gold | +2 Precision, +2 Instinct, +1 Guard | Sightline Thrust: 1d10, mixed scaling, pierce |
| Gatewright Counterweight Maul | Force | 34 gold | +3 Might, +2 Grit | Counterweight Drop: 2d6, mixed scaling, guard break |

Every pattern is Rare and individually affordable from the canonical 78-gold save. The player may buy more than one if gold allows. Purchases never auto-equip, introduce durability, gate progression, or make the Pebbleknock Hammer nonfunctional.

## Required Ending

Required flags:

- `chapterFourStarted`
- `gatewrightMet`
- `foldedMapDecoded`
- `listeningMileAttempted`
- `lioMessageFound`
- `princessNameSeen`
- `briarRelayCleared`
- `briarholdLeadFound`
- `chapterFourClear`

Optional flags, never ending gates:

- `gatewrightWeaponPurchased`
- `foldedMapDeeperSolved`
- `foldedMapCacheClaimed`
- `captivePorterHelped`

## Test Contract

- `npm.cmd run verify:fast`: asset audit, build, rules, fixtures, and pure contracts
- `npm.cmd run verify:chapter4`: fast gate plus Chapter 4 browser tests
- `npm.cmd run verify:full`: all chapter suites and smoke
- Chapter 4 navigation tests use stable scene and choice IDs instead of prose labels
- `tests/helpers/saveFixtures.ts` owns reusable storage and checked-in-fixture loading helpers

## Owner Acceptance Record

Before full Chapter 4 story implementation, play **Test Folded Map Graybox** and decide:

> Does dragging the edges of one opaque two-sided sheet to different landing points feel like folding a map, and does the correct construction reveal itself through visible evidence rather than color, labels, or elimination?

The first answer-card spike failed on both physicality and deduction. The second cross-wing spike improved manipulation but still reduced the answer to three of four binary flaps, showed implausible transparency, and did not feel like one map. The owner accepted the third rectangular-sheet interaction direction on 2026-08-02 as a cool puzzle for the game. The acceptance run exposed two polish findings: committed outcomes needed unmistakable confirmation, and the tempting straight 817 construction needed to be easier to discover. The prototype now gives every traced outcome a large result stamp and distinct treatment, while matching 817 edge marks and clue copy point toward the persuasive false construction without naming its exact folds.

The recovered August 3 presentation follow-up shows the flat-sheet boundary on a folding table, marks every reverse flap and crease, compacts handles at landed fractions, makes the west fold leave a visible road gap, and gives the south fold the bridge and road-crew ring that complete the route. Tracing overlays the confirmed route and rejected 817 revision; the optional north fold points from the bridge to a separate cache mark. These cues are requirements for eventual production art.
