import { useState } from 'react';
import { useArmyStore } from '../store/army';
import { ArmyConfig } from './ArmyConfig';
import { ChangelogModal } from './ChangelogModal';
import { LanguageSelector } from './LanguageSelector';
import { SupplementModal, type SupplementKey } from './SupplementModal';
import { FactionSymbol } from './FactionSymbol';
import { useT, useLanguage, type Language, type TranslationKey } from '../i18n';
import type { SavedArmy } from '../hooks/useSavedArmies';
import { CHANGELOG } from '../data/changelog';

const ANNOUNCEMENT_KEY = 'c40k_announcement_v22_dismissed';

type AnnouncementLang = { title: string; intro: string; engine: string; csm: string; cd: string; sm: string; legacyfix: string; contrib: string; };
const ANNOUNCEMENT_TEXT: Record<Language, AnnouncementLang> = {
  en: {
    title: 'Developer Update — new proactive bug-hunting tool + more fixes',
    intro: 'Hello commanders! Built a new internal tool (scripts/sanity_sweep.ts) that scans the entire ruleset for structural data bugs without waiting for a player report — its first run already caught and fixed several more issues across Eldar, Harlequins, Imperial Guard, Tau, Orks, and Tyranids.',
    engine: '🐛 Several "Character Model" units had the Character keyword silently disabled (Eldar Warlocks, Harlequins Death Jester/Shadowseer, IG Crusaders, Tau Sub-Commander) — same bug shape as the Enginseer fix in GH#25, now closed everywhere.',
    csm: '🐛 Tyranids Trygon\'s "select any number of Biomorphs" upgrade had nothing to select (a phrasing variant of GH#21 the original fix missed); Orks Battle Fortress/Stompa\'s Supa rokkit/Grot bomm upgrades and Tau Piranha\'s Hunter-seeker missile upgrade were unbuyable despite showing a price.',
    cd:  '🐛 IG Atlas Recovery Vehicle was incorrectly tagged as a Character Model (confirmed with the rules author: it\'s a plain Vehicle) — fixed.',
    sm:  '✅ The new sweep also checked for dangling slot references, "ghost weapon" swap bugs, and duplicate weapon entries across all 19 factions — all came back clean, a good sign for the data\'s overall health.',
    legacyfix: '📖 Full list of fixes in the changelog (v1.19) and Known Issues page.',
    contrib: '👷 Found a bug? File it on GitHub or post in Discord — every report keeps getting fixed.',
  },
  de: {
    title: 'Entwickler-Update — neues proaktives Bug-Hunting-Tool + weitere Fixes',
    intro: 'Hallo Kommandanten! Ein neues internes Tool (scripts/sanity_sweep.ts) durchsucht das gesamte Regelwerk nach strukturellen Datenfehlern, ohne auf einen Spielerbericht zu warten — schon der erste Lauf hat weitere Bugs in Eldar, Harlequins, Imperial Guard, Tau, Orks und Tyranids gefunden und behoben.',
    engine: '🐛 Mehrere "Character Model"-Einheiten hatten das Character-Keyword unbemerkt deaktiviert (Eldar Warlocks, Harlequins Death Jester/Shadowseer, IG Crusaders, Tau Sub-Commander) — gleiche Bugform wie der Enginseer-Fix in GH#25, jetzt überall behoben.',
    csm: '🐛 Tyranids Trygons "Biomorphe auswählen"-Upgrade hatte nichts zur Auswahl (eine Textvariante von GH#21, die der ursprüngliche Fix übersehen hat); Orks Battle Fortress/Stompa\'s Supa-Rokkit/Grot-Bomm-Upgrades und Tau Piranhas Hunter-Seeker-Missile-Upgrade waren trotz angezeigtem Preis nicht kaufbar.',
    cd:  '🐛 IG Atlas Recovery Vehicle war fälschlich als Character Model markiert (mit dem Regelautor bestätigt: es ist ein reines Vehicle) — behoben.',
    sm:  '✅ Der neue Sweep prüfte zusätzlich auf hängende Slot-Referenzen, "Geisterwaffen"-Tauschbugs und doppelte Waffeneinträge über alle 19 Fraktionen hinweg — alles kam sauber zurück, ein gutes Zeichen für die Datenqualität insgesamt.',
    legacyfix: '📖 Vollständige Liste im Changelog (v1.19) und auf der Known-Issues-Seite.',
    contrib: '👷 Bug gefunden? Meldet ihn auf GitHub oder im Discord — jeder Bericht wird weiterhin behoben.',
  },
  es: {
    title: 'Actualización del desarrollador — nueva herramienta de caza proactiva de bugs + más arreglos',
    intro: '¡Hola comandantes! Construimos una nueva herramienta interna (scripts/sanity_sweep.ts) que escanea todo el reglamento buscando bugs estructurales de datos sin esperar a que un jugador los reporte — ya en su primera pasada encontró y arregló varios bugs más en Eldar, Harlequins, Imperial Guard, Tau, Orks y Tyranids.',
    engine: '🐛 Varias unidades "Character Model" tenían el keyword Character desactivado en silencio (Eldar Warlocks, Harlequins Death Jester/Shadowseer, IG Crusaders, Tau Sub-Commander) — misma forma de bug que el fix del Enginseer en GH#25, ahora cerrada en todos los casos.',
    csm: '🐛 El upgrade "seleccionar cualquier número de Biomorfos" del Trygon de Tyranids no tenía nada para elegir (una variante de texto de GH#21 que el fix original no detectó); los upgrades de Supa rokkit/Grot bomm de Battle Fortress/Stompa de Orks y el de Hunter-seeker missile del Piranha de Tau no se podían comprar pese a mostrar precio.',
    cd:  '🐛 El Atlas Recovery Vehicle de IG estaba mal etiquetado como Character Model (confirmado con el creador de las reglas: es un Vehicle normal) — arreglado.',
    sm:  '✅ El nuevo barrido también revisó referencias de slot colgantes, bugs de "arma fantasma" en swaps, y armas duplicadas en las 19 facciones — todo salió limpio, buena señal para la salud general de los datos.',
    legacyfix: '📖 Lista completa en el changelog (v1.19) y en la página de Known Issues.',
    contrib: '👷 ¿Encontraste un bug? Repórtalo en GitHub o en Discord — todos los reportes se siguen arreglando.',
  },
};

/** Renders "bold headline — detail" when the text contains an em-dash split; falls back to a
 * plain paragraph when it doesn't, instead of leaving a dangling " — " with nothing after it. */
function BoldSplitLine({ text }: { text: string }) {
  const parts = text.split(' — ');
  if (parts.length < 2) return <p>{text}</p>;
  return <p><strong className="text-emerald-400">{parts[0]}</strong> — {parts.slice(1).join(' — ')}</p>;
}

function CommunityAnnouncement() {
  const { language } = useLanguage();
  const tx = ANNOUNCEMENT_TEXT[language];
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(ANNOUNCEMENT_KEY) === 'true'
  );
  if (dismissed) return null;
  return (
    <div className="bg-zinc-900 border-l-4 border-amber-700 border border-zinc-700 px-5 py-4 mb-6">
      <div className="flex justify-between items-start gap-4">
        <div className="text-[11px] text-amber-600 uppercase tracking-widest font-semibold mb-2">
          {tx.title}
        </div>
        <button
          onClick={() => { localStorage.setItem(ANNOUNCEMENT_KEY, 'true'); setDismissed(true); }}
          className="text-zinc-600 hover:text-zinc-300 text-lg leading-none shrink-0"
          title="Dismiss"
        >
          ×
        </button>
      </div>
      <div className="text-[12px] text-zinc-300 leading-relaxed space-y-2">
        <p>{tx.intro}</p>
        <p className="text-amber-300/80">{tx.engine}</p>
        <BoldSplitLine text={tx.csm} />
        <BoldSplitLine text={tx.cd} />
        <BoldSplitLine text={tx.sm} />
        <p className="text-orange-300/80">{tx.legacyfix}</p>
        <p className="text-zinc-400">{tx.contrib}</p>
      </div>
    </div>
  );
}

type FactionStatus = 'complete' | 'testing' | 'inreview' | 'unreviewed';

interface FactionDef {
  key: string;
  name: string;
  available: boolean;
  status: FactionStatus;
}

interface Category {
  name: string;
  icon: string;
  pillFg: string;
  dividerColor: string;
  factions: FactionDef[];
}

const STATUS_DOT: Record<FactionStatus, string> = {
  complete:   'bg-green-500',
  testing:    'bg-amber-400',
  inreview:   'bg-orange-500',
  unreviewed: 'bg-red-500',
};

const STATUS_I18N_KEY: Record<FactionStatus, TranslationKey> = {
  complete:   'fullyReviewed',
  testing:    'needsTesting',
  inreview:   'inReview',
  unreviewed: 'notReviewed',
};

const CATEGORIES: Category[] = [
  {
    name: 'Chaos',
    icon: '/category-icons/chaos.svg',
    pillFg: '#cc8888', dividerColor: '#3a1a1a',
    factions: [
      { key: 'chaos_space_marines', name: 'Chaos Space Marines', available: true, status: 'complete' },
      { key: 'chaos_daemons',       name: 'Chaos Daemons',       available: true, status: 'complete' },
    ],
  },
  {
    name: 'Imperium',
    icon: '/category-icons/imperium.svg',
    pillFg: '#c8b56a', dividerColor: '#3a3520',
    factions: [
      { key: 'space_marines',      name: 'Space Marines',      available: true, status: 'complete' },
      { key: 'imperial_guard',     name: 'Imperial Guard',     available: true, status: 'testing' },
      { key: 'adeptus_mechanicus', name: 'Adeptus Mechanicus', available: true, status: 'testing' },
      { key: 'adeptus_custodes',   name: 'Adeptus Custodes',   available: true, status: 'testing' },
      { key: 'adeptus_sororitas',  name: 'Adeptus Sororitas',  available: true, status: 'testing' },
      { key: 'grey_knights',       name: 'Grey Knights',       available: true, status: 'testing' },
      { key: 'inquisition',        name: 'Inquisition',        available: true, status: 'testing' },
    ],
  },
  {
    name: 'Xenos',
    icon: '/category-icons/xenos.svg',
    pillFg: '#6ab88a', dividerColor: '#1a3a28',
    factions: [
      { key: 'tau_empire',        name: 'Tau Empire',        available: true, status: 'testing' },
      { key: 'necrons',           name: 'Necrons',           available: true, status: 'testing' },
      { key: 'orks',              name: 'Orks',              available: true, status: 'testing' },
      { key: 'eldar',             name: 'Eldar',             available: true, status: 'testing' },
      { key: 'dark_eldar',        name: 'Dark Eldar',        available: true, status: 'testing' },
      { key: 'genestealer_cults', name: 'Genestealer Cults', available: true, status: 'testing' },
      { key: 'harlequins',        name: 'Harlequins',        available: true, status: 'testing' },
      { key: 'leagues_of_votann', name: 'Leagues of Votann', available: true, status: 'testing' },
      { key: 'tyranids',          name: 'Tyranids',          available: true, status: 'testing' },
    ],
  },
];

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

interface Props {
  selectedFaction: string | null;
  loading: boolean;
  saves: SavedArmy[];
  onSelectFaction: (key: string | null) => void;
  onBuild: () => void;
  onLoadArmy: (save: SavedArmy) => void;
  onDeleteArmy: (id: string) => void;
  hideArmyConfig?: boolean;
}

export function LandingPage({
  selectedFaction, loading, saves,
  onSelectFaction, onBuild, onLoadArmy, onDeleteArmy,
  hideArmyConfig = false,
}: Props) {
  const { data } = useArmyStore();
  const [showChangelog, setShowChangelog] = useState(false);
  const [openSupplement, setOpenSupplement] = useState<SupplementKey | null>(null);
  const latestVersion = CHANGELOG[0]?.version ?? '';
  const t = useT();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">

      {/* ── Header ── */}
      <header className="bg-zinc-900 border-b-2 border-amber-900/60 px-6 py-7">
        <div className="flex items-center justify-between max-w-screen-lg mx-auto gap-4">
          <LanguageSelector />
          <div className="flex-1 text-center">
            <img
              src="/wh40k-logo.webp"
              alt="Warhammer 40,000"
              className="h-16 mx-auto mb-1 object-contain"
              style={{ filter: 'sepia(1) saturate(4) hue-rotate(-10deg) brightness(1.05)' }}
              draggable={false}
            />
            <p className="text-zinc-500 text-sm">
              {t('appSubtitle')}
            </p>
            <p className="text-zinc-400 text-[10px] italic mt-2 font-cinzel tracking-wide">
              "{t('landingQuote')}"
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <a
              href="https://custom40k-wiki.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] uppercase tracking-wide border border-zinc-700 hover:border-amber-800 text-zinc-400 hover:text-amber-400 px-3 py-1.5 transition-colors"
            >
              Wiki
            </a>
            <button
              onClick={() => setShowChangelog(true)}
              className="text-[11px] uppercase tracking-wide border border-zinc-700 hover:border-amber-800 text-zinc-400 hover:text-amber-400 px-3 py-1.5 transition-colors"
            >
              {t('updates')} <span className="text-amber-700">v{latestVersion}</span>
            </button>
          </div>
        </div>
      </header>

      {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
      {openSupplement && <SupplementModal supplement={openSupplement} onClose={() => setOpenSupplement(null)} />}

      <div className="max-w-screen-lg mx-auto px-4 py-8 space-y-10">

        <CommunityAnnouncement />

        {/* ── Saved armies ── */}
        {saves.length > 0 && (
          <section>
            <h2 className="text-[11px] uppercase tracking-widest text-amber-700 mb-4">
              {t('savedArmies')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {saves.map(save => (
                <div
                  key={save.id}
                  className="bg-zinc-900 border border-zinc-700 border-l-4 border-l-amber-800 p-3 flex flex-col gap-2 rounded-sm"
                >
                  <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <FactionSymbol factionKey={save.factionKey} size={28} />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-zinc-100 truncate">{save.name}</div>
                        <div className="text-[10px] text-amber-700 uppercase tracking-wide mt-0.5">{save.factionLabel}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteArmy(save.id)}
                      className="text-zinc-600 hover:text-red-400 text-lg leading-none shrink-0 transition-colors"
                      title={t('delete')}
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                    <span>{save.unitCount} {t('models')}</span>
                    <span>·</span>
                    <span>{save.totalPts} {t('points')}</span>
                    <span>·</span>
                    <span>{formatDate(save.savedAt)}</span>
                  </div>
                  <button
                    onClick={() => onLoadArmy(save)}
                    className="mt-1 w-full text-center text-[11px] uppercase tracking-wide py-1.5 bg-amber-900/30 border border-amber-800/60 text-amber-400 hover:bg-amber-800/40 transition-colors"
                  >
                    {t('loadArmy')}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Faction selection ── */}
        <section>
          {/* Legend */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[11px] uppercase tracking-widest text-amber-700">{t('selectFaction')}</h2>
            <div className="flex items-center gap-3 text-[10px] text-zinc-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />{t('fullyReviewed')}</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />{t('needsTesting')}</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />{t('inReview')}</span>
            </div>
          </div>

          <div className="space-y-7">
            {CATEGORIES.map(cat => (
              <div key={cat.name}>
                {/* Category header: icon + name + divider */}
                <div className="flex items-center gap-2.5 mb-3">
                  <img
                    src={cat.icon}
                    alt={cat.name}
                    className="shrink-0"
                    style={{ width: 52, height: 52, filter: 'brightness(0) invert(1)', opacity: 0.60 }}
                  />
                  <span
                    className="font-cinzel text-[11px] uppercase tracking-widest shrink-0"
                    style={{ color: cat.pillFg }}
                  >
                    {cat.name}
                  </span>
                  <div className="flex-1 h-px" style={{ background: cat.dividerColor }} />
                </div>

                {/* Faction cards */}
                <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
                  {cat.factions.map(f => {
                    const isSelected = selectedFaction === f.key;
                    return (
                      <button
                        key={f.key}
                        onClick={() => f.available && onSelectFaction(isSelected ? null : f.key)}
                        disabled={!f.available}
                        className={`
                          relative flex flex-col items-center gap-2 pt-4 pb-3 px-2 border rounded-lg text-center transition-all
                          ${!f.available
                            ? 'border-zinc-800 bg-zinc-900/50 cursor-not-allowed opacity-40'
                            : isSelected
                              ? 'border-amber-600 bg-zinc-800 ring-1 ring-amber-700/50'
                              : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500 hover:bg-zinc-800 cursor-pointer'
                          }
                        `}
                      >
                        {/* Status dot */}
                        {f.available && (
                          <div
                            className={`absolute top-2 right-2 w-2 h-2 rounded-full ${STATUS_DOT[f.status]}`}
                            title={t(STATUS_I18N_KEY[f.status])}
                          />
                        )}

                        <FactionSymbol factionKey={f.key} size={40} />

                        <span className={`text-[11px] leading-tight ${isSelected ? 'text-amber-400' : 'text-zinc-300'}`}>
                          {f.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Army configuration ── */}
        {!hideArmyConfig && selectedFaction && (
          <section>
            <h2 className="text-[11px] uppercase tracking-widest text-amber-700 mb-4">
              {t('armyConfiguration')}
            </h2>
            {loading || !data ? (
              <div className="flex items-center gap-3 text-zinc-500 py-8">
                <div className="w-5 h-5 border-2 border-amber-700 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">{t('loadingFactionData')}</span>
              </div>
            ) : (
              <div className="bg-zinc-900 border border-zinc-700 border-l-4 border-l-amber-800 p-4">
                <ArmyConfig />
              </div>
            )}
          </section>
        )}

        {/* ── Build button ── */}
        {!hideArmyConfig && data && selectedFaction && (
          <div className="flex justify-center pt-2">
            <button
              onClick={onBuild}
              className="px-10 py-3 bg-amber-800 border-2 border-amber-600 text-white font-bold uppercase tracking-widest text-sm hover:bg-amber-700 transition-colors"
            >
              {t('buildArmy')}
            </button>
          </div>
        )}

        {/* ── Supplements ── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-zinc-800 text-zinc-500 shrink-0">
              {t('supplements')}
            </span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>
          <p className="text-zinc-500 text-[11px] mb-4">
            {t('supplementsDesc')}
          </p>
          <div className="flex flex-wrap gap-3">

            <div className="bg-zinc-900 border-2 border-zinc-700 border-l-4 border-l-red-900 p-4 min-w-[220px] flex-1 max-w-xs flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: '#2d1010', padding: 4 }}>
                    <img src="/faction-symbols/horus-heresy.svg" alt="Eye of Horus" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(0) invert(1) opacity(0.85)' }} draggable={false} />
                  </div>
                  <div>
                    <div className="text-zinc-100 font-bold text-sm uppercase tracking-wide">Horus Heresy</div>
                    <div className="text-red-700 text-[10px] uppercase tracking-widest mt-0.5">Space Marines</div>
                  </div>
                </div>
                <span className="text-[10px] border border-amber-700 text-amber-500 px-1.5 py-0.5 uppercase tracking-wide shrink-0">Beta</span>
              </div>
              <div className="text-[10px] text-red-500/80 uppercase tracking-wide">⚙ {t('hhRequires')}</div>
              <p className="text-zinc-500 text-[12px] leading-snug">
                {t('hhDesc')}
              </p>
              <button
                onClick={() => setOpenSupplement('horus_heresy')}
                className="mt-auto w-full text-center text-[11px] uppercase tracking-wide py-1.5 bg-red-900/20 border border-red-900/50 text-red-400 hover:bg-red-900/40 transition-colors"
              >
                {t('viewCatalog')} ▶
              </button>
            </div>

            <div className="bg-zinc-900 border-2 border-zinc-700 border-l-4 border-l-amber-800 p-4 min-w-[220px] flex-1 max-w-xs flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: '#1a1a2a', padding: 4 }}>
                    <img src="/faction-symbols/escalation.svg" alt="Escalation" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(0) invert(1) opacity(0.85)' }} draggable={false} />
                  </div>
                  <div>
                    <div className="text-zinc-100 font-bold text-sm uppercase tracking-wide">Escalation</div>
                    <div className="text-amber-700 text-[10px] uppercase tracking-widest mt-0.5">Lords of War</div>
                  </div>
                </div>
                <span className="text-[10px] border border-amber-700 text-amber-500 px-1.5 py-0.5 uppercase tracking-wide shrink-0">Beta</span>
              </div>
              <div className="text-[10px] text-amber-500/80 uppercase tracking-wide">⚙ {t('escRequires')}</div>
              <p className="text-zinc-500 text-[12px] leading-snug">
                {t('escDesc')}
              </p>
              <button
                onClick={() => setOpenSupplement('escalation')}
                className="mt-auto w-full text-center text-[11px] uppercase tracking-wide py-1.5 bg-amber-900/20 border border-amber-900/50 text-amber-400 hover:bg-amber-900/40 transition-colors"
              >
                {t('viewCatalog')} ▶
              </button>
            </div>

            <div className="bg-zinc-900 border-2 border-zinc-700 border-l-4 border-l-zinc-500 p-4 min-w-[220px] flex-1 max-w-xs flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: '#1a1a2a', padding: 4 }}>
                    <img src="/faction-symbols/assassins.svg" alt="Officio Assassinorum" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(0) invert(1) opacity(0.85)' }} draggable={false} />
                  </div>
                  <div>
                    <div className="text-zinc-100 font-bold text-sm uppercase tracking-wide">Assassins</div>
                    <div className="text-zinc-500 text-[10px] uppercase tracking-widest mt-0.5">Officio Assassinorum</div>
                  </div>
                </div>
                <span className="text-[10px] border border-zinc-600 text-zinc-400 px-1.5 py-0.5 uppercase tracking-wide shrink-0">Chaos · Imperial</span>
              </div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wide">✓ {t('assAlwaysAvailable')}</div>
              <p className="text-zinc-500 text-[12px] leading-snug">
                {t('assDesc')}
              </p>
              <button
                onClick={() => setOpenSupplement('assassins')}
                className="mt-auto w-full text-center text-[11px] uppercase tracking-wide py-1.5 bg-zinc-800/50 border border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition-colors"
              >
                {t('viewCatalog')} ▶
              </button>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}
