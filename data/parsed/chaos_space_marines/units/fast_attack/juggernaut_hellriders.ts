/**
 * JUGGERNAUT HELLRIDERS — Fast Attack
 *
 * SOURCE: Chaos Space Marines ENG / Juggernaut Hellriders.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME                M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   2-7  Hellrider           12"  3+  3+  5  5  4  4  4   8  3+  104
 *   1    Hellrider Champion  12"  3+  3+  5  5  4  4  4   8  3+  109
 *
 * EQUIPPED WITH: Each model is equipped with: Chainaxe; Bolt pistol; Frag grenades;
 *   Krak grenades.
 *
 * WEAPONS:
 *   Bolt pistol               12"  Pistol 1  S4   AP-1  D1  -
 *   Eviscerator                -   Melee     Sx2  AP-3  D2  AT(2), Armorbane, Slow(-2), Unwieldy
 *   Frag grenade               6"  Grenade 1 S4   AP 0  D1  Explosive
 *   Krak grenade               6"  Grenade 1 S6   AP-2  D1  -
 *   Chainaxe                   -   Melee     S+1  AP-1  D1  -
 *   Plasma pistol - Standard  12"  Pistol 1  S7   AP-3  D1  AT(1)
 *   Plasma pistol - Overcharged 12" Pistol 1 S8   AP-4  D2  AT(2), Overheat
 *
 * OPTIONS:
 *   • For each 4 models, two "Berzerkers" may swap their Bolt pistols for:
 *     Plasma pistol +8 / Eviscerator +12
 *   • The Hellrider Champion has access to the armory
 *   • This unit may receive one veteran ability
 *
 *   NOTE: the source text literally says "two Berzerkers may swap their Bolt pistols" —
 *   this unit is "Hellrider", not "Berzerker"; reads as a copy-paste artefact from the
 *   Khorne Berzerkers datasheet (same per_n(4,2) swap shape/options). Per FAQ #5 the
 *   canonical text stands as written; production JSON correctly applies the swap to
 *   THIS unit's own models (per_n constraint targets "this unit", not Berzerkers).
 *
 * ABILITIES (verbatim):
 *   Berserk(5+), Blind Rage, Mark of Khorne
 *
 * UNIT TYPE: Bike
 * KEYWORDS: World Eaters
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons, options, abilities all match HTML verbatim
 *   ✓ option_groups: per_n(4, count_per_n:2) Bolt pistol swap (Plasma pistol/Eviscerator)
 *   ✓ champion_has_armory: true (matches "Hellrider Champion has access to the armory")
 *   ✓ has_veteran_abilities: true / veteran_max: 1 ("may receive one veteran ability")
 *   ✓ locked_mark: "Khorne" (from "Mark of Khorne" ability — locked, no mark choice offered)
 *   ✓ unit_type: "Bike" / keywords: ["World Eaters"]
 *   ✓ default_size: 3 (2 Hellriders + 1 Champion) / min_cost: 317 (2×104 + 109) ✓
 *   ✓ no armourKeyword (no Terminator/Cataphractii armour)
 */

import type { Unit } from '../../../../../src/types/data';

export const juggernautHellriders: Unit = {
  "name": "Juggernaut Hellriders",
  "models": [
    {
      "name": "Hellrider",
      "points": 104,
      "min": 2,
      "max": 7,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "4",
        "I": "4",
        "A": "4",
        "LD": "8",
        "SV": "3+"
      }
    },
    {
      "name": "Hellrider Champion",
      "points": 109,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "4",
        "I": "4",
        "A": "4",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Each model is equipped with: Chainaxe; Bolt pistol; Frag grenades; Krak grenades.",
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
      "name": "Eviscerator",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Armorbane, Slow(-2), Unwieldy"
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
      "name": "Chainaxe",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Plasma pistol - Standard",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Plasma pistol - Overcharged",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Overheat"
    }
  ],
  "option_groups": [
    {
      "header": "For each 4 models, two Berzerkers may swap their Bolt pistols",
      "constraint": {
        "type": "per_n",
        "per_n": 4,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Plasma pistol",
          "points": 8
        },
        {
          "name": "Eviscerator",
          "points": 12
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Bolt pistol"]
    }
  ],
  "abilities": [
    "Berserk(5+), Blind Rage, Mark of Khorne"
  ],
  "unit_type": "Bike",
  "keywords": [
    "World Eaters"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": "Khorne",
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 3,
  "min_cost": 317
};
