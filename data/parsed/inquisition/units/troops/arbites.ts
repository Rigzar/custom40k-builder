/**
 * ARBITES — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const arbites: Unit = {
  "name": "Arbites",
  "models": [
    {
      "name": "Arbitrator",
      "points": 13,
      "min": 4,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "7",
        "SV": "4+"
      }
    },
    {
      "name": "Proctor",
      "points": 18,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Arbites combat shotgun; Arbites shotpistol; Frag grenade; Krak grenade.",
  "weapons": [
    {
      "name": "Arbites combat shotgun",
      "range": "15\"",
      "type": "Assault 2",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Arbites grenade launcher",
      "range": "18\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Arbites shotpistol",
      "range": "6\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Executioner shotgun",
      "range": "15\"",
      "type": "Assault 2",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
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
      "name": "Heavy stubber",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Krak grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Shock maul",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Webber",
      "range": "18\"",
      "type": "Assault 2",
      "s": "1",
      "ap": "0",
      "d": "1",
      "abilities": "Monofilament"
    }
  ],
  "option_groups": [
    {
      "header": "Two Arbitrators may swap their Arbites combat shotguns",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Webber",
          "points": 0
        },
        {
          "name": "Arbites grenade launcher",
          "points": 2
        },
        {
          "name": "Executioner shotgun",
          "points": 4
        },
        {
          "name": "Heavy stubber",
          "points": 8
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Arbites combat shotgun"]
    },
    {
      "header": "Any remaining models may swap their Arbites combat shotguns",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Arbites shield & Shock maul",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Arbites shield: The model gains \"Deflect\" and \"Parry\".",
    "Monofilament: If the target enemy unit is in cover and at least one hit has been scored with the weapon, the terrain counts as difficult and dangerous terrain until the end of the next activation of the target unit."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Troops",
  "default_size": 5,
  "min_cost": 70
};
