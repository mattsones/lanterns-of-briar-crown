# Chapter 5 Vertical-Slice Contract

Date: 2026-09-05

Status: executable contract established; interaction spike and playable chapter still pending.

## Authority And Scope

The owner accepted the story and play decisions in [Chapter 5 Planning Decisions](../planning/chapter-5-planning-decisions.md) on September 5. This contract consolidates those decisions and supplies bounded implementation defaults. It does not require another planning questionnaire.

- `src/story/chapter5.ts` owns typed entry requirements, planned rooms, evidence, signal codes, skill-check defaults, and stable scene IDs.
- `src/game/chapter5.ts` owns executable readiness, infiltration consequences, boss-profile derivation, carriage steps, and departure/completion validation.
- `tests/chapter5-contract.rules.spec.ts` exercises those rules through the standard rules gate.
- The isolated `BriarholdState` and `Chapter5Outcome` models are preparation for the spike. They are **not yet persisted by the live game**, and their unit tests do not establish a playable chapter.

Production integration remains a separate slice. The live playable endpoint remains the accepted Chapter 4 Briarhold reveal. No Chapter 5 title-screen start is added until its opening is playable.

## Chapter Promise And Boundaries

The player rescues Lio and every captive still at Briarhold, defeats Bracken's local command, and returns to Bramblecross with original evidence proving genuine institutional access. Bracken escapes wounded because the heroes stop Lio's transfer carriage. The rescue succeeds; the conspiracy remains active.

The final meeting points toward the transferred route examiner and Elowen's coming public hearing in Lanthorne. Elowen remains free on her Royal Progress. The chapter does not identify the senior insider, expose every cell, awaken a symbol, or turn the road into a conscious judge.

Mara and Lio have no battle turns and are never enemy targets. Lio remains a recovering story companion after rescue. The selected Rowan, Tilda, or Moss remains the combat companion. Bramwell, Noma, and Tasmine remain at the Lower Gate; Quill waits in Bramblecross.

## Entry Save And Knowledge

Canonical fixture: `public/saves/chapter-4-complete.json`.

- Open on `play`, Chapter 5, at `briarRelayPost` node `(4,1)`, the captured transfer ledger.
- Chapters 1–4 are complete, Mara has joined, Lio's message and the Royal Progress comparison are known, and the Briarhold lead is recorded.
- Lio's Courier Knot is carried. The Folded Map Scrap is canonical fixture inventory but is not a Chapter 5 entry gate.
- Rootbread, the deferred Chapter 4 porter, Tasmine's purchases, the keeper cache, and optional signal-rig inspection are never required.
- The same night continues. The ledger's before-dawn transfer threat is real; there is no overnight rest between chapters.
- The opening restates what the party knows without supplying wing solutions, prisoner identities, or the examiner's fate early.

The fixture is curated from the Chapter 3-complete fixture and the accepted Chapter 4 mapped-road route; it is not represented as an export of the owner's save. It uses the wildlife, ordinary junction, and Relay rewards: 62 hero XP and 36 gold. From level 3 / 86 XP this gives level 4 / 33 XP and 114 gold, with the Resolve growth choice and +4 maximum HP. Equipment remains the earlier fixture's equipment; no smithy purchase is assumed. Remaining consumables and injured HP are a modest review loadout, not a combat balance guarantee. The companion remains Rowan at level 2. The overlook supplies the planned bounded recovery.

Readiness is checked after the existing disk-save migration. The strict fixture validator checks its exact ledger placement; general entry prerequisites do not require every legitimate player's save to occupy that one node. The canonical party includes Rowan, but absent/downed-companion saves must remain loadable and cannot lose the critical path. No companion may be silently recruited by migration.

## Required Route

1. Depart the captured Relay and cross the nighttime ridge on the Outer Approach map.
2. Reach the concealed roadworkers' overlook. Survey the gate, guard activity, and runoff evidence. Allow one full-HP first-aid recovery for the hero and active companion, equipment management, and a checkpoint. No item refill or shop.
3. Physically approach the culvert, receiving gate, or guards. Show the consequence immediately before commitment.
4. Enter the hub's shadowed landing. Establish all three wings and the locked, guarded inner door.
5. Investigate the wings in the player's chosen order, or openly fight through the inner-door detail.
6. Pass the mandatory inspection grille on every route. Lio copies deliberately wrong shorthand while working at the carriage mechanism. Mara and Lio recognize each other silently.
7. Fight Bracken and the alert-dependent supports at the Crown Table. Mara shelters visibly behind the substantial entrance console.
8. When the confrontation is won, Bracken releases the transfer carriage and opens the westbound shutter. Mara warns Lio; Lio jams the mechanism; the hero and companion stop it. Bracken escapes wounded through a narrow personnel passage with his master routing cipher.
9. Give Mara and Lio an immediate brief reunion. Lio redirects the party toward the other prisoners.
10. Release the adjoining cells and collect any prisoner or original evidence bypassed earlier. Only after everyone is safe give the siblings their fuller exchange and the examiner's account.
11. Leave as dawn breaks. Compress a long eastbound wilderness journey through one short map.
12. Meet the woodsman, hear his limited public impression of Elowen, and learn about the tusker hollow. Choose the longer safe detour or fight two territorial Rainroot tuskers. Both routes reconverge before the final traveling conversation.
13. Receive the modest public Bramblecross homecoming, then attend the private evidence meeting with Enna, Hollis, Mayor Anwen, and Quill.
14. End at Enna's case wall with the Lanthorne lead. Lio says, “He is still out there.” Mara answers, “So are we.” Enna supplies the final deduction.

## Entry And Alert Matrix

| Choice or event | Outcome | Continued route |
|---|---|---|
| Follow runoff and workshop debris through the service culvert | Quiet, reliable; longer approach | Hub; no check can hide this route permanently |
| Slip through the receiving gate using Precision or Heart | Success: Quiet; failure: Suspicious | Hub in either case |
| Attack receiving guards | Alerted, declared before combat | Hub after victory |
| First meaningless lantern transmission | Lone guard approaches; response must resolve | Hide, open assault, or harder silent ambush |
| Hide successfully | Suspicious; guard remains | Resume infiltration |
| Silent ambush succeeds | Suspicious; one guard removed nonlethally | Resume infiltration with reduced later guard presence |
| Hide or silent ambush fails | Alerted | Direct route remains available |
| Prepare direct assault against investigating guard | Alerted; guard removed after the fight | No inner key awarded |
| Second meaningless transmission | Alerted; no second lone checker | Direct route remains available |
| Command Center Recall | Alerted; guards move toward command | Direct route remains available |
| Front Gate Alert at Quiet/Suspicious | Inner detail leaves to inspect receiving approach | Spare key can open inner door |
| Front Gate Alert at Alerted | Experienced guards ignore the diversion | Wings still offer evidence and boss/rescue benefits |
| Attack inner-door detail | Alerted before combat; take duty key on victory | Inner door opens without wing prerequisites |

Alert only rises: Quiet → Suspicious → Alerted. Moving rooms, waiting, loading a checkpoint, or revisiting a choice never lowers it. No timer, real-time guard simulation, instant infiltration failure, or permanent Lio-loss state is introduced.

The direct key-taking fight, explicit assault responses, second invalid signal, and command recall always produce Alerted. Rowan's one containment opportunity must be a separate authored wing confrontation; it cannot override these declared consequences.

## Wing Dependencies And Personnel

| Wing | Immediate discovery | Intervention and later effect |
|---|---|---|
| False Ledger Room | A captive Westroot clerk works under a knowing Briar records officer; standard signal chart is secured beneath the desk glass | Resolve the officer through distraction, nonlethal subdual, or combat; Mara uses the workshop shim to open the ordinary locked drawer and reveal the spare key; free the clerk and preserve original papers |
| Thornseal Workshop | A knowing sealwright, a deceived laborer, and practical forgery apparatus | Warn/persuade the laborer away; bypass, subdue, or fight the sealwright; obtain the shim; separately disconnect the Sentry repair linkage |
| Captive Lantern Hall | Normally empty signal room with pane racks, three fixed lanterns, transmission shutters, and a covered gold-light channel | Send the correct diversion; restore the gold channel to counter False Order and reveal the true carriage brake |

The drawer's contents are unknown until it opens. The signal chart is fixed, always reviewable when the room is accessible, and never an inventory item or remotely available puzzle answer panel. An early locked-drawer visit does not consume the later shim action. The shim is retained, not consumed on a failed check.

The quiet chain is **workshop shim → ledger drawer/spare key + Front Gate Alert → inner entrance**. The order of discovering rooms is free; the drawer's physical tool dependency is not. The player may revisit the chart. The diversion stays effective while the player prepares, without an invisible countdown; another transmitted work code or a general alarm recalls the detail. Once opened, the inner door does not magically relock.

Restoring the gold channel is a separate physical intervention in the Lantern Hall, available at every alert level. Its exact manipulation and feedback are part of the upcoming interaction spike. Gold restoration cannot depend on guards believing a diversion after Alerted. The workshop's bounded default is preventing one Sentry repair, rather than changing the already-agreed support counts.

## Lantern Interaction Defaults For The Spike

Three fixed positions are read **left to right from the operating platform**. Every position has one of each pane available; repeated colors are legal. Four choices at each of three positions make 64 arrangements. Color is dominant, supported by an etched triangle, circle, square, or star and a text label.

| Fixed chart entry | Left | Center | Right | Effect |
|---|---|---|---|---|
| Front Gate Alert | Red / triangle | Amber / star | Blue / circle | Divert inner guards if no general alert |
| Command Center Recall | Red / triangle | Blue / circle | Amber / star | General alert and command preparation |
| Receiving Clear | Green / square | Green / square | Blue / circle | Routine gate-open/receiving acknowledgment; no rescue shortcut |
| Hold Deliveries | Amber / star | Red / triangle | Red / triangle | Workers halt incoming movement; no rescue shortcut |
| Other 60 arrangements | — | — | — | Invalid-signal response |

These exact codes, marks, and two routine-code names are implementation defaults for testing. They may be tuned with the physical interaction, while retaining four real codes, a dangerous recall, a fixed reference, and non-color readability. The routines produce distinct visible room feedback, not invented information about the conspiracy.

Arranging panes has no consequence. Only the explicit shutter-pull transmits. Empty positions disable transmission. Back closes the interface and preserves the arrangement. Pointer and keyboard controls reach identical states. Movement keys cannot also move the hero behind the puzzle. Pending guard response blocks further transmission and room departure until resolved. Repeat responses cannot remove multiple guards or pay repeated rewards.

## Checks And Companion Benefits

Use the existing d20 skill check and derived stats; show roll, stat bonus, DC, and consequence. Starting DCs are 12 for receiving-gate Precision/Heart, 12 for Instinct concealment, 15 for Precision silent ambush, and 12 for identifying the unlit brake. Difficulty numbers are graybox tuning values. No separate Stealth stat or new animated dice UI is required.

- Rowan can contain one authored wing encounter, protects Mara, and has concise, steady tactical dialogue. Persist the expended benefit.
- Tilda improves concealment and the silent ambush. Initial tuning: +2 to those two checks when conscious. Her humor notices lies and openings without trivializing captivity.
- Moss reveals the culvert earlier and can bypass one root mechanism. His observations must give usable physical information. The complete route remains discoverable without him.
- Absent or downed companions grant no mechanical bonus. The hero supplies required assistance; Mara's safe story role remains intact. Recovery at the overlook may restore the established active companion, including at 0 HP.

Every major movement—approach, hub, wings, first sight, confrontation, rescue, reunion, return, and case wall—needs a specific reaction for each companion in the later manuscript. Do not substitute three names over one generic reaction.

## Boss And Carriage Contract

| Alert at confrontation | Baseline enemy roster |
|---|---|
| Quiet | Bracken Voss + Thornroot Sentry |
| Suspicious | Bracken + Sentry + one Thornseal Guard |
| Alerted | Bracken + Sentry + two Thornseal Guards |

A successful silent ambush subtracts one guard from the applicable roster, with a floor of zero guards. The Sentry is always present. Openly defeating the original door detail does not remove general-alert support: remaining station personnel answer the alarm. Removing the investigating guard in an open fight reduces the earlier door detail; it does not also grant the silent bonus to the boss roster.

Start with the existing enemy-cohesion HP and damage values (Bracken 44, Guard 28, Sentry 32). Gold restoration changes Bracken's **False Order** Shaken penalty from 2 to 0, with explicit narration and visible true route lines. It does not erase his attack damage or every other enemy effect. The disabled workshop linkage prevents the Sentry's one repair opportunity. Repair amount and timing remain spike tuning; the complete four-enemy battle must be reviewed at real card sizes.

Freeze the selected boss roster and counterplay on battle start. Combat victory must resolve surviving supports as defeated or withdrawing before the rescue takes over; reducing Bracken alone to 0 HP cannot leave an active enemy attacking a rescue overlay. Bracken's defeat is real. He withdraws wounded, releases the carriage brake, and leaves with the master routing cipher.

The untimed rescue has three committed steps:

1. **Secure the carriage:** Mara gives the sibling warning; Lio jams the wheel; hero and companion catch the assembly.
2. **Set the brake:** restored gold light reveals the true brake immediately. Without it, show the Instinct check before touching the false controls. Failure costs a bounded hero injury and still secures the brake; cap damage so the hero retains at least 1 HP. Neither Lio nor Mara receives damage.
3. **Free Lio:** release restraints and let Mara reach him immediately.

Store the current step and resolved check result. Reopening or loading cannot reroll the brake check or apply injury twice. No pursuit/abandon-Lio choice, real-time deadline, or failed input can reverse the rescue.

## Prisoners, Evidence, And Knowledge Order

Exactly five Chapter 4 transfer rows are accounted for:

| Person | Location/outcome | Knowledge boundary |
|---|---|---|
| Lio | Carriage; required rescue | Direct experience of Bracken and the examiner; no senior-insider identity |
| Bramblecross cellar porter | Adjoining cells; required rescue | Closes a Chapter 1 missing-porter thread; separate from the deferred Chapter 4 optional porter |
| Westroot route-record clerk | Forced work in Ledger Room; required rescue | Authenticates genuine office stock and internal handling marks; does not know the hierarchy |
| Rainroot road warden | Adjoining cells; required rescue | Saw traffic on officially closed roads; identifies the initial western transfer route |
| Royal Progress route examiner | Already transferred; not a captive still at this site | Lio knows the examiner's identity and discovery of altered reports; transfer record points toward Lanthorne |

For writing, assign and record new identities before using pronouns: **Sella Reedmere** (Westroot clerk, female, she/her), **Orren Pike** (cellar porter, male, he/him), **Hesta Brookward** (Rainroot road warden, female, she/her), **Celia Venn** (transferred examiner, female, she/her), **Garrick Reed** (woodsman, male, he/him), **Dessa Flint** (complicit sealwright, female, she/her). These are authoring defaults, not claims that these names appeared in earlier chapters. A name collision or stronger voice discovered while writing may justify a recorded revision.

The required original evidence is the transfer ledger, genuine office instruction with criminal content, false-seal evidence, and examiner transfer record. True Seal Fragment and Briar Chain Link are the established inventory evidence rewards; the full documents need individual story-item IDs when the graybox integrates inventory. Do not treat two small tokens as the entirety of the preserved papers.

The clerk authenticates narrowly on site. Lio identifies Celia and recounts her discovery; the warden and documents corroborate the transfer. Garrick offers only what he saw at a public Progress stop and local directions. Enna combines the evidence in Bramblecross. The papers establish genuine access without identifying whether a particular named official is the culprit. The first leg was west from Briarhold; the documentary destination is Lanthorne, not a claim that every later road runs straight west.

Departure requires all four present captives and all evidence. A player who bypassed the Ledger Room must return for Sella and the documents; after Bracken's defeat the remaining officer cannot create a new boss or block cleanup. The other cell doors use a straightforward release control. Bracken's sealed personnel passage does not prevent the party's established departure route.

## Return, Rewards, And Ending

The return is a visibly long overland journey east. The woodsman appears before the tusker choice. Churned earth, tusks against bark, tracks, calls, and his warning communicate the risk. Two territorial Rainroot tuskers occupy their natural hollow. They are unaligned wildlife, carry no conspiracy evidence, and threaten no settlement. The safe detour loses no character or political content. During combat Lio moves the rescued group and Mara into cover.

The post-rescue milestone advances the normal player to level 5 through existing growth rules. Integration must grant this once, preserve XP already earned, never reduce a hero already at level 5 or higher, and avoid a second advancement from a separate duplicate boss-XP reward. Exact modest supplies/currency and tusker rewards are balance work. No major weapon is the climax reward.

At Bramblecross, the public welcome first reunites the porter with town and Lio with Enna and Hollis. A separate private meeting includes Anwen and Quill. Only after the evidence reading and closing exchange may `chapterFiveClear` become true. Completion records rescue, Bracken's escape, and the faction revelation; it never requires `captiveLanternsRestored` or `livingBriarMarkSeen`. Lanthorne is the next story lead; Chapter 6 travel remains outside the prototype.

## Interaction And Repeat-State Matrix

| Surface | First / incomplete visit | Completed return and backtracking | Saved-state requirement |
|---|---|---|---|
| Relay departure | Known bearings and urgency; explicit continue | Required opening is one-shot | Chapter start independent of Chapter 4 completion |
| Overlook | Establish routes; one recovery action | Survey remains reviewable; recovery spent | HP, equipment, recovery-used state; checkpoint before entry |
| Approach entrances | Local evidence, route-specific check and stakes | Chosen entry cannot be retried for a quieter roll | Entry choice, check result, alert |
| Hub | Three wings, inner guards, authored sight/noise risk | Current personnel and alert; no repeated introduction | Resolved patrol/worker state |
| Ledger desk | Chart review; unknown drawer contents; tool needed | Chart remains; taken key action disappears | Chart read, drawer opened, key owned, officer/clerk state |
| Workshop | Distinguish laborer from knowing sealwright | Tool/intervention rewards disappear; changed mechanism described | Laborer safe, sealwright resolution, shim, linkage state |
| Lanterns | Manipulate and explicitly transmit | Current panes, feedback, gold restoration, alert warning | Pane arrangement, invalid count, pending response, removed guard |
| Inner door | Key plus diversion, or declared assault | Open doorway stays open; no respawned duty key | Opened door and defeated detail |
| Inspection grille | Mandatory Lio resistance and silent recognition | No repeated near-shout on backtracking | First sight recorded before boss |
| Crown Table | Alert-dependent profile, Mara's cover | Local command broken; no repeated battle/reward | Frozen roster and victory; ordinary combat retry semantics |
| Carriage | Current untimed rescue step | Freed Lio; no repeated check or injury | Step, brake check/result, cost applied, rescue complete |
| Other captives/evidence | Required cleanup list names only known people | Empty cells and preserved papers; no duplicated rewards | Each captive and each evidence category separately |
| Sibling reunion | Brief release, then fuller safe conversation | Reviewable aftermath without repeated reward | Immediate reunion separate from fuller exchange |
| Wilderness | Time/distance markers, woodsman, warned route choice | No repeated automatic speech or wildlife fight | Heard witness, chosen path, battle resolution, reconvergence |
| Homecoming/case wall | Public relief before private analysis | Closing recap and lead remain reviewable | Homecoming separate from evidence meeting and final completion |

Knowledge-changing actions put the new finding first, show a clear result, then remove only the spent action. Close/Back returns to the actual room or map node. Incomplete topics remain available. Dialogue continuations must use current state or explicit transition output, avoiding stale React callback flags.

## Persistence And Checkpoints Before The Spike Is Accepted

Keep chapter-specific pure helpers; do not refactor the global dialogue engine. The next slice must wire the relevant model fields into typed persisted state and defaults in one bounded change, with disk-save round-trip and partial-load tests before accepting the interaction. Until that wiring lands, the pure model must not be advertised as save-safe runtime play.

- A missing Chapter 5 state block in an older Chapter 4 save begins unstarted. Never infer quiet infiltration, a free recovery, a defeated guard, or a successful rescue from unrelated flags.
- `livingBriarMarkSeen` remains a tolerated legacy field; no new story or prerequisite reads it.
- Checkpoint at the overlook, after each completed wing, and after rescue before return. Persist current resources, entry, alert, personnel, signal history, and check results together.
- A post-wing checkpoint records resolved outcomes; loading must not reset the puzzle history or reroll a check. Mid-dialogue loads resume the pending phase or reopen the correct incomplete surface.
- Version and validate the Chapter 5 state shape when integrated. Do not silently coerce a corrupted partial save to a successful ending.

## Map And Art Gates

Seven planned maps are listed in `CHAPTER_5_CONTRACT.maps`; Bramblecross is reused. They are declared plans, not registered runtime maps. Build all graybox paths before commissioning finished maps.

For each map, produce a scale master with walkable centerlines, every node, forward/backward arrow aliases, trigger and one-shot boundaries, token clearance from walls/props, representative lantern reveal footprints, required landmarks, and overlay-safe areas. Check desktop 1280×720 and phone 390×844/430×932 layouts. The hub and reconverging return must show route alternatives without accidental walk-through connections.

Accept the schematic, then inspect the selected painting beneath the same overlay. Test each painting immediately on integration, including map-debug off, normal lighting, first visit, and backtracking. Preserve tile/node movement and all emoji/text fallbacks. Source masters and optimized derivatives follow the existing asset workflow.

Bracken, the Thornseal Guard, and the Thornroot Sentry must match [the enemy-cohesion record](../planning/enemy-cohesion-pass.md). Portraits, pane symbols, false/true brake feedback, prisoner staging, and the four-card boss layout are production requirements. Maps and final boss-room art wait for the interaction spike and full graybox acceptance.

## Acceptance Sequence And Coverage

1. **Contract established:** starting fixture, isolated pure consequences, required outcomes, scene matrix, and obsolete-plan reconciliation pass automated rules/build checks. This is the current milestone.
2. **Interaction spike:** a short playable workshop/desk/lantern/door loop, alert-dependent boss, and carriage rescue, with stable hooks and actual persistence. Owner tests whether codes, false command, and brake feedback are understandable. No finished art needed.
3. **Complete graybox:** all three entry routes, all alert outcomes, every wing order, required cleanup, companion-specific beats, both return routes, and Bramblecross ending. Human route test before final maps.
4. **Map masters and production:** schematic acceptance, source-art generation, immediate painted-map alignment checks, and production asset audit.
5. **Release candidate:** desktop/phone review, uninterrupted Chapters 1–5 human playthrough, shared-system polish, full automated gate, and explicit deferrals.

Current executable checks cover required entry facts, real disk-save serialization, optional/absent/downed boundaries, every wing ordering, all 64 signals, first/second invalid responses, monotonic alerts, guaranteed direct entry, support counts, silent-removal consequences, independent workshop/light benefits, untimed fail-forward rescue, each required captive/evidence category, both return outcomes, and the exact ending.

Future browser checks must prove these same outcomes through actual controls, including pane edit versus transmission, keyboard leakage, Back/reopen, repeated actions, partial save loads, no duplicate damage/rewards, missing/downed companions, all four battle cards, and clue readability at phone width. A green pure contract is not a substitute for those tests.

Ancestry-aware reactions, animated player-rolled checks, and the whole-story companion differentiation pass remain in the post-Chapter 5 backlog. Chapter 5 itself still requires companion-specific writing.

## Contract Milestone Verification

`npm.cmd run verify` passed on 2026-09-05: production build; 66 rules tests, including 15 Chapter 5 contract cases; 35 Chapter 1, 31 Chapter 2, 12 Chapter 3, 16 Chapter 4, and 1 smoke test. Total: 161. The Chapter 4 suite includes importing the new disk fixture and reopening the accepted Relay ledger. The production asset audit scanned 171 images. Documentation links and `git diff --check` also passed.

An initial run had a timeout in the existing Chapter 1 downed-companion combat test. Its focused rerun and the subsequent full gate passed without any Chapter 1 code change. The cause of that interruption was not established.
