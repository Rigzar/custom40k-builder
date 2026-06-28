import type { Unit } from '../vendor/src/types/data';

export interface FactionUnits {
  units: Record<string, Unit>;
  slot_to_units: Record<string, string[]>;
  faction: string;
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
};

export async function getFactionUnits(factionKey: string): Promise<FactionUnits> {
  const loader = LOADERS[factionKey];
  if (!loader) throw new Error(`Unknown faction key: ${factionKey}`);
  return loader();
}

export function getPilotFactionKeys(): string[] {
  return Object.keys(LOADERS);
}
