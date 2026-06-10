/**
 * FLESH HOUNDS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const fleshHounds: Unit = {
  "name": "Flesh Hounds",
  "models": [
    {
      "name": "Flesh Hound",
      "points": 25,
      "min": 4,
      "max": 23,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "4",
        "W": "2",
        "I": "4",
        "A": "3",
        "LD": "8",
        "SV": "6+"
      }
    },
    {
      "name": "Gore Hound",
      "points": 34,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "4",
        "W": "2",
        "I": "4",
        "A": "3",
        "LD": "8",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Gore-drenched fangs. The Gore Hound is additionally equipped with: Burning roar.",
  "weapons": [
    {
      "name": "Burning roar",
      "range": "12\"",
      "type": "Pistol 4",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames, Suppression"
    },
    {
      "name": "Gore-drenched fangs",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Deadly(5+)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Deepstrike, Daemon, Daemonic instability, Mark of Khorne, Move through cover, Terrifying(-1)",
    "Collar of Khorne: The unit can dispel 1 psychic power per battle round."
  ],
  "unit_type": "Bike",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": "Khorne",
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 5,
  "min_cost": 134
};
