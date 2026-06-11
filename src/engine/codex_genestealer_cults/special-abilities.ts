/**
 * codex_genestealer_cults/special-abilities — category 4 of 5 (Special ability).
 *
 * Migrated from `rules-model/genestealer_cults.md` §4-§5 (grounded in the `.ods` canon).
 *
 * Anti-duplication: the 2 archetypes / 6 legacies / 15 traits stay canonical in `archetypes.json`
 * (cross-check 2/6/15 exact); the GSC psychic discipline + the 6 Legacy bonus powers are NOT in
 * production yet (`ki-genestealer-cults-psychic-unwired-01`). This file documents the army-rule
 * MECHANICS + customisation structure.
 */

export interface GscSpecialAbilityEntry {
  name: string;
  category: 'army-rule' | 'cast-system' | 'archetype' | 'legacy' | 'trait' | 'gap-note';
  text: string;
}

// Source: rules-model/genestealer_cults.md §4 (army rules) + §5 (archetypes/legacies/traits).
export const GSC_SPECIAL_ABILITIES: GscSpecialAbilityEntry[] = [
  // --- §4 army rules ---
  {
    name: 'Ambush (signature mechanic)',
    category: 'army-rule',
    text: 'Verbatim (Index): "For each started 500 points, one \'Ambush marker\' may be set up after ' +
      'all Infiltrators deploy, 12" from any enemy. Units with \'Ambush\' may be set up within 3" of ' +
      'it and given any order; or \'embark\' into a marker like a transport and re-enter from ' +
      'reserves next round." The defining GSC deployment/reserve mechanic. The Subterranean ' +
      'Ambushers trait grants extra markers (scaling by engagement type: +1 Skirmish / +2 Pitched / ' +
      '+3 Epic).',
  },
  {
    name: 'Psykers (Magus / Patriarch) + Broodmind discipline',
    category: 'cast-system',
    text: 'GSC has 2 `is_psyker` units (Magus, Patriarch) + the Crown of Ascendancy equipment ' +
      '(grants the Broodmind discipline). The `.ods` has a "GSC psychic discipline" (37 rows). ⚠ NOT ' +
      'in production — see gap-note below.',
  },

  // --- §5 Archetypes (2, AOP-shuffle) ---
  {
    name: 'Archetypes (2 total)',
    category: 'archetype',
    text: 'Budget 0-1 Archetype. Both AOP-shuffle: The First Curse (Purestrain Genestealers→Troops; ' +
      'must take a Patriarch; only Purestrains count to 25%), Outlander Claw (Atalan Jackals→Troops; ' +
      'Outflank on turn 1; <12"M units must start embarked). Canonical in `archetypes.json`.',
  },

  // --- §5 Legacies (6) — each grants a bonus psychic power (GK shape) ---
  {
    name: 'Legacies (6 total — each grants a bonus psychic power)',
    category: 'legacy',
    text: 'GK-shaped legacies (bonus-power grant, NOT armory-access): each grants ALL Psykers one ' +
      'additional power — Chancer\'s Vale→Last Gasp / Feinminster Gamma→Broodvolt Surge / New ' +
      'Gidlam→Synaptic Blast / Newseam→Inescapable Decay / Trysst Dynasty→Undermine / Vejovium III→' +
      'Mutagenic Deviation. The 6 named powers + the Broodmind discipline live in the GSC psychic ' +
      'discipline (NOT in production — see gap-note). Canonical structure in `archetypes.json`.',
  },

  // --- §5 Traits (15) ---
  {
    name: 'Traits (15 total — army-wide, 3-column pricing)',
    category: 'trait',
    text: 'Budget 0-2 Traits. 3-column NORMAL/CHARACTER/MC&V pricing (`*` = per Wound/Hull): Agile ' +
      'Guerillas / Alien Fury / Cyborgised Hybrids / Deep Supplies / Devoted Zealots / Disciplined ' +
      'Militants / Experimental Subjects / Hunter\'s Instincts / Martial / Nomadic Survivalists / ' +
      'Splinter Cult (→"2nd Legacy") / Subterranean Ambushers (extra Ambush markers) / Synaptic ' +
      'Resonance (psyker re-roll) / Toxin Agents / War Convoy. Canonical in `archetypes.json`.',
  },

  // --- §6 gap note ---
  {
    name: 'GSC psychic discipline + Legacy powers not wired (ki-genestealer-cults-psychic-unwired-01)',
    category: 'gap-note',
    text: 'The `.ods` has a "GSC psychic discipline" (37 rows, the Broodmind discipline) and the 6 ' +
      'Legacies each grant a named bonus power, and GSC has 2 psyker units + the Crown of ' +
      'Ascendancy, but `loaders.ts` imports only units+general+archetypes (disciplines slot `{}`). ' +
      'Same gap class as IG (`ki-ig-psychic-unwired-01`). Larger separate scope.',
  },
];
