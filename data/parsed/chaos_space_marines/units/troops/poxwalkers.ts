/**
 * POXWALKERS — Troops
 *
 * SOURCE: Chaos Space Marines ENG / Poxwalkers.html (canonical datasheet)
 * ────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.    NAME        M    WS  BS  S  T  W  I  A  LD  SV   PTS
 *   10-21  Poxwalker   6"   4+  4+  3  4  1  2  1   5  6+     3
 *
 * EQUIPPED WITH: Each model is equipped with: Improvised weapons.
 *
 * WEAPONS:
 *   Improvised weapons  —  Melee  U  AP0  D1  —
 *
 * OPTIONS: — (none)
 *
 * ABILITIES (verbatim):
 *   Mark of Nurgle
 *   Mindless: This unit cannot be given orders. Instead, at the start of each friendly turn,
 *     the controlling player may move all Poxwalkers in this unit up to 6" towards the nearest
 *     enemy unit. After this move, the unit may not shoot, charge, or fight this turn.
 *   Slaves of Darkness: This model does not benefit from the Favoured unit rule. If this unit has
 *     a Daemonic patron, it may only take veterans abilities with the matching patron keyword
 *     (Khorne, Nurgle, Slaanesh, or Tzeentch).
 *
 * UNIT TYPE: Infantry
 * KEYWORDS: Death Guard
 *   (locked_mark: "Nurgle" — innate mark, no mark option group)
 *
 * ENGINE STATUS:
 *   ✓ stats, pts match HTML exactly ✓
 *   ✓ weapon matches HTML exactly ✓
 *   ✓ no options ✓
 *   ✓ locked_mark: "Nurgle" / has_veteran_abilities: false ✓
 *   ✓ default_size: 10 / min_cost: 30 ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const poxwalkers: Unit = {
  "name": "Poxwalkers",
  "models": [
    {
      "name": "Poxwalker",
      "points": 3,
      "min": 10,
      "max": 21,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "4",
        "W": "1",
        "I": "2",
        "A": "1",
        "LD": "5",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Improvised weapons.",
  "weapons": [
    {
      "name": "Improvised weapons",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Mark of Nurgle",
    "Mindless: The unit automatically passes every Leadership test. It can contest mission objectives, but never hold them.",
    "Slaves of Darkness: You may not select more Poxwalker units than Plague Marine units."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Death Guard"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": "Nurgle",
  "advisor": false,
  "slot": "Troops",
  "default_size": 10,
  "min_cost": 30
};
