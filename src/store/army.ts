import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ArmyState, RosterEntry, Mark, EngagementType, ArmorySelection, TraitSelection } from '../types/army';
import type { FactionData, Trait, Unit } from '../types/data';
import { ENGAGEMENTS } from '../engine/engagements';
import { resolveUnit } from '../engine/points';
import { getArchetypeRule } from '../engine/archetypes';
import { findArmoryItem } from '../engine/resolver';
import { parseInvSaveFromAbilities } from '../engine/equipMods';
import { effectiveSubfactions, traitRequiredSubfaction } from '../engine/codex_dark_eldar/subfaction';
// TRAIT_EFFECTS import removed — vehicle trait cost now uses canonical pts_veh/pts_monster directly

// Collision-proof unique id. A plain incrementing counter resets to 1 on every page load while the
// persisted army keeps ids 1,2,3… — so a freshly-added unit could reuse a saved unit's id, and any
// id-keyed mutation (updateUnit/size, removeUnit) would then hit BOTH entries. Using a UUID removes
// that collision entirely; the random fallback covers non-secure contexts without crypto.randomUUID.
function newId() {
  return globalThis.crypto?.randomUUID?.() ?? (Date.now().toString(36) + '-' + Math.random().toString(36).slice(2));
}

// ── Trait helpers ─────────────────────────────────────────────────────────────

function parseTraitPts(raw: string | null | undefined): number | null {
  if (!raw || raw === '-' || raw.toLowerCase() === 'special') return null;
  const n = parseInt(raw, 10);
  return isNaN(n) ? null : n;
}

/** Army-only traits (Mixed Warband, Black Crusade) have no numeric per-unit cost. */
function isArmyOnlyTrait(t: Trait): boolean {
  return parseTraitPts(t.pts_unit) === null
    && parseTraitPts(t.pts_char) === null
    && parseTraitPts(t.pts_monster) === null
    && parseTraitPts(t.pts_veh) === null;
}

function parseSv(v: string | undefined): number {
  const m = v?.match(/^(\d+)\+/);
  return m ? parseInt(m[1], 10) : 99;
}

/** "Only for creature models that do not already have a 4+ armor save from their datasheet or
 *  Armory" (Heavy Infantry, IG Army Customisation) — units whose base SV is already 4+ or better
 *  (e.g. Storm Troopers' carapace armor), or who bought an Armory item granting one, are exempt:
 *  the trait neither applies nor charges them. */
function alreadyHasArmorSave4Plus(unit: Unit, item: RosterEntry, data: FactionData): boolean {
  if (parseSv(unit.models[0]?.stats?.SV) <= 4) return true;
  return (item.armory ?? []).some(sel => {
    const ai = findArmoryItem(data, sel);
    return ai?.desc != null && /\d\+\s+armou?r\s+save/i.test(ai.desc);
  });
}

/** Same exemption pattern, for Bionic Improvement's "...do not already have an invulnerability
 *  save from their datasheet or Armory." */
function alreadyHasInvulnSave(unit: Unit, item: RosterEntry, data: FactionData): boolean {
  if (parseInvSaveFromAbilities(unit.abilities ?? []) !== null) return true;
  return (item.armory ?? []).some(sel => {
    const ai = findArmoryItem(data, sel);
    return ai?.desc != null && /\d\+\s+invulnerable\s+save/i.test(ai.desc);
  });
}

/** Shared trait→points resolution (Army Customisation cost table), faction-agnostic. */
function computeTraitSelections(
  unit: Unit, item: RosterEntry, names: string[], traits: Trait[], data: FactionData,
): TraitSelection[] {
  return names
    .map(name => {
      if (name === 'Heavy Infantry' && alreadyHasArmorSave4Plus(unit, item, data)) return null;
      if (name === 'Bionic Improvement' && alreadyHasInvulnSave(unit, item, data)) return null;

      // Dark Eldar sub-faction gate: a ᴷ/ᶜᵒ/ᶜᵘ trait is only paid for by units of that sub-faction
      // (its keyword, or the player's pick for multi-keyword shared vehicles). Mirrors the effect
      // gate in resolver.ts — so a Raider picked as Kabal no longer pays for Coven/Cult traits.
      // Dark Eldar sub-faction gate (DE-only): a ᴷ/ᶜᵒ/ᶜᵘ trait is only paid for by units of that
      // sub-faction (its keyword, or the player's pick for multi-keyword shared vehicles).
      if (data.faction === 'Dark Eldar') {
        const req = traitRequiredSubfaction(name);
        if (req && !effectiveSubfactions(unit.keywords, item.subfaction).includes(req)) return null;
      }

      const def = traits.find(t => t.name === name);
      if (!def) return null;

      // Creature-only traits are not paid for by vehicles (rules owner atypicalhero, 2026-07-13:
      // "you only pay for a trait if your type is not excluded in the trait text — creature-only
      // traits don't apply to vehicles and they don't pay for it"). Text-based so it works across
      // every faction regardless of how the effect's applies_to was modelled. Matches all phrasings:
      // "Only for creatures." / "Only for creature units." / "Only for creature models …".
      if (unit.is_vehicle && /only for creature/i.test(def.desc)) return null;

      let raw: string | null | undefined;
      if (unit.is_vehicle) {
        // "MONSTROUS CREATURES & VEHICLES" is one shared cost column: pts_veh holds the vehicle
        // cost directly; if absent, fall back to pts_monster (the shared column). Creature-only
        // traits were already dropped above (a vehicle never pays for them), so this only prices
        // vehicles for traits they can actually take.
        raw = def.pts_veh ?? def.pts_monster ?? null;
      } else if (unit.is_character) {
        raw = def.pts_char;
      } else if (unit.is_monster) {
        raw = def.pts_monster;
      } else {
        raw = def.pts_unit;
      }

      const pts = parseTraitPts(raw);
      if (pts === null) return null; // trait cost is "-" for this unit type
      const perWound = typeof raw === 'string' && raw.trimEnd().endsWith('*');
      return { name, points: pts, ...(perWound ? { perWound: true } : {}) };
    })
    .filter(Boolean) as TraitSelection[];
}

/**
 * Re-computes item.traits for every unit in the army from the army traitPool — and, separately,
 * from the Allied Detachment's OWN traitPool for units with `factionSource === alliedFaction`
 * (Core Rules L1834: "Allies may select their own Army Customisation options"). Called whenever
 * either traitPool, either archetype, a unit's mark, or the allied faction changes.
 *
 * Rule: "If a Trait is taken, all models/units in the army must be upgraded
 * with it, unless stated otherwise." (Army Customisation, CSM codex)
 *
 * Allied traits use the generic cost-table path only — Holy Trinity / Black Crusade are
 * primary-only signature Legacy mechanics (CSM-specific auto-behaviour), not modelled for an
 * allied detachment.
 */
function applyArmyTraits(
  army: RosterEntry[],
  traitPool: string[],
  data: FactionData,
  _archetype: string,
  legacy?: string,
  alliedFaction?: string,
  alliedData?: FactionData | null,
  alliedTraitPool?: string[],
): RosterEntry[] {
  const holyTrinity = legacy === 'The Holy Trinity';
  const unitTraitNames = traitPool.filter(name => {
    const def = data.traits.find(t => t.name === name);
    return def && !isArmyOnlyTrait(def);
  });
  const allyTraitNames = (alliedFaction && alliedData)
    ? (alliedTraitPool ?? []).filter(name => {
        const def = alliedData.traits.find(t => t.name === name);
        return def && !isArmyOnlyTrait(def);
      })
    : [];

  return army.map(item => {
    // Check allied scope FIRST so same-faction allies (primary=CSM, ally=CSM) don't fall into
    // the isMainFaction branch and incorrectly receive the primary trait pool.
    if (alliedFaction && alliedData && item.factionSource === alliedFaction) {
      const unit = resolveUnit(item, data); // data.allied[factionSource] was merged in by setAlliedFaction
      if (!unit || !allyTraitNames.length) return { ...item, traits: [] };
      if (alliedData.faction === 'Chaos Space Marines' && !unit.keywords.includes('Chaos Space Marine')) {
        return { ...item, traits: [] };
      }
      return { ...item, traits: computeTraitSelections(unit, item, allyTraitNames, alliedData.traits, alliedData) };
    }

    const isMainFaction = item.unitName in data.units;

    if (isMainFaction) {
      const unit = resolveUnit(item, data);
      if (!unit) return { ...item, traits: [] };

      if (holyTrinity) {
        // Holy Trinity forces 3 traits at a combined flat cost of 10 pts per non-character unit
        if (!unit.has_veteran_abilities) return { ...item, traits: [] };
        const traits: TraitSelection[] = traitPool.map((name, i) => ({
          name,
          points: unit.is_character ? 0 : i === 0 ? 10 : 0,
        }));
        return { ...item, traits };
      }

      if (!unitTraitNames.length) return { ...item, traits: [] };

      // CSM: traits only apply to units with the 'Chaos Space Marine' keyword
      // (excludes Cultists, Chaos Spawn, Daemon Engines, World Eaters, Death Guard, etc.)
      if (data.faction === 'Chaos Space Marines' && !unit.keywords.includes('Chaos Space Marine')) {
        return { ...item, traits: [] };
      }

      // All selected traits apply to all eligible units — veteran_max limits only armory items
      return { ...item, traits: computeTraitSelections(unit, item, unitTraitNames, data.traits, data) };
    }

    return { ...item, traits: [] };
  });
}

// ── Store interface ───────────────────────────────────────────────────────────

export interface ArmyStore extends ArmyState {
  data: FactionData | null;
  setData: (d: FactionData) => void;

  alliedData: FactionData | null;
  setAlliedData: (d: FactionData | null) => void;
  setAlliedFaction: (key: string | null) => void;

  /** Faction data for supplemental/native-ally factions (Assassins, Inquisition, HH supplement,
   *  Daemonkin, etc.) injected by the primary faction's archetype/legacy/intrinsic-allies.
   *  Separate from alliedData to avoid collision with the user-selected allied detachment. */
  supplementData: Record<string, FactionData>;

  setArmyName: (n: string) => void;
  setUnitCustomName: (id: string, name: string) => void;
  setUnitJoinTarget: (id: string, targetId: string | null) => void;
  setPlatoonLink: (id: string, platoonId: string | null) => void;
  setEngagement: (e: EngagementType) => void;
  setPointLimit: (n: number) => void;
  setHqMark: (m: Mark) => void;
  setArchetype: (a: string) => void;
  setLegacy: (l: string) => void;
  setLegacy2: (l: string) => void;
  /** Set the full army trait pool (max 2). Automatically syncs traits to all units. */
  setTraitPool: (pool: string[]) => void;
  /** Allied Detachment's OWN Army Customisation (Core Rules: "Allies may select their own
   *  Army Customisation options") — independent of the primary faction's archetype/legacy/traits. */
  setAlliedArchetype: (a: string) => void;
  setAlliedLegacy: (l: string) => void;
  /** Set the allied detachment's trait pool (max 2). Automatically syncs traits to allied units. */
  setAlliedTraitPool: (pool: string[]) => void;
  /** Per-unit override: which subset of army unit-traits this unit takes (conflict resolution). */
  setUnitTraitChoice: (id: string, choices: string[]) => void;
  /**
   * Designates an HQ unit as the Black Crusade champion (carries all 4 god marks).
   * Automatically clears the flag on any previously designated champion.
   */
  setBlackCrusadeHQ: (id: string, v: boolean) => void;
  /**
   * Mixed Warband: lock this unit to a specific legacy armory key (or clear the lock).
   * Passing null clears the lock and removes any armory items from legacy armories.
   */
  setLegacyArmoryLock: (id: string, key: string | null) => void;

  addUnit: (unitName: string, slot: string, factionSource?: string, nestedFaction?: string) => void;
  removeUnit: (id: string) => void;
  duplicateUnit: (id: string) => void;
  updateUnit: (id: string, patch: Partial<RosterEntry>) => void;
  /** Update the size of one model group in a multi-group unit. Keeps `size` in sync as the total. */
  updateModelSize: (id: string, modelName: string, newCount: number) => void;
  setOptionQty: (id: string, gi: number, ci: string | number, qty: number) => void;
  addArmoryItem: (id: string, item: ArmorySelection) => void;
  removeArmoryItem: (id: string, armoryId: string) => void;
  addPower: (id: string, disciplineName: string, powerName: string) => void;
  removePower: (id: string, disciplineName: string, powerName: string) => void;
  addPrayer: (id: string, prayerName: string) => void;
  removePrayer: (id: string, prayerName: string) => void;
  addPact: (id: string, pactName: string) => void;
  removePact: (id: string, pactName: string) => void;

  /** Inject a faction's unit data into data.allied[key] for archetype-unlocked factions. */
  injectArchetypeFaction: (key: string, factionData: FactionData, sharedArmoryLabel?: string) => void;
  /** Same, but for the Allied Detachment's own archetype-granted intrinsic ally. */
  injectAlliedArchetypeFaction: (key: string, factionData: FactionData) => void;
  importRoster: (json: string) => void;
  clearArmy: () => void;
}

/** Merge a loaded ally's units/slots (and its own one-level-deep nested ally, if any) into
 * data.allied[alliedFaction] — shared by setData and setAlliedData so whichever of the two
 * async loaders resolves last still produces a correctly merged result. */
function mergeAlliedIntoData(data: FactionData, alliedFaction: string | undefined, alliedData: FactionData | null): FactionData {
  if (!alliedFaction || !alliedData) return data;
  return {
    ...data,
    allied: { ...(data.allied ?? {}), [alliedFaction]: {
      faction: alliedData.faction, slot_to_units: alliedData.slot_to_units, units: alliedData.units,
      allied: alliedData.allied, base_allied: alliedData.base_allied,
    } },
  };
}

const defaultState: ArmyState = {
  armyName: '',
  faction: 'Chaos Space Marines',
  engagement: 'pitched',
  pointLimit: 2500,
  hqMark: 'Undivided',
  alliedHqMark: 'Undivided',
  archetype: '',
  legacy: '',
  legacy2: '',
  traitPool: [],
  army: [],
};

type S = ArmyStore;

export const useArmyStore = create<ArmyStore>()(
  persist(
    (set, get) => ({
      ...defaultState,
      data: null,
      alliedData: null,
      supplementData: {} as Record<string, FactionData>,

      setData: (d: FactionData) => set(s => {
        // When loading a DIFFERENT faction (an actual user-driven switch, not the first load
        // after a page reload — s.data is always null right after boot, since it isn't
        // persisted, so a bare `s.data?.faction !== d.faction` check used to read as "changed"
        // on every cold reload, silently wiping the persisted alliedFaction/army/archetype
        // every time. Requiring s.data !== null fixes that.), reset all army-specific state so
        // marks, archetypes, and units from the old faction don't bleed through.
        const factionChanged = s.data !== null && s.data.faction !== d.faction;
        if (factionChanged) {
          return {
            data: d,
            faction: d.faction,
            army: [],
            armyName: '',
            archetype: '',
            legacy: '',
            legacy2: '',
            traitPool: [],
            hqMark: 'Undivided' as Mark,
            alliedFaction: undefined,
            alliedData: null,
            supplementData: {},
          };
        }
        return { data: mergeAlliedIntoData(d, s.alliedFaction, s.alliedData), faction: d.faction };
      }),

      setAlliedData: (d) => set((s) => {
        if (!s.data) return { alliedData: d };
        return { alliedData: d, data: mergeAlliedIntoData(s.data, s.alliedFaction, d) };
      }),

      setAlliedFaction: (key) => set((s) => {
        const prev = s.alliedFaction;
        const army = prev ? s.army.filter(e => e.factionSource !== prev) : s.army;
        // Switching/removing the allied faction invalidates its own Army Customisation picks —
        // an Archetype/Legacy/Trait name from the old ally faction won't exist on the new one.
        return {
          alliedFaction: key ?? undefined, alliedData: null, army,
          alliedArchetype: '', alliedLegacy: '', alliedTraitPool: [], alliedHqMark: 'Undivided' as Mark,
        };
      }),

      setArmyName: (n: string) => set({ armyName: n }),

      setUnitCustomName: (id: string, name: string) => set((s: S) => ({
        army: s.army.map((e: RosterEntry) =>
          e.id === id ? { ...e, customName: name || undefined } : e
        ),
      })),

      setUnitJoinTarget: (id: string, targetId: string | null) => set((s: S) => ({
        army: s.army.map((e: RosterEntry) =>
          e.id === id ? { ...e, joinedToUnit: targetId || null } : e
        ),
      })),

      setPlatoonLink: (id: string, platoonId: string | null) => set((s: S) => ({
        army: s.army.map((e: RosterEntry) =>
          e.id === id ? { ...e, platoonId: platoonId || null } : e
        ),
      })),

      setEngagement: (e: EngagementType) => set((s: S) => {
        // Missions.txt (Skirmish): "No allies may be included." Switching into Skirmish with an
        // allied detachment already present drops it (and its units), same as setAlliedFaction(null).
        if (e === 'skirmish' && s.alliedFaction) {
          const army = s.army.filter(entry => entry.factionSource !== s.alliedFaction);
          return {
            engagement: e, pointLimit: ENGAGEMENTS[e].default, army,
            alliedFaction: undefined, alliedData: null,
            alliedArchetype: '', alliedLegacy: '', alliedTraitPool: [], alliedHqMark: 'Undivided' as Mark,
          };
        }
        return { engagement: e, pointLimit: ENGAGEMENTS[e].default };
      }),
      setPointLimit: (n: number) => set({ pointLimit: n }),
      setHqMark: (m: Mark) => set({ hqMark: m }),

      setArchetype: (a: string) => set((s: S) => {
        const newRule = getArchetypeRule(a);
        // If new archetype forces a mark, apply it to all non-locked units.
        const baseArmy = newRule?.forcedMark
          ? s.army.map((e: RosterEntry) => {
              const u = s.data ? resolveUnit(e, s.data) : null;
              if (!u?.locked_mark) return { ...e, mark: newRule.forcedMark as Mark };
              return e;
            })
          : s.army;
        const army = s.data
          ? applyArmyTraits(baseArmy, s.traitPool, s.data, a, s.legacy, s.alliedFaction, s.alliedData, s.alliedTraitPool)
          : baseArmy;
        return { archetype: a, army };
      }),

      setLegacy: (l: string) => set((s: S) => {
        if (l === 'The Holy Trinity' && s.data) {
          const holyTrioNames = ['Raging Fervour', 'Rites of Fire', 'Unshakable Vengeance'];
          return {
            legacy: l,
            traitPool: holyTrioNames,
            army: applyArmyTraits(s.army, holyTrioNames, s.data, s.archetype, l, s.alliedFaction, s.alliedData, s.alliedTraitPool),
          };
        }
        if (s.legacy === 'The Holy Trinity' && s.data) {
          // Deselecting Holy Trinity: clear the auto-set trait pool
          return {
            legacy: l,
            traitPool: [],
            army: applyArmyTraits(s.army, [], s.data, s.archetype, l, s.alliedFaction, s.alliedData, s.alliedTraitPool),
          };
        }
        // Re-clip the trait pool if the new legacy grants fewer bonus slots than the old one
        // (e.g. leaving "Ministorum World" drops its 3rd-Trait slot).
        const archetypeTraitBonus = getArchetypeRule(s.archetype)?.archetypeTraitBonus ?? 0;
        const maxTraits = 2 + (s.data?.legacies.find(lg => lg.name === l)?.trait_slot_bonus ?? 0) + archetypeTraitBonus;
        if (s.traitPool.length > maxTraits) {
          const newPool = s.traitPool.slice(0, maxTraits);
          return {
            legacy: l,
            traitPool: newPool,
            army: s.data
              ? applyArmyTraits(s.army, newPool, s.data, s.archetype, l, s.alliedFaction, s.alliedData, s.alliedTraitPool)
              : s.army,
          };
        }
        return { legacy: l };
      }),
      setLegacy2: (l: string) => set({ legacy2: l }),

      setTraitPool: (pool: string[]) => set((s: S) => {
        // Default budget is 2; a Legacy can grant extra slots (e.g. IG's "Ministorum World":
        // "The army must select a third Trait" → trait_slot_bonus: 1). Archetypes can also add
        // bonus slots (e.g. Dark Eldar Coordinated Raid → archetypeTraitBonus: 1).
        const archetypeTraitBonus2 = getArchetypeRule(s.archetype)?.archetypeTraitBonus ?? 0;
        const maxTraits = 2 + (s.data?.legacies.find(l => l.name === s.legacy)?.trait_slot_bonus ?? 0) + archetypeTraitBonus2;
        const newPool = pool.slice(0, maxTraits);
        const hadBC = s.traitPool.includes('Black Crusade');
        const hasBC = newPool.includes('Black Crusade');

        let army = s.data
          ? applyArmyTraits(s.army, newPool, s.data, s.archetype, s.legacy, s.alliedFaction, s.alliedData, s.alliedTraitPool)
          : s.army;

        // If Black Crusade was removed, clear any champion designations
        if (hadBC && !hasBC) {
          army = army.map(e => e.blackCrusadeHQ ? { ...e, blackCrusadeHQ: undefined } : e);
        }

        // If Black Crusade was just added, auto-set army HQ mark to Undivided
        const extra: Partial<ArmyState> = {};
        if (!hadBC && hasBC) {
          extra.hqMark = 'Undivided' as Mark;
        }

        return { traitPool: newPool, army, ...extra };
      }),

      setUnitTraitChoice: (id: string, choices: string[]) => set((s: S) => {
        const withChoice = s.army.map(e =>
          e.id === id ? { ...e, traitChoice: choices } : e,
        );
        const army = s.data
          ? applyArmyTraits(withChoice, s.traitPool, s.data, s.archetype, s.legacy, s.alliedFaction, s.alliedData, s.alliedTraitPool)
          : withChoice;
        return { army };
      }),

      setAlliedArchetype: (a: string) => set({ alliedArchetype: a }),

      setAlliedLegacy: (l: string) => set({ alliedLegacy: l }),

      setAlliedTraitPool: (pool: string[]) => set((s: S) => {
        const newPool = pool.slice(0, 2); // enforce max 2
        const army = s.data
          ? applyArmyTraits(s.army, s.traitPool, s.data, s.archetype, s.legacy, s.alliedFaction, s.alliedData, newPool)
          : s.army;
        return { alliedTraitPool: newPool, army };
      }),

      setBlackCrusadeHQ: (id: string, v: boolean) => set((s: S) => ({
        army: s.army.map(e => {
          if (e.id === id) return { ...e, blackCrusadeHQ: v || undefined };
          // Designating a new champion clears the flag on all other units
          if (v) return { ...e, blackCrusadeHQ: undefined };
          return e;
        }),
      })),

      setLegacyArmoryLock: (id: string, key: string | null) => set((s: S) => ({
        army: s.army.map(e => {
          if (e.id !== id) return e;
          // When locking to a key, remove any armory items sourced from OTHER legacy armories
          const newArmory = key
            ? e.armory.filter(a => {
                // Keep items whose source is either non-legacy or matches the chosen key
                const isLegacyItem = s.data
                  ? Object.keys(s.data.armory_legions).some(lk => a.source === lk)
                  : false;
                return !isLegacyItem || a.source === key;
              })
            : e.armory.filter(a => {
                // Clearing the lock: remove ALL legacy armory items
                const isLegacyItem = s.data
                  ? Object.keys(s.data.armory_legions).some(lk => a.source === lk)
                  : false;
                return !isLegacyItem;
              });
          return { ...e, legacyArmoryLock: key ?? undefined, armory: newArmory };
        }),
      })),

      addUnit: (unitName: string, slot: string, factionSource?: string, nestedFaction?: string) => {
        const s = get();
        if (!s.data) return;
        const u = nestedFaction
          ? s.data.allied?.[factionSource!]?.allied?.[nestedFaction]?.units[unitName]
          : factionSource
          ? s.data.allied?.[factionSource]?.units[unitName]
          : s.data.units[unitName];
        if (!u) return;
        const defaultSize = u.default_size || 1;
        // Build modelSizes for multi-group units (more than one model type with different min/max).
        // Each group starts at its minimum. size = sum of all groups.
        const hasMultipleGroups = u.models.length > 1;
        const modelSizes: Record<string, number> | undefined = hasMultipleGroups
          ? Object.fromEntries(u.models.map(m => [m.name, m.min]))
          : undefined;
        const computedSize = modelSizes
          ? Object.values(modelSizes).reduce((s, n) => s + n, 0)
          : defaultSize;
        const isAlliedScopeUnit = !!(factionSource && factionSource === s.alliedFaction);
        const archetypeRule = getArchetypeRule(isAlliedScopeUnit ? (s.alliedArchetype ?? '') : s.archetype);
        const autoMark = (archetypeRule?.forcedMark && !u.locked_mark)
          ? archetypeRule.forcedMark as Mark
          : null;
        const entry: RosterEntry = {
          id: newId(),
          unitName,
          slot,
          factionSource,
          ...(nestedFaction ? { nestedFaction } : {}),
          size: computedSize,
          mark: autoMark,
          optionQty: {},
          armory: [],
          traits: [],
          powers: [],
          prayers: [],
          pacts: [],
          ...(modelSizes ? { modelSizes } : {}),
        };
        // Special Operations: auto-select Infiltrator for Cultists
        if (s.archetype === 'Special Operations' && unitName === 'Cultists') {
          const inf = s.data.armory_general.equipment.find(e => e.name === 'Infiltrator');
          if (inf && inf.p_unit != null) {
            entry.armory = [{
              id: newId(),
              itemName: 'Infiltrator',
              source: s.data.armory_general.name,
              section: 'equipment',
              points: inf.p_unit * defaultSize,
              isCharacter: false,
            }];
          }
        }
        const newArmy = [...s.army, entry];
        const army = applyArmyTraits(newArmy, s.traitPool, s.data, s.archetype, s.legacy, s.alliedFaction, s.alliedData, s.alliedTraitPool);
        set({ army });
      },

      removeUnit: (id: string) => set((s: S) => ({ army: s.army.filter((e: RosterEntry) => e.id !== id) })),

      // Exact copy of a roster entry — same unit, size, mark, option choices, armory, traits,
      // powers/prayers/pacts, modelSizes, etc. Cleared on the copy: `joinedToUnit`/`platoonId`
      // (structural links to a SPECIFIC other entry — copying them would make the new unit
      // silently join/share a slot with the original's target instead of standing on its own,
      // and a second Character joining the same unit is already a validator error) and
      // `blackCrusadeHQ` (only one HQ per army may hold it — copying it would create a second
      // "champion" and trip that same-shape validator). Armory selections get fresh `id`s since
      // that field is documented as "unique per selection".
      duplicateUnit: (id: string) => {
        const s = get();
        const entry = s.army.find((e: RosterEntry) => e.id === id);
        if (!entry || !s.data) return;
        const copy: RosterEntry = {
          ...entry,
          id: newId(),
          armory: entry.armory.map(a => ({ ...a, id: newId() })),
          optionQty: Object.fromEntries(Object.entries(entry.optionQty).map(([gi, ch]) => [gi, { ...ch }])),
          traits: entry.traits.map(t => ({ ...t })),
          powers: entry.powers.map(p => ({ ...p })),
          prayers: [...entry.prayers],
          pacts: [...entry.pacts],
          ...(entry.modelSizes ? { modelSizes: { ...entry.modelSizes } } : {}),
          joinedToUnit: null,
          platoonId: null,
          blackCrusadeHQ: false,
        };
        const newArmy = [...s.army, copy];
        const army = applyArmyTraits(newArmy, s.traitPool, s.data, s.archetype, s.legacy, s.alliedFaction, s.alliedData, s.alliedTraitPool);
        set({ army });
      },

      updateUnit: (id: string, patch: Partial<RosterEntry>) => set((s: S) => {
        const newArmy = s.army.map((e: RosterEntry) => e.id === id ? { ...e, ...patch } : e);
        // Re-sync traits when the mark changes (mark uses a veteran slot) OR when a Dark Eldar
        // unit's sub-faction pick changes — the pick gates which traits it pays for.
        const army = (('mark' in patch) || ('subfaction' in patch)) && s.data
          ? applyArmyTraits(newArmy, s.traitPool, s.data, s.archetype, s.legacy, s.alliedFaction, s.alliedData, s.alliedTraitPool)
          : newArmy;
        // Sync hqMark when an HQ unit's mark changes (not for multi-mark archetypes). Scoped: an
        // allied HQ's mark syncs alliedHqMark, never the primary's hqMark, and vice versa — this
        // used to set the PRIMARY hqMark regardless of which detachment the edited HQ belonged to.
        const extra: Record<string, unknown> = {};
        if ('mark' in patch) {
          const entry = s.army.find((e: RosterEntry) => e.id === id);
          if (entry?.slot === 'HQ' && !!entry.factionSource && entry.factionSource === s.alliedFaction) {
            extra.alliedHqMark = patch.mark ?? 'Undivided';
          } else if (entry?.slot === 'HQ' && !entry.factionSource) {
            const multiMark = s.traitPool.includes('Black Crusade') || s.archetype === "Abaddon's Chosen";
            if (!multiMark) extra.hqMark = patch.mark ?? 'Undivided';
          }
        }
        return { army, ...extra };
      }),

      updateModelSize: (id: string, modelName: string, newCount: number) => set((s: S) => ({
        army: s.army.map((e: RosterEntry) => {
          if (e.id !== id || !e.modelSizes) return e;
          const newModelSizes = { ...e.modelSizes, [modelName]: newCount };
          const newTotal = Object.values(newModelSizes).reduce((acc, n) => acc + n, 0);
          return { ...e, modelSizes: newModelSizes, size: newTotal };
        }),
      })),

      setOptionQty: (id: string, gi: number, ci: string | number, qty: number) => set((s: S) => ({
        army: s.army.map((e: RosterEntry) => {
          if (e.id !== id) return e;
          const oq = { ...e.optionQty };
          const group = { ...(oq[gi] ?? {}) };
          if (qty === 0) delete group[ci];
          else group[ci] = qty;
          oq[gi] = group;
          return { ...e, optionQty: oq };
        }),
      })),

      addArmoryItem: (id: string, item: ArmorySelection) => set((s: S) => ({
        army: s.army.map((e: RosterEntry) => e.id !== id ? e : { ...e, armory: [...e.armory, item] }),
      })),
      removeArmoryItem: (id: string, armoryId: string) => set((s: S) => ({
        army: s.army.map((e: RosterEntry) => e.id !== id ? e : {
          ...e, armory: e.armory.filter((a: ArmorySelection) => a.id !== armoryId),
        }),
      })),

      addPower: (id: string, disciplineName: string, powerName: string) => set((s: S) => ({
        army: s.army.map((e: RosterEntry) => e.id !== id ? e : {
          ...e, powers: [...e.powers, { disciplineName, powerName }],
        }),
      })),
      removePower: (id: string, disciplineName: string, powerName: string) => set((s: S) => ({
        army: s.army.map((e: RosterEntry) => e.id !== id ? e : {
          ...e,
          powers: e.powers.filter(p => !(p.disciplineName === disciplineName && p.powerName === powerName)),
        }),
      })),

      addPrayer: (id: string, prayerName: string) => set((s: S) => ({
        army: s.army.map((e: RosterEntry) => e.id !== id ? e : { ...e, prayers: [...e.prayers, prayerName] }),
      })),
      removePrayer: (id: string, prayerName: string) => set((s: S) => ({
        army: s.army.map((e: RosterEntry) => e.id !== id ? e : {
          ...e, prayers: e.prayers.filter((p: string) => p !== prayerName),
        }),
      })),

      addPact: (id: string, pactName: string) => set((s: S) => ({
        army: s.army.map((e: RosterEntry) => e.id !== id ? e : {
          ...e, pacts: [...(e.pacts ?? []), pactName],
        }),
      })),
      removePact: (id: string, pactName: string) => set((s: S) => ({
        army: s.army.map((e: RosterEntry) => e.id !== id ? e : {
          ...e, pacts: (e.pacts ?? []).filter((p: string) => p !== pactName),
        }),
      })),

      // Mirrors injectArchetypeFaction, but for the ALLIED detachment's own archetype-granted
      // intrinsic ally (e.g. CSM "Plaguehost" chosen as the ally's archetype → Chaos Daemons with
      // Mark of Nurgle). Writes into alliedData.allied[key] specifically — NOT the top-level
      // alliedData field itself — so it can never collide with injectArchetypeFaction's own use
      // of alliedData for the PRIMARY's intrinsic-ally injection (two unrelated concepts that
      // used to share one store field). Re-runs mergeAlliedIntoData so data.allied[alliedFaction]
      // (what SlotPanel's allied scope actually reads) picks up the nested faction too.
      injectAlliedArchetypeFaction: (key: string, factionData: FactionData) => set((s: S) => {
        if (!s.alliedData) return {};
        const newAlliedData: FactionData = {
          ...s.alliedData,
          allied: {
            ...(s.alliedData.allied ?? {}),
            [key]: { slot_to_units: factionData.slot_to_units, units: factionData.units },
          },
        };
        return {
          alliedData: newAlliedData,
          data: s.data ? mergeAlliedIntoData(s.data, s.alliedFaction, newAlliedData) : s.data,
        };
      }),

      injectArchetypeFaction: (key: string, factionData: FactionData, sharedArmoryLabel?: string) => set((s: S) => {
        if (!s.data) return {};
        const newData: FactionData = {
          ...s.data,
          allied: {
            ...(s.data.allied ?? {}),
            [key]: { slot_to_units: factionData.slot_to_units, units: factionData.units },
          },
        };
        // Supplement-granting archetypes (e.g. Legion → 'Horus Heresy') expose the supplement's
        // armory to the WHOLE army as a legion-style tab. Inject it into armory_legions so the
        // existing legacy-armory mechanism renders it (gated by access only, no mark). Unit-only
        // grants (Daemonkin) pass no label, so daemons keep their own codex armory — no cross-access.
        if (sharedArmoryLabel && factionData.armory_general) {
          newData.armory_legions = {
            ...s.data.armory_legions,
            [sharedArmoryLabel]: { ...factionData.armory_general, name: sharedArmoryLabel },
          };
        }
        // Keep the full injected faction data in supplementData so supplement/native-ally units
        // (factionSource) resolve their native armory in the modal's General tab, without
        // colliding with the user-selected allied detachment's own alliedData.
        return { supplementData: { ...s.supplementData, [key]: factionData }, data: newData };
      }),

      importRoster: (json: string) => {
        const s = get();
        try {
          const parsed = JSON.parse(json);
          const newState = { ...defaultState, ...parsed, data: s.data };
          // Migrate existing saves: apply forcedMark to non-locked units when archetype requires it.
          const importedRule = getArchetypeRule(newState.archetype);
          const migratedArmy = importedRule?.forcedMark
            ? newState.army.map((e: RosterEntry) => {
                const u = s.data ? resolveUnit(e, s.data) : null;
                if (!u?.locked_mark) return { ...e, mark: importedRule.forcedMark as Mark };
                return e;
              })
            : newState.army;
          const army = s.data
            ? applyArmyTraits(migratedArmy, newState.traitPool, s.data, newState.archetype, newState.legacy, newState.alliedFaction, s.alliedData, newState.alliedTraitPool)
            : migratedArmy;
          set({ ...newState, army });
        } catch { /* ignore malformed */ }
      },

      clearArmy: () => set({ ...defaultState, data: get().data, alliedData: null, supplementData: {} }),
    }),
    {
      name: 'custom40k-army',
      storage: createJSONStorage(() => sessionStorage),
      version: 3,
      migrate: (persisted: unknown, fromVersion: number) => {
        const s = persisted as Record<string, unknown>;
        if (fromVersion < 1) {
          if (s.pointLimit === 3000 && s.engagement === 'pitched') {
            s.pointLimit = 2500;
          }
        }
        if (fromVersion < 2) {
          const army = s.army as Record<string, unknown>[];
          if (Array.isArray(army)) {
            s.army = army.map(e => ({ pacts: [], ...e }));
          }
        }
        if (fromVersion < 3) {
          // Apply forcedMark to null-mark units in cult archetypes (Plaguehost, Ambition for
          // Perfection, etc.) — previous versions only applied on addUnit/setArchetype but
          // not on rehydration, leaving stale null marks in already-persisted sessions.
          const rule = getArchetypeRule(s.archetype as string);
          if (rule?.forcedMark) {
            const army = s.army as Record<string, unknown>[];
            if (Array.isArray(army)) {
              s.army = army.map(e => {
                const entry = e as Record<string, unknown>;
                return entry.mark ? entry : { ...entry, mark: rule.forcedMark };
              });
            }
          }
        }
        return s;
      },
      partialize: (s: ArmyStore) => ({
        armyName: s.armyName, faction: s.faction, engagement: s.engagement,
        pointLimit: s.pointLimit, hqMark: s.hqMark, archetype: s.archetype,
        legacy: s.legacy, legacy2: s.legacy2, traitPool: s.traitPool, army: s.army,
        // alliedData itself is NOT persisted (re-fetched via FACTION_LOADERS by App.tsx's
        // alliedFaction effect) but its own Army Customisation state must be, same as the
        // primary's — omitting these used to silently reset the ally's archetype/legacy/traits
        // on every page reload even though alliedFaction itself survived.
        alliedFaction: s.alliedFaction, alliedArchetype: s.alliedArchetype,
        alliedLegacy: s.alliedLegacy, alliedTraitPool: s.alliedTraitPool, alliedHqMark: s.alliedHqMark,
      }),
    }
  )
);

/** Returns the subset of store state that belongs in a SavedArmy entry.
 * Keep the field list in sync with the `partialize` option above — update both together. */
export function getSerializableState(s: {
  armyName: string; faction: string; engagement: EngagementType;
  pointLimit: number; hqMark: Mark; archetype: string;
  legacy: string; legacy2: string; traitPool: string[]; army: RosterEntry[];
  alliedFaction?: string | null; alliedArchetype?: string;
  alliedLegacy?: string; alliedTraitPool?: string[]; alliedHqMark?: Mark;
}): ArmyState {
  return {
    armyName: s.armyName, faction: s.faction, engagement: s.engagement,
    pointLimit: s.pointLimit, hqMark: s.hqMark, archetype: s.archetype ?? '',
    legacy: s.legacy, legacy2: s.legacy2, traitPool: s.traitPool, army: s.army,
    alliedFaction: s.alliedFaction ?? undefined, alliedArchetype: s.alliedArchetype ?? '',
    alliedLegacy: s.alliedLegacy ?? '', alliedTraitPool: s.alliedTraitPool ?? [],
    alliedHqMark: s.alliedHqMark ?? ('' as Mark),
  };
}
