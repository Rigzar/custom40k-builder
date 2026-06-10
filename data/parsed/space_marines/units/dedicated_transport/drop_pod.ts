/**
 * DROP POD — Dedicated Transport
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const dropPod: Unit = {
  "name": "Drop Pod",
  "models": [
    {
      "name": "Drop Pod",
      "points": 97,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "-",
        "WS": "-",
        "BS": "4+",
        "S": "5",
        "FRONT": "10",
        "SIDE": "10",
        "REAR": "10",
        "I": "-",
        "A": "-",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Drop Pod is a single model and equipped with: -.",
  "weapons": [
    {
      "name": "Deathwind missile launcher",
      "range": "18\"",
      "type": "Heavy 2",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Anti-air, Suppression"
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
      "header": "Can be equipped with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Storm bolter",
          "points": 8
        },
        {
          "name": "Deathwind missile launcher",
          "points": 22
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Deep Strike",
    "Control Jets: The unit must land at least 6\" away from other units (friendly or enemy) and can never stray closer than 1\" to another unit, terrain, or the edge of the field. Reduce the deviation only enough to place the model.",
    "Drop Pod Assault: Drop Pods always start the game as reserves and are always set up via Deep Strike. Even if the played mission does not allow reinforcements and/or Deep Strike!",
    "Transport: This model has a transport capacity of 10 infantry models or 1 Dreadnought.",
    "Unmanned: A Drop Pod cannot contest or hold mission objectives."
  ],
  "unit_type": "Vehicle",
  "keywords": [],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Dedicated Transport",
  "default_size": 1,
  "min_cost": 97
};
