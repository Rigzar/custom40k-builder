/**
 * TERVIGON — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and one power from a chosen discipline."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const tervigon: Unit = {
  "name": "Tervigon",
  "models": [
    {
      "name": "Tervigon",
      "points": 237,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "7",
        "T": "8",
        "W": "7",
        "I": "3",
        "A": "4",
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Tervigon is equipped with: Monstrous scything talons; Stinger salvo.",
  "weapons": [
    {
      "name": "Crushing claws",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Desiccator larvae",
      "range": "9\"",
      "type": "Assault 4",
      "s": "1",
      "ap": "0",
      "d": "1",
      "abilities": "Poison(2+)"
    },
    {
      "name": "Electroshock grubs",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Haywire"
    },
    {
      "name": "Monstrous scything talons",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1), Flurry(1)"
    },
    {
      "name": "Shreddershard beetles",
      "range": "9\"",
      "type": "Assault 4",
      "s": "3",
      "ap": "-1",
      "d": "1",
      "abilities": "Shred"
    },
    {
      "name": "Stinger salvo",
      "range": "24\"",
      "type": "Assault 2",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "May swap its Monstrous scything talons",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Crushing claws",
          "points": 6
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Monstrous scything talons"]
    },
    {
      "header": "May be equipped with one of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Desiccator larvae",
          "points": 7
        },
        {
          "name": "Shreddershard beetles",
          "points": 9
        },
        {
          "name": "Electroshock grubs",
          "points": 13
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May select one Special Biomorph",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Norn Crown",
          "points": 10
        },
        {
          "name": "Hardened Carapace",
          "points": 32
        },
        {
          "name": "Regeneration",
          "points": 35
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May additionally select any number of Basic and Advanced Biomorphs (see Armory).",
      "constraint": {
        "type": "fixed_max",
        "max": 16
      },
      "choices": [
        { "name": "Acid Maw", "points": 5 },
        { "name": "Adrenal Glands", "points": 5 },
        { "name": "Enhanced Senses", "points": 5 },
        { "name": "Heightened Reflexes", "points": 5 },
        { "name": "Pathogenesis", "points": 5 },
        { "name": "Relentless Hunger", "points": 5 },
        { "name": "Toxin Sacs", "points": 5 },
        { "name": "Acid Blood", "points": 5 },
        { "name": "Extremely Volatile", "points": 5 },
        { "name": "Implant Attack", "points": 5 },
        { "name": "Infrasonic Roar", "points": 5 },
        { "name": "Resonance Barb", "points": 5 },
        { "name": "Symbiote Rippers", "points": 3 },
        { "name": "Thornback", "points": 5 },
        { "name": "Tusked", "points": 5 },
        { "name": "Warped", "points": 5 }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Fearless, Move Through Cover, Synapse",
    "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and one power from a chosen discipline.",
    "Brood Progenitor: Roll 2D6 and discard the lowest die during each Reinforcement phase. You spawn the result as either Hormagaunt or Termagaunt (equipped with Flesh borers) models within 6\", but outside of engagement range with enemy models."
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [
    "Tyranid"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_psyker": true,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 237,
  "is_monster": true
};
