/**
 * VENATARI CUSTODIANS — Fast Attack
 *
 * SOURCE: Codex/Adeptus Custodes 1.01.ods, sheet "Venatari Custodians" (new in the September 2026
 * update). Verbatim:
 *
 *   3-6  Venatari Custodian  12"  2+ 2+  S5 T5 W2 I4 A3 Ld9 Sv3+   75 pts
 *   All models are equipped with: Venatari lance.
 *
 *   Kinetic destroyer   18"   Pistol 3   6   -2  1   -
 *   Tarsus buckler      -     Melee      U   -2  1   -
 *   Venatari lance *
 *    - Melee            -     Melee      +1  -2  1   Quick(+1)
 *    - Shooting         12"   Pistol 2   6   -2  1   -
 *   * Choose one of the following profiles
 *
 *   OPTIONS
 *   • Every model may swap their Venatari lance:
 *     - Kinetic destroyer and Tarsus buckler   +5 points
 *   • The unit can gain a Veteran ability.
 *
 *   ABILITIES: Shield Host · Custodian armor (5+ ward) · Tarsus buckler ("Deflect")
 *   UNIT TYPE: Jump Pack Infantry
 *
 * NOTE ON THE NAME: the codex Index lists this unit as "Venatari Custodes" while its own datasheet
 * tab is titled "Venatari Custodians". The DATASHEET name is used here, as everywhere else.
 *
 * The swap choice grants TWO weapons in one pick. computeWeaponsToShow already splits a compound
 * choice on "and" (and keeps the full string as a candidate), so both the Kinetic destroyer and the
 * Tarsus buckler unlock from it — no special handling needed.
 */

import type { Unit } from '../../../../../src/types/data';

export const venatariCustodians: Unit = {
  "name": "Venatari Custodians",
  "models": [
    {
      "name": "Venatari Custodian",
      "points": 75,
      "min": 3,
      "max": 6,
      "stats": {
        "M": "12\"",
        "WS": "2+",
        "BS": "2+",
        "S": "5",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "3",
        "LD": "9",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "All models are equipped with: Venatari lance.",
  "weapons": [
    {
      "name": "Kinetic destroyer",
      "range": "18\"",
      "type": "Pistol 3",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Tarsus buckler",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Venatari lance - Melee",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "1",
      "abilities": "Quick(+1)"
    },
    {
      "name": "Venatari lance - Shooting",
      "range": "12\"",
      "type": "Pistol 2",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Every model may swap their Venatari lance",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Kinetic destroyer and Tarsus buckler",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Venatari lance - Melee",
        "Venatari lance - Shooting"
      ]
    }
  ],
  "abilities": [
    "Shield Host",
    "Custodian armor: The model gains a 5+ ward save.",
    "Tarsus buckler: The model gains the \"Deflect\" ability."
  ],
  "unit_type": "Jump Pack Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 3,
  "min_cost": 225
};
