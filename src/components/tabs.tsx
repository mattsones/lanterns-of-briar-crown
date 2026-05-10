// @ts-nocheck
import { COMPANION_OPTIONS } from "../data/companions";
import { BATTLE_CONSUMABLES, ITEM_DB } from "../data/items";
import { MAPS } from "../data/maps";
import { RECIPE_DB } from "../data/recipes";
import {
  getCompanionAbilityCards,
  getCompanionCommandHint,
} from "../game/companions";
import { titleCase } from "../game/format";
import {
  canCraftRecipe,
  formatIngredients,
  getEquippedCount,
  getItemHighlights,
  itemFitsSlot,
} from "../game/inventory";
import {
  getCompanionGrowthPreview,
  getCompanionXpTarget,
} from "../game/progression";
import { Button, Meter } from "./ui";

export function QuestTab({ journal }) {
  return (
    <div className="mt-3 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="mb-2 text-sm font-semibold">Current Objective</div>
        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4">
          <div className="text-lg font-semibold">
            {journal.currentMain.title}
          </div>
          <div className="mt-2 text-sm text-white/75">
            {journal.currentMain.detail}
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-xs text-white/60">
          Only your next known step is shown here. The rest of the road has to
          be discovered.
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="mb-2 text-sm font-semibold">
          Discovered Side Quests & Threads
        </div>
        <div className="grid gap-3">
          {journal.sideQuests.length ? (
            journal.sideQuests.map((quest) => {
              const done = !!quest.done;
              const active = !!quest.active && !done;
              return (
                <div
                  key={quest.id}
                  className={`rounded-2xl border p-3 ${done ? "border-emerald-300/15 bg-emerald-400/5 text-white/70" : active ? "border-sky-300/20 bg-sky-400/10" : "border-white/10 bg-black/20"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium text-white">
                        {done ? "✓ " : active ? "▶ " : ""}
                        {quest.title}
                      </div>
                      <div className="mt-1 text-sm text-white/70">
                        {quest.detail}
                      </div>
                    </div>
                    <div
                      className={`shrink-0 self-start rounded-full border px-3 py-1 text-xs ${done ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200" : active ? "border-sky-300/20 bg-sky-400/10 text-sky-200" : "border-white/10 bg-white/5 text-white/60"}`}
                    >
                      {quest.status}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/65">
              No side threads discovered yet. Talk to people, read notices, and
              investigate unusual places to uncover more.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export function InventoryTab({
  sections,
  player,
  equipItem,
  setTab,
  setEquipmentFocusSlot,
  setPouchFocusSlot,
  useFieldItem,
}) {
  return (
    <div className="mt-3 space-y-4">
      {[
        ["Equipment", sections.equipment],
        ["Consumables", sections.consumables],
        ["Ingredients & Materials", sections.other],
      ].map(([title, entries]) =>
        entries.length ? (
          <div
            key={title}
            className="rounded-3xl border border-white/10 bg-white/5 p-4"
          >
            <div className="mb-3 text-sm font-semibold">{title}</div>
            <div className="grid gap-3 sm:grid-cols-2">
              {entries.map(([itemId, count]) => {
                const item = ITEM_DB[itemId];
                const equippedCount = getEquippedCount(player, itemId);
                const isInPouch = Object.values(
                  player.battlePouch || {},
                ).includes(itemId);
                return (
                  <div
                    key={itemId}
                    className="rounded-2xl border border-white/10 bg-black/20 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">
                          {item.icon} {item.name}{" "}
                          <span className="text-xs text-white/60">
                            x{count}
                          </span>
                          {equippedCount ? (
                            <span className="ml-2 rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] text-emerald-300">
                              Equipped{" "}
                              {equippedCount > 1 ? `(${equippedCount})` : ""}
                            </span>
                          ) : null}
                          {isInPouch ? (
                            <span className="ml-2 rounded-full bg-sky-400/20 px-2 py-0.5 text-[10px] text-sky-300">
                              Pouch
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-1 text-xs text-white/70">
                          {item.description}
                        </div>
                        {getItemHighlights(item).map((line) => (
                          <div
                            key={line}
                            className="mt-1 text-[11px] text-emerald-300/90"
                          >
                            {line}
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        {item.slot ? (
                          <>
                            <Button
                              onClick={() => equipItem(itemId)}
                              disabled={count - equippedCount <= 0}
                            >
                              Equip
                            </Button>
                            <Button
                              onClick={() => {
                                setTab("equipment");
                                setEquipmentFocusSlot(
                                  item.slot.startsWith("trinket")
                                    ? "trinket1"
                                    : item.slot,
                                );
                              }}
                            >
                              Manage
                            </Button>
                          </>
                        ) : null}
                        {item.type === "consumable" ||
                        BATTLE_CONSUMABLES[itemId] ? (
                          <>
                            <Button onClick={() => useFieldItem(itemId)}>
                              Use
                            </Button>
                            {BATTLE_CONSUMABLES[itemId] ? (
                              <Button
                                onClick={() => {
                                  setTab("pouch");
                                  setPouchFocusSlot("slot1");
                                }}
                              >
                                Pouch
                              </Button>
                            ) : null}
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null,
      )}
    </div>
  );
}
export function EquipmentTab({
  player,
  focusSlot,
  setFocusSlot,
  equipItemToSlot,
  unequipSlot,
}) {
  return (
    <div className="mt-3 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 text-sm font-semibold">Currently Equipped</div>
        <div className="grid gap-2">
          {Object.entries(player.equipment).map(([slot, itemId]) => (
            <button
              key={slot}
              onClick={() => setFocusSlot(slot)}
              className={`rounded-2xl border p-3 text-left ${focusSlot === slot ? "border-emerald-300 bg-emerald-500/10" : "border-white/10 bg-black/20"}`}
            >
              <div className="text-xs uppercase tracking-wide text-white/50">
                {titleCase(slot)}
              </div>
              <div className="mt-1 font-medium">
                {itemId
                  ? `${ITEM_DB[itemId].icon} ${ITEM_DB[itemId].name}`
                  : "Empty"}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex justify-between">
          <div>
            <div className="text-sm font-semibold">
              Options for {titleCase(focusSlot)}
            </div>
            <div className="text-xs text-white/60">
              Choose what Liam is wearing.
            </div>
          </div>
          <Button
            onClick={() => unequipSlot(focusSlot)}
            disabled={!player.equipment[focusSlot]}
          >
            Remove
          </Button>
        </div>
        <div className="grid gap-3">
          {Object.entries(player.inventory)
            .filter(
              ([id, count]) =>
                count > 0 && itemFitsSlot(ITEM_DB[id], focusSlot),
            )
            .map(([id, count]) => {
              const item = ITEM_DB[id];
              const already = player.equipment[focusSlot] === id;
              const available =
                count - getEquippedCount(player, id) + (already ? 1 : 0);
              return (
                <div
                  key={id}
                  className="rounded-2xl border border-white/10 bg-black/20 p-3"
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <div className="font-medium">
                        {item.icon} {item.name}
                      </div>
                      <div className="mt-1 text-xs text-white/70">
                        {item.description}
                      </div>
                      {getItemHighlights(item).map((line) => (
                        <div
                          key={line}
                          className="mt-1 text-[11px] text-emerald-300/90"
                        >
                          {line}
                        </div>
                      ))}
                      <div className="mt-1 text-[11px] text-white/50">
                        Owned: {count} • Free copies: {Math.max(0, available)}
                      </div>
                    </div>
                    <Button
                      onClick={() => equipItemToSlot(id, focusSlot)}
                      disabled={already || available <= 0}
                    >
                      {already
                        ? "Equipped"
                        : player.equipment[focusSlot]
                          ? "Replace"
                          : "Equip"}
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
export function PouchTab({ player, focusSlot, setFocusSlot, assign, clear }) {
  return (
    <div className="mt-3 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 text-sm font-semibold">Battle Pouch</div>
        {["slot1", "slot2"].map((slot, i) => {
          const itemId = player.battlePouch?.[slot];
          return (
            <button
              key={slot}
              onClick={() => setFocusSlot(slot)}
              className={`mb-2 w-full rounded-2xl border p-3 text-left ${focusSlot === slot ? "border-sky-300 bg-sky-500/10" : "border-white/10 bg-black/20"}`}
            >
              <div className="text-xs uppercase tracking-wide text-white/50">
                Battle Pouch Slot {i + 1}
              </div>
              <div className="mt-1 font-medium">
                {itemId
                  ? `${ITEM_DB[itemId]?.icon} ${ITEM_DB[itemId]?.name}`
                  : "Empty"}
              </div>
            </button>
          );
        })}
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex justify-between">
          <div>
            <div className="text-sm font-semibold">
              Options for {focusSlot === "slot1" ? "Slot 1" : "Slot 2"}
            </div>
            <div className="text-xs text-white/60">
              Quick-access combat items.
            </div>
          </div>
          <Button
            onClick={() => clear(focusSlot)}
            disabled={!player.battlePouch?.[focusSlot]}
          >
            Clear Slot
          </Button>
        </div>
        <div className="grid gap-3">
          {Object.entries(player.inventory)
            .filter(([id, count]) => count > 0 && BATTLE_CONSUMABLES[id])
            .map(([id, count]) => (
              <div
                key={id}
                className="rounded-2xl border border-white/10 bg-black/20 p-3"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <div className="font-medium">
                      {ITEM_DB[id].icon} {ITEM_DB[id].name}{" "}
                      <span className="text-xs text-white/60">x{count}</span>
                    </div>
                    <div className="mt-1 text-xs text-white/70">
                      Restores {BATTLE_CONSUMABLES[id].heal} HP.
                    </div>
                  </div>
                  <Button
                    onClick={() => assign(focusSlot, id)}
                    disabled={player.battlePouch?.[focusSlot] === id}
                  >
                    {player.battlePouch?.[focusSlot] === id
                      ? "Equipped"
                      : "Assign"}
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
export function CompanionTab({ companion, setCompanion, flags, dismiss }) {
  return (
    <div className="mt-3 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 text-sm font-semibold">Active Companion</div>
        {companion.recruited ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-3xl">{companion.icon}</div>
              <div className="mt-2 text-lg font-semibold">{companion.name}</div>
              <div className="text-sm text-emerald-300">
                {companion.role} • Lv {companion.level || 1}
              </div>
            </div>
            <Meter
              value={companion.hp}
              max={companion.maxHp}
              label={`${companion.name} HP`}
              colorClass="bg-rose-400"
            />
            <select
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2"
              value={companion.command}
              onChange={(e) =>
                setCompanion((c) => ({ ...c, command: e.target.value }))
              }
            >
              {["Attack Freely", "Defend Me", "Use Support Skills"].map((o) => (
                <option key={o} className="bg-slate-900">
                  {o}
                </option>
              ))}
            </select>
            <div className="rounded-2xl bg-white/5 p-3 text-sm text-white/75">
              {getCompanionCommandHint(companion)}
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm">
              Companion XP: {companion.xp || 0} /{" "}
              {getCompanionXpTarget(
                flags.companionChoice,
                companion.level || 1,
              ) || "Max"}
            </div>
            <Button onClick={dismiss}>Ask companion to wait at the inn</Button>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/75">
            No companion is currently traveling with you.
          </div>
        )}
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 text-sm font-semibold">
          Abilities & Future Growth
        </div>
        {companion.recruited ? (
          <div className="space-y-3">
            {getCompanionAbilityCards(companion).map((a) => (
              <div
                key={a.name}
                className="rounded-2xl border border-white/10 bg-black/20 p-3"
              >
                <div className="font-medium">{a.name}</div>
                <div className="mt-1 text-sm text-white/75">
                  {a.description}
                </div>
              </div>
            ))}
            {(
              companion.futurePathOptions ||
              getCompanionGrowthPreview(flags.companionChoice)
            ).map((path) => (
              <div
                key={path.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-3"
              >
                <div className="font-medium">Future path: {path.name}</div>
                <div className="mt-1 text-sm text-white/75">{path.preview}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {Object.values(COMPANION_OPTIONS).map((o) => (
              <div
                key={o.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-3"
              >
                <div className="font-medium">
                  {o.icon} {o.name}
                </div>
                <div className="text-sm text-emerald-300">{o.role}</div>
                <div className="mt-1 text-sm text-white/75">
                  {o.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export function RecipesTab({ player }) {
  return (
    <div className="mt-3 space-y-3">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
        Recipe notes only. Actual crafting happens at the Potion Shed or a road
        camp.
      </div>
      {Object.values(RECIPE_DB).map((recipe) => {
        const item = ITEM_DB[recipe.resultId];
        return (
          <div
            key={recipe.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="font-medium">
              {item.icon} {recipe.name}
            </div>
            <div className="mt-1 text-sm text-white/75">{recipe.note}</div>
            <div className="mt-2 text-xs text-white/60">
              Ingredients: {formatIngredients(recipe.ingredients)}
            </div>
            <div
              className={`mt-2 inline-block rounded-full px-3 py-1 text-xs ${canCraftRecipe(player, recipe) ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-white/60"}`}
            >
              {canCraftRecipe(player, recipe)
                ? "Ready at station"
                : "Missing items"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
export function DevTab({
  qaResults,
  runQaChecks,
  giveSupplies,
  heal,
  reset,
  jump,
  player,
  position,
  region,
  companion,
  mapDebug,
  setMapDebug,
}) {
  return (
    <div className="mt-3 space-y-4">
      <div className="rounded-3xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-white/80">
        Prototype-only tools for faster testing.
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 text-sm font-semibold">Smoke Tests</div>
          <Button onClick={runQaChecks}>Run QA Checks</Button>
          <div className="mt-3 grid gap-2">
            {qaResults.length ? (
              qaResults.map((r, i) => (
                <div
                  key={`${r.label}-${i}`}
                  className={`rounded-2xl border px-3 py-2 text-sm ${r.ok ? "border-emerald-300/20 bg-emerald-400/10" : "border-rose-300/30 bg-rose-400/10"}`}
                >
                  <div className="font-medium">
                    {r.ok ? "✓" : "⚠"} {r.label}
                  </div>
                  <div className="mt-1 text-xs text-white/65">{r.detail}</div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-white/65">
                No QA checks run yet.
              </div>
            )}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 text-sm font-semibold">Test Shortcuts</div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button onClick={giveSupplies}>Give Supplies</Button>
            <Button onClick={heal}>Heal Party</Button>
            <Button onClick={reset}>Reset Fights</Button>
            <Button
              onClick={() => setMapDebug((value) => !value)}
              className={mapDebug ? "bg-sky-500/30" : ""}
            >
              {mapDebug ? "Hide Map Debug" : "Show Map Debug"}
            </Button>
          </div>
          <div className="mt-4 text-xs uppercase tracking-wide text-white/50">
            Jump to region
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {Object.entries(MAPS).map(([id, map]) => (
              <Button key={id} onClick={() => jump(id)}>
                {map.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-black/20 p-3">
            Region: {MAPS[region].name}
          </div>
          <div className="rounded-2xl bg-black/20 p-3">
            Position: {position.x}, {position.y}
          </div>
          <div className="rounded-2xl bg-black/20 p-3">Gold: {player.gold}</div>
          <div className="rounded-2xl bg-black/20 p-3">
            Companion: {companion.recruited ? companion.name : "None"}
          </div>
        </div>
      </div>
    </div>
  );
}
