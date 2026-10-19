import { isCompanionConscious } from "../game/companions";
import type { Chapter5SaveState } from "../game/chapter5Runtime";
import type { Companion } from "../game/types";
import { hasChapter5Visited } from "./chapter5Knowledge";

export function getChapter5HallwayParagraphs(s: Chapter5SaveState, companion?: Companion): string[] | null {
  if (!s.hubInterlude) return null;
  const wary = s.briarhold.alert === "suspicious";
  const companionBeat = !isCompanionConscious(companion) ? "" : s.hubInterlude === "lamp" ? {
    rowan: "Rowan turns his shield edgewise and lowers it into the shadow against his leg. The leather strap gives a tiny complaint as he takes its weight; he closes his hand over the buckle and holds it still. His other arm rests behind Mara, keeping her below the gap through which the lamp is climbing.",
    tilda: "Tilda catches the loose end of Mara's courier knot before it can hang beyond the pier. She folds it beneath Mara's cuff with two slow movements, then lays a finger across her own bright buckle. Her gaze stays on the light while the foreman shifts his papers.",
    moss: "Moss slips his hand beneath the warped bottom of a supply basket as Mara leans against it. Its wicker starts to settle toward the paving; he takes the weight before the rim can scrape. You can see the effort in his fingers while the lamp moves across the stones.",
  }[companion.id] : {
    rowan: "Rowan draws Mara into the narrow recess beside his shield. He watches the long box come level with the pier, measuring the space it leaves against the wall. When the bearers stop, he stops breathing through his mouth and lifts a hand to keep everyone still.",
    tilda: "Tilda follows the bearers' feet rather than the swaying lamp. She touches your sleeve each time the nearer man plants his heel, matching the knocks of the load to the floorboards. When both men settle their weight, her hand closes and holds you where you are.",
    moss: "Moss presses a palm against the pier, feeling each heavy step through the old masonry. He draws Mara clear of a loose floorboard with a touch at her sleeve, then points to the stone strip along the wall where your boots can land without making it flex.",
  }[companion.id];
  if (s.hubInterlude === "lamp") return [
    `${s.briarhold.lanternsRestored ? "Steady amber light lies across the junction when the iron catch of the receiving hatch lifts. A brighter bar from a hand lamp moves across the paving ahead of your boots." : "You are almost back around the central pier when the iron catch of the receiving hatch lifts. A narrow bar of light slides across the floor ahead of your boots."} You catch Mara at the elbow and draw her into the pocket between the pier and the stacked tally boards, turning sideways to give her room against the stone.`,
    `The receiving foreman pushes the hatch wider with his shoulder. He has a lamp in one hand and a bundle of tally slips in the other; their edges rasp together while he searches for a number. His light passes over ${hasChapter5Visited(s, "ledger") ? "the records stair" : "the upper stair"}, drops beneath the landing rail, and begins to climb the base of the pier. Mara presses the back of her hand against her mouth. In the little space beside you, every buckle and fold of cloth seems suddenly loud.`,
    wary
      ? "“Who changed this count?” the foreman calls. “The escort gets one sealed packet for each road post.” He waits for an answer, looking farther into the hall than his papers require. You ease your heel away from a loose board while his lamp rests against the corner of the pier. From the yard, someone begins counting packets aloud; the foreman keeps listening for a moment before looking toward the voice."
      : "“One sealed packet for each road post. Count them again,” the foreman calls toward the yard. He tilts his lamp to read a wet entry, leaving its light steady against the corner of the pier. You watch his thumb move down the column while Mara keeps her shoulder against yours. From beyond the hatch, the driver's count starts over. “Before first light,” the foreman adds. “Voss won't hold the escort for your sums.”",
    companionBeat,
    "Lamplight rests on the pier's outer face while you hold still in its shadow. You keep your weight against the stone and wait for the foreman's attention to follow the voices back into the yard.",
  ].filter(Boolean);
  return [
    "A tremor reaches your boots as you return to the junction. Two yardhands are carrying a long timber case through the outer service passage, one walking backward while the other calls the turns. Its loose lid exposes folded canvas and the hinged edge of a wooden screen. “Escort wagon,” the rear man tells his partner. “Keep the hinges uppermost.” You draw Mara behind the tally rack before the nearer man's shoulder clears the corner. The case passes close enough to the pier that its iron binding almost brushes the stone.",
    `Halfway through the turn, the bearers stop. One shifts his grip with a sharp breath; the other lowers his end onto a knee while he pulls a trapped glove out from beneath the handle. Their lamp swings from the case, sending its shadows across the wall behind you. ${s.briarhold.lanternsRestored ? "The steady guide light catches a pale strip of Mara's cuff beside the rack. She folds her arm against her chest and draws deeper behind the tally boards." : "A pale strip of Mara's cuff shows beside the rack. She folds her arm against her chest and watches the light come back."}`,
    s.workshopResolved
      ? "With the stamping press quiet, you can hear the nearer man's sleeve drag over the timber. From the receiving passage the foreman calls for the screens to be fitted before first light. One bearer mutters that Captain Voss can carry the next case himself. The foreman makes him repeat the words, and for a few breaths the whole passage waits."
      : `${hasChapter5Visited(s, "workshop") ? "The workshop press lands below you" : "Another heavy blow lands in the lower workroom"}, making the loose tally boards shiver against your coat. The foreman calls through the outer passage: the screens must be fitted and the sealed packets aboard before Captain Voss brings the prisoners out. The nearer bearer nods toward the load, waiting for the next blow before lifting his end.`,
    companionBeat,
    "When the men lift again, their boots and the case's loose iron bands will cover a few careful steps to the wall recess. You can move with that noise, or keep the rack between you and the lamp until the load has passed.",
  ].filter(Boolean);
}

export function getChapter5HallwayOutcome(interlude: "lamp" | "load", response: "wait" | "cross"): string {
  if (interlude === "lamp") return "You stay against the pier while the foreman makes a mark across his tally. His lamp dips toward the papers, then turns away. Only after the hatch shuts do you ease your hand from Mara's sleeve. She draws a slow breath through her nose and looks up at you, her eyes still following the bright shape the lamp left across the stones. Together you move along the sheltered side of the pier toward the next passage.";
  return response === "cross"
    ? "The bearers lift together. As the timber case knocks against its iron bands, you step onto the stone strip and bring Mara across behind you. Her fingers tighten around your wrist when the nearer man turns his head; you stop with her inside the wall recess while he looks back along the load. He calls the next turn, and both men carry on. You wait until their lamp has rounded the outer bend before loosening your grip."
    : "You hold the tally rack steady while the bearers get the case moving again. Their lamp swings toward you once more, catching the outer edge of a board while you and Mara remain pressed behind it. The long box clears the pier, followed by the nearer man's dragging boot. You count the next few steps until the sound passes beyond the bend, then guide Mara out along the wall. Her hand stays in yours until you reach the shelter of the next doorway.";
}
