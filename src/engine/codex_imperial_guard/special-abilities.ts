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
