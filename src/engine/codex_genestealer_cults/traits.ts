/**
 * Genestealer Cults Trait effects.
 *
 * SOURCE: data/parsed/genestealer_cults/archetypes.json "traits" (canonical desc text).
 *
 * Status: complete — all 15 traits encoded. "Splinter Cult" (army-level second-Legacy rule) and
 * "Subterranean Ambushers" (army-wide extra Ambush Marker count, not a per-unit effect — same
 * precedent as Space Marines' "Path of Damnation") are correctly empty arrays, not missing data.
 */

import type { TraitEffect } from '../traitEffects';

export const GSC_TRAIT_EFFECTS: Record<string, TraitEffect[]> = {

  // SOURCE — Agile Guerillas:
  // "The model may shoot 'Heavy' weapons with a -1 penalty and 'Rapid Fire' weapons at full
  //  range with a 'Move & Shoot' command"
  // COST: 5 | 0 | 5 | -
  'Agile Guerillas': [
    {
      type: 'unit_ability',
      name: 'Agile Guerillas',
      desc: 'The model may shoot "Heavy" weapons with a -1 penalty and "Rapid Fire" weapons at full range with a "Move & Shoot" command.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Alien Fury:
  // "If the unit uses a Charge order or gets charged by an enemy unit, it gains +1 to melee
  //  hit rolls until the end of the current battle round."
  // COST: 5 | 0 | - | -
  'Alien Fury': [
    {
      type: 'unit_ability',
      name: 'Alien Fury',
      desc: 'If the unit uses a Charge order or gets charged, it gains +1 to melee hit rolls until the end of the current battle round.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Cyborgised Hybrids:
  // "Creature models gain a 6+ invulnerability save. Only for creature models that do not
  //  already have an invulnerability save from their datasheet or Armory."
  // COST: 1* | 0 | 1* | -
  'Cyborgised Hybrids': [
    { type: 'inv_save', value: 6, applies_to: 'creature' },
  ],

  // SOURCE — Deep Supplies:
  // "The unit can re-roll one armor penetration or wound roll per activation."
  // COST: 5 | 0 | 5 | -
  'Deep Supplies': [
    {
      type: 'unit_ability',
      name: 'Deep Supplies',
      desc: 'The unit can re-roll one armor penetration or wound roll per activation.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Devoted Zealots:
  // "The unit gains the 'Blind Rage' ability."
  // COST: 0 | 0 | - | -
  'Devoted Zealots': [
    {
      type: 'unit_ability',
      name: 'Blind Rage',
      applies_to: 'all',
    },
  ],

  // SOURCE — Disciplined Militants:
  // "The unit gains +1 Leadership."
  // COST: 5 | 0 | - | -
  'Disciplined Militants': [
    { type: 'stat_mod', stat: 'LD', delta: 1, applies_to: 'all' },
  ],

  // SOURCE — Experimental Subjects:
  // "The unit gains +1 Strength."
  // COST: 5 | 0 | - | -
  'Experimental Subjects': [
    { type: 'stat_mod', stat: 'S', delta: 1, applies_to: 'all' },
  ],

  // SOURCE — Hunter's Instincts:
  // "The unit gains a cumulative +1 bonus to armor save rolls while benefitting from cover."
  // COST: 5 | 0 | - | -
  'Hunter\'s Instincts': [
    {
      type: 'unit_ability',
      name: 'Hunter\'s Instincts',
      desc: 'The unit gains a cumulative +1 bonus to armor save rolls while benefitting from cover.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Martial:
  // "The unit may re-roll ranged to hit rolls of 1 with Assault, Pistol and Rapid Fire weapons."
  // COST: 5 | 0 | 5 | -
  'Martial': [
    {
      type: 'unit_ability',
      name: 'Martial',
      desc: 'The unit may re-roll ranged to hit rolls of 1 with Assault, Pistol and Rapid Fire weapons.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Nomadic Survivalists:
  // "The unit gains the 'Frenzy(1)' and 'Haste(1)' abilities."
  // COST: 5 | 0 | - | -
  'Nomadic Survivalists': [
    { type: 'unit_ability', name: 'Frenzy(1)', applies_to: 'all' },
    { type: 'unit_ability', name: 'Haste(1)', applies_to: 'all' },
  ],

  // SOURCE — Splinter Cult:
  // "The army must select a second Legacy. Each model may only select items from one Legacy armory."
  // COST: 0 | 0 | 0 | -   (army-level rule — enforced by validators; no per-unit effect)
  'Splinter Cult': [],

  // SOURCE — Subterranean Ambushers:
  // "You may set up one additional 'Ambush Marker' in Skirmishes, two additional markers in
  //  Pitched Battles, and three additional markers in Epic Battles."
  // COST: 0 | 0 | 0 | -   (army-wide mission-setup rule — no per-unit effect to display)
  'Subterranean Ambushers': [],

  // SOURCE — Synaptic Resonance:
  // "The model can re-roll one psychic test per activation. Psykers only."
  // COST: 5 | 5 | - | -
  'Synaptic Resonance': [
    {
      type: 'unit_ability',
      name: 'Synaptic Resonance',
      desc: 'The model can re-roll one psychic test per activation. Psykers only.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Toxin Agents:
  // "The unit's melee attacks gain the 'Poison(4+)' ability."
  // COST: 5 | 0 | - | -
  'Toxin Agents': [
    {
      type: 'weapon_ability',
      name: 'Poison(4+)',
      weapon_type: 'melee',
      applies_to: 'all',
    },
  ],

  // SOURCE — War Convoy:
  // "Vehicles repair either one Engine Damage or Weapon Damage on themselves during each Rally phase."
  // COST: - | - | 5* | -
  'War Convoy': [
    {
      type: 'unit_ability',
      name: 'War Convoy',
      desc: 'Vehicles repair either one Engine Damage or Weapon Damage on themselves during each Rally phase.',
      applies_to: 'vehicle',
    },
  ],

};
