/**
 * SOLITAIRE — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const solitaire: Unit = {
  "name": "Solitaire",
  "models": [
    {
      "name": "Solitaire",
      "points": 94,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "2+",
        "BS": "2+",
        "S": "3",
        "T": "3",
        "W": "3",
        "I": "7",
        "A": "5",
        "LD": "10",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Solitaire is equipped with: Solitaire weapons.",
  "weapons": [
    {
      "name": "Solitaire weapons",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-4",
      "d": "2",
      "abilities": "Deadly(5+), Precision(4+)"
    }
  ],
  "option_groups": [
    {
      "header": "Only one Solitaire per army.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Anti-grav, Deep strike, Deflect, Fearless, Parry, Terrifying(-1)",
    "Blitz: Once per battle you can make a Blitz move. Add 1D6\" to the Charge and Attack characteristics until the end of this turn.",
    "Holo-suit: The model gains a 4+ invulnerability save.",
    "Impossible Form: The model can't be targeted by anything outside of 18\".",
    "Path of Damnation: The model can never be joined by other units."
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
  "default_size": 1,
  "min_cost": 94
};
