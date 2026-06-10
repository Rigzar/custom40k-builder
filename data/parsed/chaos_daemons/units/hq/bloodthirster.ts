/**
 * BLOODTHIRSTER — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const bloodthirster: Unit = {
  "name": "Bloodthirster",
  "models": [
    {
      "name": "Bloodthirster",
      "points": 429,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "2+",
        "BS": "2+",
        "S": "8",
        "T": "8",
        "W": "7",
        "I": "6",
        "A": "5",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Bloodthirster is equipped with: Axe of Khorne; Whip of Khorne.",
  "weapons": [
    {
      "name": "Axe of Khorne",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Deadly(5+), Decimate"
    },
    {
      "name": "Whip of Khorne",
      "range": "8\"",
      "type": "Pistol 3",
      "s": "U",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Flurry(2)"
    }
  ],
  "option_groups": [
    {
      "header": "Only one Greater Daemon of each type per army.",
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
    "Deep strike, Fearless, Greater Daemon, Mark of Khorne, Terrifying(-2)"
  ],
  "unit_type": "Monstrous Creature, Jump Pack Infantry",
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
  "locked_mark": "Khorne",
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 429
};
