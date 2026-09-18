/**
 * markMods.ts — the stat bonuses a Chaos Mark gives, in one place.
 *
 * GH#128: *"The extra Mark bonuses for Daemon Princes do not show up in the live profile (e.g. +1
 * Strength for Khorne)."* Two separate faults, in two separate copies of this table:
 *
 *  1. The codex says the bonus goes to "a character model OR MONSTROUS CREATURE", and the code
 *     tested `is_character` alone. The Chaos Daemons Daemon Prince is `is_monster: true,
 *     is_character: false`, and so are all four Greater Daemons — seven units in the faction were
 *     missing it.
 *  2. The printed card treated the character bonus as a REPLACEMENT for the general one, while the
 *     unit card added them. The sheet says "additionally", so they add: a Khorne character gets
 *     +1 Attack AND +1 Strength.
 *
 * SOURCE — Chaos Daemons 1.01, Index, verbatim:
 *   "Mark of Khorne*: The model gains +1 Attack. A character model or Monstrous Creature gains
 *    additionally +1 Strength. ..."
 *   "Mark of Nurgle*: ... +1 Toughness. A character model or Monstrous Creature gains additionally
 *    +1 Wound. ..."
 *   "Mark of Slaanesh*: ... +1 Initiative. A character model or Monstrous Creature additionally
 *    gains ... +2\" Movement. ..."
 *   "Mark of Tzeentch*: ... the \"Warded\" ability. A character model or Monstrous Creature becomes
 *    a psyker ..."  — no stat change, so Tzeentch has no entry here.
 */
export interface MarkStatMod { stat: string; delta: number }

/** Everyone with the Mark gets this. */
const UNIVERSAL: Record<string, MarkStatMod | undefined> = {
  Khorne:   { stat: 'A', delta: 1 },
  Nurgle:   { stat: 'T', delta: 1 },
  Slaanesh: { stat: 'I', delta: 1 },
};

/** A character model OR Monstrous Creature gets this AS WELL. */
const GREATER: Record<string, MarkStatMod | undefined> = {
  Khorne:   { stat: 'S', delta: 1 },
  Nurgle:   { stat: 'W', delta: 1 },
  Slaanesh: { stat: 'M', delta: 2 },
};

/** Does this unit qualify for the second, bigger half of a Mark's bonus? */
export function takesGreaterMarkBonus(unit: { is_character?: boolean; is_monster?: boolean }): boolean {
  return !!unit.is_character || !!unit.is_monster;
}

/**
 * Every stat change this Mark gives this unit — the universal one, plus the character/Monstrous
 * Creature one when it applies. Vehicles get neither (their Mark benefits are not stat changes),
 * so callers skip them.
 */
export function markStatMods(
  mark: string | null | undefined,
  unit: { is_character?: boolean; is_monster?: boolean; is_vehicle?: boolean },
): MarkStatMod[] {
  if (!mark || unit.is_vehicle) return [];
  const out: MarkStatMod[] = [];
  const u = UNIVERSAL[mark];
  if (u) out.push(u);
  const g = takesGreaterMarkBonus(unit) ? GREATER[mark] : undefined;
  if (g) out.push(g);
  return out;
}

/** Does this Mark change any stat on this unit at all? Used to decide whether to show the note. */
export function hasMarkStatMods(
  mark: string | null | undefined,
  unit: { is_character?: boolean; is_monster?: boolean; is_vehicle?: boolean },
): boolean {
  return markStatMods(mark, unit).length > 0;
}

/**
 * Add `delta` to a printed stat value, in the three shapes stats are written in: a plain number
 * ("4"), an inches value ("6\"") and a roll target ("3+", floored at 2+ — the best the game
 * prints). Anything else, including "-", is returned untouched.
 *
 * Shared so the battle view applies a Mark exactly the way the unit card and the datacard do.
 */
export function applyStatDelta(value: string, delta: number): string {
  if (!value || value === '-' || value === '–') return value;
  if (/^\d+$/.test(value)) return String(parseInt(value, 10) + delta);
  const inch = value.match(/^(\d+)"$/);
  if (inch) return `${parseInt(inch[1], 10) + delta}"`;
  const save = value.match(/^(\d+)\+$/);
  if (save) return `${Math.max(2, parseInt(save[1], 10) + delta)}+`;
  return value;
}
