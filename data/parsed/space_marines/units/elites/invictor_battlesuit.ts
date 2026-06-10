/**
 * INVICTOR BATTLESUIT — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const invictorBattlesuit: Unit = {
  "name": "Invictor Battlesuit",
  "models": [
    {
      "name": "Invictor Battlesuit",
      "points": 184,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "T": "7",
        "W": "5",
        "I": "4",
        "A": "4",
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Invictor Battlesuit is equipped with: Fragstorm grenade launcher; Heavy bolter; Incendium cannon; Invictor-Faust;  Twin ironhail heavy stubber.",
  "weapons": [
    {
      "name": "Fragstorm grenade launcher",
      "range": "18\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
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
      "name": "Incendium cannon",
      "range": "12\"",
      "type": "Assault 4",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Invictor-Faust",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Twin ironhail autocannon",
      "range": "48\"",
      "type": "Heavy 6",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Twin ironhail heavy stubber",
      "range": "36\"",
      "type": "Heavy 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace the Incendium cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin ironhail autocannon",
          "points": 40
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "They Shall Know No Fear, Infiltrator, Squadron"
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
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 184
};
