/**
 * AQUILON CUSTODIANS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const aquilonCustodians: Unit = {
  "name": "Aquilon Custodians",
  "models": [
    {
      "name": "Aquilon Custodian",
      "points": 143,
      "min": 3,
      "max": 6,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "5",
        "T": "6",
        "W": "3",
        "I": "4",
        "A": "4",
        "LD": "9",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "All models are equipped with: Infernus firepike; Solerite power gauntlet.",
  "weapons": [
    {
      "name": "Infernus firepike",
      "range": "12\"",
      "type": "Assault 6",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Lastrum storm bolter",
      "range": "24\"",
      "type": "Rapid Fire 4",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Solerite power gauntlet",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Slow(-1)"
    },
    {
      "name": "Solerite power talon",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3),Slow(-2), Armorbane"
    },
    {
      "name": "Twin adrathic destructor",
      "range": "18\"",
      "type": "Pistol 2",
      "s": "5",
      "ap": "-3",
      "d": "2",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Every model may swap their Infernus firepike",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Lastrum storm bolter",
          "points": 19
        },
        {
          "name": "Twin adrathic destructor",
          "points": 22
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Infernus firepike"]
    },
    {
      "header": "Every model may swap their Solerite power gauntlet",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Solerite power talon",
          "points": 11
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Solerite power gauntlet"]
    }
  ],
  "abilities": [
    "Deep strike, Massive(1), Shield Host, Unyielding",
    "Custodian terminator armor: The model gains a 4+ invulnerability save."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 3,
  "min_cost": 429
};
