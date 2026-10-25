import type { FactionData, Unit } from '../types/data';
import type { RosterEntry } from '../types/army';
import { GENERAL_DISCIPLINES } from '../data/generalDisciplines';

/**
 * A psyker that KNOWS every power of its disciplines, not a number of them: the Grey Knights Paladin Squad, "It knows Smite and all
 * powers from the General psychic disciplines and Grey Knight psychic discipline" (October 2026 notes, Dominic).
 *
 * The psychic picker used to read that sentence as "no limit" and left the player to tick forty powers by hand, one at a time; a
 * list that nobody ticked printed none. Such a unit now simply HAS the powers: they are added when the unit is added and when an
 * older list is loaded, and the picker shows them as known and read-only.
 */
export function knowsEveryPower(unit: Pick<Unit, 'abilities'> | undefined | null): boolean {
  return (unit?.abilities ?? []).some(a => /^psyker:.*knows smite and all powers from the general psychic disciplines and /i.test(a));
}

/** Every power the unit knows: the General disciplines plus the faction's own, leaving out the legacy / cult / mark-gated ones. */
export function everyKnownPower(data: Pick<FactionData, 'disciplines'>): Array<{ disciplineName: string; powerName: string }> {
  const out: Array<{ disciplineName: string; powerName: string }> = [];
  const add = (disc: string, powers: Array<{ name: string }>) => { for (const p of powers) out.push({ disciplineName: disc, powerName: p.name }); };
  for (const [disc, powers] of Object.entries(GENERAL_DISCIPLINES)) add(disc, powers);
  for (const [disc, powers] of Object.entries(data.disciplines ?? {})) {
    if (/legacy|cult/i.test(disc)) continue;
    add(disc, powers as Array<{ name: string }>);
  }
  return out;
}

/** The roster entry with the powers its unit knows, or the entry itself when nothing is missing (so callers can compare by reference). */
export function withKnownPowers(entry: RosterEntry, unit: Unit | undefined | null, data: Pick<FactionData, 'disciplines'>): RosterEntry {
  if (!knowsEveryPower(unit)) return entry;
  const have = new Set(entry.powers.map(p => `${p.disciplineName}::${p.powerName}`));
  const missing = everyKnownPower(data).filter(p => !have.has(`${p.disciplineName}::${p.powerName}`));
  return missing.length ? { ...entry, powers: [...entry.powers, ...missing] } : entry;
}
