/**
 * SLAUGHTERBOUND — Elites
 *
 * SOURCE: Chaos Space Marines 1.02.ods / "Slaughterbound" (added CSM 1.02, 2026-07-24).
 * Infantry, 1, 148 pts. World Eaters, baked-in Mark of Khorne, Armory (weapons + gear).
 * NOTE: "Possessed Lord" grants a free Elite slot per Eightbound unit — documented in the
 * ability text; per-Eightbound free-slot exemption is not engine-enforced yet (advisor:false).
 */

import type { Unit } from '../../../../../src/types/data';

export const slaughterbound: Unit = {
  "name": "Slaughterbound",
  "models": [
    {
      "name": "Slaughterbound",
      "points": 148,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "6",
        "T": "5",
        "W": "5",
        "I": "4",
        "A": "4",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Slaughterbound is equipped with: Lacerator and daemonic claw.",
  "weapons": [
    {
      "name": "Lacerator and daemonic claw",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Deflagrate(5+), Shred, Unwieldy"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Blind Rage, Daemon, Deep Strike, Massive(1), Mark of Khorne",
    "Possessed Lord: For every \"Eightbound\" unit, you may select one Slaughterbound without using up an Elite slot.",
    "Lord of the Eightbound: If this model is attached to an \"Eightbound\" unit, that unit gains \"Bodyguard\". If this model is set up in reserves with an \"Eightbound\" unit, that unit gains \"Deep Strike\"."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [
    "World Eaters"
  ],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": "Khorne",
  "advisor": false,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 148
};
