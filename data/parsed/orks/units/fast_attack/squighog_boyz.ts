/**
 * SQUIGHOG BOYZ — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const squighogBoyz: Unit = {
  "name": "Squighog Boyz",
  "models": [
    {
      "name": "Squighog Boy",
      "points": 44,
      "min": 3,
      "max": 6,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "5+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "3",
        "A": "3",
        "LD": "5",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Nob",
      "points": 77,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "5+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "3",
        "A": "4",
        "LD": "6",
        "SV": "4+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Stikka.",
  "weapons": [
    {
      "name": "Bomb squig",
      "range": "18\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Ammo(1)"
    },
    {
      "name": "Stikka - Melee",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Stikka - Ranged",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "The squad may receive a Bomb squig for +8 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 8,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One Squighog Boy may be upgraded to a Nob for +33 points and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 33,
      "variant_link": "Nob",
      "is_unique_per_army": false
    },
    {
      "header": "Can get one Kustom job.",
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
    "Dakka Dakka Dakka, Mob, Furious charge, Waaagh!, <Squig>, <Wildork>",
    "Wildork: The model receives the <Wildork> keyword and a 6+ invulnerability saving throw. Melee hit rolls against vehicles or monstrous creatures receive a +1 bonus and the \"Lance(1)\" ability."
  ],
  "unit_type": "Bike",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 3,
  "min_cost": 132
};
