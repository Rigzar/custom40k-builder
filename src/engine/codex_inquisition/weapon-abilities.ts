/**
 * codex_inquisition/weapon-abilities — category 5 of 5 (FINAL) in the codex.ts data model
 * (Weapon ability).
 *
 * Catalogue of Inquisition's WARGEAR-LEVEL GATE MECHANICS — the structural rules deciding which
 * armory items a model can take and how they're priced/derived. NOT the named weapon abilities
 * themselves (already canonical in coreRules.ts glossary) nor the Ordo GRANT semantics
 * (already in INQ_KEYWORDS' `ordo` axis, Paso 3 — this file documents the gate MECHANIC only).
 * Migrated from `rules-model/inquisition.md` §2 (wargear gating) + §3 (points model) —
 * VALIDATED, fully audited+fixed v0.56 ([[project_inquisition_audit]]).
 *
 * Completing this file closes Fase 4 for Inquisition — 5/5 categories (Slot/Unit type/
 * Keyword/Special ability/Weapon ability), mirroring codex_csm/CD/SM exactly — FOURTH faction
 * fully migrated to the 5-category model.
 *
 * Anti-duplication discipline held: documents the GATE MECHANICS, not the gated content —
 * the ᵀ-armour keyword grants live in INQ_KEYWORDS (`armour` axis), the Ordo grants live in
 * INQ_KEYWORDS (`ordo` axis), named weapon abilities live in coreRules.ts. This file is the
 * place where "how does a model qualify for / get priced for an item" is documented.
 */

export interface InqWeaponAbilityEntry {
  /** Mechanic name as documented in the digest, e.g. "ᵀ-glyph gating" */
  name: string;
  /** One of: gating mechanic / points-model rule / structural note */
  category: 'gating' | 'points' | 'structural';
  /** Verbatim or close-paraphrase mechanic text + grounding reference */
  text: string;
}

// Source: rules-model/inquisition.md §2 (wargear gating table) + §3 (points model).
export const INQ_WEAPON_ABILITIES: InqWeaponAbilityEntry[] = [
  // --- §2 gating mechanics ---
  {
    name: 'ᵀ-glyph gating (Terminator armour subset)',
    category: 'gating',
    text: 'Standard Terminator gate (60 items tagged `term_compat: true`) — already engine-' +
      'derived via the shared `isTerminatorArmourName`/`modelRestrictsToTermSubset` mechanism ' +
      '(shipped v0.51, the same primitive CSM/SM/CD all share). No Inquisition-specific variant: ' +
      'digest §1 confirmed the armour roster is Power/Plate/Terminator only (no Cataphractii/' +
      'Gravis analogue, so no ᴳ/ᵀ split exists here the way it does for SM) — a single binary ' +
      'gate, the simplest of any faction\'s armour-subset mechanic catalogued so far.',
  },
  {
    name: 'Ordo-restricted gating (ᴴ/ᴹ/ˣ glyphs → `requires_army_item`)',
    category: 'gating',
    text: 'Verbatim (item desc): "The model and further units from this codex get access to ' +
      '`<Ordo X>` equipment. Every model can only pick one Ordo allegiance. Only for ' +
      'Inquisitors." 15 items (5 per Ordo: Hereticus ᴴ/Malleus ᴹ/Xenos ˣ) carry `requires_' +
      'army_item: "Ordo X Inquisitor"`, gated by the new v0.56 `isArmyItemGateBlocked` ' +
      'mechanism (`engine/keywords.ts` — generalised `ArmoryItem→Unit` primitive). The glyphs ' +
      'themselves are stripped from item names (the gate is enforced mechanically; the ' +
      'restriction TEXT survives verbatim in each item\'s `desc` for player-facing display). ' +
      'This entry documents the GATE MECHANIC only — the grant semantics ("structurally ' +
      'identical to the CSM/CD Mark pattern, but an armory-item-pick rather than a unit ' +
      'attribute") are already catalogued in INQ_KEYWORDS\' `ordo` axis (Paso 3); not repeated.',
  },
  {
    name: 'Veteran Abilities (8) — per-model pricing shape',
    category: 'gating',
    text: 'Counter-attack / Favoured enemy / Furious charge / Infiltrator / Outflank / Tank ' +
      'hunter / Terrain expert / Vanguard — gated by `category: \'veteran\'` + unit `has_' +
      'veteran_abilities`. Fixed v0.56 (were misfiled in `weapons[]`, now correctly tagged). ' +
      'Two of the eight (Infiltrator, Vanguard) have no vehicle application → `p_veh: null`, a ' +
      'structural exception worth keeping in mind when migrating the points-model rule below.',
  },
  {
    name: 'Vehicle Equipment (5) — `category: \'vehicle\'` gate',
    category: 'gating',
    text: 'Additional armor / Hunter-killer missile / Improved targeting / Jammer / Smoke ' +
      'Launcher — gated by `category: \'vehicle\'` + unit `isVehicle`. Fixed v0.56 (were ' +
      'untagged in source data, now correctly flagged). Flat `× item.size` pricing — see ' +
      'points-model entry below.',
  },

  // --- §3 points model ---
  {
    name: 'Standard equipment pricing (`p_unit`/`p_char`/`p_veh`)',
    category: 'points',
    text: 'Mirrors CSM/SM `getItemPts` + `ArmoryModal.add` semantics exactly — no Inquisition-' +
      'specific variant. Regular equipment: flat `getItemPts` (no `× item.size`).',
  },
  {
    name: 'Veteran-ability pricing — per-model / per-Wound-or-Hull-point split',
    category: 'points',
    text: 'Table footnote (verbatim): "Point costs must be paid for every model in the unit and ' +
      'per Wound or Hull point." For `category: \'veteran\'` items: infantry/characters pay ' +
      'per-model (`p_unit × item.size`, with `p_char ?? p_unit` as the flat character override); ' +
      'vehicles/monsters pay per-Wound-or-Hull-point (`p_veh × woundCount × item.size`). Items ' +
      'with no vehicle application (Infiltrator, Vanguard) carry `p_veh: null` and simply cannot ' +
      'be taken on such models. NOTE: this is the SAME richer per-unit-vs-per-Wound/Hull-point ' +
      'split that [[project_space_marines_codex_migration]] found CD lacks entirely (CD has no ' +
      'such pricing tier at all) — Inquisition sits on the SM side of that inverse-pair, not ' +
      'the CD side. A second faction confirming the split is real engine behaviour, not an SM ' +
      'one-off.',
  },
  {
    name: 'Vehicle-equipment pricing — flat `× item.size`',
    category: 'points',
    text: 'For `category: \'vehicle\'` items (the 5-item Vehicle Equipment list): flat cost ' +
      'multiplied by `item.size` only — no per-Wound/Hull-point scaling (that scaling is ' +
      'reserved for the `veteran` category above). A simpler, single-tier pricing shape.',
  },
];
