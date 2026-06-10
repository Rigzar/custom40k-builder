/**
 * FLAWLESS BLADES — Elites
 *
 * SOURCE: Chaos Space Marines ENG / Flawless Blades.html (canonical datasheet)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME           M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   3-6  Flawless Blade  8"   2+  3+  5  5  2  5  2   8  3+   54
 *
 * EQUIPPED WITH: Each model is equipped with: Blissblade; Bolt pistol.
 *
 * WEAPONS:
 *   Blissblade   —  Melee    S+1  AP-3  D1  Master-crafted, Precision(3+)
 *   Bolt pistol  12"  Pistol 1  S4  AP-1  D1  -
 *
 * OPTIONS:
 *   • May have up to 1 veteran ability.
 *   (No armory access of any kind — no champion model)
 *
 * ABILITIES (verbatim): Daemon, Mark of Slaanesh, Parry
 *
 * UNIT TYPE: Infantry
 * KEYWORDS: Emperor's Children
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons all match HTML exactly
 *   ✓ abilities: ["Daemon, Mark of Slaanesh, Parry"] ✓
 *   ✓ locked_mark: "Slaanesh" (from Mark of Slaanesh ability)
 *   ✓ has_veteran_abilities: true / veteran_max: 1
 *   ✓ champion_has_armory: false / has_armory_access: false (no armory on this datasheet)
 *   ✓ option_groups: [] (vet ability encoded as flag, no physical option choices)
 *   ✓ no armourKeyword (no Terminator/Cataphractii armour)
 */

import type { Unit } from '../../../../../src/types/data';

export const flawlessBlades: Unit = {
  "name": "Flawless Blades",
  "models": [
    {
      "name": "Flawless Blade",
      "points": 54,
      "min": 3,
      "max": 6,
      "stats": {
        "M": "8\"",
        "WS": "2+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "2",
        "I": "5",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Each model is equipped with: Blissblade; Bolt pistol.",
  "weapons": [
    {
      "name": "Blissblade",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "Master-crafted, Precision(3+)"
    },
    {
      "name": "Bolt pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Daemon, Mark of Slaanesh, Parry"
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Emperor's Children"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": "Slaanesh",
  "advisor": false,
  "slot": "Elites",
  "default_size": 3,
  "min_cost": 162
};
