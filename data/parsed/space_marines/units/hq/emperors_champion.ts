/**
 * EMPEROR'S CHAMPION — HQ
 *
 * SOURCE (canonical — Space Marines ENG/Emperor's Champion.html)
 * ──────────────────────────────────────────────────────────────
 * PROFILE: 1 Emperor's Champion — M:6" WS:2+ BS:3+ S:4 T:4 W:4 I:5 A:3 LD:8 SV:2+ — 139 pts
 * EQUIPPED WITH: The Black Sword; Frag grenades; Krak grenades.
 * WEAPONS:
 *   The Black Sword — Swing attack:    - Melee S:+1 AP:-3 D:2  Flurry(1)
 *   The Black Sword — Piercing strike: - Melee S:x2 AP:-3 D:2  AT(2), Slow(-2)
 *   Frag grenade  6"  Grenade 1  S:4  AP:0  D:1  Explosive
 *   Krak grenade  6"  Grenade 1  S:6  AP:-2 D:1  -
 * OPTIONS:
 *   An army may only contain 1 Emperor's Champion. He also counts as a Chapter champion.
 *   Has access to weapons and gear from the Armory.
 *   Can gain one Veteran ability.
 * ABILITIES:
 *   They Shall Know No Fear
 *   The Armor of Faith: 4+ inv save.
 *   Honor or Death: enemy HQ/Character within 12" → Order forced to Charge (must engage).
 *   Martial superiority: re-roll 1 hit and 1 wound.
 *   Oath: choose at start of combat round 1 — affects all SM creatures army-wide:
 *     Abhor the Witch: all units get Aegis(5+); no psykers allowed.
 *     Accept any Challenge: all units +1S +1LD; must charge enemy within 12"; no flee.
 *     Uphold the Honour of the Emperor: +1 armour save vs ranged; no cover.
 * UNIT TYPE: Character model, Infantry
 *
 * ENGINE STATUS: ✓ all data matches HTML. The "Oath" ability contains three sub-choices — informational
 *   only in builder (no engine enforcement of oath effects at runtime yet).
 */

import type { Unit } from '../../../../../src/types/data';

export const emperorsChampion: Unit = {
  "name": "Emperor's Champion",
  "models": [
    {
      "name": "Emperor's Champion",
      "points": 139,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "4",
        "I": "5",
        "A": "3",
        "LD": "8",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "An Emperor's Champion is equipped with: The Black Sword; Frag grenades; Krak grenades.",
  "weapons": [
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
      "name": "Krak grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "The Black Sword (Swing attack)",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "2",
      "abilities": "Flurry(1)"
    },
    {
      "name": "The Black Sword (Piercing strike)",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Slow(-2)"
    }
  ],
  "option_groups": [
    {
      "header": "An army may only contain 1 Emperor's Champion. He also counts as a Chapter champion.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "They Shall Know No Fear",
    "The Armor of Faith: The model gains a 4+ invulnerability save.",
    "Honor or Death: At the start of the activation, if an enemy HQ or Character is within 12\", the placed Order is converted to \"Charge\". The Emperor's Champion and an attached unit must use the Order to engage in close combat with the enemy HQ or character model.",
    "Martial superiority: The model can re-roll 1 to hit and 1 to wound roll.",
    "Oath: Choose an oath to start the first round of combat. The effects are active throughout the game for all of your Space Marine creatures (=> no vehicles) from the same army organization plan.",
    "Abhor the Witch: All units gain the trait \"Aegis(5+)\". The army is not allowed to include psykers.",
    "Accept any Challenge: All units receive +1 to their Strength and Leadership. At the start of every activation, if an enemy unit is within 12\", the placed order is converted to \"Charge\". The order must be used to engage in close combat with at least one enemy unit. Units must always pursue the opponent and are not allowed to flee voluntarily.",
    "Uphold the Honour of the Emperor: All units gain +1 to their armor saves against ranged attacks. Units can never benefit from cover."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 139
};
