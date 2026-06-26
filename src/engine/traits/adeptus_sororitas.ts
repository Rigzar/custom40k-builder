/**
 * Adeptus Sororitas Trait effects.
 *
 * SOURCE: data/parsed/adeptus_sororitas/archetypes.json "traits" (canonical desc text).
 * Same cost-column shape as Space Marines: NORMAL | CHARACTER MODELS | MONSTROUS CREATURES
 * (pts_veh is null for every Sororitas trait — vehicles cannot take Army Traits at all).
 *
 * Status: complete — all 12 traits encoded. Two traits (Raging Fervour, Rites of Fire) grant a
 * weapon range bonus the engine has no numeric range-mod effect type for — kept as descriptive
 * unit_ability text, same as Space Marines' "Cursed Founding" multi-option trait.
 */

import type { TraitEffect } from '../traitEffects';

export const SORORITAS_TRAIT_EFFECTS: Record<string, TraitEffect[]> = {

  // SOURCE — Combined Conviction:
  // "The army must select a second Legacy. Each model may only select items from one Legacy armory."
  // COST: 0 | 0 | 0   (army-level rule — enforced by validators; no per-unit effect)
  'Combined Conviction': [],

  // SOURCE — Deeds, not Words:
  // "The unit may treat all of its 'Rapid Fire' weapons during its Activation as 'Assault'
  //  weapons (f.e. Rapid Fire 1 becomes Assault 1)."
  // COST: 5 | 0 | 5
  'Deeds, not Words': [
    {
      type: 'unit_ability',
      name: 'Deeds, not Words',
      desc: 'The unit may treat all of its "Rapid Fire" weapons during its Activation as "Assault" weapons (e.g. Rapid Fire 1 becomes Assault 1).',
      applies_to: 'all',
    },
  ],

  // SOURCE — Devout Fanaticism:
  // "If the unit uses a Charge order or gets charged by an enemy unit, it gains +1 to melee
  //  hit rolls until the end of the current battle round."
  // COST: 5 | 0 | 5
  'Devout Fanaticism': [
    {
      type: 'unit_ability',
      name: 'Devout Fanaticism',
      desc: 'If the unit uses a Charge order or gets charged, it gains +1 to melee hit rolls until the end of the current battle round.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Guided by the Emperor's Will:
  // "The unit can re-roll one armor penetration or wound roll per activation."
  // COST: 5 | 0 | 5
  'Guided by the Emperor’s Will': [
    {
      type: 'unit_ability',
      name: 'Guided by the Emperor’s Will',
      desc: 'The unit can re-roll one armor penetration or wound roll per activation.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Holy Wrath:
  // "If the unit uses a Charge order or gets charged by an enemy unit, it gains +1 Strength
  //  until the end of the current battle round."
  // COST: 5 | 0 | 5
  'Holy Wrath': [
    {
      type: 'unit_ability',
      name: 'Holy Wrath',
      desc: 'If the unit uses a Charge order or gets charged, it gains +1 Strength until the end of the current battle round.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Raging Fervour:
  // "Inferno pistols gain 1,5" range, Meltas gain 3" range and Multi-melta gain 6" range."
  // COST: 3 | 0 | 3
  // NOTE: range bonus — no numeric range-mod effect type exists yet; descriptive only.
  'Raging Fervour': [
    {
      type: 'unit_ability',
      name: 'Raging Fervour',
      desc: 'Inferno pistols gain 1.5" range, Meltas gain 3" range and Multi-melta gain 6" range.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Rites of Fire:
  // "Hand flamers gain 1,5" range, Flamers gain 3" range and Heavy flamers gain 6" range."
  // COST: 3 | 0 | 3
  // NOTE: range bonus — no numeric range-mod effect type exists yet; descriptive only.
  'Rites of Fire': [
    {
      type: 'unit_ability',
      name: 'Rites of Fire',
      desc: 'Hand flamers gain 1.5" range, Flamers gain 3" range and Heavy flamers gain 6" range.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Shield of Aversion:
  // "The unit can reroll one armor save per battle round."
  // COST: 5 | 0 | 5
  'Shield of Aversion': [
    {
      type: 'unit_ability',
      name: 'Shield of Aversion',
      desc: 'The unit can re-roll one armor save per battle round.',
      applies_to: 'all',
    },
  ],

  // SOURCE — The Blood of Martyrs:
  // "If the unit is destroyed, it generates an additional Faith Point."
  // COST: 2 | 0 | 2
  'The Blood of Martyrs': [
    {
      type: 'unit_ability',
      name: 'The Blood of Martyrs',
      desc: 'If the unit is destroyed, it generates an additional Faith Point.',
      applies_to: 'all',
    },
  ],

  // SOURCE — The Emperor's Judgement:
  // "If the unit performs an Act of Faith, roll 1D6. On a 5+, the Faith Point is refunded."
  // COST: 3 | 0 | 3
  'The Emperor\'s Judgement': [
    {
      type: 'unit_ability',
      name: 'The Emperor\'s Judgement',
      desc: 'If the unit performs an Act of Faith, roll 1D6. On a 5+, the Faith Point is refunded.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Unbridled Valour:
  // "The unit gains +1 Leadership."
  // COST: 5 | 0 | 5
  'Unbridled Valour': [
    { type: 'stat_mod', stat: 'LD', delta: 1, applies_to: 'all' },
  ],

  // SOURCE — Unshakable Vengeance:
  // "The unit gains the 'Deflagrate(5+)' ability with Bolt weapons."
  // COST: 5 | 0 | 5
  'Unshakable Vengeance': [
    {
      type: 'weapon_ability',
      name: 'Deflagrate(5+)',
      weapon_type: 'bolt',
      applies_to: 'all',
    },
  ],

};
