/**
 * STORM GUARDIANS — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const stormGuardians: Unit = {
  "name": "Storm Guardians",
  "models": [
    {
      "name": "Storm Guardian",
      "points": 13,
      "min": 5,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "5",
        "A": "1",
        "LD": "7",
        "SV": "4+"
      }
    },
    {
      "name": "Serpent scale platform",
      "points": 16,
      "min": 0,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "5",
        "A": "1",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every Storm Guardian is equipped with: Aeldari chainsword; Plasma grenade; Shuriken pistol.",
  "weapons": [
    {
      "name": "Aeldari chainsword",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Aeldari flamer",
      "range": "12\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Fusion gun",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Plasma grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Power sword",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Shuriken pistol",
      "range": "12\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Shuriken"
    }
  ],
  "option_groups": [
    {
      "header": "The unit may contain 1 Serpent shield platform for every 5 Storm Guardians.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "For every 5 Guardians, 2 models can swap their Aeldari chainsword and Shuriken pistol",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Aeldari flamer",
          "points": 2
        },
        {
          "name": "Fusion gun",
          "points": 13
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "All remaining Guardians can swap their Aeldari chainsword",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Power sword",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Battle Focus",
    "Crewed platform: If the last Guardian Defender is removed, all remaining Serpent scale platforms are destroyed. They are ignored for all kinds of unit strength and moral purposes.",
    "Serpent shield: The model and its attached unit have a 5+ invulnerability save against ranged attacks. If the unit got 2 Serpent scale platforms, the invulnerability save is improved to 4+."
  ],
  "unit_type": "Infantry",
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
  "locked_mark": null,
  "advisor": false,
  "slot": "Troops",
  "default_size": 5,
  "min_cost": 65
};
