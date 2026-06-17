/**
 * CANOPTEK SCARABS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const canoptekScarabs: Unit = {
  "name": "Canoptek Scarabs",
  "models": [
    {
      "name": "Scarab swarm",
      "points": 16,
      "min": 3,
      "max": 6,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "6+",
        "S": "3",
        "T": "3",
        "W": "3",
        "I": "2",
        "A": "3",
        "LD": "10",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Feeder mandibles.",
  "weapons": [
    {
      "name": "Feeder mandibles",
      "range": "-",
      "type": "Melee",
      "s": "T",
      "ap": "0",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    }
  ],
  "option_groups": [
    {
      "header": "The unit can take one upgrade",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Bloodswarm Scarabs",
          "points": 5
        },
        {
          "name": "Flensing Scarabs",
          "points": 5
        },
        {
          "name": "Frenzied Scarabs",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Mindless, Swarm, Use cover",
    "Explosion: Scarab swarms may explode at the end of their movement. For each base remaining, an enemy unit within 3\" suffers a hit with S: 5 AP: 0 D: 1; Explosive. All Scarab swarms in the unit are removed after the explosion.",
    "Bloodswarm Scarabs: Flayed Ones that deep strike within 6\" do not scatter.",
    "Flensing Scarabs: Melee attacks gain \"Poison(2+)\".",
    "Frenzied Scarabs: The model gains +1 Initiative."
  ],
  "unit_type": "Jet Bike, Canoptek",
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
  "locked_mark": null,
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 3,
  "min_cost": 48
};
