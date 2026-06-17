/**
 * C'TAN SHARD OF THE DECEIVER — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const ctanShardOfTheDeceiver: Unit = {
  "name": "C'tan Shard of the Deceiver",
  "models": [
    {
      "name": "Deceiver",
      "points": 280,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "6",
        "T": "7",
        "W": "6",
        "I": "5",
        "A": "4",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Deceiver is equipped with: Golden Fists.",
  "weapons": [
    {
      "name": "Golden Fists",
      "range": "-",
      "type": "Melee",
      "s": "T",
      "ap": "-3",
      "d": "2",
      "abilities": "-"
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
    "Anti-Grav, Deflect, Fearless, Hit & Run, Parry, Regeneration(1), Terrifying(-1)",
    "Great Illusion: At the beginning of the first battle round, the Deceiver can remove up to three units from his own army from the field and relocate them within his own deployment zone. Alternatively, each unit can also be placed in reserve.",
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
  "min_cost": 280
};
