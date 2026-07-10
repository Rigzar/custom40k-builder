/**
 * VIGILATOR RSV — Dedicated Transport
 *
 * SOURCE: Imperial Guard 1.01.ods (July 2026 update — new unit).
 *   Vigilator RSV | M 12" | BS 4+ | S 5 | FRONT 11 | SIDE 10 | REAR 10 | I 3 | A 1 | HP 2 | 147 pts
 *   Equipped with: Chiron gatling cannon; 2 Heavy stubbers.
 *   Abilities: Open; Aquiline Prow (front AV 13 vs 11 on Tank Shock); Transport capacity 6.
 *   Options: 1 per Commissar or Commissar Lord (build restriction — noted, not hard-gated);
 *            access to vehicle equipment from the Armory.
 */

import type { Unit } from '../../../../../src/types/data';

export const vigilator_rsv: Unit = {
  "name": "Vigilator RSV",
  "models": [
    {
      "name": "Vigilator RSV",
      "points": 147,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "4+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "10",
        "REAR": "10",
        "I": "3",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Vigilator RSV is equipped with: Chiron gatling cannon; 2 Heavy stubbers.",
  "weapons": [
    {
      "name": "Chiron gatling cannon",
      "range": "24\"",
      "type": "Heavy 5",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
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
    "Aquiline Prow: When performing a Tank Shock the front AV is considered to be 13 instead of 11.",
    "Transport: This model has a transport capacity of 6 infantry models.",
    "You may select one Vigilator RSV per Commissar or Commissar Lord."
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
  "min_cost": 147
};
