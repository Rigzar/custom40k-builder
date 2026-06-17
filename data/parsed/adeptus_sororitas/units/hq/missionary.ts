/**
 * MISSIONARY — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const missionary: Unit = {
  "name": "Missionary",
  "models": [
    {
      "name": "Missionary",
      "points": 67,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "3",
        "I": "4",
        "A": "3",
        "LD": "8",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Missionary is equipped with: Frag grenades.",
  "weapons": [
    {
      "name": "Frag grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Faithful: Can recite 2 hymns per battle round. A hymn is successfully recited on a roll of 3+. Knows all Hymns of Battle.",
    "Most Pious: A Missionary increases the Faith Points during each Reinforcement phase by 1D3.",
    "Rosarius: This model has a 4+ invulnerability save."
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
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 67,
  "is_priest": true
};
