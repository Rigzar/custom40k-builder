/**
 * codex_dark_eldar/weapon-abilities — category 5 of 5 (FINAL) (Weapon ability).
 *
 * Migrated from `rules-model/dark_eldar.md` §2 (gating) + §3 (points). NOT the named weapon
 * abilities themselves (Poison/Splinter/Deflagrate/Rending/Vector strike — canonical in
 * coreRules.ts).
 *
 * Completing this file closes Fase 4 for Dark Eldar — 5/5 — TENTH faction migrated. Dark Eldar is
 * the 2nd faction (after CSM) with a real datasheet keyword axis (the Kabal/Coven/Cult sub-
 * factions), so its gating is sub-faction-keyword-driven, unlike the prose-only IG/AdMech/Sororitas.
 */

export interface DarkEldarWeaponAbilityEntry {
  name: string;
  category: 'gating' | 'points' | 'structural';
  text: string;
}

// Source: rules-model/dark_eldar.md §2 (gating) + §3 (points).
export const DARK_ELDAR_WEAPON_ABILITIES: DarkEldarWeaponAbilityEntry[] = [
  // --- §2 gating ---
  {
    name: 'Sub-faction keyword gating (<Coven>/<Cult>/<Kabal>)',
    category: 'gating',
    text: 'Items and traits marked "Only for <Coven>/<Cult>/<Kabal>" (the `?`/`??` glyphs in the ' +
      '`.ods`) gate on the unit\'s sub-faction `keywords[]` (DARK_ELDAR_KEYWORDS datasheet axis). ' +
      'The sub-faction-purity archetypes (Trueborn/Haemoxytes/Bloodbrides) also filter the whole ' +
      'roster by this keyword. This is the only faction so far (besides CSM) whose gating runs on a ' +
      'real datasheet keyword, not just prose + flags.',
  },
  {
    name: 'No ᵀ-gate / no armour keyword',
    category: 'gating',
    text: 'No `term_compat`/`armour_compat` — Dark Eldar armour is a stat-tier Armory buy, not a ' +
      'keyword gate (DARK_ELDAR_KEYWORDS `armour` axis empty).',
  },
  {
    name: 'Combat Drugs (6) — per-unit selectable pool (NOT vehicle/veteran)',
    category: 'gating',
    text: 'Adrenalight / Grave lotus / Hypex / Serpentin / Painbringer / Splintermind — the Combat ' +
      'drugs army rule lets each unit pick one (Stimulant supply equipment grants +1). Left ' +
      '`category: none` in production (idx 26-31) — a distinct selectable pool, not vehicle/veteran ' +
      'armory items.',
  },
  {
    name: 'Vehicle Equipment (7) — `category: \'vehicle\'` + `is_vehicle`',
    category: 'gating',
    text: 'Additional armor / Bladevanes / Flickerfield / Improved targeting / Night shield / Smoke ' +
      'Launcher / Trophy — gated by `category: "vehicle"` + unit `is_vehicle`. FIXED 2026-06-11 ' +
      '(`ki-dark-eldar-vetvehcategory-01`): all 7 (idx 32-38) tagged. POINTS already in `p_unit` ' +
      '(like AdMech/Sororitas/Custodes — no value-move). Flickerfield = "-"/null (not selectable).',
  },
  {
    name: 'NO Veteran-Ability tier (by design)',
    category: 'gating',
    text: 'Dark Eldar armory has NO VETERAN ABILITIES section, and 0 units carry ' +
      '`has_veteran_abilities` — like Chaos Daemons/Sororitas. No `category:"veteran"` work applies.',
  },

  // --- §3 points ---
  {
    name: 'Standard equipment pricing (`p_unit`/`p_char`)',
    category: 'points',
    text: 'Armory "POINTS" (`p_unit`) + "POINTS CHARACTER MODELS" (`p_char`) columns. Mirrors the ' +
      'cross-faction `getItemPts`. No `× item.size` for regular gear.',
  },
  {
    name: 'Vehicle Equipment pricing — flat `p_unit × item.size`',
    category: 'points',
    text: 'Single "POINTS" column, flat per-vehicle, already in `p_unit`. Same simple shape as the ' +
      'other factions\' vehicle equipment.',
  },
  {
    name: 'Trait pricing — 3-column, army-wide (`*` = per Wound/Hull)',
    category: 'points',
    text: 'NORMAL / CHARACTER MODELS / MONSTROUS CREATURES & VEHICLES columns. Per-unit cost paid ' +
      'army-wide. Same rich shape as IG/AdMech/Sororitas.',
  },
  {
    name: 'No veteran/per-Wound-or-Hull pricing tier',
    category: 'structural',
    text: 'Dark Eldar lack the Veteran-Ability pricing tier — on the CD/Sororitas side of the ' +
      'veteran-tier inverse-pair ([[project_space_marines_codex_migration]]).',
  },
];
