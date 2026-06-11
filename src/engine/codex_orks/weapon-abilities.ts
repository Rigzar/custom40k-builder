/**
 * codex_orks/weapon-abilities — category 5 of 5 (FINAL) (Weapon ability).
 *
 * Migrated from `rules-model/orks.md` §2 (gating) + §3 (points). NOT the named weapon abilities
 * themselves (Flames/AT/Decimate/Deflagrate — canonical in coreRules.ts).
 *
 * Closes Fase 4 for Orks — 5/5 — FOURTEENTH faction. Mega armor ᴹ-gate (a populated armour axis,
 * like Custodes/CSM); plus the unique Kustom Jobs mechanic; no veteran tier.
 */

export interface OrkWeaponAbilityEntry {
  name: string;
  category: 'gating' | 'points' | 'structural';
  text: string;
}

// Source: rules-model/orks.md §2 (gating) + §3 (points).
export const ORK_WEAPON_ABILITIES: OrkWeaponAbilityEntry[] = [
  // --- §2 gating ---
  {
    name: 'Mega armor (ᴹ glyph) gating',
    category: 'gating',
    text: 'Standard heavy-armour gate — 32/62 armory items carry the ᴹ glyph (".ods: Models in Mega ' +
      'armor can only receive equipment with ᵀ"). Restricted to Mega-armoured models (Mega armor is ' +
      'a purchasable item). Glyph-encoded (ᴹ in the name), not `armourKeyword`/`term_compat`.',
  },
  {
    name: '"Only for X" prose restrictions',
    category: 'gating',
    text: 'Free-text restrictions: Gretchins / Flyers / Mek / Walker / infantry / <Wildork> only, ' +
      'etc. Same prose-match pattern as the other factions.',
  },
  {
    name: 'Kustom Jobs (16) — unit-gated unique upgrades (NOT a vehicle category)',
    category: 'gating',
    text: 'Bionik Oiler / Da Booma / Eavy armour cabin / Enhanced Runt-Sucker / Extra-Kustom Weapon ' +
      '/ Fortress on Wheels / Gyroscopic Whirlygig / More Dakka / Nitro Squigs / Press the Button / ' +
      'Shokka Hull / Smoky Gubbinz / Souped-up Speshul / Squig-hide Tyres / Stompamatic Pistons / ' +
      'Zzapkrumpaz — a DISTINCT Ork mechanic: each Kustom job is unique, gated to specific units ' +
      '("Vehicle only" / "Mek only" / "Walker only" / "Spanna only" / "Warbuggy only") via prose, ' +
      'NOT by `is_vehicle`. Left `category: none` (idx 33-48). The Waaagh! Coast Kustoms trait lets ' +
      'each be taken +1 time. Priced per-unit (`p_unit`).',
  },
  {
    name: 'Vehicle Upgrades (13) — `category: \'vehicle\'` + `is_vehicle`',
    category: 'gating',
    text: 'Additional armor / Armored hood / Boarding plank / Death roller / Grab claw / Grot ' +
      'mechanic / Nozzle drive / Red paint / Reinforced battering ram / Smoke launcher / Stikkbombz ' +
      'launcha / Target squig / Wrecking ball — gated by `category: "vehicle"` + unit `is_vehicle`. ' +
      'FIXED 2026-06-11 (`ki-orks-vetvehcategory-01`): all 13 (idx 49-61) tagged. POINTS already in ' +
      '`p_unit` — no value-move.',
  },
  {
    name: 'NO Veteran-Ability tier (by design)',
    category: 'gating',
    text: 'No VETERAN ABILITIES armory section; 0 `has_veteran_abilities` units. (The "Thinking cap" ' +
      'equipment grants a selectable Counter-attack/Favoured enemy/Tank hunter, but that is a single ' +
      'item, not the veteran tier.) No `category:"veteran"` work applies.',
  },

  // --- §3 points ---
  {
    name: 'Standard equipment pricing (`p_unit`/`p_char`)',
    category: 'points',
    text: 'Armory "POINTS" (`p_unit`) + "POINTS CHARACTER MODELS" (`p_char`) columns. Mirrors the ' +
      'cross-faction `getItemPts`. No `× item.size` for regular gear.',
  },
  {
    name: 'Kustom Jobs + Vehicle Upgrades pricing — flat `p_unit × item.size`',
    category: 'points',
    text: 'Both use a single "POINTS" column, flat per-unit/per-vehicle, in `p_unit`. (Kustom Jobs ' +
      'are unit-gated; Vehicle Upgrades are `is_vehicle`-gated.)',
  },
  {
    name: 'Trait pricing — 3-column, army-wide (`*` = per Wound/Hull)',
    category: 'points',
    text: 'NORMAL / CHARACTER MODELS / MONSTROUS CREATURES & VEHICLES columns. Per-unit cost paid ' +
      'army-wide. Same rich shape as IG/AdMech/Sororitas/Aeldari/GSC.',
  },

  // --- §structural ---
  {
    name: 'Mega armor glyph-encoded, no `armourKeyword` (pre-keyword-seam)',
    category: 'structural',
    text: 'The Mega-armor gate is keyed via the ᴹ name-glyph, NOT an `armourKeyword: "Mega armor"` ' +
      'field — the same pre-keyword-seam family as CSM mark-glyphs / Custodes term_compat ' +
      '([[project_pipeline_migration]]). Left as-is (the cross-faction keyword-engine refactor is ' +
      'out of this migration\'s scope).',
  },
];
