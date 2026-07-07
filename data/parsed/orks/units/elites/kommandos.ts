/**
 * KOMMANDOS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const kommandos: Unit = {
  "name": "Kommandos",
  "models": [
    {
      "name": "Kommando",
      "points": 12,
      "min": 5,
      "max": 15,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "5+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "3",
        "A": "2",
        "LD": "6",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Nob",
      "points": 28,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "5+",
        "S": "5",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "3",
        "LD": "6",
        "SV": "6+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Choppa; Slugga; Stikkbombz.",
  "weapons": [
    {
      "name": "Big shoota",
      "range": "36\"",
      "type": "Assault 3",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Bomb squig",
      "range": "18\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "3",
      "d": "2",
      "abilities": "AT(2), Ammo(1)"
    },
    {
      "name": "Burna - Melee",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "1",
      "abilities": "Unwieldy"
    },
    {
      "name": "Burna - Ranged",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Choppa",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Rokkit launcha",
      "range": "24\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-air"
    },
    {
      "name": "Slugga",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Stikkbombz",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "The entire squad may receive one of the following upgrades per model",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Wildork",
          "points": 2
        },
        {
          "name": "'Eavy armour",
          "points": 7
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "per_model": true
    },
    {
      "header": "The squad may receive a Distraction grot for +2 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 2,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The squad may receive a Bomb squig for +8 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 8,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Up to two Kommandos may swap their Choppa and Slugga",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Big shoota",
          "points": 8
        },
        {
          "name": "Burna",
          "points": 9
        },
        {
          "name": "Rokkit launcha",
          "points": 13
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Choppa", "Slugga"]
    },
    {
      "header": "One Kommando may be upgraded to a Nob for +16 points and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 16,
      "variant_link": "Nob",
      "is_unique_per_army": false
    },
    {
      "header": "Can get one Kustom job.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Dakka Dakka Dakka, Furious charge, Infiltrator, Mob, Move through cover, Use cover, Waaagh!",
    "Bomb squig: During activation, a Kommando can release a Bomb squig. Roll 1D6. On a 2+, the Bomb squig automatically hits the nearest enemy unit within 18\". On a 1, it automatically hits the nearest friendly unit within 18\". Vehicles are favored in both cases.",
    "Distraction grot: The unit can use a Distraction grot once per game:\n- During activation.\n- If it has not yet executed its command this turn and is targeted by an enemy unit.\nThe unit gains the \"Deflect\" trait."
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
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 60
};
