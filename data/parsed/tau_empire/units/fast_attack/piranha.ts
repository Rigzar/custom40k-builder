/**
 * PIRANHA — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const piranha: Unit = {
  "name": "Piranha",
  "models": [
    {
      "name": "Piranha",
      "points": 131,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "4+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "10",
        "I": "2",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Piranha is a single model and equipped with: 2 Twin pulse carbines.",
  "weapons": [
    {
      "name": "Burst cannon",
      "range": "18\"",
      "type": "Rapid Fire 3",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Fusion blaster",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "Armorbane, AT(3)"
    },
    {
      "name": "Missile pod",
      "range": "30\"",
      "type": "Assault 3",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Anti-Air"
    },
    {
      "name": "Plasma rifle",
      "range": "24\"",
      "type": "Assault 2",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Rail rifle",
      "range": "30\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Seeker missile",
      "range": "120\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Ammo(1), Anti-Air, AT(2)"
    },
    {
      "name": "Twin pulse carbine",
      "range": "24\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
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
          "name": "Burst cannon",
          "points": 12
        },
        {
          "name": "Fusion blaster",
          "points": 26
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can replace both Twin pulse carbines",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "two Plasma rifles",
          "points": 4
        },
        {
          "name": "two Missile pods",
          "points": 18
        },
        {
          "name": "two Rail rifles",
          "points": 41
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Twin pulse carbine"]
    },
    {
      "header": "Can buy up to two Hunter-seeker missiles.",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        { "name": "Seeker missile", "points": 5 }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-Grav, Fast, Squadron, Supporting Fire"
  ],
  "unit_type": "Vehicle",
  "keywords": [],
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
  "slot": "Fast Attack",
  "default_size": 1,
  "min_cost": 131
};
