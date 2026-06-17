/**
 * KROOTOX RIDERS — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const krootoxRiders: Unit = {
  "name": "Krootox Riders",
  "models": [
    {
      "name": "Krootox Rider",
      "points": 46,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "6",
        "T": "5",
        "W": "3",
        "I": "3",
        "A": "3",
        "LD": "6",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Krootox Riders are equipped with: Tanglecannon; Krootox fist.",
  "weapons": [
    {
      "name": "Krootox fist",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Repeater cannon",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Tanglecannon",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "6",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive, Monofilament, Suppression"
    }
  ],
  "option_groups": [
    {
      "header": "For every unit of Kroot Carnivores, one unit of Krootox Riders may be taken without using an ELITE slot.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Any number of models may replace their Tanglecannon",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Repeater cannon",
          "points": 3
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Infiltrator, Supporting Fire, Use Cover"
  ],
  "unit_type": "Monstrous Infantry, Kroot",
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
  "advisor": true,
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 46
};
