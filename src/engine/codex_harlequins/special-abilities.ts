/**
 * codex_harlequins/special-abilities — category 4 of 5 (Special ability).
 *
 * Migrated from `rules-model/harlequins.md` §4-§5 (grounded in the `.ods` canon).
 *
 * Harlequins have NO Army Customisation (no archetypes/legacies/traits — the `.ods` has no such
 * sheet, production has no `archetypes.json`, the loader passes `noArch`). Same confirmed-absence
 * shape as Inquisition. This file documents the army-rule mechanics + the confirmed absence.
 */

export interface HarlequinsSpecialAbilityEntry {
  name: string;
  category: 'army-rule' | 'cast-system' | 'confirmed-absence' | 'gap-note';
  text: string;
}

// Source: rules-model/harlequins.md §4 (army rules) + §5 (none).
export const HARLEQUINS_SPECIAL_ABILITIES: HarlequinsSpecialAbilityEntry[] = [
  // --- §4 army rules ---
  {
    name: 'Shuriken',
    category: 'army-rule',
    text: 'Verbatim (Index): "To wound rolls of 5+ gain additional -2 AP." (Identical to the Eldar ' +
      'Shuriken rule.)',
  },
  {
    name: 'Webway strike',
    category: 'army-rule',
    text: 'Verbatim (Index): "For each started 1000 points, one infantry unit (including attached ' +
      'character models) may be set up using the rules for Infiltrators for +1 point per Wound." ' +
      '(Identical to the Eldar Webway strike / Dark Eldar Webway raid.)',
  },
  {
    name: 'Native ally for Eldar + Dark Eldar',
    category: 'army-rule',
    text: 'Harlequins are accessed by BOTH Eldar and Dark Eldar via their "Visitors of the Black ' +
      'Library" army rule ("Harlequins cannot be the mandatory HQ selection"). A small standalone ' +
      'faction that doubles as a native ally for the two Aeldari codices.',
  },

  // --- §4 cast-system ---
  {
    name: 'Psyker (Shadowseer) + Harlequins psychic discipline',
    category: 'cast-system',
    text: 'The Shadowseer is the lone `is_psyker` unit. The `.ods` has a "Harlequins psychic ' +
      'discipline" (19 rows). ⚠ NOT in production — see gap-note below.',
  },

  // --- §5 confirmed absence ---
  {
    name: 'No archetypes / legacies / traits',
    category: 'confirmed-absence',
    text: 'NONE — there is no "Army Customisation" sheet in `Harlequins.ods`, production has no ' +
      '`archetypes.json`, and the loader passes `noArch`. Same structural absence as Inquisition ' +
      '([[project_inquisition_codex_migration]]) — the second faction with a genuinely absent Army ' +
      'Customisation tab. A tiny, customisation-free supplement faction.',
  },

  // --- §6 gap note ---
  {
    name: 'Harlequins psychic discipline not wired (ki-harlequins-psychic-unwired-01)',
    category: 'gap-note',
    text: 'The `.ods` has a "Harlequins psychic discipline" (19 rows) and the Shadowseer is a ' +
      'psyker, but `loaders.ts:harlequins` imports only units + general armory (disciplines slot ' +
      '`{}`). Same gap class as IG (`ki-ig-psychic-unwired-01`) / Eldar (`ki-eldar-psychic-' +
      'unwired-01`). Compounds when Harlequins are fielded as an Eldar/Dark-Eldar ally (those ' +
      'factions have their own psychic gaps). Larger separate scope.',
  },
];
