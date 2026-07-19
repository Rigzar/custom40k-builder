/**
 * MUTALITH VORTEX BEAST — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const mutalithVortexBeast: Unit = {
  "name": "Mutalith Vortex Beast",
  "models": [
    {
      "name": "Mutalith Vortex Beast",
      "points": 171,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "T": "6",
        "W": "4",
        "I": "4",
        "A": "3",
        "LD": "8",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Mutalith Vortex Beast is equipped with: Betentacled maw; Mutalith claws; Warp Vortex.",
  "weapons": [
    {
      "name": "Betentacled maw",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "Flurry(3)"
    },
    {
      "name": "Mutalith claws",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1)"
    },
    {
      "name": "Warp Vortex - Beam of Unreality",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(4), Beam, Soul burn(5+)"
    },
    {
      "name": "Warp Vortex - Immaterial Flare",
      "range": "12\"",
      "type": "Heavy 6",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames, Soul burn(5+)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Daemon, Daemonic instability, Mark of Tzeentch, Regeneration(1), Squadron, Terrifying(-1)"
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": "Tzeentch",
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 171
};
