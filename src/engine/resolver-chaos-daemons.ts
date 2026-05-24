import type { FactionResolverFn } from './resolver';

const SACRED_NUMBERS: Record<string, number> = {
  Khorne: 8, Nurgle: 7, Slaanesh: 6, Tzeentch: 9,
};

export const cdResolve: FactionResolverFn = (base, item, unit, _state) => {
  // ── Favored Units ────────────────────────────────────────────────────────────
  // A unit is Favored when its size is a multiple of the mark's sacred number.
  // Works for both locked-mark units (effectiveMark = locked_mark) and
  // chooseable-mark units (effectiveMark = item.mark).
  const isFavored =
    !!base.effectiveMark &&
    base.effectiveMark !== 'Undivided' &&
    SACRED_NUMBERS[base.effectiveMark] != null &&
    item.size > 0 &&
    item.size % SACRED_NUMBERS[base.effectiveMark] === 0;

  const injectedAbilities = [...base.injectedAbilities];
  const isVeh  = unit.is_vehicle;
  const isChar = unit.is_character;

  // ── Mark ability injection ───────────────────────────────────────────────────
  // Only for units that CHOOSE their mark (Daemon Prince, Soul Grinder, Demon Brutes).
  // statModMark is null for locked-mark units — their benefits are already in their profile.
  if (base.statModMark) {
    switch (base.statModMark) {
      case 'Tzeentch':
        if (isVeh) {
          injectedAbilities.push('Mark of Tzeentch: Gains a Warpflamer (9″ Assault4 S4 AP−1)');
        } else {
          if (!unit.abilities.some(a => a.toLowerCase().includes('warded'))) {
            injectedAbilities.push('Warded');
          }
          if (isChar && unit.is_psyker) {
            injectedAbilities.push('Mark of Tzeentch: +1 psychic power per turn');
          }
        }
        break;
      case 'Khorne':
        if (isVeh) injectedAbilities.push('Mark of Khorne: Tank Shock causes double hits');
        break;
      case 'Nurgle':
        if (isVeh) injectedAbilities.push('Mark of Nurgle: Recover damage during Reinforce (2D6, 7+)');
        break;
      case 'Slaanesh':
        if (isVeh) injectedAbilities.push('Mark of Slaanesh: Enemy units within 18″ suffer -1 Leadership (−2 within 9″)');
        break;
    }
  }

  // ── Pending rules (to implement) ─────────────────────────────────────────────
  //   - Entourage: for each Greater Daemon of the same god, up to 2 heralds don't use an HQ slot
  //   - Herald:    up to 2 units with this rule can share a single HQ choice
  //   - Bound Beast: for every HQ with Mark of Khorne, 1 Slaughterbrute costs no FA slot
  //   - Ascended Daemon Prince: moves to HQ slot, upgrades stats
  //   - Archetype effects: Goretide (wound-on-death roll), Popping Plague (explosion on death), etc.

  return { ...base, isFavored, injectedAbilities };
};
