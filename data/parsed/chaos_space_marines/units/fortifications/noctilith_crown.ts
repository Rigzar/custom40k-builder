/**
 * NOCTILITH CROWN — Fortifications
 *
 * SOURCE: Chaos Space Marines ENG / Noctilith Crown.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME             M   WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
 *   1    Noctilith Crown  -    -  6+  6    11    11    11   -  -   2  100
 *
 * EQUIPPED WITH: A Noctilith Crown is equipped with: Lashing warp energies.
 *
 * WEAPONS:
 *   Lashing warp energies  12"  Assault 4  S5  AP 0  D1  Flames
 *
 * OPTIONS: -  (none — source row is "-")
 *
 * ABILITIES (verbatim):
 *   Infiltrator
 *   Unholy Conduit: A friendly unit starting its activation within 12" of the
 *   Noctilith Crown can attempt to pray to the Dark Gods. Roll 2D6. On a roll of 6+,
 *   the unit gains the effect of a prayer from the sheet "Prayers to the Dark Gods".
 *   On any roll below 6 it gets hit with the Lashing warp energies profile.
 *   Unmanned: A Noctilith Crown can't contest or capture mission objectives.
 *   Warp explosion: If the model is destroyed, it always explodes. The explosion
 *   range is 6".
 *
 * UNIT TYPE: Vehicle
 * KEYWORDS: Fortification
 *
 * ENGINE STATUS:
 *   ✓ stats (M/WS/I/A all "-" — static emplacement, same convention as Miasmic
 *     Malignifier), pts, weapons, abilities all match HTML verbatim
 *   ✓ option_groups: [] (source OPTIONS row is literal "-" — no purchasable options)
 *   ✓ has_veteran_abilities: false / has_armory_access: false / locked_mark: null
 *     (no Mark line in ABILITIES, unlike the Death Guard-keyword Miasmic Malignifier
 *     — this is a faction-neutral Fortification)
 *   ✓ keywords: ["Fortification", "Vehicle"] — "Vehicle" appended to the source's
 *     single "Fortification" keyword, consistent with the vehicle-keyword convention
 *   ✓ is_vehicle: true / unit_type: "Vehicle" / default_size: 1 / min_cost: 100
 *   🟡 Unholy Conduit/Unmanned/Warp explosion all text-only special rules — no
 *     dedicated engine primitives (prayer-roll-on-proximity, objective-denial,
 *     explosion-on-death); consistent with the established "verbatim text, no
 *     mechanical simulation" treatment seen on Miasmic Malignifier and CSM vehicles
 *   (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)
 */

import type { Unit } from '../../../../../src/types/data';

export const noctilithCrown: Unit = {
  "name": "Noctilith Crown",
  "models": [
    {
      "name": "Noctilith Crown",
      "points": 100,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "-",
        "WS": "-",
        "BS": "6+",
        "S": "6",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "11",
        "I": "-",
        "A": "-",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Noctilith Crown is equipped with: Lashing warp energies.",
  "weapons": [
    {
      "name": "Lashing warp energies",
      "range": "12\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Infiltrator",
    "Unholy Conduit: A friendly unit starting its activation within 12\" of the Noctilith Crown can attempt to pray to the Dark Gods. Roll 2D6. On a roll of 6+, the unit gains the effect of a prayer from the sheet \"Prayers to the Dark Gods\". On any roll below 6 it gets hit with the Lashing warp energies profile.",
    "Unmanned: A Noctilith Crown can't contest or capture mission objectives.",
    "Warp explosion: If the model is destroyed, it always explodes. The explosion range is 6\"."
  ],
  "unit_type": "Vehicle",
  "keywords": [
    "Fortification",
    "Vehicle"
  ],
  "is_vehicle": true,
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
  "slot": "Fortifications",
  "default_size": 1,
  "min_cost": 100
};

