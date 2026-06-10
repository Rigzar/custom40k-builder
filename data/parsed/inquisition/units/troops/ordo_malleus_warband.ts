/**
 * ORDO MALLEUS WARBAND — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: A Psyker can cast 1 psychic power and dispel 1 psychic power per round. A Psyker knows Smite, as well as one psychic power from a chosen psychic discipline."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const ordoMalleusWarband: Unit = {
  "name": "Ordo Malleus Warband",
  "models": [
    {
      "name": "Acolyte",
      "points": 6,
      "min": 0,
      "max": 12,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "6",
        "SV": "5+"
      }
    },
    {
      "name": "Daemonhost",
      "points": 15,
      "min": 0,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "6",
        "SV": "6+"
      }
    },
    {
      "name": "Exorcist",
      "points": 11,
      "min": 0,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "6",
        "SV": "5+"
      }
    },
    {
      "name": "Jokaero Weaponsmith",
      "points": 54,
      "min": 0,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "6+",
        "BS": "4+",
        "S": "2",
        "T": "2",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "6",
        "SV": "6+"
      }
    },
    {
      "name": "Mystic",
      "points": 10,
      "min": 0,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "6",
        "SV": "5+"
      }
    },
    {
      "name": "Psyker",
      "points": 10,
      "min": 0,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "5+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "6",
        "SV": "6+"
      }
    },
    {
      "name": "Servitor",
      "points": 8,
      "min": 0,
      "max": 3,
      "stats": {
        "M": "6\"",
        "WS": "5+",
        "BS": "5+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "5",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every Acolyte is equipped with: -",
  "weapons": [
    {
      "name": "Chainsword",
      "range": "-",
      "type": "Melee",
      "s": "T",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Eviscerator",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "Armorbane, AT(2), Slow(-2), Unwieldy"
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
      "name": "Lascannon",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Laspistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "3",
      "ap": "0",
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
    }
  ],
  "option_groups": [
    {
      "header": "Only for armies with an Ordo Malleus Inquisitor.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "A warband consists of a maximum of 12 models. Each army can only contain a single warband.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Each Excorcist can be equipped with an Eviscerator for +5 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Each Servitor can be equipped with one of the following weapons",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Heavy bolter",
          "points": 9
        },
        {
          "name": "Multi-melta",
          "points": 18
        },
        {
          "name": "Plasma cannon",
          "points": 49
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The unit may get one of these abilities (points per model, including an attached Inquisitor)",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Deep strike",
          "points": 0
        },
        {
          "name": "Infiltrator",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Aura of Faith: While an Exorcist is alive in the unit, all models gain a 5+ invulnerability save against melee weapons.",
    "Bodyguard: Every Acolyte has the \"Bodyguard\" special ability.",
    "Jokaero Digital Weapons: All Jokaero in the squad can fire the same weapon each round: Heavy flamer, Lascannon, Multi-melta. All weapons fired by a Jokaero have the \"Assault\" type.",
    "Psionic Flare: A friendly unit arriving via deep strike does not scatter when set up within 6\" of the Mystic. Increase the range by 6\" for each additional Mystic.",
    "Psyker: A Psyker can cast 1 psychic power and dispel 1 psychic power per round. A Psyker knows Smite, as well as one psychic power from a chosen psychic discipline.",
    "Servitor: As long as the Inquisitor is alive, Servitors get +1 to hit rolls.",
    "Warp shield: While the Daemonhost is alive in the unit, all models gain a 5+ invulnerability save against ranged weapons."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": true,
  "has_armory_access": true,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Troops",
  "default_size": 1,
  "min_cost": 6,
  "requires_army_item": "Ordo Malleus"
};
