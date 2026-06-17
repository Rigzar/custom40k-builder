/**
 * CANOPTEK WRAITHS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const canoptekWraiths: Unit = {
  "name": "Canoptek Wraiths",
  "models": [
    {
      "name": "Wraith",
      "points": 71,
      "min": 3,
      "max": 6,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "4+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "4",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Vicious claws.",
  "weapons": [
    {
      "name": "Particle caster",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Transdimensional beamer",
      "range": "12\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "-4",
      "d": "2",
      "abilities": "Deadly(5+), Decimate, Haywire"
    },
    {
      "name": "Vicious claws",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    }
  ],
  "option_groups": [
    {
      "header": "Any model can each be equipped with one of the following",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Particle caster",
          "points": 2
        },
        {
          "name": "Transdimensional beamer",
          "points": 12
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "All models can additionally be equipped with",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Whip coils",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Whip coils: Enemy models in base contact get -1 attack in close combat, to a minimum of 1. Stacks with itself.",
    "Wraith form: The model gains a 4+ invulnerability save."
  ],
  "unit_type": "Jet Bike, Monstrous Infantry, Canoptek",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 3,
  "min_cost": 213
};
