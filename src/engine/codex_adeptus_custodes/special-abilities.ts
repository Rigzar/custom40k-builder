/**
 * codex_adeptus_custodes/special-abilities — category 4 of 5 (Special ability).
 *
 * Migrated from `rules-model/adeptus_custodes.md` §4-§5 (grounded in the `.ods` canon).
 *
 * Anti-duplication: the 2 archetypes / 5 legacies stay canonical in `archetypes.json` (cross-check
 * 2/5/0 exact — NO traits exist); the 5 Shield Host armories live in `legion_shield_host.json`.
 * This file documents the army-rule MECHANICS + customisation structure.
 */

export interface CustodesSpecialAbilityEntry {
  name: string;
  category: 'army-rule' | 'archetype' | 'legacy' | 'confirmed-absence';
  text: string;
}

// Source: rules-model/adeptus_custodes.md §4 (army rules) + §5 (archetypes/legacies/traits).
export const CUSTODES_SPECIAL_ABILITIES: CustodesSpecialAbilityEntry[] = [
  // --- §4 army rules ---
  {
    name: 'Shield Host (signature army rule)',
    category: 'army-rule',
    text: 'Verbatim (Index): any model with this rule "can contest a mission objective while being ' +
      'in the same table quarter and hold a mission objective while being within 12" of it, ' +
      'instead of the regular 3". Additionally, the model gains \'Objective secured!\'. ' +
      'Additionally, if the model would gain two Battleshock tokens, it instead is set to one ' +
      'token. Additionally, all attacks gain \'Precision(5+)\'." The defining Custodes army-wide ' +
      'rule.',
  },
  {
    name: 'Lightning strike',
    category: 'army-rule',
    text: 'Verbatim (Index): "For each started 1000 points of game size, one Infantry/Walker unit ' +
      '(including attached character models) may be set up using the rules for Deep Strike for ' +
      '+1/+4 point(s) per Wound/Hull Point." A points-scaled Deep-Strike grant (cf. GK Teleport ' +
      'strike token economy).',
  },

  // --- §5 Archetypes (2, AOP-shuffle) ---
  {
    name: 'Archetypes (2 total)',
    category: 'archetype',
    text: 'Budget 0-1 Archetype. Both AOP-shuffle (no cross-faction ally-matrix): Kataphraktoi ' +
      '(Jetbike Custodians→Troops; <12"M units must start embarked; no-transport <12"M units can\'t ' +
      'be taken), Tharanatoi (Allarus + Aquilon Custodians→Troops; Custodian Guard + Sisters of ' +
      'Silence→Elite). Canonical in `archetypes.json`.',
  },

  // --- §5 Legacies (5) — each = one Shield Host ---
  {
    name: 'Legacies (5 total — each = one Shield Host)',
    category: 'legacy',
    text: 'Each Legacy unlocks one Shield Host\'s Armory: Castellans of the Blessed Worlds→Solar ' +
      'Watch / Gilded Guardians→Aquilan Shield / Instruments of His Wrath→Dread Host / The ' +
      'Hostless→Emperor\'s Chosen / Warders of the Dark Cells→Shadowkeepers. Shield Host armories ' +
      'in `legion_shield_host.json`.',
  },

  // --- §5 confirmed absence ---
  {
    name: 'No Traits',
    category: 'confirmed-absence',
    text: 'Genuine absence — the Army Customisation budget line reads only "0-1 Archetype, 0-1 ' +
      'Legacy" (no Traits), and there is no TRAITS section. Production `archetypes.json` confirms ' +
      '`traits: []`. A STRONGER absence than GK\'s "tab present, category empty" — Custodes\' budget ' +
      'never mentions Traits at all.',
  },
];
