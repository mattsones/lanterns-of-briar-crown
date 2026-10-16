import { isCompanionConscious } from "../game/companions";
import { getChapter5AftermathParagraphs } from "./chapter5Aftermath";
import { checkSummary } from "../game/dice";
import type { BriarholdState } from "../game/chapter5";
import type { Chapter5BattleKind, Chapter5Node, Chapter5SaveState } from "../game/chapter5Runtime";
import type { Companion, SkillCheckResult } from "../game/types";

type CompanionBeat = "approach" | "entry" | "workshop" | "ledger" | "light" | "grille" | "crown" | "secure" | "reunion";

export function chapter5CompanionBeat(companion: Companion, beat: CompanionBeat): string {
  if (!isCompanionConscious(companion)) return beat === "secure"
    ? "You plant your shoulder against the iron frame while Mara stays beside Lio, keeping his hands clear of the wheel."
    : "";
  const lines = {
    rowan: {
      approach: "Rowan kneels far enough behind the broken wall that his shield catches no light. He watches the receiving guards change places, then touches the edge of your sleeve. “We can reach the drainage stones without crossing their lamps. Whatever way we go, Mara stays between us.”",
      entry: "Rowan eases his shield past the landing rail, wrapping its rim in his cloak before it can scrape the stone. His eyes move from the workers' doors to the inner guards. “Keep the wall at your shoulder. If someone comes around a corner, let me meet him first.”",
      workshop: "Rowan settles against the wall behind the cooling rack, holding his shield clear of its loose trays. When the woman's next correction sends the laborer hurrying back to the press, he leans close enough to whisper. “He looks at her before every move. We need to get his attention while she is looking down.”",
      ledger: "Rowan settles behind the crates with his shield turned edgewise so it cannot reflect the desk lamp. He watches the officer's chair and the short chain at the woman's wrist. “We get him away from her first,” he murmurs. “Stay under this cover until he turns.”",
      light: "Rowan holds the loose cover against his shield while you settle the lamp's shutter against its stop. Warm light reaches the lip of the shaft, picking out old brass fittings in the stone. “Leave it open,” he murmurs. “We could use a clear view of where we are putting our feet.”",
      grille: "Rowan notices Mara leaning toward the opening and steadies her with a hand at her shoulder. He keeps his voice low enough that it barely reaches you. “He sees us. Give him a moment to choose his next move.”",
      crown: "Rowan moves to your left, turning his shield toward the Sentry's knotted arms. “Stay there, Mara,” he says softly, keeping his eyes on the table. He sets his boots at the edge of the alcove, ready to cover your first step into the room.",
      secure: "Rowan catches the far side of the carriage before its weight can turn across your knees. His boots slide a handspan on the rail bed; he sets them again against the stone brace. “I have this side. Find the brake.”",
      reunion: "Rowan retrieves his shield without taking his eyes off Bracken's escape passage. When Mara looks up, he gives her a small nod. “Your brother is here. Take a breath. I will watch the door.”",
    },
    tilda: {
      approach: "Tilda counts the receiving guards' turns on her fingers, stopping whenever a wagon blocks the view. “They look at the bundles, then the tally, then each other,” she whispers. “Very thorough. We should aim to be none of those things.” She slips her bright buckle beneath her coat before moving closer to the ridge.",
      entry: "Tilda peers around the landing post and draws back before a guard can turn. “Records upstairs, stamps downstairs, important men behind the expensive door.” Her smile fades as a captive's pen scratches across a page. “Let us see how much of that importance depends on everyone doing exactly what he is told.”",
      workshop: "Tilda draws her coat away from a projecting tray and peers through the cooling rack. The woman sends another plate back beneath the press without lifting her eyes. “She has time to be particular about wax,” Tilda murmurs. “I wonder how particular she will be when her helper stops helping.”",
      ledger: "Tilda lowers herself behind the storage crates, drawing her sleeve clear of a loose nail. She watches the officer tap his ruler beside the woman's chained hand. “He seems very concerned about the count,” she whispers. Her eyes shift toward the hanging receiving tally. “Let us give him one somewhere else.”",
      light: "Tilda gathers the broken briar stems in the cloth and sets the bundle beneath the rack. She looks from the freed hinge to the light falling down the shaft. “Much better,” she whispers. “I prefer to see the things I am about to trip over.”",
      grille: "Tilda watches Lio alter a mark beneath the guard's elbow and draws a quiet breath through her nose. “Wrong shorthand, in exactly the useful place.” She touches Mara's wrist before Mara can lift the blue knot too high. “He is still making trouble. Let him know we noticed.”",
      crown: "Tilda edges alongside you, easing her weapon free beneath the alcove's shadow. “A very grand place to lose an argument,” she murmurs. Her eyes stay on Bracken's hand as he slides it along the table's edge.",
      secure: "Tilda wedges her shoulder beneath the carriage's side rail, using the low axle housing to keep it from slewing away. “You may complain about my manners after we stop this,” she tells Lio through gritted teeth. “For now, keep that wheel jammed.”",
      reunion: "Tilda starts to say something when the restraint opens, then sees Mara's face and lets the words go. She collects the loose iron before it can trip either sibling and sets it well aside. Only then does she glance toward the empty passage. “One escaped captain. One rescued brother. I know which count matters.”",
    },
    moss: {
      approach: "Moss parts the fern stems with the back of his hand, exposing a shallow stream beneath the ridge. Wax crumbs and short lengths of thorn cord have caught against its stones. “The workshop drains this way,” he says. “Water has to leave the wall somewhere. Follow it downhill and we can look for the opening.”",
      entry: "Moss rests two fingers on the root-bound landing post while you listen for footsteps. A thin mechanical tremor passes through the wood. “Something heavy is taking strain farther inside,” he murmurs. “The workshop line runs through this wall toward the guarded room.”",
      workshop: "Moss steadies the nearest cooling tray with two fingers before it can rattle against the rack. He listens through another stroke of the press, then inclines his head toward the laborer's end of the room. “That covers a few quiet words. Wait until he comes back for another tray.”",
      ledger: "Moss keeps a hand beneath the loose lid of the nearest crate so it cannot rock while you crouch beside it. He follows the short chain from the woman's wrist to the desk. “She cannot leave that seat,” he says quietly. “If we draw him toward the receiving tally, we will have room to get between them.”",
      light: "Moss rubs a flake of rust from the shutter's old stop, where years of use have polished a shallow notch. “It used to rest open here,” he says. He follows the reflector's angle toward the shaft. “A guide lamp for the floor below. Those stems had wedged it nearly shut.”",
      grille: "Moss follows the movement of Lio's hand, then the rail to which the altered tally points. “He has sent that carriage toward a blocked line,” he whispers. “He is still choosing where it goes.”",
      crown: "Moss steps beside you and watches the Sentry turn on its bound root joints. “Watch those braces,” he murmurs. One tightens as the creature settles its weight, and he shifts his own stance to follow the movement.",
      secure: "Moss braces one foot against a dressed stone beside the rail and catches the carriage frame with both hands. “Let it lean toward me,” he calls. “This footing will hold while you set the brake.”",
      reunion: "Moss lifts a broken length of thorn cord away from Mara's feet and makes room beside the carriage. He waits until Lio can stand without gripping the rail before offering his arm. “There is room for both of you on the road home,” he says.",
    },
  };
  return lines[companion.id]?.[beat] || "";
}

function awarenessParagraph(state: Chapter5SaveState): string {
  if (state.brackenDefeated) return state.clerkFreed && state.porterFreed && state.wardenFreed
    ? "The commands from the inner room have stopped. From the sheltered court comes the low sound of the rescued party talking, interrupted by the scrape of a cup against the cistern's stone rim. You cross the quiet floor to finish gathering what must travel home with them."
    : "The commands from the inner room have stopped. Somewhere in the service passages a door bangs, followed by retreating footsteps. You keep Mara close as you cross the exposed floor; other prisoners remain behind these walls.";
  if (state.briarhold.alert === "alerted") return "The station has abandoned its ordinary work. Shouted orders carry along the passages, workers pull their doors shut, and the guards answer one another by name before crossing a doorway. Bracken knows intruders are inside. The walls and partitions still give you cover as you choose where to confront his remaining people.";
  if (state.briarhold.alert === "suspicious") return "A guard pauses longer at each junction now, listening before he moves on. Conversation from the receiving yard has thinned, and twice you hear someone ask who last used the signal platform. You wait behind the pier until his lamp passes, then move while its light faces down the next passage.";
  return "Boots pass on the other side of the service wall, accompanied by an argument about a missing supply tally. You hold still until the voices move away, then cross beneath the shadow of the landing rail. From the receiving yard, the count resumes over the creak of wagon wheels.";
}

export function getChapter5SceneParagraphs(state: Chapter5SaveState, companion: Companion): string[] {
  const aftermath = getChapter5AftermathParagraphs(state);
  if (aftermath) return aftermath.filter(Boolean);
  const b = state.briarhold;
  let paragraphs: string[] = [];
  switch (state.view) {
    case "opening": paragraphs = [
      "The Relay's overturned lamp still smells of scorched oil when you leave the captured ledger behind. Its surviving columns have given you a place in the Rainroot woods and the bearings of a ridge from which to find it. Beside Lio's transfer row, the instruction to move the prisoners before dawn is written in the same careful hand as the ordinary cargo entries. Mara reads that line once more, pressing a finger beside her brother's name before she follows you into the night.",
      "Beyond the station, the path narrows between wet roots and shoulder-high fern. You keep your light hooded as you climb, stopping at breaks in the trees to match the ridge against the coordinates. Farther east, a few honest road lanterns show through the Rainroot canopy; ahead of you, behind a low bank of stone, green light leaks through shutters that close whenever anyone passes beneath them.",
      "Mara draws Lio's blue courier knot snug around her wrist so its loose end cannot catch on a branch. She has been quiet since the ledger, but when the waystation's receiving bell reaches you through the trees, she moves alongside you. “He told us to follow clever,” she says. “I am trying.” Together you leave the open ridge for an abandoned roadworkers' shelter above Briarhold, where you can watch the entrances without showing yourselves against the sky.",
    ]; break;
    case "overlook": paragraphs = [
      "The shelter's roof has fallen inward, leaving a dry pocket beneath the surviving wall. From there you can see Briarhold fitted into the hillside: an old stone waystation with its public lantern brackets hooded in thorn-shaped iron. A receiving wagon stands below the gate. One guard counts its bundles while another watches the road, and warm light from a workshop window catches the wheels whenever the driver shifts his load.",
      "Below the workshop, a ribbon of runoff slips between pale drainage stones and disappears beneath the station wall. The channel takes a longer route than the gate, but the guards' lamps never reach it. Three narrow signal openings face the receiving yard from a raised hall; each has an outer shutter and a colored glimmer behind it. Between loads, the yard workers look up at those openings, waiting for instructions.",
      state.recoveryUsed
        ? "Fresh bandages sit securely beneath your clothing, and the party's first-aid supplies have already done their work. Mara checks the paths while you adjust straps and put away anything that could knock against stone. The shelter remains a useful place to survey the gate before descending, but you have used its one recovery pause."
        : "Here, hidden by the wall, there is time for food, water, and fresh bandages before the approach. Mara holds the wrapping steady while you check the party's injuries. Once you are ready, you can descend toward the receiving wagon or follow the runoff to look for a service entrance. The culvert route offers reliable quiet entry; trying to pass the receiving guards may leave them suspicious.",
      chapter5CompanionBeat(companion, "approach"),
    ]; break;
    case "ridge": paragraphs = [
      "The path drops from the shelter beneath a stand of leaning firs. Through their branches the receiving gate looks close enough to touch, but a wash of lamplight lies across the last open stretch. You crouch behind a root bank while the wagon driver shifts his reins, waiting to see which guard follows the movement.",
      "Mara presses her palm against your arm and points downhill. Water has darkened a second trail beneath the workshop wall, where discarded cord has snagged on the fern stalks. You can stay on the ridge toward the gate or leave the lamps above you and follow that runoff toward the culvert.",
    ]; break;
    case "runoff": paragraphs = [
      "Cold water works its way around your boots as you descend beside the drainage stones. Small metal shavings gleam in the silt, mixed with wax crumbs and short lengths of stiff thorn cord. From the window above comes the slow impact of a hand press, followed by a woman's voice correcting whoever is feeding it.",
      "You stop whenever a worker crosses the lit window, keeping beneath the overhang until his shadow has gone. Farther along, the stream ducks under a grated opening in the wall. Mara lifts a twig from the grate and tests the lower hinge with her fingertips, careful to keep the iron from rattling against the stone.",
    ]; break;
    case "culvert": paragraphs = [
      "The grate rests loosely against the stones. You lift one corner against your sleeve while Mara guides the lower edge clear, opening enough space to crawl through. Beyond it, the culvert runs beneath the workshop floor; water and the machinery above cover the sound of a careful step.",
      "A service stair rises at the far end, tucked behind the receiving wall. The guards' voices carry from the yard above, mingling with the driver's count. Entering here will keep Briarhold Quiet and bring you to the shadowed service landing.",
    ]; break;
    case "gate": paragraphs = [
      "You reach the last dark fold beside the receiving wagon. Damp sacks and bundled poles hide most of its bed, leaving a narrow passage between the load and the wall. A guard holds a lamp over the driver's tally while his partner counts bundles aloud; whenever the numbers disagree, both men look down at the page instead of along the wheels.",
      "The wagon gives you a chance to slip behind its stacked sacks with Precision. Alternatively, you can step into the work as though you belong there, relying on Heart to carry the party past a question. Mara folds the bright end of Lio's knot under her cuff and watches for your signal. A failed check still gets you to the landing, but leaves the guards Suspicious; attacking them openly raises the general alarm.",
    ]; break;
    case "landing": paragraphs = [
      b.entry === "culvert"
        ? "At the top of the culvert stair, you find a service landing scarcely wider than the steps below it. The stone under your boots is slick from the drain, so you take your weight against the wall before letting Mara come up beside you. A stack of empty supply baskets screens the landing from the receiving yard; through its woven gaps you can see lamplight move as a guard passes outside."
        : b.entry === "assault"
          ? "Beyond the receiving gate, you draw Mara into a recessed service landing behind the supply racks. The wagon and the defeated gate detail are out of sight from here, but the alarm carries through the wall. A worker hastily shuts an outer door, leaving you in a narrow strip of shadow beside the inner passage."
          : "You pass behind the receiving wall into a recessed service landing, out of the tally lamp's reach. Empty supply baskets stand between you and the wagon yard. You listen there until the driver and guards resume their count, keeping Mara below the gaps in the wicker where a face could catch the light.",
      "Ahead, the landing rail ends beside an opening around a thick stone pier. Voices and work sounds arrive from different directions beyond it. Mara checks the space behind you, then points toward the sheltered side of the opening. You can move from here into the shadowed hub to survey the passages farther inside.",
    ]; break;
    case "hub": paragraphs = [
      `The service landing opens onto a narrow hub built around a square stone pier. You keep to the wall behind a rack of empty tally boards, where you can survey the passages without standing in their light. Above you, ${state.ledgerResolved ? "the records lamp shines through a partly closed partition" : "a pen scratches in the records room"}. Below, ${state.workshopResolved ? "the stamping press stands quiet, leaving the service footsteps easier to hear" : "a stamping press comes down hard enough to shake the loose boards beneath your feet"}. A stair beyond the workshop leads to the hooded signal lanterns.`,
      b.innerDoorOpened
        ? "Across the hub, the inner door stands open beside its iron-bound frame. The passage beyond bends through an inspection grille toward the Crown Table. Mara looks there first whenever a sound comes from within, then makes herself turn back to the nearby rooms."
        : b.guardsDistracted
          ? "Across the hub, the inner guards' chairs stand empty. Their footsteps have gone toward the receiving yard in answer to the lantern signal, leaving the inner door unattended. Its lock catches the light beneath the handle."
          : `Across the hub, ${b.investigatorRemoved === "none" ? "two guards hold" : "one guard holds"} an iron-bound inner door. Orders carry through the guarded passage. Mara studies the door without moving toward it, holding her wrist inside her sleeve where Lio's knot cannot show.`,
      awarenessParagraph(state), chapter5CompanionBeat(companion, "entry"),
    ]; break;
    case "workshop":
      paragraphs = state.workshopResolved ? [
        `You cross to the workbench beside the open press. ${state.workshopResolution === "bypassed" ? "The sealwright and laborer have gone down the outer service steps, beyond the stone partition." : "The sealwright sits secured beside the pier, her tools moved out of reach."} Close beside the lamp, you can read DESSA FLINT scratched into the handle of the stamp chest and see the seals arranged around its open lid.`,
        b.shimFound
          ? "The empty hook beside the lamp shows where you took the lock shim. Mara keeps its narrow spring wrapped in cloth, ready for the records desk; the seals and the larger tools remain where Dessa left them."
          : "A narrow spring tool hangs from a hook beside the lamp, its thin tip polished by use on small catches. Mara leans close to examine it without disturbing the neighboring tools. “That could lift a drawer latch,” she whispers, pointing to the bend near its end.",
        b.workshopDisabled
          ? "Beneath the bench, the disconnected coupling rests on the cloth where you lowered it. A fresh root brace has stopped short of the opening through the inner wall, and the feed cord hangs slack beside it. This part of the Briar machinery remains disrupted."
          : "On the far side of the press, a mechanical feed carries fresh root braces through an opening in the inner wall. Close enough to follow its cord now, you crouch beside the bench and find a coupling marked REPLACEMENT BRACES — THORNROOT SENTRY. A removable pin holds the two sections together. You could disconnect the line here and disrupt the Briar machinery.",
      ] : state.carriageStage === "rescued" ? [
        "The workshop press stands silent. A woman in a leather apron is wrapping tools beside an open travelling bag. She looks up when you enter, her hand pausing over a small plate. The outer service steps are empty behind her, and her eyes move from your weapon to Lio standing beside Mara.",
      ] : [
        "Heat from the wax stove reaches you at the foot of the service stair. You pause outside the workshop doorway until both workers lean over the press, then slip sideways into a storage recess just inside the threshold. A tall cooling rack and a stack of wooden trays screen it from the lamp. Mara crouches against the stone wall beside you while you ease a loose tray out of the way, opening a narrow gap through which to watch the room.",
        "Beyond the rack, a laborer feeds blank plates beneath a hand press while a woman in a leather apron checks the impressions. “Square to the edge,” she tells him. “Captain Voss pays for authority, not crooked scraps.” He takes back the rejected plate and works the handle again. Each impact shakes the rack against your sleeve; you hold it steady while she smooths another faulty impression and pushes it toward him.",
        "The laborer steps back toward your recess whenever he needs an empty cooling tray, coming within reach of a quiet word while the woman keeps her eyes on the press. A broad lamplit aisle separates the cooling rack from the workbench. You watch his hand travel toward the next tray, waiting for a chance to catch his attention.",
        chapter5CompanionBeat(companion, "workshop"),
      ]; break;
    case "ledger":
      if (!state.ledgerResolved) paragraphs = state.carriageStage === "rescued" ? [
        "At the sound of your approach, the records officer rises with a handful of pages clutched against his coat. Lio stands free beside Mara in the doorway. The officer looks toward the passage behind you, then at the woman still cuffed to his desk, and slowly lowers the papers. You step between him and the service exit.",
      ] : state.ledgerOfficerDistracted ? [
        "The officer has stepped through the side opening to investigate the receiving tally. From behind the storage crates you can hear him checking its pegs, muttering about workers who cannot keep a count. He has left the writing desk for the moment, but he can return by the same opening as soon as he finishes. The woman remains cuffed beside her chair, listening with her pen suspended above the page.",
        "You have an opening to meet him at the turn, away from the desk and the captive. Mara watches the side opening while you measure the few steps from your cover to the partition. Catching his weapon wrist and binding him quietly takes a Precision check against DC 12. A miss gives him time to cry out before you finish the restraint, raising awareness one level. If you withdraw now, he will return to the clerk and question the unexplained noise, leaving Briarhold at least Suspicious.",
      ] : [
        `${state.workshopResolved ? "You wait outside the doorway until the officer leans across the woman’s page. As he corrects her work, you step over the raised threshold and ease yourself behind the copying bench." : "You slip inside when the workshop press strikes below, using its impact to cover the soft scrape of your boot at the threshold."} A waist-high stack of storage crates stands beside an unused copying bench. You crouch behind it with Mara close at your shoulder, leaving the aisle to the far desk empty. From here you can peer between a crate and the bench frame without entering the lamp's light.`,
        "At the desk, a woman works over a page while a records officer watches from a chair beside her. When she reaches for fresh ink, a short chain draws tight between a cuff on her wrist and an iron staple fixed to the desk. The officer taps his ruler against the edge of her work. “Again. Leave out what I told you to leave out.” She lowers her head and resumes writing, shifting her chained hand so it will not drag across the wet ink.",
        "The officer glances toward your hiding place. You stop moving while his gaze rests on the stacked crates, waiting until he turns back to correct the woman again. Between your cover and the desk, lamplight falls across the open aisle. A receiving tally hangs in a side opening nearer your cover, where its rattle could draw him away from the captive.",
        chapter5CompanionBeat(companion, "ledger"),
      ];
      else paragraphs = [
        "The officer sits bound behind the service partition while you and Mara stand beside the writing desk. The shaded lamp lights the iron cuff's edge, where dried ink has gathered in the hinge. Shallow scratches follow the chain's path across the writing surface.",
        state.clerkFreed
          ? state.carriageStage === "rescued"
            ? "The opened cuff rests beside the empty chair. Sella Reedmere is waiting with the rescued party in the sheltered court; before leaving the desk, she showed you the office stock and handling marks she knew from her work at Westroot. Her pen lies across the last unfinished column."
            : "Sella Reedmere has moved into the storage alcove, where the crates shelter her from the passage. She flexes her freed wrist while listening toward the door, ready to wait here until you can get the other captives out. “Westroot route records,” she tells you when you ask about her work. “They brought me here to make their transfers look ordinary.” She nods toward the loose instructions. “The paper and handling marks are genuine office stock. I used the same at Westroot.”"
          : "The woman's cuff is tethered to an iron staple beneath the desk. Its retaining pin projects toward the aisle, and Mara kneels beside it, first showing the woman her empty hands. When the woman nods, Mara reaches beneath the desk to test the pin's housing.",
        "Beneath the glass writing surface lies a fixed signal chart, its three columns worn pale where fingers have followed the rows. Beside the lamp, the labels and pane marks are clear. The chart belongs to the old waystation's shutters and sits beneath the fitted edge of the glass.",
        b.spareKeyFound
          ? `The drawer stands open beneath the glass. Its spare inner-door key is wrapped beside Mara's shim, while the loose papers remain where the clerk left them. ${b.innerDoorOpened ? "You have already used the key to release the inner lock; the passage beyond the hub is open." : "The key will open the inner lock once its guards have been drawn away or defeated."}`
          : state.clerkFreed
            ? "Sella has told you that a spare inner-door key is kept in the lower drawer. When Mara tests its join, a brass latch holds it shut; a thin spring tool could reach the catch."
            : "The lower drawer is shut beneath a brass latch. Mara tests the join with a fingernail and stops before the wood can creak; a thin spring tool might reach the catch.",
      ];
      break;
    case "lanterns": paragraphs = [
      "A narrow stair brings you onto the lantern operating platform, above the receiving yard. Heat from three fixed lamps warms the backs of your hands, and the shutters' counterweights hang motionless beside their chains. Through a slit in the wall you can see the wagon and its waiting crew; anyone watching from below will read the lights in the order arranged at this platform.",
      "Each rack accepts a colored glass pane with an etched mark: red triangle, blue circle, green square, or amber star. The closed shutters screen the panes from the yard while you arrange them. When you pull the transmission chain, all three shutters open together and the station's people respond to that arrangement as a work signal.",
      b.lanternsRestored
        ? "The guide lamp burns steadily behind its fixed amber glass. With the shutter resting against its old stop, the brass reflector casts warm light down the sloping shaft in the inner wall. Broken briar stems lie bundled beneath the rack, and the freed hinge moves easily when Mara tests it."
        : state.goldChannelUncovered
          ? "Beneath the lifted cover sits an older oil lamp with fixed amber glass and a brass reflector aimed into a sloping shaft. Its iron shutter hangs nearly closed. Woody briar stems have grown through the hinge and wedged between the shutter and its frame, holding it away from a worn stop where it once rested open. You can clear the stems and raise the shutter to let the lamp light the shaft again."
          : "Beside the pane racks, a smaller oil lamp gives off a thin amber glow beneath a loose metal cover. Briar stems curl around its bracket and disappear behind the cover's edge. Mara touches the fastening, then looks toward a narrow shaft in the inner wall beside it.",
      b.invalidSignals > 0 && b.alert !== "alerted"
        ? "After the unexplained signal, the guards are listening for another mistake. A second meaningless arrangement will bring a general alert. You can review the desk chart before transmitting again."
        : b.alert === "alerted"
          ? "The guards now know that someone inside has reached the signal equipment. A Front Gate Alert will no longer lure them from the inner door."
          : "Below the platform, the receiving crew glance up between loads, waiting for the shutters to open. You arrange the panes behind their covers and reach for the transmission chain when you are ready.",
    ]; break;
    case "investigator": paragraphs = [
      "The shutter chains settle. Below, the receiving crew look toward their foreman, who points up at the platform. From the inner passage comes a scraped chair, then the deliberate tread of one guard climbing toward you. His lamp reaches the stair wall before he does. “Who is up there?” he calls, his irritation carrying clearly through the stairwell.",
      "Mara draws herself behind a stack of spare shutter frames, out of his first line of sight. A deep storage recess gives you space to conceal the party while he searches, if you can stay quiet enough. The narrow turn at the top of the stairs also gives you a harder chance to catch his weapon arm and disarm him without a shout.",
      "Successful hiding leaves him in service and makes the station Suspicious. A successful silent, nonlethal ambush removes him from later duty while also leaving Briarhold Suspicious. Failure at either check, or choosing an open fight, raises the general alarm.",
    ]; break;
    case "door": paragraphs = [
      state.brackenDefeated
        ? "The inner door stands open. Beyond its empty post, the inspection passage leads past the Crown Table to the adjoining cells. The guards abandoned their posts when Bracken escaped."
        : b.innerDoorOpened
        ? "The inner door rests against its stop, exposing a short passage in the thickness of the old wall. At the far end, a grille admits a narrow view of the chamber beyond; Mara approaches the slit with one hand against the masonry, keeping herself out of the brighter light."
        : b.guardsDistracted
          ? "You reach the inner door after the guards have gone to answer the receiving-yard signal. One chair is still pushed back at an angle, and a cup trembles beside it as footsteps descend the outer stairs. Beneath the handle, the lock waits untouched. If you have found the spare key, you can use the diversion to enter quietly."
          : `From the shadow of the stone pier, you watch ${b.investigatorRemoved === "none" ? "the two guards" : "the remaining guard"} at the inner door. ${b.alert === "alerted" ? "The alarm has brought a weapon into every hand, and no signal from the yard will draw this post away now." : "The duty key hangs close to the guard's belt, beyond any careful reach from where you stand."} You can take the key by defeating this detail, but an open attack will alert everyone farther inside.`,
      !b.innerDoorOpened ? "Warm air slips beneath the door, carrying paper dust, lamp oil, and the slow creak of something heavy moving on a rail. Mara hears it too. She turns her wrist inside her sleeve, touching the hidden blue knot while you decide how to pass the post." : "",
    ]; break;
    case "grille": paragraphs = state.lioSeen ? [
      state.brackenDefeated
        ? "Through the inspection grille, you can see the broken command fittings around the Crown Table and the passage Bracken used to escape. The carriage rail remains visible beyond the table; you have already shown Lio that his sister is here."
        : "Lio keeps his head bent over the tally board, but his gaze lifts toward the grille whenever the room gives him a moment. He already knows you are here. Mara stays below the slit, resisting the urge to answer every glance, while you study the approach to the Crown Table.",
    ] : [
      "You put your eye to the grille and find a room wider than the passages that led here. An old route table occupies its center, its surface crowded with seal plates and green-marked instructions. Beyond it, a wheeled transfer carriage sits on a sloping rail. Lio is restrained beside its tally board, close enough to work but unable to leave the frame.",
      "For a moment Mara cannot seem to draw breath. Her hand closes around your sleeve as Lio shifts beneath the lamp: thinner than she remembers, with a scrape along his cheek, but moving under his own strength. When the man at the route table turns to check a stack of instructions, Lio rubs out a route mark and replaces it with shorthand that points toward a blocked siding. He keeps the change small, hiding it beneath the next entry before anyone looks back toward the carriage.",
      "Mara leans toward the slit, his name nearly on her lips. Before she can speak, Lio looks up and sees her. His fingers pause against the tally board; then he places one across his mouth. Mara lowers herself into shadow and lifts the blue knot just high enough for him to see. He gives the smallest nod, bends over his work again, and leaves the false route intact.",
      chapter5CompanionBeat(companion, "grille"),
    ]; break;
    case "crown": paragraphs = state.brackenDefeated ? [
      "The Crown Table's green instruction plates lie scattered among the broken fittings. The Thornroot Sentry has collapsed, and the remaining guards have either fallen out of the fight or abandoned the room. Bracken's personnel passage has closed behind his wounded escape, leaving a streak of blood beside its latch.",
    ] : [
      "You ease into an alcove beside the old stone console, where Mara crouches below the lip with Lio's blue knot gripped in her hand. Across the room, Bracken Voss stands at the Crown Table amid open ledgers and stacks of sealed instructions. Ink stains his cuffs; a weapon hangs close beneath the edge of his coat. Beside the table, the Thornroot Sentry shifts its weight with a dry creak, its knotted arms braced against the floor.",
      b.alert === "quiet"
        ? "Bracken raises his head as though expecting another clerk. Then his gaze settles on your weapon. He lays his pen across the ledger with deliberate care and draws a sealed plate toward him, watching you over the table's edge."
        : b.alert === "suspicious"
          ? `Bracken's ledger lies open beneath a pen he has set aside. He studies the entrance with a crease between his brows, turning a sealed plate slowly against the table. ${b.investigatorRemoved === "silent" ? "The Sentry leans forward as your shadow reaches the floor." : "A Thornseal Guard beside him raises his shield and takes a step toward the passage."}`
          : `Bracken has pushed the ledgers aside and spread his sealed plates within reach. ${b.investigatorRemoved === "silent" ? "A Thornseal Guard stands at his shoulder, weapon drawn." : "Two Thornseal Guards hold opposite sides of the table, their weapons drawn."} As you reach the alcove, the Sentry turns toward you and drags one root-bound foot across the stone.`,
      b.workshopDisabled
        ? "The Sentry tugs at the feed cord running into the workshop wall. It comes away slack, dragging across the paving. A gap in the bindings around one arm stays open as the creature settles its weight. Mara follows the cord with her eyes, then gives you a quick nod."
        : "",
      b.lanternsRestored
        ? "Warm gold lamplight filters through a high opening in the wall, falling across the table and the worn brass guides set into the paving. Green arrows painted on loose boards point across those older markings. Bracken glances toward the opening, then starts to gesture with his seal toward one of the boards. His hand pauses. He lowers the plate and shifts behind the table, his eyes returning to your feet."
        : "Green-glass lamps leave the room's lower corners in shadow. Painted arrow boards lean against the table and cover stretches of the old paving. Bracken turns his sealed plate toward you, then looks down at the space between your boots and the nearest board.",
      chapter5CompanionBeat(companion, "crown"),
      "“You have come a long way from the public road,” Bracken says. His eyes pass over the console's edge, searching the alcove behind you. “Put down the weapon. We can enter this as a misunderstanding.” Beyond his shoulder, Lio tightens his grip on the carriage tally and watches the space between you and the table.",
    ]; break;
    case "carriage":
      if (state.carriageStage === "secure-carriage") paragraphs = [
        "The carriage creeps down the old transfer rail toward the raised westbound shutter. Lio strains against his restraint, forcing the edge of his tally board toward the nearest wheel, but it cannot take the weight for long. Mara calls to him from beside you, keeping her voice steady enough for him to hear through the noise of the broken machinery.",
        "There is room to reach the frame before it clears the stone brace. First secure the wheel and catch the carriage, then set its brake, then release Lio's restraint. Mara points toward the nearest wheel as Lio forces the tally board farther between its spokes.",
      ];
      else if (state.carriageStage === "set-brake") paragraphs = [
        "The jammed wheel holds against the rail while you keep the carriage braced. Lio has stopped fighting the restraint long enough to move his fingers clear of the mechanism. Mara stays where he can see her, telling him what you are doing before each movement.",
        b.lanternsRestored
          ? "The guide lamp's light falls through the high wall opening and across the carriage controls. Beneath the edge of a painted arrow board, you can see a brass rod running from one handle straight to the brake shoe. The other rods double back into the housing. You follow the visible rod and reach for its handle."
          : "Several handles are marked with arrows that disagree with the rods beneath them. You must read where the linkage actually runs before putting your weight on one. An Instinct check against DC 12 will guide the attempt; a miss may injure your arm, but you will still find the brake and secure Lio.",
      ];
      else if (state.carriageStage === "free-lio") paragraphs = [
        "The brake shoe bites firmly into the rail. When you ease the pressure on the frame, the carriage stays where you have set it, and Lio lets his shoulders drop for the first time since you entered the room. Mara reaches him along the safe side of the wheel, touching his hand before she looks down at the restraint.",
        "The cuff is held by a plain release pin behind the seat. With the machinery stopped, you can lift it without reaching between moving parts. Mara steadies Lio as he prepares to stand, waiting for you to open the last piece of iron that keeps him here.",
      ];
      else paragraphs = [
        "Mara stays beside Lio after the restraint has opened, one arm around his back while he tests his weight on the floor. Up close, the marks of captivity are harder to overlook: a sleeve rubbed thin against the cuff, ink worked into his fingers, the careful way he draws breath before moving. She brushes a strand of hair out of his eyes as though they were standing in the doorway at home, then pulls him close again.",
        "Lio looks from his sister to you. “I kept thinking someone would notice the routes,” he says. His voice catches, and he has to swallow before he can continue. Mara loosens her hold enough to show him the blue knot. “We did.” For a while he holds that little loop of cord between his stained fingers, feeling the familiar weave without trying to say anything else.",
        state.porterFreed && state.wardenFreed
          ? "Lio looks along the passage to the open cells. Their release bar rests against the wall, and the voices of the people you brought out carry from the sheltered court. He takes Mara's hand before you return to the others, leaving the stopped carriage and its opened restraint beside the rail."
          : "A sound from the adjoining cells brings his attention back to the room. He turns carefully, keeping Mara's hand in his. “There are others here,” he tells you. “We have to get them out.” The broken Sentry lies between the table and the rail, and Bracken's surviving commands have lost their guards. For the first time since entering Briarhold, you can plan the next move with Lio standing beside you.",
        chapter5CompanionBeat(companion, "reunion"),
      ];
      break;
  }
  return paragraphs.filter(Boolean);
}

export const CHAPTER_5_ACTION_NARRATIVE = {
  crossRidge: "You leave the exposed crest one at a time, using the fir trunks to break your outlines against the sky. At the abandoned shelter, Mara lowers herself behind the surviving wall and looks down toward the receiving lamps. From this cover you can watch the guards and attend to the party's injuries before moving closer.",
  recover: "You unpack water and clean wrappings in the shelter's dry pocket, laying your buckles on a folded cloth. Mara helps bind the worst injuries while the wagon below advances a few feet through the gate. By the time you put the supplies away, the party's HP is restored and the straps sit securely over the fresh bandages.",
  resolveWorkshop: "When the laborer comes back for a cooling tray, you catch his eye through the rack and raise a finger to your lips. He stops with his hand on the tray. While the woman scrapes a spoiled impression clean, Mara whispers, “These stamps are for prisoner transfers,” and opens the copied ledger notation in the shelter of the recess. He bends as though checking the tray's edge, reading Lio's row and the before-dawn instruction. His gaze moves from the paper to the woman at the press.\n\nMara points toward the outer service steps. The laborer sets down his tray and leaves his place. “Find someone else,” he says, backing through the outer door before the woman can stop him. She follows, demanding an explanation, and their voices move down the steps beyond the stone partition. You remain behind the cooling rack until both are out of sight, then cross the empty aisle to the workbench with Mara close behind.",
  takeShim: "You lift the spring tool from its hook while Mara holds the neighboring tools apart to keep them from chiming together. She tests the thin tip against her thumb, then wraps it in a strip of cloth. “That will get behind an ordinary drawer latch,” she whispers, slipping the lock shim into her pocket.",
  disableWorkshop: "You follow the feed cord beneath the bench to the pin joining its two sections. Mara supports the loose coupling while you work the pin free, lowering it onto a folded cloth instead of letting it fall against the press. The cord slackens, and the next root brace stops short of the opening in the wall. A pulsing tug against the disconnected section fades as you set it down; the Briar machinery beyond this wall can no longer draw replacement braces along this line.",
  distractLedger: "From behind the copying bench, you reach the hanging tally with the end of a loose packing strip and give it the impatient rattle you heard from the receiving crew. You draw the strip back before the officer turns, keeping yourself beneath the crates. “If the count is wrong, start it over,” he snaps, rising when nobody answers.\n\nHe steps into the side opening to inspect the pegs, leaving the woman chained at her work. Mara stays with you behind the bench, watching the turn where he will come back into the room.",
  secureLedger: "You leave the crates while the officer is facing the tally, stopping just inside the turn where the service partition hides you from the passage. As he begins to come back, you catch his weapon wrist against the doorpost and draw him off balance toward the empty stool. Before he can shout, you cover his mouth with a folded cloth and hold him still. Mara remains beside the copying bench, watching the captive and the room entrance.\n\nYou bind the officer's wrists and ankles with packing cord, easing the loops around his joints before securing the cloth across his mouth. His weapon goes beyond his reach behind the partition. You cross the exposed aisle and reach the writing desk, where Mara joins you beside the woman's short chain.",
  freeClerk: "You steady the chain while Mara draws the retaining pin from its housing beneath the desk. The cuff opens, and the woman catches it before it can strike the chair. For a moment she only rubs the place where the iron pressed against her wrist. Then she looks toward the partition where the officer sits bound and lets herself stand.\n\n“Sella Reedmere,” she whispers. “I kept trying to think how I could get through that doorway.” Mara leads her into the shelter of the storage alcove while you keep the aisle in view. Sella settles behind the crates to wait until you can bring the remaining prisoners through.",
  abandonLedger: "You withdraw from the room before the officer turns back from the receiving tally. From the passage you hear his chair scrape against the floor, then another impatient order to the clerk. She is still chained where he left her. He pauses between orders to listen toward the doorway, and a guard in the passage asks about the rattle. Briarhold is at least Suspicious.",
  readChart: "Mara cups a hand around the lamp so its reflection moves off the desk glass. Beneath it, three labeled columns show the lantern order as seen from the operating platform: left, center, right. You follow each row with a fingertip, matching its colors to the etched marks. Front Gate Alert and Command Center Recall use the same panes in a different order, with very different instructions attached. The fixed chart will remain here if you need to review it.",
  drawerLocked: "Mara presses lightly beneath the drawer's lip, then stops when the wood begins to resist. She points to a narrow brass catch behind the join. “I can lift that if we find something thin enough. Pulling will only split the front.” She draws her hand back from the catch, leaving the drawer intact until you can return with a suitable tool.",
  drawerOpened: "Mara slips the workshop shim into the join while you hold the drawer steady. The spring tip catches, bends, and lifts the latch with a sound barely louder than a pen crossing paper. Inside, a spare inner-door key rests on a square of worn cloth. Mara passes it into your hand and retrieves the shim; you keep both, leaving the papers beneath the writing surface undisturbed.",
  uncoverGold: "You lift the metal cover while Mara catches its loose fastening. Beneath it, a wick burns behind fixed amber glass, and a tarnished brass reflector faces a sloping shaft in the inner wall. The lamp's shutter has been wedged nearly shut by woody briar stems threaded through its hinge. A polished notch on the old stop shows where the shutter once stood open. Mara holds the cover aside while you test which stems are taking the strain.",
  restoreGold: "Mara steadies the lamp's frame while you work the woody stems out of its hinge, catching the brittle pieces in a cloth as they break. With the last stem clear, you lift the shutter and settle it against the worn stop. Warm gold lamplight spreads across the brass reflector and shines down the sloping shaft. You hold still until the hinge has stopped creaking, then lower the cover beside the bundled briars.",
  unlockDoor: "You fit the spare key beneath the inner door's handle while Mara listens toward the receiving stairs. The wards turn cleanly and release the latch. You guide the door inward with your sleeve against its hinge and set it against the wall, exposing a narrow inspection passage.",
  recognizeLio: "You draw back from the grille before the attendant guard can follow Lio's glance. Mara keeps the blue knot lifted for one more heartbeat, then lowers it beneath the stone sill. “He knows,” she whispers, steadying her breath. She follows you toward the entrance console, keeping low along the sheltered side of the passage.",
};

export function getChapter5LedgerAmbushNarrative(check: SkillCheckResult, alert: BriarholdState["alert"]): string {
  if (check.success) return `${CHAPTER_5_ACTION_NARRATIVE.secureLedger}\n\n${checkSummary(check)}.`;
  const response = alert === "suspicious"
    ? "From the junction, a guard calls to ask who shouted. You hear him stop to listen, then move farther along the passage. Briarhold is Suspicious."
    : "An answering shout carries from the inner post, followed by hurried orders along the service passage. Briarhold is Alerted.";
  return `You leave the crates and reach for the officer's weapon wrist as he turns from the tally. He twists against your grip, catching your sleeve with his free hand. Before you can bring the cloth across his mouth, he cries, “Here! Help!” You press his weapon arm against the doorpost and draw him onto the stool, covering his mouth as he tries to shout again. Mara stays behind the copying bench, keeping the captive clear of the struggle.\n\nYou bind his wrists and ankles with packing cord and secure the cloth, then move his weapon behind the partition. ${response} You wait for the voices to recede before crossing to the writing desk, where Mara joins you beside the woman's chain.\n\n${checkSummary(check)}.`;
}

export function getChapter5EntryNarrative(route: "culvert" | "receiving-gate", check: SkillCheckResult | null): string {
  if (route === "culvert") return "You pass under the grate with your gear held close, keeping its metal fittings above the water. Mara follows along the dry edge while the workshop press thumps overhead. At the stair you stop to listen, then climb behind the receiving wall and settle into the shadow of the landing rail. The gate guards' count carries on above the sound of the water. Briarhold remains Quiet.";
  const action = check.stat === "Heart"
    ? "You step beside the load as though you have been sent to help, taking hold of a bundle before either guard can ask why you are here. Mara follows your lead, keeping her face turned toward the work."
    : "You move with the wagon while its stacked sacks hide you from the tally lamp. Mara keeps close to the wall, matching your pauses whenever a guard lifts his head.";
  return `${action}\n\n${check.success
    ? "The guards return to their count, giving you enough room to pass into the service landing. You leave their light behind before anyone asks for another tally. Briarhold remains Quiet."
    : "One guard catches the extra footsteps and calls after you. You keep moving around the wagon's far end, reaching the service landing while the driver answers his impatient question. The guard stays beside the wagon with his lamp raised toward the inner passage. You have entered; Briarhold is Suspicious."} ${checkSummary(check)}.`;
}

export function getChapter5GuardNarrative(response: "hide" | "silent-ambush", check: SkillCheckResult): string {
  if (!check.success) return `${response === "hide"
    ? "You draw into the recess while Mara folds herself behind the shutter frames. As the lamp reaches the platform, a loose fastening catches against your gear and taps the stone. The guard stops, swings his light toward the sound, and sees enough of you to shout."
    : "You wait at the turn until the guard's weapon hand passes the stair post, then reach to pin it against the rail. He twists before you can take his balance, wrenching free with a shout that carries down the stair."}\n\nAn answering call comes from the inner door, followed by the alarm bell. The guard pulls back toward the landing instead of remaining alone on the platform. Briarhold is Alerted, but the direct door route remains available. ${checkSummary(check)}.`;
  if (response === "hide") return `You fold into the deepest part of the storage recess, leaving the platform empty when the guard's lamp reaches it. Mara holds a loose frame against the wall so it cannot shift under her sleeve. The guard checks the racks, then stares at the shutters as though the machinery itself has offended him.\n\nAfter a long pause he takes his lamp back down the stairs, calling for the other guards to watch the signal hall. He is still on duty, and Briarhold is Suspicious rather than openly alerted. Another meaningless signal will raise the general alarm. ${checkSummary(check)}.`;
  return `As the guard rounds the post, you catch his weapon wrist against the rail and turn his balance toward the empty recess. Mara stays behind the shutter frames, clear of the struggle. You lower him to the floor, take the weapon out of his reach, and bind his hands with spare signal cord before he can call down the stair.\n\nThe guard lies breathing in the recess, his hands secured behind him. His missed report leaves Briarhold Suspicious, and another meaningless signal will bring the general alarm. ${checkSummary(check)}.`;
}

export function getChapter5SignalNarrative(signal: string, state: BriarholdState): string {
  const transmission = "You pull the chain far enough for all three shutters to open. Colored light falls across the receiving yard, and the work below pauses while the crew look up. ";
  const results = {
    "front-gate-alert": state.guardsDistracted
      ? "Front Gate Alert sends the inner guards toward the receiving approach. You hear the chairs scrape back, then boots hurry past the service pier toward the yard. Mara watches the empty post appear through the platform slit. The diversion holds while you prepare; the inner door still needs a key."
      : "The inner guards ignore the diversion. “Keep the door,” one calls. “The signal room is compromised.” Under general alert they no longer trust Front Gate Alert, and they remain between you and the lock. You can still take the direct door route by defeating the detail.",
    "command-center-recall": "Command Center Recall brings a shouted acknowledgment from the inner passage. Boots turn toward the Crown Table, and a bell begins to ring farther inside the station. Mara lowers her head as a guard looks toward the platform. Briarhold is Alerted.",
    "receiving-clear": "Receiving Clear reaches the yard crew as an ordinary instruction. A yard worker lifts the wagon barrier and waves the driver onward, while the inner guards return to their post.",
    "hold-deliveries": "Hold Deliveries brings the yard foreman out beside the wheels. He lowers the barrier and halts the waiting wagon, making the driver gather his reins with a muttered complaint. The inner guards remain on duty.",
    meaningless: state.investigatorPending
      ? "No matching work signal follows those panes. The crew wait, looking from the lamps to one another, until a guard leaves the inner post to find out who is using the platform. You hear his chair scrape and his lamp chain strike the stair rail. Choose how to meet him before leaving or transmitting again."
      : "The crew recognize a second unexplained activation and call straight into the station. The inner bell answers, doors close, and the remaining personnel prepare for intruders. Briarhold is Alerted; the path to Lio remains open through the direct confrontation.",
  };
  return transmission + results[signal];
}

export function getChapter5BattleAftermath(kind: Chapter5BattleKind): string {
  if (kind === "boss") return "The Thornroot Sentry gives way across the table's broken fittings, scattering green instruction plates over the floor. Wounded, Bracken catches himself against the command console, leaving a dark smear along its edge. He gathers the master routing cipher from the scattered plates and pulls a release beside the westbound shutter.\n\nThe carriage brake lifts. Lio's frame begins to move down the rail, and Mara turns toward him before Bracken has reached the personnel passage. You have a clear sight of the escaping captain for a moment, but Lio is still fastened to the moving assembly. You go to the carriage. Behind you, Bracken forces his passage shut. The broken Sentry sprawls beside the rail as Mara points toward Lio's wheel, already reaching for the carriage frame.";
  if (kind === "door") return "You take the duty key from the fallen guard's belt while Mara watches the junction, then turn it in the inner lock. The door opens onto a thick-walled inspection passage. Farther inside, the alarm has brought answering footsteps toward Bracken.";
  if (kind === "gate") return "The receiving guards fall out of the fight, leaving the wagon's path into the station clear. Its driver backs away from the scattered tally boards while Mara follows you through the gate and behind the service wall. The alarm has carried ahead of the party; you reach the landing with Briarhold Alerted.";
  return "The investigating guard lies disarmed on the platform, his weapon beyond his reach. Mara checks the stairs while you listen to the answering calls farther inside. His alarm has reached the Crown Table, and the remaining personnel are moving toward Bracken.";
}

export function getChapter5BrakeNarrative(lit: boolean, check: SkillCheckResult | null, injury: number): string {
  if (lit) return "In the guide lamp's light, you follow the brass rod from its handle to the brake shoe. You draw the handle down until the shoe grips the rail, then ease your shoulder away from the frame to test the hold. The carriage stays still. Lio looks toward Mara and lets his hand fall away from the jammed wheel.";
  return `${check.success
    ? "You trace the control rods past the false arrows and find where the real brake shoe bears against the rail. Keeping your hand clear of the crossed linkage, you bring the correct handle down until the carriage takes its own weight."
    : `You follow a painted arrow to a handle whose rod doubles back beneath the housing. When you test it, the false linkage snaps across your arm${injury ? ` (${injury} HP)` : ""}. You pull clear and read the exposed fittings instead, finding the true brake and setting it before easing your hold.`}\n\nThe brake is secure and Lio is unharmed. Mara checks that his fingers are clear while you make certain the frame cannot move again. ${checkSummary(check)}.`;
}

export function getChapter5Arrival(state: Chapter5SaveState, destination: Chapter5Node): string {
  const routes: Partial<Record<Chapter5Node, string>> = {
    ridge: "You leave the shelter beneath the fir branches, keeping low where the ridge breaks against the receiving lamps. Ahead, the wagon road approaches the gate; the darker runoff trail drops away beneath it.",
    runoff: "You take the downhill branch, placing your boots between the wet drainage stones while Mara steadies herself against the bank. Wax scraps and thorn cord lead toward the workshop's grated outflow.",
    culvert: "You reach the grate under the workshop wall and crouch beside its lower hinge. Water passes beneath it into a shallow stone channel; the receiving guards' lamps remain above and behind you.",
    gate: "You move along the root bank until the receiving wagon fills your view. Its load hides the last stretch beside the wall, while the guards' tally lamp leaves a bright strip across the road.",
    overlook: "You climb back into the shelter's broken wall, leaving the receiving lamps below the fir branches. From this cover you can survey both entrances before choosing your approach.",
    ledger: state.carriageStage === "rescued" && !state.ledgerResolved ? "You return along the records passage with Lio beside Mara. Behind the open partition, the officer is gathering pages from the desk while the captive watches the doorway." : state.ledgerResolved ? "You return along the records passage and check the officer's bindings behind the partition before reaching the desk. The shaded lamp lights the writing surface, with the storage alcove sheltered beside the doorway." : "You follow the scratch of a pen to the records doorway, then slip behind a stack of storage crates beside an unused copying bench. From that cover, you can watch the officer and the woman at his desk without crossing the lamplit aisle.",
    workshop: state.carriageStage === "rescued" && !state.workshopResolved ? "The workshop has fallen quiet. You approach its doorway with Lio and Mara, finding the sealwright beside a travelling bag at the silent press." : state.workshopResolved ? `You pass the workshop partition and return to the workbench. ${state.workshopResolution === "bypassed" ? "The workers have gone down the outer steps, beyond the service door." : "The sealwright remains secured beside the pier."} The tools and mechanical feed are within reach.` : "You descend the narrow service stair and stop outside the workshop doorway. When both workers lean over the press, you slip into the storage recess just inside the threshold and crouch behind its cooling rack, keeping Mara below the lamp's reach.",
    lanterns: "You climb the narrow stair with a hand beneath the rail to keep it from shaking. The warm lamp housings appear above the platform edge, their shutters waiting beside the view of the receiving yard.",
    crown: state.brackenDefeated ? "You return past the inspection grille to the broken command fittings around the Crown Table. The empty personnel passage lies beyond it, while the way back to the carriage remains clear." : "You pass the inspection grille and approach the broad entrance console, keeping Mara on its sheltered side. Beyond it, the Crown Table occupies the center of the room, with the carriage rail visible farther in.",
    carriage: state.carriageStage === "rescued" ? `You return to the transfer rail with Mara and Lio. The wheel and brake hold securely. ${state.porterFreed && state.wardenFreed ? "Along the adjoining passage, both cell doors stand open beside the lowered release bar." : "Lio looks toward the adjoining cells, where the other prisoners are waiting."}` : "You cross the broken command markings toward the transfer rail. Mara follows close to the stopped machinery, looking for Lio beside the carriage frame.",
  };
  if (routes[destination]) return routes[destination];
  if (destination === "hub") return state.brackenDefeated
    ? "You return to the service junction beneath the tally racks. Through the open inner door, lamplight lies across the abandoned guard chairs. Mara pauses beside the pier to listen before following you toward the workrooms and the sheltered court."
    : `You move around the end of the landing rail and settle behind the hub's stone pier. ${state.briarhold.alert === "quiet" ? "The work sounds divide here, letting you pick out the separate passages while remaining beneath the lamps." : state.briarhold.alert === "suspicious" ? "You pause before the opening until a questioning voice recedes, then use the pier to keep out of the next guard's view." : "Orders carry from the inner passage, and you keep the pier between you and the open doorways as you survey the junction."}`;
  if (destination === "landing") return "You leave the hub's junction for the recessed service landing, where empty supply baskets screen the receiving yard. The narrow stair and outer wall give you a smaller pocket of cover than the rooms farther inside.";
  if (destination === "door") return state.briarhold.innerDoorOpened
    ? "You return to the inner doorway. Its released latch rests against the iron plate, leaving the inspection passage open where you passed before."
    : state.briarhold.guardsDistracted
      ? "Keeping close to the service pier, you reach the empty inner post. The guards have gone to the receiving approach, leaving the lock exposed beneath the door handle."
      : "You stop within the service pier's shadow, close enough to study the inner post without stepping into its lamplight. The guard detail still stands between you and the lock.";
  return "You ease through the narrow passage, stopping beneath the inspection grille where the inner chamber's light crosses the wall.";
}
