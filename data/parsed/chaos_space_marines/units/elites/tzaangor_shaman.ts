/**
 * TZAANGOR SHAMAN — Elites
 *
 * SOURCE: Chaos Space Marines ENG / Tzaangor Shaman.html (canonical datasheet)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME             M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   1    Tzaangor Shaman  6”   3+  3+  4  4  2  4  2   7  5+   31
 *
 * EQUIPPED WITH: A Tzaangor Shaman is a single character model equipped with: —.
 *   (HTML weapon table row shows all dashes — no weapons listed)
 *
 * WEAPONS: (none)
 *
 * OPTIONS:
 *   • Has armory access; up to 1 veteran ability
 *
 * ABILITIES (verbatim):
 *   Mark of Tzeentch
 *   Advisor: For every HQ selection, one Tzaangor Shaman may be selected without
 *     taking up an Elite slot.
 *   Bestial Prophet: The model and an attached unit of Tzaangors or Tzaangor Enlighteneds
 *     gain “Deflagrate(5+)” for all weapons.
 *   Psyker: A Tzaangor Shaman may cast and/or deny 1 psychic power.
 *     He knows smite as well as one psychic power of a chosen discipline.
 *   ENGINE TODO: enforce cast/deny limit and ‘chosen discipline’ mechanic.
 *
 * UNIT TYPE: Character model, Infantry (HTML lowercase ‘m’ → normalised “Character Model, Infantry”)
 * KEYWORDS: Thousand Sons, Psyker
 *
 * ENGINE STATUS:
 *   ✓ stats, pts match HTML exactly
 *   ✓ weapons: [] (no weapons on datasheet) ✓
 *   ✓ locked_mark: “Tzeentch” ✓
 *   ✓ advisor: true ✓
 *   ✓ has_armory_access: true / veteran_max: 1 ✓
 *   ✓ is_psyker: true / is_character: true ✓
 *   ✓ default_size: 1 / min_cost: 31 ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const tzaangorShaman: Unit = {
  "name": "Tzaangor Shaman",
  "models": [
    {
      "name": "Tzaangor Shaman",
      "points": 31,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Tzaangor Shaman is a single character model equipped with: -.",
  "weapons": [],
  "option_groups": [],
  "abilities": [
    "Mark of Tzeentch",
    "Advisor: For every HQ selection, one Tzaangor Shaman may be selected without taking up an Elite slot.",
    "Bestial Prophet: The model and an attached unit of Tzaangors or Tzaangor Enlighteneds gain \"Deflagrate(5+)\" for all weapons.",
    "Psyker: A Tzaangor Shaman may cast and/or deny 1 psychic power. He knows smite as well as one psychic power of a chosen discipline."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [
    "Thousand Sons",
    "Psyker"
  ],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": true,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": "Tzeentch",
  "advisor": true,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 31
};

