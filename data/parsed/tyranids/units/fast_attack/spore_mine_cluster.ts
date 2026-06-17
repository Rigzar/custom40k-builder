/**
 * SPORE MINE CLUSTER — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const sporeMineCluster: Unit = {
  "name": "Spore Mine Cluster",
  "models": [
    {
      "name": "Spore Mine",
      "points": 7,
      "min": 1,
      "max": 9,
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
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Spore Mine.",
  "weapons": [
    {
      "name": "Spore mine explosion",
      "range": "-",
      "type": "-",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive, Suppression"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Deep Strike, Infiltrator, Mindless, Move Through Cover, Squadron",
    "Living ammunition: The unit immediately explodes like a vehicle (one explosion per model) with the \"Spore mine explosion\" profile, if an enemy model comes within 3\" distance.",
    "Drifting Death: Instead of receiving orders as normal, Spore Mines drift aimlessly. During each Rally phase, roll 1D6 and a scatter die for every Spore Mine unit on the battlefield. The unit moves a number of inches equal to the D6 result in the direction indicated by the scatter die. If a Hit symbol is rolled, the controlling player chooses the direction instead."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Tyranid"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 1,
  "min_cost": 7,
  "is_monster": false
};
