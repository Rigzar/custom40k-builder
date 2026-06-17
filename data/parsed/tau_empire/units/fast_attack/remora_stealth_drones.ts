/**
 * REMORA STEALTH DRONES — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const remoraStealthDrones: Unit = {
  "name": "Remora Stealth Drones",
  "models": [
    {
      "name": "Remora Stealth Drone",
      "points": 107,
      "min": 1,
      "max": 4,
      "stats": {
        "M": "12\"",
        "WS": "5+",
        "BS": "4+",
        "S": "4",
        "T": "6",
        "W": "2",
        "I": "4",
        "A": "1",
        "LD": "6",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "All models are equipped with: 2 Long-barrelled burst cannons; 2 Seeker missiles.",
  "weapons": [
    {
      "name": "Long-barrelled burst cannon",
      "range": "36\"",
      "type": "Rapid Fire 3",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Seeker missile",
      "range": "120\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Ammo(1), Anti-Air"
    }
  ],
  "option_groups": [
    {
      "header": "Any model may pick up to two SUPPORT SYSTEMS from the armory.",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Deflect, Stealth, Squadron, Supporting Fire, Unyielding"
  ],
  "unit_type": "Jump Pack Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 1,
  "min_cost": 107
};
