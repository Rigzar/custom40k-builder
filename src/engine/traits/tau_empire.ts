/**
 * Tau Empire Trait effects.
 *
 * SOURCE: data/parsed/tau_empire/archetypes.json "traits" (canonical desc text).
 *
 * Status: 16/17 wired. "Swarm Controllers" ("Models with access to drones may buy up to three
 * drones instead of two") is NOT a combat ability — it raises the Drone picker's OWN per-unit
 * cap (same category as Orks' "Waaagh! Coast Kustoms"), which TraitEffect can't express. Left
 * as an empty array rather than faked. "Turbo Jets" and "Evasive Maneuvers" are restricted to
 * Jump Pack units by their text, but TraitEffect's applies_to has no jump-pack filter and the
 * trait's own cost columns don't restrict who can buy it — kept as descriptive text rather than
 * a numeric stat_mod/unit_ability that would auto-apply to ineligible units too.
 */

import type { TraitEffect } from '../traitEffects';

export const TAU_TRAIT_EFFECTS: Record<string, TraitEffect[]> = {

  // SOURCE — Advanced Miniaturization:
  // "Every model with access to a SUPPORT SYSTEM may pick one additional SUPPORT SYSTEM at
  //  the regular cost."
  // COST: 0 | 0 | 0 | 0
  'Advanced Miniaturization': [
    {
      type: 'unit_ability',
      name: 'Advanced Miniaturization',
      desc: 'Every model with access to a Support System may pick one additional Support System at the regular cost.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Blacklight Markers:
  // "All markerlights of the unit increase their range by 12\". Only for units with at least
  //  one Markerlight."
  // COST: 3 | 0 | 3 | 3
  'Blacklight Markers': [
    {
      type: 'unit_ability',
      name: 'Blacklight Markers',
      desc: 'All markerlights of the unit increase their range by 12". Only for units with at least one Markerlight.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Calm under Pressure:
  // "The unit does not suffer the to hit penalty from Defensive Fire."
  // COST: 5 | 0 | 5 | 5
  'Calm under Pressure': [
    {
      type: 'unit_ability',
      name: 'Calm under Pressure',
      desc: 'The unit does not suffer the to hit penalty from Defensive Fire.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Camouflage Experts:
  // "The unit gains the benefit of light cover until its first activation."
  // COST: 3 | 0 | 3 | 3
  'Camouflage Experts': [
    {
      type: 'unit_ability',
      name: 'Camouflage Experts',
      desc: 'The unit gains the benefit of light cover until its first activation.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Combined Expansion:
  // "The army must select a second Legacy. Each model may only select items from one Legacy armory."
  // COST: 0 | 0 | 0 | 0   (army-level rule — enforced by validators; no per-unit effect)
  'Combined Expansion': [],

  // SOURCE — Defenders of the Cause:
  // "The unit's 'Supporting Fire' ability increases its range to 12\"."
  // COST: 5 | 0 | 5 | 5
  'Defenders of the Cause': [
    {
      type: 'unit_ability',
      name: 'Defenders of the Cause',
      desc: 'The unit\'s "Supporting Fire" ability increases its range to 12".',
      applies_to: 'all',
    },
  ],

  // SOURCE — Defensive Doctrines:
  // "If the unit gets charged by an enemy unit, all enemy melee weapons reduce their AP and
  //  AT by 1 to a minimum of 0."
  // COST: 5 | 0 | 5 | 5
  'Defensive Doctrines': [
    {
      type: 'unit_ability',
      name: 'Defensive Doctrines',
      desc: 'If the unit gets charged, all enemy melee weapons reduce their AP and AT by 1 to a minimum of 0.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Disengangement Protocols:
  // "Roll 1D6 every time the unit tries to flee from melee combat. One enemy unit in direct
  //  base contact suffers the result as automatic wounds with S:4 AP:0 D:1."
  // COST: 5 | 0 | 5 | 5
  'Disengangement Protocols': [
    {
      type: 'unit_ability',
      name: 'Disengangement Protocols',
      desc: 'Roll 1D6 every time the unit tries to flee from melee combat. One enemy unit in direct base contact suffers the result as automatic wounds with S:4 AP:0 D:1.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Evasive Maneuvers:
  // "If the unit moved at least 12\" away from its current position at the beginning of the
  //  battle round, all models gain the 'Deflect' ability. Only for Jump Pack units."
  // COST: 5 | 0 | 5 | 5
  'Evasive Maneuvers': [
    {
      type: 'unit_ability',
      name: 'Evasive Maneuvers',
      desc: 'If the unit moved at least 12" away from its current position at the beginning of the battle round, all models gain the "Deflect" ability. Only for Jump Pack units.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Fire Caste Marksman:
  // "The unit gains the 'Deflagrate(5+)' ability with Pulse weapons. Does not apply to 'Heavy' weapons."
  // COST: 5 | 0 | 5 | 5
  // NOTE: targets weapons by NAME ("Pulse") not the engine's ranged/melee/bolt filter; descriptive only.
  'Fire Caste Marksman': [
    {
      type: 'unit_ability',
      name: 'Fire Caste Marksman',
      desc: 'The unit gains the "Deflagrate(5+)" ability with Pulse weapons. Does not apply to "Heavy" weapons.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Fire Saturation:
  // "Burst weapons gain a +1 bonus to hit rolls against targets within 12\"."
  // COST: 5 | 0 | 5 | 5
  'Fire Saturation': [
    {
      type: 'unit_ability',
      name: 'Fire Saturation',
      desc: 'Burst weapons gain a +1 bonus to hit rolls against targets within 12".',
      applies_to: 'all',
    },
  ],

  // SOURCE — Loyal to the End:
  // "The unit gains +1 Leadership."
  // COST: 5 | 0 | 5 | 5
  'Loyal to the End': [
    { type: 'stat_mod', stat: 'LD', delta: 1, applies_to: 'all' },
  ],

  // SOURCE — Reliable Weaponry:
  // "The unit can re-roll one armor penetration or wound roll per activation."
  // COST: 5 | 0 | 5 | 5
  'Reliable Weaponry': [
    {
      type: 'unit_ability',
      name: 'Reliable Weaponry',
      desc: 'The unit can re-roll one armor penetration or wound roll per activation.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Signature Evolutionary Adaption:
  // "Select one Adaptation that must be applied to all Kroot units: Bold (+1 Leadership),
  //  Chameleon (Deflect), Fast Reflexes (+1 Initiative), Hyperactive Nymune Organ
  //  (Frenzy(2")), Ork Hybrid (+1 Toughness), Sixth Sense (6+ invulnerability save)."
  // COST: 5 | 0 | 5 | 5
  'Signature Evolutionary Adaption': [
    {
      type: 'unit_ability',
      name: 'Signature Evolutionary Adaption',
      desc: 'Select one Adaptation for all Kroot units: Bold (+1 Leadership), Chameleon (Deflect), Fast Reflexes (+1 Initiative), Hyperactive Nymune Organ (Frenzy(2")), Ork Hybrid (+1 Toughness), or Sixth Sense (6+ invulnerability save).',
      applies_to: 'all',
    },
  ],

  // SOURCE — Strike Swiftly:
  // "The unit gains the 'Vanguard' ability."
  // COST: 5 | 0 | 5 | 5
  'Strike Swiftly': [
    { type: 'unit_ability', name: 'Vanguard', applies_to: 'all' },
  ],

  // SOURCE — Swarm Controllers:
  // "Models with access to drones may buy up to three drones in any combination instead of two."
  // COST: 0 | 0 | 0 | 0
  // NOT WIRED — see file header. Needs the Drone picker's own cap logic extended, not a
  // per-unit TraitEffect.
  'Swarm Controllers': [],

  // SOURCE — Turbo Jets:
  // "The unit gains +2\" Movement. Only for Jump Pack units."
  // COST: 5 | 0 | 5 | 5
  'Turbo Jets': [
    {
      type: 'unit_ability',
      name: 'Turbo Jets',
      desc: 'The unit gains +2" Movement. Only for Jump Pack units.',
      applies_to: 'all',
    },
  ],

};
