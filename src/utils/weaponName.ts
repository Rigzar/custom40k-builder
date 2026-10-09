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

/**
 * The name of a weapon with everything that varies between a datasheet's WEAPON row and the option choice that
 * names it taken out: the firing-mode suffix ("- Standard" / "(Standard)"), capitals, a leading count ("Two
 * Grot bomms") and a plural s. The resolver (computeWeaponsToShow) has always compared names this way; the
 * option tables on the unit card compared them exactly, so a swap list showed "Big Zzappa" and "Two Grot bomms"
 * with no profile on the Mekboy Junka while the weapon appeared normally once bought (the row is "Big zzappa" /
 * "Grot bomm" on the sheet).
 */
export function weaponKey(name: string): string {
  return weaponBaseName(name)
    .toLowerCase()
    .replace(/^(?:a pair of|a|an|two|three|four|five|six|\d+)\s+/, '')
    .replace(/s$/, '');
}

/**
 * Resolve an option choice's display name to one or more weapon profiles from the unit's weapons[]: exact matches,
 * multi-profile weapons ("Plasma gun" -> "Plasma gun - Standard" / "- Overcharged"), the same weapon spelled with
 * other capitals, a count or a plural ("Two Grot bomms" -> "Grot bomm"), and compound choices ("X and Y" / "X & Y").
 * `compound` is true when the choice resolves to several DIFFERENT weapons (each row gets its own Pts), as opposed
 * to several fire-mode profiles of the same weapon.
 */
export function resolveChoiceWeapons<W extends { name: string }>(weapons: W[], choiceName: string): { weapons: W[]; compound: boolean } {
  const exact = weapons.find(w => w.name === choiceName);
  if (exact) return { weapons: [exact], compound: false };
  const multiProfile = weapons.filter(w => w.name.startsWith(`${choiceName} - `));
  if (multiProfile.length > 0) return { weapons: multiProfile, compound: false };
  const key = weaponKey(choiceName);
  const loose = weapons.filter(w => weaponKey(w.name) === key);
  if (loose.length > 0) return { weapons: loose, compound: false };
  const parts = choiceName.split(/\s*(?:&|\band\b)\s*/i).filter(Boolean);
  if (parts.length > 1) {
    const resolved = parts.map(p => resolveChoiceWeapons(weapons, p));
    if (resolved.every(r => r.weapons.length > 0)) {
      return { weapons: resolved.flatMap(r => r.weapons), compound: true };
    }
  }
  return { weapons: [], compound: false };
}
