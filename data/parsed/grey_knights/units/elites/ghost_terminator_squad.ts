/**
 * GHOST TERMINATOR SQUAD — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const ghostTerminatorSquad: Unit = {
  "name": "Ghost Terminator Squad",
  "models": [
    {
      "name": "Terminator",
      "points": 75,
      "min": 5,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "3",
        "LD": "8",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Nemesis force weapon; Storm bolter; Frag grenade; Krak grenade.",
  "weapons": [
    {
      "name": "Frag grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Krak grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Incinerator",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames, Shield breaker(-1)"
    },
    {
      "name": "Nemesis daemon hammer",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(3), Force weapon, Shield breaker(-1), Slow(-3)"
    },
    {
      "name": "Nemesis force weapon",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
      "d": "1",
      "abilities": "Force weapon, Shield breaker(-1)"
    },
    {
      "name": "Nemesis warding stave",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-1",
      "d": "1",
      "abilities": "AT(1), Force weapon, Shield breaker(-1)"
    },
    {
      "name": "Psilencer",
      "range": "24\"",
      "type": "Rapid Fire 3",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Shield breaker(-1), Suppression"
    },
    {
      "name": "Psycannon",
      "range": "24\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+), AT(1), Shield breaker(-1)"
    },
    {
      "name": "Storm bolter",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "An army may only contain a single Ghost Terminator Squad.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Any model can replace their Nemesis force weapon",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Nemesis warding stave",
          "points": 9
        },
        {
          "name": "Nemesis daemon hammer",
          "points": 19
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Nemesis force weapon"]
    },
    {
      "header": "For every 5 models, two Terminators may swap their Storm bolters",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Incinerator",
          "points": 6
        },
        {
          "name": "Psilencer",
          "points": 7
        },
        {
          "name": "Psycannon",
          "points": 24
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Each model may be equipped with Psy-ammunition for +1 point per model.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 1,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Aegis(5+), Deep Strike, Massive(1), Stealth, They Shall Know No Fear, True Grit, Unyielding",
    "Incorporeal: The unit ignores terrain and units when moving. Additionally, the unit must land at least 6\" away from other units (friendly or enemy) when using Deep Strike and can never stray closer than 1\" to another unit, terrain, or the edge of the field. Reduce the deviation only enough to place the model.",
    "Terminator armor: The model gains a 5+ invulnerability save."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "armourKeyword": "Terminator",
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
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 375
};
