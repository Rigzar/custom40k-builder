/**
 * ROUGH RIDERS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const roughRiders: Unit = {
  "name": "Rough Riders",
  "models": [
    {
      "name": "Rough Rider",
      "points": 20,
      "min": 4,
      "max": 9,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "1",
        "LD": "6",
        "SV": "5+"
      }
    },
    {
      "name": "Sergeant",
      "points": 20,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "1",
        "LD": "6",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Veteran Sergeant",
      "points": 30,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "3+",
        "S": "3",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "1",
        "LD": "7",
        "SV": "5+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Frag grenades; Chainsword; Las pistol.",
  "weapons": [
    {
      "name": "Chainsword",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
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
      "name": "Las pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Lasgun",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Melta",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Shotgun",
      "range": "18\"",
      "type": "Assault 2",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Sniper rifle",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+), Suppression"
    },
    {
      "name": "Frag lance (Charge)",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-1",
      "d": "2",
      "abilities": "Quick(+1)"
    },
    {
      "name": "Frag lance (Normal)",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-1",
      "d": "1",
      "abilities": "Unwieldy"
    },
    {
      "name": "Goad lance (Charge)",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "2",
      "abilities": "Quick(+1), Deflagrate(5+)"
    },
    {
      "name": "Goad lance (Normal)",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "1",
      "abilities": "Unwieldy"
    },
    {
      "name": "Krak lance (Charge)",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-2",
      "d": "2",
      "abilities": "Quick(+1)"
    },
    {
      "name": "Krak lance (Normal)",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "1",
      "abilities": "Unwieldy"
    },
    {
      "name": "Melta lance (Charge)",
      "range": "-",
      "type": "Melee",
      "s": "+5",
      "ap": "-5",
      "d": "3",
      "abilities": "Armorbane, AT(4), Quick(+1)"
    },
    {
      "name": "Melta lance (Normal)",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-5",
      "d": "2",
      "abilities": "Unwieldy"
    },
    {
      "name": "Grenade launcher - Frag grenade",
      "range": "24\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Grenade launcher - Krak grenade",
      "range": "24\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Plasma gun - Standard",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Plasma gun - Overheating",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Overheating"
    }
  ],
  "option_groups": [
    {
      "header": "The entire squad may receive one of the following upgrades per model",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Attilan-Rider",
          "points": 2
        },
        {
          "name": "Death-Rider",
          "points": 2
        },
        {
          "name": "Chem-Rider",
          "points": 4
        },
        {
          "name": "Mukaali-Rider",
          "points": 9
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One Rough Rider may be equipped with: +5 points Vox.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Up to two Rough Riders may swap their Chainsword",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Goad lance",
          "points": 4
        },
        {
          "name": "Melta lance",
          "points": 16
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "All remaining models may swap their Chainsword",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Frag lance",
          "points": 2
        },
        {
          "name": "Krak lance",
          "points": 4
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Up to two Rough Riders may take a special weapon",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Grenade launcher",
          "points": 5
        },
        {
          "name": "Flamer",
          "points": 6
        },
        {
          "name": "Melta",
          "points": 12
        },
        {
          "name": "Plasma gun",
          "points": 16
        },
        {
          "name": "Sniper rifle",
          "points": 17
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "All remaining models may take one of the following",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Lasgun",
          "points": 1
        },
        {
          "name": "Shotgun",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The Sergeant may be upgraded to a Veteran Sergeant for +10 points and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": "Veteran Sergeant",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Outflank",
    "Charge: The charge profile of each lance can only be used if the unit has executed a \"Charge\" command during its activation.",
    "Sniper: Models with a sniper rifle receive a +1 bonus to their BS value.",
    "Upgrades:",
    "Attilan-Rider: The model gains +1 Strength.",
    "Chem-Rider: The model gains \"Berserk(5+)\".",
    "Death-Rider: The model gains +1 Attack.",
    "Mukaali-Rider: The model gains +1 Toughness, +1 Wound and -1 Initiative."
  ],
  "unit_type": "Bike",
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
  "slot": "Fast Attack",
  "default_size": 5,
  "min_cost": 100
};
