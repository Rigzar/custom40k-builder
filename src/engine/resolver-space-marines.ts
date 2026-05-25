import type { Unit } from '../types/data';
import type { FactionData } from '../types/data';
import type { ArmyState } from '../types/army';
import type { RosterEntry } from '../types/army';
import type { ResolvedProfile, FactionResolverFn } from './resolver';

/**
 * Space Marines faction resolver.
 *
 * Applies SM-specific profile overrides on top of the base resolved profile.
 * Currently a passthrough — rules to be filled in after unit audit.
 *
 * Known planned rules:
 *  - Black Templars legacy: unlock Crusader prayers for Chaplains
 *  - Blood Angels legacy: Red Thirst/Black Rage interactions
 *  - Dark Angels legacy: Deathwing/Ravenwing flavor notes
 *  - Legion archetype: auto-inject allied HH unit notes
 */
export const smResolve: FactionResolverFn = (
  base: ResolvedProfile,
  _item: RosterEntry,
  _unit: Unit,
  _state: ArmyState,
  _data: FactionData,
): ResolvedProfile => {
  // Passthrough until SM-specific rules are implemented.
  return base;
};
