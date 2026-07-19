/**
 * SEEKER CHARIOT — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const seekerChariot: Unit = {
  "name": "Seeker Chariot",
  "models": [
    {
      "name": "Seeker Chariot",
      "points": 54,
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
        "A": "4",
        "LD": "6",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Lashes of torment; Piercing claws.",
  "weapons": [
    {
      "name": "Lashes of torment",
      "range": "6\"",
      "type": "Pistol 6",
      "s": "+1",
      "ap": "-1",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Piercing claws",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "Armor piercing(5+), Flurry(4)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Deepstrike, Daemon, Daemonic instability, Mark of Slaanesh, Squadron, Terrifying(-1)"
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
  "min_cost": 54
};
