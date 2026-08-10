# Chapter 4 Dark Underway Experience

Last updated: 2026-08-10

Status: first playable lighting pass implemented; owner conversation and human feel-check are the first starting point for the next Lanterns session

## Start Here Next Time

Begin the next Lanterns session by returning to the August 10 conversation about the Underway as a tunnel swallowed by darkness. Play from the Lower Gate through the Listening Mile and discuss the feel of the lantern halo before extending the story into Lio's written message.

The first questions are experiential:

1. Does the black map make the Underway feel underground, or merely obscure information?
2. Is the lantern circle large enough to move confidently while keeping the surrounding dark oppressive?
3. At the posted detour, can the player understand both adjacent routes without seeing the full topology?
4. Does walking between three separate listening posts create anticipation, or does it need more distance or a small event between posts?
5. Do landmarks and threats arrive at the right moment as they enter the light?

Do not begin the Lio-message scene until this conversation and playthrough have happened. The Listening Mile's ending can move after the tunnel experience is tuned; building beyond it first would make that adjustment more expensive.

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

The three posts are separate navigation locations with ordinary tunnel between them.

1. At the first post, the party hears the cleared shutter behind and westbound boots ahead.
2. Control returns to the map; the player walks through darkness to the second post.
3. At the second post, the party hears its own receding steps behind, then boots, chain, and a stiff inspection shutter ahead.
4. Control returns again; the player walks another dark stretch.
5. At the third post, Mara finds Lio's quick blue knot and the scratch pointing to his hidden message.

The current graybox uses two quiet navigation steps between posts. That is deliberately modest. The next human playthrough should decide whether the space needs lengthening, a visual landmark, a companion line, or simply more silence.

## Writing Rule From This Conversation

Discarded prototypes belong in design notes, tests, and contracts—not in character dialogue.

Player-facing prose should describe positive, observable events. A hood carries footsteps through the wall. A cord crosses the floor. Lio's knot is hurried and familiar. Dialogue should not explain that a hood is not storing a voice, that an ambush was not exposed by a failed check, or that Lio did not build an automated device. Those comparisons make sense only to someone who watched development.

When an old implementation creates a continuity concern, solve it by making the current cause visible in the scene. Keep the rebuttal here in the development record.

## Current Implementation Notes

- `src/components/MapStage.tsx` supports a region-specific local-lantern visibility mode.
- `src/data/mapVisuals.ts` enables that mode only for the Underway, uses a black fog cover, and reveals the hero plus immediately connected path segments.
- `src/data/maps.ts` separates the Listening Mile into three posts with tunnel nodes between them.
- The Underway graybox SVG places the three hoods along the extended westbound road.
- Chapter 4 browser coverage asserts the black cover, moving halo, intervening travel, and final trail marker.

Final Underway art remains deferred. Any production map must be judged through the lantern mask, because most of the full painting will never be visible at once during play.
