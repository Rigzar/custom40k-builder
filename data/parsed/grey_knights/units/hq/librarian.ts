/**
 * LIBRARIAN — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The model can cast 1 power and deny 1 power per battle round. He knows Smite and all powers from a chosen discipline."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const librarian: Unit = {
  "name": "Librarian",
  "models": [
    {
      "name": "Librarian",
      "points": 159,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "4",
        "I": "5",
        "A": "3",
        "LD": "8",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Chief Librarian",
      "points": 174,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "4",
        "I": "5",
        "A": "4",
        "LD": "9",
        "SV": "2+"
      }
    }
  ],
  "equipped_with": "A Librarian is equipped with: Nemesis force weapon; Storm bolter; Frag grenade; Krak grenade.",
  "weapons": [
    {
      "name": "Frag grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Krak grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Nemesis daemon hammer",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(3), Force weapon, Shield breaker(-1), Slow(-3)"
    },
    {
      "name": "Nemesis force weapon",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
      "d": "1",
      "abilities": "Force weapon, Shield breaker(-1)"
    },
    {
      "name": "Nemesis warding stave",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-1",
      "d": "1",
      "abilities": "Force weapon, Shield breaker(-1)"
    },
    {
      "name": "Storm bolter",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace the Nemesis force weapon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Nemesis warding stave",
          "points": 9
        },
        {
          "name": "Nemesis daemon hammer",
          "points": 19
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One Librarian per army can be upgraded to a Chief Librarian for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Chief Librarian",
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Aegis(5+), Brotherhood of Psykers, Deep Strike, Shrouding, They Shall Know No Fear, True Grit, Massive(1), Unyielding",
    "Chief Librarian: The model can manifest and deny 1 additional power per turn.",
    "Psychic hood: The models gains a +1 bonus to deny psychic powers.",
    "Psyker: The model can cast 1 power and deny 1 power per battle round. He knows Smite and all powers from a chosen discipline.",
    "Terminator armor: The model gains a 5+ invulnerability save."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "armourKeyword": "Terminator",
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": true,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 159
};
