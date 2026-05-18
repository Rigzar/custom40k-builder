export type EngagementType = 'skirmish' | 'pitched' | 'epic';
export type Mark = 'Undivided' | 'Khorne' | 'Nurgle' | 'Slaanesh' | 'Tzeentch';

export interface ArmorySelection {
  id: string;          // unique per selection
  itemName: string;
  source: string;      // armory name
  section: 'weapons' | 'equipment' | 'daemon_weapons';
  points: number;
  isCharacter: boolean;
}

export interface TraitSelection {
  name: string;
  points: number;
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
}

export interface ArmyState {
  faction: string;
  engagement: EngagementType;
  pointLimit: number;
  hqMark: Mark;
  archetype: string;
  legacy: string;
  legacy2: string;
  traitPool: string[];
  army: RosterEntry[];
}
