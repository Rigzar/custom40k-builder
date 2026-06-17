/**
 * SHINING SPEARS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const shiningSpears: Unit = {
  "name": "Shining Spears",
  "models": [
    {
      "name": "Shining Spear",
      "points": 76,
      "min": 3,
      "max": 6,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "4",
        "W": "2",
        "I": "5",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Shining Spear Exarch",
      "points": 102,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "12\"",
        "WS": "2+",
        "BS": "2+",
        "S": "3",
        "T": "4",
        "W": "3",
        "I": "5",
        "A": "3",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "equipped_with": "Every Shining Spear is equipped with: Laser lance; Twin shuriken catapult.",
  "weapons": [
    {
      "name": "Paragon sabre",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "Flurry(1)"
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
      "name": "Twin shuriken catapult",
      "range": "18\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Shuriken"
    },
    {
      "name": "Laser lance - Charge",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-3",
      "d": "2",
      "abilities": "Quick(+1), Can only be used with a charge order"
    },
    {
      "name": "Laser lance - Melee",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "Unwieldy"
    },
    {
      "name": "Laser lance - Ranged",
      "range": "6\"",
      "type": "Pistol",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Star lance - Charge",
      "range": "-",
      "type": "Melee",
      "s": "+5",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Quick(+1), Can only be used with a charge order"
    },
    {
      "name": "Star lance - Melee",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-4",
      "d": "1",
      "abilities": "AT(2), Unwieldy"
    },
    {
      "name": "Star lance - Ranged",
      "range": "6\"",
      "type": "Pistol",
      "s": "8",
      "ap": "-4",
      "d": "1",
      "abilities": "AT(2)"
    }
  ],
  "option_groups": [
    {
      "header": "One model may be upgraded to an Exarch for +26 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 26,
      "variant_link": "Shining Spear Exarch",
      "is_unique_per_army": false
    },
    {
      "header": "The Exarch can swap their Paragon sabre",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Laser lance",
          "points": 6
        },
        {
          "name": "Star lance",
          "points": 14
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The Exarch can swap their Twin shuriken catapult",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Shuriken cannon",
          "points": 14
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The Exarch can be equipped with: +10 points Shimmershield.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The Exarch can gain one Exarch Power.",
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
    "Battle Focus, Deflect, <Aspect>",
    "Aspect armor: The model gains a 5+ invulnerability save.",
    "Shimmershield: The model and its attached unit gain a 4+ invulnerability save in melee."
  ],
  "unit_type": "Jetbike",
  "keywords": [
    "Aspect"
  ],
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
  "default_size": 3,
  "min_cost": 228
};
