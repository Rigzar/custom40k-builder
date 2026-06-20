/**
 * CELESTIAN INSIDIANTS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const celestianInsidiants: Unit = {
  "name": "Celestian Insidiants",
  "models": [
    {
      "name": "Celestian Insidiant",
      "points": 23,
      "min": 4,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
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
      "name": "Insidiant Superior",
      "points": 28,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
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
  "equipped_with": "Every model is equipped with: Condemnor Bolt pistol; Frag grenades; Krak grenades; Null mace.",
  "weapons": [
    {
      "name": "Blessed sword",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
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
      "name": "Hand flamer",
      "range": "6\"",
      "type": "Pistole 4",
      "s": "4",
      "ap": "0",
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
      "name": "Null mace",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-1",
      "d": "1",
      "abilities": "Psi-shock"
    },
    {
      "name": "Virge of Admonition",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-3",
      "d": "1",
      "abilities": "Deadly(5+), Flurry(1), Psi-shock, Unwieldy"
    },
    {
      "name": "Condemnor Bolt pistol - Bolt",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Condemnor Bolt pistol - Stake",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "3",
      "ap": "-1",
      "d": "1",
      "abilities": "Psi-shock"
    }
  ],
  "option_groups": [
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
    },
    {
      "header": "Up to two Celestia Insidiants may swap their Condemnor bolt pistols",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Hand flamer",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Condemnor Bolt pistol - Bolt", "Condemnor Bolt pistol - Stake"]
    },
    {
      "header": "Up to two Celestia Insidiants may swap their Null maces",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Blessed sword",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Null mace"]
    },
    {
      "header": "One Celestia Insidiants may swap their Condemnor bolt pistol and Null mace",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Virge of Admonition",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Condemnor Bolt pistol - Bolt", "Condemnor Bolt pistol - Stake", "Null mace"]
    }
  ],
  "abilities": [
    "Acts of Faith, Aegis(4+), Infiltrator, Shield of Faith",
    "Denuncia oratory: While the model is alive, the unit gains the \"Favoured Enemy(everything)\" ability.",
    "Pious: An Insidiant Superior increases the Faith Points by +1."
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
  "min_cost": 120
};
