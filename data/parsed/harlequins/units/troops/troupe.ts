/**
 * TROUPE — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const troupe: Unit = {
  "name": "Troupe",
  "models": [
    {
      "name": "Player",
      "points": 23,
      "min": 4,
      "max": 12,
      "stats": {
        "M": "8\"",
        "WS": "2+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "5",
        "A": "2",
        "LD": "8",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Lead Player",
      "points": 46,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "8\"",
        "WS": "2+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "5",
        "A": "3",
        "LD": "9",
        "SV": "6+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Harlequin weapons; Plasma grenade; Shuriken pistol.",
  "weapons": [
    {
      "name": "Fusion pistol",
      "range": "6\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Harlequin weapons",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-4",
      "d": "1",
      "abilities": "Precision(5+)"
    },
    {
      "name": "Neuro disruptor",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "*",
      "ap": "*",
      "d": "*",
      "abilities": "Neuro disruptor"
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
      "header": "Any model may replace its Shuriken pistol",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Fusion pistol",
          "points": 6
        },
        {
          "name": "Neuro disruptor",
          "points": 8
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One model may be upgraded to a Lead Player for +23 points and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 23,
      "variant_link": "Lead Player",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-grav, Deflect, Parry, Terrifying(-1)",
    "Holo-suit: The model gains a 4+ invulnerability save.",
    "Neuro disruptor: Roll 3D6 after a successful hit and compare it with the Leadership value of the unit. If your roll is higher, the target suffers one Mortal Wound."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Troops",
  "default_size": 5,
  "min_cost": 92
};
