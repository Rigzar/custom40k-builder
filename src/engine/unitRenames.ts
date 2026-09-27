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
  // Tyranids 2026-09-27: the 18-entry Biomorph list moved out of every datasheet's own
  // option_groups into a shared Armory list (ki-tyranid-biomorph-shared-armory-01). The group
  // itself is gone from all 40 units below; migrateTyranidBiomorphsToArmory (below) converts any
  // selections it held into item.armory BEFORE this table runs, so this entry only has to shift
  // the groups that came after it (all but Zoanthrope Brood had none).
  'Tyranids': {
    'Mucolid Spore Cluster': [0],
    'Tyrannocyte': [1], 'Deathleaper': [1], 'Haruspex': [1], 'Maleceptor': [1], 'Toxicrene': [1],
    'Venomthrope Brood': [1], "Von Ryan's Leaper Brood": [1], 'Zoanthrope Brood': [1],
    'Gargoyle Brood': [1], 'Parasite of Mortrex': [1], 'Psychophage': [1], 'Pyrovore Brood': [1],
    'Sporocyst': [1], 'Biovore Brood': [1], 'Malanthrope': [1], 'Neurotyrant': [1],
    'Barbgaunt Brood': [1], 'Hormagaunt Brood': [1], 'Neurogaunt Brood': [1],
    'Hive Guard Brood': [2], 'Lictor Brood': [2], 'Mawloc': [2], 'Hive Crone': [2],
    'Dactylis': [2], 'Exocrine': [2], 'Ripper Swarms': [2],
    'Ravener Brood': [3], 'Trygon': [3], 'Harpy': [3], 'Tyrannofex': [3], 'Tervigon': [3],
    'Tyranid Prime': [3], 'Tyrant Guard Brood': [3], 'Termagant Brood': [3],
    'Norn': [4], 'Genestealer Brood': [4], 'Tyranid Warrior Brood': [4],
    'Carnifex Brood': [5],
    'Hive Tyrant': [7],
  },
};

/**
 * Basic Biomorphs price a flat cost for the whole unit; Advanced ones price the SAME listed cost
 * PER MODEL (the codex's own "Point costs are paid per unit/model" line — see the `Choice.per_model`
 * doc comment in types/data.ts). Kept here, not derived from the general.json entries, because a
 * migration has to reproduce points/scaling exactly as they were on the day a list was saved, not
 * as the Armory sheet reads today — a future re-price of a Biomorph must never reach backward and
 * silently re-cost an old save. { points, advanced } mirrors data/parsed/tyranids/armory/general.json
 * as of ki-tyranid-biomorph-shared-armory-01.
 */
/**
 * Advanced Biomorphs price DIFFERENTLY depending on the buying unit's own Basic/Advanced Bioform
 * keyword (Discord/Unwise: Acid Blood charged a Hormagaunt Brood — Basic Bioform — 5pts/model
 * instead of the 1 its own column lists; a `basicPrice: null` item is Advanced-Bioform-only, same
 * as the general.json entry's own null `p_unit`). Basic Biomorphs charge the same either way.
 * `perModel` mirrors `p_char`/`scaling: 'perModel'` — the ADVANCED BIOMORPHS section's own "Point
 * costs are paid per model" line, true for all 11 of them regardless of which price tier applies.
 *
 * KEY ORDER IS LOAD-BEARING — do not alphabetise or regroup. TYRANID_BIOMORPH_CHOICE_ORDER below
 * is this object's own Object.keys(), and a saved list's optionQty has no way to name a Biomorph
 * except by its position in the original 18-choice option_group, verified byte-for-byte before
 * that group was deleted.
 */
const TYRANID_BIOMORPH_PRICES: Record<string, { basicPrice: number | null; advancedPrice: number; perModel: boolean }> = {
  'Acid Maw':             { basicPrice: 5,    advancedPrice: 5,  perModel: false },
  'Adrenal Glands':       { basicPrice: 5,    advancedPrice: 5,  perModel: false },
  'Enhanced Senses':      { basicPrice: 5,    advancedPrice: 5,  perModel: false },
  'Heightened Reflexes':  { basicPrice: 5,    advancedPrice: 5,  perModel: false },
  'Pathogenesis':         { basicPrice: 5,    advancedPrice: 5,  perModel: false },
  'Relentless Hunger':    { basicPrice: 5,    advancedPrice: 5,  perModel: false },
  'Toxin Sacs':           { basicPrice: 5,    advancedPrice: 5,  perModel: false },
  'Acid Blood':           { basicPrice: 1,    advancedPrice: 5,  perModel: true },
  'Extremely Volatile':   { basicPrice: 0,    advancedPrice: 0,  perModel: true },
  'Implant Attack':       { basicPrice: null, advancedPrice: 5,  perModel: true },
  'Infrasonic Roar':      { basicPrice: 1,    advancedPrice: 5,  perModel: true },
  'Resonance Barb':       { basicPrice: null, advancedPrice: 5,  perModel: true },
  'Symbiote Rippers':     { basicPrice: null, advancedPrice: 3,  perModel: true },
  'Thornback':            { basicPrice: 1,    advancedPrice: 5,  perModel: true },
  'Tusked':               { basicPrice: null, advancedPrice: 5,  perModel: true },
  'Warped':               { basicPrice: 1,    advancedPrice: 5,  perModel: true },
  'Camouflage':           { basicPrice: 1,    advancedPrice: 3,  perModel: true },
  'Living Battering Ram': { basicPrice: null, advancedPrice: 15, perModel: true },
};

/** The 8 Tyranid datasheets (of the 40 in REMOVED_OPTION_GROUPS['Tyranids']) carrying the "Basic
 *  Bioform" keyword instead of "Advanced Bioform" — every other one there is Advanced Bioform.
 *  Needed here because the migration works from a bare unit NAME, with no faction data loaded to
 *  read the keyword off. (A 9th Basic Bioform datasheet, Spore Mine Cluster, never had the
 *  Biomorph option_group to begin with, so it has no entry in REMOVED_OPTION_GROUPS and doesn't
 *  belong here either.) */
const TYRANID_BASIC_BIOFORM_UNITS = new Set([
  'Gargoyle Brood', 'Mucolid Spore Cluster', 'Barbgaunt Brood', 'Genestealer Brood',
  'Hormagaunt Brood', 'Neurogaunt Brood', 'Ripper Swarms', 'Termagant Brood',
]);

/** The Biomorph choice list's fixed order, identical across all 40 datasheets that carried it —
 *  verified byte-for-byte before the group was removed. optionQty's choice index is this array's
 *  index; a saved list has no other way to say which Biomorph it means. */
const TYRANID_BIOMORPH_CHOICE_ORDER = Object.keys(TYRANID_BIOMORPH_PRICES);

/**
 * Convert a saved Tyranid list's Biomorph selections (recorded as `optionQty[groupIndex][choiceIndex]`
 * against the now-deleted option_groups entry) into `item.armory` selections, so a list saved before
 * ki-tyranid-biomorph-shared-armory-01 keeps whatever Biomorphs it had instead of silently losing
 * them. Must run BEFORE applyOptionGroupRemovals (which only drops-and-shifts; it has no idea a
 * choice here means a named Biomorph, and would just discard the quantity).
 */
export function migrateTyranidBiomorphsToArmory<T extends {
  unitName: string;
  optionQty?: Record<number, Record<string, number>>;
  armory: { id: string; itemName: string; source: string; section: string; points: number; scaling?: 'perModel' | 'perWound'; isCharacter: boolean }[];
}>(faction: string, army: T[]): T[] {
  if (faction !== 'Tyranids') return army;
  const groupTable = REMOVED_OPTION_GROUPS['Tyranids'];
  let changed = false;
  const next = army.map(e => {
    const groupIdx = groupTable[e.unitName]?.[0];
    const picks = groupIdx !== undefined ? e.optionQty?.[groupIdx] : undefined;
    if (!picks) return e;
    const newSelections: T['armory'] = [];
    for (const [ciStr, qty] of Object.entries(picks)) {
      if (ciStr === '__inline' || !qty) continue;
      const name = TYRANID_BIOMORPH_CHOICE_ORDER[Number(ciStr)];
      const priced = name ? TYRANID_BIOMORPH_PRICES[name] : undefined;
      if (!priced) continue; // an index outside the old 18 means nothing here — leave it untouched
      const isAdvancedUnit = !TYRANID_BASIC_BIOFORM_UNITS.has(e.unitName);
      const points = isAdvancedUnit ? priced.advancedPrice : priced.basicPrice;
      if (points === null) continue; // an old selection this unit's own type couldn't legally buy
      newSelections.push({
        id: 'arm-' + (globalThis.crypto?.randomUUID?.() ?? (Date.now().toString(36) + '-' + Math.random().toString(36).slice(2))),
        itemName: name,
        source: 'General',
        section: 'equipment',
        points,
        scaling: priced.perModel ? 'perModel' : undefined,
        isCharacter: false,
      });
    }
    if (!newSelections.length) return e;
    changed = true;
    const { [groupIdx]: _dropped, ...restOptionQty } = e.optionQty ?? {};
    return { ...e, optionQty: restOptionQty, armory: [...e.armory, ...newSelections] };
  });
  return changed ? next : army;
}

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
