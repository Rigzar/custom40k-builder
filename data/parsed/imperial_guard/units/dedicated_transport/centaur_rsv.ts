/**
 * CENTAUR RSV — Dedicated Transport
 *
 * SOURCE: Imperial Guard 1.01.ods (July 2026 update — new unit).
 *   Centaur RSV | M 12" | BS 4+ | S 5 | FRONT 10 | SIDE 10 | REAR 10 | I 3 | A 1 | HP 2 | 105 pts
 *   Equipped with: Heavy stubber.
 *   Abilities: Open; Transport capacity 12 infantry models.
 *   Options: access to vehicle equipment from the Armory.
 */

import type { Unit } from '../../../../../src/types/data';

export const centaur_rsv: Unit = {
  "name": "Centaur RSV",
  "models": [
    {
      "name": "Centaur RSV",
      "points": 105,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "4+",
        "S": "5",
        "FRONT": "10",
        "SIDE": "10",
        "REAR": "10",
        "I": "3",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Centaur RSV is equipped with: Heavy stubber.",
  "weapons": [
    {
      "name": "Heavy stubber",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Open",
    "Transport: This model has a transport capacity of 12 infantry models."
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
  "min_cost": 105
};
