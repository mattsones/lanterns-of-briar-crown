import type { Flags } from "./types";

export type MapNpcToken = {
  id: string;
  name: string;
  portraitName: string;
  x: number;
  y: number;
  offsetX?: number;
  offsetY?: number;
  portraitFocus?: { x: number; y: number; scale?: number };
};

type WestrootMapFlags = Pick<
  Flags,
  | "metNoma"
  | "westrootHoldBellRung"
  | "splitHallDebateHeard"
  | "witnessStoneSequenceSolved"
  | "chapterThreeClear"
  | "rootbreadLeadLearned"
  | "rootbreadPromiseKept"
>;

export function getWestrootMapNpcTokens(
  flags: WestrootMapFlags,
): MapNpcToken[] {
  const hallIsMeeting = flags.westrootHoldBellRung && !flags.chapterThreeClear;
  const stonesAreGathering = flags.splitHallDebateHeard && !flags.witnessStoneSequenceSolved;
  const bramwell = stonesAreGathering
    ? {
        id: "bramwell",
        name: "Bramwell Gatehand",
        portraitName: "Bramwell Gatehand",
        x: 4,
        y: 1,
        offsetX: -2.1,
        offsetY: 2.6,
      }
    : hallIsMeeting
    ? {
        id: "bramwell",
        name: "Bramwell Gatehand",
        portraitName: "Bramwell Gatehand",
        x: 5,
        y: 2,
        offsetX: -2.1,
        offsetY: 0.6,
      }
    : {
        id: "bramwell",
        name: "Bramwell Gatehand",
        portraitName: "Bramwell Gatehand",
        x: 1,
        y: 4,
      };

  const noma = !flags.westrootHoldBellRung || flags.chapterThreeClear
    ? {
        id: "noma",
        name: flags.metNoma ? "Noma Greenstill" : "Mossback caretaker",
        portraitName: "Noma Greenstill",
        x: 3,
        y: 0,
      }
    : stonesAreGathering
      ? {
          id: "noma",
          name: "Noma Greenstill",
          portraitName: "Noma Greenstill",
          x: 4,
          y: 1,
          offsetX: 0,
          offsetY: 2.6,
        }
      : {
          id: "noma",
          name: "Noma Greenstill",
          portraitName: "Noma Greenstill",
          x: 5,
          y: 2,
          offsetX: 2.1,
          offsetY: 0.6,
        };

  const tokens: MapNpcToken[] = [bramwell, noma];
  if (flags.rootbreadLeadLearned && !flags.rootbreadPromiseKept) {
    tokens.push({
      id: "rootbread-child",
      name: "Westroot child",
      portraitName: "Westroot Rootbread Child",
      x: 1,
      y: 3,
      offsetX: 2,
      offsetY: -2.4,
    });
  }
  return tokens;
}
