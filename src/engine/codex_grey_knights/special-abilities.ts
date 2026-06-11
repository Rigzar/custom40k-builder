/**
 * codex_grey_knights/special-abilities — category 4 of 5 in the codex.ts data model
 * (Special ability).
 *
 * Catalogue of Grey Knights' ARMY-RULE MECHANICS + Archetypes/Legacies. Migrated from
 * `rules-model/grey_knights.md` §4-§5.
 *
 * Anti-duplication discipline: the 12 named Sanctity/Dominus psychic powers + 8 Legacy bonus
 * powers (20 total) stay canonical in `psychic/disciplines.json`; the 8 named Prayers stay
 * canonical in `psychic/prayers.json`. Archetype AOP-shuffles + Legacy bonus-power grants stay
 * canonical in `archetypes.json` — this file documents access/existence/structure only, mirrors
 * the [[project_inquisition_codex_migration]] anti-duplication pattern.
 */

export interface GkSpecialAbilityEntry {
  /** Name as it appears in canonical text, e.g. "Psyker", "Demon Hunters" */
  name: string;
  /** One of: army-rule mechanic / cast-system mechanic / archetype / legacy / confirmed-absence */
  category: 'army-rule' | 'cast-system' | 'archetype' | 'legacy' | 'confirmed-absence';
  /** Verbatim or close-paraphrase rule text + grounding reference */
  text: string;
}

// Source: rules-model/grey_knights.md §4 (army rules) + §5 (archetypes/legacies/traits).
export const GK_SPECIAL_ABILITIES: GkSpecialAbilityEntry[] = [
  // --- §4 army-wide Special Rules (verbatim from Index.html, 7 entries) ---
  {
    name: 'Demon Hunters',
    category: 'army-rule',
    text: 'Verbatim: "The army has access to units from the Inquisition codex (Inquisitors must ' +
      'select \'Ordo Malleus\'). Additionally, the army has access to Assassins." The native-' +
      'allied-access rule — already SHIPPED via `intrinsic_allies` ([[project_inquisition_audit]] ' +
      'Fase A) and the universal Assassins access mechanism ([[project_inquisition_audit]] Pass ' +
      '5, `getAssassinAccessAlignment`). Cross-ref [[project_alien_hunters_fix]] ' +
      '(`ki-gk-inquisition-allied-badge-01`, fixed). Documented here for completeness — no ' +
      'further engine change needed.',
  },
  {
    name: 'Nemesis warding stave',
    category: 'army-rule',
    text: 'Verbatim: "If at least one model in the unit is equipped with a Nemesis warding ' +
      'stave, all models in the unit gain the \'Parry\' ability." A unit-wide grant triggered by ' +
      'a single model\'s wargear choice — mirrors CSM banner-type "if one model has X, unit ' +
      'gains Y" patterns.',
  },
  {
    name: 'Psykers and Force weapons (pick-one-caster cap)',
    category: 'army-rule',
    text: 'Verbatim: "If every model in the unit can manifest psychic powers, the unit\'s ' +
      'controller must choose one model that will be the only one allowed to use psychic powers ' +
      'and Force weapons (and risk Perils of the Warp) for the rest of the game." A structural ' +
      '"pick-one-caster" cap on fully-psyker squads — distinct from Inquisition\'s simple ' +
      '`is_psyker` per-unit grant (no equivalent cap there, since Inquisition has no fully-' +
      'psyker squads).',
  },
  {
    name: 'Shrouding',
    category: 'army-rule',
    text: 'Verbatim: "While at 12\'\' or more from the bearer, all enemy ranged attacks against ' +
      'the model gain the (cumulative) \'Deflect\' ability." Universal GK defensive rule, present ' +
      'on nearly every infantry/monster unit\'s ability line.',
  },
  {
    name: 'They Shall Know No Fear',
    category: 'army-rule',
    text: 'Standard SM-family auto-regroup rule (verbatim matches the Astartes-wide rule — GK ' +
      'are Space Marines, inherit this; cross-ref [[project_alien_hunters_fix]] for the same ' +
      'rule\'s SM-side handling).',
  },
  {
    name: 'Teleport strike',
    category: 'army-rule',
    text: 'Verbatim (paraphrase): "For every 2500 points in the army, it gains 3 \'Teleport ' +
      'tokens\'. ... a unit can be redeployed using the rules for Deep Strike..." Army-wide Deep-' +
      'Strike-resource rule — the in-fiction basis for the "Personal teleporter"/"Teleporter" ' +
      'armory grants (GK_KEYWORDS\' Terminator-gate items + the Jump-pack-equivalent grants on ' +
      'Interceptor Squad, digest §1).',
  },
  {
    name: 'True Grit',
    category: 'army-rule',
    text: 'Verbatim: "All ranged weapons of the model are treated as Assault weapons. ' +
      'Additionally, if the model made a ranged AND melee attack in the same activation, it ' +
      'gains +1 Attack until the end of the Fight phase." Present on Strike/Terminator Squad ' +
      'ability lines.',
  },

  // --- §4 datasheet-level Psyker / Faithful rules (cast-system access notes) ---
  {
    name: 'Psyker (21/22 units)',
    category: 'cast-system',
    text: 'Verbatim: "Psyker: The [unit/model] can cast 1 power and deny 1 power per battle ' +
      'round. It/He knows Smite and 1 power from a chosen discipline." Carried by `is_psyker` on ' +
      '21/22 units (lone exception: Ghost Terminator Squad, `is_psyker: false`) — GK is the ' +
      'OPPOSITE shape from Inquisition\'s 3/13 (23%), the most psyker-saturated faction ' +
      'catalogued. "Brotherhood of Psykers" is GK\'s own-named wrapper for the same flag on multi-' +
      'model Infantry squads (Strike/Terminator) — a textual nuance, not a separate mechanic.',
  },
  {
    name: 'Sanctity + Dominus disciplines (own, 12 powers)',
    category: 'cast-system',
    text: 'Sanctity = Banishment / Cleanse Soul / Sanctuary / Astral Aim / Hammerhand / ' +
      'Destruction. Dominus = Warp Shaping / Empyric Amplification / Ghostly Bonds / Gate / ' +
      'Psy-steel Armor / Vortex. Live in `psychic/disciplines.json` — not duplicated here, this ' +
      'entry documents access/existence only (the "chosen discipline" clause above resolves to ' +
      'one of these two).',
  },
  {
    name: 'Faithful (Prayers access)',
    category: 'cast-system',
    text: 'Verbatim (Chaplain.html): "The model can recite 1 prayer per turn. A prayer is ' +
      'successfully recited on a roll of 3+. If a prayer fails to be recited, it can not be ' +
      'attempted again by the same model in this battle round. The model knows all prayers from ' +
      'the Prayer list." Datasheet-level grant (textual, not keyword-derived — mirrors the ' +
      '`is_psyker` shape exactly: named ability → grants access to a named pool). Chaplain may ' +
      'additionally take "Master of Sanctity" (+15 pts, one per army — "+1 additional prayer per ' +
      'turn", a stacking modifier on the same grant). The 8 named Prayers (Litanies of Purity + ' +
      'Prayers of Battle) live in `psychic/prayers.json` — not duplicated here. Both systems ' +
      '(Psyker disciplines + Faithful prayers) are independent and stack on the Chaplain.',
  },

  // --- §5 Archetypes (2, AOP-shuffle shape) ---
  {
    name: 'Chamber of Purity',
    category: 'archetype',
    text: 'AOP-shuffle archetype: Purifier Squads → Troops; all other Troops → Elite. Mirrors ' +
      'CSM/SM "Troops↔Elite swap" archetype shape. Slot remap shipped in `archetypes.json`.',
  },
  {
    name: 'Hall of Champions',
    category: 'archetype',
    text: 'AOP-shuffle archetype: Paladin Squads → Troops; all other Troops → Elite. Same shape ' +
      'as Chamber of Purity, different unit pair. Slot remap shipped in `archetypes.json`.',
  },

  // --- §5 Legacies (8, uniformly the simplest legacy shape: single bonus-power grant) ---
  {
    name: 'Legacies (8 total — single bonus-power grant each)',
    category: 'legacy',
    text: 'Each legacy grants "All Psykers know the \'<Named Power>\' psychic power in addition" ' +
      '— zero armory/discipline-access complexity (contrast CSM\'s 5 richer legacies with ' +
      '`armory_key` cross-refs, all `null` here): Blades of Victory→Inescapable Pursuit / ' +
      'Exactors→Purge Soul / Prescient Brethren→Fatal Precognition / Preservers→Aegis Eternal / ' +
      'Rapiers→Symphonic Strike / Silver Blades→Temporal Accuracy / Swordbearers→Empyric ' +
      'Lodestone / Wardmakers→Projection of Purity. All 8 named powers verified present in ' +
      '`Grey Knight psychic discipline.html`\'s dedicated "Legacy" row-group (12 Sanctity/Dominus ' +
      'core powers + 8 Legacy bonus powers = 20 total named GK powers, all in disciplines.json — ' +
      'not duplicated here).',
  },

  // --- §5 confirmed absence ---
  {
    name: 'No Traits',
    category: 'confirmed-absence',
    text: 'Digest §5 explicit: `Army Customisation.html` row 3 states the selection budget as ' +
      '"You may select up to the following: 0-1 Archetype, 0-1 Legacy" — no Trait slot offered, ' +
      'and no "TRAITS" section exists in the HTML (only ARCHETYPES + LEGACIES). Production ' +
      '`archetypes.json` confirms `"traits": []`. A FINER-GRAINED absence than Inquisition\'s ' +
      '("missing Army Customisation tab entirely") — GK genuinely HAS the tab, it simply offers ' +
      'no Traits within it: "tab present but category empty" ≠ "tab absent."',
  },
];
