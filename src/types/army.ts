export type EngagementType = 'skirmish' | 'pitched' | 'epic';
export type Mark = 'Undivided' | 'Khorne' | 'Nurgle' | 'Slaanesh' | 'Tzeentch';

export interface ArmorySelection {
  id: string;          // unique per selection
  itemName: string;
  source: string;      // armory name
  section: 'weapons' | 'equipment' | 'daemon_weapons';
  /**
   * Base, UNMULTIPLIED rate when `scaling` is set (the per-model/per-wound price straight from
   * the armory data); the final charged cost is computed live from current item.size/wounds —
   * see liveArmoryPoints() in points.ts. Plain flat cost (the old always-snapshot behaviour)
   * when `scaling` is unset.
   */
  points: number;
  /**
   * Veteran abilities ("paid for every model in the unit and per Wound or Hull point of the
   * model") and per-squadron vehicle upgrades scale with the unit's CURRENT size/wounds, not
   * the size at the moment the item was bought — without this, growing/shrinking the squad
   * after buying one of these left the stored cost stale (e.g. add at size 1 then grow to 3
   * keeps charging for 1). 'perWound': points × wounds-or-hull-per-model × item.size.
   * 'perModel': points × item.size (no wound scaling — flat per-vehicle squadron upgrades).
   */
  scaling?: 'perWound' | 'perModel';
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
  /**
   * Second-level nested ally, e.g. when factionSource = 'chaos_space_marines' (the player's
   * Allied Detachment) and that detachment's OWN archetype (e.g. Plaguehost) intrinsically
   * grants it Chaos Daemons units — nestedFaction = 'chaos_daemons'. factionSource still names
   * the scope owner (so this unit groups/counts under the ally's own roster), nestedFaction only
   * redirects where the unit's stat data is read from.
   */
  nestedFaction?: string;
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
  /**
   * Allied Detachment's OWN Army Customisation — independent of the primary faction's
   * archetype/legacy/traitPool. Core Rules: "Allies may select their own Army Customisation
   * options." Only applies to units with `item.factionSource === alliedFaction`. Scoped down
   * from the primary's full feature set: a single Legacy slot (no 2nd-legacy-via-trait unlock)
   * and generic trait costing only (no Holy Trinity / Black Crusade style legacy-specific
   * auto-behaviour, which are CSM-primary-only signature mechanics).
   */
  alliedArchetype?: string;
  alliedLegacy?: string;
  alliedTraitPool?: string[];
}
