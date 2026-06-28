/**
 * DOGMATA ON THRONE OF CONDEMNATION — HQ
 *
 * SOURCE: Adeptus Sororitas ENG.ods, sheet "Dogmata on Throne of Condemnation" (2026-06-28 update).
 * New HQ unit added in this .ods revision — did not exist in production before.
 */

import type { Unit } from '../../../../../src/types/data';

export const dogmataOnThroneOfCondemnation: Unit = {
  "name": "Dogmata on Throne of Condemnation",
  "models": [
    {
      "name": "Dogmata",
      "points": 246,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "6",
        "T": "6",
        "W": "5",
        "I": "4",
        "A": "3",
        "LD": "9",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Dogmata on Throne of Condemnation is equipped with: Frag grenades; Krak grenades; Mace of the righteous; Melta missiles; Twin heavy bolter; Twin heavy flamer.",
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
      "name": "Krak grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Mace of the righteous",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-1",
      "d": "2",
      "abilities": "AT(1)"
    },
    {
      "name": "Melta missiles",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-5",
      "d": "3",
      "abilities": "Armorbane, AT(4)"
    },
    {
      "name": "Twin heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 4",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin heavy flamer",
      "range": "9\"",
      "type": "Assault 8",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Acts of Faith, Shield of Faith",
    "Faithful: Can recite 1 hymn per battle round. A hymn is successfully recited on a roll of 3+. Knows one Hymn of Battle.",
    "Just Accusation: Select one enemy unit during each Rally phase. All units may re-roll a single to hit or to wound roll against that target until the end of the current battle round.",
    "Unwavering Resolve: The Dogmata gets a 5+ invulnerability saving throw as long as she is within 3\" of a mission objective."
  ],
  "unit_type": "Monstrous Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 246
};
