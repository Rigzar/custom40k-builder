/**
 * Adeptus Mechanicus Trait effects.
 *
 * SOURCE: data/parsed/adeptus_mechanicus/archetypes.json "traits" (canonical desc text).
 *
 * Status: complete — all 16 traits encoded. "Combined Explorator Fleet" (army-level second-
 * Legacy rule) is correctly empty. "Veteran Maniple" is ALSO correctly empty here — its effect
 * (a second Doctrina Imperitive purchase) is driven by the trait's own `veteran_max_bonus: 1`
 * field in archetypes.json, already read directly by resolver.ts's `traitVetMaxBonus` — it
 * doesn't need (or use) a TraitEffect entry.
 */

import type { TraitEffect } from '../traitEffects';

export const ADMECH_TRAIT_EFFECTS: Record<string, TraitEffect[]> = {

  // SOURCE — Accelerated Actuators:
  // "This unit gains the 'Frenzy(1)' ability."
  // COST: 5 | 0 | 5 | -
  'Accelerated Actuators': [
    { type: 'unit_ability', name: 'Frenzy(1)', applies_to: 'all' },
  ],

  // SOURCE — Autosavant Spirits:
  // "Vehicles gain the 'Blessing of the Omnissiah' ability (see Tech-priest), but may only
  //  use it on themselves and only for repairs."
  // COST: - | 0 | 5 | -
  'Autosavant Spirits': [
    {
      type: 'unit_ability',
      name: 'Blessing of the Omnissiah',
      desc: 'Vehicles gain the "Blessing of the Omnissiah" ability (see Tech-priest), but may only use it on themselves and only for repairs.',
      applies_to: 'vehicle',
    },
  ],

  // SOURCE — Combined Explorator Fleet:
  // "The army must select a second Legacy. Each model may only select items from one Legacy armory."
  // COST: 0 | 0 | 0 | -   (army-level rule — enforced by validators; no per-unit effect)
  'Combined Explorator Fleet': [],

  // SOURCE — Djinn Eyes:
  // "This unit gains the 'Sunder(1)' ability for all ranged attacks."
  // COST: 5 | 0 | 5 | -
  'Djinn Eyes': [
    {
      type: 'weapon_ability',
      name: 'Sunder(1)',
      weapon_type: 'ranged',
      applies_to: 'all',
    },
  ],

  // SOURCE — Masters of the Forge:
  // "This unit gets +1 to Canticle of the Omnissiah rolls."
  // COST: 5 | - | - | -
  'Masters of the Forge': [
    {
      type: 'unit_ability',
      name: 'Masters of the Forge',
      desc: 'This unit gets +1 to Canticle of the Omnissiah rolls.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Phased-Plasma Coils:
  // "This unit may roll their invulnerable save against any wound caused by a plasma
  //  weapon's Overheating ability."
  // COST: 5 | 0 | 5 | -
  'Phased-Plasma Coils': [
    {
      type: 'unit_ability',
      name: 'Phased-Plasma Coils',
      desc: 'This unit may roll their invulnerable save against any wound caused by a plasma weapon\'s Overheating ability.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Purgation Protocols:
  // "This unit can re-roll one armor penetration or wound roll per activation."
  // COST: 5 | 0 | 5 | -
  'Purgation Protocols': [
    {
      type: 'unit_ability',
      name: 'Purgation Protocols',
      desc: 'This unit can re-roll one armor penetration or wound roll per activation.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Refusal to Yield:
  // "This unit gains +1 Leadership."
  // COST: 5 | 0 | 5 | -
  'Refusal to Yield': [
    { type: 'stat_mod', stat: 'LD', delta: 1, applies_to: 'all' },
  ],

  // SOURCE — Relentless March:
  // "This unit gains the 'Haste(2")' ability."
  // COST: 5 | 0 | 5 | -
  'Relentless March': [
    { type: 'unit_ability', name: 'Haste(2")', applies_to: 'all' },
  ],

  // SOURCE — Red in Cog and Claw:
  // "If this unit uses a Charge order or is charged by an enemy unit, it gains +1 to melee
  //  hit rolls until the end of the current battle round."
  // COST: 5 | 0 | 5 | -
  'Red in Cog and Claw': [
    {
      type: 'unit_ability',
      name: 'Red in Cog and Claw',
      desc: 'If this unit uses a Charge order or is charged, it gains +1 to melee hit rolls until the end of the current battle round.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Rugged Explorators:
  // "This unit can fire Assault weapons, Grenades and Pistols without a to hit penalty with
  //  Advance and Charge orders."
  // COST: 5 | 0 | 5 | -
  'Rugged Explorators': [
    {
      type: 'unit_ability',
      name: 'Rugged Explorators',
      desc: 'This unit can fire Assault weapons, Grenades and Pistols without a to hit penalty with Advance and Charge orders.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Scarifying Weaponry:
  // "This unit's Radiation weapons (any weapon with Decimate) gain Deadly(6+)."
  // COST: 5 | - | - | -
  // NOTE: conditional on a weapon already having "Decimate" — no generic "weapons with ability
  // X gain ability Y" effect type; descriptive only.
  'Scarifying Weaponry': [
    {
      type: 'unit_ability',
      name: 'Scarifying Weaponry',
      desc: 'This unit\'s Radiation weapons (any weapon with Decimate) gain Deadly(6+).',
      applies_to: 'all',
    },
  ],

  // SOURCE — Shroud Protocols:
  // "This unit gains the benefit of light cover until its first activation."
  // COST: 3 | 0 | 3 | -
  'Shroud Protocols': [
    {
      type: 'unit_ability',
      name: 'Shroud Protocols',
      desc: 'This unit gains the benefit of light cover until its first activation.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Solar Blessing:
  // "This unit can reroll one armor save per battle round."
  // COST: 5 | 0 | 5 | -
  'Solar Blessing': [
    {
      type: 'unit_ability',
      name: 'Solar Blessing',
      desc: 'This unit can re-roll one armor save per battle round.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Staunch Defenders:
  // "This unit does not suffer the to hit penalty from Defensive Fire."
  // COST: 5 | 0 | 5 | -
  'Staunch Defenders': [
    {
      type: 'unit_ability',
      name: 'Staunch Defenders',
      desc: 'This unit does not suffer the to hit penalty from Defensive Fire.',
      applies_to: 'all',
    },
  ],

  // SOURCE — Veteran Maniple:
  // "Any unit with the option to purchase a Doctrina Imperitive may purchase a second one."
  // COST: 0 | 0 | 0 | -   — driven by `veteran_max_bonus: 1` on the trait data itself, read
  // directly by resolver.ts; no TraitEffect needed.
  'Veteran Maniple': [],

};
