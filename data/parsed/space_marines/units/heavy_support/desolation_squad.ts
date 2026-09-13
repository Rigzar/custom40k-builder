/**
 * DESOLATION SQUAD — Heavy Support
 *
 * SOURCE: Codex/Space Marines 1.04.ods, sheet "Desolation Squad". Verbatim:
 *
 *   5-10  Desolation Marine            6" 3+ 3+ S4 T4 W2 I4 A2 Ld7 Sv3+   70 pts
 *   1     Desolation Sergeant          6" 3+ 3+ S4 T4 W2 I4 A2 Ld7 Sv3+   70 pts
 *   *     Veteran Desolation Sergeant  6" 3+ 3+ S4 T4 W2 I4 A2 Ld8 Sv3+   80 pts
 *   Every model is equipped with: Castellan missile launcher; Bolt pistol; Frag grenades;
 *   Krak grenades.
 *
 *   Castellan missile launcher *
 *   - Castellan missile   36"  Assault 1  4  -1  1   Blast(4), Indirect
 *   - Krak missile        48"  Heavy 1    8  -3  2   AT(2), Anti-air
 *   Vengor launcher *
 *   - Castellan missile   36"  Assault 1  5  -1  1   Blast(4), Seeking
 *   - Vengor missile      48"  Heavy 1    9  -3  2   AT(2), Anti-air
 *
 *   OPTIONS
 *   • The Desloation Sergeant may swap their Castellan missile launcher: Vengor launcher +3
 *   • The Desolation Sergeant may be upgraded to a Veteran Desolation Sergeant for +10 points
 *     and gains access to weapons and gear from the Armory.
 *
 * THE 1.03 -> 1.04 RESTRUCTURE (September 2026) — this is not just a re-price:
 *   · 51/51/61 -> 70/70/80 pts, and the Vengor swap 22 -> 3.
 *   · The separate "Krak missile launcher" weapon is GONE, and with it the "Every model may
 *     swap their Castellan missile launcher -> Krak missile launcher +19" option. The Krak missile
 *     is now simply the SECOND PROFILE of the standard Castellan missile launcher, so every model
 *     has it for free.
 *   · Both launchers lose their "Frag missile" profile; the Castellan profile becomes Assault 1
 *     with Indirect (Seeking survives only on the Vengor launcher's Castellan profile, at S5).
 * Dropping an option group renumbers the ones after it, and `optionQty` is keyed by group INDEX -
 * so the removal is registered in engine/unitRenames.ts (REMOVED_OPTION_GROUPS) and saved lists
 * are shifted on load. Without that, a saved squad's Veteran upgrade would come back as a Vengor.
 *
 * ABILITY VOCABULARY: the sheet is written in the POST-clean-up names (Blast(4)); stored here in
 * the pre-clean-up vocabulary the other ~1400 profiles still use (Explosive), to be renamed with
 * everything else when that lands atomically.
 */

import type { Unit } from '../../../../../src/types/data';

export const desolationSquad: Unit = {
  "name": "Desolation Squad",
  "models": [
    {
      "name": "Desolation Marine",
      "points": 70,
      "min": 4,
      "max": 9,
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
        "SV": "3+"
      }
    },
    {
      "name": "Desolation Sergeant",
      "points": 70,
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
        "SV": "3+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Veteran Desolation Sergeant",
      "points": 80,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Castellan missile launcher; Bolt pistol; Frag grenades; Krak grenades.",
  "weapons": [
    {
      "name": "Bolt pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
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
      "name": "Krak grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Castellan missile launcher (Castellan)",
      "range": "36\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Blast(4), Indirect"
    },
    {
      "name": "Castellan missile launcher (Krak)",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-air"
    },
    {
      "name": "Vengor launcher (Castellan)",
      "range": "36\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Blast(4), Seeking"
    },
    {
      "name": "Vengor launcher (Vengor)",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-air"
    }
  ],
  "option_groups": [
    {
      "header": "The Desloation Sergeant may swap their Castellan missile launcher",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Vengor launcher",
          "points": 3
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Castellan missile launcher (Castellan)", "Castellan missile launcher (Krak)"]
    },
    {
      "header": "The Desolation Sergeant may be upgraded to a Veteran Desolation Sergeant for +10 points and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": "Veteran Desolation Sergeant",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Combat squads, They Shall Know No Fear"
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
  "slot": "Heavy Support",
  "default_size": 5,
  "min_cost": 350
};
