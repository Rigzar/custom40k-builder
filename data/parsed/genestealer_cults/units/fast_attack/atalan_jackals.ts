/**
 * ATALAN JACKALS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const atalanJackals: Unit = {
  "name": "Atalan Jackals",
  "models": [
    {
      "name": "Atalan Jackal",
      "points": 27,
      "min": 4,
      "max": 8,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "1",
        "LD": "6",
        "SV": "4+"
      }
    },
    {
      "name": "Atalan Wolfquad",
      "points": 38,
      "min": 0,
      "max": 2,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "1",
        "LD": "6",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Atalan Leader",
      "points": 37,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "1",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Atalan small arms; Blasting charges.",
  "weapons": [
    {
      "name": "Atalan incinerator",
      "range": "12\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Atalan power weapon",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Atalan small arms",
      "range": "12\"",
      "type": "Pistol 2",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Blasting charges",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Demolition charge",
      "range": "6\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "Ammo(1), AT(2), Barrage, Munition(1), Seeking"
    },
    {
      "name": "Heavy stubber",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Mining laser",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(2), Explosive"
    },
    {
      "name": "Grenade launcher - Frag",
      "range": "24\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Grenade launcher - Krak",
      "range": "24\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Any model may be equipped with",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Atalan power weapon",
          "points": 3
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Any Atalan Jackal may be equipped with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Demolition charge",
          "points": 15
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One Atalan Jackal may swap their Atalan small arms",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Grenade launcher",
          "points": 4
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Any Atalan Wolfquad may swap their Heavy stubber with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Atalan incinerator",
          "points": 20
        },
        {
          "name": "Mining laser",
          "points": 27
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One model may be upgraded to an Atalan Leader for +10 points and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": "Atalan Leader",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Ambush, Infiltrator, Outflank, Use cover, Vanguard"
  ],
  "unit_type": "Bike",
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
  "slot": "Fast Attack",
  "default_size": 4,
  "min_cost": 108
};
