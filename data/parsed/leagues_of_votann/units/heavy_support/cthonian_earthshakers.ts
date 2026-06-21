/**
 * CTHONIAN EARTHSHAKERS — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const cthonianEarthshakers: Unit = {
  "name": "Cthonian Earthshakers",
  "models": [
    {
      "name": "Cthonian Earthshakers",
      "points": 80,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "6",
        "W": "3",
        "I": "3",
        "A": "2",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Autoch-pattern bolt pistol; Plasma pick; Tremor shells.",
  "weapons": [
    {
      "name": "Autoch-pattern bolt pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Breacher ordnance",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(3), Explosive, Indirect"
    },
    {
      "name": "Plasma picks",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Tremor shells",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive, Graviton, Indirect, Suppression"
    }
  ],
  "option_groups": [
    {
      "header": "Each model may swap their Tremor shells",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Breacher ordnance",
          "points": 67
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Tremor shells"]
    }
  ],
  "abilities": [
    "Eye of the Ancestors, Squadron, Steady Advance, Void armor",
    "Support Weapons crew: Every instance of damage can only ever cause 1 wound loss. Attacks with the \"Barrage\" or \"Explosive\" ability cause one hit for each Wound remaining on the model."
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
  "min_cost": 80
};
