/**
 * Eldar Trait effects.
 *
 * SOURCE: data/parsed/eldar/archetypes.json "traits" (canonical desc text).
 *
 * Status: complete — all 15 traits encoded. "Combined War Host" (army-level second-Legacy rule)
 * is correctly an empty array, not missing data.
 */

import type { TraitEffect } from '../traitEffects';

export const ELDAR_TRAIT_EFFECTS: Record<string, TraitEffect[]> = {

  // SOURCE — Black Guardians:
  // "The unit gains +1 Leadership."
  // COST: 5 | 0 | - | -
  'Black Guardians': [
    { type: 'stat_mod', stat: 'LD', delta: 1, applies_to: 'all' },
  ],

  // SOURCE — Children of Khaine:
  // "The unit gains the 'Deadly(6+)' ability for all melee weapons."
  // COST: 5 | 0 | - | -
  'Children of Khaine': [
    {
      type: 'weapon_ability',
      name: 'Deadly(6+)',
      weapon_type: 'melee',
      applies_to: 'all',
    },
  ],

  // SOURCE — Children of Morai-Heg:
  // "If the unit is below starting strength, each model in it gains +1 attack."
  // COST: 5 | 0 | - | -
  'Children of Morai-Heg': [
    {
      type: 'unit_ability',
      name: 'Children of Morai-Heg',
      desc: 'If the unit is below starting strength, each model in it gains +1 attack.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Children of Prophecy:
  // "The unit may re-roll 1s and 2s for manifestating or denying psychic powers. Only for Psykers."
  // COST: 5 | 0 | 5 | -
  'Children of Prophecy': [
    {
      type: 'unit_ability',
      name: 'Children of Prophecy',
      desc: 'The unit may re-roll 1s and 2s for manifesting or denying psychic powers. Only for Psykers.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Children of the Open Skies:
  // "The unit gains the 'Haste(2")' ability."
  // COST: 5 | 0 | - | -
  'Children of the Open Skies': [
    { type: 'unit_ability', name: 'Haste(2")', applies_to: 'all' },
  ],

  // SOURCE — Combined War Host:
  // "The army must select a second Legacy. Each model may only select items from one Legacy armory."
  // COST: 0 | 0 | 0 | -   (army-level rule — enforced by validators; no per-unit effect)
  'Combined War Host': [],

  // SOURCE — Elite Citizenry:
  // "The unit may re-roll one to hit roll per activation."
  // COST: 5 | 0 | 5 | -
  'Elite Citizenry': [
    {
      type: 'unit_ability',
      name: 'Elite Citizenry',
      desc: 'The unit may re-roll one to hit roll per activation.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Expert Crafters:
  // "The unit may re-roll one to wound or armor penetration roll per activation."
  // COST: 5 | 0 | 5 | -
  'Expert Crafters': [
    {
      type: 'unit_ability',
      name: 'Expert Crafters',
      desc: 'The unit may re-roll one to wound or armor penetration roll per activation.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Grim:
  // "Every melee combat result is increased by +2 for the unit."
  // COST: 5 | 0 | - | -
  'Grim': [
    {
      type: 'unit_ability',
      name: 'Grim',
      desc: 'Every melee combat result is increased by +2 for the unit.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Hail of Doom:
  // "The 'Shuriken' ability grants an additional -1 to the weapon's AP value."
  // COST: 5 | 0 | 5 | -
  'Hail of Doom': [
    {
      type: 'unit_ability',
      name: 'Hail of Doom',
      desc: 'The "Shuriken" ability grants an additional -1 to the weapon\'s AP value.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Masterful Shots:
  // "The unit gains the 'Sunder(1)' ability for all ranged attacks."
  // COST: 5 | 0 | 5 | -
  'Masterful Shots': [
    {
      type: 'weapon_ability',
      name: 'Sunder(1)',
      weapon_type: 'ranged',
      applies_to: 'all',
    },
  ],

  // SOURCE — Masters of Concealment:
  // "The unit gains the benefit of light cover until its first activation."
  // COST: 3 | 0 | 3 | -
  'Masters of Concealment': [
    {
      type: 'unit_ability',
      name: 'Masters of Concealment',
      desc: 'The unit gains the benefit of light cover until its first activation.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Mobile Fighters:
  // "If the unit disembarked from a transport this round, all of its weapons gain the
  //  'Decimate' ability for this activation."
  // COST: 5 | 0 | - | -
  'Mobile Fighters': [
    {
      type: 'unit_ability',
      name: 'Mobile Fighters',
      desc: 'If the unit disembarked from a transport this round, all of its weapons gain the "Decimate" ability for this activation.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Savage Blades:
  // "If the unit uses a Charge order or gets charged by an enemy unit, all of its melee
  //  weapons gain -1 AP for this activation."
  // COST: 5 | 0 | - | -
  'Savage Blades': [
    {
      type: 'unit_ability',
      name: 'Savage Blades',
      desc: 'If the unit uses a Charge order or gets charged, all of its melee weapons gain -1 AP for this activation.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Students of Vaul:
  // "The unit ignores temporary vehicle damage on a roll of 4+."
  // COST: - | - | 5 | 5
  'Students of Vaul': [
    {
      type: 'unit_ability',
      name: 'Students of Vaul',
      desc: 'The unit ignores temporary vehicle damage on a roll of 4+.',
      applies_to: 'all',
    },
  ],

};
