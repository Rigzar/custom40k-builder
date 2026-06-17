/**
 * BIG MEK — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const bigMek: Unit = {
  "name": "Big Mek",
  "models": [
    {
      "name": "Big Mek",
      "points": 61,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "5",
        "T": "5",
        "W": "4",
        "I": "4",
        "A": "2",
        "LD": "6",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Mek Boss",
      "points": 76,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "5",
        "T": "5",
        "W": "4",
        "I": "4",
        "A": "3",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "equipped_with": "A Big Mek is equipped with: Stikkbombz.",
  "weapons": [
    {
      "name": "Stikkbombz",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Shokk attack gun",
      "range": "60\"",
      "type": "Assault 1",
      "s": "2D6",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Barrage, Mek weapon"
    }
  ],
  "option_groups": [
    {
      "header": "One Big Mek per army can be upgraded to a Mek Boss for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Mek Boss",
      "is_unique_per_army": true
    },
    {
      "header": "One Mek Boss per army may be equipped with a Shokk attack gun for +107 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 107,
      "variant_link": null,
      "is_unique_per_army": true
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
    "Dakka Dakka Dakka, Mob, Furious charge, Waaagh!",
    "Mek Boss: A Mek Boss may use \"Mek tools\" two times per battle roand.",
    "Mek weapon: Cannot be combined with any equipment that explicitly changes the stats of a weapon. For example, \"Precision Squig\" can be combined, but \"More Dakka\" cannot.",
    "Mek tools:  At the end of its move, the model may attempt to repair a vehicle within 6\". On a 4+, one \"Weapon destroyed\" or \"Engine damage\" result is removed from the vehicle, or 1 hull point is restored. Alternatively, a vehicle within 6\" can reroll a hit roll and a woand or armor penetration roll.",
    "Shokk attack gun: Roll for the strength of the weapon after you have selected a target. If doubles are rolled, consult the following table — 1-1: Awups! The Mek and its unit gain a Battleshock token and suffer an automatic hit S:D AP:-4 D:3. 2-2: Grah! The new target is the nearest visible unit not in melee (including Orks!). 3-3: Oops! An opponent chooses a new target (including Orks!). 4-4: Splash! Profile changes to Assault 2, S:6 AP:-3 D:1, Barrage, Suppression. 5-5: Big wrong button! Remove the Mek from the field and redeploy via Deep Strike; it can no longer move. 6-6: Big red button! The weapon fires with Strength D and AT(3) and loses Barrage this activation."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 61
};
