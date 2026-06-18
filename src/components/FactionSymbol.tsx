type FactionCategory = 'chaos' | 'imperium' | 'xenos' | 'supp';

const FACTION_CATEGORY: Record<string, FactionCategory> = {
  chaos_space_marines: 'chaos',
  chaos_daemons:       'chaos',
  space_marines:       'imperium',
  imperial_guard:      'imperium',
  adeptus_mechanicus:  'imperium',
  adeptus_custodes:    'imperium',
  adeptus_sororitas:   'imperium',
  grey_knights:        'imperium',
  inquisition:         'imperium',
  assassins:           'supp',
  tau_empire:          'xenos',
  necrons:             'xenos',
  orks:                'xenos',
  eldar:               'xenos',
  dark_eldar:          'xenos',
  genestealer_cults:   'xenos',
  harlequins:          'xenos',
  leagues_of_votann:   'xenos',
  tyranids:            'xenos',
  horus_heresy:        'supp',
};

const FACTION_SVG: Record<string, string> = {
  chaos_space_marines: '/faction-symbols/chaos-space-marines.svg',
  chaos_daemons:       '/faction-symbols/chaos-daemons.svg',
  space_marines:       '/faction-symbols/space-marines.svg',
  imperial_guard:      '/faction-symbols/imperial-guard.svg',
  adeptus_mechanicus:  '/faction-symbols/adeptus-mechanicus.svg',
  adeptus_custodes:    '/faction-symbols/adeptus-custodes.svg',
  adeptus_sororitas:   '/faction-symbols/adeptus-sororitas.svg',
  grey_knights:        '/faction-symbols/grey-knights.svg',
  inquisition:         '/faction-symbols/inquisition.svg',
  assassins:           '/faction-symbols/assassins.svg',
  tau_empire:          '/faction-symbols/tau-empire.svg',
  necrons:             '/faction-symbols/necrons.svg',
  orks:                '/faction-symbols/orks.svg',
  eldar:               '/faction-symbols/eldar.svg',
  dark_eldar:          '/faction-symbols/dark-eldar.svg',
  genestealer_cults:   '/faction-symbols/genestealer-cults.svg',
  harlequins:          '/faction-symbols/harlequins.svg',
  leagues_of_votann:   '/faction-symbols/leagues-of-votann.svg',
  tyranids:            '/faction-symbols/tyranids.svg',
  horus_heresy:        '/faction-symbols/horus-heresy.svg',
};

const FACTION_ABBREV: Record<string, string> = {
  chaos_space_marines: 'CSM',
  chaos_daemons:       'CD',
  space_marines:       'SM',
  imperial_guard:      'IG',
  adeptus_mechanicus:  'AM',
  adeptus_custodes:    'AC',
  adeptus_sororitas:   'AS',
  grey_knights:        'GK',
  inquisition:         'INQ',
  assassins:           'ASN',
  tau_empire:          'TAU',
  necrons:             'NEC',
  orks:                'ORK',
  eldar:               'EL',
  dark_eldar:          'DE',
  genestealer_cults:   'GSC',
  harlequins:          'HAR',
  leagues_of_votann:   'LoV',
  tyranids:            'TYR',
  horus_heresy:        'HH',
};

const CATEGORY_BG: Record<FactionCategory, string> = {
  chaos:   '#2d1010',
  imperium:'#2a2610',
  xenos:   '#0f2318',
  supp:    '#1a1a2a',
};

interface FactionSymbolProps {
  factionKey: string;
  size?: number;
  className?: string;
  /** Show only the SVG glyph, no coloured circle background */
  naked?: boolean;
  /** Override SVG path — e.g. a legion symbol instead of faction default */
  overrideUrl?: string;
}

export function FactionSymbol({ factionKey, size = 40, className = '', naked = false, overrideUrl }: FactionSymbolProps) {
  const cat = FACTION_CATEGORY[factionKey] ?? 'supp';
  const svgSrc = overrideUrl ?? FACTION_SVG[factionKey];

  if (svgSrc && naked) {
    return (
      <img
        src={svgSrc}
        alt={FACTION_ABBREV[factionKey] ?? factionKey}
        className={`shrink-0 ${className}`}
        style={{ width: size, height: size, objectFit: 'contain', filter: 'brightness(0) invert(1) opacity(0.65)' }}
        draggable={false}
      />
    );
  }

  if (svgSrc) {
    return (
      <div
        className={`flex items-center justify-center rounded-full shrink-0 ${className}`}
        style={{ width: size, height: size, background: CATEGORY_BG[cat], padding: Math.round(size * 0.12) }}
      >
        <img
          src={svgSrc}
          alt={FACTION_ABBREV[factionKey] ?? factionKey}
          style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(0) invert(1) opacity(0.85)' }}
          draggable={false}
        />
      </div>
    );
  }

  const abbrev = FACTION_ABBREV[factionKey] ?? factionKey.slice(0, 3).toUpperCase();
  const fontSize = size <= 32 ? Math.round(size * 0.32) : Math.round(size * 0.28);

  return (
    <div
      className={`flex items-center justify-center rounded-full shrink-0 font-semibold ${className}`}
      style={{ width: size, height: size, background: CATEGORY_BG[cat], color: '#aaa', fontSize }}
    >
      {abbrev}
    </div>
  );
}
