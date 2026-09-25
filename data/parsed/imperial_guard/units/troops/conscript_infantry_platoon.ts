/**
 * CONSCRIPT INFANTRY PLATOON — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const conscriptInfantryPlatoon: Unit = {
  "name": "Conscript Infantry Platoon",
  "models": [
    {
      "name": "Conscript",
      "points": 6,
      "min": 20,
      "max": 50,
      "stats": {
        "M": "6\"",
        "WS": "5+",
        "BS": "5+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "4",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Lasgun.",
  "weapons": [
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
      "name": "Close combat weapon",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Autocannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
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
      "name": "Flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Auto Hit, Sunder(1)"
    },
    {
      "name": "Heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Grenade launcher - Frag grenade",
      "range": "24\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Blast(4)"
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
      "name": "Missile launcher - Frag missile",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Blast(4)"
    },
    {
      "name": "Missile launcher - Krak missile",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Anti-air, AT(2)"
    }
  ],
  "option_groups": [
    {
      "header": "Can't be selected without a Platoon Command Squad.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "For every ten models, one Conscript may be equipped with a Special weapon",
      "constraint": {
        "type": "per_n",
        "per_n": 10,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Grenade launcher",
          "points": 3
        },
        {
          "name": "Flamer",
          "points": 7
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "For every ten models, two other Conscripts may form a Heavy weapons team",
      "constraint": {
        "type": "per_n",
        "per_n": 10
      },
      "choices": [
        {
          "name": "Heavy bolter",
          "points": 8
        },
        {
          "name": "Autocannon",
          "points": 12
        },
        {
          "name": "Missile launcher",
          "points": 19
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      // IG ARMY TRAIT "Close Combat Specialists" (Imperial Guard 1.05, Army Customisation row 73):
      // "Each model may swap their Lasgun for a Las pistol and a Close combat weapon." The trait
      // itself costs 0 | 0 | -, and the swap costs nothing on top of it — the same shape the
      // author already uses for this exact trade elsewhere: the Sororitas Sisters Novitiate may
      // swap their Autoguns for a "Close combat weapon, +0 points", and the IG Penal Legion
      // Squad's "Knife Fighters" upgrade grants "a Close combat weapon and a Las pistol" outright.
      // APPENDED LAST on purpose: `optionQty` is keyed by group INDEX, so a group added anywhere
      // else would silently repoint every saved list's selections.
      "header": "Close Combat Specialists: each model may swap their Lasgun",
      "requires_trait": "Close Combat Specialists",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Las pistol & Close combat weapon",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Lasgun"
      ]
    }
  ],
  "abilities": [
    "Send the next wave!: If the unit is below half its target strength or is destroyed, it can be removed from the field once per game at the end of the battle round and automatically reappears as a reserve at full target strength in the next battle round."
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
  "slot": "Troops",
  "default_size": 20,
  "min_cost": 120
};
