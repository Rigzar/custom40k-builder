/**
 * STORMLORD — Lords of War
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const stormlord: Unit = {
  "name": "Stormlord",
  "models": [
    {
      "name": "Stormlord",
      "points": 597,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "-",
        "BS": "4+",
        "S": "8",
        "FRONT": "14",
        "SIDE": "13",
        "REAR": "12",
        "I": "3",
        "A": "1",
        "HP": "5"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Stormlord is equipped with: 2 Heavy stubber; Twin heavy bolter; Vulcan mega-bolter.",
  "weapons": [
    {
      "name": "Heavy stubber",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Lascannon",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Storm bolter",
      "range": "24\"",
      "type": "Assault 2",
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
      "name": "Twin heavy flamers",
      "range": "9\"",
      "type": "Assault 8",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Vulcan mega-bolter",
      "range": "60\"",
      "type": "Rapid Fire 15",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Can be equipped with one of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Storm bolter",
          "points": 8
        },
        {
          "name": "Heavy stubber",
          "points": 11
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can be equipped with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "2 Lascannons and 2 Twin heavy bolter",
          "points": 158
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May swap each Twin heavy bolter",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin heavy flamer",
          "points": 8
        }
      ],
      "replaces": [
        "Twin heavy bolter"
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Fire hatches(20)",
    "Lumbering Behemoth: The model may not receive an \"Advance\" order. Additionally, it always counts as having received a \"Stand & Shoot\" order when shooting its weapons.",
    "Transport: This model has a transport capacity of 40 infantry models."
  ],
  "unit_type": "Super-heavy Vehicle",
  "keywords": [
    "Lord of War"
  ],
  "is_vehicle": true,
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
  "slot": "Lords of War",
  "default_size": 1,
  "min_cost": 597
};
