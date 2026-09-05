# Chapter 4 Rootwater And Wildlife Pass

Date: 2026-09-01

## Accepted Changes

- Rootwater's natural blue-green luminosity now reveals the painted river through two artwork-shaped fog masks at `0.48` darkness opacity. There is no cyan overlay or broad artificial glow.
- The **Beyond the Old Keeper Road Shutter** and **Rootwater Bridge** dialogues are one-shot story beats. Backtracking across either node does not reopen its dialogue.
- The first Underway approach now contains a required natural-wildlife encounter before the Posted Detour.
- The encounter fields two 10-HP Tunnel Rats and one 22-HP Root Gnawer. It is a short territorial fight, explicitly unconnected to Briar collars, thorns, false marks, or corruption.
- The Root Gnawer blocks the route until the encounter is cleared. Victory drives the animals back into their den, hides the map threat marker, awards 16 XP and a recovered sealed trail packet, and advances the objective to the Posted Detour.
- Existing saves already at or beyond the detour infer the wildlife encounter as cleared. Existing Rootwater and downstream saves infer the one-shot dialogue state from their position and progress.

## Art

- `assets/portraits/enemies/tunnel-rat-v01.webp`
- `assets/portraits/enemies/root-gnawer-v01.webp`
- Full generated sources are preserved under `assets/reference/source-art/assets/portraits/enemies/`.
- The Root Gnawer uses a dense ancient-root den with no visible river and no physical lantern; its warm light comes from the party outside the frame.
- Reproducible built-in ImageGen prompts are recorded in `docs/art/prompts/chapter-4-underway-wildlife.md`.

## Chapters 1–3 Wildlife Audit

- **Chapter 1:** Do not add another required animal battle. The Bramble Boar and Rustroot Skulk already give the chapter two major creature silhouettes, alongside the Lantern Road fight and cellar boss. The pond, ruins, and shrine benefit from remaining exploration and recovery beats.
- **Chapter 2:** The Westroot Trail is the only plausible earlier location for unaligned wildlife. If a later pacing pass wants one, use a short optional encounter off the false-detour branch or replace an existing minor Crown Den pressure beat; do not add another required fight to the current Roadwatcher-plus-den sequence.
- **Chapter 3:** Do not add one. Westroot's civic hub, Hold Bell, Witness Stones, and cargo investigation need social and political pacing rather than a natural-animal interruption.

Chapter 4 is therefore the best first clean example of hostile wildlife that is neither a Briar enemy nor a Briar-controlled animal.

## Verification

- `npm.cmd run build` passed.
- `npm.cmd run test:rules` passed: 50 tests.
- `npm.cmd run playtest:chapter4` passed: 14 tests.
- `npm.cmd run audit:assets -- --limit=10` scanned 172 production images; both new portraits are within the documented portrait targets.
- Live browser QA confirmed the three-enemy battle layout, both Tunnel Rat cards, the distinct Root Gnawer card, readable intent text, and production art loading without fallback.
