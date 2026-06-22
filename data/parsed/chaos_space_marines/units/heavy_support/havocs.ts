/**
 * HAVOCS — Heavy Support
 *
 * SOURCE: Chaos Space Marines ENG / Havocs.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.    NAME                     M   WS  BS  S  T  W  I  A  LD  SV  PTS
 *   5-10   Chaos Havoc              6"  3+  3+  4  4  2  4  2   7  3+   34
 *   *      Aspiring Havoc Champion  6"  3+  3+  4  4  2  4  2   8  3+   44
 *
 * EQUIPPED WITH: Every model is equipped with: Bolt pistol; Bolter; Frag grenade; Krak grenade.
 *
 * WEAPONS:
 *   Autocannon                       48"  Heavy 2       S7   AP-2  D1   AT(1)
 *   Bolt pistol                      12"  Pistol 1      S4   AP-1  D1   -
 *   Bolter                           24"  Rapid Fire 1  S4   AP-1  D1   -
 *   Frag grenade                      6"  Grenade 1     S4   AP 0  D1   Explosive
 *   Heavy bolter                     36"  Rapid fire 2  S5   AP-2  D1   -
 *   Krak grenade                      6"  Grenade 1     S6   AP-2  D1   -
 *   Lascannon                        48''  Heavy 1      S9   AP-4  D3   AT(2)
 *   Missile launcher - Frag missile  48"  Heavy 1       S4   AP 0  D1   Explosive
 *   Missile launcher - Krak missile  48"  Heavy 1       S8   AP-3  D2   AT(1), Anti-air
 *   Reaper chaincannon               24"  Assault 4     S5   AP-1  D-1  Suppression
 *
 * OPTIONS:
 *   • All models may receive a Mark of Chaos (per model): Khorne/Slaanesh/Nurgle +2pts,
 *     Tzeentch +5pts
 *   • Up to four Chaos Havocs may replace their Bolter each: Heavy bolter +13 /
 *     Reaper chaincannon +19 / Autocannon +21 / Missile launcher +35 / Lascannon +64
 *   • One model may be upgraded to an Aspiring Havoc Champion for +10pts and gains
 *     access to weapons and gear from the Armory
 *   • May have up to 2 veteran abilities
 *
 * ABILITIES (verbatim): Unyielding
 *
 * UNIT TYPE: Infantry
 * KEYWORDS: Chaos Space Marine
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons, options, abilities all match HTML verbatim (Missile launcher
 *     sub-profiles correctly split into separate "<weapon> - <profile>" entries)
 *   ✓ option_groups: mark (per-model) / fixed_max(4) Bolter swap / "one" champion upgrade
 *     (variant_link: "Aspiring Havoc Champion", inline_pts:10)
 *   ✓ has_veteran_abilities: true / veteran_max: 2
 *   ✓ unit_type: "Infantry" / keywords: ["Chaos Space Marine"]
 *   ✓ default_size: 5 / min_cost: 170 (5×34)
 *   🟡 Lascannon weapon entry keeps the source's literal "48''" (double straight-quote,
 *     a Sheets typo for 48") rather than "48\"" — prod JSON copies the source artefact
 *     verbatim (not a data-entry bug; cosmetic, matches HTML exactly)
 *   ✓ champion_has_armory: false — VERIFIED NOT a bug 2026-06-07 (was flagged as candidate
 *     ki-havocs-championarmory-01). The OPTIONS line "gains access to weapons and gear from
 *     the Armory" (general-access phrase, correctly NOT "vehicle equipment" — see
 *     ki-csm-vehiclearmory-01) IS granted, but through a different, more precise mechanism:
 *     showArmory = has_armory_access || champion_has_armory || variantActive (UnitCard.tsx:145),
 *     and variantActive = !!getActiveVariant(item, unit) (engine/points.ts:17-26) fires exactly
 *     when the user toggles the "One model may be upgraded to an Aspiring Havoc Champion"
 *     variant_link option (__inline qty). So the armory tab opens precisely when — and only
 *     when — the champion is actually taken, matching the canonical text better than a blanket
 *     champion_has_armory:true would (that flag would show armory access to the whole unit
 *     even with no champion upgraded). Confirmed correct as-is; candidate KI closed, no fix
 *     needed. (Distinct from Warptalons/Chosen, whose champion options are NOT variant_link-
 *     gated — those genuinely need champion_has_armory:true.)
 */

import type { Unit } from '../../../../../src/types/data';

export const havocs: Unit = {
  "name": "Havocs",
  "models": [
    {
      "name": "Chaos Havoc",
      "points": 34,
      "min": 5,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Aspiring Havoc Champion",
      "points": 44,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Bolt pistol; Bolter; Frag grenade; Krak grenade.",
  "weapons": [
    {
      "name": "Autocannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Bolt pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Bolter",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Frag grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Heavy bolter",
      "range": "36\"",
      "type": "Rapid fire 2",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Krak grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Lascannon",
      "range": "48''",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(2)"
    },
    {
      "name": "Missile launcher - Frag missile",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Missile launcher - Krak missile",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1), Anti-air"
    },
    {
      "name": "Reaper chaincannon",
      "range": "24\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "-1",
      "abilities": "Suppression"
    }
  ],
  "option_groups": [
    {
      "header": "All models may receive a Mark of Chaos (points per model)",
      "constraint": {
        "type": "mark"
      },
      "choices": [
        {
          "name": "Khorne",
          "points": 2
        },
        {
          "name": "Slaanesh",
          "points": 2
        },
        {
          "name": "Nurgle",
          "points": 2
        },
        {
          "name": "Tzeentch",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Up to four Chaos Havocs may replace their Bolter each",
      "constraint": {
        "type": "fixed_max",
        "max": 4
      },
      "choices": [
        {
          "name": "Heavy bolter",
          "points": 13
        },
        {
          "name": "Reaper chaincannon",
          "points": 19
        },
        {
          "name": "Autocannon",
          "points": 21
        },
        {
          "name": "Missile launcher",
          "points": 35
        },
        {
          "name": "Lascannon",
          "points": 64
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Bolter"]
    },
    {
      "header": "One model may be upgraded to an Aspiring Havoc Champion for +10pts and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": "Aspiring Havoc Champion",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Unyielding"
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Chaos Space Marine"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 2,
  "locked_mark": null,
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 5,
  "min_cost": 170
};
