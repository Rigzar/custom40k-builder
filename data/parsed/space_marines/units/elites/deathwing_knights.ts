/**
 * DEATHWING KNIGHTS — Elites
 *
 * SOURCE: Space Marines ENG.ods, "Deathwing Knights" sheet (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * EQUIPPED WITH: Every model is equipped with: Power sword; Storm shield.
 *
 * OPTIONS:
 *   • Each model may replace their Power sword: Mace of Absolution +1pt
 *   • The Knight Master may replace his Power sword: Relic blade +7pts / Flail of the Unforgiven +8pts
 *   • The Knight Master has access to weapons and gear from the Armory.
 *   • The unit may gain one Veteran ability.
 *
 * ENGINE STATUS:
 *   🔴 The Knight Master's own "replace his Power sword" group had NO `replaces` link (found
 *      2026-06-21, global replaces audit) — added `replaces: ["Power sword"]`. Safe to sum with
 *      the squad-wide group above (both share one Power-sword-per-model pool across the unit's
 *      single combined `item.size`, unlike Carnifex Brood/Talos which have 2 weapon COPIES per
 *      model — same accumulation pattern already used for Traitor Guard's dual-group Lasgun swap).
 */

import type { Unit } from '../../../../../src/types/data';

export const deathwingKnights: Unit = {
  "name": "Deathwing Knights",
  "models": [
    {
      "name": "Knight",
      "points": 63,
      "min": 4,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "3",
        "LD": "9",
        "SV": "2+"
      }
    },
    {
      "name": "Knight Master",
      "points": 68,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "3",
        "LD": "9",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Power sword; Storm shield.",
  "weapons": [
    {
      "name": "Flail of the Unforgiven",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Deflagrate(2+)"
    },
    {
      "name": "Mace of Absolution",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Power sword",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Relic blade",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
      "d": "2",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Each model may replace their Power sword",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Mace of Absolution",
          "points": 1
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Power sword"]
    },
    {
      "header": "The Knight Master may replace his Power sword",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Relic blade",
          "points": 7
        },
        {
          "name": "Flail of the Unforgiven",
          "points": 8
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Power sword"]
    }
  ],
  "abilities": [
    "Combat squads, Deep Strike,Massive(1), They Shall Know No Fear",
    "Terminator armor: The model gains a 5+ invulnerability save."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "armourKeyword": "Terminator",
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 320
};
