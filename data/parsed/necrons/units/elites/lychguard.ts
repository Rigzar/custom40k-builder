/**
 * LYCHGUARD — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const lychguard: Unit = {
  "name": "Lychguard",
  "models": [
    {
      "name": "Lychguard",
      "points": 67,
      "min": 1,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "5",
        "T": "5",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Dispersion shield and Hyperphase sword.",
  "weapons": [
    {
      "name": "Hyperphase sword",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "Flurry(1)"
    },
    {
      "name": "War scythe",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Slow(-2)"
    }
  ],
  "option_groups": [
    {
      "header": "Any model can swap its Dispersion shield and Hyperphase sword",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "War scythe",
          "points": 16
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Hyperphase sword"]
    },
    {
      "header": "For every HQ unit, you may pick one Lychguard unit.",
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
    "Bodyguard, Command squad, Reanimation Protocols",
    "Dispersion shield: The model gains a 5+ invulnerability save and the abilities \"Deflect\" and \"Parry\".",
    "Varguard: If a single Lychguard model is selected, it becomes a character model."
  ],
  "unit_type": "Infantry, Necron",
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
  "default_size": 1,
  "min_cost": 67
};
