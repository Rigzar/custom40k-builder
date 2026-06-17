/**
 * NEUROTYRANT — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The model can cast 2 powers and deny 2 powers per battle round. It knows Smite and all powers from a chosen discipline."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const neurotyrant: Unit = {
  "name": "Neurotyrant",
  "models": [
    {
      "name": "Neurotyrant",
      "points": 188,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "T": "6",
        "W": "5",
        "I": "3",
        "A": "3",
        "LD": "10",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Neurotyrant is equipped with: Psychic scream.",
  "weapons": [
    {
      "name": "Psychic scream",
      "range": "18\"",
      "type": "Assault 6",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames, Seeking"
    }
  ],
  "option_groups": [
    {
      "header": "May select one Special Biomorph",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Feeder Tendrils",
          "points": 5
        },
        {
          "name": "Norn Crown",
          "points": 10
        },
        {
          "name": "Regeneration",
          "points": 25
        },
        {
          "name": "Hardened Carapace",
          "points": 35
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May additionally select any number of Basic and Advanced Biomorphs (see Armory).",
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
    "Anti-Grav, Fearless, Synapse",
    "Neuroloids: Select two friendly units during each Rally phase. Both units are considered to be within Synapse range until the end of the current Battle round. Can be used on units that are currently not on the board (like in a transport or in reserves).",
    "Warp Barrier: The model gains a 4+ invulnerability save.",
    "Psychic Terror: Effects from the Shadow in The Warp ability start one round earlier.",
    "Psyker: The model can cast 2 powers and deny 2 powers per battle round. It knows Smite and all powers from a chosen discipline."
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [
    "Tyranid"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_psyker": true,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 188,
  "is_monster": false
};
