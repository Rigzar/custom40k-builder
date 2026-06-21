/**
 * SPORECYST — Fortifications
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const sporecyst: Unit = {
  "name": "Sporecyst",
  "models": [
    {
      "name": "Sporocyst",
      "points": 139,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "-",
        "WS": "5+",
        "BS": "5+",
        "S": "6",
        "T": "6",
        "W": "5",
        "I": "3",
        "A": "4",
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Spore Mine",
      "points": 1,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "-",
        "BS": "-",
        "S": "1",
        "T": "1",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "1",
        "SV": "6+"
      }
    }
  ],
  "equipped_with": "A Sporocyst is equipped with: 5 Deathspitters.",
  "weapons": [
    {
      "name": "Barbed strangler",
      "range": "36\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Barrage, Suppression"
    },
    {
      "name": "Deathspitter",
      "range": "24\"",
      "type": "Assault 2",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Venom cannon",
      "range": "36\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "May replace all Deathspitters",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "5 Barbed stranglers",
          "points": 24
        },
        {
          "name": "5 Venom cannons",
          "points": 36
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May additionally select any number of Basic and Advanced Biomorphs (see Armory).",
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
    "Infiltrator, Mindless, Move Through Cover (Spore Mine only)",
    "Living ammunition (Spore Mine only): The unit immediately explodes like a vehicle (one explosion per model) with the \"Spore Mine launcher\" profile, if an enemy model comes within 3\" distance.",
    "Spore Node: In addition of shooting at an enemy, a Sporocyst may create one unit of Spore Mines (3 models each) within 6\" of itself and at least 1\" away from any enemy unit.",
    "Psychoc Resonator: Any Synapse creature within 6\" of the Sporocyst increases the range of its Synapse by 50%."
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [
    "Tyranid"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Fortifications",
  "default_size": 1,
  "min_cost": 139,
  "is_monster": false
};
