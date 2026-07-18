import type { Companion, RollSpec } from "./types";

export const COMPANION_COMMANDS = [
  "Attack Freely",
  "Defend Me",
  "Use Support Skills",
] as const;

export type CompanionCommand = (typeof COMPANION_COMMANDS)[number];

export type CompanionAbility = {
  command: CompanionCommand;
  commandLabel: "Attack" | "Defend" | "Support";
  name: string;
  description: string;
  effect: {
    damage?: RollSpec;
    heroGuard?: number;
    weaken?: boolean;
    heroHeal?: number;
    companionHeal?: number;
  };
};

export function isCompanionConscious(
  companion?: Partial<Companion> | null,
) {
  return !!companion?.recruited && (companion.hp || 0) > 0;
}

const ABILITIES_BY_STYLE: Record<
  string,
  Record<CompanionCommand, CompanionAbility>
> = {
  guardian: {
    "Attack Freely": {
      command: "Attack Freely",
      commandLabel: "Attack",
      name: "Linebreaker",
      description: "Strikes the selected enemy for 1d4+2 damage.",
      effect: { damage: { count: 1, sides: 4, bonus: 2 } },
    },
    "Defend Me": {
      command: "Defend Me",
      commandLabel: "Defend",
      name: "Shielding Step",
      description: "Moves to protect you, granting 4 Guard for the next enemy turn.",
      effect: { heroGuard: 4 },
    },
    "Use Support Skills": {
      command: "Use Support Skills",
      commandLabel: "Support",
      name: "Steadying Support",
      description: "Restores 2 HP to both you and Rowan.",
      effect: { heroHeal: 2, companionHeal: 2 },
    },
  },
  skirmisher: {
    "Attack Freely": {
      command: "Attack Freely",
      commandLabel: "Attack",
      name: "Quick Feint",
      description: "Strikes the selected enemy for 1d6+1 damage.",
      effect: { damage: { count: 1, sides: 6, bonus: 1 } },
    },
    "Defend Me": {
      command: "Defend Me",
      commandLabel: "Defend",
      name: "Spoil the Timing",
      description: "Distracts the selected enemy, reducing its next attack by 2.",
      effect: { weaken: true },
    },
    "Use Support Skills": {
      command: "Use Support Skills",
      commandLabel: "Support",
      name: "Pocket Tricks",
      description: "Creates an opening with a dirty trick: 1d4 damage and 2 Guard for you.",
      effect: { damage: { count: 1, sides: 4 }, heroGuard: 2 },
    },
  },
  sage: {
    "Attack Freely": {
      command: "Attack Freely",
      commandLabel: "Attack",
      name: "Subtle Pressure",
      description: "Strikes the selected enemy with old magic for 1d4+1 damage.",
      effect: { damage: { count: 1, sides: 4, bonus: 1 } },
    },
    "Defend Me": {
      command: "Defend Me",
      commandLabel: "Defend",
      name: "Quiet Ward",
      description: "Raises a quiet ward, granting you 3 Guard for the next enemy turn.",
      effect: { heroGuard: 3 },
    },
    "Use Support Skills": {
      command: "Use Support Skills",
      commandLabel: "Support",
      name: "Field Mending",
      description: "Restores 4 HP to you and 2 HP to Moss.",
      effect: { heroHeal: 4, companionHeal: 2 },
    },
  },
};

function normalizeCompanionCommand(command?: string): CompanionCommand {
  return COMPANION_COMMANDS.includes(command as CompanionCommand)
    ? (command as CompanionCommand)
    : "Attack Freely";
}

export function getCompanionCommandAbility(
  companion?: Partial<Companion> | null,
  command = companion?.command,
) {
  const abilities = ABILITIES_BY_STYLE[String(companion?.style)];
  return abilities?.[normalizeCompanionCommand(command)] || null;
}

export function getCompanionCommandOptions(
  companion?: Partial<Companion> | null,
) {
  return COMPANION_COMMANDS.map((command) => {
    const ability = getCompanionCommandAbility(companion, command);
    return {
      value: command,
      label: ability
        ? `${ability.commandLabel}: ${ability.name}`
        : command,
    };
  });
}

export function getCompanionCommandHint(
  companion?: Partial<Companion> | null,
) {
  if (!companion?.recruited) return "";
  if (!isCompanionConscious(companion))
    return `${companion.name || "Your companion"} is down and must recover before acting.`;
  const ability = getCompanionCommandAbility(companion);
  return ability
    ? `${ability.name}: ${ability.description}`
    : "Your companion is ready to help.";
}

export function getCompanionAbilityCards(
  companion?: Partial<Companion> | null,
) {
  return COMPANION_COMMANDS.map((command) =>
    getCompanionCommandAbility(companion, command),
  ).filter((ability): ability is CompanionAbility => !!ability);
}
