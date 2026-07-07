/**
 * SOUL GRINDER — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const soulGrinder: Unit = {
  "name": "Soul Grinder",
  "models": [
    {
      "name": "Soul Grinder",
      "points": 385,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "FRONT": "13",
        "SIDE": "13",
        "REAR": "11",
        "I": "4",
        "A": "3",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Soul Grinder is equipped with: Harvester gun; Iron claw; Maw cannon; Warpsword.",
  "weapons": [
    {
      "name": "Harvester gun",
      "range": "36\"",
      "type": "Heavy 6",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Suppression"
    },
    {
      "name": "Iron claw",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Warpsword",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Flurry(3)"
    },
    {
      "name": "Maw cannon - Vomit",
      "range": "9\"",
      "type": "Assault 6",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Maw cannon - Tongue",
      "range": "24\"",
      "type": "Assault 1",
      "s": "10",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Maw cannon - Phlegm",
      "range": "36\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "Can take a Mark of Chaos",
      "constraint": {
        "type": "mark"
      },
      "choices": [
        {
          "name": "Khorne",
          "points": 10
        },
        {
          "name": "Slaanesh",
          "points": 10
        },
        {
          "name": "Tzeentch",
          "points": 10
        },
        {
          "name": "Nurgle",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Deep strike, Daemon, Terrifying(-1)"
  ],
  "unit_type": "Walker",
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 385
};
