/**
 * COMPANY HERO — Elites
 *
 * SOURCE: Imperial Guard 1.03 (sheet fetched 2026-08-13), "Company Hero".
 */

import type { Unit } from '../../../../../src/types/data';

export const companyHero: Unit = {
  "variant_models": [],
  "weapons": [
    {
      "name": "Claws & Teeth",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Frag grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    }
  ],
  "option_groups": [],
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
  "advisor": true,
  "unit_type": "Character Model, Infantry",
  "slot": "Elites",
  "default_size": 1,
  "name": "Company Hero",
  "models": [
    {
      "name": "Company Hero",
      "points": 17,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "3",
        "A": "1",
        "LD": "7",
        "SV": "5+"
      }
    },
    {
      "name": "Animal Companion",
      "points": 6,
      "min": 0,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "4",
        "A": "2",
        "LD": "6",
        "SV": "6+"
      }
    }
  ],
  "equipped_with": "A Company Hero is equipped with: Frag grenades. An Animal Companion is equipped with: Claws & Teeth.",
  "abilities": [
    "Command Squad",
    "Advisor: For each HQ selection, one Company Hero may be selected that does not occupy an Elite slot.",
    "Companion: An Animal Companion does not prevent a Company Hero to join a unit.",
    "Company Hero: One of your units within 12\" automatically succeeds to rally during each Rally phase."
  ],
  "min_cost": 17
};
