/**
 * CENTURION DEVASTATOR SQUAD — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const centurionDevastatorSquad: Unit = {
  "name": "Centurion Devastator Squad",
  "models": [
    {
      "name": "Centurion",
      "points": 120,
      "min": 2,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "T": "6",
        "W": "3",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "2+"
      }
    },
    {
      "name": "Centurion Sergeant",
      "points": 120,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "T": "6",
        "W": "3",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Veteran Centurion Sergeant",
      "points": 130,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "T": "6",
        "W": "3",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "2+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Grav cannon; Hurricane Boltgun.",
  "weapons": [
    {
      "name": "Grav cannon",
      "range": "30\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-3",
      "d": "1",
      "abilities": "Explosive, Grav"
    },
    {
      "name": "Hurricane Boltgun",
      "range": "24\"",
      "type": "Rapid Fire 6",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 4",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin lascannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Missile launcher (Frag)",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Missile launcher (Krak)",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-air"
    }
  ],
  "option_groups": [
    {
      "header": "Any model may swap the Grav cannon",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Twin heavy bolter",
          "points": 10
        },
        {
          "name": "Twin lascannon",
          "points": 112
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Grav cannon"]
    },
    {
      "header": "Any model may swap the Hurricane Boltgun",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Missile launcher",
          "points": 9
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Hurricane Boltgun"]
    },
    {
      "header": "The Centurion Sergeant may be upgraded to a Veteran Centurion Sergeant for +10 points and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": "Veteran Centurion Sergeant",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Massive(2), They Shall Know No Fear, Unyielding"
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 3,
  "min_cost": 360
};
