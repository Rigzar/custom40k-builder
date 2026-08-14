/**
 * GREATER BLIGHT DRONE — Fast Attack
 *
 * SOURCE: Chaos Space Marines 1.03, "Greater Blight Drone". Listed in the Index under Fast Attack.
 *
 *   1-2  Greater Blight Drone  12"  3+ 3+ 6  F12 S11 R10  I4 A1 HP3   231 pts
 *   Equipped with: Bile maw, Blightreaper cannon, Plague probe.
 *   OPTIONS  • Can replace the Bile maw: - Maw cannon, +92 points
 *            • Has access to vehicle equipment from the Armory.
 *   ABILITIES  Anti-Grav, Fast, Mark of Nurgle, Squadron
 *              Pest explosion: If the Greater Blight Drone is destroyed, it always explodes.
 *              The explosion range is 6".
 *   UNIT TYPE  Vehicle      KEYWORDS  Death Guard
 *
 * Modelled on the Foetid Bloat-Drone, the other Death Guard drone: locked to the Mark of Nurgle
 * and carrying the Death Guard / Vehicle keywords. `has_armory_access` is true for the vehicle
 * equipment its sheet grants — a non-character vehicle sees only that section.
 */

import type { Unit } from '../../../../../src/types/data';

export const greaterBlightDrone: Unit = {
  "name": "Greater Blight Drone",
  "models": [
    {
      "name": "Greater Blight Drone",
      "points": 231,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "11",
        "REAR": "10",
        "I": "4",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Greater Blight Drone is equipped with: Bile maw, Blightreaper cannon, Plague probe.",
  "weapons": [
    {
      "name": "Bile maw",
      "range": "12\"",
      "type": "Pistol 3",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Poison(4+)"
    },
    {
      "name": "Blightreaper cannon",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Poison(4+)"
    },
    {
      "name": "Plague probe",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Poison(4+)"
    },
    {
      "name": "Maw cannon - Vomit",
      "range": "9\"",
      "type": "Assault 6",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames, Poison(4+)"
    },
    {
      "name": "Maw cannon - Phlegm",
      "range": "36\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Explosive, Poison(4+)"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace the Bile maw",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Maw cannon",
          "points": 92
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Bile maw"]
    }
  ],
  "abilities": [
    "Anti-Grav, Fast, Mark of Nurgle, Squadron",
    "Pest explosion: If the Greater Blight Drone is destroyed, it always explodes. The explosion range is 6\"."
  ],
  "unit_type": "Vehicle",
  "keywords": [
    "Death Guard",
    "Vehicle"
  ],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": "Nurgle",
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 1,
  "min_cost": 231
};
