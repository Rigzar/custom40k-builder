/**
 * Dark Eldar Trait effects.
 *
 * SOURCE: data/parsed/dark_eldar/archetypes.json "traits" (canonical desc text).
 *
 * Status: complete — all 22 traits encoded. Trait names carry sub-faction superscripts
 * (ᶜᵘ Cult, ᶜᵒ Coven, ᴷ Kabal) that are part of the canonical name string itself — kept verbatim
 * as dictionary keys. Per-trait sub-faction enforcement is now wired (2026-07-13): the superscript
 * is parsed by `subfaction.ts` (`traitRequiredSubfaction`) and gated against the unit's effective
 * sub-faction in `resolver.ts` before applying any effect — a ᴷ trait no longer reaches a Coven
 * unit. This file still only defines the EFFECT; the who-may-take gate lives in the resolver.
 * "Creatures only" restrictions use applies_to: 'creature' (non-vehicle).
 */

import type { TraitEffect } from '../traitEffects';

export const DARK_ELDAR_TRAIT_EFFECTS: Record<string, TraitEffect[]> = {

  // SOURCE — Acrobatic Displayᶜᵘ:
  // "The unit gains the 'Move through cover' ability and may ignore enemy models in its
  //  path when consolidating in melee."
  'Acrobatic Displayᶜᵘ': [
    {
      type: 'unit_ability',
      name: 'Acrobatic Display',
      desc: 'The unit gains the "Move through cover" ability and may ignore enemy models in its path when consolidating in melee.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Artists of the Fleshᶜᵒ:
  // "The unit gains +1 Strength and the 'Berserk(5+)' ability. Only for creatures."
  'Artists of the Fleshᶜᵒ': [
    { type: 'stat_mod', stat: 'S', delta: 1, applies_to: 'creature' },
    { type: 'unit_ability', name: 'Berserk(5+)', applies_to: 'creature' },
  ],

  // SOURCE — Berserk Fugueᶜᵘ:
  // "The unit gains the 'Berserk(5+)' and 'Furious Charge' abilities. Only for creatures."
  'Berserk Fugueᶜᵘ': [
    { type: 'unit_ability', name: 'Berserk(5+)', applies_to: 'creature' },
    { type: 'unit_ability', name: 'Furious Charge', applies_to: 'creature' },
  ],

  // SOURCE — Dark Harvestᶜᵒ:
  // "After finishing a charge move, the enemy unit suffers one automatic wound with S:4
  //  AP:0 D:1 for every friendly model that made it into base contact. Only for creatures."
  'Dark Harvestᶜᵒ': [
    {
      type: 'unit_ability',
      name: 'Dark Harvest',
      desc: 'After finishing a charge move, the enemy unit suffers one automatic wound with S:4 AP:0 D:1 for every friendly model that made it into base contact.',
      applies_to: 'creature',
    },
  ],

  // SOURCE — Dark Mirthᴷ:
  // "For every model in this unit, an enemy unit activating within 12\" of it suffers 1
  //  automatic wound with S:4 AP:0 D:1, Seeking. Can't cause more wounds than models in the
  //  enemy unit. Only for creatures."
  'Dark Mirthᴷ': [
    {
      type: 'unit_ability',
      name: 'Dark Mirth',
      desc: 'For every model in this unit, an enemy unit activating within 12" of it suffers 1 automatic wound with S:4 AP:0 D:1, Seeking. Can\'t cause more wounds than models in the enemy unit.',
      applies_to: 'creature',
    },
  ],

  // SOURCE — Dark Technomancersᶜᵒ:
  // "Any or all ranged weapons of the unit may be overcharged when shooting. Add +1 to wound
  //  rolls and -1 AP to each weapon. All overcharged weapons gain the 'Overheating' ability."
  'Dark Technomancersᶜᵒ': [
    {
      type: 'unit_ability',
      name: 'Dark Technomancers',
      desc: 'Any or all ranged weapons of the unit may be overcharged when shooting: +1 to wound rolls and -1 AP, but gains "Overheating".',
      applies_to: 'all',
    },
  ],

  // SOURCE — Deadly Deceiversᴷ:
  // "The unit does not lose its Order token when it receives two or more Battleshock
  //  tokens. It may still be activated normally after the compulsary move. Only for creatures."
  'Deadly Deceiversᴷ': [
    {
      type: 'unit_ability',
      name: 'Deadly Deceivers',
      desc: 'The unit does not lose its Order token when it receives two or more Battleshock tokens. It may still be activated normally after the compulsory move.',
      applies_to: 'creature',
    },
  ],

  // SOURCE — Disdain for Lesser Beingsᴷ:
  // "Every melee combat result is increased by +2 for the unit."
  'Disdain for Lesser Beingsᴷ': [
    {
      type: 'unit_ability',
      name: 'Disdain for Lesser Beings',
      desc: 'Every melee combat result is increased by +2 for the unit.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Enhanced Sensory Organsᶜᵒ:
  // "The unit gains the 'Sunder(1)' ability for all ranged attacks."
  'Enhanced Sensory Organsᶜᵒ': [
    {
      type: 'weapon_ability',
      name: 'Sunder(1)',
      weapon_type: 'ranged',
      applies_to: 'all',
    },
  ],

  // SOURCE — Hungry for Fleshᶜᵒ:
  // "The unit gains the 'Frenzy(1)' ability."
  'Hungry for Fleshᶜᵒ': [
    { type: 'unit_ability', name: 'Frenzy(1)', applies_to: 'all' },
  ],

  // SOURCE — Masters of Mutagensᶜᵒ:
  // "The unit gains the 'Precision(5+)' ability with Poison weapons. Does not apply to 'Heavy' weapons."
  'Masters of Mutagensᶜᵒ': [
    {
      type: 'unit_ability',
      name: 'Masters of Mutagens',
      desc: 'The unit gains the "Precision(5+)" ability with Poison weapons. Does not apply to "Heavy" weapons.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Merciless Razorkinᴷ:
  // "The unit gains the 'Deflagrate(5+)' ability with Splinter weapons. Does not apply to 'Heavy' weapons."
  'Merciless Razorkinᴷ': [
    {
      type: 'unit_ability',
      name: 'Merciless Razorkin',
      desc: 'The unit gains the "Deflagrate(5+)" ability with Splinter weapons. Does not apply to "Heavy" weapons.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Obsessive Collectorsᶜᵒ:
  // "Everytime an enemy unit is destroyed in melee within 6\" of this unit, it regains D3
  //  lost wounds. If no wounds can be healed, dead models are instead revived. Only for creatures."
  'Obsessive Collectorsᶜᵒ': [
    {
      type: 'unit_ability',
      name: 'Obsessive Collectors',
      desc: 'Every time an enemy unit is destroyed in melee within 6" of this unit, it regains D3 lost wounds. If no wounds can be healed, dead models are instead revived.',
      applies_to: 'creature',
    },
  ],

  // SOURCE — Precise Killersᶜᵘ:
  // "The unit gains the 'Rending(5+)' ability with all melee weapons. Only for creatures."
  'Precise Killersᶜᵘ': [
    {
      type: 'weapon_ability',
      name: 'Rending(5+)',
      weapon_type: 'melee',
      applies_to: 'creature',
    },
  ],

  // SOURCE — Slashing Impactᶜᵘ:
  // "After finishing a charge move, the enemy unit suffers one automatic wound with S:4
  //  AP:0 D:1 for every friendly model that made it into base contact. Only for creatures."
  'Slashing Impactᶜᵘ': [
    {
      type: 'unit_ability',
      name: 'Slashing Impact',
      desc: 'After finishing a charge move, the enemy unit suffers one automatic wound with S:4 AP:0 D:1 for every friendly model that made it into base contact.',
      applies_to: 'creature',
    },
  ],

  // SOURCE — Splinter Bladesᶜᵒ:
  // "The unit gains the 'Deflagrate(5+)' ability with all melee weapons. Only for creatures."
  'Splinter Bladesᶜᵒ': [
    {
      type: 'weapon_ability',
      name: 'Deflagrate(5+)',
      weapon_type: 'melee',
      applies_to: 'creature',
    },
  ],

  // SOURCE — Test of Skillᶜᵘ:
  // "The unit may re-roll to hit and to wound rolls of 1 against HQ, character models and
  //  Monstrous Creatures."
  'Test of Skillᶜᵘ': [
    {
      type: 'unit_ability',
      name: 'Test of Skill',
      desc: 'The unit may re-roll to hit and to wound rolls of 1 against HQ, character models and Monstrous Creatures.',
      applies_to: 'all',
    },
  ],

  // SOURCE — The Art of Painᶜᵘ:
  // "Every time the unit is activated while in melee combat, it gains an additional effect
  //  from the 'Power through Pain' table. The effects are lost once the melee ends."
  'The Art of Painᶜᵘ': [
    {
      type: 'unit_ability',
      name: 'The Art of Pain',
      desc: 'Every time the unit is activated while in melee combat, it gains an additional effect from the "Power through Pain" table. The effects are lost once the melee ends.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Torturous Efficiencyᴷ:
  // "The unit gains the 'Rending(5+)' ability with all weapons."
  'Torturous Efficiencyᴷ': [
    { type: 'weapon_ability', name: 'Rending(5+)', applies_to: 'all' },
  ],

  // SOURCE — Toxin Craftersᴷ:
  // "The unit may re-roll to wound rolls of 1 with Poison weapons."
  'Toxin Craftersᴷ': [
    {
      type: 'unit_ability',
      name: 'Toxin Crafters',
      desc: 'The unit may re-roll to wound rolls of 1 with Poison weapons.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Trophy Takersᶜᵘ:
  // "Enemy units within 12\" must roll an additional die for each Leadership test and take
  //  the highest two."
  'Trophy Takersᶜᵘ': [
    {
      type: 'unit_ability',
      name: 'Trophy Takers',
      desc: 'Enemy units within 12" must roll an additional die for each Leadership test and take the highest two.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Twisted Huntersᴷ:
  // "The unit may re-roll to hit and to wound rolls of 1 against HQ, character models and
  //  Monstrous Creatures."
  'Twisted Huntersᴷ': [
    {
      type: 'unit_ability',
      name: 'Twisted Hunters',
      desc: 'The unit may re-roll to hit and to wound rolls of 1 against HQ, character models and Monstrous Creatures.',
      applies_to: 'all',
    },
  ],

};
