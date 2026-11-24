# Briarhold approach — first painted candidate

**Runtime update, November 18:** the selected v05 derivative is now [integrated into the game](chapter-5-painted-map-integration.md). This document retains the November 13 generation/reference provenance below; its earlier reference-only runtime status is superseded.

Produced 2026-11-13 with the **built-in imagegen tool** against the owner-approved site/approach/lighting foundation. Current candidate: **paint v05**. The owner reviewed the generated work during this session and corrected two physical details: the culvert approach is wet natural runoff, not a maintained path; the abandoned shelter should sit farther off the road. Those corrections are implemented in the painting and in revision 2 of the shared master geometry. No runtime map or gameplay is changed.

## Review and saved files

- [Painting, normalized full-size PNG](../../assets/reference/concept/environments/briarhold-approach-paint-v01/briarhold-approach-paint-v05-2048.png)
- [Optimized reference WebP](../../assets/reference/concept/environments/briarhold-approach-paint-v01/briarhold-approach-paint-v05-2048.webp)
- [All ten navigation anchors under the painting](../../assets/reference/concept/environments/briarhold-approach-paint-v01/painted-node-alignment-v05.png)
- [Offline review page](../../assets/reference/concept/environments/chapter-5-masters-v01/briarhold-review-v01.html?view=approach&clean=1) — toggle **Approach painting v05** to compare geometry, then enable routes, clearance and lighting footprints.

The development review is `http://127.0.0.1:5185/assets/reference/concept/environments/chapter-5-masters-v01/briarhold-review-v01.html?view=approach&clean=1`. The standalone HTML embeds the candidate WebP for offline use.

All generation outputs, full prompts, input references, revised geometry references and export metadata live in `assets/reference/concept/environments/briarhold-approach-paint-v01/`. No generation remains solely in the tool's default directory. Native output is 1672×941; the 2048×1152 exports normalize the whole image without a crop. The approximately 0.05% aspect difference is negligible registration scaling; upscaling does not add detail. The quality-90 WebP is **334,964 bytes**. This reference derivative has not been promoted to `assets/maps/`.

## Final direction and corrections

The maintained road enters farther down the left edge and continues to the exposed receiving gate. The ruin moved about 2.8 m west in the shared plan. Rough, overgrown uphill ground separates its open side from the road; arrival is an unmarked silent scramble. The generous empty shelter floor, thin north wall cap and large south opening remain clear for the hero's marker.

Below the road, a shallow irregular streambed carries water, wet silt, moss and slick stones toward the culvert. There is no dry parallel trail or constructed chain of stepping stones. Movement points represent accessible muddy banks/shallow patches, not a visibly maintained route. The retaining wall and service terrace remain above that drainage.

The receiving gateway is visibly open through the station facade. Its ordinary amber lamp exposes the final gate approach, while the smaller work window has a separate dim spill. The culvert stays dark and unbarred in the painting so its closed/open/wedged grate can remain a state overlay. No party, guards, player halo, UI, labels or puzzle answers are painted into the background.

The painting includes fixed night values. In the review, **Light footprint overlay** compares the master light areas and representative party halo; it does not apply a second darkness mask. It is a design comparison, not a new runtime lighting implementation.

## Prompts and provenance

| Pass | Full saved prompt | Role |
|---|---|---|
| v01 | [prompt-v01.md](../../assets/reference/concept/environments/briarhold-approach-paint-v01/prompt-v01.md) | Initial paint from clean approved fixed-light master; Westroot trail style, Briar Relay night/material reference |
| v02 | [prompt-v02.md](../../assets/reference/concept/environments/briarhold-approach-paint-v01/prompt-v02.md) | Open receiving gateway, reduce shelter back-wall projection, remove fixed culvert bars |
| v03 | [prompt-v03.md](../../assets/reference/concept/environments/briarhold-approach-paint-v01/prompt-v03.md) | Shelter back-wall clearance correction |
| v04 | [prompt-v04.md](../../assets/reference/concept/environments/briarhold-approach-paint-v01/prompt-v04.md) | Owner correction: replace lower footpath with wet natural drainage |
| v05 | [prompt-v05.md](../../assets/reference/concept/environments/briarhold-approach-paint-v01/prompt-v05.md) | Owner correction: shelter farther uphill/off-road; remove maintained spur; preserve wet runoff |

The initial master geometry is preserved as `layout-before-owner-corrections.json`. The current master is still the v01 review pack, with `revision: 2` identifying these owner-requested changes. Node IDs, gates, both landing transitions, right-side station/rescue geometry and gameplay remain intact. The shelter and first scramble coordinates move with the painting; the scramble waypoint sits slightly lower to keep its diagonal clear of the ruin corner.

## Checks and remaining gate

`node scripts/build-chapter5-approach-paint.mjs` prepares the reference exports, revised source guides and ten-node alignment sheet. `node scripts/build-chapter5-masters.mjs` passes model checks at all three frames and every movement-edge sample; the revised approach's minimum model/shadow clearance is **0.263 m**, versus the required 0.2 m. The rescue room remains at 0.215 m. `node scripts/check-chapter5-masters.mjs` passes six frame/view browser combinations and confirms that the paint is actually selected, can switch back to geometry, remains embedded offline, and receives no duplicate night mask. Exact widths/marker sizes, aliases/backtracking, clean view, stage changes, no browser errors and no horizontal overflow still pass.

The all-node sheet and browser desktop/phone captures have been visually reviewed. Anchor feet remain on the intended road, ruin floor, rough scramble or shallow drainage, rather than on a new wall or an invented path. Pixel-perfect painted collision segmentation is not automated; irregular moss/stone edges and the floating marker still need owner visual review before runtime promotion. Existing gameplay regression results are unchanged; this art-only work did not rerun or claim a new full game gate.

Next: owner review of the corrected painting, then any material/contrast polish and bounded runtime integration with the approved movement graph and state overlays. Rescue-room painting remains separate work.
