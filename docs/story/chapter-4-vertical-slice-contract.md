# Chapter 4 Vertical-Slice Contract

Last updated: 2026-08-13

Status: executable contract complete; the required Chapter 4 graybox route is playable through the Briar Relay Post, forged-authority evidence, Briarhold reveal, and Chapter 5 handoff

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

Implementation status: steps 1–5 and 7–10 are playable. Step 6 remains optional future content.

1. Walk to the Lower Gate with Bramwell and Noma and receive a friendly introduction to Tasmine Rootbrace.
2. Visit Tasmine's full buy/sell smithy; every purchase remains optional.
3. Compare the Great Survey layer and the older road-crew correction in the Folded Map interaction.
4. Enter the Underway on the decoded Old Keeper Road, then decide at a later posted closure whether to stay with the map or trust current safety guidance into a construction detour that is not part of the Folded Map.
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
- support 54 distinct two-edge configurations before considering fold order, single folds, or the reverse face;
- land the west edge at one-half and the south edge at three-quarters for the required two-fold solution;
- make the west fold visibly incomplete on its own, then use the south fold's road-crew ring and bridge span to close the road and align the surrounding contours;
- keep the map surface itself non-selectable: only moving an edge changes construction, and only **Trace this folded route** commits it;
- give keyboard users the same landing states by cycling the focused edge handle.

Fail-forward mistake:

- landing the east edge at one-half and the north edge at one-half creates the deliberately tempting false Survey Shortcut;
- its lantern and straight road align convincingly, while its date and terrain evidence do not;
- ordinary wrong configurations are also possible and do not create route consequences;
- folding and unfolding is consequence-free; only **Trace this folded route** commits the current configuration;
- committing the tempting revision records the persuasive Survey Shortcut; it is not the later physical construction detour and does not choose that route branch;
- correcting the map still decodes the true route;
- the actual route choice occurs later at a posted closure board, and neither branch may remove Lio's-message progression.

Back behavior:

- Back unfolds the most recently folded edge first;
- Back closes the interaction only when every edge lies flat.

## Folded Map State

| Concern | State/decision |
|---|---|
| Started | `chapterFourStarted` |
| Attempted | `foldedMapAttempted` |
| First mistake | `foldedMapFirstAttemptMistake` |
| Persuasive Survey Shortcut found | `foldedMapMaintenanceDetour` (legacy save field) |
| Required solve | `foldedMapDecoded` |
| Companion | Hints only; no conscious companion required |
| Save migration | Decoded saves infer earlier prerequisite state; retired deeper-solve saves still migrate as decoded |

## Listening Mile Contract

The Listening Mile uses three flared wall hoods connected to fired-clay conduits. Each post occupies its own lantern-dark map with a substantial but quick rightward tunnel traversal before the hood. The party discovers the later hoods only by reaching them; the first scene does not announce how many exist.

- The first post establishes the physical rule with the present knock of a damaged wheel and the footsteps accompanying it west.
- The second post carries unidentified voices, a stumble, a cough, a jammed shutter, and a hurried scrape against bronze without assigning unseen speakers roles.
- At the final post, the travelers are already fading west. Fresh bronze dust and shutter scores identify it as the earlier stopping place before Mara finds a familiar blue courier knot hidden behind the hood's rim and a tiny mark pointing toward his message.
- The nearby stiff shutter explains why the guards had to stop; hiding the knot and scratch took Lio only seconds.
- After each of the first two listening beats, dialogue closes and the player crosses the rest of that map before entering a separate map for the next post.
- After Lio's note, a provisional final travel map carries the party through another long westbound tunnel before the Briar Relay Post. Keep or shorten it based on the owner pacing pass.

Attempt and result remain separate through `listeningMileAttempted` and the `marker-found` value in `listeningMileOutcome`.

## Underway Graybox Contract

The expanded Underway graybox uses a sequence of focused navigation graphs with local lantern visibility. Black covers each map outside the hero and the immediately connected passage segments; explored tunnel does not remain lit after the party moves away. Every visual curve is still a logically rightward step, so Right always advances and Left retreats.

The first map contains only the Lower Gate approach and a legitimate-looking closure board near its far-right edge. The choice replaces that map with exactly one long route map: the winding, fitted-stone Old Keeper Road or a newly posted construction detour. The detour does not appear in the Folded Map. The unused route is never visible beside the chosen route. Both route maps end at a third, separate blind-junction map where the tunnels converge. Inspecting the original closure plate still reveals a real old hazard stamp, a newer holding cord, fresh traffic into the construction detour, and stone movement beyond the Old Keeper Road without making either choice obviously wrong.

Each mutually exclusive route now contains its own discovery before the blind junction. The Old Keeper Road opens an abandoned keeper niche containing the unique Old Waykeeper Helm. The construction detour exposes a live signal rig connected to the ambush ahead; jamming and tracing it guarantees that the enemy position is revealed and the prepared opening is available.

The blind junction contains an intentionally concealed ambush:

- every route reaches it, so the playable slice cannot bypass the encounter;
- the Old Keeper Road faces one Briar Relay Guard;
- following the posted construction detour faces the guard plus a Seal-Forged Sentry;
- a hidden Instinct DC 16 check occurs at the approach;
- a normal miss reveals no enemy marker and no failure message before the attack;
- exceptional success reveals the physical signal cord and enemy marker;
- the revealed route allows a prepared opening: hero acts first with 4 guard;
- every ambush state converges on the Listening Mile.
- the first hood, second hood, third hood, and post-message Relay approach each use a separate long traversal map;
- the placeholder beneath the fog is now a neutral fitted-stone tunnel rather than a modern-looking road diagram; final illustrated tunnel art remains deferred.

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
- `royalProgressLearned`
- `princessNameSeen`
- `briarRelayCleared`
- `briarholdLeadFound`
- `chapterFourClear`

Optional flags, never ending gates:

- `gatewrightWeaponPurchased`
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

The first answer-card spike failed on both physicality and deduction. The second cross-wing spike improved manipulation but still reduced the answer to three of four binary flaps, showed implausible transparency, and did not feel like one map. The owner accepted the third rectangular-sheet interaction direction on 2026-08-02 as a cool puzzle for the game. The acceptance run exposed two polish findings: committed outcomes needed unmistakable confirmation, and the tempting straight Survey Shortcut needed to be easier to discover. The prototype now gives every traced outcome a large result stamp and distinct treatment, while matching Survey edge marks and clue copy point toward the persuasive false route without naming its exact folds. This false record is deliberately separate from the later construction detour.

The recovered August 3 presentation follow-up shows the flat-sheet boundary on a folding table, marks every reverse flap and crease, compacts handles at landed fractions, makes the west fold leave a visible road gap, and gives the south fold the bridge and road-crew ring that complete the route. Tracing overlays the confirmed Old Keeper Road and rejected Survey Shortcut. These cues are requirements for eventual production art.
