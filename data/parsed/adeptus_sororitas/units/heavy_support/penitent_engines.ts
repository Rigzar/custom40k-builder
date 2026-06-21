/**
 * PENITENT ENGINES — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const penitentEngines: Unit = {
  "name": "Penitent Engines",
  "models": [
    {
      "name": "Penitent Engine",
      "points": 84,
      "min": 1,
      "max": 4,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "3",
        "A": "1",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: 2 Heavy flamers; 2 Penitent flail.",
  "weapons": [
    {
      "name": "Heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Heavy flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Penitent buzz-blade",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-4",
      "d": "2",
      "abilities": "Armorbane, AT(2), Flurry(1), Slow(-3)"
    },
    {
      "name": "Penitent flail",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-1",
      "d": "1",
      "abilities": "Flurry(3)"
    }
  ],
  "option_groups": [
    {
      "header": "Each model may swap both Penitent flails",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Penitent buzz-blade and Penitent flail",
          "points": 9
        },
        {
          "name": "2 Penitent buzz-blades",
          "points": 17
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Penitent flail"]
    },
    {
      "header": "Each model may swap both Heavy flamers",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Heavy bolter",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Heavy flamer"]
    }
  ],
  "abilities": [
    "Berserk(5+), Blind rage"
  ],
  "unit_type": "Monstrous Infantry",
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
  "min_cost": 84
};
