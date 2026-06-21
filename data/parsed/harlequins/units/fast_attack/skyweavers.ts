/**
 * SKYWEAVERS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const skyweavers: Unit = {
  "name": "Skyweavers",
  "models": [
    {
      "name": "Skyweaver",
      "points": 81,
      "min": 1,
      "max": 6,
      "stats": {
        "M": "14\"",
        "WS": "2+",
        "BS": "3+",
        "S": "3",
        "T": "4",
        "W": "3",
        "I": "5",
        "A": "4",
        "LD": "8",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Twin shuriken catapult; Zephyrglaive.",
  "weapons": [
    {
      "name": "Haywire cannon",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive, Haywire"
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
      "name": "Star bolas",
      "range": "12\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "-4",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Twin shuriken catapult",
      "range": "18\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Shuriken"
    },
    {
      "name": "Zephyrglaive",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-4",
      "d": "1",
      "abilities": "Quick(+1), Precision(5+)"
    }
  ],
  "option_groups": [
    {
      "header": "Any model may replace its Zephyrglaive",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Star bolas",
          "points": 7
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Zephyrglaive"]
    },
    {
      "header": "Any model may replace its Twin shuriken catapult",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Haywire cannon",
          "points": 8
        },
        {
          "name": "Shuriken cannon",
          "points": 9
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Twin shuriken catapult"]
    },
    {
      "header": "One model may be upgraded to a Lead Player for +17 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 17,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Deflect, Parry, Terrifying(-1)",
    "Holo-suit: The model gains a 4+ invulnerability save.",
    "Mirage launcher: Instead of shooting a weapon, the unit may gain the benefit of cover."
  ],
  "unit_type": "Jetbike",
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
  "slot": "Fast Attack",
  "default_size": 2,
  "min_cost": 81
};
