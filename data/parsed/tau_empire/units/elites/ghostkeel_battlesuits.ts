/**
 * GHOSTKEEL BATTLESUITS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const ghostkeelBattlesuits: Unit = {
  "name": "Ghostkeel Battlesuits",
  "models": [
    {
      "name": "Ghostkeel Shas'vre",
      "points": 197,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "4+",
        "S": "6",
        "T": "6",
        "W": "4",
        "I": "2",
        "A": "3",
        "LD": "8",
        "SV": "3+"
      }
    },
    {
      "name": "Stealth Drone",
      "points": 0,
      "min": 2,
      "max": 2,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "4",
        "A": "1",
        "LD": "6",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Ghostkeel Shas'vre is a single model and equipped with: Cyclic ion raker; Drone controller; 2 Flamers; 2 Stealth Drones.",
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
      "name": "Flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
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
      "name": "Fusion collider",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "3",
      "abilities": "Armorbane, AT(3), Explosive"
    },
    {
      "name": "Cyclic ion raker - Standard",
      "range": "24\"",
      "type": "Rapid Fire 4",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Cyclic ion raker - Overcharged",
      "range": "24\"",
      "type": "Rapid Fire 4",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(2), Overheating"
    }
  ],
  "option_groups": [
    {
      "header": "May swap its Cyclic ion raker",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Fusion collider",
          "points": 49
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Cyclic ion raker - Standard", "Cyclic ion raker - Overcharged"]
    },
    {
      "header": "May swap each flamer",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Burst cannon",
          "points": 5
        },
        {
          "name": "Fusion blaster",
          "points": 19
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "per_model": true,
      "replaces": ["Flamer"]
    },
    {
      "header": "Any Ghostkeel Shas'vre may pick up to two SUPPORT SYSTEMS from the armory.",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Infiltrator, Supporting Fire",
    "Drone protocols: Drones are ignored when determining the unit's most used Toughness and Defensive rules. They move as fast as the unit they are attached to. They are considered as being part of the model that controls them. Drones controlled by a Drone controller can not be removed as casualties.",
    "Shrouded: Stealth Drones confer the ability \"Stealth\" and \"Use cover\" to themselves and their attached units."
  ],
  "unit_type": "Jump Pack Infantry, Monstrous Creature",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 3,
  "min_cost": 197
};
