/**
 * ZOANTHROPE BROOD — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const zoanthropeBrood: Unit = {
  "name": "Zoanthrope Brood",
  "models": [
    {
      "name": "Zoanthrope",
      "points": 95,
      "min": 1,
      "max": 6,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "10",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Warp lightning.",
  "weapons": [
    {
      "name": "Warp lightning - Dispersed",
      "range": "24\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-3",
      "d": "1",
      "abilities": "Explosive, Seeking"
    },
    {
      "name": "Warp lightning - Focused",
      "range": "18\"",
      "type": "Assault 1",
      "s": "10",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Seeking"
    }
  ],
  "option_groups": [
    {
      "header": "May select one Special Biomorph",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Hardened Carapace",
          "points": 4
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
    "Anti-Grav, Fearless, Massive(1), Synapse",
    "Warp Barrier: The model gains a 4+ invulnerability save."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Tyranid"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 95,
  "is_monster": false
};
