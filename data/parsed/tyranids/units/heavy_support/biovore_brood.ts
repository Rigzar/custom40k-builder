/**
 * BIOVORE BROOD — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const biovoreBrood: Unit = {
  "name": "Biovore Brood",
  "models": [
    {
      "name": "Biovore",
      "points": 111,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "2",
        "A": "2",
        "LD": "6",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Spore Mine",
      "points": 1,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "-",
        "BS": "-",
        "S": "1",
        "T": "1",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "1",
        "SV": "6+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Spore Mine launcher.",
  "weapons": [
    {
      "name": "Spore Mine launcher",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive, Indirect, Suppression"
    }
  ],
  "option_groups": [
    {
      "header": "May select one Special Biomorph",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Hardened Carapace",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May additionally select any number of Basic and Advanced Biomorphs (see Armory).",
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
    "Instinctive Behaviour (Biovore only), Massive(2) (Biovore only), Mindless (Spore Mine only), Move Through Cover",
    "Living ammunition (Spore Mine only): The unit immediately explodes like a vehicle (one explosion per model) with the \"Spore Mine launcher\" profile, if an enemy model comes within 3\" distance.",
    "Drifting Death (Spore Mine only): Instead of receiving orders as normal, Spore Mines drift aimlessly. During each Rally phase, roll 1D6 and a scatter die for every Spore Mine unit on the battlefield. The unit moves a number of inches equal to the D6 result in the direction indicated by the scatter die. If a Hit symbol is rolled, the controlling player chooses the direction instead.",
    "Spore Mine Launcher: Instead of shooting at an enemy, a Biovore may create one unit of Spore Mines (3 models each) within 48\" of itself and at least 9\" away from any enemy unit."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Tyranid"
  ],
  "is_vehicle": false,
  "is_character": false,
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
  "min_cost": 111,
  "is_monster": false
};
