/**
 * Space Marines legacy rules.
 *
 * SOURCE: Space Marines — Army Customisation sheet (canonical)
 * ─────────────────────────────────────────────────────────────────
 * "Legacies give access to armories and disciplines of legendary factions."
 * You may select: 0-1 Legacy (0-2 if the "Expanded Armory" Trait is active).
 *
 * 9 Legacies total. Five grant a legacy-gated psychic discipline in addition to the
 * chapter armory. One (Alien Hunters) also grants access to Inquisition units.
 *
 * WIRING: SM_LEGACY_DISC_MAP gates disciplines in the psychic modal.
 *         SM_CRUSADER_PRAYERS gates Black Templars prayers.
 */

/** Maps each legacy-gated discipline name → the legacy that unlocks it.
 *
 * SOURCE legacies that grant a discipline:
 *   Legacy of the Angel     → "Sanguine psychic discipline"
 *   Legacy of the Khan      → "Stormspeaking psychic discipline"
 *   Legacy of the Lion      → "Interromancy psychic discipline"
 *   Legacy of the Praetorian → "Geokinesis psychic discipline"
 *   Legacy of the Wolf      → "Tempestus psychic discipline"
 */
export const SM_LEGACY_DISC_MAP: Record<string, string> = {
  'Geokinesis (Legacy)':    'Legacy of the Praetorian',
  'Interromancy (Legacy)':  'Legacy of the Lion',
  'Sanguine (Legacy)':      'Legacy of the Angel',
  'Stormspeaking (Legacy)': 'Legacy of the Khan',
  'Tempestus (Legacy)':     'Legacy of the Wolf',
};

/** Prayer names from Prayers of the Faithful.
 *
 * SOURCE — Legacy of the Crusader:
 * "The army has access to the Black Templars Armory and Prayers of the Faithful."
 * Only available when Legacy of the Crusader is active.
 */
export const SM_CRUSADER_PRAYERS = new Set([
  'Fire of Devotion',
  'Litany of Divine Protection',
  'Oath of Glory',
  'Plea of Deliverance',
  'Psalm of Remorseless Persecution',
]);

/**
 * Full legacy reference (informational — armory access is wired via data/loaders.ts).
 *
 * Legacy of Aurelia          → Blood Ravens Armory
 * Legacy of the Alien Hunters → Death Watch Armory + Inquisitors/Inquisition units
 *                               (Inquisitors must select "Ordo Xenos" in the armory)
 *                               Each model can receive "Special ammunition" regardless of armory access.
 * Legacy of the Angel        → Blood Angels Armory + Sanguine discipline
 * Legacy of the Crusader     → Black Templars Armory + Prayers of the Faithful
 * Legacy of the Damned       → Relictors Armory
 * Legacy of the Khan         → White Scars Armory + Stormspeaking discipline
 * Legacy of the Lion         → Dark Angels Armory + Interromancy discipline
 * Legacy of the Praetorian   → Imperial Fists Armory + Geokinesis discipline
 * Legacy of the Wolf         → Space Wolves Armory + Tempestus discipline
 */
