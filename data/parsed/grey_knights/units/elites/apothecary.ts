/**
 * APOTHECARY — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The model can cast 1 power and deny 1 power per battle round. He knows Smite and 1 power from a chosen discipline."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const apothecary: Unit = {
  "name": "Apothecary",
  "models": [
    {
      "name": "Apothecary",
      "points": 116,
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
  "equipped_with": "An Apothecary is equipped with: Nemesis force weapon; Storm bolter; Frag grenade; Krak grenade.",
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
      "header": "Can replace the Storm bolter",
      "constraint": {
        "type": "one"
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
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Aegis(5+), Brotherhood of Psykers, Command squad, Deep Strike, Massive(1), Shrouding, They Shall Know No Fear, True Grit, Unyielding",
    "Advisor: For each HQ selection, one Apothecary may be selected that does not occupy an Elite slot.",
    "Narthecium: Twice per turn, the damage of a wound against the model or attached unit can be reduced by 1. The ability must be declared after armor and invulnerability saves. Does not work against weapons with a strength of 8 or above.",
    "Psyker: The model can cast 1 power and deny 1 power per battle round. He knows Smite and 1 power from a chosen discipline.",
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
  "advisor": true,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 116
};
