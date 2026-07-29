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
  | "metQuill"
  | "metAuntieLume"
  | "westrootHoldBellRung"
  | "splitHallDebateHeard"
  | "witnessStoneSequenceSolved"
  | "willowCargoExposed"
  | "chapterThreeClear"
  | "rootbreadLeadLearned"
  | "rootbreadPromiseKept"
>;

export function getWestrootMapNpcTokens(
  flags: WestrootMapFlags,
): MapNpcToken[] {
  const beforeHoldBell = !flags.westrootHoldBellRung;
  const stonesAreGathering = flags.splitHallDebateHeard && !flags.witnessStoneSequenceSolved;
  const sidingIsOpening = flags.witnessStoneSequenceSolved && !flags.willowCargoExposed;
  const hallIsMeeting =
    flags.westrootHoldBellRung &&
    !stonesAreGathering &&
    !sidingIsOpening &&
    !flags.chapterThreeClear;
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
    : sidingIsOpening
      ? {
          id: "bramwell",
          name: "Bramwell Gatehand",
          portraitName: "Bramwell Gatehand",
          x: 7,
          y: 2,
          offsetX: -2.6,
          offsetY: 2.4,
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

  const noma =
    beforeHoldBell || flags.chapterThreeClear
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
        : sidingIsOpening
          ? {
              id: "noma",
              name: "Noma Greenstill",
              portraitName: "Noma Greenstill",
              x: 7,
              y: 2,
              offsetX: 0,
              offsetY: 2.4,
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
  if (beforeHoldBell) {
    tokens.push(
      {
        id: "quill",
        name: flags.metQuill ? "Quill Pebbleturn" : "Stonekin shutter-mender",
        portraitName: "Quill Pebbleturn",
        x: 3,
        y: 6,
        offsetX: -2.3,
        offsetY: -2.2,
      },
      {
        id: "lume",
        name: flags.metAuntieLume ? "Auntie Lume" : "Mossback baker",
        portraitName: "Auntie Lume",
        x: 3,
        y: 6,
        offsetX: 2.3,
        offsetY: -2.2,
      },
    );
  } else if (stonesAreGathering) {
    tokens.push(
      {
        id: "quill",
        name: "Quill Pebbleturn",
        portraitName: "Quill Pebbleturn",
        x: 4,
        y: 1,
        offsetX: 2.1,
        offsetY: 2.6,
      },
      {
        id: "lume",
        name: "Auntie Lume",
        portraitName: "Auntie Lume",
        x: 4,
        y: 1,
        offsetX: 4.2,
        offsetY: 2.6,
      },
    );
  } else if (sidingIsOpening) {
    tokens.push({
      id: "quill",
      name: "Quill Pebbleturn",
      portraitName: "Quill Pebbleturn",
      x: 7,
      y: 2,
      offsetX: 2.6,
      offsetY: 2.4,
    });
  } else if (hallIsMeeting) {
    tokens.push(
      {
        id: "quill",
        name: "Quill Pebbleturn",
        portraitName: "Quill Pebbleturn",
        x: 5,
        y: 2,
        offsetX: 0,
        offsetY: -2,
      },
      {
        id: "lume",
        name: "Auntie Lume",
        portraitName: "Auntie Lume",
        x: 5,
        y: 2,
        offsetX: 4.2,
        offsetY: 0.6,
      },
    );
  } else if (flags.chapterThreeClear) {
    tokens.push({
      id: "lume",
      name: "Auntie Lume",
      portraitName: "Auntie Lume",
      x: 3,
      y: 6,
    });
  }
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
