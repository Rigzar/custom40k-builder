/**
 * Dark Eldar sub-faction axis (Kabal / Coven / Cult).
 *
 * The sub-faction lives in each unit's `keywords[]` (see rules-model/dark_eldar.md §1). Traits are
 * sub-faction-gated: every trait name carries a superscript marker that is part of the canonical
 * name string — ᴷ = Kabal, ᶜᵒ = Coven, ᶜᵘ = Cult. This module maps that marker to the keyword and
 * derives a unit's effective sub-faction(s), so a Kabal trait never applies to a Coven unit
 * (previously ki-21a: trait effects ignored the sub-faction entirely).
 *
 * Shared units (Raider / Venom / Ravager / Razorwing / Voidraven) carry all three keywords; the
 * player picks one via RosterEntry.subfaction to decide which sub-faction's traits reach them.
 */

export const DE_SUBFACTIONS = ['Kabal', 'Coven', 'Cult'] as const;
export type DESubfaction = typeof DE_SUBFACTIONS[number];

/** The sub-faction a trait is restricted to, from its canonical superscript marker, or null if the
 *  trait name carries no marker (every non-Dark-Eldar trait — so this is safe to call globally). */
export function traitRequiredSubfaction(traitName: string): DESubfaction | null {
  if (traitName.includes('ᶜᵒ')) return 'Coven';   // check ᶜᵒ / ᶜᵘ (both start with ᶜ) before ᴷ
  if (traitName.includes('ᶜᵘ')) return 'Cult';
  if (traitName.includes('ᴷ'))  return 'Kabal';
  return null;
}

/** The sub-faction keywords a unit's datasheet carries (0, 1, or all 3 for shared vehicles). */
export function unitSubfactions(keywords: string[] | undefined): DESubfaction[] {
  return DE_SUBFACTIONS.filter(s => keywords?.includes(s));
}

/**
 * The sub-faction(s) used to gate this unit's traits: the player-chosen one when the unit can
 * choose (multi-keyword unit + a valid selection), otherwise every sub-faction keyword the unit
 * carries (the permissive default — an un-chosen shared vehicle still receives any of the three).
 */
export function effectiveSubfactions(
  keywords: string[] | undefined,
  chosen: string | null | undefined,
): DESubfaction[] {
  const own = unitSubfactions(keywords);
  if (chosen && own.includes(chosen as DESubfaction)) return [chosen as DESubfaction];
  return own;
}
