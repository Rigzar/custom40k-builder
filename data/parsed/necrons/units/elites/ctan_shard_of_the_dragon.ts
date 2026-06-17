/**
 * C'TAN SHARD OF THE DRAGON — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const ctanShardOfTheDragon: Unit = {
  "name": "C'tan Shard of the Dragon",
  "models": [
    {
      "name": "Dragon",
      "points": 300,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "6",
        "T": "7",
        "W": "6",
        "I": "4",
        "A": "4",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Dragon is equipped with: Spear of the Dragon.",
  "weapons": [
    {
      "name": "Spear of the Dragon - Ranged",
      "range": "12\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-3",
      "d": "2",
      "abilities": "Armorbane, AT(4), Beam, Tank hunter"
    },
    {
      "name": "Spear of the Dragon - Melee",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(4), Tank hunter"
    }
  ],
  "option_groups": [
    {
      "header": "An army can contain only one C'tan Shard.",
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
    "Anti-Grav, Fearless, Regeneration(1), Terrifying(-1)",
    "Necrodermis: The model has a 4+ invulnerability save. If it loses its last wound, it explodes like a vehicle.",
    "Powers of the C'tan: The model can manifest 2 powers per turn automatically. It knows all the powers from the list of C'tan powers. Each C'tan can only use each power once per battle round."
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
  "is_psyker": true,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 300
};
