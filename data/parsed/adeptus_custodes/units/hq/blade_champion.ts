/**
 * BLADE CHAMPION — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const bladeChampion: Unit = {
  "name": "Blade Champion",
  "models": [
    {
      "name": "Blade Champion",
      "points": 125,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "5",
        "A": "4",
        "LD": "9",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Blade Champion is equipped with: Vaultswords.",
  "weapons": [
    {
      "name": "Vaultswords",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "2",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Has acces to weapons and gear from the Armory.",
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
    "Massive(1), Parry, Shield Host",
    "Custodian armor: The model gains a 5+ invulnerability save.",
    "Fighting style: During every activation, the Blade Champion may pick one of the following abilities for their Vaultswords:\n1. Behemor - Armor piercing(5+)\n2. Hurricanis - Flurry(2)\n3. Victus - Precision(5+)",
    "Martial superiority: The model can re-roll 1 to hit and 1 to wound roll."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 125
};
