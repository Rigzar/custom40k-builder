/**
 * HELLFLAYER — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const hellflayer: Unit = {
  "name": "Hellflayer",
  "models": [
    {
      "name": "Hellflayer",
      "points": 55,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "14\"",
        "WS": "3+",
        "BS": "4+",
        "S": "3",
        "T": "4",
        "W": "4",
        "I": "5",
        "A": "3",
        "LD": "6",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Bladed axle; Piercing claws.",
  "weapons": [
    {
      "name": "Bladed axle",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
      "d": "1",
      "abilities": "Armor piercing(5+), Shred"
    },
    {
      "name": "Piercing claws",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "Armor piercing(5+), Flurry(6)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Deepstrike, Daemon, Daemonic instability, Mark of Slaanesh, Terrifying(-1), Squadron"
  ],
  "unit_type": "Bike",
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
  "locked_mark": "Slaanesh",
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 1,
  "min_cost": 55
};
