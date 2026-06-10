/**
 * CHAOS SORCERER — HQ
 *
 * SOURCE: Chaos Space Marines ENG / Chaos Sorcerer.html (canonical datasheet)
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME              M    WS   BS   S  T  W  I  A  LD  SV  PTS
 *   1    Chaos Sorcerer    6"   3+   3+   4  4  4  5  2   8  3+   92
 *   *    Master of Sorcery 6"   3+   3+   4  4  5  5  3   9  3+  107  (variant, unique per army)
 *
 * EQUIPPED WITH: Frag grenades; Krak grenades.
 *
 * OPTIONS:
 *   • May receive a Mark of Chaos:
 *     - Undivided +0 pts / Slaanesh +8 pts / Nurgle +20 pts / Tzeentch +15 pts
 *   • One Chaos Sorcerer per army can be upgraded to Master of Sorcery for +15 pts.
 *   • Has access to weapons and gear from the Armory.
 *   • May have up to 2 veteran abilities.
 *
 * ABILITIES:
 *   Master of Sorcery: The model can cast and deny 1 additional power per battle round.
 *
 *   Psyker: The model can cast 1 power and deny 1 power per battle round.
 *     It knows Smite and all powers from a chosen discipline.
 *
 * PSYKER RULES (grounded in core_rules_text.txt L1009-1012):
 *   "If a psyker is limited in the number of powers it knows, they must be selected
 *    when creating the army list."
 *   "Psykers have access to the list of General Psychic Disciplines as well as those
 *    listed in their respective Codex."
 *
 *   AVAILABLE DISCIPLINES for Chaos Sorcerer:
 *     ALWAYS available (no mark required):
 *       - General Psychic Disciplines  (Core Rules: all psykers)
 *       - Dark Hereticus               (CSM codex, no mark restriction)
 *       - Malefic                      (CSM codex, no mark restriction)
 *     CONDITIONAL (requires matching mark):
 *       - Change           → Mark of Tzeentch only
 *       - Decay            → Mark of Nurgle only
 *       - Excess           → Mark of Slaanesh only
 *     NEVER available:
 *       - Cult Powers      → Cult initiates only (Dark Commune)
 *
 *   POWER SELECTION:
 *     "knows Smite" → Smite is always known (fixed, not counted against the limit)
 *     "all powers from a chosen discipline" → player chooses 1 discipline,
 *       knows ALL 6 powers from it.
 *     NOTE: Master of Sorcery variant adds +1 cast/deny per round (informational).
 *
 * ARMORY ACCESS — KEY RULES (grounded in Armory.html + datasheet OPTIONS):
 *   - ᵀ weapons (Combi-*, Force weapons, Power weapons…) are gated: only available
 *     AFTER the model buys Terminator armor. Sorcerer has no innate armourKeyword
 *     so the ᵀ gate only fires when Terminator armor is purchased.
 *   - Force axe/staff/sword: pU=null (character price only) — these are Psyker weapons.
 *     ENGINE TODO: enforce Psyker-only restriction for Force weapons.
 *   - Hunter-killer missile / Kai gun / Living vehicle: p=null — shown in armory
 *     but not purchasable (cost "-"). They appear equipped on specific units.
 *
 * ARMORY ACCESS (grounded in Armory.html + datasheet OPTIONS):
 *
 *   SOURCE — Armory.html global rule (applies to ALL units with armory access):
 *   "Unless stated otherwise, every item can only be purchased once by each model.
 *    Any model with access to the Armory can buy as many items as it wants.
 *    Items with a cost of '-' can not be selected."
 *
 *   SOURCE — Chaos Sorcerer.html OPTIONS:
 *   "Has access to weapons and gear from the Armory."  → has_armory_access: true
 *   "May have up to 2 veteran abilities."              → veteran_max: 2
 *
 *   NOTE — Armory.html gating rules (apply globally):
 *   "Models wearing Gravis armor can only receive equipment with ᴳ."  → filterGravisCompat()
 *   "Models wearing Cataphractii or Terminator armor can only receive equipment with ᵀ."
 *     → modelRestrictsToTermSubset() — Chaos Sorcerer has no innate armourKeyword,
 *       so this only fires if the player buys Terminator armor from the general armory.
 *
 *   VETERAN ABILITY COST RULE (Armory.html footer, verbatim):
 *   "Point costs must be paid for every model in the unit and per Wound or Hull point
 *    of the model." → p_veh field on veteran items; charged ×wounds for monsters/vehicles.
 *     The Chaos Sorcerer is a CHARACTER MODEL → pays the flat p_char column (0 for most).
 *
 * KEYWORD: Chaos Space Marine, Psyker
 * UNIT TYPE: Character Model, Infantry
 *
 * ENGINE STATUS:
 *   ✓ Discipline access by mark: enforced in PsychicModal (isMarkOnlyDisc filter)
 *   ✓ Cult Powers blocked: enforced in PsychicModal (isCultOnlyDisc filter)
 *   ✓ Smite always known: TODO — not yet shown as fixed known power in UI
 *   ✓ "all powers from chosen discipline" logic: TODO — currently picks individual
 *     powers freely; needs "choose 1 discipline → unlock all" mechanic
 */

import type { Unit } from '../../../../../src/types/data';

export const chaosSorcerer: Unit = {
  name: 'Chaos Sorcerer',
  slot: 'HQ',
  models: [
    {
      name: 'Chaos Sorcerer',
      points: 92,
      min: 1,
      max: 1,
      stats: { M: '6"', WS: '3+', BS: '3+', S: '4', T: '4', W: '4', I: '5', A: '2', LD: '8', SV: '3+' },
    },
  ],
  variant_models: [
    {
      name: 'Master of Sorcery',
      points: 107,
      min: 0,
      max: 0,
      stats: { M: '6"', WS: '3+', BS: '3+', S: '4', T: '4', W: '4', I: '5', A: '3', LD: '9', SV: '3+' },
    },
  ],
  equipped_with: 'A Chaos Sorcerer is equipped with: Frag grenades; Krak grenades.',
  weapons: [
    { name: 'Frag grenade', range: '6"', type: 'Grenade 1', s: '4', ap: '0',  d: '1', abilities: 'Explosive' },
    { name: 'Krak grenade', range: '6"', type: 'Grenade 1', s: '6', ap: '-2', d: '1', abilities: '-' },
  ],
  option_groups: [
    // SOURCE: "May receive a Mark of Chaos"
    // All 4 marks available (Chaos Sorcerer has no locked mark).
    // Mark affects which psychic disciplines become available (see PSYKER RULES above).
    {
      header: 'May receive a Mark of Chaos',
      constraint: { type: 'mark' },
      choices: [
        { name: 'Undivided', points: 0  },
        { name: 'Slaanesh',  points: 8  },
        { name: 'Nurgle',    points: 20 },
        { name: 'Tzeentch',  points: 15 },
      ],
      inline_pts: null,
      variant_link: null,
      is_unique_per_army: false,
    },
    // SOURCE: "One Chaos Sorcerer per army can be upgraded to a Master of Sorcery for +15 pts."
    // Master of Sorcery: +1A, +1W, +1LD, +1 cast/deny per round.
    {
      header: 'One Chaos Sorcerer per army can be upgraded to a Master of Sorcery for +15 points.',
      constraint: { type: 'unique_upgrade' },
      choices: [],
      inline_pts: 15,
      variant_link: 'Master of Sorcery',
      is_unique_per_army: true,
    },
  ],
  abilities: [
    // SOURCE (verbatim):
    'Master of Sorcery: The model can cast and deny 1 additional power per battle round.',
    // SOURCE (verbatim) — Psyker ability encodes: cast limit (1), deny limit (1),
    // known powers (Smite = fixed + all from 1 chosen discipline = player selects at list creation).
    'Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and all powers from a chosen discipline.',
  ],
  unit_type: 'Character Model, Infantry',
  // SOURCE: "Psyker" is both a KEYWORD and an ABILITY.
  // As keyword → makes the model eligible for psychic power selection rules.
  // As ability → the text defines cast limit, deny limit, known powers, discipline access.
  keywords: ['Chaos Space Marine', 'Psyker'],
  is_vehicle: false,
  is_character: true,
  is_monster: false,
  is_psyker: true,
  has_armory_access: true,
  champion_has_armory: false,
  has_veteran_abilities: true,
  veteran_required: false,
  veteran_max: 2,
  locked_mark: null,
  advisor: false,
  default_size: 1,
  min_cost: 92,
};
