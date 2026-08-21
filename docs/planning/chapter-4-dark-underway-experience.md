# Chapter 4 Dark Underway Experience

Last updated: 2026-08-20

Status: owner accepted the expanded multi-map pacing on 2026-08-20; route-shape differentiation and Relay prose polish implemented; placeholder art and step seams remain deferred

## Start Here Next Time

The 2026-08-13 owner playthrough accepted the lantern halo and asked for a substantially longer physical journey. On 2026-08-20 the owner accepted that expanded multi-map pacing. The Underway remains split across an approach/fork map, one exclusive route map, a convergence/ambush map, one map per listening hood, and a final approach map before the Briar Relay Post. The construction detour reads as a nearly straight modern cut, while the Old Keeper Road follows a visibly older winding line. It is introduced only by the physical closure board and is not the Folded Map's false Survey Shortcut. Movement-to-dialogue seams still need a continuity polish pass.

The original August 10 gate was to play from the Lower Gate through the Listening Mile before extending the story. The August 13 owner session closed that gate, and Lio's written-message slice is now implemented.

The first questions are experiential:

1. Does the black map make the Underway feel underground, or merely obscure information?
2. Is the lantern circle large enough to move confidently while keeping the surrounding dark oppressive?
3. At the posted detour, can the player make the choice without seeing either route on the first map?
4. Do the separate route and listening-post maps create satisfying distance without becoming repetitive?
5. Do landmarks and threats arrive at the right moment as they enter the light?

The multi-map travel length, including the final approach between Lio's note and the Briar Relay Post, is accepted. The next human focus is the Relay encounter, evidence sequence, and Chapter 5 handoff.

## Experience Direction

The Underway should feel materially different from an outdoor map or a conventional explored dungeon. Darkness is not undiscovered-map fog that permanently clears. It is the present limit of the party's sight.

- The map canvas is black outside the hero's warm lantern halo.
- The current chamber and short corridor lengths immediately ahead and behind are visible.
- Previously traveled tunnel falls back into darkness when the party moves away.
- Only nearby signs, threats, and listening posts appear.
- At a junction, the halo exposes enough of each connected passage for a fair movement choice without revealing the whole route.
- The surrounding interface remains readable; the darkness belongs to the tunnel, not to the controls.

This makes the chapter's mechanics support one another. The ambush can wait outside the lantern. The posted detour is discovered in place instead of previewed as a diagram. The listening hoods matter because the party can hear farther than it can see. Traveling between posts gives each new sound room to create tension.

## Listening Mile Pace

The three posts are separate maps with long, curved-looking but logically rightward tunnel paths.

1. At the first post, the party discovers one hood and hears the present knock of a damaged wheel with westbound footsteps. No later hood or old ambush sound is announced.
2. Control returns to the map; the player walks through darkness to the second post.
3. At the second post, the party hears unidentified voices, a cough, a jammed shutter, and a hurried scrape against bronze.
4. Control returns again; the player walks another dark stretch.
5. At the third post, the distant travelers are already fading west. Fresh bronze dust and shutter scores establish this as the earlier stopping place; Mara finds Lio's blue knot and the mark pointing to his hidden message.

The expanded graybox uses roughly nine quick rightward steps per listening map. The player still moves briskly, but each sound beat now arrives after a visibly distinct stretch of darkness. A final westbound travel map after the note is deliberately provisional.

## Writing Rule From This Conversation

Discarded prototypes belong in design notes, tests, and contracts—not in character dialogue.

Player-facing prose should describe positive, observable events. A hood carries footsteps through the wall. A cord crosses the floor. Lio's knot is hurried and familiar. Dialogue should not explain that a hood is not storing a voice, that an ambush was not exposed by a failed check, or that Lio did not build an automated device. Those comparisons make sense only to someone who watched development.

When an old implementation creates a continuity concern, solve it by making the current cause visible in the scene. Keep the rebuttal here in the development record.

## Current Implementation Notes

- `src/components/MapStage.tsx` supports a region-specific local-lantern visibility mode.
- `src/data/mapVisuals.ts` enables local-lantern mode across every Chapter 4 tunnel region and maps every curved visual segment to Right/Left navigation.
- `src/data/maps.ts` separates the fork, Old Keeper Road, construction detour, convergence, three listening hoods, and Relay approach into focused maps.
- The first map never displays the route branches. After the decision, only the chosen route exists on screen.
- The Old Keeper Road contains a one-time abandoned cache with the Old Waykeeper Helm. The construction detour contains a live construction signal rig that reveals the convergence ambush and guarantees the prepared-opening option against its larger fight.
- A neutral fitted-stone tunnel SVG replaces the modern-road diagram beneath the fog for the expanded maps; final illustrated art remains deferred.
- Chapter 4 browser coverage asserts the black cover, moving halo, intervening travel, and final trail marker.

Final Underway art remains deferred. Any production map must be judged through the lantern mask, because most of the full painting will never be visible at once during play.
