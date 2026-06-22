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
    // Combi-plague belcher's own profile names are "Bolter" / "Plague belcher" (per the Nurgle
    // Armoury's canonical weapon entry), NOT "Bolter" / "Flamer" — the flamer sub-profile's name
    // changes too, not just the base weapon name, so each profile needs its own exact-key override.
    'Combi-flamer - Bolter': { name: 'Combi-plague belcher - Bolter', addAbility: 'Poison(4+)' },
    'Combi-flamer - Flamer': { name: 'Combi-plague belcher - Plague belcher', addAbility: 'Poison(4+)' },
    'Combi-melta - Bolter': { addAbility: 'Poison(4+)' },
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
    // Vehicles with multi-profile combis store sub-profiles as "Combi-flamer - Bolter" /
    // "Combi-flamer - Flamer" etc. (Rhino/Predator/Land Raider/Defiler/Vindicator convention).
    // Try the exact profile name first (lets a profile-specific entry like
    // "Combi-melta - Bolter" opt in without affecting "Combi-melta - Melta"), then fall back
    // to the un-suffixed base name so a base-name override still reaches every sub-profile.
    const baseN = w.name.split(' - ')[0];
    const suffix = w.name.length > baseN.length ? w.name.slice(baseN.length) : '';
    const exact = overrides[w.name];
    const ov = exact ?? overrides[baseN];
    if (!ov) return w;
    // An exact full-name match's `name` is the COMPLETE replacement (it may rename the profile
    // suffix too, e.g. Plaguehost's "Flamer" → "Plague belcher" — the canonical profile name on
    // the Combi-plague belcher Armory entry). A base-name-only match only rewrites the base;
    // the suffix (profile name) is preserved as-is.
    const newName = exact?.name ?? ((ov.name ?? baseN) + suffix);
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
