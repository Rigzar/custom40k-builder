/**
 * HARLEQUIN WRAITHLORD — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const harlequinWraithlord: Unit = {
  "name": "Harlequin Wraithlord",
  "models": [
    {
      "name": "Wraithlord",
      "points": 260,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "8\"",
        "WS": "3+",
        "BS": "3+",
        "S": "7",
        "T": "8",
        "W": "6",
        "I": "4",
        "A": "3",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Wraithlord is equipped with: 2 Shuriken catapults; Wraithbone fists.",
  "weapons": [
    {
      "name": "Aeldari flamer",
      "range": "12\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Aeldari missile launcher - Sunburst",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Aeldari missile launcher - Starshot",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Anti-Air, AT(2)"
    },
    {
      "name": "Bright lance",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Lance(+2)"
    },
    {
      "name": "Ghostglaive",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Flurry(1)"
    },
    {
      "name": "Scatter laser",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Shuriken cannon",
      "range": "24\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Shuriken"
    },
    {
      "name": "Shuriken catapult",
      "range": "18\"",
      "type": "Assault 2",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Shuriken"
    },
    {
      "name": "Starcannon",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "6",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(1)"
    },
    {
      "name": "Wraithbone fists",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "May swap both Shuriken catapults",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "2 Aeldari flamers",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can be equipped with Ghostglaive for +11 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 11,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can be equipped with two of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Scatter laser",
          "points": 19
        },
        {
          "name": "Shuriken cannon",
          "points": 20
        },
        {
          "name": "Aeldari missile launcher",
          "points": 41
        },
        {
          "name": "Starcannon",
          "points": 49
        },
        {
          "name": "Bright lance",
          "points": 56
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Squadron, Terrifying(-1)",
    "Holo-suit: The model gains a 4+ invulnerability save.",
    "Wraithbone: Reduces AP of enemy attacks by -1 (to a minimum of 0)."
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
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
  "min_cost": 260
};
