/**
 * RAZORBACK RIKARIUS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const razorbackRikarius: Unit = {
  "name": "Razorback Rikarius",
  "models": [
    {
      "name": "Razorback Rikarius",
      "points": 222,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "6+",
        "BS": "3+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "10",
        "I": "4",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Razorback Rikarius is equipped with: 2 Hurricane Boltguns; Twin assault cannon.",
  "weapons": [
    {
      "name": "Twin assault cannon",
      "range": "24\"",
      "type": "Heavy 8",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Hurricane Boltgun",
      "range": "24\"",
      "type": "Rapid Fire 6",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Siege shield: The model automatically passes tests for difficult terrain and is not slowed down by it. Additionally, attacks from the front always treat the model as being in cover."
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
  "slot": "Fast Attack",
  "default_size": 1,
  "min_cost": 222
};
