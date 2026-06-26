/**
 * MEKBOY JUNKA — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const mekboyJunka: Unit = {
  "name": "Mekboy Junka",
  "models": [
    {
      "name": "Junka",
      "points": 188,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "6+",
        "BS": "5+",
        "S": "6",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "10",
        "I": "3",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Junka is equipped with: three Big shootas.",
  "weapons": [
    {
      "name": "Big drill",
      "range": "-",
      "type": "Melee",
      "s": "10",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(3), Gruesome"
    },
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
      "name": "Big zzappa",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "2D6",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(2), Explosive"
    },
    {
      "name": "Grot bomm",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Ammo (1), AT(2), Barrage, Indirect, Grot-guided"
    },
    {
      "name": "Junka Shokk Attack Gun",
      "range": "60\"",
      "type": "Heavy 1",
      "s": "2D6",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Barrage, Mek Weapon"
    },
    {
      "name": "Killkannon",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1), Barrage"
    },
    {
      "name": "Kustom mega-blasta",
      "range": "24\"",
      "type": "Assault 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Explosive, Overheating"
    },
    {
      "name": "Rokkit launcha",
      "range": "24\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-air"
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
      "name": "Supa-skorcha",
      "range": "12\"",
      "type": "Assault 6",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
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
      "range": "36\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(2), Anti-air"
    }
  ],
  "option_groups": [
    {
      "header": "May swap any of the big shootas",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Kustom mega-blasta",
          "points": 4
        },
        {
          "name": "Rokkit launcha",
          "points": 4
        },
        {
          "name": "Skorcha",
          "points": 11
        },
        {
          "name": "Twin-linked big shoota",
          "points": 12
        },
        {
          "name": "Twin-linked rokkit launcha",
          "points": 20
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May take one big gun",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Killkannon",
          "points": 27
        },
        {
          "name": "Supa-skorcha",
          "points": 46
        },
        {
          "name": "Big Zzappa",
          "points": 47
        },
        {
          "name": "Two Grot bomms",
          "points": 68
        },
        {
          "name": "Junka Shokk Attack Gun",
          "points": 72
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "If the junka doesn't have a Shokk Attack Gun, it may take one mek rig",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Tellyport Tunnella",
          "points": 10
        },
        {
          "name": "Big Drill",
          "points": 22
        },
        {
          "name": "Junka Force Field",
          "points": 45
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with 'Eavy plates for +16 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 16,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can get one Kustom job.",
      "constraint": {
        "type": "one"
      },
      "choices": [
        { "name": "Da Booma", "points": 25 },
        { "name": "More Dakka", "points": 15 },
        { "name": "Press the Button", "points": 10 },
        { "name": "Shokka Hull", "points": 5 },
        { "name": "Eavy armour cabin", "points": 10 },
        { "name": "Squig-hide Tyres", "points": 5 },
        { "name": "Enhanced Runt-Sucker", "points": 107 }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Dakka Dakka Dakka, Open, Waaagh!",
    "Transport: This model has a transport capacity of 12 infantry models. If equipped with a big gun, it has a transport capacity of 6 infantry models.",
    "Big Drill: A junka equipped with a Big Drill gains the Deep Strike rule. It resolves Tank Shocks using the Big Drill weapon profile.",
    "Eavy plates: A junka with 'Eavy plates increases its front and side armor to 12.",
    "Grot-guided: This weapon is fired with a BS of 4+ and ignores cover. Enemy targets in cover do not gain an armor bonus, and the firer suffers no hit penalty.",
    "Junka force field: A junka equipped with a Junka Force Field and any friendly unit entirely within 9\" gains the \"Warded\" ability against ranged attacks.",
    "Mek weapon: This weapon's profile cannot be changed by equipment or wargear.",
    "Junka Shokk Attack Gun: Roll for the strength of this weapon after you have selected a target. If doubles are rolled, consult the following table. If doubles are rolled: 1-1: Awups! The shooter and its unit gain a Battleshock token and suffer an automatic hit S:D AP:-4 D:3. 2-2: Grah! Nearest visible unit not in melee becomes the new target (including Orks!). 3-3: Oops! An opponent chooses a new target (including Orks!). 4-4: Splash! Profile changes to Assault 2, S:6 AP:-3 D:1, Barrage, Suppression. 5-5: Big wrong button! Remove the shooter from the field and redeploy via Deep Strike; it can no longer move. 6-6: Big red button! Fires with Strength D and AT(3), loses Barrage this activation.",
    "Tellyport Tunnella: When an \"Advance\" command is given, instead of moving the model an additional 1D6\", a model with a Tellyport Tunnella is removed from the board and immediately repositioned according to the rules for Deep Strike. Then roll 1D6. On a 1 or 2, the model suffers a penetrating hit.",
    "Ramshackle: Roll D6 when the vehicle is destroyed — 1-2: Kaboom! The vehicle explodes with a radius of 6\". 3-4: Kareen! Move the vehicle 3D6\" in a random direction and then Kaboom! The vehicle stops at the first unit it contacts. On a hit symbol the controlling player chooses direction. 5-6: Kerrunch! Passengers disembark unharmed; the vehicle remains as wreckage. If immobilized, the player may roll on this table with any command during their next activation."
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
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 188
};
