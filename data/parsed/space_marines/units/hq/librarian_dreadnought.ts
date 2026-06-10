/**
 * LIBRARIAN DREADNOUGHT — HQ
 *
 * SOURCE (canonical — Space Marines ENG/Librarian Dreadnought.html)
 * ─────────────────────────────────────────────────────────────────
 * PROFILE: 1 Librarian Dreadnought — M:6" WS:2+ BS:2+ S:6 FRONT:12 SIDE:12 REAR:10 I:5 A:3 HP:3 — 278 pts
 * EQUIPPED WITH: Dreadnought close combat weapon; Furioso psy halberd; Heavy flamer.
 * WEAPONS:
 *   Dreadnought cccw    -   Melee     S:x2 AP:-3 D:2  AT(2)
 *   Furioso psy halberd -   Melee     S:+2 AP:-4 D:2  AT(2), Extra attack, Force weapon
 *   Melta               12" Assault 1 S:8  AP:-5 D:1  AT(1), Melta
 *   Heavy flamer        9"  Assault 4 S:5  AP:-1 D:1  Flames
 *   Storm bolter        24" Rapid Fire 2 S:4 AP:-1 D:1  -
 * OPTIONS:
 *   May swap the Heavy flamer: Storm bolter +5, Melta +13
 *   Only one Chief Librarian or Librarian Dreadnought per army.
 *   Has access to vehicle equipment from the Armory.
 *   Can gain one Veteran ability.
 * ABILITIES:
 *   Psionic shield: 5+ inv save.
 *   Psychic hood: +1 to deny enemy psychic powers.
 *   Psyker: cast 2 / deny 2 per round; knows Smite + all powers from a chosen discipline.
 *   (No TSKNF — Vehicle unit type, not creature.)
 * UNIT TYPE: Vehicle, Walker
 *
 * ENGINE STATUS: ✓ all data matches HTML. is_psyker:true, is_vehicle:true → vehicle armory.
 *   Disciplines gated via SM_LEGACY_DISC_MAP same as Librarian. Validator enforces uniqueness.
 */

import type { Unit } from '../../../../../src/types/data';

export const librarianDreadnought: Unit = {
  "name": "Librarian Dreadnought",
  "models": [
    {
      "name": "Librarian Dreadnought",
      "points": 278,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "12",
        "REAR": "10",
        "I": "5",
        "A": "3",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Librarian Dreadnought is equipped with: Dreadnought close combat weapon; Furioso psy halberd; Heavy flamer.",
  "weapons": [
    {
      "name": "Dreadnought close combat weapon",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Furioso psy halberd",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Extra attack, Force weapon"
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
      "name": "Heavy flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Storm bolter",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the Heavy flamer",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Storm bolter",
          "points": 5
        },
        {
          "name": "Melta",
          "points": 13
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Only one Chief Librarian or Librarian Dreadnought per army.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Psionic shield: The model receives a 5+ invulnerability save.",
    "Psychic hood: Add +1 to rolls to deny enemy psychic powers.",
    "Psyker: The model can cast 2 power and deny 2 power per battle round. It knows Smite and all powers from a chosen discipline."
  ],
  "unit_type": "Vehicle, Walker",
  "keywords": [],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": true,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 278
};
