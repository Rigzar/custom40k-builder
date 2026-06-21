/**
 * SCARAB OCCULT TERMINATORS — Elites
 *
 * SOURCE: Chaos Space Marines ENG / Scarab Occult Terminators.html (canonical datasheet)
 * ─────────────────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.   NAME                     M    WS  BS  S  T  W  I  A  LD   SV  PTS
 *   4-8   Scarab Occult Terminator 6”   3+  3+  4  5  2  4  3   9   2+   79
 *   1     Scarab Occult Sorcerer   6”   3+  3+  4  5  2  4  3   9   2+   89
 *
 * EQUIPPED WITH: Each Terminator: Inferno combi-bolter; Prosperine khopesh.
 *   Sorcerer: Force stave; Inferno combi-bolter.
 *   (NOTE: HTML equipment section typo “Infero combi-bolter” — missing ‘n’;
 *    weapons table has correct “Inferno combi-bolter”; TS uses correct name)
 *
 * WEAPONS:
 *   Force stave              —    Melee        +3  AP-1  D1  Force weapon
 *   Heavy warpflamer          9”  Assault 4     5  AP-2  D1  Flames
 *   Hellfyre missile rack    36”  Heavy 2       8  AP-2  D2  AT(2), Anti-air
 *   Inferno combi-bolter     24”  Rapid fire 2  4  AP-2  D1  —
 *   Prosperine khopesh        —   Melee        +2  AP-2  D1  Soul burn(5+)
 *   Soulreaper cannon        24”  Heavy 4       6  AP-2  D1  Armor piercing(5+)
 *
 * OPTIONS:
 *   • One Terminator’s Inferno Combi-bolter → Heavy warpflamer+4 / Soulreaper cannon+19
 *   • At 9 models: another Terminator’s Inferno Combi-bolter → same swap
 *   • One model may receive Hellfyre Missile rack +64
 *   • At 9 models: additional Terminator may receive Hellfyre missile rack
 *   • Sorcerer has armory access; up to 1 veteran ability
 *
 * ABILITIES (verbatim):
 *   Deep strike, Mark of Tzeentch, Massive(1), Unyielding
 *   Crux Terminatus: This unit has a 5+ invulnerable save.
 *   Psyker: A Scarab Occult Sorcerer may cast and/or deny 1 psychic power.
 *     He knows smite as well as one psychic power of a chosen discipline.
 *   ENGINE TODO: enforce cast/deny limit and ‘chosen discipline’ mechanic.
 *
 * UNIT TYPE: Infantry
 * KEYWORDS: Thousand Sons, Psyker
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, all weapons match HTML exactly
 *   ✓ armourKeyword: “Terminator” — enforces ᵀ-gate for armory ✓
 *   ✓ locked_mark: “Tzeentch” ✓
 *   ✓ champion_has_armory: true (Sorcerer) ✓
 *   ✓ has_veteran_abilities: true / veteran_max: 1 ✓
 *   ✓ veteran_required: false (HTML: “up to 1 veteran ability” — optional) ✓
 *   ✓ is_psyker: true ✓
 *   ✓ default_size: 5 / min_cost: 405 (4×79 + 1×89 = 405) ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const scarabOccultTerminators: Unit = {
  "name": "Scarab Occult Terminators",
  "models": [
    {
      "name": "Scarab Occult Terminator",
      "points": 79,
      "min": 4,
      "max": 8,
      "stats": {
        "M": "6\"",
        "WS": "3+",
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
      "name": "Scarab Occult Sorcerer",
      "points": 89,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
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
  "equipped_with": "Each Scarab Occult Terminator is equipped with: Inferno combi-bolter; Prosperine khopesh. The Scarab Occult Sorcerer is equipped with: Force stave; Inferno combi-bolter.",
  "weapons": [
    {
      "name": "Force stave",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-1",
      "d": "1",
      "abilities": "Force weapon"
    },
    {
      "name": "Heavy warpflamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Hellfyre missile rack",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(2), Anti-air"
    },
    {
      "name": "Inferno combi-bolter",
      "range": "24\"",
      "type": "Rapid fire 2",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Prosperine khopesh",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "1",
      "abilities": "Soul burn(5+)"
    },
    {
      "name": "Soulreaper cannon",
      "range": "24\"",
      "type": "Heavy 4",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    }
  ],
  "option_groups": [
    {
      "header": "One Scarab Occult Terminator's Inferno Combi-bolter may be replaced by",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Heavy warpflamer",
          "points": 4
        },
        {
          "name": "Soulreaper cannon",
          "points": 19
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "If the unit consists of 9 models, another Scarab Occult Terminator's Inferno Combi-bolter may be replaced.",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Heavy warpflamer",
          "points": 4
        },
        {
          "name": "Soulreaper cannon",
          "points": 19
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One model may receive a Hellfyre Missile rack for +64 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 64,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "If the unit consists of 9 models, an additional Scarab Occult Terminator may receive a Hellfyre missile rack.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Deep strike, Mark of Tzeentch, Massive(1), Unyielding",
    "Crux Terminatus: This unit has a 5+ invulnerable save.",
    "Psyker: A Scarab Occult Sorcerer may cast and/or deny 1 psychic power. He knows smite as well as one psychic power of a chosen discipline."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Thousand Sons",
    "Psyker",
    "Sorcerer"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": true,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": "Tzeentch",
  "advisor": false,
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 405,
  "armourKeyword": "Terminator"
};

