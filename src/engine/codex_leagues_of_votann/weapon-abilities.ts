/**
 * codex_leagues_of_votann/weapon-abilities — category 5 of 5 (FINAL) (Weapon ability).
 *
 * Migrated from `rules-model/leagues_of_votann.md` §2 (gating) + §3 (points). NOT the named weapon
 * abilities themselves (Deflagrate/Sunder/Suppression — canonical in coreRules.ts).
 *
 * Closes Fase 4 for Leagues of Votann — 5/5 — SIXTEENTH faction. Exo-armor ᴱ-gate (a populated
 * armour axis, like Orks/Custodes/CSM); no veteran tier.
 */

export interface VotannWeaponAbilityEntry {
  name: string;
  category: 'gating' | 'points' | 'structural';
  text: string;
}

// Source: rules-model/leagues_of_votann.md §2 (gating) + §3 (points).
export const VOTANN_WEAPON_ABILITIES: VotannWeaponAbilityEntry[] = [
  // --- §2 gating ---
  {
    name: 'Exo-armor (ᴱ glyph) gating',
    category: 'gating',
    text: 'Standard heavy-armour gate — 14/27 armory items carry the ᴱ glyph (".ods: Models in ' +
      'Exo-armor can only receive equipment marked with ᵀ"). Restricted to Exo-armoured models ' +
      '(Exo-armor is a purchasable item). Glyph-encoded (ᴱ in the name), not `armourKeyword`/' +
      '`term_compat`. Plus a "Weavefield crest (Exo)" variant "Exo-armor only".',
  },
  {
    name: '"Only for infantry" prose restrictions',
    category: 'gating',
    text: 'Free-text restrictions (Exo-armor / Skimmer bike "infantry only", etc.). Same prose-match ' +
      'pattern as the other factions.',
  },
  {
    name: 'Vehicle Equipment (7) — `category: \'vehicle\'` + `is_vehicle`',
    category: 'gating',
    text: 'Accelerated engine / Additional void armor / Ancestor\'s judgement warhead / Improved ' +
      'targeting scanner / Jammer / Refined power cores / Smoke Launcher — gated by ' +
      '`category: "vehicle"` + unit `is_vehicle`. FIXED 2026-06-11 ' +
      '(`ki-leagues-of-votann-vetvehcategory-01`): all 7 (idx 20-26) tagged. POINTS already in ' +
      '`p_unit` — no value-move.',
  },
  {
    name: 'NO Veteran-Ability tier (by design)',
    category: 'gating',
    text: 'No VETERAN ABILITIES armory section; 0 `has_veteran_abilities` units — like CD/Sororitas/' +
      'Aeldari/GSC/Orks/Tyranids. No `category:"veteran"` work applies.',
  },

  // --- §3 points ---
  {
    name: 'Standard equipment pricing (`p_unit`/`p_char`)',
    category: 'points',
    text: 'Armory "POINTS" (`p_unit`) + "POINTS CHARACTER" (`p_char`) columns. Mirrors the cross-' +
      'faction `getItemPts`. No `× item.size` for regular gear.',
  },
  {
    name: 'Vehicle Equipment pricing — flat `p_unit × item.size`',
    category: 'points',
    text: 'Single "POINTS" column, flat per-vehicle, already in `p_unit`. Same shape as the other ' +
      'factions\' vehicle equipment.',
  },
  {
    name: 'Trait pricing — 3-column, army-wide (`*` = per Wound/Hull)',
    category: 'points',
    text: 'NORMAL / CHARACTER MODELS / MONSTROUS CREATURES & VEHICLES columns. Per-unit cost paid ' +
      'army-wide. Same rich shape as IG/AdMech/Sororitas/Aeldari/GSC/Orks.',
  },

  // --- §structural ---
  {
    name: 'Exo-armor glyph-encoded, no `armourKeyword` (pre-keyword-seam)',
    category: 'structural',
    text: 'The Exo-armor gate is keyed via the ᴱ name-glyph, NOT an `armourKeyword: "Exo-armor"` ' +
      'field — the same pre-keyword-seam family as Orks Mega-armor ᴹ-glyph / CSM mark-glyphs ' +
      '([[project_pipeline_migration]]). Left as-is (the cross-faction keyword-engine refactor is ' +
      'out of this migration\'s scope).',
  },
];
