/**
 * Y'VAHRA BATTLESUIT — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const yvahraBattlesuit: Unit = {
  "name": "Y'vahra Battlesuit",
  "models": [
    {
      "name": "Y'vahra Shas'vre",
      "points": 357,
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
    },
    {
      "name": "Missile Drone",
      "points": 0,
      "min": 2,
      "max": 2,
      "stats": {
        "M": "*",
        "WS": "4+",
        "BS": "4+",
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
  "equipped_with": "A Y'vahra Battlesuit is a single model and equipped with: Ionic discharge cannon; Phased plasma flamer; 2 Missile drones.",
  "weapons": [
    {
      "name": "Missile pod",
      "range": "30\"",
      "type": "Assault 3",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Anti-Air"
    },
    {
      "name": "Ionic discharge cannon - Standard",
      "range": "24\"",
      "type": "Heavy 5",
      "s": "8",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(2)"
    },
    {
      "name": "Ionic discharge cannon - Nova-charge",
      "range": "24\"",
      "type": "Heavy 5",
      "s": "9",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(3), Overheating"
    },
    {
      "name": "Phased plasma flamer - Standard",
      "range": "12\"",
      "type": "Assault 6",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Armor piercing(5+), Flames"
    },
    {
      "name": "Phased plasma flamer - Nova-charge",
      "range": "12\"",
      "type": "Assault 6",
      "s": "6",
      "ap": "-1",
      "d": "2",
      "abilities": "Armor piercing(5+), Flames, Overheating"
    }
  ],
  "option_groups": [
    {
      "header": "Any Y'vahra Shas'vre may pick up to two SUPPORT SYSTEMS from the armory, none of which may be a Shield generator.",
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
    "Supporting Fire",
    "Drone protocols: Drones are ignored when determining the unit's most used Toughness and Defensive rules. They move as fast as the unit they are attached to. They are considered as being part of the model that controls them. Drones controlled by a Drone controller can not be removed as casualties.",
    "Nova reactor: After the model loses its last Wound, it explodes with a 6\" radius.",
    "Y'vahra shield generator: The model has a 5+ invulnerability save."
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
  "slot": "Fast Attack",
  "default_size": 3,
  "min_cost": 357
};
