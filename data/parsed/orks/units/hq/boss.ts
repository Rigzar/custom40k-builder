/**
 * BOSS — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const boss: Unit = {
  "name": "Boss",
  "models": [
    {
      "name": "Boss",
      "points": 85,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "5+",
        "S": "6",
        "T": "5",
        "W": "5",
        "I": "4",
        "A": "3",
        "LD": "6",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Warboss",
      "points": 100,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "5+",
        "S": "6",
        "T": "5",
        "W": "5",
        "I": "4",
        "A": "4",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "equipped_with": "A Boss is equipped with: Stikkbombz.",
  "weapons": [
    {
      "name": "Stikkbombz",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "One Boss per army can be upgraded to a Warboss for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Warboss",
      "is_unique_per_army": true
    },
    {
      "header": "Can get one Kustom job.",
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
    "Dakka Dakka Dakka, Furious charge, Mob, Waaagh!",
    "Orks is never beaten: If the Warboss loses its last Wound, it is only removed after the last possible activation of the owning player (for the current battle round) and can perform all valid actions until then. During this time, the model gains the \"Fearless\" ability."
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
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 85
};
