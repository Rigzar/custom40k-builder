/** Space Marines: maps each legacy-gated discipline name → the legacy that unlocks it. */
export const SM_LEGACY_DISC_MAP: Record<string, string> = {
  'Geokinesis (Legacy)':    'Legacy of the Praetorian',
  'Interromancy (Legacy)':  'Legacy of the Lion',
  'Sanguine (Legacy)':      'Legacy of the Angel',
  'Stormspeaking (Legacy)': 'Legacy of the Khan',
  'Tempestus (Legacy)':     'Legacy of the Wolf',
};

/** Prayer names from Prayers of the Faithful — only available with Legacy of the Crusader. */
export const SM_CRUSADER_PRAYERS = new Set([
  'Fire of Devotion',
  'Litany of Divine Protection',
  'Oath of Glory',
  'Plea of Deliverance',
  'Psalm of Remorseless Persecution',
]);
