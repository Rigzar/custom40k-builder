/**
 * codex_chaos_daemons/weapon-abilities — category 5 of 5 (FINAL) in the codex.ts data model
 * (Weapon ability).
 *
 * Catalogue of CD's WARGEAR-LEVEL GATE MECHANICS — the structural rules that decide which items
 * a model can take and how they're priced/derived, NOT the ~50 individual named weapon abilities
 * (Massive(X)/Unyielding/Ammo(X)… already canonical in coreRules.ts glossary) nor the keyword
 * axes that gate them (already in CD_KEYWORDS). Migrated from `rules-model/chaos_daemons.md`
 * §2 (wargear gating) + §3 (points model) — VALIDATED, re-read against Index.html / production
 * armory shape 2026-06-03/06-07.
 *
 * Completing this file closes Fase 4 for Chaos Daemons — 5/5 categories (Slot/Unit type/
 * Keyword/Special ability/Weapon ability), mirroring the codex_csm pilot's structure exactly.
 *
 * Anti-duplication discipline held: documents the GATE, not the gated content — named weapon
 * abilities live in coreRules.ts, mark/faction keywords live in CD_KEYWORDS.
 */

export interface CdWeaponAbilityEntry {
  /** Mechanic name as documented in the digest, e.g. "God-superscript gating" */
  name: string;
  /** One of: gating mechanic / points-model rule / structural note */
  category: 'gating' | 'points' | 'structural';
  /** Verbatim or close-paraphrase mechanic text + grounding reference */
  text: string;
}

// Source: rules-model/chaos_daemons.md §2 (wargear gating — how to derive) + §3 (points model).
export const CD_WEAPON_ABILITIES: CdWeaponAbilityEntry[] = [
  // --- §2 gating mechanics ---
  {
    name: 'Single shared armory table (no per-mark split)',
    category: 'gating',
    text: 'CD has ONE armory table — unlike CSM\'s separate per-mark armories. Items are gated ' +
      'purely by the god superscript on the item name (ᴷ/ᴺ/ˢ/ᵀ → requires the matching Mark of ' +
      '[God] keyword on the model, derived via the shared `itemRequiredMark()`/`MARK_GLYPHS` ' +
      'mechanism — cross-faction, lives in engine/keywords.ts, documented not duplicated here).',
  },
  {
    name: 'God-superscript gating (ᴷ/ᴺ/ˢ/ᵀ)',
    category: 'gating',
    text: 'Items with a trailing god-superscript glyph require the matching Mark keyword and ' +
      'exclude rival marks (Animosity §4b — animosity rival pairs catalogued in CD_KEYWORDS\' ' +
      'mark axis, not repeated here). The glyph itself is derived from the item name, not stored ' +
      'as a separate field.',
  },
  {
    name: 'Tzeentch ᵀ-glyph collision — RESOLVED, by-design asymmetric split',
    category: 'gating',
    text: 'The ᵀ glyph already means Terminator-compat across CSM/SM/GK/HH — reusing it for Mark ' +
      'of Tzeentch would collide. Chosen fix (verified correct in code, ✅): ᴷ/ᴺ/ˢ items stay ' +
      'name-glyph-encoded in `armory_general.equipment`, while the 8 Mark-of-Tzeentch items live ' +
      'structurally in `armory_marks.Tzeentch` and gate via bucket-key membership (a separate ' +
      '"Tzeentch Armoury" tab shown when `effectiveMark === \'Tzeentch\'`). Both paths converge ' +
      'correctly. Documented here so a future reader doesn\'t mistake the asymmetry for a bug — ' +
      'it already was investigated and closed (digest §7 discrepancy #1, RESOLVED 2026-06-07).',
  },
  {
    name: 'Un-superscripted equipment (universal access)',
    category: 'gating',
    text: 'Items with no god-superscript are available to any model with armory access, no Mark ' +
      'requirement: Boon of Mutation, Breath of Chaos, Chaos artefact, Instrument of Chaos, ' +
      'Master-crafted weapon, Personal icon, Psychic training, Unholy might, Warp conduit, ' +
      'Exalted butcher/hunter.',
  },
  {
    name: 'Vehicle-equipment gate (Vehicle keyword)',
    category: 'gating',
    text: 'Additional armor / Smoke Launcher / We are legion / Jammer require the Vehicle unit-' +
      'type keyword and exclude non-vehicles. Structural note: these 4 items are folded into the ' +
      'same `armory_general.equipment` array as infantry gear — no dedicated `vehicle` JSON ' +
      'section/category exists, so the gate is only derivable from the HTML section heading, not ' +
      'from data structure (digest §7 discrepancy #2, by-design — Soul Grinder is the only CD ' +
      'unit that exercises this path).',
  },
  {
    name: 'In-description finer gates (non-structural, prose-only)',
    category: 'gating',
    text: 'Cannot be derived from item structure — require reading the item\'s own description ' +
      'text: "Only for Heralds" (Palanquin of Nurgle ᴺ); "Unique"/army-wide-once (Nurgle\'s decay, ' +
      'Revoltingly Resilient, Soulstealer, Warp conduit); "Must be purchased for each weapon ' +
      'separately" (Master-crafted weapon — overrides the §4 once-per-model default); "Can be ' +
      'taken multiple times" (Psychic training — same override).',
  },
  {
    name: 'Choice-driven unit-type/keyword mutation',
    category: 'gating',
    text: 'Several items mutate the model\'s unit-type as a side effect of selection (the same ' +
      'unmodelled `choice→keyword/stat-override` primitive flagged for CSM, digest §6d): Blood ' +
      'throne ᴷ → Bike (loses Character), Juggernaut of Khorne ᴷ → Bike, Seeker of Slaanesh ˢ → ' +
      'Bike, Screamer of Tzeentch ᵀ → Jet bike, Girdle ˢ → Anti-grav. Documented as a known ' +
      'structural gap, not re-derived here.',
  },

  // --- §3 points-model rules ---
  {
    name: 'Two-column pricing: POINTS / POINTS GREATER DEMON',
    category: 'points',
    text: 'Maps to `p_unit`/`p_char` (same slot semantics as CSM\'s unit/character columns), but ' +
      'the dearer-tier column is explicitly labelled "GREATER DEMON" rather than "CHARACTER" — ' +
      'reads as a Greater-Daemon-specific price, not a generic character upgrade tier. Several ' +
      'items are Greater-Daemon-only or asymmetric: e.g. Hellfire armor ᴷ 35/65; Juggernaut ᴷ ' +
      '55/"-" (not selectable on a Greater Daemon); Blood throne ᴷ 80/"-"; Screamer/Seeker ' +
      'mounts "-" for Greater Daemon.',
  },
  {
    name: 'Cost "-" = not selectable from that column',
    category: 'points',
    text: 'Same convention as CSM: a dash in either points column means the item cannot be taken ' +
      'by a model of that tier — not a free item, not a placeholder.',
  },
  {
    name: 'No veteran-ability / vehicle-upgrade pricing tier (CD-specific simplification)',
    category: 'structural',
    text: 'Unlike CSM, CD has NO per-Wound/Hit-Point veteran-ability or vehicle-upgrade pricing ' +
      'sections in its armory — `p_veh` is unused, `has_veteran_abilities` is false across every ' +
      'CD unit. This is a genuine structural simplification versus CSM\'s richer pricing model, ' +
      'not a missing-data gap (mirrors the "no armour axis"/"no datasheet-keyword axis" findings ' +
      'already documented in CD_KEYWORDS — CD consistently exercises fewer distinct primitives).',
  },
  {
    name: 'Marks priced per model tier, not as a flat surcharge',
    category: 'structural',
    text: 'Most CD units have an innate `locked_mark` (no purchase needed — the grant is baked ' +
      'into the profile per the "Marks count as veteran ability" meta-rule in CD_SPECIAL_' +
      'ABILITIES). The few units that DO offer a Mark choice price it according to the model\'s ' +
      'own pricing tier rather than a separate flat per-mark surcharge column (cross-checked ' +
      'per-unit in digest §4d-§4i: Daemon Brutes/Daemon prince/Soul Grinder all confirmed).',
  },
];
