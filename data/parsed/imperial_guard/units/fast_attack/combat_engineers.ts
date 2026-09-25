/**
 * COMBAT ENGINEERS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const combatEngineers: Unit = {
  "name": "Combat Engineers",
  "models": [
    {
      "name": "Combat Engineer",
      "points": 11,
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
        "LD": "6",
        "SV": "4+"
      }
    },
    {
      "name": "Watchmaster",
      "points": 11,
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
        "LD": "6",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Veteran Watchmaster",
      "points": 16,
      "min": 0,
      "max": 0,
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
  "equipped_with": "Every model is equipped with: Machine pistol; Lasgun; Frag grenades; Trench Club.",
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
      "name": "Lasgun",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Machine pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Remote mine",
      "range": "18\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Ammo(1)"
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
      "name": "Trench club",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Any number of models may swap their Machine pistol",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Shotgun",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Machine pistol"]
    },
    {
      "header": "For each 5 models, one Combat Engineer may swap their Machine pistol",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Flamer",
          "points": 6
        }
      ],
      "replaces": [
        "Machine pistol"
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The Watchmaster may be upgraded to a Veteran Watchmaster for +5 points and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": "Veteran Watchmaster",
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
    "Vanguard",
    "Remote mine: During activation, the unit can release a Remote mine. Roll 1D6. On a 2+, the Remote mine hits one enemy unit within 18\"."
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
  "slot": "Fast Attack",
  "default_size": 5,
  "min_cost": 55
};
