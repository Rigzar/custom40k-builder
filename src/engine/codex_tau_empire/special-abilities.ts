/**
 * codex_tau_empire/special-abilities — category 4 of 5 (Special ability).
 *
 * Migrated from `rules-model/tau_empire.md` §4-§5 (grounded in the `.ods` canon).
 *
 * Anti-duplication: the 3 archetypes / 7 legacies / 17 traits stay canonical in `archetypes.json`
 * (cross-check 3/7/17 exact); the 7 Sept armories live in `legion_sept.json`; the Ethereal
 * Invocations + Kroot Shaman psychic are NOT in production yet
 * (`ki-tau-empire-psychic-unwired-01`). This file documents the army-rule MECHANICS + customisation.
 */

export interface TauSpecialAbilityEntry {
  name: string;
  category: 'army-rule' | 'cast-system' | 'archetype' | 'legacy' | 'trait' | 'gap-note';
  text: string;
}

// Source: rules-model/tau_empire.md §4 (army rules) + §5 (archetypes/legacies/traits).
export const TAU_SPECIAL_ABILITIES: TauSpecialAbilityEntry[] = [
  // --- §4 army rules ---
  {
    name: 'Markerlight (signature mechanic)',
    category: 'army-rule',
    text: 'Verbatim (Index): a token economy — units place Markerlight tokens on enemies; tokens are ' +
      'spent (1-3 each) for benefits: auto-hit Seeker missiles, -Ld, Sunder(1), -Defensive-Fire ' +
      'penalty, re-roll ranged 1s, force a Battleshock test, or an off-board Seeker missile hit. Max ' +
      '4 tokens per enemy unit; unused tokens discarded at end of round. The defining Tau targeting ' +
      'mechanic.',
  },
  {
    name: 'Supporting Fire',
    category: 'army-rule',
    text: 'Verbatim (Index): a friendly unit within 6" of a charged unit may also use Defensive Fire ' +
      'at the charger (uses its own order token). The Defenders of the Cause trait extends range to ' +
      '12"; the Demiurg/Votann ally shares this rule.',
  },
  {
    name: 'Tactical philosophies',
    category: 'army-rule',
    text: 'Army-wide Unique equipment: pick Kauyon (bait → +1 S vs enemies near bait) / Mont\'ka ' +
      '(all units Deep Strike) / Rinyon (all Outflank + auto-Advance 6") / Rip\'yka (units shooting ' +
      'place 2 Markerlight tokens) at deployment (10p per 500p game size).',
  },

  // --- §4 cast-system (none base; archetype/Ethereal-granted) ---
  {
    name: 'Psykers / Ethereal Invocations (none base; archetype-granted)',
    category: 'cast-system',
    text: 'The base roster has 0 psykers. The Kroot Hunting Pack archetype upgrades a Kroot Master ' +
      'Shaper to a Shaman (psyker, Biomancy/Divination). Ethereals have "Invocations of the ' +
      'Ethereals" (a prayer system, `.ods` sheet). ⚠ NEITHER in production — see gap-note below.',
  },

  // --- §5 Archetypes (3) ---
  {
    name: 'Archetypes (3 total)',
    category: 'archetype',
    text: 'Budget 0-1 Archetype. Farsight Enclave (Crisis Battlesuits→Troops; no Ethereals; ' +
      'Broadside/Riptide as single-model HQs), Kroot Hunting Pack (Kroot Farstalkers→Objective ' +
      'Secured; Master Shaper→Shaman psyker; only Kroot count to mandatory minimums + 25% Troops), ' +
      'Stealth Cadre (Stealth Battlesuits→Troops; Ghostkeel→Troops per 6 Stealth models; must take a ' +
      'Commander w/ XV22 Stalker). Canonical in `archetypes.json`.',
  },

  // --- §5 Legacies (7) — each = one Sept ---
  {
    name: 'Legacies (7 total — each = one Sept)',
    category: 'legacy',
    text: 'Each grants one Sept\'s Armory (loaded as the \'Sept\' legacy): Devastating Counterstrike→' +
      'Farsight Enclaves / Hunter\'s Instincts→Kroot Kindred / Masters of Urban Warfare→Sa\'cea / ' +
      'Strength of Conviction→T\'au / Strike Fast→Vior\'la / Superior Craftsmanship→Bork\'an / ' +
      'Unifying Influence→Dal\'yth. Sept armories in `legion_sept.json`.',
  },

  // --- §5 Traits (17) ---
  {
    name: 'Traits (17 total — army-wide, 3-column pricing)',
    category: 'trait',
    text: 'Budget 0-2 Traits. 3-column NORMAL/CHARACTER/MC&V pricing: Advanced Miniaturization / ' +
      'Blacklight Markers / Calm under Pressure / Camouflage Experts / Combined Expansion (→"2nd ' +
      'Legacy") / Defenders of the Cause / Defensive Doctrines / Disengagement Protocols / Evasive ' +
      'Maneuvers / Fire Caste Marksman / Fire Saturation / Loyal to the End / Reliable Weaponry / ' +
      'Signature Evolutionary Adaption (Kroot adaptation pick) / Strike Swiftly / Swarm Controllers ' +
      '(more drones) / Turbo Jets. Canonical in `archetypes.json`.',
  },

  // --- §6 gap note ---
  {
    name: 'Ethereal Invocations + Kroot Shaman — RESOLVED 2026-09-20',
    category: 'gap-note',
    text: 'HALF STALE, HALF A REAL BUG, and worth keeping for the difference. STALE HALF: the '  +
      'four Invocations of the Ethereals ARE in production, loaded as prayers, and they match '  +
      'the sheet exactly (Calm of Tides, Storm of Fire, Sense of Stone, Zephyr\'s Grace). '  +
      'REAL HALF: the Kroot Master Shaper\'s +10 Shaman upgrade under Kroot Hunting Pack DID '  +
      'turn the unit into a psyker and charge for it, and no power picker ever opened — the '  +
      'unit card gated the whole psychic section on the FACTION having disciplines of its own, '  +
      'and the Tau have none. The Shaman\'s pool is Biomancy and Divination, which live in '  +
      'GENERAL_DISCIPLINES and are not part of FactionData. Measured: it is the ONLY unit in '  +
      'the game whose sole pool is the general list. Fixed; see check_optional_psyker_upgrade.ts.',
  },
];
