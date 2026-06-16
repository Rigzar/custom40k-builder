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
  grey_knights:        'SM',
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

// 16×16 Allied Matrix
const MATRIX: Record<string, Record<string, Relationship>> = {
  AdS: { AdS:'G', SM:'G', AdC:'G', AdM:'G', CD:'R', CSM:'R', DaE:'R', IG:'G', Inq:'G', LoV:'Y', Nec:'Y', Ork:'Y', GSC:'R', Tau:'Y', Tyr:'R', Eld:'Y' },
  SM:  { AdS:'G', SM:'G', AdC:'G', AdM:'G', CD:'R', CSM:'R', DaE:'R', IG:'G', Inq:'G', LoV:'Y', Nec:'Y', Ork:'Y', GSC:'R', Tau:'Y', Tyr:'R', Eld:'Y' },
  AdC: { AdS:'G', SM:'G', AdC:'G', AdM:'G', CD:'R', CSM:'R', DaE:'R', IG:'G', Inq:'G', LoV:'Y', Nec:'Y', Ork:'Y', GSC:'R', Tau:'Y', Tyr:'R', Eld:'Y' },
  AdM: { AdS:'G', SM:'G', AdC:'G', AdM:'G', CD:'R', CSM:'R', DaE:'R', IG:'G', Inq:'G', LoV:'Y', Nec:'Y', Ork:'Y', GSC:'R', Tau:'Y', Tyr:'R', Eld:'Y' },
  CD:  { AdS:'R', SM:'R', AdC:'R', AdM:'R', CD:'G', CSM:'G', DaE:'R', IG:'R', Inq:'Y', LoV:'R', Nec:'R', Ork:'R', GSC:'R', Tau:'R', Tyr:'R', Eld:'R' },
  CSM: { AdS:'R', SM:'R', AdC:'R', AdM:'R', CD:'G', CSM:'G', DaE:'R', IG:'R', Inq:'Y', LoV:'R', Nec:'R', Ork:'Y', GSC:'Y', Tau:'R', Tyr:'R', Eld:'R' },
  DaE: { AdS:'R', SM:'R', AdC:'R', AdM:'R', CD:'R', CSM:'R', DaE:'Y', IG:'R', Inq:'Y', LoV:'R', Nec:'R', Ork:'Y', GSC:'R', Tau:'R', Tyr:'R', Eld:'Y' },
  IG:  { AdS:'G', SM:'G', AdC:'G', AdM:'G', CD:'R', CSM:'R', DaE:'R', IG:'G', Inq:'G', LoV:'Y', Nec:'Y', Ork:'Y', GSC:'R', Tau:'Y', Tyr:'R', Eld:'Y' },
  Inq: { AdS:'G', SM:'G', AdC:'G', AdM:'G', CD:'Y', CSM:'Y', DaE:'Y', IG:'G', Inq:'Y', LoV:'Y', Nec:'Y', Ork:'Y', GSC:'Y', Tau:'Y', Tyr:'Y', Eld:'Y' },
  LoV: { AdS:'Y', SM:'Y', AdC:'Y', AdM:'Y', CD:'R', CSM:'R', DaE:'R', IG:'Y', Inq:'Y', LoV:'Y', Nec:'Y', Ork:'Y', GSC:'R', Tau:'Y', Tyr:'R', Eld:'Y' },
  Nec: { AdS:'Y', SM:'Y', AdC:'Y', AdM:'Y', CD:'R', CSM:'R', DaE:'R', IG:'Y', Inq:'Y', LoV:'Y', Nec:'G', Ork:'Y', GSC:'R', Tau:'Y', Tyr:'R', Eld:'R' },
  Ork: { AdS:'Y', SM:'Y', AdC:'Y', AdM:'Y', CD:'R', CSM:'Y', DaE:'Y', IG:'Y', Inq:'Y', LoV:'Y', Nec:'Y', Ork:'G', GSC:'R', Tau:'Y', Tyr:'R', Eld:'Y' },
  GSC: { AdS:'R', SM:'R', AdC:'R', AdM:'R', CD:'R', CSM:'Y', DaE:'R', IG:'R', Inq:'Y', LoV:'R', Nec:'R', Ork:'R', GSC:'G', Tau:'R', Tyr:'G', Eld:'R' },
  Tau: { AdS:'Y', SM:'Y', AdC:'Y', AdM:'Y', CD:'R', CSM:'R', DaE:'R', IG:'Y', Inq:'Y', LoV:'Y', Nec:'Y', Ork:'Y', GSC:'R', Tau:'G', Tyr:'R', Eld:'Y' },
  Tyr: { AdS:'R', SM:'R', AdC:'R', AdM:'R', CD:'R', CSM:'R', DaE:'R', IG:'R', Inq:'Y', LoV:'R', Nec:'R', Ork:'R', GSC:'G', Tau:'R', Tyr:'G', Eld:'R' },
  Eld: { AdS:'Y', SM:'Y', AdC:'Y', AdM:'Y', CD:'R', CSM:'R', DaE:'Y', IG:'Y', Inq:'Y', LoV:'Y', Nec:'R', Ork:'Y', GSC:'R', Tau:'Y', Tyr:'R', Eld:'G' },
};

export function getRelationship(factionKeyA: string, factionKeyB: string): Relationship | null {
  const codeA = FACTION_TO_CODE[factionKeyA];
  const codeB = FACTION_TO_CODE[factionKeyB];
  if (!codeA || !codeB) return null;
  return MATRIX[codeA]?.[codeB] ?? null;
}

/** Returns all factions with their relationship to the given faction, sorted G → Y → R. */
export function getAlliableWith(factionKey: string): Array<{ key: string; relationship: Relationship }> {
  const codeA = FACTION_TO_CODE[factionKey];
  if (!codeA) return [];
  const seen = new Set<string>();
  const result: Array<{ key: string; relationship: Relationship }> = [];
  for (const [key, code] of Object.entries(FACTION_TO_CODE)) {
    if (seen.has(key)) continue;
    seen.add(key);
    const rel = MATRIX[codeA]?.[code];
    if (rel) result.push({ key, relationship: rel });
  }
  const order: Relationship[] = ['G', 'Y', 'R'];
  return result.sort((a, b) => order.indexOf(a.relationship) - order.indexOf(b.relationship));
}
