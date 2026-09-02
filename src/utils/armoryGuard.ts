import type { Unit, OptionGroup, FactionData } from '../types/data';
import type { RosterEntry, ArmorySelection } from '../types/army';
import { findArmoryItem } from '../engine/resolver';

/**
 * Gate for switching OFF an upgrade that is the only thing granting a unit Armory access.
 *
 * Reported on Discord 2026-08-16: promoting a Devastator Sergeant to a Veteran gives him the
 * Armory; buying weapons and then turning him back into a plain Sergeant left the weapons on his
 * profile. Nothing was granting them any more — the datasheet only gives access to the Veteran —
 * yet they stayed, and kept being charged for.
 *
 * 61 datasheets across 9 factions reach the Armory this way (every Space Marine squad with a
 * Veteran Sergeant, plus the Ork, Chaos, Sororitas, Dark Eldar, Genestealer Cults, Imperial Guard,
 * Votann and Tyranid equivalents), so this cannot live in one component.
 *
 * Mirrors `engagementGuard`: the store prunes unconditionally so no path can leave illegal gear
 * behind, and the UI calls `armoryItemsLostByDeselecting` first to confirm before destroying a
 * purchase the player paid for.
 */

/**
 * True when this specific option group is what grants the unit its Armory access.
 *
 * Same shape as the `armoryGatedByVariant` test UnitCard uses to decide where to put the Armory
 * button — a variant promotion whose header mentions the Armory, or any variant promotion at all
 * on a unit whose access is champion-only. Verified across every datasheet in the game: no unit has
 * two variant groups while champion_has_armory is set, and no unit is granted Armory access by a
 * non-variant option group, so this cannot misfire on an unrelated upgrade.
 */
export function isArmoryGateGroup(unit: Unit, group: OptionGroup | undefined): boolean {
  if (!group?.variant_link) return false;
  return /armory/i.test(group.header ?? '') || !!unit.champion_has_armory;
}

/**
 * Equipment a model may take "regardless of whether it has access to the armory" (Space Marines'
 * Legacy of the Alien Hunters). It is stored as an ordinary Armory selection but does not depend on
 * access, so losing the upgrade must not take it away.
 */
const ACCESS_FREE_ITEMS = new Set(['Special ammunition']);

/**
 * True for a Veteran Ability selection (Furious charge, Tank hunter, ...). These are gated by
 * `unit.has_veteran_abilities`/`veteran_max`, entirely independent of Armory access (confirmed in
 * ArmoryModal.tsx's `filterByUnitType`: veteran items are shown whenever `armoryVetEnabled`, with
 * no `has_armory_access` check at all) — a unit can have veteran abilities without ever having
 * Armory access (Havocs, Chaos Space Marines squads, Warptalons, ...). Without `data` (e.g. a
 * caller that doesn't have FactionData in scope), treat as NOT a veteran item — the pre-existing,
 * more conservative behaviour — rather than guess.
 */
function isVeteranSelection(sel: ArmorySelection, data: FactionData | undefined): boolean {
  return !!data && findArmoryItem(data, sel)?.category === 'veteran';
}

/**
 * The selections that stop being legal if `gi` is switched off. Empty when the unit keeps access
 * some other way (`has_armory_access` — a squad where every model can buy, e.g. Combat Engineers
 * or Rough Riders, which also happen to offer a Veteran upgrade).
 */
export function armoryItemsLostByDeselecting(
  entry: Pick<RosterEntry, 'armory'>, unit: Unit, gi: number, data?: FactionData,
): ArmorySelection[] {
  if (unit.has_armory_access) return [];
  if (!isArmoryGateGroup(unit, unit.option_groups[gi])) return [];
  return (entry.armory ?? []).filter(a => !ACCESS_FREE_ITEMS.has(a.itemName) && !isVeteranSelection(a, data));
}

/**
 * Repair for lists SAVED before the prune existed: the upgrade is off, yet the entry still carries
 * items only the upgrade could have bought — and is still being charged for them. Loading such a
 * list must not silently keep charging, so `importRoster` runs every entry through this.
 *
 * Returns the entry unchanged when there is nothing to repair, so loading a healthy list is a
 * no-op and object identity is preserved.
 */
export function repairOrphanedArmory(entry: RosterEntry, unit: Unit, data?: FactionData): RosterEntry {
  if (unit.has_armory_access || !(entry.armory?.length)) return entry;
  const gateGi = unit.option_groups.findIndex(g => isArmoryGateGroup(unit, g));
  if (gateGi < 0) return entry;
  if (entry.optionQty?.[gateGi]?.['__inline']) return entry;      // upgrade still selected
  const kept = entry.armory.filter(a => ACCESS_FREE_ITEMS.has(a.itemName) || isVeteranSelection(a, data));
  return kept.length === entry.armory.length ? entry : { ...entry, armory: kept };
}
