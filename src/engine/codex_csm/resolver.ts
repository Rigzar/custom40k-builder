import type { FactionResolverFn } from '../resolver';
import { applyVehicleWeaponOverrides, applyEquippedWithOverride } from './archetypes/weapon-overrides';

const SACRED_NUMBERS: Record<string, number> = {
  Khorne: 8, Nurgle: 7, Slaanesh: 6, Tzeentch: 9,
};

function applyArchetypeWeaponDisplay(weapons: import('../../types/data').Weapon[], unit: import('../../types/data').Unit, archetype: string) {
  let ws = unit.is_vehicle ? applyVehicleWeaponOverrides(weapons, archetype) : weapons;
  if (archetype === 'Plaguehost') {
    ws = ws.map(w =>
      w.name === 'Frag grenade'
        ? { ...w, name: 'Blight grenades', abilities: w.abilities && w.abilities !== '-' ? `${w.abilities}, Poison(4+)` : 'Poison(4+)' }
        : w
    );
  }
  return ws;
}

export const csmResolve: FactionResolverFn = (base, item, unit, state) => {
  const equippedWith = unit.is_vehicle
    ? applyEquippedWithOverride(base.equippedWith, state.archetype)
    : base.equippedWith;

  // Archetype renames (Plaguehost's "Combi-flamer" → "Combi-plague belcher", etc.) must NOT be
  // baked into `weapons` here — computeWeaponsToShow gates optional weapons by matching choice
  // names from unit.option_groups against the ORIGINAL weapon names; renaming first breaks that
  // match (the weapon becomes permanently hidden, or permanently shown if it was the default).
  // Instead, stash the rename as a post-gating transform (see ResolvedProfile.weaponDisplayOverride).
  const weapons = base.weapons;
  const weaponDisplayOverride = (ws: import('../../types/data').Weapon[]) => applyArchetypeWeaponDisplay(ws, unit, state.archetype);

  // Favored Units grants its bonus to the unit's "squad leader" — a single model with
  // sole access to the armory. Units with neither armory nor champion armory access
  // (e.g. Poxwalkers) have no such model, so they cannot be Favored.
  const isFavored =
    !!base.effectiveMark &&
    base.effectiveMark !== 'Undivided' &&
    SACRED_NUMBERS[base.effectiveMark] != null &&
    item.size > 0 &&
    item.size % SACRED_NUMBERS[base.effectiveMark] === 0 &&
    (unit.has_armory_access || unit.champion_has_armory);

  const injectedAbilities = [...base.injectedAbilities];

  // ── Mark ability injections for non-locked, player-selected marks ────────────
  // statModMark is set only for user-selected marks (locked-mark units already have
  // stats baked into their profile). We inject visible reminders of what each mark does.
  if (base.statModMark && !base.blackCrusadeChampion) {
    const isChar = unit.is_character;
    const isMon  = unit.is_monster;
    const isVeh  = unit.is_vehicle;

    if (base.statModMark === 'Khorne') {
      if (isVeh)              injectedAbilities.push('Mark of Khorne: Tank Shock causes double hits');
      else if (isChar || isMon) injectedAbilities.push('Mark of Khorne: +1 Attack, +1 Strength');
      else                    injectedAbilities.push('Mark of Khorne: +1 Attack');

    } else if (base.statModMark === 'Nurgle') {
      if (isVeh)              injectedAbilities.push('Mark of Nurgle: Roll 2D6 during each Reinforce phase; 7+ removes Crew Shaken / Engine Damage / Weapon Damage or restores 1 HP');
      else if (isChar || isMon) injectedAbilities.push('Mark of Nurgle: +1 Toughness, +1 Wound');
      else                    injectedAbilities.push('Mark of Nurgle: +1 Toughness');

    } else if (base.statModMark === 'Slaanesh') {
      if (isVeh)              injectedAbilities.push('Mark of Slaanesh: Enemy units within 18″ suffer −1 Leadership (−2 within 9″)');
      else if (isChar || isMon) injectedAbilities.push('Mark of Slaanesh: +1 Initiative, +2″ Movement');
      else                    injectedAbilities.push('Mark of Slaanesh: +1 Initiative');

    } else if (base.statModMark === 'Tzeentch') {
      if (!unit.abilities.some(a => a.toLowerCase().includes('warded'))) {
        // Warded is the base benefit; vehicles and char/monsters get additional bonuses
        if (isVeh) {
          injectedAbilities.push('Mark of Tzeentch: Warded · Gains a Warpflamer (9″ Assault4 S4 AP−1)');
        } else if ((isChar || isMon) && unit.is_psyker) {
          injectedAbilities.push('Mark of Tzeentch: Warded · +1 psychic power & deny per turn');
        } else if (isChar || isMon) {
          injectedAbilities.push('Mark of Tzeentch: Warded · Becomes a psyker (1 power from any discipline)');
        } else {
          injectedAbilities.push('Warded');
        }
      }
    }
  }

  // ── Black Crusade champion: inject all four god mark bonuses simultaneously ──
  // Note: we do NOT fall through to the block above — BC champion gets its own
  // combined display regardless of which mark (if any) the unit itself has.
  if (base.blackCrusadeChampion) {
    const isChar = unit.is_character;
    const isVeh  = unit.is_vehicle;

    injectedAbilities.push(
      isVeh ? 'Mark of Khorne: Tank Shock causes double hits'
      : isChar ? 'Mark of Khorne: +1 Strength'
      : 'Mark of Khorne: +1 Attack',
    );
    injectedAbilities.push(
      isVeh ? 'Mark of Nurgle: Recover damage during Reinforce (2D6, 7+)'
      : isChar ? 'Mark of Nurgle: +1 Wound'
      : 'Mark of Nurgle: +1 Toughness',
    );
    injectedAbilities.push(
      isVeh ? 'Mark of Slaanesh: Enemy units within 18″ suffer -1 Leadership (-2 within 9″)'
      : isChar ? 'Mark of Slaanesh: +2″ Movement'
      : 'Mark of Slaanesh: +1 Initiative',
    );
    if (isVeh) {
      injectedAbilities.push('Mark of Tzeentch: Warded · Gains a Warpflamer (9″ Assault4 S4 AP−1)');
    } else {
      injectedAbilities.push(
        isChar && unit.is_psyker
          ? 'Mark of Tzeentch: Warded · +1 psychic power per turn'
          : 'Mark of Tzeentch: Warded',
      );
    }
  }

  return { ...base, equippedWith, weapons, weaponDisplayOverride, isFavored, injectedAbilities };
};
