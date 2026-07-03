/**
 * FIELD ORDNANCE BATTERY — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const fieldOrdnanceBattery: Unit = {
  "name": "Field Ordnance Battery",
  "models": [
    {
      "name": "Field Ordnance Battery",
      "points": 39,
      "min": 1,
      "max": 4,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "5",
        "W": "3",
        "I": "3",
        "A": "3",
        "LD": "6",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: 2 Lasguns; Frag grenades.",
  "weapons": [
    {
      "name": "Bombast field gun",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Barrage, Indirect, Suppression"
    },
    {
      "name": "Frag grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Heavy lascannon",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-5",
      "d": "4",
      "abilities": "AT(4)"
    },
    {
      "name": "Heavy mortar",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Barrage, Indirect, Suppression"
    },
    {
      "name": "Heavy quad launcher",
      "range": "36\"",
      "type": "Heavy 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Indirect, Suppression"
    },
    {
      "name": "Lasgun",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Malleus rocket launcher",
      "range": "48\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive, Indirect, Suppression"
    },
    {
      "name": "Multiple rocket launcher",
      "range": "36\"",
      "type": "Heavy 5",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive, Indirect, Suppression"
    },
    {
      "name": "Siege cannon",
      "range": "120\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(3), Barrage, Indirect, Suppression"
    }
  ],
  "option_groups": [
    {
      "header": "One Guardsman per Field Ordnance Battery may be equipped with: +5 points Vox.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Must pick one weapon from this list",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Multiple rocket launcher",
          "points": 49
        },
        {
          "name": "Heavy mortar",
          "points": 59
        },
        {
          "name": "Heavy quad launcher",
          "points": 61
        },
        {
          "name": "Heavy lascannon",
          "points": 75
        },
        {
          "name": "Malleus rocket launcher",
          "points": 76
        },
        {
          "name": "Bombast field gun",
          "points": 80
        },
        {
          "name": "Siege cannon",
          "points": 169
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Massive(2), Squadron",
    "Support Weapons crew: Every instance of damage can only ever cause 1 wound loss. Attacks with the \"Barrage\" or \"Explosive\" ability cause one hit for each Wound remaining on the model."
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 39
};
