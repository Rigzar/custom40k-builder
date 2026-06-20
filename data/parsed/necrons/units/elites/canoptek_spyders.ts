/**
 * CANOPTEK SPYDERS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const canoptekSpyders: Unit = {
  "name": "Canoptek Spyders",
  "models": [
    {
      "name": "Spyder",
      "points": 54,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "6",
        "T": "6",
        "W": "3",
        "I": "2",
        "A": "3",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Automaton claws.",
  "weapons": [
    {
      "name": "Automaton claws",
      "range": "-",
      "type": "Melee",
      "s": "T",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Particle beamer",
      "range": "24\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "Any number of models can each be equipped with",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Dark prison",
          "points": 5
        },
        {
          "name": "Fabricator claw array",
          "points": 5
        },
        {
          "name": "Particle beamer",
          "points": 27
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-Grav, Squadron",
    "Dark prison: The model can dispel 1 psychic power per battle round.",
    "Fabricator claw array: At the end of its movement, the model can attempt to repair a vehicle within 3\". On a 4+, an \"Immobilized\" or \"Weapon Destroyed\" result is removed from the vehicle, or 1 hull point is restored.",
    "Scarab hive: At the end of its movement, the model can repair up to 3 points of damage to a unit of Canoptek Scarabs within 3\". Slain models can be revived with this ability if at least a single Canoptek Scarab model from its unit is still alive."
  ],
  "unit_type": "Monstrous Creature, Canoptek",
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
  "min_cost": 54
};
