/**
 * CHAOS BIKERS — Fast Attack
 *
 * SOURCE: Chaos Space Marines ENG / Chaos Biker.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME                          M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   2-9  Chaos Biker                   12"  3+  3+  4  5  3  4  2   7  3+   66
 *   1    Chaos Biker Champion          12"  3+  3+  4  5  3  4  2   7  3+   66
 *   *    Aspiring Chaos Biker Champion 12"  3+  3+  4  5  3  4  2   8  3+   76  (variant, Champion upgrade)
 *
 * EQUIPPED WITH: Each model is equipped with: Astartes chainsword; Bolt pistol;
 *   Combi-bolter; Frag grenades; Krak grenades.
 *
 * WEAPONS:
 *   Astartes Chainsword          -    Melee         SU   AP-1  D1  -
 *   Bolt pistol                 12"  Pistol 1      S4   AP-1  D1  -
 *   Combi-bolter                24"  Rapid fire 2  S4   AP-1  D1  -
 *   Combi-flamer - Bolter       24"  Rapid fire 1  S4   AP-1  D1  -
 *   Combi-flamer - Flamer        9"  Assault 4     S4   AP 0  D1  Flames
 *   Combi-melta - Bolter        24"  Rapid fire 1  S4   AP-1  D1  -
 *   Combi-melta - Melta         12"  Assault 1     S8   AP-5  D1  AT(1), Melta
 *   Combi-plasma - Bolter       24"  Rapid fire 1  S4   AP-1  D1  -
 *   Combi-plasma - Standard     24"  Rapid fire 1  S7   AP-3  D1  AT(1)
 *   Combi-plasma - Overcharged  24"  Rapid fire 1  S8   AP-4  D2  AT(2), Overheat
 *   Flamer                       9"  Assault 4     S4   AP 0  D1  Flames
 *   Frag grenade                 6"  Grenade 1     S4   AP 0  D1  Explosive
 *   Krak grenade                 6"  Grenade 1     S6   AP-2  D1  -
 *   Melta                       12"  Assault 1     S8   AP-5  D1  AT(1), Melta
 *   Plasma gun - Standard       24"  Rapid fire 1  S7   AP-3  D1  AT(1)
 *   Plasma gun - Overcharged    24"  Rapid fire 1  S8   AP-4  D2  AT(2), Overheat
 *
 *   NOTE: HTML source uses locale artefacts "Pistole 1"/"Granate 1" (German for
 *   "Pistol 1"/"Grenade 1") and labels combi-plasma sub-profiles "Plasma (Standard/
 *   Overcharged)". Production JSON is canonical here — both normalized; combi-weapon
 *   sub-profiles correctly split into separate "<combi> - <profile>" weapon entries.
 *
 * OPTIONS:
 *   • All models may receive a Mark of Chaos (per model): Khorne/Slaanesh/Nurgle +3pts,
 *     Tzeentch +7pts
 *   • Two Chaos Bikers may each be equipped with: Flamer +5 / Melta +17 / Plasma gun +22
 *   • Alternatively, two Chaos Bikers may each swap their Combi-bolter for:
 *     Combi-flamer +0 / Combi-melta +5 / Combi-plasma +10
 *   • The Chaos Biker Champion may be upgraded to an Aspiring Chaos Biker Champion for
 *     +10pts and gains access to weapons and gear from the Armory
 *   • May have up to 2 veteran abilities
 *
 * ABILITIES: -
 *
 * UNIT TYPE: Bike
 * KEYWORDS: Chaos Space Marine
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons all match HTML (normalizing locale artefacts above)
 *   ✓ variant_models: Aspiring Chaos Biker Champion (champion upgrade, variant_link)
 *   ✓ option_groups: mark (per-model) / fixed_max(2) weapon adds / fixed_max(2) combi-bolter
 *     swap / champion→variant "one" upgrade (inline_pts 10)
 *   ✓ champion_has_armory: true — matches "[Aspiring Champion] gains access to the Armory"
 *     (base Champion has no armory text; access only granted via the upgrade)
 *   ✓ has_veteran_abilities: true / veteran_max: 2
 *   ✓ unit_type: "Bike" / keywords: ["Chaos Space Marine"]
 *   ✓ default_size: 3 (2 Bikers + 1 Champion) / min_cost: 198 (2×66 + 1×66) ✓
 *   ✓ no armourKeyword (no Terminator/Cataphractii armour)
 */

import type { Unit } from '../../../../../src/types/data';

export const chaosBikers: Unit = {
  "name": "Chaos Bikers",
  "models": [
    {
      "name": "Chaos Biker",
      "points": 66,
      "min": 2,
      "max": 9,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "3",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "3+"
      }
    },
    {
      "name": "Chaos Biker Champion",
      "points": 66,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "3",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Aspiring Chaos Biker Champion",
      "points": 76,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "3",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "equipped_with": "Each model is equipped with: Astartes chainsword; Bolt pistol; Combi-bolter; Frag grenades; Krak grenades.",
  "weapons": [
    {
      "name": "Astartes Chainsword",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
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
      "name": "Combi-bolter",
      "range": "24\"",
      "type": "Rapid fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
    },
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
      "name": "Melta",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Combi-flamer - Bolter",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Combi-flamer - Flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Combi-melta - Bolter",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Combi-melta - Melta",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Combi-plasma - Bolter",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Combi-plasma - Standard",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Combi-plasma - Overcharged",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Overheat"
    },
    {
      "name": "Plasma gun - Standard",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Plasma gun - Overcharged",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Overheat"
    }
  ],
  "option_groups": [
    {
      "header": "All models may receive a Mark of Chaos (points per model)",
      "constraint": {
        "type": "mark"
      },
      "choices": [
        {
          "name": "Khorne",
          "points": 3
        },
        {
          "name": "Slaanesh",
          "points": 3
        },
        {
          "name": "Nurgle",
          "points": 3
        },
        {
          "name": "Tzeentch",
          "points": 7
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Two Chaos Bikers may be equipped with each each",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Flamer",
          "points": 5
        },
        {
          "name": "Melta",
          "points": 17
        },
        {
          "name": "Plasma gun",
          "points": 22
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Alternatively, two Chaos Bikers may swap their Combi-bolter each",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Combi-flamer",
          "points": 0
        },
        {
          "name": "Combi-melta",
          "points": 5
        },
        {
          "name": "Combi-plasma",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Combi-bolter"]
    },
    {
      "header": "The Chaos Biker Champion may be upgraded to an Aspiring Chaos Biker Champion for +10pts and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": "Aspiring Chaos Biker Champion",
      "is_unique_per_army": false
    }
  ],
  "abilities": [],
  "unit_type": "Bike",
  "keywords": [
    "Chaos Space Marine"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 2,
  "locked_mark": null,
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 3,
  "min_cost": 198
};
