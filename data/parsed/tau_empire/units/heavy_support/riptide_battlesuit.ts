/**
 * RIPTIDE BATTLESUIT — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const riptideBattlesuit: Unit = {
  "name": "Riptide Battlesuit",
  "models": [
    {
      "name": "Riptide Shas'vre",
      "points": 239,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "4+",
        "S": "7",
        "T": "7",
        "W": "5",
        "I": "2",
        "A": "3",
        "LD": "8",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Riptide Shas'vre is a single model and equipped with: Heavy burst cannon; Twin plasma rifle.",
  "weapons": [
    {
      "name": "Twin fusion blaster",
      "range": "12\"",
      "type": "Assault 2",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "Armorbane, AT(3)"
    },
    {
      "name": "Twin plasma rifle",
      "range": "24\"",
      "type": "Assault 4",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin smart missile system",
      "range": "30\"",
      "type": "Heavy 6",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Anti-Air, Seeking"
    },
    {
      "name": "Heavy burst cannon - Standard",
      "range": "18\"",
      "type": "Rapid Fire 4",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Heavy burst cannon - Nova-charge",
      "range": "18\"",
      "type": "Rapid Fire 6",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Overheating"
    },
    {
      "name": "Ion accelerator - Standard",
      "range": "72\"",
      "type": "Heavy 3",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Ion accelerator - Nova-charge",
      "range": "72\"",
      "type": "Heavy 3",
      "s": "9",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(3), Overheating"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the Heavy burst cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Ion accelerator",
          "points": 137
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Heavy burst cannon - Standard", "Heavy burst cannon - Nova-charge"]
    },
    {
      "header": "May swap the Twin plasma rifle",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin smart missile system",
          "points": 16
        },
        {
          "name": "Twin fusion blaster",
          "points": 23
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Twin plasma rifle"]
    },
    {
      "header": "Any Riptide Shas'vre may pick up to two SUPPORT SYSTEMS from the armory, none of which may be a Shield generator.",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May buy a Drone controller for +0 points and up to two Tau Drones in any combination.",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Supporting Fire, Unyielding",
    "Nova reactor: After the model loses its last Wound, it explodes with a 6\" radius.",
    "Riptide shield generator: The model has a 5+ invulnerability save."
  ],
  "unit_type": "Jump Pack Infantry, Monstrous Creature",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 239
};
