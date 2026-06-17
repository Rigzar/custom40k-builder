/**
 * CONVERGENCE OF DOMINION — Fortifications
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const convergenceOfDominion: Unit = {
  "name": "Convergence of Dominion",
  "models": [
    {
      "name": "Starstele",
      "points": 135,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "-",
        "WS": "-",
        "BS": "3+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "11",
        "I": "-",
        "A": "-",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Starstele is a single model and equipped with: -.",
  "weapons": [],
  "option_groups": [],
  "abilities": [
    "Squadron",
    "Activation: All Starsteles start the game deactivated. They can be activated by holding them like a mission objective at the end of the battle round. If an active Starstele is hold like a mission objective, it may instead activate an inactive one.",
    "Buried in the earth: After all units (including infiltrators) have been set up, deploy all Starsteles from your army. Set them up via Deep strike rules outside the enemies deployment zone. The unit always scatters, even if a \"hit\" is rolled for the scatter die (follow the small arrow on it for direction) and can never stray closer than 1\" to another unit, terrain, the enemies deployment zone or the edge of the field. Reduce the deviation only enough to place the model.",
    "Dolmen gate network: All of your active Startsteles are connected and act like a transport vehicle (with the same restrictions in regards to which passengers may use it). This means a unit may embark in one active Starstele and disembark in another the next turn. Each Starstele may only be used once per battle round to either have a unit embark on it, or disembark from it. The Starstele always counts as having moved 6\". Units arriving from reserves may exit from a Starstele instead of other deployment methods, if they could embark on it in the first place.",
    "Inactive: The model may only be targeted by the enemy after it has been activated.",
    "Mark of Dominion: Enemy models within 12\" of an inactive Starstele receive a -1 penalty to manifest a psychic power. If the Starstele is active, the penalty increases to -2.",
    "Unmanned: A Starstele can't contest or capture mission objectives."
  ],
  "unit_type": "Vehicle",
  "keywords": [],
  "is_vehicle": true,
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
  "slot": "Fortifications",
  "default_size": 1,
  "min_cost": 135
};
