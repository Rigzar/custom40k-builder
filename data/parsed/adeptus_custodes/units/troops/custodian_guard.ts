/**
 * CUSTODIAN GUARD — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const custodianGuard: Unit = {
  "name": "Custodian Guard",
  "models": [
    {
      "name": "Custodian Guard",
      "points": 72,
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
      "name": "Adrathic destructor",
      "range": "18\"",
      "type": "Pistol 1",
      "s": "5",
      "ap": "-3",
      "d": "2",
      "abilities": "-"
    },
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
      "name": "Guardian spear",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "1",
      "abilities": "Quick(+1)"
    },
    {
      "name": "Melta beam",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Beam, Melta"
    },
    {
      "name": "Sentinel blade",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Every model with a Guardian spear may swap their Bolt caster",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Adrathic destructor",
          "points": 5
        },
        {
          "name": "Melta beam",
          "points": 6
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Bolt caster"]
    },
    {
      "header": "Every model with a Bolt caster may swap their Guardian spear",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Sentinel blade & Storm shield",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Guardian spear"]
    }
  ],
  "abilities": [
    "Massive(1), Shield Host",
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
  "advisor": false,
  "slot": "Troops",
  "default_size": 3,
  "min_cost": 216
};
