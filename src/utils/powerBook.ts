import type { FactionData, Power } from '../types/data';
import type { RosterEntry } from '../types/army';
import { GENERAL_DISCIPLINES } from '../data/generalDisciplines';
import { findPowerByName, powerMetaLine } from './psychicFormat';

/**
 * The "book" at the end of a list: every psychic power, prayer and pact the army uses, ONCE, with its full text.
 *
 * Why it exists (Rigzar, 2026-10-25): each unit card carried the full entry of every power, so a Paladin Squad that knows
 * forty-three of them printed forty-three paragraphs, and the same Biomancy power appeared again on every Librarian. The cards
 * now carry names only (see `unitPowerSummary`) and the text lives here, in the same place a printed list already puts its
 * Special Rules. v1.70 had moved the text ONTO the cards because a name alone is useless at the table; the book fixes that
 * without repeating it - the name on the card is looked up in the last pages.
 */

export interface BookEntry { name: string; meta: string; effect: string }
export interface PowerBook {
  /** Psychic powers grouped by discipline, disciplines in the order first met. */
  powers: Array<{ discipline: string; entries: BookEntry[] }>;
  prayers: BookEntry[];
  pacts: BookEntry[];
}

/** The powers of one discipline by name: the General six, the faction's own, and the ones a Chaos-granting archetype brings. */
export function disciplinePowers(discipline: string, data: FactionData | null | undefined): Power[] {
  const g = (GENERAL_DISCIPLINES as Record<string, Power[]>)[discipline];
  if (Array.isArray(g)) return g;
  const own = (data?.disciplines as Record<string, Power[]> | undefined)?.[discipline];
  if (Array.isArray(own)) return own;
  const granted = (data?.archetype_armory?.disciplines as Record<string, Power[]> | undefined)?.[discipline];
  return Array.isArray(granted) ? granted : [];
}

const entryOf = (p: Power | undefined, name: string): BookEntry => ({ name, meta: powerMetaLine(p), effect: p?.effect ?? '' });

/** What a unit card says about its powers: names, and whole disciplines it knows entirely ("Biomancy (all)"). */
export function unitPowerSummary(item: RosterEntry, data: FactionData | null | undefined): {
  wholeDisciplines: string[]; names: string[]; prayers: string[]; pacts: string[];
} {
  const whole = new Set<string>();
  const byDisc = new Map<string, string[]>();
  for (const p of item.powers ?? []) {
    if (p.powerName === '__discipline__') { whole.add(p.disciplineName); continue; }
    byDisc.set(p.disciplineName, [...(byDisc.get(p.disciplineName) ?? []), p.powerName]);
  }
  const names: string[] = [];
  for (const [disc, list] of byDisc) {
    const pool = disciplinePowers(disc, data);
    if (pool.length > 1 && pool.every(pw => list.includes(pw.name))) whole.add(disc);
    else names.push(...list);
  }
  return { wholeDisciplines: [...whole], names, prayers: [...(item.prayers ?? [])], pacts: [...(item.pacts ?? [])] };
}

export function collectPowerBook(army: RosterEntry[], data: FactionData | null | undefined): PowerBook {
  const powers = new Map<string, Map<string, BookEntry>>();
  const prayers = new Map<string, BookEntry>();
  const pacts = new Map<string, BookEntry>();
  const addPower = (disc: string, name: string, p?: Power) => {
    if (!powers.has(disc)) powers.set(disc, new Map());
    const m = powers.get(disc)!;
    if (!m.has(name)) m.set(name, entryOf(p ?? findPowerByName(name, data), name));
  };
  for (const item of army) {
    for (const p of item.powers ?? []) {
      if (p.powerName === '__discipline__') for (const pw of disciplinePowers(p.disciplineName, data)) addPower(p.disciplineName, pw.name, pw);
      else addPower(p.disciplineName, p.powerName);
    }
    for (const n of item.prayers ?? []) if (!prayers.has(n)) prayers.set(n, entryOf(findPowerByName(n, data), n));
    for (const n of item.pacts ?? []) if (!pacts.has(n)) pacts.set(n, entryOf(findPowerByName(n, data), n));
  }
  return {
    powers: [...powers.entries()].map(([discipline, m]) => ({ discipline, entries: [...m.values()] })),
    prayers: [...prayers.values()],
    pacts: [...pacts.values()],
  };
}

export const powerBookIsEmpty = (b: PowerBook) => b.powers.length === 0 && b.prayers.length === 0 && b.pacts.length === 0;
