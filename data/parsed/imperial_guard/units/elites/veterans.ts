/**
 * VETERANS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const veterans: Unit = {
  "name": "Veterans",
  "models": [
    {
      "name": "Veteran",
      "points": 9,
      "min": 9,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "7",
        "SV": "5+"
      }
    },
    {
      "name": "Veteran Sergeant",
      "points": 14,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "7",
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
      "name": "Autogun",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "3",
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
      "name": "Demolition charge",
      "range": "6\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "Ammo(1), AT(2), Blast(6)"
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
      "name": "Melta",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
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
      "s": "5",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+), Suppression(6)"
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
      "header": "Any number of Veterans may swap their Lasgun",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Autogun",
          "points": 0
        },
        {
          "name": "Shotgun",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Lasgun"]
    },
    {
      "header": "One Veteran may be equipped with: +5 points Vox.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Up to three Veterans may be equipped with a Special weapon",
      "constraint": {
        "type": "fixed_max",
        "max": 3
      },
      "choices": [
        {
          "name": "Flamer",
          "points": 2
        },
        {
          "name": "Grenade launcher",
          "points": 5
        },
        {
          "name": "Melta",
          "points": 14
        },
        {
          "name": "Plasma gun",
          "points": 19
        },
        {
          "name": "Sniper rifle",
          "points": 20
        },
        {
          "name": "Demolition charge",
          "points": 21
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Instead of taking a Special weapon, one of the Veterans may be equipped with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Heavy flamer",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Two other Veterans may form a Heavy weapons team",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Mortar",
          "points": 13
        },
        {
          "name": "Heavy bolter",
          "points": 15
        },
        {
          "name": "Autocannon",
          "points": 24
        },
        {
          "name": "Missile launcher",
          "points": 38
        },
        {
          "name": "Lascannon",
          "points": 66
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
    "Sniper: Models with a sniper rifle receive a +1 bonus to their BS value."
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
  "slot": "Elites",
  "default_size": 10,
  "min_cost": 95
};
