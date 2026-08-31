/**
 * codex_imperial_guard/special-abilities — category 4 of 5 in the codex.ts data model
 * (Special ability).
 *
 * Catalogue of Imperial Guard's ARMY-RULE MECHANICS + Archetypes/Legacies/Traits. Migrated from
 * `rules-model/imperial_guard.md` §4-§5 (grounded in the `.ods` canon).
 *
 * IG has the RICHEST customisation of any faction migrated (11 archetypes / 7 legacies /
 * 16 traits, vs GK's 2/8/0) AND a signature army mechanic (Orders) absent elsewhere.
 *
 * Anti-duplication discipline: the archetype AOP-shuffles, the 7 legacies, and the 16 traits stay
 * canonical in `archetypes.json` (production cross-check: 11/7/16 exact). The Psikana discipline +
 * Hymns of Battle are NOT in production yet (`ki-ig-psychic-unwired-01`, see §6). This file
 * documents the army-rule MECHANICS + the structural shape of the customisation, not full content.
 */

export interface IgSpecialAbilityEntry {
  /** Name as it appears in canonical text */
  name: string;
  category: 'army-rule' | 'cast-system' | 'archetype' | 'legacy' | 'trait' | 'gap-note';
  /** Verbatim or close-paraphrase rule text + grounding reference */
  text: string;
}

// Source: rules-model/imperial_guard.md §4 (army rules) + §5 (archetypes/legacies/traits).
export const IG_SPECIAL_ABILITIES: IgSpecialAbilityEntry[] = [
  // --- §4 army rules ---
  {
    name: 'Orders (signature mechanic)',
    category: 'army-rule',
    text: 'Verbatim (Index): "Each officer issues the army one or more orders, which can be selected ' +
      'or exchanged in the Reinforcement phase. Each of the Imperial Guard\'s own units... can use ' +
      'one of the previously selected orders... as long as it is within 12" of an officer at the ' +
      'start of its activation. An order is not consumed and any number of units can use the same ' +
      'order in a turn... Each unit can only benefit from a single order per turn. An officer knows ' +
      'all orders from the list." Two base lists gate on UNIT TYPE (Infantry vs Vehicle), hence no ' +
      'keyword axis (IG_KEYWORDS empty). Infantry orders (9): Fix bayonets! / Take cover! / First ' +
      'rank, fire! Second rank, fire! / Overcharge batteries! / Move! Move! Move! / Bring it down! / ' +
      'Forwards, for the Emperor! / Get back in the fight! / Fall back!. Vehicle orders (3): ' +
      'Gunners, kill on sight! / Fire and fade! / Scorched earth!. Legacy orders (6) unlocked by ' +
      'Legacies — see below.',
  },
  {
    name: 'Weapon team crews',
    category: 'army-rule',
    text: 'Verbatim (Index): "Some units have the option to have their models form a \'Heavy weapons ' +
      'team\'. These models use the \'Heavy Weapon Squad\' profile."',
  },

  // --- §4 cast/litany systems ---
  {
    name: 'Hymns of Battle (Preacher litanies)',
    category: 'cast-system',
    text: 'The Preacher\'s prayer-equivalent system (5 hymns, NOT psychic powers): Catechism of ' +
      'Repugnance / Chorus of Spiritual Fortitude / Psalm of Righteous Smiting / Refrain of Blazing ' +
      'Piety / War Hymn. Mirrors GK\'s Faithful/Prayers split ([[project_grey_knights_digest]]). ' +
      '⚠ NOT in production — see gap-note below.',
  },
  {
    name: 'Psikana (psychic discipline)',
    category: 'cast-system',
    text: 'IG\'s own discipline (Psikana I/II: Mental Strength / Gaze of the Emperor / Nightshroud / ' +
      'Psychic Barrier / Terrifying Visions / Psychic Maelstrom / ...). Carried by `is_psyker` units ' +
      '(Primaris Psyker / Sanctioned Psykers / Astropath). ⚠ NOT in production — see gap-note below.',
  },

  // --- §5 Archetypes (11) — 3 are cross-faction "ally-matrix" archetypes ---
  {
    name: 'Archetypes (11 total)',
    category: 'archetype',
    text: 'Budget 0-1 Archetype (with 0-1 Legacy, 0-2 Traits). Three are CROSS-FACTION ally-matrix ' +
      'archetypes that grant another codex\'s Armory + a shared ability and forbid a Legacy: ' +
      'Brood Brothers (→Genestealer Cults, gain "Ambush" 1pt/W), Gue\'vesa (→Tau, gain "Supporting ' +
      'Fire"; Lasgun→Pulse rifle), Traitor Guard (→CSM, buy Marks of Chaos — see ' +
      '[[project_traitor_guard_bugfix_0608]]). The other 8 are AOP-shuffle / roster-restriction ' +
      'archetypes: Cavalry Regiment (Rough Riders→Troops), Mechanised Company (transports count 50% ' +
      'toward Troops 25%; single Heavy Support), Ogryn Regiment (Bullgryns/Ogryns/Ogryn Brutes→' +
      'Troops, others→Elite), Tempestus Scions (roster restricted to Scion units; Stormtroopers→' +
      'Troops; all gain Objective secured!), Veteran Company (Veterans→Troops; all units must take a ' +
      'Veteran ability), War Hawks (double reserve entry; no Heavy Support), Whiteshields (Conscripts ' +
      'without Platoon Command; 1 other Troop per Conscript Platoon), Jungle Fighters (Move-through/' +
      'Use cover + Infiltrate; -1 Sv). Full AOP-remap data canonical in `archetypes.json`.',
  },

  // --- §5 Legacies (7) — each grants one Legacy Order ---
  {
    name: 'Legacies (7 total — each grants one Legacy Order)',
    category: 'legacy',
    text: 'Uniquely simple shape: each Legacy unlocks ONE Legacy Order for the army (cf. GK Legacies ' +
      'granting one bonus psychic power): Death World→"Burn them out!" / Desert World→"Get around ' +
      'behind them!" / Fortress World→"Suppressive fire!" / Frozen World→"Fire on my command!" / ' +
      'Industrial World→"Mount up!" / Macropol World→"Form firing squad!". The lone exception is ' +
      'Ministorum World, a structural-budget modifier: "The army must select a third Trait" (not an ' +
      'order grant). Canonical in `archetypes.json`.',
  },

  // --- §5 Traits (16) — flat per-unit army-wide upgrades, 3-column pricing ---
  {
    name: 'Traits (16 total — army-wide, 3-column pricing)',
    category: 'trait',
    text: 'Budget 0-2 Traits (3 with Ministorum World). "If a Trait is taken, all models/units in ' +
      'the army must be upgraded with it." Pricing has 3 columns NORMAL/CHARACTER/MC&V with `*` = ' +
      'per Wound/Hull (richest trait-pricing shape migrated — see weapon-abilities.ts §points): ' +
      'Abhuman Auxiliaries / Bionic Improvement / Born Soldiers / Cameleolin / Close Combat ' +
      'Specialists / Combined Regiments (→"must select a 2nd Legacy") / Disciplined Shooters / ' +
      'Fanatism / Hardened Fighters / Heavy Infantry / Heirloom Weapons / Iron Discipline / ' +
      'Jury-rigged repairs / Las Fusilade / Rapid Assault / Shock Troops. Note self-referential ' +
      'budget modifiers: Ministorum World legacy → +1 Trait; Combined Regiments trait → +1 Legacy. ' +
      'Canonical in `archetypes.json`.',
  },

  // --- §6 gap note ---
  {
    name: 'Psychic disciplines + Hymns not wired (ki-ig-psychic-unwired-01)',
    category: 'gap-note',
    text: 'The `.ods` canon carries a full Psikana discipline + a Preacher Hymns system, and IG has ' +
      'psyker units, but `loaders.ts:123` loads only units+armory+archetypes (no psychic JSON; ' +
      '`data/parsed/imperial_guard/psychic/` is empty). Per "básate en el .ods" the canon\'s having ' +
      'these means it is a genuine data gap, not an intentional cut. Larger scope than the armory ' +
      'fix — needs Psikana + Hymns parsed into production JSON and wired into the loader (mirroring ' +
      'GK/Inquisition disciplines). Logged as `ki-ig-psychic-unwired-01`.',
  },
];

/**
 * Structured form of the "Orders" army rule above, for Print View's Officer Orders reference
 * card (player-survey request, 2026-08-29 — "having a cheat sheet for all the imperial guard
 * officer orders you have access to as a part of the print out would be nice"; the request was
 * for THIS mechanic specifically, not the universal Command Phase order-token system every
 * faction uses — see COMMAND_ORDERS/META_ORDERS in coreRules.ts for that one). Text is verbatim
 * from the canonical .ods's own "Orders" sheet (`node scripts/_tmp_ods_dump.cjs "Codex/Imperial
 * Guard 1.04.ods" "Orders"`), not paraphrased from the prose summary above.
 */
export interface OfficerOrderEntry {
  name: string;
  when: string;
  effect: string;
  /** Set only for the 6 Legacy Orders — the Legacy name that unlocks this specific order. */
  legacyGrant?: string;
}

export const IG_INFANTRY_ORDERS: OfficerOrderEntry[] = [
  {
    name: 'Fix bayonets!',
    when: 'When the unit fights in close combat.',
    effect: 'The unit receives +1 Initiative and -1 AP for its melee attacks.',
  },
  {
    name: 'Take cover!',
    when: 'When the unit is selected as a target for a ranged weapon.',
    effect: 'The unit receives a +1 bonus to its armor save. (Can be combined with actual cover)',
  },
  {
    name: 'First rank, fire! Second rank, fire!',
    when: 'When the unit is activated.',
    effect: 'Hot-shot lasguns and lasguns change their type to "Rapid Fire 2".',
  },
  {
    name: 'Overcharge batteries!',
    when: 'When the unit is activated.',
    effect: 'All laser weapons in the unit receive the "Decimate" ability.',
  },
  {
    name: 'Move! Move! Move!',
    when: 'When the unit is activated.',
    effect: 'The unit swaps its command for "Advance" and rolls 2D6 for the additional movement, taking only the highest roll.',
  },
  {
    name: 'Bring it down!',
    when: 'When the unit is activated.',
    effect: 'The unit can re-roll all wound and armor penetration rolls against Monstrous Infantry, Monstrous Creatures and Vehicles.',
  },
  {
    name: 'Forwards, for the Emperor!',
    when: 'When the unit is activated.',
    effect: 'The unit can still fire all weapons after an "Advance" command as if it had used a "Move & Shoot" command.',
  },
  {
    name: 'Get back in the fight!',
    when: 'During the Rally phase. This order can be used by any unit, even if the order itself was not given during the prior Battle round, as long as there is at least one Officer on the table that is not fleeing. Reduce the amount of orders you may give in this round\'s Reinforcement phase by 1.',
    effect: 'The unit loses all Battle shock tokens.',
  },
  {
    name: 'Fall back!',
    when: 'After the unit has used Defensive fire.',
    effect: 'The unit moves up to D6".',
  },
];

export const IG_VEHICLE_ORDERS: OfficerOrderEntry[] = [
  {
    name: 'Gunners, kill on sight!',
    when: 'When the unit is activated.',
    effect: 'The unit can re-roll a single hit, wound or armor penetration roll.',
  },
  {
    name: 'Fire and fade!',
    when: 'When the unit is activated.',
    effect: 'The unit can use its smoke launcher even if it has fired its weapons this turn.',
  },
  {
    name: 'Scorched earth!',
    when: 'After the unit has used ranged weapons.',
    effect: 'The unit can immediately shoot again with a Barrage, Explosive or Flames weapon. The target must be a mission objective marker. If the hit roll is successful, the opponent loses control of it if there are no more of his units on the mission objective.',
  },
];

export const IG_LEGACY_ORDERS: OfficerOrderEntry[] = [
  {
    name: 'Burn them out!',
    when: 'When the unit is activated.',
    effect: 'The unit gains the "Decimate" ability with all weapons that have the "Flames" ability.',
    legacyGrant: 'Death World',
  },
  {
    name: 'Get around behind them!',
    when: 'When the unit is activated.',
    effect: 'The unit can move up to 6", afterwards its order is changed to "Stand & Shoot".',
    legacyGrant: 'Desert World',
  },
  {
    name: 'Suppressive fire!',
    when: 'When the unit is activated.',
    effect: 'If the unit uses a "Stand & Shoot" order and does not split fire its weapons, all ranged weapons in the unit gain the "Suppression" ability.',
    legacyGrant: 'Fortress World',
  },
  {
    name: 'Fire on my command!',
    when: 'When the unit is activated.',
    effect: 'The unit may target an enemy unit engaged in melee with a friendly unit. Any failed hit rolls are instead resolved as hits against the friendly unit. Weapons that have the "Barrage" or "Explosive" ability can\'t be used.',
    legacyGrant: 'Frozen World',
  },
  {
    name: 'Mount off! / Mount up!',
    when: 'When the unit is activated.',
    effect: 'The unit ignores the -1 to hit penalty when disembarking from a transport that moved 6"+. Alternatively, the unit may embark on a transport after using its ranged weapons. The alternative effect can only be used if the unit did not disembark during its activation.',
    legacyGrant: 'Industrial World',
  },
  {
    name: 'Form firing squad',
    when: 'When the unit is activated.',
    effect: 'When firing "Rapid Fire" weapons at a target within 12", the unit may choose which enemy model its ranged attacks are allocated to.',
    legacyGrant: 'Macropol World',
  },
];
