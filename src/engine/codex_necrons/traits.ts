/**
 * Necrons Trait effects.
 *
 * SOURCE: data/parsed/necrons/archetypes.json "traits" (canonical desc text).
 *
 * Status: complete — all 17 traits encoded. "Vassal Dynasty" (army-level second-Legacy rule)
 * is correctly empty. Several traits are mutually exclusive by their own text (Immovable
 * Phalanx/Merciless Hunters, Relentless Expansionism/Translocation Beams) — that exclusivity
 * is not engine-enforced (same as every other faction's similar "can't combine with X" traits),
 * left as descriptive text per the established convention.
 */

import type { TraitEffect } from '../traitEffects';

export const NECRONS_TRAIT_EFFECTS: Record<string, TraitEffect[]> = {

  // SOURCE — Arise against Interlopers:
  // "If the unit uses a Charge order or gets charged by an enemy unit, it gains +1 to melee
  //  hit rolls until the end of the current battle round."
  // COST: 5 | 0 | 5 | -
  'Arise against Interlopers': [
    {
      type: 'unit_ability',
      name: 'Arise against Interlopers',
      desc: 'If the unit uses a Charge order or gets charged, it gains +1 to melee hit rolls until the end of the current battle round.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Awakened by Murder:
  // "The unit gains the 'Frenzy(1)' ability."
  // COST: 5 | 0 | 5 | -
  'Awakened by Murder': [
    { type: 'unit_ability', name: 'Frenzy(1)', applies_to: 'all' },
  ],

  // SOURCE — Eternal Conquerors:
  // "The unit prevents 1 RPoint from being lost for itself and gains 1 temporary RPoint each
  //  Reinforcement phase, if it is within 6\" of an objective marker. Only for <Necron> units."
  // COST: 5 | 0 | - | -
  'Eternal Conquerors': [
    {
      type: 'unit_ability',
      name: 'Eternal Conquerors',
      desc: 'The unit prevents 1 RPoint from being lost for itself and gains 1 temporary RPoint each Reinforcement phase, if it is within 6" of an objective marker. Only for <Necron> units.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Immovable Phalanx:
  // "If the unit uses Stand & Shoot, it gains a +1 bonus to armor saves until its next
  //  activation. Can't be combined with 'Merciless hunters'."
  // COST: 5 | 0 | - | -
  'Immovable Phalanx': [
    {
      type: 'unit_ability',
      name: 'Immovable Phalanx',
      desc: 'If the unit uses Stand & Shoot, it gains a +1 bonus to armor saves until its next activation. Can\'t be combined with "Merciless Hunters".',
      applies_to: 'all',
    },
  ],

  // SOURCE — Interplanetary Invasors:
  // "Vehicle units can fire all weapons, if they move up to 12\". Only for vehicles."
  // COST: - | - | 5 | 5
  'Interplanetary Invasors': [
    {
      type: 'unit_ability',
      name: 'Interplanetary Invasors',
      desc: 'Vehicle units can fire all weapons, if they move up to 12".',
      applies_to: 'vehicle',
    },
  ],

  // SOURCE — Isolationists:
  // "The unit's 'Rapid Fire' weapons gain +1 Strength when being resolved against targets
  //  that are within half weapon range."
  // COST: 5 | 0 | 5 | -
  'Isolationists': [
    {
      type: 'unit_ability',
      name: 'Isolationists',
      desc: 'The unit\'s "Rapid Fire" weapons gain +1 Strength when being resolved against targets within half weapon range.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Masters of the Martial:
  // "The unit can re-roll one hit roll per activation."
  // COST: 5 | 0 | 5 | -
  'Masters of the Martial': [
    {
      type: 'unit_ability',
      name: 'Masters of the Martial',
      desc: 'The unit can re-roll one hit roll per activation.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Merciless Hunters:
  // "The unit can fire 'Rapid Fire' weapons twice at full range with a 'Stand & Shoot'
  //  order. Can't be combined with 'Immovable phalanx'."
  // COST: 5 | 0 | - | -
  'Merciless Hunters': [
    {
      type: 'unit_ability',
      name: 'Merciless Hunters',
      desc: 'The unit can fire "Rapid Fire" weapons twice at full range with a "Stand & Shoot" order. Can\'t be combined with "Immovable Phalanx".',
      applies_to: 'all',
    },
  ],

  // SOURCE — RAD-wreathed:
  // "Enemy units within 3\" of the unit suffer a -1 penalty to their Toughness."
  // COST: 5 | 0 | 5 | -
  'RAD-wreathed': [
    {
      type: 'unit_ability',
      name: 'RAD-wreathed',
      desc: 'Enemy units within 3" of the unit suffer a -1 penalty to their Toughness.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Relentless Expansionism:
  // "The unit gains the 'Vanguard' ability. Can't be combined with 'Translocation beams'."
  // COST: 5 | 0 | 5 | -
  'Relentless Expansionism': [
    {
      type: 'unit_ability',
      name: 'Vanguard',
      desc: 'Can\'t be combined with "Translocation Beams".',
      applies_to: 'all',
    },
  ],

  // SOURCE — Solar Fury:
  // "The unit's weapons increase their range by 3\"."
  // COST: 5 | 0 | 5 | -
  'Solar Fury': [
    {
      type: 'unit_ability',
      name: 'Solar Fury',
      desc: 'The unit\'s weapons increase their range by 3".',
      applies_to: 'all',
    },
  ],

  // SOURCE — Superior Artisans:
  // "The unit can re-roll one armor penetration or wound roll per activation."
  // COST: 5 | 0 | 5 | -
  'Superior Artisans': [
    {
      type: 'unit_ability',
      name: 'Superior Artisans',
      desc: 'The unit can re-roll one armor penetration or wound roll per activation.',
      applies_to: 'all',
    },
  ],

  // SOURCE — The unmerciful Horde:
  // "The unit can re-roll failed Leadership tests."
  // COST: 5 | 0 | - | -
  'The unmerciful Horde': [
    {
      type: 'unit_ability',
      name: 'The unmerciful Horde',
      desc: 'The unit can re-roll failed Leadership tests.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Translocation Beams:
  // "The unit automatically advances 6\" instead of rolling for it, ignoring terrain.
  //  Can't be combined with 'Relentless expansionism'."
  // COST: 5 | 0 | 5 | -
  'Translocation Beams': [
    {
      type: 'unit_ability',
      name: 'Translocation Beams',
      desc: 'The unit automatically advances 6", ignoring terrain. Can\'t be combined with "Relentless Expansionism".',
      applies_to: 'all',
    },
  ],

  // SOURCE — Vassal Dynasty:
  // "The army must select a second Legacy. Each model may only select items from one Legacy armory."
  // COST: 0 | 0 | 0 | -   (army-level rule — enforced by validators; no per-unit effect)
  'Vassal Dynasty': [],

  // SOURCE — Vengeful Stars:
  // "The unit's ranged attacks gain a -1 AP bonus when being resolved against targets that
  //  are within half weapon range."
  // COST: 5 | 0 | 5 | -
  'Vengeful Stars': [
    {
      type: 'unit_ability',
      name: 'Vengeful Stars',
      desc: 'The unit\'s ranged attacks gain a -1 AP bonus when being resolved against targets within half weapon range.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Warrior Nobles:
  // "The unit can re-roll one (additional) hit and one (additional) wound roll per
  //  activation. Only for HQ units."
  // COST: - | 0 | - | -
  'Warrior Nobles': [
    {
      type: 'unit_ability',
      name: 'Warrior Nobles',
      desc: 'The unit can re-roll one (additional) hit and one (additional) wound roll per activation. Only for HQ units.',
      applies_to: 'all',
    },
  ],

};
