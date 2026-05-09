export function tickCooldowns(cooldowns: Record<string, number> = {}) {
  return Object.fromEntries(
    Object.entries(cooldowns)
      .map(([id, value]) => [id, Math.max(0, (value || 0) - 1)] as const)
      .filter(([, value]) => value > 0),
  );
}
