/**
 * TALOS — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const talos: Unit = {
  "name": "Talos",
  "models": [
    {
      "name": "Talos",
      "points": 146,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "6",
        "W": "5",
        "I": "4",
        "A": "2",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Talos is equipped with: 2 Macro-scalpels; Twin splinter rifle.",
  "weapons": [
    {
      "name": "Macro-scalpel",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1), Flurry(2)"
    },
    {
      "name": "Talos gauntlet",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Flurry(1)"
    },
    {
      "name": "Talos ichor injector",
      "range": "-",
      "type": "Melee",
      "s": "*",
      "ap": "-",
      "d": "-",
      "abilities": "-"
    },
    {
      "name": "Twin haywire blaster",
      "range": "24\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(2), Haywire"
    },
    {
      "name": "Twin heat lance",
      "range": "18\"",
      "type": "Assault 2",
      "s": "6",
      "ap": "-5",
      "d": "1",
      "abilities": "Lance(+2), Melta"
    },
    {
      "name": "Twin liquifier gun",
      "range": "9\"",
      "type": "Assault 8",
      "s": "4",
      "ap": "-3",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Twin splinter rifle",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "2",
      "ap": "0",
      "d": "1",
      "abilities": "Poison(3+)"
    },
    {
      "name": "Twin stinger pod",
      "range": "24\"",
      "type": "Assault 2",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace one Macro-scalpel",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Talos ichor injector",
          "points": 0
        },
        {
          "name": "Twin liquifier gun",
          "points": 26
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can replace one Macro-scalpel",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Talos gauntlet",
          "points": 7
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can replace its Twin splinter rifle",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin haywire blaster",
          "points": 10
        },
        {
          "name": "Twin heat lance",
          "points": 17
        },
        {
          "name": "Twin stinger pod",
          "points": 27
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-Grav, Power through Pain, Squadron",
    "Talos ichor injector: For each successful hit roll with this weapon, the target must pass a Toughness test. If the test fails, the model suffers a Mortal Wound."
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [
    "Coven"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 146
};
