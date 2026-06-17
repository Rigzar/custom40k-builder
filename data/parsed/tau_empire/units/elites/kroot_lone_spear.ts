/**
 * KROOT LONE-SPEAR — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const krootLoneSpear: Unit = {
  "name": "Kroot Lone-Spear",
  "models": [
    {
      "name": "Lone-Spear",
      "points": 81,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "4+",
        "S": "5",
        "T": "4",
        "W": "3",
        "I": "4",
        "A": "4",
        "LD": "7",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Lone-Spear is equipped with: Kalamandra's bite; Kroot long gun.",
  "weapons": [
    {
      "name": "Kalamandra's bite",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "Flurry(1)"
    },
    {
      "name": "Kroot long gun",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "6",
      "ap": "-3",
      "d": "2",
      "abilities": "Armor piercing(5+), Suppression"
    },
    {
      "name": "Kroot javelins - Blast",
      "range": "18\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(2), Explosive"
    },
    {
      "name": "Kroot javelins - Charge",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1), Quick(+1), Charge order only"
    },
    {
      "name": "Kroot javelins - Melee",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "1",
      "abilities": "Unwieldy"
    }
  ],
  "option_groups": [
    {
      "header": "For every unit of Kroot Carnivores, one Kroot Lone-Spear may be taken without using an ELITE slot.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Any Lone-Spear may swap their Kroot long gun",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Kroot javelins",
          "points": 42
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Infiltrator, Stealth, Squadron, Supporting Fire, Use Cover",
    "Sniper: A model equipped with a Kroot long gun improves its BS by +1."
  ],
  "unit_type": "Bike, Kroot",
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
  "advisor": true,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 81
};
