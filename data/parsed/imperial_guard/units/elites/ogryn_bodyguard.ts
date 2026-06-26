/**
 * OGRYN BODYGUARD — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const ogrynBodyguard: Unit = {
  "name": "Ogryn Bodyguard",
  "models": [
    {
      "name": "Ogryn Bodyguard",
      "points": 56,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "3",
        "A": "4",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Ogryn Bodyguard is equipped with: Bullgryn maul; Brute shield; Frag bombs.",
  "weapons": [
    {
      "name": "Bullgryn maul",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-1",
      "d": "1",
      "abilities": "AT(2)"
    },
    {
      "name": "Frag bomb",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Grenadier gauntlet",
      "range": "18\"",
      "type": "Assault 2",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Suppression"
    },
    {
      "name": "Ripper gun - Ranged",
      "range": "12\"",
      "type": "Pistol 3",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Ripper gun - Melee",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the Brute shield",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Plate shield",
          "points": 18
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May swap the Bullgryn maul",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Ripper gun",
          "points": 7
        },
        {
          "name": "Grenadier gauntlet",
          "points": 17
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Bodyguard, Command Squad, Furious Charge, Massive(1)",
    "Advisor: For each HQ selection, one Ogryn Bodyguard may be selected that does not occupy an Elite slot.",
    "Brute shield: The model gains the abilities \"Deflect\" and \"Parry\".",
    "Plate shield: The model gains +2 to armor rolls.",
    "Protect the little 'unz: The defensive profile for this model always takes precedent in any unit it is attached to, even if it is not part of the majority. This means all wounds are first assigned to this model as well."
  ],
  "unit_type": "Character Model, Infantry",
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
  "advisor": true,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 56
};
