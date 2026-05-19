import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ArmyState, RosterEntry, Mark, EngagementType, ArmorySelection, TraitSelection } from '../types/army';
import type { FactionData, Trait } from '../types/data';
import { ENGAGEMENTS } from '../engine/engagements';
import { resolveUnit } from '../engine/points';

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
): RosterEntry[] {
  if (!traitPool.length) return army.map(e => ({ ...e, traits: [] }));

  // Filter out army-only traits (they have no per-unit cost)
  const unitTraitNames = traitPool.filter(name => {
    const def = data.traits.find(t => t.name === name);
    return def && !isArmyOnlyTrait(def);
  });

  return army.map(item => {
    const unit = resolveUnit(item, data);
    if (!unit) return { ...item, traits: [] };

    // Traits apply only to main faction units (not allied units) with the correct keyword
    const isMainFaction = item.unitName in data.units;
    if (!isMainFaction || !unit.has_veteran_abilities || !unitTraitNames.length) {
      return { ...item, traits: [] };
    }

    // All selected traits apply to all eligible units — veteran_max limits only armory items
    const traits: TraitSelection[] = unitTraitNames
      .map(name => {
        const def = data.traits.find(t => t.name === name);
        if (!def) return null;
        const raw = unit.is_vehicle ? def.pts_veh
          : unit.is_character ? def.pts_char
          : unit.is_monster ? def.pts_monster
          : def.pts_unit;
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
          };
        }
        return { data: d };
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
          ? applyArmyTraits(s.army, s.traitPool, s.data, a)
          : s.army;
        return { archetype: a, army };
      }),

      setLegacy: (l: string) => set({ legacy: l }),
      setLegacy2: (l: string) => set({ legacy2: l }),

      setTraitPool: (pool: string[]) => set((s: S) => {
        const newPool = pool.slice(0, 2); // enforce max 2
        const army = s.data
          ? applyArmyTraits(s.army, newPool, s.data, s.archetype)
          : s.army;
        return { traitPool: newPool, army };
      }),

      setUnitTraitChoice: (id: string, choices: string[]) => set((s: S) => {
        const withChoice = s.army.map(e =>
          e.id === id ? { ...e, traitChoice: choices } : e,
        );
        const army = s.data
          ? applyArmyTraits(withChoice, s.traitPool, s.data, s.archetype)
          : withChoice;
        return { army };
      }),

      addUnit: (unitName: string, slot: string, factionSource?: string) => {
        const s = get();
        if (!s.data) return;
        const u = factionSource
          ? s.data.allied?.[factionSource]?.units[unitName]
          : s.data.units[unitName];
        if (!u) return;
        const entry: RosterEntry = {
          id: newId(),
          unitName,
          slot,
          factionSource,
          size: u.default_size || 1,
          mark: null,
          optionQty: {},
          armory: [],
          traits: [],
          powers: [],
          prayers: [],
        };
        const newArmy = [...s.army, entry];
        const army = applyArmyTraits(newArmy, s.traitPool, s.data, s.archetype);
        set({ army });
      },

      removeUnit: (id: string) => set((s: S) => ({ army: s.army.filter((e: RosterEntry) => e.id !== id) })),

      updateUnit: (id: string, patch: Partial<RosterEntry>) => set((s: S) => {
        const newArmy = s.army.map((e: RosterEntry) => e.id === id ? { ...e, ...patch } : e);
        // Re-sync traits when mark changes (mark uses a veteran slot)
        const army = ('mark' in patch) && s.data
          ? applyArmyTraits(newArmy, s.traitPool, s.data, s.archetype)
          : newArmy;
        return { army };
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

      importRoster: (json: string) => {
        const s = get();
        try {
          const parsed = JSON.parse(json);
          const newState = { ...defaultState, ...parsed, data: s.data };
          const army = s.data
            ? applyArmyTraits(newState.army, newState.traitPool, s.data, newState.archetype)
            : newState.army;
          set({ ...newState, army });
        } catch { /* ignore malformed */ }
      },

      clearArmy: () => set({ ...defaultState, data: get().data }),
    }),
    {
      name: 'custom40k-army',
      version: 1,
      migrate: (persisted: unknown, fromVersion: number) => {
        const s = persisted as Record<string, unknown>;
        if (fromVersion < 1) {
          // pointLimit default was 3000 for pitched — fix to 2500
          if (s.pointLimit === 3000 && s.engagement === 'pitched') {
            s.pointLimit = 2500;
          }
        }
        return s;
      },
      partialize: (s: ArmyStore) => ({
        armyName: s.armyName, faction: s.faction, engagement: s.engagement,
        pointLimit: s.pointLimit, hqMark: s.hqMark, archetype: s.archetype,
        legacy: s.legacy, legacy2: s.legacy2, traitPool: s.traitPool, army: s.army,
      }),
    }
  )
);
