/**
 * HIVE TYRANT — HQ
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

export const hiveTyrant: Unit = {
  "name": "Hive Tyrant",
  "models": [
    {
      "name": "Hive Tyrant",
      "points": 256,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "7",
        "T": "7",
        "W": "6",
        "I": "5",
        "A": "4",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Hive Tyrant is equipped with: 2 Monstrous scything talons.",
  "weapons": [
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
      "name": "Heavy venom cannon",
      "range": "36\"",
      "type": "Assault 1",
      "s": "9",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Explosive"
    },
    {
      "name": "Lash whip and Monstrous bonesword",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Quick(+1)"
    },
    {
      "name": "Monstrous boneswords",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Deadly(5+)"
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
      "name": "Monstrous piercing claws",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "2",
      "abilities": "Armor piercing(5+), AT(1)"
    },
    {
      "name": "Prehensile pincer",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(3), Extra Attack(1)"
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
      "name": "Stranglethorn cannon",
      "range": "36\"",
      "type": "Assault 1",
      "s": "7",
      "ap": "0",
      "d": "1",
      "abilities": "AT(1), Barrage, Suppression"
    },
    {
      "name": "Twin deathspitter with slimer maggots",
      "range": "24\"",
      "type": "Assault 4",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin devourer with brainleech worms",
      "range": "18\"",
      "type": "Rapid Fire 4",
      "s": "U",
      "ap": "0",
      "d": "1",
      "abilities": "AT(1), Shred"
    }
  ],
  "option_groups": [
    {
      "header": "May swap one of its Monstrous scything talons",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Monstrous piercing claws",
          "points": 0
        },
        {
          "name": "Lash whip and Monstrous bonesword",
          "points": 5
        },
        {
          "name": "Twin devourer with brainleech worms",
          "points": 8
        },
        {
          "name": "Stranglethorn cannon",
          "points": 19
        },
        {
          "name": "Twin deathspitter with slimer maggots",
          "points": 25
        },
        {
          "name": "Heavy venom cannon",
          "points": 113
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Monstrous scything talons"]
    },
    {
      "header": "May also swap the other Monstrous scything talons",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Monstrous piercing claws",
          "points": 0
        },
        {
          "name": "Lash whip and Monstrous bonesword",
          "points": 5
        },
        {
          "name": "Twin devourer with brainleech worms",
          "points": 8
        },
        {
          "name": "Stranglethorn cannon",
          "points": 19
        },
        {
          "name": "Twin deathspitter with slimer maggots",
          "points": 25
        },
        {
          "name": "Heavy venom cannon",
          "points": 113
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
          "name": "Prehensile pincer",
          "points": 20
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
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
          "points": 15
        },
        {
          "name": "Electroshock grubs",
          "points": 22
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be upgraded to one of the following specialisation",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Hive Commander",
          "points": 5
        },
        {
          "name": "Indescribable Horror",
          "points": 10
        },
        {
          "name": "Old Adversary",
          "points": 15
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
          "points": 42
        },
        {
          "name": "Hardened Carapace",
          "points": 47
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
    "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and all powers from a chosen discipline.",
    "Warp Barrier: The model gains a 4+ invulnerability save.",
    "Hive Commander: Select two units from your army. Both gain the \"Outflank\" ability.",
    "Indescribable Horror: Units taking a Leadership test caused by this model must roll an extra dice when taking the test and use the highest two results. In most circumstances, this will mean the unit rolls 3D6 and discards the lowest dice roll.",
    "Old Adversary: The model may re-roll one to hit and one to wound roll each battle round."
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
  "min_cost": 256,
  "is_monster": true
};
