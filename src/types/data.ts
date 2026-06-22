export interface StatBlock {
  M?: string; WS?: string; BS?: string; S?: string; T?: string;
  W?: string; I?: string; A?: string; LD?: string; SV?: string;
  FRONT?: string; SIDE?: string; REAR?: string; HP?: string;
}

export interface Model {
  name: string;
  points: number;
  min: number;
  max: number;
  stats: StatBlock;
  /**
   * Set when this model's legal size range is DISJOINT: "{min} or {squad_min}-{max}" (ods-
   * verbatim "No." column), where `min` is its own distinct solo/character configuration, not
   * the bottom of a continuous squad range — e.g. Necrons Lychguard's "1 or 4-10" (a lone
   * Lychguard becomes a character per its own "Varguard" ability; sizes 2-3 are illegal). The
   * stepper (UnitCard.tsx) must jump min↔squad_min directly, skipping the gap; a validator
   * blocks any size that still falls inside it (e.g. army JSON pasted/edited externally).
   */
  squad_min?: number;
  /**
   * Dynamic ratio cap for a secondary model group, e.g. CSM Traitor Guard's "For each 10
   * [Traitor Guardsman] models you may select 1 [Chaos Ogryn]" — `ratio_per_n: 10`,
   * `ratio_of: "Traitor Guardsman"`. The stepper's effective max is
   * min(max, floor(modelSizes[ratio_of] / ratio_per_n)), not just the static `max` field.
   * Same shape as Accursed Cultists' "Per 5 Accursed Cultist models you may set up 1 Torment".
   */
  ratio_per_n?: number;
  ratio_of?: string;
}

export interface Weapon {
  name: string;
  range: string;
  type: string;
  s: string;
  ap: string;
  d: string;
  abilities: string;
}

export interface Choice {
  name: string;
  points: number;
  /** Abilities that are only active when this choice is selected. */
  abilities?: string[];
  /** Stat/type/ability effects active only while this choice is selected (ki-parser-02). */
  effect?: OptionEffect;
  /**
   * Promotes the model to a `variant_models` entry when THIS SPECIFIC choice (not the whole
   * group) is selected — e.g. Necrons Cryptek's 5-choice "one of the following" specialisation
   * group, where only "Dynasty Scion" swaps the profile (the other 4 are plain ability grants).
   * Distinct from `OptionGroup.variant_link`, which is for single-toggle promotion groups
   * (choices:[], inline_pts set, e.g. Lord→Overlord) with no sibling choices to exclude.
   * Must match a unit.variant_models[].name. getActiveVariant() (engine/points.ts) checks both.
   */
  variant_link?: string;
  /**
   * True when ONLY 1 model army-wide may take this specific choice — e.g. Necrons Cryptek's
   * "May be upgraded to one of the following. Each specialisation is unique per army": all 5
   * named choices (Chronomancer/Dynasty Scion/Plasmancer/Psychomancer/Technomancer) are
   * independently capped at 1, not just the whole group at 1 (a player CAN field multiple
   * Crypteks, just never two with the SAME specialisation). Distinct from
   * `OptionGroup.is_unique_per_army`, which caps the whole group/unit, not a named choice
   * within it. Checked by a validators.ts cross-army pass, keyed on (unitName, choice.name).
   */
  unique_per_army?: boolean;
}

/**
 * Effects an option confers on the unit while it is selected (ki-parser-02). Carries the
 * rules consequences the header text only states in prose — the parser captures the points
 * and the selection, but not the stat/type/ability change a wargear option grants.
 */
export interface OptionEffect {
  /** Special rules granted while active, e.g. ["Deep strike"] — only when the datasheet states it. */
  grants_abilities?: string[];
  /** Stat deltas applied to the unit's models while active, e.g. M +6 (Daemon Prince + wings). */
  stat_mod?: { stat: keyof StatBlock; delta: number }[];
  /**
   * Unit types ADDED while active. Additive, never a replacement: a model "gains" a type and
   * keeps the ones it had (Core Rules: a model may have "one or more unit types"). Use this for the
   * datasheet verb "gain the X Unit type". E.g. Daemon Prince + wings → "Monstrous Creature, Jump
   * pack infantry".
   */
  adds_unit_types?: string[];
  /**
   * REPLACES the model's whole unit-type line while active — for the datasheet verb "change unit
   * type TO X" (distinct from the additive "gain X type"). E.g. Blood Claws + jump packs: Infantry
   * → "Jump Pack Infantry"; Assault Squad − jump packs: "Jump Pack Infantry" → "Infantry". The verb
   * on each datasheet decides which field to use — never assume from memory.
   */
  set_unit_type?: string;
  /**
   * Free weapon(s) granted while active, by name — looked up in the faction's
   * `armory_general.weapons` for their full profile. For the datasheet verb "gains a/the X"
   * where X is a weapon, when embedded in a compound sentence alongside other effects
   * (e.g. "Chaos Space Marine bike": "+6\" Movement, +1 Toughness, +1 Wound, a Combi-bolter
   * and the unit type 'Bike'") — too irregular for the generic isGrantWeapon/
   * extractGrantedWeaponName text-pattern extraction.
   */
  grants_weapons?: string[];
}

export type ConstraintType =
  | 'mark' | 'one' | 'every' | 'per_n' | 'fixed_max'
  | 'armory_access' | 'veteran' | 'veteran_req' | 'unique_upgrade';

export interface Constraint {
  type: ConstraintType;
  per_n?: number;
  count_per_n?: number;
  max?: number;       // for fixed_max; also for veteran when "up to N veteran abilities"
  /** If true, a selection is mandatory — builder warns if nothing is chosen. */
  required?: boolean;
}

/**
 * A keyword-based availability gate on an option group, modelled on the BattleScribe/BSData
 * condition primitive (instanceOf / notInstanceOf against a keyword/category). It replaces
 * ad-hoc header-text regex: the option group is only available when the unit (or, later, its
 * force/roster) matches — or does NOT match — the named keyword.
 */
export interface OptionCondition {
  /** instanceOf = available only when the keyword is present; notInstanceOf = only when absent. */
  type: 'instanceOf' | 'notInstanceOf';
  /**
   * Where the keyword is looked up.
   *   'unit'      — the model's own mark / keywords[]
   *   'force'     — the host army's faction name
   *   'archetype' — the army's selected archetype name
   *   'roster'    — reserved for future use
   */
  scope: 'unit' | 'force' | 'roster' | 'archetype';
  /** The keyword/category matched — e.g. 'Khorne' (a Chaos Mark), a faction, or a unit type. */
  keyword: string;
}

export interface OptionGroup {
  header: string;
  constraint: Constraint;
  choices: Choice[];
  inline_pts: number | null;
  variant_link: string | null;
  is_unique_per_army: boolean;
  /**
   * Optional keyword gate: this option group is only available (and only valid) when the
   * condition holds. Used for cross-option dependencies the header text only states in prose,
   * e.g. "If no Mark of Khorne is taken …" → { type: 'notInstanceOf', scope: 'unit', keyword: 'Khorne' }.
   */
  available_if?: OptionCondition;
  /**
   * Names of the weapon(s) this group removes when one of its choices is selected
   * ("Each model's X may be replaced" / "May replace its X" → ["X"]). Structures the
   * dropped item the header text only names. Set ONLY for unit-wide swaps (every model,
   * or a single-model/vehicle "its X"). Subset swaps ("one model's X", per_n/fixed_max)
   * leave this UNSET so both old and new weapons remain on the datasheet, per the literal
   * datasheet text. The resolver drops these weapons whenever the group has a selection.
   */
  replaces?: string[];
  /**
   * Effects active when this group has a selection — used for inline-toggle groups
   * (choices:[], inline_pts set) that confer stat/type/ability changes, e.g. Daemon Prince
   * wings (+6" M, gains "Jump pack infantry"). For groups with named choices, prefer the
   * choice-level `effect`. (ki-parser-02)
   */
  effect?: OptionEffect;
  /**
   * When set, this option applies only to models of this group name (e.g. "Dishonored"), or to
   * the union of several groups (e.g. Kroot Farstalkers' "Any model" swap, scoped to
   * ["Farstalker", "Kill-Broker"] since Kroot Hounds never carry the swapped weapon). The
   * selectable maximum is capped by the sum of modelSizes[...] for the listed group(s), in
   * addition to the per_n calc for per_n groups. SOURCE: option header text says "N [ModelGroup]
   * may swap…" / "Any model may swap…" (scoped to whichever groups actually carry the item) —
   * each name must match a unit.models[].name.
   */
  applies_to_model?: string | string[];
  /**
   * Per_n groups only: overrides the per_n DIVISOR to the sum of modelSizes[...] for the listed
   * group(s), instead of the unit's total `size`. Needed when the datasheet's "for every N X
   * models" explicitly excludes a model group from the count (e.g. Kroot Farstalkers' "for every
   * 5 NON-Kroot-hound models" — the divisor must exclude Kroot Hounds even though `size` doesn't).
   * Distinct from `applies_to_model`, which caps who can RECEIVE the swap, not what's counted.
   */
  per_n_pool?: string[];
  /**
   * True when an INLINE option (choices:[], inline_pts set) is priced PER MODEL — the datasheet
   * verb is "…for +X points per model" / "the whole squad may be equipped with … per model". The
   * cost then scales with unit size (inline_pts × size), not a single flat charge. Set ONLY when
   * the header literally says "per model"; flat one-off inline upgrades (e.g. promote one Sergeant)
   * leave this UNSET. Choice-based "every-model" swaps don't need it (their qty already = size).
   */
  per_model?: boolean;
}

export interface Unit {
  name: string;
  slot: string;
  models: Model[];
  variant_models: Model[];
  equipped_with: string;
  weapons: Weapon[];
  option_groups: OptionGroup[];
  abilities: string[];
  unit_type: string;
  keywords: string[];
  /**
   * Innate armour-class keyword (e.g. 'Terminator', 'Cataphractii') for units whose base profile
   * ALREADY bakes in an armour (Sv/T/A + Crux/invuln). A bought armour then SWAPS this profile rather
   * than stacking on top of it — its shared +stat bonuses are not re-applied. See ki-csm-armourslot-01.
   */
  armourKeyword?: string;
  is_vehicle: boolean;
  is_character: boolean;
  is_monster: boolean;
  is_psyker: boolean;
  is_priest?: boolean;
  is_cult_initiate?: boolean;
  uses_pacts?: boolean;
  is_squadron?: boolean;
  has_armory_access: boolean;
  champion_has_armory: boolean;
  has_veteran_abilities: boolean;
  veteran_required: boolean;
  /** Max veteran abilities this unit may have (default 2 if unspecified) */
  veteran_max?: number;
  locked_mark: string | null;
  advisor: boolean;
  default_size: number;
  min_cost: number;
  /**
   * Army-wide gate (mirrors `ArmoryItem.requires_army_item`): the unit is only selectable if
   * SOME unit anywhere in the roster already has the named item in its armory. Models the
   * "Only for armies with an <X> Inquisitor" pattern (e.g. Inquisition's "Ordo Hereticus/Malleus/
   * Xenos Warband" — only fieldable once an Inquisitor has picked the matching Ordo allegiance).
   * Same `rosterArmoryItemNames` roster scan and `isArmyItemGateBlocked` check as the armory gate,
   * applied to unit-list filtering instead of armory-item filtering.
   *
   * Examples:
   *   requires_army_item: "Ordo Hereticus"  → only if some unit has "Ordo Hereticus" in armory
   *   requires_army_item: "Ordo Malleus"
   *   requires_army_item: "Ordo Xenos"
   */
  requires_army_item?: string | null;
  /**
   * Gates the unit to a specific engagement type — for units that occupy a normal AOP slot
   * (not 'Lords of War') but still belong to a supplement only active in that engagement.
   * Example: CSM "War Dog" — Escalation.ods's own "Elite" ability text ("Chaos armies may
   * select units of War Dogs as an Elite choice") gives it an Elite-slot pick instead of the
   * normal Lords of War slot, but it remains an Escalation-supplement unit and the supplement
   * (per escalation.md §1) is only active in Epic Battle. Without this gate the unit would be
   * pickable in Skirmish/Pitched Battle too, where Escalation content doesn't exist.
   */
  requires_engagement?: 'skirmish' | 'pitched' | 'epic' | null;
}

export interface WeaponProfile {
  name: string;
  range: string;
  type: string;
  s: string;
  ap: string;
  d: string;
  abilities: string;
}

export interface ArmoryItem {
  name: string;
  term_compat: boolean;
  gravis_compat?: boolean;
  /**
   * Armour-gate whitelist — keyword-model replacement for `term_compat`/`gravis_compat`.
   * Lists the armour keywords whose gate this item passes, e.g.:
   *   ["Terminator"]          → passes the ᵀ-gate (Terminator + Cataphractii + Tartaros)
   *   ["Gravis"]              → passes the ᴳ-gate
   *   ["Terminator","Gravis"] → passes both gates
   * When present, helpers isItemTermCompat() / isItemGravisCompat() in keywords.ts use this
   * field instead of the legacy booleans. Non-CSM/SM factions keep working via the boolean
   * fallback until they are migrated.
   */
  armour_compat?: string[];
  /**
   * Armour-class keyword (e.g. 'Terminator', 'Cataphractii'). Items that confer a full
   * armour profile occupy the model's single armour slot — only one may be active, and its
   * Sv/inv/stat profile overrides rather than stacks. See _engine.md §10 (single-slot primitive).
   */
  armourKeyword?: string;
  p_unit?: number | null;
  p_char?: number | null;
  /** veteran = counts toward veteran_max slot; vehicle = only for vehicle units; null = regular */
  category?: 'veteran' | 'vehicle' | null;
  /** Per-wound/HP cost for veteran abilities taken by vehicles or monsters (null = not available to them). */
  p_veh?: number | null;
  /** Single-profile weapons populate these directly. */
  range?: string; type?: string; s?: string; ap?: string; d?: string; abilities?: string;
  /** Multi-profile weapons (e.g. Combi-weapons, Plasma Gun) store each mode here. */
  profiles?: WeaponProfile[];
  desc?: string;
  /**
   * Structured rules effect when this armory item is bought — used for the parts the description
   * text can't express, specifically a UNIT-TYPE change ("gains the unit type 'Bike' / 'Monstrous
   * Infantry'"). Stat deltas (+1 T, +6" M) and quoted abilities ("Jump pack", "Deepstrike") are
   * still parsed from `desc` by equipMods; this carries only what that can't. Applied ADDITIVELY and
   * de-duplicated against what the model already has (a type/ability already present is not re-added).
   */
  effect?: OptionEffect;
  /**
   * Keyword conditions for this item — mirrors BattleScribe's instanceOf/notInstanceOf conditions.
   * The item is available only when the buyer's effectiveKeywords() contains AT LEAST ONE of these.
   * (OR semantics: ["Cataphractii", "Terminator"] = available to either armour type.)
   *
   * Keywords come from effectiveKeywords(unit, mark, boughtArmour) which combines:
   *   - unit.keywords          (faction, role: "Chaos Space Marine", "Psyker", "Priest", "Warpsmith"…)
   *   - unit_type parsed       ("Infantry", "Character Model", "Vehicle"…)
   *   - selectedMark           ("Mark of Nurgle", "Mark of Khorne"…)
   *   - boughtArmourKeywords   ("Cataphractii", "Terminator", "Gravis"…)
   *
   * Examples:
   *   requires_keywords: ["Infantry"]              → "Infantry only" / "Only for infantry"
   *   requires_keywords: ["Cataphractii"]          → "Only for models in Cataphractii armor"
   *   requires_keywords: ["Cataphractii","Terminator"] → "…Cataphractii or Terminator armor"
   *   requires_keywords: ["Psyker"]                → "Only for Sorcerers" (Sorcerer has Psyker kw)
   *   requires_keywords: ["Priest"]                → "Only for Dark Apostles"
   *   requires_keywords: ["Warpsmith"]             → "Only for Warpsmiths"
   */
  requires_keywords?: string[];

  /**
   * Army-wide gate (distinct from `requires_keywords`, which is unit-scoped): the item is only
   * available if SOME unit anywhere in the roster already has the named item in its armory.
   * Models the "<X> grants the model and further units from this codex access to <X> equipment"
   * pattern (e.g. Inquisition's "Ordo Hereticus/Malleus/Xenos" — picking one Ordo on any
   * Inquisitor unlocks that Ordo's equipment army-wide). Engine checks roster-wide membership,
   * not the current unit's own keywords/attributes.
   *
   * Examples:
   *   requires_army_item: "Ordo Hereticus"  → only if some unit has "Ordo Hereticus" in armory
   *   requires_army_item: "Ordo Malleus"
   *   requires_army_item: "Ordo Xenos"
   */
  requires_army_item?: string | null;
}

export interface Armory {
  name: string;
  weapons: ArmoryItem[];
  equipment: ArmoryItem[];
  daemon_weapons: ArmoryItem[];
}

export interface Archetype { name: string; desc: string; }
export interface Legacy {
  name: string;
  desc: string;
  /** Key into armory_legions that this legacy grants access to. */
  armory_key?: string | null;
  /**
   * Faction slug this legacy grants the army access to as OWN units (mirrors
   * ArchetypeRule.alliedFaction, e.g. Legacy of the Alien Hunters → 'inquisition').
   * Injected the same way as archetype unit-grants — shares AOP/slots, no [Allied] badge.
   */
  grants_faction?: string | null;
}

export interface Trait {
  name: string;
  desc: string;
  pts_unit: string | null;
  pts_char: string | null;
  pts_monster: string | null;
  pts_veh: string | null;
  /** True for traits whose description says the army must select a second Legacy. */
  enables_second_legacy?: boolean;
  /**
   * Extra veteran-ability/Doctrina-Imperative slots this trait grants while active — e.g.
   * AdMech's "Veteran Maniple": "Any unit with the option to purchase a Doctrina Imperitive
   * may purchase a second one." Only applies to units with an explicit `veteran_max` already
   * set (the Doctrina-eligible roster) — generic units defaulting to the fallback of 2 don't
   * have "the option to purchase a Doctrina Imperative" at all, so the bonus doesn't apply.
   */
  veteran_max_bonus?: number;
}

export interface Power {
  name: string;
  type?: string; range?: string; target?: string;
  cast_value?: string; effect?: string; duration?: string; complexity?: string;
}

export interface DaemonkinEntry {
  name: string;
  [key: string]: string;
}

export interface DaemonkinGod {
  description: string;
  items: DaemonkinEntry[];
}

export interface AlliedFaction {
  slot_to_units: Record<string, string[]>;
  units: Record<string, Unit>;
}

export interface FactionData {
  faction: string;
  slot_to_units: Record<string, string[]>;
  units: Record<string, Unit>;
  armory_general: Armory;
  armory_marks: Record<string, Armory>;
  armory_legions: Record<string, Armory>;
  archetypes: Archetype[];
  legacies: Legacy[];
  traits: Trait[];
  animosity: Record<string, string[]>;
  disciplines: Record<string, Power[]>;
  pacts: Power[];
  prayers: Power[];
  daemonkin: Record<string, DaemonkinGod>;
  /** Allied faction data keyed by faction slug (e.g. 'chaos_daemons') */
  allied?: Record<string, AlliedFaction>;
  /** Allied factions always available regardless of archetype (e.g. GK + Inquisition) */
  base_allied?: string[];
  /**
   * Factions whose units are included "as if part of the army's own roster" by an always-on
   * codex/special rule (no [Allied] badge, share AOP/slots) — e.g. Grey Knights "Demon Hunters"
   * and Adepta Sororitas "Witch hunters" both grant native Inquisition access (Informacion/
   * Inquisition.ods, Index sheet, Designer's note: "Grey Knights, Adepta Sororitas, and Space
   * Marine armies with the Alien Hunters trait may include Inquisition units as if they were
   * part of their own army"). Distinct from `base_allied` (true allied detachment, [Allied]
   * badge shown, counts against ally limits) and `Legacy.grants_faction` (only fires when that
   * specific Legacy is selected). Injected via the same own-army mechanism as grants_faction
   * (injectArchetypeFaction / SlotPanel ownGrantedFaction — mirrors v0.56 Alien Hunters fix).
   */
  intrinsic_allies?: string[];
}
