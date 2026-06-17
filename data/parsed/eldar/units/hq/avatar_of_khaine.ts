/**
 * AVATAR OF KHAINE — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const avatarOfKhaine: Unit = {
  "name": "Avatar of Khaine",
  "models": [
    {
      "name": "Avatar",
      "points": 432,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "8\"",
        "WS": "2+",
        "BS": "2+",
        "S": "8",
        "T": "7",
        "W": "7",
        "I": "6",
        "A": "6",
        "LD": "10",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "An Avatar of Khaine is equipped with: The Wailing Doom.",
  "weapons": [
    {
      "name": "The Wailing Doom - Melee",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-5",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "The Wailing Doom - Ranged",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "8",
      "ap": "-5",
      "d": "3",
      "abilities": "Armorbane, Beam"
    }
  ],
  "option_groups": [
    {
      "header": "Only one Avatar of Khaine per army.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": true
    },
    {
      "header": "Can not be the mandatory HQ selection.",
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
    "Fearless, Greater Demon, Terrifying(-2)",
    "Molten body: Enemy attacks reduce their AP value by -2 (to a minimum of 0). If the model loses its last Wound, it explodes like a vehicle."
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
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
  "min_cost": 432
};
