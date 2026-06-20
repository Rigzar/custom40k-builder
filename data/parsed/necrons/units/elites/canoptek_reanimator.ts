/**
 * CANOPTEK REANIMATOR — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const canoptekReanimator: Unit = {
  "name": "Canoptek Reanimator",
  "models": [
    {
      "name": "Reanimator",
      "points": 166,
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
  "equipped_with": "A Reanimator is a single model and equipped with: Atomiser beam; Reanimator claws.",
  "weapons": [
    {
      "name": "Atomiser beam",
      "range": "12\"",
      "type": "Assault 3",
      "s": "6",
      "ap": "-4",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Reanimator claws",
      "range": "-",
      "type": "Melee",
      "s": "T",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Squadron",
    "Containment field: The model has a 5+ invulnerability save.",
    "Living metal: The model repairs one vehicle damage at the start of each Reinforcement phase in any order.",
    "Nanoscarab reanimator beam: Instead of using the Atomiser beam, you may target a friendly <Necron> unit within 12\". The target immediately succeeds at 2 Reanimation Protocol rolls."
  ],
  "unit_type": "Walker, Canoptek",
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
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 166
};
