export type Relationship = 'G' | 'Y' | 'R';

export const RELATIONSHIP_LABELS: Record<Relationship, string> = {
  G: 'Battle Brothers',
  Y: 'Allies of Convenience',
  R: 'Desperate Allies',
};

export const RELATIONSHIP_COLORS: Record<Relationship, string> = {
  G: 'text-green-400',
  Y: 'text-yellow-400',
  R: 'text-red-400',
};

export const RELATIONSHIP_DESCRIPTIONS: Record<Relationship, string> = {
  G: 'Treated as friendly — auras, psychic powers and transports work across both factions.',
  Y: 'Separate armies on the battlefield — auras and psychic powers only affect own faction. Transports carry own faction only.',
  R: 'Separate armies. Transports carry own faction only. Units within 12" of allies must pass LD-1 or lose their order for that turn.',
};

// Each app faction key → matrix code
const FACTION_TO_CODE: Record<string, string> = {
  adeptus_sororitas:   'AdS',
  space_marines:       'SM',
  grey_knights:        'GK',
  horus_heresy:        'SM',
  adeptus_custodes:    'AdC',
  adeptus_mechanicus:  'AdM',
  chaos_daemons:       'CD',
  chaos_space_marines: 'CSM',
  dark_eldar:          'DaE',
  imperial_guard:      'IG',
  inquisition:         'Inq',
  assassins:           'Inq',
  leagues_of_votann:   'LoV',
  necrons:             'Nec',
  orks:                'Ork',
  genestealer_cults:   'GSC',
  tau_empire:          'Tau',
  tyranids:            'Tyr',
  eldar:               'Eld',
  harlequins:          'Eld',
};

// Allied Matrix, 17×17, transcribed from the live Core Rules document rather than typed by
// hand — the author rewrote it on 2026-08-17, adding Grey Knights as a row of their own and
// filling the cells that used to be blank. Ten cells changed with it: the Inquisition is now
// Allies of Convenience with the five Imperial factions, where it used to be Battle Brothers.
// Harlequins still read off the Eldar row (the author is writing them an Army Customisation
// that sets their own ally level), and Assassins are deliberately absent from the chart because
// they can never be fielded without a parent army.
const MATRIX: Record<string, Record<string, Relationship>> = {
  AdC: { AdC:'G', AdM:'G', AdS:'G', CD:'R', CSM:'R', DaE:'R', Eld:'Y', GK:'Y', GSC:'R', IG:'G', Inq:'Y', LoV:'Y', Nec:'Y', Ork:'Y', SM:'G', Tau:'Y', Tyr:'R' },
  AdM: { AdC:'G', AdM:'G', AdS:'G', CD:'R', CSM:'R', DaE:'R', Eld:'Y', GK:'Y', GSC:'R', IG:'G', Inq:'Y', LoV:'Y', Nec:'Y', Ork:'Y', SM:'G', Tau:'Y', Tyr:'R' },
  AdS: { AdC:'G', AdM:'G', AdS:'G', CD:'R', CSM:'R', DaE:'R', Eld:'Y', GK:'Y', GSC:'R', IG:'G', Inq:'Y', LoV:'Y', Nec:'Y', Ork:'Y', SM:'G', Tau:'Y', Tyr:'R' },
  CD: { AdC:'R', AdM:'R', AdS:'R', CD:'G', CSM:'G', DaE:'R', Eld:'R', GK:'R', GSC:'R', IG:'R', Inq:'Y', LoV:'R', Nec:'R', Ork:'R', SM:'R', Tau:'R', Tyr:'R' },
  CSM: { AdC:'R', AdM:'R', AdS:'R', CD:'G', CSM:'G', DaE:'R', Eld:'R', GK:'R', GSC:'Y', IG:'R', Inq:'Y', LoV:'R', Nec:'R', Ork:'Y', SM:'R', Tau:'R', Tyr:'R' },
  DaE: { AdC:'R', AdM:'R', AdS:'R', CD:'R', CSM:'R', DaE:'Y', Eld:'Y', GK:'R', GSC:'R', IG:'R', Inq:'Y', LoV:'R', Nec:'R', Ork:'Y', SM:'R', Tau:'R', Tyr:'R' },
  Eld: { AdC:'Y', AdM:'Y', AdS:'Y', CD:'R', CSM:'R', DaE:'Y', Eld:'G', GK:'Y', GSC:'R', IG:'Y', Inq:'Y', LoV:'Y', Nec:'R', Ork:'Y', SM:'Y', Tau:'Y', Tyr:'R' },
  GK: { AdC:'Y', AdM:'Y', AdS:'Y', CD:'R', CSM:'R', DaE:'R', Eld:'Y', GK:'Y', GSC:'R', IG:'Y', Inq:'Y', LoV:'Y', Nec:'Y', Ork:'Y', SM:'Y', Tau:'Y', Tyr:'R' },
  GSC: { AdC:'R', AdM:'R', AdS:'R', CD:'R', CSM:'Y', DaE:'R', Eld:'R', GK:'R', GSC:'G', IG:'R', Inq:'Y', LoV:'R', Nec:'R', Ork:'R', SM:'R', Tau:'R', Tyr:'Y' },
  IG: { AdC:'G', AdM:'G', AdS:'G', CD:'R', CSM:'R', DaE:'R', Eld:'Y', GK:'Y', GSC:'R', IG:'G', Inq:'Y', LoV:'Y', Nec:'Y', Ork:'Y', SM:'G', Tau:'Y', Tyr:'R' },
  Inq: { AdC:'Y', AdM:'Y', AdS:'Y', CD:'Y', CSM:'Y', DaE:'Y', Eld:'Y', GK:'Y', GSC:'Y', IG:'Y', Inq:'Y', LoV:'Y', Nec:'Y', Ork:'Y', SM:'Y', Tau:'Y', Tyr:'Y' },
  LoV: { AdC:'Y', AdM:'Y', AdS:'Y', CD:'R', CSM:'R', DaE:'R', Eld:'Y', GK:'Y', GSC:'R', IG:'Y', Inq:'Y', LoV:'Y', Nec:'Y', Ork:'Y', SM:'Y', Tau:'Y', Tyr:'R' },
  Nec: { AdC:'Y', AdM:'Y', AdS:'Y', CD:'R', CSM:'R', DaE:'R', Eld:'R', GK:'Y', GSC:'R', IG:'Y', Inq:'Y', LoV:'Y', Nec:'G', Ork:'Y', SM:'Y', Tau:'Y', Tyr:'R' },
  Ork: { AdC:'Y', AdM:'Y', AdS:'Y', CD:'R', CSM:'Y', DaE:'Y', Eld:'Y', GK:'Y', GSC:'R', IG:'Y', Inq:'Y', LoV:'Y', Nec:'Y', Ork:'G', SM:'Y', Tau:'Y', Tyr:'R' },
  SM: { AdC:'G', AdM:'G', AdS:'G', CD:'R', CSM:'R', DaE:'R', Eld:'Y', GK:'Y', GSC:'R', IG:'G', Inq:'Y', LoV:'Y', Nec:'Y', Ork:'Y', SM:'G', Tau:'Y', Tyr:'R' },
  Tau: { AdC:'Y', AdM:'Y', AdS:'Y', CD:'R', CSM:'R', DaE:'R', Eld:'Y', GK:'Y', GSC:'R', IG:'Y', Inq:'Y', LoV:'Y', Nec:'Y', Ork:'Y', SM:'Y', Tau:'G', Tyr:'R' },
  Tyr: { AdC:'R', AdM:'R', AdS:'R', CD:'R', CSM:'R', DaE:'R', Eld:'R', GK:'R', GSC:'Y', IG:'R', Inq:'Y', LoV:'R', Nec:'R', Ork:'R', SM:'R', Tau:'R', Tyr:'G' },
};

/**
 * What an archetype does to this army's place in the matrix. Two shapes, because the codices use
 * two wordings:
 *
 *   `overrides`  "Dark Mechanicum become Allies of Convenience for Chaos Space Marines" — one cell.
 *   `matrixAs`   "Traitor Guard are treated like Chaos Space Marines in the Ally matrix" — the whole
 *                row AND column, so the army reads and is read as that faction.
 */
export interface AllySideRules {
  overrides?: Record<string, Relationship>;
  matrixAs?: string;
}

const BETTER: Record<Relationship, number> = { G: 0, Y: 1, R: 2 };

/**
 * One side's rules, read off its archetype. A tiny helper because BOTH sides have to be passed
 * now and `rule?.a, rule?.b` at four call sites is how one of them ends up half-updated.
 */
export function allySide(
  rule?: { alliedRelationshipOverrides?: Record<string, Relationship>; alliedMatrixAs?: string } | null,
): AllySideRules | undefined {
  if (!rule) return undefined;
  return { overrides: rule.alliedRelationshipOverrides, matrixAs: rule.alliedMatrixAs };
}

/**
 * The relationship between two detachments, taking BOTH sides' archetypes into account.
 *
 * Both sides matter because the rewrite usually lives on the ALLY, not the host: a Chaos Space
 * Marines army with an allied Traitor Guard detachment is the case that was reported, and the
 * sentence that changes it is printed in the Imperial Guard codex, on the archetype the ALLY took.
 * Reading only the primary's archetype left that army on the plain IG row, i.e. Desperate Allies.
 *
 * When both sides name a level, the BETTER one wins. Every one of these sentences is a grant —
 * "become Battle Brothers", "become Allies of Convenience" — so the army that was given something
 * keeps it; nothing in the rules describes two grants cancelling out, and none of the eight
 * archetypes in the game conflict today.
 */
export function getRelationship(
  factionKeyA: string,
  factionKeyB: string,
  a?: AllySideRules,
  b?: AllySideRules,
): Relationship | null {
  const forced = [a?.overrides?.[factionKeyB], b?.overrides?.[factionKeyA]]
    .filter((r): r is Relationship => !!r)
    .sort((x, y) => BETTER[x] - BETTER[y])[0];
  if (forced) return forced;
  const codeA = FACTION_TO_CODE[a?.matrixAs ?? factionKeyA];
  const codeB = FACTION_TO_CODE[b?.matrixAs ?? factionKeyB];
  if (!codeA || !codeB) return null;
  return MATRIX[codeA]?.[codeB] ?? null;
}

/** Returns all factions with their relationship to the given faction, sorted G → Y → R.
 *  Only THIS army's archetype is known here — the picker runs before an ally, let alone an allied
 *  archetype, has been chosen — so a rewrite that lives on the ally's side (Traitor Guard) cannot
 *  show up in the grouping. `getRelationship` sees both and has the final word once one is picked. */
export function getAlliableWith(
  factionKey: string,
  side?: AllySideRules,
): Array<{ key: string; relationship: Relationship }> {
  const overrides = side?.overrides;
  const codeA = FACTION_TO_CODE[side?.matrixAs ?? factionKey];
  if (!codeA) return [];
  const seen = new Set<string>();
  const result: Array<{ key: string; relationship: Relationship }> = [];
  for (const [key, code] of Object.entries(FACTION_TO_CODE)) {
    if (seen.has(key)) continue;
    seen.add(key);
    const rel = overrides?.[key] ?? MATRIX[codeA]?.[code];
    if (rel) result.push({ key, relationship: rel });
  }
  const order: Relationship[] = ['G', 'Y', 'R'];
  return result.sort((a, b) => order.indexOf(a.relationship) - order.indexOf(b.relationship));
}
