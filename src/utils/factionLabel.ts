/**
 * The one place that knows a faction's loader key and its display name.
 *
 * The app stores the DISPLAY name in a roster (`data.faction` is "Chaos Space Marines"), but not
 * every row in the database does: reported 2026-09-13, one saved army listed its faction as the raw
 * key `chaos_space_marines`, underscores and all, while every other army of the same player read
 * normally. Rows already written cannot be un-written, so the fix has to be at the point of
 * display — `factionLabel()` takes whichever of the two a row happens to hold and always returns
 * something a person would recognise.
 *
 * The map itself used to exist twice (App.tsx and AlliedDetachmentPanel.tsx) and both copies are
 * now this one, so a new faction is added in a single place.
 */
export const FACTION_NAMES: Record<string, string> = {
  chaos_space_marines:  'Chaos Space Marines',
  chaos_daemons:        'Chaos Daemons',
  space_marines:        'Space Marines',
  imperial_guard:       'Imperial Guard',
  adeptus_mechanicus:   'Adeptus Mechanicus',
  adeptus_custodes:     'Adeptus Custodes',
  adeptus_sororitas:    'Adeptus Sororitas',
  grey_knights:         'Grey Knights',
  inquisition:          'Inquisition',
  imperial_navy:        'Imperial Navy',
  knight_households:    'Knight Households',
  assassins:            'Assassins',
  tau_empire:           'Tau Empire',
  necrons:              'Necrons',
  orks:                 'Orks',
  eldar:                'Eldar',
  dark_eldar:           'Dark Eldar',
  genestealer_cults:    'Genestealer Cults',
  harlequins:           'Harlequins',
  leagues_of_votann:    'Leagues of Votann',
  tyranids:             'Tyranids',
  horus_heresy:         'Horus Heresy Legiones Astartes',
  legio_titanicus:      'Horus Heresy Forces of the Machine God',
  legion_of_the_damned: 'Legion of the Damned',
  horus_heresy_loyal:   'Horus Heresy: Loyal Legions',
  horus_heresy_traitor: 'Horus Heresy: Traitor Legions',
};

/** Loader key → display name, for the reverse lookup a save path needs. */
export const FACTION_KEYS: Record<string, string> = Object.fromEntries(
  Object.entries(FACTION_NAMES).map(([k, v]) => [v, k]),
);

/**
 * Whatever a stored row holds — a loader key, a display name, null — rendered as a display name.
 *
 * A value that is neither (a supplement, a hand-edited row, a faction added since) is passed
 * through with its underscores turned into spaces rather than dropped: showing something readable
 * beats showing nothing, and beats showing `leagues_of_votann`.
 */
export function factionLabel(v: string | null | undefined): string {
  if (!v) return '';
  if (FACTION_NAMES[v]) return FACTION_NAMES[v];
  if (!v.includes('_')) return v;
  return v.split('_').map(w => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' ');
}

/** The word a faction uses for its veteran-style picks: Knight Households call them Reputations. */
export const usesReputations = (faction: string | undefined | null): boolean => faction === 'Knight Households';

/** The emblem file of a faction when no archetype or Legacy symbol applies. The Horus Heresy books share the Horus Heresy emblem; every other faction's file is its lower-cased, hyphenated name. */
export const factionSymbolFile = (faction: string): string =>
  /^Horus Heresy: /.test(faction) ? '/faction-symbols/horus-heresy.svg' : `/faction-symbols/${faction.toLowerCase().replace(/s+/g, '-').replace(/[^a-z0-9-]/g, '')}.svg`;
