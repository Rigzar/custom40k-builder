/**
 * HEAVY WEAPON SQUAD — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const heavyWeaponSquad: Unit = {
  "name": "Heavy Weapon Squad",
  "models": [
    {
      "name": "Heavy Weapons Team",
      "points": 15,
      "min": 1,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "6",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Lasgun; Frag grenades.",
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
      "name": "Frag grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Blast(4)"
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
      "name": "Heavy flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Auto Hit, Sunder(1)"
    },
    {
      "name": "Lascannon",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
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
      "name": "Mortar",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Blast(4), Indirect, Suppression(3)"
    },
    {
      "name": "Twin heavy stubber",
      "range": "36\"",
      "type": "Heavy 6",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression(3)"
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
      "header": "One Guardsman per Heavy Weapons Team may be equipped with: +5 points Vox.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Every Heavy Weapons Team must be equipped with one of the following",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Mortar",
          "points": 10
        },
        {
          "name": "Heavy bolter",
          "points": 12
        },
        {
          "name": "Autocannon",
          "points": 15
        },
        {
          "name": "Heavy flamer",
          "points": 15
        },
        {
          "name": "Twin heavy stubber",
          "points": 21
        },
        {
          "name": "Missile launcher",
          "points": 29
        },
        {
          "name": "Lascannon",
          "points": 50
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
    "Dug-in positions: All selected Heavy Weapons Squads must be combined into a maximum of three units of 1-3 Heavy Weapons Teams each. They count as independent units from the start of the game.",
    "Massive(1)",
    "Support Weapons crew: Every instance of damage can only ever cause 1 wound loss. Attacks with the \"Blast(x)\" ability use the unit’s remaining Wounds (instead of the number of models) to determine the amount of hits they can generate."
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
  "min_cost": 15
};
