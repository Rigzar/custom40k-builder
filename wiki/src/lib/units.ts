import type { Unit } from '../vendor/src/types/data';

export interface FactionUnits {
  units: Record<string, Unit>;
  slot_to_units: Record<string, string[]>;
  faction: string;
}

const ESCALATION_FACTION_KEYS = [
  'chaos_space_marines', 'space_marines', 'adeptus_sororitas', 'imperial_guard',
  'eldar', 'orks', 'necrons', 'tau_empire',
];

async function loadEscalation(): Promise<FactionUnits> {
  const allUnits: Record<string, Unit> = {};
  const slotToUnits: Record<string, string[]> = {};
  for (const fKey of ESCALATION_FACTION_KEYS) {
    const loader = LOADERS[fKey];
    if (!loader) continue;
    const mod = await loader();
    const lowSlot = Object.keys(mod.slot_to_units).find(s => s.toLowerCase().includes('lord'));
    if (lowSlot) {
      const unitKeys = mod.slot_to_units[lowSlot];
      const factionLabel = fKey.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
      slotToUnits[factionLabel] = unitKeys;
      for (const key of unitKeys) {
        if (mod.units[key]) allUnits[key] = mod.units[key];
      }
    }
  }
  return { units: allUnits, slot_to_units: slotToUnits, faction: 'Escalation' };
}

const LOADERS: Record<string, () => Promise<FactionUnits>> = {
  chaos_space_marines: () => import('../vendor/data/parsed/chaos_space_marines/units/index'),
  chaos_daemons: () => import('../vendor/data/parsed/chaos_daemons/units/index'),
  space_marines: () => import('../vendor/data/parsed/space_marines/units/index'),
  imperial_guard: () => import('../vendor/data/parsed/imperial_guard/units/index'),
  adeptus_mechanicus: () => import('../vendor/data/parsed/adeptus_mechanicus/units/index'),
  adeptus_custodes: () => import('../vendor/data/parsed/adeptus_custodes/units/index'),
  adeptus_sororitas: () => import('../vendor/data/parsed/adeptus_sororitas/units/index'),
  grey_knights: () => import('../vendor/data/parsed/grey_knights/units/index'),
  inquisition: () => import('../vendor/data/parsed/inquisition/units/index'),
  assassins: () => import('../vendor/data/parsed/assassins/units/index'),
  tau_empire: () => import('../vendor/data/parsed/tau_empire/units/index'),
  necrons: () => import('../vendor/data/parsed/necrons/units/index'),
  orks: () => import('../vendor/data/parsed/orks/units/index'),
  eldar: () => import('../vendor/data/parsed/eldar/units/index'),
  dark_eldar: () => import('../vendor/data/parsed/dark_eldar/units/index'),
  genestealer_cults: () => import('../vendor/data/parsed/genestealer_cults/units/index'),
  harlequins: () => import('../vendor/data/parsed/harlequins/units/index'),
  leagues_of_votann: () => import('../vendor/data/parsed/leagues_of_votann/units/index'),
  tyranids: () => import('../vendor/data/parsed/tyranids/units/index'),
  horus_heresy: async () => {
    const mod = await import('../vendor/data/parsed/_supplements/horus_heresy.json');
    const data = (mod.default ?? mod) as unknown as { units: Record<string, Unit>; slot_to_units: Record<string, string[]> };
    return { units: data.units, slot_to_units: data.slot_to_units, faction: 'Horus Heresy' };
  },
  escalation: loadEscalation,
};

export async function getFactionUnits(factionKey: string): Promise<FactionUnits> {
  const loader = LOADERS[factionKey];
  if (!loader) throw new Error(`Unknown faction key: ${factionKey}`);
  return loader();
}

export function getPilotFactionKeys(): string[] {
  return Object.keys(LOADERS);
}
