/**
 * Free Veteran abilities a character assigns to himself and a friendly unit.
 *
 * The same rule is printed on ten datasheets under five names: Custodes Shield-Captain "Battle Tactics" (two), Chaos Lieutenant
 * "Veterans of the Long War" (one), Space Marine / Grey Knights Captain "Combat tactics" (two), Lieutenant, Centurion (one),
 * Captain Dreadnought (two). "The Shield-Captain can assign two free Veteran abilities to himself and a friendly unit at the start
 * of the deployment and replace both abilities during each Reinforcement phase. The friendly unit can be changed during each
 * Reinforcement phase. ... It does not count against the limit on how many Veteran abilities a unit can have."
 *
 * Until now only the text showed. The picker (UnitCard) stores the choice in RosterEntry.freeVeterans; the resolver hands them to
 * the card, the print and the battle view as granted abilities, exactly like a bought Veteran ability. The friendly unit that
 * gets the same abilities is not modelled: the player gives it the ones shown here.
 */
import type { Armory, ArmoryItem } from '../types/data';

const WORD_TO_NUMBER: Record<string, number> = { a: 1, an: 1, one: 1, two: 2, three: 3 };

/** How many free Veteran abilities the unit's own rules let it assign (0 when it has no such rule). */
export function freeVeteranCap(abilities: string[] | undefined): number {
  for (const a of abilities ?? []) {
    const m = a.match(/\b(?:can|may) assign (a|an|one|two|three|\d+) free Veteran abilit(?:y|ies)\b/i);
    if (!m) continue;
    const w = m[1].toLowerCase();
    return WORD_TO_NUMBER[w] ?? (parseInt(w, 10) || 0);
  }
  return 0;
}

/** The faction's Veteran abilities: every Armory item of category 'veteran', in sheet order. */
export function veteranAbilityItems(armory: Armory | null | undefined): ArmoryItem[] {
  if (!armory) return [];
  const out: ArmoryItem[] = [];
  for (const v of Object.values(armory as unknown as Record<string, unknown>)) {
    if (!Array.isArray(v)) continue;
    for (const it of v as ArmoryItem[]) if (it && it.category === 'veteran' && !out.some(o => o.name === it.name)) out.push(it);
  }
  return out;
}

/** The ability name a Veteran ability item gives ("Counter-attack"), from its effect or its quoted text. */
export function veteranAbilityName(item: ArmoryItem): string {
  return item.effect?.grants_abilities?.[0] ?? item.desc?.match(/"([^"]+)"/)?.[1] ?? item.name;
}
