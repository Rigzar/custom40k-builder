/**
 * codex_csm/special-abilities — category 3 of 5 in the codex.ts data model (Special ability).
 *
 * SKELETON — not yet filled. Special abilities are model/army-level rules — including
 * **Psyker** (rectified 2026-06-08: it has its own mechanic, but conceptually it's a special
 * ability, not a unit keyword — see PLAN_PROYECTO.md §1 and the note in keywords.ts about why
 * the engine still gates on it as a keyword for now).
 *
 * Source material to migrate from `digest.md`:
 *   - §4  General armory-wide rules                                  (line ~152)
 *   - §4b Army-specific rules — Favored Units, Summoning,
 *         Mark of Chaos Undivided                                    (line ~157)
 *   - §6  Cast systems — Psychic Disciplines / Prayers / Pacts       (line ~716)
 *     - §6a Psychic Disciplines (6)                                  (line ~728)
 *     - §6b Prayers to the Dark Gods (Dark Apostle)                  (line ~783)
 *     - §6c Infernal Pacts (Infernal Acolyte)                        (line ~799)
 *   - Per-datasheet special/veteran abilities scattered through §4d–§4i
 */

export interface CsmSpecialAbilityEntry {
  /** Ability name, verbatim from canonical text */
  name: string;
  /** Where it comes from: army rule, datasheet ability, cast-system power, etc. */
  source: 'army-rule' | 'datasheet' | 'discipline' | 'prayer' | 'pact';
  /** Verbatim rule text or a faithful summary — never paraphrased from training memory */
  text?: string;
}

// Populated from digest.md §4 (general armory rules) + §4b (army-specific rules) + §6
// (cast-system mechanics). Two things are DELIBERATELY NOT duplicated here, per the
// keywords-not-flags / production-JSON-canonical philosophy (GOLDEN RULE — one source
// of truth, no drift):
//   - Per-mark verbatim grants + sacred numbers + Animosity rivalry matrix → already
//     catalogued in keywords.ts CSM_KEYWORDS (mark axis, digest §4b step 4). This file
//     only documents the SPECIAL-ABILITY-level mechanics that ride on top of marks
//     (Favored Units, Animosity's army-mark/join rules, Mark of Chaos Undivided).
//   - The 36 Psychic Powers / 10 Prayers / 6 Infernal Pacts themselves → live in
//     `data/parsed/chaos_space_marines/psychic/disciplines.json` (production canonical).
//     This file only documents the THREE CAST SYSTEMS' mechanics (who casts what,
//     complexity tiers, god-gating) — the army/model-level "special ability" framing,
//     not the spell-list data.
// Per-datasheet special/veteran abilities scattered through §4d-4i are NOT catalogued
// here either — they live on each unit's own `abilities[]`/veteran option groups in
// production data (already SOURCE-audited per-unit, see project_csm_unit_audit memory).
export const CSM_SPECIAL_ABILITIES: CsmSpecialAbilityEntry[] = [
  // ── §4 General armory-wide rules (verbatim, 3 bullets) ──────────────────────
  {
    name: 'General Armory rules',
    source: 'army-rule',
    text: '"Unless stated otherwise, every item can only be purchased once by each model." '
        + '"Any model with access to the Armory can buy as many items as it wants." '
        + '"Items with a cost of \'-\' can not be selected."',
  },

  // ── §4b Army-specific rules ─────────────────────────────────────────────────
  {
    name: 'Marks of Chaos count as a veteran ability',
    source: 'army-rule',
    text: 'Every Mark of Chaos "Counts as a veteran ability" — "If a unit already is equipped '
        + 'with a mark, its benefits are included in the unit\'s profile." (Per-mark verbatim '
        + 'grants — Khorne/Nurgle/Slaanesh/Tzeentch/Undivided — and their sacred numbers and '
        + 'Animosity rivalries are catalogued in keywords.ts CSM_KEYWORDS, mark axis.)',
  },
  {
    name: 'Favored Units',
    source: 'army-rule',
    text: 'A unit with a Mark of Chaos that has the same number of models as its god\'s sacred '
        + 'number (or a multiple of it) counts as Favored: its squad leader gains +1 Attack and '
        + 'a personal icon. Squad leaders are single models with sole armory access. Sacred '
        + 'numbers (Tzeentch 9 / Khorne 8 / Nurgle 7 / Slaanesh 6) live in keywords.ts.',
  },
  {
    name: 'Summoning',
    source: 'army-rule',
    text: 'If the army contains Chaos Daemons codex units, they must start the battle in reserve '
        + '(Nurglings excepted — they may deploy normally). Characters cannot join Daemon units. '
        + 'Chaos Daemons cannot fulfil mandatory AOP selections (open question on enforcement: '
        + 'see ki-csm-summoning-mandatoryaop-01).',
  },
  {
    name: 'Animosity of the Gods',
    source: 'army-rule',
    text: 'The army\'s most expensive HQ model sets the army\'s "Mark" — its Mark of Chaos '
        + 'determines which other marks/units may be used at all (Khorne ✗ Slaanesh and '
        + 'Nurgle ✗ Tzeentch are mutually exclusive; a forbidden mark cannot be fielded even as '
        + 'an ally — e.g. a Khorne HQ blocks Slaanesh Daemonettes brought in as allies). The '
        + 'compatibility matrix is enforced (animosity.json + validators.ts allowedMarks, also '
        + 'mirrored in keywords.ts). A separate sub-clause — "a model with a Mark may only join '
        + 'units with the same mark or none" — is documented but NOT enforced in code '
        + '(ki-csm-animosity-joinmark-01). The `Abaddon\'s Chosen` archetype switches Animosity '
        + 'off entirely.',
  },
  {
    name: 'Mark of Chaos Undivided',
    source: 'army-rule',
    text: 'Progressive kill-based benefits for models bearing this mark: 1st kill grants one '
        + 'Mark benefit (non-character level); 2nd kill upgrades it to character-level; 3rd kill '
        + 'grants one Daemon Weapon ability of a chosen god; 4th kill replaces the model\'s base '
        + 'stats with those of a Daemon Prince of the chosen god. If the model loses its last '
        + 'Wound before earning any benefit, it is replaced by a Chaos Spawn under the '
        + 'opponent\'s control.',
  },

  // ── §6 Cast systems — mechanics only (spell-list data lives in disciplines.json) ──
  {
    name: 'Psyker',
    source: 'army-rule',
    text: 'A model/army-level special ability rather than an intrinsic unit trait — granted by '
        + 'datasheet text (Chaos Sorcerer, Daemon Prince psyker upgrade, Master of Sorcery, '
        + 'Tzaangor Shaman, Dark Commune, Rubric Marines, Scarab Occult Terminators) or by the '
        + 'Mark of Tzeentch (turns the bearer into a psyker / grants extra casts). "Psyker '
        + 'datasheet text defines power access": the Chaos Sorcerer knows Smite + ALL powers of '
        + 'ONE chosen discipline; the Daemon Prince knows Smite + 1 power of a chosen discipline; '
        + 'Master of Sorcery gets +1 cast/+1 deny per round. Mark of Khorne ✗ Psyker — a '
        + 'validator blocks the combination (no Khorne option on the Sorcerer; the Daemon Prince '
        + 'psyker upgrade requires "no Mark of Khorne"). NOTE: conceptually a special ability, '
        + 'but the engine still gates armory items on it as a structural keyword '
        + '(`requires_keywords: ["Psyker"]` via effectiveKeywords()) — splitting the gating '
        + 'cleanly is deferred to the codex.ts engine pass (see project_codex_csm_pilot memory).',
  },
  {
    name: 'Psychic Powers (Disciplines of Chaos)',
    source: 'discipline',
    text: 'Cast system for Psykers (Chaos Sorcerer, Daemon Prince w/ psyker upgrade, Master of '
        + 'Sorcery). Each power has a Type (Augmentation / Witchfire / Malediction), a Cast '
        + 'Value and a Complexity tier (Basic / Normal / Complex). Six disciplines, four of them '
        + 'god-gated: Change = Tzeentch only, Decay = Nurgle only, Excess = Slaanesh only, Dark '
        + 'Hereticus & Malefic = no god restriction, Cult Powers = Cult initiates only. Shares '
        + 'the Skirmish "max 1 cast per turn" cap with Prayers and Infernal Pacts. The 36 '
        + 'powers themselves (verbatim Type/Range/Target/CV/Complexity/Effect) are catalogued '
        + 'in `data/parsed/chaos_space_marines/psychic/disciplines.json` — production canonical, '
        + 'not duplicated here.',
  },
  {
    name: 'Prayers to the Dark Gods',
    source: 'prayer',
    text: 'Faith-based cast system exclusive to the Dark Apostle (does not use Cast Value or '
        + 'Type — Complexity is always Easy). Ten prayers split into five "Upper" and five '
        + '"Lower" prayers. Shares the Skirmish "max 1 cast per turn" cap with Psychic Powers '
        + 'and Infernal Pacts. The full prayer list lives alongside the discipline data '
        + '(production canonical), not duplicated here.',
  },
  {
    name: 'Infernal Pacts',
    source: 'pact',
    text: 'Pact-based cast system exclusive to the Infernal Acolyte (does not use Cast Value or '
        + 'Type — Complexity is always Normal). Six pacts. Shares the Skirmish "max 1 cast per '
        + 'turn" cap with Psychic Powers and Prayers. The full pact list lives alongside the '
        + 'discipline data (production canonical), not duplicated here.',
  },
];
