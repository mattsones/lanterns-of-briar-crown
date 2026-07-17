import { useEffect, useRef, type ReactNode } from "react";
import { CompanionPortrait } from "./CompanionPortrait";
import { HeroArtwork } from "./HeroArtwork";
import { Button, Meter, StatBadge } from "./ui";

const PLAYER_MENU_TABS = [
  ["character", "Character"],
  ["quests", "Quests"],
  ["inventory", "Inventory"],
  ["equipment", "Equipment"],
  ["pouch", "Battle Pouch"],
  ["companion", "Companion"],
  ["crafting", "Recipes"],
];

const GLANCE_STATS = ["Might", "Guard", "Agility", "Wit"];

export function AdventureStatusRail({
  player,
  ancestryLabel,
  raceTrait,
  heroXpTarget,
  questJournal,
  companion,
  derivedStats,
  openWorkspace,
  openCharacter,
}) {
  return (
    <aside className="hidden lg:block" aria-label="Adventure status">
      <section className="story-panel sticky top-4 rounded-3xl border border-white/10 bg-slate-900/80 p-4 shadow-2xl backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">{player.name}</h2>
            <div className="mt-0.5 text-xs text-white/55">
              Level {player.level} · {ancestryLabel}
            </div>
          </div>
          <button
            type="button"
            onClick={openCharacter}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Character
          </button>
        </div>

        <div className="mt-4 grid grid-cols-[5rem_minmax(0,1fr)] gap-3">
          <HeroArtwork player={player} variant="portrait" className="h-28 w-20" />
          <div className="min-w-0 space-y-3">
            <Meter value={player.hp} max={player.maxHp} label="HP" />
            <Meter
              value={heroXpTarget ? Math.min(player.xp, heroXpTarget) : player.xp}
              max={heroXpTarget || player.xp || 1}
              label={heroXpTarget ? "XP" : "Max-level XP"}
              colorClass="bg-sky-400"
            />
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
              <span className="text-yellow-300">{player.gold} gold</span>
              <span className="text-white/50">{raceTrait}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-emerald-200/15 bg-emerald-400/10 p-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200/70">
            Current objective
          </div>
          <div className="mt-1 font-semibold">{questJournal.currentMain.title}</div>
          <div className="mt-1 line-clamp-3 text-xs leading-5 text-white/65">
            {questJournal.currentMain.detail}
          </div>
        </div>

        {companion.recruited ? (
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
            <CompanionPortrait companion={companion} className="h-14 w-14" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{companion.name}</div>
              <div className="text-xs text-white/50">{companion.role}</div>
              <div className="mt-1 text-xs text-rose-200/80">
                HP {companion.hp}/{companion.maxHp}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-3 rounded-2xl border border-dashed border-white/10 bg-black/10 px-3 py-2 text-xs text-white/45">
            No active companion
          </div>
        )}

        <div className="mt-3 grid grid-cols-4 gap-2">
          {GLANCE_STATS.map((stat) => (
            <StatBadge key={stat} label={stat} value={derivedStats[stat]} />
          ))}
        </div>

        <Button
          data-testid="open-adventure-menu"
          className="mt-4 flex w-full items-center justify-between bg-amber-300/15 px-4 py-3 text-left"
          onClick={openWorkspace}
        >
          <span>Open Adventure Menu</span>
          <span className="rounded-lg bg-black/20 px-2 py-1 text-[10px] text-white/55">M</span>
        </Button>
      </section>
    </aside>
  );
}

export function MobileAdventureBar({ player, objective, openWorkspace }) {
  const hpPercent = Math.max(0, Math.min(100, (player.hp / Math.max(1, player.maxHp)) * 100));

  return (
    <div className="mobile-adventure-bar lg:hidden" aria-label="Adventure status and menu">
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="truncate font-semibold">{player.name} · Lv {player.level}</span>
          <span className="shrink-0 text-emerald-200">{player.hp}/{player.maxHp} HP</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-emerald-400" style={{ width: `${hpPercent}%` }} />
        </div>
        <div className="mt-1 truncate text-[11px] text-white/60">{objective}</div>
      </div>
      <Button data-testid="open-adventure-menu-mobile" className="shrink-0 bg-amber-300/15" onClick={openWorkspace}>
        Menu
      </Button>
    </div>
  );
}

export function AdventureWorkspace({
  open,
  tab,
  setTab,
  close,
  companion,
  children,
}: {
  open: boolean;
  tab: string;
  setTab: (tab: string) => void;
  close: () => void;
  companion: any;
  children: ReactNode;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawerRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="adventure-workspace-backdrop" onMouseDown={close}>
      <div
        ref={drawerRef}
        data-testid="adventure-workspace"
        role="dialog"
        aria-modal="true"
        aria-labelledby="adventure-workspace-title"
        tabIndex={-1}
        className="adventure-workspace"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="adventure-workspace-header">
          <div className="min-w-0">
            <h2 id="adventure-workspace-title" className="text-2xl font-semibold">Adventure Menu</h2>
            <div className="mt-1 truncate text-xs text-white/55">
              {companion.recruited
                ? `${companion.name} · ${companion.role} · HP ${companion.hp}/${companion.maxHp}`
                : "No active companion"}
            </div>
          </div>
          <Button aria-label="Close Adventure Menu" onClick={close}>Close</Button>
        </header>

        <nav aria-label="Adventure menus" className="adventure-workspace-tabs">
          {PLAYER_MENU_TABS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-current={tab === id ? "page" : undefined}
              className={tab === id ? "is-active" : ""}
            >
              {label}
            </button>
          ))}
          {import.meta.env.DEV ? (
            <details className="adventure-workspace-more" open={tab === "dev"}>
              <summary>More</summary>
              <button
                type="button"
                onClick={() => setTab("dev")}
                aria-current={tab === "dev" ? "page" : undefined}
              >
                Dev Tools
              </button>
            </details>
          ) : null}
        </nav>

        <div className="adventure-workspace-content">{children}</div>
      </div>
    </div>
  );
}

export function CharacterWorkspace({
  player,
  ancestryLabel,
  raceTrait,
  heroXpTarget,
  questJournal,
  derivedStats,
  statOrder,
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[15rem_minmax(0,1fr)]">
      <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-center">
        <HeroArtwork player={player} variant="portrait" className="mx-auto h-64 w-full max-w-52" />
        <div className="mt-3 text-2xl font-semibold">{player.name}</div>
        <div className="text-sm text-white/60">Level {player.level} · {ancestryLabel}</div>
        <div className="mt-1 text-sm text-emerald-300">{raceTrait}</div>
        <div className="mt-3 text-xs text-white/45">Checkpoint: {player.checkpointLabel}</div>
      </div>

      <div className="space-y-4">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Meter value={player.hp} max={player.maxHp} label="HP" />
            <Meter
              value={heroXpTarget ? Math.min(player.xp, heroXpTarget) : player.xp}
              max={heroXpTarget || player.xp || 1}
              label={heroXpTarget ? "XP to next level" : "Max-level XP"}
              colorClass="bg-sky-400"
            />
          </div>
          <div className="mt-4 text-sm text-yellow-300">Gold: {player.gold}</div>
        </section>

        <section className="rounded-3xl border border-emerald-200/15 bg-emerald-400/10 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200/70">Current objective</div>
          <div className="mt-1 text-lg font-semibold">{questJournal.currentMain.title}</div>
          <div className="mt-1 text-sm leading-6 text-white/70">{questJournal.currentMain.detail}</div>
        </section>

        <section>
          <h3 className="mb-3 text-lg font-semibold">Full character stats</h3>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {statOrder.map((stat) => (
              <StatBadge
                key={stat}
                label={stat}
                value={derivedStats[stat]}
                bonus={Math.max(0, (derivedStats[stat] || 0) - (player.baseStats[stat] || 0))}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
