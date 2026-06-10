/**
 * EXALTED PLAGUE CHAMPION — Elites
 *
 * SOURCE: Chaos Space Marines ENG / Exalted Plague Champion.html (canonical datasheet)
 * ─────────────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME                    M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   1+   Exalted Plague Champion 6”   3+  3+  4  5  4  4  2   8  3+   62
 *
 * EQUIPPED WITH: Blight grenades; Krak grenades; Plague knife.
 *   Foul Blightspawn additionally equipped with: Plague sprayer.
 *
 * WEAPONS:
 *   Blight grenades           6”   Grenade 1   4  AP0   D1  Explosive, Poison(4+)
 *   Enhanced blight grenades  6”   Grenade 1   4  AP-1  D2  Explosive, Poison(4+)
 *   Krak grenades             6”   Grenade 1   6  AP-2  D1  —
 *   Plague knife              —    Melee       U  AP0   D1  Poison(4+)
 *   Plague sprayer            12”  Assault 4   6  AP-2  D1  Flames, Poison(4+)
 *
 * OPTIONS:
 *   • MUST upgrade to one of 5 specialisations (required: true):
 *     Noxious Blightbringer+5 / Tallyman+5 / Biologus Putrifier+10 /
 *     Foul Blightspawn+29 / Plague Surgeon+43
 *   • Has armory access; up to 1 veteran ability
 *   • Advisor: up to 5 per HQ unit (each specialisation once per HQ)
 *
 * ABILITIES (verbatim):
 *   Command squad, Mark of Nurgle
 *   Advisor: For every HQ unit, up to 5 Exalted Plague Champions without Elite slot.
 *   (NOTE: HTML typo “Foul Infiusion” in Biologus ability → corrected to “Foul Infusion” in TS)
 *
 * UNIT TYPE: Character Model, Infantry
 * KEYWORDS: Death Guard
 *
 * ENGINE STATUS:
 *   ✓ stats, pts match HTML exactly
 *   ✓ specialisation upgrade: required:true constraint ✓
 *   ✓ Plague Surgeon: effect.grants_abilities [“Warded”] ✓
 *   ✓ locked_mark: “Nurgle” ✓
 *   ✓ advisor: true ✓
 *   ✓ has_armory_access: true / veteran_max: 1 ✓
 *   ✓ default_size: 1 / min_cost: 62 ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const exaltedPlagueChampion: Unit = {
  "name": "Exalted Plague Champion",
  "models": [
    {
      "name": "Exalted Plague Champion",
      "points": 62,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "4",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Exalted Plague Champion is equipped with: Blight grenades; Krak grenades; Plague knife. A Foul Blightspawn is additionally equipped with: Plague sprayer.",
  "weapons": [
    {
      "name": "Blight grenades",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive, Poison(4+)"
    },
    {
      "name": "Enhanced blight grenades",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "-1",
      "d": "2",
      "abilities": "Explosive, Poison(4+)"
    },
    {
      "name": "Krak grenades",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Plague knife",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "0",
      "d": "1",
      "abilities": "Poison(4+)"
    },
    {
      "name": "Plague sprayer",
      "range": "12\"",
      "type": "Assault 4",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames, Poison(4+)"
    }
  ],
  "option_groups": [
    {
      "header": "Must be upgraded to one of the following",
      "constraint": {
        "type": "one",
        "required": true
      },
      "choices": [
        {
          "name": "Noxious Blightbringer",
          "points": 5,
          "abilities": [
            "Bell of Demise: Enemy attempts at Hymns, Invocations, Prayers and Psychic powers within 21\" of the model get -1 penalty to succeed."
          ]
        },
        {
          "name": "Tallyman",
          "points": 5,
          "abilities": [
            "The Seven-fold Chant: Roll 2D6 each time the Tallyman is activated. On a roll of 7+, any of your own die may be re-rolled later in the game."
          ]
        },
        {
          "name": "Biologus Putrifier",
          "points": 10,
          "abilities": [
            "Blight Racks: The Biologus Putrifier and any attached unit uses the \"Enhanced blight grenades\" profile for their Blight grenades.",
            "Foul Infusion: All melee attacks of the Biologus Putrifier and his attached unit gain the \"Deadly(5+)\" ability.",
            "Putrid Explosion: If the Biologus Putrifier is killed roll a die. On a 4+ he explodes like a vehicle with a 6\" radius."
          ]
        },
        {
          "name": "Foul Blightspawn",
          "points": 29,
          "abilities": [
            "Putrefying Stink: All enemy models in the same melee combat with the Foul Blightspawn suffer a -1 penalty to their Initiative."
          ]
        },
        {
          "name": "Plague Surgeon",
          "points": 43,
          "effect": { "grants_abilities": ["Warded"] },
          "abilities": [
            "Tainted Narthecium: Once per turn, the damage of a wound against the model or attached unit can be reduced by 1. The ability must be declared after armor and saving throws. Does not work against weapons with a Strength of 8 or higher.",
            "Surgeon: The Plague Surgeon and any attached unit of Plague Marines gain the \"Warded\" ability."
          ]
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Command squad, Mark of Nurgle",
    "Advisor: For every HQ unit, you may select up to 5 Exalted Plague Champions without using up an Elite slot. Each specialisation can only be selected once per HQ unit."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [
    "Death Guard"
  ],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": "Nurgle",
  "advisor": true,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 62
};

