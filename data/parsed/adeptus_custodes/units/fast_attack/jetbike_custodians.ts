/**
 * JETBIKE CUSTODIANS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const jetbikeCustodians: Unit = {
  "name": "Jetbike Custodians",
  "models": [
    {
      "name": "Jetbike Custodian",
      "points": 151,
      "min": 3,
      "max": 6,
      "stats": {
        "M": "12\"",
        "WS": "2+",
        "BS": "2+",
        "S": "5",
        "T": "6",
        "W": "3",
        "I": "4",
        "A": "3",
        "LD": "9",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "All models are equipped with: Interceptor lance; Lastrum bolt cannon.",
  "weapons": [
    {
      "name": "Adrathic devastator",
      "range": "18\"",
      "type": "Heavy 2",
      "s": "6",
      "ap": "-3",
      "d": "3",
      "abilities": "-"
    },
    {
      "name": "Hurricane bolter",
      "range": "24\"",
      "type": "Rapid Fire 6",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Lastrum bolt cannon",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Salvo launcher",
      "range": "24\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Armorbane"
    },
    {
      "name": "Twin las-pulser",
      "range": "24\"",
      "type": "Heavy 4",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1)"
    },
    {
      "name": "Interceptor lance - Charge",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Quick(+1), Can only be used with a Charge order"
    },
    {
      "name": "Interceptor lance - Melee",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "Unwieldy"
    }
  ],
  "option_groups": [
    {
      "header": "Any model may swap their Lastrum bolt cannon",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Hurricane bolter",
          "points": 13
        },
        {
          "name": "Adrathic devastator",
          "points": 38
        },
        {
          "name": "Salvo launcher",
          "points": 65
        },
        {
          "name": "Twin las-pulser",
          "points": 116
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Lastrum bolt cannon"]
    }
  ],
  "abilities": [
    "Shield Host",
    "Custodian armor: The model gains a 5+ invulnerability save."
  ],
  "unit_type": "Jetbike",
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
  "slot": "Fast Attack",
  "default_size": 3,
  "min_cost": 453
};
