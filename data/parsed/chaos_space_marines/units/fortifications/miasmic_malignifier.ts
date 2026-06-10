/**
 * MIASMIC MALIGNIFIER — Fortifications
 *
 * SOURCE: Chaos Space Marines ENG / Miasmic Malignifier.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME                 M   WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
 *   1    Miasmic Malignifier  -    -  6+  6    12    12    12   -  -   3  125
 *
 * EQUIPPED WITH: A Miasmic Malignifier is equipped with: Noxious stink.
 *
 * WEAPONS:
 *   Noxious stink   6"  Assault 4  S4  AP 0  D1  Flames, Poison(4+)
 *
 * OPTIONS: -  (none — source row is "-")
 *
 * ABILITIES (verbatim):
 *   Infiltrator, Mark of Nurgle
 *   Unmanned: A Miasmic Malignifier can't contest or capture mission objectives.
 *   Pest explosion: If the model is destroyed, it always explodes. The explosion
 *   range is 6".
 *   Putrescent Fog: At the start of each activation, the model can create a Putrescent
 *   Fog with a "Stand & Shoot" command. To do so, place a Putrescent Fog marker
 *   (a 3" radius circle) within 7" of any friendly unit bearing the Mark of Nurgle.
 *   All enemy units treat the zone as difficult terrain and must take one Toughness
 *   test per model if they touch or move over the circle during their activation.
 *   For each failed test, the unit suffers one Mortal Wound.
 *
 * UNIT TYPE: Vehicle
 * KEYWORDS: Death Guard, Fortification
 *
 * ENGINE STATUS:
 *   ✓ stats (M/WS/I/A all "-" — static emplacement, no melee/movement profile),
 *     pts, weapons, abilities all match HTML verbatim
 *   ✓ option_groups: [] (source OPTIONS row is literal "-" — no purchasable options)
 *   ✓ has_veteran_abilities: false / has_armory_access: false (no such lines in text)
 *   ✓ locked_mark: "Nurgle" — sourced from the "Mark of Nurgle" entry inside the
 *     ABILITIES row (baked-in, not a purchasable option — same convention as
 *     Plagueburst Crawler's locked_mark)
 *   ✓ keywords: ["Death Guard", "Fortification", "Vehicle"] — "Vehicle" appended to
 *     the source's listed "Death Guard, Fortification" keywords, consistent with
 *     the vehicle-keyword convention
 *   ✓ is_vehicle: true / unit_type: "Vehicle" / default_size: 1 / min_cost: 125
 *   🟡 Unmanned/Pest explosion/Putrescent Fog all text-only special rules — no
 *     dedicated engine primitives (objective-denial, explosion-on-death, terrain-
 *     marker-creation); consistent with the established "verbatim text, no mechanical
 *     simulation" treatment seen across CSM vehicles and fortifications
 *   (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)
 */

import type { Unit } from '../../../../../src/types/data';

export const miasmicMalignifier: Unit = {
  "name": "Miasmic Malignifier",
  "models": [
    {
      "name": "Miasmic Malignifier",
      "points": 125,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "-",
        "WS": "-",
        "BS": "6+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "12",
        "REAR": "12",
        "I": "-",
        "A": "-",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Miasmic Malignifier is equipped with: Noxious stink.",
  "weapons": [
    {
      "name": "Noxious stink",
      "range": "6\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames, Poison(4+)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Infiltrator, Mark of Nurgle",
    "Unmanned: A Miasmic Malignifier can't contest or capture mission objectives.",
    "Pest explosion: If the model is destroyed, it always explodes. The explosion range is 6\".",
    "Putrescent Fog: At the start of each activation, the model can create a Putrescent Fog with a \"Stand & Shoot\" command. To do so, place a Putrescent Fog marker (a 3\" radius circle) within 7\" of any friendly unit bearing the Mark of Nurgle. All enemy units treat the zone as difficult terrain and must take one Toughness test per model if they touch or move over the circle during their activation. For each failed test, the unit suffers one Mortal Wound."
  ],
  "unit_type": "Vehicle",
  "keywords": [
    "Death Guard",
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
  "locked_mark": "Nurgle",
  "advisor": false,
  "slot": "Fortifications",
  "default_size": 1,
  "min_cost": 125
};

