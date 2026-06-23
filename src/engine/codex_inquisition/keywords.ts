/**
 * codex_inquisition/keywords — category 3 of 5 in the codex.ts data model (Keyword).
 *
 * Catalogue of Inquisition's keyword vocabulary, migrated from `rules-model/inquisition.md`
 * §1-§2 (VALIDATED — digest fully audited+fixed v0.56, [[project_inquisition_audit]]).
 *
 * Genuinely its OWN shape — not a clean fit to either CSM/CD's `mark` template or SM's pure-
 * armour template. Inquisition's distinguishing axis is **Ordo allegiance** (Hereticus/Malleus/
 * Xenos), and the digest is explicit (§2, verbatim item-desc text) that it is structurally
 * DIFFERENT from a Chaos Mark or an SM chapter: it's an ARMORY-ITEM PICK that unlocks an
 * army-wide equipment pool — not a unit attribute (`selectedMark`/`locked_mark`, both confirmed
 * `null` across all 13 units by grep). This is why Ordo gets its own `axis` value here rather
 * than being force-fit into `mark`.
 *
 *   - `armour` — POPULATED (3 entries): Power/Plate/Terminator armor. Standard ᵀ-gate
 *     (`term_compat`, 60 items, engine-derived already). NO Cataphractii/Gravis — digest §1
 *     verbatim "Inquisition has no analogue" (a sub-axis absence within a populated axis,
 *     distinct from SM's fully-populated 6-entry armour axis).
 *   - `ordo` — POPULATED (3 entries, Inquisition's OWN axis — see header). Gates BOTH armory
 *     items (15, via the new v0.56 `requires_army_item`/`isArmyItemGateBlocked` primitive) AND
 *     unit availability (3 Ordo Warband Troops datasheets, `requires_army_item` widened
 *     `ArmoryItem→Unit` same version) — one mechanic cascading to two surfaces, exactly
 *     mirroring the canonical "every model can only pick one Ordo allegiance" text.
 *   - `mark` — EMPTY. Grepped all 13 units: `locked_mark: null` everywhere, confirming the
 *     digest's structural claim that Ordo is NOT modelled as a mark-style unit attribute.
 *     Genuinely a different absence-reason than SM's ("no marks exist" — digest verbatim
 *     "NONE"); here the FUNCTIONAL equivalent of a mark exists (Ordo) but is deliberately
 *     modelled through a different primitive, a nuance worth preserving in the record.
 *   - `faction` — EMPTY. Grepped the digest + armory for any blanket "Inquisition"/
 *     "Inquisitorial" gating keyword: none found — no army-wide rule rides on a per-unit
 *     identity keyword (the Psyker rule is a generic core-rules grant on `is_psyker`, not
 *     keyword-derived; cross-ref Inquisitor + 2 Ordo Warbands all carry `is_psyker: true`).
 *   - `datasheet` — EMPTY. Grepped all 13 units' `keywords[]`: every one is `[]`. FOURTH
 *     confirmation (CSM=6, CD=0, SM=0, now Inquisition=0) that a populated datasheet axis is
 *     the per-faction EXCEPTION — CSM's 6 legion-identity keywords look more like the outlier
 *     each time another faction is checked.
 */

export interface InqKeywordEntry {
  /** Keyword as it appears in canonical text, e.g. "Terminator armor", "Ordo Hereticus" */
  keyword: string;
  /** Which axis this keyword belongs to (`ordo` is Inquisition's OWN axis — see header) */
  axis: 'armour' | 'ordo' | 'mark' | 'faction' | 'datasheet';
  /** What this keyword gates / grants (verbatim rule reference) */
  gates?: string;
}

// Source: rules-model/inquisition.md §1 (vocabulary) + §2 (wargear gating — verbatim Ordo
// item-desc text + ᵀ-gate table). VALIDATED — digest fully audited+fixed v0.56.
export const INQ_KEYWORDS: InqKeywordEntry[] = [
  // --- armour axis (3 entries; standard ᵀ-gate already engine-derived) ---
  {
    keyword: 'Power armor',
    axis: 'armour',
    gates: '3+ Sv. The faction\'s baseline armour (digest §1) — no special equipment-subset gate ' +
      'of its own, structurally analogous to SM\'s "Power armour" baseline entry.',
  },
  {
    keyword: 'Plate armour',
    axis: 'armour',
    gates: '4+ Sv. A second plain stat-tier armour choice alongside Power armor — neither ' +
      'unlocks nor restricts an equipment subset; just a profile pick.',
  },
  {
    keyword: 'Terminator armor',
    axis: 'armour',
    gates: 'Full stat block (Massive(1)/Shock Troops/Unyielding, infantry only). Standard ᵀ-gate ' +
      '— `term_compat` axis present on 60 items, engine-derived via the shared cross-faction ' +
      '`modelRestrictsToTermSubset`/`filterTermCompat` primitive (same mechanism CSM/SM/CD all ' +
      'use, documented not re-derived). Digest §1 explicit: NO Cataphractii/Gravis analogue ' +
      'exists — "Inquisition has no analogue" (verbatim), a sub-axis absence distinct from SM\'s ' +
      'fully-populated 6-entry armour spread (Paso 3 SM finding).',
  },

  // --- ordo axis: Inquisition's OWN distinguishing axis (NOT a mark — see header) ---
  {
    keyword: 'Ordo Hereticus',
    axis: 'ordo',
    gates: 'Army Customisation Legacy name (Informacion/Inquisition.ods "Army Customisation" ' +
      'sheet): "The army has access to the Ordo Hereticus Armory and Ordo Hereticus Warbands." ' +
      'Unlocks 5 armory items (Ignis Judicium, Hexagram warding runes, Liber Heresius, No ' +
      'escape, Praesidium Protectiva — glyph ᴴ, stripped from names, gate enforced via ' +
      '`requires_army_item` + `inquisitionLegacyOrdoUnlocks()`, engine/keywords.ts). REPLACED ' +
      '2026-06-23 (ki-inquisition-army-customisation-replace-01): this used to ALSO be a ' +
      'separate per-model armory-item pick with its own mutual-exclusivity validator (ki-' +
      'inquisition-ordo-exclusivity-01) — both removed, since the canonical .ods never had such ' +
      'an item and the Legacy already grants the same unlock army-wide. (v0.66: the old "Ordo ' +
      'Hereticus Warband" Troops datasheet this used to also gate was replaced by the single ' +
      'Ordo-agnostic "Henchman Warband" — no unit is gated by this keyword anymore, only armory ' +
      'items.)',
  },
  {
    keyword: 'Ordo Malleus',
    axis: 'ordo',
    gates: 'Same structural grant as Ordo Hereticus (verbatim text identical, "Ordo Malleus" ' +
      'substituted). Unlocks 5 armory items (Psycannon, Grimoire of True Names, Psybolt ' +
      'ammunition, Purified weapon, Tesseract labyrinth — glyph ᴹ). (v0.66: no longer also ' +
      'gates a "Ordo Malleus Warband" — see Ordo Hereticus entry above.) ' +
      'Cross-ref [[project_alien_hunters_fix]] — SM\'s "Legacy of ' +
      'Alien Hunters" Designer\'s-note grant of Ordo Xenos units to allied armies sits adjacent ' +
      'to (but distinct from) this faction-internal Ordo system.',
  },
  {
    keyword: 'Ordo Xenos',
    axis: 'ordo',
    gates: 'Same structural grant (verbatim text identical, "Ordo Xenos" substituted). Unlocks 5 ' +
      'armory items (Phase sword, Esoteric knowledge, Empyrian brain mines, Uluméathi Plasma ' +
      'Syphon, Universal anathema — glyph ˣ). (v0.66: no longer also gates a "Ordo Xenos ' +
      'Warband" — see Ordo Hereticus entry above.) The ' +
      'Ordo named in the Designer\'s note ("Alien Hunters" grants SM access to Ordo Xenos units, ' +
      '[[project_alien_hunters_fix]]) — this entry is the faction-internal source of truth those ' +
      'allied-access mechanisms point at.',
  },
  {
    keyword: 'Ordo allegiance — selection meta-rule',
    axis: 'ordo',
    gates: 'The structural mechanic the 3 Ordos above ride on. Since 2026-06-23 this is a single ' +
      'army-wide `Legacy` field (structurally exclusive by construction — only one Legacy can ' +
      'ever be active), not a per-model armory pick needing its own exclusivity check. Modelled ' +
      'via `requires_army_item`/`isArmyItemGateBlocked` (an "army-wide unlock pool" shape that ' +
      'fit no existing primitive — CSM/CD model their god-allegiance as a unit ATTRIBUTE via ' +
      '`selectedMark`/`locked_mark`, confirmed `null` here for all 13 units), resolved by ' +
      '`inquisitionLegacyOrdoUnlocks()` (engine/keywords.ts) — exactly mirroring the canonical ' +
      'text\'s single-allegiance scope, with no validator needed.',
  },

  // --- mark axis: EMPTY — grepped all 13 units, locked_mark: null everywhere. Genuinely a
  //     DIFFERENT absence-reason than SM's "no marks exist" claim: here the functional
  //     equivalent (Ordo) exists but is deliberately modelled through a different primitive
  //     (see `ordo` axis above) rather than the mark-attribute shape CSM/CD/the mark template use ---

  // --- faction axis: EMPTY — grepped digest+armory for any "Inquisition"/"Inquisitorial"
  //     gating keyword, found none. The Psyker rule is a generic core-rules grant keyed off
  //     `is_psyker` (Inquisitor + 2 Ordo Warbands), not derived from a per-unit identity keyword ---

  // --- datasheet axis: EMPTY — grepped all 13 units' keywords[] = []. FOURTH confirmation
  //     (CSM=6, CD=0, SM=0, Inquisition=0) that a populated datasheet axis is the exception ---
];
