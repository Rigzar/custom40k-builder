/**
 * FIRESIGHT MARKSMAN — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const firesightMarksman: Unit = {
  "name": "Firesight Marksman",
  "models": [
    {
      "name": "Firesight Marksman",
      "points": 20,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "5+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "2",
        "A": "1",
        "LD": "7",
        "SV": "4+"
      }
    },
    {
      "name": "Sniper Drone",
      "points": 34,
      "min": 3,
      "max": 3,
      "stats": {
        "M": "*",
        "WS": "5+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "4",
        "A": "1",
        "LD": "6",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "The Firesight Marksman ist equipped with: Markerlight; Pulse pistol.",
  "weapons": [
    {
      "name": "Longshot pulse rifle",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+), Suppression"
    },
    {
      "name": "Markerlight",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "*",
      "ap": "*",
      "d": "*",
      "abilities": "Markerlight"
    },
    {
      "name": "Pulse pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Infiltrator, Supporting Fire",
    "Drone protocols: Drones are ignored when determining the unit's most used Toughness and Defensive rules. They move as fast as the unit they are attached to. They are considered as being part of the model that controls them. Drones controlled by a Drone controller can not be removed as casualties.",
    "Note: Sniper Drones in this unit are not controlled by a Drone controller and can be removed normally as casualties."
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
  "slot": "Fast Attack",
  "default_size": 4,
  "min_cost": 122
};
