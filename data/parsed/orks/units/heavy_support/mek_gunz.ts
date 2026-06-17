/**
 * MEK GUNZ — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const mekGunz: Unit = {
  "name": "Mek Gunz",
  "models": [
    {
      "name": "Mek Gun",
      "points": 23,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "5+",
        "BS": "4+",
        "S": "2",
        "T": "7",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "5",
        "SV": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Mek Gun is equipped with: -.",
  "weapons": [
    {
      "name": "Kustom mega-kannon",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Barrage, Overheating"
    },
    {
      "name": "Lobba",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Indirect"
    },
    {
      "name": "Smasha gun",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Explosive, Grav"
    },
    {
      "name": "Traktor kannon",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-2",
      "d": "3",
      "abilities": "AT(2), Anti-air"
    },
    {
      "name": "Zzap gun",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "2D6",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(2)"
    }
  ],
  "option_groups": [
    {
      "header": "Every Mek Gun must select one weapon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Lobba",
          "points": 0
        },
        {
          "name": "Kannon",
          "points": 24
        },
        {
          "name": "Zzap gun",
          "points": 29
        },
        {
          "name": "Bubblechukka",
          "points": 37
        },
        {
          "name": "Smasha gun",
          "points": 55
        },
        {
          "name": "Traktor kannon",
          "points": 57
        },
        {
          "name": "Kustom mega-kannon",
          "points": 108
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can get one Kustom job.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Squadron",
    "Bubbles: When a unit shoots with this weapon, before selecting a target roll a D6. On a result of 1-2, all bubblechukkas in the unit must use the \"Weedy\" profile. On a result of 3-4, they must all use the \"Big\" profile. On a result of 5-6, they must all ust the \"'Uge\" profile.",
    "Colossal Blast: A successful hit roll with this weapon generates a number of wound rolls equal to the number of models in the target unit, up to a maximum of 8. An unsuccessful hit roll can be re-rolled once. A successful re-roll can generate a maximum of 4 wound rolls.",
    "Support Weapons crew: Every instance of damage can only ever cause 1 wound loss. Attacks with the \"Barrage\" or \"Explosive\" ability cause one hit for each Wound remaining on the model.",
    "Traktor kannon: Attacks against vehicles receive an additional +1 bonus on hit rolls."
  ],
  "unit_type": "Infantry",
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 23
};
