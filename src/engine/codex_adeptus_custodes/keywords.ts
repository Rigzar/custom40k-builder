/**
 * codex_adeptus_custodes/keywords — category 3 of 5 (Keyword).
 *
 * Migrated from `rules-model/adeptus_custodes.md` §1. UNLIKE the IG/AdMech/Sororitas trio (all
 * axes empty), Custodes has a populated `armour` axis: a single binary Terminator ᵀ-gate — the
 * GK/Inquisition shape. Mark/faction/datasheet axes empty.
 *
 *   - `armour` — POPULATED (1 entry): Terminator. The `.ods` Armory states "Models wearing
 *     Terminator armor can only receive equipment with ᵀ"; 18/34 armory items carry
 *     `term_compat: true`. Wearers = Allarus + Aquilon Custodians. CAVEAT: production keys the gate
 *     via the `term_compat` boolean + name-derivation, NOT an `armourKeyword: "Terminator"` field
 *     (pre-keyword-seam state, like CSM — see weapon-abilities.ts §structural). No Cataphractii/
 *     Gravis.
 *   - `mark` — EMPTY. No `locked_mark`; no Marks-of-Chaos archetype.
 *   - `faction` — EMPTY. Shield Host / Lightning strike are army-wide datasheet rules, not a
 *     per-unit identity keyword. (Shield Hosts are a LEGACY-unlock axis — §5 — not a base keyword.)
 *   - `datasheet` — EMPTY. All 19 units keywords[] = []. NINTH confirmation datasheet axis is the
 *     CSM-only exception.
 */

export interface CustodesKeywordEntry {
  keyword: string;
  axis: 'armour' | 'mark' | 'faction' | 'datasheet';
  gates?: string;
}

// Source: rules-model/adeptus_custodes.md §1.
export const CUSTODES_KEYWORDS: CustodesKeywordEntry[] = [
  // --- armour axis (1 entry; single binary ᵀ-gate, GK/Inquisition shape) ---
  {
    keyword: 'Terminator',
    axis: 'armour',
    gates: 'Single binary ᵀ-gate. ".ods: Models wearing Terminator armor can only receive ' +
      'equipment with ᵀ" — 18/34 armory items carry `term_compat: true`, restricted to the ' +
      'Terminator-armoured units (Allarus + Aquilon Custodians). Engine-derived via the shared ' +
      '`isTerminatorArmourName`/`modelRestrictsToTermSubset` primitives (same mechanism CSM/SM/GK/' +
      'Inquisition use). No Cataphractii/Gravis. CAVEAT: production has no `armourKeyword` field ' +
      'set — the gate runs on `term_compat` + name-derivation (pre-keyword-seam, like CSM).',
  },

  // --- mark axis: EMPTY — no locked_mark, no Marks-of-Chaos archetype. ---
  // --- faction axis: EMPTY — Shield Host / Lightning strike are datasheet rules; Shield Hosts are
  //     a Legacy-unlock axis (§5), not a base keyword. ---
  // --- datasheet axis: EMPTY — all 19 units keywords[] = []. ---
];
