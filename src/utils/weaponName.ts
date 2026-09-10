/**
 * Splitting a weapon name into its base weapon and its firing mode.
 *
 * WHY THIS EXISTS: the data uses TWO conventions for a multi-profile weapon, and three separate
 * places each re-implemented only one of them.
 *
 *   "Plasma pistol - Standard" / "Plasma pistol - Overcharged"      (dash form)
 *   "Plasma gun (Standard)"    / "Plasma gun (Overheating)"         (parenthesis form)
 *
 * `resolver.ts`, `PrintView.tsx` and `UnitCard.tsx` all split on `' - '` only, so every weapon in
 * the parenthesis form was treated as several DIFFERENT weapons. Two consequences, both reported
 * from a printed Space Marines sheet (Discord, 2026-09-10): the modes printed as separate rows
 * instead of one weapon with its profiles beneath it, and — worse — only one of the modes carried
 * the right quantity. The other fell back to the group's model count, so a squad where one marine
 * had bought a plasma gun printed "1x Plasma gun (Standard)" and "4x Plasma gun (Overheating)".
 *
 * The parenthesis form is not rare: 43 weapons across Space Marines, Imperial Guard, Grey Knights,
 * Inquisition and Dark Eldar. Checked before writing this: NO weapon in the game ends in "(...)"
 * without it being a firing mode, so stripping a trailing parenthesis from a WEAPON name is safe.
 * That is not true of option-choice names — Orks have a choice ending in "(counts as two arm
 * weapons)" — so these helpers are for weapon names only and must not be pointed at choice text.
 */

/** "Plasma gun (Standard)" → "Plasma gun"; "Plasma pistol - Standard" → "Plasma pistol". */
export function weaponBaseName(name: string): string {
  return name.split(' - ')[0].replace(/\s*\([^)]*\)\s*$/, '').trim();
}

/** The firing mode alone, or null for a single-profile weapon. */
export function weaponMode(name: string): string | null {
  const dash = name.split(' - ');
  if (dash.length > 1) return dash.slice(1).join(' - ');
  const paren = name.match(/\(([^)]*)\)\s*$/);
  return paren ? paren[1] : null;
}

/**
 * Is `weapons[i]` one profile of a multi-profile weapon?
 *
 * Deliberately decided by the NEIGHBOURS rather than by the name alone: a unit that carries only
 * one profile of such a weapon should print under its own full name, not as an orphan "— Standard"
 * row with the weapon it belongs to named nowhere.
 */
export function isModeRow(weapons: { name: string }[], i: number): boolean {
  if (weaponMode(weapons[i].name) == null) return false;
  const base = weaponBaseName(weapons[i].name);
  return (i > 0 && weaponBaseName(weapons[i - 1].name) === base)
    || (i < weapons.length - 1 && weaponBaseName(weapons[i + 1].name) === base);
}
