/**
 * Orks Trait effects.
 *
 * SOURCE: data/parsed/orks/archetypes.json "traits" (canonical desc text).
 *
 * Status: 13/14 wired. "Waaagh! Coast Kustoms" ("Each Kustom job can be taken one additional
 * time") is NOT a combat ability — it doubles a purchase cap on a different mechanic entirely
 * (the Kustom Job picker's own per-vehicle limit). That requires the Kustom Job selection logic
 * itself to read the active trait, which is outside what TraitEffect (a per-unit
 * stat/ability/weapon injection) can express — left as an empty array with this note rather than
 * silently claimed as wired. Tracked as a follow-up, not blocking the other 13.
 */

import type { TraitEffect } from '../traitEffects';

export const ORKS_TRAIT_EFFECTS: Record<string, TraitEffect[]> = {

  // SOURCE — 'orrible Gitz:
  // "The unit gains the 'Deflect' ability. Only for Gretchins."
  // COST: 5 | - | - | -
  '\'orrible Gitz': [
    {
      type: 'unit_ability',
      name: 'Deflect',
      desc: 'The unit gains the "Deflect" ability. Only for Gretchins.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Armed To Da Teeth:
  // "The unit gains the 'Deflagrate(6+)' ability for all ranged attacks."
  // COST: 5 | 0 | 5 | 5
  'Armed To Da Teeth': [
    {
      type: 'weapon_ability',
      name: 'Deflagrate(6+)',
      weapon_type: 'ranged',
      applies_to: 'all',
    },
  ],

  // SOURCE — Big Krumpaz:
  // "If the unit uses a Charge order or gets charged by an enemy unit, it gains +1 to melee
  //  hit rolls until the end of the current battle round."
  // COST: 5 | 0 | 5 | 5
  'Big Krumpaz': [
    {
      type: 'unit_ability',
      name: 'Big Krumpaz',
      desc: 'If the unit uses a Charge order or gets charged, it gains +1 to melee hit rolls until the end of the current battle round.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Big Red Button:
  // "Vehicle units can roll on the Ramshackle table at any time during their activation, roll
  //  2D6 and pick any result while doing so. Explosions are resolved at Strength 7."
  // COST: - | - | 5 | 5
  'Big Red Button': [
    {
      type: 'unit_ability',
      name: 'Big Red Button',
      desc: 'Vehicle units can roll on the Ramshackle table at any time during their activation, roll 2D6 and pick any result. Explosions are resolved at Strength 7.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Boom Boyz:
  // "Weapons with the 'Barrage' or 'Explosive' ability can hit up to one more model per unit."
  // COST: 5 | 0 | 5 | 5
  'Boom Boyz': [
    {
      type: 'unit_ability',
      name: 'Boom Boyz',
      desc: 'Weapons with the "Barrage" or "Explosive" ability can hit up to one more model per unit.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Flyboyz:
  // "The unit gains the 'Deflect' ability. Only for Flyers."
  // COST: - | - | 5 | 5
  'Flyboyz': [
    {
      type: 'unit_ability',
      name: 'Deflect',
      desc: 'The unit gains the "Deflect" ability. Only for Flyers.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Lucky Gitz:
  // "The unit can re-roll one hit or wound roll per battle round."
  // COST: 5 | 0 | 5 | 5
  'Lucky Gitz': [
    {
      type: 'unit_ability',
      name: 'Lucky Gitz',
      desc: 'The unit can re-roll one hit or wound roll per battle round.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Mixed Warband:
  // "The army must select a second Legacy. Each model may only select items from one Legacy armory."
  // COST: 0 | 0 | 0 | 0   (army-level rule — enforced by validators; no per-unit effect)
  'Mixed Warband': [],

  // SOURCE — No messing around here:
  // "The unit gains the 'Rending(6+)' ability for all melee attacks."
  // COST: 5 | 0 | 5 | 5
  'No messing around here': [
    {
      type: 'weapon_ability',
      name: 'Rending(6+)',
      weapon_type: 'melee',
      applies_to: 'all',
    },
  ],

  // SOURCE — Pyromaniacs:
  // "All weapons with the 'Flames' ability cause 1 additional hit."
  // COST: 5 | 0 | 5 | 5
  'Pyromaniacs': [
    {
      type: 'unit_ability',
      name: 'Pyromaniacs',
      desc: 'All weapons with the "Flames" ability cause 1 additional hit.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Rascals:
  // "The unit gains the 'Sunder(1)' ability for all ranged attacks."
  // COST: 5 | 0 | 5 | 5
  'Rascals': [
    {
      type: 'weapon_ability',
      name: 'Sunder(1)',
      weapon_type: 'ranged',
      applies_to: 'all',
    },
  ],

  // SOURCE — Taktiks:
  // "The unit gains the benefit of light cover until its first activation."
  // COST: 3 | 0 | 3 | 3
  'Taktiks': [
    {
      type: 'unit_ability',
      name: 'Taktiks',
      desc: 'The unit gains the benefit of light cover until its first activation.',
      applies_to: 'all',
    },
  ],

  // SOURCE — The Old Ways:
  // "If the unit uses a Charge order or gets charged by an enemy unit, it gains +1 Strength
  //  until the end of the current battle round."
  // COST: 5 | 0 | 5 | 5
  'The Old Ways': [
    {
      type: 'unit_ability',
      name: 'The Old Ways',
      desc: 'If the unit uses a Charge order or gets charged, it gains +1 Strength until the end of the current battle round.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Waaagh! Coast Kustoms:
  // "Each Kustom job can be taken one additional time."
  // COST: 0 | 0 | 0 | 0
  // NOT WIRED — see file header. Needs the Kustom Job picker's own cap logic extended, not a
  // per-unit TraitEffect.
  'Waaagh! Coast Kustoms': [],

};
