import { useState } from 'react';
import { useArmyStore } from '../store/army';
import { ArmyConfig } from './ArmyConfig';
import { ChangelogModal } from './ChangelogModal';
import { LegalFooter } from './LegalModal';
import { LanguageSelector } from './LanguageSelector';
import { SupplementModal, type SupplementKey } from './SupplementModal';
import { FactionSymbol } from './FactionSymbol';
import { useT, useLanguage, type Language, type TranslationKey } from '../i18n';
import type { SavedArmy } from '../hooks/useSavedArmies';
import { CHANGELOG } from '../data/changelog';

const ANNOUNCEMENT_KEY = 'c40k_announcement_v8_dismissed';

type AnnouncementLang = { title: string; intro: string; engine: string; csm: string; cd: string; sm: string; legacyfix: string; contrib: string; };
const ANNOUNCEMENT_TEXT: Record<Language, AnnouncementLang> = {
  en: {
    title: 'Developer Update — All 19 factions fully audited',
    intro: 'Hello commanders! Every faction (plus the Escalation and Horus Heresy supplements) has now been through a full line-by-line ODS audit. The builder is feature-complete for list-building across the entire roster.',
    engine: '⚙ Inquisition: removed the old per-model "Ordo Hereticus/Malleus/Xenos" armory pick — the canonical rules never actually had it. Ordo armory access now comes exclusively from the Army Customisation Legacy.',
    csm: '✓ Imperial Guard: Traitor Guard, Brood Brothers and Gue\'vesa archetypes now actually grant their "may also use the <Faction> Armory" clause — a dedicated Armoury tab gives ongoing access to the Chaos Space Marine / Genestealer Cult / Tau Empire general Armory, without opening that faction\'s unit roster.',
    cd:  '✓ Adeptus Mechanicus: Canticles of the Omnissiah implemented in full — Legacy canticles auto-apply, base canticles show as reference text on the unit card.',
    sm:  '✓ Cross-faction sweep: fixed several "swap weapon" options that were silently breaking on multi-model squads (Orks Boyz/Skarboyz, Necrons Immortals/Warriors), an Adeptus Custodes embark-restriction gap, and a Horus Heresy armour double-count risk.',
    legacyfix: '🗓 Known Issues panel reflects the current state — most remaining open items are deliberate future features (cross-faction sub-model purchases, sub-choice pickers) rather than bugs.',
    contrib: '👷 Want to help? Contributor guides at CONTRIBUTING.md — translation guide, empty file templates, GitHub issue templates. No coding required to contribute data or translations!',
  },
  de: {
    title: 'Entwickler-Update — Alle 19 Fraktionen vollständig geprüft',
    intro: 'Hallo Kommandanten! Jede Fraktion (sowie die Supplements Escalation und Horus Heresy) hat jetzt einen vollständigen Zeile-für-Zeile-ODS-Audit durchlaufen. Der Builder ist für den Listenbau über das gesamte Roster funktionsvollständig.',
    engine: '⚙ Inquisition: die alte modellweise "Ordo Hereticus/Malleus/Xenos"-Rüstkammerwahl entfernt — die kanonischen Regeln hatten sie nie. Ordo-Rüstkammerzugriff kommt jetzt ausschließlich über das Armeeanpassungs-Vermächtnis.',
    csm: '✓ Imperiale Garde: die Archetypen Traitor Guard, Brood Brothers und Gue\'vesa gewähren jetzt tatsächlich ihre Klausel "darf auch die <Fraktion>-Rüstkammer nutzen" — ein eigener Rüstkammer-Tab gibt dauerhaften Zugriff auf die allgemeine Rüstkammer von Chaos Space Marines / Genestealer Cults / Tau Empire, ohne das Einheiten-Roster dieser Fraktion zu öffnen.',
    cd:  '✓ Adeptus Mechanicus: Litaneien des Omnissiah vollständig implementiert — Vermächtnis-Litaneien werden automatisch angewendet, Basis-Litaneien werden als Referenztext auf der Einheitenkarte angezeigt.',
    sm:  '✓ Fraktionsübergreifende Durchsicht: mehrere "Waffentausch"-Optionen behoben, die bei mehrmodelligen Einheiten lautlos kaputt waren (Orks Boyz/Skarboyz, Necrons Immortals/Warriors), eine Einbarkierungs-Lücke bei Adeptus Custodes und ein Rüstungs-Doppelzählungsrisiko bei Horus Heresy.',
    legacyfix: '🗓 Das Known-Issues-Panel spiegelt den aktuellen Stand wider — die meisten verbleibenden offenen Punkte sind bewusst geplante zukünftige Features (fraktionsübergreifende Unter-Modell-Käufe, Unterwahl-Picker), keine Fehler.',
    contrib: '👷 Mitmachen? Anleitungen unter CONTRIBUTING.de.md — Übersetzungsleitfaden, leere Dateivorlagen, GitHub-Issue-Vorlagen. Kein Code nötig!',
  },
  es: {
    title: 'Actualización del desarrollador — Las 19 facciones auditadas al completo',
    intro: '¡Hola comandantes! Todas las facciones (más los suplementos Escalation y Horus Heresy) ya pasaron por una auditoría ODS completa línea a línea. El creador está funcionalmente completo para armar listas en todo el roster.',
    engine: '⚙ Inquisición: se eliminó la vieja elección de Ordo "Hereticus/Malleus/Xenos" por modelo — las reglas canónicas nunca la tuvieron. El acceso a la armería de Ordo ahora viene exclusivamente del Legado de Personalización de Ejército.',
    csm: '✓ Guardia Imperial: los arquetipos Traitor Guard, Brood Brothers y Gue\'vesa ahora sí otorgan su cláusula "también puede usar la Armería de <Facción>" — una pestaña de Armería dedicada da acceso continuo a la armería general de Chaos Space Marines / Genestealer Cults / Tau Empire, sin abrir el roster de unidades de esa facción.',
    cd:  '✓ Adeptus Mechanicus: Cánticos del Omnissiah implementados al completo — los cánticos de Legado se aplican automáticamente, los cánticos base se muestran como texto de referencia en la tarjeta de unidad.',
    sm:  '✓ Repaso entre facciones: arregladas varias opciones de "cambio de arma" que fallaban silenciosamente en escuadras de varios modelos (Orks Boyz/Skarboyz, Necrons Immortals/Warriors), un hueco de restricción de embarque en Adeptus Custodes y un riesgo de doble conteo de armadura en Horus Heresy.',
    legacyfix: '🗓 El panel de Known Issues refleja el estado actual — la mayoría de los puntos abiertos restantes son features futuras deliberadas (compras de sub-modelos entre facciones, selectores de sub-elección), no bugs.',
    contrib: '👷 ¿Quieres ayudar? Guías en CONTRIBUTING.es.md — guía de traducción, plantillas de archivos, plantillas de issues en GitHub. ¡No se necesita programar!',
  },
};

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
        <p><strong className="text-emerald-400">{tx.csm.split(' — ')[0]}</strong> — {tx.csm.split(' — ').slice(1).join(' — ')}</p>
        <p><strong className="text-emerald-400">{tx.cd.split(' — ')[0]}</strong> — {tx.cd.split(' — ').slice(1).join(' — ')}</p>
        <p><strong className="text-emerald-400">{tx.sm.split(' — ')[0]}</strong> — {tx.sm.split(' — ').slice(1).join(' — ')}</p>
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
            <p className="text-zinc-600 text-[10px] italic mt-2 font-cinzel tracking-wide">
              "La victoria no necesita explicación, la derrota no admite excusas."
            </p>
          </div>
          <button
            onClick={() => setShowChangelog(true)}
            className="shrink-0 text-[11px] uppercase tracking-wide border border-zinc-700 hover:border-amber-800 text-zinc-400 hover:text-amber-400 px-3 py-1.5 transition-colors"
          >
            {t('updates')} <span className="text-amber-700">v{latestVersion}</span>
          </button>
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
                      title="Delete save"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                    <span>{save.unitCount} units</span>
                    <span>·</span>
                    <span>{save.totalPts} pts</span>
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
              Army Configuration
            </h2>
            {loading || !data ? (
              <div className="flex items-center gap-3 text-zinc-500 py-8">
                <div className="w-5 h-5 border-2 border-amber-700 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Loading faction data…</span>
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
              Supplements
            </span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>
          <p className="text-zinc-600 text-[11px] mb-4">
            Expansion rule sets that add new units and options to the core game.
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
              <div className="text-[10px] text-red-500/80 uppercase tracking-wide">⚙ Requires: Legion archetype</div>
              <p className="text-zinc-500 text-[12px] leading-snug">
                Legiones Astartes at the dawn of the Heresy. Full unit roster, Legion armory, and psychic disciplines.
              </p>
              <button
                onClick={() => setOpenSupplement('horus_heresy')}
                className="mt-auto w-full text-center text-[11px] uppercase tracking-wide py-1.5 bg-red-900/20 border border-red-900/50 text-red-400 hover:bg-red-900/40 transition-colors"
              >
                View Catalog ▶
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
              <div className="text-[10px] text-amber-500/80 uppercase tracking-wide">⚙ Requires: Epic Battle (4000+ pts)</div>
              <p className="text-zinc-500 text-[12px] leading-snug">
                Super-heavy vehicles, Knights and Titans. Unlocked by the Epic Battle engagement, capped at 33% of points. Available for all factions.
              </p>
              <button
                onClick={() => setOpenSupplement('escalation')}
                className="mt-auto w-full text-center text-[11px] uppercase tracking-wide py-1.5 bg-amber-900/20 border border-amber-900/50 text-amber-400 hover:bg-amber-900/40 transition-colors"
              >
                View Catalog ▶
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
              <div className="text-[10px] text-zinc-500 uppercase tracking-wide">✓ Always available — no activation step</div>
              <p className="text-zinc-500 text-[12px] leading-snug">
                Callidus, Culexus, Eversor, Vindicare. A single Assassin or one of each — counts as a single Elite slot. Granted natively by Demon Hunters / Witch hunters.
              </p>
              <button
                onClick={() => setOpenSupplement('assassins')}
                className="mt-auto w-full text-center text-[11px] uppercase tracking-wide py-1.5 bg-zinc-800/50 border border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition-colors"
              >
                View Catalog ▶
              </button>
            </div>

          </div>
        </section>
      </div>

      <LegalFooter />
    </div>
  );
}
