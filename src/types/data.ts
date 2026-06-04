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
  /** Where the keyword is looked up. Only 'unit' (the model's own mark/keywords) is wired today. */
  scope: 'unit' | 'force' | 'roster';
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
}
