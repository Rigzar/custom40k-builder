/**
 * REAPER — Heavy Support
 *
 * SOURCE: Dark Eldar 1.01.ods, sheet "Reaper". NEW unit in 1.01.
 * Grav-tank armed with a dual-profile Storm vortex projector (Beam / Blast). No sub-faction
 * keyword — "Swords for hire" lets it join any (<Kabal>/<Coven>/<Cult>).
 */

import type { Unit } from '../../../../../src/types/data';

export const reaper: Unit = {
  "name": "Reaper",
  "models": [
    {
      "name": "Reaper",
      "points": 197,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "12\"", "WS": "-", "BS": "3+", "S": "5", "FRONT": "11", "SIDE": "11", "REAR": "10", "I": "5", "A": "1", "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Reaper is equipped with: Sharpened prow; Storm vortex projector.",
  "weapons": [
    { "name": "Storm vortex projector (Beam)", "range": "36\"", "type": "Heavy 1", "s": "8", "ap": "-4", "d": "4", "abilities": "AT(3), Beam, Lance(+2)" },
    { "name": "Storm vortex projector (Blast)", "range": "24\"", "type": "Heavy 1", "s": "6", "ap": "-1", "d": "1", "abilities": "Barrage, Suppression" }
  ],
  "option_groups": [
    {
      "header": "Can be equipped with a Flickerfield for +42 points.",
      "constraint": { "type": "one" },
      "choices": [],
      "inline_pts": 42, "variant_link": null, "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-Grav, Fast, Squadron",
    "Aerial assault: The unit may fire all ranged weapons if it moved up to 12\".",
    "Sharpened prow: When performing a Tank Shock, the front AV is considered to be 13 instead of 11 and the Strength is considered to be 8 instead of 5.",
    "Swords for hire: Add the <Kabal>, <Coven> or <Cult> KEYWORD to the unit."
  ],
  "unit_type": "Vehicle",
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 197
};
