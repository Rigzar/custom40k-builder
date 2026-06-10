/**
 * codex_inquisition/special-abilities — category 4 of 5 in the codex.ts data model
 * (Special ability).
 *
 * Catalogue of Inquisition's ARMY-RULE MECHANICS. Migrated from `rules-model/inquisition.md`
 * §4-§5 (VALIDATED — digest fully audited+fixed v0.56, [[project_inquisition_audit]]).
 *
 * THE CHEAPEST Paso 4 of any faction migrated so far: digest §5 confirms NO archetypes/
 * legacies/traits exist (`Index.html` has no Army Customisation tab) — the entire category
 * collapses to the Psyker rule, the discipline-access notes, the confirmed absence itself, and
 * the Ordo Warband units' structural shape (their GATING already lives in INQ_KEYWORDS' `ordo`
 * axis — Paso 3; this file documents the units' textual/structural NATURE, not re-gates them).
 *
 * ⚠ Heads-up (user, 2026-06-08): the creator told the user Inquisition's Army Customisation
 * rules are GOING TO CHANGE in a future update. This file's entire shape — "no archetypes/
 * legacies/traits" — depends on the CURRENT `Index.html`. When updated source files land,
 * RE-READ Index.html / Army Customisation.html for a new tab before trusting these entries.
 *
 * Anti-duplication discipline: the 12 named psychic powers (Heresius+Telethesia, 6 each) stay
 * canonical in `psychic/disciplines.json` (shipped v0.56) — not repeated here, access/gating
 * documented only. The Ordo grants themselves live in INQ_KEYWORDS' `ordo` axis — not repeated.
 */

export interface InqSpecialAbilityEntry {
  /** Name as it appears in canonical text, e.g. "Psyker", "Ordo Warband units" */
  name: string;
  /** One of: army-rule mechanic / cast-system mechanic / confirmed-absence note / unit-shape note */
  category: 'army-rule' | 'cast-system' | 'confirmed-absence' | 'unit-shape';
  /** Verbatim or close-paraphrase rule text + grounding reference */
  text: string;
}

// Source: rules-model/inquisition.md §4 (army rules) + §5 (archetypes/legacies/traits — none;
// Ordo Warband structural note). VALIDATED — digest fully audited+fixed v0.56.
export const INQ_SPECIAL_ABILITIES: InqSpecialAbilityEntry[] = [
  // --- §4 army rules ---
  {
    name: 'Psyker',
    category: 'army-rule',
    text: 'Verbatim (`Inquisitor.html` row 17 — generic core-psyker text): "A psyker can cast 1 ' +
      'psychic power and dispel 1 psychic power per round. A psyker knows Smite, as well as one ' +
      'psychic power from a chosen psychic discipline." Confirms Heresius/Telethesia are the ' +
      'faction disciplines the "chosen discipline" clause resolves to. Carried by `is_psyker` ' +
      '(grepped: true on Inquisitor + Ordo Malleus Warband + Ordo Xenos Warband — 3 of 13 units, ' +
      'NOT keyword-derived, confirming INQ_KEYWORDS\' empty `faction` axis finding).',
  },

  // --- §4 cast-system access notes (named powers stay canonical in disciplines.json) ---
  {
    name: 'General psychic disciplines (shared pool)',
    category: 'cast-system',
    text: 'Digest §4 explicit: `General psychic disciplines.html` is a link-pointer to the ' +
      'shared Google Sheets content already covered codebase-wide by `GENERAL_DISCIPLINES` ' +
      '(`src/data/generalDisciplines.ts`, merged in `PsychicModal.tsx:87`) — NO migration ' +
      'needed for this part; documented here only so a future reader doesn\'t mistake the ' +
      'absence of a dedicated general-discipline file for a gap.',
  },
  {
    name: 'Faction disciplines: Heresius + Telethesia (own, 6 powers each)',
    category: 'cast-system',
    text: 'Shipped v0.56 in `psychic/disciplines.json`. Heresius = His Will Be Done / ' +
      'Witchhammer / Word of the Emperor / Purgatus / Divine Pronouncement / Soul-lightning. ' +
      'Telethesia = Psychic Fortitude / Warding Incantation / Castigation / Psychic Pursuit / ' +
      'Scouring / Terrify. The 12 named powers stay canonical in disciplines.json — not ' +
      'duplicated here, this entry documents access/existence only (mirrors CD_SPECIAL_' +
      'ABILITIES\' "named powers live in disciplines.json" anti-duplication pattern exactly).',
  },

  // --- §5 confirmed absence (the finding that makes this Paso 4 the cheapest of any faction) ---
  {
    name: 'No archetypes / legacies / traits',
    category: 'confirmed-absence',
    text: 'Digest §5 explicit: "None — `Index.html` confirmed no Army Customisation sheet for ' +
      'Inquisition." A genuine structural absence (verified against the source HTML, not an ' +
      'oversight) — the reason this faction\'s Paso 4 collapses to a handful of entries instead ' +
      'of the 30+ archetype/legacy/trait entries CSM/SM each carry. ⚠ Per the user\'s 2026-06-08 ' +
      'heads-up (the creator plans to add Army Customisation rules in a future update), this is ' +
      'the entry MOST LIKELY to need revision first — re-check `Index.html` for a new tab before ' +
      'trusting this absence claim on a future visit to this faction.',
  },

  // --- §5 Ordo Warband units — structural/textual nature note (gating itself = INQ_KEYWORDS) ---
  {
    name: 'Ordo Warband units (NOT archetypes — plain gated Troops datasheets)',
    category: 'unit-shape',
    text: 'Digest §5 explicit note: the 3 "Ordo X Warband" units (`troops/ordo_*_warband.ts`) ' +
      'are NOT archetype-injected content — they are plain Troops datasheets on the standard ' +
      'roster, gated the exact same way as the matching Ordo\'s armory items (`requires_army_' +
      'item: "Ordo X Inquisitor"`, "max 12 models, one warband per army"). Each fields 6-7 named ' +
      'model profiles (e.g. Hereticus = Acolyte/Arco-flagellant/Penitent/Surgeon/Missionary/' +
      'Servitor/Sage). The GATING mechanism itself (`requires_army_item`/`isArmyItemGateBlocked` ' +
      'widened `ArmoryItem→Unit` v0.56) is already catalogued in INQ_KEYWORDS\' `ordo` axis ' +
      '(Paso 3) — this entry documents the units\' textual/structural NATURE (plain datasheets, ' +
      'not archetypes; the designer\'s explicit reason to call this out at all) so a future ' +
      'reader doesn\'t mistake "gated roster entries" for "archetype-injected content", a ' +
      'distinction the digest itself felt was worth a dedicated note.',
  },
];
