/**
 * GHOST ARK — Dedicated Transport
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const ghostArk: Unit = {
  "name": "Ghost Ark",
  "models": [
    {
      "name": "Ghost Ark",
      "points": 264,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "10",
        "I": "2",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Ghost Ark is a single model and equipped with: Two Gauss flayer arrays.",
  "weapons": [
    {
      "name": "Gauss flayer array",
      "range": "24\"",
      "type": "Rapid Fire 5",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Gauss"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Anti-Grav",
    "Living metal: The model repairs one vehicle damage at the start of each Reinforcement phase in any order.",
    "Quantum shielding: The model increases its armor values by +2 on each side, up to a maximum of 14. If it suffers a penetrating hit, it loses this bonus until the next Reinforcement phase.",
    "Repair Barge: During the Reinforcement Phase, you may target up to three units that are either within 3\" of it or are on board as passengers. Each unit automatically succeeds at 1 Reanimation Protocol roll. The same unit can be targeted multiple times.",
    "Transport: This model has a transport capacity of 10 models."
  ],
  "unit_type": "Vehicle",
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
  "locked_mark": null,
  "advisor": false,
  "slot": "Dedicated Transport",
  "default_size": 1,
  "min_cost": 264
};
