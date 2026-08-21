# Current Project Status — 2026-08-20

Stable branch: `main`; current handoff branch: `codex/chapter-4-graybox-entry`

## August 20 Chapter 4 Continuation

- The owner accepted the lantern-dark Underway play experience. The modern-road appearance of the placeholder image beneath the fog and the seams between movement/dialogue steps are deferred polish findings.
- Tasmine now name-drops Princess Elowen's first independent Royal Progress during the Lower Gate ledger briefing. The later Relay broadside adds her portrait and lawful authority; the forged use of her name remains a separate discovery after the fight.
- The playable graybox now continues from Lio's knot to a separate loose route-record plate. His exact message is: “M—do not follow angry. Follow clever. Taking us west. Still me. — L”. The plural direction implies at least one other prisoner without claiming Lio knows the destination; player-facing guidance does not name the relay before the party reaches it.
- Mara's response, the one-time Lio's Courier Knot story-item award, repeat review state, quest transition, save migration, and stable browser hooks are implemented.
- The Old Keeper Road contains a unique Old Waykeeper Helm cache; the construction detour exposes and lets the player jam the ambushers' live signal rig, guaranteeing a prepared opening against that branch's larger convergence fight.
- The required graybox now continues through a harder three-enemy Briar Relay Post fight, an expanded Princess Elowen and Royal Progress introduction, clearer forged-authority evidence, an immersive five-prisoner Briarhold Waystation reveal, and the Chapter 5 handoff; the captive porter remains optional.
- The owner completed and loved the full Chapter 4 graybox through its Chapter 5 handoff. The expanded multi-map tunnel pacing, Relay encounter, evidence sequence, and ending are accepted for the graybox milestone.
- The construction detour appears as a nearly straight modern cut, while the Old Keeper Road follows a more winding older line. “Construction detour” is ordinary lowercase description, not a route name.
- The two-fold Folded Map puzzle remains intact. Only the unrelated optional third-fold Lanternwell cache, its interface marks, reward copy, and award path were retired.
- The Folded Map's persuasive false result is now a Survey Shortcut: a misleading office revision entirely separate from the construction detour introduced later by the physical closure board.

This is the concise pickup document for the current illustrated prototype. Historical implementation notes remain in `docs/codex-handoff.md`; the detailed dialogue-art inventory remains in `docs/planning/dialog-stock-icon-replacement-plan.md`.

## Playable State

- Chapters 1, 2, and 3 have automated playable paths.
- Chapter 1 remains the protected baseline and now includes the full queued human-playtest polish pass.
- Chapter 2 is complete through the Westroot gate and retains clean, standard, and messy puzzle outcomes.
- Chapter 3 is closed as a release candidate after an owner-played human run through Rootmarket, the Rootbread Promise, Witness Stones, Cargo Siding, Split Hall, and the Chapter 4 handoff.
- The uninterrupted human Chapters 1–3 run was not performed and is explicitly deferred to the Chapter 4 release-candidate cycle.
- Chapter 4 now has a playable graybox route from the canonical Chapter 3-complete fixture through Bramwell and Noma's Lower Gate sendoff, Tasmine Rootbrace's full buy/sell smithy, Survey Correction Room briefing, accepted and visually polished Folded Map, lantern-dark Underway, posted detour decision, concealed ambush, and three traveled Listening Mile posts.
- The playable endpoint is the Chapter 5 handoff after the Relay Post fight, forged-order evidence, and Briarhold prisoner ledger. The captive porter remains optional future content.

## Current UX

- Exploration is map-first on desktop: the painted map is the primary surface and a compact rail carries HP, XP, objective, companion, and menu access.
- Quests, Character, Inventory, Equipment, Battle Pouch, Companion, and Recipes share a wide desktop drawer and phone bottom sheet.
- Phones keep a fixed compact status bar and thumb-sized movement/Inspect controls at the map edge.
- Latest-update feedback overlays the map instead of falling below the visible play area.
- Combat presents enemies first, then party cards beside a static action panel. HP appears only on the combatant cards; the action panel no longer duplicates hero or selected-target meters. Enemy art uses contained framing instead of forced crops. Recent Events is collapsible.
- Dialogues can opt into compact semantic choice groups. The Three-Door Threshold uses responsive door and companion-read rows on wider screens while retaining full-width stacked touch targets on phones.
- Door close-ups use a split art-and-copy presentation on wider screens, eliminating hidden below-image text and redundant image captions. Their actions are grouped by investigation, character read, and consequence.
- The Three-Door Threshold uses the same split presentation; on phones its required prose moves ahead of the illustration so the scene never depends on noticing an internal scrollbar.
- That condensed responsive treatment is now the default for every dialogue with a scene image. Required copy appears beside the art on desktop and before it on phones, while actions remain visible outside the copy scroll region.
- True chapter-ending tableaus are explicit full-width exceptions. Their actions follow the prose inside the scroll flow so a button never appears to precede unread resolution text.
- Tile and graph movement, save compatibility, and existing story triggers remain intact.

The implementation and decisions are documented in `docs/planning/gameplay-ux-redesign-plan.md`.

## Recent Playtest And Story Decisions

- The Underway graybox uses separate focused maps: approach/fork, either the winding Old Keeper Road or the nearly straight construction detour, convergence/ambush, one map per listening hood, and a final Relay approach. The unused route is never shown beside the chosen route; every visual path still advances with Right.
- Both Underway routes meet a concealed ambush. The Old Keeper Road faces one relay guard; choosing the posted construction detour adds a Seal-Forged Sentry. A hidden Instinct DC 16 check reveals no marker or failure copy on an ordinary miss; exceptional success exposes a physical signal cord, reveals the enemy marker, and allows the party to start first with 4 guard.
- Every tunnel map is black outside a local lantern halo. Only the hero and immediately connected passage segments remain visible; traveled tunnel returns to darkness. The three Listening Mile hoods now have substantial separate travel maps.
- Tasmine's five-item regional smithy uses the full buy/sell interface. It stocks the optional 32-gold Hookblade, 30-gold Passage Pike, 34-gold Counterweight Maul, 29-gold Ironroot Ribplate, and 23-gold Low-Arch Roothelm. It carries no Orin gear, cloak, charm, or general supplies. Story evidence cannot be sold, nothing auto-equips, and the Underway never checks a purchase.
- The Folded Map story bridge uses the Cargo Transfer Tag, Witness Stone rubbing, and Edden's existing bundle. The folding table, flap boundaries, crease shadows, bridge-completed route, and trace results remain visible; the retired optional third-fold cache relationship does not.
- The next human focus is the Relay fight, forged-authority evidence, Briarhold reveal, and Chapter 5 handoff.
- The automated Underway/Listening Mile graybox record is `docs/playtest-notes/2026-08-09-chapter-4-underway-listening-mile-graybox.md`.
- Tasmine Rootbrace is Westroot's Stonekin smith and gatewright. Bramwell and Noma introduce her in a friendly Lower Gate scene; Bramwell performs the route-tag check as a practical lookup rather than an adversarial test. The canonical 78-gold fixture reaches the map with or without buying anything.
- Chapter 4 begins only when the player commits through the Westroot completion banner; merely loading the Chapter 3-complete fixture preserves its ending state. Main objectives now advance through Lower Gate, Folded Map, and an explicit Underway-next endpoint.
- Desktop and 430px manual browser passes covered the entry, purchase, Survey briefing, keyboard map solve, true-route result, Back behavior, repeat review, and endpoint. The pass fixed a Folded Map keyboard event leak, Chapter 3 header carryover, and stale Latest Update feedback. See `docs/playtest-notes/2026-08-04-chapter-4-graybox-entry.md`.
- The accepted Folded Map prototype uses one opaque two-sided rectangular sheet. Each of four draggable edges can land at the quarter, half, or three-quarter guide, producing 54 two-edge configurations. West-half plus south-three-quarter aligns the Survey and keeper evidence into the true Old Keeper Road; east-half plus north-half creates the persuasive false Survey Shortcut; other constructions are safe experiments. Ordinary failure, false route, and true route retain unmistakable result stamps. The interaction allows at most two active folds; Back unfolds the latest edge before closing, and repeat review is preserved.
- Westroot's gatewright is a required early encounter, but the 32-gold Rare Gatewright Hookblade purchase is optional. It improves on the Pebbleknock Hammer, does not auto-equip, introduces no durability, and is affordable from the 78-gold canonical save.
- The captive porter is corrected to an optional Chapter 4 thread and is no longer an end flag.
- The August 2 closeout records Chapter 3 human-playthrough signoff with no remaining Chapter 3 blocker. `public/saves/chapter-3-complete.json` is the canonical Chapter 4-ready state and can be opened from the title screen.
- Canonically, Liam completed the Rootbread Promise. Its reward is now a wearable Rare support trinket whose healing, guard, and cooldown are all better than the Lantern Pin's. Chapter 4 readiness is separately tested with all Rootbread flags and inventory removed, so later critical paths cannot require it; optional recognition or bonuses may.
- Chapter 4 must introduce a nearby Westroot smith/gatewright or equivalent new-weapon path before the Underway so the player is not sent back to Hearthhollow for weapon progression.
- The July 29 Chapter 3 pass clarifies the Rootbread cup question and both Cargo Runner outcomes, adds a player-selected Bramblecross contact, gives the sixty-year compact announcement a visible public reaction and concrete rationale, and lets Bramwell publicly acknowledge that Noma's witnessed-contact argument was right.
- Singular characters in Chapters 1–3 now use he/him or she/her in runtime and canonical writing. `docs/story/writing-rules.md` records the rule and the settled character assignments for future work.
- Chapter 3 now implements its approved story-foundation package in playable canon. The Transfer Checkpoint, scheduled-convoy versus unscheduled-arrival distinction, Lio's movement beside the crate, scoped holds and reopenings, first restored Bramblecross compact, and Quill's outward warning are all on the required path.
- The realm-history workshop now places Lanthorne above Bramblecross as the Rainroot regional city, proposes Hearthward as the Hearthvale capital, adds the Saltwake War and Cinder Vale diaspora, makes Witherdeath a separate two-year international plague, confirms the coastal Sunreach queen and Elowen's independent Royal Progress, develops Moonmark performing companies, and gives the Crownward/Briar movement a sovereign claimant above its road-office operators. The Chapters 2–5 story bible now reflects the non-cosmic civic-road and institutional-conspiracy direction; playable text still awaits a later focused pass.
- `docs/story/historical-backdrop-integration-audit.md` now identifies the leanest integration points across playable Chapters 1–3 and planned Chapters 4–5. Its first priorities are the Chapter 3 checkpoint/compact rewrite, a non-cosmic language pass, the Great Survey evidence prop, Elowen's Royal Progress, the Crownward/Briar distinction, and Chapter 5's institutional-compromise reveal.
- The selected Great Survey political map now lives at `assets/reference/source-art/assets/maps/great-survey-of-alderreach-v05.png`. Veyrun and Rainroot occupy comparable settled valleys on either side of the braided river march; the long Sunreach escarpment creates waterfall gorges and limited passes to a broad mainland Ember Coast; Selvara, Whiteharbor, Tideglass, Cinder Vale, and Valehaven sit on that mainland while the Saltwake Isles remain a separate offshore chain. National capitals use stars, provincial capitals use diamonds, council seats use hexagons, towns use dots, and Riverwatch uses a fortress square. The approved labels are Hearthward, Lanthorne, Bellwater, Saffron Gate, Kestovar, Cairnmeet, Sevenbridge, Tideglass, Selvara, Whiteharbor, Valehaven, and Riverwatch. Westroot remains a later graphite correction made after renewed contact. V01–V04 are preserved as superseded compositions. The map is reference-only until an optimized runtime derivative and story placement are approved.

- Elder Brynn learns that the order is forged only after the Bramble Boar fight. The player reports the satchel to Brynn before following Lio's trail.
- The worried traveler believes the apparent royal order; he does not diagnose the forgery.
- Lantern Road bandits ambush the player across the eastern road corridor rather than relying on a hidden encounter icon.
- Bramblecross's notice board, visible cellar entrance, Watchhouse directions, and Hollis's cellar handoff now match the painted map and story logic.
- Ada's crate notice and the cellar/route notices are independent actions.
- Smith Orin's weapon supersedes the optional old-hatchet pickup as the main preparation objective.
- Root Cellar fog is room-aware: passages reveal narrowly, while entering one of eight authored chambers reveals most of that room and keeps it discovered.
- Ada's honest Willowmark uses a subtle nick in the left leaf. `willowmark-seal-v02.png` is the selected reference and Watchhouse evidence image.
- Camp actions keep the camp open and report results; the village well walk-on dialogue is one-time only.
- Companion Attack, Defend, and Support orders identify the named ability and mechanical behavior they select.
- Chapter 1 now formally completes at the sealed-door proof pickup after the Briar Knot Warden fight. The Watchhouse return combines the cellar report, Westroot explanation, and Chapter 2 expedition briefing in one conversation, then activates Mara, Edden, and Ada as the preparation threads without requiring a second conversation with Enna.
- Claiming the Briar Knot Warden victory now moves directly into a mandatory Sealed Iron Door sequence. The player cannot leave that post-boss reveal before collecting the Warden Chain and Edden's cloth, preventing a defeated-cellar state with Chapter 1 still incomplete.
- Climbing out of the Root Cellar now returns the hero to the painted Bramblecross cellar entrance at logical tile `(3,5)`.
- Mayor Anwen stops warning the hero about entering the cellar once it has been cleared, and shifts to the Westroot/Lio lead after the Watchhouse report.
- Edden's drawing cannot be previewed from the briefing before Edden personally gives it to the player. After the Chapter 1 report, the detailed case-wall controls collapse into a compact archive so Chapter 2's Mara, Edden, and Ada actions own the active Watchhouse table.
- Downed companions no longer offer cellar story reactions. Living companions can still discuss the sealed door from the Chapter 1 completion tableau after the proof has been collected.
- A companion's sealed-door reaction is remembered after it is heard and is not offered again at the door or on the Chapter 1 ending tableau.
- Companion consciousness is now a shared rule across Chapters 1–3. Downed companions do not contribute dialogue, door/threshold reads, physical departure actions, or victory XP; the journal marks them as **Downed** until they recover.
- Healing a 0-HP companion with a battle item now restores their immediately following companion turn.
- Companion progress now lives in a persistent roster. A companion sent to the inn keeps HP, XP, level, and learned progress when invited back, while the active companion is shown as **Traveling** rather than recruitable.
- One-time and reviewable actions now have explicit state: spent searches and story reactions disappear, while evidence reviews retain their original skill-check result without rerolling or awarding repeat XP.
- Chapter 2 clue order is resilient. The Westward Cut can be copied on the return trip after an outbound study, and Mara's shelter-mark comparison and Edden's drawing comparison remain available if their matching clues are discovered later.
- Noma's Chapter 3 questions remain independently available until each topic has been asked.
- The Crown Door remains fully sealed until the Roadwatcher's split slat is found. Trying the door or trusting its false sign no longer previews the Crown Door Den, and stepping back from the Three-Door Threshold now returns to the previous trail node.
- Lantern Sign cleaning is one-time and becomes a no-XP review afterward. Companion opinions at each threshold door return to that specific door rather than ejecting the player to the main threshold.
- The user-provided Mossgirl disk save is now covered through the real file-picker load path. It has every repair required to open the No-Handle Door; the intentional second password phrase remains the final action, with explicit ready-state copy and a highlighted opening choice.
- Map overlays now prioritize encounters: the Roadwatcher, releasable Crown Den hound, fixed den guard, Root Cellar skulk, south-gate boar, and Cargo Siding threat use enemy art. Painted clue stations no longer get map icons, scripted ambushes remain hidden, and the cellar guardian gets no overlay because it is already painted into the map.
- Westroot Hub navigation follows the painted entrance road, plaza, and branching paths with short hidden waypoints. As a village map, the entire hub now stays visible without fog of war.
- Westroot arrow/WASD controls now follow the visible direction of the painted road. The center junction has explicit one-way staging: from `(5,3)`, Down reaches `(4,4)`, Left `(4,2)`, Right `(6,3)`, and Up `(6,1)`; `(4,3)` Right reaches `(5,3)`.
- Bramwell, Noma, Quill, and Lume now have phase-aware outdoor map markers. Quill and Lume identify Rootmarket before the bell; all four visibly gather for the Hold Bell and Witness Stone renewal; Bramwell, Noma, and Quill move to the Cargo Siding approach. The Rootbread child appears at the First Gate Transfer Checkpoint only after Lume supplies that lead.
- Bramwell is now a mandatory Chapter 3 entry beat. Entering Westroot opens his introduction, and movement, map-node clicks, or older saves positioned past the gate are routed back to him until `metBramwell` is true; Quill cannot be met first.
- The lower Westroot approach follows the stone lane down to the wooden bridge and rises to a plaza junction in front of Rootmarket. The public path no longer triggers the market: **Up** steps into a dedicated node on the painted stalls, **Left** climbs toward Mossgarden, and **Right** continues through the village. The Mossgarden branch similarly routes around the hut.
- Completed Chapter 3 saves now identify the current playable endpoint explicitly. If the Rootbread Promise is unfinished, the persistent objective directs the player back to Rootmarket, where Auntie Lume's choice opens automatically, and then onward to the First Gate Transfer Checkpoint; completed landmarks remain quiet on walk-over but reviewable with **Inspect**.
- Rootmarket now opens automatically while Auntie Lume's first conversation is still available. Once both Quill and Auntie have been handled, it returns to the normal completed-landmark behavior and stays quiet unless the player chooses **Inspect**.
- Rootmarket is now a location-level dialogue hub. Quill, Auntie Lume, and the market's ambient voices are independent choices, and each character returns to the shared market instead of presenting another person inside Quill's dialogue.
- Chapter 3 now builds tension before the investigation: Split Hall may be visited for an optional simmering argument, then the mandatory Hold Bell and first formal hall debate occur after Quill and Noma have been heard. The Witness Stones remain locked until that debate has happened.
- Chapter 3 now establishes the Witness Stones through their civic use: Quill names the sender/witness/responder practice, Noma connects route testimony to the blocked outer-shelter water mark, the hold slate identifies its scope and review, and Bramwell reopens the walk after naming the changed facts. The final v03 scene makes that reopening visibly public, with Bramwell and Noma opening the hold, Quill recording it, and mixed neighbors taking responsibility at the four stones.
- Stonekin and Mossbacks appear on both sides of the open/close disagreement. The gate, market, and Mossgarden change after the Hold Bell, and testimony heard in the first debate is remembered at the final evidence scene.
- Chapter 3 dialogue now gates names, terms, and actions behind the conversation that introduces them. Rootmarket initially offers the Stonekin shutter-mender and Mossback baker rather than Quill and Auntie Lume; the weathered stones and checkpoint child likewise remain unavailable until Noma and Lume explain them.
- Liam now returns introductions inside the existing first dialogue with Bramwell, Quill, Lume, and Noma. Each response expresses a different level and kind of outsider trust without adding a separate introduction screen.
- Rootmarket listening is one-time. Quill, Lume, Noma, the Rootbread child, and the first Split Hall debate retain unanswered questions without replaying their converged speeches, and the Hold Bell waits until the player deliberately steps away from Quill or Noma.
- The Cargo Siding investigation now rewards deliberate ledger work: spotting and covering the service passage grants the opening turn, 4 Guard, and the runner-capture option. Other clues remain valid fail-forward paths and produce the escape outcome without blocking completion.
- Westroot battles now save a **Westroot** checkpoint instead of falling through to the old **Lantern Road** label.
- The July 28 playtest pass removes the bottom-left standing label, moves Noma's Witherdeath history behind the player's gate question, makes the Witness Stone tour a single physical movement, quotes the hold slate, stages every speaker and post-bell destination, gives the Willowmark Lens a seal image, clarifies Lio's hands-free courier disguise, assigns siding evidence to the cargo clerk, and replaces the implausible fresh courier carving with a transfer-tag and old-route-index deduction.
- The three final Split Hall responses are now clearly three framings of the same guarded Bramblecross compact. The choice recap lives in the quest journal rather than in Noma's closing dialogue.

## Next Best Step

Begin Chapter 4 production-art integration against the accepted graybox, starting with the Underway maps under the lantern mask. Polish movement/dialogue seams during integration, then run desktop, phone, and uninterrupted Chapters 1-4 release-candidate QA.

## Production Art Status

- Bramblecross town map v2 is selected and aligned to its visible cellar entrance.
- The Courier Satchel, Watchhouse case wall, Root Cellar evidence wall, and Briar Crown mark are selected and wired.
- Enna and Hollis use portraits inside the Watchhouse.
- Companion cards and level-up choices use production portraits/emblems with fallback symbols retained only for image failure.
- Willowmark seal v2 is optimized for runtime; the full source is preserved under `assets/reference/source-art/` and v1 is retained under `assets/reference/alternates/`.
- The Chapter 1 ending tableau is wired into the sealed-door proof pickup, and the Root Cellar switches to a boss-free painted background immediately after the Warden is defeated. Both full-resolution PNG sources are preserved under `assets/reference/source-art/`.
- The tense Split Hall Hold Bell scene is selected and wired before the resolution image. Thin red ceiling cords read as Westroot hold-lines rather than faction decoration.
- The Rootmarket uneasy-arrival tableau is selected and wired to the location hub while Quill and Auntie Lume retain their individual portraits inside their conversations.
- The Witness Stones public-renewal v03 scene is selected and wired; its four established symbols remain dominant while the shared civic action is now visible.
- The Rootbread Promise now uses a dedicated Transfer Checkpoint scene showing the basin, airing rack, inspection bench, account rail, ordinary tray, Mara, and Lume's young helper. The former sealed-hatch scene is preserved under reference alternates.
- The full-size Great Survey of Alderreach map is selected as a reference source and intentionally excluded from the production asset audit until it is optimized and wired.
- The optimized runtime asset set currently contains 133 images and passes the asset audit.

## Verification At Handoff

```text
npm.cmd run build                 passed
npm.cmd run test:rules            39 passed
npm.cmd run playtest:chapter1     30 passed
npm.cmd run playtest:chapter2     31 passed
npm.cmd run playtest:chapter3     11 passed
npm.cmd run playtest:chapter4      6 passed
npm.cmd run playtest:smoke         1 passed
npm.cmd run audit:assets          133 images scanned; largest assets within targets
git diff --check                 passed (Windows line-ending warnings only)
```

Browser QA covered illustrated dialogue at 1280×720, 1366×768, 430×932, and 390×844; the full real level-3 Chapter 3 fixture; the prepared and fail-forward Cargo outcomes; both full-width Chapter 3 ending tableaus; desktop and phone exploration; compact phone combat; Root Cellar room-aware fog; and Westroot's map and NPC staging.

## Worldbuilding Implementation Order

Do not begin by adding general lore dialogue. Implement the worldbuilding where it resolves the current plot, in this order:

### Priority 1: Chapter 3 Physical And Political Clarity — Implemented

The canonical script, runtime copy, quest text, flags, tests, map interaction, and affected art now satisfy `docs/story/chapter-3-player-knowledge-contract.md`.

Required results:

1. Establish the Transfer Checkpoint at the First Gate with visible sanitation and account procedures.
2. Explain why the party's unscheduled gate opening is alarming even though the false convoy entered three nights earlier.
3. Replace the sealed-hatch Rootbread scene with the return interaction at the checkpoint; finish on **The Rootbread Promise reached Lio**.
4. State on the required path that Lio walked beside the crate as a prisoner recorded like freight and was never inside it.
5. Name the scope of every hold and reopening: crate hold, Hold Bell lockdown, Witness Stone signal/investigation reopening, and final compact.
6. Make Split Hall's final action an explicit first restored compact with Bramblecross, limited to guarded entry, named witnesses, outward warnings, and Enna/Hollis contacts.
7. Have Quill physically carry the first warning outward so the political decision becomes visible action.

Art/map work in this priority:

- replace the sealed-hatch Rootbread illustration with the Transfer Checkpoint version;
- add or move the temporary Mossback-child interaction to the First Gate landing;
- complete the already-planned public Witness Stones renewal artwork;
- preserve current fallback-safe wiring and map navigation.

Automated coverage, desktop/phone browser QA, and the owner human playthrough are complete. Chapter 3 received release-candidate signoff on 2026-08-02.

### Priority 2: Non-Cosmic Consistency Pass

Apply the inventory in `docs/story/historical-backdrop-integration-audit.md` across:

- `src/App.tsx`;
- `src/story/chapter1.ts`, `chapter2.ts`, `chapter3.ts`, and `chapters2to5.ts`;
- all three canonical chapter scripts;
- the Chapters 2–5 story bible;
- art direction and relevant art prompts.

Replace literal road/stone/root agency with named worker practices, crafted locks, mechanical signals, records, and human memory. Metaphor may remain only after the physical mechanism is clear. Preserve Chapter 1 behavior and do not combine this prose pass with broad refactoring.

### Priority 3: Great Survey Story Integration

1. Add the official Survey copy to Enna's Chapter 2 map briefing: **“The Survey ends cleanly west of Bramblecross. The courier marks do not.”**
2. Keep Westroot absent from official ink before discovery.
3. After the Chapter 3 compact, unlock or show the selected v05 map with Westroot penciled in and dated under a witness name.
4. Create an optimized runtime derivative or focused crops from `great-survey-of-alderreach-v05.png`; never import the 3.6 MB reference PNG directly.

### Priority 4: Reconcile Chapters 4–5 Before Implementation

Before the Chapter 4 executable-contract gate:

- replace the self-changing Wrong Map Room with a Survey Correction Room or overlay archive;
- define the Listening Mile as a mechanical acoustic safety line that Lio can deliberately alter;
- make Elowen's first independent Royal Progress the reason her forged authority is plausible;
- place a lawful Crownward argument beside secret Briar operational evidence;
- replace every living-mark or awakening beat with proof of genuine Roadwarden, Survey, seal, contractor, or council access above Bracken.

Chapter 4 still must not begin until the closeout, ready-fixture, central-interaction graybox, and executable-contract gates in `docs/planning/chapter-4-development-process.md` are satisfied.

### Deferred Until The Plot Needs Them

Do not force the Saltwake War, Cinder Vale diaspora, Sea-Peace marriage, Fostered Heir, Cairn politics, or Moonmark Counselor into Chapters 1–3. Introduce each through a later character, object, song, prejudice, policy, or conflict that makes the history immediately relevant.

## Remaining Work

### 1. Human Playtesting

1. During the Chapter 4 release-candidate cycle, do the deferred uninterrupted Chapter 1–3 playthrough before continuing through Chapter 4. This is cross-chapter endurance coverage, not a reopened Chapter 3 blocker.
2. Tune individual Root Cellar room masks only if later playtesting shows a chamber revealing too early or leaving important room art hidden.

### 2. Finish The Stock-Icon Migration

Use `docs/planning/dialog-stock-icon-replacement-plan.md` as the inventory.

1. Replace remaining normal-path dialogue symbols with existing portraits, enemy art, map crops, or scene aliases before generating more art.
2. Mark abstract/system dialogues deliberately text-only where an illustration would be decoration rather than information.
3. Add a registry-level regression asserting that every production dialogue resolves to art or an explicit text-only treatment, while preserving error fallbacks.
4. Generate optional closeups only if map-crop QA fails. The remaining candidates are the notice board, exterior cellar entrance, and dropped forged orders.

### 3. Story Follow-Ups

1. Run the focused non-cosmic language pass listed in `docs/story/historical-backdrop-integration-audit.md` through runtime, canonical scripts, Chapters 4–5 plans, and art direction.
2. Add the Great Survey as a Chapter 2 evidence object and unlock the penciled Westroot version only after Chapter 3; optimize the image before runtime import.
3. Give Healing Fizzpop's mint-green hair a later comedic payoff. Decide first whether it is one scripted callback, a temporary status flag, or recurring NPC reactivity.
4. Run a final character-name consistency pass across older planning documents. Runtime intent is Elder Brynn, Sela of the Loom, Mara Brindle, Enna, Hollis, and Ada Willowmarket; legacy asset filenames should not dictate story names.

### 4. Chapter 4 And 5 Production

1. Follow `docs/planning/chapter-4-development-process.md`: define the executable contract, include early Westroot smith/gatewright access, and validate the Folded Map graybox before full implementation. Chapter 3 signoff and the canonical ready fixture are complete.
2. Implement the Chapter 4 playable route from the existing Chapter 3 handoff before expanding Chapter 5.
3. Produce the tracked Chapter 4–5 story-item and enemy art only after the relevant interaction and map topology settle: Folded Map Scrap, Lanternwell Drop, True Seal Fragment, Briar Chain Link, Lio's Courier Knot, Briar Relay Guard, Crown Whisperer, Bracken Voss, Thornseal Guard, and Thornroot Sentry.
4. Continue using the source-art/alternate/runtime asset workflow and retain fallbacks until each asset passes in-game QA.

### 5. Technical Follow-Ups

1. The main JavaScript chunk remains slightly above 500 KB. Treat code splitting as a focused performance task.
2. `src/App.tsx` remains large. Continue the staged extraction in `docs/planning/refactor-roadmap.md`; do not combine a major structural refactor with new story behavior.
3. Consider drag gestures for the phone bottom sheet only if human playtesting finds the explicit Menu button insufficient. The current button-driven sheet is intentional and tested.

## Resume Checklist

```bash
git fetch --all --prune
git switch codex/chapter-4-graybox-entry
git pull --ff-only
npm install
npm.cmd run build
npm.cmd run test:rules
```

Use **Review Chapter 3 Complete Save** and then **Begin Chapter 4 Graybox** for the real entry slice. **Test Folded Map Graybox** remains the focused interaction hook. The canonical entry fixture is `public/saves/chapter-3-complete.json`; the playable route now continues through the Underway and Listening Mile to Lio's hidden-message milestone.
