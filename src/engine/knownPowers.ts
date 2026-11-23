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
  return (unit?.abilities ?? []).some(a => /^psyker:.*knows smite and all powers from the general psychic disciplines and /i.test(a)) || knowsCtanPowers(unit);
}

/** The C'tan Shard: "It knows all powers from the list of C'tan powers" (Necrons sheet). Only the faction's own list, no General disciplines. */
export function knowsCtanPowers(unit: Pick<Unit, 'abilities'> | undefined | null): boolean {
  return (unit?.abilities ?? []).some(a => /knows all powers from the list of c'tan powers/i.test(a));
}

/** "Time's Arrow (only for Yngir C'tans)": the power is listed with its own restriction in the name. */
const isYngirOnlyPower = (name: string) => /only for yngir/i.test(name);

/** Every power the unit knows: the General disciplines plus the faction's own, leaving out the legacy / cult / mark-gated ones. */
export function everyKnownPower(data: Pick<FactionData, 'disciplines'>, unit?: Pick<Unit, 'abilities'> | null, archetype?: string): Array<{ disciplineName: string; powerName: string }> {
  const out: Array<{ disciplineName: string; powerName: string }> = [];
  const add = (disc: string, powers: Array<{ name: string }>) => { for (const p of powers) out.push({ disciplineName: disc, powerName: p.name }); };
  const ctan = knowsCtanPowers(unit);
  if (!ctan) for (const [disc, powers] of Object.entries(GENERAL_DISCIPLINES)) add(disc, powers);
  for (const [disc, powers] of Object.entries(data.disciplines ?? {})) {
    if (/legacy|cult/i.test(disc)) continue;
    add(disc, (powers as Array<{ name: string }>).filter(p => !isYngirOnlyPower(p.name) || archetype === 'Yngir'));
  }
  return out;
}

/** The roster entry with the powers its unit knows, or the entry itself when nothing is missing (so callers can compare by reference). */
export function withKnownPowers(entry: RosterEntry, unit: Unit | undefined | null, data: Pick<FactionData, 'disciplines'>, archetype?: string): RosterEntry {
  if (!knowsEveryPower(unit)) return entry;
  // A C'tan Shard outside Yngir does not know the Yngir-only power: drop it if a list kept it from before.
  const kept = knowsCtanPowers(unit) && archetype !== 'Yngir' ? entry.powers.filter(p => !isYngirOnlyPower(p.powerName)) : entry.powers;
  const have = new Set(kept.map(p => `${p.disciplineName}::${p.powerName}`));
  const missing = everyKnownPower(data, unit, archetype).filter(p => !have.has(`${p.disciplineName}::${p.powerName}`));
  return missing.length || kept.length !== entry.powers.length ? { ...entry, powers: [...kept, ...missing] } : entry;
}
