import type { TraitEffect } from '../traitEffects';

/**
 * Space Marines trait effects.
 *
 * applies_to guide:
 *   'all'      → creature + vehicle
 *   'creature' → non-vehicle (infantry, characters, monsters)
 *   'vehicle'  → vehicles only
 *   'monster'  → monstrous creatures only
 *   'character'→ characters only
 *   'infantry' → non-vehicle, non-monster, non-character
 *
 * Point costs per trait (from Army Customisation HTML):
 *   unit | char | monster | veh
 *
 * Status: skeleton — effects to be filled in after unit audit.
 */
export const SM_TRAIT_EFFECTS: Record<string, TraitEffect[]> = {

  // unit=5 | char=0 | monster=5 | veh=-
  // "With a Charge order or charged: +1 hit roll in melee until end of round."
  'Blitz Attack': [
    {
      type: 'unit_ability',
      name: 'Blitz Attack',
      desc: 'The unit can fire Assault weapons, Grenades and Pistols without a to hit penalty with Advance and Charge orders.',
      applies_to: 'creature',
    },
  ],

  // unit=5 | char=0 | monster=5 | veh=-
  // "Bolt weapons gain Deflagrate(5+). Does not apply to Heavy weapons."
  'Bolter Drill': [
    {
      type: 'weapon_ability',
      name: 'Deflagrate(5+)',
      weapon_type: 'bolt',
      applies_to: 'creature',
    },
  ],

  // unit=5 | char=0 | monster=5 | veh=-
  'Codex Discipline': [
    {
      type: 'stat_mod',
      stat: 'LD',
      delta: 1,
      applies_to: 'creature',
    },
  ],

  // unit=0 | char=0 | monster=0 | veh=-
  // Army-level: enables second legacy. No per-unit effect.
  'Expanded Armory': [],

  // unit=5 | char=0 | monster=5 | veh=-
  // "Select one improvement for any creature unit: Apparitions / Aura of Doom / Berserkers / Immolation / Ossific Blades."
  'Cursed Founding': [
    // No generic stat mod — per-unit selection via armory/option. Placeholder.
    {
      type: 'unit_ability',
      name: 'Cursed Founding',
      desc: 'Select one improvement: Apparitions (Deep Strike + Warded), Aura of Doom (Terrifying(-2)), Berserkers (Blind Rage), Immolation (Retribution(1)), or Ossific Blades weapon.',
      applies_to: 'creature',
    },
  ],

  // unit=5 | char=0 | monster=5 | veh=-
  'Forged in Battle': [
    {
      type: 'unit_ability',
      name: 'Forged in Battle',
      desc: 'The unit can re-roll one armor penetration or wound roll per activation.',
      applies_to: 'creature',
    },
  ],

  // unit=- | char=0 | monster=5 | veh=-
  // Only for psykers.
  'Knowledge is Power': [
    {
      type: 'unit_ability',
      name: 'Knowledge is Power',
      desc: 'The model can re-roll one psychic test per activation. Only for Psykers.',
      applies_to: 'character',
    },
  ],

  // unit=- | char=Special | monster=- | veh=-
  // Grants a Demon weapon from CSM codex to one weapon. No per-unit stat effect.
  'Path of Damnation': [],

  // unit=5 | char=- | monster=- | veh=-
  // "One non-character model per squad with armory access can be upgraded to an Apothecary."
  'Purity above All': [
    {
      type: 'unit_ability',
      name: 'Purity above All',
      desc: 'One non-character model per squad with access to the Armory can be upgraded to an Apothecary and gains the "Narthecium" ability.',
      applies_to: 'infantry',
    },
  ],

  // unit=5 | char=0 | monster=5 | veh=-
  'Rapid Deployment': [
    {
      type: 'unit_ability',
      name: 'Haste(2")',
      desc: 'The unit gains the "Haste(2")" ability.',
      applies_to: 'creature',
    },
  ],

  // unit=5 | char=0 | monster=5 | veh=-
  'Red Thirst': [
    {
      type: 'unit_ability',
      name: 'Red Thirst',
      desc: 'If the unit uses a Charge order or gets charged, it gains +1 Strength until the end of the current battle round.',
      applies_to: 'creature',
    },
  ],

  // unit=5 | char=0 | monster=5 | veh=-
  'Righteous Wrath': [
    {
      type: 'unit_ability',
      name: 'Frenzy(1")',
      desc: 'The unit gains the "Frenzy(1")" ability.',
      applies_to: 'creature',
    },
  ],

  // unit=5 | char=0 | monster=5 | veh=-
  'Siege Experts': [
    {
      type: 'weapon_ability',
      name: 'Sunder(1)',
      weapon_type: 'ranged',
      applies_to: 'all',
    },
  ],

  // unit=5 | char=- | monster=- | veh=-
  // "One non-character model per squad with armory access can be upgraded to a Techmarine."
  'Sons of Mars': [
    {
      type: 'unit_ability',
      name: 'Sons of Mars',
      desc: 'One non-character model per squad with access to the Armory can be upgraded to a Techmarine and gains the "Blessing of the Omnissiah" ability.',
      applies_to: 'infantry',
    },
  ],

  // unit=5 | char=0 | monster=5 | veh=-
  'Stalwart': [
    {
      type: 'unit_ability',
      name: 'Stalwart',
      desc: 'The unit can re-roll one armor save per battle round.',
      applies_to: 'creature',
    },
  ],

  // unit=5 | char=0 | monster=5 | veh=-
  'Stoic': [
    {
      type: 'unit_ability',
      name: 'Stoic',
      desc: 'The unit does not suffer the to hit penalty from Defensive Fire.',
      applies_to: 'creature',
    },
  ],

  // unit=3 | char=0 | monster=3 | veh=-
  'Strike from the Shadows': [
    {
      type: 'unit_ability',
      name: 'Strike from the Shadows',
      desc: 'The unit gains the benefit of light cover until its first activation.',
      applies_to: 'creature',
    },
  ],

  // unit=2* | char=0 | monster=5* | veh=-
  // *Per wound/HP. Only for models without an existing invuln save.
  'The Flesh is Weak': [
    {
      type: 'inv_save',
      value: 6,
      applies_to: 'creature',
    },
  ],

  // unit=5 | char=0 | monster=5 | veh=-
  'Unleashed Hunters': [
    {
      type: 'unit_ability',
      name: 'Unleashed Hunters',
      desc: 'If the unit uses a Charge order or gets charged, it gains +1 to melee hit rolls until the end of the current battle round.',
      applies_to: 'creature',
    },
  ],

};
