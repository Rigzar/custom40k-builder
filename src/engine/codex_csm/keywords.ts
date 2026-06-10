/**
 * codex_csm/keywords — category 2 of 5 in the codex.ts data model (Keyword).
 *
 * Catalogue of CSM's keyword vocabulary across 4 axes (armour, mark, faction, datasheet — all
 * migrated from digest.md §1 + §4b + the per-slot roster tables in §4d-4i, all VALIDATED
 * against canonical sources / production data).
 *
 * `datasheet` axis = the "Keyword | Locked mark" column pairs straight off the §4d-4i roster
 * tables (e.g. digest.md:273 "Jakhals | World Eaters | **Khorne**", :275 "Poxwalkers |
 * Death Guard | **Nurgle**"). SOURCED FROM PRODUCTION (`keywords` field across all 61 unit
 * .ts files, counted via a one-off script — 2026-06-08), not hand-transcribed. Generic
 * structural keywords that overlap with unit_type/special-ability vocab (Vehicle, Monster,
 * Fortification, Priest, Psyker) are deliberately NOT catalogued here — see the closing note.
 *
 * NOT included here: Psyker — reclassified as Special ability (see special-abilities.ts and
 * PLAN_PROYECTO.md §1). That move is conceptual-only for now; the engine's `effectiveKeywords()`
 * (engine/keywords.ts) still treats Psyker as a gating keyword because real armory items use
 * `requires_keywords: ["Psyker"]` (e.g. data/parsed/space_marines/armory/general.json) — the
 * gating redesign needed to split this safely is deferred to the codex.ts engine pass.
 *
 * Migrated from `digest.md`:
 *   - §1  Keyword vocabulary — armour axis (Terminator / Cataphractii)        (line ~35)
 *   - §4b Army-specific rules — Marks, Favored Units, Mark of Chaos Undivided (line ~157)
 *
 * Note: this is a faction-level catalogue (which keywords exist + what they gate, in plain
 * canonical text). The actual per-unit keyword UNION at list-build time is computed by
 * `engine/keywords.ts` `effectiveKeywords()` — this file documents the CSM-specific
 * vocabulary that function needs to recognise, it doesn't replace it.
 */

export interface CsmKeywordEntry {
  /** Keyword as it appears in canonical text, e.g. "Terminator", "Mark of Nurgle" */
  keyword: string;
  /** Which axis this keyword belongs to */
  axis: 'armour' | 'mark' | 'faction' | 'datasheet';
  /** What this keyword gates (verbatim rule reference), if anything */
  gates?: string;
}

// Source: digest.md §1 (armour axis, VALIDATED — re-read from disk 2026-06-03) + §4b
// (Marks, VALIDATED — roster sheet re-read 2026-06-03) + §4d-4i roster "Keyword | Locked
// mark" columns (datasheet axis, counted straight from production `keywords` fields 2026-06-08).
export const CSM_KEYWORDS: CsmKeywordEntry[] = [
  // --- armour axis (both gate to the ᵀ subset; one-directional — only these two restrict) ---
  {
    keyword: 'Terminator',
    axis: 'armour',
    gates: 'Models in Terminator armor can only receive equipment marked with ᵀ. ' +
      'Innate on some datasheets, or BUYABLE via the "Terminator armor" item in the general armory ' +
      '(infantry only — grants +1T/+1A/2+ save/5+ inv/Deep strike/Massive(1)/Unyielding).',
  },
  {
    keyword: 'Cataphractii',
    axis: 'armour',
    gates: 'Models wearing Cataphractii or Terminator armor can only receive equipment with ᵀ ' +
      '(verbatim, confirmed in the Nurgle armory header — second confirmation in the Horus Heresy ' +
      'armory). BUYABLE via "Cataphractii armor" (Nurgle armory p_char 76, 4+ inv; Horus Heresy ' +
      'armory p_char 80, same profile) — infantry only.',
  },
  // Note: Gravis/Power do NOT appear as armour gates in CSM (Gravis is a Space Marines concept).

  // --- mark axis (each gates its own mark armory: "Any model with access to the Armory and ---
  // --- the Mark of [God] equipped can buy as many items as it wants.") ---
  {
    keyword: 'Mark of Khorne',
    axis: 'mark',
    gates: 'Khorne mark armory access. Grants: +1 Attack; character/Monstrous +1 Strength; ' +
      'Vehicles double hits dealt on Tank Shock. Sacred number 8 (Favored Units). ' +
      'Rival of Mark of Slaanesh (Animosity of the Gods — mutually exclusive).',
  },
  {
    keyword: 'Mark of Nurgle',
    axis: 'mark',
    gates: 'Nurgle mark armory access. Grants: +1 Toughness; character/Monstrous +1 Wound; ' +
      'Vehicles roll 2D6 each Reinforcement phase, on 7+ remove Crew Shaken/Engine Damage/Weapon ' +
      'Damage or restore 1 HP. Sacred number 7 (Favored Units). ' +
      'Rival of Mark of Tzeentch (Animosity of the Gods — mutually exclusive).',
  },
  {
    keyword: 'Mark of Slaanesh',
    axis: 'mark',
    gates: 'Slaanesh mark armory access. Grants: +1 Initiative; character/Monstrous +2" Movement; ' +
      'Vehicles -1 Ld/CC result to hostiles within 18" (-2 within 9"). Sacred number 6 (Favored Units). ' +
      'Rival of Mark of Khorne (Animosity of the Gods — mutually exclusive).',
  },
  {
    keyword: 'Mark of Tzeentch',
    axis: 'mark',
    gates: 'Tzeentch mark armory access. Grants: "Warded" ability; character/Monstrous becomes a ' +
      'psyker (1 power, any discipline) or gains +1 power manifested/denied per turn if already a ' +
      'psyker; Vehicles gain a Warpflamer (9", Assault 4, S4, AP-1, D1, Flames). Sacred number 9 ' +
      '(Favored Units). Rival of Mark of Nurgle (Animosity of the Gods — mutually exclusive).',
  },
  {
    keyword: 'Mark of Chaos Undivided',
    axis: 'mark',
    gates: 'No dedicated armory exists (confirmed — user 2026-06-03). Progressive kill-based ' +
      'benefits instead: 1st kill = one Mark benefit (non-character level), 2nd = character-level ' +
      'benefit, 3rd = one Daemon weapon ability of a chosen god, 4th = base stats replaced by a ' +
      'Daemon Prince of the chosen god. Loses its last Wound before any benefit → replaced by a ' +
      'Chaos Spawn under the opponent\'s control. Always compatible in Animosity of the Gods.',
  },
  // Note: ALL marks "count as a veteran ability" army-wide (taking one consumes a vet slot) —
  // see special-abilities.ts (Army-specific rules, §4b) for that cross-cutting rule.

  // --- faction axis (situational — only when something references the whole faction) ---
  {
    keyword: 'Chaos Space Marine',
    axis: 'faction',
    gates: 'Universal faction keyword — present on all 8 HQ datasheets per §4d ("All keyword ' +
      'Chaos Space Marine") and, by the same per-slot read, the rest of the roster. Gates ' +
      'faction-wide armory access ("Any model with access to the Armory…") and Legacy/Legion grants.',
  },

  // --- datasheet axis (legion/warband identity — the "Keyword | Locked mark" column pairs from
  // --- the §4d-4i roster tables; a "locked mark" unit carries that god's mark as an INNATE
  // --- ability and skips the mark selector entirely — digest.md:281-282, :372-375) ---
  {
    keyword: 'Cultist',
    axis: 'datasheet',
    gates: 'Generic Chaos warband identity, NO locked mark (digest.md:270-276, :325/:329-330/' +
      ':464 — Accursed Cultists, Cultists, Mutants, Traitor Guard, Big Mutants, Cultist ' +
      'Firebrand, Dark Commune, Chaos Spawn). Free to take any of the 4 god marks via the ' +
      'normal mark selector (or none).',
  },
  {
    keyword: 'Death Guard',
    axis: 'datasheet',
    gates: 'Locked Mark of Nurgle — carried as an innate ability, no selector (digest.md:275 ' +
      'Poxwalkers, :326/:331/:333/:340 Blightlord/Deathshroud Terminators, Exalted Plague ' +
      'Champion, Plague Marines, :465/:467 Foetid Bloat-Drone, Myphitic Blight-Hauler).',
  },
  {
    keyword: 'World Eaters',
    axis: 'datasheet',
    gates: 'Locked Mark of Khorne — carried as an innate ability, no selector (digest.md:273 ' +
      'Jakhals, :332/:336/:342 Eightbound, Khorne Berzerkers, Red Butcher Terminators, ' +
      ':466 Juggernaut Hellriders).',
  },
  {
    keyword: 'Thousand Sons',
    axis: 'datasheet',
    gates: 'Locked Mark of Tzeentch — carried as an innate ability, no selector (digest.md:277 ' +
      'Tzaangors, :343-346 Rubric Marines, Scarab Occult Terminators, Sekhetar Robots, ' +
      'Tzaangor Shaman — the latter three are also `is_psyker`).',
  },
  {
    keyword: "Emperor's Children",
    axis: 'datasheet',
    gates: 'Locked Mark of Slaanesh — carried as an innate ability, no selector (digest.md:334/' +
      ':339 Flawless Blades, Noise Marines). Note: the HTML source datasheet for Noise Marines ' +
      'misspells this "Emperor\'s Champion" — confirmed typo, production data corrected to ' +
      '"Emperor\'s Children" (see noise_marines.ts header note).',
  },
  {
    keyword: 'Warpsmith',
    axis: 'datasheet',
    gates: 'Unique single-datasheet identity keyword (the Warpsmith HQ, digest.md:231). Gates ' +
      'Iron Warriors-exclusive armory items: "Only for Warpsmiths" (Axe of the Forgemaster, ' +
      'Nest of Mechaserpents — digest.md:82).',
  },
  // Note: generic structural keywords that double as unit-type/special-ability vocabulary —
  // Vehicle, Monster, Fortification, Priest, Psyker — are intentionally NOT catalogued as
  // `datasheet` entries here (they'd duplicate unit-types.ts / special-abilities.ts and add
  // no CSM-specific gating info beyond what those files already carry). Psyker in particular
  // stays out per the reclassification note above.
];
