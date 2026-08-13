/**
 * CANOPTEK TOMB STALKER — Heavy Support
 *
 * SOURCE: Necrons 1.1 (sheet fetched 2026-08-13), "Canoptek Tomb Stalker".
 * New datasheet — the Index lists it first in the Heavy Support column.
 *
 *   1-2  Tomb Stalker  12"  4+ 4+ 6  T7 W5  I4 A4 LD10 Sv3+   180 pts
 *   Every model is equipped with: 2 Gauss flayers; Monstrous automaton claws.
 *   OPTIONS  • Any number of models can each be equipped with: - Dark Prison, +5 points
 *   ABILITIES  Acute Senses, Deep Strike, Move Through Cover, Regeneration(1), Squadron
 *              Dark prison: The model can dispel 1 psychic power per battle round.
 *   UNIT TYPE  Monstrous Creature      KEYWORD  Canoptek
 *
 * The sheet writes the option as "Dark Prison" and the ability as "Dark prison"; the choice is
 * spelled to match the Armory item ("Dark prison", also on the Canoptek Spyders) so the purchase
 * resolves — a choice/item name mismatch here would be charged and grant nothing.
 */

import type { Unit } from '../../../../../src/types/data';

export const canoptekTombStalker: Unit = {
  "name": "Canoptek Tomb Stalker",
  "models": [
    {
      "name": "Tomb Stalker",
      "points": 180,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "4+",
        "S": "6",
        "T": "7",
        "W": "5",
        "I": "4",
        "A": "4",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: 2 Gauss flayers; Monstrous automaton claws.",
  "weapons": [
    {
      "name": "Gauss flayer",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Gauss"
    },
    {
      "name": "Monstrous automaton claws",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "2",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Any number of models can each be equipped with",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Dark prison",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Acute Senses, Deep Strike, Move Through Cover, Regeneration(1), Squadron",
    "Dark prison: The model can dispel 1 psychic power per battle round."
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [
    "Canoptek"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 180
};
