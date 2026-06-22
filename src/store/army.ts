import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ArmyState, RosterEntry, Mark, EngagementType, ArmorySelection, TraitSelection } from '../types/army';
import type { FactionData, Trait, Unit } from '../types/data';
import { ENGAGEMENTS } from '../engine/engagements';
import { resolveUnit } from '../engine/points';
import { getArchetypeRule } from '../engine/archetypes';
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

/** Shared trait→points resolution (Army Customisation cost table), faction-agnostic. */
function computeTraitSelections(unit: Unit, names: string[], traits: Trait[]): TraitSelection[] {
  return names
    .map(name => {
      const def = traits.find(t => t.name === name);
      if (!def) return null;

      let raw: string | null | undefined;
      if (unit.is_vehicle) {
        // Canonical rule (Army Customisation source): "MONSTROUS CREATURES & VEHICLES" is one
        // shared column — vehicles pay the same cost as monsters, even when the trait's effect
        // only applies to creature units. Canonical table is the source of truth (FAQ #5: Codex
        // > Core). pts_veh holds the vehicle cost directly; if absent, fall back to pts_monster
        // (the shared column); no effect-presence check — the cost is paid regardless.
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
      return { ...item, traits: computeTraitSelections(unit, unitTraitNames, data.traits) };
    }

    // Allied Detachment's own trait pool — independent of the primary faction's
    if (alliedFaction && alliedData && item.factionSource === alliedFaction) {
      const unit = resolveUnit(item, data); // data.allied[factionSource] was merged in by setAlliedFaction
      if (!unit || !allyTraitNames.length) return { ...item, traits: [] };
      if (alliedData.faction === 'Chaos Space Marines' && !unit.keywords.includes('Chaos Space Marine')) {
        return { ...item, traits: [] };
      }
      return { ...item, traits: computeTraitSelections(unit, allyTraitNames, alliedData.traits) };
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
  importRoster: (json: string) => void;
  clearArmy: () => void;
}

const defaultState: ArmyState = {
  armyName: '',
  faction: 'Chaos Space Marines',
  engagement: 'pitched',
  pointLimit: 2500,
  hqMark: 'Undivided',
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

      setData: (d: FactionData) => set(s => {
        // When loading a different faction, reset all army-specific state so
        // marks, archetypes, and units from the old faction don't bleed through.
        const factionChanged = s.data?.faction !== d.faction;
        if (factionChanged) {
          return {
            data: d,
            army: [],
            armyName: '',
            archetype: '',
            legacy: '',
            legacy2: '',
            traitPool: [],
            hqMark: 'Undivided' as Mark,
            alliedFaction: undefined,
            alliedData: null,
          };
        }
        return { data: d };
      }),

      setAlliedData: (d) => set((s) => {
        if (!d || !s.alliedFaction || !s.data) return { alliedData: d };
        const newData: FactionData = {
          ...s.data,
          // d.allied carries the ally's OWN intrinsic-ally data (e.g. Chaos Space Marines'
          // chaos_daemons, unlocked by its archetype like Plaguehost) — merging it in lets a
          // doubly-nested unit (factionSource=ally, nestedFaction=ally's-own-ally) resolve.
          allied: { ...(s.data.allied ?? {}), [s.alliedFaction]: { slot_to_units: d.slot_to_units, units: d.units, allied: d.allied } },
        };
        return { alliedData: d, data: newData };
      }),

      setAlliedFaction: (key) => set((s) => {
        const prev = s.alliedFaction;
        const army = prev ? s.army.filter(e => e.factionSource !== prev) : s.army;
        // Switching/removing the allied faction invalidates its own Army Customisation picks —
        // an Archetype/Legacy/Trait name from the old ally faction won't exist on the new one.
        return {
          alliedFaction: key ?? undefined, alliedData: null, army,
          alliedArchetype: '', alliedLegacy: '', alliedTraitPool: [],
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
            alliedArchetype: '', alliedLegacy: '', alliedTraitPool: [],
          };
        }
        return { engagement: e, pointLimit: ENGAGEMENTS[e].default };
      }),
      setPointLimit: (n: number) => set({ pointLimit: n }),
      setHqMark: (m: Mark) => set({ hqMark: m }),

      setArchetype: (a: string) => set((s: S) => {
        const newRule = getArchetypeRule(a);
        // If new archetype forces a mark, clear stale item.mark on non-locked units so
        // the forced mark is the sole source of truth (resolver: locked > forcedMark > item.mark).
        const baseArmy = newRule?.forcedMark
          ? s.army.map((e: RosterEntry) => {
              const u = s.data ? resolveUnit(e, s.data) : null;
              if (!u?.locked_mark && e.mark) return { ...e, mark: null };
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
        return { legacy: l };
      }),
      setLegacy2: (l: string) => set({ legacy2: l }),

      setTraitPool: (pool: string[]) => set((s: S) => {
        const newPool = pool.slice(0, 2); // enforce max 2
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
        const entry: RosterEntry = {
          id: newId(),
          unitName,
          slot,
          factionSource,
          ...(nestedFaction ? { nestedFaction } : {}),
          size: computedSize,
          mark: null,
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

      updateUnit: (id: string, patch: Partial<RosterEntry>) => set((s: S) => {
        const newArmy = s.army.map((e: RosterEntry) => e.id === id ? { ...e, ...patch } : e);
        // Re-sync traits when mark changes (mark uses a veteran slot)
        const army = ('mark' in patch) && s.data
          ? applyArmyTraits(newArmy, s.traitPool, s.data, s.archetype, s.legacy, s.alliedFaction, s.alliedData, s.alliedTraitPool)
          : newArmy;
        // Sync hqMark when an HQ unit's mark changes (not for multi-mark archetypes)
        const extra: Record<string, unknown> = {};
        if ('mark' in patch) {
          const entry = s.army.find((e: RosterEntry) => e.id === id);
          const multiMark = s.traitPool.includes('Black Crusade') || s.archetype === "Abaddon's Chosen";
          if (entry?.slot === 'HQ' && !multiMark) {
            extra.hqMark = patch.mark ?? 'Undivided';
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
        // Keep the full injected faction data in alliedData so the supplement's own units
        // (factionSource) resolve their native armory in the modal's General tab.
        return { alliedData: factionData, data: newData };
      }),

      importRoster: (json: string) => {
        const s = get();
        try {
          const parsed = JSON.parse(json);
          const newState = { ...defaultState, ...parsed, data: s.data };
          const army = s.data
            ? applyArmyTraits(newState.army, newState.traitPool, s.data, newState.archetype, newState.legacy, newState.alliedFaction, s.alliedData, newState.alliedTraitPool)
            : newState.army;
          set({ ...newState, army });
        } catch { /* ignore malformed */ }
      },

      clearArmy: () => set({ ...defaultState, data: get().data, alliedData: null }),
    }),
    {
      name: 'custom40k-army',
      version: 2,
      migrate: (persisted: unknown, fromVersion: number) => {
        const s = persisted as Record<string, unknown>;
        if (fromVersion < 1) {
          if (s.pointLimit === 3000 && s.engagement === 'pitched') {
            s.pointLimit = 2500;
          }
        }
        if (fromVersion < 2) {
          // Add pacts field to existing roster entries
          const army = s.army as Record<string, unknown>[];
          if (Array.isArray(army)) {
            s.army = army.map(e => ({ pacts: [], ...e }));
          }
        }
        return s;
      },
      partialize: (s: ArmyStore) => ({
        armyName: s.armyName, faction: s.faction, engagement: s.engagement,
        pointLimit: s.pointLimit, hqMark: s.hqMark, archetype: s.archetype,
        legacy: s.legacy, legacy2: s.legacy2, traitPool: s.traitPool, army: s.army,
        alliedFaction: s.alliedFaction,
      }),
    }
  )
);
