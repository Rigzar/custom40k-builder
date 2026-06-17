/**
 * TYRANNOCYTE — Dedicated Transport
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const tyrannocyte: Unit = {
  "name": "Tyrannocyte",
  "models": [
    {
      "name": "Tyrannocyte",
      "points": 144,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "5+",
        "BS": "5+",
        "S": "6",
        "T": "6",
        "W": "5",
        "I": "3",
        "A": "4",
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Tyrannocyte is equipped with: 5 Deathspitters.",
  "weapons": [
    {
      "name": "Barbed strangler",
      "range": "36\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Barrage, Suppression"
    },
    {
      "name": "Deathspitter",
      "range": "24\"",
      "type": "Assault 2",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Venom cannon",
      "range": "36\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "May replace all Deathspitters",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "5 Barbed stranglers",
          "points": 24
        },
        {
          "name": "5 Venom cannons",
          "points": 36
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May additionally select any number of Basic and Advanced Biomorphs (see Armory).",
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
    "Deep Strike, Mindless, Move Through Cover, Unyielding",
    "Tyrannocyte Winged: The unit must land at least 6\" away from other units (friendly or enemy) and can never stray closer than 1\" to another unit, terrain, or the edge of the field. Reduce the deviation only enough to place the model.",
    "Tyrannocyte Assault: Tyrannocytes always start the game as reserves and are always set up via Deep Strike. Even if the played mission does not allow reinforcements and/or Deep Strike!",
    "Transport: This model has a transport capacity of 20 Infantry models or 1 Monstrous Creature."
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [
    "Tyranid"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Dedicated Transport",
  "default_size": 1,
  "min_cost": 144,
  "is_monster": false
};
