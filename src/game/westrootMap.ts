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
  const bramwell = hallIsMeeting
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
        y: 3,
        offsetX: 5.4,
        offsetY: -5.8,
      };

  const noma = !flags.westrootHoldBellRung || flags.chapterThreeClear
    ? {
        id: "noma",
        name: flags.metNoma ? "Noma Greenstill" : "Mossback caretaker",
        portraitName: "Noma Greenstill",
        x: 3,
        y: 0,
        offsetX: 1.4,
        offsetY: 1.2,
      }
    : flags.splitHallDebateHeard && !flags.witnessStoneSequenceSolved
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
      x: 7,
      y: 5,
      offsetX: -1.8,
      offsetY: -2.1,
    });
  }
  return tokens;
}
