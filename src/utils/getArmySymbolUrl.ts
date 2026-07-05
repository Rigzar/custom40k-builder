/**
 * Returns the best SVG symbol URL for an army given its faction + active archetype/legacies.
 * Returns null if no specific override is found (caller should fall back to the faction default).
 *
 * Priority: archetype → legacy1 → legacy2 → null (faction default).
 */

const CSM_ARCHETYPE_SYMBOL: Record<string, string> = {
  'All is Dust':               '/legion-symbols/thousand-sons.svg',
  'Ambition for Perfection':   '/legion-symbols/emperors-children.svg',
  'Blood for the Blood God!':  '/legion-symbols/world-eaters.svg',
  'Plaguehost':                '/legion-symbols/death-guard.svg',
  'Legion':                    '/faction-symbols/horus-heresy.svg',
};

const CSM_LEGACY_SYMBOL: Record<string, string> = {
  'Legacy of the Arch Traitor':  '/legion-symbols/word-bearers.svg',
  'Legacy of the Hydra':         '/legion-symbols/alpha-legion.svg',
  'Legacy of the Iron Lord':     '/legion-symbols/iron-warriors.svg',
  'Legacy of the Night Haunter': '/legion-symbols/night-lords.svg',
  'Legacy of the Warmaster':     '/legion-symbols/black-legion.svg',
  'Word Bearers':                '/legion-symbols/word-bearers.svg',
  'Iron Warriors':               '/legion-symbols/iron-warriors.svg',
  'Black Legion':                '/legion-symbols/black-legion.svg',
};

const SM_ARCHETYPE_SYMBOL: Record<string, string> = {
  'Renegades':             '/legion-symbols/renegade-and-heretics.svg',
  'Legion (Space Marines)':'/faction-symbols/horus-heresy.svg',
};

const SM_LEGACY_SYMBOL: Record<string, string> = {
  'Legacy of the Angel':      '/legion-symbols/blood-angels.svg',
  'Legacy of the Lion':       '/legion-symbols/dark-angels.svg',
  'Legacy of the Wolf':       '/legion-symbols/space-wolves.svg',
  'Legacy of the Praetorian': '/legion-symbols/imperial-fists.svg',
  'Legacy of the Khan':       '/legion-symbols/white-scars.svg',
  'Legacy of the Crusader':   '/legion-symbols/black-templars.svg',
  'Legacy of the Alien Hunters': '/legion-symbols/deathwatch.svg',
  'Legacy of Aurelia':        '/legion-symbols/blood-ravens.svg',
  'Legacy of the Damned':     '/legion-symbols/skull-01.svg',
};

const CD_ARCHETYPE_SYMBOL: Record<string, string> = {
  'Goretide':                        '/legion-symbols/khorne-god.svg',
  'Figureheads of The Dark Prince':  '/legion-symbols/slaanesh-god.svg',
  'Host Duplicitous':                '/legion-symbols/tzeentch-god.svg',
  'Popping Plague':                  '/legion-symbols/nurgle-god.svg',
};

const ADMECH_ARCHETYPE_SYMBOL: Record<string, string> = {
  'Cybernetica Cohort':      '/legion-symbols/admech-cybernetica.svg',
  'Dark Mechanicum':         '/legion-symbols/admech-dark-mechanicum.svg',
  // 'Ordo Reductor Covenant' has no dedicated icon asset — no entry rather than a broken <img>.
  'Titan Legion':            '/legion-symbols/admech-collegia-titanica.svg',
};

const ADMECH_LEGACY_SYMBOL: Record<string, string> = {
  'Legacy of the Gleaming Giant':    '/legion-symbols/admech-metalica.svg',
  'Legacy of the Hollow World':      '/legion-symbols/admech-lucius.svg',
  'Legacy of the Morning Star':      '/legion-symbols/admech-graia.svg',
  'Legacy of the Omnissiah Igvita':  '/legion-symbols/admech-ryza.svg',
  'Legacy of the Red Planet':        '/legion-symbols/admech-mars.svg',
  'Legacy of a Thousand Scars':      '/legion-symbols/admech-agripinaa.svg',
  'Legacy of the Xenarites':         '/legion-symbols/admech-stygies-viii.svg',
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
  'Farsight Enclave':    '/legion-symbols/tau-farsight.svg',
  'Kroot Hunting Pack':  '/legion-symbols/tau-kroot.svg',
};

const NECRONS_ARCHETYPE_SYMBOL: Record<string, string> = {
  'Yngir': '/legion-symbols/necrons-ctan.svg',
};

const ORKS_ARCHETYPE_SYMBOL: Record<string, string> = {
  'Speedfreaks': '/legion-symbols/orks-evil-sunz.svg',
};

const IG_ARCHETYPE_SYMBOL: Record<string, string> = {
  'Brood Brothers':  '/legion-symbols/ig-brood-brothers.svg',
  "Gue'vesa":        '/legion-symbols/ig-gueVesa.svg',
  'Traitor Guard':   '/legion-symbols/ig-lost-and-damned.svg',
  'Jungle Fighters': '/legion-symbols/ig-catachan.svg',
};

const ORKS_LEGACY_SYMBOL: Record<string, string> = {
  "Da 'ardest Boyz": '/legion-symbols/orks-goffs.svg',
  'Da Rich Boyz':    '/legion-symbols/orks-bad-moons.svg',
  'Da Lootaz':       '/legion-symbols/orks-deathskulls.svg',
  'Da Speedfreaks':  '/legion-symbols/orks-evil-sunz.svg',
  "Da Squig-Luvvas": '/legion-symbols/orks-snakebites.svg',
  'Da Sneaky Gitz':  '/legion-symbols/orks-blood-axes.svg',
};

const SORORITAS_LEGACY_SYMBOL: Record<string, string> = {
  'Blind Faith':              '/legion-symbols/sororitas-valorous-heart.svg',
  'Cleansing Flames':         '/legion-symbols/sororitas-ebon-chalice.svg',
  'Faith Is Our Shield':      '/legion-symbols/sororitas-argent-shroud.svg',
  'Honour The Martyrs':       '/legion-symbols/sororitas-our-martyred-lady.svg',
  'Tear Them Down':           '/legion-symbols/sororitas-bloody-rose.svg',
  "The Emperor's Judgement":  '/legion-symbols/sororitas-sacred-rose.svg',
  // The Holy Trinity has no Order-specific logo → falls back to faction default
};

/** Looks up a symbol URL with exact match, then prefix match for trailing superscript
 *  annotations like "Goretideᴷ" — the leftover suffix must be non-alphanumeric, otherwise a
 *  short key could falsely match an unrelated longer word sharing the same prefix. */
function findSymbol(map: Record<string, string>, key: string | null): string | null {
  if (!key) return null;
  if (map[key]) return map[key];
  const entry = Object.entries(map).find(([k]) => key.startsWith(k) && !/^[a-z0-9]/i.test(key.slice(k.length)));
  return entry ? entry[1] : null;
}

function isCsm(faction: string): boolean {
  return faction === 'chaos_space_marines' || /chaos.space.marines/i.test(faction);
}

function isCd(faction: string): boolean {
  return faction === 'chaos_daemons' || /chaos.daemons/i.test(faction);
}

function isAdMech(faction: string): boolean {
  return faction === 'adeptus_mechanicus' || /adeptus.mechanicus/i.test(faction);
}

function isSm(faction: string): boolean {
  return faction === 'space_marines' || /^space.marines$/i.test(faction);
}

function isEldar(faction: string): boolean {
  return faction === 'eldar' || /^eldar$/i.test(faction);
}

function isDe(faction: string): boolean {
  return faction === 'dark_eldar' || /dark.eldar/i.test(faction);
}

function isTau(faction: string): boolean {
  return faction === 'tau_empire' || /tau.empire/i.test(faction);
}

function isNecrons(faction: string): boolean {
  return faction === 'necrons' || /^necrons$/i.test(faction);
}

function isOrks(faction: string): boolean {
  return faction === 'orks' || /^orks$/i.test(faction);
}

function isIg(faction: string): boolean {
  return faction === 'imperial_guard' || /imperial.guard/i.test(faction);
}

function isSororitas(faction: string): boolean {
  return faction === 'adeptus_sororitas' || /adeptus.sororitas/i.test(faction);
}

function getSymbols(
  faction: string,
  archetype: string | null,
  legacy: string | null,
  legacy2: string | null,
): { archetypeSymbol: string | null; legacySymbol: string | null } {
  if (isCsm(faction)) return {
    archetypeSymbol: findSymbol(CSM_ARCHETYPE_SYMBOL, archetype),
    legacySymbol:    findSymbol(CSM_LEGACY_SYMBOL, legacy) ?? findSymbol(CSM_LEGACY_SYMBOL, legacy2),
  };
  if (isSm(faction)) return {
    archetypeSymbol: findSymbol(SM_ARCHETYPE_SYMBOL, archetype),
    legacySymbol:    findSymbol(SM_LEGACY_SYMBOL, legacy) ?? findSymbol(SM_LEGACY_SYMBOL, legacy2),
  };
  if (isAdMech(faction)) return {
    archetypeSymbol: findSymbol(ADMECH_ARCHETYPE_SYMBOL, archetype),
    legacySymbol:    findSymbol(ADMECH_LEGACY_SYMBOL, legacy) ?? findSymbol(ADMECH_LEGACY_SYMBOL, legacy2),
  };
  if (isEldar(faction)) return {
    archetypeSymbol: findSymbol(ELDAR_ARCHETYPE_SYMBOL, archetype),
    legacySymbol:    findSymbol(ELDAR_LEGACY_SYMBOL, legacy) ?? findSymbol(ELDAR_LEGACY_SYMBOL, legacy2),
  };
  if (isOrks(faction)) return {
    archetypeSymbol: findSymbol(ORKS_ARCHETYPE_SYMBOL, archetype),
    legacySymbol:    findSymbol(ORKS_LEGACY_SYMBOL, legacy) ?? findSymbol(ORKS_LEGACY_SYMBOL, legacy2),
  };
  if (isSororitas(faction)) return {
    archetypeSymbol: null,
    legacySymbol:    findSymbol(SORORITAS_LEGACY_SYMBOL, legacy) ?? findSymbol(SORORITAS_LEGACY_SYMBOL, legacy2),
  };
  if (isCd(faction))      return { archetypeSymbol: findSymbol(CD_ARCHETYPE_SYMBOL, archetype),      legacySymbol: null };
  if (isDe(faction))      return { archetypeSymbol: findSymbol(DE_ARCHETYPE_SYMBOL, archetype),      legacySymbol: null };
  if (isTau(faction))     return { archetypeSymbol: findSymbol(TAU_ARCHETYPE_SYMBOL, archetype),     legacySymbol: null };
  if (isNecrons(faction)) return { archetypeSymbol: findSymbol(NECRONS_ARCHETYPE_SYMBOL, archetype), legacySymbol: null };
  if (isIg(faction))      return { archetypeSymbol: findSymbol(IG_ARCHETYPE_SYMBOL, archetype),      legacySymbol: null };
  return { archetypeSymbol: null, legacySymbol: null };
}

export function getArmySymbolUrl(
  faction: string | null,
  archetype: string | null,
  legacy: string | null,
  legacy2: string | null = null,
): string | null {
  if (!faction) return null;
  const { archetypeSymbol, legacySymbol } = getSymbols(faction, archetype, legacy, legacy2);
  return archetypeSymbol ?? legacySymbol;
}

/**
 * Returns up to two symbol URLs for the army badge.
 * primary  = archetype symbol if present, else legacy symbol.
 * secondary = legacy symbol only when archetype already occupied primary (both have symbols).
 */
export function getArmySymbolPair(
  faction: string | null,
  archetype: string | null,
  legacy: string | null,
  legacy2: string | null = null,
): { primary: string | null; secondary: string | null } {
  if (!faction) return { primary: null, secondary: null };
  const { archetypeSymbol, legacySymbol } = getSymbols(faction, archetype, legacy, legacy2);
  const primary   = archetypeSymbol ?? legacySymbol;
  const secondary = archetypeSymbol && legacySymbol ? legacySymbol : null;
  return { primary, secondary };
}
