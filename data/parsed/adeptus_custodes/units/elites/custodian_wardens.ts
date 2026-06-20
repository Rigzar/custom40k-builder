/**
 * CUSTODIAN WARDENS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const custodianWardens: Unit = {
  "name": "Custodian Wardens",
  "models": [
    {
      "name": "Custodian Warden",
      "points": 73,
      "min": 3,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "5",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "3",
        "LD": "9",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "All models are equipped with: Bolt caster; Guardian spear.",
  "weapons": [
    {
      "name": "Bolt caster",
      "range": "12\"",
      "type": "Pistol 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Castellan axe",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Guardian spear",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "1",
      "abilities": "Quick(+1)"
    }
  ],
  "option_groups": [
    {
      "header": "Every model may swap their Guardian spear",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Castellan axe",
          "points": 8
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Guardian spear"]
    }
  ],
  "abilities": [
    "Bodyguard, Massive(1), Shield Host",
    "Custodian armor: The model gains a 5+ invulnerability save."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": true,
  "slot": "Elites",
  "default_size": 3,
  "min_cost": 219
};
