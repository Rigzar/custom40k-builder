/**
 * JUDICAR — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const judicar: Unit = {
  "name": "Judicar",
  "models": [
    {
      "name": "Judicar",
      "points": 96,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "3",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Judicar is equipped with: Absolvor bolt pistol; Executioner relic blade; Frag grenades; Krak grenades.",
  "weapons": [
    {
      "name": "Absolvor bolt pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Executioner relic blade",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
      "d": "2",
      "abilities": "Deadly(5+)"
    },
    {
      "name": "Frag grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Krak grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Command squad, They Shall Know No Fear",
    "Advisor: For every HQ selection, one Judicar may be selected without taking up an Elite slot.",
    "Blade barrier: The model gains a 4+ invulnerability save in close combat.",
    "Tempor Mortis: The model and its attached unit always benefit from the \"Hold your ground\" meta order effect."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": true,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 96
};
