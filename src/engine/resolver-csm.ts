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

  // Tzeentch mark: inject Warded ability if not already present
  if (
    (base.statModMark === 'Tzeentch' || base.blackCrusadeChampion) &&
    !unit.abilities.some(a => a.toLowerCase().includes('warded'))
  ) {
    injectedAbilities.push('Warded');
  }

  // Black Crusade champion: inject the bonus text for all four god marks
  if (base.blackCrusadeChampion) {
    const isChar = unit.is_character;
    const isVeh = unit.is_vehicle;
    injectedAbilities.push(
      isVeh
        ? 'Mark of Khorne: Tank Shock causes double hits'
        : isChar
          ? 'Mark of Khorne: +1 Strength'
          : 'Mark of Khorne: +1 Attack',
    );
    injectedAbilities.push(
      isVeh
        ? 'Mark of Nurgle: Recover damage during Reinforce (2D6, 7+)'
        : isChar
          ? 'Mark of Nurgle: +1 Wound'
          : 'Mark of Nurgle: +1 Toughness',
    );
    injectedAbilities.push(
      isVeh
        ? 'Mark of Slaanesh: Enemy units within 18″ suffer -1 Leadership (-2 within 9″)'
        : isChar
          ? 'Mark of Slaanesh: +2″ Movement'
          : 'Mark of Slaanesh: +1 Initiative',
    );
    if (!isVeh) {
      injectedAbilities.push(
        isChar && unit.is_psyker
          ? 'Mark of Tzeentch: Warded · +1 psychic power per turn'
          : 'Mark of Tzeentch: Warded',
      );
    } else {
      injectedAbilities.push('Mark of Tzeentch: Gains a Warpflamer (9″ Assault4 S4 AP−1)');
    }
  }

  return { ...base, equippedWith, weapons, isFavored, injectedAbilities };
};
