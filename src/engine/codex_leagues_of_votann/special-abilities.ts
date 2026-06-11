/**
 * codex_leagues_of_votann/special-abilities — category 4 of 5 (Special ability).
 *
 * Migrated from `rules-model/leagues_of_votann.md` §4-§5 (grounded in the `.ods` canon).
 *
 * Anti-duplication: the 4 archetypes / 5 legacies / 16 traits stay canonical in `archetypes.json`
 * (cross-check 4/5/16 exact); the 5 League armories live in `legion_league.json`; the Skeinwrought
 * discipline is NOT in production yet (`ki-leagues-of-votann-psychic-unwired-01`). This file
 * documents the army-rule MECHANICS + customisation structure.
 */

export interface VotannSpecialAbilityEntry {
  name: string;
  category: 'army-rule' | 'cast-system' | 'archetype' | 'legacy' | 'trait' | 'gap-note';
  text: string;
}

// Source: rules-model/leagues_of_votann.md §4 (army rules) + §5 (archetypes/legacies/traits).
export const VOTANN_SPECIAL_ABILITIES: VotannSpecialAbilityEntry[] = [
  // --- §4 army rules ---
  {
    name: 'Eye of the Ancestors (signature mechanic)',
    category: 'army-rule',
    text: 'Verbatim (Index): a Judgement-token economy — "each time a friendly unit is removed, ' +
      'place a Judgement token by the enemy unit that caused the last wound (max 2). Friendly units ' +
      'attacking a target with ≥1 token gain cumulative benefits: 1 token = re-roll 1 hit/' +
      'activation; 2 tokens = re-roll 1 wound/activation." Joined characters pool tokens; split on ' +
      'leaving. Several traits feed/exploit tokens (Grudgebearers, Quick to Judge, Vengeful, Brutal ' +
      'Efficiency).',
  },
  {
    name: 'Steady Advance',
    category: 'army-rule',
    text: 'Verbatim (Index): "The unit can never receive an \'Advance\' order and gains \'Move ' +
      'through cover\'." (The Frontier Momentum trait re-enables Advance.)',
  },
  {
    name: 'Void armor',
    category: 'army-rule',
    text: 'Verbatim (Index): "Enemy attacks reduce their AT and AP value by -1 (min 0 each)." ' +
      'Army-wide defensive rule.',
  },

  // --- §4 cast-system ---
  {
    name: 'Psyker (Grimnyr) + Skeinwrought discipline',
    category: 'cast-system',
    text: 'Votann has one psyker unit (Grimnyr). The `.ods` has a "Skeinwrought discipline" (19 ' +
      'rows). ⚠ NOT in production — see gap-note below.',
  },

  // --- §5 Archetypes (4) ---
  {
    name: 'Archetypes (4 total)',
    category: 'archetype',
    text: 'Budget 0-1 Archetype. Demiurg → cross-faction (Battle Brothers with Tau; must field/be an ' +
      'Allied Tau detachment). Einhyr Guard (Einhyr Hearthguard→Troops; must take a Kâhl/High Kâhl ' +
      'HQ; Hearthkyn→Elite), Hearthfyre Arsenal (a free Brôkhyr Iron-master per 500 pts; Hearthkyn ' +
      'don\'t count to 25%), Persecution Prospect (Hernkyn Yaegirs→Troops; non-Infiltrate <12"M ' +
      'units must start embarked). Canonical in `archetypes.json`.',
  },

  // --- §5 Legacies (5) — each = one League ---
  {
    name: 'Legacies (5 total — each = one League)',
    category: 'legacy',
    text: 'Each grants one League\'s Armory (loaded as the \'League\' legacy): League of Explorers→' +
      'Trans-Hyperain Alliance / League of Leagues→Greater Thurian League / League of Magnates→Ymir ' +
      'Conglomerate / League of Sentinels→Urani-Surtr Regulates / League of Warriors→Kronus ' +
      'Hegemony. League armories in `legion_league.json`.',
  },

  // --- §5 Traits (16) ---
  {
    name: 'Traits (16 total — army-wide, 3-column pricing)',
    category: 'trait',
    text: 'Budget 0-2 Traits. 3-column NORMAL/CHARACTER/MC&V pricing (`*` = per Wound/Hull; many ' +
      'Judgement-token-themed): Brutal Efficiency / Dour Survivalists / Frontier Momentum / Fury ' +
      'from the Delve / Grudgebearers / Honor in Toil / HUNTR\'s Mark / Ironskein / Martial ' +
      'Cloneskeins / Master Salvagers / Pan-Spectral Visualizers / Quick to Judge / Ranger ' +
      'Outriders / Trivârg Cyber Implants / Vengeful / Voidship Specialists. Canonical in ' +
      '`archetypes.json`.',
  },

  // --- §6 gap note ---
  {
    name: 'Skeinwrought discipline not wired (ki-leagues-of-votann-psychic-unwired-01)',
    category: 'gap-note',
    text: 'The `.ods` has a "Skeinwrought discipline" (19 rows) and Votann has a psyker (Grimnyr), ' +
      'but `loaders.ts` imports only units+general+archetypes+League armory (disciplines slot `{}`). ' +
      'Same gap class as IG (`ki-ig-psychic-unwired-01`). Larger separate scope.',
  },
];
