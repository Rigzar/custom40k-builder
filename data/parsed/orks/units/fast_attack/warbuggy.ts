/**
 * WARBUGGY — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const warbuggy: Unit = {
  "name": "Warbuggy",
  "models": [
    {
      "name": "Warbuggy",
      "points": 88,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "5+",
        "S": "5",
        "FRONT": "10",
        "SIDE": "10",
        "REAR": "10",
        "I": "3",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: -",
  "weapons": [
    {
      "name": "Big shoota",
      "range": "36\"",
      "type": "Assault 3",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Burna bottles",
      "range": "6\"",
      "type": "Grenade 2",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Grot bomm",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Ammo (1), AT(2), Barrage, Indirect, Grot Gunner, Seeking"
    },
    {
      "name": "Lobba",
      "range": "36\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Indirect"
    },
    {
      "name": "Mek speshul",
      "range": "30\"",
      "type": "Assault 9",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Rivet gun",
      "range": "24\"",
      "type": "Assault 6",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Rokkit kannon",
      "range": "24\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Explosive"
    },
    {
      "name": "Rokkit launcha",
      "range": "24\"",
      "type": "Assasult 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-air"
    },
    {
      "name": "Shokk rifle",
      "range": "24\"",
      "type": "Assault 1",
      "s": "2D6",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Explosive, Mek Weapon, Shokk Tunnel"
    },
    {
      "name": "Skorcha",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Squig launcha",
      "range": "24\"",
      "type": "Assault 2",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Indirect"
    },
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
      "name": "Twin-linked big shoota",
      "range": "36\"",
      "type": "Assault 6",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin-linked rokkit launcha",
      "range": "24\"",
      "type": "Assault 2",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-air"
    },
    {
      "name": "Zzap gun",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "2D6",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(2)"
    }
  ],
  "option_groups": [
    {
      "header": "May be equipped with one big gun",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Lobba",
          "points": 11
        },
        {
          "name": "Kannon",
          "points": 16
        },
        {
          "name": "Zzap gun",
          "points": 20
        },
        {
          "name": "Squig launcha with Grot Gunner",
          "points": 25
        },
        {
          "name": "Rivet gun",
          "points": 26
        },
        {
          "name": "Grot bomm",
          "points": 34
        },
        {
          "name": "Mek speshul",
          "points": 36
        },
        {
          "name": "Shokk rifle with Grot Gunner",
          "points": 41
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with one small gun. If the warbuggy doesn't have a big gun, it may take up to three small guns",
      "constraint": {
        "type": "fixed_max",
        "max": 3
      },
      "choices": [
        {
          "name": "Big shoota",
          "points": 12
        },
        {
          "name": "Rokkit launcha",
          "points": 16
        },
        {
          "name": "Squig launcha*",
          "points": 16
        },
        {
          "name": "Skorcha",
          "points": 22
        },
        {
          "name": "Twin-linked big shoota",
          "points": 23
        },
        {
          "name": "Twin-linked rokkit launcha",
          "points": 31
        },
        {
          "name": "Rokkit kannon*",
          "points": 43
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May take a crew weapon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Stikkbombz",
          "points": 0
        },
        {
          "name": "Burna bottles",
          "points": 4
        },
        {
          "name": "Big shoota with Grot Gunner",
          "points": 17
        },
        {
          "name": "Twin-linked Big shoota with Grot Gunner",
          "points": 35
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May take Pointy Bitz for +21 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 21,
      "variant_link": null,
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
    "Dakka Dakka Dakka, Squadron, Waaagh!",
    "Grot Gunner: A weapon with a Grot gunner is fired with a BS of 4+.",
    "Mek weapon: This weapon's profile cannot be changed by equipment or wargear.",
    "Pointy Bitz: The model inflicts D6 hits with S:6 AP:-2 D:1 when it makes a Charge move.",
    "Ramshackle: Roll D6 when the vehicle is destroyed — 1-2: Kaboom! The vehicle explodes with a radius of 6\". 3-4: Kareen! Move the vehicle 3D6\" in a random direction and then Kaboom! The vehicle stops at the first unit it contacts. On a hit symbol the controlling player chooses direction. 5-6: Kerrunch! Passengers disembark unharmed; the vehicle remains as wreckage. If immobilized, the player may roll on this table with any command during their next activation.",
    "Shokk Rifle: Roll for the strength of the weapon after you have selected a target. If doubles are rolled, consult the following table. If doubles are rolled: 1-1: Awups! The shooter and its unit gain a Battleshock token and suffer an automatic hit S:D AP:-4 D:3. 2-2: Grah! Nearest visible unit not in melee becomes the new target (including Orks!). 3-3: Oops! An opponent chooses a new target (including Orks!). 4-4: Splash! Profile changes to Assault 2, S:6 AP:-3 D:1, Barrage, Suppression. 5-5: Big wrong button! Remove the shooter from the field and redeploy via Deep Strike; it can no longer move. 6-6: Big red button! Fires with Strength D and AT(3), loses Barrage this activation.",
    "Shokk Tunnel: When an \"Advance\" command is given, instead of moving the model an additional 1D6\", a model with this weapon is removed from the board and immediately repositioned according to the rules for Deep Strike. Then roll 1D6. On a 1 or 2, the model suffers a penetrating hit."
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
  "slot": "Fast Attack",
  "default_size": 1,
  "min_cost": 88
};
