import type { FactionResolverFn } from './resolver';
import { applyVehicleWeaponOverrides, applyEquippedWithOverride, getSelectedCombiWeapon } from './weapons/csm';

const SACRED_NUMBERS: Record<string, number> = {
  Khorne: 8, Nurgle: 7, Slaanesh: 6, Tzeentch: 9,
};

export const csmResolve: FactionResolverFn = (base, item, unit, state) => {
  const equippedWith = unit.is_vehicle
    ? applyEquippedWithOverride(base.equippedWith, state.archetype)
    : base.equippedWith;

  let weapons = base.weapons;
  if (unit.is_vehicle) {
    // When a player selects Combi-flamer/Combi-melta from option groups, rename the
    // Combi-bolter entry in unit.weapons first so the archetype override is applied
    // to the correct weapon name (e.g. → "Combi-plague belcher" for Plaguehost+flamer).
    const selectedCombi = getSelectedCombiWeapon(item, unit);
    if (selectedCombi && selectedCombi !== 'Combi-bolter') {
      weapons = weapons.map(w => w.name === 'Combi-bolter' ? { ...w, name: selectedCombi } : w);
    }
    weapons = applyVehicleWeaponOverrides(weapons, state.archetype);
  }

  if (state.archetype === 'Plaguehost') {
    weapons = weapons.map(w =>
      w.name === 'Frag grenade'
        ? { ...w, name: 'Blight grenades', abilities: w.abilities && w.abilities !== '-' ? `${w.abilities}, Poison(4+)` : 'Poison(4+)' }
        : w
    );
  }

  const isFavored =
    !!base.effectiveMark &&
    base.effectiveMark !== 'Undivided' &&
    SACRED_NUMBERS[base.effectiveMark] != null &&
    item.size > 0 &&
    item.size % SACRED_NUMBERS[base.effectiveMark] === 0;

  const injectedAbilities = [...base.injectedAbilities];
  if (
    base.statModMark === 'Tzeentch' &&
    !unit.abilities.some(a => a.toLowerCase().includes('warded'))
  ) {
    injectedAbilities.push('Warded');
  }

  return { ...base, equippedWith, weapons, isFavored, injectedAbilities };
};
