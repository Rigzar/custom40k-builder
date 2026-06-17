/**
 * STARWEAVER — Dedicated Transport
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const starweaver: Unit = {
  "name": "Starweaver",
  "models": [
    {
      "name": "Starweaver",
      "points": 226,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "14\"",
        "WS": "-",
        "BS": "3+",
        "S": "5",
        "FRONT": "10",
        "SIDE": "10",
        "REAR": "10",
        "I": "5",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Starweaver is equipped with: 2 Shuriken cannons.",
  "weapons": [
    {
      "name": "Shuriken cannon",
      "range": "24\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Shuriken"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Anti-Grav, Fast, Open",
    "Holo-suit: The model gains a 4+ invulnerability save.",
    "Mirage launcher: Instead of shooting a weapon, the unit may gain the benefit of cover.",
    "Transport: This model has a transport capacity of 6 infantry models."
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
  "min_cost": 226
};
