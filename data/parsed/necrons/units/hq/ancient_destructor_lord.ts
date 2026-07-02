/**
 * ANCIENT DESTRUCTOR LORD — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const ancientDestructorLord: Unit = {
  "name": "Ancient Destructor Lord",
  "models": [
    {
      "name": "Nekrosor Lord",
      "points": 420,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "2+",
        "BS": "2+",
        "S": "7",
        "T": "7",
        "W": "7",
        "I": "4",
        "A": "4",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Nekrosor Lord is equipped with: Enmitic disintegrators; Blade tail; Unmaker Gauntlet.",
  "weapons": [
    {
      "name": "Blade tail",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "Flurry(2)"
    },
    {
      "name": "Enmitic disintegrators",
      "range": "12\"",
      "type": "Rapid Fire 2",
      "s": "6",
      "ap": "-3",
      "d": "2",
      "abilities": "Deflagrate(5+)"
    },
    {
      "name": "Unmaker Gauntlet",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(2), Flurry(2), Unwieldy"
    }
  ],
  "option_groups": [
    {
      "header": "Only one Nekrosor Lord per army.",
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
    "Favoured enemy(everything), Furious Charge, Regeneration(1)",
    "Royal Necrodermis: Reduces AP of enemy attacks by -1 (to a minimum of 0).",
    "Whip coils: Enemy models in base contact get -1 attack in close combat, to a minimum of 1. Stacks with itself."
  ],
  "unit_type": "Jump Pack, Monstrous Creature, Lord, Necron",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": true,
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
  "min_cost": 420
};
