/**
 * CORSAIR VOIDREAVERS — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const corsairVoidreavers: Unit = {
  "name": "Corsair Voidreavers",
  "models": [
    {
      "name": "Voidreaver",
      "points": 15,
      "min": 4,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "5",
        "A": "1",
        "LD": "7",
        "SV": "4+"
      }
    },
    {
      "name": "Felarch",
      "points": 15,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "5",
        "A": "1",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Plasma grenade; Shuriken rifle.",
  "weapons": [
    {
      "name": "Blaster",
      "range": "18\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Lance(+1)"
    },
    {
      "name": "Shredder",
      "range": "18\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Suppression"
    },
    {
      "name": "Neuro disruptor",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "*",
      "ap": "*",
      "d": "*",
      "abilities": "-"
    },
    {
      "name": "Plasma grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Power sword",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Shuriken cannon",
      "range": "24\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Shuriken"
    },
    {
      "name": "Shuriken pistol",
      "range": "12\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Shuriken"
    },
    {
      "name": "Shuriken rifle",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Shuriken"
    },
    {
      "name": "Wraithcannon",
      "range": "18\"",
      "type": "Assault 2",
      "s": "D",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(3), Graviton"
    }
  ],
  "option_groups": [
    {
      "header": "Any Voidreaver may swap their Shuriken rifle",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Shuriken pistol & Power sword",
          "points": 1
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The Felarch may swap their Shuriken pistol",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Neuro disruptor",
          "points": 8
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The Felarch may be equipped with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Mistshield",
          "points": 15
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "For every 5 models, one Voidreaver may swap their Shuriken rifle",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Shredder",
          "points": 11
        },
        {
          "name": "Blaster",
          "points": 27
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "If this unit contains 10 models, one Voidreaver may swap their Shuriken rifle",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Shuriken cannon",
          "points": 15
        },
        {
          "name": "Wraithcannon",
          "points": 32
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Mistshield: The model and it's attached unit gain a 5+ invulnerability save against ranged attacks.",
    "Neuro disruptor: Roll 2D6 after a successful hit and compare it with the Leadership value of the unit. If your roll is higher, the target suffers one Mortal Wound for each point above their Ld value.",
    "Outcasts and Pirates: This unit can't be a mandatory Troop selection."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Troops",
  "default_size": 5,
  "min_cost": 75
};
