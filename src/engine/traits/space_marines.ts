/**
 * Space Marines Trait effects.
 *
 * SOURCE: Space Marines — Army Customisation sheet (canonical)
 * ────────────────────────────────────────────────────────────
 * "Traits enhance your units with special abilities that they normally would not be able to have."
 * "If a Trait is taken, all models / units in the army must be upgraded with it, unless stated otherwise."
 * "The point costs for traits have to be paid per unit. If point costs are marked with *,
 *  then they must be paid for every Wound or Hull point in the unit."
 *
 * COST COLUMNS: NORMAL | CHARACTER MODELS | MONSTROUS CREATURES & VEHICLES (shared column)
 *
 * Status: complete — all 19 traits encoded. Effects are LIVE: this map is spread into
 * TRAIT_EFFECTS (traitEffects.ts) and applied by the resolver's faction-agnostic trait pass.
 * Two traits carry no per-unit effect by design: "Expanded Armory" (army-level — enables a
 * second Legacy, handled in validators) and "Path of Damnation" (one-model special).
 *
 * applies_to guide:
 *   'all'      → creature + vehicle
 *   'creature' → non-vehicle (infantry, characters, monsters)
 *   'vehicle'  → vehicles only
 *   'infantry' → non-vehicle, non-monster, non-character
 */

import type { TraitEffect } from '../traitEffects';

export const SM_TRAIT_EFFECTS: Record<string, TraitEffect[]> = {

  // SOURCE — Blitz Attack:
  // "The unit can fire Assault weapons, Grenades and Pistols without a to hit penalty
  //  with Advance and Charge orders."
  // COST: 5 | 0 | 5
  'Blitz Attack': [
    {
      type: 'unit_ability',
      name: 'Blitz Attack',
      desc: 'The unit can fire Assault weapons, Grenades and Pistols without a to hit penalty with Advance and Charge orders.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Bolter Drill:
  // "The unit gains the 'Deflagrate(5+)' ability with Bolt weapons."
  // COST: 5 | 0 | 5
  'Bolter Drill': [
    {
      type: 'weapon_ability',
      name: 'Deflagrate(5+)',
      weapon_type: 'bolt',
      applies_to: 'all',
    },
  ],

  // SOURCE — Codex Discipline:
  // "The unit gains +1 Leadership."
  // COST: 5 | 0 | 5
  'Codex Discipline': [
    { type: 'stat_mod', stat: 'LD', delta: 1, applies_to: 'all' },
  ],

  // SOURCE — Expanded Armory:
  // "The army must select a second Legacy. Each model may only select items from one Legacy armory."
  // COST: 0 | 0 | 0   (army-level rule — enforced by validators; no per-unit effect)
  'Expanded Armory': [],

  // SOURCE — Cursed Founding:
  // "Select one improvement that must be applied to any creature unit:
  //  - Apparitions: The unit gains 'Deep Strike' and must use it during deployment (not enemy zone,
  //    can scatter into it). Additionally the unit gains 'Warded'.
  //  - Aura of Doom: The unit gains 'Terrifying(-2)'.
  //  - Berserkers: The unit gains 'Blind Rage'.
  //  - Immolation: The model gains 'Retribution(1)'.
  //  - Ossific Blades: The model gains the 'Ossific Blades' weapon (see Armory)."
  // COST: 5 | 0 | 5
  // NOTE: the five sub-options are a player choice — builder shows them as description only;
  //       the specific improvement cannot be enforced in the builder without a chooser UI.
  'Cursed Founding': [
    {
      type: 'unit_ability',
      name: 'Cursed Founding',
      desc: 'Select one improvement: Apparitions (Deep Strike + Warded), Aura of Doom (Terrifying(-2)), Berserkers (Blind Rage), Immolation (Retribution(1)), or Ossific Blades weapon.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Forged in Battle:
  // "The unit can re-roll one armor penetration or wound roll per activation."
  // COST: 5 | 0 | 5
  'Forged in Battle': [
    {
      type: 'unit_ability',
      name: 'Forged in Battle',
      desc: 'The unit can re-roll one armor penetration or wound roll per activation.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Knowledge is Power:
  // "The model can re-roll one psychic test per activation. Only for Psykers."
  // COST: - | 0 | 5   (normal infantry excluded — "-" means unavailable)
  'Knowledge is Power': [
    {
      type: 'unit_ability',
      name: 'Knowledge is Power',
      desc: 'The model can re-roll one psychic test per activation. Only for Psykers.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Path of Damnation:
  // "One model of the army must gain the 'Demon weapon' equipment from the 'Chaos Space Marines'
  //  codex to enhance one of its weapons. The Demon weapon ability can be from any Armory."
  // COST: - | Special | -   (army-level one-model rule — no per-unit effect in builder)
  'Path of Damnation': [],

  // SOURCE — Purity above All:
  // "One non-character model per squad with access to gear from the Armory can be upgraded to
  //  an Apothecary and gains the 'Narthecium' ability."
  // COST: 5 | - | -   (infantry only)
  'Purity above All': [
    {
      type: 'unit_ability',
      name: 'Purity above All',
      desc: 'One non-character model per squad with access to the Armory can be upgraded to an Apothecary and gains the "Narthecium" ability.',
      applies_to: 'infantry',
    },
  ],

  // SOURCE — Rapid Deployment:
  // "The unit gains the 'Haste(2\")' ability."
  // COST: 5 | 0 | 5
  'Rapid Deployment': [
    {
      type: 'unit_ability',
      name: 'Haste(2")',
      desc: 'The unit gains the "Haste(2")" ability.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Red Thirst:
  // "If the unit uses a Charge order or gets charged by an enemy unit, it gains +1 Strength
  //  until the end of the current battle round."
  // COST: 5 | 0 | 5
  'Red Thirst': [
    {
      type: 'unit_ability',
      name: 'Red Thirst',
      desc: 'If the unit uses a Charge order or gets charged, it gains +1 Strength until the end of the current battle round.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Righteous Wrath:
  // "The unit gains the 'Frenzy(1\")' ability."
  // COST: 5 | 0 | 5
  'Righteous Wrath': [
    {
      type: 'unit_ability',
      name: 'Frenzy(1")',
      desc: 'The unit gains the "Frenzy(1")" ability.',
      applies_to: 'all',
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

  // SOURCE — Sons of Mars:
  // "One non-character model per squad with access to gear from the Armory can be upgraded to
  //  a Techmarine and gains the 'Blessing of the Omnissiah' ability."
  // COST: 5 | - | -   (infantry only)
  'Sons of Mars': [
    {
      type: 'unit_ability',
      name: 'Sons of Mars',
      desc: 'One non-character model per squad with access to the Armory can be upgraded to a Techmarine and gains the "Blessing of the Omnissiah" ability.',
      applies_to: 'infantry',
    },
  ],

  // SOURCE — Stalwart:
  // "The unit can reroll one armor save per battle round."
  // COST: 5 | 0 | 5
  'Stalwart': [
    {
      type: 'unit_ability',
      name: 'Stalwart',
      desc: 'The unit can re-roll one armor save per battle round.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Stoic:
  // "The unit does not suffer the to hit penalty from Defensive Fire."
  // COST: 5 | 0 | 5
  'Stoic': [
    {
      type: 'unit_ability',
      name: 'Stoic',
      desc: 'The unit does not suffer the to hit penalty from Defensive Fire.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Strike from the Shadows:
  // "The unit gains the benefit of light cover until its first activation."
  // COST: 3 | 0 | 3
  'Strike from the Shadows': [
    {
      type: 'unit_ability',
      name: 'Strike from the Shadows',
      desc: 'The unit gains the benefit of light cover until its first activation.',
      applies_to: 'all',
    },
  ],

  // SOURCE — The Flesh is Weak:
  // "Creature models gain a 6+ invulnerability save. Vehicles repair either one Engine Damage
  //  or Weapon Damage on themselves during each Rally phase. Only for creature models that do
  //  not already have an invulnerability save from their datasheet or Armory."
  // COST: 2* | 0 | 5*   (* = per Wound / Hull Point)
  'The Flesh is Weak': [
    { type: 'inv_save', value: 6, applies_to: 'creature' },
    {
      type: 'unit_ability',
      name: 'The Flesh is Weak',
      desc: 'Vehicles repair either one Engine Damage or Weapon Damage on themselves during each Rally phase.',
      applies_to: 'vehicle',
    },
  ],

  // SOURCE — Unleashed Hunters:
  // "If the unit uses a Charge order or gets charged by an enemy unit, it gains +1 to melee
  //  hit rolls until the end of the current battle round."
  // COST: 5 | 0 | 5
  'Unleashed Hunters': [
    {
      type: 'unit_ability',
      name: 'Unleashed Hunters',
      desc: 'If the unit uses a Charge order or gets charged, it gains +1 to melee hit rolls until the end of the current battle round.',
      applies_to: 'all',
    },
  ],

};
