/**
 * HIVE CRONE — Flyers
 *
 * SOURCE: Codex/Tyranids 1.05.ods, sheet "Hive Crone" (new in the September 2026 update). Verbatim:
 *
 *   1  Hive Crone  12"  3+ 3+  S6 T6 W5 I5 A4 Ld7 Sv4+   166 pts
 *   A Hive Crone is equipped with: Drool cannon; Monstrous scything talons; 4 Tentaclids.
 *
 *   Drool cannon                18"  Assault 6  6  -2  1   Auto Hit, Sunder(1), Monofilament
 *   Monstrous scything talons   -    Melee      U  -2  2   Extra Attack(1)
 *   Stinger salvo               24"  Assault 2  5   0  1   Blast(4)
 *   Tentaclids                  36"  Assault 1  5  -1  1   Ammo(1), Haywire, Seeking
 *
 *   OPTIONS
 *   • May be equipped with one of the following: Stinger salvo +22
 *   • May select one Special Biomorph: Resonator +13 / Synaptic Node +15 / Regeneration +25 /
 *     Hardened Carapace +28
 *   • May additionally select any number of Basic and Advanced Biomorphs (see Armory).
 *
 *   ABILITIES: Hover Mode
 *   UNIT TYPE: Flyer, Monstrous Creature
 *   KEYWORDS: Advanced Bioform
 *
 * ABILITY VOCABULARY: the sheet writes this datasheet in the POST-clean-up names (Auto Hit,
 * Sunder(1), Extra Attack(1), Blast(4)). Every other weapon in the app is still on the pre-clean-up
 * names, and the clean-up has to land atomically across all ~1400 profiles, so this unit is stored
 * in the SAME vocabulary as its neighbours — Flames, Flurry(1), Explosive — using the author's own
 * mapping. It gets renamed with everything else. A weapon written in a vocabulary no other weapon
 * shares would look broken on the card today.
 */

import type { Unit } from '../../../../../src/types/data';

export const hiveCrone: Unit = {
  "name": "Hive Crone",
  "models": [
    {
      "name": "Hive Crone",
      "points": 166,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "T": "6",
        "W": "5",
        "I": "5",
        "A": "4",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Hive Crone is equipped with: Drool cannon; Monstrous scything talons; 4 Tentaclids.",
  "weapons": [
    {
      "name": "Drool cannon",
      "range": "18\"",
      "type": "Assault 6",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Auto Hit, Sunder(1), Monofilament"
    },
    {
      "name": "Monstrous scything talons",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "2",
      "abilities": "Extra Attack(1)"
    },
    {
      "name": "Stinger salvo",
      "range": "24\"",
      "type": "Assault 2",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Blast(4)"
    },
    {
      "name": "Tentaclids",
      "range": "36\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Ammo(1), Haywire, Seeking"
    }
  ],
  "option_groups": [
    {
      "header": "May be equipped with one of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Stinger salvo",
          "points": 22
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May select one Special Biomorph",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Resonator",
          "points": 13,
          "effect": {
            "grants_abilities": [
              "Resonator: The unit gains a 6+ ward save while within 6\" of a unit with the \"Synapse\" ability. Can be within range of itself, if it has the \"Synapse\" ability."
            ]
          }
        },
        {
          "name": "Synaptic Node",
          "points": 15,
          "effect": {
            "grants_abilities": [
              "Synaptic Node: The unit gains the \"Fearless\" and \"Synapse\" abilities. Only a single unit per army may take this Biomorph."
            ]
          }
        },
        {
          "name": "Regeneration",
          "points": 25,
          "effect": {
            "grants_abilities": [
              "Regeneration: The unit gains the \"Regeneration(1)\" ability."
            ]
          }
        },
        {
          "name": "Hardened Carapace",
          "points": 28,
          "effect": {
            "grants_abilities": [
              "Hardened Carapace: The unit improves its armor save by +1."
            ],
            "stat_mod": [
              {
                "stat": "SV",
                "delta": -1
              }
            ]
          }
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Hover Mode"
  ],
  "unit_type": "Flyer, Monstrous Creature",
  "keywords": [
    "Advanced Bioform"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
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
  "min_cost": 166
};
