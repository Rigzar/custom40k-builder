/**
 * DEATH COMPANY — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const deathCompany: Unit = {
  "name": "Death Company",
  "models": [
    {
      "name": "Death Company Marine",
      "points": 41,
      "min": 5,
      "max": 15,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "4",
        "A": "3",
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Frag grenades; Krak grenades.",
  "weapons": [
    {
      "name": "Frag grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Krak grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "All model may be equipped with Jump packs for +9 points per model.",
      "constraint": {
        "type": "every"
      },
      "choices": [],
      "inline_pts": 9,
      "per_model": true,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Berserker(5+), Blind rage, Furious charge"
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
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
  "default_size": 5,
  "min_cost": 205
};
