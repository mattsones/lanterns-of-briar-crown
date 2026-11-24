# Chapter 5 — direct movement from scenes

The owner reports that the constant **Back to the path** buttons interrupt gameplay. They were a greybox scene-lock mechanism: ordinary open narration disabled map movement until explicitly closed. The chapter now acknowledges an ordinary scene when the player walks away, without a separate return action.

## Current behavior

- Click an adjacent map landmark or use arrows/WASD/the direction buttons directly from an ordinary scene. Existing scene-history fingerprints record the presented scene before departure; unchanged revisits remain quiet and Inspect can reread them.
- Ordinary scenes keep their map visible on phones. Direction controls appear after the scene text/actions while a scene is open, and below the map otherwise. There is one controls group, and no generic Back button. Escape remains an optional way to dismiss an ordinary scene.
- The opening still requires the silent climb. An investigating guard, pending hub stealth choice, unacknowledged first sight of Lio, pending fight and incomplete rescue retain their authored locks. Movement does not replace any of their actual decisions.
- Leaving a distracted records officer still abandons the temporary opportunity and applies its existing awareness consequence exactly once. An invalid direction does not dismiss the scene or abandon the distraction.
- Lantern select/input keyboard controls and modal/menu blocking retain priority over map movement. Captive, evidence, rest, return-conversation and homecoming gates remain in their existing transition functions.
- The change adds no save fields or rewards. Named nodes, physical waypoints and existing checkpoints remain compatible.

`canLeaveChapter5Scene` and `leaveChapter5Scene` in `chapter5Runtime.ts` provide the bounded policy. `chapter5Map.ts` applies it before the same checked movement routes; the underlying story transition stays strict. `Chapter5Spike.tsx` and `Chapter5PaintedMap.tsx` expose the active map and direction controls without the routine dismissal button.

The focused phone exploration and mandatory-choice cases pass, alongside seven movement rule cases. Final affected checks pass: build, all 104 rules, all 58 Chapter 5 cases, smoke, the 175-image asset audit and `git diff --check`. The first development smoke was interrupted by a Vite reload during reference-file edits; a fresh stable-files run passed without code/test adjustment. The complete Chapter 5 run used a stable production preview. See [the current handoff](../codex-handoff.md). A reviewed phone capture is saved at `assets/reference/concept/environments/chapter-5-runtime-integration-v01/ch5-walk-without-back-phone.png`. The broader Chapters 1–4 engine is not changed by this chapter-specific behavior.
