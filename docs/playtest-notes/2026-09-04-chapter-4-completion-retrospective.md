# Chapter 4 Completion Retrospective

Date: 2026-09-04

Status: Chapter 4 release candidate accepted after an uninterrupted owner playthrough of the complete story through the Briarhold reveal

## Outcome

Chapter 4, **The Riddle Road**, is complete for the current illustrated prototype. The owner played the full story from Chapter 1 through the Chapter 4 handoff and accepted the result. Required progression, the Chapter 3–4 transition, regional shopping, backtracking, field-item targeting, maps, dialogue recurrence, combat, and the title-screen playtest entry points received final fixes during that run.

The optional captive porter remains deliberately deferred. It is not required by the Chapter 4 contract, ending, or Chapter 5 entry state.

## Final Verification

`npm.cmd run verify` passed at release-candidate closeout: production build, 51 rules tests, 35 Chapter 1 tests, 31 Chapter 2 tests, 12 Chapter 3 tests, 15 Chapter 4 tests, and the browser smoke test. That is 145 automated tests across the rules and playable paths. The production asset audit scanned 171 images with every asset within its documented target.

## Assessment

The graybox process helped. Its strongest effect was not eliminating iteration; it was moving the most expensive iteration earlier and making later artwork more purposeful.

The Folded Map is the clearest success. Two interaction directions were rejected before production art: answer cards did not feel like folding, and the cross-wing version was too transparent and easy to exhaust. The accepted opaque two-sided sheet established the physical silhouette, fold count, landing depths, true route, persuasive false route, feedback states, and safe experimentation before the painted map faces were commissioned. Art development then had a stable job: provide material richness and matched geography without deciding the puzzle logic. That avoided asking finished art to rescue an unproven interaction.

The broader Underway graybox also helped determine that one large map was the wrong shape. Separate route, convergence, Listening Mile, and Relay maps made the journey readable and let production art be commissioned as focused scenes with clear gameplay purposes.

The process did not remove map integration work. The late adjustments were mostly not changes to the chapter's route or dramatic structure. They were calibration between final pixels and the movement system:

- node anchors sitting above, below, or beside painted paving;
- lantern masks clipping the path immediately around the player;
- Right needing to remain universal forward movement while Up or Down also matched visible switchbacks;
- transitions firing again when the player backtracked;
- illustrated dialogue changing viewport pacing and exposing copy or action-order problems;
- final art making environmental meaning more specific, such as Rootwater's natural glow and the Root Gnawer's root-tangle setting.

The chapter therefore distinguishes two kinds of graybox validation:

1. **Structural graybox validation** asks whether the interaction, route topology, pacing, and consequences work. Chapter 4 did this well.
2. **Presentation-contract validation** asks whether movement nodes, controls, visibility, triggers, and dialogue layout agree with the actual image at the real viewport. Chapter 4 did this too late and mostly through owner markup.

The verdict is that the graybox saved real time and made art development easier, but it needs one additional map-contract gate. A graybox map cannot be considered accepted merely because its graph is traversable.

## What Worked

### Central interaction before production art

- The Folded Map's risky manipulation was tested before its final painted faces.
- Rejected directions were inexpensive to discard.
- Stable geometry let art and deterministic overlays remain separate.
- Desktop, phone, pointer, keyboard, Back, repeat, false-route, and true-route behaviors were automated.

### Executable chapter contract

- Required and optional state was explicit before the critical path grew.
- The captive porter could remain optional without making the ending look broken.
- Chapter 4 readiness, save migration, items, enemies, maps, and end flags had pure validation.

### Canonical entry fixture and stable test hooks

- The Chapter 3-complete save made the chapter reproducible.
- Stable scene and choice identifiers reduced dependence on final prose.
- User-reported save and transition problems became regression tests.

### Art after topology decisions

- Focused maps were commissioned after the multi-map route proved better than one connected Underway image.
- Artwork prompts could reserve readable paths, interaction landmarks, and overlay-safe space.
- Source masters, optimized runtime derivatives, fallbacks, and the asset audit kept art integration recoverable.

### Human playtesting as a distinct gate

- Automated tests established reachability and state safety.
- The owner playthrough found comprehension, recurrence, alignment, shopping, backtracking, and transition issues that passing paths could not judge.
- The uninterrupted Chapters 1–4 run proved the handoffs as one story rather than four isolated fixtures.

## What Cost More Than Expected

### Painted-map calibration

Navigation graphs were validated against logical connections, but not against a sufficiently strict centerline and visibility contract for the final image. Node tuning, lantern halos, and directional aliases became a long visual feedback loop.

### Late presentation semantics

Some facts were mechanically correct but visually or narratively wrong: Rootwater glowed as a broad blue wash before becoming a restrained luminous river; dialogue triggers repeated on backtracking; an inspection action did not visibly change its first paragraph; and the Root Gnawer inherited environmental details that did not belong to it.

### State held inside imperative dialogue callbacks

The Chapter 3 closing button exposed a stale-state handoff because dialogue actions can retain an earlier React render's flags. The chapter-specific pure logic helped, but high-level orchestration remains concentrated in `src/App.tsx` and still needs targeted seams rather than a broad rewrite.

### Release-candidate polish crossed chapter boundaries

The full run correctly found issues in Chapters 1–3 and shared systems: field healing for companions, traveler relocation, one-time board actions, Bramblecross route choice, and regional shops. These were valuable fixes, but they expanded the final Chapter 4 branch. Future release planning should reserve an explicit cross-chapter polish window rather than treating it as surprise scope.

## Chapter 5 Process Changes

### 1. Write the executable contract first

Lock Chapter 5's entry save, required end state, optional captives, Mara and Lio boundaries, boss outcome, Bracken's escape, evidence preservation, and the exact playable endpoint before implementation.

### 2. Spike the highest-risk play, not every scene

Prototype the Captive Lanterns interaction and the boss's false-command mechanic together. The spike must prove that restoring lanterns changes the rescue or battle in a visible, understandable way. Do not commission final puzzle or boss-room art until that relationship is accepted.

### 3. Add a painted-map contract gate

Before final map generation, make a scale-correct composition sheet for each map with:

- the walkable centerline and every navigation node;
- intended forward and backward arrow aliases at each node;
- trigger and one-shot boundaries;
- player-token clearance from walls and props;
- lantern reveal footprints at representative nodes;
- desktop and phone crops;
- labels for required landmarks and overlay-safe areas.

Approve this sheet twice: once as a schematic and again with the selected painted image beneath the same overlay. Production art is not integrated until the second pass succeeds.

### 4. Define repeat behavior with the scene

Every Chapter 5 interaction should declare first visit, incomplete return, completed return, backtracking, and loaded-save behavior when it is written. Actions that change knowledge must visibly change the dialogue before they disappear.

### 5. Use three human gates

1. A short interaction test for Captive Lanterns and the boss mechanic.
2. A map-and-lighting pass immediately after painted maps are integrated.
3. An uninterrupted story playthrough after content and art are complete.

The second gate is the missing Chapter 4 step. It should happen before prose polish and edge-case cleanup accumulate around misaligned maps.

### 6. Reserve cross-chapter release polish

Plan a bounded final pass for shared menus, shops, backtracking, save slots, and prior-chapter regressions. Convert findings into focused tests, but do not reopen accepted chapter structures unless the full story exposes a genuine contradiction.

## Chapter 5 Planning Agenda

The next planning session should produce a Chapter 5 vertical-slice contract, not implementation or final art. It needs decisions on:

- Briarhold's map topology and infiltration route;
- whether the Captive Lanterns order is deduction, restoration, or both;
- how lantern restoration changes the boss fight;
- Bracken Voss's final identity, combat role, and escape mechanism;
- Thornseal Guard versus Thornroot Sentry encounter composition;
- how and when the player first sees Lio resisting;
- which other captives are required, optional, or represented only through evidence;
- Mara's safe physical staging during infiltration and combat;
- the Lio–Mara reunion and Lio's anger without turning rescue success into failure;
- the genuine office-material clue and the knowledgeable character who can interpret it;
- the final return to Bramblecross and the prototype's closing image.

The recommended order is: story promise and end state, interaction/boss spike, map contract, critical path, human route test, production art, presentation-contract test, full-story release candidate.
