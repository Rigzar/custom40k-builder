/**
 * HENCHMAN WARBAND — Troops
 *
 * SOURCE: Informacion/Inquisition.ods, sheet "Henchman Warband":
 *   "Every Inquisitor may select a single Henchman Warband and must start the game attached
 *   to it. A Henchman Warband consists of specialists, chosen from the Elite section in this
 *   codex. Each specialist unit may only be added once to the Warband, up to the specified
 *   amount of models. An Inquisitor may select up to 6 specialist models for their Warband.
 *   An Inquisitor Lord may select up to 12 specialist models for their Warband."
 *
 * Replaces the old "Ordo Hereticus/Malleus/Xenos Warband" Troops units (3 separate, Ordo-gated,
 * 18 specialists total). The new .ods has NO "Only for Ordo X" text on any individual specialist
 * sheet (only the "Army Customisation" sheet references Ordo Hereticus/Malleus/Xenos/Minoris,
 * for Legacies) — specialists are no longer Ordo-gated, any Inquisitor can pick any of them.
 *
 * "Surgeon" (old Ordo Hereticus specialist, 10pts/max2) does not appear anywhere in the new
 * 40-sheet .ods — dropped (no canonical basis remains). The two old "Psyker" entries (Ordo
 * Malleus + Ordo Xenos, both 10pts/max2) collapse into the single new "Psykers" sheet
 * (16pts/max1). Three new specialists added: Crusaders, Chirurgeons, Eldar Outcast (Ranger).
 *
 * The dynamic 6/12 model cap (Inquisitor vs. Inquisitor Lord) is enforced by a validator in
 * src/engine/validators.ts, not by an option_group (it depends on the attached Inquisitor's
 * "Inquisitor Lord" unique_upgrade — see inquisitor.ts variant_models).
 *
 * "The unit may gain one Veteran ability" (repeated on every specialist sheet) reads as a
 * PER-SPECIALIST-TYPE option, not a single unit-wide pick — has_veteran_abilities (a unit-level
 * boolean) cannot express "one veteran ability per specialist type present". Left
 * has_veteran_abilities: false; logged as ki-inquisition-henchman-veteran-per-specialist-01.
 */

import type { Unit } from '../../../../../src/types/data';

export const henchmanWarband: Unit = {
  "name": "Henchman Warband",
  "models": [
    {
      "name": "Acolyte",
      "points": 12,
      "min": 0,
      "max": 12,
      "stats": { "M": "6\"", "WS": "4+", "BS": "4+", "S": "3", "T": "3", "W": "2", "I": "3", "A": "1", "LD": "7", "SV": "5+" }
    },
    {
      "name": "Servitor",
      "points": 22,
      "min": 0,
      "max": 3,
      "stats": { "M": "6\"", "WS": "5+", "BS": "5+", "S": "3", "T": "3", "W": "2", "I": "3", "A": "1", "LD": "10", "SV": "4+" }
    },
    {
      "name": "Arco-flagellant",
      "points": 21,
      "min": 0,
      "max": 10,
      "stats": { "M": "6\"", "WS": "3+", "BS": "6+", "S": "4", "T": "3", "W": "2", "I": "3", "A": "3", "LD": "7", "SV": "6+" }
    },
    {
      "name": "Penitent",
      "points": 16,
      "min": 0,
      "max": 2,
      "stats": { "M": "6\"", "WS": "4+", "BS": "4+", "S": "3", "T": "3", "W": "2", "I": "3", "A": "1", "LD": "7", "SV": "5+" }
    },
    {
      "name": "Missionary",
      "points": 17,
      "min": 0,
      "max": 1,
      "stats": { "M": "6\"", "WS": "4+", "BS": "4+", "S": "3", "T": "3", "W": "2", "I": "3", "A": "1", "LD": "7", "SV": "5+" }
    },
    {
      "name": "Sage",
      "points": 16,
      "min": 0,
      "max": 2,
      "stats": { "M": "6\"", "WS": "4+", "BS": "4+", "S": "3", "T": "3", "W": "2", "I": "3", "A": "1", "LD": "7", "SV": "5+" }
    },
    {
      "name": "Daemonhost",
      "points": 22,
      "min": 0,
      "max": 1,
      "stats": { "M": "6\"", "WS": "4+", "BS": "4+", "S": "4", "T": "4", "W": "2", "I": "3", "A": "2", "LD": "7", "SV": "6+" }
    },
    {
      "name": "Exorcist",
      "points": 22,
      "min": 0,
      "max": 2,
      "stats": { "M": "6\"", "WS": "4+", "BS": "4+", "S": "3", "T": "3", "W": "2", "I": "3", "A": "1", "LD": "7", "SV": "5+" }
    },
    {
      "name": "Jokaero Weaponsmith",
      "points": 64,
      "min": 0,
      "max": 3,
      "stats": { "M": "6\"", "WS": "6+", "BS": "4+", "S": "2", "T": "3", "W": "2", "I": "3", "A": "1", "LD": "7", "SV": "6+" }
    },
    {
      "name": "Mystic",
      "points": 17,
      "min": 0,
      "max": 2,
      "stats": { "M": "6\"", "WS": "4+", "BS": "4+", "S": "3", "T": "3", "W": "2", "I": "3", "A": "1", "LD": "7", "SV": "5+" }
    },
    {
      "name": "Psyker",
      "points": 16,
      "min": 0,
      "max": 1,
      "stats": { "M": "6\"", "WS": "5+", "BS": "4+", "S": "3", "T": "3", "W": "2", "I": "3", "A": "1", "LD": "7", "SV": "5+" }
    },
    {
      "name": "Alien World Scout",
      "points": 16,
      "min": 0,
      "max": 2,
      "stats": { "M": "6\"", "WS": "4+", "BS": "4+", "S": "3", "T": "3", "W": "2", "I": "3", "A": "1", "LD": "7", "SV": "5+" }
    },
    {
      "name": "Archaeotech Researcher",
      "points": 16,
      "min": 0,
      "max": 2,
      "stats": { "M": "6\"", "WS": "4+", "BS": "4+", "S": "3", "T": "3", "W": "2", "I": "3", "A": "1", "LD": "7", "SV": "5+" }
    },
    {
      "name": "Xenologist",
      "points": 16,
      "min": 0,
      "max": 1,
      "stats": { "M": "6\"", "WS": "4+", "BS": "4+", "S": "3", "T": "3", "W": "2", "I": "3", "A": "1", "LD": "7", "SV": "5+" }
    },
    {
      "name": "Crusader",
      "points": 44,
      "min": 0,
      "max": 4,
      "stats": { "M": "6\"", "WS": "2+", "BS": "3+", "S": "3", "T": "3", "W": "2", "I": "3", "A": "2", "LD": "7", "SV": "2+" }
    },
    {
      "name": "Chirurgeon",
      "points": 16,
      "min": 0,
      "max": 1,
      "stats": { "M": "6\"", "WS": "4+", "BS": "4+", "S": "3", "T": "3", "W": "2", "I": "3", "A": "1", "LD": "7", "SV": "5+" }
    },
    {
      "name": "Ranger",
      "points": 44,
      "min": 0,
      "max": 1,
      "stats": { "M": "6\"", "WS": "3+", "BS": "2+", "S": "3", "T": "3", "W": "2", "I": "5", "A": "1", "LD": "8", "SV": "5+" }
    }
  ],
  "variant_models": [],
  "equipped_with": "Acolyte/Penitent/Sage/Psyker/Alien World Scout/Archaeotech Researcher/Xenologist/Chirurgeon: Las pistol. Missionary/Mystic/Exorcist: Chainsword, Las pistol. Servitor: Paired shock chargers. Arco-flagellant: Arco flail. Daemonhost: Runic chains. Jokaero Weaponsmith: Jokaero digital weapons. Crusader: Power sword, Storm shield. Ranger: Ranger long rifle, Shuriken pistol.",
  "weapons": [
    { "name": "Arco flail", "range": "-", "type": "Melee", "s": "+1", "ap": "-1", "d": "1", "abilities": "-" },
    { "name": "Las pistol", "range": "12\"", "type": "Pistol 1", "s": "3", "ap": "0", "d": "1", "abilities": "-" },
    { "name": "Chainsword", "range": "-", "type": "Melee", "s": "U", "ap": "-1", "d": "1", "abilities": "-" },
    { "name": "Eviscerator", "range": "-", "type": "Melee", "s": "x2", "ap": "-3", "d": "2", "abilities": "Armorbane, AT(2), Slow(-2), Unwieldy" },
    { "name": "Heavy bolter", "range": "36\"", "type": "Rapid Fire 2", "s": "5", "ap": "-2", "d": "1", "abilities": "-" },
    { "name": "Multi-melta", "range": "24\"", "type": "Assault 1", "s": "8", "ap": "-5", "d": "2", "abilities": "AT(2), Melta" },
    { "name": "Plasma cannon - Standard", "range": "36\"", "type": "Heavy 1", "s": "7", "ap": "-3", "d": "1", "abilities": "AT(1), Explosive" },
    { "name": "Plasma cannon - Supercharge", "range": "36\"", "type": "Heavy 1", "s": "8", "ap": "-4", "d": "2", "abilities": "AT(2), Explosive, Overheating" },
    { "name": "Paired shock chargers", "range": "-", "type": "Melee", "s": "U", "ap": "-3", "d": "1", "abilities": "Flurry(1)" },
    { "name": "Shock charger", "range": "-", "type": "Melee", "s": "U", "ap": "-3", "d": "1", "abilities": "-" },
    { "name": "Runic chains", "range": "-", "type": "Melee", "s": "U", "ap": "-1", "d": "1", "abilities": "Soul Burn(6+)" },
    { "name": "Jokaero digital weapons - Beams", "range": "24\"", "type": "Assault 1", "s": "8", "ap": "-5", "d": "2", "abilities": "AT(2), Melta" },
    { "name": "Jokaero digital weapons - Bolts", "range": "48\"", "type": "Assault 1", "s": "9", "ap": "-4", "d": "3", "abilities": "AT(2)" },
    { "name": "Jokaero digital weapons - Flames", "range": "9\"", "type": "Assault 4", "s": "5", "ap": "-1", "d": "1", "abilities": "Flames" },
    { "name": "Jokaero digital weapons - Strike", "range": "-", "type": "Melee", "s": "U", "ap": "-4", "d": "1", "abilities": "Hits automatically wound" },
    { "name": "Power sword", "range": "-", "type": "Melee", "s": "+1", "ap": "-3", "d": "1", "abilities": "-" },
    { "name": "Ranger long rifle", "range": "36\"", "type": "Heavy 1", "s": "5", "ap": "-2", "d": "2", "abilities": "Armor piercing(5+), Suppression" },
    { "name": "Shuriken pistol", "range": "12\"", "type": "Assault 1", "s": "4", "ap": "-1", "d": "1", "abilities": "Shuriken" }
  ],
  "option_groups": [
    {
      "header": "A Henchman Warband may consist of up to 6 specialist models (12 if attached to an Inquisitor Lord). Each specialist unit may only be added once. Each army can only contain a single Henchman Warband.",
      "constraint": { "type": "one" },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The Missionary may be equipped with an Eviscerator for +6 points.",
      "constraint": { "type": "one" },
      "choices": [],
      "inline_pts": 6,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Any Servitor may swap their Paired shock chargers for a Shock charger and one of the following",
      "constraint": { "type": "every" },
      "choices": [
        { "name": "Heavy bolter", "points": 13 },
        { "name": "Multi-melta", "points": 27 },
        { "name": "Plasma cannon", "points": 50 }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Bodyguard: Every Acolyte has the \"Bodyguard\" special ability.",
    "Unyielding: Every Servitor has the \"Unyielding\" special ability.",
    "Bionics: While a Servitor is in the unit, it gains a 6+ invulnerability save.",
    "Mind-lock: As long as a character is attached to this unit, the Servitors get +1 to hit rolls.",
    "Berserk(5+), Blind rage: Every Arco-flagellant has these special abilities.",
    "Command Squad, Squadron: granted by Penitent/Sage/Exorcist/Mystic/Alien World Scout/Archaeotech Researcher/Crusader.",
    "Pariah: While a Penitent is alive, the unit gains the \"Aegis(5+)\" special ability. If two Penitents are alive, they gain \"Aegis(4+)\" instead.",
    "Devout: A Missionary can recite 1 hymn per turn. A hymn is successfully recited on a roll of 3+. A Missionary knows a prayer from the Hymns of Battle.",
    "Wise Guidance: While a Sage is alive, all weapons in the unit gain Deflagrate(6+). If two Sages are alive, they gain Deflagrate(5+) instead.",
    "Daemon: The Daemonhost has the \"Daemon\" special ability.",
    "Psyker (Daemonhost): This model can cast 1 psychic power and dispel 1 psychic power per round. It knows Smite, as well as one psychic power from the Malefic discipline.",
    "Aura of Faith: While an Exorcist is alive, the unit gains a 6+ invulnerability save against melee weapons. If two are alive, they gain a 5+ invulnerability save instead.",
    "Infiltrator (Jokaero Weaponsmith): the model has the \"Infiltrator\" special ability.",
    "Defence orb: The Jokaero Weaponsmith gains a 5+ invulnerability save.",
    "Psionic Flare: While a Mystic is alive, a friendly unit arriving via deep strike does not scatter when set up within 3\" of the unit. If two are alive, this range is increased to 6\".",
    "Psyker (Psyker): A Psyker can cast 1 psychic power and dispel 1 psychic power per round. A Psyker knows Smite, as well as one psychic power from a chosen psychic discipline.",
    "Leadership: While an Alien World Scout is alive, the unit gains the \"Move through Cover\" ability. If two are alive, they additionally gain \"Use Cover\".",
    "Archaeotech Enhancement: While an Archaeotech Researcher is alive, the unit gains \"Armor piercing(6+)\" for all weapons. If two are alive, they gain \"Armor piercing(5+)\" instead.",
    "Know Your Enemy: While a Xenologist is alive, the unit gains the \"Favoured enemy\" ability against all Xeno factions.",
    "Deflect, Parry: granted by the Crusader (Storm shield).",
    "Crusade: The Crusader and its attached unit gain the \"Frenzy(1)\" ability and roll 2D6 (pick highest) for the extra movement with an Advance order.",
    "Narthecium: Once per turn, the damage of a wound against the model or attached unit can be reduced by 1. The ability must be declared after armor and invulnerability saves. Does not work against weapons with a strength of 8 or above.",
    "Battle Focus (see Codex Eldar), Infiltrator, Move through cover, Use cover: granted by the Ranger (Eldar Outcast).",
    "Unmatched reconnaissance: While an Eldar Outcast (Ranger) is alive, the unit gains the \"Infiltrator\" ability."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": true,
  "is_priest": true,
  "has_armory_access": true,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Troops",
  "default_size": 1,
  "min_cost": 12
};
