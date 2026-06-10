/**
 * codex_chaos_daemons/special-abilities — category 4 of 5 in the codex.ts data model
 * (Special ability).
 *
 * Catalogue of CD's ARMY-RULE MECHANICS — the things that ride on top of wargear/keywords but
 * aren't themselves keyword data (already lives in CD_KEYWORDS) nor named weapon-ability text
 * (Pasos 5 / coreRules.ts glossary). Migrated from `rules-model/chaos_daemons.md` §4 / §4b /
 * §5 / §6 (VALIDATED — digest re-read against Index.html / Army Customisation 2026-06-03).
 *
 * Anti-duplication discipline (mirrors CSM's Paso 6 — keywords-not-flags, one source of truth):
 *   - Per-mark grants / sacred numbers / Animosity rival pairs → already in CD_KEYWORDS, NOT
 *     repeated here verbatim; this file documents the META-rules that consume them.
 *   - Individual psychic powers (18 named, across 3 disciplines) → already canonical in
 *     `disciplines.json` (Change/Decay/Excess); this file documents access/gating only.
 *   - Animosity rival-pair table → CD_KEYWORDS' mark entries; this file notes the meta-rule
 *     ("army mark = highest-points HQ; characters may only join same-mark-or-no-mark units")
 *     and the cross-faction scoping fact that the join-enforcement FIX (ki-csm-animosity-
 *     joinmark-01) was deliberately scoped to CSM only — CD's own join sub-clause remains
 *     unenforced (same digest §4b note: "identical structure to CSM", inheriting the same gap).
 */

export interface CdSpecialAbilityEntry {
  /** Name as it appears in canonical text, e.g. "Favored Units", "Host Duplicitous" */
  name: string;
  /** One of: general-armory rule / army-rule mechanic / archetype / cast-system mechanic */
  category: 'armory-rule' | 'army-rule' | 'archetype' | 'cast-system';
  /** Verbatim or close-paraphrase rule text + grounding reference */
  text: string;
}

// Source: rules-model/chaos_daemons.md §4 (armory rules) + §4b (army rules) + §5 (archetypes,
// VALIDATED — only 0-1 Archetype, NO legacies/traits per digest) + §6 (cast system).
export const CD_SPECIAL_ABILITIES: CdSpecialAbilityEntry[] = [
  // --- General armory-wide rules (§4, 3 verbatim bullets — identical wording/source to CSM) ---
  {
    name: 'One purchase per model (default)',
    category: 'armory-rule',
    text: '"Unless stated otherwise, every item can only be purchased once by each model."',
  },
  {
    name: 'Unlimited item count',
    category: 'armory-rule',
    text: '"Any model with access to the Armory can buy as many items as it wants."',
  },
  {
    name: 'Cost "-" = not selectable',
    category: 'armory-rule',
    text: '"Items with a cost of \'-\' can not be selected." Same convention as CSM\'s armory tables.',
  },

  // --- §4b army-rule mechanics riding on marks (the grants themselves live in CD_KEYWORDS) ---
  {
    name: 'Marks count as a veteran ability',
    category: 'army-rule',
    text: 'Verbatim: "Counts as a veteran ability"; "If a unit already is equipped with a mark, ' +
      'its benefits are included in the unit\'s profile." Meta-rule that makes Marks free passive ' +
      'profile bonuses rather than purchasable upgrades for units with `locked_mark` — the actual ' +
      'per-god grants are catalogued in CD_KEYWORDS\' mark axis, not repeated here.',
  },
  {
    name: 'Favored Units',
    category: 'army-rule',
    text: 'A unit with a Mark that starts the game with a model count equal to the deity\'s sacred ' +
      'number (or a multiple thereof) counts as Favored: its squad leader(s) — single models with ' +
      'sole access to the armory — gain +1 Attack and a personal icon. Sacred numbers (cross-ref ' +
      'CD_KEYWORDS mark axis): Tzeentch 9 / Khorne 8 / Nurgle 7 / Slaanesh 6.',
  },
  {
    name: 'No Summoning rule (CD-internal)',
    category: 'army-rule',
    text: 'Digest §4b explicit: "No Summoning rule listed in CD\'s own Index" — unlike CSM, whose ' +
      'Summoning text lives on the CSM side and governs Daemons-as-allies access. CD as a ' +
      'standalone army has no codex-internal summoning clause; documented here as a confirmed ' +
      'absence (architectural difference), not a migration gap.',
  },
  {
    name: 'Animosity of the Gods (army-mark + join meta-rule)',
    category: 'army-rule',
    text: 'The army\'s mark is set by the highest-total-points HQ; a character with a Mark may only ' +
      'join units of the same Mark or no Mark. Rival pairs (Khorne✗Slaanesh, Nurgle✗Tzeentch — ' +
      'catalogued per-mark in CD_KEYWORDS, "identical structure to CSM" per digest §4b) are ' +
      'mutually exclusive even as allies, enforced via the shared `validators.ts allowedMarks()`. ' +
      'NOTE: the "may only join same-mark-or-no-mark" join sub-clause was found unenforced and ' +
      'FIXED for CSM (ki-csm-animosity-joinmark-01) but deliberately scoped to CSM only — CD ' +
      'inherits the identical gap, unaddressed (own KI not yet logged; flagging here for Fase 5).',
  },

  // --- §5 archetypes (CD allows only 0-1 Archetype; NO legacies, NO traits — digest verbatim) ---
  {
    name: 'Assault on Realspace',
    category: 'archetype',
    text: 'Ungated. Units reduce their scatter distance by one D6.',
  },
  {
    name: 'Calamitous Invasion',
    category: 'archetype',
    text: 'Ungated. Roll 1D6 each Reinforcement phase; on 5+ a Meteor appears (activated like a ' +
      'unit; placed like Deep Strike, scatter always 2D6" unmodified). Instead of placing a model, ' +
      'all units within 6" take 1 automatic hit S10 AP-1 D1, AT(2), Barrage, Seeking, Suppression.',
  },
  {
    name: 'Figureheads of The Dark Prince',
    category: 'archetype',
    text: 'Gated: Mark of Slaanesh (ˢ). HQ models gain +1 Attack while not within 12" of another ' +
      'friendly HQ model.',
  },
  {
    name: 'Goretide',
    category: 'archetype',
    text: 'Gated: Mark of Khorne (ᴷ). Roll 1D6 for each Mark-of-Khorne model that loses its last ' +
      'Wound in melee; on 5+ it causes one automatic Wound (one of its weapons) vs an enemy unit ' +
      'in base contact.',
  },
  {
    name: 'Host Duplicitous',
    category: 'archetype',
    text: 'Gated: Mark of Tzeentch (ᵀ). Psychic powers do not increase their casting values for ' +
      'manifesting them multiple times per round.',
  },
  {
    name: 'Popping Plague',
    category: 'archetype',
    text: 'Gated: Mark of Nurgle (ᴺ). Your units explode like a vehicle upon losing their last Wound.',
  },

  // --- §6 cast-system mechanics (named powers live in disciplines.json — access/gating only) ---
  {
    name: 'Psychic-only caster (no Prayers, no Pacts)',
    category: 'cast-system',
    text: 'CD exercises only the Psychic half of the cast system — `prayers:[]`, `pacts:[]` in ' +
      'production data (unlike CSM, which also has Prayers and Infernal Pacts). Cast-category ' +
      'gating (Basic/Normal/Complex by casting order) follows Core Rules; Skirmish caps at ' +
      '1 power/turn (Missions L84 — confirmed an in-game battle mechanic, not a list-build ' +
      'restriction, per ki-skirmish-restrictions-unenforced-01 #3 closure).',
  },
  {
    name: 'God-gated disciplines (3, no Khorne)',
    category: 'cast-system',
    text: 'Change (Tzeentch-only — Pyric Flux/Tzeentch\'s Firestorm/Doombolt/Glamour of Tzeentch/' +
      'Weaver of Fates/Temporal Manipulation), Decay (Nurgle-only — Gift of Contagion/Miasma of ' +
      'Pestilence/Decaying Touch/Plague Wind/Putrescent Vitality/Nurgle\'s Dance), Excess ' +
      '(Slaanesh-only — Delightful Agonies/Pavane of Slaanesh/Cacophonic Choir/Hysterical Frenzy/' +
      'Siren/Symphony of Pain). No Khorne discipline exists — Khorne is anti-psyker by canon. All ' +
      '18 named powers are catalogued in `disciplines.json`, not duplicated here.',
  },
  {
    name: 'General disciplines via armory grants',
    category: 'cast-system',
    text: 'Some armory items grant access to the shared general-discipline pool rather than a ' +
      'god-locked one: Interdimensional Knowledge ᵀ (+2 general powers), Psychic training ' +
      '(+1 power from a known discipline), Magical boon ᵀ (+1 cast/deny activation per turn).',
  },
  {
    name: 'Psyker access via Mark of Tzeentch',
    category: 'cast-system',
    text: 'A model becomes a psyker either innately (`is_psyker` on its datasheet) or via the Mark ' +
      'of Tzeentch grant (Character/Monstrous Creature becomes a psyker, or gains +1 manifest/' +
      'deny if already one — full grant text lives in CD_KEYWORDS\' Mark of Tzeentch entry).',
  },
];
