/**
 * HARPY — Flyers
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const harpy: Unit = {
  "name": "Harpy",
  "models": [
    {
      "name": "Harpy",
      "points": 213,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "T": "6",
        "W": "5",
        "I": "5",
        "A": "4",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Harpy is equipped with: Monstrous scything talons; Twin venom cannon; Spore Mine cysts.",
  "weapons": [
    {
      "name": "Monstrous scything talons",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "2",
      "abilities": "Flurry(1)"
    },
    {
      "name": "Spore Mine cysts",
      "range": "6\"",
      "type": "Heavy 2",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive, Indirect, Suppression"
    },
    {
      "name": "Stinger salvo",
      "range": "24\"",
      "type": "Assault 2",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Twin stranglethorn cannon",
      "range": "36\"",
      "type": "Assault 2",
      "s": "7",
      "ap": "0",
      "d": "1",
      "abilities": "AT(1), Barrage, Suppression"
    },
    {
      "name": "Twin venom cannon",
      "range": "36\"",
      "type": "Assault 2",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "May replace its Twin venom cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin stranglethorn cannon",
          "points": 0
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
          "name": "Stinger salvo",
          "points": 22
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
          "name": "Synaptic Node",
          "points": 15
        },
        {
          "name": "Regeneration",
          "points": 25
        },
        {
          "name": "Hardened Carapace",
          "points": 28
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
    "Hover Mode"
  ],
  "unit_type": "Flyer, Monstrous Creature",
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
  "slot": "Flyers",
  "default_size": 1,
  "min_cost": 213,
  "is_monster": false
};
