/**
 * LIBRARIAN — HQ
 *
 * SOURCE (canonical — Space Marines ENG/Librarian.html)
 * ─────────────────────────────────────────────────────
 * PROFILE:
 *   1 Librarian       M:6" WS:3+ BS:3+ S:4 T:4 W:4 I:5 A:2 LD:8 SV:3+ — 99 pts
 *   * Chief Librarian M:6" WS:3+ BS:3+ S:4 T:4 W:4 I:5 A:3 LD:9 SV:3+ — 114 pts
 * EQUIPPED WITH: Frag grenades; Krak grenades.
 * WEAPONS:
 *   Frag grenade  6"  Grenade 1  S:4  AP:0  D:1  Explosive
 *   Krak grenade  6"  Grenade 1  S:6  AP:-2 D:1  -
 * OPTIONS:
 *   One Librarian per army can be upgraded to a Chief Librarian for +15 points.
 *   Only one Chief Librarian or Librarian Dreadnought per army.
 *   Has access to weapons and gear from the Armory.
 *   Can gain one Veteran ability.
 * ABILITIES:
 *   They Shall Know No Fear
 *   Chief Librarian: cast and deny 1 additional power per battle round.
 *   Psychic hood: +1 to deny enemy psychic powers.
 *   Psyker: cast 1 / deny 1 per round; knows Smite + all powers from a chosen discipline.
 * UNIT TYPE: Character model, Infantry
 *
 * ENGINE STATUS: ✓ all data matches HTML. is_psyker:true. Disciplines gated in PsychicModal
 *   via SM_LEGACY_DISC_MAP (legacy-specific disciplines) + Librarius (general). Chief Librarian
 *   upgrade via variant_link; validator enforces "only one Chief Librarian or Librarian Dreadnought".
 */

import type { Unit } from '../../../../../src/types/data';

export const librarian: Unit = {
  "name": "Librarian",
  "models": [
    {
      "name": "Librarian",
      "points": 99,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "4",
        "I": "5",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Chief Librarian",
      "points": 114,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "4",
        "I": "5",
        "A": "3",
        "LD": "9",
        "SV": "3+"
      }
    }
  ],
  "equipped_with": "A Librarian is equipped with: Frag grenades; Krak grenades.",
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
    }
  ],
  "option_groups": [
    {
      "header": "One Librarian per army can be upgraded to a Chief Librarian for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Chief Librarian",
      "is_unique_per_army": true
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
    "They Shall Know No Fear",
    "Chief Librarian: The model can cast and deny 1 additional power per battle round.",
    "Psychic hood: Add +1 to rolls to deny enemy psychic powers.",
    "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and all powers from a chosen discipline."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
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
  "min_cost": 99
};
