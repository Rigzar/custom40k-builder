export type EngagementType = 'skirmish' | 'pitched' | 'epic';
export type Mark = 'Undivided' | 'Khorne' | 'Nurgle' | 'Slaanesh' | 'Tzeentch';

export interface ArmorySelection {
  id: string;          // unique per selection
  itemName: string;
  source: string;      // armory name
  section: 'weapons' | 'equipment' | 'daemon_weapons';
  points: number;
  isCharacter: boolean;
  /** For daemon-weapon traits that modify a weapon — which weapon they apply to. */
  targetWeapon?: string;
}

export interface TraitSelection {
  name: string;
  points: number;
  perWound?: boolean;
}

export interface PowerSelection {
  disciplineName: string;
  powerName: string;
}

// optionQty[groupIndex][choiceIndex] = qty; [groupIndex]['__inline'] = bool (1/0)
export type OptionQty = Record<number, Record<string | number, number>>;

export interface RosterEntry {
  id: string;
  unitName: string;
  slot: string;
  /** Allied faction slug (e.g. 'chaos_daemons'). Undefined = primary faction. */
  factionSource?: string;
  size: number;
  mark: Mark | null;
  optionQty: OptionQty;
  armory: ArmorySelection[];
  /**
   * Auto-populated from army traitPool by the store. DO NOT edit directly.
   * For units with effective_max < army unit-trait count, stores the chosen subset.
   */
  traits: TraitSelection[];
  /** Per-unit override: which army unit-traits this unit takes (conflict resolution). */
  traitChoice?: string[];
  powers: PowerSelection[];
  prayers: string[];
  pacts: string[];
  /**
   * Black Crusade trait: designates this HQ as the champion bearing all four
   * Chaos god marks simultaneously (Khorne, Nurgle, Slaanesh, Tzeentch).
   * Only one HQ per army may be designated.
   */
  blackCrusadeHQ?: boolean;
  /** User-defined display name for this unit (overrides the default unit name). */
  customName?: string;
  /** ID of the roster unit this character is pre-assigned to join at deployment. */
  joinedToUnit?: string | null;
  /**
   * Imperial Guard "Platoon" grouping: ID of the Platoon Command Squad this unit is attached
   * to. PCS + its linked Infantry Squads / Conscript Infantry Platoon / Special Weapon Squad /
   * Heavy Weapon Squad together occupy a single Troops slot, not one each (confirmed by rules
   * owner 2026-06-20). Null/undefined = not linked (counts at its own normal slot).
   */
  platoonId?: string | null;
  /** Gue'vesa archetype: count of models in this unit swapping their Lasgun for a Pulse rifle
   * (+3 pts/model, ods-verbatim). Capped at `size`. */
  gueVesaLasgunSwaps?: number;
  /** Gue'vesa archetype: count of models swapping their Hot-shot lasgun for a Pulse rifle
   * (+2 pts/model, ods-verbatim). Capped at `size`. */
  gueVesaHotshotSwaps?: number;
  /**
   * Mixed Warband trait: locks this unit to a single legacy armory key.
   * When two legacies are active and Mixed Warband is in the trait pool,
   * each unit may only purchase items from ONE legacy armory.
   * Null/undefined = no lock yet chosen.
   */
  legacyArmoryLock?: string | null;
  /**
   * Per-model-group sizes for units with multiple model types (e.g. Jakhals:
   * { "Jakhal": 8, "Jakhal Pack Leader": 1, "Dishonored": 2 }).
   * When set, overrides the flat `size` field for display and cost calculation.
   * Keys = model.name from unit.models[]. Fixed groups (min===max) are always
   * their min value. `size` is kept in sync as the sum of all group sizes.
   */
  modelSizes?: Record<string, number>;
  /**
   * Yngir archetype (Necrons): "One C'tan shard (any kind) counts as an HQ selection. The model
   * gains +1 Strength, Toughness, Initiative, Attacks and a 2+ armor save... It costs an
   * additional +85 points." (ods-verbatim, Army Customisation). Per-instance toggle since only
   * ONE C'tan Shard unit in the whole army may take the upgrade, even with multiple Shards
   * fielded — enforced by a uniqueness validator, same shape as the existing
   * `is_unique_per_army` variant-promotion check.
   */
  ctanYngirUpgrade?: boolean;
}

export interface ArmyState {
  armyName: string;
  faction: string;
  engagement: EngagementType;
  pointLimit: number;
  hqMark: Mark;
  archetype: string;
  legacy: string;
  legacy2: string;
  traitPool: string[];
  army: RosterEntry[];
  alliedFaction?: string;
}
