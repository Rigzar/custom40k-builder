/**
 * RAVEN FIGHTER — Flyer
 *
 * SOURCE: Dark Eldar 1.01.ods, sheet "Raven Fighter". NEW unit in 1.01.
 * Anti-air flyer. No sub-faction keyword — "Swords for hire" lets it join any sub-faction.
 */

import type { Unit } from '../../../../../src/types/data';

export const ravenFighter: Unit = {
  "name": "Raven Fighter",
  "models": [
    {
      "name": "Raven",
      "points": 343,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"", "WS": "-", "BS": "3+", "S": "5", "FRONT": "11", "SIDE": "11", "REAR": "10", "I": "5", "A": "1", "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Raven is equipped with: Splinterstorm cannon; Twin anti-air dark lance.",
  "weapons": [
    { "name": "Splinterstorm cannon", "range": "36\"", "type": "Assault 8", "s": "3", "ap": "0", "d": "1", "abilities": "Anti-air, Poison(3+)" },
    { "name": "Twin anti-air dark lance", "range": "36\"", "type": "Heavy 2", "s": "8", "ap": "-4", "d": "3", "abilities": "Anti-air, AT(3), Lance(+2)" }
  ],
  "option_groups": [],
  "abilities": [
    "Vector Dancer: The model gains a 4+ invulnerability save.",
    "Swords for hire: Add the <Kabal>, <Coven> or <Cult> KEYWORD to the unit."
  ],
  "unit_type": "Flyer",
  "keywords": [
    "-"
  ],
  "is_vehicle": true,
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
  "slot": "Flyers",
  "default_size": 1,
  "min_cost": 343
};
