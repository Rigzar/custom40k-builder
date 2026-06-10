/**
 * codex_csm/weapon-abilities — category 4 of 5 in the codex.ts data model (Weapon ability).
 *
 * SKELETON — not yet filled. Weapon abilities are rules that live on weapons/wargear rather
 * than on the model — gating (term_compat / ᵀ), multi-profile weapons, daemon weapons, etc.
 *
 * Source material to migrate from `digest.md`:
 *   - §2 Wargear gating — how to derive (replaces `term_compat`)         (line ~99)
 *     - Unit-restriction text (Infantry only, Only for Lieutenants, …)   (line ~124)
 *   - §3 Points model — multi-profile weapons (`*` choose-one-of)        (line ~148)
 *   - Per-weapon abilities scattered through armory sections in
 *     data/parsed/chaos_space_marines/armory/*.json
 *
 * Cross-reference: the ᵀ / Cataphractii gating axis is shared with keywords.ts (the GATE is a
 * keyword on the model; the GATED THING is a weapon ability/flag — `term_compat`). This file
 * documents the weapon side; keywords.ts documents the model side.
 */

export interface CsmWeaponAbilityEntry {
  /** Ability name, verbatim from canonical text (e.g. "Massive(1)", "Unyielding") */
  name: string;
  /** Verbatim rule text or faithful summary */
  text?: string;
  /** Gating note, if this ability is restricted to certain keywords/units */
  restriction?: string;
}

// Populated from digest.md §2 (wargear gating) + §3 (points model / multi-profile weapons).
// DELIBERATELY NOT catalogued here, per the one-source-of-truth philosophy (mirrors the
// special-abilities.ts approach):
//   - The ~50 individual named weapon abilities (Massive(X), Unyielding, Ammo(X), Overheating,
//     Seeking, Suppression, etc., incl. the freshly-corrected entries from the 2026-06-08 audit)
//     → already the canonical glossary in coreRules.ts RULES, looked up via lookupRuleGeneric/
//     lookupWeaponType. Duplicating their verbatim text here would drift on the next core-rules
//     pass. This file documents the WARGEAR-LEVEL MECHANICS that decide which weapons a model
//     may take and how they're priced — not the abilities' own rule text.
//   - The Terminator/Cataphractii armour-keyword axis itself (which units gate on it, sacred
//     numbers, etc.) → already in keywords.ts CSM_KEYWORDS (armour axis, filled in pilot step 4).
//     This file documents the WEAPON side of that same gate (ᵀ ⇔ term_compat) per the header's
//     own cross-reference note.
export const CSM_WEAPON_ABILITIES: CsmWeaponAbilityEntry[] = [
  {
    name: 'Terminator-compatibility (the ᵀ glyph / term_compat)',
    text: 'An item whose name carries the ᵀ superscript may be taken by a Terminator-armoured '
        + 'model (CONFIRMED vs production: "Astartes chainsword" no-ᵀ → term_compat:false; '
        + '"Baleful tomeᵀ" / "Chainaxeᵀ" → term_compat:true). The ᵀ glyph lives in the source '
        + 'HTML and the parser derives term_compat straight from it — no hand-marking needed. '
        + 'GLYPH CONVENTION (resolved 2026-06-04): ᵀ = Terminator-compatible ONLY — it is NOT '
        + 'Mark of Tzeentch (the glyph-encoded marks are ᴷ Khorne / ᴺ Nurgle / ˢ Slaanesh; '
        + 'Tzeentch items live in armory_marks.Tzeentch instead, zero ᵀ collisions verified '
        + 'across all factions). Keyword-model target: the GATE (unit keyword "Terminator") '
        + 'lives in keywords.ts; this entry documents the GATED side (the weapon flag).',
    restriction: 'Engine rule: "if unit has Terminator (or Cataphractii) armour-keyword → only '
        + 'items carrying terminator-allowed (ᵀ)". The armour items themselves ("Terminator '
        + 'armor"/"Cataphractii armor") carry NO ᵀ — buying them grants the keyword that then '
        + 'self-filters the rest of the armory; see ki-csm-tgate-01 for the keyword-derived gate.',
  },
  {
    name: 'Multi-profile weapons ("Choose one of the following profiles")',
    text: 'Some armory entries are a single purchasable parent row with several alternative '
        + 'weapon profiles listed as sub-rows — verbatim examples: "Combi-flamerᵀ", '
        + '"Combi-meltaᵀ", "Combi-plasmaᵀ", "Plasma pistol" (sub-profiles like "Bolter", '
        + '"Flamer", "Plasma — Standard/Overcharged"). The model picks ONE profile to use; '
        + 'points are paid once on the parent row regardless of which profile is chosen. Data '
        + 'model: stored as a `profiles[]` array on the parent armory item, not as separate '
        + 'purchasable entries.',
  },
  {
    name: 'Unit-restriction text (non-structured wargear gates)',
    text: 'Finer eligibility gates that live only in an item\'s description prose — the armory '
        + 'table columns (category/points) can\'t capture them, so the engine has to parse or '
        + 'hand-encode the restriction. Verbatim canonical examples from the CSM armory: '
        + '"Infantry only" (Chaos Space Marine bike, Daemonic flight / jump pack, Terminator '
        + 'armor), "Only for Lieutenants" (Cursed blade), "Only for Dark Apostles" (Demagogue), '
        + '"Only for Sorcerers" (Familiar), "Only for models in Cataphractii armor" (Manreaper, '
        + 'Nurgle armory), "Only for models in Cataphractii or Terminator armor" (Twin plague '
        + 'spewer / Cataphractii armor item, Nurgle armory), plus the purchase-count modifiers '
        + '"Unique" / "Can be taken multiple times".',
    restriction: 'Keyword-model target: most of these collapse onto the existing axes — unit-type '
        + '(Infantry), datasheet/role keyword (Lieutenant, Dark Apostle, Sorcerer), and the '
        + 'armour-keyword axis (Cataphractii/Terminator, already in keywords.ts). The '
        + '"Unique"/"multiple times" pair is a purchase-count rule, not an eligibility gate — '
        + 'see coreRules.ts \'unique\' (correctly enforced) vs ki-unwieldy-permodel-unenforced-01 '
        + '(the sibling per-model cap that ISN\'T enforced, logged 2026-06-08).',
  },
  {
    name: 'Weapon/Equipment points-column semantics',
    text: 'General WEAPON/EQUIPMENT rows carry two cost columns — `p_unit` ("POINTS") and '
        + '`p_char` ("POINTS CHARACTER MODEL"); a "-" in either column means the item is NOT '
        + 'selectable from that column at all (verbatim: "Force axeᵀ" POINTS "-" / CHAR "6" → '
        + 'p_unit:null, p_char:6 — character-only; "Hunter-killer missile" "-"/"-" → not '
        + 'selectable from the general armory in the first place). DAEMON WEAPONS use a single '
        + '"POINTS" column, mapped to `p_char`. VETERAN ABILITIES additionally carry `p_veh` '
        + '("POINTS MONSTROUS CREATURES & VEHICLES") — verbatim: "Point costs must be paid for '
        + 'every model in the unit and per Wound or Hull point of the model", so a veteran '
        + 'ability on a monster/vehicle is priced per Wound/Hull-point via p_veh, and a "-" in '
        + 'p_veh (Infiltrator, Vanguard) means that ability is simply not available to '
        + 'vehicles/monsters. VEHICLE UPGRADES carry a single POINTS column paid per Hull point.',
  },
];
