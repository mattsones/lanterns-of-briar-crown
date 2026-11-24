# Chapter 5 Art Production

[Current remaining art and batch review](chapter-5-remaining-art.md). The workshop painting is playable, and the signal platform is next in the map queue.

**November 20 interior layout review:** [Four new interior masters](chapter-5-interior-masters-v01.md) now group the remaining schematic into main-floor hub/landing/court, upper records, lower workshop and raised signal-platform crops. With the existing rescue painting this makes **five interior gameplay maps**, separate from approach/return and narrative scene illustrations. The standalone reference review includes shared floor plan, paired stair landings, navigation/clearance and lighting/state sheets at desktop and both phone sizes. The [hub closed/open pair v03](briarhold-hub-paint-v02.md) is now in the art review. The approved [records room v06](briarhold-records-paint-v02.md) is playable. The [workshop v02](briarhold-workshop-paint-v02.md) is in the walkable art review.

**Current portrait update:** the owner accepts all four [v03 review designs](chapter-5-enemy-portraits-v01.md): Bracken, Thornroot Sentry, Hearthvale elite guard v02 and the newly generated ordinary Rainroot guard v01. They await role-aware runtime portrait binding. The existing Seal-Forged Sentry's Chapter 3/4 paper-and-wax art remains its own production asset; the new root/timber Sentry is the separate Chapter 5 support.

**November 19 canonical casting:** Bracken and his elite Thornseal detail are Hearthvale humans; ordinary local guards are Rainroot humans. [Elite guard v02](chapter-5-enemy-portraits-v01.md) updates the face/complexion/hair to the established Hearthvale reference while retaining uniform, shield, ledger case, pose and room. V01 remains historical; a distinct ordinary Rainroot guard asset is still needed. Bind art by personnel role/encounter context when promoting it, because several fights currently share the same guard mechanics template.

**November 18 portrait batch:** [Bracken, Thornseal Guard and Thornroot Sentry candidate v01 portraits](chapter-5-enemy-portraits-v01.md) are generated, with full prompts/native sources and desktop/phone battle-card review. They remain reference candidates and are not in the running game. Review their designs before using them as the cast reference for confrontation scenes or promoting their portrait derivatives.

**November 18 runtime update:** the accepted approach v05 and paired rescue-room v02 paintings are now [integrated into the game](chapter-5-painted-map-integration.md), with measured walking points, frame sizing and state overlays. Next is owner map review, the remaining five map masters/paintings, cast/enemy art and the room/long-narrative scene queue. The November 13 production sequence below is retained as provenance; its reference-only status is superseded for these two maps.

Status: the owner accepted the playable Chapter 5 greybox for artwork on **2026-11-13**, following the narrative playtest and the exact-checkpoint boss-balance correction, then accepted the first Briarhold scale/lighting masters and authorized approach painting. Finished art/runtime promotion remains pending.

**Update:** the owner subsequently accepted the first Briarhold masters and authorized approach painting. [Paint candidate v05](briarhold-approach-paint-v01.md) is now in the offline review. His two painting corrections are authoritative: natural wet runoff into the culvert, no maintained lower trail; abandoned shelter farther off the road across an unmarked uphill scramble. The master pack's revision 2 matches those changes. Finished art/runtime promotion remains pending.

**Rescue layout correction:** revision 3 puts the inspection grille north/above entry E. The party looks through it before passing the doorway, returns to E, then approaches the entrance. Lio/cuff, brake assembly and first step have clear views through the aperture; the table shifts slightly north to preserve them. Use this updated master for rescue painting, not the earlier grille position below the entrance. The approach painting remains v05.

**Rescue paint candidate ready:** [closed/open paint v02 and a separate painted cart](briarhold-rescue-paint-v01.md) are now in the review. Revision 4 removes the floor strips/rails at the owner's direction. Ordinary uneven paving reaches the loading steps; amber light reveals footing, step edge and brake. Do not reintroduce a track-to-stairs mechanism. Bracken's Sabre and the post-gathering court rest are now implemented; reserve their loot/party presentation as state layers rather than baking it into backgrounds.

**First master pack accepted:** [Briarhold masters v01](chapter-5-masters-v01.md) includes the coordinated site/floor plan, approach and rescue-room scale masters, night/guide-lamp variants, editable geometry and a standalone review page. Desktop and both phone frame checks pass. Revision 2 incorporates the subsequent runoff/shelter corrections. These are reference compositions, not registered game maps.

This is the production handoff from the accepted game to its illustrations. Preserve the current story, routes, checks, companions, rescue, evidence, return, and ending. The authority for behavior remains [the executable contract](../story/chapter-5-vertical-slice-contract.md); visual style follows [art direction](art-direction.md) and [enemy cohesion](../planning/enemy-cohesion-pass.md).

## Production Order

1. Make a coordinated Briarhold site/floor-plan sheet, then the individual map scale/lighting masters. Establish architecture, room connections, sightlines, light channels, and the rescue geometry before painting them separately.
2. Review masters in the actual desktop and phone map frames, with token size, controls, triggers, labels, and representative lighting overlays. The approved greybox is a topology contract; its compact diagram coordinates are not an approved physical scale.
3. Paint one accepted map at a time and immediately inspect it beneath the same navigation and lighting overlay. Fix alignment before producing the rest of the set.
4. Produce character/enemy portraits and the selected story scenes against the established cast and architecture. Portrait work can proceed alongside map layouts; final boss-room and rescue illustrations depend on the accepted room master.
5. Promote optimized runtime assets, retain source masters and fallbacks, then complete the illustrated release-candidate review.

The next concrete review pack is **Briarhold site/floor plan + Outer Approach master + Crown Table/rescue master**. Together these settle the exterior entrances, interior continuity, guide-lamp light path, and climax before the remaining room masters inherit them.

## Shared Visual Contract

- Hand-painted storybook fantasy, warm material texture, practical old road infrastructure, and readable walkable space. Briarhold feels occupied and threatening without becoming grimdark.
- Honest amber oil light and cool forest/night shadows contrast with green-glass Briar work lights. The guide lamp is an ordinary oil lamp with fixed amber glass, a reflector, and a deliberately bound shutter.
- Maps remain skins over tile/node movement. Preserve keyboard and pointer behavior, explicit interactions, and emoji/text fallbacks.
- Keep labels, selectable markers, puzzle symbols, exact documents, and stateful people in overlays where appropriate. Do not bake an answer, a freed captive, a player token, or a permanent alert state into a background.
- Use the existing Mara, companions, Lio, Enna, Hollis, Anwen, and Quill references. Preserve faces, silhouettes, costumes, scale relationships, and the established four-card battle layout.
- The party consists of hero, selected companion, and Mara. Mara is not a combatant. Lio is a recovering story companion after rescue. Celia was transferred earlier and is never an extra present captive.

## Map Queue

The seven IDs below are declared in `CHAPTER_5_CONTRACT.maps`; they are not yet registered painted runtime maps. Bramblecross is reused.

| Planned map | Required composition and interaction landmarks | State and lighting requirements |
|---|---|---|
| `briarholdApproach` | Ridge crossing, discoverable uphill roadworkers' shelter, route to the receiving gate, unloading wagon, lower runoff trail, service culvert. Both entrances reach the established service landing. | Same night as the Relay. Gate light exposes the final approach; the runoff stays below the guards' lamps. The shelter provides concealed surveillance and the one recovery pause. Grate closed/open/wedged states need an overlay or bounded variant. |
| `briarholdHub` | Recessed service landing; dark cover behind the square pier and tally rack; upper records partition; lower workshop doorway; stair connection; guarded inner entrance; sheltered service court for gathering the rescued party. | Preserve the searching-lamp and timber-load passages, including space to hide/cross. Closed guide lamp leaves concealment; opened guide lamp lights the stair/junction. Guard-post and post-boss states must read correctly. |
| `briarholdLedger` | Crate cover before desk access; officer and cuffed clerk; receiving tally distraction; copying bench; fixed chart; locked drawer. | Desk details become readable after access. Clerk/officer, drawer, originals, and spare key are stateful. Exact chart/document text belongs in the UI, not generated microtext. |
| `briarholdWorkshop` | Screened recess behind the cooling rack; press with cuffed Orren; supervisor's work/alarm position; bench, shim, stamp chest, and mechanical feed; outer door to the quenching trough. | Distinguish work, temporary diversion, secured supervisor, and freed Orren. A diversion does not permanently empty the workshop. Tools/evidence/feed states remain independent. Do not leave a painted worker behind after rescue. |
| `briarholdLanternHall` | Three signal lamps and pane racks; explicit transmission control; separate amber guide lamp and bound hinge; outward yard opening; inward guard-post opening. | Panes/symbols and their 64 arrangements remain exact interactive overlays. Opening the guide lamp illuminates the stair/junction and a deeper shaft to the boss room. Preserve light-versus-shadow exposure and the platform's two distinct sightlines. |
| `briarholdCrownTable` | Mandatory inspection grille; entrance console sheltering Mara; route table; room for the encounter; Lio's low wooden cart, writing board, cuff and brake; downhill doorway and steep stone loading steps; reachable stopping space; Bracken's separate escape door; adjoining cells. | The danger must be legible before the release: Lio cannot jump clear, the cart heads toward the steps, and pursuit competes with rescue. Amber light reveals uneven footing, the step edge and the brake. Stopped cart, opened cuff, collapsed Sentry, escape door, and cleared cells need state treatment. |
| `rainrootReturn` | Dawn departure; long eastward ridge; woodsman's clearing; fork into the safe high trail or tusker hollow; two distinct branches; reconvergence; approach to Bramblecross. | Convey dawn-to-afternoon distance, not a short walk across the yard. Two territorial tuskers are ordinary wildlife. Both branches reach the same return conversation. No accidental shortcut between branches or painted encounter after it is cleared. |

## First Master: Briarhold As One Place

Before composing separate rooms, the site/floor-plan sheet must reconcile:

- the uphill shelter's view of the gate, work window, runoff, and signal openings;
- the receiving entrance and the culvert reconverging at the same sheltered landing;
- the upper records room, lower press room, and raised signal platform around the central hub;
- the platform's separate views toward the receiving yard and the inner guard post;
- the amber light channel branching to the stair/junction and continuing into the boss room;
- the inspection grille showing Lio, his cuffed wrist, the cart brake, and the slope/steps;
- Mara's substantial combat cover, the hero's route to the cart, and Bracken's reachable but separate escape door;
- the adjoining cells and the service court used before the eastward departure.

The current interior graph contains `hub → workshop → lanterns → door` as well as `hub → door`. Do not accidentally paint an additional traversable `hub → lanterns` shortcut. The stair and room thresholds must make that accepted connection intelligible.

The cart is the current accepted rescue model. Do not revive the earlier transfer-shutter/siding machinery or paint Lio beneath a different runaway cart. He is seated on the cart, one wrist cuffed to it, when Bracken releases its brake.

## Master Sheet Requirements

For every map, provide a clean composition and a separate inspectable overlay with:

- exact aspect ratio and source dimensions; use the established 1600–2048 px production width and verify the selected aspect in the real frame;
- all walkable centerlines, interaction anchors, entry/exit points, and any intermediate travel nodes required by the production navigation graph;
- forward/backward arrow aliases at junctions and thresholds, with no accidental walk-through connections;
- token diameter and clearance from every wall, prop, edge, and encounter trigger;
- first-visit, changed-state, one-shot, puzzle, combat, rescue, and departure trigger boundaries;
- party-centered lantern footprints at representative positions, fixed-light areas, occluders, and guide-lamp closed/open states;
- required visible landmarks and deliberate concealment/knowledge boundaries;
- UI-label/overlay-safe areas and the desktop 1280×720, phone 390×844, and phone 430×932 display frames;
- a state inventory specifying which changes use overlays, existing UI, or a separate background variant.

Required checks include first arrival, a mid-path step, every junction, backtracking, a changed scene, and map-debug off. A logical edge list alone does not establish that the token sits on the painted path.

## Portrait And Encounter Queue

| Asset | Direction and reuse |
|---|---|
| Bracken Voss portrait/combat crop | Hearthvale human heritage. Ink-stained cuffs, practical road-office authority, controlled expression, weapon close under his coat. A regional cellmaster controlling records and machinery. Match the existing enemy-cohesion direction. |
| Elite Thornseal Guard | Hearthvale human heritage, part of Bracken's imported elite detail. Living disciplined guard, shield and ledger/official-work language; v02 is owner-accepted. Distinct from the earlier paper-and-wax Seal-Forged Sentry. |
| Ordinary local guard | Rainroot human heritage; locally recruited station personnel. Local guard v01 with round buckler/spear is owner-accepted. Select by role rather than globally reusing the Hearthvale elite portrait for `thornseal_guard`. |
| Thornroot Sentry | Root/timber portrait v01 is owner-accepted. Bound-root construct, braced joints, mechanical feed connection. Its damaged brace and disconnected-feed payoff must match the room. Keep the earlier Chapter 3/4 Seal-Forged Sentry as its own enemy/art. |
| Rainroot Tusker | Natural territorial animal. No faction uniform, magical corruption, or carried evidence. Two animals share the encounter. |
| Orren Pike, Sella Reedmere, Hesta Brookward | Establish adult identities and costume references from their current roles before portrait generation. Keep each recognizable at release, gathering, and homecoming. |
| Dessa and Garrick | Use their observed work and current introductions; names remain earned in the game. Dessa is the press supervisor/sealwright; Garrick is the practical woodsman. |
| Rescued Lio variant | Reuse `lio-brindle-portrait-v02.webp` as the identity reference. A recovering, tired courier with cuff/sleeve wear; preserve his face and relationship to Mara. Existing art remains available where appropriate. |

Reuse established portraits for returning cast. These are production candidates, not a requirement to replace every existing portrait.

## Story Scenes, Props, And UI

**Owner direction for the next art pass:** provide scene art for most Briarhold interior rooms and for long narrative passages, including the journey and ending. [The room-by-room scene-art plan](chapter-5-scene-art-plan.md) lists establishing views, important changed states, existing-art reuse, cast continuity and the wider Chapters 1–5 long-narrative audit. The new sabre pickup and service-court rest are now implemented; both need appropriate state/scene art alongside the maps.

- Prioritize the first grille sight of Lio, the cart rescue/immediate reunion, and Bramblecross's public welcome. The safe court conversation and private case wall are separate emotional/evidence beats; review existing illustrations for reuse before commissioning replacements.
- The homecoming specifically quiets when Lio needs to sit. Avoid staging an energetic, fully recovered Lio in that moment.
- Keep all four present captives consistent across room states and the gathering scene. The nearer cell in new saves holds a prepared bundle, while Orren is rescued from the workshop; support the legacy cell-rescue state without duplicating him.
- Preserve the fixed chart and red triangle / blue circle / green square / amber star as precise UI/vector assets. The amber guide lamp is separate from those four signal-pane choices.
- Evidence icons should follow the implemented item definitions: chipped official die/True Seal Fragment, worn restraint link, transfer ledger, original office instruction, seal-material bundle, and the examiner transfer record. Exact written evidence remains readable UI content.
- Review the existing Briarhold ledger-reveal scene and Lio's Courier Knot icon for continuity and reuse. Do not regenerate accepted Chapter 4 art merely to begin Chapter 5 production.

## Asset Delivery And Verification

Follow [the asset manifest](asset-manifest.md): keep concepts/masters under `assets/reference/`, promote only selected optimized derivatives, and preserve every source and fallback. Opaque maps/portraits/scenes use WebP or AVIF derivatives; alpha assets retain a suitable transparent format. Do not put an unused generation in a runtime production folder.

For each integrated map, repeat the schematic checks with the selected painting beneath the same overlay. Then run the affected chapter suite, build/rules checks, and the production asset audit. The established complete Chapter 5 paths and the owner's exact alerted checkpoint must remain playable.

The later illustrated release candidate still needs desktop/phone review, the uninterrupted Chapters 1–5 human playthrough, and the full automated gate, including the previously deferred Chapters 1–4 regressions. The owner's artwork greenlight closes the greybox review gate; it does not claim final illustration alignment or release-candidate signoff.
