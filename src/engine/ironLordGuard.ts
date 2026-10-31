/**
 * Legacy of the Iron Lord (Chaos Space Marines 1.11, Army Customisation), verbatim:
 *   "The army may include a single vehicle Heavy Support choice from codex \"Imperial Guard\" per AOP."
 *
 * The pick is an ordinary roster entry of the Imperial Guard codex (`factionSource`, flagged `ironLordGuard`): it prices, resolves and
 * shops in the Imperial Guard armoury like any other native ally, and it occupies one Heavy Support slot of the army's own AOP.
 */
import type { Unit } from '../types/data';
import type { RosterEntry } from '../types/army';

export const IRON_LORD_LEGACY = 'Legacy of the Iron Lord';
export const IRON_LORD_GUARD_KEY = 'imperial_guard';

/** The codex keys whose Heavy Support vehicles this army may borrow ([] unless a Chaos Space Marines army has the Legacy). */
export function ironLordGuardKeys(faction: string | undefined | null, legacy: string | null | undefined, legacy2?: string | null): string[] {
  if (faction !== 'Chaos Space Marines') return [];
  return legacy === IRON_LORD_LEGACY || legacy2 === IRON_LORD_LEGACY ? [IRON_LORD_GUARD_KEY] : [];
}

/** "a single VEHICLE Heavy Support choice". */
export function ironLordGuardEligible(u: Pick<Unit, 'is_vehicle'>): boolean {
  return !!u.is_vehicle;
}

export const isIronLordGuardEntry = (e: Pick<RosterEntry, 'ironLordGuard'>) => !!e.ironLordGuard;
