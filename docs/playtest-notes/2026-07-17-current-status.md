# Current Project Status — 2026-07-17

Branch: `codex/chapter-3-vertical-slice`

This is the concise pickup document for the current illustrated prototype. Historical implementation notes remain in `docs/codex-handoff.md`; the detailed dialogue-art inventory remains in `docs/planning/dialog-stock-icon-replacement-plan.md`.

## Playable State

- Chapters 1, 2, and 3 have automated playable paths.
- Chapter 1 remains the protected baseline and now includes the full queued human-playtest polish pass.
- Chapter 2 is complete through the Westroot gate and retains clean, standard, and messy puzzle outcomes.
- Chapter 3 includes the full Westroot route through Rootmarket, the Rootbread Promise, Witness Stones, Cargo Siding, Split Hall, and the Chapter 4 handoff.
- Chapter 4 has not been implemented as a playable chapter yet.

## Current UX

- Exploration is map-first on desktop: the painted map is the primary surface and a compact rail carries HP, XP, objective, companion, and menu access.
- Quests, Character, Inventory, Equipment, Battle Pouch, Companion, and Recipes share a wide desktop drawer and phone bottom sheet.
- Phones keep a fixed compact status bar and thumb-sized movement/Inspect controls at the map edge.
- Latest-update feedback overlays the map instead of falling below the visible play area.
- Combat uses compact party/enemy cards plus a persistent action dock with hero and selected-target HP. Recent Events is collapsible.
- Dialogues can opt into compact semantic choice groups. The Three-Door Threshold uses responsive door and companion-read rows on wider screens while retaining full-width stacked touch targets on phones.
- Door close-ups use a split art-and-copy presentation on wider screens, eliminating hidden below-image text and redundant image captions. Their actions are grouped by investigation, character read, and consequence.
- The Three-Door Threshold uses the same split presentation; on phones its required prose moves ahead of the illustration so the scene never depends on noticing an internal scrollbar.
- Tile and graph movement, save compatibility, and existing story triggers remain intact.

The implementation and decisions are documented in `docs/planning/gameplay-ux-redesign-plan.md`.

## Recent Playtest And Story Decisions

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
- Westroot Hub navigation now follows the painted entrance road, plaza, and branching paths with shorter waypoints. Fog opens in room-sized areas around Rootmarket, the Mossgarden, Witness Stones, Split Hall, Cargo Siding, and the Rootbread Hatch instead of exposing a thin disconnected tunnel.
- Bramwell is now a mandatory Chapter 3 entry beat. Entering Westroot opens his introduction, and movement, map-node clicks, or older saves positioned past the gate are routed back to him until `metBramwell` is true; Quill cannot be met first.
- The lower Westroot approach now follows the stone lane down to the wooden bridge and rises into the open Rootmarket plaza; it no longer cuts across the gorge or places the hero inside the market awning. The Mossgarden branch similarly routes around the hut.
- Completed Chapter 3 saves now identify the current playable endpoint explicitly. If the Rootbread Promise is unfinished, the persistent objective directs the player back to Rootmarket, where Auntie Lume's choice opens automatically, and then onward to the sealed hatch; completed landmarks remain quiet on walk-over but reviewable with **Inspect**.
- Rootmarket now opens automatically while Auntie Lume's first conversation is still available. Once both Quill and Auntie have been handled, it returns to the normal completed-landmark behavior and stays quiet unless the player chooses **Inspect**.
- Rootmarket is now a location-level dialogue hub. Quill, Auntie Lume, and the market's ambient voices are independent choices, and each character returns to the shared market instead of presenting another person inside Quill's dialogue.
- Chapter 3 now builds tension before the investigation: Split Hall may be visited for an optional simmering argument, then the mandatory Hold Bell and first formal hall debate occur after Quill and Noma have been heard. The Witness Stones remain locked until that debate has happened.
- Stonekin and Mossbacks appear on both sides of the open/close disagreement. The gate, market, and Mossgarden change after the Hold Bell, and testimony heard in the first debate is remembered at the final evidence scene.

## Production Art Status

- Bramblecross town map v2 is selected and aligned to its visible cellar entrance.
- The Courier Satchel, Watchhouse case wall, Root Cellar evidence wall, and Briar Crown mark are selected and wired.
- Enna and Hollis use portraits inside the Watchhouse.
- Companion cards and level-up choices use production portraits/emblems with fallback symbols retained only for image failure.
- Willowmark seal v2 is optimized for runtime; the full source is preserved under `assets/reference/source-art/` and v1 is retained under `assets/reference/alternates/`.
- The Chapter 1 ending tableau is wired into the sealed-door proof pickup, and the Root Cellar switches to a boss-free painted background immediately after the Warden is defeated. Both full-resolution PNG sources are preserved under `assets/reference/source-art/`.
- The tense Split Hall Hold Bell scene is selected and wired before the resolution image. Thin red ceiling cords read as Westroot hold-lines rather than faction decoration.
- The Rootmarket uneasy-arrival tableau is selected and wired to the location hub while Quill and Auntie Lume retain their individual portraits inside their conversations.
- The optimized runtime asset set currently contains 130 images and passes the asset audit.

## Verification At Handoff

```text
npm.cmd run build                 passed
npm.cmd run test:rules            28 passed
npm.cmd run playtest:chapter1     30 passed
npm.cmd run playtest:chapter2     31 passed
npm.cmd run playtest:chapter3      6 passed
npm.cmd run playtest:smoke         1 passed
npm.cmd run audit:assets          130 images scanned; largest assets within targets
git diff --check                 passed (Windows line-ending warnings only)
```

Browser QA covered desktop exploration at 1400×900, phone exploration at 430×932, the phone menu sheet, compact phone combat, the Willowmark evidence selection, Root Cellar room-aware fog, and the responsive Three-Door close-up/choice layouts.

## Remaining Work

### 1. Human Playtesting

1. Play Chapter 3 end to end at desktop width and at approximately 430×932. Focus on pacing, choice clarity, dialogue scrolling around the six Chapter 3 illustrations, and Westroot map readability.
2. Do one uninterrupted Chapter 1–3 playthrough with the new map-first shell. Automated paths are green, but a continuous human session may expose fatigue, drawer/sheet friction, or poorly timed feedback.
3. Tune individual Root Cellar room masks only if playtesting shows a chamber revealing too early or leaving important room art hidden.

### 2. Finish The Stock-Icon Migration

Use `docs/planning/dialog-stock-icon-replacement-plan.md` as the inventory.

1. Replace remaining normal-path dialogue symbols with existing portraits, enemy art, map crops, or scene aliases before generating more art.
2. Mark abstract/system dialogues deliberately text-only where an illustration would be decoration rather than information.
3. Add a registry-level regression asserting that every production dialogue resolves to art or an explicit text-only treatment, while preserving error fallbacks.
4. Generate optional closeups only if map-crop QA fails. The remaining candidates are the notice board, exterior cellar entrance, and dropped forged orders.

### 3. Story Follow-Ups

1. Give Healing Fizzpop's mint-green hair a later comedic payoff. Decide first whether it is one scripted callback, a temporary status flag, or recurring NPC reactivity.
2. Run a final character-name consistency pass across older planning documents. Runtime intent is Elder Brynn, Sela of the Loom, Mara Brindle, Enna, Hollis, and Ada Willowmarket; legacy asset filenames should not dictate story names.
3. Human-playtest the Chapter 3 ending before implementing Chapter 4.

### 4. Future Mechanic Candidates

1. **High-perception ambush discovery:** when the party nears an intentionally hidden encounter, make a hidden Perception/Instinct check. An exceptional result should reveal the enemy marker and offer a pre-ambush choice; ordinary results should preserve the scripted surprise. Offer this as one of the options the next time the user asks **“what’s next?”**

### 5. Chapter 4 And 5 Production

1. Implement the Chapter 4 playable route from the existing Chapter 3 handoff before expanding Chapter 5.
2. Produce the tracked Chapter 4–5 story-item and enemy art: Folded Map Scrap, Lanternwell Drop, True Seal Fragment, Briar Chain Link, Lio's Courier Knot, Briar Relay Guard, Crown Whisperer, Bracken Voss, Thornseal Guard, and Thornroot Sentry.
3. Continue using the source-art/alternate/runtime asset workflow and retain fallbacks until each asset passes in-game QA.

### 6. Technical Follow-Ups

1. The main JavaScript chunk remains slightly above 500 KB. Treat code splitting as a focused performance task.
2. `src/App.tsx` remains large. Continue the staged extraction in `docs/planning/refactor-roadmap.md`; do not combine a major structural refactor with new story behavior.
3. Consider drag gestures for the phone bottom sheet only if human playtesting finds the explicit Menu button insufficient. The current button-driven sheet is intentional and tested.

## Resume Checklist

```bash
git fetch --all --prune
git switch codex/chapter-3-vertical-slice
git pull --ff-only
npm install
npm.cmd run build
npm.cmd run test:rules
```

Then use the title-screen Chapter 2 and Chapter 3 ready saves for focused playtesting instead of replaying earlier chapters.
