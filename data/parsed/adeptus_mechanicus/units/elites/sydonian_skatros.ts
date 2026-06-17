/**
 * SYDONIAN SKATROS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const sydonianSkatros: Unit = {
  "name": "Sydonian Skatros",
  "models": [
    {
      "name": "Sydonian Skatros",
      "points": 98,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "3+",
        "S": "3",
        "T": "4",
        "W": "3",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Sydonian Skatros is equipped with: Archeo-revolver; Radium jezzail.",
  "weapons": [
    {
      "name": "Archeo-revolver",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "5",
      "ap": "-2",
      "d": "2",
      "abilities": "-"
    },
    {
      "name": "Radium jezzail",
      "range": "30\"",
      "type": "Heavy 2",
      "s": "5",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+), Decimate, Suppression"
    },
    {
      "name": "Transuranic arquebus",
      "range": "60\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-4",
      "d": "2",
      "abilities": "Armorbane, AT(1), Deadly(5+)"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the Radium jezzail",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Transuranic arquebus",
          "points": 8
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The unit may select one Doctrina Imperative.",
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
    "Canticles of the Omnissiah, Squadron, Stealth",
    "Achillan Eye: All Heavy weapons wielded by this model gain the Shred, Suppression, and Tank Hunter abilities.",
    "Enhanced Bionics: This model receives a 5+ invulnerability save."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 98
};
