/**
 * GREAT UNCLEAN ONE — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The model can cast 2 powers and deny 2 powers per battle round. It knows Smite and all powers from the discipline of Decay."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const greatUncleanOne: Unit = {
  "name": "Great Unclean One",
  "models": [
    {
      "name": "Great Unclean One",
      "points": 350,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "7",
        "T": "9",
        "W": "8",
        "I": "3",
        "A": "4",
        "LD": "10",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Great Unclean One is equipped with: Bileblade; Doomsday bell; Nurgling infestation; Putrid vomit.",
  "weapons": [
    {
      "name": "Bileblade",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1), Poison(2+)"
    },
    {
      "name": "Bilesword",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Poison(2+), Slow(-2)"
    },
    {
      "name": "Doomsday bell",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Poison(2+)"
    },
    {
      "name": "Nurgling infestation",
      "range": "-",
      "type": "Melee",
      "s": "2",
      "ap": "0",
      "d": "1",
      "abilities": "The bearer inflicts 4 automatic hits with this weapon in close combat, Poison(4+)"
    },
    {
      "name": "Plague flail",
      "range": "7\"",
      "type": "Pistol 3",
      "s": "U",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1), Poison(2+)"
    },
    {
      "name": "Putrid vomit",
      "range": "12\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Barrage, Poison(2+)"
    }
  ],
  "option_groups": [
    {
      "header": "Can exchange its Bileblade",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Plague flail",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can exchange its Doomsday bell",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Bilesword",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Only one Greater Daemon of each type per army.",
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
    "Deep strike, Fearless, Greater Daemon, Mark of Nurgle, Regeneration(1), Terrifying(-2)",
    "Bileblade: The model may suffer 1 Mortal Wound in exchange for getting a bonus of +1 to the next manifestation or deny of a psychic power.",
    "Doomsday bell: The model may heal a friendly unit within 7\" for D3 wounds during its activation. Dead models may be revived with this ability. Injured models have to be fully healed first. Only works on models that have the \"Daemon\" and \"Mark of Nurgle\" abilities. Character models and vehicles are always excluded.",
    "Psyker: The model can cast 2 powers and deny 2 powers per battle round. It knows Smite and all powers from the discipline of Decay."
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
  "is_psyker": true,
  "has_armory_access": true,
  "armory_gear_only": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": "Nurgle",
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 350
};
