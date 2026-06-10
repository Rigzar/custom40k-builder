/**
 * codex_space_marines/weapon-abilities — category 5 of 5 (FINAL) in the codex.ts data model
 * (Weapon ability).
 *
 * Catalogue of SM's WARGEAR-LEVEL GATE MECHANICS — the structural rules that decide which items
 * a model can take and how they're priced/derived, NOT the individual named weapon abilities
 * (Massive(X)/Deflagrate(X)/Sunder… already canonical in coreRules.ts glossary) nor the armour-
 * keyword axis that gates them (already in SM_KEYWORDS, Paso 3). Migrated from `rules-model/
 * space_marines.md` §2 (wargear gating) + §3 (points model) — VALIDATED, re-read against
 * Armory.html / production armory shape 2026-06-04.
 *
 * Completing this file closes Fase 4 for Space Marines — 5/5 categories (Slot/Unit type/
 * Keyword/Special ability/Weapon ability), mirroring the codex_csm pilot and Chaos Daemons'
 * structure exactly — THIRD faction fully migrated to the 5-category model.
 *
 * Anti-duplication discipline held: documents the GATE, not the gated content — named weapon
 * abilities live in coreRules.ts, the armour-keyword grants live in SM_KEYWORDS, and the
 * gating MECHANISM (`modelRestrictsToGravisSubset`/`TermSubset`, shipped+verified v0.51) is
 * referenced not re-derived.
 */

export interface SmWeaponAbilityEntry {
  /** Mechanic name as documented in the digest, e.g. "ᴳ/ᵀ glyph gating" */
  name: string;
  /** One of: gating mechanic / points-model rule / structural note */
  category: 'gating' | 'points' | 'structural';
  /** Verbatim or close-paraphrase mechanic text + grounding reference */
  text: string;
}

// Source: rules-model/space_marines.md §2 (wargear gating — Armory.html L69-70 verbatim glyph
// rules + text-gate table) + §3 (points model).
export const SM_WEAPON_ABILITIES: SmWeaponAbilityEntry[] = [
  // --- §2 gating mechanics ---
  {
    name: 'ᴳ/ᵀ glyph gating (the armour-subset split)',
    category: 'gating',
    text: 'Verbatim (Armory.html L69-70): "Models wearing Gravis armor can only receive equipment ' +
      'with ᴳ" / "Models wearing Cataphractii or Terminator armor can only receive equipment with ' +
      'ᵀ". A model in restricted armour can ONLY pick from its matching glyph-tagged subset — the ' +
      'inverse of CD\'s god-superscript gate (which adds access rather than narrowing it). The ' +
      'grants/native-unit list for each armour lives in SM_KEYWORDS\' `armour` axis (Paso 3); this ' +
      'entry documents the GATE MECHANIC the glyphs drive, already shipped+verified v0.51 via ' +
      '`modelRestrictsToGravisSubset`/`TermSubset` → `filterGravisCompat`/`filterTermCompat`.',
  },
  {
    name: 'Combinable glyph sets (ᴳ vs ᵀ vs ᴳᵀ vs no-glyph)',
    category: 'gating',
    text: 'Four distinct item pools derived from glyph presence: items tagged ᴳ-only (Gravis ' +
      'models only), ᵀ-only (Terminator/Cataphractii models only), ᴳᵀ (usable by either restricted ' +
      'subset), and no-glyph (Power-armour baseline — explicitly EXCLUDES Gravis and Terminator ' +
      'wearers, the mirror image of the restricted-subset exclusivity: the baseline pool is itself ' +
      'gated AWAY from the two special armours, not just silently available). 53 ᴳ-tagged items ' +
      'feed the Gravis subset (digest §6 / ki-sm-gravisgate-01 fixed v0.51).',
  },
  {
    name: 'Gravis ⟷ Terminator mutual exclusivity',
    category: 'gating',
    text: 'A model can wear at most ONE of Gravis/Terminator/Cataphractii/Master-crafted/Phobos/' +
      'Power armour ("not combinable with other armors" — verbatim on every armour entry), so at ' +
      'most one subset-restriction gate ever applies to a given model. Each gate fires on innate ' +
      '`armourKeyword`, a bought armour item, or a baked armour-granting ability — composed into ' +
      'all three armory tabs (general/mark{=N/A for SM}/legion). Bought restricted-armour items ' +
      'remain visible and removable once selected.',
  },
  {
    name: 'Text-gated items (non-structural, prose-only)',
    category: 'gating',
    text: 'Cannot be derived from glyphs/keywords — require reading the item\'s own description: ' +
      '"Gravis armor only" (Auto boltstorm gauntlet — narrower than the general ᴳ pool, a single-' +
      'item restriction layered on top of the armour gate); role-locked items restricted to a ' +
      'named character role rather than an armour/unit-type keyword — Absolvor bolt pistol ' +
      '(Apothecary/Chaplain only), Relic blade (Lieutenants only), Selfless healer (Apothecaries ' +
      'only), Chapter banner (Ancients only), Book of Malcador / Familiar (Librarians only). ' +
      'Mirrors CD\'s "in-description finer gates" entry — same class of unmodelled prose-only gate, ' +
      'a cross-faction pattern, not an SM peculiarity.',
  },
  {
    name: 'Jump pack — infantry-only equipment gate',
    category: 'gating',
    text: 'Verbatim: "Only for infantry." A plain equipment-tier gate on the Infantry unit-type — ' +
      'distinct from (and the textual SOURCE that disambiguates) the "Jump Pack Infantry" TYPE-' +
      'replacement mechanic already shipped v0.51 via `OptionEffect.set_unit_type` (digest §6, ' +
      'cross-ref SM_UNIT_TYPES Paso 2 inline comments — the static-vs-mutated distinction). This ' +
      'entry is the simple armory-item gate; the type-mutation is a separate, richer mechanic ' +
      'documented at the unit-type layer, not duplicated here.',
  },

  // --- §3 points-model rules ---
  {
    name: 'Two-column pricing: POINTS / POINTS CHARACTER MODELS',
    category: 'points',
    text: 'Maps to `p_unit` (normal-model price, per-model purchase) / `p_char` (flat character-' +
      'tier price) — the same column slots CSM and CD both use, though SM\'s dearer column reads ' +
      'as a generic "character" tier (unlike CD\'s Greater-Daemon-specific labelling). Weapons and ' +
      'equipment are priced per model; the character column is a flat override, not a multiplier.',
  },
  {
    name: 'Veteran abilities — per-unit vs per-Wound/Hull-point split',
    category: 'points',
    text: 'The 8 named veteran abilities (Counter-attack, Favoured enemy, Furious charge, ' +
      'Infiltrator, Outflank, Tank hunter, Terrain expert, Vanguard) price differently by ' +
      'recipient: flat per-unit on Infantry, but per-Wound/Hull-point (`p_veh`) on Monstrous ' +
      'Creatures and Vehicles — the cost scales with the model\'s durability stat rather than ' +
      'staying flat. Genuinely the inverse of CD\'s "no veteran-ability pricing tier exists at ' +
      'all" structural simplification (CD_WEAPON_ABILITIES) — SM exercises the richer model CD ' +
      'omits entirely, another instance of the cross-faction "fewer/more distinct primitives" axis.',
  },
  {
    name: 'Trait costs — three columns, `*` = per-Wound/Hull-point',
    category: 'points',
    text: 'Traits are paid PER UNIT across NORMAL / CHARACTER MODELS / MONSTROUS&VEHICLES columns ' +
      '(`p_unit`/`p_char`/`p_veh`); costs marked `*` switch the unit to a per-Wound-or-Hull-point ' +
      'basis instead of the flat per-unit default — e.g. The Flesh is Weak = 2*/0/5* (2pts per W ' +
      'for creatures, 5pts per HP for vehicles, never a flat per-unit charge). The full per-trait ' +
      'table lives in `traits/space_marines.ts` (cross-ref SM_SPECIAL_ABILITIES "trait-system" ' +
      'entries, Paso 4) — this entry documents the COST-SHAPE mechanic (`*` = rebasis trigger), ' +
      'not the per-trait values, avoiding the same second-source-of-truth risk flagged in Paso 4.',
  },
  {
    name: 'Cost "-" = not selectable from that column',
    category: 'points',
    text: 'Same convention as CSM/CD: a dash in any points column means the item/ability cannot ' +
      'be taken by a model of that tier — not a free grant, not a placeholder. Confirmed in the ' +
      'Trait table too (e.g. Purity above All / Sons of Mars show "-" in the CHARACTER column — ' +
      'army-wide one-model conversions that simply don\'t apply to characters).',
  },
  {
    name: 'No marks / no per-god pricing split (SM-specific simplification)',
    category: 'structural',
    text: 'Unlike CSM (per-mark armory tables) and CD (single table but god-superscript-gated ' +
      'pricing), SM has ONE flat armory table with no allegiance-based price/access split — the ' +
      'direct pricing-layer consequence of the "no marks" architectural fact already grounded in ' +
      'SM_KEYWORDS\' empty `mark` axis (Paso 3) and SM_SPECIAL_ABILITIES\' confirmed-absence list ' +
      '(Paso 4). The richer per-faction split SM DOES have runs through the Legacy/chapter-armory ' +
      'system instead (army-level selection, not per-model pricing tiers).',
  },
];
