/**
 * CRYPTEK — HQ
 *
 * SOURCE: Codex/Necrons 1.1.ods, "Cryptek" tab (2026-08-04 rework).
 *
 * The specialisation is now MANDATORY ("Must be upgraded to one of the following") and there are
 * eight of them, each at its own price, each bringing its own weapon — the base Cryptek's
 * equipment line is literally "-", so without an upgrade the model has no weapon at all. That is
 * why `constraint.required` is set: an un-upgraded Cryptek is not a legal model, not just an
 * unfinished one.
 *
 * Dynasty Scion is the odd one out: it is the only specialisation that changes the profile
 * (variant_models) and the only one with no weapon of its own.
 *
 * Its cost is 44, NOT the 45 printed in the variant's POINTS cell. The sheet gives the figure
 * twice and the two disagree — base 30 + the "+14pts" option row is 44 — and the author confirmed
 * 44 is correct (2026-08-05). engine/points.ts prices a `variant_link` choice off the variant's
 * own points and ignores the choice's, so the 44 has to live on the variant; the choice keeps its
 * "+14" so the option list still reads the way the datasheet prints it.
 */

import type { Unit } from '../../../../../src/types/data';

export const cryptek: Unit = {
  "name": "Cryptek",
  "models": [
    {
      "name": "Cryptek",
      "points": 30,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "10",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Dynasty Scion",
      "points": 44,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "3",
        "A": "2",
        "LD": "10",
        "SV": "4+"
      }
    }
  ],
  "equipped_with": "A Cryptek is equipped with: -.",
  "weapons": [
    {
      "name": "Abyssal lance",
      "range": "9\"",
      "type": "Assault 2",
      "s": "8",
      "ap": "*",
      "d": "*",
      "abilities": "Wound rolls are done against the target's Leadership value. Successfull wounds cause one Mortal Wound each."
    },
    {
      "name": "Aeonstave",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Shield breaker(-3)"
    },
    {
      "name": "Plasmic lance",
      "range": "18\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Staff of Light",
      "range": "18\"",
      "type": "Assault 3",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Staff of Time",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Quick(+3)"
    },
    {
      "name": "Tremorstave",
      "range": "18\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Monofilament"
    },
    {
      "name": "Voltaic staff",
      "range": "18\"",
      "type": "Assault 3",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Haywire"
    }
  ],
  "option_groups": [
    {
      "header": "Must be upgraded to one of the following. Each specialisation is unique per army",
      "constraint": {
        "type": "one",
        "required": true
      },
      "choices": [
        {
          "name": "Dynasty Scion",
          "points": 14,
          "unique_per_army": true,
          "variant_link": "Dynasty Scion"
        },
        {
          "name": "Astromancer",
          "points": 17,
          "unique_per_army": true,
          "effect": {
            "grants_weapons": [
              "Staff of Time"
            ]
          }
        },
        {
          "name": "Chronomancer",
          "points": 27,
          "unique_per_army": true,
          "effect": {
            "grants_weapons": [
              "Aeonstave"
            ]
          }
        },
        {
          "name": "Ethermancer",
          "points": 30,
          "unique_per_army": true,
          "effect": {
            "grants_weapons": [
              "Voltaic staff"
            ]
          }
        },
        {
          "name": "Technomancer",
          "points": 35,
          "unique_per_army": true,
          "effect": {
            "grants_weapons": [
              "Staff of Light"
            ]
          }
        },
        {
          "name": "Geomancer",
          "points": 40,
          "unique_per_army": true,
          "effect": {
            "grants_weapons": [
              "Tremorstave"
            ]
          }
        },
        {
          "name": "Plasmancer",
          "points": 45,
          "unique_per_army": true,
          "effect": {
            "grants_weapons": [
              "Plasmic lance"
            ]
          }
        },
        {
          "name": "Psychomancer",
          "points": 56,
          "unique_per_army": true,
          "effect": {
            "grants_weapons": [
              "Abyssal lance"
            ]
          }
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Command squad, Regeneration(1)",
    "Royal Court: If an Overlord is present, up to four Crypteks can be chosen that do not occupy an HQ slot. If a Lord is present, up to two Crypteks can be chosen that do not occupy an HQ slot.",
    "Astromancer: Prescient strike grants this model 2 re-rolls each. Additionally, this model's rolls for \"The Stars Are Right\" are always reduced by 1 (to a minimum of 0).",
    "Chronomancer: A Chronometron's ability may be used for this model or its attached unit. Additionally, a Timesplinter mantle grants \"Deflect\" and \"Parry\" to this model and its attached unit.",
    "Dynasty Scion: The model gains an improved profile (see above) and has additionally access to Lord equipment in the Armory.",
    "Ethermancer: An Ether crystal used by this model causes 2D3 hits. Additionally, this model's Lightning Field grants the \"Retribution(1)\" ability to its attached unit.",
    "Geomancer: A Harp of Dissonance used by this model has unlimited range. Additionally, a Seismic crucible grants its effect to this model and its attached unit.",
    "Plasmancer: A Gaze of Flame's effect may be used for this model and its attached unit. Additionally, this model and its attached unit are not affected by a Solar Pulse.",
    "Psychomancer: A Nightmare Shroud increases its radius to 18\" for this model. Additionally, a Veil of Darkness scatters 1D6 less (so normally only 1D6\") when used by this model.",
    "Technomancer: A Canoptek Cloak used by this model may repair 2 Wounds or 2 vehicle damage results per turn. Additionally, it may use a Canoptek Control Node a second time each activation."
  ],
  "unit_type": "Character Model, Infantry, Cryptek, Necron",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 44
};
