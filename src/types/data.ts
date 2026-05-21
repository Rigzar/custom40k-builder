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
}

export type ConstraintType =
  | 'mark' | 'one' | 'every' | 'per_n' | 'fixed_max'
  | 'armory_access' | 'veteran' | 'veteran_req' | 'unique_upgrade';

export interface Constraint {
  type: ConstraintType;
  per_n?: number;
  count_per_n?: number;
  max?: number;       // for fixed_max; also for veteran when "up to N veteran abilities"
}

export interface OptionGroup {
  header: string;
  constraint: Constraint;
  choices: Choice[];
  inline_pts: number | null;
  variant_link: string | null;
  is_unique_per_army: boolean;
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
  is_vehicle: boolean;
  is_character: boolean;
  is_monster: boolean;
  is_psyker: boolean;
  is_priest?: boolean;
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
