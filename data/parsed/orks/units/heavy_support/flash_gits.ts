/**
 * FLASH GITS — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const flashGits: Unit = {
  "name": "Flash Gits",
  "models": [
    {
      "name": "Flash Git",
      "points": 62,
      "min": 4,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "6",
        "SV": "4+"
      }
    },
    {
      "name": "Nob",
      "points": 67,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "5",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "3",
        "LD": "6",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Snazzgun; Stikkbombz.",
  "weapons": [
    {
      "name": "Stikkbombz",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Snazzgun - Dakka",
      "range": "24\"",
      "type": "Assault 3",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Snazzgun - More Zzzap!",
      "range": "24\"",
      "type": "Assault 3",
      "s": "7",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(1), Overheating"
    }
  ],
  "option_groups": [
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
    "Dakka Dakka Dakka, Furious charge, Mob, Waaagh!"
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 5,
  "min_cost": 315
};
