// Genestealer Cults — Legacy powers
//
// Each of the six legacies grants ALL psykers in the army one fixed always-known power, exactly
// the Grey Knights mechanic: "All Psykers know the '<power>' psychic power in addition."
// `engine/legacies.ts` said this mechanic was Grey Knights only, so none of the six did anything —
// the player picked a legacy and no psyker gained the power it exists to grant.
//
// The power TEXT is not repeated here. All six already live in the codex's own
// "Legacy Psychic Powers" discipline, so they are resolved by name from the loaded faction data;
// duplicating them would create a second copy to drift out of sync with the sheet.
//
// SOURCE: Genestealer Cults 1.02 → Army Customisation → LEGACIES

/** legacy name -> the power every psyker additionally knows */
export const GSC_LEGACY_POWER_MAP: Record<string, string> = {
  "Legacy of Chancer's Vale":    'Last Gasp',
  'Legacy of Feinminster Gamma': 'Broodvolt Surge',
  'Legacy of New Gidlam':        'Synaptic Blast',
  'Legacy of Newseam':           'Inescapable Decay',
  'Legacy of the Trysst Dynasty': 'Undermine',
  'Legacy of Vejovium III':      'Mutagenic Deviation',
};

/** The power this legacy grants, or null when the legacy is not a GSC one. */
export function getGSCLegacyPowerName(legacyName: string): string | null {
  return GSC_LEGACY_POWER_MAP[legacyName] ?? null;
}
