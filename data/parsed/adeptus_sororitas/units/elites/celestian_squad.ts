/**
 * CELESTIAN SQUAD — Elites
 *
 * SOURCE: Adeptus Sororitas ENG.ods, sheet "Celestian Squad" (2026-06-28 update).
 * This revision UNIFIES what used to be three separate units (Celestian Squad, Celestian
 * Insidiants, Celestian Sacresants) into a single datasheet: every model can independently take
 * one of four +1pt keyword upgrades (Excruciants/Insidiants/Praesidiants/Sacresancts), and 2 of
 * every 5 models can additionally be equipped with one of 5 weapons (the base loadout is just
 * grenades — there is no default ranged/melee weapon in the .ods's "equipped with" line).
 * celestian_insidiants.ts and celestian_sacresants.ts are removed as part of this rebuild.
 */

import type { Unit } from '../../../../../src/types/data';

export const celestianSquad: Unit = {
  "name": "Celestian Squad",
  "models": [
    {
      "name": "Celestian",
      "points": 21,
      "min": 4,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "8",
        "SV": "3+"
      }
    },
    {
      "name": "Celestian Superior",
      "points": 21,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Frag grenades; Krak grenades.",
  "weapons": [
    {
      "name": "Blessed sword",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
      "d": "1",
      "abilities": "Deadly(5+), Slow(-1)"
    },
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
      "name": "Virge of Admonition",
      "range": "-",
      "type": "Melee",
      "s": "x3",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Slow(-2), Psi-shock, Unwieldy"
    }
  ],
  "option_groups": [
    {
      "header": "The entire squad may receive one of the following upgrades per model",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Excruciants",
          "points": 1,
          "abilities": ["Tank Hunter"]
        },
        {
          "name": "Insidiants",
          "points": 1,
          "abilities": ["Infiltrator"]
        },
        {
          "name": "Praesidiants",
          "points": 1,
          "abilities": ["Counter-Attack"]
        },
        {
          "name": "Sacresancts",
          "points": 1,
          "abilities": ["Furious Charge"]
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "For every 5 models, two Celestians may be equipped with",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Blessed sword",
          "points": 6
        },
        {
          "name": "Heavy flamer",
          "points": 9
        },
        {
          "name": "Virge of Admonition",
          "points": 18
        },
        {
          "name": "Heavy bolter",
          "points": 23
        },
        {
          "name": "Multi-melta",
          "points": 46
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One model may receive a Simulacrum (see Armory) for +5 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One model may receive a Denuncia oratory for +5 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Acts of Faith, Bodyguard, Shield of Faith",
    "Denuncia oratory: While the model is alive, the unit gains the \"Favoured Enemy(everything)\" ability.",
    "Pious: A Celestian Superior increases the Faith Points by +1.",
    "Excruciants: The model gains the \"Tank Hunter\" ability.",
    "Insidiants: The model gains the \"Infiltrator\" ability.",
    "Praesidiants: The model gains the \"Counter-Attack\" ability.",
    "Sacresancts: The model gains the \"Furious Charge\" ability."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 105
};
