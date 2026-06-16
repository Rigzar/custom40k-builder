/**
 * codex_space_marines/special-abilities — category 4 of 5 in the codex.ts data model
 * (Special ability).
 *
 * Catalogue of SM's ARMY-RULE MECHANICS — army-wide rules, archetypes, and the Legacy/chapter
 * system that (per Paso 3's finding) carries almost the entire weight SM doesn't put into
 * keywords. Migrated from `rules-model/space_marines.md` §4-§5 (VALIDATED — digest re-read
 * against Index.html / Army Customisation 2026-06-04).
 *
 * Anti-duplication discipline (mirrors CD's Paso 4 — one source of truth):
 *   - The 19 Traits' full effect data (costs, per-model TraitEffect objects) already live LIVE
 *     in `traits/space_marines.ts` (SM_TRAIT_EFFECTS, spread into TRAIT_EFFECTS, applied by the
 *     resolver's faction-agnostic pass) — NOT re-encoded here. This file lists them by name only,
 *     as part of the Legacy/Trait system's shape, and points at the canonical source.
 *   - The Legacy→discipline / Legacy→chapter-armory mapping already lives LIVE in
 *     `legacies/space_marines.ts` (SM_LEGACY_DISC_MAP, SM_CRUSADER_PRAYERS, full reference) —
 *     NOT re-encoded here either; this file documents the Legacy system's RULES (selection caps,
 *     what a Legacy grants structurally), the mapping table is the canonical source.
 *   - Armour-keyword grants (Gravis/Terminator/etc.) → already in SM_KEYWORDS (Paso 3); not
 *     repeated here.
 */

export interface SmSpecialAbilityEntry {
  /** Name as it appears in canonical text, e.g. "They Shall Know No Fear", "1st Company" */
  name: string;
  /** One of: army-wide rule / archetype / legacy-system rule / trait-system rule */
  category: 'army-rule' | 'archetype' | 'legacy-system' | 'trait-system';
  /** Verbatim or close-paraphrase rule text + grounding reference */
  text: string;
}

// Source: rules-model/space_marines.md §4 (army rules) + §5 (archetypes/legacies/traits,
// VALIDATED — Army Customisation.html: 9 archetypes (8 + "Chamber Militant" v0.71), 9 legacies,
// 19 traits).
export const SM_SPECIAL_ABILITIES: SmSpecialAbilityEntry[] = [
  // --- §4 army-wide rules (apply to the whole army, not keyword-derived — see SM_KEYWORDS) ---
  {
    name: 'They Shall Know No Fear',
    category: 'army-rule',
    text: 'Verbatim (Index.html, army-wide — confirmed NOT keyword-derived per Paso 3 finding): ' +
      'a pinned/fleeing unit auto-regroups at the start of the turn or upon reaching the board ' +
      'edge; can never use the "Take cover" Defensive reaction. Applied directly from the ' +
      'faction\'s Index data, the same mechanism CSM\'s "Marks count as veteran ability" line ' +
      'and CD\'s analogous army-rules use — an army-wide grant, structurally simpler than a ' +
      'keyword gate because every SM unit has it unconditionally.',
  },
  {
    name: 'No marks / no summoning / no favored-unit mechanic',
    category: 'army-rule',
    text: 'Digest §4 explicit confirmed-absence list (unlike CSM/CD): SM has none of the three ' +
      'god-allegiance mechanics that drive CSM\'s/CD\'s special-ability shape. This is WHY SM\'s ' +
      'keyword model collapsed to a single rich axis (Paso 3 finding) — the structural slot those ' +
      'three mechanics would occupy is filled instead by the Legacy/chapter system below.',
  },
  {
    name: 'Chapter-specific units need no archetype/Legacy/Trait',
    category: 'army-rule',
    text: 'Designer note (digest §4 verbatim): e.g. Deathwing Knights are usable by ANY SM army ' +
      'with no unlocking condition — they are plain slot entries (catalogued in SM_SLOTS/' +
      'SM_UNIT_TYPES, Pasos 1-2). Chapter FLAVOR comes from the Legacy system (armory+discipline ' +
      'access), not from gating which units appear on the roster.',
  },

  // --- §5 the Archetypes (0-1 selectable; 8 original + "Chamber Militant" v0.71) ---
  {
    name: '1st Company',
    category: 'archetype',
    text: 'Roster restricted to listed units only; Honor Guard + Terminator units count as ' +
      'Troops; grants "Objective secured!"; HQ models gain a once-per-army upgrade.',
  },
  {
    name: 'Death from Above',
    category: 'archetype',
    text: 'Assault Squad counts as Troops; half the army must start in Reserve.',
  },
  {
    name: 'Drop Pod Assault',
    category: 'archetype',
    text: 'The whole army starts the game in Drop Pods, with staged arrival.',
  },
  {
    name: 'Forlorn Brothers',
    category: 'archetype',
    text: 'Roster restricted to Black Rage creatures + listed vehicles only; Death Company ' +
      'counts as Troops, with no unit-count limit.',
  },
  {
    name: 'Legion',
    category: 'archetype',
    text: 'Grants full access to the Horus Heresy supplement; only HH Troops count toward the ' +
      '25% Troops requirement. Cross-ref [[project_hh_supplement_source]] — the injectable-' +
      'catalog mechanism this archetype triggers (sharedSupplementArmory, Legacy-style grant).',
  },
  {
    name: 'Librarian Conclave',
    category: 'archetype',
    text: 'Grants 4 HQ slots, restricted to Librarians only; units gain +1 manifest while near ' +
      'the Chief Librarian.',
  },
  {
    name: 'Renegades',
    category: 'archetype',
    text: 'The army is treated as Chaos Space Marines for ally-matrix purposes; may take 1 CSM ' +
      'Trait. The one explicit cross-faction bridge in SM\'s archetype list.',
  },
  {
    name: 'Swift as the Wind',
    category: 'archetype',
    text: 'Bikes/Outriders count as Troops; the army may Outflank on turn 1; models with Move ' +
      'under 12" must ride in a transport.',
  },

  // --- §5 the Legacy system (9 Legacies, 0-1 selectable / 0-2 with Expanded Armory Trait) ---
  {
    name: 'Legacy system (selection rules)',
    category: 'legacy-system',
    text: 'Verbatim: "Legacies give access to armories and disciplines of legendary factions." ' +
      'Cap: 0-1 Legacy (0-2 if the "Expanded Armory" Trait is active — the trait that exists ' +
      'PURELY to lift this cap, see SM_TRAIT_EFFECTS / "trait-system" entry below). Each of the ' +
      '9 Legacies grants its chapter\'s Armory; 5 of them additionally gate a named psychic ' +
      'discipline, and one (Crusader) gates Prayers instead. Full Legacy→chapter / Legacy→' +
      'discipline mapping is canonical in `legacies/space_marines.ts` (SM_LEGACY_DISC_MAP, ' +
      'SM_CRUSADER_PRAYERS) — NOT re-encoded here.',
  },
  {
    name: 'Legacy of Alien Hunters (special case)',
    category: 'legacy-system',
    text: 'RETIRED v0.71 — the 2026-06-14 .ods redefined this Legacy to a plain armory+universal-' +
      'equipment grant: "The army has access to the Death Watch Armory and each model may ' +
      'receive the \'Special ammunition\' equipment, regardless of whether it has access to the ' +
      'armory." It no longer mentions Inquisitors/Inquisition/Ordo Xenos at all — the old ' +
      '`grants_faction: "inquisition"` + "must select Ordo Xenos" validator (v0.56, ' +
      '[[project_alien_hunters_fix]]) were removed. Inquisition+Assassins access is now granted ' +
      'by the new "Chamber Militant" archetype (see below), which ALSO requires this Legacy to ' +
      'be selected. The universal "Special ammunition" toggle is unaffected — still a plain ' +
      'army-wide grant from this Legacy. Documented here as the Legacy system\'s one outlier — ' +
      'the other 8 Legacies are pure armory(+discipline) grants.',
  },
  {
    name: 'Chamber Militant',
    category: 'archetype',
    text: 'NEW v0.71 (2026-06-14 .ods Army Customisation R6), replaces the retired Inquisition-' +
      'access clause of "Legacy of the Alien Hunters" above. Verbatim: "- The army has access ' +
      'to units from Codex: Assassins. - The army has access to units from Codex: Inquisition. ' +
      '- Treat the Inquisition units as if \'Ordo Xenos\' was selected as Legacy. - Must select ' +
      '\'Legacy of the Alien Hunters\'." Opt-in (0-1 Archetype slot). Unlike the GK/Sororitas ' +
      'Chamber Militant, SM\'s also REQUIRES "Legacy of the Alien Hunters" to be selected — new ' +
      'validator in validators.ts enforces this. Inquisition is injected as the army\'s own ' +
      'units (no [Allied] badge) only while this archetype is active, and the Ordo Xenos Armory ' +
      'unlock is applied independent of the army\'s own Legacy slot — see chamberMilitantOrdo() ' +
      'in engine/keywords.ts. The Assassins-access clause needs no extra wiring (already ' +
      'covered by getAssassinAccessAlignment).',
  },
  {
    name: 'The 9 chapters (Legacy ↔ chapter ↔ discipline map)',
    category: 'legacy-system',
    text: 'Aurelia=Blood Ravens · Alien Hunters=Death Watch (+Special ammunition; Inquisition ' +
      'access moved to "Chamber Militant", see above) · ' +
      'Angel=Blood Angels+Sanguine · Crusader=Black Templars+Prayers of the Faithful · ' +
      'Damned=Relictors (no discipline) · Khan=White Scars+Stormspeaking · Lion=Dark Angels+' +
      'Interromancy · Praetorian=Imperial Fists+Geokinesis · Wolf=Space Wolves+Tempestus. This ' +
      'is the structural heart of SM\'s "chapter identity via Legacy, not keyword" design (the ' +
      'fact grounding SM_KEYWORDS\' empty `mark`/`datasheet` axes in Paso 3).',
  },

  // --- §5 the Trait system (19 Traits, 0-2 selectable; full effects live in SM_TRAIT_EFFECTS) ---
  {
    name: 'Trait system (selection rules + cost shape)',
    category: 'trait-system',
    text: 'Verbatim: "Traits enhance your units with special abilities... If a Trait is taken, ' +
      'all models/units in the army must be upgraded with it, unless stated otherwise." Cap: 0-2 ' +
      'Traits. Costs paid PER UNIT across three columns (NORMAL / CHARACTER MODELS / MONSTROUS ' +
      '& VEHICLES); costs marked `*` are paid per Wound or Hull point instead (e.g. The Flesh is ' +
      'Weak = 2*/0/5*). The full per-trait cost table + 19 LIVE TraitEffect encodings are ' +
      'canonical in `traits/space_marines.ts` (SM_TRAIT_EFFECTS — spread into TRAIT_EFFECTS, ' +
      'applied resolver-side; verified LIVE v0.51, ki-22a) — NOT re-encoded here to avoid a ' +
      'second source of truth for cost/effect data that would drift on the next balance pass.',
  },
  {
    name: 'Expanded Armory (the cap-lifting Trait)',
    category: 'trait-system',
    text: 'The one Trait with no per-unit TraitEffect by design (digest §6 / SM_TRAIT_EFFECTS ' +
      'header note): its sole function is to raise the Legacy cap from 0-1 to 0-2, enforced in ' +
      '`validators/space_marines.ts`, plus the cross-faction "one-armory-per-model" constraint ' +
      'when two Legacies are active. Listed here because it is the explicit textual LINK between ' +
      'the Trait system and the Legacy system above — without it, "9 Legacies, cap 0-1" and ' +
      '"19 Traits, cap 0-2" would read as two unrelated facts.',
  },
  {
    name: 'Path of Damnation (the other no-TraitEffect Trait)',
    category: 'trait-system',
    text: 'The second Trait with no per-unit TraitEffect by design: grants one model a CSM Demon ' +
      'weapon (a one-model special, cost column shows "Special" not a flat number) — modelled as ' +
      'a special case in the resolver rather than a generic TraitEffect. Listed alongside ' +
      'Expanded Armory as the Trait system\'s two structural exceptions to the "all 19 are plain ' +
      'TraitEffect entries" rule.',
  },
];
