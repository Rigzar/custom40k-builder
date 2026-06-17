/**
 * GREAT HARLEQUIN — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const greatHarlequin: Unit = {
  "name": "Great Harlequin",
  "models": [
    {
      "name": "Great Harlequin",
      "points": 73,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "8\"",
        "WS": "2+",
        "BS": "2+",
        "S": "3",
        "T": "3",
        "W": "3",
        "I": "7",
        "A": "5",
        "LD": "9",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Great Harlequin is equipped with: Great Harlequin weapons; Plasma grenade.",
  "weapons": [
    {
      "name": "Great Harlequin weapons",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-4",
      "d": "2",
      "abilities": "Precision(5+)"
    },
    {
      "name": "Plasma grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "Only one Great Harlequin per army.",
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
    "Anti-grav, Deflect, Parry, Terrifying(-1)",
    "Cegorach’s Favour: The model may re-roll any one die per activation.",
    "Holo-suit: The model gains a 4+ invulnerability save."
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
  "min_cost": 73
};
