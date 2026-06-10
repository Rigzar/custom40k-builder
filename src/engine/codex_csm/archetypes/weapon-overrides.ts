import type { Unit } from '../../../types/data';
import type { RosterEntry } from '../../../types/army';

interface WeaponOverride {
  name?: string;
  addAbility?: string;
}

const VEHICLE_WEAPON_OVERRIDES: Record<string, Record<string, WeaponOverride>> = {
  'All is Dust': {
    'Combi-bolter': { name: 'Inferno combi-bolter' },
    'Combi-flamer': { name: 'Inferno combi-warpflamer' },
    'Combi-melta':  { name: 'Inferno combi-melta' },
  },
  'Plaguehost': {
    'Combi-bolter': { addAbility: 'Poison(4+)' },
    'Combi-flamer': { name: 'Combi-plague belcher', addAbility: 'Poison(4+)' },
    'Combi-melta':  { addAbility: 'Poison(4+) on bolter' },
  },
};

export const COMBI_SURCHARGE: Record<string, { bolter: number; flamer: number; melta: number }> = {
  'All is Dust': { bolter: 2, flamer: 4, melta: 1 },
  'Plaguehost':  { bolter: 2, flamer: 4, melta: 2 },
};

export function applyVehicleWeaponOverrides<T extends { name: string; abilities?: string }>(
  weapons: T[],
  archetype: string,
): T[] {
  const overrides = VEHICLE_WEAPON_OVERRIDES[archetype];
  if (!overrides) return weapons;
  return weapons.map(w => {
    const ov = overrides[w.name];
    if (!ov) return w;
    const newName = ov.name ?? w.name;
    const base = w.abilities && w.abilities !== '-' ? w.abilities : '';
    const newAbilities = ov.addAbility
      ? [base, ov.addAbility].filter(Boolean).join(', ')
      : (base || '-');
    return { ...w, name: newName, abilities: newAbilities };
  });
}

export function applyEquippedWithOverride(text: string, archetype: string): string {
  const overrides = VEHICLE_WEAPON_OVERRIDES[archetype];
  if (!overrides) return text;
  let result = text;
  for (const [from, ov] of Object.entries(overrides)) {
    if (!ov.name) continue;
    result = result.replace(new RegExp(from.replace('-', '[-\\s]'), 'gi'), ov.name);
  }
  return result;
}

/** Returns the combi weapon name selected in option groups, or null if none/default. */
export function getSelectedCombiWeapon(item: RosterEntry, unit: Unit): string | null {
  for (const [gi, ch] of Object.entries(item.optionQty ?? {})) {
    const g = unit.option_groups[Number(gi)];
    if (!g) continue;
    for (const [ci, qty] of Object.entries(ch)) {
      if (ci === '__inline' || !qty) continue;
      const choice = g.choices[parseInt(ci)];
      if (!choice) continue;
      const n = choice.name;
      if (n === 'Combi-flamer' || n === 'Combi-bolter' || n === 'Combi-melta') return n;
    }
  }
  return null;
}

export function computeVehicleCombiSurcharge(item: RosterEntry, unit: Unit, archetype: string): number {
  const costs = COMBI_SURCHARGE[archetype];
  if (!costs || !unit.is_vehicle) return 0;

  let extra = 0;

  const equipped = (unit.equipped_with ?? '').toLowerCase();
  if (equipped.includes('combi-bolter') || equipped.includes('combi bolter')) extra += costs.bolter;
  if (equipped.includes('combi-flamer') || equipped.includes('combi flamer')) extra += costs.flamer;
  if (equipped.includes('combi-melta'))                                        extra += costs.melta;

  for (const [gi, ch] of Object.entries(item.optionQty ?? {})) {
    const g = unit.option_groups[Number(gi)];
    if (!g) continue;
    for (const [ci, qty] of Object.entries(ch)) {
      if (ci === '__inline' || !qty) continue;
      const choice = g.choices[parseInt(ci)];
      if (!choice) continue;
      const n = choice.name.toLowerCase();
      if (n.includes('combi-bolter') || n.includes('combi bolter')) extra += costs.bolter * qty;
      else if (n.includes('combi-flamer') || n.includes('combi flamer'))       extra += costs.flamer * qty;
      else if (n.includes('combi-melta'))                                       extra += costs.melta  * qty;
    }
  }

  return extra;
}
