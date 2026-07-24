/**
 * MUTILATOR — Elites
 *
 * SOURCE: Chaos Space Marines 1.02.ods / "Mutilator" (added CSM 1.02, 2026-07-24).
 * Monstrous Infantry, 1-3, 115 pts. Fleshmetal weapons = equipped with ALL 5 melee profiles.
 * Marks: K/S/N +4, T +10 per model. Up to 2 veteran abilities. No Armory access.
 */

import type { Unit } from '../../../../../src/types/data';

export const mutilator: Unit = {
  "name": "Mutilator",
  "models": [
    {
      "name": "Mutilator",
      "points": 115,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "4",
        "A": "3",
        "LD": "8",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Mutilator is equipped with: An array of Fleshmetal weapons (Chainfist; Lightning claw; Power axe; Power maul; Power sword).",
  "weapons": [
    {
      "name": "Chainfist",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-4",
      "d": "3",
      "abilities": "Armorbane, AT(3), Slow(-3)"
    },
    {
      "name": "Lightning claw",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Shred"
    },
    {
      "name": "Power axe",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Power maul",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-1",
      "d": "1",
      "abilities": "Deadly(6+), Slow(-1)"
    },
    {
      "name": "Power sword",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "All models may receive a Mark of Chaos (points per model):",
      "constraint": {
        "type": "mark"
      },
      "choices": [
        { "name": "Khorne", "points": 4 },
        { "name": "Slaanesh", "points": 4 },
        { "name": "Nurgle", "points": 4 },
        { "name": "Tzeentch", "points": 10 }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Deepstrike, Daemon, Unyielding",
    "Fleshmetal weapons: The model is equipped with all melee weapons listed above, but may not use the same melee weapon in two consecutive battle rounds."
  ],
  "unit_type": "Monstrous Infantry",
  "keywords": [
    "Chaos Space Marine"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 2,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 115
};
