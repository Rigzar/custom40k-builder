/**
 * codex_necrons/special-abilities — category 4 of 5 (Special ability).
 *
 * Migrated from `rules-model/necrons.md` §4-§5 (grounded in the `.ods` canon).
 *
 * Anti-duplication: the 4 archetypes / 6 legacies / 17 traits stay canonical in `archetypes.json`
 * (cross-check 4/6/17 exact); the 6 Dynasty armories live in `legion_dynasty.json`; the Powers of
 * the C'tan are NOT in production yet (`ki-necrons-psychic-unwired-01`). This file documents the
 * army-rule MECHANICS + customisation structure.
 */

export interface NecronSpecialAbilityEntry {
  name: string;
  category: 'army-rule' | 'cast-system' | 'archetype' | 'legacy' | 'trait' | 'gap-note';
  text: string;
}

// Source: rules-model/necrons.md §4 (army rules) + §5 (archetypes/legacies/traits).
export const NECRON_SPECIAL_ABILITIES: NecronSpecialAbilityEntry[] = [
  // --- §4 army rules ---
  {
    name: 'Reanimation Protocols (signature mechanic)',
    category: 'army-rule',
    text: 'Verbatim (Index, paraphrase): an RPoint (Reanimation Point) economy — the army gets 3 ' +
      'RPoints per 500 pts; each Reinforcement phase, units are allocated RPoints to heal lost ' +
      'wounds / revive slain models (roll 4+ per RPoint to restore a wound; the RPoint is retained ' +
      'on 3+, lost on 1-2). Damaged models heal before slain models return. Models killed by a ' +
      'weapon with ≥2× their Toughness cannot use it. The defining Necron resilience mechanic. (An ' +
      'EXPERIMENTAL alternate version is listed in the Index — opt-in, not part of the migration.)',
  },
  {
    name: 'Gauss',
    category: 'army-rule',
    text: 'Verbatim (Index): "To wound rolls of 5+ against creatures are always successful. AT rolls ' +
      'of 5+ against vehicles gain a cumulative +1 AT and always inflict at least a Glancing Hit." ' +
      'The signature Necron weapon rule.',
  },
  {
    name: 'Tesla',
    category: 'army-rule',
    text: 'Verbatim (Index): "To hit rolls of 5+ are always successful and the target suffers 2 ' +
      'additional automatic hits." (Shared with AdMech/Orks.)',
  },

  // --- §4 cast-system ---
  {
    name: "Psyker + Powers of the C'tan",
    category: 'cast-system',
    text: 'Necrons have one psyker unit. The `.ods` has a "Powers of the Ctan" sheet (the C\'tan ' +
      'Shards\' power system — the 4 C\'tan Shards draw their powers from it). ⚠ NOT in production — ' +
      'see gap-note below.',
  },

  // --- §5 Archetypes (4) ---
  {
    name: 'Archetypes (4 total)',
    category: 'archetype',
    text: 'Budget 0-1 Archetype. Canoptek Court (only Crypteks as HQ, 2 per slot; <Canoptek> units ' +
      'gain Objective Secured!), Destroyer Cult (roster restricted to Destroyer/Skorpekh/Canoptek/' +
      'C\'tan units; Skorpekh Destroyers→Troops), Obeisance Phalanx (Lord/Overlord HQ; Lychguard/' +
      'Triarch Praetorians→Troops, no other Troops), Yngir (a C\'tan Shard counts as HQ, +stats +85 ' +
      'pts + Time\'s Arrow; Pariahs→Troops). Canonical in `archetypes.json`.',
  },

  // --- §5 Legacies (6) — each = one Dynasty ---
  {
    name: 'Legacies (6 total — each = one Dynasty)',
    category: 'legacy',
    text: 'Each grants one Dynasty\'s Armory (loaded as the \'Dynasty\' legacy): Channeling Solar ' +
      'Energies→Nephrekh / Extermination of all Life→Szarekhan / Industrial Slaughter→Novokh / ' +
      'Secure Borders→Nihilakh / Starkillers→Mephrit / The Lord of the Storm→Sautekh. Dynasty ' +
      'armories in `legion_dynasty.json`.',
  },

  // --- §5 Traits (17) ---
  {
    name: 'Traits (17 total — army-wide, 3-column pricing)',
    category: 'trait',
    text: 'Budget 0-2 Traits. 3-column NORMAL/CHARACTER/MC&V pricing (several <Necron>/<Canoptek>-' +
      'gated + RPoint-themed; some mutually exclusive): Arise against Interlopers / Awakened by ' +
      'Murder / Eternal Conquerors / Immovable Phalanx (⊗ Merciless Hunters) / Interplanetary ' +
      'Invasors / Isolationists / Masters of the Martial / Merciless Hunters / RAD-wreathed / ' +
      'Relentless Expansionism (⊗ Translocation Beams) / Solar Fury / Superior Artisans / The ' +
      'unmerciful Horde / Translocation Beams / Vassal Dynasty (→"2nd Legacy") / Vengeful Stars / ' +
      'Warrior Nobles. Canonical in `archetypes.json`.',
  },

  // --- §6 gap note ---
  {
    name: "Powers of the C'tan not wired (ki-necrons-psychic-unwired-01)",
    category: 'gap-note',
    text: 'The `.ods` has a "Powers of the Ctan" sheet (the C\'tan Shards\' power system) and Necrons ' +
      'have a psyker unit, but `loaders.ts` imports only units+general+archetypes+Dynasty armory ' +
      '(disciplines slot `{}`). Same gap class as IG (`ki-ig-psychic-unwired-01`). Larger separate ' +
      'scope.',
  },
];
