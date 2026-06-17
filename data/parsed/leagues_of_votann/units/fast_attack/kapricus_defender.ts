/**
 * KAPRICUS DEFENDER — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const kapricusDefender: Unit = {
  "name": "Kapricus Defender",
  "models": [
    {
      "name": "Kapricus Defender",
      "points": 167,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "11",
        "I": "3",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Kapricus Defender is equipped with: HYLas rotary cannon; Twin magna-coil autocannon.",
  "weapons": [
    {
      "name": "HYLas rotary cannon",
      "range": "24\"",
      "type": "Heavy 4",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Magna-rail cannon",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-5",
      "d": "3",
      "abilities": "AT(3), Beam, Decimate, Tank hunter"
    },
    {
      "name": "Twin magna-coil autocannon",
      "range": "24\"",
      "type": "Assault 4",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    }
  ],
  "option_groups": [
    {
      "header": "Each model may swap their HYLas rotary cannon",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Magna-rail cannon",
          "points": 28
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-grav, Eye of the Ancestors, Squadron, Vanguard, Void armor",
    "Scanner Uplinks: All ranged weapons of the model gain the \"Suppression\" ability."
  ],
  "unit_type": "Vehicle",
  "keywords": [],
  "is_vehicle": true,
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
  "default_size": 1,
  "min_cost": 167
};
