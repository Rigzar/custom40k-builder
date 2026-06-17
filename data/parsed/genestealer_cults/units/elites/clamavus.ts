/**
 * CLAMAVUS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const clamavus: Unit = {
  "name": "Clamavus",
  "models": [
    {
      "name": "Clamavus",
      "points": 37,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "7",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Clamavus is equipped with: Autopistol.",
  "weapons": [
    {
      "name": "Autopistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "For every 500 points of game size, one Clamavus may be included in the army that does not take up an Elite slot.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 500,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Ambush, Command Squad, Infiltrator, Use cover",
    "Proclamation Hailer: Friendly units within 12\" automatically pass Leadership tests during the Rally phase.",
    "Scrambler array: Equipment such as icons or homing beacons do not function within 6\" of the model. Additionally, units arriving via deepstrike that land within 12\" roll 4D6 instead of 2D6 for scattering.",
    "Unquestioning Loyalty: This model may join any Genestealer Cults creature unit (regardless of their unit type). Additionally, that unit gains the \"Bodyguard\" ability.",
    "Voice of New Truths: Enemy units within 12\" suffer a -1 penalty to their Leadership value."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
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
  "default_size": 1,
  "min_cost": 37
};
