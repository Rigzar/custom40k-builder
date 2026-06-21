/**
 * Imperial Guard "Platoon" grouping.
 *
 * SOURCE (rules-owner clarification, 2026-06-20, re: ki-45b):
 *   "The following units can/must be selected for each Platoon Command Squad. All selections
 *    including Platoon Command Squad occupy a single Troops slot and count as Troops:
 *    2-5 Infantry Squads / 0-1 Conscript Infantry Platoon / 0-2 Special Weapon Squads /
 *    0-3 Heavy Weapon Teams."
 *
 * Special Weapon Squad's and Heavy Weapon Squad's PRINTED slot (per the Index sheet) is Elites
 * and Heavy Support respectively — they only re-slot to Troops, and only stop costing their own
 * slot, while explicitly linked to a Platoon Command Squad via `RosterEntry.platoonId`. Infantry
 * Squad and Conscript Infantry Platoon are already Troops-slotted; linking them just folds them
 * into their PCS's single slot instead of each costing their own.
 */

import type { RosterEntry } from '../../types/army';

export const PLATOON_ANCHOR_UNIT = 'Platoon Command Squad';

export const PLATOON_MEMBER_LIMITS: Record<string, { min: number; max: number }> = {
  'Infantry Squad': { min: 2, max: 5 },
  'Conscript Infantry Platoon': { min: 0, max: 1 },
  'Special Weapon Squad': { min: 0, max: 2 },
  'Heavy Weapon Squad': { min: 0, max: 3 },
};

export function isPlatoonMemberUnit(unitName: string): boolean {
  return unitName in PLATOON_MEMBER_LIMITS;
}

/** True when `item` is linked to a Platoon Command Squad that still exists in `army`
 * (defensive — a stale link survives if its PCS was later removed, same convention as
 * `joinedToUnit`, which also isn't actively cleaned up on removeUnit). */
export function isLinkedToExistingPlatoon(item: RosterEntry, army: RosterEntry[]): boolean {
  if (!item.platoonId) return false;
  return army.some(e => e.id === item.platoonId && e.unitName === PLATOON_ANCHOR_UNIT);
}

/** Slot override for platoon members linked to a live PCS — Troops instead of their printed
 * slot. Returns `baseSlot` unchanged for the PCS itself, unlinked members, or non-members. */
export function applyPlatoonSlotOverride(item: RosterEntry, army: RosterEntry[], baseSlot: string): string {
  if (!isPlatoonMemberUnit(item.unitName)) return baseSlot;
  return isLinkedToExistingPlatoon(item, army) ? 'Troops' : baseSlot;
}

/** For AOP Troops-slot counting only: a platoon member linked to a live PCS contributes 0 —
 * it's folded into its anchor's single slot instead of costing its own. The PCS itself and
 * unlinked members are unaffected (count normally, same as any other roster entry). */
export function countsTowardOwnSlot(item: RosterEntry, army: RosterEntry[]): boolean {
  if (!isPlatoonMemberUnit(item.unitName)) return true;
  return !isLinkedToExistingPlatoon(item, army);
}

/** Roster entries eligible as link targets for a "↳ Platoon" picker — every Platoon Command
 * Squad currently in the main army (allied PCS, if any, are out of scope: a platoon is a
 * main-faction structure). */
export function listPlatoonAnchors(army: RosterEntry[]): RosterEntry[] {
  return army.filter(e => e.unitName === PLATOON_ANCHOR_UNIT && !e.factionSource);
}
