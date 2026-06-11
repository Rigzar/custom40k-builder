/**
 * codex_adeptus_mechanicus/weapon-abilities — category 5 of 5 (FINAL) (Weapon ability).
 *
 * Migrated from `rules-model/adeptus_mechanicus.md` §2 (wargear gating) + §3 (points model). NOT
 * the named weapon abilities themselves (Haywire/Tesla/Decimate/Luminagen/Cognis/Soul burn/Beam/
 * Lance — canonical in coreRules.ts).
 *
 * Completing this file closes Fase 4 for Adeptus Mechanicus — 5/5 — SEVENTH faction migrated.
 * Like IG, AdMech has NO keyword-based gating row (IG_KEYWORDS/ADMECH_KEYWORDS both empty).
 */

export interface AdMechWeaponAbilityEntry {
  name: string;
  category: 'gating' | 'points' | 'structural';
  text: string;
}

// Source: rules-model/adeptus_mechanicus.md §2 (gating) + §3 (points).
export const ADMECH_WEAPON_ABILITIES: AdMechWeaponAbilityEntry[] = [
  // --- §2 gating ---
  {
    name: 'No keyword-based wargear gate',
    category: 'gating',
    text: 'No armour/mark/faction/datasheet keyword (ADMECH_KEYWORDS empty). `has_armory_access` ' +
      'opens the general tab; no `armour_compat`/`term_compat` filter anywhere. Second faction ' +
      '(after IG) with no keyword gate — access decided by prose + flags + per-datasheet options.',
  },
  {
    name: '"Only for X" / "Forge World X only" prose restrictions',
    category: 'gating',
    text: 'Free-text restrictions matched against item `desc`: "Only for infantry" (Pteraxii wings, ' +
      'Serberys steed); "Forge World X only" on the Legacy-unlocked relic weapons (The Adamantine ' +
      'Arm = Metalica, The Omnissiah\'s Hand = Stygies VIII, The Red Axe = Mars, ...). Same prose-' +
      'match pattern as IG/GK/CSM.',
  },
  {
    name: 'Doctrina Imperatives (4) — per-datasheet option gate (NOT has_veteran_abilities)',
    category: 'gating',
    text: 'Aggressor/Bulwark/Conqueror/Protector Imperative — AdMech\'s veteran-ability analogue, ' +
      'but gated by the datasheet line "The unit may select one Doctrina Imperative" (13 units), ' +
      'NOT the `has_veteran_abilities` flag (0 AdMech units have it). Currently `category: none` ' +
      'and unmodelled — see ADMECH_SPECIAL_ABILITIES gap-note `ki-admech-doctrina-gating-01`. LEFT ' +
      'UNTAGGED this pass (tagging `category:"veteran"` without the per-unit flag would hide them).',
  },
  {
    name: 'Vehicle Equipment (9) — `category: \'vehicle\'` + `is_vehicle`',
    category: 'gating',
    text: 'Additional armor / Broad spectrum data-tether / Cognis manipulator / Improved targeting / ' +
      'Infoslave skull / Jammer / Machine spirit / Mindscanner probe / Smoke Launcher — gated by ' +
      '`category: "vehicle"` + unit `is_vehicle`. FIXED 2026-06-11 (`ki-admech-vetvehcategory-01`): ' +
      'all 9 tagged. POINTS value was ALREADY in `p_unit` (unlike IG\'s p_char misplacement), so ' +
      'pure tagging — no value-move. Only the vehicle-section "Infoslave skull" (idx 37) tagged, ' +
      'not the equipment-section duplicate (idx 10).',
  },
  {
    name: 'Mark of Chaos (Dark Mechanicum archetype only)',
    category: 'gating',
    text: 'Purchasable per-model/per-Wound (+1/+2) or per-vehicle (+10) ONLY under the Dark ' +
      'Mechanicum archetype; not a base gate (ADMECH_KEYWORDS `mark` note).',
  },

  // --- §3 points ---
  {
    name: 'Standard equipment pricing (`p_unit`/`p_char`)',
    category: 'points',
    text: 'Armory "POINTS" (`p_unit`) + "POINTS CHARACTER MODEL" (`p_char`) columns — `p_char` is ' +
      'legitimately used for regular gear (like IG, unlike GK). Mirrors the cross-faction ' +
      '`getItemPts` shape. No `× item.size` for regular gear.',
  },
  {
    name: 'Doctrina Imperative pricing — per-model / per-Wound-or-Hull-point split',
    category: 'points',
    text: 'The .ods DOCTRINA IMPERATIVES table has "POINTS" + "POINTS MONSTROUS CREATURES & ' +
      'VEHICLES" columns + the "per model and per Wound/Hull point" footnote — the SAME two-column ' +
      'shape as IG/GK Veteran Abilities (4th+ faction confirming the SM-side per-Wound tier CD ' +
      'lacks). Values: Aggressor/Bulwark/Conqueror 1/2, Protector 0/0. To be applied with the ' +
      'gating fix (`ki-admech-doctrina-gating-01`): `p_veh` = the M&V value, `p_char` = null.',
  },
  {
    name: 'Vehicle Equipment pricing — flat `p_unit × item.size`',
    category: 'points',
    text: 'Single .ods "POINTS" column, flat per-vehicle, already in `p_unit`. Same simple shape as ' +
      'IG/GK/Inquisition vehicle equipment.',
  },
  {
    name: 'Trait pricing — 3-column, army-wide (`*` = per Wound/Hull)',
    category: 'points',
    text: 'NORMAL / CHARACTER MODELS / MONSTROUS CREATURES & VEHICLES columns, `*` = per Wound/Hull, ' +
      'per-unit cost paid army-wide (all units upgraded). Same rich shape as IG.',
  },
];
