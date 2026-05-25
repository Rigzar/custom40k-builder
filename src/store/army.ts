import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ArmyState, RosterEntry, Mark, EngagementType, ArmorySelection, TraitSelection } from '../types/army';
import type { FactionData, Trait } from '../types/data';
import { ENGAGEMENTS } from '../engine/engagements';
import { resolveUnit } from '../engine/points';
import { TRAIT_EFFECTS } from '../engine/traitEffects';

let _nextId = 1;
function newId() { return String(_nextId++); }

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

/**
 * Re-computes item.traits for every unit in the army from the army traitPool.
 * Called whenever traitPool, archetype, or a unit's mark changes.
 *
 * Rule: "If a Trait is taken, all models/units in the army must be upgraded
 * with it, unless stated otherwise." (Army Customisation, CSM codex)
 */
function applyArmyTraits(
  army: RosterEntry[],
  traitPool: string[],
  data: FactionData,
  _archetype: string,
  legacy?: string,
): RosterEntry[] {
  if (!traitPool.length) return army.map(e => ({ ...e, traits: [] }));

  // Holy Trinity forces 3 traits at a combined flat cost of 10 pts per non-character unit
  if (legacy === 'The Holy Trinity') {
    return army.map(item => {
      const unit = resolveUnit(item, data);
      if (!unit) return { ...item, traits: [] };
      const isMainFaction = item.unitName in data.units;
      if (!isMainFaction || !unit.has_veteran_abilities) return { ...item, traits: [] };
      // Characters get the traits at no cost (pts_char = 0 for all three)
      const traits: TraitSelection[] = traitPool.map((name, i) => ({
        name,
        points: unit.is_character ? 0 : i === 0 ? 10 : 0,
      }));
      return { ...item, traits };
    });
  }

  // Filter out army-only traits (they have no per-unit cost)
  const unitTraitNames = traitPool.filter(name => {
    const def = data.traits.find(t => t.name === name);
    return def && !isArmyOnlyTrait(def);
  });

  return army.map(item => {
    const unit = resolveUnit(item, data);
    if (!unit) return { ...item, traits: [] };

    // Traits apply only to main faction units (not allied units)
    const isMainFaction = item.unitName in data.units;
    if (!isMainFaction || !unitTraitNames.length) {
      return { ...item, traits: [] };
    }

    // CSM: traits only apply to units with the 'Chaos Space Marine' keyword
    // (excludes Cultists, Chaos Spawn, Daemon Engines, World Eaters, Death Guard, etc.)
    if (data.faction === 'Chaos Space Marines' && !unit.keywords.includes('Chaos Space Marine')) {
      return { ...item, traits: [] };
    }

    // All selected traits apply to all eligible units — veteran_max limits only armory items
    const traits: TraitSelection[] = unitTraitNames
      .map(name => {
        const def = data.traits.find(t => t.name === name);
        if (!def) return null;

        let raw: string | null | undefined;
        if (unit.is_vehicle) {
          if (def.pts_veh !== null && def.pts_veh !== undefined) {
            // Explicit vehicle cost
            raw = def.pts_veh;
          } else if (def.pts_monster !== null && def.pts_monster !== undefined) {
            // pts_monster holds the "Monstrous Creatures & Vehicles" xlsx column.
            // Only fall back to it if the trait actually has an effect on vehicles
            // (creature-only traits like "Fallen", "Profane Zeal", "10.000 Years of Horror"
            //  have pts_monster set for monsters but must NOT apply to vehicles).
            const effects = TRAIT_EFFECTS[name] ?? [];
            const hasVehicleEffect = effects.some(e => e.applies_to === 'all' || e.applies_to === 'vehicle');
            raw = hasVehicleEffect ? def.pts_monster : null;
          } else {
            raw = null;
          }
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

    return { ...item, traits };
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
  setEngagement: (e: EngagementType) => void;
  setPointLimit: (n: number) => void;
  setHqMark: (m: Mark) => void;
  setArchetype: (a: string) => void;
  setLegacy: (l: string) => void;
  setLegacy2: (l: string) => void;
  /** Set the full army trait pool (max 2). Automatically syncs traits to all units. */
  setTraitPool: (pool: string[]) => void;
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

  addUnit: (unitName: string, slot: string, factionSource?: string) => void;
  removeUnit: (id: string) => void;
  updateUnit: (id: string, patch: Partial<RosterEntry>) => void;
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
  injectArchetypeFaction: (key: string, factionData: FactionData) => void;
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
          allied: { ...(s.data.allied ?? {}), [s.alliedFaction]: { slot_to_units: d.slot_to_units, units: d.units } },
        };
        return { alliedData: d, data: newData };
      }),

      setAlliedFaction: (key) => set((s) => {
        const prev = s.alliedFaction;
        const army = prev ? s.army.filter(e => e.factionSource !== prev) : s.army;
        return { alliedFaction: key ?? undefined, alliedData: null, army };
      }),

      setArmyName: (n: string) => set({ armyName: n }),

      setEngagement: (e: EngagementType) => set({
        engagement: e,
        pointLimit: ENGAGEMENTS[e].default,
      }),
      setPointLimit: (n: number) => set({ pointLimit: n }),
      setHqMark: (m: Mark) => set({ hqMark: m }),

      setArchetype: (a: string) => set((s: S) => {
        const army = s.data
          ? applyArmyTraits(s.army, s.traitPool, s.data, a, s.legacy)
          : s.army;
        return { archetype: a, army };
      }),

      setLegacy: (l: string) => set((s: S) => {
        if (l === 'The Holy Trinity' && s.data) {
          const holyTrioNames = ['Raging Fervour', 'Rites of Fire', 'Unshakable Vengeance'];
          return {
            legacy: l,
            traitPool: holyTrioNames,
            army: applyArmyTraits(s.army, holyTrioNames, s.data, s.archetype, l),
          };
        }
        if (s.legacy === 'The Holy Trinity' && s.data) {
          // Deselecting Holy Trinity: clear the auto-set trait pool
          return {
            legacy: l,
            traitPool: [],
            army: applyArmyTraits(s.army, [], s.data, s.archetype, l),
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
          ? applyArmyTraits(s.army, newPool, s.data, s.archetype, s.legacy)
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
          ? applyArmyTraits(withChoice, s.traitPool, s.data, s.archetype, s.legacy)
          : withChoice;
        return { army };
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

      addUnit: (unitName: string, slot: string, factionSource?: string) => {
        const s = get();
        if (!s.data) return;
        const u = factionSource
          ? s.data.allied?.[factionSource]?.units[unitName]
          : s.data.units[unitName];
        if (!u) return;
        const defaultSize = u.default_size || 1;
        const entry: RosterEntry = {
          id: newId(),
          unitName,
          slot,
          factionSource,
          size: defaultSize,
          mark: null,
          optionQty: {},
          armory: [],
          traits: [],
          powers: [],
          prayers: [],
          pacts: [],
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
        const army = applyArmyTraits(newArmy, s.traitPool, s.data, s.archetype, s.legacy);
        set({ army });
      },

      removeUnit: (id: string) => set((s: S) => ({ army: s.army.filter((e: RosterEntry) => e.id !== id) })),

      updateUnit: (id: string, patch: Partial<RosterEntry>) => set((s: S) => {
        const newArmy = s.army.map((e: RosterEntry) => e.id === id ? { ...e, ...patch } : e);
        // Re-sync traits when mark changes (mark uses a veteran slot)
        const army = ('mark' in patch) && s.data
          ? applyArmyTraits(newArmy, s.traitPool, s.data, s.archetype, s.legacy)
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

      injectArchetypeFaction: (key: string, factionData: FactionData) => set((s: S) => {
        if (!s.data) return {};
        return {
          data: {
            ...s.data,
            allied: {
              ...(s.data.allied ?? {}),
              [key]: { slot_to_units: factionData.slot_to_units, units: factionData.units },
            },
          },
        };
      }),

      importRoster: (json: string) => {
        const s = get();
        try {
          const parsed = JSON.parse(json);
          const newState = { ...defaultState, ...parsed, data: s.data };
          const army = s.data
            ? applyArmyTraits(newState.army, newState.traitPool, s.data, newState.archetype, newState.legacy)
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
