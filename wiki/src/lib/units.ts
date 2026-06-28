import type { Unit } from '../../../src/types/data';

export interface FactionUnits {
  units: Record<string, Unit>;
  slot_to_units: Record<string, string[]>;
  faction: string;
}

const LOADERS: Record<string, () => Promise<FactionUnits>> = {
  orks: () => import('../../../data/parsed/orks/units/index'),
  necrons: () => import('../../../data/parsed/necrons/units/index'),
};

export async function getFactionUnits(factionKey: string): Promise<FactionUnits> {
  const loader = LOADERS[factionKey];
  if (!loader) throw new Error(`Unknown faction key: ${factionKey}`);
  return loader();
}

export function getPilotFactionKeys(): string[] {
  return Object.keys(LOADERS);
}
