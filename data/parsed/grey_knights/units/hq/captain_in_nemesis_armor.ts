/**
 * CAPTAIN IN NEMESIS ARMOR — HQ
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

export const captainInNemesisArmor: Unit = {
  "name": "Captain in Nemesis Armor",
  "models": [
    {
      "name": "Captain",
      "points": 287,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "6",
        "T": "6",
        "W": "6",
        "I": "5",
        "A": "6",
        "LD": "9",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Captain in Nemesis Armor is equipped with: 2 Dreadfists.",
  "weapons": [
    {
      "name": "Dreadfist",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1), Shield breaker(-1)"
    },
    {
      "name": "Gatling psilencer",
      "range": "24\"",
      "type": "Rapid Fire 6",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Shield breaker(-1), Suppression"
    },
    {
      "name": "Heavy incinerator",
      "range": "12\"",
      "type": "Assault 4",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames, Shield breaker(-1)"
    },
    {
      "name": "Heavy psycannon",
      "range": "24\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Armor piercing(5+), AT(2), Shield breaker(-1)"
    },
    {
      "name": "Nemesis greatweapon",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Shield breaker(-1)"
    }
  ],
  "option_groups": [
    {
      "header": "Can swap one Dreadfist",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Nemesis greatweapon",
          "points": 3
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Dreadfist"]
    },
    {
      "header": "Can be equipped with two of the following",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Heavy incinerator",
          "points": 13
        },
        {
          "name": "Gatling psilencer",
          "points": 50
        },
        {
          "name": "Heavy psycannon",
          "points": 78
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can be equipped with a Teleporter for +54 points to get the \"Jump pack\" and \"Shunt\" abilities and +6\" movement.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 54,
      "variant_link": null,
      "is_unique_per_army": false,
      "effect": {
        "adds_unit_types": [
          "Jump Pack Infantry"
        ],
        "grants_abilities": [
          "Deep Strike"
        ],
        "stat_mod": [
          {
            "stat": "M",
            "delta": 6
          }
        ]
      }
    },
    {
      "header": "Only one Captain or Captain in Nemesis Armor per army.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Aegis(5+), Shrouding, They Shall Know No Fear",
    "Combat tactics: The Captain can assign two free Veteran abilities to himself and a friendly unit at the start of deployment. Both units must be able to acquire the Veteran ability. It does not count against the limit of how many Veteran abilities a unit can have.",
    "Dreadknight force field: The model gains a 4+ invulnerability save.",
    "Psyker: The model can cast 1 power and deny 1 power per battle round. He knows Smite and 1 power from a chosen discipline.",
    "Shunt: Once per game, the unit may move up to 24\" with an Advance order."
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
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
  "min_cost": 287
};
