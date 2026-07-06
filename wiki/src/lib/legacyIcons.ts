// Mirrors src/utils/getArmySymbolUrl.ts's archetype/legacy name -> icon tables, plus a second
// table keyed by the armory_legions Record key (Legion/Chapter/Forge World/Craftworld/Order name)
// used by src/data/loaders.ts, for the Armory page's per-key section headers.

const CSM_ARCHETYPE_SYMBOL: Record<string, string> = {
  'All is Dust':               '/legion-symbols/thousand-sons.svg',
  'Ambition for Perfection':   '/legion-symbols/emperors-children.svg',
  'Blood for the Blood God!':  '/legion-symbols/world-eaters.svg',
  'Plaguehost':                '/legion-symbols/death-guard.svg',
  // Grants access to the Horus Heresy Space Marines supplement — same icon as that supplement.
  'Legion':                    '/faction-symbols/horus-heresy.svg',
};

const CSM_LEGACY_SYMBOL: Record<string, string> = {
  'Legacy of the Arch Traitor':  '/legion-symbols/word-bearers.svg',
  'Legacy of the Hydra':         '/legion-symbols/alpha-legion.svg',
  'Legacy of the Iron Lord':     '/legion-symbols/iron-warriors.svg',
  'Legacy of the Night Haunter': '/legion-symbols/night-lords.svg',
  'Legacy of the Warmaster':     '/legion-symbols/black-legion.svg',
};

const SM_ARCHETYPE_SYMBOL: Record<string, string> = {
  'Renegades': '/legion-symbols/renegade-and-heretics.svg',
  // Grants access to the Horus Heresy Space Marines supplement — same icon as that supplement.
  'Legion (Space Marines)': '/faction-symbols/horus-heresy.svg',
};

const SM_LEGACY_SYMBOL: Record<string, string> = {
  'Legacy of the Angel':         '/legion-symbols/blood-angels.svg',
  'Legacy of the Lion':          '/legion-symbols/dark-angels.svg',
  'Legacy of the Wolf':          '/legion-symbols/space-wolves.svg',
  'Legacy of the Praetorian':    '/legion-symbols/imperial-fists.svg',
  'Legacy of the Khan':          '/legion-symbols/white-scars.svg',
  'Legacy of the Crusader':      '/legion-symbols/black-templars.svg',
  'Legacy of the Alien Hunters': '/legion-symbols/deathwatch.svg',
  'Legacy of Aurelia':           '/legion-symbols/blood-ravens.svg',
  'Legacy of the Damned':        '/legion-symbols/skull-01.svg',
};

const CD_ARCHETYPE_SYMBOL: Record<string, string> = {
  'Goretide':                       '/legion-symbols/khorne-god.svg',
  'Figureheads of The Dark Prince': '/legion-symbols/slaanesh-god.svg',
  'Host Duplicitous':               '/legion-symbols/tzeentch-god.svg',
  'Popping Plague':                 '/legion-symbols/nurgle-god.svg',
};

const ADMECH_ARCHETYPE_SYMBOL: Record<string, string> = {
  'Cybernetica Cohort':     '/legion-symbols/admech-cybernetica.svg',
  'Dark Mechanicum':        '/legion-symbols/admech-dark-mechanicum.svg',
  // 'Ordo Reductor Covenant' has no dedicated icon asset — no entry rather than a broken <img>.
  'Titan Legion':           '/legion-symbols/admech-collegia-titanica.svg',
};

const ADMECH_LEGACY_SYMBOL: Record<string, string> = {
  'Legacy of the Gleaming Giant':   '/legion-symbols/admech-metalica.svg',
  'Legacy of the Hollow World':     '/legion-symbols/admech-lucius.svg',
  'Legacy of the Morning Star':     '/legion-symbols/admech-graia.svg',
  'Legacy of the Omnissiah Igvita': '/legion-symbols/admech-ryza.svg',
  'Legacy of the Red Planet':       '/legion-symbols/admech-mars.svg',
  'Legacy of a Thousand Scars':     '/legion-symbols/admech-agripinaa.svg',
  'Legacy of the Xenarites':        '/legion-symbols/admech-stygies-viii.svg',
};

const ELDAR_ARCHETYPE_SYMBOL: Record<string, string> = {
  'Ynnari': '/legion-symbols/ynnari.svg',
};

const ELDAR_LEGACY_SYMBOL: Record<string, string> = {
  'Fieldcraft':              '/legion-symbols/eldar-alaitoc.svg',
  'Foresight of the Damned': '/legion-symbols/eldar-altansar.svg',
  'Swordwind':               '/legion-symbols/eldar-biel-tan.svg',
  'Stoic Endurance':         '/legion-symbols/eldar-iyanden.svg',
  'Wild Host':               '/legion-symbols/eldar-saim-hann.svg',
};

const DE_ARCHETYPE_SYMBOL: Record<string, string> = {
  'Ynnari': '/legion-symbols/ynnari.svg',
};

const TAU_ARCHETYPE_SYMBOL: Record<string, string> = {
  'Farsight Enclave':   '/legion-symbols/tau-farsight.svg',
  'Kroot Hunting Pack': '/legion-symbols/tau-kroot.svg',
};

const NECRONS_ARCHETYPE_SYMBOL: Record<string, string> = {
  'Yngir': '/legion-symbols/necrons-ctan.svg',
};

const ORKS_ARCHETYPE_SYMBOL: Record<string, string> = {
  'Speedfreaks': '/legion-symbols/orks-evil-sunz.svg',
};

const ORKS_LEGACY_SYMBOL: Record<string, string> = {
  "Da 'ardest Boyz":  '/legion-symbols/orks-goffs.svg',
  'Da Rich Boyz':     '/legion-symbols/orks-bad-moons.svg',
  'Da Lootaz':        '/legion-symbols/orks-deathskulls.svg',
  'Da Speedfreaks':   '/legion-symbols/orks-evil-sunz.svg',
  "Da Squig-Luvvas":  '/legion-symbols/orks-snakebites.svg',
  'Da Sneaky Gitz':   '/legion-symbols/orks-blood-axes.svg',
};

const IG_ARCHETYPE_SYMBOL: Record<string, string> = {
  'Brood Brothers':  '/legion-symbols/ig-brood-brothers.svg',
  "Gue'vesa":        '/legion-symbols/ig-gueVesa.svg',
  'Traitor Guard':   '/legion-symbols/ig-lost-and-damned.svg',
  'Jungle Fighters': '/legion-symbols/ig-catachan.svg',
};

const SORORITAS_LEGACY_SYMBOL: Record<string, string> = {
  'Blind Faith':             '/legion-symbols/sororitas-valorous-heart.svg',
  'Cleansing Flames':        '/legion-symbols/sororitas-ebon-chalice.svg',
  'Faith Is Our Shield':     '/legion-symbols/sororitas-argent-shroud.svg',
  'Honour The Martyrs':      '/legion-symbols/sororitas-our-martyred-lady.svg',
  'Tear Them Down':          '/legion-symbols/sororitas-bloody-rose.svg',
  "The Emperor's Judgement": '/legion-symbols/sororitas-sacred-rose.svg',
};

/** archetype/legacy NAME -> icon, per faction (used on the Archetypes & Legacies page). */
const NAME_TABLES: Record<string, Record<string, string>> = {
  chaos_space_marines: { ...CSM_ARCHETYPE_SYMBOL, ...CSM_LEGACY_SYMBOL },
  chaos_daemons:       { ...CD_ARCHETYPE_SYMBOL },
  space_marines:       { ...SM_ARCHETYPE_SYMBOL, ...SM_LEGACY_SYMBOL },
  adeptus_mechanicus:  { ...ADMECH_ARCHETYPE_SYMBOL, ...ADMECH_LEGACY_SYMBOL },
  eldar:               { ...ELDAR_ARCHETYPE_SYMBOL, ...ELDAR_LEGACY_SYMBOL },
  dark_eldar:          { ...DE_ARCHETYPE_SYMBOL },
  tau_empire:          { ...TAU_ARCHETYPE_SYMBOL },
  necrons:             { ...NECRONS_ARCHETYPE_SYMBOL },
  orks:                { ...ORKS_ARCHETYPE_SYMBOL, ...ORKS_LEGACY_SYMBOL },
  imperial_guard:      { ...IG_ARCHETYPE_SYMBOL },
  adeptus_sororitas:   { ...SORORITAS_LEGACY_SYMBOL },
};

/** armory_legions Record key -> icon.  Key = the label used in armoryFaction (the string passed
 *  as the object key to assemble() in factionExtras.ts).  Factions where every sub-faction has
 *  its own armory JSON (CSM marks/legions, SM chapters) get one entry per chapter/mark; factions
 *  that aggregate everything into one key (Eldar "Craftworld", AdMech "Forge World", etc.) get a
 *  single entry for that aggregate label, using the faction symbol as representative icon. */
const ARMORY_KEY_TABLES: Record<string, Record<string, string>> = {
  chaos_space_marines: {
    'Word Bearers':  '/legion-symbols/word-bearers.svg',
    'Alpha Legion':  '/legion-symbols/alpha-legion.svg',
    'Iron Warriors': '/legion-symbols/iron-warriors.svg',
    'Night Lords':   '/legion-symbols/night-lords.svg',
    'Black Legion':  '/legion-symbols/black-legion.svg',
    'Khorne':        '/legion-symbols/khorne-god.svg',
    'Nurgle':        '/legion-symbols/nurgle-god.svg',
    'Slaanesh':      '/legion-symbols/slaanesh-god.svg',
    'Tzeentch':      '/legion-symbols/tzeentch-god.svg',
  },
  chaos_daemons: {
    'Khorne':   '/legion-symbols/khorne-god.svg',
    'Nurgle':   '/legion-symbols/nurgle-god.svg',
    'Slaanesh': '/legion-symbols/slaanesh-god.svg',
    'Tzeentch': '/legion-symbols/tzeentch-god.svg',
  },
  inquisition: {
    'Ordo Hereticus': '/faction-symbols/inquisition.svg',
    'Ordo Malleus':   '/faction-symbols/inquisition.svg',
    'Ordo Xenos':     '/faction-symbols/inquisition.svg',
  },
  space_marines: {
    'Blood Angels':   '/legion-symbols/blood-angels.svg',
    'Dark Angels':    '/legion-symbols/dark-angels.svg',
    'Space Wolves':   '/legion-symbols/space-wolves.svg',
    'Imperial Fists': '/legion-symbols/imperial-fists.svg',
    'White Scars':    '/legion-symbols/white-scars.svg',
    'Black Templars': '/legion-symbols/black-templars.svg',
    'Death Watch':    '/legion-symbols/deathwatch.svg',
    'Blood Ravens':   '/legion-symbols/blood-ravens.svg',
    'Relictors':      '/legion-symbols/skull-01.svg',
  },
  adeptus_mechanicus: {
    'Forge World': '/faction-symbols/adeptus-mechanicus.svg',
  },
  adeptus_custodes: {
    'Shield Host': '/faction-symbols/adeptus-custodes.svg',
  },
  adeptus_sororitas: {
    'Order': '/faction-symbols/adeptus-sororitas.svg',
  },
  eldar: {
    'Craftworld': '/faction-symbols/eldar.svg',
    'Ynnari':     '/legion-symbols/ynnari.svg',
  },
  dark_eldar: {
    'Kabal': '/faction-symbols/dark-eldar.svg',
    'Wych':  '/faction-symbols/dark-eldar.svg',
    'Coven': '/faction-symbols/dark-eldar.svg',
  },
  tau_empire: {
    'Sept': '/faction-symbols/tau-empire.svg',
  },
  necrons: {
    'Dynasty': '/faction-symbols/necrons.svg',
  },
  orks: {
    'Klan': '/faction-symbols/orks.svg',
  },
  leagues_of_votann: {
    'League': '/faction-symbols/leagues-of-votann.svg',
  },
  tyranids: {
    'Hive Fleet': '/faction-symbols/tyranids.svg',
  },
};

/** Exact match, then prefix match for trailing superscript annotations like "Goretideᴷ" — the
 *  leftover suffix must be non-alphanumeric, otherwise a short key like "Legion" would falsely
 *  match an unrelated word like "Legionnaire Warband". */
function findSymbol(map: Record<string, string> | undefined, key: string | null | undefined): string | null {
  if (!map || !key) return null;
  if (map[key]) return map[key];
  const entry = Object.entries(map).find(([k]) => key.startsWith(k) && !/^[a-z0-9]/i.test(key.slice(k.length)));
  return entry ? entry[1] : null;
}

export function getLegacyIcon(factionKey: string, name: string): string | null {
  return findSymbol(NAME_TABLES[factionKey], name);
}

export function getArmoryKeyIcon(factionKey: string, key: string): string | null {
  return findSymbol(ARMORY_KEY_TABLES[factionKey], key);
}
