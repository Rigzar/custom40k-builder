/**
 * CANONESS IN PARAGON WARSUIT — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const canonessInParagonWarsuit: Unit = {
  "name": "Canoness in Paragon Warsuit",
  "models": [
    {
      "name": "Canoness",
      "points": 204,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "5",
        "T": "5",
        "W": "5",
        "I": "4",
        "A": "4",
        "LD": "9",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Canoness in Paragon Warsuit is equipped with: Heavy flamer; Frag grenades; Krak grenades; Paragon war blade; 2 Storm bolters.",
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
      "name": "Heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Heavy flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
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
      "name": "Multi-melta",
      "range": "24\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
    },
    {
      "name": "Paragon grenade launcher",
      "range": "24\"",
      "type": "Assault 2",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Paragon war blade",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "Flurry(2)"
    },
    {
      "name": "Paragon war lance",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "Armor piercing(5+), Quick(+1)"
    },
    {
      "name": "Paragon war mace",
      "range": "-",
      "type": "Melee",
      "s": "+4",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Slow(-2)"
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
      "header": "Only one Canoness or Canoness in Paragon Warsuit per army.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": true
    },
    {
      "header": "May swap both Storm bolters",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Paragon grenade launcher",
          "points": 11
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Storm bolter"]
    },
    {
      "header": "May swap the Heavy flamer",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Heavy bolter",
          "points": 14
        },
        {
          "name": "Multi-melta",
          "points": 37
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Heavy flamer"]
    },
    {
      "header": "May swap the Paragon war blade",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Paragon war lance",
          "points": 0
        },
        {
          "name": "Paragon war mace",
          "points": 3
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Paragon war blade"]
    }
  ],
  "abilities": [
    "Acts of Faith, Shield of Faith",
    "Emperor's Grace: Select two units during your Reinforcement phase with the Shield of Faith ability. The units gain the \"Warded\" ability until the end of the current battle round.",
    "Paragon bodyguard: The Canoness may join a unit of Paragon Warsuits.",
    "Pious: A Canoness increases the Faith Points by +2."
  ],
  "unit_type": "Monstrous Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "armory_as_character": true,
  "armory_gear_only": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 204
};
