/**
 * Leagues of Votann Trait effects.
 *
 * SOURCE: data/parsed/leagues_of_votann/archetypes.json "traits" (canonical desc text).
 *
 * Status: complete — all 16 traits encoded. No second-Legacy trait exists in this faction's
 * trait list (unlike most others) — that's a genuine .ods fact, not a missing entry.
 */

import type { TraitEffect } from '../traitEffects';

export const VOTANN_TRAIT_EFFECTS: Record<string, TraitEffect[]> = {

  // SOURCE — Brutal Efficiency:
  // "The unit's weapons gain 'Deflagrate(5+)' against targets with one or more Judgement tokens."
  // COST: 5 | 0 | 5 | -
  'Brutal Efficiency': [
    { type: 'weapon_ability', name: 'Deflagrate(5+)', applies_to: 'all' },
  ],

  // SOURCE — Dour Survivalists:
  // "After this unit resolves a 'Stand & Shoot' order, it can't receive any Battleshock tokens
  //  until its next activation."
  // COST: 5 | 0 | - | -
  'Dour Survivalists': [
    {
      type: 'unit_ability',
      name: 'Dour Survivalists',
      desc: 'After this unit resolves a "Stand & Shoot" order, it can\'t receive any Battleshock tokens until its next activation.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Frontier Momentum:
  // "The unit is able to use the 'Advance' command."
  // COST: 5 | 0 | - | -
  'Frontier Momentum': [
    {
      type: 'unit_ability',
      name: 'Frontier Momentum',
      desc: 'The unit is able to use the "Advance" command.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Fury from the Delve:
  // "The unit gains the 'Deep strike' ability."
  // COST: 5 | 0 | - | -
  'Fury from the Delve': [
    { type: 'unit_ability', name: 'Deep Strike', applies_to: 'all' },
  ],

  // SOURCE — Grudgebearers:
  // "During each Command phase, all enemy units that are currently holding a mission
  //  objective receive a Judgement token."
  // COST: 7 | 0 | 7 | -
  'Grudgebearers': [
    {
      type: 'unit_ability',
      name: 'Grudgebearers',
      desc: 'During each Command phase, all enemy units currently holding a mission objective receive a Judgement token.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Honor in Toil:
  // "If this unit is at or below half its starting strength or has suffered at least two
  //  Permanent or Structural damage results, add +1 to all its hit rolls."
  // COST: 5 | 0 | 5 | -
  'Honor in Toil': [
    {
      type: 'unit_ability',
      name: 'Honor in Toil',
      desc: 'If this unit is at or below half its starting strength or has suffered at least two Permanent or Structural damage results, add +1 to all its hit rolls.',
      applies_to: 'all',
    },
  ],

  // SOURCE — HUNTR's Mark:
  // "Vehicles can fire one additional weapon if they move more than 6\" and up to 12\"."
  // COST: - | - | 5 | -
  'HUNTR\'s Mark': [
    {
      type: 'unit_ability',
      name: 'HUNTR\'s Mark',
      desc: 'Vehicles can fire one additional weapon if they move more than 6" and up to 12".',
      applies_to: 'all',
    },
  ],

  // SOURCE — Ironskein:
  // "The unit can re-roll one save per battle round."
  // COST: 5 | 0 | - | -
  'Ironskein': [
    {
      type: 'unit_ability',
      name: 'Ironskein',
      desc: 'The unit can re-roll one save per battle round.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Martial Cloneskeins:
  // "If the unit uses a Charge order or gets charged by an enemy unit, it gains +1 Strength
  //  until the end of the current battle round."
  // COST: 5 | 0 | 5 | -
  'Martial Cloneskeins': [
    {
      type: 'unit_ability',
      name: 'Martial Cloneskeins',
      desc: 'If the unit uses a Charge order or gets charged, it gains +1 Strength until the end of the current battle round.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Master Salvagers:
  // "Vehicles can use the 'Brokhyr's Guild' ability (See Brokhyr Iron-master) on themselves,
  //  but only for repairs."
  // COST: - | - | 5 | -
  'Master Salvagers': [
    {
      type: 'unit_ability',
      name: 'Master Salvagers',
      desc: 'Vehicles can use the "Brôkhyr\'s Guild" ability (see Brôkhyr Iron-master) on themselves, but only for repairs.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Pan-Spectral Visualizers:
  // "The unit gains the 'Sunder(1)' ability for all ranged attacks."
  // COST: 5 | 0 | 5 | -
  'Pan-Spectral Visualizers': [
    {
      type: 'weapon_ability',
      name: 'Sunder(1)',
      weapon_type: 'ranged',
      applies_to: 'all',
    },
  ],

  // SOURCE — Quick to Judge:
  // "When this unit removes one or more models, or suffers Permanent or Structural damage,
  //  roll 1D6. On a 4+, the attacking enemy unit gains one Judgement token."
  // COST: 5 | 0 | 5 | -
  'Quick to Judge': [
    {
      type: 'unit_ability',
      name: 'Quick to Judge',
      desc: 'When this unit removes one or more models, or suffers Permanent or Structural damage, roll 1D6. On a 4+, the attacking enemy unit gains one Judgement token.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Ranger Outriders:
  // "The unit gains the 'Vanguard' ability."
  // COST: 5 | 0 | 5 | -
  'Ranger Outriders': [
    { type: 'unit_ability', name: 'Vanguard', applies_to: 'all' },
  ],

  // SOURCE — Trivärg Cyber Implants:
  // "If the unit disembarked from a transport this round, all of its weapons gain the
  //  'Armor piercing(5+)' ability for this activation."
  // COST: 5 | 0 | - | -
  'Trivärg Cyber Implants': [
    {
      type: 'unit_ability',
      name: 'Trivärg Cyber Implants',
      desc: 'If the unit disembarked from a transport this round, all of its weapons gain the "Armor piercing(5+)" ability for this activation.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Vengeful:
  // "When this unit is removed from the game, place two Judgement tokens next to the enemy
  //  unit that caused the last wound instead of one."
  // COST: 0 | 0 | 0 | -
  'Vengeful': [
    {
      type: 'unit_ability',
      name: 'Vengeful',
      desc: 'When this unit is removed from the game, place two Judgement tokens next to the enemy unit that caused the last wound instead of one.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Voidship Specialists:
  // "The unit does not suffer the to hit penalty from Defensive Fire."
  // COST: 5 | 0 | 5 | -
  'Voidship Specialists': [
    {
      type: 'unit_ability',
      name: 'Voidship Specialists',
      desc: 'The unit does not suffer the to hit penalty from Defensive Fire.',
      applies_to: 'all',
    },
  ],

};
