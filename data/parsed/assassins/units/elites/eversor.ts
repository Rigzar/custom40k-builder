/**
 * EVERSOR — Elites
 *
 * SOURCE: Assassins ENG.ods / Eversor sheet
 * ─────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME     M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   1    Eversor  6"   2+  2+  4  4  4  6  4   9  6+  125
 *
 * EQUIPPED WITH: A Eversor is equipped with: Executioner pistol; Melta bombs; Neuro gauntlet.
 *
 * WEAPONS:
 *   Executioner pistol  12"  Pistol 2   4  -3  2  Poison(2+)
 *   Melta bombs          3"  Grenade 1  8  -5  2  Armorbane, AT(3)
 *   Neuro gauntlet       -   Melee     +1  -3  2  Flurry(2), Shred
 *
 * OPTIONS: none
 *
 * UNIT TYPE: Infantry
 * KEYWORDS: none
 *
 * ENGINE STATUS:
 *   ✓ stats, pts match .ods exactly
 *   ✓ weapons match .ods exactly
 *   ✓ no options
 *   ✓ is_character: false, is_psyker: false, has_armory_access: false
 */

import type { Unit } from '../../../../../src/types/data';

export const eversor: Unit = {
  "name": "Eversor",
  "models": [
    {
      "name": "Eversor",
      "points": 125,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "4",
        "T": "4",
        "W": "4",
        "I": "6",
        "A": "4",
        "LD": "9",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Eversor is equipped with: Executioner pistol; Melta bombs; Neuro gauntlet.",
  "weapons": [
    {
      "name": "Executioner pistol",
      "range": "12\"",
      "type": "Pistol 2",
      "s": "4",
      "ap": "-3",
      "d": "2",
      "abilities": "Poison(2+)"
    },
    {
      "name": "Melta bombs",
      "range": "3\"",
      "type": "Grenade 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "Armorbane, AT(3)"
    },
    {
      "name": "Neuro gauntlet",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "2",
      "abilities": "Flurry(2), Shred"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Deep Strike, Deflect, Frenzy(6\"), Furious Charge, Hit & Run, Infiltrator, Move through cover, Parry",
    "Bio Meltdown: After the unit is eliminated, all units within a 6\" radius suffer 2D3 Mortal Wounds.",
    "Hyper metabolism: The model gets 1D6+1 bonus attacks for charging instead of just 1.",
    "Lightning reflexes: The model gains a 4+ invulnerability save.",
    "Stim Overdrive: Once per game the unit can double its attacks. Decide to use this rule when it is the Eversor's turn to fight in melee. Then remove the unit and execute the “Bio meltdown” rule.",
    "Cults Abominatioe: Any Chaos army may select either a single Assassin or one of each for a single Elite slot.",
    "Execution Force: Any Imperial army may select either a single Assassin or one of each for a single Elite slot."
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
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 125
};
