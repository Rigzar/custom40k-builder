/**
 * PLAGUE DRONES — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const plagueDrones: Unit = {
  "name": "Plague Drones",
  "models": [
    {
      "name": "Plague Drone",
      "points": 51,
      "min": 2,
      "max": 8,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "4+",
        "S": "4",
        "T": "6",
        "W": "3",
        "I": "2",
        "A": "3",
        "LD": "7",
        "SV": "6+"
      }
    },
    {
      "name": "Plaguebringer",
      "points": 51,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "4+",
        "S": "4",
        "T": "6",
        "W": "3",
        "I": "2",
        "A": "3",
        "LD": "7",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Death's heads; Rot Fly's prehensile proboscis.",
  "weapons": [
    {
      "name": "Death’s heads",
      "range": "12\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Poison(4+)"
    },
    {
      "name": "Rot Fly’s prehensile proboscis",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "2",
      "abilities": "Poison(4+)"
    }
  ],
  "option_groups": [
    {
      "header": "One model may be equipped with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Icon of Chaos",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Another model may be equipped with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Instrument of Chaos",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Deepstrike, Daemon, Daemonic instability, Mark of Nurgle, Terrifying(-1)",
    "Icon of Chaos: A friendly Daemon unit arriving within 3\" of the bearer via Deep strike does not scatter. If the arriving unit has the same Mark of Chaos as the bearer, it can instead be placed within 6\". The icon must be present on the table at the beginning of the battle round in order to be used.",
    "Instrument of Chaos: The unit gains a bonus of +1 to Combat resolutions."
  ],
  "unit_type": "Jump Pack Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": "Nurgle",
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 3,
  "min_cost": 153
};
