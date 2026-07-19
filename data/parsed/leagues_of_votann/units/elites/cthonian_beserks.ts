/**
 * CTHONIAN BESERKS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const cthonianBeserks: Unit = {
  "name": "Cthonian Beserks",
  "models": [
    {
      "name": "Cthonian Beserks",
      "points": 18,
      "min": 5,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "1",
        "I": "3",
        "A": "2",
        "LD": "7",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Heavy plasma axe.",
  "weapons": [
    {
      "name": "Concussion weapon",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Slow(-2)"
    },
    {
      "name": "Heavy plasma axe",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Mole grenade launcher",
      "range": "18\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Indirect, Suppression"
    },
    {
      "name": "Twin concussion weapon",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Flurry(1), Slow(-2), Unwieldy"
    }
  ],
  "option_groups": [
    {
      "header": "Each model may swap their Heavy plasma axe",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Concussion weapon",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Heavy plasma axe"]
    },
    {
      "header": "For every 5 models, two Cthonian Beserk may swap their Heavy plasma axe",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Mole grenade launcher",
          "points": 10
        },
        {
          "name": "Twin concussion weapon",
          "points": 11
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Berserk(5+), Eye of the Ancestors, Steady Advance, Void armor",
    "Cyberstimms: The unit can still fight in close combat even if models have already been eliminated by their initiative step."
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
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 90
};
