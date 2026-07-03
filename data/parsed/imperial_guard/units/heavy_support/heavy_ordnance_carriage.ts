/**
 * HEAVY ORDNANCE CARRIAGE — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const heavyOrdnanceCarriage: Unit = {
  "name": "Heavy Ordnance Carriage",
  "models": [
    {
      "name": "Heavy Ordnance Carriage",
      "points": 60,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "7",
        "W": "5",
        "I": "3",
        "A": "3",
        "LD": "6",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: 4 Lasguns; Frag grenades.",
  "weapons": [
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
      "name": "Lasgun",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Earthshaker cannon - HE shells",
      "range": "240\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(3), Barrage, Indirect"
    },
    {
      "name": "Earthshaker cannon - Gas shells",
      "range": "240\"",
      "type": "Heavy 1",
      "s": "1",
      "ap": "0",
      "d": "2",
      "abilities": "Barrage, Poison(2+), Indirect, Seeking"
    },
    {
      "name": "Medusa siege cannon - HE shells",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(4), Barrage"
    },
    {
      "name": "Medusa siege cannon - Bastion-breacher shells",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(4), Explosive, Tank hunter"
    }
  ],
  "option_groups": [
    {
      "header": "One Guardsman per unit may be equipped with: +5 points Vox.",
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
          "name": "Medusa siege cannon",
          "points": 115
        },
        {
          "name": "Earthshaker cannon",
          "points": 177
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "A battery equipped with a Medusa siege cannon may be equipped with additional ammunition",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Bastion-breacher shells",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "A battery equipped with an Earthshaker cannon may be equipped with additional ammunition",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Gas shells",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Massive(4), Squadron",
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
  "min_cost": 60
};
