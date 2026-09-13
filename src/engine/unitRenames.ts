/**
 * Units the author has RENAMED or REMOVED between codex versions.
 *
 * WHY THIS EXISTS: a saved army stores each entry by unit NAME. When a datasheet is renamed the
 * name stops resolving, and `resolveUnit()` returns undefined — at which point every consumer in
 * the app does `if (!u) ... : 0`. The result is the worst possible failure: the entry renders
 * NOTHING (UnitCard returns null), contributes ZERO points to the total, and still occupies its
 * saved slot. The player sees a slot header reading "1 unit · 0 pts" with no card beneath it, and
 * an army that quietly costs less than it did yesterday. Measured, not assumed — see the probe in
 * the known-issues entry.
 *
 * So two things live here:
 *
 *   RENAMED_UNITS — mapped forward on load, so a rename is invisible to the player. Same idea as
 *   RENAMED_ARCHETYPES in archetypes/index.ts. Keep entries FOREVER: they cost nothing and
 *   deleting one breaks somebody's saved list.
 *
 *   REMOVED_UNITS — a datasheet the author actually deleted. Nothing can be mapped forward, so
 *   this only supplies a specific message instead of a generic one. Detection does NOT depend on
 *   this table: validators.ts flags ANY entry that fails to resolve, so a removal nobody recorded
 *   here is still caught, just described in general terms.
 *
 * Both are keyed by the faction's DISPLAY name (state.faction / data.faction), because unit names
 * are only unique within a faction — "Warriors" is a Necron datasheet and a Tyranid one.
 */

/**
 * A rename target. A plain string is just the new name; the object form ALSO switches on a variant
 * upgrade, for a datasheet that was absorbed as an upgrade of another rather than merely renamed.
 * The upgrade is found by its `variant_link`, not by option index, so re-ordering the datasheet's
 * option groups cannot silently point it at the wrong one.
 */
export type UnitRenameTarget = string | { to: string; enableVariant: string };

/** faction → { old datasheet name → current datasheet name } */
export const RENAMED_UNITS: Record<string, Record<string, UnitRenameTarget>> = {
  // Adeptus Custodes codex 1.01 (September 2026) consolidated the Fast Attack "Jetbike Custodians"
  // and the Elites "Vertus Praetor" into one Fast Attack datasheet, "Vertus Praetors". The
  // survivor is the former Jetbike Custodians unchanged (151 pts, same weapons and swaps), so both
  // old names map straight onto it and no saved army loses a unit. Keep these forever.
  'Adeptus Custodes': {
    'Jetbike Custodians': 'Vertus Praetors',
    'Vertus Praetor': 'Vertus Praetors',
  },
  // Tyranids codex 2026-09: "Consolidated Swarm Lord with Hive Tyrant and added a Legendary Hive
  // Tyrant upgrade." The Swarmlord cost 339 and the Legendary Hive Tyrant costs 339, so the
  // upgrade has to come with the rename — a bare rename would hand the player a 256-point Hive
  // Tyrant and quietly take 83 points and a statline off their army.
  'Tyranids': {
    'Swarmlord': { to: 'Hive Tyrant', enableVariant: 'Legendary Hive Tyrant' },
    'Swarm Lord': { to: 'Hive Tyrant', enableVariant: 'Legendary Hive Tyrant' },
  },
};

/** faction → { deleted datasheet name → short note shown to the player } */
export const REMOVED_UNITS: Record<string, Record<string, string>> = {
  // Still empty, and that is the right answer so far: BOTH of the update's apparent removals turned
  // out to be CONSOLIDATIONS, which belong in RENAMED_UNITS above instead. Adeptus Custodes folded
  // "Jetbike Custodians" and "Vertus Praetor" into "Vertus Praetors" (done). Tyranids folds the
  // "Swarmlord" into the "Hive Tyrant" plus a "Legendary Hive Tyrant" upgrade — that one is a
  // rename ONTO a unit plus an option, so it needs the Tyranid pass, not an entry here.
  // Only a datasheet with no successor at all belongs below; adding one early would
  // report a removal that has not happened.
};

/**
 * Armoury ITEMS the author has renamed. Same problem, same shape: an `ArmorySelection` stores the
 * item by NAME, so a rename makes it stop resolving — and an unresolvable selection is not even
 * stripped, it just silently contributes nothing while still sitting in the list.
 *
 * The Tau case is why this needs care rather than a blind rename. The codex had TWO armoury
 * entries both literally called "Krootox steed" (a long-standing question for the author). Lookup
 * returns the FIRST, so every saved list holding one actually owns the +6" Movement / "Bike" one.
 * Codex 2026-09 renames exactly that entry to "Kalamandra steed" and leaves the other alone — so
 * without this mapping every existing selection would silently become the OTHER item, with
 * different rules and a different price. Mapped forward, they keep what they bought.
 */
export const RENAMED_ARMORY_ITEMS: Record<string, Record<string, string>> = {
  'Tau Empire': {
    'Krootox steedᴵ': 'Kalamandra steedᴵ',
  },
};

/**
 * Option GROUPS the author deleted from a datasheet, by their index in the PREVIOUS codex version.
 *
 * Same failure mode as a rename, one level down. `optionQty` is keyed by group INDEX
 * (`optionQty[groupIndex][choiceIndex]`), so removing a group renumbers every group after it and
 * a saved list's selections silently slide onto the wrong options. Space Marines 1.04 deletes the
 * Desolation Squad's first group ("Every model may swap their Castellan missile launcher ->
 * Krak missile launcher +19", now a free second profile of the standard launcher) — without this
 * table a saved squad's Veteran Sergeant upgrade, group 2, would come back as the Vengor swap.
 *
 * Indices must be listed in the OLD numbering and stay here forever, exactly like RENAMED_UNITS.
 * Applied on load, after the unit renames, so a unit that was renamed AND lost a group still lands
 * on the right table (keyed by the CURRENT name for that reason).
 */
export const REMOVED_OPTION_GROUPS: Record<string, Record<string, number[]>> = {
  'Space Marines': {
    'Desolation Squad': [0],
  },
};

/**
 * Drop the removed groups' selections and shift the survivors down, so a list saved against the
 * previous codex keeps pointing at the options the player actually bought.
 */
export function applyOptionGroupRemovals<T extends { unitName: string; optionQty?: Record<number, Record<string, number>> }>(
  faction: string, army: T[],
): T[] {
  const table = REMOVED_OPTION_GROUPS[faction];
  if (!table) return army;
  let changed = false;
  const next = army.map(e => {
    const gone = table[e.unitName];
    if (!gone?.length || !e.optionQty) return e;
    const out: Record<number, Record<string, number>> = {};
    for (const k of Object.keys(e.optionQty)) {
      const i = Number(k);
      if (!Number.isFinite(i)) continue;
      if (gone.includes(i)) continue;                       // the group itself is gone
      out[i - gone.filter(g => g < i).length] = e.optionQty[i];
    }
    changed = true;
    return { ...e, optionQty: out };
  });
  return changed ? next : army;
}

/** Rewrite every armoury selection's itemName through {@link RENAMED_ARMORY_ITEMS}. */
export function applyArmoryRenames<T extends { armory?: { itemName: string }[] }>(
  faction: string, army: T[],
): T[] {
  const table = RENAMED_ARMORY_ITEMS[faction];
  if (!table) return army;
  let changed = false;
  const next = army.map(e => {
    if (!e.armory?.length) return e;
    let hit = false;
    const armory = e.armory.map(a => {
      const name = table[a.itemName];
      if (!name) return a;
      hit = true;
      return { ...a, itemName: name };
    });
    if (!hit) return e;
    changed = true;
    return { ...e, armory };
  });
  return changed ? next : army;
}

/** The current name for a unit, for armies saved before a rename. */
export function currentUnitName(faction: string, unitName: string): string {
  const t = RENAMED_UNITS[faction]?.[unitName];
  return typeof t === 'string' ? t : t?.to ?? unitName;
}

/** A specific note for a datasheet we know was deleted, or null for "just not found". */
export function removedUnitNote(faction: string, unitName: string): string | null {
  return REMOVED_UNITS[faction]?.[unitName] ?? null;
}

/**
 * Rewrite every entry's unitName through {@link currentUnitName}, and switch on the variant upgrade
 * where the rename carries one.
 *
 * `units` is the faction's datasheet map, used only to find the upgrade's option-group INDEX from
 * its `variant_link`. Without it the rename still happens and only the upgrade is skipped, so a
 * caller that has no data loaded is not blocked — but the store does pass it.
 */
export function applyUnitRenames<T extends { unitName: string; optionQty?: Record<number, Record<string, number>> }>(
  faction: string,
  army: T[],
  units?: Record<string, { option_groups: { variant_link?: string | null }[] }>,
): T[] {
  const table = RENAMED_UNITS[faction];
  if (!table) return army;
  let changed = false;
  const next = army.map(e => {
    const target = table[e.unitName];
    if (!target) return e;
    changed = true;
    const to = typeof target === 'string' ? target : target.to;
    const out = { ...e, unitName: to } as T;
    if (typeof target !== 'string' && units) {
      const gi = units[to]?.option_groups.findIndex(g => g.variant_link === target.enableVariant);
      if (gi != null && gi >= 0) {
        out.optionQty = { ...(e.optionQty ?? {}), [gi]: { ...(e.optionQty?.[gi] ?? {}), __inline: 1 } };
      }
    }
    return out;
  });
  return changed ? next : army;
}
