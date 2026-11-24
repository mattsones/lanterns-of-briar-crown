import { getChapter5MapPosition, getChapter5PaintedLayout, isChapter5MapWaypoint, type Chapter5MapDirection, type Chapter5MapPoint } from "../data/chapter5Maps";
import { canLeaveChapter5Scene, getChapter5Edges, leaveChapter5Scene, moveChapter5, type Chapter5Node, type Chapter5SaveState } from "./chapter5Runtime";
import type { Companion } from "./types";

const reverse = { up: "down", down: "up", left: "right", right: "left" } as const;
const movementBlocked = (s: Chapter5SaveState) => !canLeaveChapter5Scene(s);

export function getChapter5MapNeighbors(s: Chapter5SaveState, source = getChapter5MapPosition(s)) {
  const layout = getChapter5PaintedLayout(s);
  if (!layout || movementBlocked(s)) return [];
  return layout.edges.flatMap(edge => {
    if (edge.gate === "workshop-visited" && s.node !== "workshop") return [];
    if (edge.gate === "first-sight" && !s.lioSeen || edge.gate === "boss" && !s.brackenDefeated || edge.gate === "rescued" && s.carriageStage !== "rescued") return [];
    // The unacknowledged first sight cannot be backed out of through a raw save.
    if (source === "grille" && !s.lioSeen) return [];
    return edge.from === source ? [{ id: edge.to, direction: edge.direction }] :
      edge.to === source ? [{ id: edge.from, direction: reverse[edge.direction] }] : [];
  });
}

export function stepChapter5Map(s: Chapter5SaveState, target: Chapter5MapPoint, companion?: Companion): Chapter5SaveState {
  if (!getChapter5MapNeighbors(s).some(n => n.id === target)) return s;
  const leavingDistraction = s.view === "ledger" && s.ledgerOfficerDistracted;
  s = leaveChapter5Scene(s, companion);
  if (isChapter5MapWaypoint(target)) return { ...s, mapWaypoint: target, feedback: leavingDistraction ? s.feedback : "" };
  if (target === s.node) return { ...s, mapWaypoint: null };
  let origin = s.node;
  if (!getChapter5Edges(s).some(([a, b]) => a === origin && b === target || b === origin && a === target)) {
    // The gallery and east bend join physical routes without an unnecessary
    // return to a story trigger. Reuse its existing gated transition at the exit.
    if (target === "door" && s.lioSeen) origin = "grille";
    else if (target === "carriage" && s.brackenDefeated || target === "grille" && s.lioSeen) origin = "crown";
    else return s;
  }
  return moveChapter5({ ...s, node: origin, mapWaypoint: null }, target as Chapter5Node, companion);
}

// A named-landmark click follows the same checked corridor as individual arrow
// steps. It cannot cross another unseen scene, a gate, or the rescue emergency.
export function walkChapter5MapTo(s: Chapter5SaveState, target: Chapter5MapPoint, companion?: Companion): Chapter5SaveState {
  const layout = getChapter5PaintedLayout(s);
  if (!layout) {
    if ((target === "l00" || target === "w00") && s.started && s.node === "hub" && s.briarhold.entry &&
      !s.departed && !s.returnedToBramblecross && canLeaveChapter5Scene(s)) {
      return { ...leaveChapter5Scene(s, companion), mapWaypoint: target, feedback: "" };
    }
    if (isChapter5MapWaypoint(target)) return s;
    const ready = leaveChapter5Scene(s, companion);
    const next = moveChapter5(ready, target, companion);
    return next === ready ? s : next;
  }
  if (movementBlocked(s) || !layout.nodes[target]) return s;
  if (isChapter5MapWaypoint(target)) return stepChapter5Map(s, target, companion);
  const adjacent = target === s.node || getChapter5Edges(s).some(([a, b]) => a === s.node && b === target || b === s.node && a === target);
  if (!adjacent && !(layout.id === "briarholdCrownTable" && target === "door" && s.lioSeen)) return s;
  const queue: Chapter5MapPoint[][] = [[getChapter5MapPosition(s)]];
  const visited = new Set<Chapter5MapPoint>();
  while (queue.length) {
    const path = queue.shift()!;
    const current = path[path.length - 1];
    if (current === target) {
      let next = leaveChapter5Scene(s, companion);
      for (const point of path.slice(1)) {
        const moved = stepChapter5Map(next, point, companion);
        if (moved === next || moved.view && point !== target) return s;
        next = moved;
      }
      return next;
    }
    if (visited.has(current)) continue;
    visited.add(current);
    for (const neighbor of getChapter5MapNeighbors(s, current)) if (!visited.has(neighbor.id)) queue.push([...path, neighbor.id]);
  }
  return s;
}

export function moveChapter5OnMap(s: Chapter5SaveState, direction: Chapter5MapDirection, companion?: Companion) {
  const target = getChapter5MapNeighbors(s).find(n => n.direction === direction);
  return target ? stepChapter5Map(s, target.id, companion) : s;
}
