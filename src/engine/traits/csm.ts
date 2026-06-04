/**
 * CSM Trait effects.
 *
 * SOURCE: Chaos Space Marines — Army Customisation sheet (canonical)
 * ─────────────────────────────────────────────────────────────────
 * "Traits enhance your units with special abilities that they normally would not be able to have."
 * "If a Trait is taken, all models / units in the army must be upgraded with it, unless stated otherwise."
 * "Traits in this army can only apply to models with the 'Chaos Space Marine' keyword."
 * "The point costs for traits have to be paid per unit. If point costs are marked with *,
 *  then they must be paid for every Wound or Hull point in the unit."
 *
 * COST COLUMNS: NORMAL | CHARACTER MODELS | MONSTROUS CREATURES & VEHICLES
 * (The last column is shared — monsters and vehicles pay the same cost.)
 *
 * applies_to guide:
 *   'all'      → creature + vehicle
 *   'creature' → non-vehicle (infantry, characters, monsters)
 *   'vehicle'  → vehicles only
 *   'monster'  → monstrous creatures only
 *   'character'→ characters only
 *   'infantry' → non-vehicle, non-monster, non-character
 */

import type { TraitEffect } from '../traitEffects';

export const CSM_TRAIT_EFFECTS: Record<string, TraitEffect[]> = {

  // SOURCE — 10.000 Years of Horror:
  // "The unit ignores negative leadership modificators. Only for creature units."
  // COST: 5 | 0 | 5   (pts_veh = 5, vehicle pays even though effect is creature-only)
  '10.000 Years of Horror': [
    {
      type: 'unit_ability',
      name: 'Hardened by Millennia',
      desc: 'This unit ignores all negative modifiers to its Leadership.',
      applies_to: 'creature',
    },
  ],

  // SOURCE — Black Crusade:
  // "A single HQ-model must get the Mark of Chaos of each god."
  // COST: - | Special | -   (army-level rule only — no per-unit effect)
  'Black Crusade': [],

  // SOURCE — Blood Feud:
  // "If the unit uses a Charge order or gets charged by an enemy unit, it gains +1 to melee
  //  hit rolls until the end of the current battle round."
  // COST: 5 | 0 | 5
  'Blood Feud': [
    {
      type: 'unit_ability',
      name: 'Blood Feud',
      desc: '+1 to hit rolls in melee if this unit charged or was charged this turn.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Desecration:
  // "The unit gains a 5+ invulnerability save while within 6" of an objective. Doesn't work
  //  against weapons with strength 8 and above."
  // COST: 5 | 0 | -   (vehicles/monsters excluded — no inv save from this trait)
  'Desecration': [
    {
      type: 'unit_ability',
      name: 'Desecration',
      desc: 'This unit has a 5+ invulnerability save while within 6" of an objective marker. Does not work against weapons with Strength 8 or above.',
      applies_to: 'infantry',
    },
  ],

  // SOURCE — Fallen:
  // "The unit gains the 'They Shall Know No Fear' ability (See Space Marines). Only for creature units."
  // COST: 5 | 0 | 5
  'Fallen': [
    {
      type: 'unit_ability',
      name: 'They Shall Know No Fear',
      desc: 'This unit automatically passes Morale tests and never flees.',
      applies_to: 'creature',
    },
  ],

  // SOURCE — Hatred Unleashed:
  // "The unit's ranged attacks against the nearest enemy unit gain +1 to hit rolls."
  // COST: 5 | 0 | 5
  'Hatred Unleashed': [
    {
      type: 'weapon_ability',
      name: '+1 to hit vs. nearest enemy',
      weapon_type: 'ranged',
      applies_to: 'all',
    },
  ],

  // SOURCE — Horrors of the Night:
  // "The unit gains +1 to hit and +1 to wound in melee against units with at least one
  //  Battleshock token or if the enemy unit is outnumbered."
  // COST: 5 | 0 | 5
  'Horrors of the Night': [
    {
      type: 'unit_ability',
      name: 'Horrors of the Night',
      desc: '+1 to hit and wound rolls in melee against Shocked or Outnumbered enemy units.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Iron Within, Iron Without:
  // "Creature models gain a 6+ invulnerability save. Vehicles repair either one Engine Damage
  //  or Weapon Damage on themselves during each Rally phase. Only for creature models that do
  //  not already have an invulnerability save from their datasheet or Armory."
  // COST: 2* | 0 | 5*   (* = per Wound / Hull Point)
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

  // SOURCE — Laboratory Experiments:
  // "The unit gains the ability 'Berserk(5+)', +1 Strength and +1" Movement. At the end of
  //  each activation roll a D6 per model. For each 1 the unit suffers 1 Mortal Wound."
  // COST: 5 | - | -   (characters, monsters and vehicles excluded)
  'Laboratory Experiments': [
    { type: 'stat_mod', stat: 'S', delta: 1, applies_to: 'infantry' },
    { type: 'stat_mod', stat: 'M', delta: 1, applies_to: 'infantry' },
    {
      type: 'unit_ability',
      name: 'Berserk(5+)',
      desc: 'When this unit rolls a 5+ to hit in melee, it may make one additional attack against the same target. At the end of each activation roll 1D6 per model — each roll of 1 inflicts 1 Mortal Wound on this unit.',
      applies_to: 'infantry',
    },
  ],

  // SOURCE — Malicious Volley:
  // "The unit gains the 'Deflagrate(5+)' ability with Bolt weapons. Does not apply to 'Heavy' weapons."
  // COST: 5 | 0 | 5
  'Malicious Volley': [
    {
      type: 'weapon_ability',
      name: 'Deflagrate(5+)',
      weapon_type: 'bolt',
      applies_to: 'all',
    },
  ],

  // SOURCE — Masters of Deception:
  // "The unit gains the benefit of light cover until its first activation."
  // COST: 3 | 0 | 3
  'Masters of Deception': [
    {
      type: 'unit_ability',
      name: 'Masters of Deception',
      desc: 'This unit counts as being in light cover until the first time it activates.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Mixed Warband:
  // "The army must select a second Legacy. Each model may only select items from one Legacy armory."
  // COST: - | - | -   (army-level rule — no per-unit effect; enforced by validator)
  'Mixed Warband': [],

  // SOURCE — Profane Zeal:
  // "The unit gains the 'Blind Rage' ability. Only for creature units."
  // COST: 5 | 0 | 5
  'Profane Zeal': [
    {
      type: 'unit_ability',
      name: 'Blind Rage',
      desc: 'This unit must move toward the nearest enemy during its activation and must charge if able.',
      applies_to: 'creature',
    },
  ],

  // SOURCE — Siege Experts:
  // "The unit gains the 'Sunder(1)' ability for all ranged attacks."
  // COST: 5 | 0 | 5
  'Siege Experts': [
    {
      type: 'weapon_ability',
      name: 'Sunder(1)',
      weapon_type: 'ranged',
      applies_to: 'all',
    },
  ],

  // SOURCE — Superior Battle Tactics:
  // "The unit reduces any negative to hit modificators by 1."
  // COST: 5 | 0 | 5
  'Superior Battle Tactics': [
    {
      type: 'unit_ability',
      name: 'Superior Battle Tactics',
      desc: 'Reduce any negative modifier to hit rolls for this unit by 1 (minimum 0).',
      applies_to: 'all',
    },
  ],

  // SOURCE — Terror Tactics:
  // "All melee attacks of the unit gain the 'Gruesome' ability. The unit itself gains the
  //  'Terrifying(-1)' ability."
  // COST: 5 | 0 | 5
  'Terror Tactics': [
    { type: 'weapon_ability', name: 'Gruesome', weapon_type: 'melee', applies_to: 'all' },
    {
      type: 'unit_ability',
      name: 'Terrifying(-1)',
      desc: 'Enemy units within 6" of this unit suffer -1 to their Leadership.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Warp Pirates:
  // "The unit gains the 'Frenzy(1\")' ability."
  // COST: 5 | 0 | 5
  'Warp Pirates': [
    {
      type: 'unit_ability',
      name: 'Frenzy(1")',
      desc: 'After this unit finishes a melee attack, it may move up to 1" and make an additional attack against another eligible target.',
      applies_to: 'all',
    },
  ],

};
