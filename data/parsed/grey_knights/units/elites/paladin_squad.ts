/**
 * PALADIN SQUAD — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The unit can cast 1 power and deny 1 power per battle round. It knows Smite and 1 power from a chosen discipline."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const paladinSquad: Unit = {
  "name": "Paladin Squad",
  "models": [
    {
      "name": "Paladin",
      "points": 107,
      "min": 4,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "3",
        "I": "4",
        "A": "3",
        "LD": "9",
        "SV": "2+"
      }
    },
    {
      "name": "Paragon",
      "points": 117,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "3",
        "I": "4",
        "A": "3",
        "LD": "9",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Nemesis force weapon; Storm bolter; Frag grenade; Krak grenade.",
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
      "name": "Incinerator",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames, Shield breaker(-1)"
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
      "abilities": "AT(1), Force weapon, Shield breaker(-1)"
    },
    {
      "name": "Psilencer",
      "range": "24\"",
      "type": "Rapid Fire 3",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Shield breaker(-1), Suppression"
    },
    {
      "name": "Psycannon",
      "range": "24\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+), AT(1), Shield breaker(-1)"
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
      "header": "Only one Paladin squad per army.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": true
    },
    {
      "header": "Any model can replace their Nemesis falchions",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Nemesis warding stave",
          "points": 11
        },
        {
          "name": "Nemesis daemon hammer",
          "points": 23
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Nemesis force weapon"]
    },
    {
      "header": "For every 5 models, two Paladins may swap their Storm bolter",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Incinerator",
          "points": 6
        },
        {
          "name": "Psilencer",
          "points": 7
        },
        {
          "name": "Psycannon",
          "points": 24
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Storm bolter"]
    },
    {
      "header": "Each model may be equipped with Psy-ammunition for +1 point per model.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 1,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Aegis(5+), Brotherhood of Psykers, Combat squads, Deep Strike, Massive(1), Shrouding, They Shall Know No Fear, True Grit, Unyielding",
    "Chapter Elite: During each Rally phase, all psychic powers of the unit can be exchanged with other psychic powers from the same discipline.",
    "Psyker: The unit can cast 1 power and deny 1 power per battle round. It knows Smite and 1 power from a chosen discipline.",
    "Terminator armor: The model gains a 5+ invulnerability save."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "armourKeyword": "Terminator",
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": true,
  "has_armory_access": true,
  "champion_has_armory": true,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 545
};
