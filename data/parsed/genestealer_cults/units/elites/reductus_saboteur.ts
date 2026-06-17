/**
 * REDUCTUS SABOTEUR — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const reductusSaboteur: Unit = {
  "name": "Reductus Saboteur",
  "models": [
    {
      "name": "Reductus Saboteur",
      "points": 42,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "2+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Reductus Saboteur is equipped with: Autopistol; Remote explosives.",
  "weapons": [
    {
      "name": "Autopistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Remote explosives - Blasting charges",
      "range": "24\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Remote explosives - Demolition charge",
      "range": "6\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "Ammo(1), AT(2), Barrage, Seeking"
    }
  ],
  "option_groups": [
    {
      "header": "For every 500 points of game size, one Reductus Saboteur may be included in the army that does not take up an Elite slot.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 500,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "1 Additional demolition charge",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Ambush, Command Squad, Infiltrator, Use cover",
    "Hidden explosives: Instead of using it like a ranged weapon, the model may set up any Demolition charge it posseses hidden on the table. Place three markers for each Demolition charge face down anywhere on the table that is outside of the enemy deployment zone. Two of these three markers are duds and don't do anything when revealed, while the actual marker causes one automatic hit with the profile of a Demolition charge. Markers are revealed the first time an enemy unit moves within 3\" of the marker during its activation.",
    "Unquestioning Loyalty: This model may join any Genestealer Cults creature unit (regardless of their unit type). Additionally, that unit gains the \"Bodyguard\" ability."
  ],
  "unit_type": "Character Model, Infantry",
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
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 42
};
