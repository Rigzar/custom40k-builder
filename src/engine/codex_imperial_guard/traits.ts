/**
 * Imperial Guard Trait effects.
 *
 * SOURCE: data/parsed/imperial_guard/archetypes.json "traits" (canonical desc text).
 *
 * Status: complete — all 16 traits encoded. "Combined Regiments" (army-level second-Legacy
 * rule) is correctly empty. "Abhuman Auxiliaries" (5 sub-options, player choice), "Close Combat
 * Specialists" and "Heavy Infantry" (actual wargear grants — Lasgun→Las pistol+CCW swap, Krak
 * grenades + Plate armor) are descriptive unit_ability text only: TraitEffect has no way to
 * inject a new weapon-swap option or grant specific wargear items, only stat/ability/weapon-
 * ability effects on the existing profile.
 */

import type { TraitEffect } from '../traitEffects';

export const IG_TRAIT_EFFECTS: Record<string, TraitEffect[]> = {

  // SOURCE — Abhuman Auxiliaries:
  // "Select one improvement that can be applied to any creature unit (except Halflings and
  //  Ogryns): Afriel Strain (They Shall Know No Fear), Beasts (Furious Charge), Gland Warriors
  //  (+1 Strength, Dangerous Terrain test every activation), Nightsiders (Acute Senses),
  //  Slave Levies (Unyielding)."
  // COST: 5 | - | - | -
  'Abhuman Auxiliaries': [
    {
      type: 'unit_ability',
      name: 'Abhuman Auxiliaries',
      desc: 'Select one improvement (except Halflings and Ogryns): Afriel Strain (They Shall Know No Fear), Beasts (Furious Charge), Gland Warriors (+1 Strength, Dangerous Terrain test every activation), Nightsiders (Acute Senses), or Slave Levies (Unyielding).',
      applies_to: 'all',
    },
  ],

  // SOURCE — Bionic Improvement:
  // "Creature models gain a 6+ invulnerability save. Only for creature models that do not
  //  already have an invulnerability save from their datasheet or Armory."
  // COST: 1* | 0 | 1* | 1*
  'Bionic Improvement': [
    { type: 'inv_save', value: 6, applies_to: 'creature' },
  ],

  // SOURCE — Born Soldiers:
  // "The unit may re-roll ranged to hit rolls of 1 with Assault, Grenade, Pistol and Rapid
  //  Fire weapons."
  // COST: 5 | 0 | 5 | 5
  'Born Soldiers': [
    {
      type: 'unit_ability',
      name: 'Born Soldiers',
      desc: 'The unit may re-roll ranged to hit rolls of 1 with Assault, Grenade, Pistol and Rapid Fire weapons.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Cameleolin:
  // "The unit gains a cumulative +1 bonus to armor save rolls while benefitting from cover."
  // COST: 5 | 0 | - | -
  'Cameleolin': [
    {
      type: 'unit_ability',
      name: 'Cameleolin',
      desc: 'The unit gains a cumulative +1 bonus to armor save rolls while benefitting from cover.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Close Combat Specialists:
  // "Each model may swap their Lasgun for a Las pistol and a Close combat weapon."
  // COST: 0 | 0 | - | -
  'Close Combat Specialists': [
    {
      type: 'unit_ability',
      name: 'Close Combat Specialists',
      desc: 'Each model may swap their Lasgun for a Las pistol and a Close combat weapon.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Combined Regiments:
  // "The army must select a second Legacy."
  // COST: 0 | 0 | 0 | 0   (army-level rule — enforced by validators; no per-unit effect)
  'Combined Regiments': [],

  // SOURCE — Disciplined Shooters:
  // "The unit does not suffer the to hit penalty from Defensive Fire."
  // COST: 5 | 0 | 5 | 5
  'Disciplined Shooters': [
    {
      type: 'unit_ability',
      name: 'Disciplined Shooters',
      desc: 'The unit does not suffer the to hit penalty from Defensive Fire.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Fanatism:
  // "The unit gains the 'Blind Rage' ability."
  // COST: 0 | 0 | - | -
  'Fanatism': [
    { type: 'unit_ability', name: 'Blind Rage', applies_to: 'all' },
  ],

  // SOURCE — Hardened Fighters:
  // "The unit gains +1 Weapon skill."
  // COST: 5 | 0 | - | -
  'Hardened Fighters': [
    { type: 'stat_mod', stat: 'WS', delta: 1, applies_to: 'all' },
  ],

  // SOURCE — Heavy Infantry:
  // "The unit gains Krak grenades and Plate armor. Can't be combined with 'Jungle Fighters'.
  //  Only for creature models that do not already have a 4+ armor save from their datasheet
  //  or Armory."
  // COST: 3* | 0 | - | -
  'Heavy Infantry': [
    {
      type: 'unit_ability',
      name: 'Heavy Infantry',
      desc: 'The unit gains Krak grenades and Plate armor. Can\'t be combined with "Jungle Fighters". Only for creature models that do not already have a 4+ armor save from their datasheet or Armory.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Heirloom Weapons:
  // "The unit can re-roll one armor penetration or wound roll per activation."
  // COST: 5 | 0 | 5 | 5
  'Heirloom Weapons': [
    {
      type: 'unit_ability',
      name: 'Heirloom Weapons',
      desc: 'The unit can re-roll one armor penetration or wound roll per activation.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Iron Discipline:
  // "The unit gains +1 Leadership."
  // COST: 5 | 0 | - | -
  'Iron Discipline': [
    { type: 'stat_mod', stat: 'LD', delta: 1, applies_to: 'all' },
  ],

  // SOURCE — Jury-rigged repairs:
  // "Vehicles repair either one Engine Damage or Weapon Damage on themselves during each
  //  Rally phase."
  // COST: - | 0 | 5* | 5
  'Jury-rigged repairs': [
    {
      type: 'unit_ability',
      name: 'Jury-rigged repairs',
      desc: 'Vehicles repair either one Engine Damage or Weapon Damage on themselves during each Rally phase.',
      applies_to: 'vehicle',
    },
  ],

  // SOURCE — Las Fusilade:
  // "The unit gains the 'Deflagrate(5+)' ability with Las weapons. Does not apply to 'Heavy' weapons."
  // COST: 5 | 0 | 5 | 5
  // NOTE: targets weapons by NAME ("Las") not by the engine's ranged/melee/bolt weapon_type
  // filter — no generic match available; descriptive only.
  'Las Fusilade': [
    {
      type: 'unit_ability',
      name: 'Las Fusilade',
      desc: 'The unit gains the "Deflagrate(5+)" ability with Las weapons. Does not apply to "Heavy" weapons.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Rapid Assault:
  // "The unit can fire Assault weapons, Grenades and Pistols without a to hit penalty with
  //  Advance and Charge orders."
  // COST: 5 | 0 | 0 | 0
  'Rapid Assault': [
    {
      type: 'unit_ability',
      name: 'Rapid Assault',
      desc: 'The unit can fire Assault weapons, Grenades and Pistols without a to hit penalty with Advance and Charge orders.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Shock Troops:
  // "The unit gains the 'Deep strike' ability."
  // COST: 5 | 0 | - | -
  'Shock Troops': [
    { type: 'unit_ability', name: 'Deep Strike', applies_to: 'all' },
  ],

};
