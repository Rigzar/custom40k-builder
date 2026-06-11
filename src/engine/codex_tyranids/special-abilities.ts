/**
 * codex_tyranids/special-abilities — category 4 of 5 (Special ability).
 *
 * Migrated from `rules-model/tyranids.md` §4-§5 (grounded in the `.ods` canon).
 *
 * Anti-duplication: the 3 archetypes / 5 legacies stay canonical in `archetypes.json` (cross-check
 * 3/5/0 exact — NO traits exist); the 5 Hive Fleet armories live in `legion_hive_fleet.json`; the
 * Tyranid psychic discipline is NOT in production yet (`ki-tyranids-psychic-unwired-01`). This file
 * documents the army-rule MECHANICS + customisation structure.
 */

export interface TyranidSpecialAbilityEntry {
  name: string;
  category: 'army-rule' | 'cast-system' | 'archetype' | 'legacy' | 'confirmed-absence' | 'gap-note';
  text: string;
}

// Source: rules-model/tyranids.md §4 (army rules) + §5 (archetypes/legacies/traits).
export const TYRANID_SPECIAL_ABILITIES: TyranidSpecialAbilityEntry[] = [
  // --- §4 army rules ---
  {
    name: 'Synapse (signature mechanic)',
    category: 'army-rule',
    text: 'Verbatim (Index): units within 12" of a Synapse model are "in Synapse range" — ignore Ld ' +
      'modifiers, count as full strength, convert failed Ld tests into Mortal Wounds (no Battleshock ' +
      'token, count as passed), and clear Battleshock at Rally. Synapse models explode like a ' +
      'vehicle on death. The defining Tyranid command-and-control web.',
  },
  {
    name: 'Instinctive Behaviour',
    category: 'army-rule',
    text: 'Verbatim (Index): a unit outside Synapse range with no Battleshock marker gains one at ' +
      'Rally (removable only by re-entering Synapse range); a fleeing such unit moves toward the ' +
      'nearest Synapse unit.',
  },
  {
    name: 'Shadow in the Warp',
    category: 'army-rule',
    text: 'Verbatim (Index): enemy psykers suffer -1 to manifest/deny in battle rounds 2-3, ' +
      'increasing to -2 in rounds 4-5.',
  },
  {
    name: 'Psychic Feedback',
    category: 'army-rule',
    text: 'Verbatim (Index): "Instead of rolling on the Perils of the Warp table, the model suffers ' +
      '1 Mortal Wound."',
  },

  // --- §4 cast-system ---
  {
    name: 'Psykers (7 units) + Tyranid psychic discipline',
    category: 'cast-system',
    text: 'Tyranids are very psyker-dense (7 `is_psyker` units). The `.ods` has a "Tyranid psychic ' +
      'discipline" (19 rows). ⚠ NOT in production — see gap-note below.',
  },

  // --- §5 Archetypes (3) ---
  {
    name: 'Archetypes (3 total)',
    category: 'archetype',
    text: 'Budget 0-1 Archetype. Flying Death (Gargoyle/Tyranid Warrior Broods with the Winged ' +
      'biomorph → Troops; half must start in reserves), Megafauna (Carnifex Broods → Troops), ' +
      'Tyrannocyte Assault (all units start embarked in Tyrannocytes; arrive automatically rounds ' +
      '1-2). Flying Death gates on the "Winged" Special Biomorph (see weapon-abilities.ts). ' +
      'Canonical in `archetypes.json`.',
  },

  // --- §5 Legacies (5) — each = one Hive Fleet ---
  {
    name: 'Legacies (5 total — each = one Hive Fleet)',
    category: 'legacy',
    text: 'Each grants one Hive Fleet\'s Hive Armory (loaded as the \'Hive Fleet\' legacy): Adaptive ' +
      'Toxins→Gorgon / Bio-Barrage→Kronos / Hyper-Aggression→Behemoth / Questing Tendrils→Kraken / ' +
      'Synaptic Control→Leviathan. Hive Fleet armories in `legion_hive_fleet.json`.',
  },

  // --- §5 confirmed absence ---
  {
    name: 'No Traits',
    category: 'confirmed-absence',
    text: 'Genuine absence — the Army Customisation budget line reads only "0-1 Archetype, 0-1 ' +
      'Legacy" (no Traits), and there is no TRAITS section. Production `archetypes.json` confirms ' +
      '`traits: []`. Same shape as Custodes/Harlequins. (Tyranid customisation lives in the per-unit ' +
      'Biomorph system instead — see weapon-abilities.ts.)',
  },

  // --- §6 gap note ---
  {
    name: 'Tyranid psychic discipline not wired (ki-tyranids-psychic-unwired-01)',
    category: 'gap-note',
    text: 'The `.ods` has a "Tyranid psychic discipline" (19 rows) and Tyranids have 7 psyker units ' +
      '(the most psyker-dense faction), but `loaders.ts` imports only units+general[empty]+' +
      'archetypes+Hive Fleet armory (disciplines slot `{}`). Same gap class as IG ' +
      '(`ki-ig-psychic-unwired-01`). Larger separate scope.',
  },
];
