/**
 * LIVING SAINT — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const livingSaint: Unit = {
  "name": "Living Saint",
  "models": [
    {
      "name": "Living Saint",
      "points": 148,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "2+",
        "BS": "2+",
        "S": "3",
        "T": "3",
        "W": "3",
        "I": "5",
        "A": "4",
        "LD": "10",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Living Saint is equipped with: Ardent Blade.",
  "weapons": [
    {
      "name": "Ardent Blade - Melee",
      "range": "-",
      "type": "Melee",
      "s": "+4",
      "ap": "-4",
      "d": "2",
      "abilities": "Master-crafted, Soul burn(5+)"
    },
    {
      "name": "Ardent Blade - Ranged",
      "range": "9\"",
      "type": "Pistol 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    }
  ],
  "option_groups": [
    {
      "header": "Only one Living Saint per army.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Acts of Faith, Fearless, Shield of Faith",
    "Armour of Saint Catherine: This model has a 4+ invulnerability save.",
    "Pious: A Living Saint increases Faith Points by +3. If she is removed as a casualty and Miraculous Intervention is not being used, the Faith Points do not increase but are reduced by 1D6."
  ],
  "unit_type": "Character Model, Jump Pack Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 148
};
