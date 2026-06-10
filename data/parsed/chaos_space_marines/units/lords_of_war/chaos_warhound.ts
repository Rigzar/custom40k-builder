/**
 * CHAOS WARHOUND — Lords of War
 *
 * SOURCE: Informacion/Escalation.ods, sheet "Chaos Warhound" (canonical datasheet —
 *   NOT in the Chaos Space Marines ENG HTML folder; this unit comes from the Escalation
 *   cross-faction Lords of War supplement, sheet "Chaos Warhound")
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME      M    WS  BS  S   FRONT  SIDE  REAR  I  A  HP  PTS
 *   1    Warhound  12"   -  3+  10    14    13    12   1  1   8  524
 *
 * EQUIPPED WITH: A Warhound is equipped with: -.
 *
 * WEAPONS:
 *   Apocalypse missile launcher  240"  Heavy 5   S7   AP-3  D1  AT(1), Colossal blast, Indirect
 *   Inferno gun                   18"  Assault 12 S7  AP-3  D1  AT(1), Flames
 *   Plasma blastgun - Rapid       72"  Heavy 2   S8   AP-4  D2  AT(2), Barrage
 *   Plasma blastgun - Overload    96"  Heavy 1   S10  AP-4  D3  AT(3), Colossal blast
 *   Twin turbo-laser destructor   96"  Heavy 2   SD   AP-4  D4  AT(4), Barrage
 *   Vulcan mega-bolter            60"  Heavy 15  S6   AP-3  D1  -
 *   (* "Choose one of the following profiles" — Plasma blastgun Rapid/Overload)
 *
 * OPTIONS:
 *   • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +20 points (each)
 *   • Must pick two weapons from this list: Inferno gun +84 / Vulcan mega-bolter +270 /
 *     Plasma blastgun +549 / Apocalypse missile launcher +649 / Twin turbo-laser
 *     destructor +1024
 *
 * ABILITIES (verbatim):
 *   Void Shields (2): The model has two Void shields. Each hit scored against it will
 *   instead hit a Void shield (while at least one remains active). Close combat attacks
 *   come from inside the shield and therefore are not stopped. Void shields have an
 *   Armour value of 12. A Glancing hit or Penetrating hit (or any hit from a Destroyer
 *   weapon) scored against a Void shield causes it to collapse. After all Void shields
 *   have collapsed, further hits strike the model instead. In the Rally Phase, roll 1D6
 *   for each collapsed Void shield. Each roll of 5+ instantly restores one collapsed shield.
 *
 * UNIT TYPE: Super-heavy Vehicle
 * KEYWORDS: Lord of War
 *
 * ENGINE STATUS:
 *   ✓ stats, weapons, abilities all match the .ods sheet verbatim (Plasma blastgun
 *     Rapid/Overload sub-profiles correctly split into separate "<weapon> - <profile>"
 *     entries per the source's own "* Choose one of the following profiles" note)
 *   ✓ model name "Warhound" (not "Chaos Warhound") — matches the .ods NAME cell and
 *     the "A Warhound is equipped with: -" equipped_with line verbatim; the unit's
 *     display name "Chaos Warhound" is the per-faction LoW slot label, the model
 *     itself is named "Warhound" in the canonical text — both correctly preserved
 *   ✓ option_groups: "mark" (flat unit-level pick, +20pts uniform per god) / TWO
 *     "one" required:true weapon picks ("Must pick two weapons (1st)"/"(2nd)"),
 *     each offering the full 5-weapon list — correct modeling of "Must pick two
 *     weapons from this list" as two independent mandatory single-picks (the same
 *     weapon CAN be picked twice, e.g. two Inferno guns, since source text doesn't
 *     forbid repeats)
 *   ✓ has_armory_access: false / has_veteran_abilities: false (no such lines in text)
 *   ✓ keywords: ["Chaos Space Marine", "Lord of War", "Vehicle"] — engine appends
 *     both "Chaos Space Marine" (faction tie-in for the per-faction LoW injection
 *     route) and "Vehicle" to the source's single "Lord of War" keyword; correct
 *     per the cross-faction supplement architecture — same pattern as Fellblade/Spartan
 *   ✓ is_vehicle: true / unit_type: "Super-heavy Vehicle" / default_size: 1
 *   ✓ min_cost: 692 = base 524 + cheapest mandatory pick (Inferno gun, +84) ×2 — both
 *     "Must pick two weapons" groups are required:true and the engine correctly sums
 *     the floor cost of both mandatory picks (the source datasheet equips the unit
 *     with NO weapons by default — "equipped with: -" — so both picks are baked into
 *     the minimum cost; this is NOT a bug, the 524 base alone is unplayable per the
 *     canonical text)
 *   (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)
 */

import type { Unit } from '../../../../../src/types/data';

export const chaosWarhound: Unit = {
  "name": "Chaos Warhound",
  "models": [
    {
      "name": "Warhound",
      "points": 524,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "10",
        "FRONT": "14",
        "SIDE": "13",
        "REAR": "12",
        "I": "1",
        "A": "1",
        "HP": "8"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Warhound is equipped with: -.",
  "weapons": [
    {
      "name": "Apocalypse missile launcher",
      "range": "240\"",
      "type": "Heavy 5",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Colossal blast, Indirect"
    },
    {
      "name": "Inferno gun",
      "range": "18\"",
      "type": "Assault 12",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Flames"
    },
    {
      "name": "Plasma blastgun - Rapid",
      "range": "72\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Barrage"
    },
    {
      "name": "Plasma blastgun - Overload",
      "range": "96\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Colossal blast"
    },
    {
      "name": "Twin turbo-laser destructor",
      "range": "96\"",
      "type": "Heavy 2",
      "s": "D",
      "ap": "-4",
      "d": "4",
      "abilities": "AT(4), Barrage"
    },
    {
      "name": "Vulcan mega-bolter",
      "range": "60\"",
      "type": "Heavy 15",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "May receive a Mark of Chaos",
      "constraint": {
        "type": "mark"
      },
      "choices": [
        {
          "name": "Khorne",
          "points": 20
        },
        {
          "name": "Nurgle",
          "points": 20
        },
        {
          "name": "Slaanesh",
          "points": 20
        },
        {
          "name": "Tzeentch",
          "points": 20
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Must pick two weapons (1st)",
      "constraint": {
        "type": "one",
        "required": true
      },
      "choices": [
        {
          "name": "Inferno gun",
          "points": 84
        },
        {
          "name": "Vulcan mega-bolter",
          "points": 270
        },
        {
          "name": "Plasma blastgun",
          "points": 549
        },
        {
          "name": "Apocalypse missile launcher",
          "points": 649
        },
        {
          "name": "Twin turbo-laser destructor",
          "points": 1024
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Must pick two weapons (2nd)",
      "constraint": {
        "type": "one",
        "required": true
      },
      "choices": [
        {
          "name": "Inferno gun",
          "points": 84
        },
        {
          "name": "Vulcan mega-bolter",
          "points": 270
        },
        {
          "name": "Plasma blastgun",
          "points": 549
        },
        {
          "name": "Apocalypse missile launcher",
          "points": 649
        },
        {
          "name": "Twin turbo-laser destructor",
          "points": 1024
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Void Shields (2): The model has two Void shields. Each hit scored against it will instead hit a Void shield (while at least one remains active). Close combat attacks come from inside the shield and therefore are not stopped. Void shields have an Armour value of 12. A Glancing hit or Penetrating hit (or any hit from a Destroyer weapon) scored against a Void shield causes it to collapse. After all Void shields have collapsed, further hits strike the model instead. In the Rally Phase, roll 1D6 for each collapsed Void shield. Each roll of 5+ instantly restores one collapsed shield."
  ],
  "unit_type": "Super-heavy Vehicle",
  "keywords": [
    "Chaos Space Marine",
    "Lord of War",
    "Vehicle"
  ],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "advisor": false,
  "locked_mark": null,
  "slot": "Lords of War",
  "default_size": 1,
  "min_cost": 692
};

