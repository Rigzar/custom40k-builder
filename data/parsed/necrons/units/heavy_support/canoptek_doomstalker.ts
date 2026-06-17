/**
 * CANOPTEK DOOMSTALKER — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const canoptekDoomstalker: Unit = {
  "name": "Canoptek Doomstalker",
  "models": [
    {
      "name": "Doomstalker",
      "points": 224,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "10",
        "I": "2",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Doomstalker is a single model and equipped with: Doomsday blaster; Twin gauss flayer.",
  "weapons": [
    {
      "name": "Doomsday blaster",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "8",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(2), Explosive"
    },
    {
      "name": "Twin gauss flayer",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Gauss"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Containment field: The model has a 5+ invulnerability save.",
    "Living metal: The model repairs one vehicle damage at the start of each Reinforcement phase in any order.",
    "Sentinel construct: If a friendly unit is charged within 12\", the Dominator Strider can also fire Overwatch."
  ],
  "unit_type": "Squadron, Walker, Canoptek",
  "keywords": [],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "is_squadron": true,
  "locked_mark": null,
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 224
};
