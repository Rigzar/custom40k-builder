import type { TraitEffect } from '../traitEffects';

/**
 * CSM trait effects — 17 traits.
 *
 * applies_to guide:
 *   'all'      → creature + vehicle
 *   'creature' → non-vehicle (infantry, characters, monsters)
 *   'vehicle'  → vehicles only
 *   'monster'  → monstrous creatures only
 *   'character'→ characters only
 *   'infantry' → non-vehicle, non-monster, non-character
 *
 * Point costs (per unit, from spreadsheet):
 *   unit | char | monster | veh
 *   Traits with "Only for creature units" → monster gets cost, vehicle does not.
 */
export const CSM_TRAIT_EFFECTS: Record<string, TraitEffect[]> = {

  // unit=5 | char=0 | monster=5 | veh=-
  // "Only for creature units" — vehicles excluded, monsters included
  '10.000 Years of Horror': [
    {
      type: 'unit_ability',
      name: 'Hardened by Millennia',
      desc: 'This unit ignores all negative modifiers to its Leadership.',
      applies_to: 'creature',
    },
  ],

  // unit=- | char=Special | monster=- | veh=-
  // Army-level rule only (each HQ must carry a different god mark) — no per-unit effect.
  'Black Crusade': [],

  // unit=5 | char=0 | monster=5 | veh=5
  'Blood Feud': [
    {
      type: 'unit_ability',
      name: 'Blood Feud',
      desc: '+1 to hit rolls in melee if this unit charged or was charged this turn.',
      applies_to: 'all',
    },
  ],

  // unit=5 | char=0 | monster=- | veh=-
  // Vehicles and monsters excluded (inv save does not apply to them)
  'Desecration': [
    {
      type: 'unit_ability',
      name: 'Desecration',
      desc: 'This unit has a 5+ invulnerability save while within 6" of an objective marker. Does not work against weapons with Strength 8 or above.',
      applies_to: 'infantry',
    },
  ],

  // unit=5 | char=0 | monster=5 | veh=-
  // "Only for creature units"
  'Fallen': [
    {
      type: 'unit_ability',
      name: 'They Shall Know No Fear',
      desc: 'This unit automatically passes Morale tests and never flees.',
      applies_to: 'creature',
    },
  ],

  // unit=5 | char=0 | monster=5 | veh=5
  'Hatred Unleashed': [
    {
      type: 'weapon_ability',
      name: '+1 to hit vs. nearest enemy',
      weapon_type: 'ranged',
      applies_to: 'all',
    },
  ],

  // unit=5 | char=0 | monster=5 | veh=5
  'Horrors of the Night': [
    {
      type: 'unit_ability',
      name: 'Horrors of the Night',
      desc: '+1 to hit and wound rolls in melee against Shocked or Outnumbered enemy units.',
      applies_to: 'all',
    },
  ],

  // unit=2* | char=0 | monster=5* | veh=5*
  // Creatures: 6+ inv save (per wound cost). Vehicles: Iron Repair ability (per hull-point cost).
  'Iron Within, Iron Without': [
    {
      type: 'inv_save',
      value: 6,
      applies_to: 'creature',
    },
    {
      type: 'unit_ability',
      name: 'Iron Repair',
      desc: 'This vehicle repairs either one Engine Damage or one Weapon Damage during each Rally phase.',
      applies_to: 'vehicle',
    },
  ],

  // unit=5 | char=- | monster=- | veh=-
  // Only regular creature units; characters, monsters and vehicles excluded.
  'Laboratory Experiments': [
    { type: 'stat_mod',     stat: 'S', delta: 1,    applies_to: 'infantry' },
    { type: 'stat_mod',     stat: 'M', delta: 1,    applies_to: 'infantry' },
    {
      type: 'unit_ability',
      name: 'Berserk(5+)',
      desc: 'When this unit rolls a 5+ to hit in melee, it may make one additional attack against the same target. At the end of each activation roll 1D6 per model — each roll of 1 inflicts 1 Mortal Wound on this unit.',
      applies_to: 'infantry',
    },
  ],

  // unit=5 | char=0 | monster=5 | veh=5
  // "Does not apply to Heavy weapons."
  'Malicious Volley': [
    {
      type: 'weapon_ability',
      name: 'Deflagrate(5+)',
      weapon_type: 'bolt',
      applies_to: 'all',
    },
  ],

  // unit=3 | char=0 | monster=3 | veh=3
  'Masters of Deception': [
    {
      type: 'unit_ability',
      name: 'Masters of Deception',
      desc: 'This unit counts as being in light cover until the first time it activates.',
      applies_to: 'all',
    },
  ],

  // unit=- | char=- | monster=- | veh=-
  // Army-level rule only (unlocks a second Legacy slot) — no per-unit effect.
  'Mixed Warband': [],

  // unit=5 | char=0 | monster=5 | veh=-
  // "Only for creature units"
  'Profane Zeal': [
    {
      type: 'unit_ability',
      name: 'Blind Rage',
      desc: 'This unit must move toward the nearest enemy during its activation and must charge if able.',
      applies_to: 'creature',
    },
  ],

  // unit=5 | char=0 | monster=5 | veh=5
  'Siege Experts': [
    {
      type: 'weapon_ability',
      name: 'Sunder(1)',
      weapon_type: 'ranged',
      applies_to: 'all',
    },
  ],

  // unit=5 | char=0 | monster=5 | veh=5
  'Superior Battle Tactics': [
    {
      type: 'unit_ability',
      name: 'Superior Battle Tactics',
      desc: 'Reduce any negative modifier to hit rolls for this unit by 1 (minimum 0).',
      applies_to: 'all',
    },
  ],

  // unit=5 | char=0 | monster=5 | veh=5
  'Terror Tactics': [
    { type: 'weapon_ability', name: 'Gruesome',       weapon_type: 'melee', applies_to: 'all' },
    {
      type: 'unit_ability',
      name: 'Terrifying(-1)',
      desc: 'Enemy units within 6" of this unit suffer -1 to their Leadership.',
      applies_to: 'all',
    },
  ],

  // unit=5 | char=0 | monster=5 | veh=5
  'Warp Pirates': [
    {
      type: 'unit_ability',
      name: 'Frenzy(1")',
      desc: 'After this unit finishes a melee attack, it may move up to 1" and make an additional attack against another eligible target.',
      applies_to: 'all',
    },
  ],
};
