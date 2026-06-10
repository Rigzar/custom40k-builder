/**
 * AGGRESSOR SQUAD — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const aggressorSquad: Unit = {
  "name": "Aggressor Squad",
  "models": [
    {
      "name": "Aggressor Marine",
      "points": 55,
      "min": 2,
      "max": 5,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    },
    {
      "name": "Aggressor Sergeant",
      "points": 60,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Flamestorm gauntlet; Gravis armor.",
  "armourKeyword": "Gravis",
  "weapons": [
    {
      "name": "Fragstorm grenade launcher",
      "range": "18\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive, Extra attack"
    },
    {
      "name": "Auto boltstorm gauntlet (Melee)",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Slow(-1)"
    },
    {
      "name": "Auto boltstorm gauntlet (Ranged)",
      "range": "18\"",
      "type": "Pistol 4",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Flamestorm gauntlet (Melee)",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Slow(-1)"
    },
    {
      "name": "Flamestorm gauntlet (Ranged)",
      "range": "12\"",
      "type": "Pistol 6",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
    }
  ],
  "option_groups": [
    {
      "header": "All models in the unit may swap their Flamestorm gauntlets",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Auto boltstorm gauntlets and Fragstorm grenade launchers",
          "points": 12
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Combat squads,Massive(1), They Shall Know No Fear, Unyielding",
    "Gravis armor: The model gains a 6+ invulnerability save."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 3,
  "min_cost": 170
};
