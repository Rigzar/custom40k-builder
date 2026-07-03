/**
 * SWARMLORD — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and all powers from a chosen discipline."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const swarmlord: Unit = {
  "name": "Swarmlord",
  "models": [
    {
      "name": "Swarmlord",
      "points": 339,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "7",
        "T": "7",
        "W": "6",
        "I": "6",
        "A": "5",
        "LD": "10",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Swarmlord is equipped with: Bone sabres.",
  "weapons": [
    {
      "name": "Bone sabres",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Deadly(5+)"
    },
    {
      "name": "Monstrous flesh hooks",
      "range": "6\"",
      "type": "Pistol 8",
      "s": "6",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    }
  ],
  "option_groups": [
    {
      "header": "Only one Swarmlord per army.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": true
    },
    {
      "header": "May be equipped with one of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Monstrous flesh hooks",
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
          "name": "Regeneration",
          "points": 30
        },
        {
          "name": "Winged",
          "points": 53
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
    "Deflect, Fearless, Move Through Cover, Parry, Synapse",
    "Alien Cunning: A Swarmlord can decide once per game to get a +1/-1 modifier to rolls during the Reinforcement phase and/or a +1/-1 modifier during the Initiative phase. The ability may be used after rolls have been made by both players.",
    "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and all powers from a chosen discipline.",
    "Swarm Leader: Select an ability during each activation: Counter-attack, Favoured enemy, or Tank hunter. The ability is active for the model and the attached unit until the next activation.",
    "Warp Barrier: The model gains a 4+ invulnerability save."
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [
    "Tyranid"
  ],
  "is_vehicle": false,
  "is_character": false,
  "armory_as_character": true,
  "is_psyker": true,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 339,
  "is_monster": true
};
