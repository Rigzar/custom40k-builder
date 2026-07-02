/**
 * CORSAIR VOIDSCARRED — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The Way Seeker can cast 1 power and deny 1 power per battle round. They know Smite and 1 power from either the Battle or Fate discipline."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const corsairVoidscarred: Unit = {
  "name": "Corsair Voidscarred",
  "models": [
    {
      "name": "Voidscarred",
      "points": 16,
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
        "A": "2",
        "LD": "8",
        "SV": "4+"
      }
    },
    {
      "name": "Felarch",
      "points": 16,
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
        "A": "2",
        "LD": "8",
        "SV": "4+"
      }
    },
    {
      "name": "Shade Runner",
      "points": 20,
      "min": 0,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "5",
        "A": "4",
        "LD": "8",
        "SV": "4+"
      }
    },
    {
      "name": "Soul Weaver",
      "points": 22,
      "min": 0,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "5",
        "A": "2",
        "LD": "8",
        "SV": "4+"
      }
    },
    {
      "name": "Way Seeker",
      "points": 26,
      "min": 0,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "5",
        "A": "2",
        "LD": "8",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every Voidscarred and Felarch is equipped with: Plasma grenade; Shuriken rifle.",
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
      "name": "Fusion pistol",
      "range": "6\"",
      "type": "Pistol 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
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
      "name": "Paired Hekatarii blades",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
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
      "name": "Ranger long rifle",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+), Suppression"
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
      "name": "Witch staff",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "1",
      "abilities": "Force weapon, Poison(2+)"
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
      "header": "Any Voidscarred may swap their Shuriken rifle",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Shuriken pistol and Power sword",
          "points": 1
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Shuriken rifle"]
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
      "is_unique_per_army": false,
      "replaces": ["Shuriken pistol"]
    },
    {
      "header": "The Felarch may be equipped with: +15 points Mistshield.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "For every 5 models, one Voidscarred may swap their Shuriken rifle",
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
      "is_unique_per_army": false,
      "replaces": ["Shuriken rifle"]
    },
    {
      "header": "If this unit contains 10 models, one Voidscarred may swap their Shuriken rifle",
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
      "is_unique_per_army": false,
      "replaces": ["Shuriken rifle"]
    },
    {
      "header": "If this unit contains 10 models, one Voidscarred may swap their Shuriken rifle",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Fusion pistol & Power sword",
          "points": 15
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Shuriken rifle"]
    },
    {
      "header": "If this unit contains 10 models, one Voidscarred may swap their Shuriken rifle",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Ranger long rifle",
          "points": 17
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Shuriken rifle"]
    },
    {
      "header": "1 Voidscarred may be equipped with a Faolchú for +10 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Channeler stones: Once per turn, the damage of a wound against the model or attached unit can be reduced by 1. The ability must be declared after armor and invulnerability saves. Does not work against weapons with a strength of 8 or above.",
    "Faolchú: All weapons of the unit gain +1 AP when shooting at targets that benefit from cover.",
    "Ghosthelm: The Way Seeker ignores the first Perils of the warp attack each round.",
    "Mistshield: The model and it's attached unit gain a 5+ invulnerability save against ranged attacks.",
    "Neuro disruptor: Roll 2D6 after a successful hit and compare it with the Leadership value of the unit. If your roll is higher, the target suffers one Mortal Wound for each point above their Ld value.",
    "Psyker: The Way Seeker can cast 1 power and deny 1 power per battle round. They know Smite and 1 power from either the Battle or Fate discipline.",
    "Shade Runner Assault: After finishing a charge move, the enemy unit suffers one automatic wound with S:4 AP:0 D:1 for every friendly model that made it into base contact.",
    "Sniper: A model equipped with a Ranger long rifle increases their BS by +1."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": true,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 80
};
